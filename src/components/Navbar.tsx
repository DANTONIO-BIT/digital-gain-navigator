import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

const LINKS = [
  { label: "Servicios", href: "/servicios" },
  { label: "Diagnóstico", href: "/diagnostico" },
  { label: "Contacto", href: "/contacto" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -64, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? "rgba(249,246,241,0.97)" : "#F9F6F1",
        borderColor: "#E0DAD3",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-12 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-5 h-5 border-2 flex items-center justify-center" style={{ borderColor: "#A05730" }}>
            <div className="w-1.5 h-1.5" style={{ background: "#A05730" }} />
          </div>
          <span className="font-bold text-sm tracking-wide" style={{ color: "#1A1A1A" }}>
            DIGI<span style={{ color: "#A05730" }}>DOT</span>
          </span>
          <span className="label" style={{ color: "#B0AAA4" }}>Partners · Sevilla</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="px-4 py-1.5 text-sm font-medium border transition-all duration-200"
              style={{
                color: location.pathname === l.href ? "#F0EDE8" : "#8A8580",
                borderColor: location.pathname === l.href ? "#A05730" : "transparent",
                background: location.pathname === l.href ? "#A05730" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== l.href) {
                  e.currentTarget.style.color = "#1A1A1A";
                  e.currentTarget.style.borderColor = "#E0DAD3";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== l.href) {
                  e.currentTarget.style.color = "#8A8580";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          aria-label="Menu"
        >
          <span className={`block w-5 h-[1.5px] bg-raw transition-all duration-300 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-raw transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-raw transition-all duration-300 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400 border-t"
        style={{
          maxHeight: open ? 200 : 0,
          borderColor: "#E0DAD3",
        }}
      >
        <div className="px-8 py-4 flex flex-col gap-1 bg-white">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="py-3 text-sm font-medium border-b"
              style={{ color: "#5A5A5A", borderColor: "#E0DAD3" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
