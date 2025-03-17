import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Get the API URL from environment variables
    const apiUrl = process.env.API_URL || 'http://localhost:8080';
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}/api/epigram/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to submit epigram' },
        { status: response.status }
      );
    }
    
    // Return the response from the backend
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error submitting epigram:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 