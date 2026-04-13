import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DiagnosticAnswers {
  sector: string;
  companySize: string;
  dataUsage: number;
  techLevel: number;
  automation: number;
  dataStrategy: number;
  cloudAdoption: number;
  cybersecurity: number;
  digitalCulture: number;
  annualRevenue: string;
}

export interface DiagnosticResult {
  score: number;
  level: "básico" | "intermedio" | "avanzado";
  estimatedLoss: number;
  areas: { name: string; value: number }[];
  quickWins: string[];
  recommendations: string[];
}

export interface ContractedService {
  id: string;
  name: string;
  price: number;
  status: "pendiente" | "en progreso" | "completado";
  progress: number;
}

interface DiagnosticContextType {
  answers: DiagnosticAnswers | null;
  setAnswers: (a: DiagnosticAnswers) => void;
  result: DiagnosticResult | null;
  setResult: (r: DiagnosticResult) => void;
  contractedServices: ContractedService[];
  addService: (s: ContractedService) => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

export const DiagnosticProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<DiagnosticAnswers | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [contractedServices, setContractedServices] = useState<ContractedService[]>([]);

  const addService = (s: ContractedService) => {
    setContractedServices((prev) => [...prev, s]);
  };

  return (
    <DiagnosticContext.Provider value={{ answers, setAnswers, result, setResult, contractedServices, addService }}>
      {children}
    </DiagnosticContext.Provider>
  );
};

export const useDiagnostic = () => {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) throw new Error("useDiagnostic must be used within DiagnosticProvider");
  return ctx;
};
