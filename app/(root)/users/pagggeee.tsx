"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IPerm, IUser } from "@/interfaces/database.interfaces";
import { UserType } from "@/interfaces/userpage.interfaces";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Types } from "mongoose";
import RoleSelector from "@/components/User Page/RoleSelector";
import UserCheckBox from "@/components/User Page/UserCheckBox";
import PageLoader from "@/components/shared/PageLoader";
import DropDownLoading from "@/components/User Page/DropDownLoading";
import UserSearch from "@/components/User Page/UserSearch";
import UserPagination from "@/components/User Page/UserPagination";
import NoUsersFound from "@/components/User Page/NoUsersFound";


// Will be moved to a seperate file
async function getUsers(): Promise<UserType[] | undefined> {
  try {
    const res = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    return data;
  } catch(err) {
    return undefined;
  }
}

// Will be moved to a seperate file
async function deleteUser(id: Types.ObjectId): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return res.ok;
  } catch(err) {
    return false;
  }
}

// Will be moved to a seperate file
async function getUserDetails(id: Types.ObjectId): Promise<IUser | undefined> {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();
    return data;
  } catch(err) {
    return undefined;
  }
}

 // Will be moved to a seperate file
async function getPermissions(): Promise<IPerm[] | undefined> {
  try {
    const res = await fetch('/api/permissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();
    return data;
  } catch(err) {
    return undefined;
  }
}

const User2 = () => {
  const roles = ['User', 'Maintainer', 'Admin'];
  const [filteredUsers, setFilteredUsers] = useState<UserType[] | undefined>();
  const [openUserId, setOpenUserId] = useState<Types.ObjectId | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 12;

  const { data: Users, status: statusUsers } = useQuery('users', getUsers, {
    staleTime: Infinity,
    onSuccess: (Users) => {
      setFilteredUsers(Users);
    }
  });

  const { data: Permissions, status: statusPermissions } = useQuery('permissions', getPermissions, {
    staleTime: Infinity,
  });

  const handleToggle = (userId: Types.ObjectId) => {
    setOpenUserId(openUserId !== userId ? userId : null);
  };

  if (statusUsers === 'loading') {
    return <PageLoader />;
  }

  if (statusUsers === 'error') {
    return <div>Error fetching data</div>;
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
    <div className="background background-light900_dark300 h-auto">
      <h1 className="h1-bold text-dark100_light900">Users</h1>
      <UserSearch setFilteredUsers={setFilteredUsers} />
      <section className="mt-7 border border-gray-200 p-4 shadow-md shadow-gray-300 dark:border-dark-400 dark:shadow dark:shadow-gray-500">
        {currentUsers?.length === 0 ? (
          <NoUsersFound />
        ) : (
          currentUsers?.map((user) => (
            <div key={`${user._id}`} className="border-b-2 border-gray-300">
              <div className="flex space-x-40 p-4 max-mmd:items-start" onClick={() => handleToggle(user._id)}>
                <div className="flex flex-1 max-mmd:flex-col">
                  <p className="text-dark500_light700 font-medium">
                    {user.display_name}
                  </p>
                  <p className="user-info text-dark500_light700 text-right font-medium max-mmd:text-left">
                    {user.email}
                  </p>
                </div>
                <motion.span
                  className={`${openUserId === user._id ? "rotate-180" : "rotate-0"} max-xs:hidden`}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: openUserId === user._id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="size-5 text-gray-400"
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
          ))
        )}
      </section>
      <UserPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};


 // User Details Component will be moved to seperate file to reduce lines of code
const UserDetails = ({
  userId,
  roles,
  Permissions,
  statusPermission,
  handleToggle
}: {
  userId: Types.ObjectId,
  roles: string[],
  Permissions: IPerm[] | undefined,
  statusPermission: "idle" | "error" | "loading" | "success",
  handleToggle: (userId: Types.ObjectId) => void
}) => {
  const { data, status } = useQuery(['DetailsUser', userId], () => getUserDetails(userId), {
    enabled: !!userId,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();
  const deleteUserMutation = useMutation(() => deleteUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['DetailsUser', userId]);
    },
  });

  if (status === 'loading' || statusPermission === 'loading') {
    return <DropDownLoading />;
  }
  if (status === 'error' || statusPermission === 'error') {
    return <div>Error fetching data</div>;
  }
  
  return (
    <motion.div
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: "auto" },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative overflow-hidden"
    >
      <div className="relative grid grid-cols-1 justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-2 mmd:grid-rows-1">
        <div className="absolute left-3 top-6">
          <RoleSelector userId={userId} userRole={data?.user?.role} roles={roles} />
        </div>
        <button
          className="absolute bottom-5 right-10 rounded bg-red-600 px-3 py-1 font-bold text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2"
          onClick={() => {
            handleToggle(userId);
            deleteUserMutation.mutate();
          }}
        >
          Delete
        </button>
        <div className="">
          <div className="mt-20">
            <h4 className="text-dark100_light900">Card number</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {data?.user?.card_number}
            </p>
          </div>
          <div className="mb-5 mt-6">
            <h4 className="text-dark100_light900">Card ID</h4>
            <p className="font-extralight text-gray-400 dark:text-gray-600">
              {data?.user?.card_id}
            </p>
          </div>
        </div>
        <div className="mmd:relative mmd:bottom-12">
          <div>
            {Permissions?.map((permission) => (
              <div key={`${permission._id}`} className="mt-2">
                <UserCheckBox
                  Permission={permission}
                  UsersPermissions={data?.user?.permissions || []}
                  userId={data?.user?._id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default User2;