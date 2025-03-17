'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Epigram } from '@/types/epigram';

interface EpigramContextType {
  newlySubmittedEpigram: Epigram | null;
  setNewlySubmittedEpigram: (epigram: Epigram | null) => void;
  sharedEpigram: Epigram | null;
  setSharedEpigram: (epigram: Epigram | null) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (isOpen: boolean) => void;
}

const EpigramContext = createContext<EpigramContextType | undefined>(undefined);

export function EpigramProvider({ children }: { children: ReactNode }) {
  const [newlySubmittedEpigram, setNewlySubmittedEpigram] = useState<Epigram | null>(null);
  const [sharedEpigram, setSharedEpigram] = useState<Epigram | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <EpigramContext.Provider
      value={{
        newlySubmittedEpigram,
        setNewlySubmittedEpigram,
        sharedEpigram,
        setSharedEpigram,
        isShareModalOpen,
        setIsShareModalOpen,
      }}
    >
      {children}
    </EpigramContext.Provider>
  );
}

export function useEpigramContext() {
  const context = useContext(EpigramContext);
  if (context === undefined) {
    throw new Error('useEpigramContext must be used within an EpigramProvider');
  }
  return context;
}
