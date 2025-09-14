'use client';
import { Suspense, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/actions/register';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  KeyIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PageLoader from '@/components/shared/PageLoader';
import Loader from '../shared/utility/Loader';

export default function RegistrationForm() {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const r = await register({
      email: formData.get('email'),

      password: formData.get('password'),

      name: formData.get('name'),
    });
    setIsLoading(false);
    ref.current?.reset();

    if (r?.error) {
      setError(r.error);
    } else {
      return router.push('/login');
    }
  };

  return (
    <section className="flex flex-row justify-center items-center md:h-screen ">
      <Suspense fallback={<PageLoader />}>
        <form
          ref={ref}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}
          className="space-y-3"
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Register</CardTitle>
              <CardDescription>
                Enter a name, email and password to register an account.
              </CardDescription>
            </CardHeader>

            <CardContent className="my-[-10px]">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name"> Name</Label>
                  <div className="relative">
                    <Input
                      className="peer block w-full rounded-md border ring-orange-300 border-gray-200  py-[9px] pl-10 text-sm  placeholder:text-gray-500"
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                    />
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email"> Email</Label>
                  <div className="relative">
                    <Input
                      className="peer block w-full rounded-md border ring-orange-300 border-gray-200 py-[9px] pl-10 text-sm  placeholder:text-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                    />
                    <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      className="peer block w-full rounded-md border ring-orange-300 border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                    <KeyIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
                </div>
                <Input type="hidden" name="redirectTo" value={callbackUrl} />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-300  click"
                >
                  {isLoading && (
                    <>
                      <Loader />
                      Registering...
                    </>
                  )}
                  {!isLoading && 'Register'}
                </Button>
                <div>
                  <p className="text-gray-400">
                    Already have an account?{' '}
                    <Link
                      href={'/login'}
                      className="text-black underline hover:text-gray-500"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
                <div className="flex space-x-1">
                  {error && (
                    <>
                      <ExclamationCircleIcon className="size-5 text-red-500" />
                      <p className="text-sm text-red-500">{error}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Suspense>
    </section>
  );
}
