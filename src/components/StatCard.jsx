const accentMap = {
  "#34d399": "text-emerald-400",
  "#fbbf24": "text-yellow-400",
  "#f87171": "text-red-400",
  "#fb923c": "text-orange-400",
};

export function StatCard({ label, value, accent }) {
  const textColor = accentMap[accent] ?? "text-slate-100";

  return (
    <div className="flex-1 min-w-[100px] bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <span className="block text-[10px] tracking-widest uppercase font-semibold text-neutral-600 mb-1.5">
        {label}
      </span>
      <div className={`text-3xl font-extrabold font-mono leading-none ${textColor}`}>
        {value}
      </div>
    </div>
  );
}
