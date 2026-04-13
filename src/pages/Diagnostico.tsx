import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDiagnostic, DiagnosticAnswers, DiagnosticResult } from "@/context/DiagnosticContext";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";

interface Question {
  id: keyof DiagnosticAnswers;
  question: string;
  type: "radio" | "scale";
  options?: { value: string; label: string }[];
}

const questions: Question[] = [
  {
    id: "sector",
    question: "¿En qué sector opera tu empresa?",
    type: "radio",
    options: [
      { value: "retail", label: "Retail / Comercio" },
      { value: "servicios", label: "Servicios profesionales" },
      { value: "industria", label: "Industria / Manufactura" },
      { value: "tecnologia", label: "Tecnología / Software" },
      { value: "otro", label: "Otro" },
    ],
  },
  {
    id: "companySize",
    question: "¿Cuántos empleados tiene tu empresa?",
    type: "radio",
    options: [
      { value: "1-10", label: "1-10 empleados" },
      { value: "11-50", label: "11-50 empleados" },
      { value: "51-200", label: "51-200 empleados" },
      { value: "200+", label: "Más de 200" },
    ],
  },
  {
    id: "annualRevenue",
    question: "¿Cuál es la facturación anual aproximada?",
    type: "radio",
    options: [
      { value: "100000", label: "Menos de 500K €" },
      { value: "500000", label: "500K - 2M €" },
      { value: "2000000", label: "2M - 10M €" },
      { value: "10000000", label: "Más de 10M €" },
    ],
  },
  {
    id: "dataUsage",
    question: "¿Cómo gestionáis los datos de clientes y operaciones?",
    type: "radio",
    options: [
      { value: "1", label: "Excel / hojas de cálculo" },
      { value: "2", label: "Software básico (CRM simple)" },
      { value: "3", label: "Plataforma integrada (ERP/CRM)" },
      { value: "4", label: "Data warehouse + analítica avanzada" },
    ],
  },
  {
    id: "techLevel",
    question: "¿Qué nivel de adopción tecnológica tiene tu equipo?",
    type: "radio",
    options: [
      { value: "1", label: "Básico (email + Office)" },
      { value: "2", label: "Intermedio (apps cloud, videoconferencia)" },
      { value: "3", label: "Avanzado (herramientas colaborativas, APIs)" },
      { value: "4", label: "Experto (DevOps, IA, automatización)" },
    ],
  },
  {
    id: "automation",
    question: "¿Cuántos procesos tenéis automatizados?",
    type: "radio",
    options: [
      { value: "1", label: "Ninguno o casi ninguno" },
      { value: "2", label: "Algunos (facturación, emails)" },
      { value: "3", label: "Bastantes (marketing, ventas, soporte)" },
      { value: "4", label: "La mayoría de procesos clave" },
    ],
  },
  {
    id: "dataStrategy",
    question: "¿Tenéis una estrategia de datos definida?",
    type: "radio",
    options: [
      { value: "1", label: "No, tomamos decisiones por intuición" },
      { value: "2", label: "Usamos algunos informes básicos" },
      { value: "3", label: "Dashboards y KPIs definidos" },
      { value: "4", label: "Decisiones data-driven con predicciones" },
    ],
  },
  {
    id: "cloudAdoption",
    question: "¿Cuál es vuestro nivel de adopción cloud?",
    type: "radio",
    options: [
      { value: "1", label: "Todo en servidores locales" },
      { value: "2", label: "Algo en cloud (email, almacenamiento)" },
      { value: "3", label: "Infraestructura híbrida" },
      { value: "4", label: "Cloud-first / cloud-native" },
    ],
  },
  {
    id: "cybersecurity",
    question: "¿Qué medidas de ciberseguridad tenéis?",
    type: "radio",
    options: [
      { value: "1", label: "Antivirus básico" },
      { value: "2", label: "Firewall + backups periódicos" },
      { value: "3", label: "Política de seguridad + formación" },
      { value: "4", label: "SOC / monitorización 24/7 + auditorías" },
    ],
  },
  {
    id: "digitalCulture",
    question: "¿Cómo describirías la cultura digital de tu empresa?",
    type: "radio",
    options: [
      { value: "1", label: "Resistencia al cambio" },
      { value: "2", label: "Abiertos pero sin iniciativa" },
      { value: "3", label: "Proactivos en innovación" },
      { value: "4", label: "Digital-first en todo" },
    ],
  },
];

function calculateResult(answers: DiagnosticAnswers): DiagnosticResult {
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
    { name: "Cloud", value: Number(answers.cloudAdoption) * 25 },
    { name: "Seguridad", value: Number(answers.cybersecurity) * 25 },
    { name: "Cultura", value: Number(answers.digitalCulture) * 25 },
  ];

  const quickWins: string[] = [];
  const recommendations: string[] = [];

  if (Number(answers.dataUsage) <= 2) {
    quickWins.push("Centralizar datos en un CRM integrado");
    recommendations.push("Implementar Data Intelligence para decisiones basadas en datos");
  }
  if (Number(answers.automation) <= 2) {
    quickWins.push("Automatizar facturación y seguimiento de clientes");
    recommendations.push("Diseñar workflows automáticos para procesos repetitivos");
  }
  if (Number(answers.cybersecurity) <= 2) {
    quickWins.push("Activar autenticación de doble factor en todos los sistemas");
    recommendations.push("Auditoría de seguridad y plan de protección de datos");
  }
  if (Number(answers.dataStrategy) <= 2) {
    quickWins.push("Definir 5 KPIs clave del negocio");
    recommendations.push("Dashboard ejecutivo con métricas en tiempo real");
  }
  if (Number(answers.cloudAdoption) <= 2) {
    quickWins.push("Migrar el email y almacenamiento a la nube");
    recommendations.push("Plan de migración cloud con IA local para mantener privacidad");
  }

  if (quickWins.length === 0) quickWins.push("Optimizar flujos existentes con IA predictiva");
  if (recommendations.length === 0) recommendations.push("Escalar tu infraestructura data-driven con modelos avanzados");

  return { score, level, estimatedLoss, areas, quickWins, recommendations };
}

const Diagnostico = () => {
  const navigate = useNavigate();
  const { setAnswers, setResult } = useDiagnostic();
  const [step, setStep] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});

  const currentQ = questions[step];
  const progress = ((step + 1) / questions.length) * 100;
  const canNext = !!currentAnswers[currentQ.id];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const finalAnswers: DiagnosticAnswers = {
        sector: currentAnswers.sector || "",
        companySize: currentAnswers.companySize || "",
        annualRevenue: currentAnswers.annualRevenue || "500000",
        dataUsage: Number(currentAnswers.dataUsage) || 1,
        techLevel: Number(currentAnswers.techLevel) || 1,
        automation: Number(currentAnswers.automation) || 1,
        dataStrategy: Number(currentAnswers.dataStrategy) || 1,
        cloudAdoption: Number(currentAnswers.cloudAdoption) || 1,
        cybersecurity: Number(currentAnswers.cybersecurity) || 1,
        digitalCulture: Number(currentAnswers.digitalCulture) || 1,
      };
      setAnswers(finalAnswers);
      setResult(calculateResult(finalAnswers));
      navigate("/resultados");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">Digital Lab</span>
          </button>
          <span className="text-muted-foreground text-sm ml-auto">Pregunta {step + 1} de {questions.length}</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <Card className="w-full max-w-2xl border-border/50 shadow-lg">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">{currentQ.question}</h2>

            <RadioGroup
              value={currentAnswers[currentQ.id] || ""}
              onValueChange={(val) => setCurrentAnswers({ ...currentAnswers, [currentQ.id]: val })}
              className="space-y-3"
            >
              {currentQ.options?.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`${currentQ.id}-${opt.value}`}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    currentAnswers[currentQ.id] === opt.value
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={`${currentQ.id}-${opt.value}`} />
                  <span className="text-foreground">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex justify-between mt-10">
              <Button
                variant="outline"
                onClick={() => step > 0 ? setStep(step - 1) : navigate("/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {step > 0 ? "Anterior" : "Salir"}
              </Button>
              <Button onClick={handleNext} disabled={!canNext}>
                {step < questions.length - 1 ? "Siguiente" : "Ver resultados"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostico;
