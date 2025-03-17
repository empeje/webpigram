'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { fetchRandomEpigram } from '@/lib/api';
import { Epigram } from '@/types/epigram';
import dynamic from 'next/dynamic';
import { Sparkles } from 'lucide-react';

// Dynamically import the confetti component to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

interface ImLuckyButtonProps {
  onEpigramAdded: (epigram: Epigram) => void;
}

export function ImLuckyButton({ onEpigramAdded }: ImLuckyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomEpigram, setRandomEpigram] = useState<Epigram | null>(null);
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

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const epigram = await fetchRandomEpigram();
      setRandomEpigram(epigram);
      setShowConfetti(true);

      // Stop confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to fetch random epigram:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (randomEpigram) {
      onEpigramAdded(randomEpigram);
      setRandomEpigram(null);
    }
  };

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          className="group relative transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          onClick={handleClick}
          disabled={isLoading}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>I&apos;m Lucky</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max opacity-0 transition-opacity group-hover:opacity-100 text-xs bg-background text-foreground px-2 py-1 rounded shadow-sm border z-50">
            Click here to generate a new epigram
          </span>
        </Button>
      </div>

      <Dialog open={!!randomEpigram} onOpenChange={open => !open && handleDialogClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Lucky Epigram</DialogTitle>
            <DialogDescription>Here&apos;s a random epigram just for you!</DialogDescription>
          </DialogHeader>

          {randomEpigram && (
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="whitespace-pre-wrap mb-2">{randomEpigram.content}</p>
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>— {randomEpigram.author}</span>
                <div className="flex gap-2">
                  {randomEpigram.topics.map(topic => (
                    <span key={topic} className="bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Add to Feed</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
