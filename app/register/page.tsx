'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/actions/register';

export default function Register() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const r = await register({
      email: formData.get('email'),

      password: formData.get('password'),

      name: formData.get('name'),
    });

    ref.current?.reset();

    if (r?.error) {
      setError(r.error);
    } else {
      return router.push('/login');
    }
  };

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <form
        ref={ref}
        action={handleSubmit}
        className="flex w-full max-w-[400px] flex-col items-center justify-between gap-2 rounded 

        border border-solid border-black bg-white p-6"
      >
        {error && <div className="">{error}</div>}

        <h1 className="mb-5 w-full text-2xl font-bold">Register</h1>

        <label className="w-full text-sm">Full Name</label>

        <input
          type="text"
          placeholder="Full Name"
          className="h-8 w-full rounded border border-solid border-black px-2.5 py-1 text-[13px]"
          name="name"
        />

        <label className="w-full text-sm">Email</label>

        <input
          type="email"
          placeholder="Email"
          className="h-8 w-full rounded border border-solid border-black px-2.5 py-1"
          name="email"
        />

        <label className="w-full text-sm">Password</label>

        <div className="flex w-full">
          <input
            type="password"
            placeholder="Password"
            className="h-8 w-full rounded border border-solid border-black px-2.5 py-1"
            name="password"
          />
        </div>

        <button
          className="ease mt-2.5 w-full rounded border border-solid border-black

        py-1.5 transition duration-150 hover:bg-black"
        >
          Sign up
        </button>

        <Link
          href="/login"
          className="ease text-sm text-[#888] transition duration-150 hover:text-black"
        >
          Already have an account?
        </Link>
      </form>
    </section>
  );
}
