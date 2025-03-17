import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RightSidebarProps {
  trendingTopics: string[];
  topicFrequency: Record<string, number>;
}

export function RightSidebar({ trendingTopics, topicFrequency }: RightSidebarProps) {
  return (
    <div className="w-72 border-l pl-6 py-6 hidden lg:block">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending Topics
          </h3>
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <Card key={topic} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic}</span>
                    <span className="text-xs text-muted-foreground">{topicFrequency[topic]} posts</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 