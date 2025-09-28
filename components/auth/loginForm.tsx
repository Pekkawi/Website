'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from '../ui/button';
import { useActionState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { authenticate } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import Link from 'next/link';
import Loader from '../shared/utility/Loader';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
  return (
    <>
      <form action={formAction} className="space-y-3">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-[-10px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <div className="relative">
                  <Input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm ring-orange-300  placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 ring-orange-300 placeholder:text-gray-500"
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
                className="click w-full bg-orange-500 text-white hover:bg-orange-400  active:bg-orange-300"
              >
                {isPending && (
                  <>
                    <Loader />
                    Login...
                  </>
                )}
                {!isPending && 'Login'}
              </Button>
              <div>
                <p className="text-gray-400">
                  Do not have an account?{' '}
                  <Link
                    href={'/register'}
                    className="text-black underline hover:text-gray-500"
                  >
                    {' '}
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="flex space-x-1">
                {errorMessage && (
                  <>
                    <ExclamationCircleIcon className="size-5 text-red-500" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
