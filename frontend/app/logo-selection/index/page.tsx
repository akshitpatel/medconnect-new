'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';
import MedConnectLogo from '../medconnect-logo';

// Logo Selection Index Page
const LogoSelectionIndex = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <MedConnectLogo 
              isAnimated={true}
              darkMode={isDarkMode}
              className="w-64 h-16"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Logo Selection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Choose from our collection of medical logos and healthcare icons</p>
          <button 
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md mb-6 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Official MedConnect Logo */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}>
            <div className="w-24 h-24 mx-auto mb-4">
              <MedConnectLogo 
                variant="icon"
                isAnimated={true}
                darkMode={isDarkMode}
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-bold mb-3">MedConnect Logo</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Our refined, subtle brand identity with a professional healthcare focus</p>
            <Link href="/logo-selection/medconnect-showcase">
              <button className="px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium">
                View Official Logo
              </button>
            </Link>
          </div>

          {/* Medical Logo Showcase */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}>
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <path 
                  d="M20 2C20 2 8 7 8 14V28C8 28 14 35 20 38C26 35 32 28 32 28V14C32 7 20 2 20 2Z" 
                  fill="#0d9488"
                />
                <path
                  d="M20 12V26M13 19H27"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="19" r="2.5" fill="#14b8a6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Medical Logo Collection</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Browse our collection of professional medical logos with animated variations</p>
            <Link href="/logo-selection/logo-showcase">
              <button className="px-6 py-3 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium">
                View Logo Collection
              </button>
            </Link>
          </div>

          {/* Advanced Medical Logos */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}>
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle
                  cx="20"
                  cy="20"
                  r="12"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />
                <circle cx="16" cy="14" r="1.5" fill="#06b6d4" />
                <circle cx="24" cy="14" r="1.5" fill="#06b6d4" />
                <circle cx="20" cy="12" r="1.5" fill="#06b6d4" />
                <circle cx="20" cy="18" r="1.5" fill="#06b6d4" />
                <circle cx="14" cy="18" r="1.5" fill="#06b6d4" />
                <circle cx="26" cy="18" r="1.5" fill="#06b6d4" />
                <path
                  d="M16 14L20 12M16 14L14 18M16 14L20 18M24 14L20 12M24 14L26 18M24 14L20 18M14 18L20 18M26 18L20 18"
                  stroke="#06b6d4"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Advanced Medical Logos</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Explore our specialized healthcare logos for modern medical applications</p>
            <Link href="/logo-selection/advanced-showcase">
              <button className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium">
                View Advanced Logos
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
            <Link href="/logo-selection/healthcare-icons">
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