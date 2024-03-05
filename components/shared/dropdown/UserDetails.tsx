import React, { useState } from "react";
import { IUser } from "@/database/user.model";
import { Checkbox } from "@/components/ui/checkbox";
import { m, motion } from "framer-motion";
import { deleteUser } from "@/lib/actions/user.actions";
import { IPerm } from "@/database/permission.model";

type UserDetailsProps = {
  user: IUser;
  perms: IPerm;
  // Add any additional props you might need, such as a callback for when a user's details are updated
  // role:string
};

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [permss, setPermss] = useState<IPerm[]>([]);

  // Placeholder function for role change, implement according to your needs
  const changeUserRole = (newRole: string) => {
    console.log(`Changing role to ${newRole} for user ${user._id}`);
    // Implement role change logic here
  };

  return (
    <motion.div
      initial={{
        maxHeight: 0,
        opacity: 0,
        marginTop: 0,
      }}
      animate={{ maxHeight: 500, opacity: 1, marginTop: 0 }}
      exit={{ maxHeight: 0, opacity: 0, transition: { duration: 0.15 } }} // Adjust the duration to your desired value
      transition={{ duration: 0.4, delay: 0.2 }} // Add a delay to the transition
      className="user-dropdown-details flex flex-col justify-between overflow-hidden p-2"
    >
      <div className="static flex">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col">
            <h4>Card number</h4>
            <p className="font-extralight text-gray-400">{user.card_number}</p>
          </div>
          <div className="flex flex-col">
            <h4>Card ID</h4>
            <p className="font-extralight text-gray-400">{user.card_id}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {permss.map((permission) => {
            return (
              <div key={permission._id} className="items-center space-x-2">
                <Checkbox />
                <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {permission.abbreviation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-[-1rem] flex justify-end">
        {" "}
        {/* Added mt-2 class */}
        <button
          onClick={() => deleteUser(user._id)}
          className="rounded bg-red-600 px-3 py-1  font-bold text-white hover:bg-red-700 md:px-4 md:py-2"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default UserDetails;

/*  <div className="items-center space-x-2">
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
          </div> */
