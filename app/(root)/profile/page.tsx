'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import PageLoader from '@/components/shared/PageLoader';
import { useQuery } from 'react-query';
import { getUser } from '@/hooks/userHooks';
import { motion } from 'framer-motion';
import UserPermissionTable from '@/components/Profile Page/UserPermissionTable';

const Profile = () => {
  const { data: session, status: sessionStatus } = useSession();

  const name = session?.user?.name;
  console.log(session);
  const { data: user, status: userStatus } = useQuery(
    ['user'],
    () => getUser(name),

    {
      enabled: !!name, // makes sure name exists before sending the request, to avoid sending a bad request
      staleTime: Infinity,
    }
  );

  if (sessionStatus === 'loading' || userStatus === 'loading') {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="mt-10 text-center text-gray-500">Could not load user data.</div>
    );
  }

  return (
    <div className="background background-light900_dark300 mt-[-30px] min-h-[70vh] p-10">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="h1-bold text-dark100_light900 mb-2">Profile</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Here you can view your account details.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Name', value: user.user.display_name },
            { label: 'Email', value: user.user.email },
            {
              label: 'Role',
              value: user.user.role.charAt(0).toUpperCase() + user.user.role.slice(1),
            },
            { label: 'Card Number', value: user.user.card_number },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 break-words text-sm font-medium text-slate-900 dark:text-slate-50">
                {item.value || 'Unavailable'}
              </p>
            </div>
          ))}
        </div>

        <div>
          <UserPermissionTable userPermissions={user.user.permissions} />
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
