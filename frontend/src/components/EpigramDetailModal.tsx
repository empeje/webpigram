'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Epigram } from '@/types/epigram';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EpigramDetailModalProps {
  epigram: Epigram;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EpigramDetailModal({ epigram, isOpen, onOpenChange }: EpigramDetailModalProps) {
  const [upvotes, setUpvotes] = useState(epigram.upvotes);
  const [downvotes, setDownvotes] = useState(epigram.downvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const router = useRouter();

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);

      if (hasDownvoted) {
        setDownvotes(prev => prev - 1);
        setHasDownvoted(false);
      }
    }
  };

  const handleDownvote = () => {
    if (hasDownvoted) {
      setDownvotes(prev => prev - 1);
      setHasDownvoted(false);
    } else {
      setDownvotes(prev => prev + 1);
      setHasDownvoted(true);

      if (hasUpvoted) {
        setUpvotes(prev => prev - 1);
        setHasUpvoted(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Remove the epigram ID from the URL without refreshing the page
    router.push('/', { scroll: false });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Epigram</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {epigram.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{epigram.author}</p>
                <p className="text-xs text-muted-foreground">{formatDate(epigram.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-lg font-medium leading-relaxed">{epigram.content}</p>
          </div>

          {epigram.topics && epigram.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {epigram.topics.map(topic => (
                <Badge key={topic} variant="secondary" className="rounded-full">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-6 border-t pt-4">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-full ${hasUpvoted ? 'text-green-500 bg-green-50' : ''}`}
                onClick={handleUpvote}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <span className="text-sm">{upvotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-full ${hasDownvoted ? 'text-red-500 bg-red-50' : ''}`}
                onClick={handleDownvote}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <span className="text-sm">{downvotes}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
