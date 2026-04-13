import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, BarChart3, Headphones, Lightbulb, Package, ArrowRight } from "lucide-react";

const statusColors = {
  pendiente: "bg-muted text-muted-foreground",
  "en progreso": "bg-primary/10 text-primary",
  completado: "bg-secondary/10 text-secondary",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { contractedServices, result } = useDiagnostic();

  const hasServices = contractedServices.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">Digital Lab</span>
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate("/catalogo")}>Añadir servicio</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Mi Dashboard</h1>

        {!hasServices ? (
          <Card className="border-border/50 text-center">
            <CardContent className="py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-foreground">Sin servicios activos</h2>
              <p className="text-muted-foreground mb-6">Contrata tu primer servicio para ver métricas y estado.</p>
              <Button onClick={() => navigate("/catalogo")}>Ver catálogo <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Services */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Mis servicios
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {contractedServices.map((s) => (
                  <Card key={s.id} className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground">{s.name}</h3>
                        <Badge className={statusColors[s.status]}>{s.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{s.price.toLocaleString("es-ES")} €/mes</p>
                      <div className="flex items-center gap-3">
                        <Progress value={s.progress} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{s.progress}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* KPIs */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Métricas clave
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Score digital", value: result ? `${result.score}%` : "—" },
                  { label: "Servicios activos", value: contractedServices.length.toString() },
                  { label: "Ahorro estimado", value: result ? `${Math.round(result.estimatedLoss * 0.35).toLocaleString("es-ES")} €` : "—" },
                ].map((m, i) => (
                  <Card key={i} className="border-border/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground mb-1">{m.label}</p>
                      <p className="text-2xl font-bold text-foreground">{m.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Insights */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-secondary" /> Insights
              </h2>
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-3">
                  {[
                    "Tu nivel de automatización tiene margen de mejora del 40%.",
                    "Centralizar datos podría reducir costes operativos un 25%.",
                    "Empresas de tu sector con score +70% crecen 2x más rápido.",
                  ].map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <Lightbulb className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      {insight}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Support */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" /> Soporte
              </h2>
              <Card className="border-border/50">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">¿Necesitas ayuda? Nuestro equipo está disponible.</p>
                  <Button variant="outline">Abrir ticket de soporte</Button>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
