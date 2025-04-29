'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';

// Logo Selection Index Page
const LogoSelectionIndex = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">MedConnect Logo Selection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Choose from our extensive collection of logo designs and healthcare icons</p>
          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md mb-6 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Original Logo Selection */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}>
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect x="8" y="18" width="24" height="4" rx="2" fill="#0d9488" />
                <rect x="18" y="8" width="4" height="24" rx="2" fill="#0d9488" />
                <circle cx="20" cy="20" r="3" fill="#14b8a6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Logo Collection</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Browse our extensive collection of logo designs with various styles and animations</p>
            <Link href="/logo-selection/page">
              <button className="px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium">
                View Logo Collection
              </button>
            </Link>
          </div>

          {/* Healthcare Icons */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}>
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect x="10" y="10" width="20" height="20" rx="2" fill="#0d9488" />
                <rect x="15" y="5" width="10" height="5" rx="1" fill="#0d9488" />
                <rect x="15" y="30" width="10" height="5" rx="1" fill="#0d9488" />
                <rect x="5" y="15" width="5" height="10" rx="1" fill="#0d9488" />
                <rect x="30" y="15" width="5" height="10" rx="1" fill="#0d9488" />
                <circle cx="20" cy="20" r="5" fill="#14b8a6" />
                <path d="M17 20 L23 20 M20 17 L20 23" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Healthcare Icons</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Specialized healthcare-themed animated icons for medical applications</p>
            <Link href="/logo-selection/healthcare-icons-page">
              <button className="px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium">
                View Healthcare Icons
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoSelectionIndex; 