import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log('Request received at /api/auth/loginOrRegister');
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const response = await fetch(`${process.env.BACKEND_API}/auth/validateUserEmailForPasskey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    console.log('Response from backend:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to validate user' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in loginOrRegister route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}