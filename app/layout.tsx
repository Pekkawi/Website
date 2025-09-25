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
