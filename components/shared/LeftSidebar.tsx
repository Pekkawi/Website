'use client';

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const SidebarSkeleton = () => {
  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            {/* Icon skeleton */}
            <div className="size-7 rounded bg-gray-300 dark:bg-gray-700"></div>
            {/* Text skeleton */}
            <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-700 max-lg:hidden"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

const LeftSidebar = () => {
  // ALL HOOKS MUST BE AT THE TOP, BEFORE ANY CONDITIONS OR RETURNS
  const pathname = usePathname();
  const { data: session, status } = useSession();
  // const role = session?.user?.role;

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     update();
  //     setTimeout(() => console.log('Updating....'), 100);
  //   }
  // });

  // NOW we can do conditional returns, AFTER all hooks have been called
  // if (status === 'loading' || status === 'unauthenticated') {
  //   return <SidebarSkeleton />;
  // }

  // if (status === 'loading') {
  //   return <SidebarSkeleton />;
  // }

  return (
    <section className="background-light900_dark200 light-border custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6 ">
        {sidebarLinks.map((item) => {
          if (pathname) {
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) || // checks if it's not the home route
              pathname === item.route; // isActive will be whichever route we are currently on , in order highlight it in the navbar

            if (status === 'authenticated') {
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
            } else if (status === 'loading' || status === 'unauthenticated') {
              if (item.route === '/') {
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
              }
            }
          }
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
