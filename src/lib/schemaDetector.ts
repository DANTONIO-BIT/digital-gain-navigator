import type { AggPeriod } from "./excelParser";

export type ColType = "date" | "metric" | "category" | "id" | "text";

export interface ColumnSchema {
  name: string;
  type: ColType;
  confidence: number;
  uniqueCount: number;
  sampleValues: unknown[];
  numericRange?: { min: number; max: number };
}

export interface DateRange {
  min: Date;
  max: Date;
  days: number;
}

export interface SchemaResult {
  columns: ColumnSchema[];
  dateCol: string | null;
  metricCols: string[];
  categoryCols: string[];
  suggestedPeriod: AggPeriod;
  dateRange: DateRange | null;
  totalRows: number;
}

const DATE_HINTS = ["fecha", "date", "día", "dia", "mes", "semana", "week", "periodo", "período", "tiempo"];
const METRIC_HINTS = ["venta", "ingreso", "importe", "total", "revenue", "amount", "precio", "factura", "cobro", "dinero", "ganancia", "coste", "cost", "beneficio", "profit", "€", "eur"];
const ID_HINTS = ["id", "ref", "code", "código", "num", "número", "clave", "key", "folio"];

// Full date: requires day component — DD/MM/YYYY, YYYY-MM-DD, or month name
// Deliberately does NOT include plain numbers (those are metrics until proven otherwise)
const looksLikeDate = (v: unknown): boolean => {
  if (v instanceof Date) return true;
  const s = String(v ?? "").trim();
  return (
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(s) ||
    /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(s) ||
    /^(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic|jan|mar|apr|aug|dec)/i.test(s)
  );
};

// Period format: YYYY-MM or YYYY/MM — not a full date but a valid time grouping key
const looksLikePeriod = (v: unknown): boolean => {
  const s = String(v ?? "").trim();
  return /^\d{4}[\/\-]\d{2}$/.test(s);
};

const sampleCol = (rows: Record<string, unknown>[], col: string, n = 30): unknown[] =>
  rows
    .slice(0, Math.min(n, rows.length))
    .map((r) => r[col])
    .filter((v) => v !== "" && v !== null && v !== undefined);

// Used only for computing the date range after the date column is identified
const tryParseAsDate = (v: unknown): Date | null => {
  const s = String(v ?? "").trim();

  // YYYY-MM period format → first day of that month
  if (/^\d{4}[\/\-]\d{2}$/.test(s)) {
    const [year, month] = s.split(/[\/\-]/).map(Number);
    const d = new Date(year, month - 1, 1);
    return !isNaN(d.getTime()) ? d : null;
  }

  // DD/MM/YYYY or DD-MM-YYYY (Spanish format)
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const d = new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);
    return !isNaN(d.getTime()) ? d : null;
  }

  // ISO: YYYY-MM-DD
  const iso = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
  if (iso) {
    const d = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    return !isNaN(d.getTime()) ? d : null;
  }

  // Excel serial integer (e.g. 45292 = 2024-01-01)
  if (typeof v === "number" && Number.isInteger(v) && v > 25569 && v < 66000) {
    const d = new Date(Math.round((v - 25569) * 86400000));
    return d.getFullYear() >= 1970 ? d : null;
  }

  // Native fallback
  const native = new Date(s);
  return !isNaN(native.getTime()) && native.getFullYear() > 1900 ? native : null;
};

export const detectSchema = (
  rows: Record<string, unknown>[],
  headers: string[]
): SchemaResult => {
  const totalRows = rows.length;
  const sampleSize = Math.min(100, totalRows);

  const columns: ColumnSchema[] = headers.map((name) => {
    const vals = sampleCol(rows, name);
    const lower = name.toLowerCase();
    const allVals = rows.slice(0, sampleSize).map((r) => r[name]);
    const uniqueCount = new Set(allVals.map(String)).size;

    // Pre-compute numerics and ID indicators once
    const numericVals = vals.filter(
      (v) => typeof v === "number" && isFinite(v as number)
    ) as number[];
    const numericPct = vals.length ? numericVals.length / vals.length : 0;
    const isLikelyId =
      uniqueCount >= totalRows * 0.8 || ID_HINTS.some((h) => lower.includes(h));

    // ── 1. METRIC ─────────────────────────────────────────────────────────────
    // Pure numeric values that are not IDs — checked FIRST to avoid float
    // values being misclassified as Excel serial dates.
    if (numericPct >= 0.9 && !isLikelyId) {
      const hasMetricHint = METRIC_HINTS.some((h) => lower.includes(h));
      const confidence = numericPct * (hasMetricHint ? 1.0 : 0.82);
      return {
        name,
        type: "metric",
        confidence,
        uniqueCount,
        sampleValues: vals.slice(0, 4),
        numericRange: {
          min: Math.min(...numericVals),
          max: Math.max(...numericVals),
        },
      };
    }

    // ── 2. DATE ────────────────────────────────────────────────────────────────
    // Strings that look like full dates OR period strings (YYYY-MM).
    // Numbers are excluded here (handled above as metric or below as ID).
    const hasDateHint = DATE_HINTS.some((h) => lower.includes(h));
    const datePct = vals.length
      ? vals.filter(looksLikeDate).length / vals.length
      : 0;
    const periodPct = vals.length
      ? vals.filter(looksLikePeriod).length / vals.length
      : 0;

    const isDateCol =
      (hasDateHint && (datePct >= 0.5 || periodPct >= 0.7)) ||
      datePct >= 0.85 ||
      periodPct >= 0.85;

    if (isDateCol) {
      const confidence = hasDateHint
        ? Math.min(0.5 + Math.max(datePct, periodPct) * 0.5, 1)
        : Math.max(datePct, periodPct) * 0.9;
      return { name, type: "date", confidence, uniqueCount, sampleValues: vals.slice(0, 4) };
    }

    // ── 3. ID ─────────────────────────────────────────────────────────────────
    if (isLikelyId) {
      return { name, type: "id", confidence: 0.85, uniqueCount, sampleValues: vals.slice(0, 4) };
    }

    // ── 4. CATEGORY ───────────────────────────────────────────────────────────
    const isCategory =
      uniqueCount <= Math.min(50, totalRows * 0.35) && uniqueCount >= 2;
    if (isCategory && numericPct < 0.5) {
      return { name, type: "category", confidence: 0.80, uniqueCount, sampleValues: vals.slice(0, 4) };
    }

    // ── 5. TEXT ───────────────────────────────────────────────────────────────
    return { name, type: "text", confidence: 0.65, uniqueCount, sampleValues: vals.slice(0, 4) };
  });

  const dateCols = columns
    .filter((c) => c.type === "date")
    .sort((a, b) => b.confidence - a.confidence);
  const metricCols = columns
    .filter((c) => c.type === "metric")
    .sort((a, b) => b.confidence - a.confidence);
  const categoryCols = columns.filter((c) => c.type === "category");

  const dateCol = dateCols[0]?.name ?? null;

  // Detect date range and suggest optimal period
  let dateRange: DateRange | null = null;
  let suggestedPeriod: AggPeriod = "month";

  if (dateCol) {
    const parsed = rows
      .map((r) => tryParseAsDate(r[dateCol]))
      .filter(Boolean) as Date[];

    if (parsed.length >= 2) {
      const times = parsed.map((d) => d.getTime());
      const min = new Date(Math.min(...times));
      const max = new Date(Math.max(...times));
      const days = Math.round((max.getTime() - min.getTime()) / 86400000);
      dateRange = { min, max, days };

      if (totalRows < 8 || days < 7) suggestedPeriod = "raw";
      else if (days < 35) suggestedPeriod = "day";
      else suggestedPeriod = "month";
    }
  }

  return {
    columns,
    dateCol,
    metricCols: metricCols.map((c) => c.name),
    categoryCols: categoryCols.map((c) => c.name),
    suggestedPeriod,
    dateRange,
    totalRows,
  };
};
