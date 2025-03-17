export interface Epigram {
  id: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  topics: string[];
}

// Backend response format
export interface EpigramResponse {
  id: number;
  content: string;
  author: string;
  upVotes: number;
  downVotes: number;
  createdAt: string;
  topics: string[];
}

// Paged response from backend
export interface PagedEpigramResponse {
  feeds: EpigramResponse[];
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Trending topic response from backend
export interface TrendingTopicResponse {
  topic: string;
  epigramCount: number;
  totalUpvotes: number;
}

// Comment types
export interface Comment {
  id: number;
  epigramId: number;
  content: string;
  createdAt: string;
}

export interface CommentResponse {
  epigramId: number;
  comments: Comment[];
}

// Interaction types
export enum InteractionType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
  COMMENT = 'COMMENT',
}

export interface InteractionRequest {
  epigramId: number;
  interactionType: InteractionType;
  commentContent?: string;
  recaptchaToken: string;
}

export interface InteractionResponse {
  success: boolean;
  message: string;
  commentId?: number;
  upvotes: number;
  downvotes: number;
}
