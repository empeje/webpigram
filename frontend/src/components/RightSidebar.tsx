import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTrendingTopics } from '@/hooks/useTrendingTopics';
import { Skeleton } from '@/components/ui/skeleton';

export function RightSidebar() {
  const { trendingTopics, loading, error } = useTrendingTopics();

  return (
    <div className="w-72 border-l pl-6 py-6 hidden lg:block">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending Topics
          </h3>
          <div className="space-y-3">
            {loading ? (
              // Show skeletons while loading
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : error ? (
              <p className="text-sm text-red-500">Failed to load trending topics</p>
            ) : (
              trendingTopics.map(topic => (
                <Card key={topic.topic} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.topic}</span>
                      <span className="text-xs text-muted-foreground">
                        {topic.epigramCount} posts
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
