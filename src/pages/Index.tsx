import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DashboardMock from "@/components/DashboardMock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

const TICKER = [
  "73% de PYMEs en España no tienen CRM",
  "€4.200 perdidos al mes en gestiones manuales",
  "1 de cada 2 restaurantes cierra en 2 años",
  "Los autónomos pierden 11h/semana en admin",
  "Solo el 22% del comercio local tiene web funcional",
  "El 64% de PYMEs desconfía de consultoras externas",
];

const PAINS = [
  {
    segment: "Si eres autónomo",
    num: "01",
    items: [
      "Pierdes horas en facturar, gestionar y responder",
      "No tienes web o la que tienes no convierte",
      "Captas clientes por recomendación y ya",
      "Las redes son una pérdida de tiempo sin estrategia",
    ],
    cta: "Quiero más clientes y menos gestión",
  },
  {
    segment: "Si tienes una PYME",
    num: "02",
    items: [
      "Sin datos reales para tomar decisiones",
      "Marketing que gasta sin retorno medible",
      "Tu equipo trabaja sin herramientas coordinadas",
      "Tu competencia digitalizada te está comiendo terreno",
    ],
    cta: "Quiero digitalizar mi empresa",
  },
  {
    segment: "Si tienes un restaurante",
    num: "03",
    items: [
      "Gestionas reservas por teléfono y WhatsApp",
      "No tienes carta digital ni ficha Google optimizada",
      "Los clientes no vuelven — no hay fidelización",
      "Tu competencia se ve mejor online aunque tú cocines mejor",
    ],
    cta: "Quiero que se llene mi restaurante",
  },
];

const COMPARE = [
  { left: "Paquete básico / medio / premium",      right: "Solución diseñada para tu negocio" },
  { left: "Precio fijo sin conocerte",              right: "Presupuesto tras analizarte en detalle" },
  { left: "Misma estrategia para todos",            right: "Plan basado en tu diagnóstico real" },
  { left: "Asesoran y desaparecen",                right: "Ejecutamos contigo, paso a paso" },
];

const SERVICES = [
  { num: "01", name: "WEB A MEDIDA",                   price: "desde 800 €",    tag: null },
  { num: "02", name: "CRM PERSONALIZADO",              price: "desde 1.200 €",  tag: "MÁS CONTRATADO" },
  { num: "03", name: "AUTOMATIZACIÓN DE PROCESOS",     price: "desde 400 €",    tag: null },
  { num: "04", name: "MARKETING LOCAL SEVILLA",        price: "desde 600 €/mes",tag: null },
  { num: "05", name: "PRESENCIA DIGITAL COMPLETA",     price: "desde 900 €",    tag: "RESTAURANTES" },
  { num: "06", name: "AUDITORÍA DIGITAL",              price: "500 €",          tag: null },
];

const STEPS = [
  { cmd: "$ diagnostico --free",    out: "Analizamos tu situación en 10 min. Sin compromiso." },
  { cmd: "$ estrategia --a-medida", out: "Un plan para TU negocio. No usamos plantillas." },
  { cmd: "$ ejecutar --contigo",    out: "Implementamos juntos. No solo asesoramos." },
  { cmd: "$ resultados --medibles", out: "Métricas reales. Si no funciona, lo ajustamos." },
];

const BD = "1px solid #E0DAD3";

const Index = () => {
  const heroRef    = useRef<HTMLDivElement>(null);
  const h1Ref      = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const dashRef    = useRef<HTMLDivElement>(null);
  const painRef    = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const servRef    = useRef<HTMLDivElement>(null);
  const stepsRef   = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(h1Ref.current,      { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(heroSubRef.current,  { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .fromTo(dashRef.current,     { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.5");

      gsap.fromTo(".pain-col", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: painRef.current, start: "top 75%" },
      });

      gsap.fromTo(".compare-row", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: compareRef.current, start: "top 75%" },
      });

      gsap.fromTo(".srv-row", { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: servRef.current, start: "top 75%" },
      });

      gsap.fromTo(".step-line", { opacity: 0, y: 15 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.5,
        scrollTrigger: { trigger: stepsRef.current, start: "top 78%" },
      });

      gsap.fromTo(ctaRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ctaRef.current, start: "top 80%" },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen" style={{ background: "#F9F6F1", color: "#1A1A1A" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col pt-16" style={{ borderBottom: BD }}>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] max-w-[1400px] mx-auto w-full">

          {/* Left */}
          <div className="flex flex-col justify-center px-8 md:px-12 py-16" style={{ borderRight: BD }}>
            <div className="label-terra mb-6">Sevilla · España · Consultoría digital</div>

            <h1
              ref={h1Ref}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] mb-8 opacity-0"
              style={{ letterSpacing: "-0.02em", color: "#1A1A1A" }}
            >
              Las soluciones<br />
              genéricas no funcionan.<br />
              <span style={{ color: "#A05730" }}>Construimos LAS TUYAS.</span>
            </h1>

            <div ref={heroSubRef} className="opacity-0">
              <p className="text-base leading-relaxed mb-5 max-w-md" style={{ color: "#6A6460" }}>
                No somos otra consultoría. Somos tu socio de transformación digital.
                Construimos soluciones a medida, paso a paso, con la cercanía que las grandes no pueden ofrecer.
              </p>
              <p className="font-mono text-sm mb-8 max-w-md" style={{ color: "#A05730", opacity: 0.8, letterSpacing: "0.01em" }}>
                Tu transformación. Tu ritmo. Tu solución.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/diagnostico"
                  className="inline-flex items-center justify-center gap-2 text-raw px-7 py-3.5 font-semibold text-sm tracking-wide transition-colors duration-200"
                  style={{ background: "#A05730" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#C4733E")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#A05730")}
                >
                  Diagnóstico gratuito →
                </Link>
<Link
                  to="/servicios"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-sm tracking-wide transition-all duration-200"
                  style={{ background: "#2D6A4F", color: "#F0EDE8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#3D7A5F")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#2D6A4F")}
                >
                  Ver servicios y precios
                </Link>
              </div>

              <div className="flex items-center gap-3 text-xs" style={{ color: "#B0AAA4" }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#A05730" }} />
                  47 negocios en Sevilla
                </span>
                <span>·</span>
                <span>10 min · Sin registro · Sin spam</span>
              </div>
            </div>
          </div>

          {/* Right — Dashboard */}
          <div
            ref={dashRef}
            className="relative opacity-0 overflow-hidden"
            style={{ minHeight: 520, background: "#EDEAE4" }}
          >
            <div
              className="flex items-center gap-1.5 px-4 py-3"
              style={{ borderBottom: "1px solid #D4CFC8", background: "#E6E1D8" }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4CFC8" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4CFC8" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A05730" }} />
              <div className="flex-1 mx-4 h-5 flex items-center px-2" style={{ background: "#D4CFC8" }}>
                <span className="mono-num text-[9px]" style={{ color: "#8A8580" }}>app.digidotpartners.es/panel</span>
              </div>
            </div>
            <div className="absolute inset-0 top-[37px]">
              <DashboardMock />
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="overflow-hidden py-3" style={{ background: "#A05730" }}>
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="mono-num text-xs uppercase tracking-widest px-8 shrink-0" style={{ color: "rgba(240,237,232,0.9)" }}>
              {t} <span className="mx-2" style={{ color: "#FFEE93" }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PAIN ── */}
      <section ref={painRef} className="bg-white" style={{ borderBottom: BD }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="px-8 md:px-12 py-12" style={{ borderBottom: BD }}>
            <div className="label-terra mb-3">El problema</div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ letterSpacing: "-0.02em", color: "#1A1A1A" }}>
              ¿Te suena alguno de estos?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {PAINS.map((p, idx) => (
              <div
                key={p.num}
                className="pain-col p-8 md:p-10 flex flex-col gap-6 opacity-0"
                style={{ borderRight: idx < 2 ? BD : "none" }}
              >
                <div className="flex items-start justify-between">
                  <span className="mono-num text-4xl font-bold leading-none" style={{ color: "#E8E3DC" }}>{p.num}</span>
                  <span className="label-terra">{p.segment}</span>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-snug" style={{ color: "#6A6460" }}>
                      <span style={{ color: "#A05730", marginTop: 3, flexShrink: 0 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-6" style={{ borderTop: BD }}>
                  <Link
                    to="/diagnostico"
                    className="text-sm font-semibold hover:underline underline-offset-4 transition-all"
                    style={{ color: "#A05730" }}
                  >
                    {p.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERSONALIZACIÓN ── */}
      <section ref={compareRef} style={{ borderBottom: BD }}>
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <div
            className="px-8 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0"
            style={{ borderBottom: BD }}
          >
            <div className="lg:pr-16">
              <div className="label-terra mb-4">Por qué el diagnóstico</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: "-0.02em", color: "#1A1A1A" }}>
                Tu negocio es único.<br />
                <span style={{ color: "#A05730" }}>Tu solución también.</span>
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#6A6460" }}>
                No vendemos paquetes predeterminados. El diagnóstico no es un formulario —
                es el primer paso de tu propuesta personalizada. Analizamos tu situación real
                y construimos un plan exactamente para ti.
              </p>
            </div>
<div
              className="lg:pl-16 flex flex-col justify-center"
              style={{ borderLeft: BD }}
            >
              <Link
                to="/diagnostico"
                className="inline-flex items-center justify-center gap-2 text-raw px-8 py-4 font-bold text-sm tracking-wide transition-colors duration-200 w-full lg:w-fit"
                style={{ background: "#A05730" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#C4733E")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#A05730")}
              >
                Hacer mi diagnóstico gratuito →
              </Link>
              <p className="text-xs mt-3" style={{ color: "#B0AAA4" }}>
                10 min · Sin compromiso · Informe personalizado
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="px-8 md:px-12 py-10 bg-white" style={{ borderRight: BD }}>
              <div className="label mb-6" style={{ color: "#C0BBB5" }}>Otras consultoras</div>
              <ul className="flex flex-col gap-5">
                {COMPARE.map((c, i) => (
                  <li key={i} className="compare-row flex items-start gap-3 text-sm opacity-0" style={{ color: "#C0BBB5" }}>
                    <span className="shrink-0 mt-0.5" style={{ color: "#D8D2CC" }}>✕</span>
                    {c.left}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 md:px-12 py-10" style={{ background: "#F9F6F1" }}>
              <div className="label-terra mb-6">DigiDot Partners</div>
              <ul className="flex flex-col gap-5">
                {COMPARE.map((c, i) => (
                  <li key={i} className="compare-row flex items-start gap-3 text-sm opacity-0" style={{ color: "#1A1A1A" }}>
                    <span className="shrink-0 mt-0.5 font-bold" style={{ color: "#A05730" }}>✓</span>
                    {c.right}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section ref={servRef} className="bg-white" style={{ borderBottom: BD }}>
        <div className="max-w-[1400px] mx-auto">
          <div
            className="px-8 md:px-12 py-12 flex items-end justify-between flex-wrap gap-4"
            style={{ borderBottom: BD }}
          >
            <div>
              <div className="label-terra mb-3">Servicios y precios</div>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ letterSpacing: "-0.02em", color: "#1A1A1A" }}>
                Precios claros.<br />Sin letra pequeña.
              </h2>
            </div>
            <Link
              to="/servicios"
              className="text-xs font-mono uppercase tracking-widest hover:underline underline-offset-2 transition-colors"
              style={{ color: "#2D6A4F" }}
            >
              Ver todos →
            </Link>
          </div>

          <div>
            {SERVICES.map((s) => (
              <Link
                key={s.num}
                to="/servicios"
                className="srv-row group flex items-center justify-between px-8 md:px-12 py-5 opacity-0 transition-colors duration-200"
                style={{ borderBottom: BD }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F9F6F1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <span className="mono-num text-xs shrink-0" style={{ color: "#C0BBB5" }}>{s.num}</span>
                  <span className="font-bold text-sm md:text-base tracking-wide truncate" style={{ color: "#1A1A1A" }}>
                    {s.name}
                  </span>
                  {s.tag && (
                    <span
                      className="shrink-0 px-2 py-0.5 text-[9px] uppercase tracking-widest font-mono"
                      style={{ border: "1px solid #A05730", color: "#A05730" }}
                    >
                      {s.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="mono-num text-sm font-bold" style={{ color: "#A05730" }}>{s.price}</span>
                  <span className="transition-all duration-200 group-hover:translate-x-1" style={{ color: "#C0BBB5" }}>→</span>
                </div>
              </Link>
            ))}
          </div>

          <p className="px-8 md:px-12 py-4 text-xs" style={{ color: "#B0AAA4", borderTop: BD }}>
            * Precios orientativos. Tras el diagnóstico gratuito te proponemos exactamente lo que necesitas — sin más ni menos.
          </p>
        </div>
      </section>

      {/* ── PROCESS (dark island) ── */}
      <section ref={stepsRef} style={{ background: "#0F0F0F" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-20">
          <div className="label-terra mb-3">Cómo trabajamos</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-raw" style={{ letterSpacing: "-0.02em" }}>
            Cuatro pasos. Sin complicaciones.
          </h2>

          <div className="max-w-2xl flex flex-col">
            {STEPS.map((s, i) => (
              <div key={i} className="step-line opacity-0">
                <div
                  className="flex items-start gap-0 py-5"
                  style={{ borderBottom: i < STEPS.length - 1 ? "1px solid #2A2A2A" : "none" }}
                >
                  <div className="w-8 shrink-0 mt-1">
                    <span className="mono-num text-xs" style={{ color: "#2A2A2A" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <code className="mono-num text-sm font-bold" style={{ color: "#FFEE93" }}>{s.cmd}</code>
                    <p className="text-sm leading-relaxed" style={{ color: "#E5DCA2" }}>
                      <span style={{ color: "#A05730" }}>›</span> {s.out}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef} className="opacity-0">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Terra — diagnóstico */}
            <div
              className="px-8 md:px-12 py-16 lg:py-24 flex flex-col justify-between gap-8"
              style={{ background: "#A05730", borderRight: "1px solid #7A3F22" }}
            >
              <div>
                <div className="label mb-4" style={{ color: "rgba(240,237,232,0.45)" }}>Diagnóstico gratuito</div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-raw" style={{ letterSpacing: "-0.02em" }}>
                  10 minutos.<br />
                  Un informe.<br />
                  Cero excusas.
                </h2>
              </div>
              <Link
                to="/diagnostico"
                className="inline-flex items-center gap-3 px-8 py-4 font-bold text-sm tracking-wide transition-colors duration-200 w-fit"
                style={{ background: "#0F0F0F", color: "#F0EDE8" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1A1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0F0F0F")}
              >
                Empezar ahora →
              </Link>
            </div>

            {/* Musgo — contacto */}
            <div
              className="px-8 md:px-12 py-16 lg:py-24 flex flex-col justify-between gap-8"
              style={{ background: "#2D6A4F" }}
            >
              <div>
                <div className="label mb-4" style={{ color: "rgba(240,237,232,0.45)" }}>O si prefieres hablar primero</div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-raw" style={{ letterSpacing: "-0.02em" }}>
                  Sin llamadas<br />de ventas.<br />
                  <span style={{ color: "rgba(240,237,232,0.5)" }}>Prometido.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-3 border px-8 py-4 font-bold text-sm tracking-wide transition-all duration-200 w-fit text-raw"
                  style={{ borderColor: "rgba(240,237,232,0.35)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,237,232,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Escribirnos →
                </Link>
                <p className="text-xs" style={{ color: "rgba(240,237,232,0.35)" }}>
                  Respuesta en menos de 24 horas. No te llamamos si no quieres.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
