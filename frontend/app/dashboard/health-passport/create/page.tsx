'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function CreateHealthPassportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    blood_type: '',
    allergies: '',
    chronic_conditions: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    emergency_contact_email: '',
    emergency_access: false,
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Process allergies and chronic conditions from comma-separated string to array
      const allergiesArray = formData.allergies
        ? formData.allergies.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];
      
      const chronicConditionsArray = formData.chronic_conditions
        ? formData.chronic_conditions.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];
      
      // Create emergency contact if provided
      const emergencyContacts = [];
      if (formData.emergency_contact_name && formData.emergency_contact_phone) {
        emergencyContacts.push({
          name: formData.emergency_contact_name,
          relationship: formData.emergency_contact_relationship,
          phone: formData.emergency_contact_phone,
          email: formData.emergency_contact_email || undefined
        });
      }
      
      // Prepare data for API
      const healthPassportData = {
        blood_type: formData.blood_type || undefined,
        allergies: allergiesArray,
        chronic_conditions: chronicConditionsArray,
        emergency_contacts: emergencyContacts,
        emergency_access: formData.emergency_access
      };
      
      // Send data to API
      const response = await fetch('/api/health-passport/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(healthPassportData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create health passport');
      }
      
      const data = await response.json();
      
      // Navigate to the health passport page
      router.push('/dashboard/health-passport');
      
    } catch (err: any) {
      console.error('Error creating health passport:', err);
      setError(err.message || 'Failed to create health passport. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-600 p-6 text-white">
            <Link href="/dashboard/health-passport" className="text-white hover:text-teal-200 transition-colors inline-flex items-center mb-4">
              <FaArrowLeft className="mr-2" /> Back to Health Passport
            </Link>
            <h1 className="text-2xl font-bold">Create Health Passport</h1>
            <p className="opacity-80">Enter your health information below</p>
            <div className="mt-3 bg-teal-500 p-3 rounded-md text-sm">
              <p>Your Health Passport number will be automatically generated based on your phone number to create a unique identifier.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Basic Health Information</h2>
              
              <div className="mb-4">
                <label htmlFor="blood_type" className="block text-gray-700 font-medium mb-2">
                  Blood Type
                </label>
                <select
                  id="blood_type"
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <option value="Unknown">Unknown</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select your blood type if known. This is important in emergency situations.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="allergies" className="block text-gray-700 font-medium mb-2">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Peanuts, Penicillin, Latex"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  List your allergies separated by commas. Include food, medication, and environmental allergies.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="chronic_conditions" className="block text-gray-700 font-medium mb-2">
                  Chronic Conditions
                </label>
                <textarea
                  id="chronic_conditions"
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g., Diabetes, Asthma, Hypertension"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  List any chronic health conditions you have, separated by commas.
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="emergency_contact_name" className="block text-gray-700 font-medium mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="emergency_contact_relationship" className="block text-gray-700 font-medium mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="emergency_contact_relationship"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleChange}
                    placeholder="e.g., Spouse, Parent, Sibling"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="emergency_contact_phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="emergency_contact_email" className="block text-gray-700 font-medium mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="emergency_contact_email"
                    name="emergency_contact_email"
                    value={formData.emergency_contact_email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Access Settings</h2>
              
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="emergency_access"
                    name="emergency_access"
                    checked={formData.emergency_access}
                    onChange={handleCheckboxChange}
                    className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emergency_access" className="font-medium text-gray-700">
                    Enable Emergency Access
                  </label>
                  <p className="text-gray-500">
                    Allow emergency healthcare providers to access your critical health information
                    without authentication in emergency situations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-between">
              <Link
                href="/dashboard/health-passport"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Create Health Passport
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Privacy Information</h2>
          <p className="text-gray-600 text-sm">
            Your health passport data is stored securely and is only accessible to you and healthcare providers
            you explicitly grant access to. You can revoke access at any time.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Emergency access should only be enabled if you have medical conditions that emergency responders 
            should know about. This allows critical information to be accessed in emergency situations.
          </p>
        </div>
      </div>
    </div>
  );
} 