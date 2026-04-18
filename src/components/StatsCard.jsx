// StatsCard.jsx – small KPI card

export default function StatsCard({ label, value, helper, accent }) {
   return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-sm px-4 py-3 flex flex-col justify-between shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
          {label}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${chipColor}`}
        >
          {value}
        </span>
      </div>
      <span className="mt-3 text-2xl font-semibold leading-tight text-slate-900">
        {value}
      </span>
    </div>
  );
}