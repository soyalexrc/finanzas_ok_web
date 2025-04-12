import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.BACKEND_API}/auth/validateEmailForRegister`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to hit validateEmailForRegister' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in validateEmailForRegister route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}