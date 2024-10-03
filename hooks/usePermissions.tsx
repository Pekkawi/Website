import { useState, useEffect } from "react";
import { IPerm } from "@/database/permission.model";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<IPerm[]>([]);
  useEffect(() => {
    const fetchPerms = async () => {
      const response = await fetch("/api/permissions");
      const data = await response.json();
      setPermissions(data);
    };

    fetchPerms();
  }, []);

  const getPermissionById = async (
    permissionId: string
  ): Promise<IPerm | undefined> => {
    try {
      const response = await fetch(`/api/permissions/${permissionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
         },
      });
      if (!response.ok) {
        throw new Error(
          `Error fetching permission with ID ${permissionId}: ${response.statusText}`
        );
      }
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("Failed to fetch permission by ID:", error);
      return undefined;
    }
  };

  return { permissions, getPermissionById };
};
