import Papa from "papaparse";

export function parseCSV(text) {
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });

  return data.map((row) => ({
    labelId: row.label_id ?? "",
    surveyId: row.survey_id ?? "",
    score: parseFloat(row.score) || 0,
    sentiment: row.sentiment ?? "",
    riskFlag: row.risk_flag === "t",
    action: row.action || "ignore",
    displayLabel: row.display_label ?? "",
    displayNote: row.display_note ?? "",
    severity: parseFloat(row.severity) || 0,
    confidence: parseFloat(row.confidence) || 0,
    themes: parseThemes(row.themes),
    shouldDisplay: row.should_display === "t",
    evaluatedAt: row.evaluated_at ?? "",
  }));
}

function parseThemes(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}