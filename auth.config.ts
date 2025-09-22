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
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');

      const role = auth?.user.role;

      // If user is already loggedin, cannot go back to register/login without signing out

      if (publicPaths.some((p) => nextUrl.pathname.startsWith(p))) {
        if (!isLoggedIn) {
          return true;
        } else {
          return NextResponse.redirect(new URL('/', nextUrl));
        }
      }

      // manage the middleware for when you have multiple roles for the future and their allowed pages
      // for example User, Staff, Admin etc.
      console.log('BEFORE SWITCH STATEMMENT with role ', role);
      switch (role) {
        case 'User':
          console.log('Entered switch user statmeent');
          if (userAllowedPaths.some((p) => nextUrl.pathname.startsWith(p))) {
            console.log('It is part of the allowed path');
            return true;
          } else {
            console.log('Now allowed');
            return NextResponse.redirect(new URL('/', nextUrl));
          }
        case 'Admin':
          console.log('Entering admin switch statement');
          return true;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
