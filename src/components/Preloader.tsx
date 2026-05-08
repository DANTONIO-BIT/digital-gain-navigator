import { useEffect, useRef } from "react";
import gsap from "gsap";

const STATUSES = [
  "ANALIZANDO MERCADO...",
  "CARGANDO SOLUCIONES...",
  "PREPARANDO TU PANEL...",
  "LISTO.",
];

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef    = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Canvas node network ──────────────────────────────────
    const canvas = canvasRef.current!;
    const c      = canvas.getContext("2d")!;
    let raf: number;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    type Node = { x: number; y: number; vx: number; vy: number; s: number };
    const nodes: Node[] = Array.from({ length: 24 }, (_, i) => ({
      x:  i === 0 ? W / 2 : Math.random() * W,
      y:  i === 0 ? H / 2 : Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      s:  i < 6 ? 5 : 3,
    }));

    const drawCanvas = () => {
      c.clearRect(0, 0, W, H);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 190) {
            c.beginPath();
            c.moveTo(nodes[i].x, nodes[i].y);
            c.lineTo(nodes[j].x, nodes[j].y);
            c.strokeStyle = `rgba(160,87,48,${(1 - d / 190) * 0.22})`;
            c.lineWidth   = 0.8;
            c.stroke();
          }
        }
      }

      // Nodes (squares — brutalista)
      nodes.forEach((n, i) => {
        c.fillStyle = i < 3 ? "rgba(160,87,48,0.9)" : i < 6 ? "rgba(45,106,79,0.85)" : "rgba(50,50,50,0.8)";
        c.fillRect(n.x - n.s / 2, n.y - n.s / 2, n.s, n.s);
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      raf = requestAnimationFrame(drawCanvas);
    };
    drawCanvas();

    // ── GSAP sequence ────────────────────────────────────────
    const gCtx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      // Logo entrance
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Logomark inner square pulse
      tl.fromTo(
        ".pre-dot",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" },
        0.3
      );

      // Bracket corners stagger in
      tl.fromTo(
        ".pre-corner",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.3, ease: "power2.out" },
        0.5
      );

      // Status text cycle
      let si = 0;
      const iv = setInterval(() => {
        si = Math.min(si + 1, STATUSES.length - 1);
        if (statusRef.current) {
          gsap.to(statusRef.current, {
            opacity: 0, duration: 0.12,
            onComplete: () => {
              if (statusRef.current) statusRef.current.textContent = STATUSES[si];
              gsap.to(statusRef.current, { opacity: 1, duration: 0.12 });
            },
          });
        }
        if (si === STATUSES.length - 1) clearInterval(iv);
      }, 520);

      // Counter + bar fill
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate() {
          const v = Math.round(counter.val);
          if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, "0");
          if (fillRef.current)    fillRef.current.style.width = `${v}%`;
        },
      }, 0.25);

      // Exit — clip wipe up
      tl.to(wrapRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => {
          cancelAnimationFrame(raf);
          clearInterval(iv);
          onComplete();
        },
      }, "+=0.35");
    });

    return () => {
      cancelAnimationFrame(raf);
      gCtx.revert();
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ background: "#0F0F0F", clipPath: "inset(0 0 0% 0)" }}
    >
      {/* Node canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Scan line */}
      <div className="pre-scanline absolute left-0 right-0 h-px pointer-events-none" style={{ background: "rgba(160,87,48,0.12)" }} />

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div ref={logoRef} className="flex flex-col items-center gap-8 opacity-0">

          {/* Logomark — gradient border terra→musgo diagonal */}
          <div
            className="relative w-24 h-24 flex items-center justify-center"
            style={{
              border: "2px solid transparent",
              background:
                "linear-gradient(#0F0F0F, #0F0F0F) padding-box, " +
                "linear-gradient(135deg, #A05730 50%, #2D6A4F 50%) border-box",
            }}
          >
            {/* Inner dot — left half terra, right half musgo */}
            <div className="pre-dot flex w-6 h-6 overflow-hidden">
              <div className="flex-1 h-full" style={{ background: "#A05730" }} />
              <div className="flex-1 h-full" style={{ background: "#2D6A4F" }} />
            </div>

            {/* Corner brackets — TL+BR terra · TR+BL musgo */}
            <div className="pre-corner absolute -top-[5px] -left-[5px] w-3.5 h-3.5 border-t-2 border-l-2" style={{ borderColor: "#A05730" }} />
            <div className="pre-corner absolute -top-[5px] -right-[5px] w-3.5 h-3.5 border-t-2 border-r-2" style={{ borderColor: "#2D6A4F" }} />
            <div className="pre-corner absolute -bottom-[5px] -left-[5px] w-3.5 h-3.5 border-b-2 border-l-2" style={{ borderColor: "#2D6A4F" }} />
            <div className="pre-corner absolute -bottom-[5px] -right-[5px] w-3.5 h-3.5 border-b-2 border-r-2" style={{ borderColor: "#A05730" }} />

            {/* Grid lines inside */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "linear-gradient(#A05730 1px, transparent 1px), linear-gradient(90deg, #A05730 1px, transparent 1px)",
              backgroundSize: "12px 12px",
            }} />
          </div>

          {/* Brand name */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="font-bold text-3xl tracking-[0.18em]"
              style={{ color: "#F0EDE8", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.15em" }}
            >
              DIGI<span style={{ color: "#A05730" }}>DOT</span>
            </div>
            <div
              className="mono-num text-[9px] tracking-[0.3em]"
              style={{ color: "#3A3A3A" }}
            >
              PARTNERS · SEVILLA
            </div>
          </div>

          {/* Status line */}
          <div
            ref={statusRef}
            className="mono-num text-[9px] tracking-[0.18em]"
            style={{ color: "#5A5A5A" }}
          >
            INICIALIZANDO...
          </div>
        </div>
      </div>

      {/* Bottom — loading bar */}
      <div className="relative z-10 px-10 md:px-16 pb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="mono-num text-[9px] tracking-[0.2em]" style={{ color: "#2A2A2A" }}>
            DIGIDOT PARTNERS
          </span>
          <span
            ref={counterRef}
            className="mono-num text-xs font-bold"
            style={{ color: "#A05730" }}
          >
            000
          </span>
        </div>
        <div className="w-full relative" style={{ height: 1, background: "#2A2A2A" }}>
          <div
            ref={fillRef}
            className="absolute left-0 top-0 h-full w-0"
            style={{ background: "linear-gradient(90deg, #A05730, #2D6A4F)" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
