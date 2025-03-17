"use client";

import { Layout } from "@/components/Layout";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { EpigramFeed } from "@/components/EpigramFeed";
import { useEpigramCreator } from "@/components/EpigramCreator";
import { useEpigramData } from "@/hooks/useEpigramData";
import { useEpigramContext } from "@/contexts/EpigramContext";
import { useEffect } from "react";

export default function HomePage() {
  const { epigrams, setEpigrams, loading, error, hasMore } = useEpigramData();
  const { handleAddEpigram } = useEpigramCreator(epigrams, setEpigrams);
  const { newlySubmittedEpigram, setNewlySubmittedEpigram } = useEpigramContext();
  
  // Check for newly submitted epigram and add it to the feed
  useEffect(() => {
    if (newlySubmittedEpigram) {
      // Add the newly submitted epigram to the top of the feed
      setEpigrams(prevEpigrams => [newlySubmittedEpigram, ...prevEpigrams]);
      
      // Clear the newly submitted epigram from context
      setNewlySubmittedEpigram(null);
    }
  }, [newlySubmittedEpigram, setEpigrams, setNewlySubmittedEpigram]);

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)]">
        <LeftSidebar />
        <EpigramFeed 
          epigrams={epigrams} 
          loading={loading} 
          error={error} 
          hasMore={hasMore} 
          setEpigrams={setEpigrams}
        />
        <RightSidebar />
      </div>
    </Layout>
  );
}
