import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendBase = process.env.BACKEND_API_URL || 'http://localhost:5001/api';
    const authHeader = request.headers.get('authorization') || '';

    const upstream = await fetch(`${backendBase}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { error: `Upstream non-JSON response (${upstream.status})`, raw: text.slice(0, 200) },
        { status: upstream.status }
      );
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
