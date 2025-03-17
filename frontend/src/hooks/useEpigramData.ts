import { useState, useEffect, useCallback, useRef } from 'react';
import { Epigram } from '@/types/epigram';
import { fetchPagedEpigrams } from '@/lib/api';
import { epigrams as initialEpigrams } from '@/data/epigrams';

export function useEpigramData() {
  const [epigrams, setEpigrams] = useState<Epigram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const loadingRef = useRef(false);

  // Initial load of epigrams
  useEffect(() => {
    const getInitialEpigrams = async () => {
      try {
        setLoading(true);
        const result = await fetchPagedEpigrams(0);
        setEpigrams(result.epigrams);
        setHasMore(result.hasMore);
        setPage(0);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch epigrams:', err);
        setError('Failed to load epigrams. Using fallback data.');
        setEpigrams(initialEpigrams); // Fallback to static data
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    getInitialEpigrams();
  }, []);

  // Function to load more epigrams
  const loadMoreEpigrams = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    try {
      const nextPage = page + 1;
      const result = await fetchPagedEpigrams(nextPage);

      setEpigrams(prev => [...prev, ...result.epigrams]);
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to fetch more epigrams:', err);
      setError('Failed to load more epigrams.');
    } finally {
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  // Setup scroll event listener for infinite scrolling
  useEffect(() => {
    if (!initialLoadComplete) return;

    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Load more when user scrolls to 80% of the page
      if (scrollPosition + windowHeight > fullHeight * 0.8) {
        loadMoreEpigrams();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreEpigrams, hasMore, initialLoadComplete]);

  return {
    epigrams,
    setEpigrams,
    loading,
    error,
    hasMore,
    loadMoreEpigrams,
  };
}
