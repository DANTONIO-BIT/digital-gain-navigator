import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDiagnostic, DiagnosticAnswers, DiagnosticResult } from "@/context/DiagnosticContext";
import Navbar from "@/components/Navbar";

interface Question {
  id: keyof DiagnosticAnswers;
  question: string;
  options: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: "sector",
    question: "¿En qué sector opera tu negocio?",
    options: [
      { value: "retail", label: "Comercio / Tienda" },
      { value: "servicios", label: "Servicios profesionales" },
      { value: "restauracion", label: "Hostelería / Restauración" },
      { value: "industria", label: "Industria / Manufactura" },
      { value: "otro", label: "Otro" },
    ],
  },
  {
    id: "companySize",
    question: "¿Cuántas personas forman tu equipo?",
    options: [
      { value: "autonomo", label: "Solo yo (autónomo)" },
      { value: "1-10", label: "2-10 personas" },
      { value: "11-50", label: "11-50 personas" },
      { value: "200+", label: "Más de 50" },
    ],
  },
  {
    id: "annualRevenue",
    question: "¿Cuál es la facturación anual aproximada?",
    options: [
      { value: "100000", label: "Menos de 100K €" },
      { value: "500000", label: "100K - 500K €" },
      { value: "2000000", label: "500K - 2M €" },
      { value: "10000000", label: "Más de 2M €" },
    ],
  },
  {
    id: "dataUsage",
    question: "¿Cómo gestionas la información de tus clientes?",
    options: [
      { value: "1", label: "Papel, memoria o Excel" },
      { value: "2", label: "WhatsApp / email sin organización" },
      { value: "3", label: "Software básico (CRM simple)" },
      { value: "4", label: "Plataforma integrada con analítica" },
    ],
  },
  {
    id: "techLevel",
    question: "¿Qué nivel digital tiene tu negocio hoy?",
    options: [
      { value: "1", label: "Básico — solo email y teléfono" },
      { value: "2", label: "Intermedio — alguna app o herramienta online" },
      { value: "3", label: "Avanzado — varias herramientas digitales coordinadas" },
      { value: "4", label: "Digital-first — todo automatizado y medido" },
    ],
  },
  {
    id: "automation",
    question: "¿Cuántas tareas tienes automatizadas?",
    options: [
      { value: "1", label: "Ninguna, todo es manual" },
      { value: "2", label: "Alguna puntual (factura automática, etc.)" },
      { value: "3", label: "Bastantes (emails, recordatorios, reservas)" },
      { value: "4", label: "La mayoría de procesos repetitivos" },
    ],
  },
  {
    id: "dataStrategy",
    question: "¿Cómo tomas las decisiones importantes en tu negocio?",
    options: [
      { value: "1", label: "Por intuición y experiencia" },
      { value: "2", label: "Con algunos datos básicos" },
      { value: "3", label: "Con KPIs y métricas definidas" },
      { value: "4", label: "Con datos en tiempo real y predicciones" },
    ],
  },
  {
    id: "cloudAdoption",
    question: "¿Tienes presencia digital activa?",
    options: [
      { value: "1", label: "No tengo web ni redes activas" },
      { value: "2", label: "Tengo redes pero no las cuido" },
      { value: "3", label: "Web + redes con actividad regular" },
      { value: "4", label: "Presencia completa con estrategia SEO/ads" },
    ],
  },
  {
    id: "cybersecurity",
    question: "¿Cómo consigues nuevos clientes actualmente?",
    options: [
      { value: "1", label: "Boca a boca solamente" },
      { value: "2", label: "Boca a boca + algo de redes" },
      { value: "3", label: "Marketing activo pero sin medir resultados" },
      { value: "4", label: "Marketing medido con ROI claro" },
    ],
  },
  {
    id: "digitalCulture",
    question: "¿Cuánto tiempo dedicas a tareas que no generan ingresos?",
    options: [
      { value: "1", label: "Más de la mitad de mi jornada" },
      { value: "2", label: "Bastante — me roba tiempo productivo" },
      { value: "3", label: "Algo, pero lo tengo controlado" },
      { value: "4", label: "Muy poco, tengo sistemas eficientes" },
    ],
  },
];

const calculateResult = (answers: DiagnosticAnswers): DiagnosticResult => {
  const numericFields: (keyof DiagnosticAnswers)[] = [
    "dataUsage", "techLevel", "automation", "dataStrategy",
    "cloudAdoption", "cybersecurity", "digitalCulture",
  ];
  const scores = numericFields.map((f) => Number(answers[f]));
  const total = scores.reduce((a, b) => a + b, 0);
  const maxTotal = numericFields.length * 4;
  const score = Math.round((total / maxTotal) * 100);
  const level = score >= 70 ? "avanzado" : score >= 40 ? "intermedio" : "básico";

  const revenueMap: Record<string, number> = {
    "100000": 100000, "500000": 500000, "2000000": 2000000, "10000000": 10000000,
  };
  const revenue = revenueMap[answers.annualRevenue] || 500000;
  const lossPercent = Math.max(5, 30 - score * 0.25);
  const estimatedLoss = Math.round(revenue * (lossPercent / 100));

  const areas = [
    { name: "Datos", value: Number(answers.dataUsage) * 25 },
    { name: "Tecnología", value: Number(answers.techLevel) * 25 },
    { name: "Automatización", value: Number(answers.automation) * 25 },
    { name: "Estrategia", value: Number(answers.dataStrategy) * 25 },
    { name: "Presencia", value: Number(answers.cloudAdoption) * 25 },
    { name: "Captación", value: Number(answers.cybersecurity) * 25 },
    { name: "Eficiencia", value: Number(answers.digitalCulture) * 25 },
  ];

  const quickWins: string[] = [];
  const recommendations: string[] = [];

  if (Number(answers.dataUsage) <= 2) {
    quickWins.push("Centralizar contactos en un CRM básico esta semana");
    recommendations.push("CRM adaptado a tu sector para no perder ninguna oportunidad");
  }
  if (Number(answers.automation) <= 2) {
    quickWins.push("Automatizar recordatorios y seguimiento de clientes");
    recommendations.push("Workflows que eliminen las tareas manuales repetitivas");
  }
  if (Number(answers.cloudAdoption) <= 2) {
    quickWins.push("Crear o actualizar tu ficha de Google My Business");
    recommendations.push("Estrategia de presencia digital local con SEO y redes activas");
  }
  if (Number(answers.cybersecurity) <= 2) {
    quickWins.push("Activar campañas de bajo coste en Meta para Sevilla");
    recommendations.push("Plan de marketing local con retorno medible en cada euro");
  }
  if (Number(answers.dataStrategy) <= 2) {
    quickWins.push("Definir 3 métricas clave de tu negocio y medirlas semanalmente");
    recommendations.push("Dashboard sencillo para tomar decisiones con datos reales");
  }

  if (quickWins.length === 0) quickWins.push("Optimizar los flujos existentes para escalar sin añadir coste");
  if (recommendations.length === 0) recommendations.push("Escalar la estrategia digital con acciones de mayor impacto");

  return { score, level, estimatedLoss, areas, quickWins, recommendations };
};

const Diagnostico = () => {
  const navigate = useNavigate();
  const { setAnswers, setResult } = useDiagnostic();
  const [step, setStep] = useState(0);
  const [answers, setLocalAnswers] = useState<Record<string, string>>({});

  const currentQ = questions[step];
  const progress = (step / questions.length) * 100;
  const canNext = !!answers[currentQ.id];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const final: DiagnosticAnswers = {
        sector: answers.sector || "",
        companySize: answers.companySize || "",
        annualRevenue: answers.annualRevenue || "500000",
        dataUsage: Number(answers.dataUsage) || 1,
        techLevel: Number(answers.techLevel) || 1,
        automation: Number(answers.automation) || 1,
        dataStrategy: Number(answers.dataStrategy) || 1,
        cloudAdoption: Number(answers.cloudAdoption) || 1,
        cybersecurity: Number(answers.cybersecurity) || 1,
        digitalCulture: Number(answers.digitalCulture) || 1,
      };
      setAnswers(final);
      setResult(calculateResult(final));
      navigate("/resultados");
    }
  };

  return (
    <div className="min-h-screen bg-void text-raw flex flex-col">
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-[2px] bg-wire">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: "#A05730" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-10">
            <span className="label-terra">Diagnóstico gratuito</span>
            <span className="mono-num text-xs" style={{ color: "#3A3A3A" }}>
              {step + 1} / {questions.length}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-raw mb-8 leading-tight" style={{ letterSpacing: "-0.01em" }}>
            {currentQ.question}
          </h2>

          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={(val) => setLocalAnswers({ ...answers, [currentQ.id]: val })}
            className="flex flex-col gap-2.5"
          >
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.id] === opt.value;
              return (
                <Label
                  key={opt.value}
                  htmlFor={`q-${opt.value}`}
                  className="flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 text-sm"
                  style={{
                    borderColor: selected ? "#A05730" : "#2A2A2A",
                    background: selected ? "rgba(160,87,48,0.08)" : "transparent",
                    color: selected ? "#F0EDE8" : "#5A5A5A",
                  }}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`q-${opt.value}`}
                    style={{ borderColor: selected ? "#A05730" : "#3A3A3A" }}
                  />
                  <span>{opt.label}</span>
                </Label>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between items-center mt-10">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
              className="text-sm transition-colors duration-200"
              style={{ color: "#3A3A3A" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F0EDE8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#3A3A3A")}
            >
              ← {step > 0 ? "Anterior" : "Salir"}
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              className="px-8 py-3 font-semibold text-sm tracking-wide transition-all duration-200"
              style={{
                background: canNext ? "#A05730" : "#1A1A1A",
                color: canNext ? "#F0EDE8" : "#3A3A3A",
                cursor: canNext ? "pointer" : "not-allowed",
              }}
            >
              {step < questions.length - 1 ? "Siguiente →" : "Ver mi informe →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostico;
