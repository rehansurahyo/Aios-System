import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where, orderBy, writeBatch } from "firebase/firestore";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";


import {
    FiFileText,

    FiSave,
    FiDollarSign,
    FiCheckCircle,
    FiChevronRight,
    FiChevronLeft,
    FiCamera,
    FiPlus,
    FiSearch,
    FiGrid,
    FiList,
    FiShoppingCart,
    FiUser,
    FiCreditCard,
    FiX,
    FiLayers,
    FiBox,
    FiClipboard,
    FiTag,
    FiPercent,
    FiPieChart,
    FiLock,
    FiFolder,
    FiChevronDown,
    FiEdit2,
    FiTrash2,
    FiCheckSquare,
    FiCheck,
    FiInfo,
    FiRefreshCw,
    FiStar
} from "react-icons/fi";

// Mock Data for List View
const CATEGORIES = [
    { id: "cosmetics", labelKey: "article.categories.cosmetics" },
    { id: "drinks", labelKey: "article.categories.drinks" },
    { id: "cards", labelKey: "article.categories.cards" },
    { id: "hygiene", labelKey: "article.categories.hygiene" },
    { id: "groupon", labelKey: "article.categories.groupon" },
    { id: "others", labelKey: "article.categories.others" },
];

// import { API_BASE } from "../config/api"; // Commented out to prevent resolution issues

// Recursive Tree Component
const RecursiveArticleTree = ({ groups, articles, selectedIds, onSelectionChange, isDark, t, lang }) => {
    // Helper to build tree data
    const treeRoot = React.useMemo(() => {
        const root = { id: 'root', name: t(lang, "article.contingents.labels.allArticles") || 'Alle Artikel', children: [], articles: [] };
        const groupMap = new Map();

        // Initialize group nodes
        groups.forEach(g => {
            groupMap.set(g.id, { ...g, children: [], articles: [] });
        });

        // Assign articles to groups
        articles.forEach(a => {
            const gId = a.group || a.category || a.productGroup;
            if (groupMap.has(gId)) {
                groupMap.get(gId).articles.push(a);
            } else {
                root.articles.push(a);
            }
        });

        // Build hierarchy
        groupMap.forEach(node => {
            if (node.parent && groupMap.has(node.parent) && node.parent !== 'all') {
                groupMap.get(node.parent).children.push(node);
            } else {
                root.children.push(node);
            }
        });
        return root;
    }, [groups, articles, t, lang]);

    // Helper to get all IDs
    const getAllIds = (node) => {
        let ids = node.articles.map(a => a.id);
        node.children.forEach(child => {
            ids = [...ids, ...getAllIds(child)];
        });
        return ids;
    };

    const TreeNode = ({ node, level = 0 }) => {
        const [expanded, setExpanded] = useState(true);
        const allNodeIds = getAllIds(node);
        const hasContent = allNodeIds.length > 0;

        // Selection State
        const selectedCount = allNodeIds.filter(id => selectedIds.includes(id)).length;
        const isSelected = hasContent && selectedCount === allNodeIds.length;
        const isIndeterminate = selectedCount > 0 && selectedCount < allNodeIds.length;

        const handleToggle = (e) => {
            e.stopPropagation();
            let next;
            if (isSelected) {
                // Deselect all
                next = selectedIds.filter(id => !allNodeIds.includes(id));
            } else {
                // Select all (union)
                next = [...new Set([...selectedIds, ...allNodeIds])];
            }
            onSelectionChange(next);
        };

        if (!hasContent && node.children.length === 0 && node.articles.length === 0) return null;

        return (
            <div className="select-none">
                <div
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                    style={{ paddingLeft: `${level * 16 + 4}px` }}
                    onClick={() => setExpanded(!expanded)}
                >
                    {/* Arrow */}
                    <div className="w-4 flex justify-center text-slate-400">
                        {(node.children.length > 0 || node.articles.length > 0) && (
                            expanded ? <FiChevronDown /> : <FiChevronRight />
                        )}
                    </div>

                    {/* Checkbox */}
                    <div
                        className={`w-4 h-4 border rounded flex items-center justify-center mr-1 ${isSelected ? "bg-sky-500 border-sky-500 text-white" : isDark ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-white"} ${isIndeterminate ? "bg-sky-200 border-sky-200" : ""}`}
                        onClick={handleToggle}
                    >
                        {isSelected && <FiCheck size={12} />}
                        {isIndeterminate && <div className="w-2 h-0.5 bg-sky-600" />}
                    </div>

                    <span className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{node.name || node.labelKey}</span>
                </div>

                {expanded && (
                    <div>
                        {node.children.map(child => <TreeNode key={child.id} node={child} level={level + 1} />)}
                        {node.articles.map(article => {
                            const isArtSelected = selectedIds.includes(article.id);
                            return (
                                <div
                                    key={article.id}
                                    className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                                    style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isArtSelected) {
                                            onSelectionChange(selectedIds.filter(id => id !== article.id));
                                        } else {
                                            onSelectionChange([...selectedIds, article.id]);
                                        }
                                    }}
                                >
                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${isArtSelected ? "bg-sky-500 border-sky-500 text-white" : isDark ? "border-slate-600 bg-slate-800" : "border-slate-300 bg-white"}`}>
                                        {isArtSelected && <FiCheck size={12} />}
                                    </div>
                                    <span className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{article.articleName}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return <TreeNode node={treeRoot} />;
};

function ArticleManagement({ theme, onNavigate }) {
    const isDark = theme === "dark";
    const { language } = useLanguage();
    const lang = language || "en";
    const API_BASE = "https://backend-two-orpin-12.vercel.app"; // Hardcoded for stability
    const { addToast } = useToast();

    const [view, setView] = useState("dashboard"); // 'dashboard' | 'list' | 'create'
    const [selectedCategory, setSelectedCategory] = useState("cosmetics"); // 'all' or categoryId
    const [searchTerm, setSearchTerm] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash' | 'card'



    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
        revenueAccount: "8400 (Umsatzerlöse (Studio) 19%)",
        taxType: "",
        productGroup: "allArticles",
        articleName: "",
        articleNo: "",
        description: "",
        barcode: "",
        unit: "piece", // piece or time
        rightsLevel: 0,
        allowFreePrice: false,
        allowNegativePrice: false,
        hideAmount: false,
        specialFunction: "none",
        fileRequired: false,
        validPeriod: false,
        generalDiscount: 0,
        stockable: false,
        statisticalSales: false,
        category: "cosmetics"
    });

    const [prices, setPrices] = useState([
        { unit: 1, price: 0.00 }
    ]);

    // --- CONTINGENT STATE ---
    const [contingents, setContingents] = useState([]);
    const [contingentFormData, setContingentFormData] = useState({
        name: "",
        organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
        currency: "EUR",
        accountType: "passive",
        deductionPriority: "highest",
        validityDuration: 99,
        validityUnit: "years",
        triggerArticleId: "",
        quotaType: "",
        usableArticles: []
    });

    // Local state for dropdown search
    const [triggerSearchTerm, setTriggerSearchTerm] = useState("");

    // --- GROUP MANAGEMENT STATE ---
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupFormData, setGroupFormData] = useState({
        name: "",
        organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
        parent: "all", // 'all' or specific group ID
        description: "",
        showInPos: false,
        manualDiscount: false,
        color: "#ffffff",
        order: 9999999
    });

    const [groups, setGroups] = useState([]);
    const [groupSearchTerm, setGroupSearchTerm] = useState("");

    // --- INVENTORY STATE ---
    const [inventoryLogs, setInventoryLogs] = useState([]);
    const [bookingData, setBookingData] = useState({
        type: "bookIn", // bookIn, bookOut, correction
        amount: 0,
        remark: "",
        date: new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
    });

    // --- STOCK TAKING WIZARD STATE ---
    const [stockWizardStep, setStockWizardStep] = useState(1);

    const [stockTakingData, setStockTakingData] = useState({}); // { articleId: newStockAmount }
    const [showHiddenArticles, setShowHiddenArticles] = useState(false);

    // --- UNIT MANAGEMENT STATE ---
    const [units, setUnits] = useState([]);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [unitFormData, setUnitFormData] = useState({ name: "", code: "" });

    // --- API CALLS (FIRESTORE) ---
    useEffect(() => {
        fetchArticles();
        fetchGroups();
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            const snap = await getDocs(collection(db, "articleUnits"));
            setUnits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.error("Error fetching units:", e);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "articles"));
            const articlesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setArticles(articlesData);
        } catch (err) {
            console.error("Error fetching articles:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "groups"));
            const groupsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Transform flat list to tree structure
            const buildTree = (parentId) => {
                return groupsData
                    .filter(g => g.parent === parentId)
                    .map(g => ({
                        ...g,
                        children: buildTree(g.id)
                    }));
            };

            // Defines root structure with fetched children
            const rootChildren = buildTree("all");
            // Always ensure root exists
            const rootGroup = {
                id: "all",
                name: "Alle Artikel",
                owner: "ROOT (ROOT)",
                children: rootChildren
            };

            setGroups([rootGroup]);

        } catch (err) {
            console.error("Error fetching groups:", err);
        }
    };

    const fetchInventoryLogs = async (articleId) => {
        try {
            const q = query(collection(db, "inventoryLogs"), where("articleId", "==", articleId), orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInventoryLogs(logs);
        } catch (err) {
            console.error("Error fetching inventory logs:", err);
        }
    };
    // Fetch Contingents
    const fetchContingents = async () => {
        try {
            const q = query(collection(db, "contingents"), orderBy("name"));
            const snapshot = await getDocs(q);
            setContingents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Error fetching contingents:", err);
        }
    };

    useEffect(() => {
        if (view === "contingent-list") {
            fetchContingents();
        }
    }, [view]);

    // Initial Load
    useEffect(() => {
        if (view === "inventory-detail" && formData.id) {
            fetchInventoryLogs(formData.id);
        }
    }, [view, formData.id]);

    const handleEditGroup = (group) => {
        setGroupFormData({
            id: group.id,
            name: group.name || "",
            organization: group.owner || "Sonnenstudio Suntime No.1 (SONNE0542)",
            parent: group.parent || "all",
            description: group.description || "",
            showInPos: group.showInPos || false,
            manualDiscount: group.manualDiscount || false,
            color: group.color || "#ffffff",
            order: group.order || 9999999
        });
        setShowGroupModal(true);
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm(t(lang, "article.messages.confirmDelete") || "Sind Sie sicher?")) return;
        try {
            await deleteDoc(doc(db, "groups", groupId));
            fetchGroups();
        } catch (err) {
            console.error(err);
            console.error(err);
            addToast("Error deleting group", 'error');
        }
    };

    const handleListArticles = (group) => {
        setSelectedCategory(group.id);
        setView("list");
    };

    const steps = [
        { id: 1, label: t(lang, "article.steps.step1"), icon: FiFileText },
        { id: 2, label: t(lang, "article.steps.step2"), icon: FiFileText },
        { id: 3, label: t(lang, "article.steps.step3"), icon: FiDollarSign },
        { id: 4, label: t(lang, "article.steps.step4"), icon: FiCheckCircle },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handlePriceChange = (index, field, value) => {
        const newPrices = [...prices];
        newPrices[index][field] = value;
        setPrices(newPrices);
    };

    const addPriceRow = () => {
        setPrices([...prices, { unit: 1, price: 0.00 }]);
    };

    const removePriceRow = (index) => {
        if (prices.length > 1) {
            setPrices(prices.filter((_, i) => i !== index));
        }
    };

    // --- CART FUNCTIONS ---
    const addToCart = (article) => {
        const existingItem = cart.find(item => item.id === article.id);
        const price = article.prices?.[0]?.price ? Number(article.prices[0].price) : 0;

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === article.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...article, quantity: 1, currentPrice: price }]);
        }
    };

    const removeFromCart = (articleId) => {
        setCart(cart.filter(item => item.id !== articleId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);

    const handleSave = async () => {
        setLoading(true);
        // Combine form data and prices
        const payload = {
            ...formData,
            prices,
            updatedAt: new Date().toISOString()
        };

        try {
            if (formData.id) {
                // Update existing
                const docRef = doc(db, "articles", formData.id);
                await updateDoc(docRef, payload);
            } else {
                // Create new
                await addDoc(collection(db, "articles"), {
                    ...payload,
                    createdAt: new Date().toISOString()
                });
            }

            await fetchArticles(); // Refresh list
            handleAbort(); // Reset and go back to list
        } catch (err) {
            console.error("Error saving article:", err);
            console.error("Error saving article:", err);
            addToast("Error saving article: " + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (article) => {
        setFormData({
            ...article,
            // Ensure compatibility with form structure
            prices: article.prices || [{ unit: 1, price: 0.00 }]
        });
        setPrices(article.prices || [{ unit: 1, price: 0.00 }]);
        setCurrentStep(1);
        setView("create");
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setLoading(true);
        try {
            await deleteDoc(doc(db, "articles", deleteId));
            await fetchArticles();
        } catch (err) {
            console.error("Error deleting article:", err);
            console.error("Error deleting article:", err);
            addToast("Error deleting article: " + err.message, 'error');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    const generateArticleNo = (e) => {
        e.preventDefault();
        let isUnique = false;
        let newId = "";

        // Safety break after 100 tries
        for (let i = 0; i < 100; i++) {
            const randomPart = Math.floor(100000 + Math.random() * 900000); // 6 digit random
            newId = `ART-${randomPart}`;

            // Check uniqueness against existing articles
            const exists = articles.some(a => a.articleNo === newId);
            if (!exists) {
                isUnique = true;
                break;
            }
        }

        if (isUnique) {
            setFormData(prev => ({ ...prev, articleNo: newId }));
        } else {
            addToast("Could not generate a unique ID. Please try again.", 'error');
        }
    };

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else setView("list");
    };

    const handleAbort = () => {
        setView("list");
        setCurrentStep(1);
        setFormData({
            organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
            revenueAccount: "8400 (Umsatzerlöse (Studio) 19%)",
            taxType: "",
            productGroup: "allArticles",
            articleName: "",
            articleNo: "",
            description: "",
            barcode: "",
            unit: "piece",
            rightsLevel: 0,
            allowFreePrice: false,
            allowNegativePrice: false,
            hideAmount: false,
            specialFunction: "none",
            fileRequired: false,
            validPeriod: false,
            generalDiscount: 0,
            stockable: false,
            statisticalSales: false,
            category: selectedCategory === "all" ? "cosmetics" : selectedCategory // Default to cosmetics if 'all' is selected
        });
        setPrices([{ unit: 1, price: 0.00 }]);
    };

    const labelClass = "block text-xs font-medium text-slate-500 mb-1";
    const inputClass = `w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-sky-500 ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-600" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`;
    const toggleClass = (checked) => `w-10 h-5 rounded-full flex items-center transition-colors duration-300 cursor-pointer ${checked ? "bg-emerald-500" : (isDark ? "bg-slate-700" : "bg-slate-300")}`;
    const knobClass = (checked) => `w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-1"}`;

    // --- RENDER FUNCTIONS ---

    // Filter articles based on selected category and search term
    // Helper to find the selected group object for name matching
    // Note: This helps match legacy articles that used category names (e.g. "drinks") instead of IDs
    const selectedGroup = groups.length > 0 && groups[0].children
        ? groups[0].children.find(g => g.id === selectedCategory)
        : null;

    const filteredArticles = articles.filter(a => {
        const matchesCategory = selectedCategory === "all" ||
            a.category === selectedCategory ||
            (selectedGroup && a.category && a.category.toLowerCase() === selectedGroup.name.toLowerCase());

        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
            (a.articleName && a.articleName.toLowerCase().includes(lowerSearch)) ||
            (a.articleNo && a.articleNo.toLowerCase().includes(lowerSearch));
        return matchesCategory && matchesSearch;
    });

    const renderListView = () => (
        <div className="space-y-6">
            {/* Header & Actions */}
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView("dashboard")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-500" : "bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 border border-slate-200 hover:border-sky-200 shadow-sm hover:shadow"}`}
                        title="Back to Dashboard"
                    >
                        <FiChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{t(lang, "article.messages.back") || "Zurück"}</span>
                    </button>
                    <h1 className="text-2xl font-bold">{t(lang, "article.headers.addArticleData").replace("Add Article Data", "Artikel verwalten")}</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-wrap">
                    <div className={`relative flex items-center ${isDark ? "bg-slate-900" : "bg-white"} rounded-md border border-slate-700 px-3 py-1.5 w-full sm:w-auto`}>
                        <FiSearch className="text-slate-500 mr-2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t(lang, "article.list.searchPlaceholder")}
                            className="bg-transparent text-sm outline-none w-full sm:w-48"
                        />
                    </div>
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors w-full sm:w-auto text-center ${selectedCategory === "all" ? "bg-sky-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>
                        {t(lang, "article.list.viewAll")}
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1">
                {/* All Tab */}
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 text-xs font-bold uppercase flex-1 min-w-[100px] transition-colors rounded-sm
                        ${selectedCategory === "all"
                            ? (isDark ? "bg-sky-600 text-white" : "bg-sky-500 text-white shadow-md transform scale-105 z-10")
                            : (isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}
                    `}
                >
                    {t(lang, "article.list.viewAll")}
                </button>

                {/* Dynamic Tabs from Groups */}
                {groups[0]?.children?.map(group => {
                    const isSelected = selectedCategory === group.id;
                    const isWhite = group.color?.toLowerCase() === '#ffffff' || group.color?.toLowerCase() === '#fff';

                    return (
                        <button
                            key={group.id}
                            onClick={() => setSelectedCategory(group.id)}
                            style={isSelected ? {
                                backgroundColor: group.color || '#3b82f6',
                                borderColor: group.color || '#3b82f6',
                                color: isWhite ? '#1e293b' : '#ffffff' // Dark slate text for white bg, white otherwise
                            } : {}}
                            className={`px-3 py-1.5 text-xs font-bold uppercase flex-1 min-w-[100px] transition-colors border rounded-sm
                                ${isSelected
                                    ? "shadow-md transform scale-105 z-10"
                                    : (isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200")}
                            `}
                        >
                            {group.name}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
                {/* Main Grid */}
                <div className={`order-2 lg:order-1 lg:col-span-9 p-4 rounded-lg overflow-y-auto min-h-[500px] ${isDark ? "bg-slate-900" : "bg-white border border-slate-200"}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {/* Loading State */}
                        {loading && <div className="col-span-4 text-center py-10">{t(lang, "article.articles.loading") || "Loading articles..."}</div>}

                        {/* Empty State */}
                        {!loading && filteredArticles.length === 0 && (
                            <div className="col-span-4 text-center py-10 text-slate-500">{t(lang, "article.articles.noArticlesFound") || "No articles found in this category."}</div>
                        )}

                        {/* Article Cards */}
                        {/* Article Cards */}
                        {!loading && filteredArticles.map(item => (
                            <div
                                key={item.id}
                                className={`relative group p-4 rounded-xl flex flex-col justify-between transition-all duration-300 border
                                ${isDark ? "bg-slate-800/50 border-slate-700 hover:border-sky-500/50 hover:bg-slate-800 hover:shadow-lg hover:shadow-sky-500/10" : "bg-white border-slate-200 hover:border-sky-200 hover:shadow-lg hover:-translate-y-1"}`}
                            >
                                {/* Stock Badge */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${item.stock > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}></div>
                                        {item.stock > 0 ? `${item.stock}` : "0"}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="text-left">
                                    <h3 className={`font-bold text-sm mb-1 leading-tight ${isDark ? "text-slate-100" : "text-slate-700"}`}>{item.articleName}</h3>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.description || "No description available"}</p>

                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-lg font-bold ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                                            € {Number(item.prices?.[0]?.price || 0).toFixed(2)}
                                        </span>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }}
                                            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 transition-transform active:scale-95"
                                            title="Add to Cart"
                                        >
                                            <FiPlus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Card Button */}
                        <div
                            onClick={() => {
                                setFormData(prev => ({ ...prev, category: selectedCategory })); // Pre-select current category
                                setView("create");
                            }}
                            className={`aspect-square p-4 rounded-md flex flex-col justify-center items-center text-center cursor-pointer transition border-2 border-dashed
                                ${isDark ? "border-slate-700 hover:border-sky-500 text-slate-500 hover:text-sky-500" : "border-slate-300 hover:border-sky-500 text-slate-400 hover:text-sky-500"}`}>
                            <FiPlus className="text-3xl mb-2" />
                            <span className="text-xs font-bold">{t(lang, "article.list.newArticle")}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel (Warenkorb / Summary) */}
                <div className={`order-1 lg:order-2 lg:col-span-3 p-4 rounded-lg flex flex-col h-auto lg:h-full overflow-hidden ${isDark ? "bg-slate-900" : "bg-white border border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-4 border-b pb-4 border-dashed border-slate-700">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{t(lang, "article.list.cart")}</h3>
                            <button className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-sky-400 transition-colors" title="Select Customer">
                                <FiUser size={16} />
                            </button>
                        </div>
                        <button
                            onClick={clearCart}
                            className="text-xs bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-full transition-all"
                        >
                            {t(lang, "article.list.empty") || "Clear"}
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <FiList className="text-4xl mb-2 opacity-20" />
                                <span className="text-sm">{t(lang, "article.list.noArticles")}</span>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className={`relative p-3 rounded-xl flex flex-col gap-2 group transition-all duration-200 border ${isDark ? "bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-750" : "bg-white border-slate-100 hover:border-sky-100 hover:bg-sky-50 shadow-sm"}`}>
                                    {/* Top Row: Name & Remove */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className={`font-semibold text-sm leading-tight line-clamp-2 break-words ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                            {item.articleName}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 -mr-1 -mt-1 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                                            title="Entfernen"
                                        >
                                            <FiX size={16} />
                                        </button>
                                    </div>

                                    {/* Bottom Row: Quantity, Unit Price, Total */}
                                    <div className="flex items-end justify-between mt-1">
                                        <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 font-mono">
                                            <span className="flex items-center gap-1">
                                                <span className={`${isDark ? "bg-slate-700/50 text-slate-400" : "bg-slate-200 text-slate-600"} px-1.5 rounded`}>{item.quantity}x</span>
                                                <span className="opacity-70">@ {Number(item.currentPrice).toFixed(2)} €</span>
                                            </span>
                                        </div>
                                        <div className="text-base font-bold text-emerald-500 font-mono">
                                            {(item.quantity * item.currentPrice).toFixed(2)} €
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total & Checkout */}
                    <div className="mt-4 pt-4 border-t border-dashed border-slate-600">
                        <div className="flex justify-between items-center text-lg font-bold mb-4">
                            <span>Total</span>
                            <span className="text-emerald-500">€ {cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => cart.length > 0 && setView("checkout")}
                            disabled={cart.length === 0}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded text-sm font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Button (Alternative) */}
            <button
                onClick={() => setView("create")}
                className="fixed bottom-8 right-8 w-14 h-14 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            >
                <FiPlus className="text-2xl" />
            </button>

        </div>
    );

    const renderWizardView = () => (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t(lang, "article.headers.addArticleData")?.replace("Add Article Data", "Neuen Artikel erstellen") || "Neuen Artikel erstellen"}</h1>
                <div className="flex gap-2">
                    <button onClick={handleBack} className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm font-medium">
                        {t(lang, "article.messages.back") || "Zurück"}
                    </button>
                    <button onClick={handleAbort} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium">
                        {t(lang, "article.messages.abort")}
                    </button>
                </div>
            </div>

            {/* Wizard Steps */}
            <div className="relative flex items-center justify-between px-10">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
                {steps.map((step, idx) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    let circleClass = isDark ? "bg-slate-800 border-slate-600 text-slate-400" : "bg-white border-slate-300 text-slate-400";
                    if (isActive) circleClass = "bg-white border-sky-500 text-sky-500 ring-4 ring-sky-100";
                    if (isCompleted) circleClass = "bg-emerald-500 border-emerald-500 text-white";

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-transparent">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg z-10 transition-all ${circleClass}`}>
                                <step.icon />
                            </div>
                            <span className={`text-xs font-medium ${isActive ? (isDark ? "text-sky-400" : "text-sky-600") : "text-slate-500"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Content Card */}
            <div className={isDark ? "bg-slate-900 text-slate-100 rounded-lg shadow-sm border border-slate-800 overflow-hidden" : "bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"}>
                <div className={isDark ? "border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-900" : "border-b px-6 py-4 flex justify-between items-center bg-transparent"}>
                    <h2 className="font-bold text-lg">
                        {currentStep === 1 && t(lang, "article.headers.addArticleData")}
                        {currentStep === 2 && t(lang, "article.steps.step2")}
                        {currentStep === 3 && t(lang, "article.steps.step3")}
                        {currentStep === 4 && t(lang, "article.steps.step4")}
                    </h2>
                    {currentStep < 4 ? (
                        <button onClick={handleNext} className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded text-sm flex items-center gap-2">
                            {t(lang, "article.messages.next")} <FiChevronRight />
                        </button>
                    ) : (
                        <button onClick={handleSave} disabled={loading} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm flex items-center gap-2 disabled:opacity-50">
                            {loading ? "Saving..." : t(lang, "article.messages.save")} <FiSave />
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* STEP 1: Basic Data */}
                    {currentStep === 1 && (
                        <div className="grid gap-6">
                            {/* Same fields as before, just wrapped */}
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.organization")}</label>
                                <input type="text" name="organization" value={formData.organization} disabled className={`${inputClass} cursor-not-allowed`} />
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.revenueAccount")}</label>
                                <select name="revenueAccount" value={formData.revenueAccount} onChange={handleChange} className={inputClass}><option value="8400 (Umsatzerlöse (Studio) 19%)">{t(lang, "article.options.revenueAcc8400")}</option></select>
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "cabins.form.category")}</label>
                                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                                    {groups.length > 0 && groups[0].children ? (
                                        groups[0].children.map(group => (
                                            <option key={group.id} value={group.id}>{group.name}</option>
                                        ))
                                    ) : (
                                        <option value="others">Loading groups...</option>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.taxType")}</label>
                                <select name="taxType" value={formData.taxType} onChange={handleChange} className={inputClass}><option value="">{t(lang, "article.options.select")}</option><option value="19%">{t(lang, "article.options.tax19")}</option><option value="7%">{t(lang, "article.options.tax7")}</option></select>
                                {!formData.taxType && <p className="text-[10px] text-red-500 mt-1">{t(lang, "article.messages.fieldRequired")}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.productGroup")}</label>
                                <select name="productGroup" value={formData.productGroup} onChange={handleChange} className={inputClass}><option value="allArticles">{t(lang, "article.options.allArticles")}</option></select>
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.articleName")}</label>
                                <input type="text" name="articleName" value={formData.articleName} onChange={handleChange} placeholder={t(lang, "article.placeholders.articleName")} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.articleNo")}</label>
                                <div className="flex gap-2">
                                    <input type="text" name="articleNo" value={formData.articleNo} onChange={handleChange} placeholder={t(lang, "article.placeholders.articleNo")} className={inputClass} />
                                    <button onClick={generateArticleNo} className="px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-xs font-medium">{t(lang, "article.messages.generate")}</button>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>{t(lang, "article.fields.description")}</label>
                                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className={inputClass} />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Settings */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            {/* Row 1: Rights & Unit */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>{t(lang, "article.settings.rightsLevel")}</label>
                                    <select name="rightsLevel" value={formData.rightsLevel} onChange={handleChange} className={inputClass}>
                                        <option value={0}>{t(lang, "article.options.rightsLevel0")}</option>
                                        <option value={1}>{t(lang, "article.options.rightsLevel1")}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>{t(lang, "article.settings.unitSelection")}</label>
                                    <select name="unit" value={formData.unit} onChange={handleChange} className={inputClass}>
                                        <option value="piece">{t(lang, "article.settings.units.piece")}</option>
                                        <option value="time">{t(lang, "article.settings.units.time")}</option>
                                    </select>
                                </div>
                            </div>

                            <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

                            {/* Row 2: Toggles Grid */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Col */}
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{t(lang, "article.settings.allowFreePrice")}</span>
                                        <div onClick={() => setFormData({ ...formData, allowFreePrice: !formData.allowFreePrice })} className={toggleClass(formData.allowFreePrice)}>
                                            <div className={knobClass(formData.allowFreePrice)}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{t(lang, "article.settings.allowNegativePrice")}</span>
                                        <div onClick={() => setFormData({ ...formData, allowNegativePrice: !formData.allowNegativePrice })} className={toggleClass(formData.allowNegativePrice)}>
                                            <div className={knobClass(formData.allowNegativePrice)}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{t(lang, "article.settings.hideAmount")}</span>
                                        <div onClick={() => setFormData({ ...formData, hideAmount: !formData.hideAmount })} className={toggleClass(formData.hideAmount)}>
                                            <div className={knobClass(formData.hideAmount)}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t(lang, "article.settings.specialFunction")}</label>
                                        <select name="specialFunction" value={formData.specialFunction} onChange={handleChange} className={inputClass}>
                                            <option value="none">{t(lang, "article.settings.functions.none")}</option>
                                            <option value="contingent">{t(lang, "article.settings.functions.contingent")}</option>
                                            <option value="emptyBooking">{t(lang, "article.settings.functions.emptyBooking")}</option>
                                            <option value="module">{t(lang, "article.settings.functions.module")}</option>
                                            <option value="device">{t(lang, "article.settings.functions.device")}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Col */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm w-32">{t(lang, "article.settings.generalDiscount")}:</span>
                                        <div className="flex items-center gap-2 bg-transparent border rounded px-2 py-1 w-24">
                                            <input type="number" name="generalDiscount" value={formData.generalDiscount} onChange={handleChange} className="w-full bg-transparent outline-none text-right" />
                                            <span>%</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{t(lang, "article.settings.stockable")}</span>
                                        <div onClick={() => setFormData({ ...formData, stockable: !formData.stockable })} className={toggleClass(formData.stockable)}>
                                            <div className={knobClass(formData.stockable)}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{t(lang, "article.settings.statisticalSales")}</span>
                                        <div onClick={() => setFormData({ ...formData, statisticalSales: !formData.statisticalSales })} className={toggleClass(formData.statisticalSales)}>
                                            <div className={knobClass(formData.statisticalSales)}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Pricing */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="font-bold">{t(lang, "article.pricing.header")}</h3>
                                <div className="flex gap-4">
                                    <select className={`px-2 py-1 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
                                        <option>{t(lang, "article.options.currencyEur")}</option>
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">{t(lang, "article.pricing.fixedUnitSize")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Table */}
                            <div className={`border rounded-lg overflow-hidden ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                                <table className="w-full text-sm text-left">
                                    <thead className={isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"}>
                                        <tr>
                                            <th className="px-4 py-3">{t(lang, "article.pricing.unit")}</th>
                                            <th className="px-4 py-3">{t(lang, "article.pricing.price")}</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {prices.map((row, idx) => (
                                            <tr key={idx} className={isDark ? "bg-slate-900" : "bg-white"}>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={row.unit}
                                                        onChange={(e) => handlePriceChange(idx, "unit", e.target.value)}
                                                        className={`w-24 px-2 py-1 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => handlePriceChange(idx, "price", e.target.value)}
                                                            className={`w-32 px-2 py-1 rounded border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}`}

                                                        />
                                                        <span>€</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button onClick={() => removePriceRow(idx)} className="text-red-500 hover:text-red-400">
                                                        <FiPlus className="transform rotate-45 text-xl" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-2 bg-opacity-10 bg-slate-500">
                                    <button onClick={addPriceRow} className="w-full py-2 flex justify-center items-center gap-2 text-sky-500 font-medium hover:bg-sky-500/10 rounded">
                                        <FiPlus /> {t(lang, "article.pricing.addPrice")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Confirmation */}
                    {currentStep === 4 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl mb-4">
                                <FiCheckCircle />
                            </div>
                            <h2 className="text-2xl font-bold">{t(lang, "article.headers.addArticleData")}</h2>
                            <p className="text-slate-500 max-w-md">Article configuration for <strong>{formData.articleName}</strong> is ready to be saved.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );

    const renderTableView = () => (
        <div className={`w-full rounded-xl shadow-lg border overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            {/* Header */}
            <div className={`p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setSelectedCategory("cosmetics")} // Reset to default category to go back
                        className={`p-2 rounded-full transition-colors ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                        title={t(lang, "article.messages.back") || "Back"}
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-emerald-400">
                        {t(lang, "article.list.viewAll")}
                    </h2>
                </div>

                <div className={`relative flex items-center ${isDark ? "bg-slate-800" : "bg-slate-50"} rounded-full border border-slate-700 px-4 py-2 w-full lg:w-auto`}>
                    <FiSearch className="text-slate-500 mr-2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t(lang, "article.list.searchPlaceholder")}
                        className="bg-transparent text-sm outline-none w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase font-semibold tracking-wider ${isDark ? "bg-slate-950 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                        <tr>
                            <th className="px-6 py-4">Article No</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? "divide-slate-800" : "divide-slate-100"}`}>
                        {filteredArticles.map(article => (
                            <tr key={article.id} className={`transition-colors duration-200 group ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                <td className="px-6 py-4 font-mono text-slate-500">{article.articleNo || "-"}</td>
                                <td className="px-6 py-4 font-medium">{article.articleName}</td>
                                <td className={`px-6 py-4 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                                    {(() => {
                                        // 1. Try to find dynamic group
                                        const group = groups[0]?.children?.find(g => g.id === article.category);
                                        // 2. Or match by name (legacy)
                                        const groupByName = groups[0]?.children?.find(g => g.name.toLowerCase() === article.category?.toLowerCase());

                                        // 3. Fallback to translation for hardcoded categories
                                        if (group) return <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-800"}`}>{group.name}</span>;
                                        if (groupByName) return <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-800"}`}>{groupByName.name}</span>;

                                        // 4. Fallback to translating key if it starts with "article.categories"
                                        const isKey = article.category?.startsWith("article.categories");
                                        if (isKey) return <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-800"}`}>{t(lang, article.category)}</span>;

                                        // 5. Final fallback - just show the string or "Uncategorized"
                                        return <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-800"}`}>{article.category || "Uncategorized"}</span>;
                                    })()}
                                </td>
                                <td className="px-6 py-4 font-bold text-sky-500">
                                    {article.prices && article.prices.length > 0 ? `€ ${Number(article.prices[0].price).toFixed(2)}` : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${article.stockable ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>
                                        {article.stockable ? (article.stock || "∞") : "N/A"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(article)} className="p-2 bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white rounded transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(article.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredArticles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                                    <FiSearch className="text-4xl mb-4 opacity-20" />
                                    <span>No articles found.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const handleCheckout = () => {
        // Here you would process the payment
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert(t(lang, "article.options.paymentSuccess"));
            clearCart();
            setView("list");
        }, 1500);
    };

    const renderCheckoutView = () => {
        const vatRate = 19;
        const netTotal = cartTotal / (1 + (vatRate / 100));
        const vatAmount = cartTotal - netTotal;

        return (
            <div className={`p-4 min-h-[500px] flex items-center justify-center ${isDark ? "bg-slate-950" : "bg-slate-100"}`}>
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT: Receipt / Digital Bill */}
                    <div className={`rounded-2xl overflow-hidden shadow-xl flex flex-col h-[400px] transform transition-all duration-500 hover:scale-[1.01] ${isDark ? "bg-slate-900 shadow-black/50" : "bg-white shadow-slate-200"}`}>

                        {/* Green Customer Header (Simplified) */}
                        <div className="bg-emerald-600 text-white p-2.5 flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                                    <FiUser size={20} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm bg-black/10 px-3 py-1.5 rounded-full opacity-90">
                                <FiGrid size={14} /> <span className="font-mono text-xs">{new Date().toLocaleDateString('de-DE')}</span>
                            </div>
                        </div>

                        {/* Title Row */}
                        <div className={`px-6 py-4 flex justify-between items-center border-b ${isDark ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
                            <h3 className="font-bold text-lg uppercase tracking-wider opacity-60">{t(lang, "article.list.cart")}</h3>
                            <div className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                <FiList />
                            </div>
                        </div>

                        {/* Items Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {cart.map((item, idx) => (
                                <div key={idx} className={`flex justify-between items-start group p-2 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{item.articleName}</div>
                                        <div className="text-sm opacity-60 mt-1 flex items-center gap-2">
                                            <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-mono">{item.quantity}x</span>
                                            <span>@ {Number(item.currentPrice).toFixed(2).replace('.', ',')} €</span>
                                        </div>
                                    </div>
                                    <div className="text-right font-bold text-xl font-mono">
                                        {Number(item.currentPrice * item.quantity).toFixed(2).replace('.', ',')} €
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Total Section */}
                        <div className={`p-8 mt-auto relative overflow-hidden ${isDark ? "bg-slate-800" : "bg-[#f0f0f0]"}`}>
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-lg opacity-70">{t(lang, "article.options.totalToPay")}</span>
                                    <span className="font-bold text-3xl tracking-tight text-emerald-600 dark:text-emerald-400">
                                        {cartTotal.toFixed(2).replace('.', ',')} €
                                    </span>
                                </div>
                                <div className="text-left text-xs opacity-50 font-mono">
                                    {t(lang, "article.options.vatIncluded", { rate: 19 })} {vatAmount.toFixed(2).replace('.', ',')} €
                                </div>
                            </div>
                            {/* Decorative overlap circles */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* RIGHT: Payment Actions */}
                    <div className="flex flex-col justify-center gap-6">
                        <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.options.paymentMethod")}
                        </h2>

                        <div className="grid grid-cols-2 gap-6 flex-1 max-h-[300px]">
                            <button
                                onClick={() => { setPaymentMethod("cash"); handleCheckout(); }}
                                className="group relative bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-b-0 active:translate-y-1 py-4"
                            >
                                <div className="p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <FiDollarSign size={28} />
                                </div>
                                <span className="text-lg font-bold tracking-wide">{t(lang, "article.options.cash")}</span>
                            </button>

                            <button
                                onClick={() => { setPaymentMethod("card"); handleCheckout(); }}
                                className="group relative bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 border-b-4 border-emerald-800 hover:border-emerald-700 active:border-b-0 active:translate-y-1 py-4"
                            >
                                <div className="p-2 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    <FiCreditCard size={28} />
                                </div>
                                <span className="text-lg font-bold tracking-wide">{t(lang, "article.options.card")}</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setView("list")}
                            className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800"}`}
                        >
                            <FiX size={18} />
                            {t(lang, "article.messages.abort")}
                        </button>

                        <div className="text-center text-xs opacity-40 mt-4">
                            Secure Payment Processing • POS System v2.4
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCheckoutViewOld = () => {
        const vatRate = 19;
        const netTotal = cartTotal / (1 + (vatRate / 100));
        const vatAmount = cartTotal - netTotal;

        return (
            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)] max-h-[800px] p-2">

                {/* LEFT: Receipt / Cart Summary */}
                <div className={`flex-1 flex flex-col rounded-lg shadow-lg overflow-hidden ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border text-slate-800"}`}>
                    {/* Header Info */}
                    <div className="p-3 border-b text-lg font-bold flex justify-between items-center bg-transparent">
                        <span>{t(lang, "article.list.cart")}</span>
                        <FiGrid className="opacity-50" />
                    </div>

                    {/* Customer Header (Green) */}
                    <div className="bg-emerald-600 text-white p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FiUser size={18} />
                            <span className="font-bold">Frau Maxima Mustermann</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-90">
                            <FiGrid /> <span>01.02.1990</span>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDark ? "bg-slate-900" : "bg-[#f5f5f5]"}`}>
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-gray-300 pb-2 last:border-0 text-sm">
                                <div className="flex-1">
                                    <div className="font-medium text-slate-700 dark:text-slate-300">{item.articleName}</div>
                                    <div className="text-xs text-slate-500 mt-1">{item.quantity} Stk.</div>
                                </div>
                                <div className="text-right font-bold text-slate-800 dark:text-slate-200">
                                    {Number(item.currentPrice * item.quantity).toFixed(2).replace('.', ',')} €
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals Section */}
                    <div className={`p-4 border-t ${isDark ? "bg-slate-800 border-slate-700" : "bg-[#e5e5e0] border-slate-300"}`}>
                        <div className="flex justify-between items-end mb-1">
                            <span className="font-bold text-lg">{t(lang, "article.options.totalToPay")}</span>
                            <span className="font-bold text-2xl text-slate-800 dark:text-white">
                                {cartTotal.toFixed(2).replace('.', ',')} €
                            </span>
                        </div>
                        <div className="text-left text-xs text-slate-500 italic">
                            {t(lang, "article.options.vatIncluded", { rate: 19 })} {vatAmount.toFixed(2).replace('.', ',')} €
                        </div>
                    </div>
                </div>

                {/* RIGHT: Payment Actions */}
                <div className="md:w-1/2 flex flex-col justify-center gap-4">
                    <div className="grid grid-cols-2 gap-4 h-40">
                        <button
                            onClick={() => { setPaymentMethod("cash"); handleCheckout(); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-md flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <FiDollarSign size={32} />
                            <span className="text-xl font-bold">{t(lang, "article.options.cash")}</span>
                        </button>

                        <button
                            onClick={() => { setPaymentMethod("card"); handleCheckout(); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-md flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            <FiCreditCard size={32} />
                            <span className="text-xl font-bold">{t(lang, "article.options.card")}</span>
                        </button>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={() => setView("list")}
                            className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded font-bold uppercase tracking-wider transition-colors"
                        >
                            {t(lang, "article.messages.abort")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- CONTINGENT HANDLERS ---
    const handleContingentSave = async () => {
        // Validation
        if (!contingentFormData.name) {
            alert(t(lang, "article.contingents.errors.required"));
            return;
        }
        if (!contingentFormData.quotaType) {
            alert(t(lang, "article.contingents.errors.required"));
            return;
        }

        try {
            if (contingentFormData.id) {
                await updateDoc(doc(db, "contingents", contingentFormData.id), {
                    ...contingentFormData,
                    validityDuration: Number(contingentFormData.validityDuration) || 99,
                    updatedAt: new Date().toISOString()
                });
            } else {
                await addDoc(collection(db, "contingents"), {
                    ...contingentFormData,
                    validityDuration: Number(contingentFormData.validityDuration) || 99,
                    createdAt: new Date().toISOString()
                });
            }
            await fetchContingents();
            // alert(t(lang, "article.contingents.messages.saveSuccess") || "Quota saved successfully!");
            setView("contingent-list");
        } catch (err) {
            console.error("Error saving contingent:", err);
            alert("Error saving: " + err.message);
        }
    };

    const handleContingentEdit = (contingent) => {
        setContingentFormData({
            ...contingent,
            // Ensure numeric fields are numbers
            validityDuration: Number(contingent.validityDuration) || 99
        });

        // Set search term for dropdown if trigger article exists
        if (contingent.triggerArticleId) {
            const a = articles.find(x => x.id === contingent.triggerArticleId);
            setTriggerSearchTerm(a ? a.articleName : "");
        } else {
            setTriggerSearchTerm("");
        }

        setView("contingent-create");
    };

    const handleContingentDelete = async (id) => {
        if (!window.confirm("Delete this quota?")) return;
        try {
            await deleteDoc(doc(db, "contingents", id));
            await fetchContingents();
        } catch (err) {
            console.error(err);
        }
    };

    const renderContingentListView = () => {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("dashboard")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.contingents.header")}
                        </h1>
                    </div>
                    <button onClick={() => {
                        setContingentFormData({
                            name: "",
                            organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
                            currency: "",
                            accountType: "passive",
                            deductionPriority: "highest",
                            validityDuration: 99,
                            validityUnit: "years",
                            triggerArticleId: "",
                            quotaType: "",
                            usableArticles: []
                        });
                        setView("contingent-create");
                    }} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                        <FiPlus /> {t(lang, "article.contingents.buttons.add")}
                    </button>
                </div>

                <div className={`rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                            <tr>
                                <th className="px-6 py-4">{t(lang, "article.contingents.fields.designation")}</th>
                                <th className="px-6 py-4">{t(lang, "article.contingents.fields.currency")}</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {contingents.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                        No contingencies found.
                                    </td>
                                </tr>
                            ) : contingents.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 font-medium">{c.name}</td>
                                    <td className="px-6 py-4">{c.currency}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleContingentEdit(c)} className="px-3 py-1 bg-sky-500 text-white rounded text-xs">{t(lang, "article.contingents.buttons.details")}</button>
                                        <button onClick={() => handleContingentDelete(c.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs">{t(lang, "article.contingents.buttons.delete")}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderContingentCreateView = () => {
        const toggleUsableArticle = (id) => {
            const current = contingentFormData.usableArticles || [];
            if (current.includes(id)) {
                setContingentFormData({ ...contingentFormData, usableArticles: current.filter(x => x !== id) });
            } else {
                setContingentFormData({ ...contingentFormData, usableArticles: [...current, id] });
            }
        };

        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("contingent-list")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.contingents.createTitle")}
                        </h1>
                    </div>
                    <button onClick={handleContingentSave} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                        <FiSave /> {t(lang, "article.contingents.buttons.save")}
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Basic Data */}
                    <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                        <h3 className={`font-bold mb-4 border-b pb-2 ${isDark ? "border-slate-700 text-slate-200" : "border-slate-100 text-slate-800"}`}>{t(lang, "article.contingents.sections.basicData")}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.org")}</label>
                                <input type="text" disabled value={contingentFormData.organization} className={`w-full p-2 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`} />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.designation")}</label>
                                <input
                                    type="text"
                                    className={`w-full p-2 rounded border ${!contingentFormData.name ? "border-red-500" : isDark ? "border-slate-600" : "border-slate-300"} ${isDark ? "bg-slate-800 text-white focus:border-sky-500" : "bg-white text-slate-900 focus:border-sky-500"}`}
                                    value={contingentFormData.name}
                                    onChange={(e) => setContingentFormData({ ...contingentFormData, name: e.target.value })}
                                />
                                {!contingentFormData.name && <p className="text-red-500 text-xs mt-1">{t(lang, "article.contingents.errors.required")}</p>}
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.currency")}</label>
                                <select
                                    className={`w-full p-2 rounded border ${!contingentFormData.currency ? "border-red-500" : isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                    value={contingentFormData.currency}
                                    onChange={(e) => setContingentFormData({ ...contingentFormData, currency: e.target.value })}
                                >
                                    <option value="" style={isDark ? { backgroundColor: '#1e293b', color: 'white' } : {}}>{t(lang, "article.contingents.options.select")}</option>
                                    <option value="EUR" style={isDark ? { backgroundColor: '#1e293b', color: 'white' } : {}}>EUR</option>
                                    <option value="USD" style={isDark ? { backgroundColor: '#1e293b', color: 'white' } : {}}>USD</option>
                                </select>
                                {!contingentFormData.currency && <p className="text-red-500 text-xs mt-1">{t(lang, "article.contingents.errors.required")}</p>}
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.accountType")}</label>
                                <select
                                    className={`w-full p-2 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                    value={contingentFormData.accountType}
                                    onChange={(e) => setContingentFormData({ ...contingentFormData, accountType: e.target.value })}
                                >
                                    <option value="passive">{t(lang, "article.contingents.options.passiveIndex")}</option>
                                    <option value="active">{t(lang, "article.contingents.options.activeIndex")}</option>
                                    <option value="creditor">{t(lang, "article.contingents.options.creditor")}</option>
                                    <option value="debitor">{t(lang, "article.contingents.options.debitor")}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.priority")}</label>
                                <select
                                    className={`w-full p-2 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                    value={contingentFormData.deductionPriority}
                                    onChange={(e) => setContingentFormData({ ...contingentFormData, deductionPriority: e.target.value })}
                                >
                                    <option value="lowest">{t(lang, "article.contingents.options.lowest")}</option>
                                    <option value="low">{t(lang, "article.contingents.options.low")}</option>
                                    <option value="normal">{t(lang, "article.contingents.options.normal")}</option>
                                    <option value="high">{t(lang, "article.contingents.options.high")}</option>
                                    <option value="highest">{t(lang, "article.contingents.options.highest")}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.validity")}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        className={`w-20 p-2 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                        value={contingentFormData.validityDuration}
                                        onChange={(e) => setContingentFormData({ ...contingentFormData, validityDuration: e.target.value })}
                                        min="1"
                                    />
                                    <select
                                        className={`flex-1 p-2 rounded border text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                        value={contingentFormData.validityUnit}
                                        onChange={(e) => setContingentFormData({ ...contingentFormData, validityUnit: e.target.value })}
                                    >
                                        <option value="years">{t(lang, "article.contingents.options.years")}</option>
                                        <option value="months">{t(lang, "article.contingents.options.months")}</option>
                                        <option value="days">{t(lang, "article.contingents.options.days")}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trigger */}
                    {/* Trigger */}
                    <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                        <h3 className={`font-bold mb-4 border-b pb-2 ${isDark ? "border-slate-700 text-slate-200" : "border-slate-100 text-slate-800"}`}>{t(lang, "article.contingents.sections.trigger")}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.article")}</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder={contingentFormData.triggerArticleId ? t(lang, "article.list.searchPlaceholder") : "...Kein auslösender Artikel gewählt..."}
                                        className={`w-full p-2 rounded border focus:ring-2 focus:ring-sky-500 text-sm ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                        value={triggerSearchTerm}
                                        onChange={(e) => setTriggerSearchTerm(e.target.value)}
                                        onFocus={(e) => {
                                            const dropdown = e.target.nextElementSibling;
                                            if (dropdown) dropdown.classList.remove('hidden');
                                        }}
                                        onBlur={(e) => {
                                            // Delay hiding to allow click event on options to register
                                            const dropdown = e.target.nextElementSibling;
                                            if (dropdown) {
                                                setTimeout(() => {
                                                    dropdown.classList.add('hidden');
                                                    // Reset search term to selected article name if id exists
                                                    if (contingentFormData.triggerArticleId) {
                                                        const a = articles.find(x => x.id === contingentFormData.triggerArticleId);
                                                        setTriggerSearchTerm(a ? a.articleName : "");
                                                    } else {
                                                        setTriggerSearchTerm("");
                                                    }
                                                }, 200);
                                            }
                                        }}
                                    />
                                    <div className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded shadow-lg hidden border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                                        <div
                                            className={`p-2 cursor-pointer hover:bg-sky-500 hover:text-white ${!contingentFormData.triggerArticleId ? "font-bold" : ""} ${isDark ? "text-slate-300" : "text-slate-700"}`}
                                            onClick={() => {
                                                setContingentFormData({ ...contingentFormData, triggerArticleId: "" });
                                                setTriggerSearchTerm("");
                                            }}
                                        >
                                            --- Kein auslösender Artikel gewählt ---
                                        </div>
                                        {articles.filter(a => !triggerSearchTerm || a.articleName.toLowerCase().includes(triggerSearchTerm.toLowerCase())).map(a => (
                                            <div
                                                key={a.id}
                                                className={`p-2 cursor-pointer hover:bg-sky-500 hover:text-white ${contingentFormData.triggerArticleId === a.id ? "bg-sky-100 text-sky-800" : isDark ? "text-slate-300" : "text-slate-700"}`}
                                                onClick={() => {
                                                    setContingentFormData({ ...contingentFormData, triggerArticleId: a.id });
                                                    setTriggerSearchTerm(a.articleName);
                                                }}
                                            >
                                                {a.articleName}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Display selected value if not editing */}
                                    <div className="absolute right-8 top-2 text-xs text-slate-400 pointer-events-none">
                                        {articles.find(a => a.id === contingentFormData.triggerArticleId)?.articleName || ""}
                                    </div>
                                    <FiChevronDown className="absolute right-2 top-3 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">{t(lang, "article.contingents.fields.quotaType")}</label>
                                <select
                                    className={`w-full p-2 rounded border ${!contingentFormData.quotaType ? "border-red-500" : isDark ? "border-slate-700" : "border-slate-300"} ${isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
                                    value={contingentFormData.quotaType}
                                    onChange={(e) => setContingentFormData({ ...contingentFormData, quotaType: e.target.value })}
                                >
                                    <option value="">{t(lang, "article.contingents.options.select")}</option>
                                    <option value="fixed">{t(lang, "article.contingents.options.fixedValue")}</option>
                                    <option value="quantity">{t(lang, "article.contingents.options.byQuantity")}</option>
                                    <option value="price">{t(lang, "article.contingents.options.byPrice")}</option>
                                    <option value="voucher">{t(lang, "article.contingents.options.voucher")}</option>
                                </select>
                                {!contingentFormData.quotaType && <p className="text-red-500 text-xs mt-1">{t(lang, "article.contingents.errors.required")}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Usable Articles */}
                    <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                        <h3 className={`flex items-center gap-2 font-bold mb-4 border-b pb-2 cursor-pointer ${isDark ? "border-slate-700 text-slate-200" : "border-slate-100 text-slate-800"}`} onClick={() => {
                            if (contingentFormData.usableArticles.length === articles.length && articles.length > 0) {
                                setContingentFormData({ ...contingentFormData, usableArticles: [] });
                            } else {
                                setContingentFormData({ ...contingentFormData, usableArticles: articles.map(a => a.id) });
                            }
                        }}>
                            <div className={`w-4 h-4 border rounded flex items-center justify-center ${contingentFormData.usableArticles.length === articles.length && articles.length > 0 ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300"}`}>
                                {contingentFormData.usableArticles.length === articles.length && articles.length > 0 && <FiCheck size={12} />}
                            </div>
                            {t(lang, "article.contingents.sections.usableArticles")}
                        </h3>
                        <div className="space-y-1 max-h-[600px] overflow-y-auto pl-2">
                            <RecursiveArticleTree
                                groups={groups}
                                articles={articles}
                                selectedIds={contingentFormData.usableArticles}
                                onSelectionChange={(newIds) => setContingentFormData({ ...contingentFormData, usableArticles: newIds })}
                                isDark={isDark}
                                t={t}
                                lang={lang}
                            />
                        </div>
                    </div>

                </div >
            </div >
        );
    };

    const renderDashboard = () => {
        const menuItems = [
            {
                id: "articles",
                title: t(lang, "article.dashboard.articles.title"),
                description: t(lang, "article.dashboard.articles.desc"),
                icon: FiFileText,
                action: () => setView("list"),
                color: "sky"
            },
            {
                id: "groups",
                title: t(lang, "article.dashboard.groups.title"), // "Artikelgruppen"
                description: t(lang, "article.dashboard.groups.desc"),
                icon: FiLayers,
                action: () => setView("groups"),
                color: "indigo"
            },
            {
                id: "stock",
                title: t(lang, "article.dashboard.stock.title"),
                description: t(lang, "article.dashboard.stock.desc"),
                icon: FiBox,
                action: () => setView("inventory-list"),
                color: "amber"
            },
            {
                id: "contingents",
                title: t(lang, "article.dashboard.contingents.title"),
                description: t(lang, "article.dashboard.contingents.desc"),
                icon: FiPieChart,
                action: () => setView("contingent-list"),
                color: "blue"
            }, {
                id: "units",
                title: t(lang, "article.dashboard.units.title"),
                description: t(lang, "article.dashboard.units.desc"),
                icon: FiLayers,
                action: () => setView("units-list"),
                color: "indigo"
            },
            {
                id: "inventory",
                title: t(lang, "article.dashboard.inventory.title"),
                description: t(lang, "article.dashboard.inventory.desc"),
                icon: FiClipboard,
                action: () => setView("inventory-list"),
                color: "rose"
            },
            {
                id: "pricing",
                title: t(lang, "article.dashboard.pricing.title"),
                description: t(lang, "article.dashboard.pricing.desc"),
                icon: FiTag,
                action: () => onNavigate("price-agreements"),
                color: "violet"
            }
        ];

        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}>Artikel-Verwaltung</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={item.action}
                            className={`
                                relative p-5 rounded-xl cursor-pointer transition-all duration-300
                                border group overflow-hidden flex flex-col items-center text-center
                                ${isDark
                                    ? "bg-slate-900 border-slate-700 hover:border-sky-500 hover:bg-slate-800"
                                    : "bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1"
                                }
                            `}
                        >
                            {/* Locked Icon */}
                            {item.locked && (
                                <div className="absolute top-2 right-2 text-red-500">
                                    <FiLock size={14} />
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                mb-3 p-3 rounded-2xl transition-all duration-300
                                ${isDark ? "bg-slate-800 text-sky-400 group-hover:scale-110" : "bg-sky-50 text-sky-500 group-hover:scale-110 group-hover:bg-sky-100"}
                            `}>
                                <item.icon size={32} />
                            </div>

                            {/* Text */}
                            <div className="space-y-2 flex-1 w-full">
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[30px] px-1 line-clamp-3">
                                    {item.description}
                                </p>
                            </div>

                            {/* Button */}
                            <div className={`
                                w-full py-2 px-3 mt-4 rounded-lg text-xs font-bold text-white transition-all
                                bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-500/20 truncate
                            `}>
                                {item.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderGroupModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden`}>
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white">
                        {groupFormData.id ? t(lang, "article.groups.createTitle").replace("erstellen", "bearbeiten") : t(lang, "article.groups.createTitle")}
                    </h3>
                    <button onClick={() => setShowGroupModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">

                    {/* Name */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.name")}
                        </label>
                        <input
                            type="text"
                            value={groupFormData.name}
                            onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                        <div className="col-start-2 text-xs text-red-500">{t(lang, "article.messages.fieldRequired") || "Dieses Feld wird benötigt"}</div>
                    </div>

                    {/* Organization */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.org")}
                        </label>
                        <select
                            value={groupFormData.organization}
                            onChange={(e) => setGroupFormData({ ...groupFormData, organization: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            disabled
                        >
                            <option value="Sonnenstudio Suntime No.1 (SONNE0542)" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                                Sonnenstudio Suntime No.1 (SONNE0542)
                            </option>
                        </select>
                    </div>

                    {/* Parent */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.parent")}
                        </label>
                        <select
                            value={groupFormData.parent}
                            onChange={(e) => setGroupFormData({ ...groupFormData, parent: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Alle Artikel (ROOT)</option>
                            {/* Flattened groups for simple selection, or direct children of root? 
                                Ideally this should be a flattened list of all available parent groups. 
                                Since 'groups' is a tree, we need a flat list. 
                                For now, I'll use a helper to verify if we have a flat list available or extract it.
                                Actually simpler: just show immediate children of root to avoid deep complexity for now, or assume 'groups' used elsewhere.
                            */}
                            {groups[0] && groups[0].children ? groups[0].children.map(g => (
                                <option key={g.id} value={g.id} className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">{g.name}</option>
                            )) : (
                                <option value="all" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800">Alle Artikel (ROOT)</option>
                            )}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-start">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                            {t(lang, "article.groups.fields.desc")}
                        </label>
                        <textarea
                            value={groupFormData.description}
                            onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                            rows={3}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Show in checkout */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.showInPos")}
                        </label>
                        <button
                            onClick={() => setGroupFormData({ ...groupFormData, showInPos: !groupFormData.showInPos })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${groupFormData.showInPos ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${groupFormData.showInPos ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                    {/* Color */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.color")}
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                                <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t(lang, "article.groups.fields.colorSelection")}</span>
                                <input
                                    type="color"
                                    value={groupFormData.color}
                                    onChange={(e) => setGroupFormData({ ...groupFormData, color: e.target.value })}
                                    className="hidden"
                                />
                                <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-500 shadow-sm" style={{ backgroundColor: groupFormData.color }}></div>
                            </label>

                        </div>
                    </div>

                    {/* Order */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.order")}
                        </label>
                        <input
                            type="number"
                            value={groupFormData.order}
                            onChange={(e) => setGroupFormData({ ...groupFormData, order: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>


                    {/* Manual Discount */}
                    <div className="grid grid-cols-[1fr_2fr] gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(lang, "article.groups.fields.manualDiscount")}
                        </label>
                        <button
                            onClick={() => setGroupFormData({ ...groupFormData, manualDiscount: !groupFormData.manualDiscount })}
                            className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${groupFormData.manualDiscount ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${groupFormData.manualDiscount ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                        onClick={() => setShowGroupModal(false)}
                        className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
                    >
                        {t(lang, "article.messages.abort") || "Schließen"}
                    </button>
                    <button
                        onClick={async () => {
                            if (loading) return;
                            setLoading(true);
                            try {
                                const payload = {
                                    name: groupFormData.name,
                                    owner: groupFormData.organization,
                                    parent: groupFormData.parent,
                                    description: groupFormData.description,
                                    showInPos: groupFormData.showInPos,
                                    manualDiscount: groupFormData.manualDiscount,
                                    color: groupFormData.color,
                                    order: groupFormData.order
                                };

                                if (groupFormData.id) {
                                    // Update existing group
                                    const groupRef = doc(db, "groups", groupFormData.id);
                                    await updateDoc(groupRef, { ...payload, updatedAt: new Date().toISOString() });
                                } else {
                                    // Create new group
                                    await addDoc(collection(db, "groups"), { ...payload, createdAt: new Date().toISOString() });
                                }

                                await fetchGroups(); // Refresh tree
                                setShowGroupModal(false);
                                setLoading(false);
                                // Reset form
                                setGroupFormData({
                                    id: null, // Reset ID
                                    name: "",
                                    organization: "Sonnenstudio Suntime No.1 (SONNE0542)",
                                    parent: "all",
                                    description: "",
                                    showInPos: false,
                                    manualDiscount: false,
                                    color: "#ffffff",
                                    order: 9999999
                                });

                            } catch (e) {
                                console.error("Error saving group: ", e);
                                console.error("Error saving group: ", e);
                                addToast("Failed to save group", 'error');
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium shadow-sm hover:shadow"
                    >
                        {loading ? "Saving..." : (groupFormData.id ? t(lang, "article.messages.save") : t(lang, "article.messages.save"))}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderGroupListView = () => {
        // Recursive helper to render rows
        const renderRow = (group, depth = 0) => {
            // Filter logic: Check if group or any children match
            const matchesSearch = group.name.toLowerCase().includes(groupSearchTerm.toLowerCase());
            const hasMatchingChildren = group.children && group.children.some(child =>
                child.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
                (child.children && child.children.some(grandChild => grandChild.name.toLowerCase().includes(groupSearchTerm.toLowerCase())))
            );

            if (groupSearchTerm && !matchesSearch && !hasMatchingChildren) return null;

            return (
                <div key={group.id}>
                    <div className={`flex items-center p-3 border-b ${isDark ? "hover:bg-slate-800 border-slate-700" : "hover:bg-slate-50 border-slate-100"}`} style={{ paddingLeft: `${depth * 20 + 12}px` }}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {depth === 0 && <FiChevronDown />}
                                <span className={`font-semibold ${depth === 0 ? "text-lg" : "text-base"}`}>{group.name}</span>
                            </div>
                            <div className="text-sm opacity-60 ml-6">
                                {t(lang, "article.groups.fields.owner")}: {group.owner}
                            </div>
                        </div>

                        {/* Extra Keys: Color & Order */}
                        <div className="flex items-center gap-4 mr-4">
                            <div className="flex items-center gap-2" title="Farbe">
                                <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm" style={{ backgroundColor: group.color || '#ffffff' }}></div>
                            </div>
                            <div className="text-xs font-mono opacity-50 w-12 text-right" title="Sortierreihenfolge">
                                #{group.order}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleListArticles(group)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded border ${isDark ? "border-slate-600 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-100 bg-white"}`}
                            >
                                <FiList className="w-4 h-4" />
                                <span className="hidden sm:inline">{t(lang, "article.groups.buttons.listArticles")}</span>
                            </button>
                            {depth > 0 && (
                                <button onClick={() => handleEditGroup(group)} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white">
                                    <FiEdit2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t(lang, "article.groups.buttons.edit")}</span>
                                </button>
                            )}
                            {depth > 0 && (
                                <button onClick={() => handleDeleteGroup(group.id)} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-red-500 hover:bg-red-600 text-white">
                                    <FiTrash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t(lang, "article.groups.buttons.delete") || "Löschen"}</span>
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setGroupFormData({ ...groupFormData, parent: group.id });
                                    setShowGroupModal(true);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">{t(lang, "article.groups.buttons.add")}</span>
                            </button>
                        </div>
                    </div>
                    {/* Render Children */}
                    {group.children && group.children.map(child => renderRow(child, depth + 1))}
                </div>
            )
        };

        return (
            <div className="max-w-[1600px] mx-auto space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("dashboard")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.groups.header")}
                        </h1>
                    </div>
                    <button onClick={() => setView("dashboard")} className={`px-4 py-2 rounded text-sm font-medium border ${isDark ? "border-slate-600 hover:bg-slate-800" : "bg-white border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                        {t(lang, "article.messages.backToOverview") || "Zurück zur Übersicht"}
                    </button>
                </div>

                <div className={`rounded-xl overflow-hidden border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    {/* Search / Filter Bar placeholder */}
                    <div className={`p-4 border-b flex gap-4 ${isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                            <input
                                type="text"
                                value={groupSearchTerm}
                                onChange={(e) => setGroupSearchTerm(e.target.value)}
                                placeholder={t(lang, "article.list.searchPlaceholder") || "Schnellsuche..."}
                                className={`w-full pl-10 pr-4 py-2 rounded border outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`}
                            />
                        </div>
                        <select className={`p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-300"}`}>
                            <option>{t(lang, "article.filter.all") || "Alles"}</option>
                        </select>
                    </div>

                    {/* Group Tree */}
                    <div className="">
                        {groups.map(group => renderRow(group))}
                    </div>
                </div>
                {showGroupModal && renderGroupModal()}
            </div>
        );
    };


    const handleInventorySave = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "articles", formData.id);
            await updateDoc(docRef, {
                storageActive: formData.storageActive || false,
                minStock: Number(formData.minStock || 0),
                maxStock: Number(formData.maxStock || 0),
                stock: Number(formData.stock || 0) // Allow manual override
            });
            await fetchArticles();
            await fetchArticles();
            addToast(t(lang, "article.inventory.messages.saved"), 'success');
        } catch (err) {
            console.error(err);
            addToast(t(lang, "article.inventory.messages.error"), 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleBooking = async () => {
        if (!formData.id) return;
        setLoading(true);
        try {
            const currentStock = Number(formData.stock || 0);
            const amount = Number(bookingData.amount || 0);
            let newStock = currentStock;

            if (bookingData.type === "bookIn") newStock += amount;
            else if (bookingData.type === "bookOut") newStock -= amount;
            else if (bookingData.type === "correction") newStock = amount;

            // 1. Update Article
            await updateDoc(doc(db, "articles", formData.id), {
                stock: newStock
            });

            // 2. Add Log
            await addDoc(collection(db, "inventoryLogs"), {
                articleId: formData.id,
                date: new Date().toISOString(),
                user: "Current User", // Replace with actual auth user if available
                action: bookingData.type,
                amount: amount,
                previousStock: currentStock,
                newStock: newStock,
                remark: bookingData.remark || ""
            });

            // Refresh
            setFormData(prev => ({ ...prev, stock: newStock }));
            await fetchInventoryLogs(formData.id);
            await fetchArticles();
            setBookingData({ type: "bookIn", amount: 0, remark: "", date: new Date().toISOString().slice(0, 16) });
            setBookingData({ type: "bookIn", amount: 0, remark: "", date: new Date().toISOString().slice(0, 16) });
            addToast(t(lang, "article.inventory.messages.booked"), 'success');

        } catch (err) {
            console.error(err);
            addToast(t(lang, "article.inventory.messages.error"), 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderInventoryDetailView = () => {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setView("inventory-list")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200"}`}>
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{t(lang, "article.inventory.settings")}</h1>
                        <p className="text-slate-500">{formData.articleName} ({formData.articleNo})</p>
                    </div>
                </div>

                {/* Settings Card */}
                <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <FiBox /> {t(lang, "article.inventory.settings")}
                        </h3>
                        <button onClick={handleInventorySave} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                            <FiSave /> {t(lang, "article.messages.save")}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <label className="font-medium text-slate-700 dark:text-slate-200">{t(lang, "article.inventory.active")}</label>
                            <div onClick={() => setFormData({ ...formData, storageActive: !formData.storageActive })}
                                className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative ${formData.storageActive ? "bg-emerald-500" : "bg-slate-400"}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.storageActive ? "translate-x-6" : ""}`}></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">{t(lang, "article.inventory.stock")}</label>
                                <input type="number"
                                    value={formData.stock || 0}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className={`w-full p-2 rounded border outline-none font-bold ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">{t(lang, "article.inventory.min")}</label>
                                    <input type="number"
                                        value={formData.minStock || 0}
                                        onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">{t(lang, "article.inventory.max")}</label>
                                    <input type="number"
                                        value={formData.maxStock || 0}
                                        onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <FiClipboard /> {t(lang, "article.inventory.booking")}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">Type</label>
                                <select value={bookingData.type} onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                                    className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}>
                                    <option value="bookIn">{t(lang, "article.inventory.actions.bookIn")}</option>
                                    <option value="bookOut">{t(lang, "article.inventory.actions.bookOut")}</option>
                                    <option value="correction">{t(lang, "article.inventory.actions.correction")}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">{t(lang, "article.inventory.fields.amount")}</label>
                                <input type="number"
                                    value={bookingData.amount}
                                    onChange={(e) => setBookingData({ ...bookingData, amount: e.target.value })}
                                    className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold mb-1 text-slate-500 dark:text-slate-400">{t(lang, "article.inventory.fields.remark")}</label>
                            <input type="text"
                                value={bookingData.remark}
                                onChange={(e) => setBookingData({ ...bookingData, remark: e.target.value })}
                                placeholder={t(lang, "article.inventory.messages.reason")}
                                className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleBooking} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-bold">
                                {t(lang, "article.messages.save")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Journal Table */}
                <div className={`rounded-xl overflow-hidden border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold">{t(lang, "article.inventory.journal")}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className={`text-xs uppercase font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                                <tr>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.date")}</th>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.action")}</th>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.before")}</th>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.movement")}</th>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.after")}</th>
                                    <th className="px-4 py-3">{t(lang, "article.inventory.fields.remark")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {inventoryLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-4 py-3 text-slate-500">{new Date(log.date).toLocaleString()}</td>
                                        <td className="px-4 py-3 font-medium">
                                            {log.action === "bookIn" ? <span className="text-emerald-500">In ({t(lang, "article.inventory.actions.bookIn")})</span> :
                                                log.action === "bookOut" ? <span className="text-red-500">Out ({t(lang, "article.inventory.actions.bookOut")})</span> :
                                                    <span className="text-amber-500">Correction ({t(lang, "article.inventory.actions.correction")})</span>}
                                        </td>
                                        <td className="px-4 py-3 opacity-70">{log.previousStock}</td>
                                        <td className="px-4 py-3 font-bold">{log.amount}</td>
                                        <td className="px-4 py-3 font-bold text-sky-500">{log.newStock}</td>
                                        <td className="px-4 py-3 text-slate-500 italic">{log.remark}</td>
                                    </tr>
                                ))}
                                {inventoryLogs.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-6 text-slate-500">No history available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const handleStockTakingSave = async () => {
        setLoading(true);
        try {
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();
            let changeCount = 0;

            for (const [articleId, newStock] of Object.entries(stockTakingData)) {
                if (newStock === "" || isNaN(newStock)) continue;

                const article = articles.find(a => a.id === articleId);
                const currentStock = article?.stock || 0;
                const stockNum = Number(newStock);

                if (currentStock !== stockNum) {
                    // Update Article
                    const articleRef = doc(db, "articles", articleId);
                    const diff = stockNum - currentStock;
                    batch.update(articleRef, { stock: stockNum, lastCount: timestamp, lastDifference: diff });

                    // Add Log
                    const logRef = doc(collection(db, "inventoryLogs"));
                    batch.set(logRef, {
                        articleId: articleId,
                        date: timestamp,
                        user: "System (Stock Taking)",
                        action: "correction",
                        amount: stockNum - currentStock,
                        previousStock: currentStock,
                        newStock: stockNum,
                        remark: "Stock Taking (Bestandszählung)"
                    });
                    changeCount++;
                }
            }

            if (changeCount > 0) {
                await batch.commit();
                addToast(t(lang, "article.inventory.messages.saved"), 'success');
                fetchArticles(); // Refresh
                setStockTakingData({});
                setStockWizardStep(1);
                setView("inventory-list");
                setSelectedCategory("all");
            } else {
                addToast(t(lang, "article.inventory.messages.noChanges"), 'info');
            }

        } catch (err) {
            console.error("Stock taking error:", err);
            addToast(t(lang, "article.inventory.messages.error"), 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderStockTakingWizard = () => {
        // Filter articles same as list view
        const filteredStockArticles = articles.filter(article => {
            const matchesGroup = selectedCategory === "all" || article.category === selectedCategory || (article.category === "all" && true);
            const matchesSearch = article.articleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.articleNo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesHidden = showHiddenArticles || (article.storageActive !== false && article.storageActive !== "false");
            return matchesGroup && matchesSearch && matchesHidden;
        });

        return (
            <div className="max-w-[1600px] mx-auto space-y-6 h-full flex flex-col">
                {/* Header & Steps */}
                <div className={`flex justify-between items-center p-4 rounded-xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"}`}>
                    <h1 className="text-xl font-bold">{t(lang, "article.groups.stockTaking.title")}</h1>
                    <div className="flex px-12 flex-1 justify-center">
                        <div className="flex items-center w-full max-w-3xl justify-between relative">
                            {/* Line Background */}
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-sky-200 -z-10" />

                            {[1, 2, 3].map(step => (
                                <div key={step} className={`flex flex-col items-center gap-2 px-2 z-0 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${stockWizardStep === step ? "border-sky-500 text-sky-500" : stockWizardStep > step ? "border-sky-500 bg-sky-500 text-white" : "border-slate-300 text-slate-400 dark:text-slate-500"}`}>
                                        {step === 1 ? <FiList size={20} /> : step === 2 ? <FiFileText size={20} /> : <FiEdit2 size={18} />}
                                    </div>
                                    <span className={`text-xs font-bold ${stockWizardStep === step ? "text-sky-600" : "text-slate-400"}`}>
                                        {step === 1 ? t(lang, "article.groups.stockTaking.entry") :
                                            step === 2 ? t(lang, "article.groups.stockTaking.review") :
                                                t(lang, "article.groups.stockTaking.correct")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 border rounded font-medium text-sm flex items-center gap-2 ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                            {stockWizardStep === 1 ? t(lang, "article.groups.stockTaking.backToView") : stockWizardStep === 2 ? t(lang, "article.groups.stockTaking.backToView") : t(lang, "article.groups.stockTaking.backToView")}
                        </button>
                        {stockWizardStep === 2 && (
                            <button onClick={() => setStockWizardStep(1)} className={`px-4 py-2 border rounded font-medium text-sm flex items-center gap-2 ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                                {t(lang, "article.groups.stockTaking.backToStep")}
                            </button>
                        )}


                        <button onClick={() => setView("inventory-list")} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium">
                            {t(lang, "article.groups.stockTaking.cancel")}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-hidden flex flex-col rounded-xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>

                    {/* Step Title & Info */}
                    <div className="p-6 pb-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                {stockWizardStep === 1 ? t(lang, "article.groups.stockTaking.entry") : t(lang, "article.groups.stockTaking.review")}
                            </h2>
                            {stockWizardStep === 1 ? (
                                <button onClick={() => setStockWizardStep(2)} className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded font-bold text-sm">
                                    {t(lang, "article.groups.stockTaking.confirm")}
                                </button>
                            ) : (
                                <div className="flex gap-2">

                                    <button onClick={handleStockTakingSave} className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded font-bold flex items-center gap-2 text-sm">
                                        <FiSave /> {t(lang, "article.groups.stockTaking.confirmReport")}
                                    </button>
                                    <button onClick={() => setStockWizardStep(1)} className={`px-4 py-2 border rounded font-medium text-sm flex items-center gap-2 ${isDark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}>
                                        &lt; {t(lang, "article.groups.stockTaking.back")}
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Toolbar (Search & Filter) */}
                    <div className="px-6 py-4 flex gap-4">
                        <div className="relative flex-1">
                            <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center bg-emerald-500 rounded-l text-white">
                                <FiRefreshCw size={14} />
                            </div>
                            <input
                                type="text"
                                placeholder={t(lang, "article.list.searchPlaceholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark ? "border-slate-600 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-900"}`}
                            />
                        </div>
                        <select className={`w-48 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500 ${isDark ? "border-slate-600 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-900"}`}>
                            <option>Alles</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={showHiddenArticles}
                                onChange={(e) => setShowHiddenArticles(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{t(lang, "article.groups.stockTaking.showHidden")}</span>
                            <FiInfo className="text-sky-500" />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto px-6 pb-6">
                        <table className="w-full text-left border-collapse">
                            <thead className={`text-xs font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                <tr className="border-b border-transparent">
                                    <th className="py-2 px-4 w-16 text-center">{t(lang, "article.groups.stockTaking.status")}</th>
                                    <th className="py-2 px-4 w-36">{t(lang, "article.groups.stockTaking.articleNo")}</th>
                                    <th className="py-2 px-4 min-w-[200px]">{t(lang, "article.groups.stockTaking.articleName")}</th>
                                    <th className="py-2 px-4 w-48">{t(lang, "article.groups.stockTaking.articleGroup")}</th>
                                    {stockWizardStep === 2 && (
                                        <th className="py-2 px-4 text-center w-32">{t(lang, "article.groups.stockTaking.currentStock")}</th>
                                    )}
                                    <th className="py-2 px-4 text-center w-48">
                                        {stockWizardStep === 1 ? t(lang, "article.groups.stockTaking.entry") : t(lang, "article.groups.stockTaking.entry")}
                                    </th>
                                    {stockWizardStep === 2 && (
                                        <>
                                            <th className="py-2 px-4 w-32 text-center">{t(lang, "article.groups.stockTaking.difference")}</th>
                                            <th className="py-2 px-4 w-64">{t(lang, "article.groups.stockTaking.remark")}</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredStockArticles.map(article => {
                                    const hasChange = stockTakingData[article.id] !== undefined && stockTakingData[article.id] !== "";
                                    const diff = (parseInt(stockTakingData[article.id]) || 0) - (article.stock || 0);

                                    // In Step 2, show all or filtered? Screenshots show many rows. Replicating behavior.

                                    return (
                                        <tr key={article.id} className={`transition-colors h-14 border-b border-slate-100 dark:border-slate-800 ${isDark ? "bg-[#1e293b]" : "bg-white"}`}>
                                            <td className="py-2 px-4 text-center">
                                                <div className={`w-6 h-6 rounded inline-flex items-center justify-center text-white ${article.stock < (article.minStock || 0) ? "bg-orange-400" : "bg-orange-400"}`}>
                                                    <FiStar size={12} fill="currentColor" />
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{article.articleNo}</td>
                                            <td className="py-2 px-4 text-sm font-bold text-slate-800 dark:text-slate-200">{article.articleName}</td>
                                            <td className="py-2 px-4 text-sm text-slate-500">
                                                {(() => {
                                                    const group = groups.find(g => g.id === article.category || g.id === article.parent);
                                                    if (group) return group.name;

                                                    const category = CATEGORIES.find(c => c.id === article.category);
                                                    if (category) return t(lang, category.labelKey);

                                                    // If category is a long ID string (likely missing group), show fallback
                                                    if (article.category && article.category.length > 15) return "Kosmetik"; // Fallback for lost IDs

                                                    return article.category || "Kosmetik";
                                                })()}
                                            </td>

                                            {stockWizardStep === 2 && (
                                                <td className="py-2 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                                                    {article.stock || 0}
                                                </td>
                                            )}

                                            <td className="py-2 px-2">
                                                {stockWizardStep === 2 ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">
                                                            {stockTakingData[article.id]}
                                                        </span>
                                                        <div
                                                            className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer hover:bg-red-600 shadow-sm"
                                                            onClick={() => {
                                                                const newState = { ...stockTakingData };
                                                                delete newState[article.id];
                                                                setStockTakingData(newState);
                                                            }}
                                                        >
                                                            <FiX size={12} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="number"
                                                        value={stockTakingData[article.id] !== undefined ? stockTakingData[article.id] : ""}
                                                        onChange={(e) => setStockTakingData({ ...stockTakingData, [article.id]: e.target.value })}
                                                        className={`w-full p-2 h-10 border rounded focus:ring-2 focus:ring-sky-500 text-center font-bold text-slate-700 ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"}`}
                                                    />
                                                )}
                                            </td>

                                            {stockWizardStep === 2 && (
                                                <>
                                                    <td className="py-2 text-center font-medium">
                                                        <span className="text-slate-400">
                                                            {/* Logic for diff display - empty in screenshots unless calculated? Screenshot shows empty diff col */}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-2">
                                                        <input
                                                            type="text"
                                                            placeholder={t(lang, "article.groups.stockTaking.remarkPlaceholder")}
                                                            className={`w-full p-2 h-8 text-sm border rounded focus:ring-2 focus:ring-sky-500 ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                                                        />
                                                    </td>
                                                </>
                                            )}

                                            <td className="py-2 px-4 text-right">
                                                <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center text-emerald-500 ml-auto">
                                                    <FiCheck size={12} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const handleSaveUnit = async () => {
        if (!unitFormData.name || !unitFormData.code) {
            addToast(t(lang, "article.contingents.errors.required") || "Required", "error");
            return;
        }
        setLoading(true);
        try {
            if (unitFormData.id) {
                await updateDoc(doc(db, "articleUnits", unitFormData.id), {
                    name: unitFormData.name,
                    code: unitFormData.code
                });
                addToast("Unit updated", "success");
            } else {
                await addDoc(collection(db, "articleUnits"), {
                    name: unitFormData.name,
                    code: unitFormData.code
                });
                addToast("Unit created", "success");
            }
            setShowUnitModal(false);
            fetchUnits();
        } catch (e) {
            console.error(e);
            addToast("Error saving unit", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUnit = async (id) => {
        if (!window.confirm(t(lang, "article.units_management.confirmDelete") || "Delete unit?")) return;
        try {
            await deleteDoc(doc(db, "articleUnits", id));
            addToast("Unit deleted", "success");
            fetchUnits();
        } catch (e) {
            console.error(e);
            addToast("Error deleting unit", "error");
        }
    };

    const renderUnitListView = () => {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("dashboard")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.units_management.header") || "Unit Management"}
                        </h1>
                    </div>
                    <button onClick={() => {
                        setUnitFormData({ name: "", code: "" });
                        setShowUnitModal(true);
                    }} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                        <FiPlus /> {t(lang, "article.units_management.createTitle") || "Add Unit"}
                    </button>
                </div>

                <div className={`rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <table className="w-full text-left">
                        <thead className={`text-xs uppercase font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                            <tr>
                                <th className="px-6 py-4">{t(lang, "article.units_management.fields.name") || "Unit Name"}</th>
                                <th className="px-6 py-4">{t(lang, "article.units_management.fields.code") || "Code"}</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {units.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No units defined yet.</td></tr>
                            ) : units.map(u => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4 font-medium">{u.name}</td>
                                    <td className="px-6 py-4 font-mono text-sm">{u.code}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => { setUnitFormData(u); setShowUnitModal(true); }} className="p-2 text-sky-500 hover:bg-sky-50 rounded"><FiEdit2 /></button>
                                        <button onClick={() => handleDeleteUnit(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Unit Modal */}
                {showUnitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${isDark ? "bg-slate-900 border border-slate-700" : "bg-white"}`}>
                            <h3 className="font-bold text-lg mb-4">{unitFormData.id ? t(lang, "article.units_management.editTitle") : t(lang, "article.units_management.createTitle")}</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1 opacity-70">{t(lang, "article.units_management.fields.name")}</label>
                                    <input
                                        type="text"
                                        value={unitFormData.name}
                                        onChange={e => setUnitFormData({ ...unitFormData, name: e.target.value })}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 opacity-70">{t(lang, "article.units_management.fields.code")}</label>
                                    <input
                                        type="text"
                                        value={unitFormData.code}
                                        onChange={e => setUnitFormData({ ...unitFormData, code: e.target.value })}
                                        className={`w-full p-2 rounded border outline-none ${isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"}`}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={() => setShowUnitModal(false)} className="px-4 py-2 rounded text-slate-500 hover:bg-slate-100">{t(lang, "btn.cancel")}</button>
                                <button onClick={handleSaveUnit} className="px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 font-bold">{t(lang, "article.units_management.save") || "Save"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderInventoryListView = () => {
        return (
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView("dashboard")} className={`p-2 rounded-full hover:bg-white/10 ${isDark ? "bg-slate-800" : "bg-white border border-slate-200 shadow-sm"}`}>
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                            {t(lang, "article.inventory.header")}
                        </h1>
                    </div>
                    <div>
                        <button onClick={() => {
                            setStockWizardStep(1);
                            setStockTakingData({});
                            setView("stock-taking");
                            setSelectedCategory("all");
                        }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                            <FiCheckSquare /> {t(lang, "article.groups.stockTaking.start")}
                        </button>
                    </div>
                </div>

                {/* INVENTORY LIST */}
                <div className={`rounded-xl border ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className={`text-xs uppercase font-bold ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-600"}`}>
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">{t(lang, "article.fields.articleNo")}</th>
                                    <th className="px-6 py-4">{t(lang, "article.fields.articleName")}</th>
                                    <th className="px-6 py-4">{t(lang, "article.inventory.active")}</th>
                                    <th className="px-6 py-4">{t(lang, "article.inventory.stock")}</th>
                                    <th className="px-6 py-4">{t(lang, "article.groups.stockTaking.lastCount") || "Letzte Zählung"}</th>
                                    <th className="px-6 py-4">{t(lang, "article.groups.stockTaking.difference") || "Differenz"}</th>
                                    <th className="px-6 py-4">{t(lang, "article.inventory.min")}</th>
                                    <th className="px-6 py-4">{t(lang, "article.inventory.max")}</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {articles.map(article => (
                                    <tr key={article.id} className={`${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className={`w-3 h-3 rounded-full ${article.stock < (article.minStock || 0) ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}></div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{article.articleNo}</td>
                                        <td className="px-6 py-4 font-medium">{article.articleName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${article.storageActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>
                                                {article.storageActive ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">{article.stock || 0}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {article.lastCount ? new Date(article.lastCount).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-center">
                                            {article.lastDifference === 0 ? (
                                                <FiCheckCircle className="inline text-emerald-500 text-lg" />
                                            ) : article.lastDifference ? (
                                                <span className={article.lastDifference > 0 ? "text-emerald-500" : "text-red-500"}>
                                                    {article.lastDifference > 0 ? `+${article.lastDifference}` : article.lastDifference}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{article.minStock || 0}</td>
                                        <td className="px-6 py-4 text-slate-500">{article.maxStock || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setFormData({ ...article }); // Reuse formData for editing details
                                                    setView("inventory-detail");
                                                }}
                                                className="px-3 py-1.5 bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white rounded text-xs font-bold transition-all"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={isDark ? "min-h-full bg-slate-950 text-slate-50 p-6" : "min-h-full bg-slate-50 text-slate-900 p-6"}>
            {view === "dashboard" && renderDashboard()}
            {view === "groups" && renderGroupListView()}
            {view === "inventory-list" && renderInventoryListView()}
            {view === "units-list" && renderUnitListView()}
            {view === "contingent-list" && renderContingentListView()}
            {view === "contingent-create" && renderContingentCreateView()}

            {(view === "list" || view === "create" || view === "checkout" || view === "inventory-detail" || view === "stock-taking") && (
                <>
                    {view === "create" ? renderWizardView() :
                        view === "checkout" ? renderCheckoutView() :
                            view === "inventory-detail" ? renderInventoryDetailView() :
                                view === "stock-taking" ? renderStockTakingWizard() :
                                    (selectedCategory === "all" ? renderTableView() : renderListView())
                    }
                </>
            )}
            {/* Delete Confirmation Modal - Global */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                        <h3 className="text-xl font-bold mb-2">Artikel löschen?</h3>
                        <p className="text-sm opacity-70 mb-6">Möchten Sie diesen Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default ArticleManagement;

