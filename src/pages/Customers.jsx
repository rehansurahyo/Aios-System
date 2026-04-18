import React, { useState, useEffect } from "react";
import { t } from "../i18n.js";
import { useLanguage } from "../context/LanguageContext";
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
// import { API_BASE, fetchJSON } from "../config/api.js";
const API_BASE = "https://backend-two-orpin-12.vercel.app";
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;
    try {
      const data = await res.json();
      if (data.message) errorMessage = data.message;
      else if (data.error) errorMessage = data.error;
    } catch (e) { }
    throw new Error(errorMessage);
  }
  return res;
};

function Customers({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Stepper State
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic Steps
  const STEPS = [
    { id: 1, label: t(lang, "customer.steps.step1") || "Master Data" },
    { id: 2, label: t(lang, "customer.steps.step2") || "Address" },
    { id: 3, label: t(lang, "customer.steps.step3") || "Communication" },
  ];

  const initialFormState = {
    // Master Data
    salutation: "",
    title: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    personNumber: "",
    skinType: "",
    profileImage: "",
    comment: "",

    // Address
    address: {
      addressType: "Postal Address",
      street: "",
      houseNumber: "",
      zipCode: "",
      city: "",
      country: "Germany",
    },

    // Communication
    communication: {
      phone: "",
      mobile: "",
      email: "",
      isPhoneStandard: false,
      isMobileStandard: false,
      isEmailStandard: false
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `${API_BASE}/api/customers?page=1&limit=50`;
      if (search) url += `&search=${search}`;

      const res = await fetchJSON(url);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : (data.customers || []));
    } catch (err) {
      console.error("Failed to fetch customers", err);
      setError(err.message || "Network Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounced = setTimeout(fetchCustomers, 500);
    return () => clearTimeout(debounced);
  }, [search]);

  // Handlers
  const handleInputChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [name]: val
          }
        };
      }
      return { ...prev, [name]: val };
    });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (section && fieldErrors[`${section}.${name}`]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[`${section}.${name}`];
        return next;
      });
    }

    // Special case: Clear "At least one communication method" error (which is set on email)
    // if ANY communication field is edited
    if (section === "communication") {
      if (fieldErrors["communication.email"] === t(lang, "customers.errors.communicationRequired") ||
        fieldErrors["communication.email"] === "At least one communication method is required") {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next["communication.email"];
          return next;
        });
      }
      // Or just simply clear it if it exists
      if (fieldErrors["communication.email"] && (name === "phone" || name === "mobile" || name === "email")) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next["communication.email"];
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission on early steps (e.g. Enter key)
    if (currentStep !== 3) {
      return;
    }

    const errors = {};
    if (!formData.firstName) errors.firstName = t(lang, "customers.errors.firstNameRequired") || "First Name is required";
    if (!formData.lastName) errors.lastName = t(lang, "customers.errors.lastNameRequired") || "Last Name is required";

    // Communication Validation
    const { phone, mobile, email } = formData.communication;
    if (!phone && !mobile && !email) {
      errors["communication.email"] = t(lang, "customers.errors.communicationRequired") || "At least one communication method is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const url = `${API_BASE}/api/customers`;
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode ? `${url}/${editingId}` : url;

    // Parse DD.MM.YYYY to ISO for backend
    let submissionData = { ...formData };
    if (submissionData.birthDate && submissionData.birthDate.includes(".")) {
      const parts = submissionData.birthDate.split(".");
      if (parts.length === 3 && parts[2].length === 4) {
        // parts format: [DD, MM, YYYY]
        const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        const d = new Date(isoDate);
        if (!isNaN(d.getTime())) {
          submissionData.birthDate = isoDate;
        } else {
          submissionData.birthDate = null; // Clear if invalid
        }
      } else {
        // Clear if format is wrong/incomplete to avoid backend errors
        submissionData.birthDate = null;
      }
    } else if (submissionData.birthDate === "") {
      submissionData.birthDate = null;
    }

    if (submissionData.personNumber === "") {
      submissionData.personNumber = null;
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const contentType = res.headers.get("Content-Type") || "";
      let data = {};
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data.message || data.error || t(lang, "customer.createdError") || "Failed to save customer");
      }

      await fetchCustomers(); // Refresh list
      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t(lang, "customer.confirmDelete") || "Are you sure you want to delete this customer?")) return;
    try {
      await fetch(`${API_BASE}/api/customers/${id}`, { method: "DELETE" });
      setCustomers(customers.filter((c) => c._id !== id));
    } catch (err) {
      setError("Failed to delete");
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      salutation: customer.salutation || "",
      title: customer.title || "",
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      birthDate: customer.birthDate ? new Date(customer.birthDate).toLocaleDateString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric"
      }) : "",
      personNumber: customer.personNumber || "",
      skinType: customer.skinType || "",
      profileImage: customer.profileImage || "",
      comment: customer.comment || "",
      address: {
        addressType: customer.address?.addressType || "Postal Address",
        street: customer.address?.street || "",
        houseNumber: customer.address?.houseNumber || "",
        zipCode: customer.address?.zipCode || "",
        city: customer.address?.city || "",
        country: customer.address?.country || "Germany",
      },
      communication: {
        phone: customer.communication?.phone || "",
        mobile: customer.communication?.mobile || "",
        email: customer.communication?.email || "",
        isPhoneStandard: customer.communication?.isPhoneStandard || false,
        isMobileStandard: customer.communication?.isMobileStandard || false,
        isEmailStandard: customer.communication?.isEmailStandard || false,
      }
    });
    setEditingId(customer._id);
    setEditMode(true);
    setShowCreateForm(true);
    setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowCreateForm(false);
    setEditMode(false);
    setEditingId(null);
    setCurrentStep(1);
  };

  // Navigation Handler
  const handleNext = (e) => {
    e.preventDefault(); // Safety first

    // Step 1 Validation
    if (currentStep === 1) {
      const errors = {};
      if (!formData.firstName) errors.firstName = t(lang, "customers.errors.firstNameRequired") || "First Name is required";
      if (!formData.lastName) errors.lastName = t(lang, "customers.errors.lastNameRequired") || "Last Name is required";

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Size limit removed as per request
      /* if (file.size > 1000000) { // 1MB limit
        setError("File is too large (max 1MB)");
        return;
      } */
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Render Steps
  const renderStepContent = () => {
    const labelClass = isDark ? "block text-sm font-medium text-slate-400 mb-1.5" : "block text-sm font-medium text-slate-700 mb-1.5";

    const getInputClass = (fieldName) => {
      const base = isDark
        ? "w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600"
        : "w-full bg-white border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400 border shadow-sm";

      if (fieldErrors[fieldName]) {
        return `${base} border-rose-500 focus:ring-rose-500/20`;
      }
      return base;
    };

    const ErrorMsg = ({ name }) => {
      if (!fieldErrors[name]) return null;
      return <p className="text-rose-500 text-xs mt-1 animate-fadeIn">{fieldErrors[name]}</p>;
    };

    switch (currentStep) {
      case 1: // Master Data
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.salutation") || "Salutation"}</label>
                <select name="salutation" value={formData.salutation} onChange={handleInputChange} className={getInputClass("salutation")}>
                  <option value="">{t(lang, "customer.selectOption") || "Select..."}</option>
                  <option value="Mr.">{t(lang, "customer.options.mr") || "Mr."}</option>
                  <option value="Mrs.">{t(lang, "customer.options.mrs") || "Mrs."}</option>
                  <option value="Ms.">{t(lang, "customer.options.ms") || "Ms."}</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.title") || "Title"}</label>
                <input name="title" value={formData.title} onChange={handleInputChange} className={getInputClass("title")} />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.firstName") || "First Name"} *</label>
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} className={getInputClass("firstName")} />
                <ErrorMsg name="firstName" />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.lastName") || "Last Name"} *</label>
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} className={getInputClass("lastName")} />
                <ErrorMsg name="lastName" />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.birthDate") || "Date of Birth"}</label>
                <input
                  type="text"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.]/g, "");
                    // Auto-insert dots
                    if (val.length === 2 && !val.includes(".")) val += ".";
                    if (val.length === 5 && val.split(".").length === 2) val += ".";
                    if (val.length > 10) val = val.substring(0, 10);
                    handleInputChange({ target: { name: "birthDate", value: val } });
                  }}
                  placeholder="DD.MM.YYYY"
                  className={getInputClass("birthDate")}
                />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.personNumber") || "Person Number"}</label>
                <input name="personNumber" value={formData.personNumber} onChange={handleInputChange} className={getInputClass("personNumber")} />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.skinType") || "Skin Type"}</label>
                <select name="skinType" value={formData.skinType} onChange={handleInputChange} className={getInputClass("skinType")}>
                  <option value="">{t(lang, "customer.selectOption") || "Select..."}</option>
                  <option value="Type 1">{t(lang, "customer.options.type1") || "Type 1"}</option>
                  <option value="Type 2">{t(lang, "customer.options.type2") || "Type 2"}</option>
                  <option value="Type 3">{t(lang, "customer.options.type3") || "Type 3"}</option>
                  <option value="Type 4">{t(lang, "customer.options.type4") || "Type 4"}</option>
                  <option value="Type 5">{t(lang, "customer.options.type5") || "Type 5"}</option>
                  <option value="Type 6">{t(lang, "customer.options.type6") || "Type 6"}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>{t(lang, "customer.fields.comment") || "Comment"}</label>
                <textarea name="comment" value={formData.comment} onChange={handleInputChange} className={getInputClass("comment")} rows="3" />
              </div>

              {/* Profile Image Upload */}
              <div className="md:col-span-2">
                <label className={labelClass}>{t(lang, "customer.fields.profileImage") || "Profile Image"}</label>
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-100"}`}>
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-slate-400">?</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={`block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:transition-colors cursor-pointer
                        ${isDark
                          ? "file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                          : "file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"}
                      `}
                    />
                    <p className="text-xs text-slate-500 mt-1">{t(lang, "customer.hints.imageUpload") || "Unlimited size. Formats: PNG, JPG."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div >
        );
      case 2: // Address
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <p className={isDark ? "text-slate-400 text-sm mb-4" : "text-slate-600 text-sm mb-4"}>
                {t(lang, "customer.addressHint") || "Here you can enter the postal address required for the membership contract."}
              </p>
              <label className={labelClass}>{t(lang, "customer.fields.addressType") || "Address Type"}</label>
              <select
                name="addressType"
                value={formData.address.addressType}
                onChange={(e) => handleInputChange(e, "address")}
                className={getInputClass("address.addressType")}
              >
                <option value="Postal Address">{t(lang, "customer.options.postal") || "Postal Address"}</option>
                <option value="Billing Address">{t(lang, "customer.options.billing") || "Billing Address"}</option>
              </select>
            </div>
            <div className="grid grid-cols-[1fr_4.5rem] sm:grid-cols-[1fr_6rem] gap-3">
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.street") || "Street"} *</label>
                <input
                  name="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange(e, "address")}
                  className={getInputClass("address.street")}
                  placeholder={t(lang, "customer.placeholders.street") || "Street"}
                />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.placeholders.houseNumber") || "No."}</label>
                <input
                  name="houseNumber"
                  value={formData.address.houseNumber}
                  onChange={(e) => handleInputChange(e, "address")}
                  className={getInputClass("address.houseNumber")}
                  placeholder={t(lang, "customer.placeholders.houseNumber") || "No."}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.zipCode") || "ZIP Code"} *</label>
                <input
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange(e, "address")}
                  className={getInputClass("address.zipCode")}
                />
              </div>
              <div>
                <label className={labelClass}>{t(lang, "customer.fields.city") || "City"} *</label>
                <input
                  name="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange(e, "address")}
                  className={getInputClass("address.city")}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>{t(lang, "customer.fields.country") || "Country"}</label>
                <select
                  name="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange(e, "address")}
                  className={getInputClass("address.country")}
                >
                  <option value="Germany">{t(lang, "customer.options.germany") || "Germany"}</option>
                  <option value="Austria">{t(lang, "customer.options.austria") || "Austria"}</option>
                  <option value="Switzerland">{t(lang, "customer.options.switzerland") || "Switzerland"}</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3: // Communication
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12">
                  <label className={labelClass}>{t(lang, "customer.fields.phone") || "Phone"}</label>
                  <input
                    name="phone"
                    value={formData.communication.phone}
                    onChange={(e) => handleInputChange(e, "communication")}
                    className={getInputClass("communication.phone")}
                  />
                  <ErrorMsg name="communication.phone" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12">
                  <label className={labelClass}>{t(lang, "customer.fields.mobile") || "Mobile"}</label>
                  <input
                    name="mobile"
                    value={formData.communication.mobile}
                    onChange={(e) => handleInputChange(e, "communication")}
                    className={getInputClass("communication.mobile")}
                  />
                  <ErrorMsg name="communication.mobile" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12">
                  <label className={labelClass}>{t(lang, "customer.fields.email") || "Email"}</label>
                  <input
                    name="email"
                    value={formData.communication.email}
                    onChange={(e) => handleInputChange(e, "communication")}
                    className={getInputClass("communication.email")}
                  />
                  <ErrorMsg name="communication.email" />
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} p-4 sm:p-8 transition-colors`}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
              {t(lang, "customers.header.title")}
            </h1>
            <p className={isDark ? "text-slate-400 mt-1" : "text-slate-600 mt-1"}>
              {t(lang, "customers.header.subtitle") || "Manage your customer relationships"}
            </p>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-500/20"
            >
              <FiPlus className="w-5 h-5" />
              <span>{t(lang, "customers.addCustomer") || "Add Customer"}</span>
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showCreateForm ? (
          <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} rounded-2xl border p-6 sm:p-8 shadow-xl animate-scaleIn`}>
            <div className="max-w-4xl mx-auto">
              {/* Stepper Header */}
              <div className="flex items-center justify-between relative mb-12">
                <div className={`absolute top-1/2 left-0 w-full h-0.5 -z-10 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
                {STEPS.map((step, idx) => {
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;

                  return (
                    <div key={step.id} className={`flex flex-col items-center px-2 sm:px-4 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${isActive ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                          isCompleted ? "bg-emerald-900 text-emerald-400 border border-emerald-800" :
                            (isDark ? "bg-slate-800 text-slate-500 border border-slate-700" : "bg-white text-slate-400 border border-slate-300")
                          }`}
                      >
                        {isCompleted ? <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : step.id}
                      </div>
                      <span className={`mt-2 sm:mt-3 text-[10px] sm:text-sm font-medium transition-colors text-center ${isActive ? (isDark ? "text-white" : "text-slate-900") :
                        "text-slate-500"
                        }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="min-h-[400px]">
                  {renderStepContent()}
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1) resetForm();
                      else setCurrentStep(prev => prev - 1);
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    {currentStep === 1 ? (t(lang, "customer.cancel") || "Cancel") : <><FiChevronLeft /> {t(lang, "customer.back") || "Back"}</>}
                  </button>

                  {/* Next / Submit Button */}
                  {/* We strictly separate buttons to ensure 'submit' only exists on the final step */}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-500/20"
                    >
                      {t(lang, "customer.next") || "Next"} <FiChevronRight />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 ${isSubmitting && "cursor-wait"}`}
                    >
                      {isSubmitting
                        ? (t(lang, "customer.creating") || "Saving...")
                        : (editMode ? (t(lang, "customer.create") || "Update Customer") : (t(lang, "customer.create") || "Create Customer"))}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={t(lang, "customers.searchPlaceholder") || "Search customers by name, email..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"} pl-11 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-500/20 outline-none transition`}
              />
            </div>

            {/* Customers List (Full Width) */}
            {error ? (
              <div className="text-center py-12">
                <p className="text-rose-400 mb-2">{error}</p>
                <button
                  onClick={fetchCustomers}
                  className="text-xs bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20"
                >
                  {t(lang, "common.retry") || "Retry"}
                </button>
              </div>
            ) : loading ? (
              <div className="text-center py-12 text-slate-500">{t(lang, "customers.states.loading") || "Loading customers..."}</div>
            ) : customers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {search ? (t(lang, "customers.states.noResults") || "No customers found for your search.") : (t(lang, "customers.states.empty") || "No customers in database.")}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {customers.map((customer) => {
                  const contactDisplay = customer.communication?.email ||
                    customer.communication?.mobile ||
                    customer.communication?.phone ||
                    customer.email ||
                    (t(lang, "customers.fields.noContact") || "No contact info");

                  return (
                    <div
                      key={customer._id}
                      className={`group relative p-5 rounded-xl border transition hover:shadow-lg ${isDark ? "bg-slate-900 border-slate-800 hover:border-emerald-500/30" : "bg-white border-slate-200 hover:border-emerald-500/30"
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden font-bold text-lg text-emerald-500 bg-emerald-500/10`}>
                            {customer.profileImage ? (
                              <img src={customer.profileImage} alt={customer.firstName} className="w-full h-full object-cover" />
                            ) : (
                              (customer.firstName?.[0] || customer.name?.[0] || "?").toUpperCase()
                            )}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-lg flex items-center gap-2 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                              {customer.firstName ? `${customer.firstName} ${customer.lastName}` : customer.name}
                              {customer.personNumber && <span className="text-xs font-normal opacity-50">#{customer.personNumber}</span>}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <p className="text-sm text-slate-500">{contactDisplay}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-500/10">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${customer.tag === "VIP" ? "bg-purple-500/10 text-purple-400" :
                              customer.tag === "Blocked" ? "bg-rose-500/10 text-rose-400" :
                                "bg-emerald-500/10 text-emerald-400"
                              }`}>
                              {customer.tag || "New"}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(customer)}
                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition"
                                title={t(lang, "btn.edit") || "Edit"}
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(customer._id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                                title={t(lang, "btn.delete") || "Delete"}
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {customer.lastVisit && (
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                              {t(lang, "customers.fields.lastVisit") || "Last visit"}: {formatDate(customer.lastVisit)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {!loading && customers.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    {t(lang, "customers.states.empty") || "No customers found. Create one to get started."}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;