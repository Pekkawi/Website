/* "use client";
import { IUser } from "@/database/user.model";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { BiChevronDown } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Role = {
  value: string;
  label: string;
};

const roles: Role[] = [
  {
    value: "user",
    label: "User",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

const DropDown = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [CompOpen, setCompOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  function capatalizeFirstLetter(word: String) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const toggleUserDetails = (userId: string) => {
    setIsOpen(isOpen === userId ? null : userId);
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();

      if (response.ok) {
        // Update the state to reflect the deletion
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        // Handle errors
        console.error(result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <section className="mt-7 border border-gray-200 p-4  shadow-md shadow-gray-300">
        {users.map((user) => {
          return (
            <div
              key={user._id}
              className=" border-b-2 border-gray-300  last:mb-0"
            >
              <div
                onClick={() => toggleUserDetails(user._id)}
                className="user-header flex cursor-pointer items-center justify-between p-2"
              >
                <div className="user-info flex-1">
                  <h3 className="font-medium">{user.display_name}</h3>
                </div>
                <div className="user-info flex-1 pr-8">
                  <h3 className="text-right font-medium">{user.email}</h3>
                </div>
                <motion.div
                  animate={{
                    rotate: isOpen === user._id ? 180 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <BiChevronDown className="text-2xl"></BiChevronDown>
                </motion.div>
              </div>

              <AnimatePresence>
                {isOpen === user._id && (
                  <motion.div
                    initial={{ maxHeight: 0, marginTop: 0, opacity: 0 }}
                    animate={{ maxHeight: 500, marginTop: 5, opacity: 1 }} // Adjust maxHeight and marginTop as needed
                    exit={{ maxHeight: 0, marginTop: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }} // Shorter duration for quicker animation
                    className="user-dropdown-details overflow-hidden p-2"
                  >
                    <div className="static flex">
                      
                      <div className="flex  flex-1 flex-col gap-2">
                        <div className="flex flex-col ">
                          <h4>Role</h4>

                          <Popover open={CompOpen} onOpenChange={setCompOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-[150px] justify-start"
                              >
                                {selectedRole ? (
                                  <>{selectedRole.label}</>
                                ) : (
                                  <>{capatalizeFirstLetter(user.role)}</>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="p-0"
                              side="right"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Change status..." />
                                <CommandList>
                                  <CommandEmpty>No results found.</CommandEmpty>
                                  <CommandGroup>
                                    {roles.map((role) => (
                                      <CommandItem
                                        key={role.value}
                                        onSelect={(value) => {
                                          setSelectedRole(
                                            roles.find(
                                              (priority) =>
                                                priority.value === value
                                            ) || null
                                          );
                                          setCompOpen(false);
                                        }}
                                      >
                                        {role.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-col  ">
                          <h4>Card number</h4>
                          <p className="font-extralight text-gray-400">
                            {user.card_number}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <h4>Card ID</h4>
                          <p className="font-extralight text-gray-400">
                            {user.card_id}
                          </p>
                        </div>
                      </div>

                    
                      <div className=" flex flex-1 flex-col gap-1">
                        {/*  permissions.map((perms)=>{
                              return(

                              )

                            })
                          *}

                        <div className="items-center space-x-2">
                          <Checkbox />
                          <label
                            htmlFor="DRL"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            LAS: Laser cutters
                          </label>
                        </div>
                        <div className="items-center space-x-2">
                          <Checkbox />
                          <label
                            htmlFor="DRL"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            SLA: Stereolithography 3D printers
                          </label>
                        </div>
                      </div>

                      <div className="relative right-[2rem] top-[8rem]">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="rounded bg-red-600 px-3 py-1  font-bold text-white hover:bg-red-700 md:px-4 md:py-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default DropDown;

*/

import UserListItem from "@/components/shared/dropdown/UserListItem";
import { UserHooks } from "@/hooks/UserHooks";
import { useState } from "react";

const DropDown = () => {
  const { users, deleteUser } = UserHooks();

  const [openUserId, setOpenUserId] = useState(null);

  const handleToggle = (userId: any) => {
    if (openUserId === userId) {
      setOpenUserId(null); // Close the dropdown if it's already open
    } else {
      setOpenUserId(userId); // Open the new one and close the previous one
    }
  };
  return (
    <div>
      <section className="mt-7 border border-gray-200 p-4 shadow-md shadow-gray-300">
        {users.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            onDelete={deleteUser}
            isOpen={openUserId === user._id}
            onToggle={() => handleToggle(user._id)}
          />
        ))}
      </section>
    </div>
  );
};

export default DropDown;
