const styles = {
  escalate: "text-red-400 border-red-400/25 bg-red-400/10",
  follow_up: "text-orange-400 border-orange-400/25 bg-orange-400/10",
  watch: "text-yellow-400 border-yellow-400/25 bg-yellow-400/10",
  ignore: "text-neutral-600 border-neutral-700 bg-neutral-800/50",
};

export function ActionBadge({ action, label }) {
  return (
    <span className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded border uppercase font-mono ${styles[action] ?? styles.ignore}`}>
      {label}
    </span>
  );
}
