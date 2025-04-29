'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/contexts/ThemeContext';
import MedConnectLogo from '../logo-selection/medconnect-logo';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`w-full py-4 px-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/">
            <div className="flex items-center">
              <MedConnectLogo 
                isAnimated={true}
                darkMode={isDarkMode}
                className="w-48 h-12"
              />
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex space-x-6 mr-6">
            <Link href="/" className="hover:text-teal-500 transition-colors">
              Home
            </Link>
            <Link href="/logo-selection" className="hover:text-teal-500 transition-colors">
              Logos
            </Link>
            <Link href="/about" className="hover:text-teal-500 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-teal-500 transition-colors">
              Contact
            </Link>
          </nav>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-md ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 