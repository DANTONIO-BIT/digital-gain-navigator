import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDiagnostic } from "@/context/DiagnosticContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, ArrowLeft } from "lucide-react";

const serviceNames: Record<string, { name: string; price: number }> = {
  "data-intelligence": { name: "Data Intelligence", price: 2500 },
  "automation": { name: "Automatización Inteligente", price: 1800 },
  "security": { name: "Privacidad & Compliance", price: 3200 },
  "full-transform": { name: "Transformación Digital 360°", price: 5900 },
};

const Contratar = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { addService } = useDiagnostic();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [form, setForm] = useState({ empresa: "", cif: "", contacto: "", email: "", telefono: "" });

  const service = serviceNames[serviceId || ""];
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Servicio no encontrado</p>
          <Button onClick={() => navigate("/catalogo")}>Ver catálogo</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    addService({
      id: serviceId!,
      name: service.name,
      price: service.price,
      status: "pendiente",
      progress: 0,
    });
    setStep("confirm");
  };

  const isValid = form.empresa && form.cif && form.email;

  if (step === "confirm") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border-border/50 text-center">
          <CardContent className="p-10">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Contratación completada!</h2>
            <p className="text-muted-foreground mb-2">{service.name}</p>
            <p className="text-sm text-muted-foreground mb-8">Te contactaremos en menos de 24h para iniciar la implementación.</p>
            <Button className="w-full" onClick={() => navigate("/dashboard")}>Ir a mi Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/catalogo")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
        </Button>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Contratar {service.name}</CardTitle>
            <p className="text-muted-foreground">{service.price.toLocaleString("es-ES")} €/mes</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="empresa">Nombre de empresa *</Label>
              <Input id="empresa" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Mi Empresa S.L." />
            </div>
            <div>
              <Label htmlFor="cif">CIF *</Label>
              <Input id="cif" value={form.cif} onChange={(e) => setForm({ ...form, cif: e.target.value })} placeholder="B12345678" />
            </div>
            <div>
              <Label htmlFor="contacto">Persona de contacto</Label>
              <Input id="contacto" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} placeholder="Nombre completo" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contacto@empresa.com" />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="+34 600 000 000" />
            </div>
            <Button className="w-full mt-4" disabled={!isValid} onClick={handleSubmit}>
              Confirmar contratación
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contratar;
