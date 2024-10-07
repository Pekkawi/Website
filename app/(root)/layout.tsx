"use client";

import LeftSidebar from "@/components/shared/LeftSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider>
      <header></header>

      <main className="background-light850_dark100 relative">
        <Navbar />
        <SignedIn>
          <div className="flex">
            <LeftSidebar />

            <main className="flex min-h-screen flex-1 flex-col overflow-auto px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
              <div className="mx-auto w-full max-w-5xl">{children}</div>
            </main>
          </div>
        </SignedIn>
      </main>
    </ClerkProvider>
    </QueryClientProvider>
  );
};

export default Layout;
