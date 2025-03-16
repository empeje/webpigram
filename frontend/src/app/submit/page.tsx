"use client";

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { EpigramForm } from "@/components/EpigramForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Epigram } from "@/types/epigram";

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (epigram: Omit<Epigram, "id" | "upvotes" | "downvotes" | "createdAt">) => {
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    // For now, we'll just simulate a delay and redirect
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold tracking-tight mb-3">Submit an Epigram</h1>
          <p className="text-xl text-muted-foreground">
            Share your programming wisdom with the world
          </p>
        </div>
        
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl">New Epigram</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <EpigramForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>All submissions are reviewed for quality and relevance.</p>
        </div>
      </div>
    </Layout>
  );
} 