import { signIn } from '@/auth';

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('microsoft-entra-id', { redirectTo: '/' });
      }}
    >
      <button type="submit">Signin with Microsoft Entra ID</button>
    </form>
  );
}
