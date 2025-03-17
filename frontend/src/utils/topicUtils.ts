import { Epigram } from "@/types/epigram";

export function calculateTopicStats(epigrams: Epigram[]) {
  // Get all unique topics from epigrams
  const allTopics = epigrams.flatMap(epigram => epigram.topics);
  const uniqueTopics = Array.from(new Set(allTopics));
  
  // Sort topics by frequency
  const topicFrequency = allTopics.reduce((acc, topic) => {
    acc[topic] = (acc[topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const trendingTopics = uniqueTopics
    .sort((a, b) => topicFrequency[b] - topicFrequency[a])
    .slice(0, 5);

  return {
    uniqueTopics,
    topicFrequency,
    trendingTopics
  };
} 