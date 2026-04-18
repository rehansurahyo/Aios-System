import React, { useEffect, useState, useMemo } from "react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const API_BASE = "https://backend-two-orpin-12.vercel.app";

function Bookings({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [cabins, setCabins] = useState([]);
  const [selectedCabinId, setSelectedCabinId] = useState("");
  const [selectedCabinCode, setSelectedCabinCode] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState(20);
  const [status, setStatus] = useState("booked");

  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // ------- load cabins (Firestore) ----------
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        _id: doc.id, // Map for compatibility
        id: doc.id,
        ...doc.data()
      }));
      setCabins(data);
      if (data.length > 0 && !selectedCabinId) {
        setSelectedCabinId(data[0]._id);
        setSelectedCabinCode(data[0].code || data[0].name || t(lang, "bookings.cabinFallback"));
      }
    });
    return () => unsubscribe();
  }, [selectedCabinId, lang]);

  useEffect(() => {
    if (!selectedCabinId || !selectedDate) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const params = new URLSearchParams({
          cabinId: selectedCabinId,
          date: selectedDate,
        }).toString();

        const res = await fetch(`${API_BASE}/api/bookings?${params}`);
        if (!res.ok) {
          let msg = t(lang, "bookings.errors.loadBookings");
          try {
            const j = await res.json();
            if (j.message) msg = j.message;
          } catch { }
          setLoadError(msg);
          setBookings([]);
          return;
        }
        const data = await res.json();
        setBookings(data || []);
      } catch (e) {
        console.error("bookings error", e);
        setLoadError(t(lang, "bookings.errors.loadBookingsNetwork"));
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [selectedCabinId, selectedDate, lang]);

  const resetForm = () => {
    setEditingId(null);
    setStatus("booked");
    setCreateError("");
    setCreateSuccess("");
  };

  const handleSave = async () => {
    if (!selectedCabinId) return;

    try {
      setCreating(true);
      setCreateError("");
      setCreateSuccess("");

      const body = {
        cabinId: selectedCabinId,
        date: selectedDate,
        startTime,
        durationMinutes: Number(duration),
        status,
      };

      let url = `${API_BASE}/api/bookings`;
      let method = "POST";

      if (editingId) {
        url = `${API_BASE}/api/bookings/${editingId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = editingId
          ? t(lang, "bookings.errors.updateBooking")
          : t(lang, "bookings.errors.createBooking");
        try {
          const j = await res.json();
          if (j.message) msg = j.message;
        } catch { }
        setCreateError(msg);
        return;
      }

      const saved = await res.json();

      setBookings((prev) => {
        const list = editingId
          ? prev.map((b) => (b._id === saved._id ? saved : b))
          : [...prev, saved];

        return list.sort((a, b) =>
          a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0
        );
      });

      setCreateSuccess(
        editingId
          ? t(lang, "bookings.success.updated")
          : t(lang, "bookings.success.created")
      );

      if (!editingId) {
        const [sh, sm] = startTime.split(":").map(Number);
        let next = sh * 60 + sm + Number(duration);
        const nh = String(Math.floor(next / 60)).padStart(2, "0");
        const nm = String(next % 60).padStart(2, "0");
        setStartTime(`${nh}:${nm}`);
      }

      if (editingId) resetForm();
    } catch (e) {
      console.error("save error", e);
      setCreateError(t(lang, "bookings.errors.network"));
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setStartTime(booking.startTime);
    setDuration(booking.durationMinutes);
    setStatus(booking.status || "booked");
    setCreateError("");
    setCreateSuccess("");
  };

  const handleCancelBooking = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) return;

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );

      if (editingId === id) resetForm();
    } catch (e) {
      console.error("cancel error", e);
    }
  };

  const handleDeleteBooking = async (id) => {
    const ok = window.confirm(t(lang, "bookings.confirm.delete"));
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) return;

      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (editingId === id) resetForm();
    } catch (e) {
      console.error("delete error", e);
    }
  };

  const dayLabel = useMemo(() => {
    const d = new Date(selectedDate);
    const locale = lang === "de" ? "de-DE" : "en-US";
    return d.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, [selectedDate, lang]);

  return (
    <div key={lang} className={isDark ? "min-h-full bg-slate-950 text-slate-50" : "min-h-full bg-slate-50 text-slate-900"}>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="mt-1 text-2xl font-semibold">
            {t(lang, "bookings.header.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t(lang, "bookings.header.subtitle")}
          </p>
        </div>

        {/* Controls */}
        <div className={(isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200") + " border rounded-2xl p-4 space-y-4"}>
          {/* Cabin selection */}
          <div className="flex flex-wrap gap-2">
            {cabins.map((c) => (
              <button
                key={c._id}
                onClick={() => {
                  setSelectedCabinId(c._id);
                  setSelectedCabinCode(c.code || c.name || t(lang, "bookings.cabinFallback"));
                  resetForm();
                }}
                className={
                  (selectedCabinId === c._id
                    ? "bg-emerald-500 text-white"
                    : isDark
                      ? "bg-slate-800 text-slate-200"
                      : "bg-slate-100 text-slate-800") +
                  " px-3 py-1.5 rounded-full text-xs font-medium"
                }
              >
                {c.code || c.name}
              </button>
            ))}
            {cabins.length === 0 && (
              <span className="text-xs text-slate-500">
                {t(lang, "bookings.noCabins")}
              </span>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t(lang, "bookings.form.date")}</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  resetForm();
                }}
                className={
                  (isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900") +
                  " border rounded-lg px-3 py-1.5 text-xs"
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t(lang, "bookings.form.start")}</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={
                  (isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900") +
                  " border rounded-lg px-3 py-1.5 text-xs"
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t(lang, "bookings.form.duration")}</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={
                  (isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900") +
                  " border rounded-lg px-2 py-1.5 text-xs"
                }
              >
                {[10, 15, 20, 25, 30, 40, 50, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} {t(lang, "bookings.form.minutes")}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t(lang, "bookings.form.status")}</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={
                  (isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-white border-slate-200 text-slate-900") +
                  " border rounded-lg px-2 py-1.5 text-xs"
                }
              >
                <option value="booked">{t(lang, "bookings.status.booked")}</option>
                <option value="completed">{t(lang, "bookings.status.completed")}</option>
                <option value="cancelled">{t(lang, "bookings.status.cancelled")}</option>
              </select>
            </div>

            <div className="ml-auto flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-[11px] border border-slate-500 rounded-full px-3 py-1.5 hover:bg-slate-800"
                >
                  {t(lang, "bookings.actions.cancelEdit")}
                </button>
              )}

              <button
                onClick={handleSave}
                disabled={creating || !selectedCabinId}
                className={
                  (creating ? "opacity-70 cursor-wait" : "hover:bg-emerald-400") +
                  " bg-emerald-500 text-white text-xs font-semibold rounded-full px-4 py-1.5"
                }
              >
                {editingId
                  ? t(lang, "bookings.actions.saveChanges")
                  : t(lang, "bookings.actions.addBooking")}
              </button>
            </div>
          </div>

          {createError && <p className="text-xs text-rose-400">{createError}</p>}
          {createSuccess && <p className="text-xs text-emerald-400">{createSuccess}</p>}
        </div>

        {/* Daily overview */}
        <div className={(isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200") + " border rounded-2xl p-4 space-y-3"}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">
                {selectedCabinCode || t(lang, "bookings.cabinFallback")} – {dayLabel}
              </p>
            </div>
          </div>

          {loading && <p className="text-xs text-slate-500">{t(lang, "bookings.loading")}</p>}
          {loadError && <p className="text-xs text-rose-400">{loadError}</p>}

          {!loading && !loadError && bookings.length === 0 && (
            <p className="text-xs text-slate-500">{t(lang, "bookings.empty")}</p>
          )}

          {!loading && !loadError && bookings.length > 0 && (
            <ul className="space-y-2">
              {bookings
                .slice()
                .sort((a, b) => (a.startTime < b.startTime ? -1 : 1))
                .map((b) => {
                  const cancelled = b.status === "cancelled";
                  return (
                    <li
                      key={b._id}
                      className={
                        (isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200") +
                        " border rounded-xl px-3 py-2 flex justify-between items-center text-xs"
                      }
                    >
                      <div>
                        <p className={"font-medium " + (cancelled ? "line-through text-slate-500" : "")}>
                          {b.startTime} – {b.durationMinutes} {t(lang, "bookings.form.minutes")}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {t(lang, "bookings.label.status")}{" "}
                          <span className="capitalize">{t(lang, `bookings.status.${b.status}`) || b.status}</span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(b)}
                          className="px-2 py-1 rounded-full border border-slate-500 text-[11px] hover:bg-slate-800"
                        >
                          {t(lang, "bookings.actions.edit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b._id)}
                          className="px-2 py-1 rounded-full border border-amber-500 text-[11px] text-amber-400 hover:bg-amber-500/10"
                          disabled={cancelled}
                        >
                          {t(lang, "bookings.actions.cancel")}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(b._id)}
                          className="px-2 py-1 rounded-full border border-rose-500 text-[11px] text-rose-400 hover:bg-rose-500/10"
                        >
                          {t(lang, "bookings.actions.delete")}
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookings;