// // // src/components/Topbar.jsx
// // import React from "react";

// // function Topbar({ theme, onToggleTheme, onToggleSidebar }) {
// //   const isDark = theme === "dark";

// //   return (
// //     <header
// //       className={
// //         (isDark
// //           ? "bg-slate-950/80 border-slate-800 text-slate-100"
// //           : "bg-white/80 border-slate-200 text-slate-900") +
// //         " sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b backdrop-blur"
// //       }
// //     >
// //       <div className="flex items-center gap-2">
// //         {/* Mobile sidebar toggle */}
// //         <button
// //           className={
// //             (isDark
// //               ? "bg-slate-900 border-slate-700 text-slate-200"
// //               : "bg-slate-100 border-slate-300 text-slate-700") +
// //             " inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 md:hidden"
// //           }
// //           onClick={onToggleSidebar}
// //         >
// //           <span className="text-lg">☰</span>
// //         </button>

// //         <div className="flex flex-col">
// //           <span
// //             className={
// //               "tracking-[0.28em] text-[9px] font-semibold " +
// //               (isDark ? "text-emerald-400/80" : "text-emerald-600")
// //             }
// //           >
// //             AIOS-SYSTEMS
// //           </span>
// //           <span className="text-sm sm:text-base font-semibold">
// //             Studio Control Dashboard
// //           </span>
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-3">
// //         {/* System status */}
// //         <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
// //           <span className="relative flex h-2.5 w-2.5">
// //             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
// //             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
// //           </span>
// //           <span>System online · Demo</span>
// //         </div>

// //         {/* Theme toggle */}
// //         <button
// //           onClick={onToggleTheme}
// //           className={
// //             (isDark
// //               ? "border-slate-700 bg-slate-900/80 text-slate-200"
// //               : "border-slate-200 bg-slate-100 text-slate-700") +
// //             " relative inline-flex h-9 w-16 items-center rounded-full border px-1 text-xs shadow-inner transition"
// //           }
// //         >
// //           <span className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-medium">
// //             <span className={isDark ? "text-slate-400" : "text-amber-500"}>
// //               ☀︎
// //             </span>
// //             <span className={isDark ? "text-sky-300" : "text-slate-400"}>
// //               ☾
// //             </span>
// //           </span>
// //           <span
// //             className={
// //               (isDark
// //                 ? "translate-x-7 bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
// //                 : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]") +
// //               " inline-flex h-6 w-6 transform rounded-full transition-transform duration-300 ease-out"
// //             }
// //           />
// //         </button>
// //       </div>
// //     </header>
// //   );
// // }

// // export default Topbar;

// // // src/components/Topbar.jsx
// // import React from "react";

// // function Topbar({ theme, onToggleTheme, onToggleSidebar, language, onChangeLanguage }) {
// //   const isDark = theme === "dark";

// //   return (
// //     <header
// //       className={
// //         (isDark
// //           ? "bg-slate-950/80 border-slate-800 text-slate-100"
// //           : "bg-white/80 border-slate-200 text-slate-900") +
// //         " sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b backdrop-blur"
// //       }
// //     >
// //       <div className="flex items-center gap-2">
// //         {/* Mobile sidebar toggle */}
// //         <button
// //           className={
// //             (isDark
// //               ? "bg-slate-900 border-slate-700 text-slate-200"
// //               : "bg-slate-100 border-slate-300 text-slate-700") +
// //             " inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 md:hidden"
// //           }
// //           onClick={onToggleSidebar}
// //         >
// //           <span className="text-lg">☰</span>
// //         </button>

// //         <div className="flex flex-col">
// //           <span
// //             className={
// //               "tracking-[0.28em] text-[9px] font-semibold " +
// //               (isDark ? "text-emerald-400/80" : "text-emerald-600")
// //             }
// //           >
// //             AIOS-SYSTEMS
// //           </span>
// //           <span className="text-sm sm:text-base font-semibold">
// //             Studio Control Dashboard
// //           </span>
// //         </div>
// //       </div>

// //       <div className="flex items-center gap-3">
// //         {/* System status */}
// //         <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
// //           <span className="relative flex h-2.5 w-2.5">
// //             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
// //             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
// //           </span>
// //           <span>System online · Demo</span>
// //         </div>

// //         {/* 🔵 Language Switcher EN | DE */}
// //         <div
// //           className={
// //             (isDark
// //               ? "bg-slate-900/70 border-slate-700 text-slate-300"
// //               : "bg-slate-100 border-slate-300 text-slate-700") +
// //             " flex items-center border rounded-full px-1.5 py-0.5 text-[11px] select-none"
// //           }
// //         >
// //           <button
// //             onClick={() => onChangeLanguage("en")}
// //             className={
// //               (language === "en"
// //                 ? "bg-emerald-500 text-white shadow px-2"
// //                 : "px-2 opacity-70") +
// //               " rounded-full transition"
// //             }
// //           >
// //             EN
// //           </button>
// //           <button
// //             onClick={() => onChangeLanguage("de")}
// //             className={
// //               (language === "de"
// //                 ? "bg-emerald-500 text-white shadow px-2"
// //                 : "px-2 opacity-70") +
// //               " rounded-full transition"
// //             }
// //           >
// //             DE
// //           </button>
// //         </div>

// //         {/* Theme toggle */}
// //         <button
// //           onClick={onToggleTheme}
// //           className={
// //             (isDark
// //               ? "border-slate-700 bg-slate-900/80 text-slate-200"
// //               : "border-slate-200 bg-slate-100 text-slate-700") +
// //             " relative inline-flex h-9 w-16 items-center rounded-full border px-1 text-xs shadow-inner transition"
// //           }
// //         >
// //           <span className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-medium">
// //             <span className={isDark ? "text-slate-400" : "text-amber-500"}>☀︎</span>
// //             <span className={isDark ? "text-sky-300" : "text-slate-400"}>☾</span>
// //           </span>
// //           <span
// //             className={
// //               (isDark
// //                 ? "translate-x-7 bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
// //                 : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]") +
// //               " inline-flex h-6 w-6 transform rounded-full transition-transform duration-300 ease-out"
// //             }
// //           />
// //         </button>
// //       </div>
// //     </header>
// //   );
// // }

// // export default Topbar;




// // src/components/Topbar.jsx
// import React from "react";
// import { t } from "../i18n";

// function Topbar({ theme, onToggleTheme, onToggleSidebar, language, onChangeLanguage }) {
//   const isDark = theme === "dark";

//   return (
//     <header
//       className={
//         (isDark
//           ? "bg-slate-950/80 border-slate-800 text-slate-100"
//           : "bg-white/80 border-slate-200 text-slate-900") +
//         " sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b backdrop-blur"
//       }
//     >
//       <div className="flex items-center gap-2">
//         <button
//           className={
//             (isDark
//               ? "bg-slate-900 border-slate-700 text-slate-200"
//               : "bg-slate-100 border-slate-300 text-slate-700") +
//             " inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 md:hidden"
//           }
//           onClick={onToggleSidebar}
//         >
//           <span className="text-lg">☰</span>
//         </button>

//         <div className="flex flex-col">
//           <span
//             className={
//               "tracking-[0.28em] text-[9px] font-semibold " +
//               (isDark ? "text-emerald-400/80" : "text-emerald-600")
//             }
//           >
//             AIOS-SYSTEMS
//           </span>
//           <span className="text-sm sm:text-base font-semibold">
//             {t(language, "app.title")}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
//           <span className="relative flex h-2.5 w-2.5">
//             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
//           </span>
//           <span>{t(language, "status.online")}</span>
//         </div>

//         {/* Language Switcher */}
//         <div
//           className={
//             (isDark
//               ? "bg-slate-900/70 border-slate-700 text-slate-300"
//               : "bg-slate-100 border-slate-300 text-slate-700") +
//             " flex items-center border rounded-full px-1.5 py-0.5 text-[11px] select-none"
//           }
//         >
//           <button
//             onClick={() => onChangeLanguage("en")}
//             className={
//               (language === "en"
//                 ? "bg-emerald-500 text-white shadow px-2"
//                 : "px-2 opacity-70") +
//               " rounded-full transition"
//             }
//           >
//             EN
//           </button>
//           <button
//             onClick={() => onChangeLanguage("de")}
//             className={
//               (language === "de"
//                 ? "bg-emerald-500 text-white shadow px-2"
//                 : "px-2 opacity-70") +
//               " rounded-full transition"
//             }
//           >
//             DE
//           </button>
//         </div>

//         {/* Theme toggle */}
//         <button
//           onClick={onToggleTheme}
//           className={
//             (isDark
//               ? "border-slate-700 bg-slate-900/80 text-slate-200"
//               : "border-slate-200 bg-slate-100 text-slate-700") +
//             " relative inline-flex h-9 w-16 items-center rounded-full border px-1 text-xs shadow-inner transition"
//           }
//         >
//           <span className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-medium">
//             <span className={isDark ? "text-slate-400" : "text-amber-500"}>☀︎</span>
//             <span className={isDark ? "text-sky-300" : "text-slate-400"}>☾</span>
//           </span>
//           <span
//             className={
//               (isDark
//                 ? "translate-x-7 bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.9)]"
//                 : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]") +
//               " inline-flex h-6 w-6 transform rounded-full transition-transform duration-300 ease-out"
//             }
//           />
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Topbar;



// // src/components/Topbar.jsx
// import React from "react";
// import { t } from "../i18n";

// function Topbar({
//   theme,
//   onToggleTheme,
//   onToggleSidebar,
//   language,
//   onChangeLanguage,
// }) {
//   const isDark = theme === "dark";

//   return (
//     <header
//       className={
//         (isDark
//           ? "bg-slate-950/80 border-slate-800 text-slate-100"
//           : "bg-white/80 border-slate-200 text-slate-900") +
//         " sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b backdrop-blur"
//       }
//     >
//       <div className="flex items-center gap-2">
//         <button
//           className={
//             (isDark
//               ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
//               : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200") +
//             " inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 md:hidden transition"
//           }
//           onClick={onToggleSidebar}
//           aria-label={t(language, "topbar.menu") || "Menu"}
//           title={t(language, "topbar.menu") || "Menu"}
//         >
//           <span className="text-lg">☰</span>
//         </button>

//         <div className="flex flex-col">
//           <span
//             className={
//               "tracking-[0.28em] text-[9px] font-semibold " +
//               (isDark ? "text-emerald-400/80" : "text-emerald-600")
//             }
//           >
//             AIOS-SYSTEMS
//           </span>
//           <span className="text-sm sm:text-base font-semibold">
//             {t(language, "app.title")}
//           </span>
//           <span
//             className={
//               (isDark ? "text-slate-400" : "text-slate-500") +
//               " text-[11px] leading-4 hidden sm:block"
//             }
//           >
//             {t(language, "topbar.subtitle")}
//           </span>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 sm:gap-3">
//         <div
//           className={
//             (isDark
//               ? "bg-slate-900/60 border-slate-700 text-slate-200"
//               : "bg-white/70 border-slate-200 text-slate-700") +
//             " hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] shadow-sm"
//           }
//         >
//           <span className="relative flex h-2.5 w-2.5">
//             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
//           </span>
//           <span className="font-medium">{t(language, "status.online")}</span>
//         </div>

//         {/* Language Switcher */}
//         <div
//           className={
//             (isDark
//               ? "bg-slate-900/70 border-slate-700 text-slate-300"
//               : "bg-slate-100 border-slate-300 text-slate-700") +
//             " flex items-center border rounded-full p-1 text-[11px] select-none shadow-sm"
//           }
//           role="group"
//           aria-label={t(language, "topbar.language") || "Language"}
//         >
//           <button
//             type="button"
//             onClick={() => onChangeLanguage("en")}
//             className={
//               (language === "en"
//                 ? "bg-emerald-500 text-white shadow-sm"
//                 : isDark
//                 ? "text-slate-300 hover:bg-slate-800/70"
//                 : "text-slate-700 hover:bg-white") +
//               " rounded-full px-2.5 py-1 transition font-semibold"
//             }
//             aria-pressed={language === "en"}
//             title={t(language, "topbar.langEn") || "English"}
//           >
//             EN
//           </button>
//           <button
//             type="button"
//             onClick={() => onChangeLanguage("de")}
//             className={
//               (language === "de"
//                 ? "bg-emerald-500 text-white shadow-sm"
//                 : isDark
//                 ? "text-slate-300 hover:bg-slate-800/70"
//                 : "text-slate-700 hover:bg-white") +
//               " rounded-full px-2.5 py-1 transition font-semibold"
//             }
//             aria-pressed={language === "de"}
//             title={t(language, "topbar.langDe") || "Deutsch"}
//           >
//             DE
//           </button>
//         </div>

//         {/* Theme toggle (better UI) */}
//         <button
//           type="button"
//           onClick={onToggleTheme}
//           className={
//             (isDark
//               ? "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
//               : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white") +
//             " group relative inline-flex h-9 items-center gap-2 rounded-full border pl-2 pr-2.5 shadow-sm transition"
//           }
//           aria-label={
//             isDark
//               ? t(language, "topbar.switchToLight") || "Switch to light theme"
//               : t(language, "topbar.switchToDark") || "Switch to dark theme"
//           }
//           title={
//             isDark
//               ? t(language, "topbar.switchToLight") || "Switch to light theme"
//               : t(language, "topbar.switchToDark") || "Switch to dark theme"
//           }
//         >
//           {/* Track */}
//           <span
//             className={
//               (isDark ? "bg-slate-800/80" : "bg-slate-100") +
//               " relative inline-flex h-6 w-12 items-center rounded-full px-1 transition"
//             }
//           >
//             {/* Icons */}
//             <span className="absolute inset-0 flex items-center justify-between px-2 text-[11px]">
//               <span className={isDark ? "text-slate-500" : "text-amber-500"}>
//                 ☀
//               </span>
//               <span className={isDark ? "text-sky-300" : "text-slate-400"}>
//                 ☾
//               </span>
//             </span>

//             {/* Thumb */}
//             <span
//               className={
//                 (isDark
//                   ? "translate-x-6 bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.8)]"
//                   : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.8)]") +
//                 " relative z-10 inline-flex h-4.5 w-4.5 rounded-full transition-transform duration-300 ease-out"
//               }
//               style={{ height: 18, width: 18 }}
//             />
//           </span>

//           {/* Label */}
//           <span
//             className={
//               (isDark ? "text-slate-300" : "text-slate-700") +
//               " hidden sm:inline text-[11px] font-semibold"
//             }
//           >
//             {isDark ? t(language, "topbar.dark") : t(language, "topbar.light")}
//           </span>
//         </button>
//       </div>
//     </header>
//   );
// }

// export default Topbar;

// src/components/Topbar.jsx
import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://backend-two-orpin-12.vercel.app";

function Topbar({ theme, onToggleTheme, onToggleSidebar }) {
  const isDark = theme === "dark";
  const { language, setLanguage } = useLanguage();
  const lang = language || "en";

  const [historyOpen, setHistoryOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [recentCustomers, setRecentCustomers] = useState([]);

  // Mock notifications
  const notifications = [];

  useEffect(() => {
    // Fetch last 10 customers
    fetch(`${API_BASE}/api/customers?limit=10`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentCustomers(data);
        }
      })
      .catch(err => console.error("Failed to load recent customers", err));
  }, []);

  return (
    <header
      className={
        (isDark
          ? "bg-slate-950/80 border-slate-800 text-slate-100"
          : "bg-white/80 border-slate-200 text-slate-900") +
        " sticky top-0 z-20 flex items-center justify-between px-3 sm:px-6 py-3 border-b backdrop-blur"
      }
    >
      <div className="flex items-center gap-2">
        <button
          className={
            (isDark
              ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200") +
            " inline-flex items-center justify-center rounded-xl border px-2.5 py-1.5 md:hidden transition"
          }
          onClick={onToggleSidebar}
          aria-label={t(lang, "topbar.menu") || "Menu"}
          title={t(lang, "topbar.menu") || "Menu"}
        >
          <span className="text-lg">☰</span>
        </button>

        <div className="flex flex-col">
          <span
            className={
              "tracking-[0.28em] text-[9px] font-semibold hidden sm:block " +
              (isDark ? "text-emerald-400/80" : "text-emerald-600")
            }
          >
            AIOS-SYSTEMS
          </span>
          <span className="text-sm sm:text-base font-semibold">
            {t(lang, "app.title")}
          </span>
          <span
            className={
              (isDark ? "text-slate-400" : "text-slate-500") +
              " text-[11px] leading-4 hidden sm:block"
            }
          >
            {t(lang, "topbar.subtitle")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={
            (isDark
              ? "bg-slate-900/60 border-slate-700 text-slate-200"
              : "bg-white/70 border-slate-200 text-slate-700") +
            " hidden sm:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] shadow-sm"
          }
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-medium">{t(lang, "status.online")}</span>
        </div>

        {/* Language Switcher */}
        <div
          className={
            (isDark
              ? "bg-slate-900/70 border-slate-700 text-slate-300"
              : "bg-slate-100 border-slate-300 text-slate-700") +
            " flex items-center border rounded-full p-1 text-[11px] select-none shadow-sm"
          }
          role="group"
          aria-label={t(lang, "topbar.language") || "Language"}
        >
          <button
            type="button"
            onClick={() => setLanguage("en")} // ← setLanguage hook se
            className={
              (language === "en"
                ? "bg-emerald-500 text-white shadow-sm"
                : isDark
                  ? "text-slate-300 hover:bg-slate-800/70"
                  : "text-slate-700 hover:bg-white") +
              " rounded-full px-2 sm:px-2.5 py-1 transition font-semibold"
            }
            aria-pressed={language === "en"}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage("de")} // ← setLanguage hook se
            className={
              (language === "de"
                ? "bg-emerald-500 text-white shadow-sm"
                : isDark
                  ? "text-slate-300 hover:bg-slate-800/70"
                  : "text-slate-700 hover:bg-white") +
              " rounded-full px-2 sm:px-2.5 py-1 transition font-semibold"
            }
            aria-pressed={language === "de"}
          >
            DE
          </button>
        </div>

        {/* Alerts / Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className={
              (isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
                : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white") +
              " group relative inline-flex h-9 items-center justify-center rounded-full border px-2.5 shadow-sm transition"
            }
            title={t(lang, "topbar.alerts") || "Alerts"}
          >
            <span className="text-lg leading-none">🔔</span>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>

          {alertsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setAlertsOpen(false)}
              />
              <div
                className={
                  (isDark
                    ? "bg-slate-900 border-slate-700 text-slate-200 shadow-slate-900/50"
                    : "bg-white border-slate-200 text-slate-700 shadow-xl") +
                  " absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-2xl z-40 overflow-hidden"
                }
              >
                <div className={(isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100") + " px-4 py-2.5 border-b flex items-center justify-between"}>
                  <span className="font-semibold text-xs tracking-wider uppercase opacity-80">{t(lang, "topbar.notifications") || "Notifications"}</span>
                  <span className="bg-rose-500/10 text-rose-500 text-[10px] px-1.5 py-0.5 rounded font-bold">{notifications.length}</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs opacity-50">
                      {t(lang, "topbar.noAlerts") || "No new notifications"}
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100/10">
                      {notifications.map((n) => (
                        <li key={n.id} className={(isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50") + " px-4 py-3 flex items-start gap-3 transition"}>
                          <div className={
                            (n.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                              n.type === "error" ? "bg-rose-500/10 text-rose-500" :
                                n.type === "success" ? "bg-emerald-500/10 text-emerald-500" :
                                  "bg-sky-500/10 text-sky-500") +
                            " h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-lg"
                          }>
                            {n.type === "warning" ? "⚠️" : n.type === "success" ? "✓" : "i"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {n.title}
                            </p>
                            <p className="text-[11px] opacity-60 line-clamp-2">
                              {n.desc}
                            </p>
                            <p className="text-[10px] opacity-40 mt-1">
                              {n.time}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Customer History Dropdown */}
        <div className="relative">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className={
              (isDark
                ? "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
                : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white") +
              " group relative inline-flex h-9 items-center justify-center rounded-full border px-2.5 shadow-sm transition"
            }
            title={t(lang, "topbar.history") || "History"}
          >
            <span className="text-lg leading-none">📋</span>
          </button>

          {historyOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setHistoryOpen(false)}
              />
              <div
                className={
                  (isDark
                    ? "bg-slate-900 border-slate-700 text-slate-200 shadow-slate-900/50"
                    : "bg-white border-slate-200 text-slate-700 shadow-xl") +
                  " absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-2xl z-40 overflow-hidden"
                }
              >
                <div className={(isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100") + " px-4 py-2.5 border-b flex items-center justify-between"}>
                  <span className="font-semibold text-xs tracking-wider uppercase opacity-80">{t(lang, "topbar.recentCustomers") || "Customers"}</span>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-bold">10</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {recentCustomers.length === 0 ? (
                    <div className="p-4 text-center text-xs opacity-50">
                      No recent customers
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100/10">
                      {recentCustomers.map((c) => (
                        <li key={c._id || c.id} className={(isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50") + " px-4 py-3 flex items-start gap-3 transition"}>
                          <div className={(isDark ? "bg-slate-800" : "bg-slate-100") + " h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"}>
                            {(c.firstName || c.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {c.firstName} {c.lastName}
                              {(!c.firstName && !c.lastName) && (c.name || "Unknown")}
                            </p>
                            <p className="text-[10px] opacity-50 truncate">
                              {c.email || c.phone || "No contact info"}
                            </p>
                          </div>
                          <div className="text-[10px] opacity-40 whitespace-nowrap pt-0.5">
                            {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "")}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={
            (isDark
              ? "border-slate-700 bg-slate-900/70 text-slate-200 hover:bg-slate-900"
              : "border-slate-200 bg-white/70 text-slate-700 hover:bg-white") +
            " group relative inline-flex h-9 items-center gap-2 rounded-full border pl-2 pr-2.5 shadow-sm transition"
          }
          aria-label={
            isDark
              ? t(lang, "topbar.switchToLight") || "Switch to light theme"
              : t(lang, "topbar.switchToDark") || "Switch to dark theme"
          }
        >
          <span
            className={
              (isDark ? "bg-slate-800/80" : "bg-slate-100") +
              " relative inline-flex h-6 w-10 sm:w-12 items-center rounded-full px-1 transition"
            }
          >
            <span className="absolute inset-0 flex items-center justify-between px-2 text-[11px]">
              <span className={isDark ? "text-slate-500" : "text-amber-500"}>☀</span>
              <span className={isDark ? "text-sky-300" : "text-slate-400"}>☾</span>
            </span>
            <span
              className={
                (isDark
                  ? "translate-x-4 sm:translate-x-6 bg-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.8)]"
                  : "translate-x-0 bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.8)]") +
                " relative z-10 inline-flex h-4.5 w-4.5 rounded-full transition-transform duration-300 ease-out"
              }
              style={{ height: 18, width: 18 }}
            />
          </span>
          <span className={(isDark ? "text-slate-300" : "text-slate-700") + " hidden sm:inline text-[11px] font-semibold"}>
            {isDark ? t(lang, "topbar.dark") : t(lang, "topbar.light")}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;