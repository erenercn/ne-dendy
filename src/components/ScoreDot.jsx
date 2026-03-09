export function ScoreDot({ score }) {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? "text-emerald-400 border-emerald-400"
    : score >= 0.4 ? "text-yellow-400 border-yellow-400"
    : "text-red-400 border-red-400";

  return (
    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${color}`}>
      <span className="text-[11px] font-bold font-mono">{pct}</span>
    </div>
  );
}
