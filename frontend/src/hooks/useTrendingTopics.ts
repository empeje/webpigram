import { useState, useEffect } from 'react';
import { TrendingTopicResponse } from '@/types/epigram';

export function useTrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopicResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        setLoading(true);
        const response = await fetch('/api/trending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending topics');
        }
        
        const data = await response.json();
        setTrendingTopics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending topics:', err);
        setError('Failed to load trending topics');
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingTopics();
  }, []);

  return { trendingTopics, loading, error };
} 