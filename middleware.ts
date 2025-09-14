import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

  // the middleware will not run on paths such as the favicon or static images
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs',
};
