import { useState, useEffect } from "react";
import { Epigram } from "@/types/epigram";
import { fetchEpigrams } from "@/lib/api";
import { epigrams as initialEpigrams } from "@/data/epigrams";

export function useEpigramData() {
  const [epigrams, setEpigrams] = useState<Epigram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEpigrams = async () => {
      try {
        setLoading(true);
        const data = await fetchEpigrams();
        setEpigrams(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch epigrams:", err);
        setError("Failed to load epigrams. Using fallback data.");
        setEpigrams(initialEpigrams); // Fallback to static data
      } finally {
        setLoading(false);
      }
    };

    getEpigrams();
  }, []);

  return { epigrams, setEpigrams, loading, error };
} 