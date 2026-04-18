import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import { userService } from "../services/userService";
import {
    FiUser, FiShield, FiSearch, FiPlus, FiFilter, FiMoreHorizontal,
    FiTrash2, FiEdit2, FiCheck, FiX, FiChevronLeft, FiChevronRight,
    FiUsers, FiLock, FiFileText, FiRefreshCw, FiInfo, FiToggleLeft, FiToggleRight, FiEye, FiEyeOff
} from "react-icons/fi";

// Enhanced Rights Mock from Screenshot
const MOCK_RIGHTS = [
    {
        id: "backoffice", label: "Back-Office", children: [
            { id: "bo_1", label: "Freetime buchen ohne Unterschrift (MANAGE_FREETIME_WITHOUT_SIGNATURE)" },
            { id: "bo_2", label: "Kündigung verwalten ohne Unterschrift (MANAGE_CANCELLATION_WITHOUT_SIGNATURE)" },
        ]
    },
    {
        id: "usermgmt", label: "Benutzer-Verwaltung (User)", children: [
            { id: "um_login", label: "Benutzer Login bearbeiten (USER_LOGIN_MANAGE)" },
            { id: "um_manage", label: "Benutzer Verwaltung (USER_MANAGEMENT)" },
            { id: "um_edit", label: "Benutzer in Benutzerverwaltung bearbeiten (USER_MANAGEMENT_EDIT_USER)" },
            { id: "um_add", label: "Benutzer in Benutzerverwaltung hinzufügen (USER_MANAGEMENT_ADD_USER)" },
            { id: "um_del", label: "Benutzer löschen in Benutzerverwaltung (USER_MANAGEMENT_DELETE_USER)" },
            { id: "um_reset", label: "Benutzer zurücksetzen Benutzerverwaltung (USER_MANAGEMENT_RESET_USER)" },
        ]
    },
    {
        id: "reports", label: "Berichte (Reports)", children: [
            { id: "rep_journ", label: "Bericht Kassenjournal (BERICHTE_KASSENJOURNAL)" },
            { id: "rep_month", label: "Bericht Monatsbericht (BERICHTE_MONATSBERICHT)" },
        ]
    },
    {
        id: "warehouse", label: "Lager-Verwaltung (Warehouse-Management)", children: [
            { id: "wh_count", label: "Bestandszählung löschen (WAREHOUSEMANAGEMENT_STOCK_COUNT_DELETE)" },
            { id: "wh_edit", label: "Lagerbestand bearbeiten (WAREHOUSEMANAGEMENT_STOCK_EDIT)" },
        ]
    }
];

const CUSTOMERS_MOCK = [
    { id: "54200000134", name: "Daniyel Fermano", address: "An der Schäferwiese 22", dob: "03.08.1981", type: "user" },
    { id: "54200000135", name: "Maria Musterfrau", address: "Hauptstr 1", dob: "01.01.1990", type: "user" },
    { id: "54200054287", name: "Mario", address: "DE-", dob: "", type: "user" },
    { id: "54200033202", name: "Frau Tanja", address: "DE-", dob: "", type: "user" },
];

import { useLanguage } from "../context/LanguageContext";

const UserManagement = ({ theme }) => {
    const isDark = theme === "dark";
    const { language } = useLanguage();
    const lang = language || "en";
    const [activeTab, setActiveTab] = useState("users");

    // Data State
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Wizard State
    const [showWizard, setShowWizard] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [editMode, setEditMode] = useState(false); // New: track if editing
    const [newUser, setNewUser] = useState({
        id: null,
        person: null,
        username: "",
        password: "",
        passwordMasked: true,
        roles: [],
        isLocked: false,
        isHidden: false,
        mustChangePwd: true,
        isPwdStrong: false,
        centralLoginLocked: false
    });

    // Role Editor State
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [roleEditor, setRoleEditor] = useState({ name: "", parent: null, rights: [] });
    const [roleTab, setRoleTab] = useState("rights");

    // Fetch Data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [uData, rData] = await Promise.all([
                userService.getUsers(),
                userService.getRoles()
            ]);
            setUsers(uData);
            setRoles(rData.length > 0 ? rData : [
                { id: "owner", name: "Studio-Besitzer", parent: null },
                { id: "manager", name: "Team-Leitung", parent: "owner" },
                { id: "staff", name: "Tresenkraft", parent: "manager" }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- CRUD HANDLERS ---

    const handleCreateOrUpdateUser = async () => {
        if (!newUser.username || saving) return;
        setSaving(true);
        try {
            const u = {
                username: newUser.username,
                name: newUser.person?.name ? newUser.person.name.split(" ")[0] : newUser.name || "?",
                surname: newUser.person?.name ? newUser.person.name.split(" ").slice(1).join(" ") : newUser.surname || "?",
                roles: newUser.roles.map(r => r.name),
                status: newUser.isLocked ? "inactive" : "active",
                // Helper fields
                isLocked: newUser.isLocked,
                isHidden: newUser.isHidden,
                mustChangePwd: newUser.mustChangePwd,
                centralLoginLocked: newUser.centralLoginLocked,
                // Only save password if changed/set (in real app, use backend hashing)
                ...(newUser.password ? { password: newUser.password } : {})
            };

            if (editMode && newUser.id) {
                await userService.updateUser(newUser.id, u);
            } else {
                await userService.createUser(u);
            }

            await loadData(); // Refresh
            setShowWizard(false);
            resetWizard();
        } catch (err) {
            alert(t(language, "users.errors.saveUser"));
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const resetWizard = () => {
        setNewUser({ id: null, person: null, username: "", password: "", passwordMasked: true, roles: [], isLocked: false, isHidden: false, mustChangePwd: true, isPwdStrong: false, centralLoginLocked: false });
        setWizardStep(1);
        setEditMode(false);
    };

    const handleEditUser = (user) => {
        // Pre-fill wizard
        const matchedPerson = CUSTOMERS_MOCK.find(c => user.name && c.name.includes(user.name)) || { id: "UNKNOWN", name: `${user.name} ${user.surname}`, address: "-" };
        setNewUser({
            id: user.id,
            person: matchedPerson,
            username: user.username,
            password: "", // Don't show existing hash
            passwordMasked: true,
            roles: roles.filter(r => user.roles.includes(r.name)),
            isLocked: user.isLocked || user.status === "inactive",
            isHidden: user.isHidden || false,
            mustChangePwd: user.mustChangePwd || false,
            centralLoginLocked: user.centralLoginLocked || false,
            isPwdStrong: false
        });
        setEditMode(true);
        setShowWizard(true);
        setWizardStep(2); // Skip person select on edit usually, or go to 1 if re-assignment allowed
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Delete this user?")) {
            await userService.deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSaveRole = async () => {
        if (!roleEditor.name) return;
        try {
            const r = {
                name: roleEditor.name,
                parent: roleEditor.parent,
                rights: roleEditor.rights
            };

            if (roleEditor.id) {
                await userService.updateRole(roleEditor.id, r);
            } else {
                await userService.createRole(r);
            }

            await loadData();
            setIsCreatingRole(false);
            setRoleEditor({ name: "", parent: null, rights: [] });
        } catch (err) {
            alert(t(language, "users.errors.saveRole"));
        }
    };

    const handleDeleteRole = async (id) => {
        if (window.confirm("Delete this role?")) {
            try {
                await userService.deleteRole(id);
                setRoles(roles.filter(r => r.id !== id));
            } catch (err) {
                alert("Failed to delete role");
            }
        }
    };

    const handleEditRole = (role) => {
        setRoleEditor({
            id: role.id,
            name: role.name,
            parent: role.parent || null,
            rights: role.rights || []
        });
        setIsCreatingRole(true);
    };

    // --- WIZARD UI HELPERS ---
    const selectPerson = (p) => {
        const suggestedUsername = p.name.toLowerCase().replace(/\s+/g, "") + "@sonne0542";
        setNewUser({ ...newUser, person: p, username: suggestedUsername });
    };

    // Theme Classes
    const bgClass = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
    const headerClass = isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200";
    const inputClass = isDark
        ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 shadow-sm";

    return (
        <div className={`h-full flex flex-col ${isDark ? "text-slate-100" : "text-slate-900 bg-slate-50"}`}>

            {/* Header */}
            <div className={`p-4 sm:p-6 border-b ${headerClass} shadow-sm z-10`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{t(language, "users.title")}</h1>
                        <p className="text-[10px] sm:text-xs font-mono opacity-50 mt-1 uppercase tracking-wider">{t(language, "users.subTitle")}</p>
                    </div>

                    <div className={`flex gap-1 p-1 rounded-lg ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                        {["users", "roles"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab ? (isDark ? "bg-slate-700 shadow-sm" : "bg-white shadow-sm text-blue-600") : "opacity-60 hover:opacity-100"}`}
                            >
                                {t(language, `users.tabs.${tab}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">

                {/* ================= USERS TAB ================= */}
                {activeTab === "users" && (
                    <div className={`rounded-xl border shadow-sm overflow-hidden ${bgClass}`}>
                        <div className={`p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full sm:flex-1">
                                <div className="relative w-full sm:w-72">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                                    <input type="text" placeholder={t(language, "users.list.searchPlaceholder")} className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClass}`} />
                                </div>
                                <label className="flex items-center gap-2 text-sm opacity-70 cursor-pointer hover:opacity-100 select-none whitespace-nowrap">
                                    <input type="checkbox" className="rounded border-slate-300 focus:ring-blue-500" />
                                    {t(language, "users.list.showHidden")}
                                </label>
                            </div>
                            <button
                                onClick={() => { resetWizard(); setShowWizard(true); }}
                                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {t(language, "users.list.newUser")}
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center opacity-50 flex flex-col items-center gap-4">
                                <FiRefreshCw className="animate-spin text-2xl" />
                                <span>{t(language, "users.list.loading")}</span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[800px] sm:min-w-0">
                                    <thead className={`uppercase text-xs font-bold opacity-70 ${isDark ? "bg-slate-800/50" : "bg-slate-50 text-slate-600"}`}>
                                        <tr>
                                            <th className="p-4 pl-6">{t(language, "users.list.columns.username")}</th>
                                            <th className="p-4">{t(language, "users.list.columns.name")}</th>
                                            <th className="p-4">{t(language, "users.list.columns.surname")}</th>
                                            <th className="p-4">{t(language, "users.list.columns.roles")}</th>
                                            <th className="p-4">{t(language, "users.list.columns.status")}</th>
                                            <th className="p-4 text-right pr-6">{t(language, "users.list.columns.actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {users.map(u => (
                                            <tr key={u.id} className="transition-colors group">
                                                <td className="p-4 pl-6 font-medium text-blue-600 dark:text-blue-400">{u.username}</td>
                                                <td className="p-4 font-medium">{u.name}</td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400">{u.surname}</td>
                                                <td className="p-4">
                                                    {u.roles && u.roles.map((r, i) => (
                                                        <span key={i} className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border mr-2 ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                                                            {r}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td className="p-4">
                                                    {u.isLocked ? <FiLock className="text-red-500" /> : <FiUser className="text-emerald-500" />}
                                                </td>
                                                <td className="p-4 text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditUser(u)} className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow transition-all">{t(language, "users.list.columns.actions")}</button>
                                                        <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md transition-all"><FiTrash2 size={14} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="p-12 text-center opacity-40 italic">
                                                    {t(language, "users.list.empty")}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ================= ROLES TAB ================= */}
                {activeTab === "roles" && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                        {!isCreatingRole ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold tracking-tight">{t(language, "users.roles.overview")}</h2>
                                    <button onClick={() => setIsCreatingRole(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                                        {t(language, "users.roles.createTitle")}
                                    </button>
                                </div>
                                <div className={`rounded-xl border shadow-sm ${bgClass}`}>
                                    {roles.map(r => (
                                        <div key={r.id} className="p-5 border-b last:border-0 border-slate-100 dark:border-slate-800 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                                    <FiShield />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base">{r.name}</h3>
                                                    <p className="text-xs opacity-50 font-mono mt-0.5">{t(language, "users.roles.parent")}: {r.parent || t(language, "users.roles.none")}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEditRole(r)} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"><FiEdit2 /></button>
                                                <button onClick={() => handleDeleteRole(r.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={`rounded-xl border shadow-lg overflow-hidden animate-slideUp ${bgClass}`}>
                                <div className={`p-6 border-b flex justify-between items-center ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"}`}>
                                    <h2 className="text-lg font-bold flex items-center gap-2 text-blue-500">
                                        <FiShield /> {roleEditor.id ? t(language, "users.roles.editTitle") : t(language, "users.roles.createTitle")}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setIsCreatingRole(false); setRoleEditor({ name: "", parent: null, rights: [] }); }} className="px-4 py-2 rounded border border-red-200 text-red-500 font-bold hover:bg-red-50">{t(language, "users.roles.btnCancel")}</button>
                                        <button onClick={handleSaveRole} className="px-6 py-2 rounded bg-blue-500 text-white font-bold shadow-lg hover:bg-blue-600">{t(language, "users.roles.btnSave")}</button>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="mb-8">
                                        <label className="block text-sm font-bold opacity-70 mb-2">{t(language, "users.roles.nameLabel")}</label>
                                        <input
                                            type="text"
                                            autoFocus
                                            value={roleEditor.name}
                                            onChange={(e) => setRoleEditor({ ...roleEditor, name: e.target.value })}
                                            className={`w-full p-3 rounded-lg border ${inputClass}`}
                                        />
                                        <p className="text-xs text-red-400 mt-1">{t(language, "users.roles.fieldRequired")}</p>
                                    </div>

                                    <div className="border-b dark:border-slate-800 mb-6 flex gap-8">
                                        {["rights", "hierarchy"].map(tName => (
                                            <button
                                                key={tName}
                                                onClick={() => setRoleTab(tName)}
                                                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${roleTab === tName ? "border-blue-500 text-blue-500" : "border-transparent opacity-50 hover:opacity-100"}`}
                                            >
                                                {t(language, `users.roles.tabs.${tName}`)}
                                            </button>
                                        ))}
                                    </div>

                                    {roleTab === "rights" && (
                                        <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
                                            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                                                <div className="relative">
                                                    <input type="text" placeholder={t(language, "users.roles.rights.filter")} className={`w-full p-2 pl-9 rounded text-sm border ${inputClass}`} />
                                                    <FiFilter className="absolute left-3 top-2.5 opacity-40" />
                                                </div>
                                                <div className={`flex-1 overflow-y-auto border rounded-xl p-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
                                                    {MOCK_RIGHTS.map(group => (
                                                        <div key={group.id} className="mb-4">
                                                            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                                                                <button onClick={() => {
                                                                    // Toggle implementation simplified
                                                                }}>
                                                                    <FiChevronRight className="opacity-50" />
                                                                </button>
                                                                <span>{group.label}</span>
                                                            </div>
                                                            <div className="pl-6 space-y-1">
                                                                {group.children.map(child => (
                                                                    <div key={child.id} className="flex items-center gap-2 text-xs opacity-80 py-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded px-2 cursor-pointer transition-colors">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="rounded border-slate-300"
                                                                            checked={roleEditor.rights.includes(child.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) setRoleEditor({ ...roleEditor, rights: [...roleEditor.rights, child.id] });
                                                                                else setRoleEditor({ ...roleEditor, rights: roleEditor.rights.filter(id => id !== child.id) });
                                                                            }}
                                                                        />
                                                                        <span>{child.label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full lg:w-1/2 flex items-center justify-center text-center p-8 border rounded-xl border-dashed dark:border-slate-800">
                                                <div className="max-w-xs">
                                                    <FiInfo className="mx-auto text-4xl mb-4 text-blue-500 opacity-50" />
                                                    <p className="text-sm opacity-60">{t(language, "users.roles.rights.description")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ================= WIZARD MODAL ================= */}
            {showWizard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-4">
                    <div className={`w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${bgClass}`}>

                        <div className={`p-6 border-b flex justify-between items-center ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm"><FiUser /></div>
                                {editMode ? t(language, "users.roles.editTitle").replace("Rolle", "Benutzer") : t(language, "users.wizard.title")}
                            </h2>
                            <button onClick={() => setShowWizard(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><FiX size={20} /></button>
                        </div>

                        {/* Stepper */}
                        <div className={`p-6 border-b ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                            <div className="flex items-center justify-between px-10 relative max-w-3xl mx-auto">
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 ${isDark ? "bg-slate-800" : "bg-slate-200"} -z-10`} />
                                {[1, 2, 3, 4].map(step => (
                                    <div key={step} className={`flex flex-col items-center gap-2 px-4 z-10 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step <= wizardStep ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                                            {step < wizardStep ? <FiCheck /> : step}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${step === wizardStep ? "text-blue-600 dark:text-blue-400" : "opacity-40"}`}>
                                            {t(language, "users.wizard.step")} {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`flex-1 overflow-y-auto ${isDark ? "bg-slate-900" : "bg-white"}`}>
                            <div className="p-10 max-w-4xl mx-auto min-h-full flex flex-col">

                                {/* Step 1: Select Person */}
                                {wizardStep === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-center mb-8">{t(language, "users.wizard.steps.person")}</h3>
                                        <div className="flex gap-4">
                                            <input type="text" className={`w-full p-4 rounded-xl text-lg border ${inputClass}`} placeholder={t(language, "users.wizard.searchPerson")} autoFocus />
                                        </div>
                                        <div className={`rounded-xl border overflow-hidden ${isDark ? "border-slate-800" : "border-slate-200"}`}>
                                            {CUSTOMERS_MOCK.map(c => (
                                                <div key={c.id} onClick={() => selectPerson(c)} className={`p-4 flex items-center gap-4 cursor-pointer border-b last:border-0 border-slate-100 dark:border-slate-800 transition-colors ${newUser.person?.id === c.id ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${newUser.person?.id === c.id ? "bg-blue-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className={`font-bold text-base ${newUser.person?.id === c.id && !isDark ? "text-blue-700" : ""}`}>{c.name}</div>
                                                        <div className="text-sm opacity-60">{c.address}</div>
                                                    </div>
                                                    {newUser.person?.id === c.id && <FiCheck className="text-blue-500 text-xl" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Login Details (Enhanced) */}
                                {wizardStep === 2 && (
                                    <div className="space-y-8 animate-fadeIn">
                                        {/* Read-only details */}
                                        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl text-[10px] sm:text-xs opacity-70 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                                            <div>
                                                <label className="font-bold block mb-1">{t(language, "users.wizard.login.firstName")}</label>
                                                <div>{newUser.person?.name.split(" ")[0] || "-"}</div>
                                            </div>
                                            <div>
                                                <label className="font-bold block mb-1">{t(language, "users.wizard.login.lastName")}</label>
                                                <div>{newUser.person?.name.split(" ").slice(1).join(" ") || "-"}</div>
                                            </div>
                                            <div>
                                                <label className="font-bold block mb-1">{t(language, "users.wizard.login.customerNumber")}</label>
                                                <div className="font-mono">{newUser.person?.id || "-"}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            {/* First Col */}
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block font-bold mb-2 text-sm">{t(language, "users.wizard.login.username")}</label>
                                                    <input
                                                        type="text"
                                                        value={newUser.username}
                                                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                                                        className={`w-full p-3 rounded-lg border ${inputClass}`}
                                                    />
                                                </div>

                                                {/* Toggles */}
                                                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-slate-700">
                                                    <span className="font-bold text-sm">{t(language, "users.wizard.login.locked")}</span>
                                                    <button onClick={() => setNewUser({ ...newUser, isLocked: !newUser.isLocked })} className={`text-2xl ${newUser.isLocked ? "text-blue-500" : "opacity-30"}`}>
                                                        {newUser.isLocked ? <FiToggleRight /> : <FiToggleLeft />}
                                                    </button>
                                                </div>

                                                <div>
                                                    <label className="block font-bold mb-2 text-sm flex justify-between">
                                                        {t(language, "users.wizard.login.password")}
                                                        <span className="text-red-500 text-xs flex items-center gap-1 opacity-100"><FiInfo /> {t(language, "users.wizard.login.fieldRequired")}</span>
                                                    </label>
                                                    <div className="flex gap-2 relative">
                                                        <input
                                                            type={newUser.passwordMasked ? "password" : "text"}
                                                            value={newUser.password}
                                                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                                            className={`flex-1 p-3 rounded-lg border ${inputClass} ${!newUser.password && "border-red-300 bg-red-50 dark:bg-red-900/10"}`}
                                                        />
                                                        <button onClick={() => setNewUser({ ...newUser, passwordMasked: !newUser.passwordMasked })} className="absolute right-3 top-3.5 opacity-50 hover:opacity-100">
                                                            {newUser.passwordMasked ? <FiEye /> : <FiEyeOff />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3">
                                                    <span className="font-bold text-sm">{t(language, "users.wizard.login.changePwdOnLogin")}</span>
                                                    <button onClick={() => setNewUser({ ...newUser, mustChangePwd: !newUser.mustChangePwd })} className={`text-2xl ${newUser.mustChangePwd ? "text-blue-500" : "opacity-30"}`}>
                                                        {newUser.mustChangePwd ? <FiToggleRight /> : <FiToggleLeft />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Second Col */}
                                            <div className="space-y-6">
                                                <div className="h-[74px] flex items-end pb-3 text-xs opacity-50">
                                                    {t(language, "users.wizard.login.generated")} {t(language, "users.wizard.login.generatedHint")}
                                                </div>

                                                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-slate-700">
                                                    <span className="font-bold text-sm">{t(language, "users.wizard.login.hidden")}</span>
                                                    <button onClick={() => setNewUser({ ...newUser, isHidden: !newUser.isHidden })} className={`text-2xl ${newUser.isHidden ? "text-blue-500" : "opacity-30"}`}>
                                                        {newUser.isHidden ? <FiToggleRight /> : <FiToggleLeft />}
                                                    </button>
                                                </div>

                                                <div className="h-[74px] flex items-center justify-end">
                                                    {/* Placeholder for "Password Strong" indicator or toggle */}
                                                    <div className="flex items-center gap-3 opacity-50">
                                                        <span className="text-sm font-bold">{t(language, "users.wizard.login.pwdStrong")}</span>
                                                        <FiToggleLeft className="text-2xl" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-3">
                                                    <span className="font-bold text-sm">{t(language, "users.wizard.login.centralLoginLocked")}</span>
                                                    <button onClick={() => setNewUser({ ...newUser, centralLoginLocked: !newUser.centralLoginLocked })} className={`text-2xl ${newUser.centralLoginLocked ? "text-blue-500" : "opacity-30"}`}>
                                                        {newUser.centralLoginLocked ? <FiToggleRight /> : <FiToggleLeft />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Roles (Dual List) */}
                                {wizardStep === 3 && (
                                    <div className="flex flex-col sm:flex-row gap-4 items-center min-h-[400px]">
                                        <div className={`flex-1 h-full border rounded-xl overflow-hidden flex flex-col ${isDark ? "border-slate-800 bg-slate-950" : "bg-white border-slate-200"}`}>
                                            <div className={`p-3 font-bold text-xs uppercase border-b ${isDark ? "bg-slate-800 border-slate-800 text-slate-400" : "bg-blue-50 border-blue-100 text-blue-900"}`}>{t(language, "users.wizard.roleAssign.allRoles")}</div>
                                            <div className="flex-1 p-2 overflow-y-auto space-y-1">
                                                {roles.filter(r => !newUser.roles.find(nr => nr.id === r.id)).map(r => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => setNewUser({ ...newUser, roles: [...newUser.roles, r] })}
                                                        className="p-3 rounded cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                                                    >
                                                        {r.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-row sm:flex-col gap-2 text-2xl opacity-30 rotate-90 sm:rotate-0">
                                            <FiChevronRight /><FiChevronLeft />
                                        </div>

                                        <div className={`flex-1 h-full border rounded-xl overflow-hidden flex flex-col ${isDark ? "border-slate-800 bg-slate-950" : "bg-white"}`}>
                                            <div className="p-3 bg-blue-500/10 text-blue-500 font-bold text-xs uppercase border-b border-blue-100 dark:border-blue-900/30">{t(language, "users.wizard.roleAssign.activeRoles")}</div>
                                            <div className="flex-1 p-2 overflow-y-auto space-y-1">
                                                {newUser.roles.length === 0 ? (
                                                    <div className="h-full flex items-center justify-center text-center opacity-40 text-xs p-4">
                                                        <div className="text-red-400 font-bold flex flex-col items-center gap-2">
                                                            <FiInfo className="text-xl" />
                                                            {t(language, "users.wizard.roleAssign.selectOne")}
                                                        </div>
                                                    </div>
                                                ) : newUser.roles.map(r => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => setNewUser({ ...newUser, roles: newUser.roles.filter(nr => nr.id !== r.id) })}
                                                        className="p-3 rounded cursor-pointer bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold flex justify-between items-center group transition-colors"
                                                    >
                                                        {r.name}
                                                        <FiX className="opacity-0 group-hover:opacity-100" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Confirm */}
                                {wizardStep === 4 && (
                                    <div className="text-center py-10 flex flex-col items-center justify-center min-h-full">
                                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                                            <FiCheck className="text-5xl" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">{t(language, "users.wizard.confirm.title")}</h3>
                                        <p className="opacity-60 text-lg mb-8 max-w-sm">
                                            {t(language, "users.wizard.confirm.subtitle", { user: newUser.username, count: newUser.roles.length })}
                                        </p>

                                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-6 rounded-xl w-full max-w-md mb-8 border ${isDark ? "bg-slate-800 border-slate-700" : "bg-blue-50/50 border-blue-100"}`}>
                                            <div className="text-sm opacity-60">{t(language, "users.wizard.confirm.status")}</div>
                                            <div className="font-bold flex items-center gap-2">
                                                {newUser.isLocked
                                                    ? <><FiLock className="text-red-500" /> {t(language, "users.wizard.confirm.locked")}</>
                                                    : <><FiCheck className="text-emerald-500" /> {t(language, "users.wizard.confirm.active")}</>
                                                }
                                            </div>
                                            <div className="text-sm opacity-60">{t(language, "users.wizard.confirm.roles")}</div>
                                            <div className="font-bold">{newUser.roles.map(r => r.name).join(", ")}</div>
                                            <div className="text-sm opacity-60">{t(language, "users.wizard.confirm.password")}</div>
                                            <div className="font-bold">{newUser.password ? t(language, "users.wizard.confirm.set") : t(language, "users.wizard.confirm.unchanged")}</div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`p-6 border-t flex justify-between ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"}`}>
                            <button onClick={() => setWizardStep(s => Math.max(1, s - 1))} disabled={wizardStep === 1} className="px-6 py-2 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors">
                                {t(language, "users.wizard.btnBack")}
                            </button>
                            {wizardStep <= 4 && (
                                <button
                                    onClick={wizardStep === 4 ? handleCreateOrUpdateUser : () => setWizardStep(s => Math.min(4, s + 1))}
                                    disabled={(wizardStep === 1 && !newUser.person) || (wizardStep === 2 && !newUser.username) || saving}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    {wizardStep === 4 ? t(language, "users.wizard.btnSave") : t(language, "users.wizard.btnNext")}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default UserManagement;
