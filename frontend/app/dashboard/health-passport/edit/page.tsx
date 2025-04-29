'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';

interface EmergencyContact {
  name: string;
  relationship?: string;
  phone: string;
  email?: string;
}

export default function EditHealthPassportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passportId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    blood_type: '',
    allergies: '',
    chronic_conditions: '',
    emergency_access: false,
    emergency_contacts: [] as EmergencyContact[]
  });
  
  // Fetch health passport data
  useEffect(() => {
    const fetchPassport = async () => {
      if (!passportId) {
        router.push('/dashboard/health-passport');
        return;
      }
      
      try {
        const response = await fetch(`/api/health-passport/${passportId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch health passport');
        }
        
        const data = await response.json();
        const passport = data.passport;
        
        // Format allergies and chronic conditions as comma-separated strings
        const allergiesString = passport.allergies ? passport.allergies.join(', ') : '';
        const chronicConditionsString = passport.chronic_conditions ? passport.chronic_conditions.join(', ') : '';
        
        setFormData({
          blood_type: passport.blood_type || '',
          allergies: allergiesString,
          chronic_conditions: chronicConditionsString,
          emergency_access: passport.emergency_access || false,
          emergency_contacts: passport.emergency_contacts || []
        });
        
      } catch (err: any) {
        console.error('Error fetching passport:', err);
        setError(err.message || 'Failed to load health passport');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPassport();
  }, [passportId, router]);
  
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
  
  // Handle emergency contact changes
  const handleContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    setFormData(prev => {
      const updatedContacts = [...prev.emergency_contacts];
      updatedContacts[index] = {
        ...updatedContacts[index],
        [field]: value
      };
      return {
        ...prev,
        emergency_contacts: updatedContacts
      };
    });
  };
  
  // Add new emergency contact
  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: [
        ...prev.emergency_contacts,
        { name: '', phone: '' }
      ]
    }));
  };
  
  // Remove emergency contact
  const removeEmergencyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Process allergies and chronic conditions from comma-separated string to array
      const allergiesArray = formData.allergies
        ? formData.allergies.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];
      
      const chronicConditionsArray = formData.chronic_conditions
        ? formData.chronic_conditions.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];
      
      // Filter out incomplete emergency contacts
      const validEmergencyContacts = formData.emergency_contacts.filter(
        contact => contact.name.trim() !== '' && contact.phone.trim() !== ''
      );
      
      // Prepare data for API
      const healthPassportData = {
        blood_type: formData.blood_type || undefined,
        allergies: allergiesArray,
        chronic_conditions: chronicConditionsArray,
        emergency_contacts: validEmergencyContacts,
        emergency_access: formData.emergency_access
      };
      
      // Send data to API
      const response = await fetch(`/api/health-passport/${passportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(healthPassportData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update health passport');
      }
      
      // Navigate to the health passport view page
      router.push(`/dashboard/health-passport/view?id=${passportId}`);
      
    } catch (err: any) {
      console.error('Error updating health passport:', err);
      setError(err.message || 'Failed to update health passport. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle passport deletion
  const handleDelete = async () => {
    if (!passportId) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/health-passport/${passportId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete health passport');
      }
      
      // Navigate back to the health passport page
      router.push('/dashboard/health-passport');
      
    } catch (err: any) {
      console.error('Error deleting health passport:', err);
      setError(err.message || 'Failed to delete health passport. Please try again.');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/dashboard/health-passport/view?id=${passportId}`}
            className="text-teal-600 hover:text-teal-700 flex items-center font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Health Passport
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Edit Health Passport</h1>
            <p className="opacity-80">Update your health information</p>
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
                  List your allergies separated by commas.
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Emergency Contacts</h2>
                <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors text-sm"
                >
                  + Add Contact
                </button>
              </div>
              
              {formData.emergency_contacts.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center mb-4">
                  <p className="text-gray-500">No emergency contacts added</p>
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="mt-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Add your first emergency contact
                  </button>
                </div>
              ) : (
                formData.emergency_contacts.map((contact, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-700">Contact #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove contact"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Name*
                        </label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={contact.relationship || ''}
                          onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                          placeholder="e.g., Spouse, Parent, Sibling"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                          placeholder="+1 (123) 456-7890"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={contact.email || ''}
                          onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                          placeholder="email@example.com"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              <div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete Passport
                </button>
              </div>
              
              <div className="flex space-x-3">
                <Link
                  href={`/dashboard/health-passport/view?id=${passportId}`}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Health Passport</h2>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your health passport? This action cannot be undone and all your health data will be permanently removed.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 