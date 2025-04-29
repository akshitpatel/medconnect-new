'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';

// Logo Collection Page
const LogoCollectionPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">MedConnect Logo Collection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Browse our extensive collection of logo designs</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
            >
              Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
            <Link href="/logo-selection">
              <button className="px-4 py-2 rounded-md bg-teal-600 hover:bg-teal-700 text-white">
                Back to Logo Selection
              </button>
            </Link>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Original Logo Collection</h2>
          <p className="text-center mb-8">This page would display the original logo collection from the backup file.</p>
          
          <div className="flex justify-center">
            <Link href="/logo-selection/healthcare-icons">
              <button className="px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium">
                View Healthcare Icons
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LogoCollectionPage; 