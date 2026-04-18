import React, { useState, useEffect, useRef } from 'react';
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiCopy, FiCheckCircle, FiXCircle, FiArrowLeft, FiSave, FiAlertTriangle, FiFilter, FiUserPlus, FiMoreVertical, FiChevronDown, FiUsers, FiTag, FiType, FiAlignLeft
} from 'react-icons/fi';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { translations, t } from '../i18n';
import { ToastProvider } from "../components/Toast";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

// --- SUB-COMPONENTS ---

const ActionDropdown = ({ onEdit, onCopy, onDelete, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
            >
                {t(language, "btn.actions")} <FiChevronDown />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                    <button onClick={() => { onEdit(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-black dark:text-slate-200">
                        <FiEdit2 size={14} /> {t(language, "btn.edit")}
                    </button>
                    <button onClick={() => { onCopy(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-black dark:text-slate-200">
                        <FiCopy size={14} /> {t(language, "priceAgreement.copy")}
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                    <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                        <FiTrash2 size={14} /> {t(language, "btn.delete")}
                    </button>
                </div>
            )}
        </div>
    );
};

const ArticleSelector = ({ isOpen, onClose, onSelect, language, isDark }) => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchArticles();
    }, [isOpen]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "articles"));
            setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = articles.filter(a =>
        (a.articleName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.articleNo || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[80vh] ${isDark ? "bg-slate-900" : "bg-white"}`}>
                <div className={`p-4 border-b flex justify-between items-center ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <h3 className={`font-bold text-lg ${isDark ? "text-white" : "text-black"}`}>{t(language, "priceAgreement.articles.selectArticle")}</h3>
                    <button onClick={onClose}><FiXCircle size={24} className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <div className={`p-4 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t(language, "priceAgreement.articles.searchPlaceholder")}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-black placeholder-slate-400"}`}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                    {filtered.map(article => (
                        <button
                            key={article.id}
                            onClick={() => { onSelect(article); onClose(); }}
                            className={`w-full text-left p-3 rounded flex justify-between items-center border border-transparent transition-colors ${isDark ? "hover:bg-slate-800 hover:border-slate-700" : "hover:bg-slate-50 hover:border-slate-200"}`}
                        >
                            <div>
                                <div className={`font-medium ${isDark ? "text-slate-200" : "text-black"}`}>{article.articleName}</div>
                                <div className="text-xs text-slate-800 font-mono">{article.articleNo}</div>
                            </div>
                            <div className="text-sky-500 text-sm font-medium">{t(language, "btn.select")}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PersonAssignmentWizard = ({ isOpen, onClose, onAssign, language, isDark }) => {
    const [step, setStep] = useState(1);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Config State
    const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
    const [validTo, setValidTo] = useState("2099-12-31");
    const [priority, setPriority] = useState(1);
    const [priorityEnabled, setPriorityEnabled] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedPerson(null);
            setPriorityEnabled(false);
            fetchCustomers();
        }
    }, [isOpen]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "customers"));
            setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (!selectedPerson) return;
        onAssign({
            ...selectedPerson,
            validFrom,
            validTo,
            priority: priorityEnabled ? priority : 1
        });
        onClose();
    };

    const filtered = customers.filter(c =>
        (c.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.lastName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col h-[600px] ${isDark ? "bg-slate-900" : "bg-white"}`}>
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-black dark:text-white">
                            {t(language, "priceAgreement.persons.addTitle")}
                        </h3>
                        {selectedPerson && <div className="text-sm text-sky-500 font-medium">{selectedPerson.firstName} {selectedPerson.lastName}</div>}
                    </div>
                    <div className="flex gap-2">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-sm transition-colors">
                                {t(language, "btn.back")}
                            </button>
                        )}
                        <button onClick={onClose}><FiXCircle size={24} className="text-slate-400 hover:text-red-500" /></button>
                    </div>
                </div>

                {/* Stepper */}
                <div className="py-6 border-b border-slate-100 dark:border-slate-800 flex justify-center">
                    <div className="flex items-center w-1/2 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 transform -translate-y-1/2 rounded"></div>
                        <div className={`absolute left-0 top-1/2 h-1 bg-sky-500 transition-all duration-300 -z-10 transform -translate-y-1/2 rounded ${step === 2 ? "w-full" : "w-1/2"}`}></div>

                        {/* Step 1 */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-800 transition-colors ${step >= 1 ? "border-sky-500 text-sky-500" : "border-slate-300 text-slate-300"}`}>
                                <FiUsers />
                            </div>
                            <span className={`text-xs font-semibold ${step >= 1 ? "text-sky-600" : "text-slate-400"}`}>{t(language, "priceAgreement.persons.select")}</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-800 transition-colors ${step >= 2 ? "border-sky-500 text-sky-500" : "border-slate-300 text-slate-300"}`}>
                                <FiTag />
                            </div>
                            <span className={`text-xs font-semibold ${step >= 2 ? "text-sky-600" : "text-slate-400"}`}>{t(language, "priceAgreement.persons.manage")}</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="flex flex-col h-full gap-4">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={t(language, "customers.searchPlaceholder")}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-black placeholder-slate-600"}`}
                                />
                            </div>
                            <div className="flex-1 border rounded border-slate-200 dark:border-slate-700 overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className={`border-b ${isDark ? "bg-slate-800 text-black border-slate-700" : "bg-slate-50 text-black border-slate-200"}`}>
                                        <tr>
                                            <th className="px-4 py-2">{t(language, "customer.fields.firstName")}</th>
                                            <th className="px-4 py-2">{t(language, "customer.fields.lastName")}</th>
                                            <th className="px-4 py-2">{t(language, "customer.fields.email")}</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                                        {filtered.map(c => (
                                            <tr key={c.id} className={`cursor-pointer ${isDark ? "hover:bg-slate-800" : "hover:bg-sky-50"}`} onClick={() => { setSelectedPerson(c); setStep(2); }}>
                                                <td className={`px-4 py-3 font-medium ${isDark ? "text-slate-200" : "text-black"}`}>{c.firstName}</td>
                                                <td className={`px-4 py-3 ${isDark ? "text-slate-200" : "text-black"}`}>{c.lastName}</td>
                                                <td className="px-4 py-3 text-slate-800">{c.email}</td>
                                                <td className="px-4 py-3 text-right text-sky-500">
                                                    <FiChevronDown className="transform -rotate-90" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-2xl mx-auto space-y-8 py-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-black"}`}>{t(language, "priceAgreement.fields.validFrom")}</label>
                                    <input
                                        type="date"
                                        value={validFrom}
                                        onChange={e => setValidFrom(e.target.value)}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-black"}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-black"}`}>{t(language, "priceAgreement.fields.validTo")}</label>
                                    <input
                                        type="date"
                                        value={validTo}
                                        onChange={e => setValidTo(e.target.value)}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-black"}`}
                                    />
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-4 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                                <div className="flex-1">
                                    <span className={`font-medium block ${isDark ? "text-slate-200" : "text-black"}`}>{t(language, "priceAgreement.persons.changePriority")}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPriorityEnabled(!priorityEnabled)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${priorityEnabled ? "bg-sky-500" : "bg-slate-300"}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${priorityEnabled ? "left-7" : "left-1"}`}></div>
                                    </button>
                                    <span className="text-sm text-black">{priorityEnabled ? t(language, "options.yes") : t(language, "options.no")}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 2 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2.5 rounded font-medium flex items-center gap-2 shadow-sm transition-all"
                        >
                            <FiSave /> {t(language, "btn.save")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active
            ? "border-sky-500 text-sky-600 dark:text-sky-400"
            : "border-transparent text-slate-700 hover:text-black dark:hover:text-slate-300"
            }`}
    >
        {label}
    </button>
);

const ToggleSwitch = ({ label, checked, onChange, helpText, isDark }) => (
    <div className={`flex items-center justify-between py-3 border-b last:border-0 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <div className="flex flex-col">
            <span className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-black"}`}>{label}</span>
            {helpText && <span className="text-xs text-slate-400">{helpText}</span>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"
                    }`}
            />
        </button>
    </div>
);

// --- MAIN COMPONENT ---

const PriceAgreements = ({ theme, onNavigate }) => {
    const isDark = theme === "dark";
    const { addToast } = useToast();
    const { language } = useLanguage(); // Get language from context

    // State
    const [view, setView] = useState("list");
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentAgreement, setCurrentAgreement] = useState(null);
    const [activeTab, setActiveTab] = useState("basic");
    const [showCopyModal, setShowCopyModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [showPersonWizard, setShowPersonWizard] = useState(false);

    const initialFormState = {
        name: "",
        description: "",
        isStandard: false,
        isHidden: false,
        changeOnContract: false,
        changeOnExtension: false,
        assignedArticles: [],
        assignedPersons: []
    };

    const [formData, setFormData] = useState(initialFormState);

    // Fetch agreements
    useEffect(() => {
        fetchAgreements();
    }, []);

    const fetchAgreements = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "priceAgreements"));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAgreements(data);
        } catch (error) {
            console.error("Error fetching agreements:", error);
            addToast("Failed to fetch price agreements", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (item) => {
        if (item) {
            setCurrentAgreement(item);
            setFormData({
                name: item.name || "",
                description: item.description || "",
                isStandard: item.isStandard || false,
                isHidden: item.isHidden || false,
                changeOnContract: item.changeOnContract || false,
                changeOnExtension: item.changeOnExtension || false,
                assignedArticles: item.assignedArticles || [],
                assignedPersons: item.assignedPersons || []
            });
        } else {
            setCurrentAgreement(null);
            setFormData(initialFormState);
        }
        setView("edit");
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            addToast(t(language, "errors.required"), "error");
            return;
        }

        try {
            const data = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (currentAgreement?.id) {
                await updateDoc(doc(db, "priceAgreements", currentAgreement.id), data);
                addToast("Price Agreement updated successfully", "success");
            } else {
                await addDoc(collection(db, "priceAgreements"), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                addToast("Price Agreement created successfully", "success");
            }

            setView("list");
            fetchAgreements();
        } catch (error) {
            console.error("Error saving agreement:", error);
            addToast("Failed to save price agreement", "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t(language, "priceAgreement.confirmDelete"))) return;

        try {
            await deleteDoc(doc(db, "priceAgreements", id));
            addToast("Price Agreement deleted successfully", "success");
            setView("list");
            fetchAgreements();
        } catch (error) {
            console.error("Error deleting agreement:", error);
            addToast("Failed to delete price agreement", "error");
        }
    };

    const executeCopy = async () => {
        if (!showCopyModal) return;
        const source = agreements.find(a => a.id === showCopyModal);
        if (!source) return;

        const copyData = {
            ...source,
            name: `${source.name || 'Unnamed'} (Copy)`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        delete copyData.id;

        try {
            await addDoc(collection(db, "priceAgreements"), copyData);
            addToast(t(language, "priceAgreement.success.copied"), "success");
            setShowCopyModal(null);
            fetchAgreements();
        } catch (e) {
            addToast("Copy failed", "error");
        }
    };

    const handleAddArticle = (article) => {
        if (formData.assignedArticles.find(a => a.articleId === article.id)) {
            addToast(t(language, "priceAgreement.errors.articleExists"), "info");
            return;
        }
        const newAssignment = {
            articleId: article.id,
            articleName: article.articleName,
            articleNo: article.articleNo,
            group: article.category || "Unknown",
            price: 0,
            status: true
        };
        setFormData({
            ...formData,
            assignedArticles: [...(formData.assignedArticles || []), newAssignment]
        });
    };

    const handleRemoveArticle = (articleId) => {
        setFormData({
            ...formData,
            assignedArticles: formData.assignedArticles.filter(a => a.articleId !== articleId)
        });
    };

    const handleAssignPerson = (personData) => {
        if (formData.assignedPersons.find(p => p.customerId === personData.id)) {
            addToast(t(language, "priceAgreement.errors.personExists"), "info");
            return;
        }
        const newPerson = {
            customerId: personData.id,
            firstName: personData.firstName,
            lastName: personData.lastName,
            email: personData.email,
            validFrom: personData.validFrom,
            validTo: personData.validTo,
            priority: personData.priority
        };
        setFormData({
            ...formData,
            assignedPersons: [...(formData.assignedPersons || []), newPerson]
        });
    };

    const handleRemovePerson = (customerId) => {
        setFormData({
            ...formData,
            assignedPersons: formData.assignedPersons.filter(p => p.customerId !== customerId)
        });
    };

    const filteredAgreements = agreements.filter(a =>
        a && a.name && a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (view === "list") {
        return (
            <div className="p-6 h-full flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {onNavigate && (
                            <button
                                onClick={() => onNavigate("dashboard")}
                                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                                title={t(language, "btn.back")}
                            >
                                <FiArrowLeft className={`text-xl ${isDark ? "text-slate-400" : "text-black"}`} />
                            </button>
                        )}
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}>
                            {t(language, "priceAgreement.title")}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleStartEdit(null)}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all text-sm font-medium"
                        >
                            <FiPlus /> {t(language, "priceAgreement.createTitle")}
                        </button>
                    </div>
                </div>

                <div className={`flex-1 rounded-xl shadow-sm border overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <div className={`grid grid-cols-12 gap-2 p-4 border-b text-sm font-bold ${isDark ? "bg-slate-900/50 border-slate-800 text-slate-400" : "bg-white border-slate-100 text-black"}`}>
                        <div className="col-span-2 whitespace-nowrap">{t(language, "priceAgreement.fields.name")}</div>
                        <div className="col-span-2 whitespace-nowrap">{t(language, "priceAgreement.fields.description")}</div>
                        <div className="col-span-1 text-center whitespace-nowrap">{t(language, "priceAgreement.fields.isHidden")}</div>
                        <div className="col-span-2 text-center whitespace-nowrap">{t(language, "priceAgreement.fields.isStandard")}</div>
                        <div className="col-span-2 text-center whitespace-nowrap">{t(language, "priceAgreement.fields.changeOnContract_short")}</div>
                        <div className="col-span-2 text-center whitespace-nowrap">{t(language, "priceAgreement.fields.changeOnExtension_short")}</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    <div className={`overflow-y-auto h-full ${isDark ? "bg-slate-900/50" : "bg-white"}`}>
                        {loading ? (
                            <div className="p-8 text-center text-slate-800">Loading...</div>
                        ) : (
                            filteredAgreements.map((item, idx) => (
                                <div key={item.id} className={`grid grid-cols-12 gap-2 p-4 items-center border-b last:border-0 transition-colors ${isDark ? (idx % 2 === 0 ? "bg-slate-900 border-slate-800" : "bg-slate-800/50 border-slate-800") : (idx % 2 === 0 ? "bg-white border-slate-100" : "bg-slate-50 border-slate-100")}`}>
                                    <div className={`col-span-2 text-sm font-medium ${isDark ? "text-slate-200" : "text-black"}`}>{item.name}</div>
                                    <div className={`col-span-2 text-xs truncate ${isDark ? "text-slate-400" : "text-slate-800"}`}>{item.description || "NA"}</div>

                                    <div className="col-span-1 flex justify-center">{item.isHidden ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400 opacity-50" />}</div>
                                    <div className="col-span-2 flex justify-center">{item.isStandard ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400 opacity-50" />}</div>
                                    <div className="col-span-2 flex justify-center">{item.changeOnContract ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400 opacity-50" />}</div>
                                    <div className="col-span-2 flex justify-center">{item.changeOnExtension ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-red-400 opacity-50" />}</div>

                                    <div className="col-span-1 flex justify-end">
                                        <ActionDropdown
                                            onEdit={() => handleStartEdit(item)}
                                            onCopy={() => setShowCopyModal(item.id)}
                                            onDelete={() => handleDelete(item.id)}
                                            language={language}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Copy Modal */}
                {showCopyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-lg rounded-xl shadow-2xl p-6 ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-3xl mb-2">
                                    <FiAlertTriangle />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white">
                                    {t(language, "priceAgreement.copyWarning")}
                                </h3>
                                <div className={`p-4 rounded text-sm text-center ${isDark ? "bg-orange-900/20 text-orange-200" : "bg-orange-50 text-orange-800"}`}>
                                    {t(language, "priceAgreement.copyMessage")}
                                </div>
                                <div className="flex w-full gap-3 mt-4">
                                    <button
                                        onClick={executeCopy}
                                        className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                    >
                                        {t(language, "priceAgreement.proceed")}
                                    </button>
                                    <button
                                        onClick={() => setShowCopyModal(null)}
                                        className="flex-1 py-2.5 text-sky-500 hover:bg-sky-50 rounded-lg font-medium transition-colors"
                                    >
                                        {t(language, "priceAgreement.cancel")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <div className={`flex justify-between items-center p-4 rounded-xl shadow-sm border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div>
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-black"}`}>
                        <span className={`font-normal text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t(language, "priceAgreement.editTitle").replace("{name}", "")}</span>
                        {currentAgreement?.name || "New"}
                    </h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView("list")}
                        className="px-4 py-2 border border-slate-500 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        {t(language, "btn.back")}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <FiSave /> {t(language, "btn.save")}
                    </button>
                    {currentAgreement?.id && (
                        <button
                            onClick={() => handleDelete(currentAgreement.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <FiTrash2 /> {t(language, "priceAgreement.delete")}
                        </button>
                    )}
                </div>
            </div>

            <div className={`flex-1 flex flex-col rounded-xl shadow-sm border overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="flex border-b border-slate-200 dark:border-slate-700 px-4 pt-2 gap-2">
                    <TabButton active={activeTab === "basic"} label={t(language, "priceAgreement.tabs.basic")} onClick={() => setActiveTab("basic")} />
                    <TabButton active={activeTab === "articles"} label={t(language, "priceAgreement.tabs.articles")} onClick={() => setActiveTab("articles")} />
                    <TabButton active={activeTab === "persons"} label={t(language, "priceAgreement.tabs.persons")} onClick={() => setActiveTab("persons")} />
                </div>

                <div className="p-6 overflow-y-auto">
                    {activeTab === "basic" && (
                        <div className="max-w-4xl grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-black dark:text-slate-300">{t(language, "priceAgreement.fields.name")}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <FiType />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full pl-10 p-2.5 rounded-lg border shadow-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder-slate-900 dark:placeholder-slate-500 ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`}
                                            placeholder="e.g. Premium Membership"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-black dark:text-slate-300">{t(language, "priceAgreement.fields.description")}</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                                            <FiAlignLeft />
                                        </div>
                                        <textarea
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className={`w-full pl-10 p-2.5 rounded-lg border shadow-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder-slate-900 dark:placeholder-slate-500 ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-black"}`}
                                            placeholder="Description of the agreement..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`p-6 rounded-xl border shadow-sm ${isDark ? "bg-slate-800/50 border-slate-800" : "bg-white border-slate-200"}`}>
                                <ToggleSwitch isDark={isDark} label={t(language, "priceAgreement.fields.isHidden")} checked={formData.isHidden} onChange={(v) => setFormData({ ...formData, isHidden: v })} />
                                <ToggleSwitch isDark={isDark} label={t(language, "priceAgreement.fields.isStandard")} checked={formData.isStandard} onChange={(v) => setFormData({ ...formData, isStandard: v })} />
                                <ToggleSwitch isDark={isDark} label={t(language, "priceAgreement.fields.changeOnContract")} checked={formData.changeOnContract} onChange={(v) => setFormData({ ...formData, changeOnContract: v })} />
                                <ToggleSwitch isDark={isDark} label={t(language, "priceAgreement.fields.changeOnExtension")} checked={formData.changeOnExtension} onChange={(v) => setFormData({ ...formData, changeOnExtension: v })} />
                            </div>
                        </div>
                    )}

                    {activeTab === "articles" && (
                        <div className="flex flex-col h-full">
                            <div className="mb-4 flex justify-end">
                                <button
                                    onClick={() => setShowArticleModal(true)}
                                    className="bg-emerald-500 text-white px-4 py-2 rounded shadow hover:bg-emerald-600 transition flex items-center gap-2">
                                    <FiPlus /> {t(language, "priceAgreement.articles.add")}
                                </button>
                            </div>
                            <div className={`flex-1 rounded border overflow-hidden ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                                <table className="w-full text-sm text-left">
                                    <thead className={`text-xs uppercase font-semibold ${isDark ? "bg-slate-800 text-slate-400" : "bg-white text-black"}`}>
                                        <tr>
                                            <th className="px-4 py-3">{t(language, "article.fields.articleNo")}</th>
                                            <th className="px-4 py-3">{t(language, "article.fields.articleName")}</th>
                                            <th className="px-4 py-3">{t(language, "priceAgreement.articles.group")}</th>
                                            <th className="px-4 py-3">{t(language, "priceAgreement.articles.price")}</th>
                                            <th className="px-4 py-3 text-center">{t(language, "priceAgreement.articles.status")}</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {(!formData.assignedArticles.length) ? (
                                            <tr><td colSpan="6" className="text-center py-8 text-slate-400 italic">{t(language, "priceAgreement.articles.noArticles")}</td></tr>
                                        ) : (
                                            formData.assignedArticles.map((assign, index) => (
                                                <tr key={index} className={isDark ? "bg-slate-900" : "bg-white"}>
                                                    <td className="px-4 py-3 font-mono text-slate-800">{assign.articleNo}</td>
                                                    <td className="px-4 py-3 font-medium text-black dark:text-slate-200">{assign.articleName}</td>
                                                    <td className="px-4 py-3 text-slate-800">{assign.group}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            value={assign.price}
                                                            onChange={(e) => {
                                                                const newVal = [...formData.assignedArticles];
                                                                newVal[index].price = e.target.value;
                                                                setFormData({ ...formData, assignedArticles: newVal });
                                                            }}
                                                            className={`w-24 p-1 rounded border text-right ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-center"><FiCheckCircle className="inline text-emerald-500" /></td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button onClick={() => handleRemoveArticle(assign.articleId)} className="bg-red-100 text-red-500 p-1.5 rounded hover:bg-red-200"><FiTrash2 /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "persons" && (
                        <div className="flex flex-col h-full">
                            <div className="mb-4 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-2.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder={t(language, "customers.searchPlaceholder")}
                                            className={`pl-10 pr-4 py-2 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowPersonWizard(true)}
                                        className="bg-emerald-500 text-white px-4 py-2 rounded shadow hover:bg-emerald-600 transition flex items-center gap-2">
                                        <FiPlus /> {t(language, "priceAgreement.persons.add")}
                                    </button>
                                </div>
                            </div>

                            <div className={`flex-1 rounded border overflow-hidden ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                                <table className="w-full text-sm text-left">
                                    <thead className={`text-xs uppercase font-semibold ${isDark ? "bg-slate-800 text-slate-400" : "bg-white text-black"}`}>
                                        <tr>
                                            <th className="px-4 py-3">{t(language, "priceAgreement.persons.customerData")}</th>
                                            <th className="px-4 py-3">{t(language, "priceAgreement.fields.validFrom")}</th>
                                            <th className="px-4 py-3">{t(language, "priceAgreement.fields.validTo")}</th>
                                            <th className="px-4 py-3 text-center">{t(language, "priceAgreement.fields.priority")}</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {(!formData.assignedPersons.length) ? (
                                            <tr><td colSpan="5" className="text-center py-8 text-slate-400 italic">{t(language, "priceAgreement.persons.noPersons")}</td></tr>
                                        ) : (
                                            formData.assignedPersons.map((p, idx) => (
                                                <tr key={idx} className={`transition-colors border-b last:border-0 ${isDark ? (idx % 2 === 0 ? "bg-slate-900 border-slate-800" : "bg-slate-800/50 border-slate-800") : (idx % 2 === 0 ? "bg-white border-slate-100" : "bg-slate-50 border-slate-100")}`}>
                                                    <td className="px-4 py-3">
                                                        <div className={`font-medium ${isDark ? "text-slate-200" : "text-black"}`}>#{p.customerId.substring(0, 8)}</div>
                                                        <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{p.firstName} {p.lastName}</div>
                                                    </td>
                                                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-black"}`}>{p.validFrom}</td>
                                                    <td className={`px-4 py-3 ${isDark ? "text-slate-400" : "text-black"}`}>{p.validTo}</td>
                                                    <td className={`px-4 py-3 text-center ${isDark ? "text-slate-400" : "text-black"}`}>{p.priority}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button onClick={() => handleRemovePerson(p.customerId)} className="bg-red-100 text-red-500 px-3 py-1 rounded text-xs hover:bg-red-200 transaction-colors"><FiTrash2 size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ArticleSelector
                isOpen={showArticleModal}
                onClose={() => setShowArticleModal(false)}
                onSelect={handleAddArticle}
                language={language}
                isDark={isDark}
            />

            <PersonAssignmentWizard
                isOpen={showPersonWizard}
                onClose={() => setShowPersonWizard(false)}
                onAssign={handleAssignPerson}
                language={language}
                isDark={isDark}
            />
        </div>
    );
};

export default PriceAgreements;
