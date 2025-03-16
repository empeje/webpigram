"use client";

import { useState } from "react";
import { epigrams as initialEpigrams } from "@/data/epigrams";
import { EpigramCard } from "@/components/EpigramCard";
import { EpigramForm } from "@/components/EpigramForm";
import { Layout } from "@/components/Layout";
import { Epigram } from "@/types/epigram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [epigrams, setEpigrams] = useState<Epigram[]>(initialEpigrams);

  const handleAddEpigram = (newEpigram: Omit<Epigram, "id" | "upvotes" | "downvotes" | "createdAt">) => {
    const epigramToAdd: Epigram = {
      id: (epigrams.length + 1).toString(),
      content: newEpigram.content,
      author: newEpigram.author,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };

    setEpigrams([epigramToAdd, ...epigrams]);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <header className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Latest Epigrams</h2>
              <p className="text-muted-foreground">Wisdom from the world of programming</p>
            </header>
            
            <div className="space-y-6">
              {epigrams.map((epigram) => (
                <EpigramCard key={epigram.id} epigram={epigram} />
              ))}
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Epigram</CardTitle>
              </CardHeader>
              <CardContent>
                <EpigramForm onSubmit={handleAddEpigram} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
