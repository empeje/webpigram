'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { EpigramForm } from '@/components/EpigramForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Epigram } from '@/types/epigram';
import { submitEpigram, SubmitEpigramRequest } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
import { useEpigramContext } from '@/contexts/EpigramContext';

// Dynamically import the confetti component to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

export default function SubmitPage() {
  const router = useRouter();
  const { setNewlySubmittedEpigram } = useEpigramContext();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update window size when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleSubmit = async (epigram: SubmitEpigramRequest) => {
    try {
      // Submit the epigram to the API
      const response = await submitEpigram(epigram);

      // Create a new epigram object from the response and request data
      const newEpigram: Epigram = {
        id: response.id.toString(),
        content: epigram.content,
        author: epigram.author,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        topics: epigram.topics || [],
      };

      // Store the newly submitted epigram in context
      setNewlySubmittedEpigram(newEpigram);

      // Show success toast
      toast({
        title: 'Success!',
        description: 'Your epigram has been submitted successfully.',
      });

      // Show confetti
      setShowConfetti(true);

      // Redirect to epigram detail page after a short delay
      setTimeout(() => {
        setShowConfetti(false);
        router.push(`/epigram/${response.id}`);
      }, 1500);
    } catch {
      // Error is handled in the form component
    }
  };

  return (
    <Layout>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
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
