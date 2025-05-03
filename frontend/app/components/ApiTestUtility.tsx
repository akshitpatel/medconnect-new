'use client';

import React, { useState } from 'react';
import { patientAPI, authAPI } from '@/app/services/api';

const ApiTestUtility = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState('profile');
  
  const endpoints = [
    { id: 'profile', name: 'Patient Profile', api: patientAPI.getProfile },
    { id: 'appointments', name: 'Appointments', api: patientAPI.getAppointments },
    { id: 'medications', name: 'Medications', api: patientAPI.getMedications },
    { id: 'messages', name: 'Messages', api: patientAPI.getMessages },
    { id: 'me', name: 'Current User', api: authAPI.getCurrentUser },
  ];

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const endpoint = endpoints.find(e => e.id === selectedEndpoint);
      if (!endpoint) {
        throw new Error('Invalid endpoint selected');
      }
      
      const response = await endpoint.api();
      console.log(`API Test Response (${endpoint.name}):`, response);
      
      setResults({
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(
        err.response 
          ? `Error ${err.response.status}: ${err.response.statusText}\n${JSON.stringify(err.response.data, null, 2)}` 
          : err.message || 'Unknown error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">API Integration Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Endpoint to Test
        </label>
        <select 
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {endpoints.map(endpoint => (
            <option key={endpoint.id} value={endpoint.id}>
              {endpoint.name}
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-medical-blue-600 hover:bg-medical-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error</h3>
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap text-red-700 dark:text-red-300">
            {error}
          </pre>
        </div>
      )}
      
      {results && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Response</h3>
          
          <div className="mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Status: </span>
            <span className={`${results.status >= 200 && results.status < 300 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {results.status} {results.statusText}
            </span>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto">
            <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestUtility;
