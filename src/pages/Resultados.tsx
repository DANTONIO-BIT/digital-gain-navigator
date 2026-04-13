import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ArrowRight, TrendingDown, Zap, Target } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

const ScoreRing = ({ score }: { score: number }) => {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "hsl(160, 59%, 45%)" : score >= 40 ? "hsl(196, 61%, 42%)" : "hsl(0, 84%, 60%)";

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
        <circle cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{score}%</span>
        <span className="text-sm text-muted-foreground">Competitividad</span>
      </div>
    </div>
  );
};

const Resultados = () => {
  const navigate = useNavigate();
  const { result } = useDiagnostic();

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">No hay resultados disponibles.</p>
        <Button onClick={() => navigate("/diagnostico")}>Hacer diagnóstico</Button>
      </div>
    );
  }

  const levelColors = { básico: "text-destructive", intermedio: "text-primary", avanzado: "text-secondary" };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">Digital Lab</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-foreground">Tu informe de madurez digital</h1>
        <p className="text-center text-muted-foreground mb-12">Análisis completo basado en tus respuestas</p>

        {/* Score + Loss + Level */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/50">
            <CardContent className="p-8 flex flex-col items-center">
              <ScoreRing score={result.score} />
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-8 text-center flex flex-col justify-center h-full">
              <TrendingDown className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Pérdida anual estimada</p>
              <p className="text-3xl font-bold text-destructive">{result.estimatedLoss.toLocaleString("es-ES")} €</p>
              <p className="text-xs text-muted-foreground mt-2">por ineficiencias digitales</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-8 text-center flex flex-col justify-center h-full">
              <Target className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-1">Nivel de madurez</p>
              <p className={`text-3xl font-bold capitalize ${levelColors[result.level]}`}>{result.level}</p>
              <p className="text-xs text-muted-foreground mt-2">de transformación digital</p>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="border-border/50 mb-12">
          <CardHeader>
            <CardTitle className="text-foreground">Mapa de competencias digitales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={result.areas}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Tu nivel" dataKey="value" stroke="hsl(196, 61%, 42%)" fill="hsl(196, 61%, 42%)" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Wins + Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Zap className="h-5 w-5 text-secondary" /> Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.quickWins.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-primary" /> Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-base px-8" onClick={() => navigate("/catalogo")}>
            Ver solución personalizada <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8" onClick={() => navigate("/catalogo")}>
            Agendar demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Resultados;
