import { Epigram } from "@/types/epigram";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

interface EpigramCardProps {
  epigram: Epigram;
}

// Format date in a consistent way for both server and client
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function EpigramCard({ epigram }: EpigramCardProps) {
  const [upvotes, setUpvotes] = useState(epigram.upvotes);
  const [downvotes, setDownvotes] = useState(epigram.downvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);
  
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
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <p className="text-sm text-muted-foreground">
          {formatDate(epigram.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium mb-2">{epigram.content}</p>
        <p className="text-sm text-muted-foreground">— {epigram.author}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 ${hasUpvoted ? "text-green-500" : ""}`}
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
              className={`h-8 w-8 p-0 ${hasDownvoted ? "text-red-500" : ""}`}
              onClick={handleDownvote}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span className="text-sm">{downvotes}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
} 