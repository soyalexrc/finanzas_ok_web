import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract the Authorization header from the incoming request
    const authorizationHeader = request.headers.get('Authorization');
    

    const response = await fetch(`${process.env.BACKEND_API}/transaction/getMonthlyStatistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorizationHeader ? { Authorization: authorizationHeader } : {}), // Forward the Authorization header if it exists
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to getMonthlyStatistics' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in getMonthlyStatistics route:', error);
    return NextResponse.json({ error: true, desc: JSON.stringify(error), display: 'Ocurrio un error!'}, { status: 400 });
  }
}