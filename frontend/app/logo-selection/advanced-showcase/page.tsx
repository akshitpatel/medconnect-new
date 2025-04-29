'use client';

import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import Link from 'next/link';
import { AdvancedMedicalLogos, AdvancedLogoAnimations } from '../advanced-medical-logos';

const AdvancedLogoShowcasePage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Color palette for logos - using a more sophisticated medical palette
  const primaryColors = [
    "#0891b2", // Cyan
    "#0369a1", // Sky
    "#0d9488", // Teal
    "#059669", // Emerald
    "#047857", // Green
    "#0f766e", // Dark Teal
    "#1d4ed8", // Royal Blue
    "#4f46e5", // Indigo
    "#7c3aed", // Violet
    "#9333ea", // Purple
  ];

  const secondaryColors = [
    "#06b6d4", // Light Cyan
    "#0ea5e9", // Light Sky
    "#14b8a6", // Light Teal
    "#10b981", // Light Emerald
    "#34d399", // Light Green
    "#2dd4bf", // Bright Teal
    "#3b82f6", // Bright Blue
    "#6366f1", // Light Indigo
    "#8b5cf6", // Light Violet
    "#a855f7", // Light Purple
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AdvancedLogoAnimations />
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Advanced Medical Logo Collection</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
            Specialized healthcare logos for modern medical applications
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
            <Link href="/logo-selection/logo-showcase">
              <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                View Basic Logo Collection
              </button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(AdvancedMedicalLogos).map(([name, Logo], index) => (
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
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-2">Use Cases:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                  {getUseCases(name).map((useCase, i) => (
                    <li key={i}>{useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get use cases for each logo
const getUseCases = (logoName: string): string[] => {
  const useCases: Record<string, string[]> = {
    PulseWave: [
      "Cardiology applications and heart monitoring services",
      "Fitness and health tracking applications",
      "Emergency medical services branding"
    ],
    GenomeSequence: [
      "Genetic testing and DNA analysis services",
      "Biotechnology research organizations",
      "Personalized medicine platforms"
    ],
    Telemedicine: [
      "Virtual healthcare platforms",
      "Remote patient monitoring services",
      "Medical consultation applications"
    ],
    MedicalResearch: [
      "Research laboratories and institutions",
      "Clinical trial organizations",
      "Medical education platforms"
    ],
    MedicalAI: [
      "Healthcare AI and machine learning applications",
      "Diagnostic assistance tools",
      "Medical data analysis platforms"
    ],
    Vaccine: [
      "Immunization services and clinics",
      "Pharmaceutical companies",
      "Public health campaigns"
    ],
    MedicalChart: [
      "Electronic health record systems",
      "Patient management software",
      "Medical documentation services"
    ],
    Biotech: [
      "Biotechnology startups",
      "Molecular medicine companies",
      "Life sciences research organizations"
    ],
    MedicalShield: [
      "Health insurance providers",
      "Medical security applications",
      "Patient data protection services"
    ],
    SmartHealth: [
      "Wearable health technology",
      "Health monitoring devices",
      "Fitness and wellness applications"
    ]
  };
  
  return useCases[logoName] || [
    "General healthcare applications",
    "Medical branding and identity",
    "Health-related digital platforms"
  ];
};

export default AdvancedLogoShowcasePage; 