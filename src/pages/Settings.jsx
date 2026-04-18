// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { t } from "../i18n";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = "https://backend-two-orpin-12.vercel.app";

function Settings({ theme }) {
  const isDark = theme === "dark";
  const { language } = useLanguage();
  const lang = language || "en";

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/get`);
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError(t(lang, "settings.error") || "Failed to load settings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [lang]);

  const shellClass = isDark
    ? "min-h-full bg-slate-950 text-slate-50"
    : "min-h-full bg-slate-50 text-slate-900";

  if (loading) {
    return (
      <div key={lang} className={shellClass}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
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
              {t(lang, "settings.loading")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div key={lang} className={shellClass}>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
          <div
            className={
              (isDark
                ? "bg-rose-950/40 border-rose-600/70 text-rose-100"
                : "bg-rose-50 border-rose-300 text-rose-700") +
              " rounded-2xl border px-4 py-4 text-sm"
            }
          >
            {error || t(lang, "settings.errorGeneric")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={lang} className={shellClass}>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <p
            className={
              "tracking-[0.3em] text-[9px] sm:text-[10px] font-medium uppercase " +
              (isDark ? "text-slate-600" : "text-slate-500")
            }
          >
            {t(lang, "settings.header.kicker")}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1
                className={
                  (isDark ? "text-slate-50" : "text-slate-900") +
                  " mt-1 text-2xl sm:text-3xl font-semibold"
                }
              >
                {t(lang, "settings.header.title")}
              </h1>
              <p
                className={
                  isDark
                    ? "text-xs sm:text-sm text-slate-400"
                    : "text-xs sm:text-sm text-slate-600"
                }
              >
                {t(lang, "settings.header.subtitle")}
              </p>
            </div>
            <div
              className={
                (isDark
                  ? "bg-emerald-500/10 border-emerald-400/70 text-emerald-200"
                  : "bg-emerald-50 border-emerald-400/70 text-emerald-700") +
                " inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]"
              }
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t(lang, "settings.header.liveConfig")}</span>
            </div>
          </div>
        </div>

        {/* Content layout */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          {/* Left: Studio profile */}
          <SettingsCard theme={theme} title={t(lang, "settings.studioProfile.title")} description={t(lang, "settings.studioProfile.description")}>
            <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <Field theme={theme} label={t(lang, "settings.studioProfile.fields.studioName")} value={settings.studioProfile.name} />
              <Field theme={theme} label={t(lang, "settings.studioProfile.fields.city")} value={settings.studioProfile.city} />
              <Field theme={theme} label={t(lang, "settings.studioProfile.fields.phone")} value={settings.studioProfile.phone} />
              <Field theme={theme} label={t(lang, "settings.studioProfile.fields.email")} value={settings.studioProfile.email} />
            </div>
          </SettingsCard>

          {/* Right column */}
          <div className="space-y-4">
            {/* Device groups */}
            <SettingsCard theme={theme} title={t(lang, "settings.deviceGroups.title")} description={t(lang, "settings.deviceGroups.description")}>
              <ul className="text-xs sm:text-sm space-y-1.5">
                {settings.deviceGroups.map((group, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{group.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {t(lang, "settings.deviceGroups.devices", { count: group.devices })}
                    </span>
                  </li>
                ))}
              </ul>
            </SettingsCard>

            {/* User accounts */}
            <SettingsCard theme={theme} title={t(lang, "settings.userAccounts.title")} description={t(lang, "settings.userAccounts.description")}>
              <div className="space-y-2 text-xs sm:text-sm">
                {settings.userAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className={
                      (isDark
                        ? "bg-slate-900/80 border-slate-700"
                        : "bg-slate-50 border-slate-200") +
                      " flex items-center justify-between rounded-xl border px-3 py-2"
                    }
                  >
                    <div>
                      <p className="font-medium">
                        {account.role === "Admin"
                          ? t(lang, "settings.userAccounts.roleAdmin")
                          : t(lang, "settings.userAccounts.roleReception")}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {account.role === "Admin"
                          ? t(lang, "settings.userAccounts.adminDesc")
                          : t(lang, "settings.userAccounts.receptionDesc")}
                      </p>
                    </div>
                    <span
                      className={
                        (isDark
                          ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/60"
                          : "bg-emerald-50 text-emerald-700 border-emerald-300") +
                        " rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                      }
                    >
                      {account.count} account(s)
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                {t(lang, "settings.userAccounts.rbacInfo")}
              </p>
            </SettingsCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ theme, title, description, children }) {
  const isDark = theme === "dark";

  const base =
    "rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 space-y-3 transition-shadow duration-150";

  const themeClasses = isDark
    ? "bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-slate-900/90 border-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.85)] hover:shadow-[0_22px_60px_rgba(15,23,42,0.95)]"
    : "bg-gradient-to-br from-white via-slate-50 to-sky-50/70 border-slate-200 shadow-[0_18px_35px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)]";

  return (
    <section className={base + " " + themeClasses}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-semibold">{title}</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ theme, label, value }) {
  const isDark = theme === "dark";

  const boxClasses = isDark
    ? "border-slate-700/60 bg-slate-900/70 text-slate-100"
    : "border-slate-200 bg-white text-slate-900";

  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className={"rounded-xl border px-3 py-1.5 text-xs sm:text-sm " + boxClasses}>
        {value || "—"}
      </div>
    </div>
  );
}

export default Settings;