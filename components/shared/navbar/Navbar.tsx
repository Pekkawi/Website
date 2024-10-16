import React from 'react';
import Link from 'next/link';
import Theme from './Theme';
import MobileNav from './MobileNav';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 overflow-hidden p-6 shadow-light-300 dark:shadow-none sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className=" h2-bold mx-5 font-spaceGrotesk text-dark-100 dark:text-light-900">
          The <span className=" text-orange-500">Core</span>
        </p>
      </Link>
      <div className="flex-between gap-5">
        <Theme />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
