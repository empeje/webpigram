"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Epigram } from "@/types/epigram";

interface EpigramContextType {
  newlySubmittedEpigram: Epigram | null;
  setNewlySubmittedEpigram: (epigram: Epigram | null) => void;
}

const EpigramContext = createContext<EpigramContextType | undefined>(undefined);

export function EpigramProvider({ children }: { children: ReactNode }) {
  const [newlySubmittedEpigram, setNewlySubmittedEpigram] = useState<Epigram | null>(null);

  return (
    <EpigramContext.Provider value={{ newlySubmittedEpigram, setNewlySubmittedEpigram }}>
      {children}
    </EpigramContext.Provider>
  );
}

export function useEpigramContext() {
  const context = useContext(EpigramContext);
  if (context === undefined) {
    throw new Error("useEpigramContext must be used within an EpigramProvider");
  }
  return context;
} 