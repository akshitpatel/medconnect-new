'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';
import { createHealthcareIcons } from '../healthcare-icons';

// Healthcare Icons Display Page
const HealthcareIconsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Common size styling for all logos
  const logoContainerStyle = "w-full p-6 rounded-lg border transition-all duration-300 flex flex-col items-center";
  const logoStyle = "w-16 h-16 mb-3";
  
  // Color palette for logos
  const primaryColors = [
    "#0d9488", // Teal
    "#0891b2", // Cyan
    "#0369a1", // Sky
    "#0284c7", // Light Blue
    "#059669", // Emerald
  ];
  
  const secondaryColors = [
    "#14b8a6", // Light Teal
    "#06b6d4", // Light Cyan
    "#0ea5e9", // Light Sky
    "#38bdf8", // Lighter Blue
    "#10b981", // Light Emerald
  ];

  // Initialize healthcare icons
  const healthcareIcons = createHealthcareIcons(primaryColors, secondaryColors, logoStyle);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">MedConnect Healthcare Icons</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Specialized healthcare-themed animated icons for medical applications</p>
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
          <h2 className="text-2xl font-bold mb-6 text-center">Healthcare Animated Icons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthcareIcons.map((Icon, index) => (
              <div 
                key={index}
                className={`${logoContainerStyle} ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500 hover:shadow-lg'}`}
              >
                {Icon(index)}
                <h3 className="font-semibold text-xl mb-1">Healthcare Icon {index + 1}</h3>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  {index === 0 ? 'Hospital Animation' : 
                   index === 1 ? 'Doctor Animation' : 
                   index === 2 ? 'Laboratory Animation' : 
                   index === 3 ? 'Pharmacy Animation' : 
                   'Patient Care Animation'}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthcareIconsPage; 