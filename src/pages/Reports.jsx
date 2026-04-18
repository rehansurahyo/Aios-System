// // src/pages/Reports.jsx
// import React, { useEffect, useState } from "react";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL || "https://backend-two-orpin-12.vercel.app";

// function Reports({ theme }) {
//   const isDark = theme === "dark";

//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ---- Load report data from backend ----
//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(`${API_BASE}/api/reports/overview`);
//         if (!res.ok) {
//           let msg = "Could not load reports.";
//           try {
//             const j = await res.json();
//             if (j.message) msg = j.message;
//           } catch {}
//           setError(msg);
//           return;
//         }

//         const data = await res.json();
//         setReport(data);
//       } catch (err) {
//         console.error("reports error", err);
//         setError("Could not load reports (network error).");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadReports();
//   }, []);

//   const usage = report?.usage || [];
//   const revenueToday = report?.revenueToday ?? 0;
//   const revenueThisWeek = report?.revenueThisWeek ?? 0;
//   const peakHour = report?.peakHour || "—";

//   return (
//     <div
//       className={
//         isDark
//           ? "min-h-full bg-slate-950 text-slate-50"
//           : "min-h-full bg-slate-50 text-slate-900"
//       }
//     >
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
//         {/* Header */}
//         <div>
//           <p
//             className={
//               "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium " +
//               (isDark ? "text-slate-600" : "text-slate-500")
//             }
//           >
//             REPORTS
//           </p>
//           <h1
//             className={
//               (isDark ? "text-slate-50" : "text-slate-900") +
//               " mt-1 text-2xl sm:text-3xl font-semibold"
//             }
//           >
//             Usage & revenue
//           </h1>
//           <p
//             className={
//               isDark
//                 ? "text-xs sm:text-sm text-slate-400"
//                 : "text-xs sm:text-sm text-slate-600"
//             }
//           >
//             Simple overview of cabin usage and revenue (live data based on bookings).
//           </p>
//         </div>

//         {/* Loading / error */}
//         {loading && (
//           <div
//             className={
//               (isDark
//                 ? "bg-slate-950/80 border-slate-800"
//                 : "bg-white border-slate-200") +
//               " rounded-2xl border px-4 py-3 text-xs sm:text-sm"
//             }
//           >
//             Loading reports…
//           </div>
//         )}

//         {error && !loading && (
//           <div
//             className={
//               (isDark
//                 ? "bg-rose-900/40 border-rose-500/60 text-rose-100"
//                 : "bg-rose-50 border-rose-300 text-rose-700") +
//               " rounded-2xl border px-4 py-3 text-xs sm:text-sm"
//             }
//           >
//             {error}
//           </div>
//         )}

//         {/* KPI cards */}
//         {!loading && !error && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//               <KpiCard
//                 theme={theme}
//                 label="Revenue today"
//                 value={`€ ${revenueToday.toFixed(0)}`}
//                 helper="Approx. from sessions"
//               />
//               <KpiCard
//                 theme={theme}
//                 label="Revenue this week"
//                 value={`€ ${revenueThisWeek.toFixed(0)}`}
//                 helper="Last 7 days"
//               />
//               <KpiCard
//                 theme={theme}
//                 label="Peak time today"
//                 value={peakHour}
//                 helper="Most active start time"
//               />
//             </div>

//             {/* Usage bar "chart" */}
//             <section
//               className={
//                 (isDark
//                   ? "bg-slate-950/80 border-slate-800"
//                   : "bg-white border-slate-200") +
//                 " rounded-2xl border px-3 sm:px-4 py-4 sm:py-5"
//               }
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-sm sm:text-base font-semibold">
//                   Weekly cabin usage
//                 </h2>
//                 <span className="text-[11px] text-slate-500">
//                   Based on last 7 days
//                 </span>
//               </div>

//               {usage.length === 0 ? (
//                 <p className="text-xs text-slate-500">
//                   No bookings in the last 7 days.
//                 </p>
//               ) : (
//                 <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-48">
//                   {usage.map((d) => (
//                     <div
//                       key={d.label}
//                       className="flex-1 flex flex-col items-center gap-1"
//                     >
//                       <div
//                         className={
//                           (isDark
//                             ? "bg-emerald-500/80"
//                             : "bg-emerald-500") +
//                           " w-full max-w-[22px] rounded-t-xl"
//                         }
//                         style={{ height: `${d.value}%` }}
//                       />
//                       <span className="text-[11px] text-slate-500">
//                         {d.label}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function KpiCard({ theme, label, value, helper }) {
//   const isDark = theme === "dark";

//   return (
//     <div
//       className={
//         (isDark
//           ? "bg-slate-950/80 border-slate-800"
//           : "bg-white border-slate-200") +
//         " rounded-2xl border px-4 py-3 sm:py-4 flex flex-col gap-1 shadow-sm"
//       }
//     >
//       <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
//         {label}
//       </span>
//       <span
//         className={
//           (isDark ? "text-slate-50" : "text-slate-900") +
//           " text-xl sm:text-2xl font-semibold"
//         }
//       >
//         {value}
//       </span>
//       <span className="text-[11px] text-slate-500">{helper}</span>
//     </div>
//   );
// }

// export default Reports;

// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = "https://backend-two-orpin-12.vercel.app";

function Reports({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/reports/overview`);
        if (!res.ok) {
          let msg = t(lang, "reports.errors.load");
          try {
            const j = await res.json();
            if (j.message) msg = j.message;
          } catch { }
          throw new Error(msg);
        }

        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("reports error", err);
        setError(err.message || t(lang, "reports.errors.network"));
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [lang]);

  const usage = report?.usage || [];
  const revenueToday = report?.revenueToday ?? 0;
  const revenueThisWeek = report?.revenueThisWeek ?? 0;
  const peakHour = report?.peakHour || "—";

  const shellClass = isDark
    ? "min-h-full bg-slate-950 text-slate-50"
    : "min-h-full bg-slate-50 text-slate-900";

  if (loading) {
    return (
      <div key={lang} className={shellClass}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
          <div
            className={
              (isDark
                ? "bg-slate-950/80 border-slate-800"
                : "bg-white border-slate-200") +
              " rounded-2xl border px-4 py-6 flex items-center gap-3 text-sm"
            }
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className={isDark ? "text-slate-300" : "text-slate-600"}>
              {t(lang, "reports.states.loading")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div key={lang} className={shellClass}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
          <div
            className={
              (isDark
                ? "bg-rose-900/40 border-rose-500/60 text-rose-100"
                : "bg-rose-50 border-rose-300 text-rose-700") +
              " rounded-2xl border px-4 py-4 text-sm"
            }
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={lang} className={shellClass}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
        {/* Header */}
        <div>
          <p
            className={
              "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium uppercase " +
              (isDark ? "text-slate-600" : "text-slate-500")
            }
          >
            {t(lang, "reports.header.kicker")}
          </p>
          <h1
            className={
              (isDark ? "text-slate-50" : "text-slate-900") +
              " mt-1 text-2xl sm:text-3xl font-semibold"
            }
          >
            {t(lang, "reports.header.title")}
          </h1>
          <p
            className={
              isDark
                ? "text-xs sm:text-sm text-slate-400"
                : "text-xs sm:text-sm text-slate-600"
            }
          >
            {t(lang, "reports.header.subtitle")}
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <KpiCard
            theme={theme}
            label={t(lang, "reports.kpi.revenueToday")}
            value={`€ ${revenueToday.toFixed(0)}`}
            helper={t(lang, "reports.kpiHelpers.approxFromSessions")}
          />
          <KpiCard
            theme={theme}
            label={t(lang, "reports.kpi.revenueThisWeek")}
            value={`€ ${revenueThisWeek.toFixed(0)}`}
            helper={t(lang, "reports.kpiHelpers.last7Days")}
          />
          <KpiCard
            theme={theme}
            label={t(lang, "reports.kpi.peakTimeToday")}
            value={peakHour}
            helper={t(lang, "reports.kpiHelpers.mostActiveStartTime")}
          />
        </div>

        {/* Usage bar chart */}
        <section
          className={
            (isDark
              ? "bg-slate-950/80 border-slate-800"
              : "bg-white border-slate-200") +
            " rounded-2xl border px-3 sm:px-4 py-4 sm:py-5"
          }
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-semibold">
              {t(lang, "reports.usage.title")}
            </h2>
            <span className="text-[11px] text-slate-500">
              {t(lang, "reports.usage.basedOnLast7Days")}
            </span>
          </div>

          {usage.length === 0 ? (
            <p className="text-xs text-slate-500">
              {t(lang, "reports.states.noBookingsLast7Days")}
            </p>
          ) : (
            <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-48">
              {usage.map((d) => (
                <div
                  key={d.label}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={
                      (isDark ? "bg-emerald-500/80" : "bg-emerald-500") +
                      " w-full max-w-[22px] rounded-t-xl transition-all duration-500"
                    }
                    style={{ height: `${d.value}%` }}
                  />
                  <span className="text-[11px] text-slate-500">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function KpiCard({ theme, label, value, helper }) {
  const isDark = theme === "dark";

  return (
    <div
      className={
        (isDark
          ? "bg-slate-950/80 border-slate-800"
          : "bg-white border-slate-200") +
        " rounded-2xl border px-4 py-3 sm:py-4 flex flex-col gap-1 shadow-sm"
      }
    >
      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <span
        className={
          (isDark ? "text-slate-50" : "text-slate-900") +
          " text-xl sm:text-2xl font-semibold"
        }
      >
        {value}
      </span>
      <span className="text-[11px] text-slate-500">{helper}</span>
    </div>
  );
}

export default Reports;