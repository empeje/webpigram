"use client";

import { useState } from "react";
import { epigrams as initialEpigrams } from "@/data/epigrams";
import { EpigramCard } from "@/components/EpigramCard";
import { Layout } from "@/components/Layout";
import { Epigram } from "@/types/epigram";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, PlusCircle, TrendingUp, User } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [epigrams, setEpigrams] = useState<Epigram[]>(initialEpigrams);

  const handleAddEpigram = (newEpigram: Omit<Epigram, "id" | "upvotes" | "downvotes" | "createdAt">) => {
    const epigramToAdd: Epigram = {
      id: (epigrams.length + 1).toString(),
      content: newEpigram.content,
      author: newEpigram.author,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      topics: newEpigram.topics || [],
    };

    setEpigrams([epigramToAdd, ...epigrams]);
  };

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

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)]">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 border-r pr-6 py-6 hidden md:block">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Main</h3>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit Epigram
                  </Link>
                </Button>
              </nav>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Account</h3>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main Content - Epigram Feed */}
        <div className="flex-1 px-4 py-6 md:px-6 max-w-3xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Epigrams</h2>
            <p className="text-muted-foreground">Wisdom from the world of programming</p>
          </header>
          
          <div className="space-y-6">
            {epigrams.map((epigram) => (
              <EpigramCard key={epigram.id} epigram={epigram} />
            ))}
          </div>
        </div>
        
        {/* Right Sidebar - Trending Topics */}
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
      </div>
    </Layout>
  );
}
