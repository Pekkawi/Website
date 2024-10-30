import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";

export const metadata: Metadata = {
  title: "The Core",
  description: "SDU The Core web Interface",
  icons: {
    icon: "/assets/images/oshinoco.png",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}