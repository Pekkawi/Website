// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 240, // per 60 seconds by IP
});

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';

  try {
    await rateLimiter.consume(ip, 2); // deduct 2 point
    return NextResponse.json({ message: 'Hello world' });
  } catch {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
}
