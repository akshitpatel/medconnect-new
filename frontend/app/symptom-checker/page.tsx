'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaThumbsUp, FaThumbsDown, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaPhoneAlt } from 'react-icons/fa';
import AIPrediction from '../components/symptom-checker/AIPrediction';
import SimpleSymptomChecker from '../components/symptom-checker/SimpleSymptomChecker';
import ProgressIndicator from '../components/symptom-checker/ProgressIndicator';
import HealthProfile, { HealthProfileData } from '../components/symptom-checker/HealthProfile';
import JourneyNextSteps from '../components/symptom-checker/JourneyNextSteps';
import { Prediction } from '../utils/gemini-api';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ReportProvider, useReportContext } from '../contexts/ReportContext';

// Wrap the main component with ReportProvider
const SymptomCheckerPage = () => {
  return (
    <ReportProvider>
      <SymptomCheckerContent />
    </ReportProvider>
  );
};

// Create the main content component that uses the context
const SymptomCheckerContent = () => {
  const [step, setStep] = useState<'instructions' | 'input' | 'results' | 'feedback' | 'userinfo'>('instructions');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [transitionClass, setTransitionClass] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phoneNumber: '' });
  const [userInfoError, setUserInfoError] = useState<string | null>(null);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [reminderEmail, setReminderEmail] = useState<string>('');
  const [reminderPhone, setReminderPhone] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('24h');
  const [reminderSubmitted, setReminderSubmitted] = useState<boolean>(false);
  
  // Generate a session ID to track this user's journey through the symptom checker
  const [sessionId] = useState<string>(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  
  // Get context values
  const { reports, setReports, userData, setUserData } = useReportContext();
  
  // File upload refs and handlers
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle completion from symptom checker
  const handleSymptomCheckerComplete = (result: Prediction) => {
    setPrediction(result);
    setTransitionClass('opacity-0 transform translate-y-4');
    setTimeout(() => {
      setStep('userinfo');
      setTimeout(() => {
        setTransitionClass('');
        // Scroll to top for mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
    
    // Log the check in analytics with more detailed information
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_completed',
          data: {
            sessionId,
            possibleCauses: result.possibleCauses.map(cause => cause.condition),
            recommendedSpecialties: result.recommendedSpecialties,
            emergencyWarning: result.emergencyWarning,
            hasGenderContext: !!result.genderSpecificConsiderations,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log analytics:', error);
    }
  };

  // Handle feedback submission
  const handleFeedback = async (isHelpful: boolean) => {
    setFeedback(isHelpful ? 'helpful' : 'not-helpful');
    
    // Log feedback to analytics with more context
    try {
      await fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_feedback',
          data: {
            sessionId,
            isHelpful,
            symptoms: prediction?.possibleCauses.map(cause => cause.condition) || [],
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log feedback:', error);
    }
  };

  // Start over from the beginning
  const startOver = () => {
    // Log starting over
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_start_over',
          data: {
            sessionId,
            fromStep: step,
            hadPrediction: !!prediction,
            hadUserInfo: !!userInfo.name,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log start over:', error);
    }
    
    setTransitionClass('opacity-0 transform translate-y-4');
    setTimeout(() => {
      setPrediction(null);
      setStep('instructions');
      setFeedback(null);
      setUserInfo({ name: '', phoneNumber: '' });
      setUserInfoError(null);
      setReports([]);
      setTimeout(() => {
        setTransitionClass('');
        // Scroll to top for mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
  };

  // Handle finding a doctor based on specialization
  const handleFindDoctor = (specialization: string) => {
    // Log finding a doctor
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_find_doctor',
          data: {
            sessionId,
            specialization,
            fromResults: step === 'results',
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log find doctor:', error);
    }
    
    // Redirect to doctors page with the specialization filter
    window.location.href = `/doctors?specialization=${encodeURIComponent(specialization)}`;
  };

  // Proceed to symptom checker after agreeing to terms
  const proceedToSymptomChecker = () => {
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions before proceeding.");
      return;
    }
    
    // Log starting the symptom checker
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_started',
          data: {
            sessionId,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log symptom check start:', error);
    }
    
    setTransitionClass('opacity-0 transform translate-y-4');
    setTimeout(() => {
      setStep('input');
      setTimeout(() => {
        setTransitionClass('');
        // Scroll to top for mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
  };
  
  // Handle user info submission
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfoError(null);
    
    // Validate
    if (!userInfo.name || !userInfo.phoneNumber) {
      setUserInfoError("Please provide both your name and phone number");
      return;
    }
    
    // Phone number validation
    const phoneRegex = /^[\d\+\-\(\) ]{10,15}$/;
    if (!phoneRegex.test(userInfo.phoneNumber)) {
      setUserInfoError("Please enter a valid phone number");
      return;
    }
    
    // Save user data to context
    setUserData(userInfo);
    
    // Create a masked phone number for analytics
    const maskedPhone = userInfo.phoneNumber.substring(0, 3) + '****' + 
      userInfo.phoneNumber.substring(userInfo.phoneNumber.length - 4);
    
    // Log user data along with symptoms
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_user_info',
          data: {
            sessionId,
            user: {
              name: userInfo.name,
              phoneNumber: maskedPhone // Use masked phone for privacy
            },
            prediction: prediction ? {
              possibleCauses: prediction.possibleCauses.map(cause => cause.condition),
              recommendedSpecialties: prediction.recommendedSpecialties
            } : null,
            timestamp: new Date().toISOString(),
            hasReports: reports.length > 0,
            reportCount: reports.length,
            reportTypes: reports.map(file => file.type)
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log user info:', error);
    }
    
    // Proceed to results
    setTransitionClass('opacity-0 transform translate-y-4');
    setTimeout(() => {
      setStep('results');
      setTimeout(() => {
        setTransitionClass('');
        // Scroll to top for mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setReports(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setReports(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Handle scheduling a reminder
  const handleScheduleReminder = () => {
    setShowReminderModal(true);
    
    // Log opening the reminder modal
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_reminder_modal_opened',
          data: {
            sessionId,
            journeyType: 'symptom_checker',
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Failed to log reminder modal open:', error);
    }
  };
  
  // Handle submitting a reminder
  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one contact method
    if (!reminderEmail && !reminderPhone) {
      alert('Please provide either an email or phone number for the reminder.');
      return;
    }
    
    // Log reminder submission
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'symptom_check_reminder_submitted',
          data: {
            sessionId,
            journeyType: 'symptom_checker',
            reminderTime,
            hasEmail: !!reminderEmail,
            hasPhone: !!reminderPhone,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      
      // Actually save the reminder (in a real app, this would be a separate API call)
      fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: reminderEmail,
          phone: reminderPhone,
          timeframe: reminderTime,
          type: 'symptom_check_followup',
          userData: {
            name: userInfo.name,
            symptoms: prediction?.possibleCauses.map(cause => cause.condition) || [],
          },
          sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to log reminder submission:', error);
    }
    
    setReminderSubmitted(true);
    
    // Close modal after a delay
    setTimeout(() => {
      setShowReminderModal(false);
      setReminderSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 relative">
        <div className="container mx-auto px-4 transition-all duration-500 ease-in-out transform">
          {/* Page title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered tool can help you understand possible causes for your symptoms and guide you toward appropriate care.
            </p>
          </div>

          <div className={`transition-all duration-300 ease-in-out ${transitionClass} pb-24 md:pb-0`}>
            {step === 'instructions' && (
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                {/* Important information section */}
                <div className="bg-teal-50 border-l-4 border-teal-500 p-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaInfoCircle className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-teal-800">Important Information</h3>
                      <p className="mt-2 text-teal-700">
                        This symptom checker is for informational purposes only and is not a qualified medical opinion. 
                        Always consult with a healthcare professional for medical advice, diagnosis, or treatment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Before You Begin</h2>
                  
                  {/* Instructions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">How to Use the Symptom Checker</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                      <li>Select your gender to help us provide more accurate gender-specific health information</li>
                      <li>Identify the body part where you're experiencing symptoms</li>
                      <li>Enter your symptoms in as much detail as possible</li>
                      <li>Provide additional information such as your age and symptom duration</li>
                      <li>Our AI will analyze your information and provide possible causes and recommendations</li>
                    </ol>
                  </div>
                  
                  {/* When to seek emergency care */}
                  <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
                    <h3 className="flex items-center text-lg font-medium text-red-800 mb-3">
                      <FaExclamationTriangle className="mr-2 text-red-600" />
                      When to Seek Emergency Care
                    </h3>
                    <p className="text-red-700 mb-3">
                      Do not use this tool in medical emergencies. Call emergency services or go to the nearest emergency room immediately if you experience:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-red-700">
                      <li>Chest pain or pressure</li>
                      <li>Difficulty breathing</li>
                      <li>Severe bleeding</li>
                      <li>Sudden numbness or weakness</li>
                      <li>Sudden severe headache</li>
                      <li>Loss of consciousness</li>
                    </ul>
                    <div className="mt-3 flex items-center">
                      <FaPhoneAlt className="text-red-600 mr-2" />
                      <span className="font-medium text-red-800">Emergency: Call 911 or your local emergency number</span>
                    </div>
                  </div>
                  
                  {/* Medical declaration */}
                  <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Medical Declaration</h3>
                    <p className="text-gray-700 mb-4">
                      By proceeding, you acknowledge and agree to the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>This tool does not provide medical advice, diagnosis, or treatment</li>
                      <li>The information provided is not a substitute for professional medical advice</li>
                      <li>The AI analysis is based on the information you provide and may not capture all relevant health factors</li>
                      <li>You should always consult with a qualified healthcare provider before making any health decisions</li>
                      <li>In case of a medical emergency, contact emergency services immediately</li>
                      <li>Your data will be processed according to our <Link href="/privacy" className="text-teal-600 hover:text-teal-800">Privacy Policy</Link></li>
                    </ul>
                    
                    <div className="mt-5 flex items-center">
                      <input 
                        type="checkbox" 
                        id="agree-terms" 
                        className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                        I have read and agree to the terms and conditions above
                      </label>
                    </div>
                  </div>
                  
                  {/* Start button */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={proceedToSymptomChecker}
                      className={`px-6 py-3 text-lg font-medium rounded-lg shadow-sm transition duration-200 
                        ${agreedToTerms 
                          ? 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-4 focus:ring-teal-300' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      disabled={!agreedToTerms}
                    >
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2" />
                        Begin Symptom Check
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 'input' && (
              <SimpleSymptomChecker onComplete={handleSymptomCheckerComplete} />
            )}
            
            {step === 'userinfo' && prediction && (
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-50 border-l-4 border-teal-500 p-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaInfoCircle className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-teal-800">One Last Step</h3>
                      <p className="mt-2 text-teal-700">
                        Please provide your contact information to view your results. 
                        You can also upload any medical reports or prescriptions that may be relevant to your symptoms.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  {userInfoError && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{userInfoError}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleUserInfoSubmit}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          We'll use this to provide you with better medical assistance.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            onChange={(e) => setUserInfo({...userInfo, phoneNumber: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter your phone number"
                            required
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            We may contact you for follow-up care if necessary
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Upload Reports (Optional)</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Share any relevant medical reports or prescriptions with us.
                        </p>
                        
                        <div 
                          className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition duration-150"
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
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="font-medium text-teal-600 hover:text-teal-500">
                              Click to upload
                            </span> or drag and drop
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PDF, PNG, JPG, DOC up to 10MB
                          </p>
                        </div>
                        
                        {reports.length > 0 && (
                          <ul className="mt-3 divide-y divide-gray-200">
                            {reports.map((file, index) => (
                              <li key={index} className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 flex-1 text-sm text-gray-700 truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      {/* Mobile-friendly buttons - fixed to bottom on mobile */}
                      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between md:hidden z-10">
                        <button
                          type="button"
                          onClick={startOver}
                          className="w-1/2 mr-2 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <FaArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </button>
                        
                        <button
                          type="submit"
                          className="w-1/2 ml-2 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          View Results
                          <FaArrowLeft className="ml-2 h-4 w-4 transform rotate-180" />
                        </button>
                      </div>
                      
                      {/* Desktop buttons */}
                      <div className="hidden md:flex items-center justify-between pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={startOver}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
                          Back to Symptoms
                        </button>
                        
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          View Results
                          <FaArrowLeft className="ml-2 -mr-1 h-5 w-5 transform rotate-180" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {step === 'results' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                      <button 
                        onClick={startOver} 
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Start Over
                      </button>
                    </div>
                    
                    {prediction && (
                      <>
                        <AIPrediction prediction={prediction} onFindDoctor={handleFindDoctor} />
                        
                        {/* Feedback section */}
                        {!feedback ? (
                          <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Was this helpful?</h3>
                            <div className="flex space-x-4">
                              <button
                                onClick={() => handleFeedback(true)}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <FaThumbsUp className="mr-2" />
                                Yes, it was helpful
                              </button>
                              <button
                                onClick={() => handleFeedback(false)}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                <FaThumbsDown className="mr-2" />
                                No, not really
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className={`rounded-md p-4 ${feedback === 'helpful' ? 'bg-green-50' : 'bg-gray-50'}`}>
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  {feedback === 'helpful' ? (
                                    <FaThumbsUp className={`h-5 w-5 text-green-400`} />
                                  ) : (
                                    <FaThumbsDown className={`h-5 w-5 text-gray-400`} />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <h3 className={`text-sm font-medium ${feedback === 'helpful' ? 'text-green-800' : 'text-gray-800'}`}>
                                    {feedback === 'helpful' 
                                      ? 'Thank you for your feedback!' 
                                      : 'Thank you for your feedback. We\'ll work to improve our recommendations.'}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Next Steps Component */}
                {prediction && (
                  <JourneyNextSteps 
                    prediction={prediction}
                    sessionId={sessionId}
                    onFindDoctor={handleFindDoctor}
                    onScheduleReminder={handleScheduleReminder}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Reminder Modal */}
        {showReminderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                {!reminderSubmitted ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule a Follow-up Reminder</h3>
                    <p className="text-gray-600 mb-4">
                      We'll send you a reminder to check in on your symptoms. Please provide at least one contact method.
                    </p>
                    
                    <form onSubmit={handleReminderSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          value={reminderEmail}
                          onChange={(e) => setReminderEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number (optional)
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          value={reminderPhone}
                          onChange={(e) => setReminderPhone(e.target.value)}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          When to remind you
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                        >
                          <option value="24h">Tomorrow</option>
                          <option value="3d">In 3 days</option>
                          <option value="1w">In 1 week</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => setShowReminderModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-teal-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-teal-700"
                        >
                          Schedule Reminder
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <FaCheckCircle className="mx-auto text-green-500 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Reminder Scheduled!</h3>
                    <p className="text-gray-600">
                      We'll send you a reminder to check in on your symptoms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SymptomCheckerPage;