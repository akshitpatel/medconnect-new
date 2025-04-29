'use client';

import React from 'react';
import AdaptiveServiceProviderPanel from '../../components/ui/AdaptiveServiceProviderPanel';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Healthcare Services</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Manage and browse available healthcare services across multiple provider types.
      </p>
      
      <AdaptiveServiceProviderPanel />
    </div>
  );
} 