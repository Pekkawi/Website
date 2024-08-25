import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google"; // False positive from EsLint , it is in camel case

import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} `}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
