"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import UserDetails from "@/components/shared/dropdown_user/UserDetails";
import { useUser } from "@clerk/nextjs";
import { RestrictedAccess } from "@/components/shared/RestrictedAccess";
import { UserHooks } from "@/hooks/UserHooks";

const Users = () => {
  const { user, isLoaded } = useUser();
  const { users, deleteUser } = UserHooks();
  const [openUserId, setOpenUserId] = useState(null);

  const isAdmin = user?.publicMetadata?.role === "Admin";

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleToggle = (userId: any) => {
    if (openUserId === userId) {
      setOpenUserId(null); // Close the dropdown if it's already open
    } else {
      setOpenUserId(userId); // Open the new one and close the previous one
    }
  };

  return (
    <div className="background background-light900_dark300  h-[70vh]">
      {isAdmin ? (
        <>
          <h1 className="h1-bold text-dark100_light900">Users</h1>
          <div>
            <section className="mt-7 p-4 border border-gray-200 shadow-md shadow-gray-300 dark:border-dark-400 dark:shadow-gray-500 dark:shadow">
              {users.map((user) => {
                const isOpen = openUserId === user._id;
                return (
                  <div key={user._id} className="border-b-2 border-gray-300">
                    <div
                      onClick={() => handleToggle(user._id)}
                      className="flex p-4 space-x-40 max-mmd:items-start"
                    >
                      <div className="flex flex-1 max-mmd:flex-col">
                        <p className="text-dark500_light700 font-medium">
                          {user.display_name}
                        </p>
                        <p className="user-info font-medium text-dark500_light700 text-right max-mmd:text-left">
                          {user.email}
                        </p>
                      </div>
                      <motion.span
                        className={`${
                          isOpen ? "rotate-180" : "rotate-0"
                        } max-xs:hidden`}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: isOpen ? 180 : 0 }}
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
                    <UserDetails
                      user={user}
                      onDelete={deleteUser}
                      isOpen={isOpen}
                    />
                  </div>
                );
              })}
            </section>
          </div>
        </>
      ) : (
        <RestrictedAccess />
      )}
    </div>
  );
};

export default Users;
