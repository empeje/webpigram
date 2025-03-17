import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const backendUrl = process.env.API_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/epigram/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to process interaction' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in interaction API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
