import { NextResponse } from 'next/server';

// Get API URL from environment variable or use default for testing
const API_URL = process.env.API_URL || 'http://localhost:8080';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/trending`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // This ensures the request is made from the server
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error fetching trending topics: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch trending topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    );
  }
} 