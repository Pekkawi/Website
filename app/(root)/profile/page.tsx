'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import PageLoader from '@/components/shared/PageLoader';
import { useQuery } from 'react-query';
import { getUser } from '@/hooks/userHooks';
import { motion } from 'framer-motion';
import { IUser } from '@/interfaces/database.interfaces';

const Profile = () => {
  const { data: session, status: sessionStatus } = useSession();

  const name = session?.user?.name;
  console.log(session);
  const { data: user, status: userStatus } = useQuery<Partial<IUser>>(
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
        <p className="mb-10 text-gray-600 dark:text-gray-400">Your account details</p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Field component */}
          {[
            { label: 'Name', value: user.user.display_name },
            { label: 'Email', value: user.user.email },
            { label: 'Role', value: user.user.role },
            { label: 'Card Number', value: user.user.card_number },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-light-800 bg-light-900 p-5 shadow-sm
                       dark:border-dark-400 dark:bg-dark-200"
            >
              <h4 className="text-dark100_light900 font-semibold">{item.label}</h4>
              <p className="mt-1 font-light text-gray-500 dark:text-gray-400">
                {item.value || 'Unavailable'}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
