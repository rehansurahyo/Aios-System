// src/pages/ReadingManager.jsx
import React from "react";

const CAMPAIGNS = [
  {
    id: 1,
    name: "Facebook · Winter Tanning Promo",
    platform: "Facebook",
    status: "running",
    budget: "€1,200 / month",
    leads: 48,
    appointments: 32,
  },
  {
    id: 2,
    name: "Instagram · Collagen Bed Highlight",
    platform: "Instagram",
    status: "paused",
    budget: "€800 / month",
    leads: 22,
    appointments: 14,
  },
  {
    id: 3,
    name: "Meta · Brand Awareness Studio",
    platform: "Facebook + Instagram",
    status: "learning",
    budget: "€500 / month",
    leads: 9,
    appointments: 5,
  },
];

const UPCOMING_BOOKINGS = [
  {
    id: 1,
    customer: "Anna K.",
    service: "Solarium · Premium Lounge",
    date: "02 Dec, 14:30",
    source: "Facebook Ad",
  },
  {
    id: 2,
    customer: "Daniel F.",
    service: "Collagen Sunbed",
    date: "02 Dec, 16:00",
    source: "Instagram Ad",
  },
  {
    id: 3,
    customer: "Sandra L.",
    service: "Bodyformer Trial",
    date: "03 Dec, 11:15",
    source: "Meta Campaign",
  },
];

const AUTOMATION_RULES = [
  "Leads from Facebook / Instagram are auto-synced to the studio calendar.",
  "New bookings are created in the 'AIOS Studio Calendar' with customer name + service.",
  "Double-bookings are prevented by checking cabin availability in real time.",
  "Campaign performance is monitored daily for CTR and appointment rate.",
];

function ReadingManager({ theme }) {
  const isDark = theme === "dark";

  const containerBg = isDark
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-100 text-slate-900";

  return (
    <div className={`min-h-full ${containerBg}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <section className="space-y-2 sm:space-y-3">
          <p
            className={
              (isDark ? "text-emerald-300" : "text-emerald-600") +
              " tracking-[0.32em] text-[9px] sm:text-[10px] font-semibold uppercase"
            }
          >
            AI LEAD MANAGER
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1
              className={
                isDark
                  ? "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-50"
                  : "text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900"
              }
            >
              Campaign & Booking Automation
            </h1>
            <span
              className={
                (isDark
                  ? "bg-sky-500/10 text-sky-200 border-sky-400/60"
                  : "bg-sky-100 text-sky-700 border-sky-200") +
                " inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium"
              }
            >
              <span>⚙️</span>
              <span>UI preview · No backend yet</span>
            </span>
          </div>
          <p
            className={
              isDark
                ? "text-xs sm:text-sm text-slate-400 max-w-2xl"
                : "text-xs sm:text-sm text-slate-600 max-w-2xl"
            }
          >
            Central place to monitor AI-driven campaigns on Facebook & Instagram
            and review automatically generated studio appointments.
          </p>
        </section>

        {/* Stats row */}
        <section className="grid gap-3 sm:gap-4 md:grid-cols-4">
          <StatCard
            theme={theme}
            label="Active campaigns"
            value="3"
            sub="Facebook & Instagram"
          />
          <StatCard
            theme={theme}
            label="Monthly ad budget"
            value="€2,500"
            sub="Across all campaigns"
          />
          <StatCard
            theme={theme}
            label="Leads this week"
            value="79"
            sub="From paid traffic"
          />
          <StatCard
            theme={theme}
            label="Auto-booked appointments"
            value="51"
            sub="Synced to calendar"
          />
        </section>

        {/* Main layout: campaigns + automation */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] items-start">
          {/* Campaigns list */}
          <div
            className={
              (isDark
                ? "border-slate-800/70 bg-slate-950/70 shadow-[0_22px_60px_rgba(15,23,42,0.95)]"
                : "border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.10)]") +
              " rounded-3xl border p-3 sm:p-4"
            }
          >
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <div>
                <p
                  className={
                    isDark
                      ? "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-500"
                      : "text-[11px] font-medium tracking-[0.18em] uppercase text-slate-400"
                  }
                >
                  Campaign overview
                </p>
                <h2
                  className={
                    isDark
                      ? "mt-1 text-base sm:text-lg font-semibold text-slate-50"
                      : "mt-1 text-base sm:text-lg font-semibold text-slate-900"
                  }
                >
                  Facebook & Instagram performance
                </h2>
              </div>
              <button
                type="button"
                className={
                  (isDark
                    ? "bg-emerald-500/90 text-white hover:bg-emerald-400"
                    : "bg-emerald-500 text-white hover:bg-emerald-400") +
                  " rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-medium"
                }
              >
                + New campaign (UI)
              </button>
            </div>

            <div
              className={
                (isDark
                  ? "bg-slate-900/70 border-slate-800/80"
                  : "bg-slate-50 border-slate-200") +
                " rounded-2xl border overflow-hidden text-xs sm:text-sm"
              }
            >
              <div
                className={
                  (isDark
                    ? "bg-slate-900/80 text-slate-300"
                    : "bg-slate-100 text-slate-700") +
                  " grid grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-3 sm:px-4 py-2.5 font-semibold"
                }
              >
                <span>Campaign</span>
                <span>Platform</span>
                <span>Status</span>
                <span>Leads / Appts</span>
              </div>
              <div className="divide-y divide-slate-800/60 dark:divide-slate-800/60">
                {CAMPAIGNS.map((c) => (
                  <div
                    key={c.id}
                    className={
                      (isDark
                        ? "hover:bg-slate-900/70"
                        : "hover:bg-white") +
                      " grid grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-3 sm:px-4 py-2.5 items-center transition-colors"
                    }
                  >
                    <div className="flex flex-col">
                      <span
                        className={
                          isDark
                            ? "font-medium text-slate-100 truncate"
                            : "font-medium text-slate-900 truncate"
                        }
                      >
                        {c.name}
                      </span>
                      <span
                        className={
                          isDark
                            ? "text-[11px] text-slate-400"
                            : "text-[11px] text-slate-500"
                        }
                      >
                        Budget: {c.budget}
                      </span>
                    </div>
                    <span
                      className={isDark ? "text-slate-300" : "text-slate-700"}
                    >
                      {c.platform}
                    </span>
                    <StatusBadge theme={theme} status={c.status} />
                    <span
                      className={isDark ? "text-slate-300" : "text-slate-700"}
                    >
                      {c.leads} leads · {c.appointments} appts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className={
                isDark
                  ? "mt-3 text-[11px] text-slate-500"
                  : "mt-3 text-[11px] text-slate-500"
              }
            >
              Note: This is a visual preview. Real campaign data and booking
              automation will be wired in once the backend & API integrations
              are implemented.
            </p>
          </div>

          {/* Automation + bookings */}
          <div className="space-y-4">
            {/* Automation rules */}
            <div
              className={
                (isDark
                  ? "border-slate-800/70 bg-slate-950/70"
                  : "border-slate-200 bg-white") +
                " rounded-3xl border p-3 sm:p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]"
              }
            >
              <h2
                className={
                  isDark
                    ? "text-sm sm:text-base font-semibold text-slate-50"
                    : "text-sm sm:text-base font-semibold text-slate-900"
                }
              >
                Automation rules (concept)
              </h2>
              <p
                className={
                  isDark
                    ? "mt-1 text-[11px] sm:text-xs text-slate-500"
                    : "mt-1 text-[11px] sm:text-xs text-slate-600"
                }
              >
                High-level description of how the AI Lead Manager will handle
                ads, leads and calendar bookings.
              </p>

              <ul className="mt-3 space-y-2 text-[11px] sm:text-xs">
                {AUTOMATION_RULES.map((rule, idx) => (
                  <li
                    key={idx}
                    className={
                      (isDark
                        ? "bg-slate-900/70 border-slate-800/80"
                        : "bg-slate-50 border-slate-200") +
                      " flex gap-2 rounded-2xl border px-3 py-2"
                    }
                  >
                    <span className="mt-[2px] text-emerald-400 text-xs">
                      ●
                    </span>
                    <span
                      className={isDark ? "text-slate-200" : "text-slate-800"}
                    >
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming auto bookings */}
            <div
              className={
                (isDark
                  ? "border-slate-800/70 bg-slate-950/70"
                  : "border-slate-200 bg-gradient-to-b from-white to-slate-50") +
                " rounded-3xl border p-3 sm:p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]"
              }
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2
                  className={
                    isDark
                      ? "text-sm sm:text-base font-semibold text-slate-50"
                      : "text-sm sm:text-base font-semibold text-slate-900"
                  }
                >
                  Upcoming auto-booked appointments
                </h2>
                <span
                  className={
                    (isDark
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/70"
                      : "bg-emerald-50 text-emerald-700 border-emerald-300") +
                    " inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
                  }
                >
                  {UPCOMING_BOOKINGS.length} scheduled
                </span>
              </div>

              <ul className="mt-2 space-y-2 text-[11px] sm:text-xs">
                {UPCOMING_BOOKINGS.map((b) => (
                  <li
                    key={b.id}
                    className={
                      (isDark
                        ? "bg-slate-900/70 border-slate-800/80"
                        : "bg-white border-slate-200") +
                      " rounded-2xl border px-3 py-2.5 flex flex-col gap-1"
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p
                          className={
                            isDark
                              ? "font-semibold text-slate-50"
                              : "font-semibold text-slate-900"
                          }
                        >
                          {b.customer}
                        </p>
                        <p
                          className={
                            isDark
                              ? "text-[11px] text-slate-400"
                              : "text-[11px] text-slate-500"
                          }
                        >
                          {b.service}
                        </p>
                      </div>
                      <p
                        className={
                          isDark
                            ? "text-[11px] text-slate-300"
                            : "text-[11px] text-slate-600"
                        }
                      >
                        {b.date}
                      </p>
                    </div>
                    <p
                      className={
                        isDark
                          ? "text-[11px] text-slate-500"
                          : "text-[11px] text-slate-600"
                      }
                    >
                      Source:{" "}
                      <span className="font-medium">{b.source}</span>
                    </p>
                  </li>
                ))}
              </ul>

              <p
                className={
                  isDark
                    ? "mt-3 text-[11px] text-slate-500"
                    : "mt-3 text-[11px] text-slate-500"
                }
              >
                In the final version, these entries will be created
                automatically whenever a customer books through an ad campaign.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* Small components */

function StatCard({ theme, label, value, sub }) {
  const isDark = theme === "dark";

  if (isDark) {
    return (
      <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900 to-slate-950/90 px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">
          {label}
        </span>
        <div className="mt-2">
          <p className="text-xl sm:text-2xl font-semibold text-slate-50">
            {value}
          </p>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">{sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 backdrop-blur-[2px] px-3 sm:px-4 py-3 flex flex-col justify-between shadow-[0_18px_35px_rgba(15,23,42,0.08)]">
      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <div className="mt-2">
        <p className="text-xl sm:text-2xl font-semibold text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-[11px] sm:text-xs text-slate-600">{sub}</p>
      </div>
    </div>
  );
}

function StatusBadge({ theme, status }) {
  const isDark = theme === "dark";

  let label = status;
  let cls;

  switch (status) {
    case "running":
      label = "Running";
      cls = isDark
        ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/70"
        : "bg-emerald-50 text-emerald-700 border-emerald-300";
      break;
    case "paused":
      label = "Paused";
      cls = isDark
        ? "bg-slate-700/40 text-slate-200 border-slate-500/80"
        : "bg-slate-100 text-slate-700 border-slate-300";
      break;
    case "learning":
      label = "Learning phase";
      cls = isDark
        ? "bg-amber-500/15 text-amber-200 border-amber-400/70"
        : "bg-amber-50 text-amber-700 border-amber-300";
      break;
    default:
      cls = isDark
        ? "bg-slate-700/40 text-slate-200 border-slate-500/80"
        : "bg-slate-100 text-slate-700 border-slate-300";
  }

  return (
    <span
      className={
        cls +
        " inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-medium"
      }
    >
      {label}
    </span>
  );
}

export default ReadingManager;
