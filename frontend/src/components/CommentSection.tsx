import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Comment, InteractionType } from '@/types/epigram';
import { fetchComments, submitInteraction } from '@/lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface CommentSectionProps {
  epigramId: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function CommentSection({ epigramId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { recaptchaLoaded, executeRecaptcha } = useRecaptcha();

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await fetchComments(epigramId);
        setComments(fetchedComments);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load comments',
          variant: 'destructive',
        });
        console.error('Error loading comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [epigramId, toast]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Execute reCAPTCHA and get token
      const token = await executeRecaptcha('INTERACTION');
      if (!token) {
        setIsSubmitting(false);
        return;
      }

      const response = await submitInteraction({
        epigramId: parseInt(epigramId),
        interactionType: InteractionType.COMMENT,
        commentContent: newComment.trim(),
        recaptchaToken: token,
      });

      if (response.success) {
        // Refresh comments
        const updatedComments = await fetchComments(epigramId);
        setComments(updatedComments);
        setNewComment('');
        toast({
          title: 'Success',
          description: 'Comment added successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      {/* Comment input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <Button
          onClick={handleSubmitComment}
          disabled={isSubmitting || !recaptchaLoaded}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? <LoadingSpinner /> : 'Post Comment'}
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </div>
                  <p>{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
