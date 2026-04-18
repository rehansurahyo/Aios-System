// src/pages/Cabins.jsx
import React, { useEffect, useState } from "react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMonitor,
  FiWifi,
  FiCpu,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiSave,
  FiImage,
  FiSearch,
  FiFilter,
  FiCamera,
  FiMoreHorizontal,
  FiSettings,
  FiTool,
  FiFileText,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiRefreshCw,
  FiUploadCloud
} from "react-icons/fi";

const DEFAULT_DEVICE_TYPES = [
  "ALLIN-Erwachsene",
  "ALLIN-Gruppen",
  "ALLIN-Kinder",
  "ALPHACOOLING",
  "AQUABIKES",
  "Badelandschaft",
  "BEAUTYLIGHT",
  "BODY BEWEI",
  "BODYFORMER",
  "BODYFORMER PELVIC",
  "BODYGEE",
  "BODYSCAN",
  "BODYSTYLER",
  "BODYSTYLER 8x/Mo",
  "BODYSTYLER_PLUS",
  "COLLAGEN",
  "CRYO",
  "DIVINIA",
  "ELT",
  "EM SLIM",
  "EMS",
  "ENTRYO",
  "Full-LED",
  "GALILEO",
  "Hose BEWEI",
  "HYPOXI",
  "ICECUBE",
  "Kosmetische Bräunungsdusche",
  "Lichttherapie",
  "Lymphdrainage",
  "Magnetfeld",
  "Massage",
  "Pura",
  "Slimyonik",
  "Solo-Sauna-Gruppen",
  "Solo-Sauna-Kinder",
  "Solarium",
  "Sonnenengel",
  "Sun Angel",
  "SUNLIGHT",
  "TREADMILL",
  "UNKNOWN",
  "Vacustyler",
  "Wasserspaß-Gruppen",
  "Wasserspaß-Kinder",
  "Wellsystem",
  "WELLSYSTEM",
  "ZIRKEL",
  "Überwasser-Massage"
];

// Steps for the Wizard
const STEPS = [
  { id: "data", icon: FiMonitor },
  { id: "controller", icon: FiSettings },
  { id: "maintenance", icon: FiTool },
  { id: "program", icon: FiCpu },
  { id: "confirm", icon: FiCheckCircle },
];

export default function Cabins({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore-backed Master Lists
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [newDeviceType, setNewDeviceType] = useState("");

  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [newMaintType, setNewMaintType] = useState({ name: "", duration: 0 });

  // Real-time Firestore Sync for Master Data
  useEffect(() => {
    // Sync Device Types
    const unsubTypes = onSnapshot(collection(db, "device_types"), (snap) => {
      setDeviceTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, error => console.error(error));

    // Sync Maintenance Types
    const unsubMaint = onSnapshot(collection(db, "maintenance_types"), (snap) => {
      setMaintenanceTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, error => console.error(error));

    return () => {
      unsubTypes();
      unsubMaint();
    };
  }, []);


  // Modal / Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [currentTab, setCurrentTab] = useState("overview");
  const [view, setView] = useState("dashboard"); // dashboard | management

  // Modal States
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleTab, setArticleTab] = useState("stammdaten"); // stammdaten | preise
  const [isPriceEditing, setIsPriceEditing] = useState(false);

  const initialArticleFormState = {
    organization: "Sonnenstudio Suntime No.1 (SUNNE0542)",
    revenueAccount: "8400 (Umatzerlöse (Studio) 19%)", // Dropdown
    taxType: "USt Regelstatz (DE) (MwSt: 19%)", // Dropdown
    productGroup: "Sonstige",
    articleName: "",
    articleNo: "",
    description: "",
    barcode: "",
    // Special Options
    securityLevel: 0,
    unit: "Zeit", // Zeit | Stückzahl
    freePricing: false,
    maxPrice: "39,00 €",
    allowNegativePrice: false,
    hideArticle: false,
    hideAmounts: false,
    stockable: false,
    specialFunction: "Aktiviert ein Gerät",
    staticRevenue: false,
    requiredFile: false,
    validFrom: "2025-04-14",
    validTo: "2100-12-31",
    // Discount
    generalDiscount: 0,
    manualDiscount: false
  };

  const [articleFormData, setArticleFormData] = useState(initialArticleFormState);

  // Filters
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  // New Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, FREE, RUNNING, CLEANING, ERROR, MAINTENANCE

  // Form State
  const initialFormState = {
    name: "",
    code: "", // internal ID/Code
    deviceType: "",
    manufacturer: "",
    deviceNumber: "",
    description: "",
    // Power Stats
    powerKw: "0",
    powerJoule: "0",
    uvStrength: 0,
    // Status
    status: "free",
    maintenance: false,
    // Technical / Controller
    ipAddress: "",
    macAddress: "",
    controllerType: "Dummy", // Default 
    localPort: "",
    // Image
    imageUrl: "",
    // Toggles
    allowCalendar: false,
    allowWebCalendar: false,
    allowApp: false,
    hideDevice: false,
    inOperation: true,
    selfService: false,
    showOnMonitor: true,
    infoText: "",
    // Maintenance
    autoClean: false,
    cleanDuration: 3,
    // Program Settings
    programSettings: {
      preset: "standard", // standard, sensitive, intensive, custom
      intensity: 100,
      fanSpeed: 50,
      targetTemp: 22,
      options: {
        faceTanner: true,
        aroma: false,
        aquaMist: false,
        airCon: true,
        voiceGuide: false
      }
    },
    // New Fields for Wizard Overhaul
    externalPort: "",
    postRunTime: 3,
    preRunTime: 3,
    assignedMaintenance: [], // Array of { id, name, interval, remaining }
    assignedPrograms: [] // Array of { id, name }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Real-time Firestore Sync
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "devices"),
      (snapshot) => {
        const deviceList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevices(deviceList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching devices:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleOpenModal = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setFormData({ ...initialFormState, ...device });
    } else {
      setEditingDevice(null);
      setFormData(initialFormState);
    }
    setActiveStep(0);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDevice(null);
    setFormData(initialFormState);
    setActiveStep(0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Just in case
    setSaving(true);

    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const fileRef = ref(storage, `device-images/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = { ...formData, imageUrl: finalImageUrl };

      if (editingDevice) {
        const docRef = doc(db, "devices", editingDevice.id);
        await updateDoc(docRef, dataToSave);
      } else {
        await addDoc(collection(db, "devices"), dataToSave);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving device:", err);
      alert(t(lang, "cabins.errors.generic"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t(lang, "cabins.form.confirmDelete"))) return;
    try {
      await deleteDoc(doc(db, "devices", id));
    } catch (err) {
      alert(t(lang, "cabins.errors.delete"));
    }
  };

  // --- CRUD for Device Types ---
  const handleAddDeviceType = async () => {
    if (!newDeviceType.trim()) return;
    try {
      await addDoc(collection(db, "device_types"), {
        name: newDeviceType.trim(),
        createdAt: Date.now()
      });
      setNewDeviceType("");
    } catch (err) {
      console.error("Error adding type", err);
    }
  };

  const handleDeleteDeviceType = async (id, name) => {
    if (!window.confirm(t(lang, "cabins.types.deleteConfirm").replace("{type}", name))) return;
    try {
      await deleteDoc(doc(db, "device_types", id));
    } catch (err) {
      console.error("Error deleting type", err);
    }
  };

  // --- CRUD for Maintenance Types ---
  const handleAddMaintenanceType = async () => {
    if (!newMaintType.name.trim()) return;
    try {
      await addDoc(collection(db, "maintenance_types"), {
        name: newMaintType.name.trim(),
        duration: newMaintType.duration || 0,
        createdAt: Date.now()
      });
      setNewMaintType({ name: "", duration: 0 });
    } catch (err) {
      console.error("Error adding maint type", err);
    }
  };

  const handleDeleteMaintenanceType = async (id) => {
    if (!window.confirm(t(lang, "cabins.maintenance.deleteConfirm"))) return;
    try {
      await deleteDoc(doc(db, "maintenance_types", id));
    } catch (err) {
      console.error("Error deleting maint type", err);
    }
  };

  // --- Gallery Upload Handler ---
  const handleGalleryUpload = async (device, file) => {
    if (!file) return;
    try {
      // 1. Upload
      const toastId = `upload-${device.id}`; // Simple ID for console logging
      console.log("Uploading image for", device.name);

      const fileRef = ref(storage, `device-images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // 2. Update Device
      await updateDoc(doc(db, "devices", device.id), {
        imageUrl: url
      });

      console.log("Image updated successfully");
    } catch (err) {
      console.error("Gallery upload failed", err);
      alert(t(lang, "cabins.errors.generic"));
    }
  };

  // --- Search & Filter Logic ---
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();

    // 1. Overview Tab: Filter Devices
    if (currentTab === "overview") {
      return devices.filter(d => {
        const matchesSearch = (d.name?.toLowerCase().includes(q) || d.manufacturer?.toLowerCase().includes(q));
        const matchesHidden = showHidden || !d.hideDevice;

        // Status Filter
        let matchesStatus = true;
        if (filterStatus !== "ALL") {
          if (filterStatus === "MAINTENANCE") matchesStatus = d.maintenance || d.status === "maintenance";
          else if (filterStatus === "FREE") matchesStatus = d.status === "free" || !d.status;
          else matchesStatus = d.status === filterStatus.toLowerCase();
        }

        return matchesSearch && matchesHidden && matchesStatus;
      });
    }

    // 2. Types Tab: Filter Device Types
    if (currentTab === "types") {
      return deviceTypes.filter(t => t.name.toLowerCase().includes(q));
    }

    // 3. Controller Tab: Filter Devices (Tech Fields)
    if (currentTab === "controller") {
      return devices.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.ipAddress?.includes(q) ||
        d.macAddress?.toLowerCase().includes(q)
      );
    }

    // 4. Maintenance Tab: Filter Maintenance Types
    if (currentTab === "maintenance") {
      return maintenanceTypes.filter(m => m.name.toLowerCase().includes(q));
    }

    return [];
  };

  const filteredData = getFilteredData();

  // Wizard Navigation
  const nextStep = () => {
    // Validation for Step 0
    if (activeStep === 0) {
      if (!formData.name || !formData.deviceNumber || !formData.deviceType) {
        // You might want to trigger a "touched" state here to show errors if not already visible
        // For now, the UI shows errors based on empty values, which matches the screenshot "Red State"
        return;
      }
    }
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };
  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  // --- Render Helpers ---

  // Status Badge
  const getStatusBadge = (device) => {
    const { status, maintenance } = device;
    // Simple mapping
    if (maintenance) return <span className="text-violet-500 font-bold flex items-center gap-1"><FiTool /> {t(lang, "cabins.status.maintenance")}</span>;
    if (status === "running") return <span className="text-amber-500 font-bold flex items-center gap-1"><FiCpu /> {t(lang, "cabins.status.running")}</span>;
    if (status === "cleaning") return <span className="text-cyan-500 font-bold flex items-center gap-1"><FiRefreshCw /> {t(lang, "cabins.status.cleaning")}</span>;
    if (status === "error") return <span className="text-red-500 font-bold flex items-center gap-1"><FiAlertCircle /> {t(lang, "cabins.status.error")}</span>;
    return <span className="text-emerald-500 font-bold flex items-center gap-1"><FiCheckCircle /> {t(lang, "cabins.status.free")}</span>;
  };

  // Styles
  const wrapperClass = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
  const cardClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const headerClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const inputClass = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-emerald-500"
    : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500";

  return (
    <div className={`h-full flex flex-col ${wrapperClass}`}>
      {view === "dashboard" ? (
        <div className="flex-1 p-8 animate-fadeIn">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">{t(lang, "cabins.header.title")}</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-10">
            {/* Card 1: Mgmt */}
            <div className={`rounded-xl border p-8 flex flex-col items-center text-center gap-6 shadow-sm hover:shadow-md transition-all ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-slate-500 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                <FiFileText className="text-3xl" />
              </div>
              <div className="space-y-2">
                <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed">
                  {t(lang, "cabins.dashboardMgmtDesc")}
                </p>
              </div>
              <button onClick={() => setView("management")} className={`w-full py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-all text-white ${isDark ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : "bg-slate-800 hover:bg-slate-900 shadow-slate-500/20"}`}>
                {t(lang, "cabins.dashboardMgmtBtn")}
              </button>
            </div>

            {/* Card 2: Gallery */}
            <div className={`rounded-xl border p-8 flex flex-col items-center text-center gap-6 shadow-sm relative overflow-hidden transition-all hover:shadow-md ${isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"}`}>
              {/* <div className="absolute top-4 right-4 text-red-500">
                <FiFileText className="text-lg" />
              </div> */}
              {/* Removed "Not Implemented" icon */}

              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-slate-500 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                <FiImage className="text-3xl" />
              </div>
              <div className="space-y-2">
                <p className="text-sm opacity-70 max-w-xs mx-auto leading-relaxed">
                  {t(lang, "cabins.dashboardGalleryDesc")}
                </p>
              </div>
              <button
                onClick={() => setView("gallery")}
                className={`w-full py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-all text-white ${isDark ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : "bg-slate-800 hover:bg-slate-900 shadow-slate-500/20"}`}
              >
                {t(lang, "cabins.dashboardGalleryBtn")}
              </button>
            </div>
          </div>
        </div>
      ) : view === "gallery" ? (
        <div className="flex flex-col h-full animate-fadeIn">
          {/* Gallery Header */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b gap-4 ${headerClass}`}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t(lang, "cabins.dashboardGalleryTitle") || "Device Gallery"}</h1>
              <p className="text-sm opacity-60 mt-1 max-w-2xl">{t(lang, "cabins.dashboardGalleryDesc")}</p>
            </div>
            <button
              onClick={() => setView("dashboard")}
              className="bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 hover:bg-slate-700"
            >
              <FiChevronLeft /> {t(lang, "cabins.actions.back")}
            </button>
          </div>

          {/* Gallery Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="opacity-50">{t(lang, "cabins.list.loading")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {devices.map(device => (
                  <div key={device.id} className={`rounded-xl border overflow-hidden flex flex-col group ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                    {/* Image Area */}
                    <div className={`aspect-video relative overflow-hidden flex items-center justify-center ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>
                      {device.imageUrl ? (
                        <img src={device.imageUrl} alt={device.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <FiImage className="text-4xl" />
                          <span className="text-xs font-bold uppercase">No Image</span>
                        </div>
                      )}

                      {/* Overlay Upload Button */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                          <FiCamera /> Change Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleGalleryUpload(device, e.target.files[0]);
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{device.name}</h3>
                        <p className="text-xs opacity-60 uppercase font-bold tracking-wider">{device.deviceType || "Unknown Type"}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${device.imageUrl ? "bg-green-500" : "bg-slate-500"}`}>
                        {device.imageUrl ? <FiCheck /> : "!"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className={`flex flex-col border-b ${headerClass}`}>
            {/* Top Row: Title & Global Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 pb-2 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t(lang, "cabins.header.title")}</h1>
                <p className="text-sm opacity-60 mt-1 max-w-2xl">{t(lang, "cabins.header.subtitle")}</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                {/* 
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                  <FiRefreshCw /> {t(lang, "cabins.actions.restartController")}
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2">
                  <FiRefreshCw /> {t(lang, "cabins.actions.restartPeripheral")}
                </button>
                */}
                <button
                  onClick={() => setView("dashboard")} // Back to Dashboard
                  className="bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2"
                >
                  <FiChevronLeft /> {t(lang, "cabins.actions.back")}
                </button>
              </div>
            </div>

            {/* Middle Row: Navigation Tabs */}
            <div className="px-6 mt-4">
              <div className="flex items-center gap-8 border-b border-slate-700/20 overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "cabins.tabs.overview", icon: FiMonitor },
                  { id: "types", label: "cabins.tabs.types", icon: FiCheckCircle },
                  { id: "controller", label: "cabins.tabs.controller", icon: FiCpu },
                  { id: "maintenance", label: "cabins.tabs.maintenance", icon: FiTool },

                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`group flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${currentTab === tab.id
                      ? isDark ? "text-white" : "text-slate-900"
                      : "text-slate-500 hover:text-slate-400"
                      }`}
                  >
                    <tab.icon className={`text-lg ${currentTab === tab.id ? "text-blue-500" : "opacity-50 group-hover:opacity-100"}`} />
                    <span className="whitespace-nowrap">{t(lang, tab.label)}</span>
                    {currentTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Controls & Filters */}
            <div className="p-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-slate-200 dark:border-slate-800">
              {/* Reports & Toggles */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">


                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium opacity-80 hover:opacity-100">
                  <input type="checkbox" checked={showHidden} onChange={e => setShowHidden(e.target.checked)} className="rounded border-slate-600 text-blue-500 focus:ring-offset-0 focus:ring-0" />
                  <span>{t(lang, "cabins.actions.showHidden")}</span>
                </label>
              </div>

              {/* Search & Add */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
                {/* Filter Dropdown */}
                <div className="relative group">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500" : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"}`}
                  >
                    <FiFilter className="text-slate-400" />
                    <span>{filterStatus === "ALL" ? t(lang, "cabins.actions.filterAll") : filterStatus}</span>
                    <FiChevronRight className={`rotate-90 text-xs opacity-50 transition-transform ${isFilterOpen ? "-rotate-90" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                      <div className={`absolute top-full mt-2 left-0 w-48 rounded-lg shadow-xl border z-20 py-1 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                        {["ALL", "FREE", "RUNNING", "CLEANING", "ERROR", "MAINTENANCE"].map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-500/10 ${filterStatus === status ? "font-bold text-blue-500" : ""}`}
                          >
                            {status === "ALL" ? t(lang, "cabins.actions.filterAll") : status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="relative flex-1 md:w-64 group">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-blue-500 transition-all" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t(lang, "cabins.actions.searchPlaceholder")}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border outline-none transition-all ${inputClass}`}
                  />
                </div>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <FiPlus className="text-lg" /> {t(lang, "cabins.actions.newDevice")}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-6">

            {/* TAB: OVERVIEW */}
            {currentTab === "overview" && (
              <div className={`rounded-lg border overflow-x-auto ${cardClass} animate-fadeIn`}>
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className={`text-xs uppercase font-semibold border-b ${isDark ? "bg-slate-900/50 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                    <tr>
                      <th className="px-6 py-3">{t(lang, "cabins.table.name")}</th>
                      <th className="px-6 py-3 hidden md:table-cell">{t(lang, "cabins.table.type")}</th>
                      <th className="px-6 py-3 hidden lg:table-cell">{t(lang, "cabins.table.controller")}</th>
                      <th className="px-6 py-3">{t(lang, "cabins.table.deviceStatus")}</th>
                      <th className="px-6 py-3 hidden xl:table-cell">{t(lang, "cabins.table.articleVisible")}</th>
                      <th className="px-6 py-3 hidden md:table-cell">{t(lang, "cabins.table.status")}</th>
                      <th className="px-6 py-3 hidden xl:table-cell">{t(lang, "cabins.table.maintenanceStatus")}</th>
                      <th className="px-6 py-3 text-right">{t(lang, "btn.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {filteredData.map((device) => (
                      <tr key={device.id} className={`hover:bg-slate-500/5 transition-colors ${device.hideDevice ? "opacity-60" : ""}`}>
                        <td className="px-6 py-4 font-medium">
                          <div className="flex flex-col">
                            <span className="text-base">{device.name}</span>
                            <span className="text-xs opacity-50">{device.manufacturer}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className={`px-2 py-1 rounded text-xs ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                            {device.deviceType || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex flex-col">
                            <span>{device.controllerType || "Dummy"}</span>
                            <span className="text-xs opacity-50">Port: {device.localPort || "-"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(device)}
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {device.hideDevice ? t(lang, "options.no") : t(lang, "options.yes")}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <FiCheckCircle className="text-emerald-500" />
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell">
                          {/* Maintenance Status Placeholder */}
                          <span className="opacity-50">-</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenModal(device)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(device.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center opacity-50">
                          {t(lang, "cabins.list.empty")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: DEVICE TYPES */}
            {currentTab === "types" && (
              <div className="animate-fadeIn space-y-4">
                <div className={`flex flex-col md:flex-row justify-between items-center rounded-lg p-4 border gap-4 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
                  <div className="w-full md:w-auto">
                    <h2 className="text-lg font-bold">{t(lang, "cabins.types.title")}</h2>
                    <p className="text-xs opacity-60">{t(lang, "cabins.types.subtitle")}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <input
                      value={newDeviceType}
                      onChange={e => setNewDeviceType(e.target.value)}
                      placeholder={t(lang, "cabins.types.placeholder")}
                      className={`px-3 py-1.5 rounded text-sm border ${inputClass} w-full`}
                    />
                    <button
                      onClick={handleAddDeviceType}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded text-sm font-bold whitespace-nowrap"
                    >
                      {t(lang, "cabins.types.add")}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredData.map(type => (
                    <div key={type.id} className={`p-4 rounded border flex items-center justify-between group ${cardClass}`}>
                      <span className="text-sm font-medium truncate" title={type.name}>{type.name}</span>
                      <button
                        onClick={() => handleDeleteDeviceType(type.id, type.name)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CONTROLLER */}
            {currentTab === "controller" && (
              <div className={`rounded-lg border overflow-x-auto animate-fadeIn ${cardClass}`}>
                <div className="p-4 border-b flex justify-between items-center sticky left-0">
                  <div>
                    <h2 className="font-bold">{t(lang, "cabins.controller.title")}</h2>
                    <p className="text-xs opacity-60">{t(lang, "cabins.controller.subtitle")}</p>
                  </div>
                  <button onClick={() => setCurrentTab('overview')} className="text-sm text-blue-500 hover:underline">{t(lang, "cabins.controller.viewAll")}</button>
                </div>
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className={`text-xs uppercase font-bold border-b ${isDark ? "bg-slate-900/50 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                    <tr>
                      <th className="px-6 py-3">{t(lang, "cabins.table.name")}</th>
                      <th className="px-6 py-3">{t(lang, "cabins.controller.controllerType")}</th>
                      <th className="px-6 py-3 hidden md:table-cell">{t(lang, "cabins.form.ipAddress")}</th>
                      <th className="px-6 py-3 hidden lg:table-cell">{t(lang, "cabins.form.macAddress")}</th>
                      <th className="px-6 py-3 hidden xl:table-cell">{t(lang, "cabins.form.localPort")}</th>
                      <th className="px-6 py-3 text-right">{t(lang, "btn.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {filteredData.map(dev => (
                      <tr key={dev.id} className="hover:bg-slate-500/5">
                        <td className="px-6 py-4 font-bold">{dev.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs border ${dev.controllerType === "TMAX" ? "border-blue-500 text-blue-500" : "border-slate-400 opacity-70"}`}>
                            {dev.controllerType || "Dummy"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs hidden md:table-cell">{dev.ipAddress || "-"}</td>
                        <td className="px-6 py-4 font-mono text-xs hidden lg:table-cell">{dev.macAddress || "-"}</td>
                        <td className="px-6 py-4 hidden xl:table-cell">{dev.localPort || "-"}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              handleOpenModal(dev);
                              setActiveStep(1); // Jump to Controller step
                            }}
                            className="text-blue-500 hover:text-blue-600 font-medium text-xs border border-blue-500/30 px-3 py-1 rounded hover:bg-blue-500/10"
                          >
                            {t(lang, "btn.edit")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: MAINTENANCE TYPES */}
            {currentTab === "maintenance" && (
              <div className="animate-fadeIn space-y-6">

                {/* Type Management Section */}
                <div className={`p-6 rounded-xl border space-y-4 ${cardClass}`}>
                  <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <h3 className="font-bold text-lg">{t(lang, "cabins.maintenance.title")}</h3>
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-end">
                      <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-[10px] uppercase font-bold opacity-60">{t(lang, "cabins.maintenance.fieldName")}</label>
                        <input
                          value={newMaintType.name}
                          onChange={e => setNewMaintType({ ...newMaintType, name: e.target.value })}
                          className={`px-3 py-1.5 rounded text-sm border ${inputClass} w-full`}
                          placeholder={t(lang, "cabins.maintenance.placeholderName")}
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full md:w-24">
                        <label className="text-[10px] uppercase font-bold opacity-60">{t(lang, "cabins.maintenance.fieldDuration")}</label>
                        <input
                          type="number"
                          value={newMaintType.duration}
                          onChange={e => setNewMaintType({ ...newMaintType, duration: parseInt(e.target.value) })}
                          className={`px-3 py-1.5 rounded text-sm border ${inputClass} w-full`}
                        />
                      </div>
                      <button
                        onClick={handleAddMaintenanceType}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold h-[34px] w-full md:w-auto"
                      >
                        {t(lang, "cabins.maintenance.add")}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map(m => (
                      <div key={m.id} className={`flex justify-between items-center p-3 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                        <div>
                          <div className="font-bold text-sm">{m.name}</div>
                          <div className="text-xs opacity-60">{m.duration > 0 ? t(lang, "cabins.maintenance.durationFormat").replace("{duration}", m.duration) : t(lang, "cabins.maintenance.noDuration")}</div>
                        </div>
                        <button onClick={() => handleDeleteMaintenanceType(m.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded"><FiTrash2 /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


          </div>
        </>
      )
      }

      {/* WIZARD MDOAL */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`w-full max-w-5xl h-[90vh] md:h-[75vh] flex flex-col rounded-xl shadow-2xl overflow-hidden ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
              {/* 1. Header (Steps) */}
              <div className="p-4 border-b border-slate-700/20">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{editingDevice ? t(lang, "cabins.form.editTitle") : t(lang, "cabins.form.addTitle")}</h2>
                    <button onClick={handleCloseModal} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
                      {t(lang, "btn.cancel")}
                    </button>
                  </div>
                  {/* Stepper */}
                  <div className="flex items-center justify-between px-2 md:px-10 relative">
                    {/* Line */}
                    <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-slate-300 -z-0"></div>
                    <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-blue-500 -z-0 transition-all duration-300" style={{ width: `${(activeStep / (STEPS.length - 1)) * 100}%` }}></div>

                    {STEPS.map((step, index) => {
                      const isActive = index === activeStep;
                      const isCompleted = index < activeStep;
                      return (
                        <div key={step.id} className={`relative z-10 flex flex-col items-center gap-1 px-2 transition-all ${isDark ? "bg-slate-900" : "bg-white"}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? "border-blue-500 text-blue-500 scale-110" :
                            isCompleted ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 text-slate-400"
                            }`}>
                            <step.icon className="text-sm" />
                          </div>
                          <span className={`text-[10px] font-bold ${isActive || isCompleted ? "text-blue-500" : "text-slate-400"}`}>
                            {t(lang, `cabins.wizard.steps.${step.id}`)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">

                {/* STEP 0: MASTER DATA */}
                {activeStep === 0 && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Grundlegende Details */}
                    <div className="space-y-4">
                      <h3 className="font-bold border-b pb-2 text-sm uppercase tracking-wider opacity-70">{t(lang, "cabins.wizard.basics")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* Left: Image Upload */}
                        <div className="md:col-span-4 lg:col-span-3">
                          <div className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden group transition-all ${isDark ? "border-slate-700 bg-slate-800/50 hover:border-slate-600" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}>
                            {formData.imageUrl ? (
                              <img src={formData.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center p-4 opacity-40 group-hover:opacity-60 transition-opacity">
                                <FiImage className="text-4xl mx-auto mb-2" />
                                <span className="text-xs font-bold uppercase tracking-wide block">{t(lang, "cabin.noImage")}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <label className="cursor-pointer p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg">
                                <input type="file" className="hidden" accept="image/*" onChange={e => {
                                  if (e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                    setFormData(p => ({ ...p, imageUrl: URL.createObjectURL(e.target.files[0]) }));
                                  }
                                }} />
                                <FiUploadCloud className="text-lg" />
                              </label>
                              {formData.imageUrl && (
                                <button onClick={() => setFormData(p => ({ ...p, imageUrl: "" }))} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 shadow-lg transition-transform">
                                  <FiTrash2 className="text-lg" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Form Fields */}
                        <div className="md:col-span-8 lg:col-span-9 space-y-4">

                          {/* Manufacturer */}
                          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
                            <label className="text-sm font-medium text-slate-500">{t(lang, "cabins.wizard.manufacturer")}</label>
                            <div className="md:col-span-2">
                              <input
                                name="manufacturer"
                                value={formData.manufacturer}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${inputClass}`}
                                placeholder={t(lang, "cabins.wizard.enterManufacturer")}
                              />
                            </div>
                          </div>

                          {/* Device Name */}
                          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
                            <label className="text-sm font-medium text-slate-500">{t(lang, "cabins.wizard.deviceName")}</label>
                            <div className="md:col-span-2">
                              <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${!formData.name ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                                placeholder={t(lang, "cabins.wizard.enterName")}
                              />
                              {!formData.name && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired")}</p>}
                            </div>
                          </div>

                          {/* Device Number */}
                          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
                            <label className="text-sm font-medium text-slate-500">{t(lang, "cabins.wizard.deviceNumber")}</label>
                            <div className="md:col-span-2">
                              <input
                                name="deviceNumber"
                                value={formData.deviceNumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${!formData.deviceNumber ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                                placeholder={t(lang, "cabins.wizard.enterNumber")}
                              />
                              {!formData.deviceNumber && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired")}</p>}
                            </div>
                          </div>

                          {/* Device Type */}
                          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 md:gap-4">
                            <label className="text-sm font-medium text-slate-500">{t(lang, "cabins.wizard.deviceType")}</label>
                            <div className="md:col-span-2">
                              <select
                                name="deviceType"
                                value={formData.deviceType}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer ${!formData.deviceType ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                              >
                                <option value="">{t(lang, "cabins.wizard.selectType")}</option>
                                {deviceTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                              </select>
                              {!formData.deviceType && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired")}</p>}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-2 md:gap-4">
                            <label className="text-sm font-medium text-slate-500 mt-2">{t(lang, "cabins.wizard.description")}</label>
                            <div className="md:col-span-2">
                              <textarea
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/20 outline-none transition-all ${inputClass}`}
                                placeholder={t(lang, "cabins.wizard.enterDescription")}
                              />
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* Bräunungsstärke Section */}
                    <div className="space-y-4">
                      {/* Direct fallback to ensure text shows */}
                      <h3 className="font-bold border-b pb-2 text-sm uppercase tracking-wider opacity-70">{t(lang, "cabins.wizard.powerTitle") || "Bräunungsstärke"}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase opacity-60">{t(lang, "cabins.wizard.kw")}</label>
                          <input
                            type="number"
                            name="powerKw"
                            value={formData.powerKw}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm ${inputClass}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase opacity-60">{t(lang, "cabins.wizard.joule")}</label>
                          <input
                            type="number"
                            name="powerJoule"
                            value={formData.powerJoule}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg border text-sm ${inputClass}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase opacity-60">{t(lang, "cabins.wizard.uvStrength") || "UV-Stärke"}</label>
                          <div className="flex gap-1 items-center h-[42px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setFormData(p => ({ ...p, uvStrength: star }))}
                                className={`text-2xl transition-transform hover:scale-110 ${star <= formData.uvStrength ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>


                  </div>
                )}

                {/* STEP 1: CONTROLLER */}
                {activeStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="mb-2">
                      <h3 className="font-bold text-sm">{t(lang, "cabins.controller.title")}</h3>
                    </div>

                    <div className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"} border rounded-lg p-6 space-y-4`}>

                      {/* Controller ID */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.form.controllerType")}</label>
                        <div className="col-span-9">
                          <select name="controllerType" value={formData.controllerType} onChange={handleChange} className={`w-full px-3 py-2 rounded-lg text-sm border ${inputClass}`}>
                            <option value="Dummy">Dummy BodyFormer Stuhl</option>
                            <option value="CTS 01">CTS 01</option>
                            <option value="CTS 02">CTS 02</option>
                            <option value="TMAX">TMAX</option>
                          </select>
                        </div>
                      </div>

                      {/* Local Port */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.form.localPort")}</label>
                        <div className="col-span-9">
                          <input
                            name="localPort"
                            value={formData.localPort}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg text-sm border ${!formData.localPort ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                            type="number"
                          />
                          {!formData.localPort && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired") || "Dieses Feld wird benötigt"}</p>}
                        </div>
                      </div>

                      {/* External Port */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.form.externalPort")}</label>
                        <div className="col-span-9">
                          <input
                            name="externalPort"
                            value={formData.externalPort}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg text-sm border ${!formData.externalPort ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                            type="number"
                          />
                          {!formData.externalPort && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired") || "Dieses Feld wird benötigt"}</p>}
                        </div>
                      </div>

                      {/* Post Run Time */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.form.postRunTime")}</label>
                        <div className="col-span-9 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-10">
                            <input
                              name="postRunTime"
                              value={formData.postRunTime}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 rounded-lg text-sm border ${!formData.postRunTime ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                              type="number"
                            />
                            {!formData.postRunTime && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired") || "Dieses Feld wird benötigt"}</p>}
                          </div>
                          <span className="col-span-2 text-xs opacity-50">{t(lang, "cabins.unit.seconds")}</span>
                        </div>
                      </div>

                      {/* Pre Run Time */}
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.form.preRunTime")}</label>
                        <div className="col-span-9 grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-10">
                            <input
                              name="preRunTime"
                              value={formData.preRunTime}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 rounded-lg text-sm border ${!formData.preRunTime ? "border-red-300 dark:border-red-900/50" : inputClass}`}
                              type="number"
                            />
                            {!formData.preRunTime && <p className="text-[10px] text-red-500 mt-1">{t(lang, "cabins.wizard.helpRequired") || "Dieses Feld wird benötigt"}</p>}
                          </div>
                          <span className="col-span-2 text-xs opacity-50">{t(lang, "cabins.unit.seconds")}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* STEP 2: MAINTENANCE */}
                {activeStep === 2 && (
                  <div className="flex flex-col animate-fadeIn space-y-6">

                    {/* Header Actions */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="font-bold text-sm">{t(lang, "cabins.maintenanceModal.title")}</h3>
                      <button
                        onClick={() => setIsMaintenanceModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                      >
                        <FiPlus /> {t(lang, "cabins.maintenance.add")}
                      </button>
                    </div>

                    {/* Maintenance Table */}
                    <div className={`${isDark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"} rounded-lg border overflow-hidden`}>
                      <table className="w-full text-sm text-left">
                        <thead className={`${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border-b text-xs font-bold uppercase opacity-70`}>
                          <tr>
                            <th className="px-6 py-3">{t(lang, "cabins.maintenanceModal.name")}</th>
                            <th className="px-6 py-3">{t(lang, "cabins.maintenanceModal.interval")}</th>
                            <th className="px-6 py-3 text-right">{t(lang, "cabins.cabin.minLeft")}</th>
                            <th className="px-6 py-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {formData.assignedMaintenance && formData.assignedMaintenance.length > 0 ? (
                            formData.assignedMaintenance.map((m, idx) => (
                              <tr key={idx} className="group">
                                <td className="px-6 py-3">{m.name}</td>
                                <td className="px-6 py-3">{m.interval || 0} {t(lang, "cabins.cabin.min")}</td>
                                <td className="px-6 py-3 text-right font-mono">{m.remaining || 0}</td>
                                <td className="px-6 py-3 text-right">
                                  <button
                                    onClick={() => {
                                      const newMaint = [...formData.assignedMaintenance];
                                      newMaint.splice(idx, 1);
                                      setFormData(prev => ({ ...prev, assignedMaintenance: newMaint }));
                                    }}
                                    className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-all"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className={`px-6 py-8 text-center font-medium ${isDark ? "bg-blue-900/10 text-blue-500" : "bg-slate-50 text-slate-500"}`}>
                                {t(lang, "cabins.programTable.empty")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Maintenance Selection Modal */}
                    {isMaintenanceModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[70vh] ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>

                          {/* Header */}
                          <div className={`flex justify-between items-center p-5 border-b ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-100 bg-white"}`}>
                            <h2 className="text-lg font-bold">{t(lang, "cabins.maintenanceModal.title")}</h2>
                            <button onClick={() => setIsMaintenanceModalOpen(false)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                              <FiX className="text-xl opacity-70" />
                            </button>
                          </div>

                          {/* Body - Scrollable */}
                          <div className={`flex-1 overflow-y-auto custom-scrollbar ${isDark ? "bg-slate-900" : "bg-white"}`}>
                            <table className="w-full text-sm text-left">
                              <thead className={`sticky top-0 z-10 font-bold ${isDark ? "bg-slate-800 text-slate-300 border-b border-slate-700" : "bg-slate-50 text-slate-600 border-b border-slate-200"}`}>
                                <tr>
                                  <th className="px-6 py-4">{t(lang, "cabins.maintenanceModal.name")}</th>
                                  <th className="px-6 py-4">{t(lang, "cabins.maintenanceModal.interval")}</th>
                                  <th className="px-6 py-4 w-32 text-right"></th>
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                                {maintenanceTypes.length > 0 ? (
                                  maintenanceTypes.map((type, i) => (
                                    <tr key={i} className={`transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                      <td className="px-6 py-4 font-medium">{type.name}</td>
                                      <td className={`px-6 py-4 opacity-70 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{type.duration} {t(lang, "cabins.cabin.min")}</td>
                                      <td className="px-6 py-4 text-right">
                                        <button
                                          onClick={() => {
                                            setFormData(prev => ({
                                              ...prev,
                                              assignedMaintenance: [...prev.assignedMaintenance, { name: type.name, interval: type.duration, remaining: type.duration, id: type.id }]
                                            }));
                                            setIsMaintenanceModalOpen(false);
                                          }}
                                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm shadow-blue-500/30"
                                        >
                                          {t(lang, "cabins.maintenanceModal.select")}
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center opacity-50">
                                      {t(lang, "cabins.programTable.empty")}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Footer */}
                          <div className={`p-4 border-t flex justify-end ${isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                            <button
                              onClick={() => setIsMaintenanceModalOpen(false)}
                              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"}`}
                            >
                              {t(lang, "btn.cancel") || "Close"}
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* STEP 3: PROGRAM */}
                {activeStep === 3 && (
                  <div className="h-full flex flex-col animate-fadeIn">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold">{t(lang, "cabins.program.title")}</h2>
                      <p className="opacity-60 text-xs">{t(lang, "cabins.program.subtitle")}</p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 overflow-y-auto pr-1">
                      {/* Left: Presets */}
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-60 ml-1">{t(lang, "cabins.program.presets.label")}</label>
                        {["standard", "sensitive", "intensive", "custom"].map(preset => (
                          <button
                            key={preset}
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              programSettings: {
                                ...prev.programSettings,
                                preset: preset,
                                intensity: preset === "sensitive" ? 70 : preset === "intensive" ? 100 : 85,
                                fanSpeed: preset === "intensive" ? 100 : 50
                              }
                            }))}
                            className={`w-full p-3 rounded-lg border text-left transition-all relative overflow-hidden ${formData.programSettings?.preset === preset
                              ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                              : isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"
                              }`}
                          >
                            <div className="flex justify-between items-center relative z-10">
                              <span className={`text-sm font-bold capitalize ${formData.programSettings?.preset === preset ? "text-blue-500" : ""}`}>
                                {t(lang, `cabins.program.presets.${preset}`)}
                              </span>
                              {formData.programSettings?.preset === preset && <FiCheckCircle className="text-blue-500 text-lg" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Right: Detailed Settings */}
                      <div className={`md:col-span-8 p-4 rounded-xl border space-y-6 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        {/* Sliders */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="font-bold text-xs">{t(lang, "cabins.program.settings.intensity")}</label>
                              <span className="text-xs font-mono text-blue-500">{formData.programSettings?.intensity || 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="50" max="100"
                              value={formData.programSettings?.intensity || 85}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                programSettings: { ...prev.programSettings, intensity: parseInt(e.target.value), preset: 'custom' }
                              }))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="font-bold text-xs">{t(lang, "cabins.program.settings.fanSpeed")}</label>
                              <span className="text-xs font-mono text-blue-500">{formData.programSettings?.fanSpeed || 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="0" max="100"
                              value={formData.programSettings?.fanSpeed || 50}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                programSettings: { ...prev.programSettings, fanSpeed: parseInt(e.target.value), preset: 'custom' }
                              }))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <label className="font-bold text-xs">{t(lang, "cabins.program.settings.targetTemp")}</label>
                              <span className="text-xs font-mono text-blue-500">{formData.programSettings?.targetTemp || 22}°C</span>
                            </div>
                            <input
                              type="range"
                              min="18" max="26" step="0.5"
                              value={formData.programSettings?.targetTemp || 22}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                programSettings: { ...prev.programSettings, targetTemp: parseFloat(e.target.value), preset: 'custom' }
                              }))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                          </div>
                        </div>

                        {/* Toggles Grid */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-500/20">
                          {[
                            { id: "faceTanner", label: "faceTanner", icon: FiMonitor }, // Placeholder icon
                            { id: "airCon", label: "airCon", icon: FiRefreshCw },
                            { id: "aroma", label: "aroma", icon: FiFilter },
                            { id: "aquaMist", label: "aquaMist", icon: FiUploadCloud },
                            { id: "voiceGuide", label: "voiceGuide", icon: FiMoreHorizontal }
                          ].map(opt => (
                            <label key={opt.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-slate-500/5 cursor-pointer border-slate-500/20">
                              <span className="text-xs font-bold opacity-80">{t(lang, `cabins.program.settings.${opt.label}`)}</span>
                              <input
                                type="checkbox"
                                checked={formData.programSettings?.options?.[opt.id] || false}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  programSettings: {
                                    ...prev.programSettings,
                                    options: { ...prev.programSettings?.options, [opt.id]: e.target.checked },
                                    preset: 'custom'
                                  }
                                }))}
                                className="rounded border-slate-500 text-blue-500 focus:ring-0 w-4 h-4"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONFIRM */}
                {activeStep === 4 && (
                  <div className="text-center space-y-6 animate-fadeIn max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl shadow-green-500/40">
                      <FiCheck />
                    </div>
                    {/* Direct string fallback to debug translation - using generic path approach */}
                    <h2 className="text-2xl font-bold">{t(lang, "cabins.wizard.confirm.title") || "Bereit zum Speichern?"}</h2>
                    <p className="opacity-70">{t(lang, "cabins.wizard.confirm.subtitle") || "Bitte überprüfen Sie die Gerätedaten."}</p>

                    <div className={`${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"} border p-6 rounded-xl text-left space-y-2`}>
                      <div className="flex justify-between">
                        <span className="opacity-60">{t(lang, "cabins.wizard.confirm.name")}:</span>
                        <span className="font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">{t(lang, "cabins.wizard.confirm.type")}:</span>
                        <span className="font-bold">{formData.deviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">{t(lang, "cabins.wizard.confirm.controller")}:</span>
                        <span className="font-bold">{formData.controllerType}</span>
                      </div>
                    </div>

                    <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all w-full">
                      {saving ? t(lang, "cabins.form.saving") : t(lang, "btn.save")}
                    </button>
                  </div>
                )}

              </div>

              {/* 3. Footer (Nav) */}
              {activeStep < 4 && (
                <div className="p-6 border-t border-slate-700/20 flex justify-between">
                  <button onClick={prevStep} disabled={activeStep === 0} className="px-6 py-2 rounded font-bold hover:bg-slate-500/10 disabled:opacity-30 disabled:hover:bg-transparent">
                    {t(lang, "btn.prevStep")}
                  </button>
                  <button onClick={nextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded font-bold shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2">
                    {t(lang, "btn.nextStep")} <FiChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }
      {/* ARTICLE DETAILS MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className={`${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"} w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>

            {/* Header */}
            <div className={`flex justify-between items-center p-6 border-b ${isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
              <h2 className="text-xl font-bold">{t(lang, "cabins.articleModal.title").replace("{name}", articleFormData.articleName || "New Article")}</h2>
              <button onClick={() => setIsArticleModalOpen(false)}><FiX className="text-xl opacity-50 hover:opacity-100" /></button>
            </div>

            {/* Tabs */}
            <div className={`flex px-6 border-b ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
              {["master", "prices"].map(tabKey => (
                <button
                  key={tabKey}
                  onClick={() => setArticleTab(tabKey === "master" ? "stammdaten" : "preise")}
                  className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors capitalize ${articleTab === (tabKey === "master" ? "stammdaten" : "preise") ? "border-blue-500 text-blue-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {t(lang, `cabins.articleModal.tabs.${tabKey}`)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 ${isDark ? "bg-slate-900" : "bg-white"}`}>

              {/* 1. STAMMDATEN SECTION */}
              <div className="space-y-6">
                <div className={`flex justify-between items-end pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <h3 className="font-bold text-sm">{t(lang, "cabins.articleModal.masterData.title")}</h3>
                  <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2"><FiEdit2 /> {t(lang, "cabins.articleModal.masterData.edit")}</button>
                </div>

                <div className="grid grid-cols-12 gap-y-4 gap-x-6 items-center">
                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.org")}</label>
                  <div className="col-span-9">
                    <input disabled value={articleFormData.organization} className={`w-full px-3 py-2 rounded border-none text-sm opacity-60 cursor-not-allowed ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`} />
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.revenue")}</label>
                  <div className="col-span-9">
                    <select value={articleFormData.revenueAccount} onChange={e => setArticleFormData({ ...articleFormData, revenueAccount: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      <option value="8400 (Umatzerlöse (Studio) 19%)">8400 (Umatzerlöse (Studio) 19%)</option>
                    </select>
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.tax")}</label>
                  <div className="col-span-9">
                    <select value={articleFormData.taxType} onChange={e => setArticleFormData({ ...articleFormData, taxType: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      <option value="USt Regelstatz (DE) (MwSt: 19%)">USt Regelstatz (DE) (MwSt: 19%)</option>
                    </select>
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.group")}</label>
                  <div className="col-span-9">
                    <select value={articleFormData.productGroup} onChange={e => setArticleFormData({ ...articleFormData, productGroup: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      <option value="Sonstige">Sonstige</option>
                      <option value="Getränke">Getränke</option>
                      <option value="Kosmetik">Kosmetik</option>
                    </select>
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.name")}</label>
                  <div className="col-span-9">
                    <input value={articleFormData.articleName} onChange={e => setArticleFormData({ ...articleFormData, articleName: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.no")}</label>
                  <div className="col-span-9">
                    <input value={articleFormData.articleNo} onChange={e => setArticleFormData({ ...articleFormData, articleNo: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>

                  <label className="col-span-3 text-sm opacity-70 self-start pt-2">{t(lang, "cabins.articleModal.masterData.desc")}</label>
                  <div className="col-span-9">
                    <textarea rows={3} value={articleFormData.description} onChange={e => setArticleFormData({ ...articleFormData, description: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.masterData.barcode")}</label>
                  <div className="col-span-9">
                    <input value={articleFormData.barcode} onChange={e => setArticleFormData({ ...articleFormData, barcode: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>
                </div>
              </div>

              {/* 2. SPEZIELLE OPTIONEN */}
              <div className="space-y-6">
                <div className={`pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                  <h3 className="font-bold text-sm">{t(lang, "cabins.articleModal.special.title")}</h3>
                </div>

                <div className="grid grid-cols-12 gap-y-4 gap-x-6 items-center">
                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.security")}</label>
                  <div className="col-span-9">
                    <select value={articleFormData.securityLevel} onChange={e => setArticleFormData({ ...articleFormData, securityLevel: parseInt(e.target.value) })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      {[0, 1, 2, 3, 4, 5].map(l => <option key={l} value={l}>Level {l}</option>)}
                    </select>
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.unit")}</label>
                  <div className="col-span-9">
                    <select value={articleFormData.unit} onChange={e => setArticleFormData({ ...articleFormData, unit: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      <option value="Zeit">Time (Zeit)</option>
                      <option value="Stückzahl">Unit (Stückzahl)</option>
                    </select>
                  </div>

                  {/* Toggles Row 1 */}
                  <div className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.freePrice")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, freePricing: !p.freePricing }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.freePricing ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.freePricing ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.freePricing ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  <div className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.special.maxPrice")}</div>
                  <div className="col-span-3">
                    <input value={articleFormData.maxPrice} onChange={e => setArticleFormData({ ...articleFormData, maxPrice: e.target.value })} className={`w-full px-3 py-2 text-right rounded text-sm border ${inputClass}`} />
                  </div>

                  {/* Toggles Row 2 */}
                  <div className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.negativePrice")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, allowNegativePrice: !p.allowNegativePrice }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.allowNegativePrice ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.allowNegativePrice ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.allowNegativePrice ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  <div className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.special.hide")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, hideArticle: !p.hideArticle }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.hideArticle ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.hideArticle ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.hideArticle ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  {/* Toggles Row 3 */}
                  <div className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.hideAmounts")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, hideAmounts: !p.hideAmounts }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.hideAmounts ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.hideAmounts ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.hideAmounts ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  <div className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.special.stockable")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, stockable: !p.stockable }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.stockable ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.stockable ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.stockable ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  {/* Special Function */}
                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.specialFunc")}</label>
                  <div className="col-span-3">
                    <select value={articleFormData.specialFunction} onChange={e => setArticleFormData({ ...articleFormData, specialFunction: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`}>
                      <option value="Aktiviert ein Gerät">Activates a Device (Aktiviert ein Gerät)</option>
                    </select>
                  </div>

                  <div className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.special.staticRevenue")}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, staticRevenue: !p.staticRevenue }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.staticRevenue ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.staticRevenue ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.staticRevenue ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  {/* Required File & Dates */}
                  <div className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.requiredFile")}</div>
                  <div className="col-span-9 flex items-center gap-2">
                    <div onClick={() => setArticleFormData(p => ({ ...p, requiredFile: !p.requiredFile }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.requiredFile ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.requiredFile ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-xs">{articleFormData.requiredFile ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                  </div>

                  <label className="col-span-3 text-sm opacity-70">{t(lang, "cabins.articleModal.special.validFrom")}</label>
                  <div className="col-span-3">
                    <input type="date" value={articleFormData.validFrom} onChange={e => setArticleFormData({ ...articleFormData, validFrom: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>
                  <label className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.special.validTo")}</label>
                  <div className="col-span-3">
                    <input type="date" value={articleFormData.validTo} onChange={e => setArticleFormData({ ...articleFormData, validTo: e.target.value })} className={`w-full px-3 py-2 rounded text-sm border ${inputClass}`} />
                  </div>

                </div>
              </div>

              {/* 3. RABATT EINSTELLUNGEN */}
              {articleTab === "stammdaten" && (
                <div className="space-y-6">
                  <div className={`pb-2 border-b ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                    <h3 className="font-bold text-sm">{t(lang, "cabins.articleModal.discount.title")}</h3>
                  </div>
                  <div className="grid grid-cols-12 gap-y-4 gap-x-6 items-center">
                    <label className="col-span-3 text-sm opacity-70 flex items-center gap-2">{t(lang, "cabins.articleModal.discount.general")} <FiInfo className="text-blue-500" /></label>
                    <div className="col-span-3 flex items-center gap-2">
                      <input type="number" value={articleFormData.generalDiscount} onChange={e => setArticleFormData({ ...articleFormData, generalDiscount: parseInt(e.target.value) })} className={`w-20 px-3 py-2 text-right rounded text-sm border ${inputClass}`} />
                      <span className="text-sm opacity-60">%</span>
                    </div>

                    <div className="col-span-3 text-sm opacity-70 text-right">{t(lang, "cabins.articleModal.discount.manual")}</div>
                    <div className="col-span-3 flex items-center gap-2">
                      <div onClick={() => setArticleFormData(p => ({ ...p, manualDiscount: !p.manualDiscount }))} className={`w-10 h-5 rounded-full flex items-center cursor-pointer transition-colors ${articleFormData.manualDiscount ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${articleFormData.manualDiscount ? "translate-x-5" : "translate-x-1"}`} />
                      </div>
                      <span className="text-xs">{articleFormData.manualDiscount ? t(lang, "cabins.articleModal.special.yes") : t(lang, "cabins.articleModal.special.no")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PREISE TAB */}
              {articleTab === "preise" && (
                <div className="space-y-8 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{t(lang, "cabins.articleModal.prices.title")}</h3>
                    {!isPriceEditing ? (
                      <button
                        onClick={() => setIsPriceEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold shadow flex items-center gap-2"
                      >
                        <FiEdit2 /> {t(lang, "cabins.articleModal.prices.edit")}
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPriceEditing(false)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold shadow flex items-center gap-2"
                      >
                        <FiX /> {t(lang, "cabins.articleModal.prices.end")}
                      </button>
                    )}
                  </div>

                  {/* Edit Options Header */}
                  {isPriceEditing && (
                    <div className={`p-4 rounded-lg flex items-center gap-6 ${isDark ? "bg-slate-800/50" : "bg-slate-50 border border-slate-100"}`}>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold opacity-70 uppercase tracking-wider">{t(lang, "cabins.articleModal.prices.currency")}</label>
                        <select className={`px-2 py-1 rounded text-sm border ${inputClass}`}>
                          <option>EUR/€</option>
                          <option>USD/$</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center bg-blue-500 border-blue-500 text-white text-xs`}>
                          <FiCheck />
                        </div>
                        <span className="text-sm font-bold">{t(lang, "cabins.articleModal.prices.fixedUnit")} <FiInfo className="inline text-blue-500" /></span>
                      </div>
                    </div>
                  )}

                  {/* Table */}
                  <div className="rounded-lg border overflow-hidden border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-sm">
                      <thead className={`font-bold ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}`}>
                        <tr>
                          <th className="px-6 py-3">{t(lang, "cabins.articleModal.prices.unit")}</th>
                          <th className="px-6 py-3">{t(lang, "cabins.articleModal.prices.price")}</th>
                          <th className="px-6 py-3 w-32"></th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-slate-800 bg-slate-900" : "divide-slate-100 bg-white"}`}>
                        {/* Mock Row 1 - Static or Editable */}
                        {isPriceEditing ? (
                          <tr className={`${isDark ? "bg-blue-900/10" : "bg-blue-50"}`}>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-1">
                                <input defaultValue="00" className={`w-10 text-center py-1 rounded border ${inputClass}`} />:
                                <input defaultValue="00" className={`w-10 text-center py-1 rounded border ${inputClass}`} />:
                                <input defaultValue="01" className={`w-10 text-center py-1 rounded border ${inputClass}`} />
                              </div>
                            </td>
                            <td className="px-6 py-3">
                              <input defaultValue="0,00 €" className={`w-28 py-1 px-2 rounded border ${inputClass}`} />
                            </td>
                            <td className="px-6 py-3 text-right flex justify-end gap-2">
                              <button className="bg-emerald-500 text-white p-1.5 rounded hover:bg-emerald-600"><FiCheck /></button>
                              <button className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600"><FiX /></button>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td className="px-6 py-4 font-mono opacity-80">00:00:01</td>
                            <td className="px-6 py-4 font-bold">0,00 €</td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className={`p-6 border-t flex justify-end gap-3 ${isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
              <button onClick={() => setIsArticleModalOpen(false)} className={`px-6 py-2 rounded-lg font-bold text-sm hover:bg-opacity-80 transition-all ${isDark ? "bg-slate-800 text-slate-300" : "bg-white border text-slate-700"}`}>{t(lang, "cabins.articleModal.actions.close")}</button>
              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    assignedPrograms: [...prev.assignedPrograms, { name: articleFormData.articleName || "New Program", id: Date.now() }]
                  }));
                  setIsArticleModalOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20"
              >
                {t(lang, "cabins.articleModal.actions.save") || "Speichern"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
