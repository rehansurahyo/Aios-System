
// // src/components/Sidebar.jsx
// import React from "react";
// import {
//   FiBarChart2,
//   FiCreditCard,
//   FiCalendar,
//   FiUsers,
//   FiGift,
//   FiFileText,
//   FiSettings,
//   FiMonitor,
//   FiBox,
//   FiCpu, // AI Manager icon
// } from "react-icons/fi";

// // 🔤 Translations
// const translations = {
//   en: {
//     brandTag: "AIOS-SYSTEMS",
//     brandTitleMain: "Studio",
//     brandTitleAccent: "Dashboard",
//     brandSubtitle: "Reception & control (UI demo)",

//     sectionMain: "Main",
//     sectionSystem: "System",

//     mainMenu: {
//       dashboard: "Device Overview",
//       cashRegister: "Cash Register System",
//       calendar: "Calendar",
//       customers: "Customers",
//       club: "Club",
//       vouchers: "Vouchers",
//       reports: "Reports",
//       aiManager: "AI Lead Manager",
//     },
//     systemMenu: {
//       systemSettings: "System Settings",
//       deviceManagement: "Device Management",
//       cabins: "Cabins",            // 🔹 NEW
//       itemManagement: "Item Management",
//       userManagement: "User Management",
//       articleManagement: "Article Management", // Updated
//     },
//   },
//   de: {
//     brandTag: "AIOS-SYSTEMS",
//     brandTitleMain: "Studio",
//     brandTitleAccent: "Dashboard",
//     brandSubtitle: "Empfang & Steuerung (UI-Demo)",

//     sectionMain: "Hauptmenü",
//     sectionSystem: "System",

//     mainMenu: {
//       dashboard: "Geräteübersicht",
//       cashRegister: "Kassensystem",
//       calendar: "Kalender",
//       customers: "Kunden",
//       club: "Club",
//       vouchers: "Gutscheine",
//       reports: "Berichte",
//       aiManager: "AI Lead Manager",
//     },
//     systemMenu: {
//       systemSettings: "Systemeinstellungen",
//       deviceManagement: "Geräteverwaltung",
//       cabins: "Kabinen",          // 🔹 NEW (Cabins)
//       itemManagement: "Artikelverwaltung",
//       userManagement: "Benutzerverwaltung",
//     },
//   },
// };

// function Sidebar({
//   theme,
//   currentPage,
//   onNavigate,
//   isOpen,
//   onClose,
//   language = "en",
// }) {
//   const isDark = theme === "dark";
//   const lang = translations[language] || translations.en;

//   const mainMenu = [
//     { id: "dashboard", key: "dashboard", icon: FiBarChart2, page: "dashboard" },
//     {
//       id: "cash-register",
//       key: "cashRegister",
//       icon: FiCreditCard,
//       page: "cash-register",
//     },
//     { id: "calendar", key: "calendar", icon: FiCalendar, page: "calendar" },
//     { id: "customers", key: "customers", icon: FiUsers, page: "customers" },
//     { id: "club", key: "club", icon: FiUsers, page: "club" },
//     { id: "vouchers", key: "vouchers", icon: FiGift, page: "vouchers" },
//     { id: "reports", key: "reports", icon: FiFileText, page: "reports" },
//     {
//       id: "ai-reading-manager",
//       key: "aiManager",
//       icon: FiCpu,
//       page: "ai-reading-manager",
//     },
//   ];

//   const systemMenu = [
//     {
//       id: "system-settings",
//       key: "systemSettings",
//       icon: FiSettings,
//       page: "settings",
//     },
//     {
//       id: "device-management",
//       key: "deviceManagement",
//       icon: FiMonitor,
//       page: "cabins",              // Device Management → cabins page
//     },
//     {
//       id: "cabins",
//       key: "cabins",
//       icon: FiMonitor,
//       page: "cabins",              // 🔹 direct Cabins entry
//     },
//     {
//       id: "item-management",
//       key: "itemManagement",
//       icon: FiBox,
//       page: "items",
//     },
//     {
//       id: "user-management",
//       key: "userManagement",
//       icon: FiUsers,
//       page: "users",
//     },
//   ];

//   const isDarkClasses = "bg-slate-950 border-slate-900 text-slate-100";
//   const isLightClasses = "bg-white border-slate-200 text-slate-900";

//   const wrapperBase =
//     "flex flex-col h-full w-[260px] border-r transition-colors duration-200";
//   const wrapperTheme = isDark ? isDarkClasses : isLightClasses;

//   const NavContent = () => (
//     <>
//       {/* Brand */}
//       <div className="px-4 pt-4 pb-3 border-b border-slate-200/10">
//         <p
//           className={
//             "tracking-[0.35em] text-[9px] font-semibold uppercase " +
//             (isDark ? "text-emerald-300" : "text-emerald-500")
//           }
//         >
//           {lang.brandTag}
//         </p>
//         <h1 className="mt-1 text-xl font-semibold">
//           <span className={isDark ? "text-slate-50" : "text-slate-900"}>
//             {lang.brandTitleMain}
//           </span>{" "}
//           <span className="text-emerald-400">{lang.brandTitleAccent}</span>
//         </h1>
//         <p
//           className={
//             "mt-1 text-xs " + (isDark ? "text-slate-500" : "text-slate-500")
//           }
//         >
//           {lang.brandSubtitle}
//         </p>
//       </div>

//       {/* MAIN MENU */}
//       <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4 space-y-4">
//         <div>
//           <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
//             {lang.sectionMain}
//           </p>
//           <ul className="space-y-1.5">
//             {mainMenu.map((item) => (
//               <SidebarItem
//                 key={item.id}
//                 item={item}
//                 label={lang.mainMenu[item.key]}
//                 isActive={currentPage === item.page}
//                 onClick={() => onNavigate(item.page)}
//                 isDark={isDark}
//               />
//             ))}
//           </ul>
//         </div>

//         {/* SYSTEM */}
//         <div>
//           <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
//             {lang.sectionSystem}
//           </p>
//           <ul className="space-y-1.5">
//             {systemMenu.map((item) => (
//               <SidebarItem
//                 key={item.id}
//                 item={item}
//                 label={lang.systemMenu[item.key]}
//                 isActive={currentPage === item.page}
//                 onClick={() => onNavigate(item.page)}
//                 isDark={isDark}
//               />
//             ))}
//           </ul>
//         </div>
//       </nav>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile overlay */}
//       <div
//         className={
//           "fixed inset-0 z-40 md:hidden transition " +
//           (isOpen
//             ? "opacity-100 pointer-events-auto bg-slate-900/60 backdrop-blur-[2px]"
//             : "opacity-0 pointer-events-none")
//         }
//         onClick={onClose}
//       >
//         <aside
//           className={
//             wrapperBase +
//             " " +
//             wrapperTheme +
//             " max-w-[260px] w-full shadow-2xl transform transition-transform duration-200 " +
//             (isOpen ? "translate-x-0" : "-translate-x-full")
//           }
//           onClick={(e) => e.stopPropagation()}
//         >
//           <NavContent />
//         </aside>
//       </div>

//       {/* Desktop */}
//       <aside className={wrapperBase + " " + wrapperTheme + " hidden md:flex"}>
//         <NavContent />
//       </aside>
//     </>
//   );
// }

// function SidebarItem({ item, label, isActive, onClick, isDark }) {
//   const Icon = item.icon;

//   const base =
//     "w-full flex items-center gap-3 rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors border";

//   let themeClasses;
//   if (isActive) {
//     themeClasses = isDark
//       ? "bg-emerald-500/15 border-emerald-400/80 text-slate-50"
//       : "bg-emerald-50 border-emerald-400/70 text-slate-900";
//   } else {
//     themeClasses = isDark
//       ? "border-transparent text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-50"
//       : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900";
//   }

//   const iconColor = isActive
//     ? isDark
//       ? "text-emerald-200"
//       : "text-emerald-500"
//     : isDark
//     ? "text-emerald-400"
//     : "text-emerald-500";

//   return (
//     <li>
//       <button
//         type="button"
//         onClick={onClick}
//         className={base + " " + themeClasses}
//       >
//         <span
//           className={
//             "flex h-9 w-9 items-center justify-center rounded-full text-lg shrink-0 " +
//             (isActive
//               ? isDark
//                 ? "bg-emerald-500/20"
//                 : "bg-emerald-100"
//               : isDark
//               ? "bg-emerald-500/10"
//               : "bg-emerald-50")
//           }
//         >
//           <Icon className={iconColor} />
//         </span>
//         <span className="truncate">{label}</span>
//       </button>
//     </li>
//   );
// }

// export default Sidebar;

// src/components/Sidebar.jsx

// import React from "react";
// import {
//   FiBarChart2,
//   FiCalendar,
//   FiUsers,
//   FiFileText,
//   FiSettings,
//   FiMonitor,
//   FiBox,
//   FiCpu, // AI Manager icon
// } from "react-icons/fi";

// // 🔤 Translations
// const translations = {
//   en: {
//     brandTag: "AIOS-SYSTEMS",
//     brandTitleMain: "Studio",
//     brandTitleAccent: "Dashboard",
//     brandSubtitle: "Reception & control (demo)",

//     sectionMain: "Studio",
//     sectionSystem: "System",

//     mainMenu: {
//       dashboard: "Device overview",
//       calendar: "Calendar / bookings",
//       customers: "Customers",
//       cabins: "Cabins / devices",      // 🔹 NEW
//       reports: "Reports",
//       aiManager: "AI Lead Manager",
//     },
//     systemMenu: {
//       systemSettings: "System settings",
//       deviceManagement: "Device management",
//       itemManagement: "Item management",
//       userManagement: "User management",
//     },
//   },
//   de: {
//     brandTag: "AIOS-SYSTEMS",
//     brandTitleMain: "Studio",
//     brandTitleAccent: "Dashboard",
//     brandSubtitle: "Empfang & Steuerung (Demo)",

//     sectionMain: "Studio",
//     sectionSystem: "System",

//     mainMenu: {
//       dashboard: "Geräteübersicht",
//       calendar: "Kalender / Buchungen",
//       customers: "Kunden",
//       cabins: "Kabinen & Geräte",      // 🔹 NEW
//       reports: "Berichte",
//       aiManager: "AI Lead Manager",
//     },
//     systemMenu: {
//       systemSettings: "Systemeinstellungen",
//       deviceManagement: "Geräteverwaltung",
//       itemManagement: "Artikelverwaltung",
//       userManagement: "Benutzerverwaltung",
//     },
//   },
// };

// function Sidebar({
//   theme,
//   currentPage,
//   onNavigate,
//   isOpen,
//   onClose,
//   language = "en",
// }) {
//   const isDark = theme === "dark";
//   const lang = translations[language] || translations.en;

//   // 🎯 Clean main menu – sirf core cheezen
//   const mainMenu = [
//     { id: "dashboard", key: "dashboard", icon: FiBarChart2, page: "dashboard" },
//     { id: "calendar", key: "calendar", icon: FiCalendar, page: "calendar" },
//     { id: "customers", key: "customers", icon: FiUsers, page: "customers" },
//     {
//       id: "cabins",                    // 🔹 cabins moved here
//       key: "cabins",
//       icon: FiMonitor,
//       page: "cabins",
//     },
//     { id: "reports", key: "reports", icon: FiFileText, page: "reports" },
//     {
//       id: "ai-manager",
//       key: "aiManager",
//       icon: FiCpu,
//       page: "ai-reading-manager",
//     },
//   ];

//   const systemMenu = [
//     {
//       id: "system-settings",
//       key: "systemSettings",
//       icon: FiSettings,
//       page: "settings",
//     },
//     // niche future cheezen rakh sakte:
//     // {
//     //   id: "item-management",
//     //   key: "itemManagement",
//     //   icon: FiBox,
//     //   page: "items",
//     // },
//     // {
//     //   id: "user-management",
//     //   key: "userManagement",
//     //   icon: FiUsers,
//     //   page: "users",
//     // },
//   ];

//   const isDarkClasses = "bg-slate-950 border-slate-900 text-slate-100";
//   const isLightClasses = "bg-white border-slate-200 text-slate-900";

//   const wrapperBase =
//     "flex flex-col h-full w-[260px] border-r transition-colors duration-200";
//   const wrapperTheme = isDark ? isDarkClasses : isLightClasses;

//   const NavContent = () => (
//     <>
//       {/* Brand */}
//       <div className="px-4 pt-4 pb-3 border-b border-slate-200/10">
//         <p
//           className={
//             "tracking-[0.35em] text-[9px] font-semibold uppercase " +
//             (isDark ? "text-emerald-300" : "text-emerald-500")
//           }
//         >
//           {lang.brandTag}
//         </p>
//         <h1 className="mt-1 text-xl font-semibold">
//           <span className={isDark ? "text-slate-50" : "text-slate-900"}>
//             {lang.brandTitleMain}
//           </span>{" "}
//           <span className="text-emerald-400">{lang.brandTitleAccent}</span>
//         </h1>
//         <p
//           className={
//             "mt-1 text-xs " + (isDark ? "text-slate-500" : "text-slate-500")
//           }
//         >
//           {lang.brandSubtitle}
//         </p>
//       </div>

//       {/* MAIN MENU */}
//       <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4 space-y-4">
//         <div>
//           <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
//             {lang.sectionMain}
//           </p>
//           <ul className="space-y-1.5">
//             {mainMenu.map((item) => (
//               <SidebarItem
//                 key={item.id}
//                 item={item}
//                 label={lang.mainMenu[item.key]}
//                 isActive={currentPage === item.page}
//                 onClick={() => onNavigate(item.page)}
//                 isDark={isDark}
//               />
//             ))}
//           </ul>
//         </div>

//         {/* SYSTEM */}
//         <div>
//           <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
//             {lang.sectionSystem}
//           </p>
//           <ul className="space-y-1.5">
//             {systemMenu.map((item) => (
//               <SidebarItem
//                 key={item.id}
//                 item={item}
//                 label={lang.systemMenu[item.key]}
//                 isActive={currentPage === item.page}
//                 onClick={() => onNavigate(item.page)}
//                 isDark={isDark}
//               />
//             ))}
//           </ul>
//         </div>
//       </nav>
//     </>
//   );

//   return (
//     <>
//       {/* Mobile overlay */}
//       <div
//         className={
//           "fixed inset-0 z-40 md:hidden transition " +
//           (isOpen
//             ? "opacity-100 pointer-events-auto bg-slate-900/60 backdrop-blur-[2px]"
//             : "opacity-0 pointer-events-none")
//         }
//         onClick={onClose}
//       >
//         <aside
//           className={
//             wrapperBase +
//             " " +
//             wrapperTheme +
//             " max-w-[260px] w-full shadow-2xl transform transition-transform duration-200 " +
//             (isOpen ? "translate-x-0" : "-translate-x-full")
//           }
//           onClick={(e) => e.stopPropagation()}
//         >
//           <NavContent />
//         </aside>
//       </div>

//       {/* Desktop */}
//       <aside className={wrapperBase + " " + wrapperTheme + " hidden md:flex"}>
//         <NavContent />
//       </aside>
//     </>
//   );
// }

// function SidebarItem({ item, label, isActive, onClick, isDark }) {
//   const Icon = item.icon;

//   const base =
//     "w-full flex items-center gap-3 rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors border";

//   let themeClasses;
//   if (isActive) {
//     themeClasses = isDark
//       ? "bg-emerald-500/15 border-emerald-400/80 text-slate-50"
//       : "bg-emerald-50 border-emerald-400/70 text-slate-900";
//   } else {
//     themeClasses = isDark
//       ? "border-transparent text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-50"
//       : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900";
//   }

//   const iconColor = isActive
//     ? isDark
//       ? "text-emerald-200"
//       : "text-emerald-500"
//     : isDark
//     ? "text-emerald-400"
//     : "text-emerald-500";

//   return (
//     <li>
//       <button
//         type="button"
//         onClick={onClick}
//         className={base + " " + themeClasses}
//       >
//         <span
//           className={
//             "flex h-9 w-9 items-center justify-center rounded-full text-lg shrink-0 " +
//             (isActive
//               ? isDark
//                 ? "bg-emerald-500/20"
//                 : "bg-emerald-100"
//               : isDark
//               ? "bg-emerald-500/10"
//               : "bg-emerald-50")
//           }
//         >
//           <Icon className={iconColor} />
//         </span>
//         <span className="truncate">{label}</span>
//       </button>
//     </li>
//   );
// }

// export default Sidebar;


// src/components/Sidebar.jsx
import React from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMonitor,
  FiBox,
  FiCpu,
} from "react-icons/fi";
import logo from "../assets/WhatsApp Image 2026-01-20 at 1.51.06 PM.jpeg";
import { useLanguage } from "../context/LanguageContext"; // ← YE ADD KARO

function Sidebar({
  theme,
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  // language prop hata diya — ab hook se lenge
}) {
  const isDark = theme === "dark";
  const { language } = useLanguage(); // ← HOOK SE LANGUAGE LO
  const langKey = language || "en";

  // Translations (tumhare diye hue ko use kar raha hoon)
  const translations = {
    en: {
      brandTag: "AIOS-SYSTEMS",
      brandTitleMain: "Studio",
      brandTitleAccent: "Dashboard",
      brandSubtitle: "Reception & control (demo)",

      sectionMain: "Studio",
      sectionSystem: "System",

      mainMenu: {
        dashboard: "Device overview",
        calendar: "Calendar / bookings",
        customers: "Customers",
        cabins: "Cabins / devices",
        reports: "Reports",
        aiManager: "AI Lead Manager",
      },
      systemMenu: {
        systemSettings: "System settings",
        deviceManagement: "Device management",
        itemManagement: "Item management",
        userManagement: "User management",
        pricingPos: "Pricing / POS settings",
        articleManagement: "Article Management",
        priceAgreements: "Price Agreements" // New
      },
    },
    de: {
      brandTag: "AIOS-SYSTEMS",
      brandTitleMain: "Studio",
      brandTitleAccent: "Dashboard",
      brandSubtitle: "Empfang & Steuerung (Demo)",

      sectionMain: "Studio",
      sectionSystem: "System",

      mainMenu: {
        dashboard: "Geräteübersicht",
        calendar: "Kalender / Buchungen",
        customers: "Kunden",
        cabins: "Kabinen & Geräte",
        reports: "Berichte",
        aiManager: "AI Lead Manager",
      },
      systemMenu: {
        systemSettings: "Systemeinstellungen",
        deviceManagement: "Geräteverwaltung",
        itemManagement: "Artikelverwaltung",
        userManagement: "Benutzerverwaltung",
        pricingPos: "Preis / Kassensystem",
        articleManagement: "Artikel-Verwaltung",
        priceAgreements: "Preisvereinbarung" // New
      },
    },
  };

  const lang = translations[langKey] || translations.en;

  const mainMenu = [
    { id: "dashboard", key: "dashboard", icon: FiBarChart2, page: "dashboard" },
    { id: "calendar", key: "calendar", icon: FiCalendar, page: "calendar" },
    { id: "customers", key: "customers", icon: FiUsers, page: "customers" },
    { id: "cabins", key: "cabins", icon: FiMonitor, page: "cabins" },
    { id: "reports", key: "reports", icon: FiFileText, page: "reports" },
  ];

  const systemMenu = [
    { id: "system-settings", key: "systemSettings", icon: FiSettings, page: "settings" },
    { id: "pricing-pos", key: "pricingPos", icon: FiBox, page: "pricing" },
    { id: "article-management", key: "articleManagement", icon: FiBox, page: "articles" },
    { id: "user-management", key: "userManagement", icon: FiUsers, page: "users" },

  ];

  const wrapperBase = "flex flex-col h-full w-[260px] border-r transition-colors duration-200";
  const wrapperTheme = isDark
    ? "bg-slate-950 border-slate-900 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  const NavContent = () => (
    <>
      {/* Brand */}
      {/* Brand */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200/10 flex flex-col items-center text-center">
        <img src={logo} alt="AIOS Logo" className="w-16 h-16 rounded-full shadow-lg mb-3 object-cover border-2 border-emerald-500/20" />

        <h1 className="text-xl font-bold tracking-tight">
          <span className={isDark ? "text-slate-50" : "text-slate-900"}>
            AIOS
          </span>{" "}
          <span className="text-blue-500">SYSTEMS</span>
        </h1>
        <p className={`mt-1 text-xs font-medium uppercase tracking-widest opacity-60 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Studio Control
        </p>
      </div>

      {/* MAIN MENU */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        <div>
          <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {lang.sectionMain}
          </p>
          <ul className="space-y-1.5">
            {mainMenu.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                label={lang.mainMenu[item.key]}
                isActive={currentPage === item.page}
                onClick={() => onNavigate(item.page)}
                isDark={isDark}
              />
            ))}
          </ul>
        </div>

        <div>
          <p className="px-2 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
            {lang.sectionSystem}
          </p>
          <ul className="space-y-1.5">
            {systemMenu.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                label={lang.systemMenu[item.key]}
                isActive={currentPage === item.page}
                onClick={() => onNavigate(item.page)}
                isDark={isDark}
              />
            ))}
          </ul>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition ${isOpen ? "opacity-100 pointer-events-auto bg-slate-900/60 backdrop-blur-[2px]" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      >
        <aside
          className={`${wrapperBase} ${wrapperTheme} max-w-[260px] w-full shadow-2xl transform transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <NavContent />
        </aside>
      </div>

      {/* Desktop */}
      <aside className={`${wrapperBase} ${wrapperTheme} hidden md:flex`}>
        <NavContent />
      </aside>
    </>
  );
}

function SidebarItem({ item, label, isActive, onClick, isDark }) {
  const Icon = item.icon;

  const base = "w-full flex items-center gap-3 rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors border";

  const themeClasses = isActive
    ? isDark
      ? "bg-emerald-500/15 border-emerald-400/80 text-slate-50"
      : "bg-emerald-50 border-emerald-400/70 text-slate-900"
    : isDark
      ? "border-transparent text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-50"
      : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900";

  const iconColor = isActive
    ? isDark ? "text-emerald-200" : "text-emerald-500"
    : isDark ? "text-emerald-400" : "text-emerald-500";

  return (
    <li>
      <button type="button" onClick={onClick} className={`${base} ${themeClasses}`}>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-lg shrink-0 ${isActive
            ? isDark ? "bg-emerald-500/20" : "bg-emerald-100"
            : isDark ? "bg-emerald-500/10" : "bg-emerald-50"
            }`}
        >
          <Icon className={iconColor} />
        </span>
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

export default Sidebar;