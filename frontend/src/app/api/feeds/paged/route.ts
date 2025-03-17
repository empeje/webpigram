import { NextRequest, NextResponse } from 'next/server';

// Get API URL from environment variable or use default for testing
const API_URL = process.env.API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '0';
    const pageSize = searchParams.get('pageSize') || '10';
    
    const response = await fetch(`${API_URL}/feeds/paged?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // This ensures the request is made from the server
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error fetching paged epigrams: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch paged epigrams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paged epigrams' },
      { status: 500 }
    );
  }
} 