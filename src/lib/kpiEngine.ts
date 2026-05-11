import {
  mean,
  standardDeviation,
  linearRegression,
  quantile,
  interquartileRange,
} from "simple-statistics";
import type { ChartPoint } from "./excelParser";

export interface KPIResult {
  id: string;
  label: string;
  value: number;
  formatted: string;
  sub: string;
  accent?: string;
}

export interface EngineResult {
  kpis: KPIResult[];
  anomalyIndices: number[];
  movingAvg: number[];
  trendSlope: number;
  trendPositive: boolean;
}

type KPIId =
  | "total"
  | "ticket_medio"
  | "avg_period"
  | "best_period"
  | "growth_pct"
  | "positive_periods"
  | "volatility";

type NicheSlot = [KPIId, string];

const NICHE_SLOTS: Record<string, NicheSlot[]> = {
  restaurante: [
    ["total",          "Ingresos totales"],
    ["ticket_medio",   "Ticket medio / op."],
    ["best_period",    "Mejor período"],
    ["growth_pct",     "Crecimiento"],
  ],
  tienda: [
    ["total",          "Ventas totales"],
    ["avg_period",     "Media / período"],
    ["best_period",    "Mejor período"],
    ["growth_pct",     "Crecimiento"],
  ],
  servicios: [
    ["total",          "Facturación"],
    ["ticket_medio",   "Factura promedio"],
    ["positive_periods","Períodos sobre media"],
    ["growth_pct",     "Crecimiento"],
  ],
  otro: [
    ["total",          "Total"],
    ["avg_period",     "Promedio / período"],
    ["best_period",    "Mejor período"],
    ["growth_pct",     "Crecimiento"],
  ],
};

const fmtEur = (n: number) =>
  `€${n.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
const fmtPct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export const calculateKPIs = (
  chartData: ChartPoint[],
  niche: string
): EngineResult => {
  const empty: EngineResult = {
    kpis: [],
    anomalyIndices: [],
    movingAvg: [],
    trendSlope: 0,
    trendPositive: true,
  };
  if (chartData.length === 0) return empty;

  const values = chartData.map((d) => d.value);
  const counts = chartData.map((d) => d.count);
  const totalValue = values.reduce((a, b) => a + b, 0);
  const totalCount = counts.reduce((a, b) => a + b, 0);
  const avgPeriod = mean(values);
  const maxVal = Math.max(...values);
  const maxIdx = values.indexOf(maxVal);
  const firstVal = values[0] ?? 0;
  const lastVal = values[values.length - 1] ?? 0;
  const growthPct = firstVal !== 0 ? ((lastVal - firstVal) / Math.abs(firstVal)) * 100 : 0;
  const ticketMedio = totalCount > 0 ? totalValue / totalCount : 0;
  const positivePeriods = values.filter((v) => v > avgPeriod).length;

  // Linear regression slope (trend)
  const trendSlope =
    values.length >= 2
      ? linearRegression(values.map((v, i) => [i, v] as [number, number])).m
      : 0;

  // 3-period moving average
  const movingAvg = values.map((_, i) => {
    const win = values.slice(Math.max(0, i - 2), i + 1);
    return win.reduce((a, b) => a + b, 0) / win.length;
  });

  // Anomaly detection via IQR (needs ≥ 5 points)
  let anomalyIndices: number[] = [];
  if (values.length >= 5) {
    const q1 = quantile(values, 0.25);
    const q3 = quantile(values, 0.75);
    const iqr = interquartileRange(values);
    const upper = q3 + 1.5 * iqr;
    const lower = q1 - 1.5 * iqr;
    anomalyIndices = values
      .map((v, i) => (v > upper || v < lower ? i : -1))
      .filter((i) => i >= 0);
  }

  // KPI compute map
  const compute = (id: KPIId): Omit<KPIResult, "id" | "label"> => {
    switch (id) {
      case "total":
        return {
          value: totalValue,
          formatted: fmtEur(totalValue),
          sub: `${chartData.length} períodos · ${totalCount} ops`,
        };
      case "ticket_medio":
        return {
          value: ticketMedio,
          formatted: fmtEur(ticketMedio),
          sub: "por operación",
        };
      case "avg_period":
        return {
          value: avgPeriod,
          formatted: fmtEur(avgPeriod),
          sub: `media de ${chartData.length} períodos`,
        };
      case "best_period":
        return {
          value: maxVal,
          formatted: fmtEur(maxVal),
          sub: chartData[maxIdx]?.label ?? "—",
          accent: "#A05730",
        };
      case "growth_pct":
        return {
          value: growthPct,
          formatted: fmtPct(growthPct),
          sub: "primer vs. último período",
          accent: growthPct >= 0 ? "#22C55E" : "#EF4444",
        };
      case "positive_periods":
        return {
          value: positivePeriods,
          formatted: `${positivePeriods}/${chartData.length}`,
          sub: "períodos sobre la media",
          accent: "#2D6A4F",
        };
      case "volatility": {
        const std = values.length >= 2 ? standardDeviation(values) : 0;
        return { value: std, formatted: `±${fmtEur(std)}`, sub: "desviación típica" };
      }
    }
  };

  const slots = NICHE_SLOTS[niche] ?? NICHE_SLOTS.otro;
  const kpis: KPIResult[] = slots.map(([id, label]) => ({ id, label, ...compute(id) }));

  return { kpis, anomalyIndices, movingAvg, trendSlope, trendPositive: trendSlope >= 0 };
};
