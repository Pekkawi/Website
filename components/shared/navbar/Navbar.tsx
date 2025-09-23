import React from 'react';
import Link from 'next/link';
// import Theme from './Theme';
import MobileNav from './MobileNav';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { PowerIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 overflow-hidden p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className=" h2-bold font-spaceGrotesk mx-5 text-dark-100 dark:text-light-900">
          The <span className=" text-orange-500">Core</span>
        </p>
      </Link>
      <div className="flex-between gap-5">
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex h-[48px] grow items-center justify-center gap-1  active:border-orange-300  text-orange-400 rounded-md  p-3 text-sm font-medium hover:bg-orange-50 hover:text-orange-500 active:bg-orange-50 active:text-orange-300 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <ArrowRightEndOnRectangleIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </Button>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
