'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';
import { MedicalLogos, LogoAnimations } from '../medical-logos';

const LogoShowcasePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Color palette for logos
  const primaryColors = [
    "#0d9488", // Teal
    "#0891b2", // Cyan
    "#0369a1", // Sky
    "#0284c7", // Light Blue
    "#059669", // Emerald
    "#047857", // Green
    "#0f766e", // Dark Teal
    "#0369a1", // Blue
    "#1d4ed8", // Royal Blue
    "#4f46e5", // Indigo
  ];

  const secondaryColors = [
    "#14b8a6", // Light Teal
    "#06b6d4", // Light Cyan
    "#0ea5e9", // Light Sky
    "#38bdf8", // Lighter Blue
    "#10b981", // Light Emerald
    "#34d399", // Light Green
    "#2dd4bf", // Bright Teal
    "#60a5fa", // Light Blue
    "#3b82f6", // Bright Blue
    "#6366f1", // Light Indigo
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <LogoAnimations />
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">MedConnect Logo Collection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
            Professional medical logos with animated and static versions
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(MedicalLogos).map(([name, Logo], index) => (
            <div 
              key={name}
              className={`p-8 rounded-lg border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-teal-500' 
                  : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'
              }`}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">{name} Logo</h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Static Version */}
                <div className="flex flex-col items-center">
                  <Logo 
                    primaryColor={primaryColors[index]} 
                    secondaryColor={secondaryColors[index]}
                    isAnimated={false}
                    className="w-24 h-24 mb-4"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Static Version</p>
                </div>

                {/* Animated Version */}
                <div className="flex flex-col items-center">
                  <Logo 
                    primaryColor={primaryColors[index]} 
                    secondaryColor={secondaryColors[index]}
                    isAnimated={true}
                    className="w-24 h-24 mb-4"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Animated Version</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoShowcasePage; 