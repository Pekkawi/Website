import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
});

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   ...authConfig,
//   adapter: MongoDBAdapter(client),
//   providers: [
//     Credentials({
//       name: 'Credentials',

//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },

//       async authorize(credentials) {
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);

//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;

//           await connectToDatabase();

//           const usercredentials = await UserCredentials.findOne({
//             email,
//           }).select('+password');
//           if (!usercredentials) return null;

//           const passwordsMatch = await bcrypt.compare(password, usercredentials.password);
//           if (!passwordsMatch) return null;

//           return {
//             id: usercredentials._id.toString(),
//             name: usercredentials.name,
//             email: usercredentials.email,
//             role: usercredentials.role,
//             access: usercredentials.access,
//           };
//         }

//         return null;
//       },
//     }),
//   ],

//   session: { strategy: 'jwt' },
//   jwt: {
//     // The maximum age of the NextAuth.js issued JWT in seconds
//     // maxAge: 60 * 60 * 24,
//     maxAge: 60 * 60 * 24,
//   },
// });
