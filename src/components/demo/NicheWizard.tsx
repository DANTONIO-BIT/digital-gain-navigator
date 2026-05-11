import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { AggPeriod } from "@/lib/excelParser";
import type { SchemaResult } from "@/lib/schemaDetector";

const NICHES = [
  { id: "restaurante", label: "Restaurante / Hostelería" },
  { id: "tienda",      label: "Tienda / E-commerce" },
  { id: "servicios",   label: "Servicios / Consultoría" },
  { id: "otro",        label: "Otro sector" },
];

const PERIODS: { id: AggPeriod; label: string; desc: string }[] = [
  { id: "month", label: "Por mes",     desc: "Suma ops por mes" },
  { id: "week",  label: "Por semana",  desc: "Suma ops por semana" },
  { id: "day",   label: "Por día",     desc: "Un punto por día" },
  { id: "raw",   label: "Sin agrupar", desc: "Filas tal como están" },
];

const PERIOD_LABEL: Record<AggPeriod, string> = {
  month: "mensual", week: "semanal", day: "diario", raw: "sin agrupar",
};

interface WizardConfig {
  niche: string;
  valueCol: string;
  period: AggPeriod;
}

interface NicheWizardProps {
  schema: SchemaResult;
  headers: string[];
  onComplete: (config: WizardConfig) => void;
}

const BD = "1px solid #E0DAD3";

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="py-2.5 px-4 text-sm font-medium border text-left transition-all duration-150"
    style={{
      borderColor: active ? "#A05730" : "#E0DAD3",
      background: active ? "#A05730" : "white",
      color: active ? "#F0EDE8" : "#5A5A5A",
    }}
  >
    {children}
  </button>
);

const NicheWizard = ({ schema, headers, onComplete }: NicheWizardProps) => {
  const [niche, setNiche] = useState("");
  const [period, setPeriod] = useState<AggPeriod>(schema.suggestedPeriod);
  const [valueCol, setValueCol] = useState(schema.metricCols[0] ?? headers[0] ?? "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canSubmit = !!niche && !!valueCol;

  const fmtDate = (d: Date) => format(d, "MMM yy", { locale: es });

  return (
    <div className="space-y-10 max-w-2xl">

      {/* Auto-detection summary */}
      <div className="p-5" style={{ border: BD, background: "white" }}>
        <div className="label-terra mb-4">Análisis automático completado</div>
        <div className="space-y-2 text-xs font-mono">

          {schema.dateCol ? (
            <div className="flex items-start gap-2">
              <span style={{ color: "#22C55E" }}>✓</span>
              <span style={{ color: "#6A6460" }}>
                Fecha detectada:{" "}
                <span style={{ color: "#1A1A1A" }}>{schema.dateCol}</span>
                {schema.dateRange && (
                  <span style={{ color: "#A09590" }}>
                    {" · "}{schema.dateRange.days} días
                    {" · "}{fmtDate(schema.dateRange.min)} → {fmtDate(schema.dateRange.max)}
                    {" · "}vista recomendada:{" "}
                    <span style={{ color: "#A05730" }}>{PERIOD_LABEL[schema.suggestedPeriod]}</span>
                  </span>
                )}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span style={{ color: "#EF4444" }}>✗</span>
              <span style={{ color: "#A09590" }}>
                No se detectó columna de fecha — se usará modo sin agrupar
              </span>
            </div>
          )}

          {schema.metricCols.length > 0 ? (
            <div className="flex items-start gap-2">
              <span style={{ color: "#22C55E" }}>✓</span>
              <span style={{ color: "#6A6460" }}>
                Métricas:{" "}
                <span style={{ color: "#1A1A1A" }}>{schema.metricCols.join(", ")}</span>
                <span style={{ color: "#A09590" }}>
                  {" "}({schema.metricCols.length} columna{schema.metricCols.length > 1 ? "s" : ""} numérica{schema.metricCols.length > 1 ? "s" : ""})
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <span style={{ color: "#EF4444" }}>✗</span>
              <span style={{ color: "#A09590" }}>No se detectaron columnas numéricas</span>
            </div>
          )}

          {schema.categoryCols.length > 0 && (
            <div className="flex items-start gap-2">
              <span style={{ color: "#2D6A4F" }}>◈</span>
              <span style={{ color: "#6A6460" }}>
                Categorías:{" "}
                <span style={{ color: "#1A1A1A" }}>{schema.categoryCols.join(", ")}</span>
              </span>
            </div>
          )}

          <div className="flex items-start gap-2 pt-1" style={{ borderTop: BD }}>
            <span style={{ color: "#A09590" }}>→</span>
            <span style={{ color: "#A09590" }}>
              {schema.totalRows.toLocaleString("es-ES")} filas procesadas
            </span>
          </div>
        </div>
      </div>

      {/* Q1 — only required question */}
      <div>
        <div className="label-terra mb-4">01 — ¿Tipo de negocio?</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {NICHES.map((n) => (
            <Chip key={n.id} active={niche === n.id} onClick={() => setNiche(n.id)}>
              {n.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Advanced override (collapsed by default) */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-[10px] font-mono transition-colors"
          style={{ color: "#A09590" }}
        >
          <span>{showAdvanced ? "▲" : "▼"}</span>
          {showAdvanced ? "Ocultar ajuste manual" : "Ajuste manual — si la detección automática falló"}
        </button>

        {showAdvanced && (
          <div className="mt-6 space-y-6 pt-6" style={{ borderTop: BD }}>
            {/* Period override */}
            <div>
              <div className="label-terra mb-3">Agrupación por período</div>
              <div className="flex flex-wrap gap-2">
                {PERIODS.map((p) => (
                  <Chip key={p.id} active={period === p.id} onClick={() => setPeriod(p.id)}>
                    <span className="block">{p.label}</span>
                    <span className="block text-[9px] mt-0.5 font-normal" style={{ opacity: 0.7 }}>
                      {p.desc}
                    </span>
                  </Chip>
                ))}
              </div>
            </div>

            {/* Column override */}
            <div>
              <div className="label-terra mb-3">Columna de ingresos / valor</div>
              <select
                value={valueCol}
                onChange={(e) => setValueCol(e.target.value)}
                className="w-full md:w-80 py-2.5 px-4 border text-sm font-mono bg-white appearance-none"
                style={{ borderColor: "#E0DAD3", color: "#1A1A1A" }}
              >
                {headers.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={() => canSubmit && onComplete({ niche, valueCol, period })}
        disabled={!canSubmit}
        className="flex items-center gap-3 py-3 px-8 text-sm font-semibold transition-all duration-150"
        style={{
          background: canSubmit ? "#1A1A1A" : "#E8E4DC",
          color: canSubmit ? "#F0EDE8" : "#A09590",
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Generar mi panel
        <span className="font-mono text-base">→</span>
      </button>
    </div>
  );
};

export default NicheWizard;
