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