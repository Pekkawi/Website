import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

  // the middleware will not run on paths such as the favicon or static images

  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public/.*|icons/.*|images/.*|assets/.*).*)',
  ],
  runtime: 'nodejs',
};
