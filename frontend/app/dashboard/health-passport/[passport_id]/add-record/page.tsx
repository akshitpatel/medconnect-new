'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';

export default function AddMedicalRecordPage() {
  const router = useRouter();
  const params = useParams();
  const passportId = params.passport_id as string;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    record_type: '',
    title: '',
    provider: '',
    date: '',
    notes: '',
    is_private: false
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
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.record_type || !formData.title || !formData.date) {
        throw new Error('Please fill in all required fields');
      }
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('record_type', formData.record_type);
      formDataObj.append('title', formData.title);
      formDataObj.append('provider', formData.provider);
      formDataObj.append('date', formData.date);
      formDataObj.append('notes', formData.notes);
      formDataObj.append('is_private', String(formData.is_private));
      
      if (selectedFile) {
        formDataObj.append('file', selectedFile);
      }
      
      // Send data to API
      const response = await fetch(`/api/health-passport/${passportId}/records`, {
        method: 'POST',
        body: formDataObj
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add medical record');
      }
      
      // Navigate back to the health passport view
      router.push(`/dashboard/health-passport/view?id=${passportId}`);
      
    } catch (err: any) {
      console.error('Error adding medical record:', err);
      setError(err.message || 'Failed to add medical record. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
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
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Add Medical Record</h1>
            <p className="opacity-80">Add a new medical record to your health passport</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Record Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="record_type" className="block text-gray-700 font-medium mb-2">
                    Record Type*
                  </label>
                  <select
                    id="record_type"
                    name="record_type"
                    value={formData.record_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Record Type</option>
                    <option value="lab_result">Lab Result</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="prescription">Prescription</option>
                    <option value="diagnosis">Diagnosis</option>
                    <option value="procedure">Procedure</option>
                    <option value="imaging">Imaging</option>
                    <option value="vital_signs">Vital Signs</option>
                    <option value="allergy_test">Allergy Test</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                    Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Title/Description*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Blood Test, COVID-19 Vaccination"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="provider" className="block text-gray-700 font-medium mb-2">
                  Healthcare Provider
                </label>
                <input
                  type="text"
                  id="provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Smith, City Hospital"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional information about this record"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Attachment</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                
                {filePreview ? (
                  <div className="mb-4">
                    <img 
                      src={filePreview} 
                      alt="File preview" 
                      className="max-h-48 mx-auto border rounded"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedFile?.name} ({Math.round(selectedFile?.size! / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">
                    <FaUpload className="mx-auto text-3xl mb-2" />
                    <p>Drag and drop a file here, or click to select a file</p>
                    <p className="text-sm mt-1">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                    </p>
                  </div>
                )}
                
                <label
                  htmlFor="file"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block cursor-pointer"
                >
                  {filePreview ? 'Change File' : 'Select File'}
                </label>
                
                {filePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors ml-3"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="is_private"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={handleCheckboxChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="is_private" className="font-medium text-gray-700">
                    Mark as Private
                  </label>
                  <p className="text-gray-500">
                    Private records are only visible to you and will not be shared with healthcare providers
                    who access your health passport, even in emergency situations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
              <Link
                href={`/dashboard/health-passport/view?id=${passportId}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Record
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 bg-gray-50 rounded-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Privacy Information</h2>
          <p className="text-gray-600 text-sm">
            By default, medical records added to your health passport can be accessed by healthcare providers
            you authorize and, if emergency access is enabled, by emergency healthcare providers.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Mark records as private if they contain sensitive information you don't want to share with
            healthcare providers. Private records are only visible to you.
          </p>
        </div>
      </div>
    </div>
  );
} 