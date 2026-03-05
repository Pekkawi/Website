import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const apiAuthPrefix = '/api/auth';

// server-safe RBAC
const roleRoutes: Record<string, string[]> = {
  '/nodes': ['admin', 'maintainer'],
  '/users': ['admin', 'maintainer'],
  '/permissions': ['admin', 'maintainer'],
  '/documentation': ['admin', 'maintainer'],
  '/authorization': ['admin'],
  '/profile': ['user', 'admin', 'maintainer'],
};

function allowedRolesForPath(path: string) {
  for (const route of Object.keys(roleRoutes)) {
    if (path === route || path.startsWith(route + '/')) return roleRoutes[route];
  }
  return null;
}

export default auth((req) => {
  const path = req.nextUrl.pathname;

  // Always allow NextAuth endpoints
  if (path.startsWith(apiAuthPrefix)) return NextResponse.next();

  const allowedRoles = allowedRolesForPath(path);
  if (!allowedRoles) return NextResponse.next(); // route not role-protected

  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role as string | undefined;

  if (!isLoggedIn) {
    // redirect to home but keep the original path so you can route back after login if you want
    const url = new URL('/', req.nextUrl);
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  if (!role || !allowedRoles.includes(role)) {
    // IMPORTANT: redirect to a page that is NOT protected
    return NextResponse.redirect(new URL('/', req.nextUrl));
    // Better: return NextResponse.redirect(new URL('/403', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api/auth|api/iot|_next/static|_next/image|favicon.ico|public/.*|icons/.*|images/.*|assets/.*).*)',
  ],
  runtime: 'nodejs',
};
