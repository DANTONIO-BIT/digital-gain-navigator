import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const segments = [
  {
    id: "autonomo",
    label: "Autónomo",
    hook: "Para quien trabaja solo y quiere dedicar su tiempo a lo que realmente factura",
    services: [
      { title: "WEB DE CAPTACIÓN", price: "desde 800 €", desc: "Web profesional optimizada para que tus clientes te encuentren en Sevilla. Con ficha de Google optimizada incluida.", tag: "MÁS CONTRATADO" },
      { title: "AUTOMATIZACIÓN DE AGENDA", price: "desde 400 €", desc: "Sistema de reservas y recordatorios automático. Deja de gestionar citas por WhatsApp.", tag: null },
      { title: "PACK REDES SOCIALES", price: "250 €/mes", desc: "Estrategia + contenido mensual en Instagram y/o LinkedIn. Tú te olvidas, nosotros lo hacemos.", tag: null },
    ],
  },
  {
    id: "pyme",
    label: "PYME",
    hook: "Para empresas que quieren crecer sin añadir coste de estructura",
    services: [
      { title: "CRM + AUTOMATIZACIÓN DE VENTAS", price: "desde 1.200 €", desc: "Implementación y configuración de CRM adaptado a tu proceso de venta. Sin clientes perdidos.", tag: null },
      { title: "MARKETING DIGITAL LOCAL", price: "desde 600 €/mes", desc: "Campañas en Google y Meta orientadas a Sevilla. Reporting mensual con ROI claro.", tag: "MÁS CONTRATADO" },
      { title: "AUDITORÍA DIGITAL COMPLETA", price: "500 €", desc: "Radiografía completa de tu situación digital con hoja de ruta priorizada. Incluye informe ejecutivo.", tag: null },
      { title: "FORMACIÓN AL EQUIPO", price: "desde 300 €", desc: "Taller práctico para que tu equipo use bien las herramientas digitales que ya tienes.", tag: null },
    ],
  },
  {
    id: "restaurante",
    label: "Restaurante",
    hook: "Para que tu cocina se vea tanto como merece y los clientes vuelvan",
    services: [
      { title: "PRESENCIA ONLINE COMPLETA", price: "desde 900 €", desc: "Web con carta digital, fotos profesionales, Google My Business y TripAdvisor optimizados.", tag: "MÁS CONTRATADO" },
      { title: "SISTEMA DE RESERVAS ONLINE", price: "desde 350 €", desc: "Tu propio sistema sin comisiones de terceros. Gestiona mesas desde el móvil.", tag: null },
      { title: "FIDELIZACIÓN DE CLIENTES", price: "desde 200 €/mes", desc: "Email marketing y WhatsApp Business para que los clientes vuelvan y traigan a otros.", tag: null },
    ],
  },
];

const Servicios = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".srv-card", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".srv-card", start: "top 85%" },
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-void text-raw">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-24 pb-20">
        <div className="label-terra mb-3">Servicios</div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-2xl" style={{ letterSpacing: "-0.02em" }}>
          Precios claros.<br />Sin letra pequeña.
        </h1>
        <p className="text-sm mb-20" style={{ color: "#5A5A5A", maxWidth: 400 }}>
          Cada proyecto es diferente, pero creemos en la transparencia desde el primer momento.
        </p>

        <div className="flex flex-col gap-20">
          {segments.map((seg) => (
            <div key={seg.id}>
              <div className="border-l-2 pl-5 mb-10" style={{ borderColor: "#A05730" }}>
                <div className="label-sol mb-1">{seg.label}</div>
                <p className="text-base font-medium" style={{ color: "#E5DCA2" }}>{seg.hook}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-wire">
                {seg.services.map((s, i) => (
                  <div
                    key={s.title}
                    className="srv-card opacity-0 flex flex-col gap-4 p-7 border-b md:border-b-0 relative"
                    style={{
                      borderRight: i < seg.services.length - 1 ? "1px solid #2A2A2A" : "none",
                      borderBottom: "1px solid #2A2A2A",
                    }}
                  >
                    {s.tag && (
                      <span className="absolute top-4 right-4 mono-num text-[9px] uppercase tracking-widest px-2 py-0.5"
                        style={{ border: "1px solid #FFEE93", color: "#FFEE93" }}>
                        {s.tag}
                      </span>
                    )}
                    <h3 className="font-bold text-sm tracking-wide" style={{ color: "#F0EDE8" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "#5A5A5A" }}>{s.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#1A1A1A" }}>
                      <span className="mono-num font-bold text-sm" style={{ color: "#A05730" }}>{s.price}</span>
                      <Link to="/contacto" className="text-xs transition-colors duration-200"
                        style={{ color: "#3A3A3A" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#FFEE93")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#3A3A3A")}>
                        Contratar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border border-wire p-10 md:p-14" style={{ background: "#111111" }}>
          <div className="label-terra mb-4">¿No encuentras lo que necesitas?</div>
          <h3 className="text-3xl font-bold mb-4 leading-tight" style={{ letterSpacing: "-0.01em" }}>
            Proyectos a medida.<br />
            <span style={{ color: "#E5DCA2" }}>Sin plantillas genéricas.</span>
          </h3>
          <p className="text-sm mb-8" style={{ color: "#5A5A5A", maxWidth: 380 }}>
            Cuéntanos tu situación y te preparamos una propuesta en 48h. Sin compromiso.
          </p>
          <Link
            to="/diagnostico"
            className="inline-flex items-center gap-2 font-semibold text-sm px-8 py-3.5 text-raw transition-colors duration-200"
            style={{ background: "#A05730" }}
          >
            Empezar con el diagnóstico gratis →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Servicios;
