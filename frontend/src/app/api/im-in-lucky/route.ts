import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/im-in-lucky`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error fetching random epigram: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching random epigram:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random epigram' },
      { status: 500 }
    );
  }
} 