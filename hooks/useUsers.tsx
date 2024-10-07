import { useState, useEffect } from "react";
import { IUser } from "@/database/user.model";

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => { 
    const fetchUsers = async () => {
      const response = await fetch("/api/users",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  return { users, deleteUser };
};
