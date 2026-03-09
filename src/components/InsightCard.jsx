import { memo } from "react";
import { ActionBadge } from "./ActionBadge";
import { ScoreDot } from "./ScoreDot";

const borderMap = {
  escalate: "border-l-red-400",
  follow_up: "border-l-orange-400",
  watch: "border-l-yellow-400",
  ignore: "border-l-neutral-700",
};

const sentimentMap = {
  positive: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  negative: "text-red-400 bg-red-400/10 border-red-400/20",
  neutral: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

export const InsightCard = memo(function InsightCard({ item, t }) {
  const border = borderMap[item.action] ?? "border-l-neutral-700";
  const sentimentStyle = sentimentMap[item.sentiment] ?? "";
  const sentimentLabel = item.sentiment === "positive" ? t.positive
    : item.sentiment === "negative" ? t.negativeLabel
    : t.neutral;

  return (
    <article className={`bg-neutral-900 border border-neutral-800 border-l-[3px] ${border} rounded-xl p-4`}>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <p className="text-slate-100 text-[13px] font-semibold leading-snug mb-1">
            {item.displayLabel || "—"}
          </p>
          {item.displayNote && (
            <p className="text-neutral-500 text-[11px] leading-relaxed">{item.displayNote}</p>
          )}
          <div className="flex gap-1.5 mt-3 flex-wrap items-center">
            <ActionBadge action={item.action} label={t[item.action] ?? item.action} />
            {item.sentiment && (
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${sentimentStyle}`}>
                {sentimentLabel}
              </span>
            )}
            {item.themes.map((theme) => (
              <span key={theme} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-violet-400 border border-indigo-900/50 font-medium">
                {t.themes[theme] ?? theme}
              </span>
            ))}
          </div>
        </div>
        <ScoreDot score={item.score} />
      </div>
    </article>
  );
});
