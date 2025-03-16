import { Epigram } from "@/types/epigram";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";
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
    <Card className="w-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
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
            {epigram.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="rounded-full">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-muted/20 border-t flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 w-8 p-0 rounded-full ${hasUpvoted ? "text-green-500 bg-green-50" : ""}`}
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
              className={`h-8 w-8 p-0 rounded-full ${hasDownvoted ? "text-red-500 bg-red-50" : ""}`}
              onClick={handleDownvote}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <span className="text-sm">{downvotes}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 