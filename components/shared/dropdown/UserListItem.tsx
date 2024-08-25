import React from "react";
import { IUser } from "@/database/user.model";
import UserDetails from "@/components/shared/dropdown/UserDetails"; // Assume UserDetails is implemented
import { AnimatePresence, motion } from "framer-motion";

type UserListItemProps = {
  user: IUser;
  onDelete: (userId: string) => Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
};

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  onDelete,
  isOpen,
  onToggle,
}) => {
  const perms = user.permissions;
  return (
    <div key={user._id} className="border-b-2 border-gray-300 last:mb-0">
      <div
        onClick={onToggle}
        className="user-header flex cursor-pointer items-center justify-between p-2"
      >
        <h3 className="font-medium">{user.display_name}</h3>
        <div className="user-info flex-1 pr-8">
          <h3 className="text-right font-medium">{user.email}</h3>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "160px" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <UserDetails user={user} onDelete={onDelete} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserListItem;
