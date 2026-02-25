import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

// const CARD_ID_CLAIM = 'extension_507ec957a35b4f4e8251339ee1e5fe2f_sduAppMyFairID';
// const CARD_NO_CLAIM = 'extension_507ec957a35b4f4e8251339ee1e5fe2f_sduRealCardNo';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
      authorization: {
        params: {
          scope: 'openid profile email offline_access',
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

  session: { strategy: 'jwt' }, // All the information about the user that you'll receive from microsoft will be stored in a JSON Webtoken

  jwt: { maxAge: 60 * 60 * 24 }, // time is in second so: 60 * 60 * 24 = 1 day
  debug: true, // this is only for debugging during testing. Exclude it completely or set it to false for deployment.

  callbacks: {
    async signIn({ user,  profile }) {
      try {
        const db = client.db(); // uses default DB from your URI
        const users = db.collection('users');

        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          await users.insertOne({
            email: user.email,
            name: user.name,
            entraId: (profile as any)?.sub ?? (profile as any)?.oid,
            role: 'pending',          // or whatever default role you use
            cardId: null,             // populate later from Entra extension attrs
            createdAt: new Date(),
          });
        }

        return true; // allow sign in
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false; // block sign in on DB error
      }
    },


});

