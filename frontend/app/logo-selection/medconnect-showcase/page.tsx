'use client';

import React, { useState } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';
import MedConnectLogo, { MedConnectLogoAnimations } from '../medconnect-logo';

const MedConnectLogoShowcase = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedPrimary, setSelectedPrimary] = useState('#0d9488');
  const [selectedSecondary, setSelectedSecondary] = useState('#14b8a6');
  const [selectedTertiary, setSelectedTertiary] = useState('#0f766e');

  // Color palette options - simplified
  const primaryColors = [
    { name: 'Teal', value: '#0d9488' },
    { name: 'Blue', value: '#0369a1' },
    { name: 'Green', value: '#15803d' },
  ];

  const secondaryColors = [
    { name: 'Light Teal', value: '#14b8a6' },
    { name: 'Light Blue', value: '#0ea5e9' },
    { name: 'Light Green', value: '#22c55e' },
  ];

  const tertiaryColors = [
    { name: 'Dark Teal', value: '#0f766e' },
    { name: 'Dark Blue', value: '#075985' },
    { name: 'Dark Green', value: '#166534' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <MedConnectLogoAnimations />
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">MedConnect Logo</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
            A refined, subtle brand identity for healthcare solutions
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
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

        {/* Main Logo Display */}
        <div className="mb-16 p-10 rounded-lg border transition-all duration-300 text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Full Logo</h2>
          <div className="flex justify-center mb-8">
            <MedConnectLogo 
              primaryColor={selectedPrimary}
              secondaryColor={selectedSecondary}
              tertiaryColor={selectedTertiary}
              isAnimated={true}
              darkMode={isDarkMode}
              className="w-full max-w-xl h-auto"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compact design with reduced spacing between icon and text</p>
        </div>

        {/* Logo Variants */}
        <h2 className="text-2xl font-bold mb-6 text-center">Logo Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Full Logo */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Full Logo</h3>
            <div className="flex justify-center mb-4">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={false}
                darkMode={isDarkMode}
                variant="full"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Integrated logo with icon and text</p>
          </div>

          {/* Icon Only */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Icon Only</h3>
            <div className="flex justify-center mb-4">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={false}
                darkMode={isDarkMode}
                variant="icon"
                className="w-32 h-32"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Icon for app icons and small spaces</p>
          </div>

          {/* Text Only */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Text Only</h3>
            <div className="flex justify-center mb-4">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={false}
                darkMode={isDarkMode}
                variant="text"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Text for headers and documents</p>
          </div>
        </div>

        {/* Animation Showcase - Simplified */}
        <h2 className="text-2xl font-bold mb-6 text-center">Animation Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Static Version */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Static Version</h3>
            <div className="flex justify-center mb-4">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={false}
                darkMode={isDarkMode}
                className="w-full max-w-md h-auto"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">For print and static media</p>
          </div>

          {/* Animated Version */}
          <div className={`p-8 rounded-lg border transition-all duration-300 text-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-xl font-bold mb-4">Subtle Animation</h3>
            <div className="flex justify-center mb-4">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={true}
                darkMode={isDarkMode}
                className="w-full max-w-md h-auto"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">For digital platforms with gentle animations</p>
          </div>
        </div>

        {/* Color Customizer - Simplified */}
        <h2 className="text-2xl font-bold mb-6 text-center">Color Options</h2>
        <div className={`p-8 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Color */}
            <div>
              <h3 className="text-lg font-bold mb-4">Primary Color</h3>
              <div className="grid grid-cols-1 gap-2">
                {primaryColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedPrimary(color.value)}
                    className={`flex items-center p-2 rounded-md ${
                      selectedPrimary === color.value 
                        ? 'ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mr-3" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <h3 className="text-lg font-bold mb-4">Secondary Color</h3>
              <div className="grid grid-cols-1 gap-2">
                {secondaryColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedSecondary(color.value)}
                    className={`flex items-center p-2 rounded-md ${
                      selectedSecondary === color.value 
                        ? 'ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mr-3" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tertiary Color */}
            <div>
              <h3 className="text-lg font-bold mb-4">Tertiary Color</h3>
              <div className="grid grid-cols-1 gap-2">
                {tertiaryColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedTertiary(color.value)}
                    className={`flex items-center p-2 rounded-md ${
                      selectedTertiary === color.value 
                        ? 'ring-2 ring-offset-2 ring-teal-500 dark:ring-offset-gray-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mr-3" 
                      style={{ backgroundColor: color.value }}
                    ></div>
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-center">Custom Logo Preview</h3>
            <div className="flex justify-center">
              <MedConnectLogo 
                primaryColor={selectedPrimary}
                secondaryColor={selectedSecondary}
                tertiaryColor={selectedTertiary}
                isAnimated={true}
                darkMode={isDarkMode}
                className="w-full max-w-lg h-auto"
              />
            </div>
          </div>
        </div>

        {/* Usage Guidelines - Simplified */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Usage Guidelines</h2>
          <div className={`p-8 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Do's</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Use the full logo on main pages and marketing materials</li>
                  <li>Use the icon-only version for app icons and small spaces</li>
                  <li>Maintain proper spacing around the logo</li>
                  <li>Use the provided color options for consistency</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Don'ts</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Don't stretch or distort the logo</li>
                  <li>Don't change the proportions of the icon and text</li>
                  <li>Don't add additional effects or shadows</li>
                  <li>Don't place the logo on busy backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedConnectLogoShowcase; 