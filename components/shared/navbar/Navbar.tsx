'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MobileNav from './MobileNav';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowRightEndOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  const isLoading = status === 'loading' || isAuthActionLoading;

  const handleSignIn = async () => {
    setIsAuthActionLoading(false);
    setIsAuthActionLoading(true);
    try {
      await signIn('microsoft-entra-id');
      // usually redirects, so we don't care about resetting the state here
    } catch (err) {
      console.error(err);
      setIsAuthActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsAuthActionLoading(false);
    setIsAuthActionLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error(err);
      setIsAuthActionLoading(false);
    }
  };

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 overflow-hidden p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className="h2-bold font-spaceGrotesk mx-5 text-dark-100 dark:text-light-900">
          The <span className="text-orange-500">Core</span>
        </p>
      </Link>

      <div className="flex-between gap-5">
        {status === 'authenticated' ? (
          <>
            {/* Username badge */}
            <p className="hidden items-center gap-2 rounded-full border border-orange-400/70 bg-orange-50/60 px-4 py-1 text-sm font-medium text-orange-600 shadow-sm dark:border-orange-500/60 dark:bg-orange-500/10 dark:text-orange-300 md:flex">
              <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              {session?.user?.name}
            </p>

            <Button
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex h-[48px] items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-orange-400 hover:bg-orange-50 hover:text-orange-500 active:border-orange-300 active:bg-orange-50 active:text-orange-300 md:px-3"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 animate-spin" />
              ) : (
                <ArrowRightEndOnRectangleIcon className="w-6" />
              )}
              <div className="hidden md:block">
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </div>
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex h-[48px] items-center justify-center gap-2 rounded-md p-3 text-sm font-medium text-orange-400 hover:bg-orange-50 hover:text-orange-500 active:border-orange-300 active:bg-orange-50 active:text-orange-300 md:px-3"
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 animate-spin" />
              ) : (
                <ArrowRightEndOnRectangleIcon className="w-6" />
              )}
              <div className="hidden md:block">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </div>
            </Button>
          </>
        )}

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
