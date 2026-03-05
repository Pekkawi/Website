import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import { connectToDatabase } from './lib/mongoose';
import User from './database/user.model';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
      authorization: {
        params: {
          scope: 'openid profile email',
          response_type: 'code',
        },
      },
      checks: ['state'],

      async profile(profile) {
        console.log('ENTRA PROFILE (userinfo/profile):', profile);
        return {
          azure_id: (profile as any).oid, // in MongoDB it was previously saved as azure_id, so we keep the same name
          name: (profile as any).name,
          email: (profile as any).email ?? (profile as any).preferred_username, // when receiving the profile the 'email' and 'preferred_username' are the exact same

          // Yes, the way we receive these parameters and the way they are saved is different for some reason :/
          // In some cases people do not have cards for a certain email, example: you are a student helper and you didnt receive a work card
          // but you should still be able to login to the website. And histroically on the previous system card_number = null and card_id = '' if no card existed
          // so we are keeping the same convented
          card_number: (profile as any).Card_ID ?? null,
          card_id: (profile as any).Card_number ?? '',
        };
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 60 * 15 }, // All the information about the user that you'll receive from microsoft will be stored in a JSON Webtoken

  jwt: { maxAge: 60 * 15 }, // time is in second so: 60 * 15 = 15 minutes
  debug: false, // this is only for debugging during testing. Exclude it completely or set it to false for deployment.

  // This entire callback function basically creates a new User in the DB if it does not already exist.
  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectToDatabase();

        function word_split(full_name: string) {
          const parts = full_name.trim().split(/\s+/).filter(Boolean);
          return [
            parts.length ? parts.slice(0, -1).join(' ') || parts[0] : '',
            parts.length > 1 ? parts.at(-1) : '',
          ];
        }

        const fullName = (profile as any)?.name ?? '';
        const [first_name, last_name] = word_split(fullName);

        const azure_id = (profile as any)?.oid;
        const existingUser = await User.findOne({ azure_id });

        if (!existingUser) {
          console.log('CREATING NEW USER…');

          try {
            const created = await User.create({
              azure_id,
              first_name,
              last_name,
              display_name: fullName,
              email: (profile as any)?.email ?? (profile as any)?.preferred_username,
              card_number: (profile as any)?.Card_ID ?? null,
              card_id: (profile as any)?.Card_number ?? '',
            });

            // success check
            if (!created?._id) {
              console.error('Create returned no _id (unexpected)');
              return false;
            }

            console.log('USER CREATED ✅', created._id.toString());
          } catch (createErr: any) {
            console.error('USER CREATE FAILED ❌', createErr);

            // optional: if it failed because it already exists (race condition), allow sign-in
            if (createErr?.code === 11000) {
              console.warn('Duplicate key during create — treating as success.');
              return true;
            }
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error('signIn error:', error);
        return false;
      }
    },

    async jwt({ token, profile }) {
      // On first sign-in, token will have identifiers we can use
      // (profile is typically present on initial login)
      if (profile) {
        const azure_id = (profile as any)?.oid;

        if (azure_id) {
          await connectToDatabase();
          const dbUser = await User.findOne({ azure_id }).select('role azure_id _id');

          // Persist into the JWT
          token.azure_id = azure_id;
          token.role = dbUser?.role ?? 'user';
          token._id = dbUser?._id?.toString();
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Expose it to the client
      if (session.user) {
        (session.user as any).azure_id = token.azure_id;
        (session.user as any).role = token.role;
        (session.user as any)._id = token._id;
      }
      return session;
    },
  },
});
