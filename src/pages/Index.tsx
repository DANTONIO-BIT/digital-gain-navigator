import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Shield, Zap, TrendingUp, CheckCircle, ArrowRight, Star, Database, Brain, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Digital Lab</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate("/diagnostico")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Diagnóstico</button>
            <button onClick={() => navigate("/catalogo")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Servicios</button>
            <button onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button>
          </div>
          <Button onClick={() => navigate("/diagnostico")} size="sm">Evaluar mi nivel</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-6 text-sm text-accent-foreground">
            <Lock className="h-3.5 w-3.5" />
            IA local · Privacidad 100%
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            ¿Cuánto está perdiendo tu empresa por{" "}
            <span className="text-primary">no aprovechar sus datos</span>?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Descubre tu nivel de madurez digital, detecta pérdidas invisibles y recibe un plan de acción personalizado con IA local y automatización.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 py-6" onClick={() => navigate("/diagnostico")}>
              Evaluar mi nivel digital <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6" onClick={() => navigate("/catalogo")}>
              Ver servicios
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Gratis · 3 minutos · Sin registro</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Soluciones de transformación digital</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Automatiza, protege y optimiza tu negocio con IA que se ejecuta en tu infraestructura.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Database, title: "Data Intelligence", desc: "Convierte tus datos dispersos en insights accionables. Dashboards en tiempo real y predicciones con IA local." },
              { icon: Zap, title: "Automatización Inteligente", desc: "Elimina tareas repetitivas. Workflows automáticos que ahorran +20h/semana a tu equipo." },
              { icon: Shield, title: "Privacidad & Compliance", desc: "IA que se ejecuta en tu servidor. Cumplimiento RGPD total sin enviar datos a terceros." },
            ].map((s, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">¿Por qué Digital Lab?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, title: "+35% eficiencia", desc: "Resultados medibles desde el primer mes" },
              { icon: Lock, title: "100% privado", desc: "Tus datos nunca salen de tu infraestructura" },
              { icon: BarChart3, title: "ROI en 90 días", desc: "Retorno de inversión garantizado" },
              { icon: CheckCircle, title: "Sin fricciones", desc: "Integración con tus herramientas actuales" },
            ].map((b, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "María García", role: "CEO, TechPyme", quote: "Redujimos un 40% los costes operativos en 3 meses. El diagnóstico fue revelador." },
              { name: "Carlos López", role: "CTO, DataFlow", quote: "La IA local nos dio tranquilidad total con RGPD. Ahora automatizamos todo." },
              { name: "Ana Martín", role: "COO, SmartRetail", quote: "El ROI fue inmediato. Detectamos pérdidas que ni sabíamos que existían." },
            ].map((t, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">¿Listo para descubrir tu potencial digital?</h2>
          <p className="text-muted-foreground mb-8">Haz el diagnóstico gratuito y recibe un informe personalizado en 3 minutos.</p>
          <Button size="lg" className="text-base px-8 py-6" onClick={() => navigate("/diagnostico")}>
            Empezar diagnóstico gratuito <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Digital Lab</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Digital Lab. IA local, privacidad total.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
