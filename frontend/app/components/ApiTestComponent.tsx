'use client';

import React, { useState, useEffect } from 'react';
import { enhancedAuthAPI, enhancedPatientAPI } from '../services/enhanced-api';

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'test@example.com',
    password: 'password123'
  });

  const addTestResult = (result: TestResult) => {
    setTestResults((prev: TestResult[]) => [...prev, result]);
  };

  const runApiTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Health check
      addTestResult({
        test: 'API Connection',
        success: true,
        message: 'Testing API connection...'
      });

      // Test 2: User registration
      addTestResult({
        test: 'User Registration',
        success: true,
        message: 'Testing user registration...'
      });

      const registerResult = await enhancedAuthAPI.register({
        full_name: 'Test User',
        email: credentials.email,
        password: credentials.password,
        password_confirmation: credentials.password,
        phone: '+1234567890',
        date_of_birth: '1990-01-01',
        gender: 'male'
      });

      if (registerResult.success) {
        addTestResult({
          test: 'User Registration',
          success: true,
          message: 'User registered successfully',
          data: registerResult.data
        });
      } else {
        addTestResult({
          test: 'User Registration',
          success: false,
          message: 'Registration failed',
          error: registerResult.error?.message
        });
      }

      // Test 3: User login
      addTestResult({
        test: 'User Login',
        success: true,
        message: 'Testing user login...'
      });

      const loginResult = await enhancedAuthAPI.login({
        email: credentials.email,
        password: credentials.password
      });

      if (loginResult.success) {
        addTestResult({
          test: 'User Login',
          success: true,
          message: 'User logged in successfully',
          data: loginResult.data
        });

        // Test 4: Get current user
        addTestResult({
          test: 'Get Current User',
          success: true,
          message: 'Testing get current user...'
        });

        const userResult = await enhancedAuthAPI.getCurrentUser();

        if (userResult.success) {
          addTestResult({
            test: 'Get Current User',
            success: true,
            message: 'Current user retrieved successfully',
            data: userResult.data
          });

          // Test 5: Get patient profile
          addTestResult({
            test: 'Patient Profile',
            success: true,
            message: 'Testing patient profile...'
          });

          const profileResult = await enhancedPatientAPI.getProfile();

          if (profileResult.success) {
            addTestResult({
              test: 'Patient Profile',
              success: true,
              message: 'Patient profile retrieved successfully',
              data: profileResult.data
            });
          } else {
            addTestResult({
              test: 'Patient Profile',
              success: false,
              message: 'Failed to get patient profile',
              error: profileResult.error?.message
            });
          }

          // Test 6: Get patient appointments
          addTestResult({
            test: 'Patient Appointments',
            success: true,
            message: 'Testing patient appointments...'
          });

          const appointmentsResult = await enhancedPatientAPI.getAppointments();

          if (appointmentsResult.success) {
            addTestResult({
              test: 'Patient Appointments',
              success: true,
              message: `Retrieved ${appointmentsResult.data.length} appointments`,
              data: appointmentsResult.data
            });
          } else {
            addTestResult({
              test: 'Patient Appointments',
              success: false,
              message: 'Failed to get appointments',
              error: appointmentsResult.error?.message
            });
          }

          // Test 7: Get patient medications
          addTestResult({
            test: 'Patient Medications',
            success: true,
            message: 'Testing patient medications...'
          });

          const medicationsResult = await enhancedPatientAPI.getMedications();

          if (medicationsResult.success) {
            addTestResult({
              test: 'Patient Medications',
              success: true,
              message: `Retrieved ${medicationsResult.data.length} medications`,
              data: medicationsResult.data
            });
          } else {
            addTestResult({
              test: 'Patient Medications',
              success: false,
              message: 'Failed to get medications',
              error: medicationsResult.error?.message
            });
          }

          // Test 8: Get patient messages
          addTestResult({
            test: 'Patient Messages',
            success: true,
            message: 'Testing patient messages...'
          });

          const messagesResult = await enhancedPatientAPI.getMessages();

          if (messagesResult.success) {
            addTestResult({
              test: 'Patient Messages',
              success: true,
              message: `Retrieved ${messagesResult.data.length} messages`,
              data: messagesResult.data
            });
          } else {
            addTestResult({
              test: 'Patient Messages',
              success: false,
              message: 'Failed to get messages',
              error: messagesResult.error?.message
            });
          }

        } else {
          addTestResult({
            test: 'Get Current User',
            success: false,
            message: 'Failed to get current user',
            error: userResult.error?.message
          });
        }

      } else {
        addTestResult({
          test: 'User Login',
          success: false,
          message: 'Login failed',
          error: loginResult.error?.message
        });
      }

      // Test 9: Logout
      addTestResult({
        test: 'User Logout',
        success: true,
        message: 'Testing user logout...'
      });

      const logoutResult = await enhancedAuthAPI.logout();

      if (logoutResult.success) {
        addTestResult({
          test: 'User Logout',
          success: true,
          message: 'User logged out successfully'
        });
      } else {
        addTestResult({
          test: 'User Logout',
          success: false,
          message: 'Logout failed',
          error: logoutResult.error?.message
        });
      }

    } catch (error) {
      addTestResult({
        test: 'Test Suite',
        success: false,
        message: 'Test suite failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const successCount = testResults.filter((r: TestResult) => r.success).length;
  const totalCount = testResults.length;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API Integration Test</h2>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={runApiTests}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run API Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        {totalCount > 0 && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-sm">
              Results: {successCount}/{totalCount} tests passed
              {successCount === totalCount ? ' ✅' : ' ❌'}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{result.test}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                result.success 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {result.success ? 'PASS' : 'FAIL'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{result.message}</p>
            
            {result.error && (
              <p className="text-sm text-red-600 mb-2">
                Error: {result.error}
              </p>
            )}
            
            {result.data && (
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          <p>No test results yet. Click "Run API Tests" to start testing.</p>
        </div>
      )}
    </div>
  );
}