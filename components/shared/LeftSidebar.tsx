'use client';

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const LeftSidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role?.toLowerCase();

  const visibleLinks = useMemo(() => {
    // Loading OR unauthenticated -> only Home
    if (status !== 'authenticated') {
      return sidebarLinks.filter((l) => l.route === '/');
    }

    // Authenticated -> role-based links
    return sidebarLinks.filter((l) => l.allowedRoles.includes(role ?? ''));
  }, [status, role]);

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {visibleLinks.map((item) => {
          const isActive =
            (pathname?.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            <Link
              key={item.route}
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
                width={28}
                height={28}
                className={`${isActive ? '' : 'invert-colors'}`}
              />
              <p className="base-medium max-lg:hidden">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
