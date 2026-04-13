import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DiagnosticProvider } from "@/context/DiagnosticContext";
import Index from "./pages/Index";
import Diagnostico from "./pages/Diagnostico";
import Resultados from "./pages/Resultados";
import Catalogo from "./pages/Catalogo";
import Contratar from "./pages/Contratar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DiagnosticProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnostico" element={<Diagnostico />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contratar/:serviceId" element={<Contratar />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DiagnosticProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
