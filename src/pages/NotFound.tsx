import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => { console.error("404:", location.pathname); }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-void text-raw px-8">
      <div>
        <div className="mono-num text-[10rem] font-bold leading-none select-none" style={{ color: "#161616" }}>404</div>
        <h1 className="text-3xl font-bold mb-4 -mt-4" style={{ letterSpacing: "-0.02em" }}>Página no encontrada.</h1>
        <p className="text-sm mb-8" style={{ color: "#5A5A5A" }}>La página que buscas no existe o fue movida.</p>
        <Link to="/" className="text-sm font-semibold" style={{ color: "#A05730" }}>← Volver al inicio</Link>
      </div>
    </div>
  );
};

export default NotFound;
