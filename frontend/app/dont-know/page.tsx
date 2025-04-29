'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FaUser, 
  FaPhone, 
  FaCalendarAlt, 
  FaUpload, 
  FaFileMedical, 
  FaFilePrescription, 
  FaHeartbeat, 
  FaArrowRight, 
  FaSpinner 
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DontKnowPage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    hasRecentVisit: false,
    additionalInfo: ''
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate required fields
    if (!formData.name || !formData.phoneNumber) {
      setError("Name and phone number are required");
      return;
    }
    
    // Phone number validation
    const phoneRegex = /^[\d\+\-\(\) ]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setUploading(true);
    
    try {
      // Create form data for files upload
      const formDataToSend = new FormData();
      formDataToSend.append('patientInfo', JSON.stringify(formData));
      
      files.forEach((file, index) => {
        formDataToSend.append(`file-${index}`, file);
      });
      
      // Send data to backend
      // const response = await fetch('/api/patient-assistance', {
      //   method: 'POST',
      //   body: formDataToSend
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit form');
      // }
      
      // Mock successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      
      // Log to analytics
      try {
        await fetch('/api/analytics/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'patient_assistance_request',
            data: {
              patientName: formData.name,
              phoneNumber: formData.phoneNumber,
              hasFiles: files.length > 0,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      } catch (analyticsError) {
        console.error('Failed to log analytics:', analyticsError);
      }
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was a problem submitting your request. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Medical Assistance</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Not sure what's wrong? Share your symptoms and medical reports with us, and our healthcare team will get back to you.
              </p>
            </div>
            
            {!submitted ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FaHeartbeat className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information */}
                    <div className="col-span-2">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Your contact number"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">We'll contact you on this number</p>
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="0"
                          max="120"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Your age"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other/Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    
                    {/* Symptoms Information */}
                    <div className="col-span-2 mt-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Symptoms Information</h2>
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                        Describe your symptoms
                      </label>
                      <textarea
                        id="symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Please describe what you're experiencing in detail"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        How long have you had these symptoms?
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="">Select duration</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                    
                    <div>
                      <div className="flex items-center h-full">
                        <input
                          id="hasRecentVisit"
                          name="hasRecentVisit"
                          type="checkbox"
                          checked={formData.hasRecentVisit}
                          onChange={handleChange}
                          className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor="hasRecentVisit" className="ml-2 block text-sm text-gray-900">
                          I have recently visited a doctor for these symptoms
                        </label>
                      </div>
                    </div>
                    
                    {/* Upload Medical Records */}
                    <div className="col-span-2 mt-4">
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Records</h2>
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition duration-150"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-teal-600 hover:text-teal-500">
                            Upload files
                          </span> or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          PDF, JPG, PNG, DOC up to 10MB each
                        </p>
                      </div>
                      
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Uploaded files:</p>
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                              <div className="flex items-center">
                                {file.type.includes('pdf') ? (
                                  <FaFilePrescription className="text-red-500 mr-2" />
                                ) : (
                                  <FaFileMedical className="text-blue-500 mr-2" />
                                )}
                                <span className="text-sm text-gray-800 truncate max-w-xs">{file.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <FaFileMedical />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Information */}
                    <div className="col-span-2 mt-2">
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                        Any additional information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Additional details about your medical history, allergies, or other relevant information"
                      ></textarea>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="col-span-2 mt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                          <span className="text-red-500">*</span> Required fields
                        </p>
                        <div className="flex space-x-4">
                          <Link 
                            href="/symptom-checker"
                            className="inline-flex justify-center py-2 px-4 border border-teal-600 shadow-sm text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                          >
                            Try Self-Checker
                          </Link>
                          <button
                            type="submit"
                            disabled={uploading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300"
                          >
                            {uploading ? (
                              <>
                                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Request <FaArrowRight className="ml-2" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
                  <FaHeartbeat className="h-8 w-8 text-teal-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Thank You for Your Submission</h2>
                <p className="mt-2 text-gray-600">
                  We've received your request and our medical team will contact you at {formData.phoneNumber} soon.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Return to Home
                  </Link>
                  <Link
                    href="/symptom-checker"
                    className="inline-flex justify-center py-2 px-4 border border-teal-600 shadow-sm text-sm font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Try Symptom Checker
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 