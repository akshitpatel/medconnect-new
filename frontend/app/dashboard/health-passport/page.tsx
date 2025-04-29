'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import { FaIdCard, FaPlus, FaQrcode, FaHistory, FaFileAlt, FaSyringe, FaHeartbeat } from 'react-icons/fa';
import Link from 'next/link';

export default function HealthPassportPage() {
  const router = useRouter();
  const [healthPassport, setHealthPassport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch health passport data
  useEffect(() => {
    const fetchHealthPassport = async () => {
      try {
        setLoading(true);
        // The backend API expects the user's own ID but handles it internally
        const response = await fetch('/api/health-passport/me');
        
        if (response.status === 404) {
          // No health passport found, but not an error
          setHealthPassport(null);
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch health passport');
        }
        
        const data = await response.json();
        setHealthPassport(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching health passport:', err);
        setError('Failed to load health passport data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthPassport();
  }, []);

  // Handle create new health passport
  const handleCreateHealthPassport = () => {
    router.push('/dashboard/health-passport/create');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col space-y-4 max-w-4xl mx-auto">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md max-w-4xl mx-auto">
          <p className="text-lg font-medium">{error}</p>
          <p className="mt-2">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  // Render empty state (no health passport)
  if (!healthPassport) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 bg-white shadow-md rounded-lg">
            <FaIdCard className="mx-auto text-6xl text-teal-600 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Health Passport</h1>
            <p className="text-gray-600 mb-8 px-4">
              Your digital health passport stores your medical information securely in one place.
              Create your health passport to start managing your health records.
            </p>
            <button
              onClick={handleCreateHealthPassport}
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium flex items-center justify-center mx-auto"
            >
              <FaPlus className="mr-2" /> Create Health Passport
            </button>
          </div>
          
          <div className="mt-8 bg-gray-50 rounded-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Why Create a Health Passport?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                <span>Store all your health information securely in one place</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                <span>Share your health information with healthcare providers when needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                <span>Keep track of your medical history, medications, and allergies</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                <span>Access your health information anytime, anywhere</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                <span>Generate QR codes for emergency access to critical information</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render health passport
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Health Passport</h1>
                <p className="opacity-80">Digital health record</p>
                <div className="mt-1 text-sm bg-teal-500 rounded-full inline-block px-3 py-1">
                  Passport ID: {healthPassport.passport_number}
                </div>
              </div>
              <Link
                href={`/dashboard/health-passport/${healthPassport._id}/qr-code`}
                className="bg-white text-teal-700 rounded-full p-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FaQrcode className="text-lg" />
                <span className="sr-only">Show QR Code</span>
              </Link>
            </div>
          </div>
          
          {/* Main content */}
          <div className="p-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                  <FaFileAlt className="mr-2 text-teal-600" /> Medical Records
                </h3>
                <p className="text-2xl font-bold">{healthPassport.medical_records?.length || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                  <FaSyringe className="mr-2 text-teal-600" /> Vaccinations
                </h3>
                <p className="text-2xl font-bold">{healthPassport.vaccinations?.length || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-gray-700 font-medium mb-2 flex items-center">
                  <FaHeartbeat className="mr-2 text-teal-600" /> Vital Signs
                </h3>
                <p className="text-2xl font-bold">{healthPassport.vital_signs?.length || 0}</p>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link
                href={`/dashboard/health-passport/${healthPassport._id}/records`}
                className="bg-teal-50 text-teal-700 border border-teal-200 rounded-md p-4 flex items-center hover:bg-teal-100 transition-colors"
              >
                <FaFileAlt className="mr-3 text-teal-600" />
                <div>
                  <h3 className="font-medium">View Medical Records</h3>
                  <p className="text-sm text-gray-600">Access your complete medical history</p>
                </div>
              </Link>
              
              <Link
                href={`/dashboard/health-passport/${healthPassport._id}/vital-signs`}
                className="bg-teal-50 text-teal-700 border border-teal-200 rounded-md p-4 flex items-center hover:bg-teal-100 transition-colors"
              >
                <FaHeartbeat className="mr-3 text-teal-600" />
                <div>
                  <h3 className="font-medium">Track Vital Signs</h3>
                  <p className="text-sm text-gray-600">Monitor your health metrics over time</p>
                </div>
              </Link>
            </div>
            
            {/* Profile info */}
            <div className="bg-gray-50 rounded-md p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4">Health Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-gray-500 text-sm">Blood Type</h3>
                  <p className="font-medium">{healthPassport.blood_type || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm">Created</h3>
                  <p className="font-medium">
                    {healthPassport.created_at ? new Date(healthPassport.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-gray-500 text-sm">Allergies</h3>
                  {healthPassport.allergies && healthPassport.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthPassport.allergies.map((allergy: string, index: number) => (
                        <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium">No allergies recorded</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-gray-500 text-sm">Chronic Conditions</h3>
                  {healthPassport.chronic_conditions && healthPassport.chronic_conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {healthPassport.chronic_conditions.map((condition: string, index: number) => (
                        <span key={index} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="font-medium">No chronic conditions recorded</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/dashboard/health-passport/${healthPassport._id}/edit`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
                >
                  Edit Health Profile
                </Link>
              </div>
            </div>
            
            {/* Recent activity */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Link
                  href={`/dashboard/health-passport/${healthPassport._id}/activity`}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              {healthPassport.access_logs && healthPassport.access_logs.length > 0 ? (
                <div className="space-y-3">
                  {healthPassport.access_logs.slice(0, 3).map((log: any, index: number) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            <span className="text-gray-700">{log.accessed_by.name}</span>
                            <span className="text-gray-500 text-sm ml-2">({log.accessed_by.type})</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Via {log.access_method}{log.reason ? `: ${log.reason}` : ''}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(log.access_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-md border border-gray-200">
                  <FaHistory className="mx-auto text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 