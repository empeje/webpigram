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
import { Epigram, InteractionType } from '@/types/epigram';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitInteraction } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from './LoadingSpinner';
import { CommentSection } from './CommentSection';
import { useRecaptcha } from '@/hooks/useRecaptcha';

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
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isDownvoting, setIsDownvoting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { recaptchaLoaded, executeRecaptcha } = useRecaptcha();

  const handleUpvote = async () => {
    if (isUpvoting || isDownvoting) return;

    setIsUpvoting(true);
    try {
      // If already upvoted, we can't undo it with anonymous interactions
      if (hasUpvoted) {
        toast({
          title: 'Info',
          description: 'You have already upvoted this epigram',
        });
        setIsUpvoting(false);
        return;
      }

      // Execute reCAPTCHA and get token
      const token = await executeRecaptcha('INTERACTION');
      if (!token) {
        setIsUpvoting(false);
        return;
      }

      const response = await submitInteraction({
        epigramId: parseInt(epigram.id),
        interactionType: InteractionType.UPVOTE,
        recaptchaToken: token,
      });

      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
        setHasUpvoted(true);

        // If previously downvoted in this session, update UI state
        if (hasDownvoted) {
          setHasDownvoted(false);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upvote',
        variant: 'destructive',
      });
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDownvote = async () => {
    if (isUpvoting || isDownvoting) return;

    setIsDownvoting(true);
    try {
      // If already downvoted, we can't undo it with anonymous interactions
      if (hasDownvoted) {
        toast({
          title: 'Info',
          description: 'You have already downvoted this epigram',
        });
        setIsDownvoting(false);
        return;
      }

      // Execute reCAPTCHA and get token
      const token = await executeRecaptcha('INTERACTION');
      if (!token) {
        setIsDownvoting(false);
        return;
      }

      const response = await submitInteraction({
        epigramId: parseInt(epigram.id),
        interactionType: InteractionType.DOWNVOTE,
        recaptchaToken: token,
      });

      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
        setHasDownvoted(true);

        // If previously upvoted in this session, update UI state
        if (hasUpvoted) {
          setHasUpvoted(false);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to downvote',
        variant: 'destructive',
      });
    } finally {
      setIsDownvoting(false);
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
                disabled={isUpvoting || isDownvoting || !recaptchaLoaded}
              >
                {isUpvoting ? <LoadingSpinner size="sm" /> : <ThumbsUp className="h-4 w-4" />}
              </Button>
              <span className="text-sm">{upvotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-full ${hasDownvoted ? 'text-red-500 bg-red-50' : ''}`}
                onClick={handleDownvote}
                disabled={isUpvoting || isDownvoting || !recaptchaLoaded}
              >
                {isDownvoting ? <LoadingSpinner size="sm" /> : <ThumbsDown className="h-4 w-4" />}
              </Button>
              <span className="text-sm">{downvotes}</span>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-6 border-t pt-4">
            <CommentSection epigramId={epigram.id} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
