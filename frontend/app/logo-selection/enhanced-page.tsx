'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { createHealthcareIcons } from './healthcare-icons';

// Dynamically import the original LogoSelection component
const OriginalLogoSelection = dynamic(() => import('./page'), {
  ssr: false,
});

// This file enhances the original LogoSelection page by adding healthcare icons
const EnhancedLogoSelection = () => {
  // Initialize healthcare icons with the same color scheme as in the original file
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

  // We'll use the original component but add our healthcare icons
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">Healthcare Animated Icons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {createHealthcareIcons(primaryColors, secondaryColors, "w-16 h-16 mb-3").map((Icon, index) => (
          <div key={index} className="w-full p-6 rounded-lg border transition-all duration-300 flex flex-col items-center">
            {Icon(index)}
            <p className="text-sm text-gray-500 mt-2">Healthcare Icon {index + 1}</p>
          </div>
        ))}
      </div>
      
      <OriginalLogoSelection />
    </div>
  );
};

export default EnhancedLogoSelection; 