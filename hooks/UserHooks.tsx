import { useState, useEffect } from "react";
import { IUser } from "@/database/user.model";
import { usePermissions } from "./usePermissions";
import CryptoJS from 'crypto-js';

export const UserHooks = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { getPermissionById } = usePermissions();
  const encryptedMessage = CryptoJS.AES.encrypt(process.env.PUBLIC_NEXT_API_KEY||"",process.env.PUBLIC_NEXT_ENCRYPTION_KEY||"").toString();
  useEffect(() => {
    const fetchUsers = async () => {
      
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
         "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY  || "",
        },
      });
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers(); // Executes fetchUsers function in order for the users to be fetched
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
           "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
         },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }; // Deletes a user from the database based on a userId

  const changeUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
         },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        setUsers(
          users.map((user) => {
            if (user._id === userId) {
              user.role = role;
            }
            return user;
          })
        );
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const changeUserPermission = async (
    permissionId: string,
    userId: string,
    isChecked: boolean
  ) => {
    try {
      const response = await fetch("api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
           "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
         },
        body: JSON.stringify({ permissionId, userId, isChecked }),
      });

      if (response.ok) {
        const permission = await getPermissionById(permissionId);

        if (!permission) {
          console.error("Permission not found");
          return;
        }

        setUsers(
          users.map((user) => {
            if (user._id === userId) {
              if (isChecked) {
                user.permissions = [...(user.permissions || []), permission];
                console.log(user.permissions);
              } else {
                user.permissions = user.permissions?.filter(
                  (perm) => perm._id !== permissionId
                );
                console.log(user.permissions);
              }
            }
            return user;
          })
        );
      } else {
        console.error("Error changing user permission");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return { users, deleteUser, changeUserPermission, changeUserRole };
};

