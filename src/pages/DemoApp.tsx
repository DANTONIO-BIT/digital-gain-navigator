import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DropZone from "@/components/demo/DropZone";
import NicheWizard from "@/components/demo/NicheWizard";
import LiveDashboard, { DashboardConfig } from "@/components/demo/LiveDashboard";
import { parseExcelFile, ParsedData, type AggPeriod } from "@/lib/excelParser";

type Step = "upload" | "wizard" | "dashboard";

const BD = "1px solid #E0DAD3";

const STEPS = [
  { num: "01", label: "Sube tu archivo" },
  { num: "02", label: "Configura el panel" },
  { num: "03", label: "Tu dashboard" },
];

const DemoApp = () => {
  const [step, setStep] = useState<Step>("upload");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = step === "upload" ? 0 : step === "wizard" ? 1 : 2;

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await parseExcelFile(file);
      setParsedData(data);
      setStep("wizard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al leer el archivo");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWizardComplete = (wizConfig: {
    niche: string;
    valueCol: string;
    period: AggPeriod;
  }) => {
    if (!parsedData) return;
    setConfig({
      ...wizConfig,
      fileName: parsedData.detected.fileName,
      rowCount: parsedData.detected.rowCount,
      dateCol: parsedData.detected.dateCol,
    });
    setStep("dashboard");
  };

  const goBack = () => {
    if (step === "dashboard") setStep("wizard");
    if (step === "wizard") setStep("upload");
  };

  return (
    <div className="min-h-screen" style={{ background: "#F9F6F1" }}>
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-8 md:px-12 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12" style={{ borderBottom: BD, paddingBottom: "3rem" }}>
          <div className="label-terra mb-3">Demo gratuita · Beta</div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ letterSpacing: "-0.02em", color: "#1A1A1A" }}
          >
            Tu Excel.<br />Tu dashboard.
          </h1>
          <p className="text-base max-w-lg" style={{ color: "#6A6460" }}>
            Sube tu hoja de datos, elige tu sector y genera un panel de análisis
            en segundos. Sin registros, sin coste, sin que tus datos salgan de tu navegador.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex mb-12" style={{ borderBottom: BD }}>
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="flex items-center gap-3 px-5 py-3"
              style={{
                borderRight: i < 2 ? BD : "none",
                background: i === stepIndex ? "#1A1A1A" : "transparent",
              }}
            >
              <span
                className="mono-num text-xs font-bold"
                style={{
                  color:
                    i < stepIndex
                      ? "#2D6A4F"
                      : i === stepIndex
                      ? "#A05730"
                      : "#C5C2BE",
                }}
              >
                {i < stepIndex ? "✓" : s.num}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    i === stepIndex
                      ? "#F0EDE8"
                      : i < stepIndex
                      ? "#6A6460"
                      : "#C5C2BE",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === "upload" && (
          <div className="max-w-lg">
            <DropZone onFile={handleFile} loading={loading} error={error} />
          </div>
        )}

        {step === "wizard" && parsedData && (
          <NicheWizard
            schema={parsedData.schema}
            headers={parsedData.headers}
            onComplete={handleWizardComplete}
          />
        )}

        {step === "dashboard" && parsedData && config && (
          <LiveDashboard rows={parsedData.rows} config={config} />
        )}

        {step !== "upload" && (
          <button
            onClick={goBack}
            className="mt-8 text-xs font-mono transition-colors"
            style={{ color: "#A09590" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#1A1A1A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#A09590")
            }
          >
            ← Volver
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DemoApp;
