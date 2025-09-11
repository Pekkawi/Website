import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './lib/mongoose';
import UserCredentials from './database/usercredential.model';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from './lib/db';

await connectToDatabase();

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(client),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          await connectToDatabase();

          const usercredentials = await UserCredentials.findOne({
            email,
          }).select('+password');

          if (!usercredentials) return null;

          const passwordsMatch = await bcrypt.compare(password, usercredentials.password);
          if (!passwordsMatch) return null;

          return usercredentials;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.uid as string | undefined;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds
    maxAge: 60 * 60 * 24,
  },
});
