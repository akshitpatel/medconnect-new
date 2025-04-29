'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaEdit, FaPlus, FaDownload, FaHistory, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

// Define interfaces for our data model
interface HealthPassport {
  _id: string;
  user_id: string;
  passport_number: string;
  blood_type?: string;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contacts: {
    name: string;
    relationship?: string;
    phone: string;
    email?: string;
  }[];
  emergency_access: boolean;
  qr_code_url: string;
  created_at: string;
  updated_at: string;
}

interface AccessLog {
  _id: string;
  passport_id: string;
  accessed_by: string;
  access_type: string;
  timestamp: string;
  ip_address: string;
  location?: string;
}

export default function ViewHealthPassportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passportId = searchParams.get('id');
  
  const [passport, setPassport] = useState<HealthPassport | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Fetch health passport data
  useEffect(() => {
    const fetchPassport = async () => {
      if (!passportId) {
        // If no ID provided, try to get the user's passport
        try {
          const response = await fetch('/api/health-passport/me');
          if (response.status === 404) {
            router.push('/dashboard/health-passport');
            return;
          }
          
          if (!response.ok) {
            throw new Error('Failed to fetch health passport');
          }
          
          const data = await response.json();
          setPassport(data.passport);
          
          // Fetch access logs
          const logsResponse = await fetch(`/api/health-passport/${data.passport._id}/access-logs`);
          if (logsResponse.ok) {
            const logsData = await logsResponse.json();
            setAccessLogs(logsData.logs || []);
          }
          
        } catch (err: any) {
          console.error('Error fetching passport:', err);
          setError(err.message || 'Failed to load health passport');
        } finally {
          setLoading(false);
        }
      } else {
        // Fetch specific passport by ID
        try {
          const response = await fetch(`/api/health-passport/${passportId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch health passport');
          }
          
          const data = await response.json();
          setPassport(data.passport);
          
          // Fetch access logs
          const logsResponse = await fetch(`/api/health-passport/${passportId}/access-logs`);
          if (logsResponse.ok) {
            const logsData = await logsResponse.json();
            setAccessLogs(logsData.logs || []);
          }
          
        } catch (err: any) {
          console.error('Error fetching passport:', err);
          setError(err.message || 'Failed to load health passport');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPassport();
  }, [passportId, router]);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate QR code URL
  const qrCodeUrl = useMemo(() => {
    return passport ? `/api/health-passport/${passport._id}/qr-code` : '';
  }, [passport]);
  
  // Download QR code
  const downloadQrCode = async () => {
    if (!passport) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `health-passport-${passport.passport_number}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-teal-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading health passport...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Health Passport</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/dashboard/health-passport"
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Health Passport
          </Link>
        </div>
      </div>
    );
  }
  
  if (!passport) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-yellow-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Passport Not Found</h2>
          <p className="text-gray-600 mb-6">The requested health passport could not be found.</p>
          <Link
            href="/dashboard/health-passport"
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Health Passport
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard/health-passport" 
            className="text-teal-600 hover:text-teal-700 flex items-center font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-teal-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Health Passport</h1>
              <p className="opacity-80">ID: {passport.passport_number}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2 bg-white text-teal-600 rounded-md hover:bg-teal-50 transition-colors flex items-center"
              >
                Show QR Code
              </button>
              <Link
                href={`/dashboard/health-passport/edit?id=${passport._id}`}
                className="px-4 py-2 bg-white text-teal-600 rounded-md hover:bg-teal-50 transition-colors flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Health Information Section */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaShieldAlt className="mr-2 text-teal-500" /> Health Information
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Blood Type</h3>
                  <p className="text-lg">{passport.blood_type || 'Not specified'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Allergies</h3>
                  {passport.allergies && passport.allergies.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {passport.allergies.map((allergy, index) => (
                        <li key={index} className="text-gray-800">{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No allergies recorded</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Chronic Conditions</h3>
                  {passport.chronic_conditions && passport.chronic_conditions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {passport.chronic_conditions.map((condition, index) => (
                        <li key={index} className="text-gray-800">{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No chronic conditions recorded</p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Emergency Access</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    passport.emergency_access 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {passport.emergency_access ? 'Enabled' : 'Disabled'}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {passport.emergency_access 
                      ? 'Emergency healthcare providers can access critical health information without authentication.' 
                      : 'Emergency access is disabled. Only authorized providers can access your health information.'}
                  </p>
                </div>
              </div>
              
              {/* Emergency Contacts Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
                
                {passport.emergency_contacts && passport.emergency_contacts.length > 0 ? (
                  <div className="space-y-4">
                    {passport.emergency_contacts.map((contact, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-800">{contact.name}</h3>
                        {contact.relationship && (
                          <p className="text-gray-600 text-sm">{contact.relationship}</p>
                        )}
                        <p className="text-gray-700 mt-2">{contact.phone}</p>
                        {contact.email && (
                          <p className="text-gray-700">{contact.email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No emergency contacts added</p>
                    <Link
                      href={`/dashboard/health-passport/edit?id=${passport._id}`}
                      className="mt-2 text-teal-600 hover:text-teal-700 inline-flex items-center text-sm font-medium"
                    >
                      <FaPlus className="mr-1" /> Add Contact
                    </Link>
                  </div>
                )}
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Passport Details</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Created:</span> {formatDate(passport.created_at)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Last Updated:</span> {formatDate(passport.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical Records Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medical Records</h2>
            <Link
              href={`/dashboard/health-passport/${passport._id}/add-record`}
              className="px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm flex items-center"
            >
              <FaPlus className="mr-1" /> Add Record
            </Link>
          </div>
          
          <div className="p-6">
            {/* This would be populated with the records from an API call */}
            <div className="text-center py-4">
              <p className="text-gray-500">No medical records available</p>
              <Link
                href={`/dashboard/health-passport/${passport._id}/add-record`}
                className="mt-2 text-blue-600 hover:text-blue-700 inline-flex items-center text-sm font-medium"
              >
                <FaPlus className="mr-1" /> Add Your First Record
              </Link>
            </div>
          </div>
        </div>
        
        {/* Access Logs Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-800 p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <FaHistory className="mr-2" /> Access Logs
            </h2>
          </div>
          
          <div className="p-6">
            {accessLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accessed By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Access Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accessLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {log.accessed_by}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${log.access_type === 'view' ? 'bg-blue-100 text-blue-800' : 
                              log.access_type === 'emergency' ? 'bg-red-100 text-red-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {log.access_type.charAt(0).toUpperCase() + log.access_type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {log.location || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No access logs available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Health Passport QR Code</h2>
            
            <div className="flex justify-center mb-4">
              {qrCodeUrl && (
                <div className="border border-gray-200 p-2 rounded-md bg-white">
                  <Image 
                    src={qrCodeUrl} 
                    alt="Health Passport QR Code" 
                    width={250} 
                    height={250}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm text-center mb-6">
              Healthcare providers can scan this QR code to access your health information.
              Only share with trusted individuals.
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={downloadQrCode}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
              >
                <FaDownload className="mr-2" /> Download
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 