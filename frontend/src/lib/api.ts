import { Epigram, EpigramResponse } from "@/types/epigram";

// Get API URL from environment variable or use default for testing
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
    console.error("Failed to fetch epigrams:", error);
    throw error;
  }
} 