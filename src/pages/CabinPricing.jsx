// // // // // // // // // // // src/pages/CabinPricing.jsx
// // // // // // // // // // import React, { useEffect, useState, useMemo } from "react";

// // // // // // // // // // const API_BASE =
// // // // // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // // // // function CabinPricing({ theme }) {
// // // // // // // // // //   const isDark = theme === "dark";

// // // // // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // // // // //   const [loadingCabins, setLoadingCabins] = useState(true);
// // // // // // // // // //   const [cabinsError, setCabinsError] = useState("");

// // // // // // // // // //   const [selectedCabinId, setSelectedCabinId] = useState("");
// // // // // // // // // //   const [pricingLoading, setPricingLoading] = useState(false);
// // // // // // // // // //   const [pricingError, setPricingError] = useState("");

// // // // // // // // // //   const [baseMinutePrice, setBaseMinutePrice] = useState(5);
// // // // // // // // // //   const [minutePricing, setMinutePricing] = useState({}); // { "1": 5, "2": 5, ... }
// // // // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // // // //   const [saveMessage, setSaveMessage] = useState("");

// // // // // // // // // //   // -------- 1) Fetch cabins list --------
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const fetchCabins = async () => {
// // // // // // // // // //       try {
// // // // // // // // // //         setLoadingCabins(true);
// // // // // // // // // //         setCabinsError("");
// // // // // // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // // // // // //         if (!res.ok) throw new Error("Failed to load cabins");
// // // // // // // // // //         const data = await res.json();
// // // // // // // // // //         setCabins(data || []);
// // // // // // // // // //         if (data && data.length > 0) {
// // // // // // // // // //           setSelectedCabinId(data[0]._id);
// // // // // // // // // //         }
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         console.error("Cabins fetch error:", err);
// // // // // // // // // //         setCabinsError("Could not load cabins from server.");
// // // // // // // // // //       } finally {
// // // // // // // // // //         setLoadingCabins(false);
// // // // // // // // // //       }
// // // // // // // // // //     };

// // // // // // // // // //     fetchCabins();
// // // // // // // // // //   }, []);

// // // // // // // // // //   // -------- 2) Fetch pricing for selected cabin --------
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     if (!selectedCabinId) return;

// // // // // // // // // //     const fetchPricing = async () => {
// // // // // // // // // //       try {
// // // // // // // // // //         setPricingLoading(true);
// // // // // // // // // //         setPricingError("");
// // // // // // // // // //         setSaveMessage("");

// // // // // // // // // //         const res = await fetch(
// // // // // // // // // //           `${API_BASE}/api/cabins/${selectedCabinId}/pricing`
// // // // // // // // // //         );
// // // // // // // // // //         if (!res.ok) throw new Error("Failed to load pricing");
// // // // // // // // // //         const data = await res.json();

// // // // // // // // // //         setBaseMinutePrice(data.baseMinutePrice ?? 5);
// // // // // // // // // //         setMinutePricing(data.minutePricing || {});
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         console.error("Pricing fetch error:", err);
// // // // // // // // // //         setPricingError("Could not load pricing for this cabin.");
// // // // // // // // // //       } finally {
// // // // // // // // // //         setPricingLoading(false);
// // // // // // // // // //       }
// // // // // // // // // //     };

// // // // // // // // // //     fetchPricing();
// // // // // // // // // //   }, [selectedCabinId]);

// // // // // // // // // //   // 1–180 minute options
// // // // // // // // // //   const minuteList = useMemo(
// // // // // // // // // //     () => Array.from({ length: 60 }, (_, i) => i + 1), // abhi 1–60, baad me 180 tak kar sakte ho
// // // // // // // // // //     []
// // // // // // // // // //   );

// // // // // // // // // //   const handleMinutePriceChange = (minute, value) => {
// // // // // // // // // //     const priceNum = value === "" ? "" : Number(value);
// // // // // // // // // //     setMinutePricing((prev) => ({
// // // // // // // // // //       ...prev,
// // // // // // // // // //       [minute]: isNaN(priceNum) ? prev[minute] : priceNum,
// // // // // // // // // //     }));
// // // // // // // // // //   };

// // // // // // // // // //   const applyBaseToEmpty = () => {
// // // // // // // // // //     setMinutePricing((prev) => {
// // // // // // // // // //       const updated = { ...prev };
// // // // // // // // // //       minuteList.forEach((m) => {
// // // // // // // // // //         const key = String(m);
// // // // // // // // // //         if (
// // // // // // // // // //           updated[key] === undefined ||
// // // // // // // // // //           updated[key] === null ||
// // // // // // // // // //           updated[key] === ""
// // // // // // // // // //         ) {
// // // // // // // // // //           updated[key] = Number(baseMinutePrice) || 0;
// // // // // // // // // //         }
// // // // // // // // // //       });
// // // // // // // // // //       return updated;
// // // // // // // // // //     });
// // // // // // // // // //   };

// // // // // // // // // //   const handleSave = async () => {
// // // // // // // // // //     if (!selectedCabinId) return;
// // // // // // // // // //     try {
// // // // // // // // // //       setSaving(true);
// // // // // // // // // //       setSaveMessage("");
// // // // // // // // // //       setPricingError("");

// // // // // // // // // //       // clean object: sirf valid numbers bhejna
// // // // // // // // // //       const cleanPricing = {};
// // // // // // // // // //       for (const m of minuteList) {
// // // // // // // // // //         const key = String(m);
// // // // // // // // // //         const val = minutePricing[key];
// // // // // // // // // //         if (val !== undefined && val !== null && val !== "") {
// // // // // // // // // //           const n = Number(val);
// // // // // // // // // //           if (!isNaN(n) && n >= 0) {
// // // // // // // // // //             cleanPricing[key] = n;
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       }

// // // // // // // // // //       const res = await fetch(
// // // // // // // // // //         `${API_BASE}/api/cabins/${selectedCabinId}/pricing`,
// // // // // // // // // //         {
// // // // // // // // // //           method: "PUT",
// // // // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // // // //           body: JSON.stringify({
// // // // // // // // // //             baseMinutePrice: Number(baseMinutePrice) || 0,
// // // // // // // // // //             minutePricing: cleanPricing,
// // // // // // // // // //           }),
// // // // // // // // // //         }
// // // // // // // // // //       );

// // // // // // // // // //       if (!res.ok) {
// // // // // // // // // //         throw new Error("Failed to save pricing");
// // // // // // // // // //       }

// // // // // // // // // //       const data = await res.json();
// // // // // // // // // //       setSaveMessage("Pricing saved successfully for this cabin.");
// // // // // // // // // //       setMinutePricing(data.minutePricing || {});
// // // // // // // // // //       setBaseMinutePrice(data.baseMinutePrice ?? baseMinutePrice);
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Save pricing error:", err);
// // // // // // // // // //       setPricingError("Failed to save pricing. Please try again.");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setSaving(false);
// // // // // // // // // //       setTimeout(() => setSaveMessage(""), 3000);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const containerClass = isDark
// // // // // // // // // //     ? "min-h-full bg-slate-950 text-slate-50"
// // // // // // // // // //     : "min-h-full bg-slate-50 text-slate-900";

// // // // // // // // // //   return (
// // // // // // // // // //     <div className={containerClass}>
// // // // // // // // // //       <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
// // // // // // // // // //         {/* Header */}
// // // // // // // // // //         <div className="space-y-1">
// // // // // // // // // //           <p
// // // // // // // // // //             className={
// // // // // // // // // //               "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium " +
// // // // // // // // // //               (isDark ? "text-slate-600" : "text-slate-500")
// // // // // // // // // //             }
// // // // // // // // // //           >
// // // // // // // // // //             PRICING
// // // // // // // // // //           </p>
// // // // // // // // // //           <h1
// // // // // // // // // //             className={
// // // // // // // // // //               (isDark ? "text-slate-50" : "text-slate-900") +
// // // // // // // // // //               " mt-1 text-2xl sm:text-3xl font-semibold"
// // // // // // // // // //             }
// // // // // // // // // //           >
// // // // // // // // // //             Per-minute pricing per cabin
// // // // // // // // // //           </h1>
// // // // // // // // // //           <p
// // // // // // // // // //             className={
// // // // // // // // // //               isDark
// // // // // // // // // //                 ? "text-xs sm:text-sm text-slate-400"
// // // // // // // // // //                 : "text-xs sm:text-sm text-slate-600"
// // // // // // // // // //             }
// // // // // // // // // //           >
// // // // // // // // // //             Configure time & price rules for each device. This will be used for
// // // // // // // // // //             the POS and session start screen.
// // // // // // // // // //           </p>
// // // // // // // // // //         </div>

// // // // // // // // // //         {/* Cabins selector + info */}
// // // // // // // // // //         <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
// // // // // // // // // //           <div
// // // // // // // // // //             className={
// // // // // // // // // //               (isDark
// // // // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // // // //             }
// // // // // // // // // //           >
// // // // // // // // // //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// // // // // // // // // //               <div>
// // // // // // // // // //                 <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // // // //                   Select cabin
// // // // // // // // // //                 </h2>
// // // // // // // // // //                 <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // // // //                   Choose a device to manage its minute-by-minute pricing.
// // // // // // // // // //                 </p>
// // // // // // // // // //               </div>
// // // // // // // // // //               <div>
// // // // // // // // // //                 <select
// // // // // // // // // //                   className={
// // // // // // // // // //                     (isDark
// // // // // // // // // //                       ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // // // //                       : "bg-white border-slate-300 text-slate-900") +
// // // // // // // // // //                     " text-xs sm:text-sm rounded-xl border px-3 py-2 outline-none"
// // // // // // // // // //                   }
// // // // // // // // // //                   value={selectedCabinId}
// // // // // // // // // //                   onChange={(e) => setSelectedCabinId(e.target.value)}
// // // // // // // // // //                   disabled={loadingCabins || cabins.length === 0}
// // // // // // // // // //                 >
// // // // // // // // // //                   {loadingCabins && <option>Loading cabins…</option>}
// // // // // // // // // //                   {!loadingCabins && cabins.length === 0 && (
// // // // // // // // // //                     <option>No cabins available</option>
// // // // // // // // // //                   )}
// // // // // // // // // //                   {!loadingCabins &&
// // // // // // // // // //                     cabins.map((c) => (
// // // // // // // // // //                       <option key={c._id} value={c._id}>
// // // // // // // // // //                         {c.code ? `${c.code} · ${c.name}` : c.name}
// // // // // // // // // //                       </option>
// // // // // // // // // //                     ))}
// // // // // // // // // //                 </select>
// // // // // // // // // //               </div>
// // // // // // // // // //             </div>

// // // // // // // // // //             {cabinsError && (
// // // // // // // // // //               <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
// // // // // // // // // //                 {cabinsError}
// // // // // // // // // //               </p>
// // // // // // // // // //             )}

// // // // // // // // // //             {selectedCabinId && (
// // // // // // // // // //               <CabinSummary
// // // // // // // // // //                 isDark={isDark}
// // // // // // // // // //                 cabin={cabins.find((c) => c._id === selectedCabinId)}
// // // // // // // // // //               />
// // // // // // // // // //             )}
// // // // // // // // // //           </div>

// // // // // // // // // //           {/* Base minute price & helper */}
// // // // // // // // // //           <div
// // // // // // // // // //             className={
// // // // // // // // // //               (isDark
// // // // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // // // //             }
// // // // // // // // // //           >
// // // // // // // // // //             <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // // // //               Base price per minute
// // // // // // // // // //             </h2>
// // // // // // // // // //             <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // // // //               This price is used as fallback when a specific minute does not
// // // // // // // // // //               have its own price.
// // // // // // // // // //             </p>
// // // // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // // // //               <span className="text-xs text-slate-500">€</span>
// // // // // // // // // //               <input
// // // // // // // // // //                 type="number"
// // // // // // // // // //                 min="0"
// // // // // // // // // //                 step="0.1"
// // // // // // // // // //                 value={baseMinutePrice}
// // // // // // // // // //                 onChange={(e) => setBaseMinutePrice(e.target.value)}
// // // // // // // // // //                 className={
// // // // // // // // // //                   (isDark
// // // // // // // // // //                     ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // // // //                     : "bg-white border-slate-300 text-slate-900") +
// // // // // // // // // //                   " w-28 rounded-xl border px-3 py-1.5 text-sm outline-none"
// // // // // // // // // //                 }
// // // // // // // // // //               />
// // // // // // // // // //               <button
// // // // // // // // // //                 type="button"
// // // // // // // // // //                 onClick={applyBaseToEmpty}
// // // // // // // // // //                 className={
// // // // // // // // // //                   (isDark
// // // // // // // // // //                     ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // // // //                     : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // // // //                   " ml-auto rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition"
// // // // // // // // // //                 }
// // // // // // // // // //               >
// // // // // // // // // //                 Apply base to empty minutes
// // // // // // // // // //               </button>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //         </section>

// // // // // // // // // //         {/* Pricing editor */}
// // // // // // // // // //         <section
// // // // // // // // // //           className={
// // // // // // // // // //             (isDark
// // // // // // // // // //               ? "bg-slate-950/80 border-slate-800"
// // // // // // // // // //               : "bg-white border-slate-200") +
// // // // // // // // // //             " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-3"
// // // // // // // // // //           }
// // // // // // // // // //         >
// // // // // // // // // //           <div className="flex items-center justify-between gap-3">
// // // // // // // // // //             <div>
// // // // // // // // // //               <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // // // //                 Minute-by-minute pricing
// // // // // // // // // //               </h2>
// // // // // // // // // //               <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // // // //                 Define special prices for specific minutes (e.g. minute 6 = €6,
// // // // // // // // // //                 minute 7 = €8). Other minutes use the base price.
// // // // // // // // // //               </p>
// // // // // // // // // //             </div>
// // // // // // // // // //             {pricingLoading && (
// // // // // // // // // //               <span className="text-[11px] text-slate-500">
// // // // // // // // // //                 Loading pricing…
// // // // // // // // // //               </span>
// // // // // // // // // //             )}
// // // // // // // // // //           </div>

// // // // // // // // // //           {pricingError && (
// // // // // // // // // //             <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
// // // // // // // // // //               {pricingError}
// // // // // // // // // //             </p>
// // // // // // // // // //           )}

// // // // // // // // // //           <div className="border border-slate-700/40 rounded-xl max-h-80 overflow-y-auto mt-2">
// // // // // // // // // //             <table className="w-full text-[11px] sm:text-xs">
// // // // // // // // // //               <thead
// // // // // // // // // //                 className={
// // // // // // // // // //                   isDark ? "bg-slate-900/80" : "bg-slate-100/80 text-slate-700"
// // // // // // // // // //                 }
// // // // // // // // // //               >
// // // // // // // // // //                 <tr>
// // // // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Minute</th>
// // // // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Price (€)</th>
// // // // // // // // // //                   <th className="px-3 py-2 text-left font-medium">
// // // // // // // // // //                     Effective price
// // // // // // // // // //                   </th>
// // // // // // // // // //                 </tr>
// // // // // // // // // //               </thead>
// // // // // // // // // //               <tbody>
// // // // // // // // // //                 {minuteList.map((minute) => {
// // // // // // // // // //                   const key = String(minute);
// // // // // // // // // //                   const specificPrice = minutePricing[key];
// // // // // // // // // //                   const effectivePrice =
// // // // // // // // // //                     specificPrice !== undefined && specificPrice !== ""
// // // // // // // // // //                       ? specificPrice
// // // // // // // // // //                       : baseMinutePrice;

// // // // // // // // // //                   return (
// // // // // // // // // //                     <tr
// // // // // // // // // //                       key={minute}
// // // // // // // // // //                       className={
// // // // // // // // // //                         minute % 2 === 0
// // // // // // // // // //                           ? isDark
// // // // // // // // // //                             ? "bg-slate-950"
// // // // // // // // // //                             : "bg-white"
// // // // // // // // // //                           : isDark
// // // // // // // // // //                           ? "bg-slate-900/70"
// // // // // // // // // //                           : "bg-slate-50"
// // // // // // // // // //                       }
// // // // // // // // // //                     >
// // // // // // // // // //                       <td className="px-3 py-1.5 font-medium">Min {minute}</td>
// // // // // // // // // //                       <td className="px-3 py-1.5">
// // // // // // // // // //                         <input
// // // // // // // // // //                           type="number"
// // // // // // // // // //                           min="0"
// // // // // // // // // //                           step="0.1"
// // // // // // // // // //                           value={
// // // // // // // // // //                             specificPrice === undefined ? "" : specificPrice
// // // // // // // // // //                           }
// // // // // // // // // //                           onChange={(e) =>
// // // // // // // // // //                             handleMinutePriceChange(
// // // // // // // // // //                               minute,
// // // // // // // // // //                               e.target.value === "" ? "" : e.target.value
// // // // // // // // // //                             )
// // // // // // // // // //                           }
// // // // // // // // // //                           className={
// // // // // // // // // //                             (isDark
// // // // // // // // // //                               ? "bg-slate-950 border-slate-700 text-slate-100"
// // // // // // // // // //                               : "bg-white border-slate-300 text-slate-900") +
// // // // // // // // // //                             " w-24 rounded-lg border px-2 py-1 text-[11px] outline-none"
// // // // // // // // // //                           }
// // // // // // // // // //                           placeholder={baseMinutePrice}
// // // // // // // // // //                         />
// // // // // // // // // //                       </td>
// // // // // // // // // //                       <td className="px-3 py-1.5 text-slate-500">
// // // // // // // // // //                         € {Number(effectivePrice || 0).toFixed(2)}
// // // // // // // // // //                       </td>
// // // // // // // // // //                     </tr>
// // // // // // // // // //                   );
// // // // // // // // // //                 })}
// // // // // // // // // //               </tbody>
// // // // // // // // // //             </table>
// // // // // // // // // //           </div>

// // // // // // // // // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
// // // // // // // // // //             <div className="text-[11px] text-slate-500">
// // // // // // // // // //               Tip: leave a field empty to use the base price for that minute.
// // // // // // // // // //             </div>
// // // // // // // // // //             <button
// // // // // // // // // //               type="button"
// // // // // // // // // //               disabled={saving || pricingLoading || !selectedCabinId}
// // // // // // // // // //               onClick={handleSave}
// // // // // // // // // //               className={
// // // // // // // // // //                 (isDark
// // // // // // // // // //                   ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // // // //                   : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // // // //                 " rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition disabled:opacity-60"
// // // // // // // // // //               }
// // // // // // // // // //             >
// // // // // // // // // //               {saving ? "Saving…" : "Save pricing for this cabin"}
// // // // // // // // // //             </button>
// // // // // // // // // //           </div>

// // // // // // // // // //           {saveMessage && (
// // // // // // // // // //             <p className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2 mt-2">
// // // // // // // // // //               {saveMessage}
// // // // // // // // // //             </p>
// // // // // // // // // //           )}
// // // // // // // // // //         </section>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // function CabinSummary({ isDark, cabin }) {
// // // // // // // // // //   if (!cabin) return null;

// // // // // // // // // //   return (
// // // // // // // // // //     <div
// // // // // // // // // //       className={
// // // // // // // // // //         (isDark
// // // // // // // // // //           ? "bg-slate-950 border-slate-800"
// // // // // // // // // //           : "bg-slate-50 border-slate-200") +
// // // // // // // // // //         " mt-4 rounded-2xl border px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
// // // // // // // // // //       }
// // // // // // // // // //     >
// // // // // // // // // //       <div>
// // // // // // // // // //         <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
// // // // // // // // // //           Selected cabin
// // // // // // // // // //         </p>
// // // // // // // // // //         <h3 className="mt-1 text-sm sm:text-base font-semibold">
// // // // // // // // // //           {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
// // // // // // // // // //         </h3>
// // // // // // // // // //         <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // // // //           {cabin.category || "No category"} ·{" "}
// // // // // // // // // //           {cabin.type || "No device type set"}
// // // // // // // // // //         </p>
// // // // // // // // // //       </div>
// // // // // // // // // //       {cabin.imageUrl && (
// // // // // // // // // //         <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-900/60">
// // // // // // // // // //           <img
// // // // // // // // // //             src={cabin.imageUrl}
// // // // // // // // // //             alt={cabin.name}
// // // // // // // // // //             className="w-full h-full object-cover"
// // // // // // // // // //           />
// // // // // // // // // //         </div>
// // // // // // // // // //       )}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // export default CabinPricing;


// // // // // // // // // import React, { useState, useEffect } from "react";

// // // // // // // // // const API_BASE =
// // // // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // // // function CabinPricing({ theme }) {
// // // // // // // // //   const isDark = theme === "dark";

// // // // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // // // //   const [selectedCabin, setSelectedCabin] = useState(null);

// // // // // // // // //   const [basePrice, setBasePrice] = useState(5);
// // // // // // // // //   const [minutePricing, setMinutePricing] = useState({});

// // // // // // // // //   const [saving, setSaving] = useState(false);

// // // // // // // // //   // Load cabins
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     fetch(`${API_BASE}/api/cabins`)
// // // // // // // // //       .then((r) => r.json())
// // // // // // // // //       .then((data) => setCabins(data))
// // // // // // // // //       .catch((e) => console.error("Cabins load error", e));
// // // // // // // // //   }, []);

// // // // // // // // //   // When cabin changes → load pricing
// // // // // // // // //   const loadPricing = async (id) => {
// // // // // // // // //     const res = await fetch(`${API_BASE}/api/cabins/${id}/pricing`);
// // // // // // // // //     const data = await res.json();
// // // // // // // // //     setBasePrice(data.baseMinutePrice);
// // // // // // // // //     setMinutePricing(data.minutePricing || {});
// // // // // // // // //   };

// // // // // // // // //   const handleSelectCabin = (cabin) => {
// // // // // // // // //     setSelectedCabin(cabin);
// // // // // // // // //     loadPricing(cabin._id);
// // // // // // // // //   };

// // // // // // // // //   // Update price for a specific minute
// // // // // // // // //   const updateMinute = (minute, value) => {
// // // // // // // // //     setMinutePricing({
// // // // // // // // //       ...minutePricing,
// // // // // // // // //       [minute]: value,
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   // Save to backend
// // // // // // // // //   const savePricing = async () => {
// // // // // // // // //     if (!selectedCabin) return;

// // // // // // // // //     setSaving(true);

// // // // // // // // //     await fetch(`${API_BASE}/api/cabins/${selectedCabin._id}/pricing`, {
// // // // // // // // //       method: "PUT",
// // // // // // // // //       headers: { "Content-Type": "application/json" },
// // // // // // // // //       body: JSON.stringify({
// // // // // // // // //         baseMinutePrice: Number(basePrice),
// // // // // // // // //         minutePricing,
// // // // // // // // //       }),
// // // // // // // // //     });

// // // // // // // // //     setSaving(false);
// // // // // // // // //     alert("Pricing saved successfully!");
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div
// // // // // // // // //       className={
// // // // // // // // //         isDark
// // // // // // // // //           ? "min-h-full bg-slate-950 text-slate-50"
// // // // // // // // //           : "min-h-full bg-slate-50 text-slate-900"
// // // // // // // // //       }
// // // // // // // // //     >
// // // // // // // // //       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
// // // // // // // // //         {/* Header */}
// // // // // // // // //         <div>
// // // // // // // // //           <p className="text-[10px] tracking-[0.25em] text-slate-500 uppercase">
// // // // // // // // //             Pricing / POS System
// // // // // // // // //           </p>
// // // // // // // // //           <h1 className="text-2xl font-semibold">
// // // // // // // // //             Per-minute Pricing Control
// // // // // // // // //           </h1>
// // // // // // // // //           <p className="text-xs text-slate-400">
// // // // // // // // //             Set pricing for every single minute (1–180) for each cabin/device.
// // // // // // // // //           </p>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Cabin selector */}
// // // // // // // // //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// // // // // // // // //           {cabins.map((cabin) => (
// // // // // // // // //             <button
// // // // // // // // //               key={cabin._id}
// // // // // // // // //               onClick={() => handleSelectCabin(cabin)}
// // // // // // // // //               className={
// // // // // // // // //                 "p-3 rounded-xl border text-left " +
// // // // // // // // //                 (selectedCabin?._id === cabin._id
// // // // // // // // //                   ? "border-emerald-400 bg-emerald-500/10"
// // // // // // // // //                   : "border-slate-700 bg-slate-900")
// // // // // // // // //               }
// // // // // // // // //             >
// // // // // // // // //               <p className="text-sm font-semibold">{cabin.name}</p>
// // // // // // // // //               <p className="text-xs text-slate-400">{cabin.category}</p>
// // // // // // // // //             </button>
// // // // // // // // //           ))}
// // // // // // // // //         </div>

// // // // // // // // //         {/* Pricing form */}
// // // // // // // // //         {selectedCabin && (
// // // // // // // // //           <div
// // // // // // // // //             className={
// // // // // // // // //               "rounded-2xl border p-5 " +
// // // // // // // // //               (isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")
// // // // // // // // //             }
// // // // // // // // //           >
// // // // // // // // //             <h2 className="text-lg font-semibold mb-3">
// // // // // // // // //               {selectedCabin.name} – Pricing
// // // // // // // // //             </h2>

// // // // // // // // //             {/* Base price */}
// // // // // // // // //             <div className="mb-4">
// // // // // // // // //               <label className="text-sm font-medium">Base price per minute</label>
// // // // // // // // //               <input
// // // // // // // // //                 type="number"
// // // // // // // // //                 value={basePrice}
// // // // // // // // //                 onChange={(e) => setBasePrice(e.target.value)}
// // // // // // // // //                 className="w-32 mt-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700"
// // // // // // // // //               />
// // // // // // // // //               <p className="text-xs text-slate-500">
// // // // // // // // //                 If a minute has no custom price, this price will be used.
// // // // // // // // //               </p>
// // // // // // // // //             </div>

// // // // // // // // //             {/* Minute pricing table */}
// // // // // // // // //             <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-[360px] overflow-y-auto p-2 border rounded-xl border-slate-700">
// // // // // // // // //               {[...Array(180)].map((_, i) => {
// // // // // // // // //                 const minute = i + 1;
// // // // // // // // //                 return (
// // // // // // // // //                   <div key={minute} className="flex flex-col">
// // // // // // // // //                     <label className="text-[9px] text-slate-400">{minute} min</label>
// // // // // // // // //                     <input
// // // // // // // // //                       type="number"
// // // // // // // // //                       value={minutePricing[minute] || ""}
// // // // // // // // //                       onChange={(e) => updateMinute(minute, e.target.value)}
// // // // // // // // //                       placeholder={basePrice}
// // // // // // // // //                       className="px-1 py-1 rounded bg-slate-800 border border-slate-700 text-xs"
// // // // // // // // //                     />
// // // // // // // // //                   </div>
// // // // // // // // //                 );
// // // // // // // // //               })}
// // // // // // // // //             </div>

// // // // // // // // //             <button
// // // // // // // // //               onClick={savePricing}
// // // // // // // // //               disabled={saving}
// // // // // // // // //               className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold"
// // // // // // // // //             >
// // // // // // // // //               {saving ? "Saving..." : "Save Pricing"}
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //         )}
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default CabinPricing;


// // // // // // // // // src/pages/CabinPricing.jsx
// // // // // // // // import React, { useEffect, useState, useMemo } from "react";

// // // // // // // // const API_BASE =
// // // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // // function CabinPricing({ theme }) {
// // // // // // // //   const isDark = theme === "dark";

// // // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // // //   const [loadingCabins, setLoadingCabins] = useState(true);
// // // // // // // //   const [cabinsError, setCabinsError] = useState("");

// // // // // // // //   const [selectedCabinId, setSelectedCabinId] = useState("");
// // // // // // // //   const [pricingLoading, setPricingLoading] = useState(false);
// // // // // // // //   const [pricingError, setPricingError] = useState("");

// // // // // // // //   const [baseMinutePrice, setBaseMinutePrice] = useState(5);
// // // // // // // //   const [minutePricing, setMinutePricing] = useState({});
// // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // //   const [saveMessage, setSaveMessage] = useState("");

// // // // // // // //   // 1) Load cabins
// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchCabins = async () => {
// // // // // // // //       try {
// // // // // // // //         setLoadingCabins(true);
// // // // // // // //         setCabinsError("");
// // // // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // // // //         if (!res.ok) throw new Error("Failed to load cabins");
// // // // // // // //         const data = await res.json();
// // // // // // // //         setCabins(data || []);
// // // // // // // //         if (data && data.length > 0) {
// // // // // // // //           setSelectedCabinId(data[0]._id);
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Cabins fetch error:", err);
// // // // // // // //         setCabinsError("Could not load cabins from server.");
// // // // // // // //       } finally {
// // // // // // // //         setLoadingCabins(false);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     fetchCabins();
// // // // // // // //   }, []);

// // // // // // // //   // 2) Load pricing for selected cabin
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!selectedCabinId) return;

// // // // // // // //     const fetchPricing = async () => {
// // // // // // // //       try {
// // // // // // // //         setPricingLoading(true);
// // // // // // // //         setPricingError("");
// // // // // // // //         setSaveMessage("");

// // // // // // // //         const res = await fetch(
// // // // // // // //           `${API_BASE}/api/cabins/${selectedCabinId}/pricing`
// // // // // // // //         );
// // // // // // // //         if (!res.ok) throw new Error("Failed to load pricing");
// // // // // // // //         const data = await res.json();

// // // // // // // //         setBaseMinutePrice(data.baseMinutePrice ?? 5);
// // // // // // // //         setMinutePricing(data.minutePricing || {});
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Pricing fetch error:", err);
// // // // // // // //         setPricingError("Could not load pricing for this cabin.");
// // // // // // // //       } finally {
// // // // // // // //         setPricingLoading(false);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     fetchPricing();
// // // // // // // //   }, [selectedCabinId]);

// // // // // // // //   // 1–180 minutes
// // // // // // // //   const minuteList = useMemo(
// // // // // // // //     () => Array.from({ length: 180 }, (_, i) => i + 1),
// // // // // // // //     []
// // // // // // // //   );

// // // // // // // //   const handleMinutePriceChange = (minute, value) => {
// // // // // // // //     const priceNum = value === "" ? "" : Number(value);
// // // // // // // //     setMinutePricing((prev) => ({
// // // // // // // //       ...prev,
// // // // // // // //       [minute]: isNaN(priceNum) ? prev[minute] : priceNum,
// // // // // // // //     }));
// // // // // // // //   };

// // // // // // // //   const applyBaseToEmpty = () => {
// // // // // // // //     setMinutePricing((prev) => {
// // // // // // // //       const updated = { ...prev };
// // // // // // // //       minuteList.forEach((m) => {
// // // // // // // //         const key = String(m);
// // // // // // // //         if (
// // // // // // // //           updated[key] === undefined ||
// // // // // // // //           updated[key] === null ||
// // // // // // // //           updated[key] === ""
// // // // // // // //         ) {
// // // // // // // //           updated[key] = Number(baseMinutePrice) || 0;
// // // // // // // //         }
// // // // // // // //       });
// // // // // // // //       return updated;
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   const handleSave = async () => {
// // // // // // // //     if (!selectedCabinId) return;
// // // // // // // //     try {
// // // // // // // //       setSaving(true);
// // // // // // // //       setSaveMessage("");
// // // // // // // //       setPricingError("");

// // // // // // // //       const cleanPricing = {};
// // // // // // // //       for (const m of minuteList) {
// // // // // // // //         const key = String(m);
// // // // // // // //         const val = minutePricing[key];
// // // // // // // //         if (val !== undefined && val !== null && val !== "") {
// // // // // // // //           const n = Number(val);
// // // // // // // //           if (!isNaN(n) && n >= 0) {
// // // // // // // //             cleanPricing[key] = n;
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       }

// // // // // // // //       const res = await fetch(
// // // // // // // //         `${API_BASE}/api/cabins/${selectedCabinId}/pricing`,
// // // // // // // //         {
// // // // // // // //           method: "PUT",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify({
// // // // // // // //             baseMinutePrice: Number(baseMinutePrice) || 0,
// // // // // // // //             minutePricing: cleanPricing,
// // // // // // // //           }),
// // // // // // // //         }
// // // // // // // //       );

// // // // // // // //       if (!res.ok) {
// // // // // // // //         throw new Error("Failed to save pricing");
// // // // // // // //       }

// // // // // // // //       const data = await res.json();
// // // // // // // //       setSaveMessage("Pricing saved successfully for this cabin.");
// // // // // // // //       setMinutePricing(data.minutePricing || {});
// // // // // // // //       setBaseMinutePrice(data.baseMinutePrice ?? baseMinutePrice);
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Save pricing error:", err);
// // // // // // // //       setPricingError("Failed to save pricing. Please try again.");
// // // // // // // //     } finally {
// // // // // // // //       setSaving(false);
// // // // // // // //       setTimeout(() => setSaveMessage(""), 3000);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const containerClass = isDark
// // // // // // // //     ? "min-h-full bg-slate-950 text-slate-50"
// // // // // // // //     : "min-h-full bg-slate-50 text-slate-900";

// // // // // // // //   return (
// // // // // // // //     <div className={containerClass}>
// // // // // // // //       <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
// // // // // // // //         {/* Header */}
// // // // // // // //         <div className="space-y-1">
// // // // // // // //           <p
// // // // // // // //             className={
// // // // // // // //               "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium " +
// // // // // // // //               (isDark ? "text-slate-600" : "text-slate-500")
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             PRICING
// // // // // // // //           </p>
// // // // // // // //           <h1
// // // // // // // //             className={
// // // // // // // //               (isDark ? "text-slate-50" : "text-slate-900") +
// // // // // // // //               " mt-1 text-2xl sm:text-3xl font-semibold"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             Per-minute pricing per cabin
// // // // // // // //           </h1>
// // // // // // // //           <p
// // // // // // // //             className={
// // // // // // // //               isDark
// // // // // // // //                 ? "text-xs sm:text-sm text-slate-400"
// // // // // // // //                 : "text-xs sm:text-sm text-slate-600"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             Configure time & price rules for each device. This will be used for
// // // // // // // //             the POS and session start screen.
// // // // // // // //           </p>
// // // // // // // //         </div>

// // // // // // // //         {/* Cabin selector + base price */}
// // // // // // // //         <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
// // // // // // // //           <div
// // // // // // // //             className={
// // // // // // // //               (isDark
// // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// // // // // // // //               <div>
// // // // // // // //                 <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //                   Select cabin
// // // // // // // //                 </h2>
// // // // // // // //                 <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //                   Choose a device to manage its minute-by-minute pricing.
// // // // // // // //                 </p>
// // // // // // // //               </div>
// // // // // // // //               <div>
// // // // // // // //                 <select
// // // // // // // //                   className={
// // // // // // // //                     (isDark
// // // // // // // //                       ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // //                       : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                     " text-xs sm:text-sm rounded-xl border px-3 py-2 outline-none"
// // // // // // // //                   }
// // // // // // // //                   value={selectedCabinId}
// // // // // // // //                   onChange={(e) => setSelectedCabinId(e.target.value)}
// // // // // // // //                   disabled={loadingCabins || cabins.length === 0}
// // // // // // // //                 >
// // // // // // // //                   {loadingCabins && <option>Loading cabins…</option>}
// // // // // // // //                   {!loadingCabins && cabins.length === 0 && (
// // // // // // // //                     <option>No cabins available</option>
// // // // // // // //                   )}
// // // // // // // //                   {!loadingCabins &&
// // // // // // // //                     cabins.map((c) => (
// // // // // // // //                       <option key={c._id} value={c._id}>
// // // // // // // //                         {c.code ? `${c.code} · ${c.name}` : c.name}
// // // // // // // //                       </option>
// // // // // // // //                     ))}
// // // // // // // //                 </select>
// // // // // // // //               </div>
// // // // // // // //             </div>

// // // // // // // //             {cabinsError && (
// // // // // // // //               <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
// // // // // // // //                 {cabinsError}
// // // // // // // //               </p>
// // // // // // // //             )}

// // // // // // // //             {selectedCabinId && (
// // // // // // // //               <CabinSummary
// // // // // // // //                 isDark={isDark}
// // // // // // // //                 cabin={cabins.find((c) => c._id === selectedCabinId)}
// // // // // // // //               />
// // // // // // // //             )}
// // // // // // // //           </div>

// // // // // // // //           {/* Base price card */}
// // // // // // // //           <div
// // // // // // // //             className={
// // // // // // // //               (isDark
// // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //               Base price per minute
// // // // // // // //             </h2>
// // // // // // // //             <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //               If a minute has no custom price, this base price will be used.
// // // // // // // //             </p>
// // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // //               <span className="text-xs text-slate-500">€</span>
// // // // // // // //               <input
// // // // // // // //                 type="number"
// // // // // // // //                 min="0"
// // // // // // // //                 step="0.1"
// // // // // // // //                 value={baseMinutePrice}
// // // // // // // //                 onChange={(e) => setBaseMinutePrice(e.target.value)}
// // // // // // // //                 className={
// // // // // // // //                   (isDark
// // // // // // // //                     ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // //                     : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                   " w-28 rounded-xl border px-3 py-1.5 text-sm outline-none"
// // // // // // // //                 }
// // // // // // // //               />
// // // // // // // //               <button
// // // // // // // //                 type="button"
// // // // // // // //                 onClick={applyBaseToEmpty}
// // // // // // // //                 className={
// // // // // // // //                   (isDark
// // // // // // // //                     ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // //                     : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // //                   " ml-auto rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition"
// // // // // // // //                 }
// // // // // // // //               >
// // // // // // // //                 Apply base to empty minutes
// // // // // // // //               </button>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         </section>

// // // // // // // //         {/* Minute table */}
// // // // // // // //         <section
// // // // // // // //           className={
// // // // // // // //             (isDark
// // // // // // // //               ? "bg-slate-950/80 border-slate-800"
// // // // // // // //               : "bg-white border-slate-200") +
// // // // // // // //             " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-3"
// // // // // // // //           }
// // // // // // // //         >
// // // // // // // //           <div className="flex items-center justify-between gap-3">
// // // // // // // //             <div>
// // // // // // // //               <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //                 Minute-by-minute pricing (1–180)
// // // // // // // //               </h2>
// // // // // // // //               <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //                 Define special prices for specific minutes. All other minutes
// // // // // // // //                 use the base price.
// // // // // // // //               </p>
// // // // // // // //             </div>
// // // // // // // //             {pricingLoading && (
// // // // // // // //               <span className="text-[11px] text-slate-500">
// // // // // // // //                 Loading pricing…
// // // // // // // //               </span>
// // // // // // // //             )}
// // // // // // // //           </div>

// // // // // // // //           {pricingError && (
// // // // // // // //             <p className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-2">
// // // // // // // //               {pricingError}
// // // // // // // //             </p>
// // // // // // // //           )}

// // // // // // // //           <div className="border border-slate-700/40 rounded-xl max-h-80 overflow-y-auto mt-2">
// // // // // // // //             <table className="w-full text-[11px] sm:text-xs">
// // // // // // // //               <thead
// // // // // // // //                 className={
// // // // // // // //                   isDark ? "bg-slate-900/80" : "bg-slate-100/80 text-slate-700"
// // // // // // // //                 }
// // // // // // // //               >
// // // // // // // //                 <tr>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Minute</th>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Price (€)</th>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">
// // // // // // // //                     Effective price
// // // // // // // //                   </th>
// // // // // // // //                 </tr>
// // // // // // // //               </thead>
// // // // // // // //               <tbody>
// // // // // // // //                 {minuteList.map((minute) => {
// // // // // // // //                   const key = String(minute);
// // // // // // // //                   const specificPrice = minutePricing[key];
// // // // // // // //                   const effectivePrice =
// // // // // // // //                     specificPrice !== undefined && specificPrice !== ""
// // // // // // // //                       ? specificPrice
// // // // // // // //                       : baseMinutePrice;

// // // // // // // //                   return (
// // // // // // // //                     <tr
// // // // // // // //                       key={minute}
// // // // // // // //                       className={
// // // // // // // //                         minute % 2 === 0
// // // // // // // //                           ? isDark
// // // // // // // //                             ? "bg-slate-950"
// // // // // // // //                             : "bg-white"
// // // // // // // //                           : isDark
// // // // // // // //                           ? "bg-slate-900/70"
// // // // // // // //                           : "bg-slate-50"
// // // // // // // //                       }
// // // // // // // //                     >
// // // // // // // //                       <td className="px-3 py-1.5 font-medium">Min {minute}</td>
// // // // // // // //                       <td className="px-3 py-1.5">
// // // // // // // //                         <input
// // // // // // // //                           type="number"
// // // // // // // //                           min="0"
// // // // // // // //                           step="0.1"
// // // // // // // //                           value={
// // // // // // // //                             specificPrice === undefined ? "" : specificPrice
// // // // // // // //                           }
// // // // // // // //                           onChange={(e) =>
// // // // // // // //                             handleMinutePriceChange(
// // // // // // // //                               minute,
// // // // // // // //                               e.target.value === "" ? "" : e.target.value
// // // // // // // //                             )
// // // // // // // //                           }
// // // // // // // //                           className={
// // // // // // // //                             (isDark
// // // // // // // //                               ? "bg-slate-950 border-slate-700 text-slate-100"
// // // // // // // //                               : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                             " w-24 rounded-lg border px-2 py-1 text-[11px] outline-none"
// // // // // // // //                           }
// // // // // // // //                           placeholder={baseMinutePrice}
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                       <td className="px-3 py-1.5 text-slate-500">
// // // // // // // //                         € {Number(effectivePrice || 0).toFixed(2)}
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   );
// // // // // // // //                 })}
// // // // // // // //               </tbody>
// // // // // // // //             </table>
// // // // // // // //           </div>

// // // // // // // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
// // // // // // // //             <div className="text-[11px] text-slate-500">
// // // // // // // //               Tip: leave a field empty to use the base price for that minute.
// // // // // // // //             </div>
// // // // // // // //             <button
// // // // // // // //               type="button"
// // // // // // // //               disabled={saving || pricingLoading || !selectedCabinId}
// // // // // // // //               onClick={handleSave}
// // // // // // // //               className={
// // // // // // // //                 (isDark
// // // // // // // //                   ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // //                   : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // //                 " rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition disabled:opacity-60"
// // // // // // // //               }
// // // // // // // //             >
// // // // // // // //               {saving ? "Saving…" : "Save pricing for this cabin"}
// // // // // // // //             </button>
// // // // // // // //           </div>

// // // // // // // //           {saveMessage && (
// // // // // // // //             <p className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2 mt-2">
// // // // // // // //               {saveMessage}
// // // // // // // //             </p>
// // // // // // // //           )}
// // // // // // // //         </section>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // function CabinSummary({ isDark, cabin }) {
// // // // // // // //   if (!cabin) return null;

// // // // // // // //   return (
// // // // // // // //     <div
// // // // // // // //       className={
// // // // // // // //         (isDark
// // // // // // // //           ? "bg-slate-950 border-slate-800"
// // // // // // // //           : "bg-slate-50 border-slate-200") +
// // // // // // // //         " mt-4 rounded-2xl border px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
// // // // // // // //       }
// // // // // // // //     >
// // // // // // // //       <div>
// // // // // // // //         <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
// // // // // // // //           Selected cabin
// // // // // // // //         </p>
// // // // // // // //         <h3 className="mt-1 text-sm sm:text-base font-semibold">
// // // // // // // //           {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
// // // // // // // //         </h3>
// // // // // // // //         <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //           {cabin.category || "No category"} ·{" "}
// // // // // // // //           {cabin.type || "No device type set"}
// // // // // // // //         </p>
// // // // // // // //       </div>
// // // // // // // //       {cabin.imageUrl && (
// // // // // // // //         <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-900/60">
// // // // // // // //           <img
// // // // // // // //             src={cabin.imageUrl}
// // // // // // // //             alt={cabin.name}
// // // // // // // //             className="w-full h-full object-cover"
// // // // // // // //           />
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default CabinPricing;

// // // // // // // // // src/pages/CabinPricing.jsx
// // // // // // // // import React, { useEffect, useState, useMemo } from "react";

// // // // // // // // const API_BASE =
// // // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // // function CabinPricing({ theme }) {
// // // // // // // //   const isDark = theme === "dark";

// // // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // // //   const [loadingCabins, setLoadingCabins] = useState(true);
// // // // // // // //   const [cabinsError, setCabinsError] = useState("");

// // // // // // // //   const [selectedCabinId, setSelectedCabinId] = useState("");
// // // // // // // //   const [pricingLoading, setPricingLoading] = useState(false);

// // // // // // // //   const [baseMinutePrice, setBaseMinutePrice] = useState(1);
// // // // // // // //   const [minutePricing, setMinutePricing] = useState({}); // { "1": 5, "2": 5, ... }

// // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // //   const [saveMessage, setSaveMessage] = useState("");
// // // // // // // //   const [saveStatus, setSaveStatus] = useState(null); // "success" | null

// // // // // // // //   // -------- 1) Fetch cabins list --------
// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchCabins = async () => {
// // // // // // // //       try {
// // // // // // // //         setLoadingCabins(true);
// // // // // // // //         setCabinsError("");

// // // // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // // // //         if (!res.ok) throw new Error("Failed to load cabins");
// // // // // // // //         const data = await res.json();

// // // // // // // //         setCabins(data || []);
// // // // // // // //         if (data && data.length > 0) {
// // // // // // // //           setSelectedCabinId(data[0]._id);
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Cabins fetch error:", err);
// // // // // // // //         setCabinsError("We couldn't load the cabin list from the server.");
// // // // // // // //       } finally {
// // // // // // // //         setLoadingCabins(false);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     fetchCabins();
// // // // // // // //   }, []);

// // // // // // // //   // -------- 2) Fetch pricing for selected cabin --------
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!selectedCabinId) return;

// // // // // // // //     const fetchPricing = async () => {
// // // // // // // //       try {
// // // // // // // //         setPricingLoading(true);
// // // // // // // //         setSaveMessage("");
// // // // // // // //         setSaveStatus(null);

// // // // // // // //         const res = await fetch(
// // // // // // // //           `${API_BASE}/api/cabins/${selectedCabinId}/pricing`
// // // // // // // //         );
// // // // // // // //         if (!res.ok) {
// // // // // // // //           // silent in UI, log only
// // // // // // // //           throw new Error("Failed to load pricing");
// // // // // // // //         }

// // // // // // // //         const data = await res.json();
// // // // // // // //         setBaseMinutePrice(data.baseMinutePrice ?? 1);
// // // // // // // //         setMinutePricing(data.minutePricing || {});
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Pricing fetch error:", err);
// // // // // // // //         // no red banner – keep UI clean
// // // // // // // //       } finally {
// // // // // // // //         setPricingLoading(false);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     fetchPricing();
// // // // // // // //   }, [selectedCabinId]);

// // // // // // // //   // 1–180 minute options
// // // // // // // //   const minuteList = useMemo(
// // // // // // // //     () => Array.from({ length: 180 }, (_, i) => i + 1),
// // // // // // // //     []
// // // // // // // //   );

// // // // // // // //   const handleMinutePriceChange = (minute, value) => {
// // // // // // // //     const val = value === "" ? "" : Number(value);
// // // // // // // //     setMinutePricing((prev) => ({
// // // // // // // //       ...prev,
// // // // // // // //       [minute]: Number.isNaN(val) ? prev[minute] : val,
// // // // // // // //     }));
// // // // // // // //   };

// // // // // // // //   const applyBaseToEmpty = () => {
// // // // // // // //     setMinutePricing((prev) => {
// // // // // // // //       const updated = { ...prev };
// // // // // // // //       minuteList.forEach((m) => {
// // // // // // // //         const key = String(m);
// // // // // // // //         if (
// // // // // // // //           updated[key] === undefined ||
// // // // // // // //           updated[key] === null ||
// // // // // // // //           updated[key] === ""
// // // // // // // //         ) {
// // // // // // // //           updated[key] = Number(baseMinutePrice) || 0;
// // // // // // // //         }
// // // // // // // //       });
// // // // // // // //       return updated;
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   const handleSave = async () => {
// // // // // // // //     if (!selectedCabinId) return;
// // // // // // // //     try {
// // // // // // // //       setSaving(true);
// // // // // // // //       setSaveStatus(null);
// // // // // // // //       setSaveMessage("");

// // // // // // // //       const cleanPricing = {};
// // // // // // // //       for (const m of minuteList) {
// // // // // // // //         const key = String(m);
// // // // // // // //         const val = minutePricing[key];
// // // // // // // //         if (val !== undefined && val !== null && val !== "") {
// // // // // // // //           const n = Number(val);
// // // // // // // //           if (!Number.isNaN(n) && n >= 0) {
// // // // // // // //             cleanPricing[key] = n;
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       }

// // // // // // // //       const res = await fetch(
// // // // // // // //         `${API_BASE}/api/cabins/${selectedCabinId}/pricing`,
// // // // // // // //         {
// // // // // // // //           method: "PUT",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify({
// // // // // // // //             baseMinutePrice: Number(baseMinutePrice) || 0,
// // // // // // // //             minutePricing: cleanPricing,
// // // // // // // //           }),
// // // // // // // //         }
// // // // // // // //       );

// // // // // // // //       if (!res.ok) throw new Error("Failed to save pricing");

// // // // // // // //       const data = await res.json();
// // // // // // // //       setMinutePricing(data.minutePricing || {});
// // // // // // // //       setBaseMinutePrice(data.baseMinutePrice ?? baseMinutePrice);

// // // // // // // //       setSaveStatus("success");
// // // // // // // //       setSaveMessage("Pricing has been saved for this cabin.");
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Save pricing error:", err);
// // // // // // // //     } finally {
// // // // // // // //       setSaving(false);
// // // // // // // //       setTimeout(() => {
// // // // // // // //         setSaveMessage("");
// // // // // // // //         setSaveStatus(null);
// // // // // // // //       }, 3500);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const containerClass = isDark
// // // // // // // //     ? "min-h-full bg-slate-950 text-slate-50"
// // // // // // // //     : "min-h-full bg-slate-50 text-slate-900";

// // // // // // // //   return (
// // // // // // // //     <div className={containerClass}>
// // // // // // // //       <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
// // // // // // // //         {/* Header */}
// // // // // // // //         <div className="space-y-1">
// // // // // // // //           <p
// // // // // // // //             className={
// // // // // // // //               "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium " +
// // // // // // // //               (isDark ? "text-slate-600" : "text-slate-500")
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             PRICING
// // // // // // // //           </p>
// // // // // // // //           <h1
// // // // // // // //             className={
// // // // // // // //               (isDark ? "text-slate-50" : "text-slate-900") +
// // // // // // // //               " mt-1 text-2xl sm:text-3xl font-semibold"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             Per-minute pricing per cabin
// // // // // // // //           </h1>
// // // // // // // //           <p
// // // // // // // //             className={
// // // // // // // //               isDark
// // // // // // // //                 ? "text-xs sm:text-sm text-slate-400"
// // // // // // // //                 : "text-xs sm:text-sm text-slate-600"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             Configure detailed time &amp; price rules for each device. These
// // // // // // // //             prices will be used by the POS and the session start screen.
// // // // // // // //           </p>
// // // // // // // //         </div>

// // // // // // // //         {/* Cabins selector + info */}
// // // // // // // //         <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
// // // // // // // //           <div
// // // // // // // //             className={
// // // // // // // //               (isDark
// // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// // // // // // // //               <div>
// // // // // // // //                 <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //                   Select cabin
// // // // // // // //                 </h2>
// // // // // // // //                 <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //                   Choose a device to manage its minute-by-minute pricing.
// // // // // // // //                 </p>
// // // // // // // //               </div>
// // // // // // // //               <div>
// // // // // // // //                 <select
// // // // // // // //                   className={
// // // // // // // //                     (isDark
// // // // // // // //                       ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // //                       : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                     " text-xs sm:text-sm rounded-xl border px-3 py-2 outline-none"
// // // // // // // //                   }
// // // // // // // //                   value={selectedCabinId}
// // // // // // // //                   onChange={(e) => setSelectedCabinId(e.target.value)}
// // // // // // // //                   disabled={loadingCabins || cabins.length === 0}
// // // // // // // //                 >
// // // // // // // //                   {loadingCabins && <option>Loading cabins…</option>}
// // // // // // // //                   {!loadingCabins && cabins.length === 0 && (
// // // // // // // //                     <option>No cabins available</option>
// // // // // // // //                   )}
// // // // // // // //                   {!loadingCabins &&
// // // // // // // //                     cabins.map((c) => (
// // // // // // // //                       <option key={c._id} value={c._id}>
// // // // // // // //                         {c.code ? `${c.code} · ${c.name}` : c.name}
// // // // // // // //                       </option>
// // // // // // // //                     ))}
// // // // // // // //                 </select>
// // // // // // // //               </div>
// // // // // // // //             </div>

// // // // // // // //             {cabinsError && (
// // // // // // // //               <p className="text-[11px] text-amber-300 bg-amber-500/5 border border-amber-400/40 rounded-lg px-3 py-2 mt-2">
// // // // // // // //                 {cabinsError}
// // // // // // // //               </p>
// // // // // // // //             )}

// // // // // // // //             {selectedCabinId && (
// // // // // // // //               <CabinSummary
// // // // // // // //                 isDark={isDark}
// // // // // // // //                 cabin={cabins.find((c) => c._id === selectedCabinId)}
// // // // // // // //               />
// // // // // // // //             )}
// // // // // // // //           </div>

// // // // // // // //           {/* Base minute price & helper */}
// // // // // // // //           <div
// // // // // // // //             className={
// // // // // // // //               (isDark
// // // // // // // //                 ? "bg-slate-950/80 border-slate-800"
// // // // // // // //                 : "bg-white border-slate-200") +
// // // // // // // //               " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-4 shadow-sm"
// // // // // // // //             }
// // // // // // // //           >
// // // // // // // //             <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //               Base price per minute
// // // // // // // //             </h2>
// // // // // // // //             <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //               If a minute has no custom price, this base price will be used.
// // // // // // // //             </p>
// // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // //               <span className="text-xs text-slate-500">€</span>
// // // // // // // //               <input
// // // // // // // //                 type="number"
// // // // // // // //                 min="0"
// // // // // // // //                 step="0.1"
// // // // // // // //                 value={baseMinutePrice}
// // // // // // // //                 onChange={(e) => setBaseMinutePrice(e.target.value)}
// // // // // // // //                 className={
// // // // // // // //                   (isDark
// // // // // // // //                     ? "bg-slate-900 border-slate-700 text-slate-100"
// // // // // // // //                     : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                   " w-28 rounded-xl border px-3 py-1.5 text-sm outline-none"
// // // // // // // //                 }
// // // // // // // //               />
// // // // // // // //               <button
// // // // // // // //                 type="button"
// // // // // // // //                 onClick={applyBaseToEmpty}
// // // // // // // //                 className={
// // // // // // // //                   (isDark
// // // // // // // //                     ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // //                     : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // //                   " ml-auto rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition"
// // // // // // // //                 }
// // // // // // // //               >
// // // // // // // //                 Apply base to empty minutes
// // // // // // // //               </button>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         </section>

// // // // // // // //         {/* Pricing editor */}
// // // // // // // //         <section
// // // // // // // //           className={
// // // // // // // //             (isDark
// // // // // // // //               ? "bg-slate-950/80 border-slate-800"
// // // // // // // //               : "bg-white border-slate-200") +
// // // // // // // //             " rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-3"
// // // // // // // //           }
// // // // // // // //         >
// // // // // // // //           <div className="flex items-center justify-between gap-3">
// // // // // // // //             <div>
// // // // // // // //               <h2 className="text-sm sm:text-base font-semibold">
// // // // // // // //                 Minute-by-minute pricing (1–180)
// // // // // // // //               </h2>
// // // // // // // //               <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //                 Set special prices for specific minutes (e.g. 6 = €6, 7 = €8).
// // // // // // // //                 All other minutes use the base price.
// // // // // // // //               </p>
// // // // // // // //             </div>
// // // // // // // //             {pricingLoading && (
// // // // // // // //               <span className="text-[11px] text-slate-500">
// // // // // // // //                 Loading pricing…
// // // // // // // //               </span>
// // // // // // // //             )}
// // // // // // // //           </div>

// // // // // // // //           <div className="border border-slate-700/40 rounded-xl max-h-80 overflow-y-auto mt-2">
// // // // // // // //             <table className="w-full text-[11px] sm:text-xs">
// // // // // // // //               <thead
// // // // // // // //                 className={
// // // // // // // //                   isDark ? "bg-slate-900/80" : "bg-slate-100/80 text-slate-700"
// // // // // // // //                 }
// // // // // // // //               >
// // // // // // // //                 <tr>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Minute</th>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">Price (€)</th>
// // // // // // // //                   <th className="px-3 py-2 text-left font-medium">
// // // // // // // //                     Effective price
// // // // // // // //                   </th>
// // // // // // // //                 </tr>
// // // // // // // //               </thead>
// // // // // // // //               <tbody>
// // // // // // // //                 {minuteList.map((minute) => {
// // // // // // // //                   const key = String(minute);
// // // // // // // //                   const specificPrice = minutePricing[key];
// // // // // // // //                   const effectivePrice =
// // // // // // // //                     specificPrice !== undefined && specificPrice !== ""
// // // // // // // //                       ? specificPrice
// // // // // // // //                       : baseMinutePrice;

// // // // // // // //                   return (
// // // // // // // //                     <tr
// // // // // // // //                       key={minute}
// // // // // // // //                       className={
// // // // // // // //                         minute % 2 === 0
// // // // // // // //                           ? isDark
// // // // // // // //                             ? "bg-slate-950"
// // // // // // // //                             : "bg-white"
// // // // // // // //                           : isDark
// // // // // // // //                           ? "bg-slate-900/70"
// // // // // // // //                           : "bg-slate-50"
// // // // // // // //                       }
// // // // // // // //                     >
// // // // // // // //                       <td className="px-3 py-1.5 font-medium">
// // // // // // // //                         Min {minute}
// // // // // // // //                       </td>
// // // // // // // //                       <td className="px-3 py-1.5">
// // // // // // // //                         <input
// // // // // // // //                           type="number"
// // // // // // // //                           min="0"
// // // // // // // //                           step="0.1"
// // // // // // // //                           value={
// // // // // // // //                             specificPrice === undefined ? "" : specificPrice
// // // // // // // //                           }
// // // // // // // //                           onChange={(e) =>
// // // // // // // //                             handleMinutePriceChange(
// // // // // // // //                               minute,
// // // // // // // //                               e.target.value === "" ? "" : e.target.value
// // // // // // // //                             )
// // // // // // // //                           }
// // // // // // // //                           className={
// // // // // // // //                             (isDark
// // // // // // // //                               ? "bg-slate-950 border-slate-700 text-slate-100"
// // // // // // // //                               : "bg-white border-slate-300 text-slate-900") +
// // // // // // // //                             " w-24 rounded-lg border px-2 py-1 text-[11px] outline-none"
// // // // // // // //                           }
// // // // // // // //                           placeholder={baseMinutePrice}
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                       <td className="px-3 py-1.5 text-slate-500">
// // // // // // // //                         € {Number(effectivePrice || 0).toFixed(2)}
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   );
// // // // // // // //                 })}
// // // // // // // //               </tbody>
// // // // // // // //             </table>
// // // // // // // //           </div>

// // // // // // // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
// // // // // // // //             <div className="text-[11px] text-slate-500">
// // // // // // // //               Tip: leave a field empty to use the base price for that minute.
// // // // // // // //             </div>
// // // // // // // //             <button
// // // // // // // //               type="button"
// // // // // // // //               disabled={saving || pricingLoading || !selectedCabinId}
// // // // // // // //               onClick={handleSave}
// // // // // // // //               className={
// // // // // // // //                 (isDark
// // // // // // // //                   ? "bg-emerald-500 text-emerald-50 hover:bg-emerald-400"
// // // // // // // //                   : "bg-emerald-500 text-white hover:bg-emerald-400") +
// // // // // // // //                 " rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition disabled:opacity-60"
// // // // // // // //               }
// // // // // // // //             >
// // // // // // // //               {saving ? "Saving…" : "Save pricing for this cabin"}
// // // // // // // //             </button>
// // // // // // // //           </div>

// // // // // // // //           {saveStatus === "success" && saveMessage && (
// // // // // // // //             <p className="text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-400/60 rounded-lg px-3 py-2 mt-2">
// // // // // // // //               {saveMessage}
// // // // // // // //             </p>
// // // // // // // //           )}
// // // // // // // //         </section>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // function CabinSummary({ isDark, cabin }) {
// // // // // // // //   if (!cabin) return null;

// // // // // // // //   return (
// // // // // // // //     <div
// // // // // // // //       className={
// // // // // // // //         (isDark
// // // // // // // //           ? "bg-slate-950 border-slate-800"
// // // // // // // //           : "bg-slate-50 border-slate-200") +
// // // // // // // //         " mt-4 rounded-2xl border px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
// // // // // // // //       }
// // // // // // // //     >
// // // // // // // //       <div>
// // // // // // // //         <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
// // // // // // // //           Selected cabin
// // // // // // // //         </p>
// // // // // // // //         <h3 className="mt-1 text-sm sm:text-base font-semibold">
// // // // // // // //           {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
// // // // // // // //         </h3>
// // // // // // // //         <p className="text-[11px] sm:text-xs text-slate-500">
// // // // // // // //           {cabin.category || "No category"} ·{" "}
// // // // // // // //           {cabin.type || "No device type set"}
// // // // // // // //         </p>
// // // // // // // //       </div>
// // // // // // // //       {cabin.imageUrl && (
// // // // // // // //         <div className="w-28 h-16 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-900/60">
// // // // // // // //           <img
// // // // // // // //             src={cabin.imageUrl}
// // // // // // // //             alt={cabin.name}
// // // // // // // //             className="w-full h-full object-cover"
// // // // // // // //           />
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default CabinPricing;


// // // // // // // // import React, { useEffect, useState, useMemo } from "react";
// // // // // // // // import { Trash2, Upload, Download, Copy, CheckCircle } from "lucide-react";
// // // // // // // // import * as XLSX from "xlsx";

// // // // // // // // const API_BASE =
// // // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // // function CabinPricing({ theme }) {
// // // // // // // //   const isDark = theme === "dark";
// // // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // // //   const [allPricing, setAllPricing] = useState({}); // { cabinId: { baseMinutePrice, minutePricing } }
// // // // // // // //   const [loadingCabins, setLoadingCabins] = useState(true);
// // // // // // // //   const [selectedCabins, setSelectedCabins] = useState([]); // for bulk copy
// // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // //   const [message, setMessage] = useState("");
// // // // // // // //   const [messageType, setMessageType] = useState(""); // success / error

// // // // // // // //   // Fetch all cabins
// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchCabins = async () => {
// // // // // // // //       try {
// // // // // // // //         setLoadingCabins(true);
// // // // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // // // //         if (!res.ok) throw new Error("Failed to load cabins");
// // // // // // // //         const data = await res.json();
// // // // // // // //         setCabins(data || []);
// // // // // // // //         if (data?.length > 0) {
// // // // // // // //           const ids = data.map(c => c._id);
// // // // // // // //           setSelectedCabins(ids); // initially all selected
// // // // // // // //           ids.forEach(id => fetchPricing(id));
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         showMessage("Failed to load cabins", "error");
// // // // // // // //       } finally {
// // // // // // // //         setLoadingCabins(false);
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //     fetchCabins();
// // // // // // // //   }, []);

// // // // // // // //   // Fetch pricing for a cabin
// // // // // // // //   const fetchPricing = async (cabinId) => {
// // // // // // // //     try {
// // // // // // // //       const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
// // // // // // // //       if (!res.ok) return;
// // // // // // // //       const data = await res.json();
// // // // // // // //       setAllPricing(prev => ({
// // // // // // // //         ...prev,
// // // // // // // //         [cabinId]: {
// // // // // // // //           baseMinutePrice: data.baseMinutePrice ?? 1,
// // // // // // // //           minutePricing: data.minutePricing || {}
// // // // // // // //         }
// // // // // // // //       }));
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error(err);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Add new minute entry (auto-increment)
// // // // // // // //   const addNewMinute = (cabinId) => {
// // // // // // // //     setAllPricing(prev => {
// // // // // // // //       const pricing = prev[cabinId]?.minutePricing || {};
// // // // // // // //       const keys = Object.keys(pricing).map(Number).filter(n => !isNaN(n));
// // // // // // // //       const nextMinute = keys.length === 0 ? 1 : Math.max(...keys) + 1;
// // // // // // // //       return {
// // // // // // // //         ...prev,
// // // // // // // //         [cabinId]: {
// // // // // // // //           ...prev[cabinId],
// // // // // // // //           minutePricing: {
// // // // // // // //             ...pricing,
// // // // // // // //             [nextMinute]: prev[cabinId]?.baseMinutePrice || 5
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       };
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   // Delete minute
// // // // // // // //   const deleteMinute = (cabinId, minute) => {
// // // // // // // //     setAllPricing(prev => ({
// // // // // // // //       ...prev,
// // // // // // // //       [cabinId]: {
// // // // // // // //         ...prev[cabinId],
// // // // // // // //         minutePricing: Object.fromEntries(
// // // // // // // //           Object.entries(prev[cabinId]?.minutePricing || {}).filter(([k]) => k !== minute)
// // // // // // // //         )
// // // // // // // //       }
// // // // // // // //     }));
// // // // // // // //   };

// // // // // // // //   // Update price
// // // // // // // //   const updatePrice = (cabinId, minute, value) => {
// // // // // // // //     const num = value === "" ? "" : parseFloat(value);
// // // // // // // //     if (value === "" || !isNaN(num)) {
// // // // // // // //       setAllPricing(prev => ({
// // // // // // // //         ...prev,
// // // // // // // //         [cabinId]: {
// // // // // // // //           ...prev[cabinId],
// // // // // // // //           minutePricing: {
// // // // // // // //             ...prev[cabinId].minutePricing,
// // // // // // // //             [minute]: value === "" ? "" : num
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       }));
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Update base price
// // // // // // // //   const updateBasePrice = (cabinId, value) => {
// // // // // // // //     const num = parseFloat(value) || 0;
// // // // // // // //     setAllPricing(prev => ({
// // // // // // // //       ...prev,
// // // // // // // //       [cabinId]: {
// // // // // // // //         ...prev[cabinId],
// // // // // // // //         baseMinutePrice: num
// // // // // // // //       }
// // // // // // // //     }));
// // // // // // // //   };

// // // // // // // //   // Apply current cabin's pricing to selected cabins
// // // // // // // //   const copyToSelected = () => {
// // // // // // // //     const sourceId = cabins[0]?._id; // assume first cabin is source
// // // // // // // //     const source = allPricing[sourceId];
// // // // // // // //     if (!source) return;

// // // // // // // //     setAllPricing(prev => {
// // // // // // // //       const updated = { ...prev };
// // // // // // // //       selectedCabins.forEach(id => {
// // // // // // // //         if (id !== sourceId) {
// // // // // // // //           updated[id] = {
// // // // // // // //             baseMinutePrice: source.baseMinutePrice,
// // // // // // // //             minutePricing: { ...source.minutePricing }
// // // // // // // //           };
// // // // // // // //         }
// // // // // // // //       });
// // // // // // // //       return updated;
// // // // // // // //     });
// // // // // // // //     showMessage("Pricing copied to selected cabins!", "success");
// // // // // // // //   };

// // // // // // // //   // Set same base price for all
// // // // // // // //   const applyBaseToAll = () => {
// // // // // // // //     const base = allPricing[cabins[0]?._id]?.baseMinutePrice || 5;
// // // // // // // //     setAllPricing(prev => {
// // // // // // // //       const updated = { ...prev };
// // // // // // // //       cabins.forEach(c => {
// // // // // // // //         updated[c._id] = {
// // // // // // // //           ...updated[c._id],
// // // // // // // //           baseMinutePrice: base,
// // // // // // // //           minutePricing: {}
// // // // // // // //         };
// // // // // // // //       });
// // // // // // // //       return updated;
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   // Save all changed pricing
// // // // // // // //   const saveAll = async () => {
// // // // // // // //     setSaving(true);
// // // // // // // //     try {
// // // // // // // //       for (const cabin of cabins) {
// // // // // // // //         const pricing = allPricing[cabin._id];
// // // // // // // //         if (!pricing) continue;

// // // // // // // //         const cleanPricing = {};
// // // // // // // //         Object.entries(pricing.minutePricing).forEach(([min, price]) => {
// // // // // // // //           if (price !== "" && price !== undefined) {
// // // // // // // //             cleanPricing[min] = parseFloat(price);
// // // // // // // //           }
// // // // // // // //         });

// // // // // // // //         await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`, {
// // // // // // // //           method: "PUT",
// // // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // // //           body: JSON.stringify({
// // // // // // // //             baseMinutePrice: parseFloat(pricing.baseMinutePrice) || 0,
// // // // // // // //             minutePricing: cleanPricing
// // // // // // // //           })
// // // // // // // //         });
// // // // // // // //       }
// // // // // // // //       showMessage("All pricing saved successfully!", "success");
// // // // // // // //     } catch (err) {
// // // // // // // //       showMessage("Failed to save pricing", "error");
// // // // // // // //     } finally {
// // // // // // // //       setSaving(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Export to Excel
// // // // // // // //   const exportToExcel = () => {
// // // // // // // //     const rows = [];
// // // // // // // //     const maxMinutes = Math.max(
// // // // // // // //       ...Object.values(allPricing).map(p => 
// // // // // // // //         Math.max(...Object.keys(p.minutePricing).map(Number), 0)
// // // // // // // //       ),
// // // // // // // //       30
// // // // // // // //     );

// // // // // // // //     // Header
// // // // // // // //     const header = ["Minute", ...cabins.map(c => `${c.code || ""} ${c.name}`)];
// // // // // // // //     rows.push(header);

// // // // // // // //     // Rows for each minute
// // // // // // // //     for (let min = 1; min <= maxMinutes; min++) {
// // // // // // // //       const row = [min];
// // // // // // // //       cabins.forEach(cabin => {
// // // // // // // //         const pricing = allPricing[cabin._id];
// // // // // // // //         const custom = pricing?.minutePricing[min];
// // // // // // // //         const price = custom !== undefined && custom !== "" 
// // // // // // // //           ? custom 
// // // // // // // //           : pricing?.baseMinutePrice || 0;
// // // // // // // //         row.push(price);
// // // // // // // //       });
// // // // // // // //       rows.push(row);
// // // // // // // //     }

// // // // // // // //     // Base price row
// // // // // // // //     rows.push(["Base Price (€/min)", ...cabins.map(c => allPricing[c._id]?.baseMinutePrice || 0)]);

// // // // // // // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // // // // // // //     const wb = XLSX.utils.book_new();
// // // // // // // //     XLSX.utils.book_append_sheet(wb, ws, "Cabin Pricing");
// // // // // // // //     XLSX.writeFile(wb, "cabin-pricing-export.xlsx");
// // // // // // // //     showMessage("Exported to Excel!", "success");
// // // // // // // //   };

// // // // // // // //   // Import from Excel
// // // // // // // //   const handleImport = (e) => {
// // // // // // // //     const file = e.target.files[0];
// // // // // // // //     if (!file) return;
// // // // // // // //     const reader = new FileReader();
// // // // // // // //     reader.onload = (ev) => {
// // // // // // // //       try {
// // // // // // // //         const data = new Uint8Array(ev.target.result);
// // // // // // // //         const workbook = XLSX.read(data, { type: "array" });
// // // // // // // //         const sheet = workbook.Sheets[workbook.SheetNames[0]];
// // // // // // // //         const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// // // // // // // //         const newPricing = {};
// // // // // // // //         cabins.forEach((cabin, idx) => {
// // // // // // // //           newPricing[cabin._id] = {
// // // // // // // //             baseMinutePrice: 5,
// // // // // // // //             minutePricing: {}
// // // // // // // //           };
// // // // // // // //         });

// // // // // // // //         rows.forEach((row, i) => {
// // // // // // // //           if (i === 0) return; // header
// // // // // // // //           if (row[0] === "Base Price (€/min)") {
// // // // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // // // //               if (cabins[idx]) {
// // // // // // // //                 newPricing[cabins[idx]._id].baseMinutePrice = parseFloat(val) || 5;
// // // // // // // //               }
// // // // // // // //             });
// // // // // // // //           } else if (typeof row[0] === "number") {
// // // // // // // //             const minute = row[0].toString();
// // // // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // // // //               if (cabins[idx] && val !== undefined) {
// // // // // // // //                 newPricing[cabins[idx]._id].minutePricing[minute] = parseFloat(val);
// // // // // // // //               }
// // // // // // // //             });
// // // // // // // //           }
// // // // // // // //         });

// // // // // // // //         setAllPricing(prev => ({ ...prev, ...newPricing }));
// // // // // // // //         showMessage("Imported from Excel!", "success");
// // // // // // // //       } catch (err) {
// // // // // // // //         showMessage("Import failed", "error");
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //     reader.readAsArrayBuffer(file);
// // // // // // // //   };

// // // // // // // //   const showMessage = (text, type) => {
// // // // // // // //     setMessage(text);
// // // // // // // //     setMessageType(type);
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setMessage("");
// // // // // // // //       setMessageType("");
// // // // // // // //     }, 4000);
// // // // // // // //   };

// // // // // // // //   const bgClass = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // // // // // // //   const cardClass = isDark ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200";

// // // // // // // //   return (
// // // // // // // //     <div className={`min-h-full ${bgClass}`}>
// // // // // // // //       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

// // // // // // // //         {/* Header */}
// // // // // // // //         <div className="space-y-2">
// // // // // // // //           <p className="text-emerald-600 tracking-widest text-xs font-bold">PRICING</p>
// // // // // // // //           <h1 className="text-3xl font-bold">Minute-based Cabin Pricing</h1>
// // // // // // // //           <p className="text-slate-500">Manage individual minute prices with bulk tools</p>
// // // // // // // //         </div>

// // // // // // // //         {/* Message */}
// // // // // // // //         {message && (
// // // // // // // //           <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${
// // // // // // // //             messageType === "success" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
// // // // // // // //           }`}>
// // // // // // // //             <CheckCircle className="w-5 h-5" />
// // // // // // // //             {message}
// // // // // // // //           </div>
// // // // // // // //         )}

// // // // // // // //         {/* Bulk Actions Bar */}
// // // // // // // //         <div className={`rounded-2xl border ${cardClass} p-5 space-y-4`}>
// // // // // // // //           <div className="flex flex-wrap items-center gap-3">
// // // // // // // //             <button onClick={copyToSelected} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
// // // // // // // //               <Copy className="w-4 h-4" /> Copy to Selected Cabins
// // // // // // // //             </button>
// // // // // // // //             <button onClick={applyBaseToAll} className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
// // // // // // // //               Set Same Base for All
// // // // // // // //             </button>
// // // // // // // //             <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
// // // // // // // //               <Download className="w-4 h-4" /> Export to Excel
// // // // // // // //             </button>
// // // // // // // //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer">
// // // // // // // //               <Upload className="w-4 h-4" /> Import Excel
// // // // // // // //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // // // // // // //             </label>
// // // // // // // //             <button onClick={saveAll} disabled={saving} className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">
// // // // // // // //               {saving ? "Saving..." : "Save All Cabins"}
// // // // // // // //             </button>
// // // // // // // //           </div>

// // // // // // // //           {/* Cabin Selection for Copy */}
// // // // // // // //           <div className="flex flex-wrap gap-3">
// // // // // // // //             <span className="text-sm text-slate-400">Copy to:</span>
// // // // // // // //             {cabins.map(cabin => (
// // // // // // // //               <label key={cabin._id} className="flex items-center gap-2">
// // // // // // // //                 <input
// // // // // // // //                   type="checkbox"
// // // // // // // //                   checked={selectedCabins.includes(cabin._id)}
// // // // // // // //                   onChange={(e) => {
// // // // // // // //                     if (e.target.checked) {
// // // // // // // //                       setSelectedCabins(prev => [...prev, cabin._id]);
// // // // // // // //                     } else {
// // // // // // // //                       setSelectedCabins(prev => prev.filter(id => id !== cabin._id));
// // // // // // // //                     }
// // // // // // // //                   }}
// // // // // // // //                   className="w-4 h-4 rounded"
// // // // // // // //                 />
// // // // // // // //                 <span className="text-sm">{cabin.code} {cabin.name}</span>
// // // // // // // //               </label>
// // // // // // // //             ))}
// // // // // // // //           </div>
// // // // // // // //         </div>

// // // // // // // //         {/* Per Cabin Pricing */}
// // // // // // // //         {cabins.map((cabin, idx) => {
// // // // // // // //           const pricing = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: {} };
// // // // // // // //           const minutes = Object.keys(pricing.minutePricing).map(Number).sort((a, b) => a - b);

// // // // // // // //           return (
// // // // // // // //             <div key={cabin._id} className={`rounded-2xl border ${cardClass} p-6 space-y-5`}>
// // // // // // // //               <div className="flex items-center justify-between">
// // // // // // // //                 <div>
// // // // // // // //                   <h3 className="text-xl font-bold">{cabin.code} · {cabin.name}</h3>
// // // // // // // //                   <p className="text-sm text-slate-500">{cabin.deviceType || "Sunbed"}</p>
// // // // // // // //                 </div>
// // // // // // // //                 <div className="flex items-center gap-3">
// // // // // // // //                   <span className="text-sm text-slate-500">Base price:</span>
// // // // // // // //                   <input
// // // // // // // //                     type="number"
// // // // // // // //                     step="0.01"
// // // // // // // //                     value={pricing.baseMinutePrice}
// // // // // // // //                     onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// // // // // // // //                     className="w-24 px-3 py-2 rounded-lg border text-sm"
// // // // // // // //                   />
// // // // // // // //                   <span>€/min</span>
// // // // // // // //                 </div>
// // // // // // // //               </div>

// // // // // // // //               {/* Minute Rows */}
// // // // // // // //               <div className="space-y-3">
// // // // // // // //                 {minutes.map(minute => (
// // // // // // // //                   <div key={minute} className="flex items-center gap-4 bg-slate-800/30 rounded-xl px-4 py-3">
// // // // // // // //                     <div className="w-24 font-medium">{minute} min</div>
// // // // // // // //                     <div className="flex items-center gap-3 flex-1">
// // // // // // // //                       <span>€</span>
// // // // // // // //                       <input
// // // // // // // //                         type="number"
// // // // // // // //                         step="0.01"
// // // // // // // //                         value={pricing.minutePricing[minute] || ""}
// // // // // // // //                         onChange={(e) => updatePrice(cabin._id, minute.toString(), e.target.value)}
// // // // // // // //                         className="w-32 px-3 py-2 rounded-lg border text-sm"
// // // // // // // //                         placeholder={pricing.baseMinutePrice}
// // // // // // // //                       />
// // // // // // // //                     </div>
// // // // // // // //                     <button
// // // // // // // //                       onClick={() => deleteMinute(cabin._id, minute.toString())}
// // // // // // // //                       className="text-rose-400 hover:text-rose-300"
// // // // // // // //                     >
// // // // // // // //                       <Trash2 className="w-5 h-5" />
// // // // // // // //                     </button>
// // // // // // // //                   </div>
// // // // // // // //                 ))}

// // // // // // // //                 {/* New Button */}
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => addNewMinute(cabin._id)}
// // // // // // // //                   className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-medium"
// // // // // // // //                 >
// // // // // // // //                   + New Minute Entry
// // // // // // // //                 </button>
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           );
// // // // // // // //         })}
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default CabinPricing;


// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, X } from "lucide-react";
// // // // // // // import * as XLSX from "xlsx";

// // // // // // // const API_BASE =
// // // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // // function CabinPricing({ theme }) {
// // // // // // //   const isDark = theme === "dark";
// // // // // // //   const [cabins, setCabins] = useState([]);
// // // // // // //   const [allPricing, setAllPricing] = useState({});
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [selectedCabins, setSelectedCabins] = useState([]);
// // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // //   const [message, setMessage] = useState({ text: "", type: "" });

// // // // // // //   // Modal state for adding multiple minutes
// // // // // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // // // // //   const [currentCabinId, setCurrentCabinId] = useState(null);
// // // // // // //   const [minutesToAdd, setMinutesToAdd] = useState("5");

// // // // // // //   // Fetch all data
// // // // // // //   useEffect(() => {
// // // // // // //     const loadAll = async () => {
// // // // // // //       try {
// // // // // // //         setLoading(true);
// // // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // // //         if (!res.ok) throw new Error();
// // // // // // //         const data = await res.json();
// // // // // // //         setCabins(data || []);
// // // // // // //         setSelectedCabins(data.map(c => c._id));

// // // // // // //         const pricingObj = {};
// // // // // // //         for (const cabin of data) {
// // // // // // //           try {
// // // // // // //             const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// // // // // // //             const p = pres.ok ? await pres.json() : null;
// // // // // // //             pricingObj[cabin._id] = {
// // // // // // //               baseMinutePrice: p?.baseMinutePrice ?? 5,
// // // // // // //               minutePricing: p?.minutePricing || {}
// // // // // // //             };
// // // // // // //           } catch {
// // // // // // //             pricingObj[cabin._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // // // // //           }
// // // // // // //         }
// // // // // // //         setAllPricing(pricingObj);
// // // // // // //       } catch {
// // // // // // //         showMessage("Failed to load data", "error");
// // // // // // //       } finally {
// // // // // // //         setLoading(false);
// // // // // // //       }
// // // // // // //     };
// // // // // // //     loadAll();
// // // // // // //   }, []);

// // // // // // //   // Open modal to add minutes
// // // // // // //   const openAddModal = (cabinId) => {
// // // // // // //     setCurrentCabinId(cabinId);
// // // // // // //     setMinutesToAdd("5");
// // // // // // //     setShowAddModal(true);
// // // // // // //   };

// // // // // // //   // Add multiple minutes
// // // // // // //   const confirmAddMinutes = () => {
// // // // // // //     if (!currentCabinId || !minutesToAdd || minutesToAdd <= 0) return;

// // // // // // //     const count = parseInt(minutesToAdd);
// // // // // // //     if (isNaN(count) || count < 1 || count > 100) {
// // // // // // //       showMessage("Please enter a number between 1 and 100", "error");
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setAllPricing(prev => {
// // // // // // //       const current = prev[currentCabinId]?.minutePricing || {};
// // // // // // //       const existing = Object.keys(current).map(Number).filter(n => !isNaN(n));
// // // // // // //       let next = existing.length === 0 ? 1 : Math.max(...existing) + 1;
// // // // // // //       const newEntries = {};

// // // // // // //       for (let i = 0; i < count; i++) {
// // // // // // //         newEntries[next + i] = prev[currentCabinId]?.baseMinutePrice || 5;
// // // // // // //       }

// // // // // // //       return {
// // // // // // //         ...prev,
// // // // // // //         [currentCabinId]: {
// // // // // // //           ...prev[currentCabinId],
// // // // // // //           minutePricing: { ...current, ...newEntries }
// // // // // // //         }
// // // // // // //       };
// // // // // // //     });

// // // // // // //     setShowAddModal(false);
// // // // // // //     showMessage(`${count} minutes added successfully!`, "success");
// // // // // // //   };

// // // // // // //   // Delete minute
// // // // // // //   const deleteMinute = (cabinId, minute) => {
// // // // // // //     setAllPricing(prev => ({
// // // // // // //       ...prev,
// // // // // // //       [cabinId]: {
// // // // // // //         ...prev[cabinId],
// // // // // // //         minutePricing: Object.fromEntries(
// // // // // // //           Object.entries(prev[cabinId]?.minutePricing || {}).filter(([k]) => k !== minute)
// // // // // // //         )
// // // // // // //       }
// // // // // // //     }));
// // // // // // //   };

// // // // // // //   // Update price / base price
// // // // // // //   const updatePrice = (cabinId, minute, value) => {
// // // // // // //     const num = value === "" ? "" : parseFloat(value);
// // // // // // //     if (value === "" || !isNaN(num)) {
// // // // // // //       setAllPricing(prev => ({
// // // // // // //         ...prev,
// // // // // // //         [cabinId]: {
// // // // // // //           ...prev[cabinId],
// // // // // // //           minutePricing: { ...prev[cabinId].minutePricing, [minute]: value === "" ? "" : num }
// // // // // // //         }
// // // // // // //       }));
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const updateBasePrice = (cabinId, value) => {
// // // // // // //     const num = parseFloat(value) || 0;
// // // // // // //     setAllPricing(prev => ({ ...prev, [cabinId]: { ...prev[cabinId], baseMinutePrice: num } }));
// // // // // // //   };

// // // // // // //   // Copy to selected
// // // // // // //   const copyToSelected = () => {
// // // // // // //     if (cabins.length === 0) return;
// // // // // // //     const source = allPricing[cabins[0]._id];
// // // // // // //     if (!source) return;

// // // // // // //     setAllPricing(prev => {
// // // // // // //       const updated = { ...prev };
// // // // // // //       selectedCabins.forEach(id => {
// // // // // // //         updated[id] = {
// // // // // // //           baseMinutePrice: source.baseMinutePrice,
// // // // // // //           minutePricing: { ...source.minutePricing }
// // // // // // //         };
// // // // // // //       });
// // // // // // //       return updated;
// // // // // // //     });
// // // // // // //     showMessage("Pricing copied to selected cabins!", "success");
// // // // // // //   };

// // // // // // //   // Save all
// // // // // // //   const saveAll = async () => {
// // // // // // //     setSaving(true);
// // // // // // //     try {
// // // // // // //       for (const cabin of cabins) {
// // // // // // //         const p = allPricing[cabin._id];
// // // // // // //         if (!p) continue;

// // // // // // //         const clean = {};
// // // // // // //         Object.entries(p.minutePricing).forEach(([min, price]) => {
// // // // // // //           if (price !== "" && price !== null) clean[min] = parseFloat(price);
// // // // // // //         });

// // // // // // //         await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`, {
// // // // // // //           method: "PUT",
// // // // // // //           headers: { "Content-Type": "application/json" },
// // // // // // //           body: JSON.stringify({
// // // // // // //             baseMinutePrice: parseFloat(p.baseMinutePrice) || 0,
// // // // // // //             minutePricing: clean
// // // // // // //           })
// // // // // // //         });
// // // // // // //       }
// // // // // // //       showMessage("All pricing saved successfully!", "success");
// // // // // // //     } catch {
// // // // // // //       showMessage("Save failed", "error");
// // // // // // //     } finally {
// // // // // // //       setSaving(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Export Excel (only custom minutes)
// // // // // // //   const exportToExcel = () => {
// // // // // // //     if (cabins.length === 0) return;

// // // // // // //     const allMinutes = new Set();
// // // // // // //     Object.values(allPricing).forEach(p => Object.keys(p.minutePricing).forEach(m => allMinutes.add(m)));
// // // // // // //     const minutes = Array.from(allMinutes).map(Number).sort((a, b) => a - b);

// // // // // // //     const rows = [["Minute", ...cabins.map(c => `${c.code || ""} ${c.name}`.trim() || "Cabin")]];
// // // // // // //     minutes.forEach(min => {
// // // // // // //       const row = [min];
// // // // // // //       cabins.forEach(c => {
// // // // // // //         const price = allPricing[c._id]?.minutePricing[min];
// // // // // // //         row.push(price !== undefined && price !== "" ? price : "");
// // // // // // //       });
// // // // // // //       rows.push(row);
// // // // // // //     });
// // // // // // //     rows.push(["Base Price (€/min)", ...cabins.map(c => allPricing[c._id]?.baseMinutePrice || 0)]);

// // // // // // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // // // // // //     ws["!cols"] = rows[0].map(() => ({ wch: 18 }));
// // // // // // //     const wb = XLSX.utils.book_new();
// // // // // // //     XLSX.utils.book_append_sheet(wb, ws, "Pricing");
// // // // // // //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0,10)}.xlsx`);
// // // // // // //     showMessage("Exported successfully!", "success");
// // // // // // //   };

// // // // // // //   // Import Excel
// // // // // // //   const handleImport = (e) => {
// // // // // // //     const file = e.target.files[0];
// // // // // // //     if (!file) return;
// // // // // // //     const reader = new FileReader();
// // // // // // //     reader.onload = (ev) => {
// // // // // // //       try {
// // // // // // //         const wb = XLSX.read(ev.target.result, { type: "array" });
// // // // // // //         const ws = wb.Sheets[wb.SheetNames[0]];
// // // // // // //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// // // // // // //         const newPricing = {};
// // // // // // //         cabins.forEach(c => newPricing[c._id] = { baseMinutePrice: 5, minutePricing: {} });

// // // // // // //         rows.forEach((row, i) => {
// // // // // // //           if (i === 0) return;
// // // // // // //           if (row[0] === "Base Price (€/min)") {
// // // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // // //               if (cabins[idx]) newPricing[cabins[idx]._id].baseMinutePrice = parseFloat(val) || 5;
// // // // // // //             });
// // // // // // //           } else if (typeof row[0] === "number") {
// // // // // // //             const min = row[0].toString();
// // // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // // //               if (cabins[idx] && val !== undefined && val !== "") {
// // // // // // //                 newPricing[cabins[idx]._id].minutePricing[min] = parseFloat(val);
// // // // // // //               }
// // // // // // //             });
// // // // // // //           }
// // // // // // //         });

// // // // // // //         setAllPricing(prev => ({ ...prev, ...newPricing }));
// // // // // // //         showMessage("Imported successfully!", "success");
// // // // // // //       } catch {
// // // // // // //         showMessage("Import failed", "error");
// // // // // // //       }
// // // // // // //     };
// // // // // // //     reader.readAsArrayBuffer(file);
// // // // // // //   };

// // // // // // //   const showMessage = (text, type) => {
// // // // // // //     setMessage({ text, type });
// // // // // // //     setTimeout(() => setMessage({ text: "", type: "" }), 4000);
// // // // // // //   };

// // // // // // //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // // // // // //   const card = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200";

// // // // // // //   if (loading) return <div className={`min-h-screen ${bg} flex items-center justify-center text-xl`}>Loading cabins...</div>;

// // // // // // //   return (
// // // // // // //     <div className={`min-h-screen ${bg}`}>
// // // // // // //       <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

// // // // // // //         {/* Header */}
// // // // // // //         <div className="text-center space-y-3">
// // // // // // //           <p className="text-emerald-500 font-semibold tracking-wider text-sm">CABIN PRICING</p>
// // // // // // //           <h1 className="text-3xl font-bold">Minute-Based Pricing</h1>
// // // // // // //           <p className="text-slate-500 max-w-2xl mx-auto">Configure custom minute prices with bulk actions and Excel import/export.</p>
// // // // // // //         </div>

// // // // // // //         {/* Message */}
// // // // // // //         {message.text && (
// // // // // // //           <div className={`rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// // // // // // //             message.type === "success" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
// // // // // // //           }`}>
// // // // // // //             <CheckCircle className="w-5 h-5" />
// // // // // // //             {message.text}
// // // // // // //           </div>
// // // // // // //         )}

// // // // // // //         {/* Bulk Actions */}
// // // // // // //         <div className={`rounded-2xl border ${card} p-6 shadow-lg`}>
// // // // // // //           <div className="flex flex-wrap items-center gap-4">
// // // // // // //             <button onClick={copyToSelected} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
// // // // // // //               <Copy className="w-4 h-4" /> Copy to Selected
// // // // // // //             </button>
// // // // // // //             <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
// // // // // // //               <Download className="w-4 h-4" /> Export Excel
// // // // // // //             </button>
// // // // // // //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium cursor-pointer transition">
// // // // // // //               <Upload className="w-4 h-4" /> Import Excel
// // // // // // //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // // // // // //             </label>
// // // // // // //             <button onClick={saveAll} disabled={saving} className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-2.5 rounded-lg font-semibold transition">
// // // // // // //               {saving ? "Saving..." : "Save All Cabins"}
// // // // // // //             </button>
// // // // // // //           </div>

// // // // // // //           <div className="mt-5 flex flex-wrap items-center gap-4">
// // // // // // //             <span className="font-medium text-slate-400">Copy to:</span>
// // // // // // //             {cabins.map(c => (
// // // // // // //               <label key={c._id} className="flex items-center gap-2">
// // // // // // //                 <input type="checkbox" checked={selectedCabins.includes(c._id)} onChange={e => setSelectedCabins(prev => e.target.checked ? [...prev, c._id] : prev.filter(id => id !== c._id))} className="w-4 h-4 rounded text-emerald-600" />
// // // // // // //                 <span className="font-medium">{c.code} · {c.name}</span>
// // // // // // //               </label>
// // // // // // //             ))}
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Cabin Cards */}
// // // // // // //         {cabins.map(cabin => {
// // // // // // //           const p = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: {} };
// // // // // // //           const minutes = Object.keys(p.minutePricing).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);

// // // // // // //           return (
// // // // // // //             <div key={cabin._id} className={`rounded-2xl border ${card} p-7 shadow-lg space-y-6`}>
// // // // // // //               <div className="flex justify-between items-center">
// // // // // // //                 <div>
// // // // // // //                   <h3 className="text-xl font-bold">{cabin.code} · {cabin.name}</h3>
// // // // // // //                   <p className="text-sm text-slate-500 mt-1">{cabin.category || cabin.deviceType || "Cabin"}</p>
// // // // // // //                 </div>
// // // // // // //                 <div className="flex items-center gap-3">
// // // // // // //                   <span className="text-sm font-medium text-slate-400">Base Price:</span>
// // // // // // //                   <input
// // // // // // //                     type="number"
// // // // // // //                     step="0.01"
// // // // // // //                     value={p.baseMinutePrice}
// // // // // // //                     onChange={e => updateBasePrice(cabin._id, e.target.value)}
// // // // // // //                     className="w-28 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // // // //                   />
// // // // // // //                   <span className="font-medium">€/min</span>
// // // // // // //                 </div>
// // // // // // //               </div>

// // // // // // //               <div className="space-y-3">
// // // // // // //                 {minutes.map(min => (
// // // // // // //                   <div key={min} className="flex items-center gap-5 bg-slate-800/20 rounded-xl px-5 py-3.5">
// // // // // // //                     <div className="w-28 font-semibold">{min} min</div>
// // // // // // //                     <div className="flex items-center gap-3 flex-1">
// // // // // // //                       <span className="text-lg">€</span>
// // // // // // //                       <input
// // // // // // //                         type="number"
// // // // // // //                         step="0.01"
// // // // // // //                         value={p.minutePricing[min] || ""}
// // // // // // //                         onChange={e => updatePrice(cabin._id, min.toString(), e.target.value)}
// // // // // // //                         placeholder={p.baseMinutePrice}
// // // // // // //                         className="w-40 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // // // //                       />
// // // // // // //                     </div>
// // // // // // //                     <button onClick={() => deleteMinute(cabin._id, min.toString())} className="text-rose-400 hover:text-rose-300 transition">
// // // // // // //                       <Trash2 className="w-5 h-5" />
// // // // // // //                     </button>
// // // // // // //                   </div>
// // // // // // //                 ))}

// // // // // // //                 <button
// // // // // // //                   onClick={() => openAddModal(cabin._id)}
// // // // // // //                   className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-medium transition"
// // // // // // //                 >
// // // // // // //                   <Plus className="w-5 h-5" />
// // // // // // //                   Add Minutes
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           );
// // // // // // //         })}

// // // // // // //         {/* Add Minutes Modal */}
// // // // // // //         {showAddModal && (
// // // // // // //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// // // // // // //             <div className={`rounded-2xl border ${card} p-8 max-w-md w-full mx-4`}>
// // // // // // //               <div className="flex justify-between items-center mb-6">
// // // // // // //                 <h3 className="text-xl font-bold">Add New Minutes</h3>
// // // // // // //                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-300">
// // // // // // //                   <X className="w-6 h-6" />
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //               <p className="text-sm text-slate-400 mb-4">How many minutes would you like to add?</p>
// // // // // // //               <input
// // // // // // //                 type="number"
// // // // // // //                 min="1"
// // // // // // //                 max="100"
// // // // // // //                 value={minutesToAdd}
// // // // // // //                 onChange={e => setMinutesToAdd(e.target.value)}
// // // // // // //                 className="w-full px-4 py-3 rounded-lg border bg-transparent text-lg font-medium mb-6"
// // // // // // //                 placeholder="e.g. 10"
// // // // // // //                 autoFocus
// // // // // // //               />
// // // // // // //               <div className="flex gap-3 justify-end">
// // // // // // //                 <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-lg border font-medium hover:bg-slate-800/50 transition">
// // // // // // //                   Cancel
// // // // // // //                 </button>
// // // // // // //                 <button onClick={confirmAddMinutes} className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
// // // // // // //                   Add Minutes
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default CabinPricing;


// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, X } from "lucide-react";
// // // // // // import * as XLSX from "xlsx";
// // // // // // import { t } from "../i18n";
// // // // // // import { useLanguage } from "../context/LanguageContext";

// // // // // // const API_BASE =
// // // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // // function CabinPricing({ theme }) {
// // // // // //   const isDark = theme === "dark";
// // // // // //   const { language } = useLanguage();
// // // // // //   const lang = language || "en";

// // // // // //   const [cabins, setCabins] = useState([]);
// // // // // //   const [allPricing, setAllPricing] = useState({});
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [selectedCabins, setSelectedCabins] = useState([]);
// // // // // //   const [saving, setSaving] = useState(false);
// // // // // //   const [message, setMessage] = useState({ text: "", type: "" });

// // // // // //   // Modal for adding minutes
// // // // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // // // //   const [currentCabinId, setCurrentCabinId] = useState(null);
// // // // // //   const [minutesToAdd, setMinutesToAdd] = useState("5");

// // // // // //   // Load cabins + pricing
// // // // // //   useEffect(() => {
// // // // // //     const loadAll = async () => {
// // // // // //       try {
// // // // // //         setLoading(true);
// // // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // // //         if (!res.ok) throw new Error();
// // // // // //         const data = await res.json();
// // // // // //         setCabins(data || []);
// // // // // //         setSelectedCabins(data.map((c) => c._id));

// // // // // //         const pricingObj = {};
// // // // // //         for (const cabin of data) {
// // // // // //           try {
// // // // // //             const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// // // // // //             const p = pres.ok ? await pres.json() : null;
// // // // // //             pricingObj[cabin._id] = {
// // // // // //               baseMinutePrice: p?.baseMinutePrice ?? 5,
// // // // // //               minutePricing: p?.minutePricing || {},
// // // // // //             };
// // // // // //           } catch {
// // // // // //             pricingObj[cabin._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // // // //           }
// // // // // //         }
// // // // // //         setAllPricing(pricingObj);
// // // // // //       } catch {
// // // // // //         showMessage(t(lang, "pricing.message.loadFailed"), "error");
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     };
// // // // // //     loadAll();
// // // // // //   }, [lang]);

// // // // // //   const openAddModal = (cabinId) => {
// // // // // //     setCurrentCabinId(cabinId);
// // // // // //     setMinutesToAdd("5");
// // // // // //     setShowAddModal(true);
// // // // // //   };

// // // // // //   const confirmAddMinutes = () => {
// // // // // //     const count = parseInt(minutesToAdd);
// // // // // //     if (isNaN(count) || count < 1 || count > 100) {
// // // // // //       showMessage(t(lang, "pricing.message.addMinutesError"), "error");
// // // // // //       return;
// // // // // //     }

// // // // // //     setAllPricing((prev) => {
// // // // // //       const current = prev[currentCabinId]?.minutePricing || {};
// // // // // //       const existing = Object.keys(current).map(Number).filter((n) => !isNaN(n));
// // // // // //       let next = existing.length === 0 ? 1 : Math.max(...existing) + 1;
// // // // // //       const newEntries = {};

// // // // // //       for (let i = 0; i < count; i++) {
// // // // // //         newEntries[next + i] = prev[currentCabinId]?.baseMinutePrice || 5;
// // // // // //       }

// // // // // //       return {
// // // // // //         ...prev,
// // // // // //         [ CompositeCabinId]: {
// // // // // //           ...prev[currentCabinId],
// // // // // //           minutePricing: { ...current, ...newEntries },
// // // // // //         },
// // // // // //       };
// // // // // //     });

// // // // // //     setShowAddModal(false);
// // // // // //     showMessage(t(lang, "pricing.message.addMinutesSuccess", { count }), "success");
// // // // // //   };

// // // // // //   const deleteMinute = (cabinId, minute) => {
// // // // // //     setAllPricing((prev) => ({
// // // // // //       ...prev,
// // // // // //       [cabinId]: {
// // // // // //         ...prev[cabinId],
// // // // // //         minutePricing: Object.fromEntries(
// // // // // //           Object.entries(prev[cabinId]?.minutePricing || {}).filter(([k]) => k !== minute)
// // // // // //         ),
// // // // // //       },
// // // // // //     }));
// // // // // //   };

// // // // // //   const updatePrice = (cabinId, minute, value) => {
// // // // // //     const num = value === "" ? "" : parseFloat(value);
// // // // // //     if (value === "" || !isNaN(num)) {
// // // // // //       setAllPricing((prev) => ({
// // // // // //         ...prev,
// // // // // //         [cabinId]: {
// // // // // //           ...prev[cabinId],
// // // // // //           minutePricing: {
// // // // // //             ...prev[cabinId].minutePricing,
// // // // // //             [minute]: value === "" ? "" : num,
// // // // // //           },
// // // // // //         },
// // // // // //       }));
// // // // // //     }
// // // // // //   };

// // // // // //   const updateBasePrice = (cabinId, value) => {
// // // // // //     const num = parseFloat(value) || 0;
// // // // // //     setAllPricing((prev) => ({
// // // // // //       ...prev,
// // // // // //       [cabinId]: { ...prev[cabinId], baseMinutePrice: num },
// // // // // //     }));
// // // // // //   };

// // // // // //   const copyToSelected = () => {
// // // // // //     if (cabins.length === 0) return;
// // // // // //     const source = allPricing[cabins[0]._id];
// // // // // //     if (!source) return;

// // // // // //     setAllPricing((prev) => {
// // // // // //       const updated = { ...prev };
// // // // // //       selectedCabins.forEach((id) => {
// // // // // //         updated[id] = {
// // // // // //           baseMinutePrice: source.baseMinutePrice,
// // // // // //           minutePricing: { ...source.minutePricing },
// // // // // //         };
// // // // // //       });
// // // // // //       return updated;
// // // // // //     });
// // // // // //     showMessage(t(lang, "pricing.message.copied"), "success");
// // // // // //   };

// // // // // //   const saveAll = async () => {
// // // // // //     setSaving(true);
// // // // // //     try {
// // // // // //       for (const cabin of cabins) {
// // // // // //         const p = allPricing[cabin._id];
// // // // // //         if (!p) continue;

// // // // // //         const clean = {};
// // // // // //         Object.entries(p.minutePricing).forEach(([min, price]) => {
// // // // // //           if (price !== "" && price !== null) clean[min] = parseFloat(price);
// // // // // //         });

// // // // // //         await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`, {
// // // // // //           method: "PUT",
// // // // // //           headers: { "Content-Type": "application/json" },
// // // // // //           body: JSON.stringify({
// // // // // //             baseMinutePrice: parseFloat(p.baseMinutePrice) || 0,
// // // // // //             minutePricing: clean,
// // // // // //           }),
// // // // // //         });
// // // // // //       }
// // // // // //       showMessage(t(lang, "pricing.message.saved"), "success");
// // // // // //     } catch {
// // // // // //       showMessage(t(lang, "pricing.message.saveFailed"), "error");
// // // // // //     } finally {
// // // // // //       setSaving(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const exportToExcel = () => {
// // // // // //     if (cabins.length === 0) return;

// // // // // //     const allMinutes = new Set();
// // // // // //     Object.values(allPricing).forEach((p) =>
// // // // // //       Object.keys(p.minutePricing).forEach((m) => allMinutes.add(m))
// // // // // //     );
// // // // // //     const minutes = Array.from(allMinutes)
// // // // // //       .map(Number)
// // // // // //       .sort((a, b) => a - b);

// // // // // //     const rows = [
// // // // // //       [
// // // // // //         t(lang, "pricing.excel.minute") || "Minute",
// // // // // //         ...cabins.map(
// // // // // //           (c) => `${c.code || ""} ${c.name}`.trim() || t(lang, "pricing.excel.cabin") || "Cabin"
// // // // // //         ),
// // // // // //       ],
// // // // // //     ];

// // // // // //     minutes.forEach((min) => {
// // // // // //       const row = [min];
// // // // // //       cabins.forEach((c) => {
// // // // // //         const price = allPricing[c._id]?.minutePricing[min];
// // // // // //         row.push(price !== undefined && price !== "" ? price : "");
// // // // // //       });
// // // // // //       rows.push(row);
// // // // // //     });

// // // // // //     rows.push([
// // // // // //       t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
// // // // // //       ...cabins.map((c) => allPricing[c._id]?.baseMinutePrice || 0),
// // // // // //     ]);

// // // // // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // // // // //     ws["!cols"] = rows[0].map(() => ({ wch: 18 }));
// // // // // //     const wb = XLSX.utils.book_new();
// // // // // //     XLSX.utils.book_append_sheet(wb, ws, "Pricing");
// // // // // //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // // // //     showMessage(t(lang, "pricing.message.exported"), "success");
// // // // // //   };

// // // // // //   const handleImport = (e) => {
// // // // // //     const file = e.target.files[0];
// // // // // //     if (!file) return;
// // // // // //     const reader = new FileReader();
// // // // // //     reader.onload = (ev) => {
// // // // // //       try {
// // // // // //         const wb = XLSX.read(ev.target.result, { type: "array" });
// // // // // //         const ws = wb.Sheets[wb.SheetNames[0]];
// // // // // //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// // // // // //         const newPricing = {};
// // // // // //         cabins.forEach((c) => {
// // // // // //           newPricing[c._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // // // //         });

// // // // // //         rows.forEach((row, i) => {
// // // // // //           if (i === 0) return;
// // // // // //           if (row[0] === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
// // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // //               if (cabins[idx]) newPricing[cabins[idx]._id].baseMinutePrice = parseFloat(val) || 5;
// // // // // //             });
// // // // // //           } else if (typeof row[0] === "number") {
// // // // // //             const min = row[0].toString();
// // // // // //             row.slice(1).forEach((val, idx) => {
// // // // // //               if (cabins[idx] && val !== undefined && val !== "") {
// // // // // //                 newPricing[cabins[idx]._id].minutePricing[min] = parseFloat(val);
// // // // // //               }
// // // // // //             });
// // // // // //           }
// // // // // //         });

// // // // // //         setAllPricing((prev) => ({ ...prev, ...newPricing }));
// // // // // //         showMessage(t(lang, "pricing.message.imported"), "success");
// // // // // //       } catch {
// // // // // //         showMessage(t(lang, "pricing.message.importFailed"), "error");
// // // // // //       }
// // // // // //     };
// // // // // //     reader.readAsArrayBuffer(file);
// // // // // //   };

// // // // // //   const showMessage = (text, type) => {
// // // // // //     setMessage({ text, type });
// // // // // //     setTimeout(() => setMessage({ text: "", type: "" }), 4000);
// // // // // //   };

// // // // // //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // // // // //   const card = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200";

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className={`min-h-screen ${bg} flex items-center justify-center text-xl`}>
// // // // // //         {t(lang, "pricing.loading")}
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className={`min-h-screen ${bg}`}>
// // // // // //       <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
// // // // // //         {/* Header */}
// // // // // //         <div className="text-center space-y-3">
// // // // // //           <p className="text-emerald-500 font-semibold tracking-wider text-sm uppercase">
// // // // // //             {t(lang, "pricing.header.kicker")}
// // // // // //           </p>
// // // // // //           <h1 className="text-3xl font-bold">{t(lang, "pricing.header.title")}</h1>
// // // // // //           <p className="text-slate-500 max-w-2xl mx-auto">
// // // // // //             {t(lang, "pricing.header.subtitle")}
// // // // // //           </p>
// // // // // //         </div>

// // // // // //         {/* Message */}
// // // // // //         {message.text && (
// // // // // //           <div
// // // // // //             className={`rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// // // // // //               message.type === "success"
// // // // // //                 ? "bg-emerald-500/20 text-emerald-300"
// // // // // //                 : "bg-rose-500/20 text-rose-300"
// // // // // //             }`}
// // // // // //           >
// // // // // //             <CheckCircle className="w-5 h-5" />
// // // // // //             {message.text}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {/* Bulk Actions */}
// // // // // //         <div className={`rounded-2xl border ${card} p-6 shadow-lg`}>
// // // // // //           <div className="flex flex-wrap items-center gap-4">
// // // // // //             <button
// // // // // //               onClick={copyToSelected}
// // // // // //               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
// // // // // //             >
// // // // // //               <Copy className="w-4 h-4" />
// // // // // //               {t(lang, "pricing.bulk.copyToSelected")}
// // // // // //             </button>
// // // // // //             <button
// // // // // //               onClick={exportToExcel}
// // // // // //               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
// // // // // //             >
// // // // // //               <Download className="w-4 h-4" />
// // // // // //               {t(lang, "pricing.bulk.exportExcel")}
// // // // // //             </button>
// // // // // //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium cursor-pointer transition">
// // // // // //               <Upload className="w-4 h-4" />
// // // // // //               {t(lang, "pricing.bulk.importExcel")}
// // // // // //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // // // // //             </label>
// // // // // //             <button
// // // // // //               onClick={saveAll}
// // // // // //               disabled={saving}
// // // // // //               className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-2.5 rounded-lg font-semibold transition"
// // // // // //             >
// // // // // //               {saving ? t(lang, "pricing.bulk.saving") : t(lang, "pricing.bulk.saveAll")}
// // // // // //             </button>
// // // // // //           </div>

// // // // // //           <div className="mt-5 flex flex-wrap items-center gap-4">
// // // // // //             <span className="font-medium text-slate-400">{t(lang, "pricing.bulk.copyTo")}:</span>
// // // // // //             {cabins.map((c) => (
// // // // // //               <label key={c._id} className="flex items-center gap-2">
// // // // // //                 <input
// // // // // //                   type="checkbox"
// // // // // //                   checked={selectedCabins.includes(c._id)}
// // // // // //                   onChange={(e) =>
// // // // // //                     setSelectedCabins((prev) =>
// // // // // //                       e.target.checked ? [...prev, c._id] : prev.filter((id) => id !== c._id)
// // // // // //                     )
// // // // // //                   }
// // // // // //                   className="w-4 h-4 rounded text-emerald-600"
// // // // // //                 />
// // // // // //                 <span className="font-medium">
// // // // // //                   {c.code} · {c.name}
// // // // // //                 </span>
// // // // // //               </label>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Cabin Cards */}
// // // // // //         {cabins.map((cabin) => {
// // // // // //           const p = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: {} };
// // // // // //           const minutes = Object.keys(p.minutePricing)
// // // // // //             .map(Number)
// // // // // //             .filter((n) => !isNaN(n))
// // // // // //             .sort((a, b) => a - b);

// // // // // //           return (
// // // // // //             <div key={cabin._id} className={`rounded-2xl border ${card} p-7 shadow-lg space-y-6`}>
// // // // // //               <div className="flex justify-between items-center">
// // // // // //                 <div>
// // // // // //                   <h3 className="text-xl font-bold">
// // // // // //                     {cabin.code} · {cabin.name}
// // // // // //                   </h3>
// // // // // //                   <p className="text-sm text-slate-500 mt-1">
// // // // // //                     {cabin.category || cabin.deviceType || t(lang, "pricing.excel.cabin") || "Cabin"}
// // // // // //                   </p>
// // // // // //                 </div>
// // // // // //                 <div className="flex items-center gap-3">
// // // // // //                   <span className="text-sm font-medium text-slate-400">
// // // // // //                     {t(lang, "pricing.cabinCard.basePrice")}
// // // // // //                   </span>
// // // // // //                   <input
// // // // // //                     type="number"
// // // // // //                     step="0.01"
// // // // // //                     value={p.baseMinutePrice}
// // // // // //                     onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// // // // // //                     className="w-28 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // // //                   />
// // // // // //                   <span className="font-medium">{t(lang, "pricing.cabinCard.perMin")}</span>
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               <div className="space-y-3">
// // // // // //                 {minutes.map((min) => (
// // // // // //                   <div
// // // // // //                     key={min}
// // // // // //                     className="flex items-center gap-5 bg-slate-800/20 rounded-xl px-5 py-3.5"
// // // // // //                   >
// // // // // //                     <div className="w-28 font-semibold">
// // // // // //                       {min} {t(lang, "pricing.excel.min") || "min"}
// // // // // //                     </div>
// // // // // //                     <div className="flex items-center gap-3 flex-1">
// // // // // //                       <span className="text-lg">€</span>
// // // // // //                       <input
// // // // // //                         type="number"
// // // // // //                         step="0.01"
// // // // // //                         value={p.minutePricing[min] || ""}
// // // // // //                         onChange={(e) => updatePrice(cabin._id, min.toString(), e.target.value)}
// // // // // //                         placeholder={p.baseMinutePrice.toString()}
// // // // // //                         className="w-40 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // // //                       />
// // // // // //                     </div>
// // // // // //                     <button
// // // // // //                       onClick={() => deleteMinute(cabin._id, min.toString())}
// // // // // //                       className="text-rose-400 hover:text-rose-300 transition"
// // // // // //                     >
// // // // // //                       <Trash2 className="w-5 h-5" />
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                 ))}

// // // // // //                 <button
// // // // // //                   onClick={() => openAddModal(cabin._id)}
// // // // // //                   className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-medium transition"
// // // // // //                 >
// // // // // //                   <Plus className="w-5 h-5" />
// // // // // //                   {t(lang, "pricing.cabinCard.addMinutes")}
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           );
// // // // // //         })}

// // // // // //         {/* Add Minutes Modal */}
// // // // // //         {showAddModal && (
// // // // // //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// // // // // //             <div className={`rounded-2xl border ${card} p-8 max-w-md w-full mx-4`}>
// // // // // //               <div className="flex justify-between items-center mb-6">
// // // // // //                 <h3 className="text-xl font-bold">{t(lang, "pricing.modal.title")}</h3>
// // // // // //                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-300">
// // // // // //                   <X className="w, w-6 h-6" />
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //               <p className="text-sm text-slate-400 mb-4">{t(lang, "pricing.modal.desc")}</p>
// // // // // //               <input
// // // // // //                 type="number"
// // // // // //                 min="1"
// // // // // //                 max="100"
// // // // // //                 value={minutesToAdd}
// // // // // //                 onChange={(e) => setMinutesToAdd(e.target.value)}
// // // // // //                 className="w-full px-4 py-3 rounded-lg border bg-transparent text-lg font-medium mb-6"
// // // // // //                 placeholder={t(lang, "pricing.modal.placeholder")}
// // // // // //                 autoFocus
// // // // // //               />
// // // // // //               <div className="flex gap-3 justify-end">
// // // // // //                 <button
// // // // // //                   onClick={() => setShowAddModal(false)}
// // // // // //                   className="px-6 py-2.5 rounded-lg border font-medium hover:bg-slate-800/50 transition"
// // // // // //                 >
// // // // // //                   {t(lang, "pricing.modal.cancel")}
// // // // // //                 </button>
// // // // // //                 <button
// // // // // //                   onClick={confirmAddMinutes}
// // // // // //                   className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
// // // // // //                 >
// // // // // //                   {t(lang, "pricing.modal.add")}
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default CabinPricing;


// // // // // import React, { useEffect, useState } from "react";
// // // // // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, X } from "lucide-react";
// // // // // import * as XLSX from "xlsx";
// // // // // import { t } from "../i18n";
// // // // // import { useLanguage } from "../context/LanguageContext";

// // // // // const API_BASE =
// // // // //   import.meta.env.VITE_API_BASE_URL ||
// // // // //   "https://backend-two-orpin-12.vercel.app";

// // // // // function CabinPricing({ theme }) {
// // // // //   const isDark = theme === "dark";
// // // // //   const { language } = useLanguage();
// // // // //   const lang = language || "en"; // realtime language

// // // // //   const [cabins, setCabins] = useState([]);
// // // // //   const [allPricing, setAllPricing] = useState({});
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [selectedCabins, setSelectedCabins] = useState([]);
// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [message, setMessage] = useState({ text: "", type: "" });

// // // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // // //   const [currentCabinId, setCurrentCabinId] = useState(null);
// // // // //   const [minutesToAdd, setMinutesToAdd] = useState("5");

// // // // //   useEffect(() => {
// // // // //     const loadAll = async () => {
// // // // //       try {
// // // // //         setLoading(true);
// // // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // // //         if (!res.ok) throw new Error();
// // // // //         const data = await res.json();
// // // // //         setCabins(data || []);
// // // // //         setSelectedCabins(data.map((c) => c._id));

// // // // //         const pricingObj = {};
// // // // //         for (const cabin of data) {
// // // // //           try {
// // // // //             const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// // // // //             const p = pres.ok ? await pres.json() : null;
// // // // //             pricingObj[cabin._id] = {
// // // // //               baseMinutePrice: p?.baseMinutePrice ?? 5,
// // // // //               minutePricing: p?.minutePricing || {},
// // // // //             };
// // // // //           } catch {
// // // // //             pricingObj[cabin._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // // //           }
// // // // //         }
// // // // //         setAllPricing(pricingObj);
// // // // //       } catch {
// // // // //         showMessage(t(lang, "pricing.message.loadFailed"), "error");
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };
// // // // //     loadAll();
// // // // //   }, [lang]);

// // // // //   const openAddModal = (cabinId) => {
// // // // //     setCurrentCabinId(cabinId);
// // // // //     setMinutesToAdd("5");
// // // // //     setShowAddModal(true);
// // // // //   };

// // // // //   const confirmAddMinutes = () => {
// // // // //     const count = parseInt(minutesToAdd);
// // // // //     if (isNaN(count) || count < 1 || count > 100) {
// // // // //       showMessage(t(lang, "pricing.message.addMinutesError"), "error");
// // // // //       return;
// // // // //     }

// // // // //     setAllPricing((prev) => {
// // // // //       const current = prev[currentCabinId]?.minutePricing || {};
// // // // //       const existing = Object.keys(current).map(Number).filter((n) => !isNaN(n));
// // // // //       let next = existing.length === 0 ? 1 : Math.max(...existing) + 1;
// // // // //       const newEntries = {};
// // // // //       for (let i = 0; i < count; i++) {
// // // // //         newEntries[next + i] = prev[currentCabinId]?.baseMinutePrice || 5;
// // // // //       }
// // // // //       return {
// // // // //         ...prev,
// // // // //         [currentCabinId]: {  // ← Fixed typo: CompositeCabinId → currentCabinId
// // // // //           ...prev[currentCabinId],
// // // // //           minutePricing: { ...current, ...newEntries },
// // // // //         },
// // // // //       };
// // // // //     });

// // // // //     setShowAddModal(false);
// // // // //     showMessage(t(lang, "pricing.message.addMinutesSuccess", { count }), "success");
// // // // //   };

// // // // //   const deleteMinute = (cabinId, minute) => {
// // // // //     setAllPricing((prev) => ({
// // // // //       ...prev,
// // // // //       [cabinId]: {
// // // // //         ...prev[cabinId],
// // // // //         minutePricing: Object.fromEntries(
// // // // //           Object.entries(prev[cabinId]?.minutePricing || {}).filter(([k]) => k !== minute)
// // // // //         ),
// // // // //       },
// // // // //     }));
// // // // //   };

// // // // //   const updatePrice = (cabinId, minute, value) => {
// // // // //     const num = value === "" ? "" : parseFloat(value);
// // // // //     if (value === "" || !isNaN(num)) {
// // // // //       setAllPricing((prev) => ({
// // // // //         ...prev,
// // // // //         [cabinId]: {
// // // // //           ...prev[cabinId],
// // // // //           minutePricing: {
// // // // //             ...prev[cabinId].minutePricing,
// // // // //             [minute]: value === "" ? "" : num,
// // // // //           },
// // // // //         },
// // // // //       }));
// // // // //     }
// // // // //   };

// // // // //   const updateBasePrice = (cabinId, value) => {
// // // // //     const num = parseFloat(value) || 0;
// // // // //     setAllPricing((prev) => ({
// // // // //       ...prev,
// // // // //       [cabinId]: { ...prev[cabinId], baseMinutePrice: num },
// // // // //     }));
// // // // //   };

// // // // //   const copyToSelected = () => {
// // // // //     if (cabins.length === 0) return;
// // // // //     const source = allPricing[cabins[0]._id];
// // // // //     if (!source) return;

// // // // //     setAllPricing((prev) => {
// // // // //       const updated = { ...prev };
// // // // //       selectedCabins.forEach((id) => {
// // // // //         updated[id] = {
// // // // //           baseMinutePrice: source.baseMinutePrice,
// // // // //           minutePricing: { ...source.minutePricing },
// // // // //         };
// // // // //       });
// // // // //       return updated;
// // // // //     });
// // // // //     showMessage(t(lang, "pricing.message.copied"), "success");
// // // // //   };

// // // // //   const saveAll = async () => {
// // // // //     setSaving(true);
// // // // //     try {
// // // // //       for (const cabin of cabins) {
// // // // //         const p = allPricing[cabin._id];
// // // // //         if (!p) continue;

// // // // //         const clean = {};
// // // // //         Object.entries(p.minutePricing).forEach(([min, price]) => {
// // // // //           if (price !== "" && price !== null) clean[min] = parseFloat(price);
// // // // //         });

// // // // //         await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`, {
// // // // //           method: "PUT",
// // // // //           headers: { "Content-Type": "application/json" },
// // // // //           body: JSON.stringify({
// // // // //             baseMinutePrice: parseFloat(p.baseMinutePrice) || 0,
// // // // //             minutePricing: clean,
// // // // //           }),
// // // // //         });
// // // // //       }
// // // // //       showMessage(t(lang, "pricing.message.saved"), "success");
// // // // //     } catch {
// // // // //       showMessage(t(lang, "pricing.message.saveFailed"), "error");
// // // // //     } finally {
// // // // //       setSaving(false);
// // // // //     }
// // // // //   };

// // // // //   const exportToExcel = () => {
// // // // //     if (cabins.length === 0) return;

// // // // //     const allMinutes = new Set();
// // // // //     Object.values(allPricing).forEach((p) =>
// // // // //       Object.keys(p.minutePricing).forEach((m) => allMinutes.add(m))
// // // // //     );
// // // // //     const minutes = Array.from(allMinutes).map(Number).sort((a, b) => a - b);

// // // // //     const rows = [
// // // // //       [
// // // // //         t(lang, "pricing.excel.minute") || "Minute",
// // // // //         ...cabins.map(
// // // // //           (c) => `${c.code || ""} ${c.name}`.trim() || t(lang, "pricing.excel.cabin") || "Cabin"
// // // // //         ),
// // // // //       ],
// // // // //     ];

// // // // //     minutes.forEach((min) => {
// // // // //       const row = [min];
// // // // //       cabins.forEach((c) => {
// // // // //         const price = allPricing[c._id]?.minutePricing[min];
// // // // //         row.push(price !== undefined && price !== "" ? price : "");
// // // // //       });
// // // // //       rows.push(row);
// // // // //     });

// // // // //     rows.push([
// // // // //       t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
// // // // //       ...cabins.map((c) => allPricing[c._id]?.baseMinutePrice || 0),
// // // // //     ]);

// // // // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // // // //     ws["!cols"] = rows[0].map(() => ({ wch: 18 }));
// // // // //     const wb = XLSX.utils.book_new();
// // // // //     XLSX.utils.book_append_sheet(wb, ws, "Pricing");
// // // // //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // // //     showMessage(t(lang, "pricing.message.exported"), "success");
// // // // //   };

// // // // //   const handleImport = (e) => {
// // // // //     const file = e.target.files[0];
// // // // //     if (!file) return;
// // // // //     const reader = new FileReader();
// // // // //     reader.onload = (ev) => {
// // // // //       try {
// // // // //         const wb = XLSX.read(ev.target.result, { type: "array" });
// // // // //         const ws = wb.Sheets[wb.SheetNames[0]];
// // // // //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// // // // //         const newPricing = {};
// // // // //         cabins.forEach((c) => {
// // // // //           newPricing[c._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // // //         });

// // // // //         rows.forEach((row, i) => {
// // // // //           if (i === 0) return;
// // // // //           if (row[0] === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
// // // // //             row.slice(1).forEach((val, idx) => {
// // // // //               if (cabins[idx]) newPricing[cabins[idx]._id].baseMinutePrice = parseFloat(val) || 5;
// // // // //             });
// // // // //           } else if (typeof row[0] === "number") {
// // // // //             const min = row[0].toString();
// // // // //             row.slice(1).forEach((val, idx) => {
// // // // //               if (cabins[idx] && val !== undefined && val !== "") {
// // // // //                 newPricing[cabins[idx]._id].minutePricing[min] = parseFloat(val);
// // // // //               }
// // // // //             });
// // // // //           }
// // // // //         });

// // // // //         setAllPricing((prev) => ({ ...prev, ...newPricing }));
// // // // //         showMessage(t(lang, "pricing.message.imported"), "success");
// // // // //       } catch {
// // // // //         showMessage(t(lang, "pricing.message.importFailed"), "error");
// // // // //       }
// // // // //     };
// // // // //     reader.readAsArrayBuffer(file);
// // // // //   };

// // // // //   const showMessage = (text, type) => {
// // // // //     setMessage({ text, type });
// // // // //     setTimeout(() => setMessage({ text: "", type: "" }), 4000);
// // // // //   };

// // // // //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // // // //   const card = isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200";

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center text-xl`}>
// // // // //         {t(lang, "pricing.loading")}
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div key={lang} className={`min-h-screen ${bg}`}>
// // // // //       {/* ← YE KEY ADD KIYA = INSTANT CHANGE GUARANTEED */}
// // // // //       <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
// // // // //         {/* Header */}
// // // // //         <div className="text-center space-y-3">
// // // // //           <p className="text-emerald-500 font-semibold tracking-wider text-sm uppercase">
// // // // //             {t(lang, "pricing.header.kicker")}
// // // // //           </p>
// // // // //           <h1 className="text-3xl font-bold">{t(lang, "pricing.header.title")}</h1>
// // // // //           <p className="text-slate-500 max-w-2xl mx-auto">
// // // // //             {t(lang, "pricing.header.subtitle")}
// // // // //           </p>
// // // // //         </div>

// // // // //         {/* Message */}
// // // // //         {message.text && (
// // // // //           <div
// // // // //             className={`rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// // // // //               message.type === "success"
// // // // //                 ? "bg-emerald-500/20 text-emerald-300"
// // // // //                 : "bg-rose-500/20 text-rose-300"
// // // // //             }`}
// // // // //           >
// // // // //             <CheckCircle className="w-5 h-5" />
// // // // //             {message.text}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Bulk Actions */}
// // // // //         <div className={`rounded-2xl border ${card} p-6 shadow-lg`}>
// // // // //           <div className="flex flex-wrap items-center gap-4">
// // // // //             <button onClick={copyToSelected} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
// // // // //               <Copy className="w-4 h-4" />
// // // // //               {t(lang, "pricing.bulk.copyToSelected")}
// // // // //             </button>
// // // // //             <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
// // // // //               <Download className="w-4 h-4" />
// // // // //               {t(lang, "pricing.bulk.exportExcel")}
// // // // //             </button>
// // // // //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium cursor-pointer transition">
// // // // //               <Upload className="w-4 h-4" />
// // // // //               {t(lang, "pricing.bulk.importExcel")}
// // // // //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // // // //             </label>
// // // // //             <button onClick={saveAll} disabled={saving} className="ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-2.5 rounded-lg font-semibold transition">
// // // // //               {saving ? t(lang, "pricing.bulk.saving") : t(lang, "pricing.bulk.saveAll")}
// // // // //             </button>
// // // // //           </div>

// // // // //           <div className="mt-5 flex flex-wrap items-center gap-4">
// // // // //             <span className="font-medium text-slate-400">{t(lang, "pricing.bulk.copyTo")}:</span>
// // // // //             {cabins.map((c) => (
// // // // //               <label key={c._id} className="flex items-center gap-2">
// // // // //                 <input
// // // // //                   type="checkbox"
// // // // //                   checked={selectedCabins.includes(c._id)}
// // // // //                   onChange={(e) =>
// // // // //                     setSelectedCabins((prev) =>
// // // // //                       e.target.checked ? [...prev, c._id] : prev.filter((id) => id !== c._id)
// // // // //                     )
// // // // //                   }
// // // // //                   className="w-4 h-4 rounded text-emerald-600"
// // // // //                 />
// // // // //                 <span className="font-medium">{c.code} · {c.name}</span>
// // // // //               </label>
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Cabin Cards */}
// // // // //         {cabins.map((cabin) => {
// // // // //           const p = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: {} };
// // // // //           const minutes = Object.keys(p.minutePricing)
// // // // //             .map(Number)
// // // // //             .filter((n) => !isNaN(n))
// // // // //             .sort((a, b) => a - b);

// // // // //           return (
// // // // //             <div key={cabin._id} className={`rounded-2xl border ${card} p-7 shadow-lg space-y-6`}>
// // // // //               <div className="flex justify-between items-center">
// // // // //                 <div>
// // // // //                   <h3 className="text-xl font-bold">{cabin.code} · {cabin.name}</h3>
// // // // //                   <p className="text-sm text-slate-500 mt-1">
// // // // //                     {cabin.category || cabin.deviceType || t(lang, "pricing.excel.cabin") || "Cabin"}
// // // // //                   </p>
// // // // //                 </div>
// // // // //                 <div className="flex items-center gap-3">
// // // // //                   <span className="text-sm font-medium text-slate-400">
// // // // //                     {t(lang, "pricing.cabinCard.basePrice")}
// // // // //                   </span>
// // // // //                   <input
// // // // //                     type="number"
// // // // //                     step="0.01"
// // // // //                     value={p.baseMinutePrice}
// // // // //                     onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// // // // //                     className="w-28 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // //                   />
// // // // //                   <span className="font-medium">{t(lang, "pricing.cabinCard.perMin")}</span>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="space-y-3">
// // // // //                 {minutes.map((min) => (
// // // // //                   <div key={min} className="flex items-center gap-5 bg-slate-800/20 rounded-xl px-5 py-3.5">
// // // // //                     <div className="w-28 font-semibold">
// // // // //                       {min} {t(lang, "pricing.excel.min") || "min"}
// // // // //                     </div>
// // // // //                     <div className="flex items-center gap-3 flex-1">
// // // // //                       <span className="text-lg">€</span>
// // // // //                       <input
// // // // //                         type="number"
// // // // //                         step="0.01"
// // // // //                         value={p.minutePricing[min] || ""}
// // // // //                         onChange={(e) => updatePrice(cabin._id, min.toString(), e.target.value)}
// // // // //                         placeholder={p.baseMinutePrice.toString()}
// // // // //                         className="w-40 px-4 py-2 rounded-lg border bg-transparent font-medium"
// // // // //                       />
// // // // //                     </div>
// // // // //                     <button onClick={() => deleteMinute(cabin._id, min.toString())} className="text-rose-400 hover:text-rose-300 transition">
// // // // //                       <Trash2 className="w-5 h-5" />
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 ))}

// // // // //                 <button onClick={() => openAddModal(cabin._id)} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-medium transition">
// // // // //                   <Plus className="w-5 h-5" />
// // // // //                   {t(lang, "pricing.cabinCard.addMinutes")}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           );
// // // // //         })}

// // // // //         {/* Modal */}
// // // // //         {showAddModal && (
// // // // //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// // // // //             <div className={`rounded-2xl border ${card} p-8 max-w-md w-full mx-4`}>
// // // // //               <div className="flex justify-between items-center mb-6">
// // // // //                 <h3 className="text-xl font-bold">{t(lang, "pricing.modal.title")}</h3>
// // // // //                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-300">
// // // // //                   <X className="w-6 h-6" /> {/* ← Fixed syntax */}
// // // // //                 </button>
// // // // //               </div>
// // // // //               <p className="text-sm text-slate-400 mb-4">{t(lang, "pricing.modal.desc")}</p>
// // // // //               <input
// // // // //                 type="number"
// // // // //                 min="1"
// // // // //                 max="100"
// // // // //                 value={minutesToAdd}
// // // // //                 onChange={(e) => setMinutesToAdd(e.target.value)}
// // // // //                 className="w-full px-4 py-3 rounded-lg border bg-transparent text-lg font-medium mb-6"
// // // // //                 placeholder={t(lang, "pricing.modal.placeholder")}
// // // // //                 autoFocus
// // // // //               />
// // // // //               <div className="flex gap-3 justify-end">
// // // // //                 <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-lg border font-medium hover:bg-slate-800/50 transition">
// // // // //                   {t(lang, "pricing.modal.cancel")}
// // // // //                 </button>
// // // // //                 <button onClick={confirmAddMinutes} className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition">
// // // // //                   {t(lang, "pricing.modal.add")}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default CabinPricing;

// // // // import React, { useEffect, useState } from "react";
// // // // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, X } from "lucide-react";
// // // // import * as XLSX from "xlsx";
// // // // import { t } from "../i18n";
// // // // import { useLanguage } from "../context/LanguageContext";

// // // // const API_BASE =
// // // //   import.meta.env.VITE_API_BASE_URL ||
// // // //   "https://backend-two-orpin-12.vercel.app";

// // // // function CabinPricing({ theme }) {
// // // //   const isDark = theme === "dark";
// // // //   const { language } = useLanguage();
// // // //   const lang = language || "en";

// // // //   const [cabins, setCabins] = useState([]);
// // // //   const [allPricing, setAllPricing] = useState({});
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [selectedCabins, setSelectedCabins] = useState([]);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [message, setMessage] = useState({ text: "", type: "" });

// // // //   const [showAddModal, setShowAddModal] = useState(false);
// // // //   const [currentCabinId, setCurrentCabinId] = useState(null);
// // // //   const [minutesToAdd, setMinutesToAdd] = useState("10");

// // // //   const ALL_MINUTES = Array.from({ length: 180 }, (_, i) => i + 1);

// // // //   useEffect(() => {
// // // //     const loadAll = async () => {
// // // //       try {
// // // //         setLoading(true);
// // // //         const res = await fetch(`${API_BASE}/api/cabins`);
// // // //         if (!res.ok) throw new Error();
// // // //         const data = await res.json();
// // // //         setCabins(data || []);
// // // //         setSelectedCabins(data.map((c) => c._id));

// // // //         const pricingObj = {};
// // // //         for (const cabin of data) {
// // // //           try {
// // // //             const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// // // //             const p = pres.ok ? await pres.json() : null;
// // // //             pricingObj[cabin._id] = {
// // // //               baseMinutePrice: p?.baseMinutePrice ?? 5,
// // // //               minutePricing: p?.minutePricing || {},
// // // //             };
// // // //           } catch {
// // // //             pricingObj[cabin._id] = { baseMinutePrice: 5, minutePricing: {} };
// // // //           }
// // // //         }
// // // //         setAllPricing(pricingObj);
// // // //       } catch {
// // // //         showMessage(t(lang, "pricing.message.loadFailed"), "error");
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };
// // // //     loadAll();
// // // //   }, [lang]);

// // // //   const openAddModal = (cabinId) => {
// // // //     setCurrentCabinId(cabinId);
// // // //     setMinutesToAdd("10");
// // // //     setShowAddModal(true);
// // // //   };

// // // //   const confirmAddMinutes = () => {
// // // //     const count = parseInt(minutesToAdd);
// // // //     if (isNaN(count) || count < 1 || count > 180) {
// // // //       showMessage("Please enter a number between 1 and 180", "error");
// // // //       return;
// // // //     }

// // // //     setAllPricing((prev) => {
// // // //       const current = prev[currentCabinId]?.minutePricing || {};
// // // //       const existing = Object.keys(current).map(Number).filter((n) => !isNaN(n));
// // // //       let next = existing.length === 0 ? 1 : Math.max(...existing) + 1;

// // // //       const newEntries = {};
// // // //       for (let i = 0; i < count; i++) {
// // // //         const minute = next + i;
// // // //         if (minute > 180) break;
// // // //         newEntries[minute] = prev[currentCabinId]?.baseMinutePrice || 5;
// // // //       }

// // // //       return {
// // // //         ...prev,
// // // //         [currentCabinId]: {
// // // //           ...prev[currentCabinId],
// // // //           minutePricing: { ...current, ...newEntries },
// // // //         },
// // // //       };
// // // //     });

// // // //     setShowAddModal(false);
// // // //     showMessage(t(lang, "pricing.message.addMinutesSuccess", { count }), "success");
// // // //   };

// // // //   const deleteMinute = (cabinId, minute) => {
// // // //     setAllPricing((prev) => ({
// // // //       ...prev,
// // // //       [cabinId]: {
// // // //         ...prev[cabinId],
// // // //         minutePricing: Object.fromEntries(
// // // //           Object.entries(prev[cabinId]?.minutePricing || {}).filter(([k]) => k !== minute.toString())
// // // //         ),
// // // //       },
// // // //     }));
// // // //   };

// // // //   const updatePrice = (cabinId, minute, value) => {
// // // //     const num = value === "" ? undefined : parseFloat(value);
// // // //     if (value === "" || !isNaN(num)) {
// // // //       setAllPricing((prev) => ({
// // // //         ...prev,
// // // //         [cabinId]: {
// // // //           ...prev[cabinId],
// // // //           minutePricing: {
// // // //             ...prev[cabinId].minutePricing,
// // // //             [minute]: num,
// // // //           },
// // // //         },
// // // //       }));
// // // //     }
// // // //   };

// // // //   const updateBasePrice = (cabinId, value) => {
// // // //     const num = parseFloat(value) || 0;
// // // //     setAllPricing((prev) => ({
// // // //       ...prev,
// // // //       [cabinId]: { ...prev[cabinId], baseMinutePrice: num },
// // // //     }));
// // // //   };

// // // //   const copyToSelected = () => {
// // // //     if (cabins.length === 0) return;
// // // //     const source = allPricing[cabins[0]._id];
// // // //     if (!source) return;

// // // //     setAllPricing((prev) => {
// // // //       const updated = { ...prev };
// // // //       selectedCabins.forEach((id) => {
// // // //         if (id !== cabins[0]._id) {
// // // //           updated[id] = {
// // // //             baseMinutePrice: source.baseMinutePrice,
// // // //             minutePricing: { ...source.minutePricing },
// // // //           };
// // // //         }
// // // //       });
// // // //       return updated;
// // // //     });
// // // //     showMessage(t(lang, "pricing.message.copied"), "success");
// // // //   };

// // // //   const saveAll = async () => {
// // // //     setSaving(true);
// // // //     try {
// // // //       for (const cabin of cabins) {
// // // //         const p = allPricing[cabin._id];
// // // //         if (!p) continue;

// // // //         const clean = {};
// // // //         Object.entries(p.minutePricing).forEach(([min, price]) => {
// // // //           if (price !== undefined && price !== null) {
// // // //             clean[min] = parseFloat(price);
// // // //           }
// // // //         });

// // // //         await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`, {
// // // //           method: "PUT",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({
// // // //             baseMinutePrice: parseFloat(p.baseMinutePrice) || 5,
// // // //             minutePricing: clean,
// // // //           }),
// // // //         });
// // // //       }
// // // //       showMessage(t(lang, "pricing.message.saved"), "success");
// // // //     } catch {
// // // //       showMessage(t(lang, "pricing.message.saveFailed"), "error");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const exportToExcel = () => {
// // // //     if (cabins.length === 0) return;

// // // //     const rows = [];

// // // //     rows.push([
// // // //       t(lang, "pricing.excel.minute") || "Minute",
// // // //       ...cabins.map((c) => `${c.code || ""} ${c.name}`.trim() || "Cabin"),
// // // //     ]);

// // // //     ALL_MINUTES.forEach((min) => {
// // // //       const row = [min];
// // // //       cabins.forEach((c) => {
// // // //         const customPrice = allPricing[c._id]?.minutePricing[min];
// // // //         const price = customPrice !== undefined ? customPrice : allPricing[c._id]?.baseMinutePrice || 5;
// // // //         row.push(price);
// // // //       });
// // // //       rows.push(row);
// // // //     });

// // // //     rows.push([
// // // //       t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
// // // //       ...cabins.map((c) => allPricing[c._id]?.baseMinutePrice || 5),
// // // //     ]);

// // // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // // //     ws["!cols"] = rows[0].map(() => ({ wch: 18 }));

// // // //     const wb = XLSX.utils.book_new();
// // // //     XLSX.utils.book_append_sheet(wb, ws, "Cabin Pricing");
// // // //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

// // // //     showMessage(t(lang, "pricing.message.exported"), "success");
// // // //   };

// // // //   const handleImport = (e) => {
// // // //     const file = e.target.files[0];
// // // //     if (!file) return;

// // // //     const reader = new FileReader();
// // // //     reader.onload = (ev) => {
// // // //       try {
// // // //         const wb = XLSX.read(ev.target.result, { type: "array" });
// // // //         const ws = wb.Sheets[wb.SheetNames[0]];
// // // //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// // // //         const newPricing = {};
// // // //         cabins.forEach((c) => {
// // // //           newPricing[c._id] = {
// // // //             baseMinutePrice: allPricing[c._id]?.baseMinutePrice || 5,
// // // //             minutePricing: { ...allPricing[c._id]?.minutePricing },
// // // //           };
// // // //         });

// // // //         rows.forEach((row, i) => {
// // // //           if (i === 0) return;

// // // //           if (row[0] === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
// // // //             row.slice(1).forEach((val, idx) => {
// // // //               if (cabins[idx] && val !== undefined && val !== "") {
// // // //                 newPricing[cabins[idx]._id].baseMinutePrice = parseFloat(val) || 5;
// // // //               }
// // // //             });
// // // //           } else if (typeof row[0] === "number") {
// // // //             const min = row[0].toString();
// // // //             row.slice(1).forEach((val, idx) => {
// // // //               if (cabins[idx] && val !== undefined && val !== "") {
// // // //                 newPricing[cabins[idx]._id].minutePricing[min] = parseFloat(val);
// // // //               }
// // // //             });
// // // //           }
// // // //         });

// // // //         setAllPricing((prev) => ({ ...prev, ...newPricing }));
// // // //         showMessage(t(lang, "pricing.message.imported"), "success");
// // // //       } catch {
// // // //         showMessage(t(lang, "pricing.message.importFailed"), "error");
// // // //       }
// // // //     };
// // // //     reader.readAsArrayBuffer(file);
// // // //   };

// // // //   const showMessage = (text, type) => {
// // // //     setMessage({ text, type });
// // // //     setTimeout(() => setMessage({ text: "", type: "" }), 4000);
// // // //   };

// // // //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // // //   const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
// // // //   const border = isDark ? "border-slate-800" : "border-slate-200";
// // // //   const muted = isDark ? "text-slate-400" : "text-slate-500";
// // // //   const inputBg = isDark ? "bg-slate-800/50" : "bg-slate-100";

// // // //   if (loading) {
// // // //     return (
// // // //       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
// // // //         <p className="text-lg font-medium">{t(lang, "pricing.loading")}</p>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div key={lang} className={`min-h-screen ${bg}`}>
// // // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
// // // //         {/* Header */}
// // // //         <div className="text-center">
// // // //           <p className="text-emerald-500 font-medium tracking-wider text-sm">
// // // //             {t(lang, "pricing.header.kicker")}
// // // //           </p>
// // // //           <h1 className="mt-2 text-3xl font-bold">{t(lang, "pricing.header.title")}</h1>
// // // //           <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
// // // //             {t(lang, "pricing.header.subtitle")}
// // // //           </p>
// // // //         </div>

// // // //         {/* Message */}
// // // //         {message.text && (
// // // //           <div className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// // // //             message.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
// // // //           }`}>
// // // //             <CheckCircle className="w-5 h-5 flex-shrink-0" />
// // // //             <span className="text-sm">{message.text}</span>
// // // //           </div>
// // // //         )}

// // // //         {/* Bulk Actions */}
// // // //         <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6`}>
// // // //           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
// // // //             <div className="flex flex-wrap gap-3">
// // // //               <button onClick={copyToSelected} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition">
// // // //                 <Copy className="w-4 h-4" />
// // // //                 {t(lang, "pricing.bulk.copyToSelected")}
// // // //               </button>
// // // //               <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition">
// // // //                 <Download className="w-4 h-4" />
// // // //                 {t(lang, "pricing.bulk.exportExcel")}
// // // //               </button>
// // // //               <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
// // // //                 <Upload className="w-4 h-4" />
// // // //                 {t(lang, "pricing.bulk.importExcel")}
// // // //                 <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // // //               </label>
// // // //             </div>
// // // //             <button onClick={saveAll} disabled={saving} className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition">
// // // //               {saving ? t(lang, "pricing.bulk.saving") : t(lang, "pricing.bulk.saveAll")}
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Cabins - Responsive Grid */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// // // //           {cabins.map((cabin) => {
// // // //             const p = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: {} };
// // // //             const customMinutes = new Set(Object.keys(p.minutePricing).map(String));

// // // //             return (
// // // //               <div key={cabin._id} className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}>
// // // //                 {/* Header */}
// // // //                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
// // // //                   <div>
// // // //                     <h3 className="text-xl font-bold">{cabin.code} · {cabin.name}</h3>
// // // //                     <p className={`text-sm ${muted}`}>
// // // //                       {cabin.category || cabin.deviceType || "Cabin"}
// // // //                     </p>
// // // //                   </div>
// // // //                   <div className="sm:text-right">
// // // //                     <p className={`text-xs ${muted}`}>{t(lang, "pricing.cabinCard.basePrice")}</p>
// // // //                     <div className="flex items-center gap-2 mt-1">
// // // //                       <input
// // // //                         type="number"
// // // //                         step="0.01"
// // // //                         value={p.baseMinutePrice}
// // // //                         onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// // // //                         className={`w-24 px-3 py-2 rounded-lg border ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-300"} text-sm font-medium`}
// // // //                       />
// // // //                       <span className="text-sm font-medium">€/min</span>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>

// // // //                 {/* Minutes List - Scrollable */}
// // // //                 <div className="space-y-2 max-h-96 overflow-y-auto">
// // // //                   {ALL_MINUTES.map((min) => {
// // // //                     const hasCustom = customMinutes.has(min.toString());
// // // //                     const displayPrice = hasCustom ? (p.minutePricing[min] ?? p.baseMinutePrice) : p.baseMinutePrice;

// // // //                     return (
// // // //                       <div
// // // //                         key={min}
// // // //                         className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
// // // //                           hasCustom
// // // //                             ? isDark ? "bg-emerald-500/15 border border-emerald-500/40" : "bg-emerald-50 border border-emerald-300"
// // // //                             : isDark ? "bg-slate-800/30" : "bg-slate-100/60"
// // // //                         }`}
// // // //                       >
// // // //                         <div className="flex items-center gap-3 flex-1 min-w-0">
// // // //                           <span className="text-sm font-medium whitespace-nowrap">{min} min</span>
// // // //                           <input
// // // //                             type="number"
// // // //                             step="0.01"
// // // //                             value={hasCustom ? p.minutePricing[min] || "" : ""}
// // // //                             onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
// // // //                             placeholder={p.baseMinutePrice.toFixed(2)}
// // // //                             className={`w-full max-w-24 px-3 py-1.5 rounded border text-sm font-medium ${
// // // //                               isDark
// // // //                                 ? "bg-slate-900 border-slate-700 placeholder:text-slate-500"
// // // //                                 : "bg-white border-slate-300 placeholder:text-slate-400"
// // // //                             }`}
// // // //                           />
// // // //                           <span className="text-sm font-semibold whitespace-nowrap">
// // // //                             € {Number(displayPrice).toFixed(2)}
// // // //                           </span>
// // // //                         </div>
// // // //                         {hasCustom && (
// // // //                           <button
// // // //                             onClick={() => deleteMinute(cabin._id, min)}
// // // //                             className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
// // // //                           >
// // // //                             <Trash2 className="w-4 h-4" />
// // // //                           </button>
// // // //                         )}
// // // //                       </div>
// // // //                     );
// // // //                   })}
// // // //                 </div>

// // // //                 {/* Add Button */}
// // // //                 <button
// // // //                   onClick={() => openAddModal(cabin._id)}
// // // //                   className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-medium transition flex items-center justify-center gap-2"
// // // //                 >
// // // //                   <Plus className="w-5 h-5" />
// // // //                   {t(lang, "pricing.cabinCard.addMinutes")}
// // // //                 </button>
// // // //               </div>
// // // //             );
// // // //           })}
// // // //         </div>

// // // //         {/* Modal */}
// // // //         {showAddModal && (
// // // //           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
// // // //             <div className={`rounded-2xl border ${border} ${cardBg} p-6 sm:p-8 max-w-sm w-full`}>
// // // //               <div className="flex justify-between items-center mb-6">
// // // //                 <h3 className="text-xl font-bold">{t(lang, "pricing.modal.title")}</h3>
// // // //                 <button onClick={() => setShowAddModal(false)} className={`${muted} hover:text-slate-300`}>
// // // //                   <X className="w-6 h-6" />
// // // //                 </button>
// // // //               </div>
// // // //               <p className={`text-sm ${muted} mb-4`}>{t(lang, "pricing.modal.desc")}</p>
// // // //               <input
// // // //                 type="number"
// // // //                 min="1"
// // // //                 max="180"
// // // //                 value={minutesToAdd}
// // // //                 onChange={(e) => setMinutesToAdd(e.target.value)}
// // // //                 className={`w-full px-4 py-3 rounded-lg border ${inputBg} ${isDark ? "border-slate-700" : "border-slate-300"} text-lg font-medium mb-6`}
// // // //                 placeholder="e.g. 20"
// // // //                 autoFocus
// // // //               />
// // // //               <div className="grid grid-cols-2 gap-3">
// // // //                 <button
// // // //                   onClick={() => setShowAddModal(false)}
// // // //                   className={`py-3 rounded-lg border font-medium transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
// // // //                 >
// // // //                   {t(lang, "pricing.modal.cancel")}
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={confirmAddMinutes}
// // // //                   className="py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
// // // //                 >
// // // //                   {t(lang, "pricing.modal.add")}
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default CabinPricing;



// // // // src/pages/CabinPricing.jsx
// // // import React, { useEffect, useMemo, useState } from "react";
// // // import { Trash2, Upload, Download, Copy, CheckCircle, Plus } from "lucide-react";
// // // import * as XLSX from "xlsx";
// // // import { t } from "../i18n";
// // // import { useLanguage } from "../context/LanguageContext";

// // // const API_BASE =
// // //   import.meta.env.VITE_API_BASE_URL || "https://backend-two-orpin-12.vercel.app";

// // // const DEFAULT_MINUTES = 25;       // client wants 25 minutes initially
// // // const SAFE_MAX_MINUTES = 20000;   // scalable beyond 180 (frontend safety only)

// // // function CabinPricing({ theme }) {
// // //   const isDark = theme === "dark";
// // //   const { language } = useLanguage();
// // //   const lang = language || "en";

// // //   const [cabins, setCabins] = useState([]);
// // //   const [allPricing, setAllPricing] = useState({});
// // //   const [loading, setLoading] = useState(true);

// // //   // bulk selection
// // //   const [selectedCabins, setSelectedCabins] = useState([]);
// // //   const [sourceCabinId, setSourceCabinId] = useState("");
// // //   const [uniformPrice, setUniformPrice] = useState("5");

// // //   // save + toast
// // //   const [savingAll, setSavingAll] = useState(false);
// // //   const [savingOne, setSavingOne] = useState({});
// // //   const [message, setMessage] = useState({ text: "", type: "" });

// // //   const showMessage = (text, type) => {
// // //     setMessage({ text, type });
// // //     setTimeout(() => setMessage({ text: "", type: "" }), 3500);
// // //   };

// // //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// // //   const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
// // //   const border = isDark ? "border-slate-800" : "border-slate-200";
// // //   const muted = isDark ? "text-slate-400" : "text-slate-500";
// // //   const inputClass = isDark
// // //     ? "bg-slate-900 border-slate-700 placeholder:text-slate-500"
// // //     : "bg-white border-slate-300 placeholder:text-slate-400";

// // //   const normalizeMinutePricing = (mp) => {
// // //     const out = {};
// // //     if (!mp || typeof mp !== "object") return out;
// // //     Object.entries(mp).forEach(([k, v]) => {
// // //       const n = Number(k);
// // //       if (!Number.isFinite(n) || n <= 0) return;
// // //       if (v === "" || v === undefined || v === null) return;
// // //       const p = Number(v);
// // //       if (!Number.isFinite(p)) return;
// // //       out[n] = p;
// // //     });
// // //     return out;
// // //   };

// // //   const ensureDefaultMinutes = (baseMinutePrice, minutePricing) => {
// // //     // if user has zero rows, seed 1..DEFAULT_MINUTES
// // //     const keys = Object.keys(minutePricing || {}).map(Number).filter(Number.isFinite);
// // //     if (keys.length > 0) return minutePricing;

// // //     const seeded = {};
// // //     for (let i = 1; i <= DEFAULT_MINUTES; i++) {
// // //       seeded[i] = Number(baseMinutePrice ?? 5);
// // //     }
// // //     return seeded;
// // //   };

// // //   const fetchCabinsAndPricing = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const res = await fetch(`${API_BASE}/api/cabins`);
// // //       if (!res.ok) throw new Error("cabins");
// // //       const data = await res.json();

// // //       const list = Array.isArray(data) ? data : [];
// // //       setCabins(list);
// // //       setSelectedCabins(list.map((c) => c._id));
// // //       setSourceCabinId(list[0]?._id || "");

// // //       const pricingObj = {};
// // //       for (const cabin of list) {
// // //         try {
// // //           const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// // //           const p = pres.ok ? await pres.json() : null;

// // //           const base = Number(p?.baseMinutePrice ?? 5);
// // //           const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || {}));

// // //           pricingObj[cabin._id] = {
// // //             baseMinutePrice: base,
// // //             minutePricing: mp, // numeric keys in-memory
// // //           };
// // //         } catch {
// // //           const base = 5;
// // //           pricingObj[cabin._id] = {
// // //             baseMinutePrice: base,
// // //             minutePricing: ensureDefaultMinutes(base, {}),
// // //           };
// // //         }
// // //       }

// // //       setAllPricing(pricingObj);
// // //     } catch {
// // //       showMessage(t(lang, "pricing.message.loadFailed") || "Failed to load pricing", "error");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchCabinsAndPricing();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [lang]);

// // //   const minutesListForCabin = (cabinId) => {
// // //     const mp = allPricing[cabinId]?.minutePricing || {};
// // //     return Object.keys(mp)
// // //       .map(Number)
// // //       .filter((n) => Number.isFinite(n) && n > 0)
// // //       .sort((a, b) => a - b);
// // //   };

// // //   const addNextMinute = (cabinId) => {
// // //     setAllPricing((prev) => {
// // //       const cur = prev[cabinId] || { baseMinutePrice: 5, minutePricing: {} };
// // //       const mp = cur.minutePricing || {};
// // //       const keys = Object.keys(mp).map(Number).filter(Number.isFinite);
// // //       const max = keys.length ? Math.max(...keys) : 0;
// // //       const next = max + 1;

// // //       if (next > SAFE_MAX_MINUTES) {
// // //         showMessage(`Too many minutes (>${SAFE_MAX_MINUTES}). Increase SAFE_MAX_MINUTES if needed.`, "error");
// // //         return prev;
// // //       }

// // //       return {
// // //         ...prev,
// // //         [cabinId]: {
// // //           ...cur,
// // //           minutePricing: {
// // //             ...mp,
// // //             [next]: Number(cur.baseMinutePrice ?? 5),
// // //           },
// // //         },
// // //       };
// // //     });
// // //   };

// // //   const deleteMinute = (cabinId, minute) => {
// // //     setAllPricing((prev) => {
// // //       const cur = prev[cabinId];
// // //       if (!cur) return prev;
// // //       const mp = { ...(cur.minutePricing || {}) };
// // //       delete mp[minute];
// // //       return { ...prev, [cabinId]: { ...cur, minutePricing: mp } };
// // //     });
// // //   };

// // //   const updatePrice = (cabinId, minute, value) => {
// // //     // allow decimals + allow empty string while editing
// // //     if (value === "" || value === "-" || value === "." || value === "-.") {
// // //       setAllPricing((prev) => ({
// // //         ...prev,
// // //         [cabinId]: {
// // //           ...prev[cabinId],
// // //           minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
// // //         },
// // //       }));
// // //       return;
// // //     }

// // //     const num = Number(value);
// // //     if (!Number.isFinite(num)) return;

// // //     setAllPricing((prev) => ({
// // //       ...prev,
// // //       [cabinId]: {
// // //         ...prev[cabinId],
// // //         minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: num },
// // //       },
// // //     }));
// // //   };

// // //   const updateBasePrice = (cabinId, value) => {
// // //     const num = value === "" ? "" : Number(value);
// // //     if (value !== "" && !Number.isFinite(num)) return;

// // //     setAllPricing((prev) => ({
// // //       ...prev,
// // //       [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: value === "" ? "" : num },
// // //     }));
// // //   };

// // //   const toggleCabinSelected = (id) => {
// // //     setSelectedCabins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
// // //   };

// // //   const selectAll = () => setSelectedCabins(cabins.map((c) => c._id));
// // //   const selectNone = () => setSelectedCabins([]);

// // //   const copyFromSourceToSelected = () => {
// // //     if (!sourceCabinId) return;
// // //     const source = allPricing[sourceCabinId];
// // //     if (!source) return;

// // //     setAllPricing((prev) => {
// // //       const next = { ...prev };
// // //       selectedCabins.forEach((id) => {
// // //         if (id === sourceCabinId) return;
// // //         next[id] = {
// // //           baseMinutePrice: Number(source.baseMinutePrice ?? 5),
// // //           minutePricing: { ...(source.minutePricing || {}) },
// // //         };
// // //       });
// // //       return next;
// // //     });

// // //     showMessage(t(lang, "pricing.message.copied") || "Copied", "success");
// // //   };

// // //   const applySamePriceToSelected = () => {
// // //     const p = Number(uniformPrice);
// // //     if (!Number.isFinite(p)) {
// // //       showMessage("Please enter a valid price", "error");
// // //       return;
// // //     }

// // //     setAllPricing((prev) => {
// // //       const next = { ...prev };
// // //       selectedCabins.forEach((id) => {
// // //         const cur = next[id] || { baseMinutePrice: 5, minutePricing: {} };
// // //         const mp = { ...(cur.minutePricing || {}) };
// // //         // set every existing minute row to uniform price
// // //         Object.keys(mp).forEach((k) => {
// // //           const n = Number(k);
// // //           if (Number.isFinite(n) && n > 0) mp[n] = p;
// // //         });

// // //         // if no rows exist, seed default minutes
// // //         const seeded = ensureDefaultMinutes(p, mp);

// // //         next[id] = { baseMinutePrice: p, minutePricing: seeded };
// // //       });
// // //       return next;
// // //     });

// // //     showMessage("Applied same price to selected booths", "success");
// // //   };

// // //   const cleanForSave = (pricing) => {
// // //     const clean = {};
// // //     Object.entries(pricing.minutePricing || {}).forEach(([k, v]) => {
// // //       const n = Number(k);
// // //       if (!Number.isFinite(n) || n <= 0) return;
// // //       if (v === "" || v === undefined || v === null) return;
// // //       const p = Number(v);
// // //       if (!Number.isFinite(p)) return;
// // //       clean[n] = p;
// // //     });

// // //     const base = pricing.baseMinutePrice === "" ? 5 : Number(pricing.baseMinutePrice ?? 5);
// // //     return { baseMinutePrice: Number.isFinite(base) ? base : 5, minutePricing: clean };
// // //   };

// // //   const saveCabin = async (cabinId) => {
// // //     setSavingOne((prev) => ({ ...prev, [cabinId]: true }));
// // //     try {
// // //       const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// // //       const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// // //         method: "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(payload),
// // //       });

// // //       if (!res.ok) {
// // //         showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// // //         return;
// // //       }

// // //       // re-fetch latest saved data
// // //       try {
// // //         const pres = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
// // //         const p = pres.ok ? await pres.json() : null;
// // //         const base = Number(p?.baseMinutePrice ?? payload.baseMinutePrice ?? 5);
// // //         const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || payload.minutePricing || {}));

// // //         setAllPricing((prev) => ({
// // //           ...prev,
// // //           [cabinId]: { baseMinutePrice: base, minutePricing: mp },
// // //         }));
// // //       } catch {}

// // //       showMessage("Saved successfully", "success");
// // //     } catch {
// // //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// // //     } finally {
// // //       setSavingOne((prev) => ({ ...prev, [cabinId]: false }));
// // //     }
// // //   };

// // //   const saveAll = async () => {
// // //     setSavingAll(true);
// // //     try {
// // //       for (const cabin of cabins) {
// // //         const cabinId = cabin._id;
// // //         const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// // //         const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// // //           method: "PUT",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify(payload),
// // //         });

// // //         if (!res.ok) {
// // //           showMessage(`Save failed for ${cabin.code || cabin.name || "booth"}`, "error");
// // //           setSavingAll(false);
// // //           return;
// // //         }
// // //       }

// // //       showMessage(t(lang, "pricing.message.saved") || "Saved", "success");
// // //       await fetchCabinsAndPricing(); // hard refresh so dashboard reflects correctly
// // //     } catch {
// // //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// // //     } finally {
// // //       setSavingAll(false);
// // //     }
// // //   };

// // //   const maxMinuteAcrossAll = useMemo(() => {
// // //     let max = DEFAULT_MINUTES;
// // //     cabins.forEach((c) => {
// // //       const list = minutesListForCabin(c._id);
// // //       if (list.length) max = Math.max(max, list[list.length - 1]);
// // //     });
// // //     return max;
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [cabins, allPricing]);

// // //   const exportToExcel = () => {
// // //     if (!cabins.length) return;

// // //     const rows = [];
// // //     const header = ["Minute", ...cabins.map((c) => (c.code || c.name || "Booth").toString())];
// // //     rows.push(header);

// // //     for (let min = 1; min <= maxMinuteAcrossAll; min++) {
// // //       const row = [min];
// // //       cabins.forEach((c) => {
// // //         const p = allPricing[c._id] || { baseMinutePrice: 5, minutePricing: {} };
// // //         const mp = p.minutePricing || {};
// // //         const cell = mp[min] !== undefined && mp[min] !== "" ? Number(mp[min]) : Number(p.baseMinutePrice ?? 5);
// // //         row.push(Number.isFinite(cell) ? cell : "");
// // //       });
// // //       rows.push(row);
// // //     }

// // //     rows.push([
// // //       "Base Price (€/min)",
// // //       ...cabins.map((c) => {
// // //         const bp = Number(allPricing[c._id]?.baseMinutePrice ?? 5);
// // //         return Number.isFinite(bp) ? bp : 5;
// // //       }),
// // //     ]);

// // //     const ws = XLSX.utils.aoa_to_sheet(rows);
// // //     ws["!cols"] = header.map(() => ({ wch: 20 }));

// // //     const wb = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(wb, ws, "Cabin Pricing");
// // //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

// // //     showMessage(t(lang, "pricing.message.exported") || "Exported", "success");
// // //   };

// // //   const handleImport = (e) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file || !cabins.length) return;

// // //     const reader = new FileReader();
// // //     reader.onload = (ev) => {
// // //       try {
// // //         const wb = XLSX.read(ev.target.result, { type: "array" });
// // //         const ws = wb.Sheets[wb.SheetNames[0]];
// // //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// // //         // expects columns in same order as current cabins (as exported)
// // //         const nextPricing = {};
// // //         cabins.forEach((c) => {
// // //           nextPricing[c._id] = {
// // //             baseMinutePrice: Number(allPricing[c._id]?.baseMinutePrice ?? 5),
// // //             minutePricing: { ...(allPricing[c._id]?.minutePricing || {}) },
// // //           };
// // //         });

// // //         rows.forEach((row, idx) => {
// // //           if (!row || row.length < 2) return;
// // //           if (idx === 0) return;

// // //           const first = row[0];

// // //           if (String(first).trim() === "Base Price (€/min)") {
// // //             row.slice(1).forEach((val, cIdx) => {
// // //               const cabin = cabins[cIdx];
// // //               if (!cabin) return;
// // //               if (val === "" || val === undefined || val === null) return;
// // //               const p = Number(val);
// // //               if (!Number.isFinite(p)) return;
// // //               nextPricing[cabin._id].baseMinutePrice = p;
// // //             });
// // //             return;
// // //           }

// // //           const minute = Number(first);
// // //           if (!Number.isFinite(minute) || minute <= 0) return;

// // //           row.slice(1).forEach((val, cIdx) => {
// // //             const cabin = cabins[cIdx];
// // //             if (!cabin) return;
// // //             if (val === "" || val === undefined || val === null) return;
// // //             const price = Number(val);
// // //             if (!Number.isFinite(price)) return;
// // //             nextPricing[cabin._id].minutePricing[minute] = price;
// // //           });
// // //         });

// // //         // ensure at least 25 mins if import was sparse
// // //         cabins.forEach((c) => {
// // //           const bp = Number(nextPricing[c._id].baseMinutePrice ?? 5);
// // //           nextPricing[c._id].minutePricing = ensureDefaultMinutes(bp, nextPricing[c._id].minutePricing);
// // //         });

// // //         setAllPricing((prev) => ({ ...prev, ...nextPricing }));
// // //         showMessage(t(lang, "pricing.message.imported") || "Imported", "success");
// // //       } catch {
// // //         showMessage(t(lang, "pricing.message.importFailed") || "Import failed", "error");
// // //       }
// // //     };
// // //     reader.readAsArrayBuffer(file);
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
// // //         <p className="text-lg font-medium">{t(lang, "pricing.loading") || "Loading..."}</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div key={lang} className={`min-h-screen ${bg}`}>
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
// // //         {/* Header */}
// // //         <div className="text-center">
// // //           <p className="text-emerald-500 font-medium tracking-wider text-sm">
// // //             {t(lang, "pricing.header.kicker") || "PRICING"}
// // //           </p>
// // //           <h1 className="mt-2 text-3xl font-bold">{t(lang, "pricing.header.title") || "Cabin Pricing"}</h1>
// // //           <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
// // //             {t(lang, "pricing.header.subtitle") || "Manage minute-by-minute pricing per booth."}
// // //           </p>
// // //         </div>

// // //         {/* Message */}
// // //         {message.text && (
// // //           <div
// // //             className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// // //               message.type === "success"
// // //                 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
// // //                 : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
// // //             }`}
// // //           >
// // //             <CheckCircle className="w-5 h-5 flex-shrink-0" />
// // //             <span className="text-sm">{message.text}</span>
// // //           </div>
// // //         )}

// // //         {/* Bulk Actions */}
// // //         <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-4`}>
// // //           {/* booth selector */}
// // //           <div className="flex flex-wrap items-center gap-2">
// // //             <span className={`text-xs ${muted}`}>Select booths:</span>
// // //             <button onClick={selectAll} className={`text-xs px-3 py-1 rounded-full border ${border} hover:opacity-90`}>
// // //               All
// // //             </button>
// // //             <button onClick={selectNone} className={`text-xs px-3 py-1 rounded-full border ${border} hover:opacity-90`}>
// // //               None
// // //             </button>

// // //             <div className="w-full mt-2 flex flex-wrap gap-2">
// // //               {cabins.map((c) => {
// // //                 const active = selectedCabins.includes(c._id);
// // //                 return (
// // //                   <button
// // //                     key={c._id}
// // //                     onClick={() => toggleCabinSelected(c._id)}
// // //                     className={
// // //                       (active
// // //                         ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
// // //                         : isDark
// // //                         ? "bg-slate-900 border-slate-700 text-slate-300"
// // //                         : "bg-slate-50 border-slate-200 text-slate-700") +
// // //                       " border px-3 py-1.5 rounded-full text-xs font-medium transition"
// // //                     }
// // //                   >
// // //                     {c.code || c.name || "Booth"}
// // //                   </button>
// // //                 );
// // //               })}
// // //             </div>
// // //           </div>

// // //           <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
// // //             {/* Copy from source */}
// // //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
// // //               <div className={`text-xs ${muted}`}>Copy from:</div>
// // //               <select
// // //                 value={sourceCabinId}
// // //                 onChange={(e) => setSourceCabinId(e.target.value)}
// // //                 className={`px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// // //               >
// // //                 {cabins.map((c) => (
// // //                   <option key={c._id} value={c._id}>
// // //                     {c.code || c.name || "Booth"}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //               <button
// // //                 onClick={copyFromSourceToSelected}
// // //                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
// // //               >
// // //                 <Copy className="w-4 h-4" />
// // //                 Copy to selected
// // //               </button>
// // //             </div>

// // //             {/* Apply same price */}
// // //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center lg:ml-auto">
// // //               <div className={`text-xs ${muted}`}>Apply same price:</div>
// // //               <div className="flex items-center gap-2">
// // //                 <span className="text-sm font-semibold">€</span>
// // //                 <input
// // //                   type="number"
// // //                   step="0.01"
// // //                   value={uniformPrice}
// // //                   onChange={(e) => setUniformPrice(e.target.value)}
// // //                   className={`w-28 px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// // //                 />
// // //               </div>
// // //               <button
// // //                 onClick={applySamePriceToSelected}
// // //                 className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition"
// // //               >
// // //                 Apply
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* Export/Import + Save All */}
// // //           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
// // //             <button
// // //               onClick={exportToExcel}
// // //               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
// // //             >
// // //               <Download className="w-4 h-4" />
// // //               {t(lang, "pricing.bulk.exportExcel") || "Export Excel"}
// // //             </button>

// // //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
// // //               <Upload className="w-4 h-4" />
// // //               {t(lang, "pricing.bulk.importExcel") || "Import Excel"}
// // //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// // //             </label>

// // //             <button
// // //               onClick={saveAll}
// // //               disabled={savingAll}
// // //               className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition"
// // //             >
// // //               {savingAll ? (t(lang, "pricing.bulk.saving") || "Saving...") : (t(lang, "pricing.bulk.saveAll") || "Save All")}
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Cabins */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// // //           {cabins.map((cabin) => {
// // //             const p = allPricing[cabin._id] || { baseMinutePrice: 5, minutePricing: ensureDefaultMinutes(5, {}) };
// // //             const minutes = minutesListForCabin(cabin._id);

// // //             return (
// // //               <div key={cabin._id} className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}>
// // //                 {/* Header */}
// // //                 <div className="flex items-start justify-between gap-4">
// // //                   <div>
// // //                     <h3 className="text-xl font-bold">{cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}</h3>
// // //                     <p className={`text-sm ${muted}`}>{cabin.category || cabin.deviceType || "Booth"}</p>
// // //                   </div>

// // //                   <div className="text-right space-y-2">
// // //                     <div>
// // //                       <p className={`text-xs ${muted}`}>Base Price</p>
// // //                       <div className="flex items-center gap-2 mt-1 justify-end">
// // //                         <span className="text-sm font-semibold">€</span>
// // //                         <input
// // //                           type="number"
// // //                           step="0.01"
// // //                           value={p.baseMinutePrice}
// // //                           onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// // //                           className={`w-24 px-3 py-2 rounded-lg border text-sm font-medium ${inputClass}`}
// // //                         />
// // //                         <span className="text-sm font-medium">/min</span>
// // //                       </div>
// // //                     </div>

// // //                     <button
// // //                       onClick={() => saveCabin(cabin._id)}
// // //                       disabled={!!savingOne[cabin._id]}
// // //                       className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
// // //                     >
// // //                       {savingOne[cabin._id] ? "Saving..." : "Save"}
// // //                     </button>
// // //                   </div>
// // //                 </div>

// // //                 {/* Minute Rows */}
// // //                 <div className="space-y-2 max-h-96 overflow-y-auto">
// // //                   {minutes.map((min) => {
// // //                     const val = p.minutePricing?.[min];
// // //                     const showVal = val === "" || val === undefined ? "" : Number(val);

// // //                     return (
// // //                       <div
// // //                         key={min}
// // //                         className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
// // //                           isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200"
// // //                         }`}
// // //                       >
// // //                         <div className="flex items-center gap-3 flex-1 min-w-0">
// // //                           <span className="text-sm font-semibold whitespace-nowrap">{min} min</span>

// // //                           <div className="flex items-center gap-2">
// // //                             <span className="text-sm font-semibold">€</span>
// // //                             <input
// // //                               type="number"
// // //                               step="0.01"
// // //                               value={showVal === "" ? "" : showVal}
// // //                               onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
// // //                               placeholder={Number(p.baseMinutePrice ?? 5).toFixed(2)}
// // //                               className={`w-28 px-3 py-1.5 rounded border text-sm font-medium ${inputClass}`}
// // //                             />
// // //                           </div>
// // //                         </div>

// // //                         <button
// // //                           onClick={() => deleteMinute(cabin._id, min)}
// // //                           className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
// // //                           title="Delete"
// // //                         >
// // //                           <Trash2 className="w-4 h-4" />
// // //                         </button>
// // //                       </div>
// // //                     );
// // //                   })}
// // //                 </div>

// // //                 {/* New button (adds next minute) */}
// // //                 <button
// // //                   onClick={() => addNextMinute(cabin._id)}
// // //                   className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-300 hover:bg-emerald-500/10 font-semibold transition flex items-center justify-center gap-2"
// // //                 >
// // //                   <Plus className="w-5 h-5" />
// // //                   New (add next minute)
// // //                 </button>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default CabinPricing;


// // // src/pages/CabinPricing.jsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, RefreshCcw } from "lucide-react";
// // import * as XLSX from "xlsx";
// // import { t } from "../i18n";
// // import { useLanguage } from "../context/LanguageContext";

// // const API_BASE =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   "https://backend-two-orpin-12.vercel.app";

// // // Client requirements
// // const DEFAULT_MINUTES = 25;       // initial rows should be 25
// // const SAFE_MAX_MINUTES = 20000;   // scalable beyond 180 (frontend safety only)

// // // Local cache (to avoid “180 rows” flicker + keep UX smooth)
// // const CACHE_KEY = "aios:cabinPricing:v1";

// // function CabinPricing({ theme }) {
// //   const isDark = theme === "dark";
// //   const { language } = useLanguage();
// //   const lang = language || "en";

// //   const [cabins, setCabins] = useState([]);
// //   const [allPricing, setAllPricing] = useState({});
// //   const [loading, setLoading] = useState(true);

// //   // bulk selection
// //   const [selectedCabins, setSelectedCabins] = useState([]);
// //   const [sourceCabinId, setSourceCabinId] = useState("");
// //   const [uniformPrice, setUniformPrice] = useState("5");

// //   // save + toast
// //   const [savingAll, setSavingAll] = useState(false);
// //   const [savingOne, setSavingOne] = useState({});
// //   const [message, setMessage] = useState({ text: "", type: "" });

// //   // ---------- UI helpers ----------
// //   const showMessage = (text, type) => {
// //     setMessage({ text, type });
// //     setTimeout(() => setMessage({ text: "", type: "" }), 3500);
// //   };

// //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// //   const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
// //   const border = isDark ? "border-slate-800" : "border-slate-200";
// //   const muted = isDark ? "text-slate-400" : "text-slate-500";

// //   const inputClass = isDark
// //     ? "bg-slate-900 border-slate-700 placeholder:text-slate-500 text-slate-50"
// //     : "bg-white border-slate-300 placeholder:text-slate-400 text-slate-900";

// //   // ---------- Core data helpers ----------
// //   const normalizeMinutePricing = (mp) => {
// //     const out = {};
// //     if (!mp || typeof mp !== "object") return out;

// //     Object.entries(mp).forEach(([k, v]) => {
// //       const n = Number(k);
// //       if (!Number.isFinite(n) || n <= 0) return;
// //       if (v === "" || v === undefined || v === null) return;

// //       const p = Number(v);
// //       if (!Number.isFinite(p)) return;
// //       out[n] = p;
// //     });

// //     return out;
// //   };

// //   // IMPORTANT FIX: never auto-fill to 180. Only seed 25 when empty.
// //   const ensureDefaultMinutes = (baseMinutePrice, minutePricing) => {
// //     const keys = Object.keys(minutePricing || {})
// //       .map(Number)
// //       .filter((n) => Number.isFinite(n) && n > 0);

// //     if (keys.length > 0) return minutePricing;

// //     const seeded = {};
// //     for (let i = 1; i <= DEFAULT_MINUTES; i++) {
// //       seeded[i] = Number(baseMinutePrice ?? 5);
// //     }
// //     return seeded;
// //   };

// //   const minutesListForCabin = (cabinId) => {
// //     const mp = allPricing[cabinId]?.minutePricing || {};
// //     return Object.keys(mp)
// //       .map(Number)
// //       .filter((n) => Number.isFinite(n) && n > 0)
// //       .sort((a, b) => a - b);
// //   };

// //   const cleanForSave = (pricing) => {
// //     const clean = {};
// //     Object.entries(pricing.minutePricing || {}).forEach(([k, v]) => {
// //       const n = Number(k);
// //       if (!Number.isFinite(n) || n <= 0) return;
// //       if (v === "" || v === undefined || v === null) return;
// //       const p = Number(v);
// //       if (!Number.isFinite(p)) return;
// //       clean[n] = p;
// //     });

// //     const base = pricing.baseMinutePrice === "" ? 5 : Number(pricing.baseMinutePrice ?? 5);
// //     return {
// //       baseMinutePrice: Number.isFinite(base) ? base : 5,
// //       minutePricing: clean,
// //     };
// //   };

// //   // ---------- Local cache (optional but helpful) ----------
// //   const loadCache = () => {
// //     try {
// //       const raw = localStorage.getItem(CACHE_KEY);
// //       if (!raw) return null;
// //       const parsed = JSON.parse(raw);
// //       if (!parsed || typeof parsed !== "object") return null;
// //       return parsed;
// //     } catch {
// //       return null;
// //     }
// //   };

// //   const saveCache = (next) => {
// //     try {
// //       localStorage.setItem(CACHE_KEY, JSON.stringify(next));
// //     } catch {}
// //   };

// //   // ---------- Fetch ----------
// //   const fetchCabinsAndPricing = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/api/cabins`);
// //       if (!res.ok) throw new Error("cabins");
// //       const data = await res.json();

// //       const list = Array.isArray(data) ? data : [];
// //       setCabins(list);
// //       setSelectedCabins(list.map((c) => c._id));
// //       setSourceCabinId(list[0]?._id || "");

// //       const pricingObj = {};
// //       for (const cabin of list) {
// //         try {
// //           const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// //           const p = pres.ok ? await pres.json() : null;

// //           const base = Number(p?.baseMinutePrice ?? 5);
// //           const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || {}));

// //           pricingObj[cabin._id] = {
// //             baseMinutePrice: base,
// //             minutePricing: mp, // numeric keys in-memory
// //           };
// //         } catch {
// //           const base = 5;
// //           pricingObj[cabin._id] = {
// //             baseMinutePrice: base,
// //             minutePricing: ensureDefaultMinutes(base, {}),
// //           };
// //         }
// //       }

// //       setAllPricing(pricingObj);
// //       saveCache(pricingObj);
// //     } catch {
// //       showMessage(t(lang, "pricing.message.loadFailed") || "Failed to load pricing", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     // show cached instantly for better UX
// //     const cached = loadCache();
// //     if (cached) {
// //       setAllPricing(cached);
// //       setLoading(false);
// //     } else {
// //       setLoading(true);
// //     }

// //     fetchCabinsAndPricing();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [lang]);

// //   // ---------- Actions: add/delete/update ----------
// //   const addNextMinute = (cabinId) => {
// //     setAllPricing((prev) => {
// //       const cur = prev[cabinId] || { baseMinutePrice: 5, minutePricing: {} };
// //       const mp = cur.minutePricing || {};
// //       const keys = Object.keys(mp).map(Number).filter(Number.isFinite);
// //       const max = keys.length ? Math.max(...keys) : 0;
// //       const nextMin = max + 1;

// //       if (nextMin > SAFE_MAX_MINUTES) {
// //         showMessage(
// //           `Too many minutes (>${SAFE_MAX_MINUTES}). Increase SAFE_MAX_MINUTES if needed.`,
// //           "error"
// //         );
// //         return prev;
// //       }

// //       const next = {
// //         ...prev,
// //         [cabinId]: {
// //           ...cur,
// //           minutePricing: {
// //             ...mp,
// //             [nextMin]: Number(cur.baseMinutePrice ?? 5),
// //           },
// //         },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const deleteMinute = (cabinId, minute) => {
// //     setAllPricing((prev) => {
// //       const cur = prev[cabinId];
// //       if (!cur) return prev;
// //       const mp = { ...(cur.minutePricing || {}) };
// //       delete mp[minute];

// //       const next = { ...prev, [cabinId]: { ...cur, minutePricing: mp } };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const updatePrice = (cabinId, minute, value) => {
// //     // allow decimals + allow empty string while editing
// //     if (value === "" || value === "-" || value === "." || value === "-.") {
// //       setAllPricing((prev) => {
// //         const next = {
// //           ...prev,
// //           [cabinId]: {
// //             ...prev[cabinId],
// //             minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
// //           },
// //         };
// //         saveCache(next);
// //         return next;
// //       });
// //       return;
// //     }

// //     const num = Number(value);
// //     if (!Number.isFinite(num)) return;

// //     setAllPricing((prev) => {
// //       const next = {
// //         ...prev,
// //         [cabinId]: {
// //           ...prev[cabinId],
// //           minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: num },
// //         },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const updateBasePrice = (cabinId, value) => {
// //     const num = value === "" ? "" : Number(value);
// //     if (value !== "" && !Number.isFinite(num)) return;

// //     setAllPricing((prev) => {
// //       const next = {
// //         ...prev,
// //         [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: value === "" ? "" : num },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   // ---------- Bulk selection ----------
// //   const toggleCabinSelected = (id) => {
// //     setSelectedCabins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
// //   };

// //   const selectAll = () => setSelectedCabins(cabins.map((c) => c._id));
// //   const selectNone = () => setSelectedCabins([]);

// //   const copyFromSourceToSelected = () => {
// //     if (!sourceCabinId) return;
// //     const source = allPricing[sourceCabinId];
// //     if (!source) return;

// //     setAllPricing((prev) => {
// //       const next = { ...prev };
// //       selectedCabins.forEach((id) => {
// //         if (id === sourceCabinId) return;
// //         next[id] = {
// //           baseMinutePrice: Number(source.baseMinutePrice ?? 5),
// //           minutePricing: { ...(source.minutePricing || {}) },
// //         };
// //       });
// //       saveCache(next);
// //       return next;
// //     });

// //     showMessage(t(lang, "pricing.message.copied") || "Copied", "success");
// //   };

// //   const applySamePriceToSelected = () => {
// //     const p = Number(uniformPrice);
// //     if (!Number.isFinite(p)) {
// //       showMessage("Please enter a valid price", "error");
// //       return;
// //     }

// //     setAllPricing((prev) => {
// //       const next = { ...prev };
// //       selectedCabins.forEach((id) => {
// //         const cur = next[id] || { baseMinutePrice: 5, minutePricing: {} };
// //         const mp = { ...(cur.minutePricing || {}) };

// //         Object.keys(mp).forEach((k) => {
// //           const n = Number(k);
// //           if (Number.isFinite(n) && n > 0) mp[n] = p;
// //         });

// //         const seeded = ensureDefaultMinutes(p, mp);
// //         next[id] = { baseMinutePrice: p, minutePricing: seeded };
// //       });
// //       saveCache(next);
// //       return next;
// //     });

// //     showMessage("Applied same price to selected booths", "success");
// //   };

// //   // ---------- Save (per cabin + save all) ----------
// //   const saveCabin = async (cabinId) => {
// //     setSavingOne((prev) => ({ ...prev, [cabinId]: true }));
// //     try {
// //       const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// //       const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //         return;
// //       }

// //       // re-fetch latest saved data (ensures dashboard consistent)
// //       try {
// //         const pres = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
// //         const p = pres.ok ? await pres.json() : null;

// //         const base = Number(p?.baseMinutePrice ?? payload.baseMinutePrice ?? 5);
// //         const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || payload.minutePricing || {}));

// //         setAllPricing((prev) => {
// //           const next = { ...prev, [cabinId]: { baseMinutePrice: base, minutePricing: mp } };
// //           saveCache(next);
// //           return next;
// //         });
// //       } catch {}

// //       showMessage("Saved successfully", "success");
// //     } catch {
// //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //     } finally {
// //       setSavingOne((prev) => ({ ...prev, [cabinId]: false }));
// //     }
// //   };

// //   const saveAll = async () => {
// //     setSavingAll(true);
// //     try {
// //       for (const cabin of cabins) {
// //         const cabinId = cabin._id;
// //         const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// //         const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });

// //         if (!res.ok) {
// //           showMessage(`Save failed for ${cabin.code || cabin.name || "booth"}`, "error");
// //           setSavingAll(false);
// //           return;
// //         }
// //       }

// //       showMessage(t(lang, "pricing.message.saved") || "Saved", "success");
// //       await fetchCabinsAndPricing(); // hard refresh so dashboard reflects correctly
// //     } catch {
// //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //     } finally {
// //       setSavingAll(false);
// //     }
// //   };

// //   // ---------- Excel: dynamic minutes only (NO 180) ----------
// //   const maxMinuteAcrossAll = useMemo(() => {
// //     let max = DEFAULT_MINUTES;
// //     cabins.forEach((c) => {
// //       const list = minutesListForCabin(c._id);
// //       if (list.length) max = Math.max(max, list[list.length - 1]);
// //     });
// //     return max;
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [cabins, allPricing]);

// //   const exportToExcel = () => {
// //     if (!cabins.length) return;

// //     const rows = [];
// //     const header = ["Minute", ...cabins.map((c) => (c.code || c.name || "Booth").toString())];
// //     rows.push(header);

// //     for (let min = 1; min <= maxMinuteAcrossAll; min++) {
// //       const row = [min];
// //       cabins.forEach((c) => {
// //         const p = allPricing[c._id] || { baseMinutePrice: 5, minutePricing: {} };
// //         const mp = p.minutePricing || {};
// //         const cell =
// //           mp[min] !== undefined && mp[min] !== ""
// //             ? Number(mp[min])
// //             : Number(p.baseMinutePrice ?? 5);

// //         row.push(Number.isFinite(cell) ? cell : "");
// //       });
// //       rows.push(row);
// //     }

// //     rows.push([
// //       "Base Price (€/min)",
// //       ...cabins.map((c) => {
// //         const bp = Number(allPricing[c._id]?.baseMinutePrice ?? 5);
// //         return Number.isFinite(bp) ? bp : 5;
// //       }),
// //     ]);

// //     const ws = XLSX.utils.aoa_to_sheet(rows);
// //     ws["!cols"] = header.map(() => ({ wch: 20 }));

// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, "Cabin Pricing");
// //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

// //     showMessage(t(lang, "pricing.message.exported") || "Exported", "success");
// //   };

// //   const handleImport = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file || !cabins.length) return;

// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       try {
// //         const wb = XLSX.read(ev.target.result, { type: "array" });
// //         const ws = wb.Sheets[wb.SheetNames[0]];
// //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// //         const nextPricing = {};
// //         cabins.forEach((c) => {
// //           nextPricing[c._id] = {
// //             baseMinutePrice: Number(allPricing[c._id]?.baseMinutePrice ?? 5),
// //             minutePricing: { ...(allPricing[c._id]?.minutePricing || {}) },
// //           };
// //         });

// //         rows.forEach((row, idx) => {
// //           if (!row || row.length < 2) return;
// //           if (idx === 0) return;

// //           const first = row[0];

// //           if (String(first).trim() === "Base Price (€/min)") {
// //             row.slice(1).forEach((val, cIdx) => {
// //               const cabin = cabins[cIdx];
// //               if (!cabin) return;
// //               if (val === "" || val === undefined || val === null) return;
// //               const p = Number(val);
// //               if (!Number.isFinite(p)) return;
// //               nextPricing[cabin._id].baseMinutePrice = p;
// //             });
// //             return;
// //           }

// //           const minute = Number(first);
// //           if (!Number.isFinite(minute) || minute <= 0) return;

// //           row.slice(1).forEach((val, cIdx) => {
// //             const cabin = cabins[cIdx];
// //             if (!cabin) return;
// //             if (val === "" || val === undefined || val === null) return;
// //             const price = Number(val);
// //             if (!Number.isFinite(price)) return;
// //             nextPricing[cabin._id].minutePricing[minute] = price;
// //           });
// //         });

// //         // ensure at least 25 mins if import was sparse
// //         cabins.forEach((c) => {
// //           const bp = Number(nextPricing[c._id].baseMinutePrice ?? 5);
// //           nextPricing[c._id].minutePricing = ensureDefaultMinutes(bp, normalizeMinutePricing(nextPricing[c._id].minutePricing));
// //         });

// //         setAllPricing((prev) => {
// //           const next = { ...prev, ...nextPricing };
// //           saveCache(next);
// //           return next;
// //         });

// //         showMessage(t(lang, "pricing.message.imported") || "Imported", "success");
// //       } catch {
// //         showMessage(t(lang, "pricing.message.importFailed") || "Import failed", "error");
// //       }
// //     };
// //     reader.readAsArrayBuffer(file);
// //   };

// //   // ---------- Render ----------
// //   if (loading) {
// //     return (
// //       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
// //         <p className="text-lg font-medium">{t(lang, "pricing.loading") || "Loading..."}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div key={lang} className={`min-h-screen ${bg}`}>
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
// //         {/* Header */}
// //         <div className="text-center">
// //           <p className="text-emerald-500 font-medium tracking-wider text-sm">
// //             {t(lang, "pricing.header.kicker") || "PRICING"}
// //           </p>
// //           <h1 className="mt-2 text-3xl font-bold">
// //             {t(lang, "pricing.header.title") || "Cabin Pricing"}
// //           </h1>
// //           <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
// //             {t(lang, "pricing.header.subtitle") || "Manage minute-by-minute pricing per booth."}
// //           </p>

// //           <div className="mt-4 flex justify-center">
// //             <button
// //               onClick={fetchCabinsAndPricing}
// //               className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${isDark ? "bg-slate-900/40 hover:bg-slate-900/70" : "bg-white hover:bg-slate-50"} transition`}
// //             >
// //               <RefreshCcw className="w-4 h-4" />
// //               <span className="text-sm font-medium">Refresh</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Message */}
// //         {message.text && (
// //           <div
// //             className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// //               message.type === "success"
// //                 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
// //                 : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
// //             }`}
// //           >
// //             <CheckCircle className="w-5 h-5 flex-shrink-0" />
// //             <span className="text-sm">{message.text}</span>
// //           </div>
// //         )}

// //         {/* Bulk Actions */}
// //         <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-4`}>
// //           {/* booth selector */}
// //           <div className="flex flex-wrap items-center gap-2">
// //             <span className={`text-xs ${muted}`}>Select booths:</span>

// //             <button
// //               onClick={selectAll}
// //               className={`text-xs px-3 py-1 rounded-full border ${border} hover:opacity-90`}
// //             >
// //               All
// //             </button>

// //             <button
// //               onClick={selectNone}
// //               className={`text-xs px-3 py-1 rounded-full border ${border} hover:opacity-90`}
// //             >
// //               None
// //             </button>

// //             <div className="w-full mt-2 flex flex-wrap gap-2">
// //               {cabins.map((c) => {
// //                 const active = selectedCabins.includes(c._id);
// //                 return (
// //                   <button
// //                     key={c._id}
// //                     onClick={() => toggleCabinSelected(c._id)}
// //                     className={
// //                       (active
// //                         ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
// //                         : isDark
// //                         ? "bg-slate-900 border-slate-700 text-slate-300"
// //                         : "bg-slate-50 border-slate-200 text-slate-700") +
// //                       " border px-3 py-1.5 rounded-full text-xs font-medium transition"
// //                     }
// //                   >
// //                     {c.code || c.name || "Booth"}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
// //             {/* Copy from source */}
// //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
// //               <div className={`text-xs ${muted}`}>Copy from:</div>

// //               <select
// //                 value={sourceCabinId}
// //                 onChange={(e) => setSourceCabinId(e.target.value)}
// //                 className={`px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// //               >
// //                 {cabins.map((c) => (
// //                   <option key={c._id} value={c._id}>
// //                     {c.code || c.name || "Booth"}
// //                   </option>
// //                 ))}
// //               </select>

// //               <button
// //                 onClick={copyFromSourceToSelected}
// //                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
// //               >
// //                 <Copy className="w-4 h-4" />
// //                 Copy to selected
// //               </button>
// //             </div>

// //             {/* Apply same price */}
// //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center lg:ml-auto">
// //               <div className={`text-xs ${muted}`}>Apply same price:</div>

// //               <div className="flex items-center gap-2">
// //                 <span className="text-sm font-semibold">€</span>
// //                 <input
// //                   type="number"
// //                   step="0.01"
// //                   value={uniformPrice}
// //                   onChange={(e) => setUniformPrice(e.target.value)}
// //                   className={`w-28 px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// //                 />
// //               </div>

// //               <button
// //                 onClick={applySamePriceToSelected}
// //                 className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition"
// //               >
// //                 Apply
// //               </button>
// //             </div>
// //           </div>

// //           {/* Export/Import + Save All */}
// //           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
// //             <button
// //               onClick={exportToExcel}
// //               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
// //             >
// //               <Download className="w-4 h-4" />
// //               {t(lang, "pricing.bulk.exportExcel") || "Export Excel"}
// //             </button>

// //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
// //               <Upload className="w-4 h-4" />
// //               {t(lang, "pricing.bulk.importExcel") || "Import Excel"}
// //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// //             </label>

// //             <button
// //               onClick={saveAll}
// //               disabled={savingAll}
// //               className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition"
// //             >
// //               {savingAll
// //                 ? t(lang, "pricing.bulk.saving") || "Saving..."
// //                 : t(lang, "pricing.bulk.saveAll") || "Save All"}
// //             </button>
// //           </div>

// //           <div className={`text-xs ${muted}`}>
// //             Export includes minutes only up to the highest existing row across booths (no fixed 180 limit).
// //           </div>
// //         </div>

// //         {/* Cabins */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //           {cabins.map((cabin) => {
// //             const p =
// //               allPricing[cabin._id] || {
// //                 baseMinutePrice: 5,
// //                 minutePricing: ensureDefaultMinutes(5, {}),
// //               };

// //             const minutes = minutesListForCabin(cabin._id);

// //             return (
// //               <div
// //                 key={cabin._id}
// //                 className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}
// //               >
// //                 {/* Header */}
// //                 <div className="flex items-start justify-between gap-4">
// //                   <div>
// //                     <h3 className="text-xl font-bold">
// //                       {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
// //                     </h3>
// //                     <p className={`text-sm ${muted}`}>
// //                       {cabin.category || cabin.deviceType || "Booth"}
// //                     </p>

// //                     <p className="mt-1 text-xs text-emerald-400">
// //                       {minutes.length} minute rows
// //                     </p>
// //                   </div>

// //                   <div className="text-right space-y-2">
// //                     <div>
// //                       <p className={`text-xs ${muted}`}>Base Price</p>
// //                       <div className="flex items-center gap-2 mt-1 justify-end">
// //                         <span className="text-sm font-semibold">€</span>
// //                         <input
// //                           type="number"
// //                           step="0.01"
// //                           value={p.baseMinutePrice}
// //                           onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// //                           className={`w-24 px-3 py-2 rounded-lg border text-sm font-medium ${inputClass}`}
// //                         />
// //                         <span className="text-sm font-medium">/min</span>
// //                       </div>
// //                     </div>

// //                     <button
// //                       onClick={() => saveCabin(cabin._id)}
// //                       disabled={!!savingOne[cabin._id]}
// //                       className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
// //                     >
// //                       {savingOne[cabin._id] ? "Saving..." : "Save"}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Minute Rows */}
// //                 <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
// //                   {minutes.map((min) => {
// //                     const val = p.minutePricing?.[min];
// //                     const showVal = val === "" || val === undefined ? "" : Number(val);

// //                     // subtle highlight for new rows > 25
// //                     const rowClass =
// //                       min > DEFAULT_MINUTES
// //                         ? isDark
// //                           ? "border-emerald-500/50 bg-emerald-500/10"
// //                           : "border-emerald-300 bg-emerald-50"
// //                         : isDark
// //                         ? "bg-slate-900/40 border-slate-800"
// //                         : "bg-slate-50 border-slate-200";

// //                     return (
// //                       <div
// //                         key={min}
// //                         className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition ${rowClass}`}
// //                       >
// //                         <div className="flex items-center gap-3 flex-1 min-w-0">
// //                           <span className="text-sm font-semibold whitespace-nowrap">{min} min</span>

// //                           <div className="flex items-center gap-2">
// //                             <span className="text-sm font-semibold">€</span>
// //                             <input
// //                               type="number"
// //                               step="0.01"
// //                               value={showVal === "" ? "" : showVal}
// //                               onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
// //                               placeholder={Number(p.baseMinutePrice ?? 5).toFixed(2)}
// //                               className={`w-28 px-3 py-1.5 rounded border text-sm font-medium ${inputClass}`}
// //                             />
// //                           </div>
// //                         </div>

// //                         <button
// //                           onClick={() => deleteMinute(cabin._id, min)}
// //                           className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
// //                           title="Delete"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>

// //                 {/* Sticky New button */}
// //                 <div className="sticky bottom-0 pt-2">
// //                   <button
// //                     onClick={() => addNextMinute(cabin._id)}
// //                     className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-300 hover:bg-emerald-500/10 font-semibold transition flex items-center justify-center gap-2"
// //                   >
// //                     <Plus className="w-5 h-5" />
// //                     New (add next minute)
// //                   </button>
// //                 </div>

// //                 <div className={`text-[11px] ${muted}`}>
// //                   Tip: Export will include up to <b>{maxMinuteAcrossAll}</b> minutes (max across all booths).
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CabinPricing;


// // src/pages/CabinPricing.jsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { Trash2, Upload, Download, Copy, CheckCircle, Plus, RefreshCcw } from "lucide-react";
// // import * as XLSX from "xlsx";
// // import { t } from "../i18n";
// // import { useLanguage } from "../context/LanguageContext";

// // const API_BASE =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   "https://backend-two-orpin-12.vercel.app";

// // const DEFAULT_MINUTES = 25;
// // const SAFE_MAX_MINUTES = 20000;

// // const CACHE_KEY = "aios:cabinPricing:v1";

// // function CabinPricing({ theme }) {
// //   const isDark = theme === "dark";
// //   const { language } = useLanguage();
// //   const lang = language || "en";

// //   const [cabins, setCabins] = useState([]);
// //   const [allPricing, setAllPricing] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [selectedCabins, setSelectedCabins] = useState([]);
// //   const [sourceCabinId, setSourceCabinId] = useState("");
// //   const [uniformPrice, setUniformPrice] = useState("5");
// //   const [savingAll, setSavingAll] = useState(false);
// //   const [savingOne, setSavingOne] = useState({});
// //   const [message, setMessage] = useState({ text: "", type: "" });

// //   // Theme-based classes
// //   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
// //   const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
// //   const border = isDark ? "border-slate-800" : "border-slate-200";
// //   const muted = isDark ? "text-slate-400" : "text-slate-500";
// //   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
// //   const metaColor = isDark ? "text-slate-400" : "text-slate-500";

// //   const inputClass = isDark
// //     ? "bg-slate-900 border-slate-700 placeholder:text-slate-500 text-slate-50"
// //     : "bg-white border-slate-300 placeholder:text-slate-400 text-slate-900";

// //   const showMessage = (text, type) => {
// //     setMessage({ text, type });
// //     setTimeout(() => setMessage({ text: "", type: "" }), 3500);
// //   };

// //   const normalizeMinutePricing = (mp) => {
// //     const out = {};
// //     if (!mp || typeof mp !== "object") return out;

// //     Object.entries(mp).forEach(([k, v]) => {
// //       const n = Number(k);
// //       if (!Number.isFinite(n) || n <= 0) return;
// //       if (v === "" || v === undefined || v === null) return;

// //       const p = Number(v);
// //       if (!Number.isFinite(p)) return;
// //       out[n] = p;
// //     });

// //     return out;
// //   };

// //   const ensureDefaultMinutes = (baseMinutePrice, minutePricing) => {
// //     const keys = Object.keys(minutePricing || {})
// //       .map(Number)
// //       .filter((n) => Number.isFinite(n) && n > 0);

// //     if (keys.length > 0) return minutePricing;

// //     const seeded = {};
// //     for (let i = 1; i <= DEFAULT_MINUTES; i++) {
// //       seeded[i] = Number(baseMinutePrice ?? 5);
// //     }
// //     return seeded;
// //   };

// //   const minutesListForCabin = (cabinId) => {
// //     const mp = allPricing[cabinId]?.minutePricing || {};
// //     return Object.keys(mp)
// //       .map(Number)
// //       .filter((n) => Number.isFinite(n) && n > 0)
// //       .sort((a, b) => a - b);
// //   };

// //   const cleanForSave = (pricing) => {
// //     const clean = {};
// //     Object.entries(pricing.minutePricing || {}).forEach(([k, v]) => {
// //       const n = Number(k);
// //       if (!Number.isFinite(n) || n <= 0) return;
// //       if (v === "" || v === undefined || v === null) return;
// //       const p = Number(v);
// //       if (!Number.isFinite(p)) return;
// //       clean[n] = p;
// //     });

// //     const base = pricing.baseMinutePrice === "" ? 5 : Number(pricing.baseMinutePrice ?? 5);
// //     return {
// //       baseMinutePrice: Number.isFinite(base) ? base : 5,
// //       minutePricing: clean,
// //     };
// //   };

// //   const loadCache = () => {
// //     try {
// //       const raw = localStorage.getItem(CACHE_KEY);
// //       if (!raw) return null;
// //       const parsed = JSON.parse(raw);
// //       if (!parsed || typeof parsed !== "object") return null;
// //       return parsed;
// //     } catch {
// //       return null;
// //     }
// //   };

// //   const saveCache = (next) => {
// //     try {
// //       localStorage.setItem(CACHE_KEY, JSON.stringify(next));
// //     } catch {}
// //   };

// //   const fetchCabinsAndPricing = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/api/cabins`);
// //       if (!res.ok) throw new Error("cabins");
// //       const data = await res.json();

// //       const list = Array.isArray(data) ? data : [];
// //       setCabins(list);
// //       setSelectedCabins(list.map((c) => c._id));
// //       setSourceCabinId(list[0]?._id || "");

// //       const pricingObj = {};
// //       for (const cabin of list) {
// //         try {
// //           const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
// //           const p = pres.ok ? await pres.json() : null;

// //           const base = Number(p?.baseMinutePrice ?? 5);
// //           const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || {}));

// //           pricingObj[cabin._id] = {
// //             baseMinutePrice: base,
// //             minutePricing: mp,
// //           };
// //         } catch {
// //           const base = 5;
// //           pricingObj[cabin._id] = {
// //             baseMinutePrice: base,
// //             minutePricing: ensureDefaultMinutes(base, {}),
// //           };
// //         }
// //       }

// //       setAllPricing(pricingObj);
// //       saveCache(pricingObj);
// //     } catch {
// //       showMessage(t(lang, "pricing.message.loadFailed") || "Failed to load pricing", "error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     const cached = loadCache();
// //     if (cached) {
// //       setAllPricing(cached);
// //       setLoading(false);
// //     } else {
// //       setLoading(true);
// //     }

// //     fetchCabinsAndPricing();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [lang]);

// //   const addNextMinute = (cabinId) => {
// //     setAllPricing((prev) => {
// //       const cur = prev[cabinId] || { baseMinutePrice: 5, minutePricing: {} };
// //       const mp = cur.minutePricing || {};
// //       const keys = Object.keys(mp).map(Number).filter(Number.isFinite);
// //       const max = keys.length ? Math.max(...keys) : 0;
// //       const nextMin = max + 1;

// //       if (nextMin > SAFE_MAX_MINUTES) {
// //         showMessage(
// //           `Too many minutes (>${SAFE_MAX_MINUTES}). Increase SAFE_MAX_MINUTES if needed.`,
// //           "error"
// //         );
// //         return prev;
// //       }

// //       const next = {
// //         ...prev,
// //         [cabinId]: {
// //           ...cur,
// //           minutePricing: {
// //             ...mp,
// //             [nextMin]: Number(cur.baseMinutePrice ?? 5),
// //           },
// //         },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const deleteMinute = (cabinId, minute) => {
// //     setAllPricing((prev) => {
// //       const cur = prev[cabinId];
// //       if (!cur) return prev;
// //       const mp = { ...(cur.minutePricing || {}) };
// //       delete mp[minute];

// //       const next = { ...prev, [cabinId]: { ...cur, minutePricing: mp } };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const updatePrice = (cabinId, minute, value) => {
// //     if (value === "" || value === "-" || value === "." || value === "-.") {
// //       setAllPricing((prev) => {
// //         const next = {
// //           ...prev,
// //           [cabinId]: {
// //             ...prev[cabinId],
// //             minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
// //           },
// //         };
// //         saveCache(next);
// //         return next;
// //       });
// //       return;
// //     }

// //     const num = Number(value);
// //     if (!Number.isFinite(num)) return;

// //     setAllPricing((prev) => {
// //       const next = {
// //         ...prev,
// //         [cabinId]: {
// //           ...prev[cabinId],
// //           minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: num },
// //         },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const updateBasePrice = (cabinId, value) => {
// //     const num = value === "" ? "" : Number(value);
// //     if (value !== "" && !Number.isFinite(num)) return;

// //     setAllPricing((prev) => {
// //       const next = {
// //         ...prev,
// //         [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: value === "" ? "" : num },
// //       };
// //       saveCache(next);
// //       return next;
// //     });
// //   };

// //   const toggleCabinSelected = (id) => {
// //     setSelectedCabins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
// //   };

// //   const selectAll = () => setSelectedCabins(cabins.map((c) => c._id));
// //   const selectNone = () => setSelectedCabins([]);

// //   const copyFromSourceToSelected = () => {
// //     if (!sourceCabinId) return;
// //     const source = allPricing[sourceCabinId];
// //     if (!source) return;

// //     setAllPricing((prev) => {
// //       const next = { ...prev };
// //       selectedCabins.forEach((id) => {
// //         if (id === sourceCabinId) return;
// //         next[id] = {
// //           baseMinutePrice: Number(source.baseMinutePrice ?? 5),
// //           minutePricing: { ...(source.minutePricing || {}) },
// //         };
// //       });
// //       saveCache(next);
// //       return next;
// //     });

// //     showMessage(t(lang, "pricing.message.copied") || "Copied", "success");
// //   };

// //   const applySamePriceToSelected = () => {
// //     const p = Number(uniformPrice);
// //     if (!Number.isFinite(p)) {
// //       showMessage(t(lang, "pricing.message.invalidPrice") || "Please enter a valid price", "error");
// //       return;
// //     }

// //     setAllPricing((prev) => {
// //       const next = { ...prev };
// //       selectedCabins.forEach((id) => {
// //         const cur = next[id] || { baseMinutePrice: 5, minutePricing: {} };
// //         const mp = { ...(cur.minutePricing || {}) };

// //         Object.keys(mp).forEach((k) => {
// //           const n = Number(k);
// //           if (Number.isFinite(n) && n > 0) mp[n] = p;
// //         });

// //         const seeded = ensureDefaultMinutes(p, mp);
// //         next[id] = { baseMinutePrice: p, minutePricing: seeded };
// //       });
// //       saveCache(next);
// //       return next;
// //     });

// //     showMessage(t(lang, "pricing.message.appliedSamePrice") || "Applied same price to selected booths", "success");
// //   };

// //   const saveCabin = async (cabinId) => {
// //     setSavingOne((prev) => ({ ...prev, [cabinId]: true }));
// //     try {
// //       const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// //       const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //         return;
// //       }

// //       try {
// //         const pres = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
// //         const p = pres.ok ? await pres.json() : null;

// //         const base = Number(p?.baseMinutePrice ?? payload.baseMinutePrice ?? 5);
// //         const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || payload.minutePricing || {}));

// //         setAllPricing((prev) => {
// //           const next = { ...prev, [cabinId]: { baseMinutePrice: base, minutePricing: mp } };
// //           saveCache(next);
// //           return next;
// //         });
// //       } catch {}

// //       showMessage(t(lang, "pricing.message.saved") || "Saved successfully", "success");
// //     } catch {
// //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //     } finally {
// //       setSavingOne((prev) => ({ ...prev, [cabinId]: false }));
// //     }
// //   };

// //   const saveAll = async () => {
// //     setSavingAll(true);
// //     try {
// //       for (const cabin of cabins) {
// //         const cabinId = cabin._id;
// //         const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

// //         const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });

// //         if (!res.ok) {
// //           showMessage(`${t(lang, "pricing.message.saveFailed")} for ${cabin.code || cabin.name || "booth"}`, "error");
// //           setSavingAll(false);
// //           return;
// //         }
// //       }

// //       showMessage(t(lang, "pricing.message.saved") || "Saved", "success");
// //       await fetchCabinsAndPricing();
// //     } catch {
// //       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
// //     } finally {
// //       setSavingAll(false);
// //     }
// //   };

// //   const maxMinuteAcrossAll = useMemo(() => {
// //     let max = DEFAULT_MINUTES;
// //     cabins.forEach((c) => {
// //       const list = minutesListForCabin(c._id);
// //       if (list.length) max = Math.max(max, list[list.length - 1]);
// //     });
// //     return max;
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [cabins, allPricing]);

// //   const exportToExcel = () => {
// //     if (!cabins.length) return;

// //     const rows = [];
// //     const header = ["Minute", ...cabins.map((c) => (c.code || c.name || "Booth").toString())];
// //     rows.push(header);

// //     for (let min = 1; min <= maxMinuteAcrossAll; min++) {
// //       const row = [min];
// //       cabins.forEach((c) => {
// //         const p = allPricing[c._id] || { baseMinutePrice: 5, minutePricing: {} };
// //         const mp = p.minutePricing || {};
// //         const cell =
// //           mp[min] !== undefined && mp[min] !== ""
// //             ? Number(mp[min])
// //             : Number(p.baseMinutePrice ?? 5);

// //         row.push(Number.isFinite(cell) ? cell : "");
// //       });
// //       rows.push(row);
// //     }

// //     rows.push([
// //       t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
// //       ...cabins.map((c) => {
// //         const bp = Number(allPricing[c._id]?.baseMinutePrice ?? 5);
// //         return Number.isFinite(bp) ? bp : 5;
// //       }),
// //     ]);

// //     const ws = XLSX.utils.aoa_to_sheet(rows);
// //     ws["!cols"] = header.map(() => ({ wch: 20 }));

// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, t(lang, "pricing.excel.sheetName") || "Cabin Pricing");
// //     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

// //     showMessage(t(lang, "pricing.message.exported") || "Exported", "success");
// //   };

// //   const handleImport = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file || !cabins.length) return;

// //     const reader = new FileReader();
// //     reader.onload = (ev) => {
// //       try {
// //         const wb = XLSX.read(ev.target.result, { type: "array" });
// //         const ws = wb.Sheets[wb.SheetNames[0]];
// //         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// //         const nextPricing = {};
// //         cabins.forEach((c) => {
// //           nextPricing[c._id] = {
// //             baseMinutePrice: Number(allPricing[c._id]?.baseMinutePrice ?? 5),
// //             minutePricing: { ...(allPricing[c._id]?.minutePricing || {}) },
// //           };
// //         });

// //         rows.forEach((row, idx) => {
// //           if (!row || row.length < 2) return;
// //           if (idx === 0) return;

// //           const first = row[0];

// //           if (String(first).trim() === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
// //             row.slice(1).forEach((val, cIdx) => {
// //               const cabin = cabins[cIdx];
// //               if (!cabin) return;
// //               if (val === "" || val === undefined || val === null) return;
// //               const p = Number(val);
// //               if (!Number.isFinite(p)) return;
// //               nextPricing[cabin._id].baseMinutePrice = p;
// //             });
// //             return;
// //           }

// //           const minute = Number(first);
// //           if (!Number.isFinite(minute) || minute <= 0) return;

// //           row.slice(1).forEach((val, cIdx) => {
// //             const cabin = cabins[cIdx];
// //             if (!cabin) return;
// //             if (val === "" || val === undefined || val === null) return;
// //             const price = Number(val);
// //             if (!Number.isFinite(price)) return;
// //             nextPricing[cabin._id].minutePricing[minute] = price;
// //           });
// //         });

// //         cabins.forEach((c) => {
// //           const bp = Number(nextPricing[c._id].baseMinutePrice ?? 5);
// //           nextPricing[c._id].minutePricing = ensureDefaultMinutes(bp, normalizeMinutePricing(nextPricing[c._id].minutePricing));
// //         });

// //         setAllPricing((prev) => {
// //           const next = { ...prev, ...nextPricing };
// //           saveCache(next);
// //           return next;
// //         });

// //         showMessage(t(lang, "pricing.message.imported") || "Imported", "success");
// //       } catch {
// //         showMessage(t(lang, "pricing.message.importFailed") || "Import failed", "error");
// //       }
// //     };
// //     reader.readAsArrayBuffer(file);
// //   };

// //   if (loading) {
// //     return (
// //       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
// //         <p className="text-lg font-medium">{t(lang, "pricing.loading") || "Loading..."}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div key={lang} className={`min-h-screen ${bg}`}>
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
// //         {/* Header */}
// //         <div className="text-center">
// //           <p className="text-emerald-500 font-medium tracking-wider text-sm">
// //             {t(lang, "pricing.header.kicker") || "PRICING"}
// //           </p>
// //           <h1 className={`mt-2 text-3xl font-bold ${titleColor}`}>
// //             {t(lang, "pricing.header.title") || "Cabin Pricing"}
// //           </h1>
// //           <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
// //             {t(lang, "pricing.header.subtitle") || "Manage minute-by-minute pricing per booth."}
// //           </p>

// //           <div className="mt-4 flex justify-center">
// //             <button
// //               onClick={fetchCabinsAndPricing}
// //               className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${
// //                 isDark
// //                   ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
// //                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
// //               } transition`}
// //             >
// //               <RefreshCcw className="w-4 h-4" />
// //               <span className="text-sm font-medium">{t(lang, "pricing.bulk.refresh") || "Refresh"}</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Message */}
// //         {message.text && (
// //           <div
// //             className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
// //               message.type === "success"
// //                 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
// //                 : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
// //             }`}
// //           >
// //             <CheckCircle className="w-5 h-5 flex-shrink-0" />
// //             <span className="text-sm">{message.text}</span>
// //           </div>
// //         )}

// //         {/* Bulk Actions */}
// //         <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-4`}>
// //           {/* Booth selector */}
// //           <div className="flex flex-wrap items-center gap-2">
// //             <span className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.selectBoards") || "Select booths:"}</span>

// //             <button
// //               onClick={selectAll}
// //               className={`text-xs px-3 py-1 rounded-full border ${border} ${
// //                 isDark
// //                   ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
// //                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
// //               } transition`}
// //             >
// //               {t(lang, "pricing.bulk.selectAll") || "All"}
// //             </button>

// //             <button
// //               onClick={selectNone}
// //               className={`text-xs px-3 py-1 rounded-full border ${border} ${
// //                 isDark
// //                   ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
// //                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
// //               } transition`}
// //             >
// //               {t(lang, "pricing.bulk.selectNone") || "None"}
// //             </button>

// //             <div className="w-full mt-2 flex flex-wrap gap-2">
// //               {cabins.map((c) => {
// //                 const active = selectedCabins.includes(c._id);

// //                 const buttonClasses = [
// //                   "border px-3 py-1.5 rounded-full text-xs font-medium transition",
// //                   active
// //                     ? isDark
// //                       ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
// //                       : "bg-emerald-100 border-emerald-400 text-emerald-800"
// //                     : isDark
// //                     ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60"
// //                     : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200",
// //                 ].join(" ");

// //                 return (
// //                   <button
// //                     key={c._id}
// //                     onClick={() => toggleCabinSelected(c._id)}
// //                     className={buttonClasses}
// //                   >
// //                     {c.code || c.name || "Booth"}
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
// //             {/* Copy from source */}
// //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
// //               <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.copyFrom") || "Copy from:"}</div>

// //               <select
// //                 value={sourceCabinId}
// //                 onChange={(e) => setSourceCabinId(e.target.value)}
// //                 className={`px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// //               >
// //                 {cabins.map((c) => (
// //                   <option key={c._id} value={c._id}>
// //                     {c.code || c.name || "Booth"}
// //                   </option>
// //                 ))}
// //               </select>

// //               <button
// //                 onClick={copyFromSourceToSelected}
// //                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
// //               >
// //                 <Copy className="w-4 h-4" />
// //                 {t(lang, "pricing.bulk.copyToSelected") || "Copy to selected"}
// //               </button>
// //             </div>

// //             {/* Apply same price */}
// //             <div className="flex flex-col sm:flex-row gap-2 sm:items-center lg:ml-auto">
// //               <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.applySamePrice") || "Apply same price:"}</div>

// //               <div className="flex items-center gap-2">
// //                 <span className="text-sm font-semibold">€</span>
// //                 <input
// //                   type="number"
// //                   step="0.01"
// //                   value={uniformPrice}
// //                   onChange={(e) => setUniformPrice(e.target.value)}
// //                   className={`w-28 px-3 py-2 rounded-lg border text-sm ${inputClass}`}
// //                   placeholder={t(lang, "pricing.bulk.pricePlaceholder") || "Price"}
// //                 />
// //               </div>

// //               <button
// //                 onClick={applySamePriceToSelected}
// //                 className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition"
// //               >
// //                 {t(lang, "pricing.bulk.apply") || "Apply"}
// //               </button>
// //             </div>
// //           </div>

// //           {/* Export/Import + Save All */}
// //           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
// //             <button
// //               onClick={exportToExcel}
// //               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
// //             >
// //               <Download className="w-4 h-4" />
// //               {t(lang, "pricing.bulk.exportExcel") || "Export Excel"}
// //             </button>

// //             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
// //               <Upload className="w-4 h-4" />
// //               {t(lang, "pricing.bulk.importExcel") || "Import Excel"}
// //               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
// //             </label>

// //             <button
// //               onClick={saveAll}
// //               disabled={savingAll}
// //               className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition"
// //             >
// //               {savingAll
// //                 ? t(lang, "pricing.bulk.saving") || "Saving..."
// //                 : t(lang, "pricing.bulk.saveAll") || "Save All"}
// //             </button>
// //           </div>

// //           <div className={`text-xs ${muted}`}>
// //             {t(lang, "pricing.bulk.exportInfo") || "Export includes minutes only up to the highest existing row across booths."}
// //           </div>
// //         </div>

// //         {/* Cabins */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //           {cabins.map((cabin) => {
// //             const p =
// //               allPricing[cabin._id] || {
// //                 baseMinutePrice: 5,
// //                 minutePricing: ensureDefaultMinutes(5, {}),
// //               };

// //             const minutes = minutesListForCabin(cabin._id);

// //             return (
// //               <div
// //                 key={cabin._id}
// //                 className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}
// //               >
// //                 {/* Header */}
// //                 <div className="flex items-start justify-between gap-4">
// //                   <div>
// //                     <h3 className={`text-xl font-bold ${titleColor}`}>
// //                       {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
// //                     </h3>
// //                     <p className={`text-sm ${metaColor}`}>
// //                       {cabin.category || cabin.deviceType || "Booth"}
// //                     </p>

// //                     <p className="mt-1 text-xs text-emerald-400">
// //                       {minutes.length} {t(lang, "pricing.cabin.minuteRows") || "minute rows"}
// //                     </p>
// //                   </div>

// //                   <div className="text-right space-y-2">
// //                     <div>
// //                       <p className={`text-xs ${metaColor}`}>{t(lang, "pricing.cabin.basePrice") || "Base Price"}</p>
// //                       <div className="flex items-center gap-2 mt-1 justify-end">
// //                         <span className="text-sm font-semibold">€</span>
// //                         <input
// //                           type="number"
// //                           step="0.01"
// //                           value={p.baseMinutePrice}
// //                           onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
// //                           className={`w-24 px-3 py-2 rounded-lg border text-sm font-medium ${inputClass}`}
// //                           placeholder={t(lang, "pricing.cabin.pricePlaceholder") || "Price"}
// //                         />
// //                         <span className="text-sm font-medium">/min</span>
// //                       </div>
// //                     </div>

// //                     <button
// //                       onClick={() => saveCabin(cabin._id)}
// //                       disabled={!!savingOne[cabin._id]}
// //                       className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
// //                     >
// //                       {savingOne[cabin._id] ? (t(lang, "pricing.cabin.saving") || "Saving...") : (t(lang, "pricing.cabin.save") || "Save")}
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Minute Rows */}
// //                 <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
// //                   {minutes.map((min) => {
// //                     const val = p.minutePricing?.[min];
// //                     const showVal = val === "" || val === undefined ? "" : Number(val);

// //                     const rowClass =
// //                       min > DEFAULT_MINUTES
// //                         ? isDark
// //                           ? "border-emerald-500/50 bg-emerald-500/10"
// //                           : "border-emerald-300 bg-emerald-50"
// //                         : isDark
// //                         ? "bg-slate-900/40 border-slate-800"
// //                         : "bg-slate-50 border-slate-200";

// //                     return (
// //                       <div
// //                         key={min}
// //                         className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition ${rowClass}`}
// //                       >
// //                         <div className="flex items-center gap-3 flex-1 min-w-0">
// //                           <span className={`text-sm font-semibold whitespace-nowrap ${titleColor}`}>
// //                             {min} {t(lang, "pricing.cabin.min") || "min"}
// //                           </span>

// //                           <div className="flex items-center gap-2">
// //                             <span className="text-sm font-semibold">€</span>
// //                             <input
// //                               type="number"
// //                               step="0.01"
// //                               value={showVal === "" ? "" : showVal}
// //                               onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
// //                               placeholder={Number(p.baseMinutePrice ?? 5).toFixed(2)}
// //                               className={`w-28 px-3 py-1.5 rounded border text-sm font-medium ${inputClass}`}
// //                             />
// //                           </div>
// //                         </div>

// //                         <button
// //                           onClick={() => deleteMinute(cabin._id, min)}
// //                           className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
// //                           title={t(lang, "pricing.cabin.delete") || "Delete"}
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>

// //                 {/* Add New Minute Button */}
// //                 <div className="pt-2">
// //                   <button
// //                     onClick={() => addNextMinute(cabin._id)}
// //                     className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-300 hover:bg-emerald-500/10 font-semibold transition flex items-center justify-center gap-2"
// //                   >
// //                     <Plus className="w-5 h-5" />
// //                     {t(lang, "pricing.cabin.addNextMinute") || "New (add next minute)"}
// //                   </button>
// //                 </div>

// //                 <div className={`text-[11px] ${metaColor}`}>
// //                   {t(lang, "pricing.cabin.exportInfo") || "Tip: Export will include up to"} <b>{maxMinuteAcrossAll}</b> {t(lang, "pricing.cabin.minutes") || "minutes"}.
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default CabinPricing;


// import React, { useEffect, useMemo, useState } from "react";
// import { Trash2, Upload, Download, Copy, CheckCircle, Plus, RefreshCcw } from "lucide-react";
// import * as XLSX from "xlsx";
// import { t } from "../i18n";
// import { useLanguage } from "../context/LanguageContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-two-orpin-12.vercel.app";

// const DEFAULT_MINUTES = 25;
// const SAFE_MAX_MINUTES = 20000;

// const CACHE_KEY = "aios:cabinPricing:v1";

// function CabinPricing({ theme }) {
//   const isDark = theme === "dark";
//   const { language } = useLanguage();
//   const lang = language || "en";

//   const [cabins, setCabins] = useState([]);
//   const [allPricing, setAllPricing] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedCabins, setSelectedCabins] = useState([]);
//   const [sourceCabinId, setSourceCabinId] = useState("");
//   const [uniformPrice, setUniformPrice] = useState("5");
//   const [savingAll, setSavingAll] = useState(false);
//   const [savingOne, setSavingOne] = useState({});
//   const [message, setMessage] = useState({ text: "", type: "" });

//   // Theme-based classes
//   const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
//   const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
//   const border = isDark ? "border-slate-800" : "border-slate-200";
//   const muted = isDark ? "text-slate-400" : "text-slate-500";
//   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
//   const metaColor = isDark ? "text-slate-400" : "text-slate-500";

//   const inputClass = isDark
//     ? "bg-slate-900 border-slate-700 placeholder:text-slate-500 text-slate-50"
//     : "bg-white border-slate-300 placeholder:text-slate-400 text-slate-900";

//   const showMessage = (text, type) => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: "", type: "" }), 3500);
//   };

//   // Helper function to validate and format price input
//   const formatPriceInput = (value) => {
//     // Allow empty string
//     if (value === "") return "";

//     // Remove any spaces
//     let cleaned = value.replace(/\s/g, '');

//     // Allow only digits, comma, period, and minus sign at the start
//     const regex = /^-?[\d,.]*$/;
//     if (!regex.test(cleaned)) {
//       return null; // Invalid input
//     }

//     // Replace comma with period for internal processing but keep display as user typed
//     return cleaned;
//   };

//   // Helper function to parse price input (comma or period)
//   const parsePriceInput = (value) => {
//     if (value === "" || value === "-" || value === "." || value === "-." || value === "," || value === "-,") {
//       return "";
//     }

//     // Replace comma with period for parsing
//     const normalized = value.replace(/,/g, '.');

//     // Handle multiple decimal points
//     const parts = normalized.split('.');
//     if (parts.length > 2) {
//       // If more than one decimal point, keep only the first one
//       const main = parts.shift();
//       const decimal = parts.join('');
//       return `${main}.${decimal}`;
//     }

//     return normalized;
//   };

//   const normalizeMinutePricing = (mp) => {
//     const out = {};
//     if (!mp || typeof mp !== "object") return out;

//     Object.entries(mp).forEach(([k, v]) => {
//       const n = Number(k);
//       if (!Number.isFinite(n) || n <= 0) return;
//       if (v === "" || v === undefined || v === null) return;

//       const p = Number(v);
//       if (!Number.isFinite(p)) return;
//       out[n] = p;
//     });

//     return out;
//   };

//   const ensureDefaultMinutes = (baseMinutePrice, minutePricing) => {
//     const keys = Object.keys(minutePricing || {})
//       .map(Number)
//       .filter((n) => Number.isFinite(n) && n > 0);

//     if (keys.length > 0) return minutePricing;

//     const seeded = {};
//     for (let i = 1; i <= DEFAULT_MINUTES; i++) {
//       seeded[i] = Number(baseMinutePrice ?? 5);
//     }
//     return seeded;
//   };

//   const minutesListForCabin = (cabinId) => {
//     const mp = allPricing[cabinId]?.minutePricing || {};
//     return Object.keys(mp)
//       .map(Number)
//       .filter((n) => Number.isFinite(n) && n > 0)
//       .sort((a, b) => a - b);
//   };

//   const cleanForSave = (pricing) => {
//     const clean = {};
//     Object.entries(pricing.minutePricing || {}).forEach(([k, v]) => {
//       const n = Number(k);
//       if (!Number.isFinite(n) || n <= 0) return;
//       if (v === "" || v === undefined || v === null) return;
//       const p = Number(v);
//       if (!Number.isFinite(p)) return;
//       clean[n] = p;
//     });

//     const base = pricing.baseMinutePrice === "" ? 5 : Number(pricing.baseMinutePrice ?? 5);
//     return {
//       baseMinutePrice: Number.isFinite(base) ? base : 5,
//       minutePricing: clean,
//     };
//   };

//   const loadCache = () => {
//     try {
//       const raw = localStorage.getItem(CACHE_KEY);
//       if (!raw) return null;
//       const parsed = JSON.parse(raw);
//       if (!parsed || typeof parsed !== "object") return null;
//       return parsed;
//     } catch {
//       return null;
//     }
//   };

//   const saveCache = (next) => {
//     try {
//       localStorage.setItem(CACHE_KEY, JSON.stringify(next));
//     } catch {}
//   };

//   const fetchCabinsAndPricing = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/cabins`);
//       if (!res.ok) throw new Error("cabins");
//       const data = await res.json();

//       const list = Array.isArray(data) ? data : [];
//       setCabins(list);
//       setSelectedCabins(list.map((c) => c._id));
//       setSourceCabinId(list[0]?._id || "");

//       const pricingObj = {};
//       for (const cabin of list) {
//         try {
//           const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
//           const p = pres.ok ? await pres.json() : null;

//           const base = Number(p?.baseMinutePrice ?? 5);
//           const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || {}));

//           pricingObj[cabin._id] = {
//             baseMinutePrice: base,
//             minutePricing: mp,
//           };
//         } catch {
//           const base = 5;
//           pricingObj[cabin._id] = {
//             baseMinutePrice: base,
//             minutePricing: ensureDefaultMinutes(base, {}),
//           };
//         }
//       }

//       setAllPricing(pricingObj);
//       saveCache(pricingObj);
//     } catch {
//       showMessage(t(lang, "pricing.message.loadFailed") || "Failed to load pricing", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const cached = loadCache();
//     if (cached) {
//       setAllPricing(cached);
//       setLoading(false);
//     } else {
//       setLoading(true);
//     }

//     fetchCabinsAndPricing();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lang]);

//   const addNextMinute = (cabinId) => {
//     setAllPricing((prev) => {
//       const cur = prev[cabinId] || { baseMinutePrice: 5, minutePricing: {} };
//       const mp = cur.minutePricing || {};
//       const keys = Object.keys(mp).map(Number).filter(Number.isFinite);
//       const max = keys.length ? Math.max(...keys) : 0;
//       const nextMin = max + 1;

//       if (nextMin > SAFE_MAX_MINUTES) {
//         showMessage(
//           `Too many minutes (>${SAFE_MAX_MINUTES}). Increase SAFE_MAX_MINUTES if needed.`,
//           "error"
//         );
//         return prev;
//       }

//       const next = {
//         ...prev,
//         [cabinId]: {
//           ...cur,
//           minutePricing: {
//             ...mp,
//             [nextMin]: Number(cur.baseMinutePrice ?? 5),
//           },
//         },
//       };
//       saveCache(next);
//       return next;
//     });
//   };

//   const deleteMinute = (cabinId, minute) => {
//     setAllPricing((prev) => {
//       const cur = prev[cabinId];
//       if (!cur) return prev;
//       const mp = { ...(cur.minutePricing || {}) };
//       delete mp[minute];

//       const next = { ...prev, [cabinId]: { ...cur, minutePricing: mp } };
//       saveCache(next);
//       return next;
//     });
//   };

//   const updatePrice = (cabinId, minute, value) => {
//     // First format/validate the input
//     const formatted = formatPriceInput(value);
//     if (formatted === null) {
//       // Invalid input, don't update
//       return;
//     }

//     if (formatted === "" || formatted === "-" || formatted === "." || formatted === "-." || formatted === "," || formatted === "-,") {
//       setAllPricing((prev) => {
//         const next = {
//           ...prev,
//           [cabinId]: {
//             ...prev[cabinId],
//             minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
//           },
//         };
//         saveCache(next);
//         return next;
//       });
//       return;
//     }

//     // Parse the value (handle comma as decimal separator)
//     const parsed = parsePriceInput(formatted);
//     if (parsed === "") {
//       setAllPricing((prev) => {
//         const next = {
//           ...prev,
//           [cabinId]: {
//             ...prev[cabinId],
//             minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
//           },
//         };
//         saveCache(next);
//         return next;
//       });
//       return;
//     }

//     const num = Number(parsed);
//     if (!Number.isFinite(num)) return;

//     setAllPricing((prev) => {
//       const next = {
//         ...prev,
//         [cabinId]: {
//           ...prev[cabinId],
//           minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: num },
//         },
//       };
//       saveCache(next);
//       return next;
//     });
//   };

//   const updateBasePrice = (cabinId, value) => {
//     // First format/validate the input
//     const formatted = formatPriceInput(value);
//     if (formatted === null) {
//       // Invalid input, don't update
//       return;
//     }

//     if (formatted === "" || formatted === "-" || formatted === "." || formatted === "-." || formatted === "," || formatted === "-,") {
//       setAllPricing((prev) => {
//         const next = {
//           ...prev,
//           [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: "" },
//         };
//         saveCache(next);
//         return next;
//       });
//       return;
//     }

//     // Parse the value (handle comma as decimal separator)
//     const parsed = parsePriceInput(formatted);
//     if (parsed === "") {
//       setAllPricing((prev) => {
//         const next = {
//           ...prev,
//           [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: "" },
//         };
//         saveCache(next);
//         return next;
//       });
//       return;
//     }

//     const num = Number(parsed);
//     if (!Number.isFinite(num)) return;

//     setAllPricing((prev) => {
//       const next = {
//         ...prev,
//         [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: num },
//       };
//       saveCache(next);
//       return next;
//     });
//   };

//   const updateUniformPrice = (value) => {
//     // First format/validate the input
//     const formatted = formatPriceInput(value);
//     if (formatted === null) {
//       // Invalid input, don't update
//       return;
//     }

//     setUniformPrice(formatted);
//   };

//   const toggleCabinSelected = (id) => {
//     setSelectedCabins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
//   };

//   const selectAll = () => setSelectedCabins(cabins.map((c) => c._id));
//   const selectNone = () => setSelectedCabins([]);

//   const copyFromSourceToSelected = () => {
//     if (!sourceCabinId) return;
//     const source = allPricing[sourceCabinId];
//     if (!source) return;

//     setAllPricing((prev) => {
//       const next = { ...prev };
//       selectedCabins.forEach((id) => {
//         if (id === sourceCabinId) return;
//         next[id] = {
//           baseMinutePrice: Number(source.baseMinutePrice ?? 5),
//           minutePricing: { ...(source.minutePricing || {}) },
//         };
//       });
//       saveCache(next);
//       return next;
//     });

//     showMessage(t(lang, "pricing.message.copied") || "Copied", "success");
//   };

//   const applySamePriceToSelected = () => {
//     // Parse the uniform price (handle comma as decimal separator)
//     const parsed = parsePriceInput(uniformPrice);
//     if (parsed === "") {
//       showMessage(t(lang, "pricing.message.invalidPrice") || "Please enter a valid price", "error");
//       return;
//     }

//     const p = Number(parsed);
//     if (!Number.isFinite(p)) {
//       showMessage(t(lang, "pricing.message.invalidPrice") || "Please enter a valid price", "error");
//       return;
//     }

//     setAllPricing((prev) => {
//       const next = { ...prev };
//       selectedCabins.forEach((id) => {
//         const cur = next[id] || { baseMinutePrice: 5, minutePricing: {} };
//         const mp = { ...(cur.minutePricing || {}) };

//         Object.keys(mp).forEach((k) => {
//           const n = Number(k);
//           if (Number.isFinite(n) && n > 0) mp[n] = p;
//         });

//         const seeded = ensureDefaultMinutes(p, mp);
//         next[id] = { baseMinutePrice: p, minutePricing: seeded };
//       });
//       saveCache(next);
//       return next;
//     });

//     showMessage(t(lang, "pricing.message.appliedSamePrice") || "Applied same price to selected booths", "success");
//   };

//   const saveCabin = async (cabinId) => {
//     setSavingOne((prev) => ({ ...prev, [cabinId]: true }));
//     try {
//       const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

//       const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
//         return;
//       }

//       try {
//         const pres = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
//         const p = pres.ok ? await pres.json() : null;

//         const base = Number(p?.baseMinutePrice ?? payload.baseMinutePrice ?? 5);
//         const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || payload.minutePricing || {}));

//         setAllPricing((prev) => {
//           const next = { ...prev, [cabinId]: { baseMinutePrice: base, minutePricing: mp } };
//           saveCache(next);
//           return next;
//         });
//       } catch {}

//       showMessage(t(lang, "pricing.message.saved") || "Saved successfully", "success");
//     } catch {
//       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
//     } finally {
//       setSavingOne((prev) => ({ ...prev, [cabinId]: false }));
//     }
//   };

//   const saveAll = async () => {
//     setSavingAll(true);
//     try {
//       for (const cabin of cabins) {
//         const cabinId = cabin._id;
//         const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

//         const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         if (!res.ok) {
//           showMessage(`${t(lang, "pricing.message.saveFailed")} for ${cabin.code || cabin.name || "booth"}`, "error");
//           setSavingAll(false);
//           return;
//         }
//       }

//       showMessage(t(lang, "pricing.message.saved") || "Saved", "success");
//       await fetchCabinsAndPricing();
//     } catch {
//       showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
//     } finally {
//       setSavingAll(false);
//     }
//   };

//   const maxMinuteAcrossAll = useMemo(() => {
//     let max = DEFAULT_MINUTES;
//     cabins.forEach((c) => {
//       const list = minutesListForCabin(c._id);
//       if (list.length) max = Math.max(max, list[list.length - 1]);
//     });
//     return max;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [cabins, allPricing]);

//   const exportToExcel = () => {
//     if (!cabins.length) return;

//     const rows = [];
//     const header = ["Minute", ...cabins.map((c) => (c.code || c.name || "Booth").toString())];
//     rows.push(header);

//     for (let min = 1; min <= maxMinuteAcrossAll; min++) {
//       const row = [min];
//       cabins.forEach((c) => {
//         const p = allPricing[c._id] || { baseMinutePrice: 5, minutePricing: {} };
//         const mp = p.minutePricing || {};
//         const cell =
//           mp[min] !== undefined && mp[min] !== ""
//             ? Number(mp[min])
//             : Number(p.baseMinutePrice ?? 5);

//         row.push(Number.isFinite(cell) ? cell : "");
//       });
//       rows.push(row);
//     }

//     rows.push([
//       t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
//       ...cabins.map((c) => {
//         const bp = Number(allPricing[c._id]?.baseMinutePrice ?? 5);
//         return Number.isFinite(bp) ? bp : 5;
//       }),
//     ]);

//     const ws = XLSX.utils.aoa_to_sheet(rows);
//     ws["!cols"] = header.map(() => ({ wch: 20 }));

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, t(lang, "pricing.excel.sheetName") || "Cabin Pricing");
//     XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

//     showMessage(t(lang, "pricing.message.exported") || "Exported", "success");
//   };

//   const handleImport = (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !cabins.length) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => {
//       try {
//         const wb = XLSX.read(ev.target.result, { type: "array" });
//         const ws = wb.Sheets[wb.SheetNames[0]];
//         const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

//         const nextPricing = {};
//         cabins.forEach((c) => {
//           nextPricing[c._id] = {
//             baseMinutePrice: Number(allPricing[c._id]?.baseMinutePrice ?? 5),
//             minutePricing: { ...(allPricing[c._id]?.minutePricing || {}) },
//           };
//         });

//         rows.forEach((row, idx) => {
//           if (!row || row.length < 2) return;
//           if (idx === 0) return;

//           const first = row[0];

//           if (String(first).trim() === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
//             row.slice(1).forEach((val, cIdx) => {
//               const cabin = cabins[cIdx];
//               if (!cabin) return;
//               if (val === "" || val === undefined || val === null) return;
//               const p = Number(val);
//               if (!Number.isFinite(p)) return;
//               nextPricing[cabin._id].baseMinutePrice = p;
//             });
//             return;
//           }

//           const minute = Number(first);
//           if (!Number.isFinite(minute) || minute <= 0) return;

//           row.slice(1).forEach((val, cIdx) => {
//             const cabin = cabins[cIdx];
//             if (!cabin) return;
//             if (val === "" || val === undefined || val === null) return;
//             const price = Number(val);
//             if (!Number.isFinite(price)) return;
//             nextPricing[cabin._id].minutePricing[minute] = price;
//           });
//         });

//         cabins.forEach((c) => {
//           const bp = Number(nextPricing[c._id].baseMinutePrice ?? 5);
//           nextPricing[c._id].minutePricing = ensureDefaultMinutes(bp, normalizeMinutePricing(nextPricing[c._id].minutePricing));
//         });

//         setAllPricing((prev) => {
//           const next = { ...prev, ...nextPricing };
//           saveCache(next);
//           return next;
//         });

//         showMessage(t(lang, "pricing.message.imported") || "Imported", "success");
//       } catch {
//         showMessage(t(lang, "pricing.message.importFailed") || "Import failed", "error");
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   // Format display value for inputs (show comma if needed)
//   const formatDisplayValue = (value) => {
//     if (value === "" || value === undefined || value === null) return "";

//     const num = Number(value);
//     if (!Number.isFinite(num)) return "";

//     // For German locale, use comma as decimal separator
//     if (lang === "de") {
//       return num.toLocaleString('de-DE', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//       });
//     }

//     // For other locales, use period
//     return num.toString();
//   };

//   if (loading) {
//     return (
//       <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
//         <p className="text-lg font-medium">{t(lang, "pricing.loading") || "Loading..."}</p>
//       </div>
//     );
//   }

//   return (
//     <div key={lang} className={`min-h-screen ${bg}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <p className="text-emerald-500 font-medium tracking-wider text-sm">
//             {t(lang, "pricing.header.kicker") || "PRICING"}
//           </p>
//           <h1 className={`mt-2 text-3xl font-bold ${titleColor}`}>
//             {t(lang, "pricing.header.title") || "Cabin Pricing"}
//           </h1>
//           <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
//             {t(lang, "pricing.header.subtitle") || "Manage minute-by-minute pricing per booth."}
//           </p>

//           <div className="mt-4 flex justify-center">
//             <button
//               onClick={fetchCabinsAndPricing}
//               className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${
//                 isDark
//                   ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
//                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//               } transition`}
//             >
//               <RefreshCcw className="w-4 h-4" />
//               <span className="text-sm font-medium">{t(lang, "pricing.bulk.refresh") || "Refresh"}</span>
//             </button>
//           </div>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${
//               message.type === "success"
//                 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
//                 : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
//             }`}
//           >
//             <CheckCircle className="w-5 h-5 flex-shrink-0" />
//             <span className="text-sm">{message.text}</span>
//           </div>
//         )}

//         {/* Bulk Actions */}
//         <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-4`}>
//           {/* Booth selector */}
//           <div className="flex flex-wrap items-center gap-2">
//             <span className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.selectBoards") || "Select booths:"}</span>

//             <button
//               onClick={selectAll}
//               className={`text-xs px-3 py-1 rounded-full border ${border} ${
//                 isDark
//                   ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
//                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//               } transition`}
//             >
//               {t(lang, "pricing.bulk.selectAll") || "All"}
//             </button>

//             <button
//               onClick={selectNone}
//               className={`text-xs px-3 py-1 rounded-full border ${border} ${
//                 isDark
//                   ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
//                   : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//               } transition`}
//             >
//               {t(lang, "pricing.bulk.selectNone") || "None"}
//             </button>

//             <div className="w-full mt-2 flex flex-wrap gap-2">
//               {cabins.map((c) => {
//                 const active = selectedCabins.includes(c._id);

//                 const buttonClasses = [
//                   "border px-3 py-1.5 rounded-full text-xs font-medium transition",
//                   active
//                     ? isDark
//                       ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
//                       : "bg-emerald-100 border-emerald-400 text-emerald-800"
//                     : isDark
//                     ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60"
//                     : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200",
//                 ].join(" ");

//                 return (
//                   <button
//                     key={c._id}
//                     onClick={() => toggleCabinSelected(c._id)}
//                     className={buttonClasses}
//                   >
//                     {c.code || c.name || "Booth"}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
//             {/* Copy from source */}
//             <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
//               <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.copyFrom") || "Copy from:"}</div>

//               <select
//                 value={sourceCabinId}
//                 onChange={(e) => setSourceCabinId(e.target.value)}
//                 className={`px-3 py-2 rounded-lg border text-sm ${inputClass}`}
//               >
//                 {cabins.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.code || c.name || "Booth"}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 onClick={copyFromSourceToSelected}
//                 className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
//               >
//                 <Copy className="w-4 h-4" />
//                 {t(lang, "pricing.bulk.copyToSelected") || "Copy to selected"}
//               </button>
//             </div>

//             {/* Apply same price */}
//             <div className="flex flex-col sm:flex-row gap-2 sm:items-center lg:ml-auto">
//               <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.applySamePrice") || "Apply same price:"}</div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-semibold">€</span>
//                 <input
//                   type="text"
//                   inputMode="decimal"
//                   value={uniformPrice}
//                   onChange={(e) => updateUniformPrice(e.target.value)}
//                   className={`w-28 px-3 py-2 rounded-lg border text-sm ${inputClass}`}
//                   placeholder={lang === "de" ? "5,00" : "5.00"}
//                 />
//               </div>

//               <button
//                 onClick={applySamePriceToSelected}
//                 className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition"
//               >
//                 {t(lang, "pricing.bulk.apply") || "Apply"}
//               </button>
//             </div>
//           </div>

//           {/* Export/Import + Save All */}
//           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
//             <button
//               onClick={exportToExcel}
//               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
//             >
//               <Download className="w-4 h-4" />
//               {t(lang, "pricing.bulk.exportExcel") || "Export Excel"}
//             </button>

//             <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
//               <Upload className="w-4 h-4" />
//               {t(lang, "pricing.bulk.importExcel") || "Import Excel"}
//               <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
//             </label>

//             <button
//               onClick={saveAll}
//               disabled={savingAll}
//               className="w-full sm:w-auto sm:ml-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition"
//             >
//               {savingAll
//                 ? t(lang, "pricing.bulk.saving") || "Saving..."
//                 : t(lang, "pricing.bulk.saveAll") || "Save All"}
//             </button>
//           </div>

//           <div className={`text-xs ${muted}`}>
//             {t(lang, "pricing.bulk.exportInfo") || "Export includes minutes only up to the highest existing row across booths."}
//           </div>
//         </div>

//         {/* Cabins */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {cabins.map((cabin) => {
//             const p =
//               allPricing[cabin._id] || {
//                 baseMinutePrice: 5,
//                 minutePricing: ensureDefaultMinutes(5, {}),
//               };

//             const minutes = minutesListForCabin(cabin._id);

//             return (
//               <div
//                 key={cabin._id}
//                 className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}
//               >
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <h3 className={`text-xl font-bold ${titleColor}`}>
//                       {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
//                     </h3>
//                     <p className={`text-sm ${metaColor}`}>
//                       {cabin.category || cabin.deviceType || "Booth"}
//                     </p>

//                     <p className="mt-1 text-xs text-emerald-400">
//                       {minutes.length} {t(lang, "pricing.cabin.minuteRows") || "minute rows"}
//                     </p>
//                   </div>

//                   <div className="text-right space-y-2">
//                     <div>
//                       <p className={`text-xs ${metaColor}`}>{t(lang, "pricing.cabin.basePrice") || "Base Price"}</p>
//                       <div className="flex items-center gap-2 mt-1 justify-end">
//                         <span className="text-sm font-semibold">€</span>
//                         <input
//                           type="text"
//                           inputMode="decimal"
//                           value={formatDisplayValue(p.baseMinutePrice)}
//                           onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
//                           className={`w-24 px-3 py-2 rounded-lg border text-sm font-medium ${inputClass}`}
//                           placeholder={lang === "de" ? "5,00" : "5.00"}
//                         />
//                         <span className="text-sm font-medium">/min</span>
//                       </div>
//                     </div>

//                     <button
//                       onClick={() => saveCabin(cabin._id)}
//                       disabled={!!savingOne[cabin._id]}
//                       className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
//                     >
//                       {savingOne[cabin._id] ? (t(lang, "pricing.cabin.saving") || "Saving...") : (t(lang, "pricing.cabin.save") || "Save")}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Minute Rows */}
//                 <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
//                   {minutes.map((min) => {
//                     const val = p.minutePricing?.[min];
//                     const showVal = val === "" || val === undefined ? "" : Number(val);

//                     const rowClass =
//                       min > DEFAULT_MINUTES
//                         ? isDark
//                           ? "border-emerald-500/50 bg-emerald-500/10"
//                           : "border-emerald-300 bg-emerald-50"
//                         : isDark
//                         ? "bg-slate-900/40 border-slate-800"
//                         : "bg-slate-50 border-slate-200";

//                     return (
//                       <div
//                         key={min}
//                         className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition ${rowClass}`}
//                       >
//                         <div className="flex items-center gap-3 flex-1 min-w-0">
//                           <span className={`text-sm font-semibold whitespace-nowrap ${titleColor}`}>
//                             {min} {t(lang, "pricing.cabin.min") || "min"}
//                           </span>

//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-semibold">€</span>
//                             <input
//                               type="text"
//                               inputMode="decimal"
//                               value={showVal === "" ? "" : formatDisplayValue(showVal)}
//                               onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
//                               placeholder={formatDisplayValue(p.baseMinutePrice)}
//                               className={`w-28 px-3 py-1.5 rounded border text-sm font-medium ${inputClass}`}
//                             />
//                           </div>
//                         </div>

//                         <button
//                           onClick={() => deleteMinute(cabin._id, min)}
//                           className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
//                           title={t(lang, "pricing.cabin.delete") || "Delete"}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Add New Minute Button */}
//                 <div className="pt-2">
//                   <button
//                     onClick={() => addNextMinute(cabin._id)}
//                     className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-300 hover:bg-emerald-500/10 font-semibold transition flex items-center justify-center gap-2"
//                   >
//                     <Plus className="w-5 h-5" />
//                     {t(lang, "pricing.cabin.addNextMinute") || "New (add next minute)"}
//                   </button>
//                 </div>

//                 <div className={`text-[11px] ${metaColor}`}>
//                   {t(lang, "pricing.cabin.exportInfo") || "Tip: Export will include up to"} <b>{maxMinuteAcrossAll}</b> {t(lang, "pricing.cabin.minutes") || "minutes"}.
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CabinPricing;










import React, { useEffect, useMemo, useState } from "react";
import { Trash2, Upload, Download, Copy, CheckCircle, Plus, RefreshCcw } from "lucide-react";
import * as XLSX from "xlsx";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = "https://backend-two-orpin-12.vercel.app";

const DEFAULT_MINUTES = 25;
const SAFE_MAX_MINUTES = 20000;

const CACHE_KEY = "aios:cabinPricing:v1";

function CabinPricing({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [cabins, setCabins] = useState([]);
  const [allPricing, setAllPricing] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCabins, setSelectedCabins] = useState([]);
  const [sourceCabinId, setSourceCabinId] = useState("");
  const [uniformPrice, setUniformPrice] = useState("5");
  const [savingAll, setSavingAll] = useState(false);
  const [savingOne, setSavingOne] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  // Theme-based classes
  const bg = isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900";
  const cardBg = isDark ? "bg-slate-900/60" : "bg-white";
  const border = isDark ? "border-slate-800" : "border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const titleColor = isDark ? "text-slate-50" : "text-slate-900";
  const metaColor = isDark ? "text-slate-400" : "text-slate-500";

  const inputClass = isDark
    ? "bg-slate-900 border-slate-700 placeholder:text-slate-500 text-slate-50"
    : "bg-white border-slate-300 placeholder:text-slate-400 text-slate-900";

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  // NEW: Simplified helper function that allows all valid price inputs including deletion
  const formatPriceInput = (value) => {
    // Allow empty string for clearing
    if (value === "") return "";

    // Remove any spaces
    let cleaned = value.replace(/\s/g, '');

    // Allow digits, comma, period, and minus sign at the start
    // Also allow empty string after deleting all characters
    const regex = /^-?[\d,.-]*$/;
    if (!regex.test(cleaned)) {
      return null; // Invalid input
    }

    // Don't replace comma with period here - let parsePriceInput handle it
    return cleaned;
  };

  // NEW: Improved parsePriceInput function
  const parsePriceInput = (value) => {
    if (value === "" || value === "-" || value === "." || value === "-." || value === "," || value === "-,") {
      return "";
    }

    // Replace comma with period for parsing
    const normalized = value.replace(/,/g, '.');

    // Handle multiple decimal points
    const parts = normalized.split('.');
    if (parts.length > 2) {
      // If more than one decimal point, keep only the first one
      const main = parts.shift();
      const decimal = parts.join('');
      return `${main}.${decimal}`;
    }

    return normalized;
  };

  const normalizeMinutePricing = (mp) => {
    const out = {};
    if (!mp || typeof mp !== "object") return out;

    Object.entries(mp).forEach(([k, v]) => {
      const n = Number(k);
      if (!Number.isFinite(n) || n <= 0) return;
      if (v === "" || v === undefined || v === null) return;

      const p = Number(v);
      if (!Number.isFinite(p)) return;
      out[n] = p;
    });

    return out;
  };

  const ensureDefaultMinutes = (baseMinutePrice, minutePricing) => {
    const keys = Object.keys(minutePricing || {})
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0);

    if (keys.length > 0) return minutePricing;

    const seeded = {};
    for (let i = 1; i <= DEFAULT_MINUTES; i++) {
      seeded[i] = Number(baseMinutePrice ?? 5);
    }
    return seeded;
  };

  const minutesListForCabin = (cabinId) => {
    const mp = allPricing[cabinId]?.minutePricing || {};
    return Object.keys(mp)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b);
  };

  const cleanForSave = (pricing) => {
    const clean = {};
    Object.entries(pricing.minutePricing || {}).forEach(([k, v]) => {
      const n = Number(k);
      if (!Number.isFinite(n) || n <= 0) return;
      if (v === "" || v === undefined || v === null) return;
      const p = Number(v);
      if (!Number.isFinite(p)) return;
      clean[n] = p;
    });

    const base = pricing.baseMinutePrice === "" ? 5 : Number(pricing.baseMinutePrice ?? 5);
    return {
      baseMinutePrice: Number.isFinite(base) ? base : 5,
      minutePricing: clean,
    };
  };

  const loadCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const saveCache = (next) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch { }
  };

  const fetchCabinsAndPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/cabins`);
      if (!res.ok) throw new Error("cabins");
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];
      setCabins(list);
      setSelectedCabins(list.map((c) => c._id));
      setSourceCabinId(list[0]?._id || "");

      const pricingObj = {};
      for (const cabin of list) {
        try {
          const pres = await fetch(`${API_BASE}/api/cabins/${cabin._id}/pricing`);
          const p = pres.ok ? await pres.json() : null;

          const base = Number(p?.baseMinutePrice ?? 5);
          const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || {}));

          pricingObj[cabin._id] = {
            baseMinutePrice: base,
            minutePricing: mp,
          };
        } catch {
          const base = 5;
          pricingObj[cabin._id] = {
            baseMinutePrice: base,
            minutePricing: ensureDefaultMinutes(base, {}),
          };
        }
      }

      setAllPricing(pricingObj);
      saveCache(pricingObj);
    } catch {
      showMessage(t(lang, "pricing.message.loadFailed") || "Failed to load pricing", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setAllPricing(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }

    fetchCabinsAndPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const addNextMinute = (cabinId) => {
    setAllPricing((prev) => {
      const cur = prev[cabinId] || { baseMinutePrice: 5, minutePricing: {} };
      const mp = cur.minutePricing || {};
      const keys = Object.keys(mp).map(Number).filter(Number.isFinite);
      const max = keys.length ? Math.max(...keys) : 0;
      const nextMin = max + 1;

      if (nextMin > SAFE_MAX_MINUTES) {
        showMessage(
          `Too many minutes (>${SAFE_MAX_MINUTES}). Increase SAFE_MAX_MINUTES if needed.`,
          "error"
        );
        return prev;
      }

      const next = {
        ...prev,
        [cabinId]: {
          ...cur,
          minutePricing: {
            ...mp,
            [nextMin]: Number(cur.baseMinutePrice ?? 5),
          },
        },
      };
      saveCache(next);
      return next;
    });
  };

  const deleteMinute = (cabinId, minute) => {
    setAllPricing((prev) => {
      const cur = prev[cabinId];
      if (!cur) return prev;
      const mp = { ...(cur.minutePricing || {}) };
      delete mp[minute];

      const next = { ...prev, [cabinId]: { ...cur, minutePricing: mp } };
      saveCache(next);
      return next;
    });
  };

  const updatePrice = (cabinId, minute, value) => {
    // Allow all input including deletion
    if (value === "") {
      // Set to empty string to allow clearing
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: {
            ...prev[cabinId],
            minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
          },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    // Format/validate the input
    const formatted = formatPriceInput(value);
    if (formatted === null) {
      // Invalid input, don't update
      return;
    }

    // Check for special cases
    if (formatted === "-" || formatted === "." || formatted === "-." || formatted === "," || formatted === "-,") {
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: {
            ...prev[cabinId],
            minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: formatted },
          },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    // Parse the value (handle comma as decimal separator)
    const parsed = parsePriceInput(formatted);
    if (parsed === "") {
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: {
            ...prev[cabinId],
            minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: "" },
          },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    const num = Number(parsed);
    if (!Number.isFinite(num)) return;

    setAllPricing((prev) => {
      const next = {
        ...prev,
        [cabinId]: {
          ...prev[cabinId],
          minutePricing: { ...(prev[cabinId]?.minutePricing || {}), [minute]: num },
        },
      };
      saveCache(next);
      return next;
    });
  };

  const updateBasePrice = (cabinId, value) => {
    // Allow all input including deletion
    if (value === "") {
      // Set to empty string to allow clearing
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: "" },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    // Format/validate the input
    const formatted = formatPriceInput(value);
    if (formatted === null) {
      // Invalid input, don't update
      return;
    }

    // Check for special cases
    if (formatted === "-" || formatted === "." || formatted === "-." || formatted === "," || formatted === "-,") {
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: formatted },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    // Parse the value (handle comma as decimal separator)
    const parsed = parsePriceInput(formatted);
    if (parsed === "") {
      setAllPricing((prev) => {
        const next = {
          ...prev,
          [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: "" },
        };
        saveCache(next);
        return next;
      });
      return;
    }

    const num = Number(parsed);
    if (!Number.isFinite(num)) return;

    setAllPricing((prev) => {
      const next = {
        ...prev,
        [cabinId]: { ...(prev[cabinId] || {}), baseMinutePrice: num },
      };
      saveCache(next);
      return next;
    });
  };

  const updateUniformPrice = (value) => {
    // Allow all input including deletion
    if (value === "") {
      setUniformPrice("");
      return;
    }

    // Format/validate the input
    const formatted = formatPriceInput(value);
    if (formatted === null) {
      // Invalid input, don't update
      return;
    }

    setUniformPrice(formatted);
  };

  const toggleCabinSelected = (id) => {
    setSelectedCabins((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedCabins(cabins.map((c) => c._id));
  const selectNone = () => setSelectedCabins([]);

  const copyFromSourceToSelected = () => {
    if (!sourceCabinId) return;
    const source = allPricing[sourceCabinId];
    if (!source) return;

    setAllPricing((prev) => {
      const next = { ...prev };
      selectedCabins.forEach((id) => {
        if (id === sourceCabinId) return;
        next[id] = {
          baseMinutePrice: Number(source.baseMinutePrice ?? 5),
          minutePricing: { ...(source.minutePricing || {}) },
        };
      });
      saveCache(next);
      return next;
    });

    showMessage(t(lang, "pricing.message.copied") || "Copied", "success");
  };

  const applySamePriceToSelected = () => {
    // Parse the uniform price (handle comma as decimal separator)
    const parsed = parsePriceInput(uniformPrice);
    if (parsed === "") {
      showMessage(t(lang, "pricing.message.invalidPrice") || "Please enter a valid price", "error");
      return;
    }

    const p = Number(parsed);
    if (!Number.isFinite(p)) {
      showMessage(t(lang, "pricing.message.invalidPrice") || "Please enter a valid price", "error");
      return;
    }

    setAllPricing((prev) => {
      const next = { ...prev };
      selectedCabins.forEach((id) => {
        const cur = next[id] || { baseMinutePrice: 5, minutePricing: {} };
        const mp = { ...(cur.minutePricing || {}) };

        Object.keys(mp).forEach((k) => {
          const n = Number(k);
          if (Number.isFinite(n) && n > 0) mp[n] = p;
        });

        const seeded = ensureDefaultMinutes(p, mp);
        next[id] = { baseMinutePrice: p, minutePricing: seeded };
      });
      saveCache(next);
      return next;
    });

    showMessage(t(lang, "pricing.message.appliedSamePrice") || "Applied same price to selected booths", "success");
  };

  const saveCabin = async (cabinId) => {
    setSavingOne((prev) => ({ ...prev, [cabinId]: true }));
    try {
      const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

      const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
        return;
      }

      try {
        const pres = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`);
        const p = pres.ok ? await pres.json() : null;

        const base = Number(p?.baseMinutePrice ?? payload.baseMinutePrice ?? 5);
        const mp = ensureDefaultMinutes(base, normalizeMinutePricing(p?.minutePricing || payload.minutePricing || {}));

        setAllPricing((prev) => {
          const next = { ...prev, [cabinId]: { baseMinutePrice: base, minutePricing: mp } };
          saveCache(next);
          return next;
        });
      } catch { }

      showMessage(t(lang, "pricing.message.saved") || "Saved successfully", "success");
    } catch {
      showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
    } finally {
      setSavingOne((prev) => ({ ...prev, [cabinId]: false }));
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    try {
      for (const cabin of cabins) {
        const cabinId = cabin._id;
        const payload = cleanForSave(allPricing[cabinId] || { baseMinutePrice: 5, minutePricing: {} });

        const res = await fetch(`${API_BASE}/api/cabins/${cabinId}/pricing`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          showMessage(`${t(lang, "pricing.message.saveFailed")} for ${cabin.code || cabin.name || "booth"}`, "error");
          setSavingAll(false);
          return;
        }
      }

      showMessage(t(lang, "pricing.message.saved") || "Saved", "success");
      await fetchCabinsAndPricing();
    } catch {
      showMessage(t(lang, "pricing.message.saveFailed") || "Save failed", "error");
    } finally {
      setSavingAll(false);
    }
  };

  const maxMinuteAcrossAll = useMemo(() => {
    let max = DEFAULT_MINUTES;
    cabins.forEach((c) => {
      const list = minutesListForCabin(c._id);
      if (list.length) max = Math.max(max, list[list.length - 1]);
    });
    return max;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cabins, allPricing]);

  const exportToExcel = () => {
    if (!cabins.length) return;

    const rows = [];
    const header = ["Minute", ...cabins.map((c) => (c.code || c.name || "Booth").toString())];
    rows.push(header);

    for (let min = 1; min <= maxMinuteAcrossAll; min++) {
      const row = [min];
      cabins.forEach((c) => {
        const p = allPricing[c._id] || { baseMinutePrice: 5, minutePricing: {} };
        const mp = p.minutePricing || {};
        const cell =
          mp[min] !== undefined && mp[min] !== ""
            ? Number(mp[min])
            : Number(p.baseMinutePrice ?? 5);

        row.push(Number.isFinite(cell) ? cell : "");
      });
      rows.push(row);
    }

    rows.push([
      t(lang, "pricing.excel.basePrice") || "Base Price (€/min)",
      ...cabins.map((c) => {
        const bp = Number(allPricing[c._id]?.baseMinutePrice ?? 5);
        return Number.isFinite(bp) ? bp : 5;
      }),
    ]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = header.map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t(lang, "pricing.excel.sheetName") || "Cabin Pricing");
    XLSX.writeFile(wb, `cabin-pricing-${new Date().toISOString().slice(0, 10)}.xlsx`);

    showMessage(t(lang, "pricing.message.exported") || "Exported", "success");
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file || !cabins.length) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const nextPricing = {};
        cabins.forEach((c) => {
          nextPricing[c._id] = {
            baseMinutePrice: Number(allPricing[c._id]?.baseMinutePrice ?? 5),
            minutePricing: { ...(allPricing[c._id]?.minutePricing || {}) },
          };
        });

        rows.forEach((row, idx) => {
          if (!row || row.length < 2) return;
          if (idx === 0) return;

          const first = row[0];

          if (String(first).trim() === (t(lang, "pricing.excel.basePrice") || "Base Price (€/min)")) {
            row.slice(1).forEach((val, cIdx) => {
              const cabin = cabins[cIdx];
              if (!cabin) return;
              if (val === "" || val === undefined || val === null) return;
              const p = Number(val);
              if (!Number.isFinite(p)) return;
              nextPricing[cabin._id].baseMinutePrice = p;
            });
            return;
          }

          const minute = Number(first);
          if (!Number.isFinite(minute) || minute <= 0) return;

          row.slice(1).forEach((val, cIdx) => {
            const cabin = cabins[cIdx];
            if (!cabin) return;
            if (val === "" || val === undefined || val === null) return;
            const price = Number(val);
            if (!Number.isFinite(price)) return;
            nextPricing[cabin._id].minutePricing[minute] = price;
          });
        });

        cabins.forEach((c) => {
          const bp = Number(nextPricing[c._id].baseMinutePrice ?? 5);
          nextPricing[c._id].minutePricing = ensureDefaultMinutes(bp, normalizeMinutePricing(nextPricing[c._id].minutePricing));
        });

        setAllPricing((prev) => {
          const next = { ...prev, ...nextPricing };
          saveCache(next);
          return next;
        });

        showMessage(t(lang, "pricing.message.imported") || "Imported", "success");
      } catch {
        showMessage(t(lang, "pricing.message.importFailed") || "Import failed", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Format display value for inputs (show comma if needed)
  const formatDisplayValue = (value) => {
    if (value === "" || value === undefined || value === null) return "";

    // If it's a string (like "-" or "."), return it as is
    if (typeof value === "string") {
      return value;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) return "";

    // For German locale, use comma as decimal separator
    if (lang === "de") {
      return num.toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    // For other locales, use period
    return num.toString();
  };

  // Calculate how many cabins to show in each column
  const splitCabins = useMemo(() => {
    const half = Math.ceil(cabins.length / 2);
    return {
      left: cabins.slice(0, half),
      right: cabins.slice(half)
    };
  }, [cabins]);

  if (loading) {
    return (
      <div key={lang} className={`min-h-screen ${bg} flex items-center justify-center`}>
        <p className="text-lg font-medium">{t(lang, "pricing.loading") || "Loading..."}</p>
      </div>
    );
  }

  return (
    <div key={lang} className={`min-h-screen ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-emerald-500 font-medium tracking-wider text-sm">
            {t(lang, "pricing.header.kicker") || "PRICING"}
          </p>
          <h1 className={`mt-2 text-3xl font-bold ${titleColor}`}>
            {t(lang, "pricing.header.title") || "Cabin Pricing"}
          </h1>
          <p className={`mt-2 max-w-2xl mx-auto text-sm ${muted}`}>
            {t(lang, "pricing.header.subtitle") || "Manage minute-by-minute pricing per booth."}
          </p>

          <div className="mt-4 flex justify-center">
            <button
              onClick={fetchCabinsAndPricing}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${border} ${isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                } transition`}
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="text-sm font-medium">{t(lang, "pricing.bulk.refresh") || "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`max-w-md mx-auto rounded-xl px-5 py-3 flex items-center gap-3 font-medium ${message.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Bulk Actions - UPDATED: Save All button moved to bottom according to image */}
        <div className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-4`}>
          {/* Booth selector - UPDATED: Split into left and right columns */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.selectBoards") || "Select booths:"}</span>
              <button
                onClick={selectAll}
                className={`text-xs px-3 py-1 rounded-full border ${border} ${isDark
                  ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } transition`}
              >
                {t(lang, "pricing.bulk.selectAll") || "All"}
              </button>
              <button
                onClick={selectNone}
                className={`text-xs px-3 py-1 rounded-full border ${border} ${isDark
                  ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } transition`}
              >
                {t(lang, "pricing.bulk.selectNone") || "None"}
              </button>
            </div>

            {/* Split cabin selection into two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {splitCabins.left.map((c) => {
                    const active = selectedCabins.includes(c._id);
                    const buttonClasses = [
                      "border px-3 py-1.5 rounded-full text-xs font-medium transition",
                      active
                        ? isDark
                          ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
                          : "bg-emerald-100 border-emerald-400 text-emerald-800"
                        : isDark
                          ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60"
                          : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200",
                    ].join(" ");

                    return (
                      <button
                        key={c._id}
                        onClick={() => toggleCabinSelected(c._id)}
                        className={buttonClasses}
                      >
                        {c.code || c.name || "Booth"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {splitCabins.right.map((c) => {
                    const active = selectedCabins.includes(c._id);
                    const buttonClasses = [
                      "border px-3 py-1.5 rounded-full text-xs font-medium transition",
                      active
                        ? isDark
                          ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
                          : "bg-emerald-100 border-emerald-400 text-emerald-800"
                        : isDark
                          ? "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60"
                          : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200",
                    ].join(" ");

                    return (
                      <button
                        key={c._id}
                        onClick={() => toggleCabinSelected(c._id)}
                        className={buttonClasses}
                      >
                        {c.code || c.name || "Booth"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            {/* Copy from source */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.copyFrom") || "Copy from:"}</div>

              <select
                value={sourceCabinId}
                onChange={(e) => setSourceCabinId(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm ${inputClass}`}
              >
                {cabins.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code || c.name || "Booth"}
                  </option>
                ))}
              </select>

              <button
                onClick={copyFromSourceToSelected}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
              >
                <Copy className="w-4 h-4" />
                {t(lang, "pricing.bulk.copyToSelected") || "Copy to selected"}
              </button>
            </div>

            {/* Apply same price */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center lg:ml-auto">
              <div className={`text-xs ${muted}`}>{t(lang, "pricing.bulk.applySamePrice") || "Apply same price:"}</div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">€</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={uniformPrice}
                  onChange={(e) => updateUniformPrice(e.target.value)}
                  className={`w-28 px-3 py-2 rounded-lg border text-sm ${inputClass}`}
                  placeholder={lang === "de" ? "5,00" : "5.00"}
                />
              </div>

              <button
                onClick={applySamePriceToSelected}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition"
              >
                {t(lang, "pricing.bulk.apply") || "Apply"}
              </button>
            </div>
          </div>

          {/* Export/Import */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              <Download className="w-4 h-4" />
              {t(lang, "pricing.bulk.exportExcel") || "Export Excel"}
            </button>

            <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition">
              <Upload className="w-4 h-4" />
              {t(lang, "pricing.bulk.importExcel") || "Import Excel"}
              <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className={`text-xs ${muted}`}>
            {t(lang, "pricing.bulk.exportInfo") || "Export includes minutes only up to the highest existing row across booths."}
          </div>

          {/* UPDATED: Save All button moved to bottom according to image reference */}
          <div className="flex justify-end pt-4">
            <button
              onClick={saveAll}
              disabled={savingAll}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {savingAll
                ? t(lang, "pricing.bulk.saving") || "Saving..."
                : t(lang, "pricing.bulk.saveAll") || "Save All Cabins"}
            </button>
          </div>
        </div>

        {/* Cabins */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cabins.map((cabin) => {
            const p =
              allPricing[cabin._id] || {
                baseMinutePrice: 5,
                minutePricing: ensureDefaultMinutes(5, {}),
              };

            const minutes = minutesListForCabin(cabin._id);

            return (
              <div
                key={cabin._id}
                className={`rounded-2xl border ${border} ${cardBg} p-5 sm:p-6 space-y-5`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-xl font-bold ${titleColor}`}>
                      {cabin.code ? `${cabin.code} · ${cabin.name}` : cabin.name}
                    </h3>
                    <p className={`text-sm ${metaColor}`}>
                      {cabin.category || cabin.deviceType || "Booth"}
                    </p>

                    <p className="mt-1 text-xs text-emerald-400">
                      {minutes.length} {t(lang, "pricing.cabin.minuteRows") || "minute rows"}
                    </p>
                  </div>

                  <div className="text-right space-y-2">
                    <div>
                      <p className={`text-xs ${metaColor}`}>{t(lang, "pricing.cabin.basePrice") || "Base Price"}</p>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <span className="text-sm font-semibold">€</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={formatDisplayValue(p.baseMinutePrice)}
                          onChange={(e) => updateBasePrice(cabin._id, e.target.value)}
                          className={`w-24 px-3 py-2 rounded-lg border text-sm font-medium ${inputClass}`}
                          placeholder={lang === "de" ? "5,00" : "5.00"}
                        />
                        <span className="text-sm font-medium">/min</span>
                      </div>
                    </div>

                    <button
                      onClick={() => saveCabin(cabin._id)}
                      disabled={!!savingOne[cabin._id]}
                      className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-70 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      {savingOne[cabin._id] ? (t(lang, "pricing.cabin.saving") || "Saving...") : (t(lang, "pricing.cabin.save") || "Save")}
                    </button>
                  </div>
                </div>

                {/* Minute Rows */}
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {minutes.map((min) => {
                    const val = p.minutePricing?.[min];
                    const showVal = val === "" || val === undefined ? "" : Number(val);

                    const rowClass =
                      min > DEFAULT_MINUTES
                        ? isDark
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-emerald-300 bg-emerald-50"
                        : isDark
                          ? "bg-slate-900/40 border-slate-800"
                          : "bg-slate-50 border-slate-200";

                    return (
                      <div
                        key={min}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition ${rowClass}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`text-sm font-semibold whitespace-nowrap ${titleColor}`}>
                            {min} {t(lang, "pricing.cabin.min") || "min"}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">€</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={showVal === "" ? "" : formatDisplayValue(showVal)}
                              onChange={(e) => updatePrice(cabin._id, min, e.target.value)}
                              placeholder={formatDisplayValue(p.baseMinutePrice)}
                              className={`w-28 px-3 py-1.5 rounded border text-sm font-medium ${inputClass}`}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMinute(cabin._id, min)}
                          className="text-rose-400 hover:text-rose-300 flex-shrink-0 ml-2"
                          title={t(lang, "pricing.cabin.delete") || "Delete"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Minute Button */}
                <div className="pt-2">
                  <button
                    onClick={() => addNextMinute(cabin._id)}
                    className="w-full py-3 border-2 border-dashed border-emerald-500 rounded-xl text-emerald-300 hover:bg-emerald-500/10 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t(lang, "pricing.cabin.addNextMinute") || "New (add next minute)"}
                  </button>
                </div>

                <div className={`text-[11px] ${metaColor}`}>
                  {t(lang, "pricing.cabin.exportInfo") || "Tip: Export will include up to"} <b>{maxMinuteAcrossAll}</b> {t(lang, "pricing.cabin.minutes") || "minutes"}.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CabinPricing;