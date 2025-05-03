'use client';

import React from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import ApiTestUtility from '@/app/components/ApiTestUtility';

export default function ApiTestPage() {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Backend API Integration Test
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Use this utility to test the connection between the frontend and backend. 
          Select an endpoint from the dropdown and click the test button to see the response.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <ApiTestUtility />
          </div>
          
          <div className="col-span-1">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Integration Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1"></div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">CORS Configuration</h3>
                    <p className="text-gray-600 dark:text-gray-300">The Rails backend is configured to accept requests from the Next.js frontend.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1"></div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">API Endpoints</h3>
                    <p className="text-gray-600 dark:text-gray-300">The frontend API service is configured to communicate with the Rails backend.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1"></div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Authentication</h3>
                    <p className="text-gray-600 dark:text-gray-300">JWT token handling is set up to work with the Rails backend format.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 mt-1"></div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Frontend Components</h3>
                    <p className="text-gray-600 dark:text-gray-300">The dashboard and health card components are updated to use backend data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
