'use client';

import { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEpigramById } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Epigram } from '@/types/epigram';
import { EpigramCard } from '@/components/EpigramCard';

export default function EpigramPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: epigramId } = use(params);
  const [epigram, setEpigram] = useState<Epigram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEpigram() {
      setLoading(true);
      try {
        const fetchedEpigram = await fetchEpigramById(epigramId);

        if (fetchedEpigram) {
          setEpigram(fetchedEpigram);
        } else {
          setError('Epigram not found');
          // Wait a moment before redirecting
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      } catch (err) {
        console.error('Error loading epigram:', err);
        setError('Failed to load epigram');
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    }

    loadEpigram();
  }, [epigramId, router]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <p className="mt-2 text-muted-foreground">Redirecting to home page...</p>
          </div>
        ) : epigram ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Epigram</h1>
            <EpigramCard epigram={epigram} showComments={true} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
