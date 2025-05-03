'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { FlippableHealthCard } from '@/app/components/ui/FlippableHealthCard';
import { cn } from '@/app/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';
import { useAuth } from '@/app/contexts/AuthContext';
import { patientAPI } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { ProfileSkeletonLoader } from '@/app/components/ui/ProfileSkeletonLoader';
import { format, parseISO } from 'date-fns';
import EditProfileModal from '@/app/components/patient/EditProfileModal';
import ProfilePhotoUploader from '@/app/components/ui/ProfilePhotoUploader';

interface HealthRecord {
  type: string;
  name: string;
  date: string;
  details?: string;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  primary: boolean;
}

export default function PatientProfilePage() {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Initialize profile state with default structure
  const [profile, setProfile] = useState({
    personalInfo: {
      name: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      passportNumber: '',
      profilePicture: null as string | null,
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      primary: false,
    },
    healthMetrics: {
      height: '',
      weight: '',
      bloodPressure: '',
      bloodType: '',
      allergies: [] as string[],
    },
    healthHistory: [] as HealthRecord[],
    medications: [] as any[]
  });

  // Fetch patient profile data from API
  useEffect(() => {
    // Don't attempt to fetch if user is not authenticated
    if (!user || !user.id) {
      console.warn('User not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    const fetchPatientProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching profile from live API...', 'User ID:', user.id);
        console.log('Auth state:', { isAuthenticated: !!user, hasToken: !!localStorage.getItem('token') });
        
        const profileResponse = await patientAPI.getProfile();
        
        // More detailed logging for debugging
        console.log('=== PROFILE API RESPONSE ===');
        console.log('Status:', profileResponse?.status);
        console.log('Response type:', typeof profileResponse?.data);
        console.log('Response keys:', profileResponse?.data ? Object.keys(profileResponse.data) : 'No data');
        console.log('Full Data:', JSON.stringify(profileResponse?.data, null, 2));
        
        if (!profileResponse || !profileResponse.data) {
          throw new Error('Empty or invalid response from API');
        }
        
        // Handle different response structures - check all possible paths
        let apiProfile;
        let dataSource = '';
        
        // Try each path to find valid profile data
        if (profileResponse?.data?.success === true && profileResponse?.data?.data?.profile) {
          // Standard response format: {success: true, data: {profile: {...}}}
          apiProfile = profileResponse.data.data.profile;
          dataSource = 'profileResponse.data.data.profile';
        } else if (profileResponse?.data?.profile) {
          // Alternative format: {profile: {...}}
          apiProfile = profileResponse.data.profile;
          dataSource = 'profileResponse.data.profile';
        } else if (profileResponse?.data?.data && typeof profileResponse.data.data === 'object') {
          // Alternative format: {data: {...}}
          apiProfile = profileResponse.data.data;
          dataSource = 'profileResponse.data.data';
        } else if (profileResponse?.data && typeof profileResponse.data === 'object') {
          // Fallback: the data object itself contains profile fields
          apiProfile = profileResponse.data;
          dataSource = 'profileResponse.data directly';
        } else {
          throw new Error('Could not find profile data in API response');
        }
        
        console.log(`Found profile data at ${dataSource}:`, apiProfile);
        console.log('Profile data type:', typeof apiProfile);
        console.log('Profile has keys:', Object.keys(apiProfile));
        
        // Safely extract data with deep null checking
        const safeGet = (obj: any, path: string, defaultVal: string = '') => {
          try {
            return path.split('.').reduce((o: any, key: string) => (o && o[key] !== undefined && o[key] !== null) ? o[key] : null, obj) || defaultVal;
          } catch (e) {
            console.warn(`Failed to extract ${path}:`, e);
            return defaultVal;
          }
        };
        
        // Safely convert to array
        const safeArray = (val: any): any[] => {
          if (Array.isArray(val)) return val;
          if (val && typeof val === 'object') return [val];
          return [];
        };
        
        // Log specific fields to diagnose mapping issues
        console.log('personal_info present:', apiProfile.personal_info ? 'Yes' : 'No');
        if (apiProfile.personal_info) {
          console.log('Name from personal_info:', apiProfile.personal_info.name);
          console.log('Email from personal_info:', apiProfile.personal_info.email);
        }
        
        // Map API response to our profile state structure with better fallbacks
        const updatedProfile = {
          personalInfo: {
            name: safeGet(apiProfile, 'personal_info.name') || safeGet(apiProfile, 'personal_info.full_name') || 
                  safeGet(apiProfile, 'personalInfo.name') || safeGet(apiProfile, 'full_name') || 
                  safeGet(apiProfile, 'fullName') || safeGet(apiProfile, 'name') || 'Patient',
            dateOfBirth: safeGet(apiProfile, 'personal_info.date_of_birth') || safeGet(apiProfile, 'personalInfo.dateOfBirth') || 
                      safeGet(apiProfile, 'date_of_birth') || safeGet(apiProfile, 'dateOfBirth') || 
                      safeGet(apiProfile, 'birthdate') || safeGet(apiProfile, 'dob') || '',
            gender: safeGet(apiProfile, 'personal_info.gender') || safeGet(apiProfile, 'personalInfo.gender') || 
                   safeGet(apiProfile, 'gender') || '',
            email: safeGet(apiProfile, 'personal_info.email') || safeGet(apiProfile, 'personalInfo.email') || 
                  safeGet(apiProfile, 'email') || '',
            phone: safeGet(apiProfile, 'personal_info.phone') || safeGet(apiProfile, 'personalInfo.phone') || 
                  safeGet(apiProfile, 'personal_info.phoneNumber') || safeGet(apiProfile, 'personalInfo.phoneNumber') || 
                  safeGet(apiProfile, 'personal_info.phone_number') || safeGet(apiProfile, 'phone') || 
                  safeGet(apiProfile, 'phoneNumber') || safeGet(apiProfile, 'phone_number') || '',
            address: safeGet(apiProfile, 'personal_info.address') || safeGet(apiProfile, 'personalInfo.address') || 
                    safeGet(apiProfile, 'address') || '',
            passportNumber: safeGet(apiProfile, 'personal_info.passport_number') || safeGet(apiProfile, 'personalInfo.passportNumber') || 
                         safeGet(apiProfile, 'passport_number') || safeGet(apiProfile, 'passportNumber') || 
                         safeGet(apiProfile, 'passport') || '',
            profilePicture: safeGet(apiProfile, 'personal_info.profile_picture') || safeGet(apiProfile, 'personal_info.profilePicture') || 
                          safeGet(apiProfile, 'personalInfo.profilePicture') || safeGet(apiProfile, 'profile_picture') || 
                          safeGet(apiProfile, 'profilePicture') || safeGet(apiProfile, 'avatar') || null,
          },
          emergencyContact: {
            name: safeGet(apiProfile, 'emergency_contact.name') || safeGet(apiProfile, 'emergencyContact.name') || '',
            relationship: safeGet(apiProfile, 'emergency_contact.relationship') || safeGet(apiProfile, 'emergencyContact.relationship') || '',
            phone: safeGet(apiProfile, 'emergency_contact.phone') || safeGet(apiProfile, 'emergencyContact.phone') || 
                  safeGet(apiProfile, 'emergency_contact.phoneNumber') || safeGet(apiProfile, 'emergencyContact.phoneNumber') || '',
          },
          insurance: {
            provider: safeGet(apiProfile, 'insurance.provider') || '',
            policyNumber: safeGet(apiProfile, 'insurance.policy_number') || '',
            groupNumber: safeGet(apiProfile, 'insurance.group_number') || '',
            primary: safeGet(apiProfile, 'insurance.primary') || false
          },
          healthMetrics: {
            height: safeGet(apiProfile, 'health_metrics.height') || safeGet(apiProfile, 'healthMetrics.height') || 
                   safeGet(apiProfile, 'height') || '',
            weight: safeGet(apiProfile, 'health_metrics.weight') || safeGet(apiProfile, 'healthMetrics.weight') || 
                   safeGet(apiProfile, 'weight') || '',
            bloodPressure: safeGet(apiProfile, 'health_metrics.blood_pressure') || safeGet(apiProfile, 'health_metrics.bloodPressure') || 
                          safeGet(apiProfile, 'healthMetrics.bloodPressure') || safeGet(apiProfile, 'bloodPressure') || 
                          safeGet(apiProfile, 'blood_pressure') || '',
            bloodType: safeGet(apiProfile, 'health_metrics.blood_type') || safeGet(apiProfile, 'health_metrics.bloodType') || 
                      safeGet(apiProfile, 'healthMetrics.bloodType') || safeGet(apiProfile, 'bloodType') || 
                      safeGet(apiProfile, 'blood_type') || '',
            allergies: safeArray(safeGet(apiProfile, 'health_metrics.allergies')) || 
                      safeArray(safeGet(apiProfile, 'healthMetrics.allergies')) || 
                      safeArray(safeGet(apiProfile, 'allergies')) || [],
          },
          healthHistory: safeArray(safeGet(apiProfile, 'health_history')) || 
                        safeArray(safeGet(apiProfile, 'healthHistory')) || 
                        safeArray(safeGet(apiProfile, 'medicalHistory')) || [],
          medications: safeArray(safeGet(apiProfile, 'medications')) || 
                      safeArray(safeGet(apiProfile, 'prescriptions')) || []
        };
        
        console.log('Mapped profile data:', updatedProfile);
        
        // Validate mapped data - ensure required fields are not empty
        if (!updatedProfile.personalInfo.name || updatedProfile.personalInfo.name === 'Patient') {
          console.warn('Warning: Profile data is missing name field');
        }
        
        setProfile(updatedProfile);
        console.log('Profile data loaded successfully');
      } catch (profileErr: any) {
        console.error('Error fetching profile:', profileErr);
        console.error('Error details:', {
          status: profileErr?.response?.status,
          message: profileErr?.message,
          responseData: profileErr?.response?.data,
          stack: profileErr?.stack
        });
        
        // Check if it's an authentication error
        if (profileErr?.response?.status === 401) {
          console.warn('Authentication error, redirecting to login');
          router.push('/auth/login');
          setError('Your session has expired. Please login again.');
        } else if (profileErr?.message?.includes('JWT') || profileErr?.response?.data?.error?.includes('JWT')) {
          // Handle specific JWT errors based on memory
          console.warn('JWT authentication error detected');
          localStorage.removeItem('token'); // Clear invalid token
          router.push('/auth/login');
          setError('Authentication error. Please login again.');
        } else {
          setError(`Failed to load profile data: ${profileErr?.message || 'Unknown error'}. Please check your network connection and try again.`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientProfile();
  }, [user, router]);

  // Function to format date from ISO to readable format with date-fns
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (e) {
      console.warn('Error formatting date:', dateString, e);
      return dateString; // Return original string if parsing fails
    }
  };

  // Handle profile update from edit modal
  const handleProfileUpdate = (updatedProfile: any) => {
    // Ensure all required fields are present to fix type errors
    const completeUpdatedProfile = {
      ...profile, // Start with current profile to maintain shape
      personalInfo: {
        ...profile.personalInfo,
        ...updatedProfile.personalInfo,
      },
      emergencyContact: {
        ...profile.emergencyContact,
        ...updatedProfile.emergencyContact,
      },
      insurance: {
        ...profile.insurance,
        ...updatedProfile.insurance,
      },
      healthMetrics: {
        ...profile.healthMetrics,
        ...updatedProfile.healthMetrics,
      },
      healthHistory: updatedProfile.healthHistory || profile.healthHistory,
      medications: updatedProfile.medications || profile.medications
    };
    
    // Handle updating the state with the new profile data
    setProfile(completeUpdatedProfile);
  };
  
  // Get appropriate icon for health record
  const getHealthRecordIcon = (type: string) => {
    switch (type) {
      case 'Condition':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        );
      case 'Surgery':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
        );
      case 'Vaccination':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        );
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'health', label: 'Health Information' },
    { id: 'insurance', label: 'Insurance' },
    { id: 'records', label: 'Medical Records' },
  ];

  return (
    <DefaultLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Error message display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Edit Profile Modal */}
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Profile Photo Uploader Component */}
                <div className="flex flex-col items-center">
                  {loading ? (
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-24 w-24 animate-pulse"></div>
                  ) : (
                    <ProfilePhotoUploader
                      currentPhotoUrl={user?.profilePicture || profile.personalInfo.profilePicture}
                      size="lg"
                      onPhotoUpdate={(newPhotoUrl) => {
                        // Update local profile state
                        setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            profilePicture: newPhotoUrl
                          }
                        });
                        
                        // Also update auth context if user exists
                        if (updateUserProfile && user) {
                          updateUserProfile({
                            ...user,
                            profilePicture: newPhotoUrl
                          });
                        }
                      }}
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Health Profile
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Manage your personal health information and records
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21h-9.5A2.25 2.25 0 014 18.75V8.25A2.25 2.25 0 016.25 6H8" />
                  </svg>
                  Edit Profile
                </button>
                <button className="inline-flex items-center px-4 py-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Records
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tabs */}
            <div className="flex space-x-1 overflow-x-auto rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
              <AnimatePresence>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 min-w-fit px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  initial={false}
                  animate={{
                    scale: activeTab === tab.id ? 1.05 : 1,
                  }}
                  whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
                >
                  {tab.label}
                </motion.button>
              ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Passport Card - Always visible */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 lg:row-span-2"
          >
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Health Passport</h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <FlippableHealthCard 
                      patientName={profile.personalInfo.name}
                      dateOfBirth={profile.personalInfo.dateOfBirth}
                      bloodType={profile.healthMetrics.bloodType}
                      patientId={profile.personalInfo.passportNumber}
                      emergencyContact={profile.emergencyContact.name}
                      allergies={profile.healthMetrics.allergies}
                      conditions={profile.healthHistory
                        .filter(record => record.type === 'Condition')
                        .map(record => record.name)}
                      // Insurance information
                      insuranceProvider={profile.insurance.provider}
                      policyNumber={profile.insurance.policyNumber}
                      groupNumber={profile.insurance.groupNumber}
                      isPrimaryInsurance={profile.insurance.primary}
                      className="w-full"
                    />
                    <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                      <p>Your health passport contains essential medical information that can be critical in emergencies. Keep it updated and accessible.</p>
                      <div className="mt-4 flex justify-end">
                        <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium flex items-center group">
                          Learn more about Health Passport
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Content Area - Changes based on active tab */}
          <motion.div
            layout
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProfileSkeletonLoader />
                </motion.div>
              ) : (
                <>
                  {/* Personal Information Tab */}
                  {activeTab === 'personal' && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-6">
                            <div className="h-20 w-20 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-2xl mr-4">
                              {profile.personalInfo.name.charAt(0)}
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{profile.personalInfo.name}</h2>
                              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                  {profile.personalInfo.gender}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="mx-2">Passport: {profile.personalInfo.passportNumber}</span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                                <p className="text-gray-900 dark:text-white font-medium">{formatDate(profile.personalInfo.dateOfBirth)}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                                <p className="text-gray-900 dark:text-white font-medium break-all">{profile.personalInfo.email}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                                <p className="text-gray-900 dark:text-white font-medium">{profile.personalInfo.phone}</p>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                <p className="text-gray-900 dark:text-white font-medium">{profile.personalInfo.address}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 p-4 rounded-r-lg">
                              <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500 dark:text-orange-400 mr-3 flex-shrink-0 mt-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                <div>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{profile.emergencyContact.name}</h4>
                                    <span className="text-orange-600 dark:text-orange-400 text-sm">{profile.emergencyContact.relationship}</span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1">{profile.emergencyContact.phone}</p>
                                  <p className="text-sm text-orange-700 dark:text-orange-400 mt-2">Will be contacted in case of emergency</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  
                  {/* Health Information Tab */}
                  {activeTab === 'health' && (
                    <motion.div
                      key="health"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Health Metrics</h2>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg text-center">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Height</p>
                              <p className="text-xl font-semibold text-sky-700 dark:text-sky-400">{profile.healthMetrics.height}</p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Weight</p>
                              <p className="text-xl font-semibold text-green-700 dark:text-green-400">{profile.healthMetrics.weight}</p>
                            </div>
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Blood Pressure</p>
                              <p className="text-xl font-semibold text-purple-700 dark:text-purple-400">{profile.healthMetrics.bloodPressure}</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Blood Type</p>
                              <p className="text-xl font-semibold text-red-700 dark:text-red-400">{profile.healthMetrics.bloodType}</p>
                            </div>
                          </div>

                          {/* Continue with the rest of the health tab content */}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                                    {/* Insurance Tab */}
                  {activeTab === 'insurance' && (
                    <motion.div
                      key="insurance"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Insurance Information</h2>
                          
                          <div className="space-y-6">
                            <div className={`p-5 rounded-lg border ${profile.insurance.primary ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.insurance.provider}</h3>
                                    {profile.insurance.primary && (
                                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Primary
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                    <div>
                                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Policy Number</p>
                                      <p className="text-gray-700 dark:text-gray-300">{profile.insurance.policyNumber}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Number</p>
                                      <p className="text-gray-700 dark:text-gray-300">{profile.insurance.groupNumber}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <button className="btn-secondary text-sm py-2">
                                    View Card
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200">
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0 mt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Insurance Verification</h4>
                                <p className="text-gray-700 dark:text-gray-300 mt-1">Your insurance information has been verified. Please remember to present your insurance card at your next appointment.</p>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                              <button className="btn-primary">
                                Add Insurance Plan
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                  
                  {/* Medical Records Tab */}
                  {activeTab === 'records' && (
                    <motion.div
                      key="records"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Medical Records</h2>
                          
                          <div className="space-y-4">
                            {profile.healthHistory.map((record, index) => (
                              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                <div className="flex items-start">
                                  <div className={`p-2 rounded-md mr-3 flex-shrink-0 ${
                                    record.type === 'Condition' ? 'bg-amber-100 text-amber-600' :
                                    record.type === 'Surgery' ? 'bg-red-100 text-red-600' :
                                    record.type === 'Vaccination' ? 'bg-green-100 text-green-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {getHealthRecordIcon(record.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <div className="flex items-center">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                            record.type === 'Condition' ? 'bg-amber-100 text-amber-800' :
                                            record.type === 'Surgery' ? 'bg-red-100 text-red-800' :
                                            record.type === 'Vaccination' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                          }`}>
                                            {record.type}
                                          </span>
                                          <h4 className="font-semibold text-gray-900 dark:text-white">{record.name}</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(record.date)}</p>
                                      </div>
                                      <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mt-2 sm:mt-0 text-sm font-medium flex items-center">
                                        View Details
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                      </button>
                                    </div>
                                    {record.details && (
                                      <p className="text-gray-700 dark:text-gray-300 mt-2">{record.details}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
                            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 sm:max-w-sm">
                              <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-500 dark:text-teal-400 mr-3 flex-shrink-0 mt-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">Privacy Protected</h4>
                                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">Your medical records are private and secure, shared only with your healthcare providers.</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button className="btn-secondary inline-flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Download Records
                              </button>
                              <button className="btn-primary inline-flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Add New Record
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      </ErrorBoundary>
    </DefaultLayout>
  );
} 