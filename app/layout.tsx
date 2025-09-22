import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Provider } from './provider';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'The Core',
  description: 'The Core Web Interface',
  icons: {
    icon: '/assets/images/oshinoco.png',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  console.log(session);
  if (!session) {
    console.log('No session atm');
  } else {
    console.log("The user of the session's current role is:", session?.user?.role);
  }

  return (
    <html lang="en">
      <body className="font-inter">
        <Provider>
          <ThemeProvider>{children}</ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
