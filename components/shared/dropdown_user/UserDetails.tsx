import React from "react";
import { IUser } from "@/database/user.model";
import { AnimatePresence, motion } from "framer-motion";
import RoleSelector from "./RoleSelector";
import { usePermissions } from "@/hooks/usePermissions";
import Checkbox from "@/components/ui/checkbox";

type UserDetailsProps = {
  user: IUser;
  onDelete: (userId: string) => Promise<void>;
  isOpen: boolean;
};

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onDelete,
  isOpen,
}) => {
  const { permissions } = usePermissions();

  function checkPermissions(
    permission: string,
    userPermission: string[] | undefined
  ): boolean {
    return userPermission?.includes(permission) ?? false; // Check if the user has a specific permission returns True or False
  } // if it is undefined it returns false

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: "0px" },
          }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 0 }}
          className="relative overflow-hidden "
        >
          <div className="relative grid grid-cols-1  justify-items-start px-4 pb-7 md:items-baseline mmd:grid-cols-2 mmd:grid-rows-1">
            <div className="absolute left-3 top-6">
              <RoleSelector user={user} />
            </div>
            <button
              onClick={() => onDelete(user._id)}
              className="  absolute bottom-5 right-10 rounded bg-red-600 px-3 py-1  font-bold text-white hover:bg-red-700 md:px-4 md:py-2 xl:px-7 xl:py-2"
            >
              Delete
            </button>
            <div className="">
              <div className="mt-20">
                <h4 className="text-dark100_light900">Card number</h4>
                <p className="font-extralight text-gray-400 dark:text-gray-600">
                  {user.card_number}
                </p>
              </div>
              <div className="mb-5 mt-6">
                <h4 className="text-dark100_light900">Card ID</h4>
                <p className="font-extralight text-gray-400 dark:text-gray-600">
                  {user.card_id}
                </p>
              </div>
            </div>
            <div className="mmd:relative mmd:bottom-12">
              <div>
                {permissions.map((perm) => (
                  <div key={perm.id} className="mt-2">
                    <Checkbox
                      labelAbr={perm.abbreviation.toString()} // label abbreviation
                      labelName={perm.name.toString()} // label name
                      isChecked={checkPermissions(
                        // Check if user has permission
                        perm.abbreviation.toString(),
                        user.permissions?.map((p) => p.abbreviation.toString())
                      )}
                      permId={perm._id} // permission id
                      userId={user._id} // user id
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetails;
