import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ── TYPES ──
interface State {
  agente: string;
  negocio: string;
  presupuesto: string;
  caso: string;
  nombre: string;
  email: string;
  empresa: string;
}

const INITIAL: State = {
  agente: "", negocio: "", presupuesto: "",
  caso: "", nombre: "", email: "", empresa: "",
};

const AGENT_OPTS = [
  { val: "Atención al cliente 24/7",  icon: "💬", name: "Atención al cliente",     desc: "Responde, cualifica y gestiona consultas 24/7" },
  { val: "Automatización interna",     icon: "⚙️", name: "Automatización",           desc: "Reportes, CRM, flujos y tareas repetitivas" },
  { val: "Contenido y marketing",      icon: "✍️", name: "Contenido / Marketing",    desc: "Posts, newsletters, copies a escala" },
  { val: "Agente de ventas / SDR",     icon: "📈", name: "Ventas / SDR",             desc: "Prospección, cualificación y seguimiento" },
];

const NEGOCIO_OPTS = [
  { val: "Autónomo / freelance",              icon: "🧑‍💻", name: "Autónomo / freelance",   desc: "Trabajo solo o con colaboradores puntuales" },
  { val: "Pequeña empresa (1–10 personas)",   icon: "🏪", name: "Pequeña empresa",         desc: "Equipo de hasta 10 personas" },
  { val: "PYME (10–50 personas)",             icon: "🏢", name: "PYME",                    desc: "Entre 10 y 50 personas" },
  { val: "Empresa (+50 personas)",            icon: "🏛️", name: "Empresa",                 desc: "Más de 50 personas" },
];

const PRESUPUESTO_OPTS = [
  { val: "Menos de 300 €",  num: "< 300 €",         desc: "Entrada / prueba piloto" },
  { val: "300 € – 600 €",   num: "300 – 600 €",     desc: "Solución completa · Plan Pro" },
  { val: "600 € – 1.200 €", num: "600 – 1.200 €",   desc: "Múltiples integraciones" },
  { val: "+ 1.200 €",       num: "+ 1.200 €",        desc: "Multi-agente · Empresa" },
];

const TOTAL = 6;

// ── STYLES (inline, zero Tailwind dependency for isolation) ──
const S = {
  lino:  "#F9F6F1", onyx: "#1A1A1A", terra: "#A05730", terra2: "#C4733E",
  musgo: "#2D6A4F", musgo2: "#3D7A5F", stone: "#E0DAD3", stone2: "#EDEAE4",
  mid:   "#6A6460", faint: "#B0AAA4", ghost: "#C0BBB5", paper: "#FFFFFF",
  dark:  "#0F0F0F",
};
const bd = `1px solid ${S.stone}`;

export default function AgentesFunnel() {
  const [step, setStep]   = useState(0);
  const [prev, setPrev]   = useState<number | null>(null);
  const [state, setState] = useState<State>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const bodyRef = useRef(document.body);

  // Lock body scroll — funnel is full-screen
  useEffect(() => {
    const body = bodyRef.current;
    const html = document.documentElement;
    const orig = { bodyOv: body.style.overflow, htmlOv: html.style.overflow };
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = orig.bodyOv;
      html.style.overflow = orig.htmlOv;
    };
  }, []);

  const goTo = (n: number) => {
    setPrev(step);
    setStep(n);
  };

  const set = (k: keyof State, v: string) =>
    setState(s => ({ ...s, [k]: v }));

  const progress = step === 0 ? 0 : Math.round((step / TOTAL) * 100);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await supabase.from("leads").insert({
      source: "agente",
      nombre: state.nombre,
      email: state.email,
      empresa: state.empresa || null,
      agente_tipo: state.agente,
      tipo_negocio: state.negocio,
      presupuesto: state.presupuesto,
      caso: state.caso,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError("No pudimos enviar tu solicitud. Prueba de nuevo en unos segundos.");
      return;
    }
    goTo(6);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: S.lino, fontFamily: "'Space Grotesk', sans-serif", color: S.onyx, overflow: "hidden" }}>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", height: "3.25rem", borderBottom: bd, flexShrink: 0 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: 18, height: 18, border: `2px solid ${S.terra}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 5, height: 5, background: S.terra }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em", color: S.onyx }}>
            DIGI<span style={{ color: S.terra }}>DOT</span> Partners
          </span>
        </a>
        {step > 0 && step < 6 && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: S.faint, letterSpacing: "0.1em" }}>
            {String(step).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
        )}
      </header>

      {/* Progress */}
      <div style={{ height: 2, background: S.stone2, flexShrink: 0, position: "relative" }}>
        <div style={{ height: "100%", background: S.terra, width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      {/* Stage */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <Step active={step === 0} dir={prev !== null && prev > 0 ? "in" : "neutral"}>
          <StepInner maxW={520} center>
            <Label terra>Agentes de IA · Entrega en 72 horas</Label>
            <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.12, marginBottom: "1rem" }}>
              Pide tu agente.<br />Lo entregamos<br />
              <span style={{ color: S.terra }}>en menos de 72 h.</span>
            </h1>
            <p style={{ fontSize: "0.9rem", color: S.mid, maxWidth: 360, margin: "0 auto 2.5rem" }}>
              2 minutos. Cuéntanos qué necesitas. Nosotros nos encargamos del resto.
            </p>
            <Btn onClick={() => goTo(1)} style={{ fontSize: "1rem", padding: "1.1rem 2.5rem", margin: "0 auto" }}>
              Empezar →
            </Btn>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: S.ghost, letterSpacing: "0.1em", marginTop: "1.25rem", textTransform: "uppercase" }}>
              Sin compromiso · Sin llamadas · Sin spam
            </p>
          </StepInner>
        </Step>

        {/* Step 1 — tipo de agente */}
        <Step active={step === 1}>
          <StepInner>
            <Label terra>Paso 01 — Tipo de agente</Label>
            <Q>¿Qué quieres que haga tu agente?</Q>
            <Sub>Elige la opción que más se acerque a tu necesidad.</Sub>
            <Grid cols={2}>
              {AGENT_OPTS.map(o => (
                <Opt key={o.val} selected={state.agente === o.val}
                  onClick={() => set("agente", o.val)}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{o.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{o.name}</div>
                    <div style={{ fontSize: "0.78rem", color: S.mid }}>{o.desc}</div>
                  </div>
                  <Check selected={state.agente === o.val} />
                </Opt>
              ))}
            </Grid>
            <Nav onBack={() => goTo(0)} onNext={() => goTo(2)} disabled={!state.agente} />
          </StepInner>
        </Step>

        {/* Step 2 — tipo de negocio */}
        <Step active={step === 2}>
          <StepInner>
            <Label terra>Paso 02 — Tu negocio</Label>
            <Q>¿Cómo es tu negocio?</Q>
            <Sub>Para dimensionar bien la solución.</Sub>
            <Grid cols={1}>
              {NEGOCIO_OPTS.map(o => (
                <Opt key={o.val} selected={state.negocio === o.val}
                  onClick={() => set("negocio", o.val)}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{o.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{o.name}</div>
                    <div style={{ fontSize: "0.78rem", color: S.mid }}>{o.desc}</div>
                  </div>
                  <Check selected={state.negocio === o.val} />
                </Opt>
              ))}
            </Grid>
            <Nav onBack={() => goTo(1)} onNext={() => goTo(3)} disabled={!state.negocio} />
          </StepInner>
        </Step>

        {/* Step 3 — presupuesto */}
        <Step active={step === 3}>
          <StepInner>
            <Label terra>Paso 03 — Inversión</Label>
            <Q>¿Cuánto quieres invertir?</Q>
            <Sub>Orientativo — te proponemos lo que más rinde para tu caso.</Sub>
            <Grid cols={2}>
              {PRESUPUESTO_OPTS.map(o => (
                <Opt key={o.val} selected={state.presupuesto === o.val}
                  onClick={() => set("presupuesto", o.val)}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "1.1rem", fontWeight: 700 }}>{o.num}</div>
                    <div style={{ fontSize: "0.78rem", color: S.mid, marginTop: "0.2rem" }}>{o.desc}</div>
                  </div>
                  <Check selected={state.presupuesto === o.val} />
                </Opt>
              ))}
            </Grid>
            <Nav onBack={() => goTo(2)} onNext={() => goTo(4)} disabled={!state.presupuesto} />
          </StepInner>
        </Step>

        {/* Step 4 — descripción */}
        <Step active={step === 4}>
          <StepInner>
            <Label terra>Paso 04 — Tu caso</Label>
            <Q>Cuéntanos qué necesitas</Q>
            <Sub>En dos líneas: qué hace tu negocio y qué quieres automatizar.</Sub>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: S.mid, display: "block", marginBottom: "0.4rem" }}>
                Descripción
              </label>
              <textarea
                value={state.caso}
                onChange={e => set("caso", e.target.value)}
                placeholder="Ej: Tengo una clínica dental en Sevilla. Quiero un agente que responda consultas por WhatsApp, gestione citas y envíe recordatorios automáticos..."
                style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem", color: S.onyx, background: S.paper, border: bd, padding: "0.875rem 1rem", outline: "none", resize: "none", width: "100%", minHeight: 110, borderRadius: 0 }}
                onFocus={e => (e.target.style.borderColor = S.terra)}
                onBlur={e => (e.target.style.borderColor = S.stone)}
              />
              <span style={{ fontSize: "0.72rem", color: S.faint }}>
                Mínimo 20 caracteres · Cuanto más detallas, mejor te podemos ayudar.
              </span>
            </div>
            <Nav onBack={() => goTo(3)} onNext={() => goTo(5)} disabled={state.caso.trim().length < 20} />
          </StepInner>
        </Step>

        {/* Step 5 — contacto */}
        <Step active={step === 5}>
          <StepInner>
            <Label terra>Paso 05 — Tus datos</Label>
            <Q>¿Cómo te contactamos?</Q>
            <Sub>Solo para enviarte la propuesta y el enlace de pago cuando cierremos.</Sub>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "0.5rem" }}>
              {([
                { key: "nombre" as const,  label: "Nombre",  type: "text",  ph: "Tu nombre" },
                { key: "email" as const,   label: "Email",   type: "email", ph: "tu@email.com" },
                { key: "empresa" as const, label: "Empresa", type: "text",  ph: "Nombre de tu empresa (opcional)" },
              ]).map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: S.mid, display: "block", marginBottom: "0.35rem" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={state[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.ph}
                    style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.95rem", color: S.onyx, background: S.paper, border: bd, padding: "0.875rem 1rem", outline: "none", width: "100%", borderRadius: 0 }}
                    onFocus={e => (e.target.style.borderColor = S.terra)}
                    onBlur={e => (e.target.style.borderColor = S.stone)}
                  />
                </div>
              ))}
            </div>
            {submitError && <p style={{ color: "#C0392B", fontSize: "0.8rem", marginBottom: "0.75rem" }}>{submitError}</p>}
            <Nav
              onBack={() => goTo(4)}
              onNext={handleSubmit}
              disabled={submitting || state.nombre.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)}
              nextLabel={submitting ? "Enviando…" : "Enviar solicitud →"}
              nextColor={S.musgo}
              nextHover={S.musgo2}
            />
          </StepInner>
        </Step>

        {/* Step 6 — confirmación */}
        <Step active={step === 6}>
          <StepInner>
            <div style={{ width: 52, height: 52, border: `2px solid ${S.terra}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: "1.5rem" }}>✓</div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Solicitud recibida.
            </h2>
            <p style={{ fontSize: "0.95rem", color: S.mid, lineHeight: 1.6, maxWidth: 440, marginBottom: "2rem" }}>
              Te respondemos en menos de 2 horas, <strong>{state.nombre}</strong>.<br />
              Recibirás la propuesta y el enlace de pago en <strong>{state.email}</strong>.
            </p>
            <div style={{ borderLeft: `2px solid ${S.terra}`, paddingLeft: "1.25rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                "Revisamos tu caso en detalle",
                "Te enviamos una propuesta por email",
                "Cuando aceptes, recibes el enlace de pago",
                "Empezamos a construir · Entrega en 72h",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "0.6rem", fontSize: "0.875rem", color: S.mid }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: S.terra, flexShrink: 0, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </div>
              ))}
            </div>
            {/* Summary */}
            <div style={{ border: bd, background: S.paper }}>
              {[
                { k: "Agente",      v: state.agente },
                { k: "Negocio",     v: state.negocio },
                { k: "Presupuesto", v: state.presupuesto },
                { k: "Descripción", v: state.caso.length > 80 ? state.caso.slice(0, 80) + "…" : state.caso },
              ].map((r, i, arr) => (
                <div key={r.k} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", padding: "0.875rem 1.25rem", borderBottom: i < arr.length - 1 ? bd : "none" }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: S.faint, flexShrink: 0, minWidth: 100, paddingTop: 2 }}>{r.k}</span>
                  <span style={{ fontWeight: 500, color: S.onyx, textAlign: "right", fontSize: "0.875rem", lineHeight: 1.4 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </StepInner>
        </Step>
      </div>

      {/* Footer */}
      <div style={{ borderTop: bd, padding: "0.6rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: S.ghost }}>
          DigiDot Partners · Sevilla
        </p>
        {step === 6 && (
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", color: S.ghost }}>
            {state.email}
          </p>
        )}
      </div>
    </div>
  );
}

// ── SUB-COMPONENTS ──

function Step({ active, children }: { active: boolean; dir?: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem",
      opacity: active ? 1 : 0,
      pointerEvents: active ? "all" : "none",
      transform: active ? "translateX(0)" : "translateX(40px)",
      transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      overflowY: "auto",
    }}>
      {children}
    </div>
  );
}

function StepInner({ children, maxW = 640, center = false }: { children: React.ReactNode; maxW?: number; center?: boolean }) {
  return (
    <div style={{ width: "100%", maxWidth: maxW, margin: "0 auto", textAlign: center ? "center" : "left" }}>
      {children}
    </div>
  );
}

function Label({ children, terra }: { children: React.ReactNode; terra?: boolean }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: terra ? "#A05730" : "#C0BBB5", marginBottom: "0.75rem" }}>
      {children}
    </div>
  );
}

function Q({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.5rem" }}>{children}</h2>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "0.875rem", color: "#6A6460", marginBottom: "1.75rem" }}>{children}</p>;
}

function Grid({ children, cols }: { children: React.ReactNode; cols: 1 | 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: cols === 2 ? "1fr 1fr" : "1fr", gap: "0.625rem", marginBottom: "0.25rem" }}>
      {children}
    </div>
  );
}

function Opt({ children, selected, onClick }: { children: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? `1px solid #A05730` : "1px solid #E0DAD3",
        background: selected ? "rgba(160,87,48,0.06)" : "#FFFFFF",
        padding: "1.1rem 1.25rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        transition: "border-color 0.18s, background 0.18s",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}

function Check({ selected }: { selected: boolean }) {
  return (
    <div style={{
      marginLeft: "auto", flexShrink: 0,
      width: 18, height: 18,
      border: selected ? `1px solid #A05730` : "1px solid #E0DAD3",
      background: selected ? "#A05730" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.65rem",
      color: selected ? "#F9F6F1" : "transparent",
      marginTop: 1,
      transition: "all 0.18s",
    }}>
      ✓
    </div>
  );
}

function Btn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: hover ? "#C4733E" : "#A05730", color: "#F9F6F1", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em", padding: "0.875rem 1.75rem", border: "none", cursor: "pointer", transition: "background 0.18s", ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  );
}

function Nav({
  onBack, onNext, disabled, nextLabel = "Continuar →",
  nextColor = "#A05730", nextHover = "#C4733E",
}: {
  onBack: () => void;
  onNext: () => void;
  disabled: boolean;
  nextLabel?: string;
  nextColor?: string;
  nextHover?: string;
}) {
  const [hoverBack, setHoverBack] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);

  return (
    <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "1px solid #E0DAD3", color: hoverBack ? "#1A1A1A" : "#6A6460", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.875rem", fontWeight: 600, padding: "0.875rem 1.25rem", cursor: "pointer", transition: "all 0.18s", borderColor: hoverBack ? "#1A1A1A" : "#E0DAD3" }}
        onMouseEnter={() => setHoverBack(true)}
        onMouseLeave={() => setHoverBack(false)}
      >
        ← Volver
      </button>
      <button
        onClick={onNext}
        disabled={disabled}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: disabled ? "#E0DAD3" : hoverNext ? nextHover : nextColor, color: disabled ? "#B0AAA4" : "#F9F6F1", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.04em", padding: "0.875rem 1.75rem", border: "none", cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.18s" }}
        onMouseEnter={() => !disabled && setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
      >
        {nextLabel}
      </button>
    </div>
  );
}
