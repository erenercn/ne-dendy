import { useState } from "react";
import { useSurveyData } from "./hooks/useSurveyData";
import { TRANSLATIONS } from "./locales/i18n";
import { ACTION_COLORS } from "./constants/config";
import { StatCard } from "./components/StatCard";
import { InsightCard } from "./components/InsightCard";
import { SentimentChart, ThemeChart, ActionChart } from "./components/Charts";
import { UploadScreen } from "./components/UploadScreen";

const selectCls = "bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-2 rounded-lg text-xs font-mono cursor-pointer outline-none";
const btnCls = "bg-transparent border border-neutral-800 text-neutral-500 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer hover:border-neutral-600 hover:text-neutral-300 transition-colors";

function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-6 pb-8">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={`${btnCls} disabled:opacity-30`}>←</button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`e-${i}`} className="text-neutral-700 text-xs px-1">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnCls} min-w-[32px] ${currentPage === page ? "border-neutral-500 bg-neutral-800 text-slate-100" : ""}`}
          >
            {page}
          </button>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`${btnCls} disabled:opacity-30`}>→</button>
    </nav>
  );
}

export default function NeDendy() {
  const [lang, setLang] = useState("tr");
  const t = TRANSLATIONS[lang];

  const {
    isLoaded, rawData, scopedData,
    insights, pageInsights,
    surveyIds, stats, pagination, filters,
    setSelectedSurvey, setFilterAction,
    setFilterSentiment, setSortBy,
    setSearchTerm, setCurrentPage, loadFile,
  } = useSurveyData();

  if (!isLoaded) {
    return (
      <UploadScreen
        t={t}
        lang={lang}
        onToggleLang={() => setLang((l) => l === "tr" ? "en" : "tr")}
        onFileChange={loadFile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-sans">

      <header className="border-b border-neutral-900 px-7 py-3 flex items-center justify-between sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div>
          <span className="text-[10px] text-neutral-600 tracking-widest uppercase font-semibold">{t.brand}</span>
          <h1 className="text-base font-bold leading-tight">
            {t.title} <span className="text-neutral-600 font-normal text-sm">— {t.subtitle}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-900 font-mono">
            {rawData.length.toLocaleString()} {t.records}
          </span>
          <button onClick={() => setLang((l) => l === "tr" ? "en" : "tr")} className={btnCls}>
            {lang === "tr" ? "EN" : "TR"}
          </button>
          <label htmlFor="csv-reload" className={`${btnCls} cursor-pointer`}>{t.reload}</label>
          <input id="csv-reload" type="file" accept=".csv" onChange={(e) => loadFile(e.target.files[0])} className="hidden" />
        </div>
      </header>

      <main className="px-7 py-6 max-w-[1300px] mx-auto">

        {/* survey tabs */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {[
            { id: "all", label: `${t.allSurveys} (${surveyIds.length})` },
            ...surveyIds.slice(0, 10).map((id) => ({ id, label: `···${id.slice(-5)}` })),
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedSurvey(id)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold font-mono cursor-pointer border transition-colors
                ${filters.selectedSurvey === id
                  ? "border-neutral-600 bg-neutral-800 text-slate-100"
                  : "border-neutral-900 bg-transparent text-neutral-600 hover:text-neutral-400"}`}
            >
              {label}
            </button>
          ))}
          {surveyIds.length > 10 && (
            <select value={filters.selectedSurvey} onChange={(e) => setSelectedSurvey(e.target.value)} className={`${selectCls} text-[11px]`}>
              <option value="all">{t.allSurveys}</option>
              {surveyIds.map((id) => <option key={id} value={id}>···{id.slice(-5)}</option>)}
            </select>
          )}
        </div>

        {/* stats */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <StatCard label={t.totalResponses} value={stats.total.toLocaleString()} />
          <StatCard
            label={t.avgScore}
            value={`${Math.round(stats.avgScore * 100)}%`}
            accent={stats.avgScore >= 0.7 ? "#34d399" : stats.avgScore >= 0.4 ? "#fbbf24" : "#f87171"}
          />
          <StatCard label={t.critical} value={stats.critical} accent="#fb923c" />
          <StatCard label={t.negative} value={stats.negativeCount} accent="#f87171" />
        </div>

        {/* charts */}
        <div className="grid grid-cols-[1fr_1.6fr_1.6fr] gap-4 mb-6">
          <SentimentChart data={scopedData} t={t} />
          <ThemeChart data={scopedData} t={t} />
          <ActionChart data={scopedData} t={t} />
        </div>

        {/* filters */}
        <div className="flex gap-2.5 mb-3.5 flex-wrap items-center">
          <input
            type="search"
            placeholder={t.search}
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${selectCls} flex-1 min-w-[160px]`}
          />
          <select value={filters.filterAction} onChange={(e) => setFilterAction(e.target.value)} className={selectCls}>
            <option value="all">{t.allActions}</option>
            {Object.keys(ACTION_COLORS).map((k) => <option key={k} value={k}>{t[k] ?? k}</option>)}
          </select>
          <select value={filters.filterSentiment} onChange={(e) => setFilterSentiment(e.target.value)} className={selectCls}>
            <option value="all">{t.allSentiments}</option>
            <option value="negative">{t.negativeLabel}</option>
            <option value="neutral">{t.neutral}</option>
            <option value="positive">{t.positive}</option>
          </select>
          <select value={filters.sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectCls}>
            <option value="severity">{t.sortSeverity}</option>
            <option value="action">{t.sortActionPriority}</option>
            <option value="score_asc">{t.sortScoreAsc}</option>
            <option value="score_desc">{t.sortScoreDesc}</option>
          </select>
        </div>

        <div className="flex justify-between items-center mb-3">
          <p className="text-[11px] text-neutral-700 font-mono">{insights.length} {t.showing}</p>
          {pagination.totalPages > 1 && (
            <p className="text-[11px] text-neutral-700 font-mono">{pagination.currentPage} / {pagination.totalPages}</p>
          )}
        </div>

        {/* insight list */}
        {pageInsights.length === 0 ? (
          <p className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center text-neutral-600">
            {t.noResults}
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {pageInsights.map((item) => (
              <li key={item.labelId}>
                <InsightCard item={item} t={t} />
              </li>
            ))}
          </ol>
        )}

        <Pagination pagination={pagination} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
}
