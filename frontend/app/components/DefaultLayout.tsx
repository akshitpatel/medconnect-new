'use client';

import React, { ReactNode } from 'react';
import { Navbar } from './ui/Navbar';
import { ThemeProvider } from '@/app/contexts/ThemeContext';

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
} 