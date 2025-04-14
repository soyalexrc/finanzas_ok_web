import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Extract the Authorization header from the incoming request
    const authorizationHeader = request.headers.get('Authorization');

    const response = await fetch(`${process.env.BACKEND_API}/currency`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}), // Forward the Authorization header if it exists
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to currency' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in currencys route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}