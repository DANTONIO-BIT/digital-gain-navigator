import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

const Contacto = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", negocio: "", telefono: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    const { error } = await supabase.from("leads").insert({
      source: "contacto",
      nombre: form.nombre,
      telefono: form.telefono || null,
      tipo_negocio: form.negocio,
      mensaje: form.mensaje,
    });
    setSending(false);
    if (error) {
      setError("No pudimos enviar tu mensaje. Prueba de nuevo en unos segundos.");
      return;
    }
    setSent(true);
  };

  const inputStyle = {
    background: "transparent",
    border: "1px solid #2A2A2A",
    color: "#F0EDE8",
    padding: "12px 16px",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div className="min-h-screen bg-void text-raw">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <div className="label-terra mb-3">Contacto</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Hablemos sin<br />rodeos.
            </h1>
            <p className="text-sm leading-relaxed mb-12" style={{ color: "#5A5A5A", maxWidth: 380 }}>
              Sin formularios de ventas ni llamadas de presión. Te escuchamos, te decimos con honestidad
              qué podemos hacer por tu negocio. Si no podemos ayudarte, te lo decimos también.
            </p>

            <div className="flex flex-col gap-6 border-l-2 pl-6" style={{ borderColor: "#2A2A2A" }}>
              <div>
                <div className="label mb-1">Email</div>
                <a href="mailto:hola@digitallabsevilla.com" className="text-sm transition-colors duration-200" style={{ color: "#E5DCA2" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#A05730")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#E5DCA2")}>
                  hola@digitallabsevilla.com
                </a>
              </div>
              <div>
                <div className="label mb-1">Teléfono</div>
                <a href="tel:+34600000000" className="text-sm transition-colors duration-200" style={{ color: "#E5DCA2" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#A05730")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#E5DCA2")}>
                  +34 600 000 000
                </a>
              </div>
              <div>
                <div className="label mb-1">Ubicación</div>
                <p className="text-sm" style={{ color: "#E5DCA2" }}>Sevilla, España</p>
              </div>
            </div>

            <div className="mt-14 pt-8 border-t" style={{ borderColor: "#1A1A1A" }}>
              <div className="label mb-2">Tiempo de respuesta</div>
              <div className="mono-num text-3xl font-bold" style={{ color: "#A05730" }}>{"< 24 horas"}</div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            {sent ? (
              <div className="flex flex-col gap-6 py-16">
                <div className="w-12 h-12 border-2 flex items-center justify-center font-bold text-lg" style={{ borderColor: "#A05730", color: "#A05730" }}>
                  ✓
                </div>
                <h2 className="text-3xl font-bold" style={{ letterSpacing: "-0.01em" }}>Mensaje recibido.</h2>
                <p className="text-sm" style={{ color: "#5A5A5A" }}>
                  Te contactamos antes de 24 horas. Mientras tanto, puedes hacer el diagnóstico gratuito.
                </p>
                <a href="/diagnostico" className="text-sm font-semibold underline underline-offset-4" style={{ color: "#FFEE93" }}>
                  Ir al diagnóstico →
                </a>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="label">Nombre *</label>
                    <input name="nombre" required value={form.nombre} onChange={handleChange}
                      style={inputStyle} placeholder="Tu nombre"
                      onFocus={(e) => (e.target.style.borderColor = "#A05730")}
                      onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="label">Teléfono</label>
                    <input name="telefono" value={form.telefono} onChange={handleChange}
                      style={inputStyle} placeholder="600 000 000"
                      onFocus={(e) => (e.target.style.borderColor = "#A05730")}
                      onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="label">Tipo de negocio *</label>
                  <select name="negocio" required value={form.negocio} onChange={handleChange}
                    style={{ ...inputStyle, background: "#161616" }}
                    onFocus={(e) => (e.target.style.borderColor = "#A05730")}
                    onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")}>
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="autonomo">Autónomo</option>
                    <option value="pyme">PYME</option>
                    <option value="restaurante">Restaurante / Hostelería</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="label">¿Cuál es tu principal reto? *</label>
                  <textarea name="mensaje" required rows={5} value={form.mensaje} onChange={handleChange}
                    style={{ ...inputStyle, resize: "none" }}
                    placeholder="Cuéntanos brevemente qué problema quieres resolver..."
                    onFocus={(e) => (e.target.style.borderColor = "#A05730")}
                    onBlur={(e) => (e.target.style.borderColor = "#2A2A2A")} />
                </div>

                {error && <p className="text-sm" style={{ color: "#FF6B6B" }}>{error}</p>}

                <button type="submit" disabled={sending}
                  className="w-full py-4 font-semibold text-sm tracking-wide text-raw transition-colors duration-200"
                  style={{ background: "#A05730", opacity: sending ? 0.7 : 1, cursor: sending ? "wait" : "pointer" }}
                  onMouseEnter={(e) => !sending && (e.currentTarget.style.background = "#C4733E")}
                  onMouseLeave={(e) => !sending && (e.currentTarget.style.background = "#A05730")}>
                  {sending ? "Enviando…" : "Enviar mensaje →"}
                </button>

                <p className="text-xs text-center" style={{ color: "#3A3A3A" }}>
                  Sin spam. Sin compromisos. Solo una conversación honesta.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contacto;
