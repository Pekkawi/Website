"use client";

import { UserHooks } from "@/hooks/UserHooks";
import { useState } from "react";

const Checkbox = ({
  labelAbr,
  labelName,
  isChecked,
  permId,
  userId,
}: {
  labelAbr: string;
  labelName: string;
  isChecked: boolean;
  permId: string;
  userId: string;
}) => {
  const [checked, setChecked] = useState(isChecked);
  const { changeUserPermission } = UserHooks();
  function handleRoleChange(isBoxChecked: boolean) {
    // Make this function only accesible by admins (Need to add authentication)
    // something loke if(user.role === "admin"){...}
    setChecked(isBoxChecked);
    changeUserPermission(permId, userId, isBoxChecked);
  }

  return (
    <label className="flex items-start space-x-3">
      <input
        type="checkbox"
        className="size-5 rounded border-gray-300 text-blue-600 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-gray-600 dark:text-blue-400"
        checked={checked}
        onChange={(e) => handleRoleChange(e.target.checked)}
      />
      <span className="text-gray-900 dark:text-gray-100">
        {labelAbr}:{labelName}
      </span>
    </label>
  );
};

export default Checkbox;
