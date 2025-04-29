'use client';

import React from 'react';
import ProviderManagementPanel from '../../components/ui/ProviderManagementPanel';

export default function ProviderManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Healthcare Provider Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your service providers including doctors, pharmacies, and labs.
        </p>
      </div>
      
      <ProviderManagementPanel />
    </div>
  );
} 