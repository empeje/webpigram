"use client";

import { Layout } from "@/components/Layout";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { EpigramFeed } from "@/components/EpigramFeed";
import { calculateTopicStats } from "@/utils/topicUtils";
import { useEpigramCreator } from "@/components/EpigramCreator";
import { useEpigramData } from "@/hooks/useEpigramData";

export default function HomePage() {
  const { epigrams, setEpigrams, loading, error, hasMore } = useEpigramData();
  const { handleAddEpigram } = useEpigramCreator(epigrams, setEpigrams);
  const { trendingTopics, topicFrequency } = calculateTopicStats(epigrams);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)]">
        <LeftSidebar />
        <EpigramFeed epigrams={epigrams} loading={loading} error={error} hasMore={hasMore} />
        <RightSidebar trendingTopics={trendingTopics} topicFrequency={topicFrequency} />
      </div>
    </Layout>
  );
}
