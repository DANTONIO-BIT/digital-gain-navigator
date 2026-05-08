import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const BAR_DATA = [
  { label: "L", h: 42, color: "#A0CED9" },
  { label: "M", h: 61, color: "#A0CED9" },
  { label: "X", h: 38, color: "#A0CED9" },
  { label: "J", h: 75, color: "#A05730" },
  { label: "V", h: 88, color: "#A05730" },
  { label: "S", h: 52, color: "#A0CED9" },
  { label: "D", h: 28, color: "#E5DCA2" },
];

const FEED = [
  { name: "Cafetería Triana", amount: "+€340", type: "Nuevo pedido", time: "2m" },
  { name: "AutotalleresPaco", amount: "+€890", type: "Factura cobrada", time: "8m" },
  { name: "Clínica Nervión", amount: "+€1.200", type: "Contrato firmado", time: "14m" },
  { name: "Moda Macarena", amount: "+€220", type: "Nuevo cliente", time: "31m" },
  { name: "Bar El Pescaíto", amount: "+€460", type: "Reserva online", time: "1h" },
];

const useCountUp = (target: number, duration = 1.8, delay = 0.3) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val).toLocaleString("es-ES");
        }
      },
    });
  }, [target, duration, delay]);
  return ref;
};

const DashboardMock = () => {
  const barsRef = useRef<HTMLDivElement>(null);
  const [feedIdx, setFeedIdx] = useState(0);
  const revenueRef = useCountUp(24680, 2, 0.5);
  const clientsRef = useCountUp(47, 1.4, 0.7);
  const leadsRef = useCountUp(12, 1.2, 0.9);
  const retentionRef = useCountUp(89, 1.6, 0.6);

  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll<HTMLElement>(".bar-inner");
    gsap.fromTo(bars,
      { scaleY: 0, transformOrigin: "bottom" },
      { scaleY: 1, stagger: 0.07, duration: 0.55, ease: "power2.out", delay: 1 }
    );
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setFeedIdx((i) => (i + 1) % FEED.length), 3200);
    return () => clearInterval(iv);
  }, []);

  const visibleFeed = [...FEED.slice(feedIdx), ...FEED.slice(0, feedIdx)].slice(0, 4);

  return (
    <div className="w-full h-full bg-[#F9F7F3] text-[#1A1A1A] flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[#E8E4DC]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#A05730]" />
          <span className="text-[11px] font-semibold tracking-wide text-[#1A1A1A]">Panel de control</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] text-[#22C55E] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse inline-block" />
            EN VIVO
          </span>
          <span className="text-[9px] text-[#A09590] font-mono">Mayo 2026</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 border-b border-[#E8E4DC] bg-white">
        {[
          { label: "Ingresos mes", ref: revenueRef, pre: "€", suf: "", up: "+18%" },
          { label: "Clientes activos", ref: clientsRef, pre: "", suf: "", up: "+4" },
          { label: "Leads nuevos", ref: leadsRef, pre: "", suf: "", up: "esta semana" },
          { label: "Retención", ref: retentionRef, pre: "", suf: "%", up: "+3pts" },
        ].map((k, i) => (
          <div key={i} className={`px-3 py-2.5 ${i < 3 ? "border-r border-[#E8E4DC]" : ""}`}>
            <div className="text-[8px] uppercase tracking-widest text-[#A09590] mb-0.5">{k.label}</div>
            <div className="text-sm font-bold font-mono text-[#1A1A1A] leading-none">
              {k.pre}<span ref={k.ref}>0</span>{k.suf}
            </div>
            <div className="text-[8px] text-[#A05730] mt-0.5">{k.up}</div>
          </div>
        ))}
      </div>

      {/* Body: chart + feed */}
      <div className="flex flex-1 min-h-0 bg-[#F9F7F3]">
        {/* Chart */}
        <div className="flex-1 border-r border-[#E8E4DC] px-4 pt-3 pb-2 flex flex-col">
          <div className="text-[8px] uppercase tracking-widest text-[#A09590] mb-2">Ingresos semanales</div>
          <div ref={barsRef} className="flex-1 flex items-end gap-1">
            {BAR_DATA.map((b) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: 72 }}>
                  <div
                    className="bar-inner absolute bottom-0 left-0 right-0"
                    style={{ height: `${b.h}%`, backgroundColor: b.color }}
                  />
                </div>
                <span className="text-[7px] font-mono text-[#A09590]">{b.label}</span>
              </div>
            ))}
          </div>
          {/* Mini legend */}
          <div className="flex gap-3 mt-2">
            <span className="flex items-center gap-1 text-[7px] text-[#A09590]">
              <span className="w-2 h-1.5 inline-block" style={{ background: "#A05730" }} />Esta semana
            </span>
            <span className="flex items-center gap-1 text-[7px] text-[#A09590]">
              <span className="w-2 h-1.5 inline-block" style={{ background: "#A0CED9" }} />Anterior
            </span>
          </div>
        </div>

        {/* Feed */}
        <div className="w-44 px-2.5 pt-3 pb-2 flex flex-col gap-1.5 overflow-hidden">
          <div className="text-[8px] uppercase tracking-widest text-[#A09590] mb-1">Actividad</div>
          {visibleFeed.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="p-1.5 bg-white border border-[#E8E4DC] transition-all duration-500"
              style={{ borderLeftWidth: i === 0 ? 2 : 1, borderLeftColor: i === 0 ? "#A05730" : "#E8E4DC" }}
            >
              <div className="text-[8px] font-semibold truncate text-[#1A1A1A]">{item.name}</div>
              <div className="text-[7px] text-[#A09590] truncate">{item.type}</div>
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-[8px] font-mono font-bold text-[#22C55E]">{item.amount}</span>
                <span className="text-[7px] text-[#C5C2BE]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav tabs */}
      <div className="border-t border-[#E8E4DC] px-4 py-2 bg-white flex items-center justify-between">
        <div className="flex gap-3">
          {["CRM", "Facturas", "Clientes", "Campañas"].map((tab) => (
            <span
              key={tab}
              className="text-[8px] uppercase tracking-widest cursor-pointer"
              style={{
                color: tab === "CRM" ? "#A05730" : "#A09590",
                borderBottom: tab === "CRM" ? "1px solid #A05730" : "none",
                paddingBottom: 1,
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {tab}
            </span>
          ))}
        </div>
        <span className="text-[7px] font-mono text-[#C5C2BE]">DigiDot Partners</span>
      </div>
    </div>
  );
};

export default DashboardMock;
