import type { NextAuthConfig } from 'next-auth';
import { useSession } from 'next-auth/react';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const publicPaths = ['/register', '/login'];
      const userAllowedPaths = ['/']; // the user will only be able to access the home route
      const PendingApprovalAllowedPaths = ['/pending-approval'];
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      const role = auth?.user?.role;
      const access = auth?.user?.access;

      // If user is already loggedin, cannot go back to register/login without signing out

      if (publicPaths.some((p) => nextUrl.pathname.startsWith(p))) {
        if (!isLoggedIn) {
          return true;
        } else {
          return NextResponse.redirect(new URL('/', nextUrl));
        }
      }
      console.log(access);
      console.log(nextUrl.pathname);

      if (access === 'Pending') {
        if (PendingApprovalAllowedPaths.some((p) => nextUrl.pathname === p)) {
          return true;
        } else {
          console.log('or here');

          return NextResponse.redirect(new URL('/pending-approval', nextUrl));
        }
      }

      // manage the middleware for when you have multiple roles for the future and their allowed pages
      // for example User, Staff, Admin etc.

      switch (role) {
        case 'User':
          if (userAllowedPaths.some((p) => nextUrl.pathname === p)) {
            return true;
          } else {
            return NextResponse.redirect(new URL('/', nextUrl));
          }
          break;
        case 'Admin':
          return true;
          break;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      // This callback runs in auth.ts but we need to define it here too
      // so the role gets properly passed through to the authorized callback
      if (user) {
        token.role = (user as any).role;
        token.uid = (user as any).id;
        token.access = (user as any).access;
      }
      return token;
    },
    session({ session, token }) {
      // Pass the role from token to session
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.uid;
        (session.user as any).access = token.access;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
