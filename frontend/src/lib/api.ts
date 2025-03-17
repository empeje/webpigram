import {
  Epigram,
  EpigramResponse,
  PagedEpigramResponse,
  InteractionRequest,
  InteractionResponse,
  CommentResponse,
  Comment,
} from '@/types/epigram';

export async function fetchEpigrams(): Promise<Epigram[]> {
  try {
    // Use the Next.js API route instead of directly calling the backend
    const response = await fetch('/api/feeds');

    if (!response.ok) {
      throw new Error(`Error fetching epigrams: ${response.status}`);
    }

    const data: EpigramResponse[] = await response.json();
    return data.map((item: EpigramResponse) => ({
      id: item.id.toString(),
      content: item.content,
      author: item.author,
      upvotes: item.upVotes || 0,
      downvotes: item.downVotes || 0,
      createdAt: item.createdAt,
      topics: item.topics || [],
    }));
  } catch (error) {
    console.error('Failed to fetch epigrams:', error);
    throw error;
  }
}

export async function fetchPagedEpigrams(
  page: number,
  pageSize: number = 10
): Promise<{
  epigrams: Epigram[];
  hasMore: boolean;
  page: number;
}> {
  try {
    // Use the Next.js API route instead of directly calling the backend
    const response = await fetch(`/api/feeds/paged?page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
      throw new Error(`Error fetching epigrams: ${response.status}`);
    }

    const data: PagedEpigramResponse = await response.json();

    const epigrams = data.feeds.map((item: EpigramResponse) => ({
      id: item.id.toString(),
      content: item.content,
      author: item.author,
      upvotes: item.upVotes || 0,
      downvotes: item.downVotes || 0,
      createdAt: item.createdAt,
      topics: item.topics || [],
    }));

    return {
      epigrams,
      hasMore: data.hasMore,
      page: data.page,
    };
  } catch (error) {
    console.error('Failed to fetch paged epigrams:', error);
    throw error;
  }
}

export async function fetchRandomEpigram(): Promise<Epigram> {
  try {
    // Use the Next.js API route instead of directly calling the backend
    const response = await fetch('/api/im-in-lucky');

    if (!response.ok) {
      throw new Error(`Error fetching random epigram: ${response.status}`);
    }

    const item: EpigramResponse = await response.json();
    return {
      id: item.id.toString(),
      content: item.content,
      author: item.author,
      upvotes: item.upVotes || 0,
      downvotes: item.downVotes || 0,
      createdAt: item.createdAt,
      topics: item.topics || [],
    };
  } catch (error) {
    console.error('Failed to fetch random epigram:', error);
    throw error;
  }
}

export interface SubmitEpigramRequest {
  content: string;
  author: string;
  topics: string[];
  recaptchaToken: string;
}

export interface SubmitEpigramResponse {
  id: number;
  message: string;
}

export async function submitEpigram(data: SubmitEpigramRequest): Promise<SubmitEpigramResponse> {
  try {
    const response = await fetch('/api/epigram/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error submitting epigram: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit epigram:', error);
    throw error;
  }
}

export async function fetchEpigramById(id: string): Promise<Epigram | null> {
  try {
    const response = await fetch(`/api/epigram/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Epigram not found
      }
      throw new Error(`Error fetching epigram: ${response.status}`);
    }

    const item: EpigramResponse = await response.json();
    return {
      id: item.id.toString(),
      content: item.content,
      author: item.author,
      upvotes: item.upVotes || 0,
      downvotes: item.downVotes || 0,
      createdAt: item.createdAt,
      topics: item.topics || [],
    };
  } catch (error) {
    console.error('Failed to fetch epigram by ID:', error);
    throw error;
  }
}

/**
 * Submit an anonymous interaction (upvote, downvote, or comment)
 */
export async function submitInteraction(data: InteractionRequest): Promise<InteractionResponse> {
  try {
    const response = await fetch('/api/epigram/interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error submitting interaction: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit interaction:', error);
    throw error;
  }
}

/**
 * Fetch comments for an epigram
 */
export async function fetchComments(epigramId: string): Promise<Comment[]> {
  try {
    const response = await fetch(`/api/epigram/interaction/comments/${epigramId}`);

    if (!response.ok) {
      throw new Error(`Error fetching comments: ${response.status}`);
    }

    const data: CommentResponse = await response.json();
    return data.comments;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
}
