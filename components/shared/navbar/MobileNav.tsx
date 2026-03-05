'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { sidebarLinks } from '@/constants';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const NavContent = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = (session?.user as any)?.role?.toLowerCase();

  const visibleLinks = useMemo(() => {
    // loading or unauthenticated => Home only
    if (status !== 'authenticated') {
      return sidebarLinks.filter((l) => l.route === '/');
    }
    // authenticated => role-based
    return sidebarLinks.filter((l) => l.allowedRoles.includes(role ?? ''));
  }, [status, role]);

  return (
    <section className="flex h-full flex-col gap-2 pt-6">
      {visibleLinks.map((item) => {
        const isActive =
          (pathname?.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
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
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>{item.label}</p>
            </Link>
          </SheetClose>
        );
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
        {/* ✅ Required for accessibility */}
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Mobile navigation</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>

        <Link href="/" className="flex items-center gap-1">
          <p className="h2-bold font-spaceGrotesk mx-5 text-dark-100 dark:text-light-900">
            The <span className="text-orange-500">Core</span>
          </p>
        </Link>

        <NavContent />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
