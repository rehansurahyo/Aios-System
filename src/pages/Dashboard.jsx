







// // // src/pages/Dashboard.jsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { t, trDynamic } from "../i18n";
// // import { useLanguage } from "../context/LanguageContext";

// // const API_BASE =
// //   import.meta.env.VITE_API_BASE_URL ||
// //   "https://backend-two-orpin-12.vercel.app";

// // const LOCAL_SESSIONS_KEY = "aios:runningSessions";
// // const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";

// // async function fetchJSON(url, options = {}, timeoutMs = 12000) {
// //   const controller = new AbortController();
// //   const id = setTimeout(() => controller.abort(), timeoutMs);
// //   try {
// //     const res = await fetch(url, {
// //       ...options,
// //       signal: controller.signal,
// //     });
// //     return res;
// //   } finally {
// //     clearTimeout(id);
// //   }
// // }

// // async function getLastDuration(customerName) {
// //   try {
// //     const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
// //     if (!res.ok) return null;
// //     const data = await res.json();
// //     if (!Array.isArray(data) || data.length === 0) return null;
// //     const sorted = data.sort((a, b) => {
// //       const dateA = new Date(a.date + ' ' + a.startTime);
// //       const dateB = new Date(b.date + ' ' + b.startTime);
// //       return dateB - dateA;
// //     });
// //     return sorted[0].durationMinutes;
// //   } catch (e) {
// //     console.error(e);
// //     return null;
// //   }
// // }

// // // Timer Display Component with seconds
// // function TimerWithSeconds({ minutesLeft, secondsLeft }) {
// //   return (
// //     <div className="text-center">
// //       <div className="text-2xl font-mono font-bold">
// //         {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
// //       </div>
// //       <div className="text-xs text-slate-500 mt-1">remaining</div>
// //     </div>
// //   );
// // }

// // function Dashboard({ theme }) {
// //   const isDark = theme === "dark";
// //   const { language } = useLanguage();
// //   const lang = language || "en";
// //   const [devices, setDevices] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
// //   const [bookings, setBookings] = useState([]);
// //   const [maintenanceTarget, setMaintenanceTarget] = useState(null);
// //   const [detailsCabin, setDetailsCabin] = useState(null);
// //   const [detailsTab, setDetailsTab] = useState("users");
// //   const [now, setNow] = useState(() => new Date());
// //   const [localSessions, setLocalSessions] = useState({});
// //   const [maintenanceLogs, setMaintenanceLogs] = useState({});
// //   const [startModalDevice, setStartModalDevice] = useState(null);
// //   const [startMinutes, setStartMinutes] = useState(20);
// //   const [startSaving, setStartSaving] = useState(false);
// //   const [startError, setStartError] = useState("");
// //   const [addUserModal, setAddUserModal] = useState(null);
// //   const [cleaningModal, setCleaningModal] = useState(null);
// //   const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

// //   // NEW STATE FOR CUSTOMER NAME
// //   const [customerName, setCustomerName] = useState("Lotte"); // Default value Lotte

// //   // Load local data
// //   useEffect(() => {
// //     try {
// //       // Load sessions
// //       const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
// //       if (sessionsRaw) {
// //         const parsed = JSON.parse(sessionsRaw);
// //         const nowTs = Date.now();
// //         const cleaned = {};
// //         Object.entries(parsed).forEach(([cabinId, session]) => {
// //           if (session?.endAt > nowTs) {
// //             cleaned[cabinId] = session;
// //           } else if (session?.status === "running") {
// //             // Auto-start cleaning when session ends
// //             cleaned[cabinId] = {
// //               ...session,
// //               endAt: nowTs + (3 * 60 * 1000), // 3 minutes cleaning
// //               status: "cleaning",
// //               autoCleaning: true
// //             };
// //           }
// //         });
// //         setLocalSessions(cleaned);
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
// //       }
// //       // Load maintenance logs
// //       const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
// //       if (logsRaw) {
// //         setMaintenanceLogs(JSON.parse(logsRaw));
// //       }
// //     } catch (e) {
// //       console.error("Failed to load local data", e);
// //     }
// //   }, []);

// //   // Timer update every second for seconds display
// //   useEffect(() => {
// //     const id = setInterval(() => {
// //       setNow(new Date());
// //       // Update local sessions and check for automatic cleaning
// //       setLocalSessions((prev) => {
// //         const nowTs = Date.now();
// //         const updated = {};
// //         let changed = false;
// //         Object.entries(prev).forEach(([deviceId, session]) => {
// //           if (session?.endAt > nowTs) {
// //             updated[deviceId] = session;
// //           } else if (session?.status === "running") {
// //             // Session ended - automatically start 3 minutes cleaning
// //             updated[deviceId] = {
// //               ...session,
// //               endAt: nowTs + (3 * 60 * 1000), // Fixed 3 minutes cleaning
// //               status: "cleaning",
// //               autoCleaning: true
// //             };
// //             changed = true;
// //           } else {
// //             changed = true;
// //           }
// //         });
// //         if (changed) {
// //           try {
// //             localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //           } catch (e) {}
// //         }
// //         return updated;
// //       });
// //     }, 1000);
// //     return () => clearInterval(id);
// //   }, []);

// //   // Load devices
// //   useEffect(() => {
// //     let mounted = true;
// //     const fetchCabins = async () => {
// //       try {
// //         setLoading(true);
// //         setError("");
// //         const res = await fetchJSON(`${API_BASE}/api/cabins`, {}, 12000);
// //         if (!res.ok) throw new Error("Failed to fetch cabins");
// //         const data = await res.json();
// //         if (!mounted) return;
// //         setDevices(Array.isArray(data) ? data : []);
// //       } catch (err) {
// //         if (!mounted) return;
// //         setError(t(lang, "dash.loadError"));
// //       } finally {
// //         if (!mounted) return;
// //         setLoading(false);
// //       }
// //     };
// //     fetchCabins();
// //     return () => { mounted = false; };
// //   }, [lang]);

// //   // Load bookings
// //   useEffect(() => {
// //     let mounted = true;
// //     const fetchBookings = async () => {
// //       try {
// //         const params = new URLSearchParams({ date: selectedDate }).toString();
// //         const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
// //         if (!res.ok) return;
// //         const data = await res.json();
// //         if (!mounted) return;
// //         setBookings(Array.isArray(data) ? data : []);
// //       } catch (e) {
// //         if (mounted) setBookings([]);
// //       }
// //     };
// //     fetchBookings();
// //     return () => { mounted = false; };
// //   }, [selectedDate]);

// //   const toMinutes = (hhmm) => {
// //     if (!hhmm) return 0;
// //     const [h, m] = hhmm.split(":").map(Number);
// //     return h * 60 + m;
// //   };

// //   // Calculate device status with seconds
// //   const devicesWithStatus = useMemo(() => {
// //     if (!devices.length) return [];
// //     const nowMinutes = now.getHours() * 60 + now.getMinutes();
// //     const nowSeconds = now.getSeconds();
// //     const nowTs = now.getTime();
// //     return devices.map((dev) => {
// //       const devBookings = bookings
// //         .filter((b) => b.cabinId === dev._id)
// //         .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
// //       let active = null;
// //       for (const b of devBookings) {
// //         if (b.status === "cancelled") continue;
// //         const start = toMinutes(b.startTime);
// //         const end = start + (b.durationMinutes || 0);
// //         if (start <= nowMinutes && nowMinutes < end) {
// //           active = { ...b, start, end };
// //           break;
// //         }
// //       }
// //       const localSession = localSessions[dev._id];
// //       const sessionUsers = localSession?.users || [];
// //       let status = dev.status || "free";
// //       let minutesLeft = 0;
// //       let secondsLeft = 0;
// //       let currentCustomer = dev.currentCustomer || dev.customer || "";
// //       let buttonState = "start";
// //       if (dev.maintenance) {
// //         status = "maintenance";
// //       } else if (localSession && localSession.endAt > nowTs) {
// //         const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
// //         minutesLeft = Math.floor(totalSecondsLeft / 60);
// //         secondsLeft = totalSecondsLeft % 60;

// //         if (localSession.status === "cleaning") {
// //           status = "cleaning";
// //           buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
// //         } else if (localSession.status === "locked") {
// //           status = "locked";
// //           buttonState = "unlock";
// //         } else {
// //           status = "running";
// //           buttonState = "cancel";
// //         }

// //         currentCustomer = sessionUsers.length > 0
// //           ? `${sessionUsers.length} user(s) logged in`
// //           : t(lang, "cabin.inUse");
// //       } else if (active) {
// //         status = "running";
// //         minutesLeft = Math.max(0, active.end - nowMinutes);
// //         secondsLeft = 60 - nowSeconds;
// //         buttonState = "cancel";
// //         currentCustomer = active.customerName || t(lang, "cabin.inUse");
// //       } else {
// //         status = status || "free";
// //         buttonState = "start";
// //         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
// //       }
// //       return {
// //         ...dev,
// //         status,
// //         minutesLeft,
// //         secondsLeft,
// //         sessionUsers,
// //         currentCustomer,
// //         buttonState,
// //         sessionData: localSession
// //       };
// //     });
// //   }, [devices, bookings, now, localSessions, lang]);

// //   // Get price for minutes
// //   const getPriceForMinutes = (device, minutes) => {
// //     if (device?.minutePricing && typeof device.minutePricing === "object") {
// //       let total = 0;
// //       for (let i = 1; i <= minutes; i++) {
// //         const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
// //         total += minutePrice;
// //       }
// //       return total;
// //     }
// //     const base = device?.baseMinutePrice ?? 2;
// //     return base * minutes;
// //   };

// //   // Start session
// //   const startSession = async (device, durationMinutes, customerName = "Walk-in Customer") => {
// //     try {
// //       setStartSaving(true);
// //       setStartError("");
// //       const nowLocal = new Date();
// //       const h = String(nowLocal.getHours()).padStart(2, "0");
// //       const m = String(nowLocal.getMinutes()).padStart(2, "0");
// //       const startTime = `${h}:${m}`;
// //       const body = {
// //         cabinId: device._id,
// //         date: selectedDate,
// //         startTime,
// //         durationMinutes,
// //         status: "booked",
// //         customerName,
// //       };
// //       const res = await fetchJSON(
// //         `${API_BASE}/api/bookings`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(body),
// //         },
// //         12000
// //       );
// //       if (!res.ok) {
// //         setStartError(t(lang, "start.serverError"));
// //         return false;
// //       }
// //       const saved = await res.json();
// //       setBookings((prev) => [...prev, saved]);
// //       const endAt = Date.now() + durationMinutes * 60 * 1000;
// //       const newUser = {
// //         id: Date.now(),
// //         name: customerName,
// //         startTime: new Date().toISOString(),
// //         duration: durationMinutes
// //       };
// //       setLocalSessions((prev) => {
// //         const updated = {
// //           ...prev,
// //           [device._id]: {
// //             endAt,
// //             status: "running",
// //             users: [newUser]
// //           }
// //         };
// //         try {
// //           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //         } catch (e) {}
// //         return updated;
// //       });
// //       return true;
// //     } catch (e) {
// //       setStartError(t(lang, "start.networkError"));
// //       return false;
// //     } finally {
// //       setStartSaving(false);
// //     }
// //   };

// //   // Start session from details modal
// //   const startSessionFromDetails = async (device, durationSeconds, price) => {
// //     try {
// //       const durationMinutes = Math.ceil(durationSeconds / 60);
// //       return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
// //     } catch (error) {
// //       console.error("Failed to start session from details:", error);
// //       return false;
// //     }
// //   };

// //   // Cancel session with confirmation
// //   const cancelSession = async (deviceId) => {
// //     try {
// //       // Remove from local sessions
// //       setLocalSessions((prev) => {
// //         const updated = { ...prev };
// //         const session = updated[deviceId];

// //         // Automatically start 3 minutes cleaning when cancelling
// //         if (session?.status === "running") {
// //           updated[deviceId] = {
// //             ...session,
// //             endAt: Date.now() + (3 * 60 * 1000), // 3 minutes cleaning
// //             status: "cleaning",
// //             autoCleaning: true
// //           };
// //         } else {
// //           delete updated[deviceId];
// //         }

// //         try {
// //           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //         } catch (e) {}
// //         return updated;
// //       });
// //       // Update backend booking status if exists
// //       const device = devices.find(d => d._id === deviceId);
// //       if (device) {
// //         const activeBooking = bookings.find(b =>
// //           b.cabinId === deviceId &&
// //           b.status !== "cancelled" &&
// //           !b.status?.includes("completed")
// //         );

// //         if (activeBooking) {
// //           await fetchJSON(
// //             `${API_BASE}/api/bookings/${activeBooking._id}`,
// //             {
// //               method: "PATCH",
// //               headers: { "Content-Type": "application/json" },
// //               body: JSON.stringify({ status: "cancelled" }),
// //             },
// //             12000
// //           );

// //           // Update local bookings state
// //           setBookings(prev => prev.map(b =>
// //             b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
// //           ));
// //         }
// //       }
// //     } catch (e) {
// //       console.error("Failed to cancel session", e);
// //     } finally {
// //       setCancelConfirmModal(null);
// //     }
// //   };

// //   // Mark as cleaning
// //   const markAsCleaning = (deviceId) => {
// //     setLocalSessions((prev) => {
// //       const session = prev[deviceId];
// //       const updated = {
// //         ...prev,
// //         [deviceId]: {
// //           ...session,
// //           endAt: Date.now() + (3 * 60 * 1000), // Fixed 3 minutes cleaning
// //           status: "cleaning",
// //           autoCleaning: false
// //         }
// //       };
// //       try {
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //       } catch (e) {}
// //       return updated;
// //     });
// //   };

// //   // End cleaning
// //   const endCleaning = (deviceId) => {
// //     setLocalSessions((prev) => {
// //       const updated = { ...prev };
// //       delete updated[deviceId];
// //       try {
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //       } catch (e) {}
// //       return updated;
// //     });
// //   };

// //   // Unlock device
// //   const unlockDevice = (deviceId) => {
// //     setLocalSessions((prev) => {
// //       const updated = { ...prev };
// //       delete updated[deviceId];
// //       try {
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //       } catch (e) {}
// //       return updated;
// //     });
// //   };

// //   // Add user to session
// //   const addUserToSession = (deviceId, userName) => {
// //     setLocalSessions((prev) => {
// //       const existingSession = prev[deviceId];
// //       if (!existingSession) return prev;
// //       const newUser = {
// //         id: Date.now(),
// //         name: userName,
// //         startTime: new Date().toISOString(),
// //         duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
// //       };
// //       const updated = {
// //         ...prev,
// //         [deviceId]: {
// //           ...existingSession,
// //           users: [...existingSession.users, newUser]
// //         }
// //       };

// //       try {
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //       } catch (e) {}

// //       return updated;
// //     });
// //     setAddUserModal(null);
// //   };

// //   // Remove user from session
// //   const removeUserFromSession = (deviceId, userId) => {
// //     setLocalSessions((prev) => {
// //       const existingSession = prev[deviceId];
// //       if (!existingSession) return prev;
// //       const updatedUsers = existingSession.users.filter(user => user.id !== userId);

// //       if (updatedUsers.length === 0) {
// //         const updated = { ...prev };
// //         delete updated[deviceId];
// //         try {
// //           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //         } catch (e) {}
// //         return updated;
// //       }
// //       const updated = {
// //         ...prev,
// //         [deviceId]: {
// //           ...existingSession,
// //           users: updatedUsers
// //         }
// //       };

// //       try {
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //       } catch (e) {}

// //       return updated;
// //     });
// //   };

// //   // Start maintenance
// //   const startMaintenance = async (deviceId) => {
// //     try {
// //       const timestamp = new Date().toISOString();
// //       const logEntry = {
// //         id: Date.now(),
// //         deviceId,
// //         action: "maintenance_started",
// //         timestamp,
// //         note: "Maintenance initiated",
// //         duration: 0
// //       };
// //       setMaintenanceLogs(prev => {
// //         const deviceLogs = prev[deviceId] || [];
// //         const updated = {
// //           ...prev,
// //           [deviceId]: [logEntry, ...deviceLogs]
// //         };
// //         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
// //         return updated;
// //       });
// //       setDevices(prev => prev.map(d =>
// //         d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
// //       ));
// //       // Clear any local session
// //       setLocalSessions(prev => {
// //         const updated = { ...prev };
// //         delete updated[deviceId];
// //         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
// //         return updated;
// //       });
// //       // Update backend
// //       await fetchJSON(
// //         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
// //         {
// //           method: "PATCH",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             maintenance: true,
// //             maintenanceStart: timestamp
// //           }),
// //         },
// //         12000
// //       );
// //       return true;
// //     } catch (e) {
// //       console.error("Failed to save maintenance", e);
// //       return false;
// //     }
// //   };

// //   // End maintenance
// //   const endMaintenance = async (deviceId) => {
// //     try {
// //       const device = devices.find(d => d._id === deviceId);
// //       const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
// //       const endTime = new Date();
// //       const duration = Math.round((endTime - startTime) / 1000);
// //       const logEntry = {
// //         id : Date.now(),
// //         deviceId,
// //         action: "maintenance_completed",
// //         timestamp: endTime.toISOString(),
// //         note: "Maintenance completed",
// //         duration
// //       };
// //       setMaintenanceLogs(prev => {
// //         const deviceLogs = prev[deviceId] || [];
// //         const updated = {
// //           ...prev,
// //           [deviceId]: [logEntry, ...deviceLogs]
// //         };
// //         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
// //         return updated;
// //       });
// //       setDevices(prev => prev.map(d =>
// //         d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
// //       ));
// //       await fetchJSON(
// //         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
// //         {
// //           method: "PATCH",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             maintenance: false,
// //             maintenanceEnd: endTime.toISOString(),
// //             maintenanceDuration: duration
// //           }),
// //         },
// //         12000
// //       );
// //       return true;
// //     } catch (e) {
// //       console.error("Failed to save maintenance end", e);
// //       return false;
// //     }
// //   };

// //   // Get device logs
// //   const getDeviceLogs = (deviceId) => {
// //     return maintenanceLogs[deviceId] || [];
// //   };

// //   const total = devicesWithStatus.length;
// //   const running = devicesWithStatus.filter((d) => d.status === "running").length;
// //   const free = devicesWithStatus.filter((d) => d.status === "free").length;
// //   const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
// //   const errors = devicesWithStatus.filter((d) => d.status === "error").length;
// //   const inMaintenance = devicesWithStatus.filter((d) => d.maintenance).length;

// //   const openStartModal = (device) => {
// //     setStartModalDevice(device);
// //     setStartMinutes(20);
// //     setStartError("");
// //   };

// //   const openMaintenanceModal = (device) => setMaintenanceTarget(device);
// //   const openDetails = (device) => {
// //     setDetailsCabin(device);
// //     setDetailsTab("users");
// //   };
// //   const openCancelConfirm = (device) => setCancelConfirmModal(device);
// //   const openCleaningModal = (device) => setCleaningModal(device);

// //   const closeStartModal = () => {
// //     if (startSaving) return;
// //     setStartModalDevice(null);
// //   };
// //   const closeMaintenanceModal = () => setMaintenanceTarget(null);
// //   const closeDetails = () => setDetailsCabin(null);
// //   const closeCancelConfirm = () => setCancelConfirmModal(null);
// //   const closeCleaningModal = () => setCleaningModal(null);

// //   const handleConfirmStart = async (modalCustomerName) => {
// //     if (!startModalDevice) return;
// //     const success = await startSession(startModalDevice, startMinutes, modalCustomerName || t(lang, "misc.walkIn"));
// //     if (success) {
// //       closeStartModal();
// //     }
// //   };

// //   const confirmMaintenance = async () => {
// //     if (!maintenanceTarget) return;
// //     await startMaintenance(maintenanceTarget._id);
// //     closeMaintenanceModal();
// //   };

// //   const confirmCancel = async () => {
// //     if (!cancelConfirmModal) return;
// //     await cancelSession(cancelConfirmModal._id);
// //   };

// //   const confirmCleaning = () => {
// //     if (!cleaningModal) return;
// //     markAsCleaning(cleaningModal._id);
// //     closeCleaningModal();
// //   };

// //   const detailsBookings = useMemo(() => {
// //     if (!detailsCabin) return [];
// //     return bookings
// //       .filter((b) => b.cabinId === detailsCabin._id)
// //       .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
// //   }, [detailsCabin, bookings]);

// //   const currentStartPrice = startModalDevice && startMinutes
// //     ? getPriceForMinutes(startModalDevice, startMinutes)
// //     : 0;

// //   const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
// //     running,
// //     free,
// //     cleaning,
// //     errors,
// //     s: errors !== 1 ? "s" : "",
// //     inMaintenance,
// //   });

// //   return (
// //     <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
// //       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
// //         {/* Header - UPDATED: Added Customer Name at Top Right */}
// //         <section className="space-y-2 sm:space-y-3 relative">
// //           <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
// //             AIOS-SYSTEMS
// //           </p>

// //           <div className="flex justify-between items-start">
// //             <div>
// //               <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
// //                 {t(lang, "dash.title")}
// //               </h1>
// //               <p className={isDark ? "text-xs sm:text-sm text-slate-400" : "text-xs sm:text-sm text-slate-600"}>
// //                 {t(lang, "dash.subtitle")}
// //               </p>
// //             </div>

// //             {/* Customer Name Display - Top Right */}
// //             <div className={`flex flex-col items-end ${isDark ? "text-slate-300" : "text-slate-700"}`}>
// //               <span className="text-xs font-medium text-slate-500 mb-1">Current Customer</span>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
// //                 <span className="text-sm font-semibold">{customerName || "Lotte"}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {loading && (
// //           <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
// //             {t(lang, "dash.loadingCabins")}
// //           </div>
// //         )}
// //         {error && !loading && (
// //           <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
// //             {error}
// //           </div>
// //         )}
// //         {!loading && !error && (
// //           <>
// //             <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
// //               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
// //                 <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
// //                 <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
// //                 <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
// //                 <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
// //               </div>
// //               <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// //                   <div>
// //                     <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
// //                       {t(lang, "dash.liveStatus")}
// //                     </p>
// //                     <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
// //                       {statusLine}
// //                     </p>
// //                   </div>
// //                   <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
// //                 </div>
// //                 {errors > 0 && (
// //                   <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
// //                     <span className="mt-[2px] text-xs">⚠️</span>
// //                     <p>
// //                       {errors} {t(lang, "dash.attention")}
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             </section>
// //             <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
// //               <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
// //                 <div>
// //                   <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
// //                     {t(lang, "dash.deviceOverview")}
// //                   </p>
// //                   <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
// //                     {t(lang, "dash.receptionLiveHeading")}
// //                   </h2>
// //                 </div>
// //                 <div className={isDark ? "text-[11px] sm:text-xs text-slate-400" : "text-[11px] sm:text-xs text-slate-500"}>{statusLine}</div>
// //               </div>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
// //                 {devicesWithStatus.map((device) => (
// //                   <CabinCard
// //                     key={device._id}
// //                     theme={theme}
// //                     lang={lang}
// //                     device={device}
// //                     onShowDetails={() => openDetails(device)}
// //                     onQuickStart={() => openStartModal(device)}
// //                     onRequestMaintenance={() => openMaintenanceModal(device)}
// //                     onEndMaintenance={() => endMaintenance(device._id)}
// //                     onCancelSession={() => openCancelConfirm(device)}
// //                     onMarkCleaning={() => openCleaningModal(device)}
// //                     onEndCleaning={() => endCleaning(device._id)}
// //                     onUnlock={() => unlockDevice(device._id)}
// //                     onAddUser={() => setAddUserModal(device)}
// //                   />
// //                 ))}
// //               </div>
// //             </section>
// //           </>
// //         )}
// //       </div>
// //       {/* Modals */}
// //       {maintenanceTarget && (
// //         <MaintenanceModal
// //           isDark={isDark}
// //           lang={lang}
// //           device={maintenanceTarget}
// //           onCancel={closeMaintenanceModal}
// //           onConfirm={confirmMaintenance}
// //         />
// //       )}
// //       {detailsCabin && (
// //         <EnhancedCabinDetailsModal
// //           isDark={isDark}
// //           lang={lang}
// //           device={detailsCabin}
// //           bookings={detailsBookings}
// //           logs={getDeviceLogs(detailsCabin._id)}
// //           sessionUsers={localSessions[detailsCabin._id]?.users || []}
// //           activeTab={detailsTab}
// //           onTabChange={setDetailsTab}
// //           onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
// //           onClose={closeDetails}
// //           onStartSession={startSessionFromDetails}
// //         />
// //       )}
// //       {startModalDevice && (
// //         <StartSessionModal
// //           isDark={isDark}
// //           lang={lang}
// //           device={startModalDevice}
// //           minutes={startMinutes}
// //           setMinutes={setStartMinutes}
// //           price={currentStartPrice}
// //           saving={startSaving}
// //           error={startError}
// //           onCancel={closeStartModal}
// //           onConfirm={handleConfirmStart}
// //         />
// //       )}
// //       {addUserModal && (
// //         <AddUserModal
// //           isDark={isDark}
// //           device={addUserModal}
// //           onCancel={() => setAddUserModal(null)}
// //           onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
// //         />
// //       )}
// //       {cancelConfirmModal && (
// //         <CancelConfirmModal
// //           isDark={isDark}
// //           lang={lang}
// //           device={cancelConfirmModal}
// //           onCancel={closeCancelConfirm}
// //           onConfirm={confirmCancel}
// //         />
// //       )}
// //       {cleaningModal && (
// //         <CleaningModal
// //           isDark={isDark}
// //           lang={lang}
// //           device={cleaningModal}
// //           onCancel={closeCleaningModal}
// //           onConfirm={confirmCleaning}
// //           duration={3}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // /* Small components with lang from hook */
// // function StatCard({ theme, label, value, tone }) {
// //   const isDark = theme === "dark";
// //   const chipColorsDark = {
// //     neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
// //     accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
// //     success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
// //     info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
// //   };
// //   const chipColorsLight = {
// //     neutral: "border-slate-300 bg-slate-100 text-slate-700",
// //     accent: "border-sky-300 bg-sky-50 text-sky-700",
// //     success: "border-emerald-300 bg-emerald-50 text-emerald-700",
// //     info: "border-cyan-300 bg-cyan-50 text-cyan-700",
// //   };
// //   const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
// //   return isDark ? (
// //     <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
// //       <div className="flex items-center justify-between">
// //         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
// //         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
// //       </div>
// //       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
// //     </div>
// //   ) : (
// //     <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
// //       <div className="flex items-center justify-between">
// //         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
// //         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
// //       </div>
// //       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
// //     </div>
// //   );
// // }

// // function StatusPill({ isDark, text }) {
// //   return (
// //     <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
// //       <span className="relative flex h-2 w-2">
// //         <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
// //         <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
// //       </span>
// //       <span>{text}</span>
// //     </div>
// //   );
// // }

// // function CabinCard({
// //   theme,
// //   lang,
// //   device,
// //   onShowDetails,
// //   onQuickStart,
// //   onRequestMaintenance,
// //   onEndMaintenance,
// //   onCancelSession,
// //   onMarkCleaning,
// //   onEndCleaning,
// //   onUnlock,
// //   onAddUser
// // }) {
// //   const isDark = theme === "dark";
// //   const statusStylesDark = {
// //     free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
// //     running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
// //     cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
// //     error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
// //     maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
// //     locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
// //   };
// //   const statusStylesLight = {
// //     free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
// //     running: "bg-amber-50 text-amber-700 border border-amber-200",
// //     cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
// //     error: "bg-rose-50 text-rose-700 border border-rose-200",
// //     maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
// //     locked: "bg-purple-50 text-purple-700 border border-purple-200",
// //   };
// //   const effectiveStatus = device.maintenance ? "maintenance" : device.status;
// //   const statusClass = isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
// //   const cardClass = isDark
// //     ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
// //     : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
// //   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
// //   const metaColor = isDark ? "text-slate-400" : "text-slate-500";
// //   const imageUrl = device.imageUrl;

// //   // Button text based on state
// //   const getButtonText = () => {
// //     switch (device.buttonState) {
// //       case "cancel": return "Cancel";
// //       case "cleaning": return "Cleaning";
// //       case "endCleaning":
// //       case "completeCleaning": return "End Cleaning";
// //       case "unlock": return "Unlock";
// //       case "start": return "Start";
// //       default: return "Start";
// //     }
// //   };

// //   const handleButtonClick = () => {
// //     switch (device.buttonState) {
// //       case "cancel": return onCancelSession();
// //       case "cleaning": return onMarkCleaning();
// //       case "endCleaning":
// //       case "completeCleaning": return onEndCleaning();
// //       case "unlock": return onUnlock();
// //       case "start": return onQuickStart();
// //       default: return onQuickStart();
// //     }
// //   };

// //   const getButtonClass = () => {
// //     switch (device.buttonState) {
// //       case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
// //       case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
// //       case "endCleaning":
// //       case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
// //       case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
// //       case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
// //       default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
// //     }
// //   };

// //   return (
// //     <article className={cardClass}>
// //       <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
// //         {imageUrl ? (
// //           <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
// //         ) : (
// //           <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">{t(lang, "cabin.noImage")}</div>
// //         )}
// //         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />
// //       </div>
// //       <header className="flex items-start justify-between gap-2">
// //         <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
// //         <span className={statusClass + " rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide"}>
// //           {device.maintenance ? t(lang, "status.maintenance").toUpperCase() : (device.status || "").toUpperCase()}
// //         </span>
// //       </header>
// //       <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.code ? `${device.code} · ${device.name}` : device.name}</h3>
// //       <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
// //         <div className={`flex items-center gap-1.5 ${metaColor}`}>
// //           <span>⏱</span>
// //           <span>
// //             {device.maintenance
// //               ? t(lang, "cabin.maintenanceTest")
// //               : device.minutesLeft > 0 || device.secondsLeft > 0
// //               ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
// //               : `0 ${t(lang, "cabin.min")}`}
// //           </span>
// //         </div>
// //         <div className={`flex items-center gap-1.5 ${metaColor}`}>
// //           <span>👤</span>
// //           <span>{trDynamic(lang, device.currentCustomer || t(lang, "cabin.noActiveCustomer"))}</span>
// //         </div>
// //       </div>
// //       <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
// //         <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
// //           {t(lang, "btn.details")}
// //         </button>
// //         {!device.maintenance ? (
// //           <>
// //             <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
// //               {getButtonText()}
// //             </button>
// //             {device.status !== "cleaning" && device.status !== "running" && (
// //               <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
// //                 <span>{t(lang, "btn.maintenance")}</span>
// //               </button>
// //             )}
// //           </>
// //         ) : (
// //           <button onClick={onEndMaintenance} className={(isDark ? "bg-violet-600 text-violet-50 hover:bg-violet-500" : "bg-violet-500 text-white hover:bg-violet-400") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
// //             {t(lang, "btn.endMaintenance")}
// //           </button>
// //         )}
// //       </div>
// //       {/* Add User Button for running sessions */}
// //       {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
// //         <button
// //           onClick={onAddUser}
// //           className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
// //         >
// //           + Add Another User ({device.sessionUsers.length})
// //         </button>
// //       )}
// //     </article>
// //   );
// // }

// // function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
// //         <div className="flex flex-col items-center text-center gap-3">
// //           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🔧</div>
// //           <h2 className="text-base sm:text-lg font-semibold">{t(lang, "maintenance.title")}</h2>
// //           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
// //             {t(lang, "maintenance.desc")}{" "}
// //             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
// //           </p>
// //           <p className="text-[11px] text-amber-400">This will cancel any active session on this device.</p>
// //         </div>
// //         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
// //           <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
// //             {t(lang, "maintenance.startBtn")}
// //           </button>
// //           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
// //             {t(lang, "btn.cancel")}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
// //         <div className="flex flex-col items-center text-center gap-3">
// //           <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl">⚠️</div>
// //           <h2 className="text-base sm:text-lg font-semibold">Cancel Session</h2>
// //           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
// //             Are you sure you want to cancel the session on{" "}
// //             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
// //           </p>
// //           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
// //             After cancellation, the device will be marked for cleaning for 3 minutes automatically.
// //           </p>
// //         </div>
// //         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
// //           <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
// //             Cancel Session
// //           </button>
// //           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
// //             Keep Running
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
// //         <div className="flex flex-col items-center text-center gap-3">
// //           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🧹</div>
// //           <h2 className="text-base sm:text-lg font-semibold">Mark for Cleaning</h2>
// //           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
// //             Mark <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span> for cleaning?
// //           </p>
// //           <p className="text-[11px] text-sky-400">
// //             The device will be unavailable for {duration} minutes for cleaning.
// //           </p>
// //         </div>
// //         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
// //           <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
// //             Start Cleaning
// //           </button>
// //           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function EnhancedCabinDetailsModal({
// //   isDark,
// //   lang,
// //   device,
// //   bookings,
// //   logs,
// //   sessionUsers,
// //   activeTab,
// //   onTabChange,
// //   onRemoveUser,
// //   onClose,
// //   onStartSession
// // }) {
// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl space-y-4"}>
// //         <div className="flex items-start justify-between gap-3">
// //           <div>
// //             <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">KABINEN-DETAILS</p>
// //             <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
// //             <p className="text-[11px] sm:text-xs text-slate-500">
// //               {device.category || "Gerät"} · {device.type || "SUNLIGHT"}
// //             </p>
// //           </div>
// //           <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
// //             ✕
// //           </button>
// //         </div>
// //         {/* Tabs */}
// //         <div className="flex border-b">
// //           <button
// //             onClick={() => onTabChange("users")}
// //             className={`px-4 py-2 text-sm ${activeTab === "users" ? "border-b-2 border-emerald-500" : ""}`}
// //           >
// //             Users ({sessionUsers.length})
// //           </button>
// //           <button
// //             onClick={() => onTabChange("bookings")}
// //             className={`px-4 py-2 text-sm ${activeTab === "bookings" ? "border-b-2 border-emerald-500" : ""}`}
// //           >
// //             Bookings ({bookings.length})
// //           </button>
// //           <button
// //             onClick={() => onTabChange("logs")}
// //             className={`px-4 py-2 text-sm ${activeTab === "logs" ? "border-b-2 border-emerald-500" : ""}`}
// //           >
// //             Maintenance Logs ({logs.length})
// //           </button>
// //         </div>
// //         {/* Tab Content */}
// //         <div className="max-h-64 overflow-y-auto">
// //           {activeTab === "users" && (
// //             <div className="space-y-2">
// //               {sessionUsers.length === 0 ? (
// //                 <p className="text-[11px] text-slate-500 text-center py-4">No users logged in</p>
// //               ) : (
// //                 sessionUsers.map((user, index) => (
// //                   <div key={user.id} className="flex justify-between items-center p-2 border rounded">
// //                     <div>
// //                       <div className="font-medium">{user.name}</div>
// //                       <div className="text-xs text-slate-500">
// //                         Started: {new Date(user.startTime).toLocaleTimeString()}
// //                       </div>
// //                       <div className="text-xs text-slate-500">
// //                         Duration: {user.duration} minutes
// //                       </div>
// //                     </div>
// //                     <button
// //                       onClick={() => onRemoveUser(user.id)}
// //                       className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
// //                     >
// //                       Remove
// //                     </button>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           )}
// //           {activeTab === "bookings" && (
// //             <div className="space-y-2">
// //               {bookings.length === 0 ? (
// //                 <p className="text-[11px] text-slate-500 text-center py-4">{t(lang, "details.noBookings")}</p>
// //               ) : (
// //                 bookings.map((b) => (
// //                   <div key={b._id} className="border rounded-lg px-3 py-1.5">
// //                     <div className="font-medium">
// //                       {b.startTime} · {b.durationMinutes} {t(lang, "cabin.min")}
// //                     </div>
// //                     <div className="text-slate-500 text-sm">
// //                       {trDynamic(lang, b.customerName || t(lang, "details.unnamedBooking"))}
// //                     </div>
// //                     <div className={`text-xs ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
// //                       {b.status}
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           )}
// //           {activeTab === "logs" && (
// //             <div className="space-y-2">
// //               {logs.length === 0 ? (
// //                 <p className="text-[11px] text-slate-500 text-center py-4">No maintenance logs</p>
// //               ) : (
// //                 logs.map((log) => (
// //                   <div key={log.id} className="border rounded-lg p-2">
// //                     <div className="flex justify-between">
// //                       <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
// //                         {log.action.replace('_', ' ')}
// //                       </span>
// //                       <span className="text-xs text-slate-500">
// //                         {new Date(log.timestamp).toLocaleString()}
// //                       </span>
// //                     </div>
// //                     {log.note && <div className="text-sm mt-1">{log.note}</div>}
// //                     {log.duration > 0 && (
// //                       <div className="text-xs text-slate-500">Duration: {log.duration} seconds</div>
// //                     )}
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           )}
// //         </div>
// //         <div className="flex justify-end">
// //           <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
// //             {t(lang, "btn.close")}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // UPDATED: Start Session Modal with ALL CLIENT CHANGES
// // function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
// //   const [customerName, setCustomerName] = useState('');
// //   const [lastMinutes, setLastMinutes] = useState(20);

// //   useEffect(() => {
// //     if (customerName) {
// //       getLastDuration(customerName).then(d => {
// //         if (d !== null) setLastMinutes(d);
// //       });
// //     }
// //   }, [customerName]);

// //   useEffect(() => {
// //     setMinutes(lastMinutes);
// //   }, [lastMinutes]);

// //   // FIXED: Minimum time from 4 to 5 minutes (German law)
// //   const minMin = 5; // Changed from 4 to 5
// //   const maxMin = 25;

// //   const adjustMinutes = (delta) => {
// //     setMinutes((prev) => {
// //       let next = prev + delta;
// //       if (next < minMin) next = minMin;
// //       if (next > maxMin) next = maxMin;
// //       return next;
// //     });
// //   };

// //   const setToMin = () => setMinutes(minMin);
// //   const setToLast = () => setMinutes(lastMinutes);
// //   const setToMax = () => setMinutes(maxMin);

// //   const helpfulMessage = "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen.";

// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
// //         {/* Header - REDUCED FONT SIZES */}
// //         <div className="flex items-start justify-between gap-2">
// //           <div>
// //             <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SITZUNG STARTEN</p>
// //             <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
// //             <p className="mt-0.5 text-[10px] text-slate-500">Sitzungszeit (5-25 Minuten) vor dem Start festlegen.</p>
// //           </div>
// //           <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
// //             ×
// //           </button>
// //         </div>

// //         <div className="space-y-3">
// //           {/* Customer Name Input */}
// //           <div className="space-y-1">
// //             <label className="text-[10px] font-medium text-slate-500">Kundenname</label>
// //             <input 
// //               type="text" 
// //               value={customerName}
// //               onChange={(e) => setCustomerName(e.target.value)}
// //               className={`w-full px-2.5 py-1.5 rounded-lg border text-[10px] ${isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-gray-900"}`}
// //               placeholder="Kundenname eingeben"
// //             />
// //           </div>

// //           <p className="text-[10px] font-medium text-slate-500">Sitzungsdauer auswählen</p>

// //           {/* Duration Controls - UPDATED: Bigger + - buttons with spacing */}
// //           <div className="flex items-center justify-center gap-4"> {/* Increased gap from 3 to 4 */}
// //             <button 
// //               type="button" 
// //               onClick={() => adjustMinutes(-1)} 
// //               disabled={saving || minutes <= minMin} 
// //               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"} // Changed w-8 h-8 to w-10 h-10, text-lg to text-xl
// //             >
// //               −
// //             </button>
// //             <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
// //               {minutes} Min
// //             </div>
// //             <button 
// //               type="button" 
// //               onClick={() => adjustMinutes(1)} 
// //               disabled={saving || minutes >= maxMin} 
// //               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"} // Changed w-8 h-8 to w-10 h-10, text-lg to text-xl
// //             >
// //               +
// //             </button>
// //           </div>

// //           {/* Time Presets - UPDATED: Added frames/borders to all 3 buttons */}
// //           <div className="grid grid-cols-3 gap-2">
// //             <div className="text-center">
// //               <label className="text-[10px] font-medium text-slate-500">Minimum</label>
// //               <button 
// //                 onClick={setToMin} 
// //                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
// //               >
// //                 {minMin} Min
// //               </button>
// //             </div>
// //             <div className="text-center">
// //               <label className="text-[10px] font-medium text-slate-500">Letzte Buchung</label>
// //               <button 
// //                 onClick={setToLast} 
// //                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
// //               >
// //                 {lastMinutes} Min
// //               </button>
// //             </div>
// //             <div className="text-center">
// //               <label className="text-[10px] font-medium text-slate-500">Maximum</label>
// //               <button 
// //                 onClick={setToMax} 
// //                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
// //               >
// //                 {maxMin} Min
// //               </button>
// //             </div>
// //           </div>

// //           {/* Help Message */}
// //           <div className="mt-2 text-center text-[10px] italic text-slate-400">
// //             {helpfulMessage}
// //           </div>

// //           {/* Price Display */}
// //           <div className="flex items-center justify-end gap-2">
// //             <div className="text-right">
// //               <p className="text-[10px] text-slate-500">Geschätzter Preis</p>
// //               <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Error Message */}
// //         {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

// //         {/* Action Buttons */}
// //         <button 
// //           onClick={() => onConfirm(customerName)} 
// //           disabled={saving || !customerName.trim()} 
// //           className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
// //         >
// //           {saving ? "Wird gestartet..." : "Sitzung starten"}
// //         </button>
// //         <button 
// //           onClick={onCancel} 
// //           disabled={saving} 
// //           className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
// //         >
// //           Abbrechen
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // function AddUserModal({ isDark, device, onCancel, onConfirm }) {
// //   const [userName, setUserName] = useState("");
// //   return (
// //     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
// //       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
// //         <h3 className="text-lg font-semibold mb-2">Add User to {device.name}</h3>

// //         <div className="space-y-4">
// //           <div>
// //             <label className="block text-sm mb-1">User Name</label>
// //             <input
// //               type="text"
// //               value={userName}
// //               onChange={(e) => setUserName(e.target.value)}
// //               placeholder="Enter user name"
// //               className="w-full px-3 py-2 border rounded-lg bg-transparent"
// //               autoFocus
// //             />
// //           </div>

// //           <div className="flex gap-2">
// //             <button
// //               onClick={onCancel}
// //               className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               onClick={() => onConfirm(userName)}
// //               disabled={!userName.trim()}
// //               className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
// //             >
// //               Add User
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;





// // src/pages/Dashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { t, trDynamic } from "../i18n";
// import { useLanguage } from "../context/LanguageContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-two-orpin-12.vercel.app";

// const LOCAL_SESSIONS_KEY = "aios:runningSessions";
// const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";

// async function fetchJSON(url, options = {}, timeoutMs = 12000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);
//   try {
//     const res = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }

// async function getLastDuration(customerName) {
//   try {
//     const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (!Array.isArray(data) || data.length === 0) return null;
//     const sorted = data.sort((a, b) => {
//       const dateA = new Date(a.date + ' ' + a.startTime);
//       const dateB = new Date(b.date + ' ' + b.startTime);
//       return dateB - dateA;
//     });
//     return sorted[0].durationMinutes;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// // Timer Display Component with seconds
// function TimerWithSeconds({ minutesLeft, secondsLeft }) {
//   return (
//     <div className="text-center">
//       <div className="text-2xl font-mono font-bold">
//         {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
//       </div>
//       <div className="text-xs text-slate-500 mt-1">remaining</div>
//     </div>
//   );
// }

// function Dashboard({ theme }) {
//   const isDark = theme === "dark";
//   const { language } = useLanguage();
//   const lang = language || "en";
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
//   const [bookings, setBookings] = useState([]);
//   const [maintenanceTarget, setMaintenanceTarget] = useState(null);
//   const [detailsCabin, setDetailsCabin] = useState(null);
//   const [detailsTab, setDetailsTab] = useState("users");
//   const [now, setNow] = useState(() => new Date());
//   const [localSessions, setLocalSessions] = useState({});
//   const [maintenanceLogs, setMaintenanceLogs] = useState({});
//   const [startModalDevice, setStartModalDevice] = useState(null);
//   const [startMinutes, setStartMinutes] = useState(20);
//   const [startSaving, setStartSaving] = useState(false);
//   const [startError, setStartError] = useState("");
//   const [addUserModal, setAddUserModal] = useState(null);
//   const [cleaningModal, setCleaningModal] = useState(null);
//   const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

//   // NEW STATE FOR CUSTOMER NAME
//   const [customerName, setCustomerName] = useState("Lotte"); // Default value Lotte

//   // Load local data
//   useEffect(() => {
//     try {
//       // Load sessions
//       const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
//       if (sessionsRaw) {
//         const parsed = JSON.parse(sessionsRaw);
//         const nowTs = Date.now();
//         const cleaned = {};
//         Object.entries(parsed).forEach(([cabinId, session]) => {
//           if (session?.endAt > nowTs) {
//             cleaned[cabinId] = session;
//           } else if (session?.status === "running") {
//             // Auto-start cleaning when session ends
//             cleaned[cabinId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//           }
//         });
//         setLocalSessions(cleaned);
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
//       }
//       // Load maintenance logs
//       const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
//       if (logsRaw) {
//         setMaintenanceLogs(JSON.parse(logsRaw));
//       }
//     } catch (e) {
//       console.error("Failed to load local data", e);
//     }
//   }, []);

//   // Timer update every second for seconds display
//   useEffect(() => {
//     const id = setInterval(() => {
//       setNow(new Date());
//       // Update local sessions and check for automatic cleaning
//       setLocalSessions((prev) => {
//         const nowTs = Date.now();
//         const updated = {};
//         let changed = false;
//         Object.entries(prev).forEach(([deviceId, session]) => {
//           if (session?.endAt > nowTs) {
//             updated[deviceId] = session;
//           } else if (session?.status === "running") {
//             // Session ended - automatically start 3 minutes cleaning
//             updated[deviceId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//             changed = true;
//           } else {
//             changed = true;
//           }
//         });
//         if (changed) {
//           try {
//             localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//           } catch (e) {}
//         }
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   // Load devices
//   useEffect(() => {
//     let mounted = true;
//     const fetchCabins = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetchJSON(`${API_BASE}/api/cabins`, {}, 12000);
//         if (!res.ok) throw new Error("Failed to fetch cabins");
//         const data = await res.json();
//         if (!mounted) return;
//         setDevices(Array.isArray(data) ? data : []);
//       } catch (err) {
//         if (!mounted) return;
//         setError(t(lang, "dash.loadError"));
//       } finally {
//         if (!mounted) return;
//         setLoading(false);
//       }
//     };
//     fetchCabins();
//     return () => { mounted = false; };
//   }, [lang]);

//   // Load bookings
//   useEffect(() => {
//     let mounted = true;
//     const fetchBookings = async () => {
//       try {
//         const params = new URLSearchParams({ date: selectedDate }).toString();
//         const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
//         if (!res.ok) return;
//         const data = await res.json();
//         if (!mounted) return;
//         setBookings(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (mounted) setBookings([]);
//       }
//     };
//     fetchBookings();
//     return () => { mounted = false; };
//   }, [selectedDate]);

//   const toMinutes = (hhmm) => {
//     if (!hhmm) return 0;
//     const [h, m] = hhmm.split(":").map(Number);
//     return h * 60 + m;
//   };

//   // Calculate device status with seconds
//   const devicesWithStatus = useMemo(() => {
//     if (!devices.length) return [];
//     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//     const nowSeconds = now.getSeconds();
//     const nowTs = now.getTime();
//     return devices.map((dev) => {
//       const devBookings = bookings
//         .filter((b) => b.cabinId === dev._id)
//         .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//       let active = null;
//       for (const b of devBookings) {
//         if (b.status === "cancelled") continue;
//         const start = toMinutes(b.startTime);
//         const end = start + (b.durationMinutes || 0);
//         if (start <= nowMinutes && nowMinutes < end) {
//           active = { ...b, start, end };
//           break;
//         }
//       }
//       const localSession = localSessions[dev._id];
//       const sessionUsers = localSession?.users || [];
//       let status = dev.status || "free";
//       let minutesLeft = 0;
//       let secondsLeft = 0;
//       let currentCustomer = dev.currentCustomer || dev.customer || "";
//       let buttonState = "start";
//       if (dev.maintenance) {
//         status = "maintenance";
//       } else if (localSession && localSession.endAt > nowTs) {
//         const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
//         minutesLeft = Math.floor(totalSecondsLeft / 60);
//         secondsLeft = totalSecondsLeft % 60;

//         if (localSession.status === "cleaning") {
//           status = "cleaning";
//           buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
//         } else if (localSession.status === "locked") {
//           status = "locked";
//           buttonState = "unlock";
//         } else {
//           status = "running";
//           buttonState = "cancel";
//         }

//         currentCustomer = sessionUsers.length > 0
//           ? `${sessionUsers.length} user(s) logged in`
//           : t(lang, "cabin.inUse");
//       } else if (active) {
//         status = "running";
//         minutesLeft = Math.max(0, active.end - nowMinutes);
//         secondsLeft = 60 - nowSeconds;
//         buttonState = "cancel";
//         currentCustomer = active.customerName || t(lang, "cabin.inUse");
//       } else {
//         status = status || "free";
//         buttonState = "start";
//         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
//       }
//       return {
//         ...dev,
//         status,
//         minutesLeft,
//         secondsLeft,
//         sessionUsers,
//         currentCustomer,
//         buttonState,
//         sessionData: localSession
//       };
//     });
//   }, [devices, bookings, now, localSessions, lang]);

//   // Get price for minutes
//   const getPriceForMinutes = (device, minutes) => {
//     if (device?.minutePricing && typeof device.minutePricing === "object") {
//       let total = 0;
//       for (let i = 1; i <= minutes; i++) {
//         const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
//         total += minutePrice;
//       }
//       return total;
//     }
//     const base = device?.baseMinutePrice ?? 2;
//     return base * minutes;
//   };

//   // Start session
//   const startSession = async (device, durationMinutes, customerName = "Walk-in Customer") => {
//     try {
//       setStartSaving(true);
//       setStartError("");
//       const nowLocal = new Date();
//       const h = String(nowLocal.getHours()).padStart(2, "0");
//       const m = String(nowLocal.getMinutes()).padStart(2, "0");
//       const startTime = `${h}:${m}`;
//       const body = {
//         cabinId: device._id,
//         date: selectedDate,
//         startTime,
//         durationMinutes,
//         status: "booked",
//         customerName,
//       };
//       const res = await fetchJSON(
//         `${API_BASE}/api/bookings`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         },
//         12000
//       );
//       if (!res.ok) {
//         setStartError(t(lang, "start.serverError"));
//         return false;
//       }
//       const saved = await res.json();
//       setBookings((prev) => [...prev, saved]);
//       const endAt = Date.now() + durationMinutes * 60 * 1000;
//       const newUser = {
//         id: Date.now(),
//         name: customerName,
//         startTime: new Date().toISOString(),
//         duration: durationMinutes
//       };
//       setLocalSessions((prev) => {
//         const updated = {
//           ...prev,
//           [device._id]: {
//             endAt,
//             status: "running",
//             users: [newUser]
//           }
//         };
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });
//       return true;
//     } catch (e) {
//       setStartError(t(lang, "start.networkError"));
//       return false;
//     } finally {
//       setStartSaving(false);
//     }
//   };

//   // Start session from details modal
//   const startSessionFromDetails = async (device, durationSeconds, price) => {
//     try {
//       const durationMinutes = Math.ceil(durationSeconds / 60);
//       return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
//     } catch (error) {
//       console.error("Failed to start session from details:", error);
//       return false;
//     }
//   };

//   // Cancel session with confirmation
//   const cancelSession = async (deviceId) => {
//     try {
//       // Remove from local sessions
//       setLocalSessions((prev) => {
//         const updated = { ...prev };
//         const session = updated[deviceId];

//         // Automatically start 3 minutes cleaning when cancelling
//         if (session?.status === "running") {
//           updated[deviceId] = {
//             ...session,
//             endAt: Date.now() + (3 * 60 * 1000), // 3 minutes cleaning
//             status: "cleaning",
//             autoCleaning: true
//           };
//         } else {
//           delete updated[deviceId];
//         }

//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });
//       // Update backend booking status if exists
//       const device = devices.find(d => d._id === deviceId);
//       if (device) {
//         const activeBooking = bookings.find(b =>
//           b.cabinId === deviceId &&
//           b.status !== "cancelled" &&
//           !b.status?.includes("completed")
//         );

//         if (activeBooking) {
//           await fetchJSON(
//             `${API_BASE}/api/bookings/${activeBooking._id}`,
//             {
//               method: "PATCH",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ status: "cancelled" }),
//             },
//             12000
//           );

//           // Update local bookings state
//           setBookings(prev => prev.map(b =>
//             b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
//           ));
//         }
//       }
//     } catch (e) {
//       console.error("Failed to cancel session", e);
//     } finally {
//       setCancelConfirmModal(null);
//     }
//   };

//   // Mark as cleaning
//   const markAsCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const session = prev[deviceId];
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...session,
//           endAt: Date.now() + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//           status: "cleaning",
//           autoCleaning: false
//         }
//       };
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // End cleaning
//   const endCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Unlock device
//   const unlockDevice = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Add user to session
//   const addUserToSession = (deviceId, userName) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const newUser = {
//         id: Date.now(),
//         name: userName,
//         startTime: new Date().toISOString(),
//         duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
//       };
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: [...existingSession.users, newUser]
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//     setAddUserModal(null);
//   };

//   // Remove user from session
//   const removeUserFromSession = (deviceId, userId) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const updatedUsers = existingSession.users.filter(user => user.id !== userId);

//       if (updatedUsers.length === 0) {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       }
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: updatedUsers
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//   };

//   // Start maintenance
//   const startMaintenance = async (deviceId) => {
//     try {
//       const timestamp = new Date().toISOString();
//       const logEntry = {
//         id: Date.now(),
//         deviceId,
//         action: "maintenance_started",
//         timestamp,
//         note: "Maintenance initiated",
//         duration: 0
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
//       ));
//       // Clear any local session
//       setLocalSessions(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         return updated;
//       });
//       // Update backend
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: true,
//             maintenanceStart: timestamp
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance", e);
//       return false;
//     }
//   };

//   // End maintenance
//   const endMaintenance = async (deviceId) => {
//     try {
//       const device = devices.find(d => d._id === deviceId);
//       const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
//       const endTime = new Date();
//       const duration = Math.round((endTime - startTime) / 1000);
//       const logEntry = {
//         id : Date.now(),
//         deviceId,
//         action: "maintenance_completed",
//         timestamp: endTime.toISOString(),
//         note: "Maintenance completed",
//         duration
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
//       ));
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: false,
//             maintenanceEnd: endTime.toISOString(),
//             maintenanceDuration: duration
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance end", e);
//       return false;
//     }
//   };

//   // Get device logs
//   const getDeviceLogs = (deviceId) => {
//     return maintenanceLogs[deviceId] || [];
//   };

//   const total = devicesWithStatus.length;
//   const running = devicesWithStatus.filter((d) => d.status === "running").length;
//   const free = devicesWithStatus.filter((d) => d.status === "free").length;
//   const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
//   const errors = devicesWithStatus.filter((d) => d.status === "error").length;
//   const inMaintenance = devicesWithStatus.filter((d) => d.maintenance).length;

//   const openStartModal = (device) => {
//     setStartModalDevice(device);
//     setStartMinutes(20);
//     setStartError("");
//   };

//   const openMaintenanceModal = (device) => setMaintenanceTarget(device);
//   const openDetails = (device) => {
//     setDetailsCabin(device);
//     setDetailsTab("users");
//   };
//   const openCancelConfirm = (device) => setCancelConfirmModal(device);
//   const openCleaningModal = (device) => setCleaningModal(device);

//   const closeStartModal = () => {
//     if (startSaving) return;
//     setStartModalDevice(null);
//   };
//   const closeMaintenanceModal = () => setMaintenanceTarget(null);
//   const closeDetails = () => setDetailsCabin(null);
//   const closeCancelConfirm = () => setCancelConfirmModal(null);
//   const closeCleaningModal = () => setCleaningModal(null);

//   const handleConfirmStart = async () => {
//     if (!startModalDevice) return;
//     const success = await startSession(startModalDevice, startMinutes, t(lang, "misc.walkIn"));
//     if (success) {
//       closeStartModal();
//     }
//   };

//   const confirmMaintenance = async () => {
//     if (!maintenanceTarget) return;
//     await startMaintenance(maintenanceTarget._id);
//     closeMaintenanceModal();
//   };

//   const confirmCancel = async () => {
//     if (!cancelConfirmModal) return;
//     await cancelSession(cancelConfirmModal._id);
//   };

//   const confirmCleaning = () => {
//     if (!cleaningModal) return;
//     markAsCleaning(cleaningModal._id);
//     closeCleaningModal();
//   };

//   const detailsBookings = useMemo(() => {
//     if (!detailsCabin) return [];
//     return bookings
//       .filter((b) => b.cabinId === detailsCabin._id)
//       .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//   }, [detailsCabin, bookings]);

//   const currentStartPrice = startModalDevice && startMinutes
//     ? getPriceForMinutes(startModalDevice, startMinutes)
//     : 0;

//   const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
//     running,
//     free,
//     cleaning,
//     errors,
//     s: errors !== 1 ? "s" : "",
//     inMaintenance,
//   });

//   return (
//     <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
//         {/* Header - UPDATED: Added Customer Name at Top Right */}
//         <section className="space-y-2 sm:space-y-3 relative">
//           <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
//             AIOS-SYSTEMS
//           </p>

//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
//                 {t(lang, "dash.title")}
//               </h1>
//               <p className={isDark ? "text-xs sm:text-sm text-slate-400" : "text-xs sm:text-sm text-slate-600"}>
//                 {t(lang, "dash.subtitle")}
//               </p>
//             </div>

//             {/* Customer Name Display - Top Right */}
//             <div className={`flex flex-col items-end ${isDark ? "text-slate-300" : "text-slate-700"}`}>
//               <span className="text-xs font-medium text-slate-500 mb-1">Current Customer</span>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
//                 <span className="text-sm font-semibold">{customerName || "Lotte"}</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {loading && (
//           <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {t(lang, "dash.loadingCabins")}
//           </div>
//         )}
//         {error && !loading && (
//           <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {error}
//           </div>
//         )}
//         {!loading && !error && (
//           <>
//             <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
//                 <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
//                 <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
//                 <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
//               </div>
//               <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div>
//                     <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
//                       {t(lang, "dash.liveStatus")}
//                     </p>
//                     <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
//                       {statusLine}
//                     </p>
//                   </div>
//                   <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
//                 </div>
//                 {errors > 0 && (
//                   <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
//                     <span className="mt-[2px] text-xs">⚠️</span>
//                     <p>
//                       {errors} {t(lang, "dash.attention")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//             <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
//               <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
//                 <div>
//                   <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
//                     {t(lang, "dash.deviceOverview")}
//                   </p>
//                   <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
//                     {t(lang, "dash.receptionLiveHeading")}
//                   </h2>
//                 </div>
//                 <div className={isDark ? "text-[11px] sm:text-xs text-slate-400" : "text-[11px] sm:text-xs text-slate-500"}>{statusLine}</div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
//                 {devicesWithStatus.map((device) => (
//                   <CabinCard
//                     key={device._id}
//                     theme={theme}
//                     lang={lang}
//                     device={device}
//                     onShowDetails={() => openDetails(device)}
//                     onQuickStart={() => openStartModal(device)}
//                     onRequestMaintenance={() => openMaintenanceModal(device)}
//                     onEndMaintenance={() => endMaintenance(device._id)}
//                     onCancelSession={() => openCancelConfirm(device)}
//                     onMarkCleaning={() => openCleaningModal(device)}
//                     onEndCleaning={() => endCleaning(device._id)}
//                     onUnlock={() => unlockDevice(device._id)}
//                     onAddUser={() => setAddUserModal(device)}
//                   />
//                 ))}
//               </div>
//             </section>
//           </>
//         )}
//       </div>
//       {/* Modals */}
//       {maintenanceTarget && (
//         <MaintenanceModal
//           isDark={isDark}
//           lang={lang}
//           device={maintenanceTarget}
//           onCancel={closeMaintenanceModal}
//           onConfirm={confirmMaintenance}
//         />
//       )}
//       {detailsCabin && (
//         <EnhancedCabinDetailsModal
//           isDark={isDark}
//           lang={lang}
//           device={detailsCabin}
//           bookings={detailsBookings}
//           logs={getDeviceLogs(detailsCabin._id)}
//           sessionUsers={localSessions[detailsCabin._id]?.users || []}
//           activeTab={detailsTab}
//           onTabChange={setDetailsTab}
//           onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
//           onClose={closeDetails}
//           onStartSession={startSessionFromDetails}
//         />
//       )}
//       {startModalDevice && (
//         <StartSessionModal
//           isDark={isDark}
//           lang={lang}
//           device={startModalDevice}
//           minutes={startMinutes}
//           setMinutes={setStartMinutes}
//           price={currentStartPrice}
//           saving={startSaving}
//           error={startError}
//           onCancel={closeStartModal}
//           onConfirm={handleConfirmStart}
//         />
//       )}
//       {addUserModal && (
//         <AddUserModal
//           isDark={isDark}
//           device={addUserModal}
//           onCancel={() => setAddUserModal(null)}
//           onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
//         />
//       )}
//       {cancelConfirmModal && (
//         <CancelConfirmModal
//           isDark={isDark}
//           lang={lang}
//           device={cancelConfirmModal}
//           onCancel={closeCancelConfirm}
//           onConfirm={confirmCancel}
//         />
//       )}
//       {cleaningModal && (
//         <CleaningModal
//           isDark={isDark}
//           lang={lang}
//           device={cleaningModal}
//           onCancel={closeCleaningModal}
//           onConfirm={confirmCleaning}
//           duration={3}
//         />
//       )}
//     </div>
//   );
// }

// /* Small components with lang from hook */
// function StatCard({ theme, label, value, tone }) {
//   const isDark = theme === "dark";
//   const chipColorsDark = {
//     neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
//     accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
//     success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
//     info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
//   };
//   const chipColorsLight = {
//     neutral: "border-slate-300 bg-slate-100 text-slate-700",
//     accent: "border-sky-300 bg-sky-50 text-sky-700",
//     success: "border-emerald-300 bg-emerald-50 text-emerald-700",
//     info: "border-cyan-300 bg-cyan-50 text-cyan-700",
//   };
//   const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
//   return isDark ? (
//     <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
//     </div>
//   ) : (
//     <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
//     </div>
//   );
// }

// function StatusPill({ isDark, text }) {
//   return (
//     <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
//       <span className="relative flex h-2 w-2">
//         <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//         <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
//       </span>
//       <span>{text}</span>
//     </div>
//   );
// }

// function CabinCard({
//   theme,
//   lang,
//   device,
//   onShowDetails,
//   onQuickStart,
//   onRequestMaintenance,
//   onEndMaintenance,
//   onCancelSession,
//   onMarkCleaning,
//   onEndCleaning,
//   onUnlock,
//   onAddUser
// }) {
//   const isDark = theme === "dark";
//   const statusStylesDark = {
//     free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
//     running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
//     cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
//     error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
//     maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
//     locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
//   };
//   const statusStylesLight = {
//     free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     running: "bg-amber-50 text-amber-700 border border-amber-200",
//     cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
//     error: "bg-rose-50 text-rose-700 border border-rose-200",
//     maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
//     locked: "bg-purple-50 text-purple-700 border border-purple-200",
//   };
//   const effectiveStatus = device.maintenance ? "maintenance" : device.status;
//   const statusClass = isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
//   const cardClass = isDark
//     ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
//     : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
//   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
//   const metaColor = isDark ? "text-slate-400" : "text-slate-500";
//   const imageUrl = device.imageUrl;

//   // Button text based on state
//   const getButtonText = () => {
//     switch (device.buttonState) {
//       case "cancel": return "Cancel";
//       case "cleaning": return "Cleaning";
//       case "endCleaning":
//       case "completeCleaning": return "End Cleaning";
//       case "unlock": return "Unlock";
//       case "start": return "Start";
//       default: return "Start";
//     }
//   };

//   const handleButtonClick = () => {
//     switch (device.buttonState) {
//       case "cancel": return onCancelSession();
//       case "cleaning": return onMarkCleaning();
//       case "endCleaning":
//       case "completeCleaning": return onEndCleaning();
//       case "unlock": return onUnlock();
//       case "start": return onQuickStart();
//       default: return onQuickStart();
//     }
//   };

//   const getButtonClass = () => {
//     switch (device.buttonState) {
//       case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
//       case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
//       case "endCleaning":
//       case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
//       case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
//       case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//       default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//     }
//   };

//   return (
//     <article className={cardClass}>
//       <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
//         {imageUrl ? (
//           <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
//         ) : (
//           <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">{t(lang, "cabin.noImage")}</div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />
//       </div>
//       <header className="flex items-start justify-between gap-2">
//         <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
//         <span className={statusClass + " rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide"}>
//           {device.maintenance ? t(lang, "status.maintenance").toUpperCase() : (device.status || "").toUpperCase()}
//         </span>
//       </header>
//       <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.code ? `${device.code} · ${device.name}` : device.name}</h3>
//       <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>⏱</span>
//           <span>
//             {device.maintenance
//               ? t(lang, "cabin.maintenanceTest")
//               : device.minutesLeft > 0 || device.secondsLeft > 0
//               ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
//               : `0 ${t(lang, "cabin.min")}`}
//           </span>
//         </div>
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>👤</span>
//           <span>{trDynamic(lang, device.currentCustomer || t(lang, "cabin.noActiveCustomer"))}</span>
//         </div>
//       </div>
//       <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
//         <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//           {t(lang, "btn.details")}
//         </button>
//         {!device.maintenance ? (
//           <>
//             <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
//               {getButtonText()}
//             </button>
//             {device.status !== "cleaning" && device.status !== "running" && (
//               <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
//                 <span>{t(lang, "btn.maintenance")}</span>
//               </button>
//             )}
//           </>
//         ) : (
//           <button onClick={onEndMaintenance} className={(isDark ? "bg-violet-600 text-violet-50 hover:bg-violet-500" : "bg-violet-500 text-white hover:bg-violet-400") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//             {t(lang, "btn.endMaintenance")}
//           </button>
//         )}
//       </div>
//       {/* Add User Button for running sessions */}
//       {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
//         <button
//           onClick={onAddUser}
//           className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
//         >
//           + Add Another User ({device.sessionUsers.length})
//         </button>
//       )}
//     </article>
//   );
// }

// function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🔧</div>
//           <h2 className="text-base sm:text-lg font-semibold">{t(lang, "maintenance.title")}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {t(lang, "maintenance.desc")}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-amber-400">This will cancel any active session on this device.</p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
//             {t(lang, "maintenance.startBtn")}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {t(lang, "btn.cancel")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl">⚠️</div>
//           <h2 className="text-base sm:text-lg font-semibold">Cancel Session</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Are you sure you want to cancel the session on{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
//             After cancellation, the device will be marked for cleaning for 3 minutes automatically.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
//             Cancel Session
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Keep Running
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🧹</div>
//           <h2 className="text-base sm:text-lg font-semibold">Mark for Cleaning</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Mark <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span> for cleaning?
//           </p>
//           <p className="text-[11px] text-sky-400">
//             The device will be unavailable for {duration} minutes for cleaning.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
//             Start Cleaning
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EnhancedCabinDetailsModal({
//   isDark,
//   lang,
//   device,
//   bookings,
//   logs,
//   sessionUsers,
//   activeTab,
//   onTabChange,
//   onRemoveUser,
//   onClose,
//   onStartSession
// }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl space-y-4"}>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">KABINEN-DETAILS</p>
//             <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="text-[11px] sm:text-xs text-slate-500">
//               {device.category || "Gerät"} · {device.type || "SUNLIGHT"}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
//             ✕
//           </button>
//         </div>
//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             onClick={() => onTabChange("users")}
//             className={`px-4 py-2 text-sm ${activeTab === "users" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Users ({sessionUsers.length})
//           </button>
//           <button
//             onClick={() => onTabChange("bookings")}
//             className={`px-4 py-2 text-sm ${activeTab === "bookings" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Bookings ({bookings.length})
//           </button>
//           <button
//             onClick={() => onTabChange("logs")}
//             className={`px-4 py-2 text-sm ${activeTab === "logs" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Maintenance Logs ({logs.length})
//           </button>
//         </div>
//         {/* Tab Content */}
//         <div className="max-h-64 overflow-y-auto">
//           {activeTab === "users" && (
//             <div className="space-y-2">
//               {sessionUsers.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No users logged in</p>
//               ) : (
//                 sessionUsers.map((user, index) => (
//                   <div key={user.id} className="flex justify-between items-center p-2 border rounded">
//                     <div>
//                       <div className="font-medium">{user.name}</div>
//                       <div className="text-xs text-slate-500">
//                         Started: {new Date(user.startTime).toLocaleTimeString()}
//                       </div>
//                       <div className="text-xs text-slate-500">
//                         Duration: {user.duration} minutes
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => onRemoveUser(user.id)}
//                       className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "bookings" && (
//             <div className="space-y-2">
//               {bookings.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">{t(lang, "details.noBookings")}</p>
//               ) : (
//                 bookings.map((b) => (
//                   <div key={b._id} className="border rounded-lg px-3 py-1.5">
//                     <div className="font-medium">
//                       {b.startTime} · {b.durationMinutes} {t(lang, "cabin.min")}
//                     </div>
//                     <div className="text-slate-500 text-sm">
//                       {trDynamic(lang, b.customerName || t(lang, "details.unnamedBooking"))}
//                     </div>
//                     <div className={`text-xs ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
//                       {b.status}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "logs" && (
//             <div className="space-y-2">
//               {logs.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No maintenance logs</p>
//               ) : (
//                 logs.map((log) => (
//                   <div key={log.id} className="border rounded-lg p-2">
//                     <div className="flex justify-between">
//                       <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
//                         {log.action.replace('_', ' ')}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         {new Date(log.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                     {log.note && <div className="text-sm mt-1">{log.note}</div>}
//                     {log.duration > 0 && (
//                       <div className="text-xs text-slate-500">Duration: {log.duration} seconds</div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end">
//           <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
//             {t(lang, "btn.close")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // UPDATED: Start Session Modal with ALL CLIENT CHANGES - CUSTOMER NAME INPUT REMOVED
// function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
//   const [lastMinutes, setLastMinutes] = useState(20);

//   useEffect(() => {
//     // Get last duration for default customer
//     getLastDuration("Walk-in Customer").then(d => {
//       if (d !== null) setLastMinutes(d);
//     });
//   }, []);

//   useEffect(() => {
//     setMinutes(lastMinutes);
//   }, [lastMinutes]);

//   // FIXED: Minimum time from 4 to 5 minutes (German law)
//   const minMin = 5; // Changed from 4 to 5
//   const maxMin = 25;

//   const adjustMinutes = (delta) => {
//     setMinutes((prev) => {
//       let next = prev + delta;
//       if (next < minMin) next = minMin;
//       if (next > maxMin) next = maxMin;
//       return next;
//     });
//   };

//   const setToMin = () => setMinutes(minMin);
//   const setToLast = () => setMinutes(lastMinutes);
//   const setToMax = () => setMinutes(maxMin);

//   const helpfulMessage = "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen.";

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
//         {/* Header - REDUCED FONT SIZES */}
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SITZUNG STARTEN</p>
//             <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="mt-0.5 text-[10px] text-slate-500">Sitzungszeit (5-25 Minuten) vor dem Start festlegen.</p>
//           </div>
//           <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
//             ×
//           </button>
//         </div>

//         <div className="space-y-3">
//           {/* CUSTOMER NAME INPUT REMOVED AS REQUESTED */}

//           <p className="text-[10px] font-medium text-slate-500">Sitzungsdauer auswählen</p>

//           {/* Duration Controls - UPDATED: Bigger + - buttons with spacing */}
//           <div className="flex items-center justify-center gap-4"> {/* Increased gap from 3 to 4 */}
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(-1)} 
//               disabled={saving || minutes <= minMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"} // Changed w-8 h-8 to w-10 h-10, text-lg to text-xl
//             >
//               −
//             </button>
//             <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
//               {minutes} Min
//             </div>
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(1)} 
//               disabled={saving || minutes >= maxMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"} // Changed w-8 h-8 to w-10 h-10, text-lg to text-xl
//             >
//               +
//             </button>
//           </div>

//           {/* Time Presets - UPDATED: Added frames/borders to all 3 buttons */}
//           <div className="grid grid-cols-3 gap-2">
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Minimum</label>
//               <button 
//                 onClick={setToMin} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
//               >
//                 {minMin} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Letzte Buchung</label>
//               <button 
//                 onClick={setToLast} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
//               >
//                 {lastMinutes} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Maximum</label>
//               <button 
//                 onClick={setToMax} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`} // Added border and background
//               >
//                 {maxMin} Min
//               </button>
//             </div>
//           </div>

//           {/* Help Message */}
//           <div className="mt-2 text-center text-[10px] italic text-slate-400">
//             {helpfulMessage}
//           </div>

//           {/* Price Display */}
//           <div className="flex items-center justify-end gap-2">
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500">Geschätzter Preis</p>
//               <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

//         {/* Action Buttons */}
//         <button 
//           onClick={onConfirm} 
//           disabled={saving} 
//           className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
//         >
//           {saving ? "Wird gestartet..." : "Sitzung starten"}
//         </button>
//         <button 
//           onClick={onCancel} 
//           disabled={saving} 
//           className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
//         >
//           Abbrechen
//         </button>
//       </div>
//     </div>
//   );
// }

// function AddUserModal({ isDark, device, onCancel, onConfirm }) {
//   const [userName, setUserName] = useState("");
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <h3 className="text-lg font-semibold mb-2">Add User to {device.name}</h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Enter user name"
//               className="w-full px-3 py-2 border rounded-lg bg-transparent"
//               autoFocus
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={onCancel}
//               className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onConfirm(userName)}
//               disabled={!userName.trim()}
//               className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
//             >
//               Add User
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

// // src/pages/Dashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { t, trDynamic } from "../i18n";
// import { useLanguage } from "../context/LanguageContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-two-orpin-12.vercel.app";

// const LOCAL_SESSIONS_KEY = "aios:runningSessions";
// const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";

// async function fetchJSON(url, options = {}, timeoutMs = 12000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);
//   try {
//     const res = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }

// async function getLastDuration(customerName) {
//   try {
//     const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (!Array.isArray(data) || data.length === 0) return null;
//     const sorted = data.sort((a, b) => {
//       const dateA = new Date(a.date + ' ' + a.startTime);
//       const dateB = new Date(b.date + ' ' + b.startTime);
//       return dateB - dateA;
//     });
//     return sorted[0].durationMinutes;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// // Timer Display Component with seconds
// function TimerWithSeconds({ minutesLeft, secondsLeft }) {
//   return (
//     <div className="text-center">
//       <div className="text-2xl font-mono font-bold">
//         {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
//       </div>
//       <div className="text-xs text-slate-500 mt-1">remaining</div>
//     </div>
//   );
// }

// function Dashboard({ theme }) {
//   const isDark = theme === "dark";
//   const { language } = useLanguage();
//   const lang = language || "en";
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
//   const [bookings, setBookings] = useState([]);
//   const [maintenanceTarget, setMaintenanceTarget] = useState(null);
//   const [detailsCabin, setDetailsCabin] = useState(null);
//   const [detailsTab, setDetailsTab] = useState("users");
//   const [now, setNow] = useState(() => new Date());
//   const [localSessions, setLocalSessions] = useState({});
//   const [maintenanceLogs, setMaintenanceLogs] = useState({});
//   const [startModalDevice, setStartModalDevice] = useState(null);
//   const [startMinutes, setStartMinutes] = useState(20);
//   const [startSaving, setStartSaving] = useState(false);
//   const [startError, setStartError] = useState("");
//   const [addUserModal, setAddUserModal] = useState(null);
//   const [cleaningModal, setCleaningModal] = useState(null);
//   const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

//   // NEW STATE FOR CUSTOMER SEARCH
//   const [customerSearch, setCustomerSearch] = useState("");

//   // Load local data
//   useEffect(() => {
//     try {
//       // Load sessions
//       const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
//       if (sessionsRaw) {
//         const parsed = JSON.parse(sessionsRaw);
//         const nowTs = Date.now();
//         const cleaned = {};
//         Object.entries(parsed).forEach(([cabinId, session]) => {
//           if (session?.endAt > nowTs) {
//             cleaned[cabinId] = session;
//           } else if (session?.status === "running") {
//             // Auto-start cleaning when session ends
//             cleaned[cabinId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//           }
//         });
//         setLocalSessions(cleaned);
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
//       }
//       // Load maintenance logs
//       const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
//       if (logsRaw) {
//         setMaintenanceLogs(JSON.parse(logsRaw));
//       }
//     } catch (e) {
//       console.error("Failed to load local data", e);
//     }
//   }, []);

//   // Timer update every second for seconds display
//   useEffect(() => {
//     const id = setInterval(() => {
//       setNow(new Date());
//       // Update local sessions and check for automatic cleaning
//       setLocalSessions((prev) => {
//         const nowTs = Date.now();
//         const updated = {};
//         let changed = false;
//         Object.entries(prev).forEach(([deviceId, session]) => {
//           if (session?.endAt > nowTs) {
//             updated[deviceId] = session;
//           } else if (session?.status === "running") {
//             // Session ended - automatically start 3 minutes cleaning
//             updated[deviceId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//             changed = true;
//           } else {
//             changed = true;
//           }
//         });
//         if (changed) {
//           try {
//             localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//           } catch (e) {}
//         }
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   // Load devices
//   useEffect(() => {
//     let mounted = true;
//     const fetchCabins = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetchJSON(`${API_BASE}/api/cabins`, {}, 12000);
//         if (!res.ok) throw new Error("Failed to fetch cabins");
//         const data = await res.json();
//         if (!mounted) return;
//         setDevices(Array.isArray(data) ? data : []);
//       } catch (err) {
//         if (!mounted) return;
//         setError(t(lang, "dash.loadError"));
//       } finally {
//         if (!mounted) return;
//         setLoading(false);
//       }
//     };
//     fetchCabins();
//     return () => { mounted = false; };
//   }, [lang]);

//   // Load bookings
//   useEffect(() => {
//     let mounted = true;
//     const fetchBookings = async () => {
//       try {
//         const params = new URLSearchParams({ date: selectedDate }).toString();
//         const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
//         if (!res.ok) return;
//         const data = await res.json();
//         if (!mounted) return;
//         setBookings(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (mounted) setBookings([]);
//       }
//     };
//     fetchBookings();
//     return () => { mounted = false; };
//   }, [selectedDate]);

//   const toMinutes = (hhmm) => {
//     if (!hhmm) return 0;
//     const [h, m] = hhmm.split(":").map(Number);
//     return h * 60 + m;
//   };

//   // Calculate device status with seconds
//   const devicesWithStatus = useMemo(() => {
//     if (!devices.length) return [];
//     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//     const nowSeconds = now.getSeconds();
//     const nowTs = now.getTime();
//     return devices.map((dev) => {
//       const devBookings = bookings
//         .filter((b) => b.cabinId === dev._id)
//         .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//       let active = null;
//       for (const b of devBookings) {
//         if (b.status === "cancelled") continue;
//         const start = toMinutes(b.startTime);
//         const end = start + (b.durationMinutes || 0);
//         if (start <= nowMinutes && nowMinutes < end) {
//           active = { ...b, start, end };
//           break;
//         }
//       }
//       const localSession = localSessions[dev._id];
//       const sessionUsers = localSession?.users || [];
//       let status = dev.status || "free";
//       let minutesLeft = 0;
//       let secondsLeft = 0;
//       let currentCustomer = dev.currentCustomer || dev.customer || "";
//       let buttonState = "start";
//       if (dev.maintenance) {
//         status = "maintenance";
//       } else if (localSession && localSession.endAt > nowTs) {
//         const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
//         minutesLeft = Math.floor(totalSecondsLeft / 60);
//         secondsLeft = totalSecondsLeft % 60;

//         if (localSession.status === "cleaning") {
//           status = "cleaning";
//           buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
//         } else if (localSession.status === "locked") {
//           status = "locked";
//           buttonState = "unlock";
//         } else {
//           status = "running";
//           buttonState = "cancel";
//         }

//         currentCustomer = sessionUsers.length > 0
//           ? `${sessionUsers.length} user(s) logged in`
//           : t(lang, "cabin.inUse");
//       } else if (active) {
//         status = "running";
//         minutesLeft = Math.max(0, active.end - nowMinutes);
//         secondsLeft = 60 - nowSeconds;
//         buttonState = "cancel";
//         currentCustomer = active.customerName || t(lang, "cabin.inUse");
//       } else {
//         status = status || "free";
//         buttonState = "start";
//         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
//       }
//       return {
//         ...dev,
//         status,
//         minutesLeft,
//         secondsLeft,
//         sessionUsers,
//         currentCustomer,
//         buttonState,
//         sessionData: localSession
//       };
//     });
//   }, [devices, bookings, now, localSessions, lang]);

//   // Get price for minutes (WITH 3-MINUTE PRE-RUN)
//   const getPriceForMinutes = (device, minutes) => {
//     if (device?.minutePricing && typeof device.minutePricing === "object") {
//       let total = 0;
//       // Calculate price for selected minutes (NOT including pre-run)
//       for (let i = 1; i <= minutes; i++) {
//         const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
//         total += minutePrice;
//       }
//       return total;
//     }
//     const base = device?.baseMinutePrice ?? 2;
//     return base * minutes;
//   };

//   // Start session WITH 3-MINUTE PRE-RUN
//   const startSession = async (device, selectedMinutes, customerName = "Walk-in Customer") => {
//     try {
//       setStartSaving(true);
//       setStartError("");

//       // ADD 3 MINUTES FOR PRE-RUN
//       const actualDurationMinutes = selectedMinutes + 3;

//       const nowLocal = new Date();
//       const h = String(nowLocal.getHours()).padStart(2, "0");
//       const m = String(nowLocal.getMinutes()).padStart(2, "0");
//       const startTime = `${h}:${m}`;

//       const body = {
//         cabinId: device._id,
//         date: selectedDate,
//         startTime,
//         durationMinutes: actualDurationMinutes, // Store actual duration (selected + 3)
//         status: "booked",
//         customerName,
//       };

//       const res = await fetchJSON(
//         `${API_BASE}/api/bookings`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         },
//         12000
//       );

//       if (!res.ok) {
//         setStartError(t(lang, "start.serverError"));
//         return false;
//       }

//       const saved = await res.json();
//       setBookings((prev) => [...prev, saved]);

//       const endAt = Date.now() + actualDurationMinutes * 60 * 1000;
//       const newUser = {
//         id: Date.now(),
//         name: customerName,
//         startTime: new Date().toISOString(),
//         duration: actualDurationMinutes
//       };

//       setLocalSessions((prev) => {
//         const updated = {
//           ...prev,
//           [device._id]: {
//             endAt,
//             status: "running",
//             users: [newUser],
//             selectedDuration: selectedMinutes, // Store original selected duration
//             actualDuration: actualDurationMinutes // Store actual duration with pre-run
//           }
//         };
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       return true;
//     } catch (e) {
//       setStartError(t(lang, "start.networkError"));
//       return false;
//     } finally {
//       setStartSaving(false);
//     }
//   };

//   // Start session from details modal
//   const startSessionFromDetails = async (device, durationSeconds, price) => {
//     try {
//       const durationMinutes = Math.ceil(durationSeconds / 60);
//       return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
//     } catch (error) {
//       console.error("Failed to start session from details:", error);
//       return false;
//     }
//   };

//   // Cancel session with confirmation
//   const cancelSession = async (deviceId) => {
//     try {
//       // Remove from local sessions
//       setLocalSessions((prev) => {
//         const updated = { ...prev };
//         const session = updated[deviceId];

//         // Automatically start 3 minutes cleaning when cancelling
//         if (session?.status === "running") {
//           updated[deviceId] = {
//             ...session,
//             endAt: Date.now() + (3 * 60 * 1000), // 3 minutes cleaning
//             status: "cleaning",
//             autoCleaning: true
//           };
//         } else {
//           delete updated[deviceId];
//         }

//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       // Update backend booking status if exists
//       const device = devices.find(d => d._id === deviceId);
//       if (device) {
//         const activeBooking = bookings.find(b =>
//           b.cabinId === deviceId &&
//           b.status !== "cancelled" &&
//           !b.status?.includes("completed")
//         );

//         if (activeBooking) {
//           await fetchJSON(
//             `${API_BASE}/api/bookings/${activeBooking._id}`,
//             {
//               method: "PATCH",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ status: "cancelled" }),
//             },
//             12000
//           );

//           // Update local bookings state
//           setBookings(prev => prev.map(b =>
//             b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
//           ));
//         }
//       }
//     } catch (e) {
//       console.error("Failed to cancel session", e);
//     } finally {
//       setCancelConfirmModal(null);
//     }
//   };

//   // Mark as cleaning
//   const markAsCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const session = prev[deviceId];
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...session,
//           endAt: Date.now() + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//           status: "cleaning",
//           autoCleaning: false
//         }
//       };
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // End cleaning
//   const endCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Unlock device
//   const unlockDevice = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Add user to session
//   const addUserToSession = (deviceId, userName) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const newUser = {
//         id: Date.now(),
//         name: userName,
//         startTime: new Date().toISOString(),
//         duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
//       };
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: [...existingSession.users, newUser]
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//     setAddUserModal(null);
//   };

//   // Remove user from session
//   const removeUserFromSession = (deviceId, userId) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const updatedUsers = existingSession.users.filter(user => user.id !== userId);

//       if (updatedUsers.length === 0) {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       }
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: updatedUsers
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//   };

//   // Start maintenance
//   const startMaintenance = async (deviceId) => {
//     try {
//       const timestamp = new Date().toISOString();
//       const logEntry = {
//         id: Date.now(),
//         deviceId,
//         action: "maintenance_started",
//         timestamp,
//         note: "Maintenance initiated",
//         duration: 0
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
//       ));
//       // Clear any local session
//       setLocalSessions(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         return updated;
//       });
//       // Update backend
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: true,
//             maintenanceStart: timestamp
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance", e);
//       return false;
//     }
//   };

//   // End maintenance
//   const endMaintenance = async (deviceId) => {
//     try {
//       const device = devices.find(d => d._id === deviceId);
//       const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
//       const endTime = new Date();
//       const duration = Math.round((endTime - startTime) / 1000);
//       const logEntry = {
//         id : Date.now(),
//         deviceId,
//         action: "maintenance_completed",
//         timestamp: endTime.toISOString(),
//         note: "Maintenance completed",
//         duration
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
//       ));
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: false,
//             maintenanceEnd: endTime.toISOString(),
//             maintenanceDuration: duration
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance end", e);
//       return false;
//     }
//   };

//   // Get device logs
//   const getDeviceLogs = (deviceId) => {
//     return maintenanceLogs[deviceId] || [];
//   };

//   const total = devicesWithStatus.length;
//   const running = devicesWithStatus.filter((d) => d.status === "running").length;
//   const free = devicesWithStatus.filter((d) => d.status === "free").length;
//   const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
//   const errors = devicesWithStatus.filter((d) => d.status === "error").length;
//   const inMaintenance = devicesWithStatus.filter((d) => d.maintenance).length;

//   const openStartModal = (device) => {
//     setStartModalDevice(device);
//     setStartMinutes(20);
//     setStartError("");
//   };

//   const openMaintenanceModal = (device) => setMaintenanceTarget(device);
//   const openDetails = (device) => {
//     setDetailsCabin(device);
//     setDetailsTab("users");
//   };
//   const openCancelConfirm = (device) => setCancelConfirmModal(device);
//   const openCleaningModal = (device) => setCleaningModal(device);

//   const closeStartModal = () => {
//     if (startSaving) return;
//     setStartModalDevice(null);
//   };
//   const closeMaintenanceModal = () => setMaintenanceTarget(null);
//   const closeDetails = () => setDetailsCabin(null);
//   const closeCancelConfirm = () => setCancelConfirmModal(null);
//   const closeCleaningModal = () => setCleaningModal(null);

//   const handleConfirmStart = async () => {
//     if (!startModalDevice) return;
//     const success = await startSession(startModalDevice, startMinutes, t(lang, "misc.walkIn"));
//     if (success) {
//       closeStartModal();
//     }
//   };

//   const confirmMaintenance = async () => {
//     if (!maintenanceTarget) return;
//     await startMaintenance(maintenanceTarget._id);
//     closeMaintenanceModal();
//   };

//   const confirmCancel = async () => {
//     if (!cancelConfirmModal) return;
//     await cancelSession(cancelConfirmModal._id);
//   };

//   const confirmCleaning = () => {
//     if (!cleaningModal) return;
//     markAsCleaning(cleaningModal._id);
//     closeCleaningModal();
//   };

//   const detailsBookings = useMemo(() => {
//     if (!detailsCabin) return [];
//     return bookings
//       .filter((b) => b.cabinId === detailsCabin._id)
//       .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//   }, [detailsCabin, bookings]);

//   const currentStartPrice = startModalDevice && startMinutes
//     ? getPriceForMinutes(startModalDevice, startMinutes)
//     : 0;

//   const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
//     running,
//     free,
//     cleaning,
//     errors,
//     s: errors !== 1 ? "s" : "",
//     inMaintenance,
//   });

//   return (
//     <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
//         {/* Header - UPDATED: Added SEARCH FIELD at Top Right */}
//         <section className="space-y-2 sm:space-y-3 relative">
//           <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
//             AIOS-SYSTEMS
//           </p>

//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
//                 {t(lang, "dash.title")}
//               </h1>
//               <p className={isDark ? "text-xs sm:text-sm text-slate-400" : "text-xs sm:text-sm text-slate-600"}>
//                 {t(lang, "dash.subtitle")}
//               </p>
//             </div>

//             {/* SEARCH FIELD - Top Right */}
//             <div className={`flex flex-col items-end ${isDark ? "text-slate-300" : "text-slate-700"}`}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={customerSearch}
//                   onChange={(e) => setCustomerSearch(e.target.value)}
//                   placeholder={lang === "de" ? "Kundensuche..." : "Search customer..."}
//                   className={`pl-9 pr-3 py-2 rounded-lg text-sm ${isDark 
//                     ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
//                     : "bg-white border-slate-300 text-gray-900 placeholder:text-slate-400"
//                   } border focus:outline-none focus:ring-2 ${isDark ? "focus:ring-emerald-500" : "focus:ring-emerald-400"} focus:border-transparent w-48 sm:w-56`}
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <svg className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 {customerSearch && (
//                   <button
//                     onClick={() => setCustomerSearch("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>
//               <p className="text-xs text-slate-500 mt-1">{lang === "de" ? "Suchen Sie nach Kunden" : "Search for customers"}</p>
//             </div>
//           </div>
//         </section>

//         {loading && (
//           <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {t(lang, "dash.loadingCabins")}
//           </div>
//         )}
//         {error && !loading && (
//           <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {error}
//           </div>
//         )}
//         {!loading && !error && (
//           <>
//             <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
//                 <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
//                 <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
//                 <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
//               </div>
//               <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div>
//                     <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
//                       {t(lang, "dash.liveStatus")}
//                     </p>
//                     <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
//                       {statusLine}
//                     </p>
//                   </div>
//                   <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
//                 </div>
//                 {errors > 0 && (
//                   <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
//                     <span className="mt-[2px] text-xs">⚠️</span>
//                     <p>
//                       {errors} {t(lang, "dash.attention")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//             <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
//               <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
//                 <div>
//                   <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
//                     {t(lang, "dash.deviceOverview")}
//                   </p>
//                   <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
//                     {t(lang, "dash.receptionLiveHeading")}
//                   </h2>
//                 </div>
//                 <div className={isDark ? "text-[11px] sm:text-xs text-slate-400" : "text-[11px] sm:text-xs text-slate-500"}>{statusLine}</div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
//                 {devicesWithStatus.map((device) => (
//                   <CabinCard
//                     key={device._id}
//                     theme={theme}
//                     lang={lang}
//                     device={device}
//                     onShowDetails={() => openDetails(device)}
//                     onQuickStart={() => openStartModal(device)}
//                     onRequestMaintenance={() => openMaintenanceModal(device)}
//                     onEndMaintenance={() => endMaintenance(device._id)}
//                     onCancelSession={() => openCancelConfirm(device)}
//                     onMarkCleaning={() => openCleaningModal(device)}
//                     onEndCleaning={() => endCleaning(device._id)}
//                     onUnlock={() => unlockDevice(device._id)}
//                     onAddUser={() => setAddUserModal(device)}
//                   />
//                 ))}
//               </div>
//             </section>
//           </>
//         )}
//       </div>
//       {/* Modals */}
//       {maintenanceTarget && (
//         <MaintenanceModal
//           isDark={isDark}
//           lang={lang}
//           device={maintenanceTarget}
//           onCancel={closeMaintenanceModal}
//           onConfirm={confirmMaintenance}
//         />
//       )}
//       {detailsCabin && (
//         <EnhancedCabinDetailsModal
//           isDark={isDark}
//           lang={lang}
//           device={detailsCabin}
//           bookings={detailsBookings}
//           logs={getDeviceLogs(detailsCabin._id)}
//           sessionUsers={localSessions[detailsCabin._id]?.users || []}
//           activeTab={detailsTab}
//           onTabChange={setDetailsTab}
//           onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
//           onClose={closeDetails}
//           onStartSession={startSessionFromDetails}
//         />
//       )}
//       {startModalDevice && (
//         <StartSessionModal
//           isDark={isDark}
//           lang={lang}
//           device={startModalDevice}
//           minutes={startMinutes}
//           setMinutes={setStartMinutes}
//           price={currentStartPrice}
//           saving={startSaving}
//           error={startError}
//           onCancel={closeStartModal}
//           onConfirm={handleConfirmStart}
//         />
//       )}
//       {addUserModal && (
//         <AddUserModal
//           isDark={isDark}
//           device={addUserModal}
//           onCancel={() => setAddUserModal(null)}
//           onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
//         />
//       )}
//       {cancelConfirmModal && (
//         <CancelConfirmModal
//           isDark={isDark}
//           lang={lang}
//           device={cancelConfirmModal}
//           onCancel={closeCancelConfirm}
//           onConfirm={confirmCancel}
//         />
//       )}
//       {cleaningModal && (
//         <CleaningModal
//           isDark={isDark}
//           lang={lang}
//           device={cleaningModal}
//           onCancel={closeCleaningModal}
//           onConfirm={confirmCleaning}
//           duration={3}
//         />
//       )}
//     </div>
//   );
// }

// /* Small components with lang from hook */
// function StatCard({ theme, label, value, tone }) {
//   const isDark = theme === "dark";
//   const chipColorsDark = {
//     neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
//     accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
//     success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
//     info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
//   };
//   const chipColorsLight = {
//     neutral: "border-slate-300 bg-slate-100 text-slate-700",
//     accent: "border-sky-300 bg-sky-50 text-sky-700",
//     success: "border-emerald-300 bg-emerald-50 text-emerald-700",
//     info: "border-cyan-300 bg-cyan-50 text-cyan-700",
//   };
//   const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
//   return isDark ? (
//     <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
//     </div>
//   ) : (
//     <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
//     </div>
//   );
// }

// function StatusPill({ isDark, text }) {
//   return (
//     <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
//       <span className="relative flex h-2 w-2">
//         <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//         <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
//       </span>
//       <span>{text}</span>
//     </div>
//   );
// }

// function CabinCard({
//   theme,
//   lang,
//   device,
//   onShowDetails,
//   onQuickStart,
//   onRequestMaintenance,
//   onEndMaintenance,
//   onCancelSession,
//   onMarkCleaning,
//   onEndCleaning,
//   onUnlock,
//   onAddUser
// }) {
//   const isDark = theme === "dark";
//   const statusStylesDark = {
//     free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
//     running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
//     cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
//     error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
//     maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
//     locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
//   };
//   const statusStylesLight = {
//     free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     running: "bg-amber-50 text-amber-700 border border-amber-200",
//     cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
//     error: "bg-rose-50 text-rose-700 border border-rose-200",
//     maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
//     locked: "bg-purple-50 text-purple-700 border border-purple-200",
//   };
//   const effectiveStatus = device.maintenance ? "maintenance" : device.status;
//   const statusClass = isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
//   const cardClass = isDark
//     ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
//     : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
//   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
//   const metaColor = isDark ? "text-slate-400" : "text-slate-500";
//   const imageUrl = device.imageUrl;

//   // Button text based on state
//   const getButtonText = () => {
//     switch (device.buttonState) {
//       case "cancel": return "Cancel";
//       case "cleaning": return "Cleaning";
//       case "endCleaning":
//       case "completeCleaning": return "End Cleaning";
//       case "unlock": return "Unlock";
//       case "start": return "Start";
//       default: return "Start";
//     }
//   };

//   const handleButtonClick = () => {
//     switch (device.buttonState) {
//       case "cancel": return onCancelSession();
//       case "cleaning": return onMarkCleaning();
//       case "endCleaning":
//       case "completeCleaning": return onEndCleaning();
//       case "unlock": return onUnlock();
//       case "start": return onQuickStart();
//       default: return onQuickStart();
//     }
//   };

//   const getButtonClass = () => {
//     switch (device.buttonState) {
//       case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
//       case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
//       case "endCleaning":
//       case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
//       case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
//       case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//       default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//     }
//   };

//   return (
//     <article className={cardClass}>
//       <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
//         {imageUrl ? (
//           <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
//         ) : (
//           <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">{t(lang, "cabin.noImage")}</div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />
//       </div>
//       <header className="flex items-start justify-between gap-2">
//         <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
//         <span className={statusClass + " rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide"}>
//           {device.maintenance ? t(lang, "status.maintenance").toUpperCase() : (device.status || "").toUpperCase()}
//         </span>
//       </header>
//       <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.code ? `${device.code} · ${device.name}` : device.name}</h3>
//       <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>⏱</span>
//           <span>
//             {device.maintenance
//               ? t(lang, "cabin.maintenanceTest")
//               : device.minutesLeft > 0 || device.secondsLeft > 0
//               ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
//               : `0 ${t(lang, "cabin.min")}`}
//           </span>
//         </div>
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>👤</span>
//           <span>{trDynamic(lang, device.currentCustomer || t(lang, "cabin.noActiveCustomer"))}</span>
//         </div>
//       </div>
//       <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
//         <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//           {t(lang, "btn.details")}
//         </button>
//         {!device.maintenance ? (
//           <>
//             <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
//               {getButtonText()}
//             </button>
//             {device.status !== "cleaning" && device.status !== "running" && (
//               <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
//                 <span>{t(lang, "btn.maintenance")}</span>
//               </button>
//             )}
//           </>
//         ) : (
//           <button onClick={onEndMaintenance} className={(isDark ? "bg-violet-600 text-violet-50 hover:bg-violet-500" : "bg-violet-500 text-white hover:bg-violet-400") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//             {t(lang, "btn.endMaintenance")}
//           </button>
//         )}
//       </div>
//       {/* Add User Button for running sessions */}
//       {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
//         <button
//           onClick={onAddUser}
//           className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
//         >
//           + Add Another User ({device.sessionUsers.length})
//         </button>
//       )}
//     </article>
//   );
// }

// function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🔧</div>
//           <h2 className="text-base sm:text-lg font-semibold">{t(lang, "maintenance.title")}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {t(lang, "maintenance.desc")}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-amber-400">This will cancel any active session on this device.</p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
//             {t(lang, "maintenance.startBtn")}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {t(lang, "btn.cancel")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl">⚠️</div>
//           <h2 className="text-base sm:text-lg font-semibold">Cancel Session</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Are you sure you want to cancel the session on{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
//             After cancellation, the device will be marked for cleaning for 3 minutes automatically.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
//             Cancel Session
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Keep Running
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🧹</div>
//           <h2 className="text-base sm:text-lg font-semibold">Mark for Cleaning</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Mark <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span> for cleaning?
//           </p>
//           <p className="text-[11px] text-sky-400">
//             The device will be unavailable for {duration} minutes for cleaning.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
//             Start Cleaning
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EnhancedCabinDetailsModal({
//   isDark,
//   lang,
//   device,
//   bookings,
//   logs,
//   sessionUsers,
//   activeTab,
//   onTabChange,
//   onRemoveUser,
//   onClose,
//   onStartSession
// }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl space-y-4"}>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">KABINEN-DETAILS</p>
//             <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="text-[11px] sm:text-xs text-slate-500">
//               {device.category || "Gerät"} · {device.type || "SUNLIGHT"}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
//             ✕
//           </button>
//         </div>
//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             onClick={() => onTabChange("users")}
//             className={`px-4 py-2 text-sm ${activeTab === "users" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Users ({sessionUsers.length})
//           </button>
//           <button
//             onClick={() => onTabChange("bookings")}
//             className={`px-4 py-2 text-sm ${activeTab === "bookings" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Bookings ({bookings.length})
//           </button>
//           <button
//             onClick={() => onTabChange("logs")}
//             className={`px-4 py-2 text-sm ${activeTab === "logs" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Maintenance Logs ({logs.length})
//           </button>
//         </div>
//         {/* Tab Content */}
//         <div className="max-h-64 overflow-y-auto">
//           {activeTab === "users" && (
//             <div className="space-y-2">
//               {sessionUsers.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No users logged in</p>
//               ) : (
//                 sessionUsers.map((user, index) => (
//                   <div key={user.id} className="flex justify-between items-center p-2 border rounded">
//                     <div>
//                       <div className="font-medium">{user.name}</div>
//                       <div className="text-xs text-slate-500">
//                         Started: {new Date(user.startTime).toLocaleTimeString()}
//                       </div>
//                       <div className="text-xs text-slate-500">
//                         Duration: {user.duration} minutes
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => onRemoveUser(user.id)}
//                       className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "bookings" && (
//             <div className="space-y-2">
//               {bookings.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">{t(lang, "details.noBookings")}</p>
//               ) : (
//                 bookings.map((b) => (
//                   <div key={b._id} className="border rounded-lg px-3 py-1.5">
//                     <div className="font-medium">
//                       {b.startTime} · {b.durationMinutes} {t(lang, "cabin.min")}
//                     </div>
//                     <div className="text-slate-500 text-sm">
//                       {trDynamic(lang, b.customerName || t(lang, "details.unnamedBooking"))}
//                     </div>
//                     <div className={`text-xs ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
//                       {b.status}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "logs" && (
//             <div className="space-y-2">
//               {logs.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No maintenance logs</p>
//               ) : (
//                 logs.map((log) => (
//                   <div key={log.id} className="border rounded-lg p-2">
//                     <div className="flex justify-between">
//                       <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
//                         {log.action.replace('_', ' ')}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         {new Date(log.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                     {log.note && <div className="text-sm mt-1">{log.note}</div>}
//                     {log.duration > 0 && (
//                       <div className="text-xs text-slate-500">Duration: {log.duration} seconds</div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end">
//           <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
//             {t(lang, "btn.close")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // UPDATED: Start Session Modal with ALL CLIENT CHANGES - INCLUDING 4 MIN MINIMUM
// function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
//   const [lastMinutes, setLastMinutes] = useState(20);

//   useEffect(() => {
//     // Get last duration for default customer
//     getLastDuration("Walk-in Customer").then(d => {
//       if (d !== null) setLastMinutes(d);
//     });
//   }, []);

//   useEffect(() => {
//     setMinutes(lastMinutes);
//   }, [lastMinutes]);

//   // UPDATED: Minimum time changed to 4 minutes (not 5)
//   const minMin = 4; // Changed from 5 to 4 as requested
//   const maxMin = 25;

//   const adjustMinutes = (delta) => {
//     setMinutes((prev) => {
//       let next = prev + delta;
//       if (next < minMin) next = minMin;
//       if (next > maxMin) next = maxMin;
//       return next;
//     });
//   };

//   const setToMin = () => setMinutes(minMin);
//   const setToLast = () => setMinutes(lastMinutes);
//   const setToMax = () => setMinutes(maxMin);

//   const helpfulMessage = "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen.";

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
//         {/* Header - REDUCED FONT SIZES */}
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SITZUNG STARTEN</p>
//             <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="mt-0.5 text-[10px] text-slate-500">
//               Sitzungszeit ({minMin}-{maxMin} Minuten) vor dem Start festlegen.
//               <span className="block mt-1 text-emerald-400 text-[9px]">
//                 +3 Minuten Vorlaufzeit automatisch inklusive
//               </span>
//             </p>
//           </div>
//           <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
//             ×
//           </button>
//         </div>

//         <div className="space-y-3">
//           <p className="text-[10px] font-medium text-slate-500">Sitzungsdauer auswählen</p>

//           {/* Duration Controls - UPDATED: Bigger + - buttons with spacing */}
//           <div className="flex items-center justify-center gap-4">
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(-1)} 
//               disabled={saving || minutes <= minMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               −
//             </button>
//             <div className="flex flex-col items-center">
//               <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
//                 {minutes} Min
//               </div>
//               <div className="text-[9px] text-emerald-400 mt-1">
//                 +3 Min Vorlauf = {minutes + 3} Min gesamt
//               </div>
//             </div>
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(1)} 
//               disabled={saving || minutes >= maxMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               +
//             </button>
//           </div>

//           {/* Time Presets - UPDATED: Added frames/borders to all 3 buttons */}
//           <div className="grid grid-cols-3 gap-2">
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Minimum</label>
//               <button 
//                 onClick={setToMin} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 {minMin} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Letzte Buchung</label>
//               <button 
//                 onClick={setToLast} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 {lastMinutes} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <label className="text-[10px] font-medium text-slate-500">Maximum</label>
//               <button 
//                 onClick={setToMax} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 {maxMin} Min
//               </button>
//             </div>
//           </div>

//           {/* Help Message */}
//           <div className="mt-2 text-center text-[10px] italic text-slate-400">
//             {helpfulMessage}
//           </div>

//           {/* Price Display */}
//           <div className="flex items-center justify-end gap-2">
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500">Geschätzter Preis</p>
//               <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
//               <p className="text-[9px] text-emerald-400">
//                 (für {minutes} Minuten, Vorlaufzeit kostenlos)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

//         {/* Action Buttons */}
//         <div className="space-y-2">
//           <button 
//             onClick={onConfirm} 
//             disabled={saving} 
//             className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
//           >
//             {saving ? "Wird gestartet..." : `Sitzung starten (${minutes + 3} Min gesamt)`}
//           </button>
//           <button 
//             onClick={onCancel} 
//             disabled={saving} 
//             className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
//           >
//             Abbrechen
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AddUserModal({ isDark, device, onCancel, onConfirm }) {
//   const [userName, setUserName] = useState("");
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <h3 className="text-lg font-semibold mb-2">Add User to {device.name}</h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Enter user name"
//               className="w-full px-3 py-2 border rounded-lg bg-transparent"
//               autoFocus
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={onCancel}
//               className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onConfirm(userName)}
//               disabled={!userName.trim()}
//               className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
//             >
//               Add User
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;


// // src/pages/Dashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { t, trDynamic } from "../i18n";
// import { useLanguage } from "../context/LanguageContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-two-orpin-12.vercel.app";

// const LOCAL_SESSIONS_KEY = "aios:runningSessions";
// const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";

// async function fetchJSON(url, options = {}, timeoutMs = 12000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);
//   try {
//     const res = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }

// async function getLastDuration(customerName) {
//   try {
//     const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (!Array.isArray(data) || data.length === 0) return null;
//     const sorted = data.sort((a, b) => {
//       const dateA = new Date(a.date + ' ' + a.startTime);
//       const dateB = new Date(b.date + ' ' + b.startTime);
//       return dateB - dateA;
//     });
//     return sorted[0].durationMinutes - 3; // Subtract 3 minutes pre-run to get selected duration
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// // Timer Display Component with seconds
// function TimerWithSeconds({ minutesLeft, secondsLeft }) {
//   return (
//     <div className="text-center">
//       <div className="text-2xl font-mono font-bold">
//         {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
//       </div>
//       <div className="text-xs text-slate-500 mt-1">remaining</div>
//     </div>
//   );
// }

// function Dashboard({ theme }) {
//   const isDark = theme === "dark";
//   const { language } = useLanguage();
//   const lang = language || "en";
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
//   const [bookings, setBookings] = useState([]);
//   const [maintenanceTarget, setMaintenanceTarget] = useState(null);
//   const [detailsCabin, setDetailsCabin] = useState(null);
//   const [detailsTab, setDetailsTab] = useState("users");
//   const [now, setNow] = useState(() => new Date());
//   const [localSessions, setLocalSessions] = useState({});
//   const [maintenanceLogs, setMaintenanceLogs] = useState({});
//   const [startModalDevice, setStartModalDevice] = useState(null);
//   const [startMinutes, setStartMinutes] = useState(20);
//   const [startSaving, setStartSaving] = useState(false);
//   const [startError, setStartError] = useState("");
//   const [addUserModal, setAddUserModal] = useState(null);
//   const [cleaningModal, setCleaningModal] = useState(null);
//   const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

//   // Customer search state
//   const [customerSearch, setCustomerSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   // Load local data
//   useEffect(() => {
//     try {
//       // Load sessions
//       const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
//       if (sessionsRaw) {
//         const parsed = JSON.parse(sessionsRaw);
//         const nowTs = Date.now();
//         const cleaned = {};
//         Object.entries(parsed).forEach(([cabinId, session]) => {
//           if (session?.endAt > nowTs) {
//             cleaned[cabinId] = session;
//           } else if (session?.status === "running") {
//             // Auto-start cleaning when session ends
//             cleaned[cabinId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//           }
//         });
//         setLocalSessions(cleaned);
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
//       }
//       // Load maintenance logs
//       const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
//       if (logsRaw) {
//         setMaintenanceLogs(JSON.parse(logsRaw));
//       }
//     } catch (e) {
//       console.error("Failed to load local data", e);
//     }
//   }, []);

//   // Timer update every second for seconds display
//   useEffect(() => {
//     const id = setInterval(() => {
//       setNow(new Date());
//       // Update local sessions and check for automatic cleaning
//       setLocalSessions((prev) => {
//         const nowTs = Date.now();
//         const updated = {};
//         let changed = false;
//         Object.entries(prev).forEach(([deviceId, session]) => {
//           if (session?.endAt > nowTs) {
//             updated[deviceId] = session;
//           } else if (session?.status === "running") {
//             // Session ended - automatically start 3 minutes cleaning
//             updated[deviceId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//               status: "cleaning",
//               autoCleaning: true
//             };
//             changed = true;
//           } else {
//             changed = true;
//           }
//         });
//         if (changed) {
//           try {
//             localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//           } catch (e) {}
//         }
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   // Load devices
//   useEffect(() => {
//     let mounted = true;
//     const fetchCabins = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetchJSON(`${API_BASE}/api/cabins`, {}, 12000);
//         if (!res.ok) throw new Error("Failed to fetch cabins");
//         const data = await res.json();
//         if (!mounted) return;
//         setDevices(Array.isArray(data) ? data : []);
//       } catch (err) {
//         if (!mounted) return;
//         setError(t(lang, "dash.loadError"));
//       } finally {
//         if (!mounted) return;
//         setLoading(false);
//       }
//     };
//     fetchCabins();
//     return () => { mounted = false; };
//   }, [lang]);

//   // Load bookings
//   useEffect(() => {
//     let mounted = true;
//     const fetchBookings = async () => {
//       try {
//         const params = new URLSearchParams({ date: selectedDate }).toString();
//         const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
//         if (!res.ok) return;
//         const data = await res.json();
//         if (!mounted) return;
//         setBookings(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (mounted) setBookings([]);
//       }
//     };
//     fetchBookings();
//     return () => { mounted = false; };
//   }, [selectedDate]);

//   // Search customers when search term changes
//   useEffect(() => {
//     const searchCustomers = async () => {
//       if (!customerSearch.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         setSearchLoading(true);
//         const res = await fetchJSON(`${API_BASE}/api/customers?search=${encodeURIComponent(customerSearch)}`, {});
//         if (res.ok) {
//           const data = await res.json();
//           setSearchResults(Array.isArray(data) ? data : []);
//         }
//       } catch (e) {
//         console.error("Search error:", e);
//         setSearchResults([]);
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(searchCustomers, 300);
//     return () => clearTimeout(debounceTimer);
//   }, [customerSearch]);

//   const toMinutes = (hhmm) => {
//     if (!hhmm) return 0;
//     const [h, m] = hhmm.split(":").map(Number);
//     return h * 60 + m;
//   };

//   // Calculate device status with seconds
//   const devicesWithStatus = useMemo(() => {
//     if (!devices.length) return [];
//     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//     const nowSeconds = now.getSeconds();
//     const nowTs = now.getTime();
//     return devices.map((dev) => {
//       const devBookings = bookings
//         .filter((b) => b.cabinId === dev._id)
//         .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//       let active = null;
//       for (const b of devBookings) {
//         if (b.status === "cancelled") continue;
//         const start = toMinutes(b.startTime);
//         const end = start + (b.durationMinutes || 0);
//         if (start <= nowMinutes && nowMinutes < end) {
//           active = { ...b, start, end };
//           break;
//         }
//       }
//       const localSession = localSessions[dev._id];
//       const sessionUsers = localSession?.users || [];
//       let status = dev.status || "free";
//       let minutesLeft = 0;
//       let secondsLeft = 0;
//       let currentCustomer = dev.currentCustomer || dev.customer || "";
//       let buttonState = "start";
//       if (dev.maintenance) {
//         status = "maintenance";
//       } else if (localSession && localSession.endAt > nowTs) {
//         const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
//         minutesLeft = Math.floor(totalSecondsLeft / 60);
//         secondsLeft = totalSecondsLeft % 60;

//         if (localSession.status === "cleaning") {
//           status = "cleaning";
//           buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
//         } else if (localSession.status === "locked") {
//           status = "locked";
//           buttonState = "unlock";
//         } else {
//           status = "running";
//           buttonState = "cancel";
//         }

//         currentCustomer = sessionUsers.length > 0
//           ? `${sessionUsers.length} user(s) logged in`
//           : t(lang, "cabin.inUse");
//       } else if (active) {
//         status = "running";
//         minutesLeft = Math.max(0, active.end - nowMinutes);
//         secondsLeft = 60 - nowSeconds;
//         buttonState = "cancel";
//         currentCustomer = active.customerName || t(lang, "cabin.inUse");
//       } else {
//         status = status || "free";
//         buttonState = "start";
//         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
//       }
//       return {
//         ...dev,
//         status,
//         minutesLeft,
//         secondsLeft,
//         sessionUsers,
//         currentCustomer,
//         buttonState,
//         sessionData: localSession
//       };
//     });
//   }, [devices, bookings, now, localSessions, lang]);

//   // Get price for minutes (WITH 3-MINUTE PRE-RUN)
//   const getPriceForMinutes = (device, minutes) => {
//     if (device?.minutePricing && typeof device.minutePricing === "object") {
//       let total = 0;
//       // Calculate price for selected minutes (NOT including pre-run)
//       for (let i = 1; i <= minutes; i++) {
//         const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
//         total += minutePrice;
//       }
//       return total;
//     }
//     const base = device?.baseMinutePrice ?? 2;
//     return base * minutes;
//   };

//   // Start session WITH 3-MINUTE PRE-RUN
//   const startSession = async (device, selectedMinutes, customerName = "Walk-in Customer") => {
//     try {
//       setStartSaving(true);
//       setStartError("");

//       // ADD 3 MINUTES FOR PRE-RUN
//       const actualDurationMinutes = selectedMinutes + 3;

//       const nowLocal = new Date();
//       const h = String(nowLocal.getHours()).padStart(2, "0");
//       const m = String(nowLocal.getMinutes()).padStart(2, "0");
//       const startTime = `${h}:${m}`;

//       const body = {
//         cabinId: device._id,
//         date: selectedDate,
//         startTime,
//         durationMinutes: actualDurationMinutes, // Store actual duration (selected + 3)
//         status: "booked",
//         customerName,
//       };

//       const res = await fetchJSON(
//         `${API_BASE}/api/bookings`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         },
//         12000
//       );

//       if (!res.ok) {
//         setStartError(t(lang, "start.serverError"));
//         return false;
//       }

//       const saved = await res.json();
//       setBookings((prev) => [...prev, saved]);

//       const endAt = Date.now() + actualDurationMinutes * 60 * 1000;
//       const newUser = {
//         id: Date.now(),
//         name: customerName,
//         startTime: new Date().toISOString(),
//         duration: actualDurationMinutes
//       };

//       setLocalSessions((prev) => {
//         const updated = {
//           ...prev,
//           [device._id]: {
//             endAt,
//             status: "running",
//             users: [newUser],
//             selectedDuration: selectedMinutes, // Store original selected duration
//             actualDuration: actualDurationMinutes // Store actual duration with pre-run
//           }
//         };
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       return true;
//     } catch (e) {
//       setStartError(t(lang, "start.networkError"));
//       return false;
//     } finally {
//       setStartSaving(false);
//     }
//   };

//   // Start session from details modal
//   const startSessionFromDetails = async (device, durationSeconds, price) => {
//     try {
//       const durationMinutes = Math.ceil(durationSeconds / 60);
//       return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
//     } catch (error) {
//       console.error("Failed to start session from details:", error);
//       return false;
//     }
//   };

//   // Cancel session with confirmation
//   const cancelSession = async (deviceId) => {
//     try {
//       // Remove from local sessions
//       setLocalSessions((prev) => {
//         const updated = { ...prev };
//         const session = updated[deviceId];

//         // Automatically start 3 minutes cleaning when cancelling
//         if (session?.status === "running") {
//           updated[deviceId] = {
//             ...session,
//             endAt: Date.now() + (3 * 60 * 1000), // 3 minutes cleaning
//             status: "cleaning",
//             autoCleaning: true
//           };
//         } else {
//           delete updated[deviceId];
//         }

//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       // Update backend booking status if exists
//       const device = devices.find(d => d._id === deviceId);
//       if (device) {
//         const activeBooking = bookings.find(b =>
//           b.cabinId === deviceId &&
//           b.status !== "cancelled" &&
//           !b.status?.includes("completed")
//         );

//         if (activeBooking) {
//           await fetchJSON(
//             `${API_BASE}/api/bookings/${activeBooking._id}`,
//             {
//               method: "PATCH",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ status: "cancelled" }),
//             },
//             12000
//           );

//           // Update local bookings state
//           setBookings(prev => prev.map(b =>
//             b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
//           ));
//         }
//       }
//     } catch (e) {
//       console.error("Failed to cancel session", e);
//     } finally {
//       setCancelConfirmModal(null);
//     }
//   };

//   // Mark as cleaning
//   const markAsCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const session = prev[deviceId];
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...session,
//           endAt: Date.now() + (3 * 60 * 1000), // Fixed 3 minutes cleaning
//           status: "cleaning",
//           autoCleaning: false
//         }
//       };
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // End cleaning
//   const endCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Unlock device
//   const unlockDevice = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   // Add user to session
//   const addUserToSession = (deviceId, userName) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const newUser = {
//         id: Date.now(),
//         name: userName,
//         startTime: new Date().toISOString(),
//         duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
//       };
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: [...existingSession.users, newUser]
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//     setAddUserModal(null);
//   };

//   // Remove user from session
//   const removeUserFromSession = (deviceId, userId) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const updatedUsers = existingSession.users.filter(user => user.id !== userId);

//       if (updatedUsers.length === 0) {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       }
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: updatedUsers
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//   };

//   // Start maintenance
//   const startMaintenance = async (deviceId) => {
//     try {
//       const timestamp = new Date().toISOString();
//       const logEntry = {
//         id: Date.now(),
//         deviceId,
//         action: "maintenance_started",
//         timestamp,
//         note: "Maintenance initiated",
//         duration: 0
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
//       ));
//       // Clear any local session
//       setLocalSessions(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         return updated;
//       });
//       // Update backend
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: true,
//             maintenanceStart: timestamp
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance", e);
//       return false;
//     }
//   };

//   // End maintenance
//   const endMaintenance = async (deviceId) => {
//     try {
//       const device = devices.find(d => d._id === deviceId);
//       const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
//       const endTime = new Date();
//       const duration = Math.round((endTime - startTime) / 1000);
//       const logEntry = {
//         id : Date.now(),
//         deviceId,
//         action: "maintenance_completed",
//         timestamp: endTime.toISOString(),
//         note: "Maintenance completed",
//         duration
//       };
//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });
//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
//       ));
//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: false,
//             maintenanceEnd: endTime.toISOString(),
//             maintenanceDuration: duration
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance end", e);
//       return false;
//     }
//   };

//   // Get device logs
//   const getDeviceLogs = (deviceId) => {
//     return maintenanceLogs[deviceId] || [];
//   };

//   const total = devicesWithStatus.length;
//   const running = devicesWithStatus.filter((d) => d.status === "running").length;
//   const free = devicesWithStatus.filter((d) => d.status === "free").length;
//   const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
//   const errors = devicesWithStatus.filter((d) => d.status === "error").length;
//   const inMaintenance = devicesWithStatus.filter((d) => d.maintenance).length;

//   const openStartModal = (device) => {
//     setStartModalDevice(device);
//     setStartMinutes(20);
//     setStartError("");
//   };

//   const openMaintenanceModal = (device) => setMaintenanceTarget(device);
//   const openDetails = (device) => {
//     setDetailsCabin(device);
//     setDetailsTab("users");
//   };
//   const openCancelConfirm = (device) => setCancelConfirmModal(device);
//   const openCleaningModal = (device) => setCleaningModal(device);

//   const closeStartModal = () => {
//     if (startSaving) return;
//     setStartModalDevice(null);
//   };
//   const closeMaintenanceModal = () => setMaintenanceTarget(null);
//   const closeDetails = () => setDetailsCabin(null);
//   const closeCancelConfirm = () => setCancelConfirmModal(null);
//   const closeCleaningModal = () => setCleaningModal(null);

//   const handleConfirmStart = async () => {
//     if (!startModalDevice) return;
//     const success = await startSession(startModalDevice, startMinutes, t(lang, "misc.walkIn"));
//     if (success) {
//       closeStartModal();
//     }
//   };

//   const confirmMaintenance = async () => {
//     if (!maintenanceTarget) return;
//     await startMaintenance(maintenanceTarget._id);
//     closeMaintenanceModal();
//   };

//   const confirmCancel = async () => {
//     if (!cancelConfirmModal) return;
//     await cancelSession(cancelConfirmModal._id);
//   };

//   const confirmCleaning = () => {
//     if (!cleaningModal) return;
//     markAsCleaning(cleaningModal._id);
//     closeCleaningModal();
//   };

//   const detailsBookings = useMemo(() => {
//     if (!detailsCabin) return [];
//     return bookings
//       .filter((b) => b.cabinId === detailsCabin._id)
//       .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//   }, [detailsCabin, bookings]);

//   const currentStartPrice = startModalDevice && startMinutes
//     ? getPriceForMinutes(startModalDevice, startMinutes)
//     : 0;

//   const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
//     running,
//     free,
//     cleaning,
//     errors,
//     s: errors !== 1 ? "s" : "",
//     inMaintenance,
//   });

//   return (
//     <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
//         {/* Header - UPDATED: Added SEARCH FIELD at Top Right */}
//         <section className="space-y-2 sm:space-y-3 relative">
//           <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
//             AIOS-SYSTEMS
//           </p>

//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
//                 {t(lang, "dash.title")}
//               </h1>
//               <p className={isDark ? "text-xs sm:text-sm text-slate-400" : "text-xs sm:text-sm text-slate-600"}>
//                 {t(lang, "dash.subtitle")}
//               </p>
//             </div>

//             {/* SEARCH FIELD - Top Right */}
//             <div className={`flex flex-col items-end ${isDark ? "text-slate-300" : "text-slate-700"}`}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={customerSearch}
//                   onChange={(e) => setCustomerSearch(e.target.value)}
//                   placeholder={lang === "de" ? "Kundensuche..." : "Search customer..."}
//                   className={`pl-9 pr-3 py-2 rounded-lg text-sm ${isDark 
//                     ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
//                     : "bg-white border-slate-300 text-gray-900 placeholder:text-slate-400"
//                   } border focus:outline-none focus:ring-2 ${isDark ? "focus:ring-emerald-500" : "focus:ring-emerald-400"} focus:border-transparent w-48 sm:w-56`}
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <svg className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 {customerSearch && (
//                   <button
//                     onClick={() => setCustomerSearch("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>

//               {/* Search Results Dropdown */}
//               {customerSearch && (
//                 <div className={`absolute top-full mt-1 z-50 w-56 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border rounded-lg shadow-lg`}>
//                   {searchLoading ? (
//                     <div className="p-3 text-center text-sm">Searching...</div>
//                   ) : searchResults.length > 0 ? (
//                     <div className="max-h-60 overflow-y-auto">
//                       {searchResults.map(customer => (
//                         <div 
//                           key={customer._id} 
//                           className="p-2 border-b border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
//                           onClick={() => {
//                             // Handle customer selection
//                             console.log("Selected customer:", customer);
//                             setCustomerSearch("");
//                           }}
//                         >
//                           <div className="font-medium">{customer.name}</div>
//                           <div className="text-xs text-slate-500">{customer.email}</div>
//                           <div className="text-xs text-slate-500">{customer.phone}</div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : customerSearch.length > 0 ? (
//                     <div className="p-3 text-center text-sm">No customers found</div>
//                   ) : null}
//                 </div>
//               )}

//               <p className="text-xs text-slate-500 mt-1">{lang === "de" ? "Suchen Sie nach Kunden" : "Search for customers"}</p>
//             </div>
//           </div>
//         </section>

//         {loading && (
//           <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {t(lang, "dash.loadingCabins")}
//           </div>
//         )}
//         {error && !loading && (
//           <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {error}
//           </div>
//         )}
//         {!loading && !error && (
//           <>
//             <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
//                 <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
//                 <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
//                 <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
//               </div>
//               <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div>
//                     <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
//                       {t(lang, "dash.liveStatus")}
//                     </p>
//                     <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
//                       {statusLine}
//                     </p>
//                   </div>
//                   <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
//                 </div>
//                 {errors > 0 && (
//                   <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
//                     <span className="mt-[2px] text-xs">⚠️</span>
//                     <p>
//                       {errors} {t(lang, "dash.attention")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//             <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
//               <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
//                 <div>
//                   <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
//                     {t(lang, "dash.deviceOverview")}
//                   </p>
//                   <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
//                     {t(lang, "dash.receptionLiveHeading")}
//                   </h2>
//                 </div>
//                 <div className={isDark ? "text-[11px] sm:text-xs text-slate-400" : "text-[11px] sm:text-xs text-slate-500"}>{statusLine}</div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
//                 {devicesWithStatus.map((device) => (
//                   <CabinCard
//                     key={device._id}
//                     theme={theme}
//                     lang={lang}
//                     device={device}
//                     onShowDetails={() => openDetails(device)}
//                     onQuickStart={() => openStartModal(device)}
//                     onRequestMaintenance={() => openMaintenanceModal(device)}
//                     onEndMaintenance={() => endMaintenance(device._id)}
//                     onCancelSession={() => openCancelConfirm(device)}
//                     onMarkCleaning={() => openCleaningModal(device)}
//                     onEndCleaning={() => endCleaning(device._id)}
//                     onUnlock={() => unlockDevice(device._id)}
//                     onAddUser={() => setAddUserModal(device)}
//                   />
//                 ))}
//               </div>
//             </section>
//           </>
//         )}
//       </div>
//       {/* Modals */}
//       {maintenanceTarget && (
//         <MaintenanceModal
//           isDark={isDark}
//           lang={lang}
//           device={maintenanceTarget}
//           onCancel={closeMaintenanceModal}
//           onConfirm={confirmMaintenance}
//         />
//       )}
//       {detailsCabin && (
//         <EnhancedCabinDetailsModal
//           isDark={isDark}
//           lang={lang}
//           device={detailsCabin}
//           bookings={detailsBookings}
//           logs={getDeviceLogs(detailsCabin._id)}
//           sessionUsers={localSessions[detailsCabin._id]?.users || []}
//           activeTab={detailsTab}
//           onTabChange={setDetailsTab}
//           onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
//           onClose={closeDetails}
//           onStartSession={startSessionFromDetails}
//         />
//       )}
//       {startModalDevice && (
//         <StartSessionModal
//           isDark={isDark}
//           lang={lang}
//           device={startModalDevice}
//           minutes={startMinutes}
//           setMinutes={setStartMinutes}
//           price={currentStartPrice}
//           saving={startSaving}
//           error={startError}
//           onCancel={closeStartModal}
//           onConfirm={handleConfirmStart}
//         />
//       )}
//       {addUserModal && (
//         <AddUserModal
//           isDark={isDark}
//           device={addUserModal}
//           onCancel={() => setAddUserModal(null)}
//           onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
//         />
//       )}
//       {cancelConfirmModal && (
//         <CancelConfirmModal
//           isDark={isDark}
//           lang={lang}
//           device={cancelConfirmModal}
//           onCancel={closeCancelConfirm}
//           onConfirm={confirmCancel}
//         />
//       )}
//       {cleaningModal && (
//         <CleaningModal
//           isDark={isDark}
//           lang={lang}
//           device={cleaningModal}
//           onCancel={closeCleaningModal}
//           onConfirm={confirmCleaning}
//           duration={3}
//         />
//       )}
//     </div>
//   );
// }

// /* Small components with lang from hook */
// function StatCard({ theme, label, value, tone }) {
//   const isDark = theme === "dark";
//   const chipColorsDark = {
//     neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
//     accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
//     success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
//     info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
//   };
//   const chipColorsLight = {
//     neutral: "border-slate-300 bg-slate-100 text-slate-700",
//     accent: "border-sky-300 bg-sky-50 text-sky-700",
//     success: "border-emerald-300 bg-emerald-50 text-emerald-700",
//     info: "border-cyan-300 bg-cyan-50 text-cyan-700",
//   };
//   const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
//   return isDark ? (
//     <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
//     </div>
//   ) : (
//     <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
//     </div>
//   );
// }

// function StatusPill({ isDark, text }) {
//   return (
//     <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
//       <span className="relative flex h-2 w-2">
//         <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//         <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
//       </span>
//       <span>{text}</span>
//     </div>
//   );
// }

// function CabinCard({
//   theme,
//   lang,
//   device,
//   onShowDetails,
//   onQuickStart,
//   onRequestMaintenance,
//   onEndMaintenance,
//   onCancelSession,
//   onMarkCleaning,
//   onEndCleaning,
//   onUnlock,
//   onAddUser
// }) {
//   const isDark = theme === "dark";
//   const statusStylesDark = {
//     free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
//     running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
//     cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
//     error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
//     maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
//     locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
//   };
//   const statusStylesLight = {
//     free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     running: "bg-amber-50 text-amber-700 border border-amber-200",
//     cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
//     error: "bg-rose-50 text-rose-700 border border-rose-200",
//     maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
//     locked: "bg-purple-50 text-purple-700 border border-purple-200",
//   };
//   const effectiveStatus = device.maintenance ? "maintenance" : device.status;
//   const statusClass = isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
//   const cardClass = isDark
//     ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
//     : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
//   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
//   const metaColor = isDark ? "text-slate-400" : "text-slate-500";
//   const imageUrl = device.imageUrl;

//   // Button text based on state
//   const getButtonText = () => {
//     switch (device.buttonState) {
//       case "cancel": return "Cancel";
//       case "cleaning": return "Cleaning";
//       case "endCleaning":
//       case "completeCleaning": return "End Cleaning";
//       case "unlock": return "Unlock";
//       case "start": return "Start";
//       default: return "Start";
//     }
//   };

//   const handleButtonClick = () => {
//     switch (device.buttonState) {
//       case "cancel": return onCancelSession();
//       case "cleaning": return onMarkCleaning();
//       case "endCleaning":
//       case "completeCleaning": return onEndCleaning();
//       case "unlock": return onUnlock();
//       case "start": return onQuickStart();
//       default: return onQuickStart();
//     }
//   };

//   const getButtonClass = () => {
//     switch (device.buttonState) {
//       case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
//       case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
//       case "endCleaning":
//       case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
//       case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
//       case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//       default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//     }
//   };

//   return (
//     <article className={cardClass}>
//       <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
//         {imageUrl ? (
//           <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
//         ) : (
//           <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">{t(lang, "cabin.noImage")}</div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />
//       </div>
//       <header className="flex items-start justify-between gap-2">
//         <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
//         <span className={statusClass + " rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide"}>
//           {device.maintenance ? t(lang, "status.maintenance").toUpperCase() : (device.status || "").toUpperCase()}
//         </span>
//       </header>
//       <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.code ? `${device.code} · ${device.name}` : device.name}</h3>
//       <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>⏱</span>
//           <span>
//             {device.maintenance
//               ? t(lang, "cabin.maintenanceTest")
//               : device.minutesLeft > 0 || device.secondsLeft > 0
//               ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
//               : `0 ${t(lang, "cabin.min")}`}
//           </span>
//         </div>
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>👤</span>
//           <span>{trDynamic(lang, device.currentCustomer || t(lang, "cabin.noActiveCustomer"))}</span>
//         </div>
//       </div>
//       <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
//         <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//           {t(lang, "btn.details")}
//         </button>
//         {!device.maintenance ? (
//           <>
//             <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
//               {getButtonText()}
//             </button>
//             {device.status !== "cleaning" && device.status !== "running" && (
//               <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
//                 <span>{t(lang, "btn.maintenance")}</span>
//               </button>
//             )}
//           </>
//         ) : (
//           <button onClick={onEndMaintenance} className={(isDark ? "bg-violet-600 text-violet-50 hover:bg-violet-500" : "bg-violet-500 text-white hover:bg-violet-400") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//             {t(lang, "btn.endMaintenance")}
//           </button>
//         )}
//       </div>
//       {/* Add User Button for running sessions */}
//       {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
//         <button
//           onClick={onAddUser}
//           className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
//         >
//           + Add Another User ({device.sessionUsers.length})
//         </button>
//       )}
//     </article>
//   );
// }

// function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🔧</div>
//           <h2 className="text-base sm:text-lg font-semibold">{t(lang, "maintenance.title")}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {t(lang, "maintenance.desc")}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-amber-400">This will cancel any active session on this device.</p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
//             {t(lang, "maintenance.startBtn")}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {t(lang, "btn.cancel")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl">⚠️</div>
//           <h2 className="text-base sm:text-lg font-semibold">Cancel Session</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Are you sure you want to cancel the session on{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
//             After cancellation, the device will be marked for cleaning for 3 minutes automatically.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
//             Cancel Session
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Keep Running
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🧹</div>
//           <h2 className="text-base sm:text-lg font-semibold">Mark for Cleaning</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             Mark <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span> for cleaning?
//           </p>
//           <p className="text-[11px] text-sky-400">
//             The device will be unavailable for {duration} minutes for cleaning.
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
//             Start Cleaning
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EnhancedCabinDetailsModal({
//   isDark,
//   lang,
//   device,
//   bookings,
//   logs,
//   sessionUsers,
//   activeTab,
//   onTabChange,
//   onRemoveUser,
//   onClose,
//   onStartSession
// }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl space-y-4"}>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">KABINEN-DETAILS</p>
//             <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="text-[11px] sm:text-xs text-slate-500">
//               {device.category || "Gerät"} · {device.type || "SUNLIGHT"}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
//             ✕
//           </button>
//         </div>
//         {/* Tabs */}
//         <div className="flex border-b">
//           <button
//             onClick={() => onTabChange("users")}
//             className={`px-4 py-2 text-sm ${activeTab === "users" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Users ({sessionUsers.length})
//           </button>
//           <button
//             onClick={() => onTabChange("bookings")}
//             className={`px-4 py-2 text-sm ${activeTab === "bookings" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Bookings ({bookings.length})
//           </button>
//           <button
//             onClick={() => onTabChange("logs")}
//             className={`px-4 py-2 text-sm ${activeTab === "logs" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             Maintenance Logs ({logs.length})
//           </button>
//         </div>
//         {/* Tab Content */}
//         <div className="max-h-64 overflow-y-auto">
//           {activeTab === "users" && (
//             <div className="space-y-2">
//               {sessionUsers.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No users logged in</p>
//               ) : (
//                 sessionUsers.map((user, index) => (
//                   <div key={user.id} className="flex justify-between items-center p-2 border rounded">
//                     <div>
//                       <div className="font-medium">{user.name}</div>
//                       <div className="text-xs text-slate-500">
//                         Started: {new Date(user.startTime).toLocaleTimeString()}
//                       </div>
//                       <div className="text-xs text-slate-500">
//                         Duration: {user.duration} minutes
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => onRemoveUser(user.id)}
//                       className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "bookings" && (
//             <div className="space-y-2">
//               {bookings.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">{t(lang, "details.noBookings")}</p>
//               ) : (
//                 bookings.map((b) => (
//                   <div key={b._id} className="border rounded-lg px-3 py-1.5">
//                     <div className="font-medium">
//                       {b.startTime} · {b.durationMinutes} {t(lang, "cabin.min")}
//                     </div>
//                     <div className="text-slate-500 text-sm">
//                       {trDynamic(lang, b.customerName || t(lang, "details.unnamedBooking"))}
//                     </div>
//                     <div className={`text-xs ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
//                       {b.status}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "logs" && (
//             <div className="space-y-2">
//               {logs.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">No maintenance logs</p>
//               ) : (
//                 logs.map((log) => (
//                   <div key={log.id} className="border rounded-lg p-2">
//                     <div className="flex justify-between">
//                       <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
//                         {log.action.replace('_', ' ')}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         {new Date(log.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                     {log.note && <div className="text-sm mt-1">{log.note}</div>}
//                     {log.duration > 0 && (
//                       <div className="text-xs text-slate-500">Duration: {log.duration} seconds</div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end">
//           <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
//             {t(lang, "btn.close")}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // UPDATED: Start Session Modal with ALL CLIENT CHANGES - INCLUDING 4 MIN MINIMUM
// function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
//   const [lastMinutes, setLastMinutes] = useState(20);

//   useEffect(() => {
//     // Get last duration for default customer
//     getLastDuration("Walk-in Customer").then(d => {
//       if (d !== null) setLastMinutes(d);
//     });
//   }, []);

//   useEffect(() => {
//     setMinutes(lastMinutes);
//   }, [lastMinutes]);

//   // UPDATED: Minimum time changed to 4 minutes (not 5)
//   const minMin = 4; // Changed from 5 to 4 as requested
//   const maxMin = 25;

//   const adjustMinutes = (delta) => {
//     setMinutes((prev) => {
//       let next = prev + delta;
//       if (next < minMin) next = minMin;
//       if (next > maxMin) next = maxMin;
//       return next;
//     });
//   };

//   const setToMin = () => setMinutes(minMin);
//   const setToLast = () => setMinutes(lastMinutes);
//   const setToMax = () => setMinutes(maxMin);

//   const helpfulMessage = "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen.";

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
//         {/* Header - REDUCED FONT SIZES */}
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">SITZUNG STARTEN</p>
//             <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="mt-0.5 text-[10px] text-slate-500">
//               Sitzungszeit ({minMin}-{maxMin} Minuten) vor dem Start festlegen.
//               <span className="block mt-1 text-emerald-400 text-[9px]">
//                 +3 Minuten Vorlaufzeit automatisch inklusive
//               </span>
//             </p>
//           </div>
//           <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
//             ×
//           </button>
//         </div>

//         <div className="space-y-3">
//           <p className="text-[10px] font-medium text-slate-500">Sitzungsdauer auswählen</p>

//           {/* Duration Controls - UPDATED: Bigger + - buttons with spacing */}
//           <div className="flex items-center justify-center gap-4">
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(-1)} 
//               disabled={saving || minutes <= minMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               −
//             </button>
//             <div className="flex flex-col items-center">
//               <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
//                 {minutes} Min
//               </div>
//               <div className="text-[9px] text-emerald-400 mt-1">
//                 +3 Min Vorlauf = {minutes + 3} Min gesamt
//               </div>
//             </div>
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(1)} 
//               disabled={saving || minutes >= maxMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               +
//             </button>
//           </div>

//           {/* Time Presets - UPDATED: Added frames/borders to all 3 buttons */}
//           <div className="grid grid-cols-3 gap-2">
//             <div className="text-center">
//               {/* <label className="text-[10px] font-medium text-slate-500">Minimum</label> */}
//               <button 
//                 onClick={setToMin} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//            <label className="text-[10px] font-medium text-slate-500">Minimum</label>
//               </button>
//             </div>
//             <div className="text-center">
//               {/* <label className="text-[10px] font-medium text-slate-500">Letzte Buchung</label> */}
//               <button 
//                 onClick={setToLast} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                    <label className="text-[10px] font-medium text-slate-500">Letzte Buchung</label>
//               </button>
//             </div>
//             <div className="text-center">
//               {/* <label className="text-[10px] font-medium text-slate-500">Maximum</label> */}
//               <button 
//                 onClick={setToMax} 
//                 className={`block w-full mt-0.5 text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >

//                        <label className="text-[10px] font-medium text-slate-500">Maximum</label>
//               </button>
//             </div>
//           </div>

//           {/* Help Message */}
//           <div className="mt-2 text-center text-[10px] italic text-slate-400">
//             {helpfulMessage}
//           </div>

//           {/* Price Display */}
//           <div className="flex items-center justify-end gap-2">
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500">Geschätzter Preis</p>
//               <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
//               <p className="text-[9px] text-emerald-400">
//                 (für {minutes} Minuten, Vorlaufzeit kostenlos)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

//         {/* Action Buttons */}
//         <div className="space-y-2">
//           <button 
//             onClick={onConfirm} 
//             disabled={saving} 
//             className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
//           >
//             {saving ? "Wird gestartet..." : `Sitzung starten (${minutes + 3} Min gesamt)`}
//           </button>
//           <button 
//             onClick={onCancel} 
//             disabled={saving} 
//             className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
//           >
//             Abbrechen
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AddUserModal({ isDark, device, onCancel, onConfirm }) {
//   const [userName, setUserName] = useState("");
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <h3 className="text-lg font-semibold mb-2">Add User to {device.name}</h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">User Name</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder="Enter user name"
//               className="w-full px-3 py-2 border rounded-lg bg-transparent"
//               autoFocus
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={onCancel}
//               className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onConfirm(userName)}
//               disabled={!userName.trim()}
//               className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
//             >
//               Add User
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



// // src/pages/Dashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { t, trDynamic } from "../i18n";
// import { useLanguage } from "../context/LanguageContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   "https://backend-two-orpin-12.vercel.app";

// const LOCAL_SESSIONS_KEY = "aios:runningSessions";
// const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";
// const LOCAL_MAINTENANCE_TIMERS = "aios:maintenanceTimers";

// async function fetchJSON(url, options = {}, timeoutMs = 12000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);
//   try {
//     const res = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//     });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }

// async function getLastDuration(customerName) {
//   try {
//     const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (!Array.isArray(data) || data.length === 0) return null;
//     const sorted = data.sort((a, b) => {
//       const dateA = new Date(a.date + ' ' + a.startTime);
//       const dateB = new Date(b.date + ' ' + b.startTime);
//       return dateB - dateA;
//     });
//     return sorted[0].durationMinutes - 3;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }

// function TimerWithSeconds({ minutesLeft, secondsLeft }) {
//   return (
//     <div className="text-center">
//       <div className="text-2xl font-mono font-bold">
//         {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
//       </div>
//       <div className="text-xs text-slate-500 mt-1">remaining</div>
//     </div>
//   );
// }

// function Dashboard({ theme }) {
//   const isDark = theme === "dark";
//   const { language } = useLanguage();
//   const lang = language || "en";
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
//   const [bookings, setBookings] = useState([]);
//   const [maintenanceTarget, setMaintenanceTarget] = useState(null);
//   const [detailsCabin, setDetailsCabin] = useState(null);
//   const [detailsTab, setDetailsTab] = useState("users");
//   const [now, setNow] = useState(() => new Date());
//   const [localSessions, setLocalSessions] = useState({});
//   const [maintenanceLogs, setMaintenanceLogs] = useState({});
//   const [maintenanceTimers, setMaintenanceTimers] = useState({});
//   const [startModalDevice, setStartModalDevice] = useState(null);
//   const [startMinutes, setStartMinutes] = useState(20);
//   const [startSaving, setStartSaving] = useState(false);
//   const [startError, setStartError] = useState("");
//   const [addUserModal, setAddUserModal] = useState(null);
//   const [cleaningModal, setCleaningModal] = useState(null);
//   const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

//   const [customerSearch, setCustomerSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     try {
//       const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
//       if (sessionsRaw) {
//         const parsed = JSON.parse(sessionsRaw);
//         const nowTs = Date.now();
//         const cleaned = {};
//         Object.entries(parsed).forEach(([cabinId, session]) => {
//           if (session?.endAt > nowTs) {
//             cleaned[cabinId] = session;
//           } else if (session?.status === "running") {
//             cleaned[cabinId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000),
//               status: "cleaning",
//               autoCleaning: true
//             };
//           }
//         });
//         setLocalSessions(cleaned);
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
//       }

//       const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
//       if (logsRaw) {
//         setMaintenanceLogs(JSON.parse(logsRaw));
//       }

//       const timersRaw = localStorage.getItem(LOCAL_MAINTENANCE_TIMERS);
//       if (timersRaw) {
//         const timers = JSON.parse(timersRaw);
//         const nowTs = Date.now();
//         const cleanedTimers = {};

//         Object.entries(timers).forEach(([deviceId, timer]) => {
//           if (timer.endAt > nowTs) {
//             cleanedTimers[deviceId] = timer;
//           }
//         });

//         setMaintenanceTimers(cleanedTimers);
//         localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(cleanedTimers));
//       }
//     } catch (e) {
//       console.error("Failed to load local data", e);
//     }
//   }, []);

//   useEffect(() => {
//     const id = setInterval(() => {
//       const newNow = new Date();
//       setNow(newNow);
//       const nowTs = newNow.getTime();

//       setLocalSessions((prev) => {
//         const updated = {};
//         let changed = false;
//         Object.entries(prev).forEach(([deviceId, session]) => {
//           if (session?.endAt > nowTs) {
//             updated[deviceId] = session;
//           } else if (session?.status === "running") {
//             updated[deviceId] = {
//               ...session,
//               endAt: nowTs + (3 * 60 * 1000),
//               status: "cleaning",
//               autoCleaning: true
//             };
//             changed = true;
//           } else {
//             changed = true;
//           }
//         });
//         if (changed) {
//           try {
//             localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//           } catch (e) {}
//         }
//         return updated;
//       });

//       setMaintenanceTimers((prev) => {
//         const updated = { ...prev };
//         let changed = false;

//         Object.entries(prev).forEach(([deviceId, timer]) => {
//           if (timer.endAt > nowTs) {
//             updated[deviceId] = timer;
//           } else {
//             delete updated[deviceId];
//             changed = true;

//             setDevices((devicesPrev) => 
//               devicesPrev.map(d => 
//                 d._id === deviceId 
//                   ? { ...d, maintenance: false, maintenanceStart: null } 
//                   : d
//               )
//             );

//             const logEntry = {
//               id: Date.now(),
//               deviceId,
//               action: "maintenance_auto_completed",
//               timestamp: newNow.toISOString(),
//               note: "Maintenance auto-completed after timer reached 0",
//               duration: 3 * 60
//             };

//             setMaintenanceLogs(prevLogs => {
//               const deviceLogs = prevLogs[deviceId] || [];
//               const updatedLogs = {
//                 ...prevLogs,
//                 [deviceId]: [logEntry, ...deviceLogs]
//               };
//               localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updatedLogs));
//               return updatedLogs;
//             });

//             fetchJSON(
//               `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//               {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   maintenance: false,
//                   maintenanceEnd: newNow.toISOString(),
//                   maintenanceDuration: 3 * 60
//                 }),
//               },
//               12000
//             ).catch(e => console.error("Failed to auto-update maintenance end", e));
//           }
//         });

//         if (changed) {
//           try {
//             localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
//           } catch (e) {}
//         }

//         return updated;
//       });

//     }, 1000);
//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     let mounted = true;
//     const fetchCabins = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const res = await fetchJSON(`${API_BASE}/api/cabins`, {}, 12000);
//         if (!res.ok) throw new Error("Failed to fetch cabins");
//         const data = await res.json();
//         if (!mounted) return;
//         setDevices(Array.isArray(data) ? data : []);
//       } catch (err) {
//         if (!mounted) return;
//         setError(t(lang, "dash.loadError"));
//       } finally {
//         if (!mounted) return;
//         setLoading(false);
//       }
//     };
//     fetchCabins();
//     return () => { mounted = false; };
//   }, [lang]);

//   useEffect(() => {
//     let mounted = true;
//     const fetchBookings = async () => {
//       try {
//         const params = new URLSearchParams({ date: selectedDate }).toString();
//         const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
//         if (!res.ok) return;
//         const data = await res.json();
//         if (!mounted) return;
//         setBookings(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (mounted) setBookings([]);
//       }
//     };
//     fetchBookings();
//     return () => { mounted = false; };
//   }, [selectedDate]);

//   useEffect(() => {
//     const searchCustomers = async () => {
//       if (!customerSearch.trim()) {
//         setSearchResults([]);
//         return;
//       }

//       try {
//         setSearchLoading(true);
//         const res = await fetchJSON(`${API_BASE}/api/customers?search=${encodeURIComponent(customerSearch)}`, {});
//         if (res.ok) {
//           const data = await res.json();
//           setSearchResults(Array.isArray(data) ? data : []);
//         }
//       } catch (e) {
//         console.error("Search error:", e);
//         setSearchResults([]);
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(searchCustomers, 300);
//     return () => clearTimeout(debounceTimer);
//   }, [customerSearch]);

//   const toMinutes = (hhmm) => {
//     if (!hhmm) return 0;
//     const [h, m] = hhmm.split(":").map(Number);
//     return h * 60 + m;
//   };

//   const devicesWithStatus = useMemo(() => {
//     if (!devices.length) return [];
//     const nowMinutes = now.getHours() * 60 + now.getMinutes();
//     const nowSeconds = now.getSeconds();
//     const nowTs = now.getTime();
//     return devices.map((dev) => {
//       const devBookings = bookings
//         .filter((b) => b.cabinId === dev._id)
//         .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//       let active = null;
//       for (const b of devBookings) {
//         if (b.status === "cancelled") continue;
//         const start = toMinutes(b.startTime);
//         const end = start + (b.durationMinutes || 0);
//         if (start <= nowMinutes && nowMinutes < end) {
//           active = { ...b, start, end };
//           break;
//         }
//       }
//       const localSession = localSessions[dev._id];
//       const sessionUsers = localSession?.users || [];
//       let status = dev.status || "free";
//       let minutesLeft = 0;
//       let secondsLeft = 0;
//       let currentCustomer = dev.currentCustomer || dev.customer || "";
//       let buttonState = "start";

//       const maintenanceTimer = maintenanceTimers[dev._id];

//       if (maintenanceTimer && maintenanceTimer.endAt > nowTs) {
//         status = "maintenance";
//         const totalSecondsLeft = Math.max(0, Math.ceil((maintenanceTimer.endAt - nowTs) / 1000));
//         minutesLeft = Math.floor(totalSecondsLeft / 60);
//         secondsLeft = totalSecondsLeft % 60;
//         currentCustomer = lang === "de" ? "Kein aktiver Kunde" : "No active customer";
//         buttonState = "endMaintenance";

//         if (!dev.maintenance) {
//           setDevices(prev => prev.map(d =>
//             d._id === dev._id ? { ...d, maintenance: true } : d
//           ));
//         }
//       }
//       else if (maintenanceTimer) {
//         status = "free";
//         minutesLeft = 0;
//         secondsLeft = 0;
//         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
//         buttonState = "start";

//         setMaintenanceTimers(prev => {
//           const updated = { ...prev };
//           delete updated[dev._id];
//           localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
//           return updated;
//         });
//       }
//       else if (dev.maintenance) {
//         status = "maintenance";
//         const endAt = nowTs + (3 * 60 * 1000);
//         setMaintenanceTimers(prev => {
//           const updated = {
//             ...prev,
//             [dev._id]: { endAt }
//           };
//           localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
//           return updated;
//         });
//         minutesLeft = 3;
//         secondsLeft = 0;
//         currentCustomer = lang === "de" ? "Kein aktiver Kunde" : "No active customer";
//         buttonState = "endMaintenance";
//       }
//       else if (localSession && localSession.endAt > nowTs) {
//         const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
//         minutesLeft = Math.floor(totalSecondsLeft / 60);
//         secondsLeft = totalSecondsLeft % 60;

//         if (localSession.status === "cleaning") {
//           status = "cleaning";
//           buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
//         } else if (localSession.status === "locked") {
//           status = "locked";
//           buttonState = "unlock";
//         } else {
//           status = "running";
//           buttonState = "cancel";
//         }

//         currentCustomer = sessionUsers.length > 0
//           ? `${sessionUsers.length} ${lang === "de" ? "Benutzer angemeldet" : "user(s) logged in"}`
//           : t(lang, "cabin.inUse");
//       } else if (active) {
//         status = "running";
//         minutesLeft = Math.max(0, active.end - nowMinutes);
//         secondsLeft = 60 - nowSeconds;
//         buttonState = "cancel";
//         currentCustomer = active.customerName || t(lang, "cabin.inUse");
//       } else {
//         status = "free";
//         buttonState = "start";
//         currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
//       }

//       return {
//         ...dev,
//         status,
//         minutesLeft,
//         secondsLeft,
//         sessionUsers,
//         currentCustomer,
//         buttonState,
//         sessionData: localSession
//       };
//     });
//   }, [devices, bookings, now, localSessions, maintenanceTimers, lang]);

//   const getPriceForMinutes = (device, minutes) => {
//     if (device?.minutePricing && typeof device.minutePricing === "object") {
//       let total = 0;
//       for (let i = 1; i <= minutes; i++) {
//         const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
//         total += minutePrice;
//       }
//       return total;
//     }
//     const base = device?.baseMinutePrice ?? 2;
//     return base * minutes;
//   };

//   const startSession = async (device, selectedMinutes, customerName = "Walk-in Customer") => {
//     try {
//       setStartSaving(true);
//       setStartError("");

//       const actualDurationMinutes = selectedMinutes + 3;

//       const nowLocal = new Date();
//       const h = String(nowLocal.getHours()).padStart(2, "0");
//       const m = String(nowLocal.getMinutes()).padStart(2, "0");
//       const startTime = `${h}:${m}`;

//       const body = {
//         cabinId: device._id,
//         date: selectedDate,
//         startTime,
//         durationMinutes: actualDurationMinutes,
//         status: "booked",
//         customerName,
//       };

//       const res = await fetchJSON(
//         `${API_BASE}/api/bookings`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         },
//         12000
//       );

//       if (!res.ok) {
//         setStartError(t(lang, "start.serverError"));
//         return false;
//       }

//       const saved = await res.json();
//       setBookings((prev) => [...prev, saved]);

//       const endAt = Date.now() + actualDurationMinutes * 60 * 1000;
//       const newUser = {
//         id: Date.now(),
//         name: customerName,
//         startTime: new Date().toISOString(),
//         duration: actualDurationMinutes
//       };

//       setLocalSessions((prev) => {
//         const updated = {
//           ...prev,
//           [device._id]: {
//             endAt,
//             status: "running",
//             users: [newUser],
//             selectedDuration: selectedMinutes,
//             actualDuration: actualDurationMinutes
//           }
//         };
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       return true;
//     } catch (e) {
//       setStartError(t(lang, "start.networkError"));
//       return false;
//     } finally {
//       setStartSaving(false);
//     }
//   };

//   const startSessionFromDetails = async (device, durationSeconds, price) => {
//     try {
//       const durationMinutes = Math.ceil(durationSeconds / 60);
//       return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
//     } catch (error) {
//       console.error("Failed to start session from details:", error);
//       return false;
//     }
//   };

//   const cancelSession = async (deviceId) => {
//     try {
//       setLocalSessions((prev) => {
//         const updated = { ...prev };
//         const session = updated[deviceId];

//         if (session?.status === "running") {
//           updated[deviceId] = {
//             ...session,
//             endAt: Date.now() + (3 * 60 * 1000),
//             status: "cleaning",
//             autoCleaning: true
//           };
//         } else {
//           delete updated[deviceId];
//         }

//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       });

//       const device = devices.find(d => d._id === deviceId);
//       if (device) {
//         const activeBooking = bookings.find(b =>
//           b.cabinId === deviceId &&
//           b.status !== "cancelled" &&
//           !b.status?.includes("completed")
//         );

//         if (activeBooking) {
//           await fetchJSON(
//             `${API_BASE}/api/bookings/${activeBooking._id}`,
//             {
//               method: "PATCH",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ status: "cancelled" }),
//             },
//             12000
//           );

//           setBookings(prev => prev.map(b =>
//             b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
//           ));
//         }
//       }
//     } catch (e) {
//       console.error("Failed to cancel session", e);
//     } finally {
//       setCancelConfirmModal(null);
//     }
//   };

//   const markAsCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const session = prev[deviceId];
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...session,
//           endAt: Date.now() + (3 * 60 * 1000),
//           status: "cleaning",
//           autoCleaning: false
//         }
//       };
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   const endCleaning = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   const unlockDevice = (deviceId) => {
//     setLocalSessions((prev) => {
//       const updated = { ...prev };
//       delete updated[deviceId];
//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}
//       return updated;
//     });
//   };

//   const addUserToSession = (deviceId, userName) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const newUser = {
//         id: Date.now(),
//         name: userName,
//         startTime: new Date().toISOString(),
//         duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
//       };
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: [...existingSession.users, newUser]
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//     setAddUserModal(null);
//   };

//   const removeUserFromSession = (deviceId, userId) => {
//     setLocalSessions((prev) => {
//       const existingSession = prev[deviceId];
//       if (!existingSession) return prev;
//       const updatedUsers = existingSession.users.filter(user => user.id !== userId);

//       if (updatedUsers.length === 0) {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         try {
//           localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         } catch (e) {}
//         return updated;
//       }
//       const updated = {
//         ...prev,
//         [deviceId]: {
//           ...existingSession,
//           users: updatedUsers
//         }
//       };

//       try {
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//       } catch (e) {}

//       return updated;
//     });
//   };

//   const startMaintenance = async (deviceId) => {
//     try {
//       const timestamp = new Date().toISOString();
//       const endAt = Date.now() + (3 * 60 * 1000);

//       const logEntry = {
//         id: Date.now(),
//         deviceId,
//         action: "maintenance_started",
//         timestamp,
//         note: "Maintenance initiated",
//         duration: 0
//       };

//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });

//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
//       ));

//       setMaintenanceTimers(prev => {
//         const updated = {
//           ...prev,
//           [deviceId]: { endAt, startedAt: Date.now() }
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
//         return updated;
//       });

//       setLocalSessions(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
//         return updated;
//       });

//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: true,
//             maintenanceStart: timestamp
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance", e);
//       return false;
//     }
//   };

//   const endMaintenance = async (deviceId) => {
//     try {
//       const device = devices.find(d => d._id === deviceId);
//       const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
//       const endTime = new Date();
//       const duration = Math.round((endTime - startTime) / 1000);

//       const logEntry = {
//         id : Date.now(),
//         deviceId,
//         action: "maintenance_completed",
//         timestamp: endTime.toISOString(),
//         note: "Maintenance manually completed",
//         duration
//       };

//       setMaintenanceLogs(prev => {
//         const deviceLogs = prev[deviceId] || [];
//         const updated = {
//           ...prev,
//           [deviceId]: [logEntry, ...deviceLogs]
//         };
//         localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
//         return updated;
//       });

//       setDevices(prev => prev.map(d =>
//         d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
//       ));

//       setMaintenanceTimers(prev => {
//         const updated = { ...prev };
//         delete updated[deviceId];
//         localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
//         return updated;
//       });

//       await fetchJSON(
//         `${API_BASE}/api/cabins/${deviceId}/maintenance`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             maintenance: false,
//             maintenanceEnd: endTime.toISOString(),
//             maintenanceDuration: duration
//           }),
//         },
//         12000
//       );
//       return true;
//     } catch (e) {
//       console.error("Failed to save maintenance end", e);
//       return false;
//     }
//   };

//   const getDeviceLogs = (deviceId) => {
//     return maintenanceLogs[deviceId] || [];
//   };

//   const total = devicesWithStatus.length;
//   const running = devicesWithStatus.filter((d) => d.status === "running").length;
//   const free = devicesWithStatus.filter((d) => d.status === "free").length;
//   const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
//   const errors = devicesWithStatus.filter((d) => d.status === "error").length;
//   const inMaintenance = devicesWithStatus.filter((d) => d.maintenance || maintenanceTimers[d._id]).length;

//   const openStartModal = (device) => {
//     setStartModalDevice(device);
//     setStartMinutes(20);
//     setStartError("");
//   };

//   const openMaintenanceModal = (device) => setMaintenanceTarget(device);
//   const openDetails = (device) => {
//     setDetailsCabin(device);
//     setDetailsTab("users");
//   };
//   const openCancelConfirm = (device) => setCancelConfirmModal(device);
//   const openCleaningModal = (device) => setCleaningModal(device);

//   const closeStartModal = () => {
//     if (startSaving) return;
//     setStartModalDevice(null);
//   };
//   const closeMaintenanceModal = () => setMaintenanceTarget(null);
//   const closeDetails = () => setDetailsCabin(null);
//   const closeCancelConfirm = () => setCancelConfirmModal(null);
//   const closeCleaningModal = () => setCleaningModal(null);

//   const handleConfirmStart = async () => {
//     if (!startModalDevice) return;
//     const success = await startSession(startModalDevice, startMinutes, t(lang, "misc.walkIn"));
//     if (success) {
//       closeStartModal();
//     }
//   };

//   const confirmMaintenance = async () => {
//     if (!maintenanceTarget) return;
//     await startMaintenance(maintenanceTarget._id);
//     closeMaintenanceModal();
//   };

//   const confirmCancel = async () => {
//     if (!cancelConfirmModal) return;
//     await cancelSession(cancelConfirmModal._id);
//   };

//   const confirmCleaning = () => {
//     if (!cleaningModal) return;
//     markAsCleaning(cleaningModal._id);
//     closeCleaningModal();
//   };

//   const detailsBookings = useMemo(() => {
//     if (!detailsCabin) return [];
//     return bookings
//       .filter((b) => b.cabinId === detailsCabin._id)
//       .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
//   }, [detailsCabin, bookings]);

//   const currentStartPrice = startModalDevice && startMinutes
//     ? getPriceForMinutes(startModalDevice, startMinutes)
//     : 0;

//   const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
//     running,
//     free,
//     cleaning,
//     errors,
//     s: errors !== 1 ? "s" : "",
//     inMaintenance,
//   });

//   return (
//     <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
//       <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
//         <section className="space-y-2 sm:space-y-3 relative">
//           <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
//             AIOS-SYSTEMS
//           </p>

//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
//                 {t(lang, "dash.title")}
//               </h1>
//               <p className={isDark ? "text-xs sm:text-sm text-slate-400" : "text-xs sm:text-sm text-slate-600"}>
//                 {t(lang, "dash.subtitle")}
//               </p>
//             </div>

//             <div className={`flex flex-col items-end ${isDark ? "text-slate-300" : "text-slate-700"}`}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={customerSearch}
//                   onChange={(e) => setCustomerSearch(e.target.value)}
//                   placeholder={lang === "de" ? "Kundensuche..." : "Search customer..."}
//                   className={`pl-9 pr-3 py-2 rounded-lg text-sm ${isDark 
//                     ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" 
//                     : "bg-white border-slate-300 text-gray-900 placeholder:text-slate-400"
//                   } border focus:outline-none focus:ring-2 ${isDark ? "focus:ring-emerald-500" : "focus:ring-emerald-400"} focus:border-transparent w-48 sm:w-56`}
//                 />
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <svg className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 {customerSearch && (
//                   <button
//                     onClick={() => setCustomerSearch("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>

//               {customerSearch && (
//                 <div className={`absolute top-full mt-1 z-50 w-56 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border rounded-lg shadow-lg`}>
//                   {searchLoading ? (
//                     <div className="p-3 text-center text-sm">Searching...</div>
//                   ) : searchResults.length > 0 ? (
//                     <div className="max-h-60 overflow-y-auto">
//                       {searchResults.map(customer => (
//                         <div 
//                           key={customer._id} 
//                           className="p-2 border-b border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
//                           onClick={() => {
//                             console.log("Selected customer:", customer);
//                             setCustomerSearch("");
//                           }}
//                         >
//                           <div className="font-medium">{customer.name}</div>
//                           <div className="text-xs text-slate-500">{customer.email}</div>
//                           <div className="text-xs text-slate-500">{customer.phone}</div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : customerSearch.length > 0 ? (
//                     <div className="p-3 text-center text-sm">No customers found</div>
//                   ) : null}
//                 </div>
//               )}

//               <p className="text-xs text-slate-500 mt-1">{lang === "de" ? "Suchen Sie nach Kunden" : "Search for customers"}</p>
//             </div>
//           </div>
//         </section>

//         {loading && (
//           <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {t(lang, "dash.loadingCabins")}
//           </div>
//         )}
//         {error && !loading && (
//           <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
//             {error}
//           </div>
//         )}
//         {!loading && !error && (
//           <>
//             <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
//               <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                 <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
//                 <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
//                 <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
//                 <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
//               </div>
//               <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div>
//                     <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
//                       {t(lang, "dash.liveStatus")}
//                     </p>
//                     <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
//                       {statusLine}
//                     </p>
//                   </div>
//                   <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
//                 </div>
//                 {errors > 0 && (
//                   <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
//                     <span className="mt-[2px] text-xs">⚠️</span>
//                     <p>
//                       {errors} {t(lang, "dash.attention")}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//             <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
//               <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
//                 <div>
//                   <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
//                     {t(lang, "dash.deviceOverview")}
//                   </p>
//                   <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
//                     {t(lang, "dash.receptionLiveHeading")}
//                   </h2>
//                 </div>
//                 <div className={isDark ? "text-[11px] sm:text-xs text-slate-400" : "text-[11px] sm:text-xs text-slate-500"}>{statusLine}</div>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
//                 {devicesWithStatus.map((device) => (
//                   <CabinCard
//                     key={device._id}
//                     theme={theme}
//                     lang={lang}
//                     device={device}
//                     onShowDetails={() => openDetails(device)}
//                     onQuickStart={() => openStartModal(device)}
//                     onRequestMaintenance={() => openMaintenanceModal(device)}
//                     onEndMaintenance={() => endMaintenance(device._id)}
//                     onCancelSession={() => openCancelConfirm(device)}
//                     onMarkCleaning={() => openCleaningModal(device)}
//                     onEndCleaning={() => endCleaning(device._id)}
//                     onUnlock={() => unlockDevice(device._id)}
//                     onAddUser={() => setAddUserModal(device)}
//                   />
//                 ))}
//               </div>
//             </section>
//           </>
//         )}
//       </div>
//       {maintenanceTarget && (
//         <MaintenanceModal
//           isDark={isDark}
//           lang={lang}
//           device={maintenanceTarget}
//           onCancel={closeMaintenanceModal}
//           onConfirm={confirmMaintenance}
//         />
//       )}
//       {detailsCabin && (
//         <EnhancedCabinDetailsModal
//           isDark={isDark}
//           lang={lang}
//           device={detailsCabin}
//           bookings={detailsBookings}
//           logs={getDeviceLogs(detailsCabin._id)}
//           sessionUsers={localSessions[detailsCabin._id]?.users || []}
//           activeTab={detailsTab}
//           onTabChange={setDetailsTab}
//           onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
//           onClose={closeDetails}
//           onStartSession={startSessionFromDetails}
//         />
//       )}
//       {startModalDevice && (
//         <StartSessionModal
//           isDark={isDark}
//           lang={lang}
//           device={startModalDevice}
//           minutes={startMinutes}
//           setMinutes={setStartMinutes}
//           price={currentStartPrice}
//           saving={startSaving}
//           error={startError}
//           onCancel={closeStartModal}
//           onConfirm={handleConfirmStart}
//         />
//       )}
//       {addUserModal && (
//         <AddUserModal
//           isDark={isDark}
//           device={addUserModal}
//           onCancel={() => setAddUserModal(null)}
//           onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
//         />
//       )}
//       {cancelConfirmModal && (
//         <CancelConfirmModal
//           isDark={isDark}
//           lang={lang}
//           device={cancelConfirmModal}
//           onCancel={closeCancelConfirm}
//           onConfirm={confirmCancel}
//         />
//       )}
//       {cleaningModal && (
//         <CleaningModal
//           isDark={isDark}
//           lang={lang}
//           device={cleaningModal}
//           onCancel={closeCleaningModal}
//           onConfirm={confirmCleaning}
//           duration={3}
//         />
//       )}
//     </div>
//   );
// }

// function StatCard({ theme, label, value, tone }) {
//   const isDark = theme === "dark";
//   const chipColorsDark = {
//     neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
//     accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
//     success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
//     info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
//   };
//   const chipColorsLight = {
//     neutral: "border-slate-300 bg-slate-100 text-slate-700",
//     accent: "border-sky-300 bg-sky-50 text-sky-700",
//     success: "border-emerald-300 bg-emerald-50 text-emerald-700",
//     info: "border-cyan-300 bg-cyan-50 text-cyan-700",
//   };
//   const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
//   return isDark ? (
//     <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
//     </div>
//   ) : (
//     <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
//       <div className="flex items-center justify-between">
//         <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
//         <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
//       </div>
//       <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
//     </div>
//   );
// }

// function StatusPill({ isDark, text }) {
//   return (
//     <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
//       <span className="relative flex h-2 w-2">
//         <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
//         <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
//       </span>
//       <span>{text}</span>
//     </div>
//   );
// }

// function CabinCard({
//   theme,
//   lang,
//   device,
//   onShowDetails,
//   onQuickStart,
//   onRequestMaintenance,
//   onEndMaintenance,
//   onCancelSession,
//   onMarkCleaning,
//   onEndCleaning,
//   onUnlock,
//   onAddUser
// }) {
//   const isDark = theme === "dark";
//   const statusStylesDark = {
//     free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
//     running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
//     cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
//     error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
//     maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
//     locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
//   };
//   const statusStylesLight = {
//     free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     running: "bg-amber-50 text-amber-700 border border-amber-200",
//     cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
//     error: "bg-rose-50 text-rose-700 border border-rose-200",
//     maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
//     locked: "bg-purple-50 text-purple-700 border border-purple-200",
//   };

//   const cardClass = isDark
//     ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
//     : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
//   const titleColor = isDark ? "text-slate-50" : "text-slate-900";
//   const metaColor = isDark ? "text-slate-400" : "text-slate-500";
//   const imageUrl = device.imageUrl;

//   const getStatusText = () => {
//     if (device.maintenance || device.status === "maintenance") {
//       return lang === "de" ? "WARTUNG" : "MAINTENANCE";
//     }
//     return (device.status || "").toUpperCase();
//   };

//   const getStatusClass = () => {
//     const effectiveStatus = (device.maintenance || device.status === "maintenance") ? "maintenance" : device.status;
//     return isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
//   };

//   const getButtonText = () => {
//     if (device.maintenance || device.status === "maintenance") {
//       return lang === "de" ? "Wartung beenden" : "End Maintenance";
//     }

//     switch (device.buttonState) {
//       case "cancel": return lang === "de" ? "Abbrechen" : "Cancel";
//       case "cleaning": return lang === "de" ? "Reinigung" : "Cleaning";
//       case "endCleaning":
//       case "completeCleaning": return lang === "de" ? "Reinigung beenden" : "End Cleaning";
//       case "unlock": return lang === "de" ? "Entsperren" : "Unlock";
//       case "start": return lang === "de" ? "Starten" : "Start";
//       case "endMaintenance": return lang === "de" ? "Wartung beenden" : "End Maintenance";
//       default: return lang === "de" ? "Starten" : "Start";
//     }
//   };

//   const handleButtonClick = () => {
//     if (device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") {
//       return onEndMaintenance();
//     }

//     switch (device.buttonState) {
//       case "cancel": return onCancelSession();
//       case "cleaning": return onMarkCleaning();
//       case "endCleaning":
//       case "completeCleaning": return onEndCleaning();
//       case "unlock": return onUnlock();
//       case "start": return onQuickStart();
//       default: return onQuickStart();
//     }
//   };

//   const getButtonClass = () => {
//     if (device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") {
//       return isDark ? "bg-violet-600 hover:bg-violet-500" : "bg-violet-500 hover:bg-violet-400";
//     }

//     switch (device.buttonState) {
//       case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
//       case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
//       case "endCleaning":
//       case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
//       case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
//       case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//       default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
//     }
//   };

//   return (
//     <article className={cardClass}>
//       <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
//         {imageUrl ? (
//           <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
//         ) : (
//           <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">No image</div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />
//       </div>
//       <header className="flex items-start justify-between gap-2">
//         <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
//         <span className={`${getStatusClass()} rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide`}>
//           {getStatusText()}
//         </span>
//       </header>
//       <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.code ? `${device.code} · ${device.name}` : device.name}</h3>
//       <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>⏱</span>
//           <span>
//             {(device.maintenance || device.status === "maintenance")
//               ? (lang === "de" ? "Wartung/Test" : "Maintenance/Test")
//               : device.minutesLeft > 0 || device.secondsLeft > 0
//               ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
//               : `0 ${lang === "de" ? "min" : "min"}`}
//           </span>
//         </div>
//         <div className={`flex items-center gap-1.5 ${metaColor}`}>
//           <span>👤</span>
//           <span>{device.currentCustomer || (lang === "de" ? "Kein aktiver Kunde" : "No active customer")}</span>
//         </div>
//       </div>

//       {(device.maintenance || device.status === "maintenance") && (
//         <div className="mt-2 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-2xl font-mono font-bold">
//               {String(device.minutesLeft).padStart(2, '0')}:{String(device.secondsLeft).padStart(2, '0')}
//             </div>
//             <div className="text-xs text-slate-500 mt-1">
//               {lang === "de" ? "verbleibend" : "remaining"}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
//         <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
//           {lang === "de" ? "Details" : "Details"}
//         </button>
//         {(device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") ? (
//           <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
//             {getButtonText()}
//           </button>
//         ) : (
//           <>
//             <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
//               {getButtonText()}
//             </button>
//             {device.status !== "cleaning" && device.status !== "running" && device.status !== "maintenance" && (
//               <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
//                 <span>{lang === "de" ? "Wartung" : "Maintenance"}</span>
//               </button>
//             )}
//           </>
//         )}
//       </div>
//       {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
//         <button
//           onClick={onAddUser}
//           className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
//         >
//           + {lang === "de" ? "Benutzer hinzufügen" : "Add Another User"} ({device.sessionUsers.length})
//         </button>
//       )}
//     </article>
//   );
// }

// function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🔧</div>
//           <h2 className="text-base sm:text-lg font-semibold">{lang === "de" ? "Wartung starten" : "Start Maintenance"}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {lang === "de" ? "Möchten Sie die Wartung für" : "Do you want to start maintenance for"}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-amber-400">
//             {lang === "de" ? "Dadurch wird jede aktive Sitzung auf diesem Gerät abgebrochen." : "This will cancel any active session on this device."}
//           </p>
//           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
//             {lang === "de" ? "Wartung dauert 3 Minuten und wird nach Ablauf automatisch beendet." : "Maintenance lasts 3 minutes and will auto-end after completion."}
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
//             {lang === "de" ? "Wartung starten" : "Start Maintenance"}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {lang === "de" ? "Abbrechen" : "Cancel"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl">⚠️</div>
//           <h2 className="text-base sm:text-lg font-semibold">{lang === "de" ? "Sitzung abbrechen" : "Cancel Session"}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {lang === "de" ? "Sind Sie sicher, dass Sie die Sitzung auf" : "Are you sure you want to cancel the session on"}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
//           </p>
//           <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
//             {lang === "de" ? "Nach dem Abbruch wird das Gerät automatisch für 3 Minuten zur Reinigung markiert." : "After cancellation, the device will be marked for cleaning for 3 minutes automatically."}
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
//             {lang === "de" ? "Sitzung abbrechen" : "Cancel Session"}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {lang === "de" ? "Weiterlaufen lassen" : "Keep Running"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <div className="flex flex-col items-center text-center gap-3">
//           <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl">🧹</div>
//           <h2 className="text-base sm:text-lg font-semibold">{lang === "de" ? "Zur Reinigung markieren" : "Mark for Cleaning"}</h2>
//           <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
//             {lang === "de" ? "Markieren Sie" : "Mark"}{" "}
//             <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>
//             {lang === "de" ? "zur Reinigung?" : " for cleaning?"}
//           </p>
//           <p className="text-[11px] text-sky-400">
//             {lang === "de" ? `Das Gerät wird für ${duration} Minuten für die Reinigung nicht verfügbar sein.` : `The device will be unavailable for ${duration} minutes for cleaning.`}
//           </p>
//         </div>
//         <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
//           <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
//             {lang === "de" ? "Reinigung starten" : "Start Cleaning"}
//           </button>
//           <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
//             {lang === "de" ? "Abbrechen" : "Cancel"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EnhancedCabinDetailsModal({
//   isDark,
//   lang,
//   device,
//   bookings,
//   logs,
//   sessionUsers,
//   activeTab,
//   onTabChange,
//   onRemoveUser,
//   onClose,
//   onStartSession
// }) {
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl space-y-4"}>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
//               {lang === "de" ? "KABINEN-DETAILS" : "CABIN DETAILS"}
//             </p>
//             <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="text-[11px] sm:text-xs text-slate-500">
//               {device.category || (lang === "de" ? "Gerät" : "Device")} · {device.type || "SUNLIGHT"}
//             </p>
//           </div>
//           <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
//             ✕
//           </button>
//         </div>
//         <div className="flex border-b">
//           <button
//             onClick={() => onTabChange("users")}
//             className={`px-4 py-2 text-sm ${activeTab === "users" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             {lang === "de" ? "Benutzer" : "Users"} ({sessionUsers.length})
//           </button>
//           <button
//             onClick={() => onTabChange("bookings")}
//             className={`px-4 py-2 text-sm ${activeTab === "bookings" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             {lang === "de" ? "Buchungen" : "Bookings"} ({bookings.length})
//           </button>
//           <button
//             onClick={() => onTabChange("logs")}
//             className={`px-4 py-2 text-sm ${activeTab === "logs" ? "border-b-2 border-emerald-500" : ""}`}
//           >
//             {lang === "de" ? "Wartungsprotokolle" : "Maintenance Logs"} ({logs.length})
//           </button>
//         </div>
//         <div className="max-h-64 overflow-y-auto">
//           {activeTab === "users" && (
//             <div className="space-y-2">
//               {sessionUsers.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">
//                   {lang === "de" ? "Keine Benutzer angemeldet" : "No users logged in"}
//                 </p>
//               ) : (
//                 sessionUsers.map((user, index) => (
//                   <div key={user.id} className="flex justify-between items-center p-2 border rounded">
//                     <div>
//                       <div className="font-medium">{user.name}</div>
//                       <div className="text-xs text-slate-500">
//                         {lang === "de" ? "Gestartet:" : "Started:"} {new Date(user.startTime).toLocaleTimeString()}
//                       </div>
//                       <div className="text-xs text-slate-500">
//                         {lang === "de" ? "Dauer:" : "Duration:"} {user.duration} {lang === "de" ? "Minuten" : "minutes"}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => onRemoveUser(user.id)}
//                       className="text-xs bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
//                     >
//                       {lang === "de" ? "Entfernen" : "Remove"}
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "bookings" && (
//             <div className="space-y-2">
//               {bookings.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">
//                   {lang === "de" ? "Keine Buchungen" : "No bookings"}
//                 </p>
//               ) : (
//                 bookings.map((b) => (
//                   <div key={b._id} className="border rounded-lg px-3 py-1.5">
//                     <div className="font-medium">
//                       {b.startTime} · {b.durationMinutes} {lang === "de" ? "Min" : "min"}
//                     </div>
//                     <div className="text-slate-500 text-sm">
//                       {b.customerName || (lang === "de" ? "Unbenannte Buchung" : "Unnamed booking")}
//                     </div>
//                     <div className={`text-xs ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
//                       {b.status}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//           {activeTab === "logs" && (
//             <div className="space-y-2">
//               {logs.length === 0 ? (
//                 <p className="text-[11px] text-slate-500 text-center py-4">
//                   {lang === "de" ? "Keine Wartungsprotokolle" : "No maintenance logs"}
//                 </p>
//               ) : (
//                 logs.map((log) => (
//                   <div key={log.id} className="border rounded-lg p-2">
//                     <div className="flex justify-between">
//                       <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
//                         {log.action.replace('_', ' ')}
//                       </span>
//                       <span className="text-xs text-slate-500">
//                         {new Date(log.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                     {log.note && <div className="text-sm mt-1">{log.note}</div>}
//                     {log.duration > 0 && (
//                       <div className="text-xs text-slate-500">
//                         {lang === "de" ? "Dauer:" : "Duration:"} {log.duration} {lang === "de" ? "Sekunden" : "seconds"}
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//         <div className="flex justify-end">
//           <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
//             {lang === "de" ? "Schließen" : "Close"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
//   const [lastMinutes, setLastMinutes] = useState(20);

//   useEffect(() => {
//     getLastDuration("Walk-in Customer").then(d => {
//       if (d !== null) setLastMinutes(d);
//     });
//   }, []);

//   useEffect(() => {
//     setMinutes(lastMinutes);
//   }, [lastMinutes]);

//   const minMin = 4;
//   const maxMin = 25;

//   const adjustMinutes = (delta) => {
//     setMinutes((prev) => {
//       let next = prev + delta;
//       if (next < minMin) next = minMin;
//       if (next > maxMin) next = maxMin;
//       return next;
//     });
//   };

//   const setToMin = () => setMinutes(minMin);
//   const setToLast = () => setMinutes(lastMinutes);
//   const setToMax = () => setMinutes(maxMin);

//   const helpfulMessage = lang === "de" 
//     ? "Die letzte Buchung basiert immer auf der zuletzt genutzten Dauer des Kunden. Das System merkt sich dies pro Kunde, um schneller zu buchen – ohne ständig + / - drücken zu müssen."
//     : "The last booking is always based on the customer's last used duration. The system remembers this per customer for faster booking - without constantly pressing + / -.";

//   const title = lang === "de" ? "SITZUNG STARTEN" : "START SESSION";
//   const subtitle = lang === "de" 
//     ? "Sitzungszeit (4-25 Minuten) vor dem Start festlegen."
//     : "Set session time (4-25 minutes) before starting.";
//   const preRunText = lang === "de" 
//     ? "+3 Minuten Vorlaufzeit automatisch inklusive"
//     : "+3 minutes pre-run automatically included";
//   const durationSelect = lang === "de" 
//     ? "Sitzungsdauer auswählen"
//     : "Select session duration";
//   const preRunTotal = lang === "de" 
//     ? `+3 Min Vorlauf = ${minutes + 3} Min gesamt`
//     : `+3 Min pre-run = ${minutes + 3} Min total`;
//   const minimumText = lang === "de" ? "Minimum" : "Minimum";
//   const lastBookingText = lang === "de" ? "Letzte Buchung" : "Last Booking";
//   const maximumText = lang === "de" ? "Maximum" : "Maximum";
//   const estimatedPrice = lang === "de" ? "Geschätzter Preis" : "Estimated Price";
//   const preRunFree = lang === "de" 
//     ? `(für ${minutes} Minuten, Vorlaufzeit kostenlos)`
//     : `(for ${minutes} minutes, pre-run time free)`;
//   const startButton = lang === "de" 
//     ? `Sitzung starten (${minutes + 3} Min gesamt)`
//     : `Start session (${minutes + 3} Min total)`;
//   const cancelButton = lang === "de" ? "Abbrechen" : "Cancel";
//   const savingText = lang === "de" ? "Wird gestartet..." : "Starting...";

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
//             <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
//             <p className="mt-0.5 text-[10px] text-slate-500">
//               {subtitle}
//               <span className="block mt-1 text-emerald-400 text-[9px]">
//                 {preRunText}
//               </span>
//             </p>
//           </div>
//           <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
//             ×
//           </button>
//         </div>

//         <div className="space-y-3">
//           <p className="text-[10px] font-medium text-slate-500">{durationSelect}</p>

//           <div className="flex items-center justify-center gap-4">
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(-1)} 
//               disabled={saving || minutes <= minMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               −
//             </button>
//             <div className="flex flex-col items-center">
//               <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
//                 {minutes} Min
//               </div>
//               <div className="text-[9px] text-emerald-400 mt-1">
//                 {preRunTotal}
//               </div>
//             </div>
//             <button 
//               type="button" 
//               onClick={() => adjustMinutes(1)} 
//               disabled={saving || minutes >= maxMin} 
//               className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
//             >
//               +
//             </button>
//           </div>

//           <div className="grid grid-cols-3 gap-2">
//             <div className="text-center">
//               <button 
//                 onClick={setToMin} 
//                 className={`block w-full text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 <span className="block text-[9px] font-medium text-slate-500 mb-0.5">{minimumText}</span>
//                 {minMin} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <button 
//                 onClick={setToLast} 
//                 className={`block w-full text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 <span className="block text-[9px] font-medium text-slate-500 mb-0.5">{lastBookingText}</span>
//                 {lastMinutes} Min
//               </button>
//             </div>
//             <div className="text-center">
//               <button 
//                 onClick={setToMax} 
//                 className={`block w-full text-[10px] font-bold py-1.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
//               >
//                 <span className="block text-[9px] font-medium text-slate-500 mb-0.5">{maximumText}</span>
//                 {maxMin} Min
//               </button>
//             </div>
//           </div>

//           <div className="mt-2 text-center text-[10px] italic text-slate-400">
//             {helpfulMessage}
//           </div>

//           <div className="flex items-center justify-end gap-2">
//             <div className="text-right">
//               <p className="text-[10px] text-slate-500">{estimatedPrice}</p>
//               <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
//               <p className="text-[9px] text-emerald-400">
//                 {preRunFree}
//               </p>
//             </div>
//           </div>
//         </div>

//         {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

//         <div className="space-y-2">
//           <button 
//             onClick={onConfirm} 
//             disabled={saving} 
//             className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
//           >
//             {saving ? savingText : startButton}
//           </button>
//           <button 
//             onClick={onCancel} 
//             disabled={saving} 
//             className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
//           >
//             {cancelButton}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AddUserModal({ isDark, device, onCancel, onConfirm }) {
//   const { language } = useLanguage();
//   const lang = language || "en";
//   const [userName, setUserName] = useState("");
//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
//       <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
//         <h3 className="text-lg font-semibold mb-2">
//           {lang === "de" ? "Benutzer hinzufügen zu" : "Add User to"} {device.name}
//         </h3>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm mb-1">
//               {lang === "de" ? "Benutzername" : "User Name"}
//             </label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               placeholder={lang === "de" ? "Benutzername eingeben" : "Enter user name"}
//               className="w-full px-3 py-2 border rounded-lg bg-transparent"
//               autoFocus
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={onCancel}
//               className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
//             >
//               {lang === "de" ? "Abbrechen" : "Cancel"}
//             </button>
//             <button
//               onClick={() => onConfirm(userName)}
//               disabled={!userName.trim()}
//               className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
//             >
//               {lang === "de" ? "Benutzer hinzufügen" : "Add User"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { t, trDynamic } from "../i18n";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../config/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  FiSearch,
  FiClock,
  FiUser,
  FiActivity,
  FiUsers,
  FiCalendar,
  FiX,
  FiPlus,
  FiMinus,
  FiCheck,
  FiTrash2,
  FiAlertCircle,
  FiSettings
} from "react-icons/fi";



const API_BASE = "https://backend-two-orpin-12.vercel.app";

const LOCAL_SESSIONS_KEY = "aios:runningSessions";
const LOCAL_MAINTENANCE_LOGS = "aios:maintenanceLogs";
const LOCAL_MAINTENANCE_TIMERS = "aios:maintenanceTimers";

async function fetchJSON(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function getLastDuration(customerName) {
  try {
    const res = await fetchJSON(`${API_BASE}/api/bookings?customerName=${encodeURIComponent(customerName)}`, {});
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const sorted = data.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.startTime);
      const dateB = new Date(b.date + ' ' + b.startTime);
      return dateB - dateA;
    });
    return sorted[0].durationMinutes - 3;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function TimerWithSeconds({ minutesLeft, secondsLeft }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-mono font-bold">
        {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
      </div>
      <div className="text-xs text-slate-500 mt-1">remaining</div>
    </div>
  );
}

function Dashboard({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookings, setBookings] = useState([]);
  const [maintenanceTarget, setMaintenanceTarget] = useState(null);
  const [detailsCabin, setDetailsCabin] = useState(null);
  const [detailsTab, setDetailsTab] = useState("users");
  const [now, setNow] = useState(() => new Date());
  const [localSessions, setLocalSessions] = useState({});
  const [maintenanceLogs, setMaintenanceLogs] = useState({});
  const [maintenanceTimers, setMaintenanceTimers] = useState({});
  const [startModalDevice, setStartModalDevice] = useState(null);
  const [startMinutes, setStartMinutes] = useState(20);
  const [startSaving, setStartSaving] = useState(false);
  const [startError, setStartError] = useState("");
  const [addUserModal, setAddUserModal] = useState(null);
  const [cleaningModal, setCleaningModal] = useState(null);
  const [cancelConfirmModal, setCancelConfirmModal] = useState(null);

  const [customerSearch, setCustomerSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    try {
      const sessionsRaw = localStorage.getItem(LOCAL_SESSIONS_KEY);
      if (sessionsRaw) {
        const parsed = JSON.parse(sessionsRaw);
        const nowTs = Date.now();
        const cleaned = {};
        Object.entries(parsed).forEach(([cabinId, session]) => {
          if (session?.endAt > nowTs) {
            cleaned[cabinId] = session;
          } else if (session?.status === "running") {
            cleaned[cabinId] = {
              ...session,
              endAt: nowTs + (3 * 60 * 1000),
              status: "cleaning",
              autoCleaning: true
            };
          }
        });
        setLocalSessions(cleaned);
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(cleaned));
      }

      const logsRaw = localStorage.getItem(LOCAL_MAINTENANCE_LOGS);
      if (logsRaw) {
        setMaintenanceLogs(JSON.parse(logsRaw));
      }

      const timersRaw = localStorage.getItem(LOCAL_MAINTENANCE_TIMERS);
      if (timersRaw) {
        const timers = JSON.parse(timersRaw);
        const nowTs = Date.now();
        const cleanedTimers = {};

        Object.entries(timers).forEach(([deviceId, timer]) => {
          if (timer.endAt > nowTs) {
            cleanedTimers[deviceId] = timer;
          }
        });

        setMaintenanceTimers(cleanedTimers);
        localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(cleanedTimers));
      }
    } catch (e) {
      console.error("Failed to load local data", e);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const newNow = new Date();
      setNow(newNow);
      const nowTs = newNow.getTime();

      setLocalSessions((prev) => {
        const updated = {};
        let changed = false;
        Object.entries(prev).forEach(([deviceId, session]) => {
          if (session?.endAt > nowTs) {
            updated[deviceId] = session;
          } else if (session?.status === "running") {
            updated[deviceId] = {
              ...session,
              endAt: nowTs + (3 * 60 * 1000),
              status: "cleaning",
              autoCleaning: true
            };
            changed = true;
          } else {
            changed = true;
          }
        });
        if (changed) {
          try {
            localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
          } catch (e) { }
        }
        return updated;
      });

      setMaintenanceTimers((prev) => {
        const updated = { ...prev };
        let changed = false;

        Object.entries(prev).forEach(([deviceId, timer]) => {
          if (timer.endAt > nowTs) {
            updated[deviceId] = timer;
          } else {
            delete updated[deviceId];
            changed = true;

            setDevices((devicesPrev) =>
              devicesPrev.map(d =>
                d._id === deviceId
                  ? { ...d, maintenance: false, maintenanceStart: null }
                  : d
              )
            );

            const logEntry = {
              id: Date.now(),
              deviceId,
              action: "maintenance_auto_completed",
              timestamp: newNow.toISOString(),
              note: "Maintenance auto-completed after timer reached 0",
              duration: 3 * 60
            };

            setMaintenanceLogs(prevLogs => {
              const deviceLogs = prevLogs[deviceId] || [];
              const updatedLogs = {
                ...prevLogs,
                [deviceId]: [logEntry, ...deviceLogs]
              };
              localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updatedLogs));
              return updatedLogs;
            });

            fetchJSON(
              `${API_BASE}/api/cabins/${deviceId}/maintenance`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  maintenance: false,
                  maintenanceEnd: newNow.toISOString(),
                  maintenanceDuration: 3 * 60
                }),
              },
              12000
            ).catch(e => console.error("Failed to auto-update maintenance end", e));
          }
        });

        if (changed) {
          try {
            localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
          } catch (e) { }
        }

        return updated;
      });

    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Load devices from Firestore (Real-time)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        _id: doc.id,
        id: doc.id,
        ...doc.data()
      }));
      setDevices(data);
      setLoading(false);
    }, (err) => {
      console.error("Dashboard: Firestore Error:", err);
      setError(t(lang, "dash.loadError"));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [lang]);


  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      try {
        const params = new URLSearchParams({ date: selectedDate }).toString();
        const res = await fetchJSON(`${API_BASE}/api/bookings?${params}`, {}, 12000);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setBookings([]);
      }
    };
    fetchBookings();
    return () => { mounted = false; };
  }, [selectedDate]);

  useEffect(() => {
    const searchCustomers = async () => {
      if (!customerSearch.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        const res = await fetchJSON(`${API_BASE}/api/customers?search=${encodeURIComponent(customerSearch)}`, {});
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];

          // Client-side fallback filtering (in case backend returns all users)
          const lowerSearch = customerSearch.toLowerCase();

          const filtered = list.map(c => ({
            ...c,
            // Ensure name exists for display/filtering
            name: c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Unknown"
          })).filter(c =>
            (c.name && c.name.toLowerCase().includes(lowerSearch)) ||
            (c.email && c.email.toLowerCase().includes(lowerSearch)) ||
            (c.phone && c.phone.toLowerCase().includes(lowerSearch)) ||
            (c.firstName && c.firstName.toLowerCase().includes(lowerSearch)) ||
            (c.lastName && c.lastName.toLowerCase().includes(lowerSearch))
          );

          setSearchResults(filtered);
        }
      } catch (e) {
        console.error("Search error:", e);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCustomers, 300);
    return () => clearTimeout(debounceTimer);
  }, [customerSearch]);

  const toMinutes = (hhmm) => {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  const devicesWithStatus = useMemo(() => {
    if (!devices.length) return [];
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const nowSeconds = now.getSeconds();
    const nowTs = now.getTime();
    return devices.map((dev) => {
      const devBookings = bookings
        .filter((b) => b.cabinId === dev._id)
        .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
      let active = null;
      for (const b of devBookings) {
        if (b.status === "cancelled") continue;
        const start = toMinutes(b.startTime);
        const end = start + (b.durationMinutes || 0);
        if (start <= nowMinutes && nowMinutes < end) {
          active = { ...b, start, end };
          break;
        }
      }
      const localSession = localSessions[dev._id];
      const sessionUsers = localSession?.users || [];
      let status = dev.status || "free";
      let minutesLeft = 0;
      let secondsLeft = 0;
      let currentCustomer = dev.currentCustomer || dev.customer || "";
      let buttonState = "start";

      const maintenanceTimer = maintenanceTimers[dev._id];

      if (maintenanceTimer && maintenanceTimer.endAt > nowTs) {
        status = "maintenance";
        const totalSecondsLeft = Math.max(0, Math.ceil((maintenanceTimer.endAt - nowTs) / 1000));
        minutesLeft = Math.floor(totalSecondsLeft / 60);
        secondsLeft = totalSecondsLeft % 60;
        currentCustomer = lang === "de" ? "Kein aktiver Kunde" : "No active customer";
        buttonState = "endMaintenance";

        if (!dev.maintenance) {
          setDevices(prev => prev.map(d =>
            d._id === dev._id ? { ...d, maintenance: true } : d
          ));
        }
      }
      else if (maintenanceTimer) {
        status = "free";
        minutesLeft = 0;
        secondsLeft = 0;
        currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
        buttonState = "start";

        setMaintenanceTimers(prev => {
          const updated = { ...prev };
          delete updated[dev._id];
          localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
          return updated;
        });
      }
      else if (dev.maintenance) {
        status = "maintenance";
        const endAt = nowTs + (3 * 60 * 1000);
        setMaintenanceTimers(prev => {
          const updated = {
            ...prev,
            [dev._id]: { endAt }
          };
          localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
          return updated;
        });
        minutesLeft = 3;
        secondsLeft = 0;
        currentCustomer = lang === "de" ? "Kein aktiver Kunde" : "No active customer";
        buttonState = "endMaintenance";
      }
      else if (localSession && localSession.endAt > nowTs) {
        const totalSecondsLeft = Math.max(0, Math.ceil((localSession.endAt - nowTs) / 1000));
        minutesLeft = Math.floor(totalSecondsLeft / 60);
        secondsLeft = totalSecondsLeft % 60;

        if (localSession.status === "cleaning") {
          status = "cleaning";
          buttonState = localSession.autoCleaning ? "completeCleaning" : "endCleaning";
        } else if (localSession.status === "locked") {
          status = "locked";
          buttonState = "unlock";
        } else {
          status = "running";
          buttonState = "cancel";
        }

        currentCustomer = sessionUsers.length > 0
          ? `${sessionUsers.length} ${lang === "de" ? "Benutzer angemeldet" : "user(s) logged in"}`
          : t(lang, "cabin.inUse");
      } else if (active) {
        status = "running";
        minutesLeft = Math.max(0, active.end - nowMinutes);
        secondsLeft = 60 - nowSeconds;
        buttonState = "cancel";
        currentCustomer = active.customerName || t(lang, "cabin.inUse");
      } else {
        status = "free";
        buttonState = "start";
        currentCustomer = currentCustomer || t(lang, "cabin.noActiveCustomer");
      }

      return {
        ...dev,
        status,
        minutesLeft,
        secondsLeft,
        sessionUsers,
        currentCustomer,
        buttonState,
        sessionData: localSession
      };
    });
  }, [devices, bookings, now, localSessions, maintenanceTimers, lang]);

  const getPriceForMinutes = (device, minutes) => {
    if (device?.minutePricing && typeof device.minutePricing === "object") {
      let total = 0;
      for (let i = 1; i <= minutes; i++) {
        const minutePrice = device.minutePricing[i] ?? device.minutePricing["default"] ?? 0;
        total += minutePrice;
      }
      return total;
    }
    const base = device?.baseMinutePrice ?? 2;
    return base * minutes;
  };

  const startSession = async (device, selectedMinutes, customerName = "Walk-in Customer") => {
    try {
      setStartSaving(true);
      setStartError("");

      const actualDurationMinutes = selectedMinutes + 3;

      const nowLocal = new Date();
      const h = String(nowLocal.getHours()).padStart(2, "0");
      const m = String(nowLocal.getMinutes()).padStart(2, "0");
      const startTime = `${h}:${m}`;

      const body = {
        cabinId: device._id,
        date: selectedDate,
        startTime,
        durationMinutes: actualDurationMinutes,
        status: "booked",
        customerName,
      };

      const res = await fetchJSON(
        `${API_BASE}/api/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        12000
      );

      if (!res.ok) {
        setStartError(t(lang, "start.serverError"));
        return false;
      }

      const saved = await res.json();
      setBookings((prev) => [...prev, saved]);

      const endAt = Date.now() + actualDurationMinutes * 60 * 1000;
      const newUser = {
        id: Date.now(),
        name: customerName,
        startTime: new Date().toISOString(),
        duration: actualDurationMinutes
      };

      setLocalSessions((prev) => {
        const updated = {
          ...prev,
          [device._id]: {
            endAt,
            status: "running",
            users: [newUser],
            selectedDuration: selectedMinutes,
            actualDuration: actualDurationMinutes
          }
        };
        try {
          localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
        } catch (e) { }
        return updated;
      });



      // Update Firestore
      await updateDoc(doc(db, "devices", device._id), {
        status: "running",
        currentCustomer: customerName,
        currentSessionEnd: endAt
      });

      return true;

    } catch (e) {
      setStartError(t(lang, "start.networkError"));
      return false;
    } finally {
      setStartSaving(false);
    }
  };

  const startSessionFromDetails = async (device, durationSeconds, price) => {
    try {
      const durationMinutes = Math.ceil(durationSeconds / 60);
      return await startSession(device, durationMinutes, t(lang, "misc.walkIn"));
    } catch (error) {
      console.error("Failed to start session from details:", error);
      return false;
    }
  };

  const cancelSession = async (deviceId) => {
    try {
      setLocalSessions((prev) => {
        const updated = { ...prev };
        const session = updated[deviceId];

        if (session?.status === "running") {
          updated[deviceId] = {
            ...session,
            endAt: Date.now() + (3 * 60 * 1000),
            status: "cleaning",
            autoCleaning: true
          };
        } else {
          delete updated[deviceId];
        }

        try {
          localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
        } catch (e) { }
        return updated;
      });



      // Update Firestore
      await updateDoc(doc(db, "devices", deviceId), {
        status: "cleaning",
        maintenance: false
      });

      const device = devices.find(d => d._id === deviceId);

      if (device) {
        const activeBooking = bookings.find(b =>
          b.cabinId === deviceId &&
          b.status !== "cancelled" &&
          !b.status?.includes("completed")
        );

        if (activeBooking) {
          await fetchJSON(
            `${API_BASE}/api/bookings/${activeBooking._id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "cancelled" }),
            },
            12000
          );

          setBookings(prev => prev.map(b =>
            b._id === activeBooking._id ? { ...b, status: "cancelled" } : b
          ));
        }
      }
    } catch (e) {
      console.error("Failed to cancel session", e);
    } finally {
      setCancelConfirmModal(null);
    }
  };

  const markAsCleaning = (deviceId) => {
    setLocalSessions((prev) => {
      const session = prev[deviceId];
      const updated = {
        ...prev,
        [deviceId]: {
          ...session,
          endAt: Date.now() + (3 * 60 * 1000),
          status: "cleaning",
          autoCleaning: false
        }
      };
      try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    // Update Firestore
    updateDoc(doc(db, "devices", deviceId), {
      status: "cleaning",
      maintenance: false
    }).catch(e => console.error("Firestore update failed", e));
  };


  const endCleaning = (deviceId) => {
    setLocalSessions((prev) => {
      const updated = { ...prev };
      delete updated[deviceId];
      try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    // Update Firestore
    updateDoc(doc(db, "devices", deviceId), {
      status: "free",
      maintenance: false
    }).catch(e => console.error("Firestore update failed", e));
  };


  const unlockDevice = (deviceId) => {
    setLocalSessions((prev) => {
      const updated = { ...prev };
      delete updated[deviceId];
      try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });

    // Update Firestore
    updateDoc(doc(db, "devices", deviceId), {
      status: "free",
      maintenance: false
    }).catch(e => console.error("Firestore update failed", e));
  };


  const addUserToSession = (deviceId, userName) => {
    setLocalSessions((prev) => {
      const existingSession = prev[deviceId];
      if (!existingSession) return prev;
      const newUser = {
        id: Date.now(),
        name: userName,
        startTime: new Date().toISOString(),
        duration: Math.ceil((existingSession.endAt - Date.now()) / 60000)
      };
      const updated = {
        ...prev,
        [deviceId]: {
          ...existingSession,
          users: [...existingSession.users, newUser]
        }
      };

      try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
      } catch (e) { }

      return updated;
    });
    setAddUserModal(null);
  };

  const removeUserFromSession = (deviceId, userId) => {
    setLocalSessions((prev) => {
      const existingSession = prev[deviceId];
      if (!existingSession) return prev;
      const updatedUsers = existingSession.users.filter(user => user.id !== userId);

      if (updatedUsers.length === 0) {
        const updated = { ...prev };
        delete updated[deviceId];
        try {
          localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
        } catch (e) { }
        return updated;
      }
      const updated = {
        ...prev,
        [deviceId]: {
          ...existingSession,
          users: updatedUsers
        }
      };

      try {
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
      } catch (e) { }

      return updated;
    });
  };

  const startMaintenance = async (deviceId) => {
    try {
      const timestamp = new Date().toISOString();
      const endAt = Date.now() + (3 * 60 * 1000);

      const logEntry = {
        id: Date.now(),
        deviceId,
        action: "maintenance_started",
        timestamp,
        note: "Maintenance initiated",
        duration: 0
      };

      setMaintenanceLogs(prev => {
        const deviceLogs = prev[deviceId] || [];
        const updated = {
          ...prev,
          [deviceId]: [logEntry, ...deviceLogs]
        };
        localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
        return updated;
      });

      setDevices(prev => prev.map(d =>
        d._id === deviceId ? { ...d, maintenance: true, maintenanceStart: timestamp } : d
      ));

      setMaintenanceTimers(prev => {
        const updated = {
          ...prev,
          [deviceId]: { endAt, startedAt: Date.now() }
        };
        localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
        return updated;
      });

      setLocalSessions(prev => {
        const updated = { ...prev };
        delete updated[deviceId];
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(updated));
        return updated;
      });



      // Update Firestore
      await updateDoc(doc(db, "devices", deviceId), {
        maintenance: true,
        status: "maintenance",
        maintenanceStart: timestamp
      });

      await fetchJSON(

        `${API_BASE}/api/cabins/${deviceId}/maintenance`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            maintenance: true,
            maintenanceStart: timestamp
          }),
        },
        12000
      );
      return true;
    } catch (e) {
      console.error("Failed to save maintenance", e);
      return false;
    }
  };

  const endMaintenance = async (deviceId) => {
    try {
      const device = devices.find(d => d._id === deviceId);
      const startTime = device?.maintenanceStart ? new Date(device.maintenanceStart) : new Date();
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000);

      const logEntry = {
        id: Date.now(),
        deviceId,
        action: "maintenance_completed",
        timestamp: endTime.toISOString(),
        note: "Maintenance manually completed",
        duration
      };

      setMaintenanceLogs(prev => {
        const deviceLogs = prev[deviceId] || [];
        const updated = {
          ...prev,
          [deviceId]: [logEntry, ...deviceLogs]
        };
        localStorage.setItem(LOCAL_MAINTENANCE_LOGS, JSON.stringify(updated));
        return updated;
      });

      setDevices(prev => prev.map(d =>
        d._id === deviceId ? { ...d, maintenance: false, maintenanceStart: null } : d
      ));

      setMaintenanceTimers(prev => {
        const updated = { ...prev };
        delete updated[deviceId];
        localStorage.setItem(LOCAL_MAINTENANCE_TIMERS, JSON.stringify(updated));
        return updated;
      });



      // Update Firestore
      await updateDoc(doc(db, "devices", deviceId), {
        maintenance: false,
        status: "free",
        maintenanceStart: null
      });

      await fetchJSON(

        `${API_BASE}/api/cabins/${deviceId}/maintenance`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            maintenance: false,
            maintenanceEnd: endTime.toISOString(),
            maintenanceDuration: duration
          }),
        },
        12000
      );
      return true;
    } catch (e) {
      console.error("Failed to save maintenance end", e);
      return false;
    }
  };

  const getDeviceLogs = (deviceId) => {
    return maintenanceLogs[deviceId] || [];
  };

  const total = devicesWithStatus.length;
  const running = devicesWithStatus.filter((d) => d.status === "running").length;
  const free = devicesWithStatus.filter((d) => d.status === "free").length;
  const cleaning = devicesWithStatus.filter((d) => d.status === "cleaning").length;
  const errors = devicesWithStatus.filter((d) => d.status === "error").length;
  const inMaintenance = devicesWithStatus.filter((d) => d.maintenance || maintenanceTimers[d._id]).length;

  const openStartModal = (device) => {
    setStartModalDevice(device);
    setStartMinutes(20);
    setStartError("");
  };

  const openMaintenanceModal = (device) => setMaintenanceTarget(device);
  const openDetails = (device) => {
    setDetailsCabin(device);
    setDetailsTab("users");
  };
  const openCancelConfirm = (device) => setCancelConfirmModal(device);
  const openCleaningModal = (device) => setCleaningModal(device);

  const closeStartModal = () => {
    if (startSaving) return;
    setStartModalDevice(null);
  };
  const closeMaintenanceModal = () => setMaintenanceTarget(null);
  const closeDetails = () => setDetailsCabin(null);
  const closeCancelConfirm = () => setCancelConfirmModal(null);
  const closeCleaningModal = () => setCleaningModal(null);

  const handleConfirmStart = async () => {
    if (!startModalDevice) return;
    const success = await startSession(startModalDevice, startMinutes, t(lang, "misc.walkIn"));
    if (success) {
      closeStartModal();
    }
  };

  const confirmMaintenance = async () => {
    if (!maintenanceTarget) return;
    await startMaintenance(maintenanceTarget._id);
    closeMaintenanceModal();
  };

  const confirmCancel = async () => {
    if (!cancelConfirmModal) return;
    await cancelSession(cancelConfirmModal._id);
  };

  const confirmCleaning = () => {
    if (!cleaningModal) return;
    markAsCleaning(cleaningModal._id);
    closeCleaningModal();
  };

  const detailsBookings = useMemo(() => {
    if (!detailsCabin) return [];
    return bookings
      .filter((b) => b.cabinId === detailsCabin._id)
      .sort((a, b) => (a.startTime < b.startTime ? -1 : 1));
  }, [detailsCabin, bookings]);

  const currentStartPrice = startModalDevice && startMinutes
    ? getPriceForMinutes(startModalDevice, startMinutes)
    : 0;

  const statusLine = t(lang, "dash.runningFreeCleaningErrorMaint", {
    running,
    free,
    cleaning,
    errors,
    s: errors !== 1 ? "s" : "",
    inMaintenance,
  });

  return (
    <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        <section className="space-y-2 sm:space-y-3 relative">
          <p className={isDark ? "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-600" : "tracking-[0.35em] text-[9px] sm:text-[10px] font-medium text-slate-500"}>
            AIOS-SYSTEMS
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className={isDark ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50" : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"}>
                {t(lang, "dash.title")}
              </h1>
              <p className={isDark ? "text-xs sm:text-sm text-slate-400 mt-1" : "text-xs sm:text-sm text-slate-600 mt-1"}>
                {t(lang, "dash.subtitle")}
              </p>
            </div>

            <div className={`w-full sm:w-auto ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              <div className="relative">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder={t(lang, "dash.search.placeholder")}
                  className={`w-full sm:w-56 pl-9 pr-3 py-2 rounded-lg text-sm ${isDark
                    ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    : "bg-white border-slate-300 text-gray-900 placeholder:text-slate-400"
                    } border focus:outline-none focus:ring-2 ${isDark ? "focus:ring-emerald-500" : "focus:ring-emerald-400"} focus:border-transparent`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FiSearch className={`w-4 h-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                </div>
                {customerSearch && (
                  <button
                    onClick={() => setCustomerSearch("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              {customerSearch && (
                <div className={`absolute top-full mt-1 z-50 w-full sm:w-56 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border rounded-lg shadow-lg`}>
                  {searchLoading ? (
                    <div className="p-3 text-center text-sm">
                      {t(lang, "dash.search.searching")}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.map(customer => (
                        <div
                          key={customer._id}
                          className="p-2 border-b border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          onClick={() => {
                            console.log("Selected customer:", customer);
                            setCustomerSearch("");
                          }}
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-slate-500">{customer.email}</div>
                          <div className="text-xs text-slate-500">{customer.phone}</div>
                        </div>
                      ))}
                    </div>
                  ) : customerSearch.length > 0 ? (
                    <div className="p-3 text-center text-sm">
                      {t(lang, "dash.search.noResults")}
                    </div>
                  ) : null}
                </div>
              )}

              <p className="text-xs text-slate-500 mt-1 hidden sm:block">
                {t(lang, "dash.search.label")}
              </p>
            </div>
          </div>
        </section>

        {loading && (
          <div className={(isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white") + " rounded-2xl border px-4 py-3 text-sm"}>
            {t(lang, "dash.loadingCabins")}
          </div>
        )}
        {error && !loading && (
          <div className={(isDark ? "bg-rose-900/40 border-rose-500/60 text-rose-100" : "bg-rose-50 border-rose-300 text-rose-700") + " rounded-2xl border px-4 py-3 text-sm"}>
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard theme={theme} label={t(lang, "stats.totalCabins")} value={total} tone="neutral" />
                <StatCard theme={theme} label={t(lang, "stats.running")} value={running} tone="accent" />
                <StatCard theme={theme} label={t(lang, "stats.free")} value={free} tone="success" />
                <StatCard theme={theme} label={t(lang, "stats.cleaning")} value={cleaning} tone="info" />
              </div>
              <div className={isDark ? "rounded-2xl border border-slate-800/70 bg-slate-900/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_50px_rgba(15,23,42,0.85)]" : "rounded-2xl border border-slate-200 bg-gradient-to-br from-white/90 via-slate-50/90 to-sky-50/70 px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className={isDark ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-500"}>
                      {t(lang, "dash.liveStatus")}
                    </p>
                    <p className={isDark ? "mt-1 text-xs sm:text-sm text-slate-300" : "mt-1 text-xs sm:text-sm text-slate-700"}>
                      {statusLine}
                    </p>
                  </div>
                  <StatusPill isDark={isDark} text={t(lang, "dash.receptionLiveHeading")} />
                </div>
                {errors > 0 && (
                  <div className={(isDark ? "bg-rose-500/5 border-rose-500/40 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-700") + " mt-1 flex items-start gap-2 rounded-xl border px-3 py-1.5 text-[11px] sm:text-xs"}>
                    <FiAlertCircle className="mt-[2px] text-xs" />
                    <p>
                      {errors} {t(lang, "dash.attention")}
                    </p>
                  </div>
                )}
              </div>
            </section>
            <section className={isDark ? "rounded-3xl border border-slate-800/70 bg-slate-950/60 shadow-[0_25px_70px_rgba(15,23,42,0.95)] p-3 sm:p-5" : "rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 to-slate-50/90 shadow-[0_24px_70px_rgba(15,23,42,0.10)] p-3 sm:p-5"}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
                <div>
                  <p className={isDark ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500" : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"}>
                    {t(lang, "dash.deviceOverview")}
                  </p>
                  <h2 className={isDark ? "mt-1 text-base sm:text-lg font-semibold text-slate-50" : "mt-1 text-base sm:text-lg font-semibold text-slate-900"}>
                    {t(lang, "dash.receptionLiveHeading")}
                  </h2>
                </div>
                <div className={isDark ? "text-[11px] sm:text-xs text-slate-400 mt-1 sm:mt-0" : "text-[11px] sm:text-xs text-slate-500 mt-1 sm:mt-0"}>{statusLine}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {devicesWithStatus.map((device) => (
                  <CabinCard
                    key={device._id}
                    theme={theme}
                    lang={lang}
                    device={device}
                    onShowDetails={() => openDetails(device)}
                    onQuickStart={() => openStartModal(device)}
                    onRequestMaintenance={() => openMaintenanceModal(device)}
                    onEndMaintenance={() => endMaintenance(device._id)}
                    onCancelSession={() => openCancelConfirm(device)}
                    onMarkCleaning={() => openCleaningModal(device)}
                    onEndCleaning={() => endCleaning(device._id)}
                    onUnlock={() => unlockDevice(device._id)}
                    onAddUser={() => setAddUserModal(device)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      {maintenanceTarget && (
        <MaintenanceModal
          isDark={isDark}
          lang={lang}
          device={maintenanceTarget}
          onCancel={closeMaintenanceModal}
          onConfirm={confirmMaintenance}
        />
      )}
      {detailsCabin && (
        <EnhancedCabinDetailsModal
          isDark={isDark}
          lang={lang}
          device={detailsCabin}
          bookings={detailsBookings}
          logs={getDeviceLogs(detailsCabin._id)}
          sessionUsers={localSessions[detailsCabin._id]?.users || []}
          activeTab={detailsTab}
          onTabChange={setDetailsTab}
          onRemoveUser={(userId) => removeUserFromSession(detailsCabin._id, userId)}
          onClose={closeDetails}
          onStartSession={startSessionFromDetails}
        />
      )}
      {startModalDevice && (
        <StartSessionModal
          isDark={isDark}
          lang={lang}
          device={startModalDevice}
          minutes={startMinutes}
          setMinutes={setStartMinutes}
          price={currentStartPrice}
          saving={startSaving}
          error={startError}
          onCancel={closeStartModal}
          onConfirm={handleConfirmStart}
        />
      )}
      {addUserModal && (
        <AddUserModal
          isDark={isDark}
          device={addUserModal}
          onCancel={() => setAddUserModal(null)}
          onConfirm={(userName) => addUserToSession(addUserModal._id, userName)}
        />
      )}
      {cancelConfirmModal && (
        <CancelConfirmModal
          isDark={isDark}
          lang={lang}
          device={cancelConfirmModal}
          onCancel={closeCancelConfirm}
          onConfirm={confirmCancel}
        />
      )}
      {cleaningModal && (
        <CleaningModal
          isDark={isDark}
          lang={lang}
          device={cleaningModal}
          onCancel={closeCleaningModal}
          onConfirm={confirmCleaning}
          duration={3}
        />
      )}
    </div>
  );
}

function StatCard({ theme, label, value, tone, icon: Icon }) {
  const isDark = theme === "dark";
  const chipColorsDark = {
    neutral: "border-slate-600 bg-slate-900/80 text-slate-200 shadow-[0_0_0_1px_rgba(148,163,184,0.15)]",
    accent: "border-sky-500/60 bg-sky-500/15 text-sky-200 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]",
    success: "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]",
    info: "border-cyan-400/60 bg-cyan-500/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
  };
  const chipColorsLight = {
    neutral: "border-slate-300 bg-slate-100 text-slate-700",
    accent: "border-sky-300 bg-sky-50 text-sky-700",
    success: "border-emerald-300 bg-emerald-50 text-emerald-700",
    info: "border-cyan-300 bg-cyan-50 text-cyan-700",
  };
  const chipColor = isDark ? chipColorsDark[tone] || chipColorsDark.neutral : chipColorsLight[tone] || chipColorsLight.neutral;
  return isDark ? (
    <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-slate-500 text-xs" />}
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
      </div>
      <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-50">{value}</span>
    </div>
  ) : (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50/95 to-sky-50/60 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-slate-400 text-xs" />}
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}>{value}</span>
      </div>
      <span className="mt-3 text-xl sm:text-2xl font-semibold leading-tight text-slate-900">{value}</span>
    </div>
  );
}

function StatusPill({ isDark, text }) {
  return (
    <div className={(isDark ? "bg-slate-900/80 border-slate-700 text-slate-200" : "bg-white/90 border-slate-200 text-slate-700") + " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:text-xs shadow-sm"}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span>{text}</span>
    </div>
  );
}

function CabinCard({
  theme,
  lang,
  device,
  onShowDetails,
  onQuickStart,
  onRequestMaintenance,
  onEndMaintenance,
  onCancelSession,
  onMarkCleaning,
  onEndCleaning,
  onUnlock,
  onAddUser
}) {
  const isDark = theme === "dark";
  const statusStylesDark = {
    free: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/60",
    running: "bg-amber-400/20 text-amber-200 border border-amber-300/70",
    cleaning: "bg-sky-500/20 text-sky-200 border border-sky-400/70",
    error: "bg-rose-500/15 text-rose-200 border border-rose-400/80",
    maintenance: "bg-violet-500/20 text-violet-200 border border-violet-400/80",
    locked: "bg-purple-500/20 text-purple-200 border border-purple-400/80",
  };
  const statusStylesLight = {
    free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    running: "bg-amber-50 text-amber-700 border border-amber-200",
    cleaning: "bg-sky-50 text-sky-700 border border-sky-200",
    error: "bg-rose-50 text-rose-700 border border-rose-200",
    maintenance: "bg-violet-50 text-violet-700 border border-violet-200",
    locked: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  const cardClass = isDark
    ? "group relative rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:border-emerald-400/60 hover:shadow-[0_22px_60px_rgba(16,185,129,0.32)] transition-all duration-200"
    : "group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:border-emerald-400/70 hover:shadow-[0_22px_60px_rgba(16,185,129,0.18)] transition-all duration-200";
  const titleColor = isDark ? "text-slate-50" : "text-slate-900";
  const metaColor = isDark ? "text-slate-400" : "text-slate-500";
  const imageUrl = device.imageUrl;

  const getStatusText = () => {
    if (device.maintenance || device.status === "maintenance") {
      return t(lang, "cabins.status.maintenance").toUpperCase();
    }
    return (device.status || "").toUpperCase();
  };

  const getStatusClass = () => {
    const effectiveStatus = (device.maintenance || device.status === "maintenance") ? "maintenance" : device.status;
    return isDark ? statusStylesDark[effectiveStatus] || statusStylesDark.free : statusStylesLight[effectiveStatus] || statusStylesLight.free;
  };

  const getButtonText = () => {
    if (device.maintenance || device.status === "maintenance") {
      return t(lang, "btn.endMaintenance");
    }

    switch (device.buttonState) {
      case "cancel": return t(lang, "btn.cancel");
      case "cleaning": return t(lang, "btn.cleaning");
      case "endCleaning":
      case "completeCleaning": return t(lang, "btn.endCleaning");
      case "unlock": return t(lang, "btn.unlock");
      case "start": return t(lang, "btn.start");
      case "endMaintenance": return t(lang, "btn.endMaintenance");
      default: return t(lang, "btn.start");
    }
  };

  const handleButtonClick = () => {
    if (device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") {
      return onEndMaintenance();
    }

    switch (device.buttonState) {
      case "cancel": return onCancelSession();
      case "cleaning": return onMarkCleaning();
      case "endCleaning":
      case "completeCleaning": return onEndCleaning();
      case "unlock": return onUnlock();
      case "start": return onQuickStart();
      default: return onQuickStart();
    }
  };

  const getButtonClass = () => {
    if (device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") {
      return isDark ? "bg-violet-600 hover:bg-violet-500" : "bg-violet-500 hover:bg-violet-400";
    }

    switch (device.buttonState) {
      case "cancel": return isDark ? "bg-red-600 hover:bg-red-500" : "bg-red-500 hover:bg-red-400";
      case "cleaning": return isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400";
      case "endCleaning":
      case "completeCleaning": return isDark ? "bg-green-600 hover:bg-green-500" : "bg-green-500 hover:bg-green-400";
      case "unlock": return isDark ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-500 hover:bg-purple-400";
      case "start": return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
      default: return isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-400";
    }
  };

  return (
    <article className={cardClass}>
      <div className="mb-2 rounded-xl overflow-hidden h-28 sm:h-32 bg-slate-900/60 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={device.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-500">No image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/0 to-transparent pointer-events-none" />

        {/* Device Number Badge */}
        {(device.deviceNumber || device.code) && (
          <div className="absolute top-2 left-2 h-8 w-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm z-10">
            <span className="text-slate-900 font-bold text-sm font-mono">
              {device.deviceNumber || device.code}
            </span>
          </div>
        )}
      </div>
      <header className="flex items-start justify-between gap-2">
        <div className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-slate-400">{device.category}</div>
        <span className={`${getStatusClass()} rounded-full px-3 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-wide`}>
          {getStatusText()}
        </span>
      </header>
      <h3 className={`mt-1 text-sm sm:text-base font-semibold ${titleColor}`}>{device.name}</h3>
      <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs">
        <div className={`flex items-center gap-1.5 ${metaColor}`}>
          <FiClock className="w-3.5 h-3.5" />
          <span>
            {(device.maintenance || device.status === "maintenance")
              ? t(lang, "cabin.maintenanceTest")
              : device.minutesLeft > 0 || device.secondsLeft > 0
                ? <TimerWithSeconds minutesLeft={device.minutesLeft} secondsLeft={device.secondsLeft} />
                : `0 ${t(lang, "cabin.min")}`}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 ${metaColor}`}>
          <FiUser className="w-3.5 h-3.5" />
          <span>{device.currentCustomer || t(lang, "cabin.noActiveCustomer")}</span>
        </div>
      </div>

      {(device.maintenance || device.status === "maintenance") && (
        <div className="mt-2 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold">
              {String(device.minutesLeft).padStart(2, '0')}:{String(device.secondsLeft).padStart(2, '0')}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {t(lang, "cabin.minLeft")}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2 text-[11px] sm:text-xs">
        <button onClick={onShowDetails} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-900 text-slate-50 hover:bg-black") + " flex-1 rounded-full py-1.5 font-medium transition-colors"}>
          {t(lang, "btn.details")}
        </button>
        {(device.maintenance || device.status === "maintenance" || device.buttonState === "endMaintenance") ? (
          <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
            {getButtonText()}
          </button>
        ) : (
          <>
            <button onClick={handleButtonClick} className={`${getButtonClass()} text-white flex-1 rounded-full py-1.5 font-medium transition-colors`}>
              {getButtonText()}
            </button>
            {device.status !== "cleaning" && device.status !== "running" && device.status !== "maintenance" && (
              <button onClick={onRequestMaintenance} className={(isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300") + " flex-1 rounded-full py-1.5 font-medium transition-colors flex items-center justify-center gap-1"}>
                <span>{t(lang, "btn.maintenance")}</span>
              </button>
            )}
          </>
        )}
      </div>
      {!device.maintenance && device.status === "running" && device.sessionUsers && device.sessionUsers.length > 0 && (
        <button
          onClick={onAddUser}
          className="mt-2 w-full py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-full"
        >
          + {t(lang, "dash.modals.addUser.add")} ({device.sessionUsers.length})
        </button>
      )}
    </article>
  );
}

function MaintenanceModal({ isDark, lang, device, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl text-violet-500">
            <FiSettings />
          </div>
          <h2 className="text-base sm:text-lg font-semibold">{t(lang, "dash.modals.maintenance.title")}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
            {t(lang, "dash.modals.maintenance.question")}{" "}
            <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
          </p>
          <p className="text-[11px] text-amber-400">
            {t(lang, "dash.modals.maintenance.warning")}
          </p>
          <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
            {t(lang, "dash.modals.maintenance.info")}
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
          <button onClick={onConfirm} className="flex-1 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-2">
            {t(lang, "dash.modals.maintenance.start")}
          </button>
          <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
            {t(lang, "dash.modals.maintenance.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelConfirmModal({ isDark, lang, device, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-10 w-10 rounded-full border border-red-400/60 flex items-center justify-center text-xl text-red-500">
            <FiAlertCircle />
          </div>
          <h2 className="text-base sm:text-lg font-semibold">{t(lang, "dash.modals.cancelSession.title")}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
            {t(lang, "dash.modals.cancelSession.question")}{" "}
            <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>?
          </p>
          <p className="text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-lg">
            {t(lang, "dash.modals.cancelSession.info")}
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
          <button onClick={onConfirm} className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2">
            {t(lang, "dash.modals.cancelSession.confirm")}
          </button>
          <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
            {t(lang, "dash.modals.cancelSession.keep")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CleaningModal({ isDark, lang, device, onCancel, onConfirm, duration }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-10 w-10 rounded-full border border-sky-400/60 flex items-center justify-center text-xl text-sky-500">
            <FiRefreshCw />
          </div>
          <h2 className="text-base sm:text-lg font-semibold">{t(lang, "dash.modals.cleaning.title")}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500 max-w-sm">
            {t(lang, "dash.modals.cleaning.mark")}{" "}
            <span className="font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</span>
            {t(lang, "dash.modals.cleaning.question")}
          </p>
          <p className="text-[11px] text-sky-400">
            {t(lang, "dash.modals.cleaning.desc", { duration })}
          </p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row-reverse gap-2">
          <button onClick={onConfirm} className="flex-1 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2">
            {t(lang, "dash.modals.cleaning.start")}
          </button>
          <button onClick={onCancel} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " flex-1 rounded-full text-sm font-semibold py-2"}>
            {t(lang, "dash.modals.cleaning.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

function EnhancedCabinDetailsModal({
  isDark,
  lang,
  device,
  bookings,
  logs,
  sessionUsers,
  activeTab,
  onTabChange,
  onRemoveUser,
  onClose,
  onStartSession
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-lg w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {t(lang, "dash.modals.cabinDetails.title")}
            </p>
            <h2 className="mt-1 text-base sm:text-lg font-semibold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {device.category || t(lang, "dash.modals.cabinDetails.device")} · {device.type || "SUNLIGHT"}
            </p>
          </div>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
            <FiX size={18} />
          </button>
        </div>

        {/* NEW: Vertical Tabs Layout */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left: Tabs */}
          <div className="flex flex-col space-y-1 sm:w-1/3">
            <button
              onClick={() => onTabChange("users")}
              className={`text-left px-4 py-3 rounded-lg ${activeTab === "users"
                ? (isDark ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-emerald-600")
                : (isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50")}`}
            >
              <div className="flex items-center gap-2 font-medium">
                <FiUsers className="text-lg" />
                {t(lang, "dash.modals.cabinDetails.users")}
              </div>
              <div className="text-xs text-slate-500 ml-6">({sessionUsers.length})</div>
            </button>

            <button
              onClick={() => onTabChange("bookings")}
              className={`text-left px-4 py-3 rounded-lg ${activeTab === "bookings"
                ? (isDark ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-emerald-600")
                : (isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50")}`}
            >
              <div className="flex items-center gap-2 font-medium">
                <FiCalendar className="text-lg" />
                {t(lang, "dash.modals.cabinDetails.bookings")}
              </div>
              <div className="text-xs text-slate-500 ml-6">({bookings.length})</div>
            </button>

            <button
              onClick={() => onTabChange("logs")}
              className={`text-left px-4 py-3 rounded-lg ${activeTab === "logs"
                ? (isDark ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-emerald-600")
                : (isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50")}`}
            >
              <div className="flex items-center gap-2 font-medium">
                <FiActivity className="text-lg" />
                {t(lang, "dash.modals.cabinDetails.logs")}
              </div>
              <div className="text-xs text-slate-500 ml-6">({logs.length})</div>
            </button>
          </div>

          {/* Right: Content */}
          <div className="sm:w-2/3">
            <div className="max-h-[500px] overflow-y-auto">
              {activeTab === "users" && (
                <div className="space-y-2">
                  {sessionUsers.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">
                      {t(lang, "dash.modals.cabinDetails.noUsers")}
                    </p>
                  ) : (
                    sessionUsers.map((user, index) => (
                      <div key={user.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {t(lang, "dash.modals.cabinDetails.started")} {new Date(user.startTime).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {t(lang, "dash.modals.cabinDetails.duration")} {user.duration} {t(lang, "dash.modals.cabinDetails.minutes")}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveUser(user.id)}
                          className="text-xs bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded"
                        >
                          {t(lang, "dash.modals.cabinDetails.remove")}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="space-y-2">
                  {bookings.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">
                      {t(lang, "dash.modals.cabinDetails.noBookings")}
                    </p>
                  ) : (
                    bookings.map((b) => (
                      <div key={b._id} className="border rounded-lg p-3">
                        <div className="font-medium">
                          {b.startTime} · {b.durationMinutes} {t(lang, "cabin.min")}
                        </div>
                        <div className="text-slate-500 text-sm mt-1">
                          {b.customerName || t(lang, "dash.modals.cabinDetails.unnamedBooking")}
                        </div>
                        <div className={`text-xs mt-1 ${b.status === 'cancelled' ? 'text-red-400' : b.status === 'completed' ? 'text-green-400' : 'text-slate-500'} capitalize`}>
                          {b.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">
                      {t(lang, "dash.modals.cabinDetails.noLogs")}
                    </p>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-3">
                        <div className="flex justify-between">
                          <span className={`font-medium capitalize ${log.action.includes('started') ? 'text-amber-400' : 'text-green-400'}`}>
                            {log.action.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {log.note && <div className="text-sm mt-1">{log.note}</div>}
                        {log.duration > 0 && (
                          <div className="text-xs text-slate-500 mt-1">
                            {t(lang, "dash.modals.cabinDetails.duration")} {log.duration} {t(lang, "dash.modals.cabinDetails.seconds")}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className={(isDark ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200") + " rounded-full px-4 py-1.5 text-xs font-semibold"}>
            {t(lang, "dash.modals.cabinDetails.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

function StartSessionModal({ isDark, lang, device, minutes, setMinutes, price, saving, error, onCancel, onConfirm }) {
  const [lastMinutes, setLastMinutes] = useState(20);

  useEffect(() => {
    getLastDuration("Walk-in Customer").then(d => {
      if (d !== null) setLastMinutes(d);
    });
  }, []);

  useEffect(() => {
    setMinutes(lastMinutes);
  }, [lastMinutes]);

  const minMin = 4;
  const maxMin = 25;

  const adjustMinutes = (delta) => {
    setMinutes((prev) => {
      let next = prev + delta;
      if (next < minMin) next = minMin;
      if (next > maxMin) next = maxMin;
      return next;
    });
  };

  const setToMin = () => setMinutes(minMin);
  const setToLast = () => setMinutes(lastMinutes);
  const setToMax = () => setMinutes(maxMin);

  const helpfulMessage = t(lang, "dash.modals.startSession.helpful");
  const title = t(lang, "dash.modals.startSession.title");
  const subtitle = t(lang, "dash.modals.startSession.subtitle");
  const preRunText = t(lang, "dash.modals.startSession.preRunIncluded");
  const durationSelect = t(lang, "dash.modals.startSession.selectDuration");
  const preRunTotal = t(lang, "dash.modals.startSession.preRunTotal", { total: minutes + 3 });
  const minimumText = t(lang, "dash.modals.startSession.min");
  const lastBookingText = t(lang, "dash.modals.startSession.last");
  const maximumText = t(lang, "dash.modals.startSession.max");
  const estimatedPrice = t(lang, "dash.modals.startSession.estPrice");
  const preRunFree = t(lang, "dash.modals.startSession.preRunFree", { minutes });
  const startButton = t(lang, "dash.modals.startSession.start");
  const cancelButton = t(lang, "dash.modals.startSession.cancel");
  const savingText = t(lang, "dash.modals.startSession.starting");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 py-4 space-y-3"}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
            <h2 className="mt-0.5 text-base font-bold">{device.code ? `${device.code} · ${device.name}` : device.name}</h2>
            <p className="mt-0.5 text-[10px] text-slate-500">
              { }
              <span className="block mt-1 text-emerald-400 text-[9px]">
                { }
              </span>
            </p>
          </div>
          <button onClick={onCancel} className="text-lg text-slate-400 hover:text-slate-200" disabled={saving}>
            <FiX />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-medium text-slate-500">{durationSelect}</p>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => adjustMinutes(-1)}
              disabled={saving || minutes <= minMin}
              className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
            >
              <FiMinus />
            </button>
            <div className="flex flex-col items-center">
              <div className={(isDark ? "bg-slate-900 border-slate-700 text-slate-50" : "bg-slate-50 border-slate-300 text-slate-900") + " px-4 py-2 rounded-xl border text-xl font-bold"}>
                {minutes} Min
              </div>
              {/* <div className="text-[9px] text-emerald-400 mt-1">
                {}
              </div> */}
            </div>
            <button
              type="button"
              onClick={() => adjustMinutes(1)}
              disabled={saving || minutes >= maxMin}
              className={(isDark ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200") + " w-10 h-10 flex items-center justify-center rounded-full border text-xl font-bold disabled:opacity-50"}
            >
              <FiPlus />
            </button>
          </div>

          {/* UPDATED: Buttons with larger font and only labels */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <button
                onClick={setToMin}
                className={`block w-full text-sm font-bold py-2.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
              >
                <span className="block text-[11px] font-medium text-slate-500 mb-0.5">{minimumText}</span>
                {/* Removed the "4 Min" text */}
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={setToLast}
                className={`block w-full text-sm font-bold py-2.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
              >
                <span className="block text-[11px] font-medium text-slate-500 mb-0.5">{lastBookingText}</span>
                {/* Removed the "20 Min" text */}
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={setToMax}
                className={`block w-full text-sm font-bold py-2.5 rounded-lg border ${isDark ? "border-slate-600 bg-slate-800 text-emerald-400 hover:bg-slate-700" : "border-slate-300 bg-slate-100 text-emerald-600 hover:bg-slate-200"}`}
              >
                <span className="block text-[11px] font-medium text-slate-500 mb-0.5">{maximumText}</span>
                {/* Removed the "25 Min" text */}
              </button>
            </div>
          </div>

          <div className="mt-2 text-center text-[10px] italic text-slate-400">
            {helpfulMessage}
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="text-right">
              <p className="text-[10px] text-slate-500">{estimatedPrice}</p>
              <p className="text-lg font-bold">€ {price.toFixed(2)}</p>
              {/* <p className="text-[9px] text-emerald-400">
                {}
              </p> */}
            </div>
          </div>
        </div>

        {error && <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded px-2 py-1">{error}</p>}

        <div className="space-y-2">
          {/* UPDATED: Removed time from button text */}
          <button
            onClick={onConfirm}
            disabled={saving}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 disabled:opacity-60"
          >
            {saving ? savingText : startButton}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className={(isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-800") + " w-full text-center text-[10px] font-medium"}
          >
            {cancelButton}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddUserModal({ isDark, device, onCancel, onConfirm }) {
  const { language } = useLanguage();
  const lang = language || "en";
  const [userName, setUserName] = useState("");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className={(isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900") + " max-w-md w-full rounded-2xl border " + (isDark ? "border-slate-700" : "border-slate-200") + " px-4 sm:px-6 py-5 shadow-2xl"}>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-emerald-500">
          <FiUsers className="text-xl" />
          {t(lang, "dash.modals.addUser.title")} {device.name}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              {t(lang, "dash.modals.addUser.nameLabel")}
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t(lang, "dash.modals.addUser.placeholder")}
              className="w-full px-3 py-2 border rounded-lg bg-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
            >
              {t(lang, "dash.modals.addUser.cancel")}
            </button>
            <button
              onClick={() => onConfirm(userName)}
              disabled={!userName.trim()}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
            >
              {t(lang, "dash.modals.addUser.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
