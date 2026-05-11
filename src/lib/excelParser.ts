import * as XLSX from "xlsx";
import { parse, format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { detectSchema, type SchemaResult } from "./schemaDetector";

export interface ParsedData {
  headers: string[];
  rows: Record<string, unknown>[];
  detected: {
    dateCol: string | null;
    valueCol: string | null;
    rowCount: number;
    fileName: string;
  };
  schema: SchemaResult;
}

export type AggPeriod = "month" | "week" | "day" | "raw";

export interface ChartPoint {
  label: string;
  value: number;
  count: number;
}

const DATE_FORMATS = [
  "dd 'de' MMMM 'de' yyyy",
  "dd/MM/yyyy",
  "d/M/yyyy",
  "dd-MM-yyyy",
  "yyyy-MM-dd",
  "dd/MM/yy",
  "d/M/yy",
  "MMMM yyyy",
  "MM/yyyy",
];

export const parseDate = (value: unknown): Date | null => {
  if (value instanceof Date) return isValid(value) ? value : null;

  if (typeof value === "number" && value > 1 && value < 2958466) {
    const date = new Date(Math.round((value - 25569) * 86400000));
    if (isValid(date) && date.getFullYear() >= 1970) return date;
  }

  const str = String(value ?? "").trim();
  if (!str || str === "0") return null;

  const ref = new Date(2000, 0, 1);
  for (const fmt of DATE_FORMATS) {
    try {
      const d = parse(str, fmt, ref, { locale: es });
      if (isValid(d) && d.getFullYear() > 1900) return d;
    } catch {
      // try next
    }
  }

  const native = new Date(str);
  return isValid(native) && native.getFullYear() > 1900 ? native : null;
};

export const aggregateByPeriod = (
  rows: Record<string, unknown>[],
  valueCol: string,
  dateCol: string | null,
  period: AggPeriod
): ChartPoint[] => {
  if (!dateCol || period === "raw") {
    return rows.slice(0, 24).map((r, i) => ({
      label: `Fila ${i + 1}`,
      value: Number(r[valueCol] ?? 0),
      count: 1,
    }));
  }

  const getKeys = (date: Date): { sort: string; display: string } => {
    switch (period) {
      case "month":
        return {
          sort: format(date, "yyyy-MM"),
          display: format(date, "MMM yy", { locale: es }),
        };
      case "week":
        return {
          sort: format(date, "RRRR-II", { locale: es }),
          display: `Sem ${format(date, "II")} '${format(date, "yy")}`,
        };
      case "day":
      default:
        return {
          sort: format(date, "yyyy-MM-dd"),
          display: format(date, "dd/MM"),
        };
    }
  };

  const groups = new Map<string, { display: string; value: number; count: number }>();
  let skipped = 0;

  for (const row of rows) {
    const date = parseDate(row[dateCol]);
    if (!date) { skipped++; continue; }

    const raw = Number(row[valueCol] ?? 0);
    if (isNaN(raw)) continue;

    const { sort, display } = getKeys(date);
    const existing = groups.get(sort);
    if (existing) {
      existing.value += raw;
      existing.count += 1;
    } else {
      groups.set(sort, { display, value: raw, count: 1 });
    }
  }

  if (groups.size === 0 && skipped > 0) {
    return rows.slice(0, 24).map((r, i) => ({
      label: `Fila ${i + 1}`,
      value: Number(r[valueCol] ?? 0),
      count: 1,
    }));
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, d]) => ({ label: d.display, value: d.value, count: d.count }));
};

export const parseExcelFile = async (file: File): Promise<ParsedData> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  if (rows.length === 0) throw new Error("El archivo está vacío o no tiene datos válidos");

  const headers = Object.keys(rows[0]);
  const schema = detectSchema(rows, headers);

  return {
    headers,
    rows,
    detected: {
      dateCol: schema.dateCol,
      valueCol: schema.metricCols[0] ?? null,
      rowCount: rows.length,
      fileName: file.name,
    },
    schema,
  };
};
