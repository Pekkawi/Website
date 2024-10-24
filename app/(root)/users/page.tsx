'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserType } from '@/interfaces/userpage.interfaces';
import { useQuery } from 'react-query';
import { Types } from 'mongoose';

import PageLoader from '@/components/shared/PageLoader';
import UserSearch from '@/components/User Page/UserSearch';
import UserPagination from '@/components/User Page/UserPagination';
import NoUsersFound from '@/components/User Page/NoUsersFound';
import ErrorFetchingUsers from '@/components/User Page/ErrorFetchingUser';
import { getPermissions } from '@/hooks/permissionHooks';
import { getUsers } from '@/hooks/userHooks';
import UserDetails from '@/components/User Page/UserDetails';

// Will be moved to a seperate file

const User2 = () => {
  const roles = ['User', 'Maintainer', 'Admin'];
  const [filteredUsers, setFilteredUsers] = useState<UserType[] | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [openUserId, setOpenUserId] = useState<Types.ObjectId | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const applyFilter = useCallback(
    (users: UserType[] | undefined) => {
      if (!users) return;

      if (searchTerm) {
        const filtered = users.filter(
          (user) =>
            user.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filtering
      } else {
        setFilteredUsers(users);
        setCurrentPage(1); // Reset to first page when clearing filter
      }
    },
    [searchTerm]
  );

  const {
    data: Users,
    status: statusUsers,
    refetch: refetchUsers,
  } = useQuery('users', getUsers, {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (Users) {
      applyFilter(Users);
    }
  }, [Users, searchTerm, applyFilter]);

  const { data: Permissions, status: statusPermissions } = useQuery(
    'permissions',
    getPermissions,
    {
      staleTime: Infinity,
    }
  );

  const handleToggle = (userId: Types.ObjectId) => {
    setOpenUserId(openUserId !== userId ? userId : null);
  };

  const handleRetry = () => {
    refetchUsers();
  };

  if (statusUsers === 'loading') {
    return <PageLoader />;
  }

  if (statusUsers === 'error') {
    return (
      <div>
        {' '}
        <ErrorFetchingUsers onRetry={handleRetry} />
      </div>
    );
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil((filteredUsers?.length || 0) / usersPerPage);

  const onPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setOpenUserId(null);
  };

  return (
    <div className="background background-light900_dark300 mt-[-30px]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="h1-bold text-dark100_light900">Users</h1>
        <UserSearch
          setFilteredUsers={setFilteredUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          applyFilter={() => applyFilter(Users)}
        />
        <section className="mt-7 rounded-sm border border-gray-200 bg-white shadow-md shadow-gray-300 dark:border-dark-400 dark:bg-dark-300 dark:shadow-gray-500">
          {!currentUsers || currentUsers.length === 0 ? (
            <NoUsersFound />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map((user, index) => (
                <div
                  key={`${user._id}`}
                  className={`${index === currentUsers.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  <div
                    className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-200"
                    onClick={() => handleToggle(user._id)}
                  >
                    <div className="flex flex-1 flex-col sm:flex-row sm:justify-between">
                      <p className="text-dark500_light700 font-medium">
                        {user.display_name}
                      </p>
                      <p className="user-info text-dark500_light700 font-medium sm:text-right">
                        {user.email}
                      </p>
                    </div>
                    <motion.span
                      className={`ml-4 shrink-0 text-gray-400`}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: openUserId === user._id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="size-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.span>
                  </div>
                  <AnimatePresence>
                    {openUserId === user._id && (
                      <UserDetails
                        handleToggle={handleToggle}
                        userId={user._id}
                        roles={roles}
                        Permissions={Permissions}
                        statusPermission={statusPermissions}
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </section>
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </motion.div>
    </div>
  );
};

// User Details Component will be moved to seperate file to reduce lines of code

export default User2;
