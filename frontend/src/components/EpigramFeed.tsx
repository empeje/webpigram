'use client';

import { Epigram } from '@/types/epigram';
import { EpigramCard } from '@/components/EpigramCard';
import { ImLuckyButton } from '@/components/ImLuckyButton';

interface EpigramFeedProps {
  epigrams: Epigram[];
  loading: boolean;
  error: string | null;
  hasMore?: boolean;
  setEpigrams?: (epigrams: Epigram[]) => void;
}

export function EpigramFeed({ epigrams, loading, error, hasMore, setEpigrams }: EpigramFeedProps) {
  const handleAddRandomEpigram = (epigram: Epigram) => {
    if (setEpigrams) {
      setEpigrams([epigram, ...epigrams]);
    }
  };

  return (
    <div className="flex-1 px-4 py-6 md:px-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
          <h2 className="text-3xl font-bold tracking-tight">Latest Epigrams</h2>
          <div className="flex justify-start sm:justify-end">
            <ImLuckyButton onEpigramAdded={handleAddRandomEpigram} />
          </div>
        </div>
        <p className="text-muted-foreground">Wisdom from the world of programming</p>
      </header>

      {loading && epigrams.length === 0 ? (
        <div className="text-center py-10">
          <p>Loading epigrams...</p>
        </div>
      ) : error && epigrams.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {epigrams.map(epigram => (
            <EpigramCard key={epigram.id} epigram={epigram} />
          ))}

          {loading && epigrams.length > 0 && (
            <div className="text-center py-4">
              <p>Loading more epigrams...</p>
            </div>
          )}

          {!hasMore && epigrams.length > 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p>No more epigrams to load</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
