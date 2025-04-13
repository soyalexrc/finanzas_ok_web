import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.BACKEND_API}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to request Otp' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in requestOtp route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}