// DeviceCard.jsx – one cabin/device tile

function getStatusStyles(status) {
  switch (status) {
    case "RUNNING":
      return {
        pill: "bg-emerald-500/10 text-emerald-400",
        border: "border-emerald-500/60",
        glow: "shadow-emerald-500/30",
      };
    case "CLEANING":
      return {
        pill: "bg-orange-500/10 text-orange-400",
        border: "border-orange-500/60",
        glow: "shadow-orange-500/30",
      };
    case "ERROR":
      return {
        pill: "bg-red-500/10 text-red-400",
        border: "border-red-500/60",
        glow: "shadow-red-500/30",
      };
    default:
      return {
        pill: "bg-slate-600/20 text-slate-200",
        border: "border-slate-700",
        glow: "shadow-slate-900/60",
      };
  }
}

export default function DeviceCard({ device }) {
  const styles = getStatusStyles(device.status);

  return (
    <div
      className={`group relative rounded-2xl border ${styles.border} bg-slate-900/90 shadow-lg ${styles.glow} p-4 transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-slate-500">{device.cabinNumber}</div>
          <div className="text-sm font-semibold text-slate-100">
            {device.name}
          </div>
          <div className="text-[11px] text-slate-500 uppercase">
            {device.type}
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-[10px] font-medium ${styles.pill}`}
        >
          {device.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
        <span>⏱ {device.remainingMinutes} min</span>
        <span>👤 {device.customer || "—"}</span>
      </div>
    </div>
  );
}
