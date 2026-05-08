import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gsap from "gsap";

const ScoreRing = ({ score }: { score: number }) => {
  const r = 76;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#1A1A1A" strokeWidth="10" />
        <circle cx="100" cy="100" r={r} fill="none" stroke="#A05730" strokeWidth="10"
          strokeLinecap="butt" strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mono-num text-3xl font-bold text-raw">{score}%</span>
        <span className="label" style={{ color: "#5A5A5A" }}>digital</span>
      </div>
    </div>
  );
};

const LEVELS = {
  básico: { label: "NIVEL BÁSICO", color: "#FF4D4D", desc: "Oportunidades importantes sin aprovechar." },
  intermedio: { label: "NIVEL INTERMEDIO", color: "#FFEE93", desc: "Bien encaminado, pero hay palancas sin activar." },
  avanzado: { label: "NIVEL AVANZADO", color: "#A05730", desc: "Sólido. El siguiente paso es escalar." },
};

const Resultados = () => {
  const navigate = useNavigate();
  const { result } = useDiagnostic();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    gsap.fromTo(".r-card",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.2 }
    );
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-void flex flex-col items-center justify-center gap-6">
        <p className="text-sm" style={{ color: "#5A5A5A" }}>No hay resultados disponibles.</p>
        <button
          onClick={() => navigate("/diagnostico")}
          className="px-7 py-3 font-semibold text-sm text-raw"
          style={{ background: "#A05730" }}
        >
          Hacer diagnóstico →
        </button>
      </div>
    );
  }

  const lvl = LEVELS[result.level];

  return (
    <div ref={containerRef} className="min-h-screen bg-void text-raw">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 pt-24 pb-20">

        <div className="label-terra mb-3">Tu informe</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ letterSpacing: "-0.02em" }}>
          Diagnóstico de madurez digital
        </h1>
        <p className="text-sm mb-14" style={{ color: "#5A5A5A", maxWidth: 440 }}>
          Basado en tus respuestas, este es el estado real de tu negocio y donde están las oportunidades.
        </p>

        {/* Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-wire mb-8">
          <div className="r-card opacity-0 p-8 flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-wire">
            <ScoreRing score={result.score} />
            <div className="label text-center">Competitividad digital</div>
          </div>
          <div className="r-card opacity-0 p-8 flex flex-col items-center justify-center gap-2 border-b md:border-b-0 md:border-r border-wire">
            <div className="label mb-2">Pérdida anual estimada</div>
            <div className="mono-num text-4xl font-bold" style={{ color: "#FF4D4D" }}>
              {result.estimatedLoss.toLocaleString("es-ES")} €
            </div>
            <div className="text-xs text-center" style={{ color: "#5A5A5A" }}>por ineficiencias digitales actuales</div>
          </div>
          <div className="r-card opacity-0 p-8 flex flex-col items-center justify-center gap-2">
            <div className="label mb-2">Nivel de madurez</div>
            <div className="mono-num text-xl font-bold" style={{ color: lvl.color }}>{lvl.label}</div>
            <div className="text-xs text-center max-w-[18ch]" style={{ color: "#5A5A5A" }}>{lvl.desc}</div>
          </div>
        </div>

        {/* Radar */}
        <div className="r-card opacity-0 border border-wire p-8 mb-8">
          <div className="label mb-6">Mapa de áreas digitales</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={result.areas}>
                <PolarGrid stroke="#2A2A2A" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#5A5A5A", fontSize: 11, fontFamily: "JetBrains Mono" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Nivel" dataKey="value" stroke="#A05730" fill="#A05730" fillOpacity={0.12} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick wins + Recs */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-wire mb-8">
          <div className="r-card opacity-0 p-8 border-b md:border-b-0 md:border-r border-wire">
            <div className="label-sol mb-6">Acciones inmediatas</div>
            <ul className="flex flex-col gap-4">
              {result.quickWins.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-snug" style={{ color: "#E5DCA2" }}>
                  <span className="mono-num font-bold shrink-0" style={{ color: "#A05730", marginTop: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="r-card opacity-0 p-8">
            <div className="label-sol mb-6">Plan a medio plazo</div>
            <ul className="flex flex-col gap-4">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-snug" style={{ color: "#E5DCA2" }}>
                  <span className="mono-num font-bold shrink-0" style={{ color: "#A05730", marginTop: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="r-card opacity-0 border border-wire bg-surface p-8 md:p-12">
          <div className="label-terra mb-4">¿Qué hago ahora?</div>
          <h3 className="text-2xl font-bold mb-4 leading-tight" style={{ letterSpacing: "-0.01em" }}>
            Hablamos. Sin compromiso.
          </h3>
          <p className="text-sm mb-8" style={{ color: "#5A5A5A", maxWidth: 440 }}>
            30 minutos. Te decimos exactamente qué soluciones son prioritarias y cuánto costarían.
            Si no te convencemos, no perdiste nada.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/contacto")}
              className="px-8 py-3.5 font-semibold text-sm text-raw transition-colors duration-200"
              style={{ background: "#A05730" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#C4733E")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#A05730")}
            >
              Hablar con un consultor →
            </button>
            <button
              onClick={() => navigate("/servicios")}
              className="px-8 py-3.5 text-sm transition-all duration-200"
              style={{ border: "1px solid #2A2A2A", color: "#5A5A5A" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A05730"; e.currentTarget.style.color = "#F0EDE8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#5A5A5A"; }}
            >
              Ver servicios
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resultados;
