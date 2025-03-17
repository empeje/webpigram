import { NextRequest, NextResponse } from 'next/server';

// Define the route segment config to disable static generation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extract the ID from the URL path
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json({ error: 'Missing epigram ID' }, { status: 400 });
    }

    const apiUrl = process.env.API_URL || 'http://localhost:8080';

    // Call the backend API
    const response = await fetch(`${apiUrl}/epigram/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Epigram not found' }, { status: 404 });
      }
      throw new Error(`Error fetching epigram: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in epigram API route:', error);
    return NextResponse.json({ error: 'Failed to fetch epigram' }, { status: 500 });
  }
}
