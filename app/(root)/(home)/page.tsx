"use client";

import { RestrictedAccess } from "@/components/shared/RestrictedAccess";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const isAdmin = user?.publicMetadata?.role === "Admin";

  return (
    <>
      <div className="background background-light900_dark300 h-[70vh]">
        {isAdmin ? (
          <div>
            <h1 className="page-header">Home</h1>
            <p className="text-dark100_light900 mt-5">
              The Official SDU Core Website
            </p>
          </div>
        ) : (
          <RestrictedAccess />
        )}
      </div>
    </>
  );
};

export default Home;
