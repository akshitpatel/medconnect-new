'use client';

import React, { useState, useEffect } from 'react';
import { patientAPI } from '@/app/services/api';

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdate: (updatedProfile: any) => void;
};

export default function EditProfileModal({ isOpen, onClose, profile, onProfileUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    passportNumber: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    
    // Health Metrics
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    
    // Insurance
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',
    insurancePrimary: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        // Personal Info
        name: profile.personalInfo.name || '',
        email: profile.personalInfo.email || '',
        phone: profile.personalInfo.phone || '',
        gender: profile.personalInfo.gender || '',
        dateOfBirth: profile.personalInfo.dateOfBirth || '',
        address: profile.personalInfo.address || '',
        passportNumber: profile.personalInfo.passportNumber || '',
        
        // Emergency Contact
        emergencyContactName: profile.emergencyContact?.name || '',
        emergencyContactRelationship: profile.emergencyContact?.relationship || '',
        emergencyContactPhone: profile.emergencyContact?.phone || '',
        
        // Health Metrics
        bloodType: profile.healthMetrics?.bloodType || '',
        height: profile.healthMetrics?.height || '',
        weight: profile.healthMetrics?.weight || '',
        allergies: profile.healthMetrics?.allergies || '',
        
        // Insurance
        insuranceProvider: profile.insurance?.[0]?.provider || '',
        insurancePolicyNumber: profile.insurance?.[0]?.policyNumber || '',
        insuranceGroupNumber: profile.insurance?.[0]?.groupNumber || '',
        insurancePrimary: profile.insurance?.[0]?.primary || false,
      });
    }
  }, [profile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // The backend requires each section to be updated separately
      let updatedSuccessfully = true;
      let latestResponse;
      
      // 1. First update personal info
      console.log('Updating personal info...');
      
      const personalInfoData = {
        section: 'personal_info',
        personal_info: {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender || null,
          date_of_birth: formData.dateOfBirth,
          address: formData.address || null,
          passport_number: formData.passportNumber || null
        }
      };

      console.log('Sending personal_info update to API:', personalInfoData);
      
      try {
        // Make the first API call to update personal info
        const personalInfoResponse = await patientAPI.updateProfile(personalInfoData);
        console.log('Personal info update response:', personalInfoResponse);
        latestResponse = personalInfoResponse;
        
        if (!personalInfoResponse.data.success) {
          updatedSuccessfully = false;
          throw new Error(personalInfoResponse.data.errors?.[0] || 'Failed to update personal information');
        }
      } catch (error) {
        console.error('Error updating personal info:', error);
        throw error; // Re-throw to be caught by the main try/catch
      }
      
      // 2. Update emergency contact if we have any of the fields
      if (formData.emergencyContactName || formData.emergencyContactRelationship || formData.emergencyContactPhone) {
        console.log('Updating emergency contact...');
        
        const emergencyContactData = {
          section: 'emergency_contact',
          emergency_contact: {
            name: formData.emergencyContactName || null,
            relationship: formData.emergencyContactRelationship || null,
            phone: formData.emergencyContactPhone || null
          }
        };
        
        console.log('Sending emergency_contact update to API:', emergencyContactData);
        
        try {
          // Make the API call to update emergency contact
          const emergencyResponse = await patientAPI.updateProfile(emergencyContactData);
          console.log('Emergency contact update response:', emergencyResponse);
          latestResponse = emergencyResponse;
          
          if (!emergencyResponse.data.success) {
            updatedSuccessfully = false;
            throw new Error(emergencyResponse.data.errors?.[0] || 'Failed to update emergency contact');
          }
        } catch (error) {
          console.error('Error updating emergency contact:', error);
          throw error;
        }
      }
      
      // 3. Update health metrics if any values are provided
      if (formData.bloodType || formData.height || formData.weight || formData.allergies) {
        console.log('Updating health metrics...');
        
        const healthMetricsData = {
          section: 'health_metrics',
          health_metrics: {
            blood_type: formData.bloodType || null,
            height: formData.height || null,
            weight: formData.weight || null,
            // Format allergies as an array which is what the backend expects
            allergies: Array.isArray(formData.allergies) 
              ? formData.allergies 
              : (formData.allergies ? formData.allergies.split(',').map(a => a.trim()).filter(a => a) : [])
          }
        };
        
        console.log('Sending health_metrics update to API:', healthMetricsData);
        
        try {
          // Make the API call to update health metrics
          const healthMetricsResponse = await patientAPI.updateProfile(healthMetricsData);
          console.log('Health metrics update response:', healthMetricsResponse);
          latestResponse = healthMetricsResponse;
          
          if (!healthMetricsResponse.data.success) {
            updatedSuccessfully = false;
            throw new Error(healthMetricsResponse.data.errors?.[0] || 'Failed to update health metrics');
          }
        } catch (error) {
          console.error('Error updating health metrics:', error);
          throw error;
        }
      }
      
      // 4. Update insurance info if any values are provided
      if (formData.insuranceProvider || formData.insurancePolicyNumber || formData.insuranceGroupNumber) {
        console.log('Updating insurance information...');
        
        const insuranceData = {
          section: 'insurance',
          insurance: {
            provider: formData.insuranceProvider || null,
            policy_number: formData.insurancePolicyNumber || null,
            group_number: formData.insuranceGroupNumber || null,
            primary: formData.insurancePrimary
          }
        };
        
        console.log('Sending insurance update to API:', insuranceData);
        
        try {
          // Make the API call to update insurance info
          const insuranceResponse = await patientAPI.updateProfile(insuranceData);
          console.log('Insurance update response:', insuranceResponse);
          latestResponse = insuranceResponse;
          
          if (!insuranceResponse.data.success) {
            updatedSuccessfully = false;
            throw new Error(insuranceResponse.data.errors?.[0] || 'Failed to update insurance information');
          }
        } catch (error) {
          console.error('Error updating insurance information:', error);
          throw error;
        }
      }
      
      // Use the latest response for subsequent processing
      const response = latestResponse;
      console.log('Profile update response:', response);
      
      // Check if the update was successful
      if (response.data.success) {
        // Update the local state with new profile data
        const updatedProfile = {
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender || null,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address || null,
            passportNumber: formData.passportNumber || null
          },
          emergencyContact: {
            name: formData.emergencyContactName || null,
            relationship: formData.emergencyContactRelationship || null,
            phone: formData.emergencyContactPhone || null
          },
          healthMetrics: {
            ...profile.healthMetrics,
            bloodType: formData.bloodType || profile.healthMetrics?.bloodType || null,
            height: formData.height || profile.healthMetrics?.height || null,
            weight: formData.weight || profile.healthMetrics?.weight || null,
            allergies: formData.allergies || profile.healthMetrics?.allergies || null
          },
          insurance: [
            {
              provider: formData.insuranceProvider || (profile.insurance?.[0]?.provider) || null,
              policyNumber: formData.insurancePolicyNumber || (profile.insurance?.[0]?.policyNumber) || null,
              groupNumber: formData.insuranceGroupNumber || (profile.insurance?.[0]?.groupNumber) || null,
              primary: formData.insurancePrimary || (profile.insurance?.[0]?.primary) || false
            }
          ]
        };
        
        onProfileUpdate(updatedProfile);
        onClose();
      } else {
        // Handle API error response
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      
      // Handle specific error types
      if (err?.response?.status === 401) {
        // Authentication error - token might be invalid or expired
        console.warn('Authentication error during profile update. Redirecting to login...');
        // Clear any stored token
        localStorage.removeItem('token');
        // Display error and prepare for redirect
        setError('Your session has expired. You will be redirected to login.');
        // Redirect after a short delay to allow user to see the message
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else if (err?.message?.includes('JWT') || err?.response?.data?.error?.includes('JWT')) {
        // Specific JWT error
        console.warn('JWT-related error detected:', err.message);
        localStorage.removeItem('token');
        setError('Authentication error. Please login again.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        // General error handling
        setError(err?.response?.data?.message || err?.message || 'Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-6">Edit Profile</h3>
                
                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passport/ID Number</label>
                      <input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Information */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Name</label>
                        <input
                          type="text"
                          id="emergencyContactName"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
                        <input
                          type="text"
                          id="emergencyContactRelationship"
                          name="emergencyContactRelationship"
                          value={formData.emergencyContactRelationship}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          id="emergencyContactPhone"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Health Metrics Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Health Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Type</label>
                        <select
                          id="bloodType"
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
                        <input
                          type="number"
                          id="height"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          id="weight"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergies</label>
                        <input
                          type="text"
                          id="allergies"
                          name="allergies"
                          value={formData.allergies}
                          onChange={handleChange}
                          placeholder="Separate with commas"
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Insurance Information Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Insurance Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Provider</label>
                        <input
                          type="text"
                          id="insuranceProvider"
                          name="insuranceProvider"
                          value={formData.insuranceProvider}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Policy Number</label>
                        <input
                          type="text"
                          id="insurancePolicyNumber"
                          name="insurancePolicyNumber"
                          value={formData.insurancePolicyNumber}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="insuranceGroupNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Number</label>
                        <input
                          type="text"
                          id="insuranceGroupNumber"
                          name="insuranceGroupNumber"
                          value={formData.insuranceGroupNumber}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div className="flex items-center mt-6">
                        <input
                          type="checkbox"
                          id="insurancePrimary"
                          name="insurancePrimary"
                          checked={formData.insurancePrimary}
                          onChange={(e) => setFormData(prev => ({ ...prev, insurancePrimary: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="insurancePrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          This is my primary insurance
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-75 flex items-center"
                    >
                      {isSubmitting && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
