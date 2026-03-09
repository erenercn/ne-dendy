import { useState, useMemo } from "react";
import { parseCSV } from "../utils/csvParser";
import { ACTION_PRIORITY } from "../constants/config";

const PAGE_SIZE = 25;

export function useSurveyData() {
  const [rawData, setRawData] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [sortBy, setSortBy] = useState("severity");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setRawData(parseCSV(e.target.result));
      setSelectedSurvey("all");
      setCurrentPage(1);
    };
    reader.readAsText(file);
  };

  // reset page when filters change
  const handleSetSelectedSurvey = (v) => { setSelectedSurvey(v); setCurrentPage(1); };
  const handleSetFilterAction = (v) => { setFilterAction(v); setCurrentPage(1); };
  const handleSetFilterSentiment = (v) => { setFilterSentiment(v); setCurrentPage(1); };
  const handleSetSortBy = (v) => { setSortBy(v); setCurrentPage(1); };
  const handleSetSearchTerm = (v) => { setSearchTerm(v); setCurrentPage(1); };

  const surveyIds = useMemo(
    () => [...new Set(rawData.map((r) => r.surveyId))].sort(),
    [rawData]
  );

  const scopedData = useMemo(
    () => selectedSurvey === "all" ? rawData : rawData.filter((r) => r.surveyId === selectedSurvey),
    [rawData, selectedSurvey]
  );

  const insights = useMemo(() => {
    let data = scopedData.filter((r) => r.shouldDisplay);

    if (filterAction !== "all") data = data.filter((r) => r.action === filterAction);
    if (filterSentiment !== "all") data = data.filter((r) => r.sentiment === filterSentiment);

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) => r.displayLabel.toLowerCase().includes(q) || r.displayNote.toLowerCase().includes(q)
      );
    }

    return [...data].sort((a, b) => {
      if (sortBy === "severity") return b.severity - a.severity;
      if (sortBy === "score_asc") return a.score - b.score;
      if (sortBy === "score_desc") return b.score - a.score;
      if (sortBy === "action") return (ACTION_PRIORITY[a.action] ?? 9) - (ACTION_PRIORITY[b.action] ?? 9);
      return 0;
    });
  }, [scopedData, filterAction, filterSentiment, sortBy, searchTerm]);

  const totalPages = Math.ceil(insights.length / PAGE_SIZE);

  const pageInsights = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return insights.slice(start, start + PAGE_SIZE);
  }, [insights, currentPage]);

  const stats = useMemo(() => {
    const total = scopedData.length;
    const avgScore = total ? scopedData.reduce((sum, r) => sum + r.score, 0) / total : 0;
    const critical = scopedData.filter((r) => r.action === "escalate" || r.action === "follow_up").length;
    const negativeCount = scopedData.filter((r) => r.sentiment === "negative").length;
    return { total, avgScore, critical, negativeCount };
  }, [scopedData]);

  return {
    isLoaded: rawData.length > 0,
    rawData,
    scopedData,
    insights,
    pageInsights,
    surveyIds,
    stats,
    pagination: { currentPage, totalPages, pageSize: PAGE_SIZE },
    filters: { selectedSurvey, filterAction, filterSentiment, sortBy, searchTerm },
    setSelectedSurvey: handleSetSelectedSurvey,
    setFilterAction: handleSetFilterAction,
    setFilterSentiment: handleSetFilterSentiment,
    setSortBy: handleSetSortBy,
    setSearchTerm: handleSetSearchTerm,
    setCurrentPage,
    loadFile,
  };
}