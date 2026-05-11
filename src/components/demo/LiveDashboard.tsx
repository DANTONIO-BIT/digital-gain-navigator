import { useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import { aggregateByPeriod, type AggPeriod, type ChartPoint } from "@/lib/excelParser";
import { calculateKPIs, type EngineResult } from "@/lib/kpiEngine";

interface ParsedRow {
  [key: string]: unknown;
}

export interface DashboardConfig {
  niche: string;
  valueCol: string;
  period: AggPeriod;
  fileName: string;
  rowCount: number;
  dateCol: string | null;
}

interface LiveDashboardProps {
  rows: ParsedRow[];
  config: DashboardConfig;
}

const NICHE_LABELS: Record<string, string> = {
  restaurante: "Hostelería",
  tienda: "Comercio",
  servicios: "Servicios",
  otro: "Negocio",
};

const PERIOD_LABEL: Record<AggPeriod, string> = {
  month: "mes", week: "semana", day: "día", raw: "fila",
};

const BD = "1px solid #E0DAD3";

interface TooltipPayload {
  value: number;
  payload: ChartPoint & { movingAvg: number };
}

const CustomTooltip = ({
  active,
  payload,
  label,
  anomalyIndices,
  dataIndex,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  anomalyIndices: number[];
  dataIndex: number;
}) => {
  if (!active || !payload?.length) return null;
  const isAnomaly = anomalyIndices.includes(dataIndex);
  return (
    <div className="bg-white text-xs font-mono py-2 px-3" style={{ border: BD }}>
      <div className="mb-1" style={{ color: "#A09590" }}>{label}</div>
      <div className="font-bold text-sm" style={{ color: isAnomaly ? "#D4450F" : "#A05730" }}>
        {Number(payload[0].value).toLocaleString("es-ES", { maximumFractionDigits: 0 })} €
        {isAnomaly && (
          <span className="ml-2 text-[9px]" style={{ color: "#D4450F" }}>⚠ anomalía</span>
        )}
      </div>
      {payload[0].payload.count > 1 && (
        <div style={{ color: "#C5C2BE" }}>{payload[0].payload.count} operaciones</div>
      )}
      {payload[0].payload.movingAvg !== undefined && (
        <div style={{ color: "#2D6A4F" }}>
          media móvil: {payload[0].payload.movingAvg.toLocaleString("es-ES", { maximumFractionDigits: 0 })} €
        </div>
      )}
    </div>
  );
};

const LiveDashboard = ({ rows, config }: LiveDashboardProps) => {
  const { valueCol, period, dateCol, niche, fileName, rowCount } = config;
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const chartData: ChartPoint[] = useMemo(
    () => aggregateByPeriod(rows as Record<string, unknown>[], valueCol, dateCol, period),
    [rows, valueCol, dateCol, period]
  );

  const engine: EngineResult = useMemo(
    () => calculateKPIs(chartData, niche),
    [chartData, niche]
  );

  const enrichedData = chartData.map((d, i) => ({
    ...d,
    movingAvg: engine.movingAvg[i] ?? d.value,
  }));

  const values = chartData.map((d) => d.value);
  const maxIdx = values.indexOf(Math.max(...values, 0));
  const totalTx = chartData.reduce((a, d) => a + d.count, 0);

  const getCellFill = (i: number) => {
    if (engine.anomalyIndices.includes(i)) return "#D4450F";
    if (i === maxIdx) return "#A05730";
    return "#E0DAD3";
  };

  return (
    <div style={{ border: BD }}>
      {/* Browser chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "#0F0F0F", borderBottom: "1px solid #222" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
            <div className="w-2 h-2 rounded-full bg-[#3A3A3A]" />
            <div className="w-2 h-2 rounded-full bg-[#A05730]" />
          </div>
          <span className="font-mono text-[10px] text-[#555]">
            app.digidotpartners.es/panel
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#22C55E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse inline-block" />
          EN VIVO
        </span>
      </div>

      <div style={{ background: "#F9F6F1" }}>
        {/* Info strip */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-[10px] font-mono"
          style={{ borderBottom: BD, background: "white" }}
        >
          <span style={{ color: "#A09590" }}>
            {fileName}
          </span>
          <span style={{ color: "#E0DAD3" }}>|</span>
          <span style={{ color: "#A09590" }}>
            {rowCount.toLocaleString("es-ES")} filas ·{" "}
            <span style={{ color: "#A05730" }}>{totalTx} operaciones</span> ·{" "}
            <span style={{ color: "#2D6A4F" }}>{chartData.length} {PERIOD_LABEL[period]}s</span>
          </span>
          <span style={{ color: "#E0DAD3" }}>|</span>
          <span style={{ color: "#6A6460" }}>
            {NICHE_LABELS[niche] ?? "Negocio"} · {valueCol}
          </span>
          {engine.anomalyIndices.length > 0 && (
            <>
              <span style={{ color: "#E0DAD3" }}>|</span>
              <span style={{ color: "#D4450F" }}>
                ⚠ {engine.anomalyIndices.length} anomalía{engine.anomalyIndices.length > 1 ? "s" : ""} detectada{engine.anomalyIndices.length > 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>

        {/* KPIs — driven by kpiEngine */}
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderBottom: BD }}>
          {engine.kpis.map((k, i) => (
            <div
              key={k.id}
              className="px-5 py-4 bg-white"
              style={{ borderRight: i < 3 ? BD : "none" }}
            >
              <div
                className="text-[9px] uppercase tracking-widest mb-1 leading-tight"
                style={{ color: "#A09590" }}
              >
                {k.label}
              </div>
              <div
                className="text-xl font-bold font-mono"
                style={{ color: k.accent ?? "#1A1A1A" }}
              >
                {k.formatted}
              </div>
              <div className="text-[9px] mt-0.5" style={{ color: "#C5C2BE" }}>
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="px-5 py-5 bg-white" style={{ borderBottom: BD }}>
          <div className="flex items-center justify-between mb-4">
            <div className="label-terra">
              {valueCol} — por {PERIOD_LABEL[period]}
            </div>
            {/* Chart type toggle */}
            <div className="flex gap-0 border" style={{ borderColor: "#E0DAD3" }}>
              {(["bar", "line"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest transition-all"
                  style={{
                    background: chartType === t ? "#1A1A1A" : "white",
                    color: chartType === t ? "#F0EDE8" : "#A09590",
                    borderRight: t === "bar" ? BD : "none",
                  }}
                >
                  {t === "bar" ? "Barras" : "Línea"}
                </button>
              ))}
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="py-8 text-center text-sm font-mono" style={{ color: "#A09590" }}>
              No se pudieron detectar fechas válidas en "{dateCol}".{" "}
              <span style={{ color: "#C5C2BE" }}>Prueba con "Sin agrupar".</span>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart
                  data={enrichedData}
                  margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 8,
                      fontFamily: "'JetBrains Mono', monospace",
                      fill: "#A09590",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip
                        {...props}
                        anomalyIndices={engine.anomalyIndices}
                        dataIndex={enrichedData.findIndex(
                          (d) => d.label === props.label
                        )}
                      />
                    )}
                    cursor={{ fill: "rgba(160,87,48,0.06)" }}
                  />

                  {chartType === "bar" ? (
                    <Bar dataKey="value" barSize={chartData.length > 18 ? 8 : 18} radius={0}>
                      {enrichedData.map((_, i) => (
                        <Cell key={i} fill={getCellFill(i)} />
                      ))}
                    </Bar>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#A05730"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#A05730", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  )}

                  {/* Moving average overlay — always visible */}
                  <Line
                    type="monotone"
                    dataKey="movingAvg"
                    stroke="#2D6A4F"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    activeDot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-[8px] font-mono" style={{ color: "#A09590" }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 inline-block" style={{ background: "#E0DAD3" }} />
                  Normal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-2 inline-block" style={{ background: "#A05730" }} />
                  Mejor período
                </span>
                {engine.anomalyIndices.length > 0 && (
                  <span className="flex items-center gap-1.5" style={{ color: "#D4450F" }}>
                    <span className="w-3 h-2 inline-block" style={{ background: "#D4450F" }} />
                    Anomalía detectada
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-5 inline-block"
                    style={{ borderTop: "2px dashed #2D6A4F", height: 0, display: "inline-block" }}
                  />
                  Media móvil 3p
                </span>
              </div>

              {/* Anomaly alert */}
              {engine.anomalyIndices.length > 0 && (
                <div
                  className="mt-3 px-3 py-2 text-[10px] font-mono"
                  style={{
                    background: "rgba(212,69,15,0.06)",
                    border: "1px solid rgba(212,69,15,0.2)",
                  }}
                >
                  <span style={{ color: "#D4450F" }}>⚠ Valor inusual</span>
                  {" — "}
                  <span style={{ color: "#6A6460" }}>
                    {engine.anomalyIndices
                      .map((i) => chartData[i]?.label)
                      .filter(Boolean)
                      .join(", ")}{" "}
                    destaca respecto al patrón general (detección IQR)
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Top 5 periods */}
        <div className="px-5 py-5 bg-white" style={{ borderBottom: BD }}>
          <div className="label-terra mb-4">Top 5 períodos</div>
          <table className="w-full text-xs font-mono">
            <thead>
              <tr style={{ borderBottom: BD }}>
                <th className="text-left pb-2 font-normal" style={{ color: "#A09590" }}>#</th>
                <th className="text-left pb-2 font-normal" style={{ color: "#A09590" }}>Período</th>
                <th className="text-right pb-2 font-normal" style={{ color: "#A09590" }}>Total</th>
                <th className="text-right pb-2 font-normal" style={{ color: "#A09590" }}>Ops</th>
              </tr>
            </thead>
            <tbody>
              {[...chartData]
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((d, i) => (
                  <tr key={i} style={{ borderBottom: i < 4 ? BD : "none" }}>
                    <td className="py-2" style={{ color: "#C5C2BE" }}>{i + 1}</td>
                    <td className="py-2" style={{ color: "#5A5A5A" }}>{d.label}</td>
                    <td className="py-2 text-right font-bold" style={{ color: "#A05730" }}>
                      €{d.value.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 text-right" style={{ color: "#A09590" }}>{d.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Trend summary */}
        <div
          className="px-5 py-3 flex items-center gap-4 bg-white text-xs font-mono"
          style={{ borderBottom: BD }}
        >
          <span style={{ color: "#A09590" }}>Tendencia global:</span>
          <span
            style={{ color: engine.trendPositive ? "#22C55E" : "#EF4444" }}
            className="font-bold"
          >
            {engine.trendPositive ? "↗ Creciente" : "↘ Decreciente"}
          </span>
          <span style={{ color: "#C5C2BE" }}>
            (pendiente lineal {engine.trendSlope >= 0 ? "+" : ""}
            {engine.trendSlope.toFixed(1)} €/período)
          </span>
        </div>

        {/* CTA */}
        <div className="px-5 py-10 text-center" style={{ background: "#A05730" }}>
          <div className="label mb-3" style={{ color: "rgba(240,237,232,0.55)" }}>
            Esto es solo una muestra
          </div>
          <h3
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "#F0EDE8", letterSpacing: "-0.02em" }}
          >
            ¿Imaginas este panel para tu negocio real?
          </h3>
          <p
            className="text-sm mb-7 max-w-md mx-auto"
            style={{ color: "rgba(240,237,232,0.72)" }}
          >
            Con CRM integrado, alertas automáticas y predicciones — no solo un dashboard.
          </p>
          <Link
            to="/diagnostico"
            className="inline-flex items-center gap-3 px-8 py-3 font-semibold text-sm"
            style={{ background: "#F0EDE8", color: "#A05730" }}
          >
            Diagnóstico gratuito · 10 min →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
