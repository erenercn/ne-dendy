import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { ACTION_COLORS, ACTION_PRIORITY } from "../constants/config";

const tooltipStyle = {
  contentStyle: { background: "#171717", border: "1px solid #262626", borderRadius: 6, fontSize: 12 },
  itemStyle: { color: "#9ca3af" },
};

const cardCls = "bg-neutral-900 border border-neutral-800 rounded-xl p-5";
const labelCls = "block text-[10px] tracking-widest uppercase font-semibold text-neutral-600 mb-3";

export function SentimentChart({ data, t }) {
  const chartData = useMemo(() => {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    data.forEach((r) => { if (r.sentiment in counts) counts[r.sentiment]++; });
    return [
      { name: t.positive, value: counts.positive, color: "#34d399" },
      { name: t.neutral, value: counts.neutral, color: "#94a3b8" },
      { name: t.negativeLabel, value: counts.negative, color: "#f87171" },
    ].filter((d) => d.value > 0);
  }, [data, t]);

  return (
    <section className={cardCls}>
      <span className={labelCls}>{t.sentimentDist}</span>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={3}>
            {chartData.map((e) => <Cell key={e.name} fill={e.color} />)}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex gap-3 justify-center flex-wrap mt-1">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
            <span className="text-[11px] text-neutral-500">{d.name}: <strong className="text-neutral-400">{d.value}</strong></span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ThemeChart({ data, t }) {
  const chartData = useMemo(() => {
    const counts = {};
    data.forEach((r) => r.themes.forEach((th) => { counts[th] = (counts[th] ?? 0) + 1; }));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]).slice(0, 7)
      .map(([th, count]) => ({ name: t.themes[th] ?? th, count }));
  }, [data, t]);

  return (
    <section className={cardCls}>
      <span className={labelCls}>{t.themeBreakdown}</span>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} width={72} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

export function ActionChart({ data, t }) {
  const chartData = useMemo(() => {
    const counts = {};
    data.forEach((r) => { counts[r.action] = (counts[r.action] ?? 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => (ACTION_PRIORITY[a[0]] ?? 9) - (ACTION_PRIORITY[b[0]] ?? 9))
      .map(([action, count]) => ({ name: t[action] ?? action, count, color: ACTION_COLORS[action] }));
  }, [data, t]);

  return (
    <section className={cardCls}>
      <span className={labelCls}>{t.actionBreakdown}</span>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ left: 8, right: 16, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={28}>
            {chartData.map((e) => <Cell key={e.name} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
