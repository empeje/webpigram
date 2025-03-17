'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEpigramById } from '@/lib/api';
import { useEpigramContext } from '@/contexts/EpigramContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function EpigramPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { setSharedEpigram, setIsShareModalOpen } = useEpigramContext();
  const { id: epigramId } = use(params);

  useEffect(() => {
    async function loadEpigram() {
      try {
        const epigram = await fetchEpigramById(epigramId);

        if (epigram) {
          // Set the shared epigram in context
          setSharedEpigram(epigram);
          // Open the modal
          setIsShareModalOpen(true);
          // Redirect to home page
          router.push('/');
        } else {
          // Epigram not found, redirect to home
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading epigram:', error);
        // On error, redirect to home
        router.push('/');
      }
    }

    loadEpigram();
  }, [epigramId, router, setSharedEpigram, setIsShareModalOpen]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}
