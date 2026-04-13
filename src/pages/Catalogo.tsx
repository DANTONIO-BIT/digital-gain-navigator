import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Database, Zap, Shield, BarChart3, CheckCircle } from "lucide-react";

const services = [
  {
    id: "data-intelligence",
    name: "Data Intelligence",
    icon: Database,
    desc: "Centraliza, analiza y visualiza tus datos con IA local. Dashboards en tiempo real y predicciones.",
    price: 2500,
    features: ["Dashboard ejecutivo", "KPIs automatizados", "Predicciones con IA", "Integración con tus sistemas"],
    tag: "Más popular",
    relevantAreas: ["Datos", "Estrategia"],
  },
  {
    id: "automation",
    name: "Automatización Inteligente",
    icon: Zap,
    desc: "Elimina tareas repetitivas. Workflows automáticos que ahorran +20h/semana.",
    price: 1800,
    features: ["Análisis de procesos", "Diseño de workflows", "Integración RPA", "Formación de equipo"],
    relevantAreas: ["Automatización"],
  },
  {
    id: "security",
    name: "Privacidad & Compliance",
    icon: Shield,
    desc: "IA local para cumplimiento RGPD. Auditoría y protección de datos sin terceros.",
    price: 3200,
    features: ["Auditoría de seguridad", "Plan RGPD", "IA local on-premise", "Monitorización continua"],
    relevantAreas: ["Seguridad"],
  },
  {
    id: "full-transform",
    name: "Transformación Digital 360°",
    icon: BarChart3,
    desc: "Pack completo: datos + automatización + seguridad. Ideal para PYMEs que quieren dar el salto.",
    price: 5900,
    features: ["Todo de Data Intelligence", "Todo de Automatización", "Todo de Seguridad", "Consultor dedicado", "Soporte prioritario"],
    tag: "Mejor valor",
    relevantAreas: ["Datos", "Automatización", "Seguridad", "Estrategia"],
  },
];

const Catalogo = () => {
  const navigate = useNavigate();
  const { result } = useDiagnostic();

  // Sort by relevance if we have results
  const sortedServices = result
    ? [...services].sort((a, b) => {
        const scoreA = a.relevantAreas.filter((area) => result.areas.find((ra) => ra.name === area && ra.value < 60)).length;
        const scoreB = b.relevantAreas.filter((area) => result.areas.find((ra) => ra.name === area && ra.value < 60)).length;
        return scoreB - scoreA;
      })
    : services;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">Digital Lab</span>
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>Mi Dashboard</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">Servicios de transformación digital</h1>
        <p className="text-center text-muted-foreground mb-12">
          {result ? "Ordenados según tu diagnóstico — los más relevantes primero" : "Soluciones adaptadas a cada PYME"}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {sortedServices.map((s) => (
            <Card key={s.id} className="border-border/50 flex flex-col relative overflow-hidden">
              {s.tag && (
                <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">{s.tag}</Badge>
              )}
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{s.name}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-secondary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-6 border-t">
                <div>
                  <span className="text-2xl font-bold text-foreground">{s.price.toLocaleString("es-ES")} €</span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>
                <Button onClick={() => navigate(`/contratar/${s.id}`)}>Contratar</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
