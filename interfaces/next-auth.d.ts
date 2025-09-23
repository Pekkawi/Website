import NextAuth from 'next-auth';

// Extend the built-in types

export type AuthUser = {
  id?: string;
  role?: string;
  access?: string;
} & DefaultSession['user'];

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: AuthUser;
  }

  declare module 'next-auth/jwt' {
    interface JWT {
      role?: string;
      access?: string;
    }
  }
}
