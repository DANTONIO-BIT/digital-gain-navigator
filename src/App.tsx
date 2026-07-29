import { useEffect, useState, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { DiagnosticProvider } from "@/context/DiagnosticContext";
import { AuthProvider } from "@/context/AuthContext";
import Lenis from "lenis";
import Preloader from "@/components/Preloader";
import Index from "./pages/Index";
import Diagnostico from "./pages/Diagnostico";
import Resultados from "./pages/Resultados";
import Servicios from "./pages/Servicios";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import AgentesFunnel from "./pages/AgentesFunnel";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

const DemoApp = lazy(() => import("./pages/DemoApp"));

const queryClient = new QueryClient();

const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf: number;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [location.pathname]);

  return <>{children}</>;
};

const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <DiagnosticProvider>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <Toaster />
      <BrowserRouter>
        <LenisProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route
              path="/demo"
              element={
                <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F9F6F1" }} />}>
                  <DemoApp />
                </Suspense>
              }
            />
            <Route path="/agente" element={<AgentesFunnel />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LenisProvider>
      </BrowserRouter>
    </DiagnosticProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
