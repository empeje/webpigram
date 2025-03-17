import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { epigramId: string } }) {
  try {
    const epigramId = params.epigramId;

    const backendUrl = process.env.API_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/epigram/interaction/comments/${epigramId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to fetch comments' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in comments API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
