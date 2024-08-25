"use client";

import { RestrictedAccess } from "@/components/shared/RestrictedAccess";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Nodes = () => {
  const { user, isLoaded } = useUser();

  const isAdmin = user?.publicMetadata?.role === "Admin";

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="background background-light900_dark300 h-[70vh]">
      {isAdmin ? (
        <>
          <h1 className="h1-bold text-dark100_light900">Permissions</h1>
          <p className="text-dark100_light900 my-5">All the permissions</p>
        </>
      ) : (
        <RestrictedAccess />
      )}
    </div>
  );
};

export default Nodes;
