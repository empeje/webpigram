import { Epigram } from "@/types/epigram";
import { EpigramCard } from "@/components/EpigramCard";

interface EpigramFeedProps {
  epigrams: Epigram[];
  loading: boolean;
  error: string | null;
}

export function EpigramFeed({ epigrams, loading, error }: EpigramFeedProps) {
  return (
    <div className="flex-1 px-4 py-6 md:px-6 max-w-3xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Epigrams</h2>
        <p className="text-muted-foreground">Wisdom from the world of programming</p>
      </header>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading epigrams...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {epigrams.map((epigram) => (
            <EpigramCard key={epigram.id} epigram={epigram} />
          ))}
        </div>
      )}
    </div>
  );
} 