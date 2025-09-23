'use client';

import React from 'react';

import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import { useSession } from 'next-auth/react';

const NavContent = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        if (item.allowedRoles.includes(role)) {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) || // checks if it's not the home route
            pathname === item.route; // isActive will be whichever route we are currently on , in order highlight it in the navbar

          return (
            <SheetClose asChild key={item.route}>
              <Link
                href={item.route}
                className={`${
                  isActive
                    ? 'primary-gradient text-light-900 rounded-lg'
                    : 'text-dark300_light900'
                } flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? '' : 'invert-colors'}`}
                />
                <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>
                  {item.label}
                </p>
              </Link>
            </SheetClose>
          );
        }
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200 border-none">
        <Link href="/" className="flex items-center gap-1">
          <p className=" h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 mx-5">
            The <span className="text-orange-500">Core</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
