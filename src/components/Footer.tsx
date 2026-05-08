import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t" style={{ borderColor: "#2A2A2A", background: "#0F0F0F" }}>
    <div className="max-w-[1400px] mx-auto">
      {/* Main */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "#2A2A2A" }}>
        <div className="px-8 md:px-12 py-12">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-5 h-5 border-2 flex items-center justify-center" style={{ borderColor: "#A05730" }}>
              <div className="w-1.5 h-1.5 bg-terra" style={{ background: "#A05730" }} />
            </div>
            <span className="font-bold text-sm tracking-wide text-raw">
              DIGI<span style={{ color: "#A05730" }}>DOT</span> PARTNERS
            </span>
          </div>
          <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#5A5A5A" }}>
            Consultoría digital para autónomos, PYMEs y restaurantes en Sevilla.
            Resultados reales. Sin humo.
          </p>
        </div>

        <div className="px-8 md:px-12 py-12">
          <div className="label mb-4">Navegación</div>
          <ul className="flex flex-col gap-2">
            {[
              { label: "Inicio", href: "/" },
              { label: "Servicios y precios", href: "/servicios" },
              { label: "Diagnóstico gratuito", href: "/diagnostico" },
              { label: "Contacto", href: "/contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#5A5A5A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#A05730")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5A5A5A")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-8 md:px-12 py-12">
          <div className="label mb-4">Contacto directo</div>
          <ul className="flex flex-col gap-3 text-sm" style={{ color: "#5A5A5A" }}>
            <li>Sevilla, España</li>
            <li>
              <a
                href="mailto:hola@digitallabsevilla.com"
                className="transition-colors duration-200"
                style={{ color: "#E5DCA2" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#A05730")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#E5DCA2")}
              >
                hola@digitallabsevilla.com
              </a>
            </li>
            <li>
              <a
                href="tel:+34600000000"
                className="transition-colors duration-200"
                style={{ color: "#E5DCA2" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#A05730")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#E5DCA2")}
              >
                +34 600 000 000
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-8 md:px-12 py-4 border-t flex items-center justify-between gap-4" style={{ borderColor: "#2A2A2A" }}>
        <p className="text-xs mono-num" style={{ color: "#3A3A3A" }}>
          © {new Date().getFullYear()} DigiDot Partners · Sevilla
        </p>
        <p className="text-xs" style={{ color: "#3A3A3A" }}>
          Diseñado para convertir. No para decorar.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
