import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const backendBase = process.env.BACKEND_API_URL || 'http://localhost:5001/api';
    const body = await request.text();

    const upstream = await fetch(`${backendBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const cause =
      error instanceof Error && 'cause' in error
        ? String((error as Error & { cause?: unknown }).cause ?? '')
        : '';
    console.error('Register proxy error:', error);
    return NextResponse.json(
      {
        error: 'Register proxy failed',
        message,
        cause: cause || undefined,
        backendBase: process.env.BACKEND_API_URL || 'http://localhost:5001/api',
      },
      { status: 502 }
    );
  }
}
