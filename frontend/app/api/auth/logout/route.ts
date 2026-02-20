import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const backendBase = process.env.BACKEND_API_URL || 'http://localhost:5001/api';
    const upstream = await fetch(`${backendBase}/auth/logout`, {
      method: 'POST',
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
  } catch {
    return NextResponse.json({ error: 'Logout proxy failed' }, { status: 500 });
  }
}
