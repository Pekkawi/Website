import NextAuth from 'next-auth';

import { auth } from '@/auth';
import { NextResponse } from 'next/server';
// export default NextAuth(authConfig).auth;

const apiAuthPrefix = '/api/auth';
// const authPagrRoutes = ['/'];
const protectedRoutes = ['/nodes', 'permissions', '/users', '/authorization'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const path = nextUrl.pathname;

  const isAuthApiRoute = path.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.includes(path);
  //   const isAuthPageRoute = authPagrRoutes.includes(path);

  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // the middleware will not run on paths such as the favicon or static images

  matcher: [
    '/((?!api/auth|api/iot|_next/static|_next/image|favicon.ico|public/.*|icons/.*|images/.*|assets/.*).*)',
  ],
  runtime: 'nodejs',
};
