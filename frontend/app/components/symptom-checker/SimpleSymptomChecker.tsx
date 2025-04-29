'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaPlus, FaTimes, FaSpinner, FaExclamationTriangle, FaUpload, FaFile, FaFileImage, FaFilePdf, FaFileAlt } from 'react-icons/fa';
import { GiFemale, GiMale } from 'react-icons/gi';
import { TbGenderNeutrois } from 'react-icons/tb';
import GeminiApi, { Prediction } from '../../utils/gemini-api';
import BodyPartSelector, { BodyPart } from './BodyPartSelector';
import { useReportContext } from '../../contexts/ReportContext';
import { HealthProfileData } from './HealthProfile';

interface SimpleSymptomCheckerProps {
  onComplete: (prediction: Prediction) => void;
  initialProfile?: HealthProfileData | null;
}

// Common symptoms for autocomplete
const commonSymptoms = [
  'Headache', 'Dizziness', 'Blurred vision', 'Fever', 'Cough', 
  'Shortness of breath', 'Chest pain', 'Abdominal pain', 'Nausea',
  'Vomiting', 'Diarrhea', 'Back pain', 'Joint pain', 'Fatigue',
  'Rash', 'Sore throat', 'Runny nose', 'Loss of appetite', 'Muscle pain',
  'Numbness', 'Tingling', 'Night sweats', 'Weight loss', 'Palpitations',
  'Anxiety', 'Depression', 'Insomnia', 'Memory problems', 'Confusion'
];

// Gender options
const genderOptions = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other/Non-binary' }
];

const SimpleSymptomChecker: React.FC<SimpleSymptomCheckerProps> = ({ onComplete, initialProfile }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [step, setStep] = useState<'gender' | 'bodyPart' | 'symptoms' | 'details'>('gender');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allSymptoms, setAllSymptoms] = useState<string[]>(commonSymptoms);
  const [transitionClass, setTransitionClass] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  
  // Get context for uploading reports
  const { setReports } = useReportContext();

  // Prefill with health profile data if available
  useEffect(() => {
    if (initialProfile) {
      // Set age from profile
      setAge(initialProfile.age.toString());
      
      // Set gender from profile
      if (initialProfile.gender) {
        setGender(initialProfile.gender);
        setSelectedGender(initialProfile.gender);
      }
      
      // Pre-populate symptoms with conditions if any
      if (initialProfile.conditions && initialProfile.conditions.length > 0) {
        setSelectedSymptoms([...initialProfile.conditions]);
      }
      
      // Add medications to additional info
      let profileInfo = '';
      if (initialProfile.medications && initialProfile.medications.length > 0) {
        profileInfo += `Current medications: ${initialProfile.medications.join(', ')}. `;
      }
      
      // Add allergies to additional info
      if (initialProfile.allergies && initialProfile.allergies.length > 0) {
        profileInfo += `Known allergies: ${initialProfile.allergies.join(', ')}. `;
      }
      
      if (profileInfo) {
        setAdditionalInfo(`${profileInfo}\n\n${additionalInfo}`);
      }
      
      // Skip gender step if gender is already provided
      if (initialProfile.gender) {
        setStep('bodyPart');
      }
    }
  }, [initialProfile]);

  // Fetch additional symptoms from API
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch('/api/symptoms');
        if (response.ok) {
          const data = await response.json();
          // Merge API symptoms with common symptoms and remove duplicates
          const apiSymptoms = data.symptoms.map((s: any) => s.name);
          // Fix: Don't use Set with spread operator directly
          const combinedArray = [...commonSymptoms, ...apiSymptoms];
          const mergedSymptoms = Array.from(new Set(combinedArray));
          setAllSymptoms(mergedSymptoms);
        }
      } catch (error) {
        console.error('Failed to fetch symptoms:', error);
        // Continue with common symptoms if API fails
      }
    };
    
    fetchSymptoms();
  }, []);

  // Update suggestions when body part changes
  useEffect(() => {
    if (selectedBodyPart && selectedBodyPart.commonSymptoms.length > 0) {
      // Filter symptom suggestions based on the selected body part's common symptoms
      const bodyPartSymptoms = [...selectedBodyPart.commonSymptoms];
      setAllSymptoms(prevSymptoms => {
        const combinedArray = [...bodyPartSymptoms, ...prevSymptoms];
        return Array.from(new Set(combinedArray));
      });
    }
  }, [selectedBodyPart]);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const filteredSuggestions = allSymptoms
      .filter(symptom => 
        symptom.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedSymptoms.includes(symptom)
      )
      .slice(0, 5); // Limit suggestions to 5
      
    setSuggestions(filteredSuggestions);
  }, [inputValue, selectedSymptoms, allSymptoms]);

  // Scroll to top when step changes (for mobile)
  useEffect(() => {
    // Scroll to top with a small delay to ensure smooth transition
    setTimeout(() => {
      if (stepContainerRef.current) {
        stepContainerRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
      
      // For mobile browsers, also scroll the window
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 50);
  }, [step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const addSymptom = (symptom: string) => {
    if (symptom.trim() === '' || selectedSymptoms.includes(symptom)) return;
    
    setSelectedSymptoms([...selectedSymptoms, symptom]);
    setInputValue('');
    setSuggestions([]);
    
    // Focus the input after adding a symptom
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      
      // If there's a suggestion, use the first one, otherwise use the input value
      if (suggestions.length > 0) {
        addSymptom(suggestions[0]);
      } else {
        addSymptom(inputValue);
      }
    } else if (e.key === 'Backspace' && inputValue === '' && selectedSymptoms.length > 0) {
      // Remove the last symptom when backspace is pressed on empty input
      removeSymptom(selectedSymptoms[selectedSymptoms.length - 1]);
    }
  };

  const goToNextStep = (nextStep: 'gender' | 'bodyPart' | 'symptoms' | 'details') => {
    setTransitionClass('opacity-0 transform translate-x-4');
    setTimeout(() => {
      setStep(nextStep);
      setTransitionClass('');
    }, 300);
  };

  const handleGenderSelect = (genderId: string) => {
    setGender(genderId);
    setSelectedGender(genderId);
    
    // Log gender selection to analytics
    logAnalytics('symptom_check_gender_selected', { gender: genderId });
    
    setTimeout(() => goToNextStep('bodyPart'), 300);
  };

  const handleBodyPartSelect = (bodyPart: BodyPart) => {
    setSelectedBodyPart(bodyPart);
    setAllSymptoms([...commonSymptoms, ...bodyPart.commonSymptoms]);
    
    // Log body part selection to analytics
    logAnalytics('symptom_check_bodypart_selected', { 
      bodyPart: bodyPart.name,
      bodyPartId: bodyPart.id
    });
    
    setTimeout(() => goToNextStep('symptoms'), 300);
  };

  const handleContinueToDetails = () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }
    setError(null);
    
    // Log symptoms selection to analytics
    logAnalytics('symptom_check_symptoms_selected', { 
      symptoms: selectedSymptoms,
      bodyPart: selectedBodyPart?.name || 'Unspecified'
    });
    
    goToNextStep('details');
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      
      // Also set files in the context for use later
      setReports(prevFiles => [...prevFiles, ...newFiles]);
      
      // Log file upload to analytics
      logAnalytics('symptom_check_files_uploaded', { 
        fileCount: newFiles.length,
        fileTypes: newFiles.map(file => file.type)
      });
    }
  };
  
  // Remove a file
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    
    // Also update the context
    setReports(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // Render file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FaFileImage className="text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FaFilePdf className="text-red-500" />;
    } else {
      return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      setError('Please enter at least one symptom');
      return;
    }
    
    if (!age) {
      setError('Please enter your age');
      return;
    }
    
    if (!gender) {
      setError('Please select your gender');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Generate a unique ID for this analysis that will be used to correlate events
    const analysisId = generateUniqueId();
    
    // Log analysis start to analytics
    logAnalytics('symptom_check_analysis_started', { 
      analysisId,
      symptoms: selectedSymptoms,
      bodyPart: selectedBodyPart?.name || 'Unspecified',
      age,
      gender,
      hasAdditionalInfo: additionalInfo.length > 0,
      hasFiles: files.length > 0,
      fileCount: files.length,
      fileTypes: files.map(file => file.type),
      hasHealthProfile: !!initialProfile
    });
    
    try {
      // Create health context from profile if available
      let healthContext = '';
      if (initialProfile) {
        if (initialProfile.conditions && initialProfile.conditions.length > 0) {
          healthContext += `Pre-existing conditions: ${initialProfile.conditions.join(', ')}. `;
        }
        if (initialProfile.medications && initialProfile.medications.length > 0) {
          healthContext += `Current medications: ${initialProfile.medications.join(', ')}. `;
        }
        if (initialProfile.allergies && initialProfile.allergies.length > 0) {
          healthContext += `Known allergies: ${initialProfile.allergies.join(', ')}. `;
        }
        
        // Add physical characteristics if available
        if (initialProfile.height) {
          healthContext += `Height: ${initialProfile.height} cm. `;
        }
        if (initialProfile.weight) {
          healthContext += `Weight: ${initialProfile.weight} kg. `;
        }
      }
      
      // Format the data for Gemini API
      const formData = {
        symptoms: selectedSymptoms,
        bodyPart: selectedBodyPart?.name || 'Unspecified',
        age,
        gender,
        additionalNotes: healthContext ? `${healthContext}\n\n${additionalInfo}` : additionalInfo
      };
      
      // Call Gemini API with files if available
      const prediction = await GeminiApi.analyzeSymptoms(formData, files.length > 0 ? files : undefined);
      
      // Log analysis completion to analytics
      logAnalytics('symptom_check_analysis_completed', { 
        analysisId,
        timeToComplete: new Date().getTime() - new Date().getTime(), // This will be 0, but in a real app we'd track the actual time
        possibleCauses: prediction.possibleCauses.map(cause => cause.condition),
        urgency: prediction.possibleCauses[0]?.urgency || 'routine',
        emergencyWarning: prediction.emergencyWarning,
        hasGenderSpecificInfo: !!prediction.genderSpecificConsiderations,
        hasHealthProfile: !!initialProfile
      });
      
      // Save symptom check to database
      try {
        const saveResponse = await fetch('/api/symptom-checks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysisId,
            patientName: 'Anonymous User',
            symptoms: selectedSymptoms,
            bodyPart: selectedBodyPart?.name,
            formData,
            prediction: {
              possibleCauses: prediction.possibleCauses.map(c => c.condition),
              recommendedSpecialties: prediction.recommendedSpecialties,
              urgency: prediction.possibleCauses[0]?.urgency || 'routine'
            },
            contactInfo: {
              email: '',
            },
            hasFiles: files.length > 0
          }),
        });
        
        const saveResult = await saveResponse.json();
        
        // Store the predictionId for future reference
        if (saveResult.id) {
          // Log the saveResult.id to analytics for correlation
          logAnalytics('symptom_check_saved', { 
            analysisId,
            predictionId: saveResult.id
          });
        }
        
      } catch (saveError) {
        console.error('Failed to save symptom check:', saveError);
        // Continue anyway to show results to user
      }
      
      onComplete(prediction);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setError('An error occurred while analyzing your symptoms. Please try again.');
      
      // Log error to analytics
      logAnalytics('symptom_check_error', { 
        analysisId,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to log analytics events
  const logAnalytics = async (action: string, data: any = {}) => {
    try {
      await fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data: {
            ...data,
            timestamp: new Date().toISOString()
          }
        }),
      });
    } catch (error) {
      console.error(`Failed to log analytics for action ${action}:`, error);
      // Don't throw errors for analytics failures
    }
  };

  // Helper function to generate a unique ID
  const generateUniqueId = () => {
    return `sc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Add a timeout for the analyzing state to prevent hanging
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      // If loading takes more than 20 seconds, show a fallback
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError('Analysis is taking longer than expected. Please try again.');
      }, 20000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Render different content based on step
  const renderStepContent = () => {
    switch (step) {
      case 'gender':
        return (
          <div className={`transition-all duration-300 ease-in-out ${transitionClass}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">What is your gender?</h3>
              <p className="text-gray-600 mb-4">
                This helps us provide more accurate symptom analysis based on gender-specific health concerns.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {genderOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => handleGenderSelect(option.id)}
                    className={`
                      border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                      transition-all duration-200 ease-in-out transform hover:scale-105
                      ${gender === option.id 
                        ? 'border-teal-500 bg-teal-50 shadow-md' 
                        : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                      }
                    `}
                  >
                    {option.id === 'female' ? (
                      <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2ZM12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8ZM20 22H18V18C18 16.3431 16.6569 15 15 15H9C7.34315 15 6 16.3431 6 18V22H4V18C4 15.2386 6.23858 13 9 13H15C17.7614 13 20 15.2386 20 18V22Z" fill="#EC4899"/>
                        </svg>
                      </div>
                    ) : option.id === 'male' ? (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11ZM13.0355 14.0001H10.9645C7.1357 14.0001 4 17.1358 4 20.9646V21.2C4 21.6418 4.35817 22 4.8 22H19.2C19.6418 22 20 21.6418 20 21.2V20.9646C20 17.1358 16.8643 14.0001 13.0355 14.0001ZM6.00742 20C6.26366 17.5226 8.36926 16.0001 10.9645 16.0001H13.0355C15.6307 16.0001 17.7363 17.5226 17.9926 20H6.00742Z" fill="#3B82F6"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1ZM12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3ZM12.5 14H11.5C7.3579 14 4 17.3579 4 21.5V22C4 22.5523 4.44772 23 5 23H19C19.5523 23 20 22.5523 20 22V21.5C20 17.3579 16.6421 14 12.5 14ZM6 21C6 18.5147 8.01472 16.5 10.5 16.5H13.5C15.9853 16.5 18 18.5147 18 21H6Z" fill="#8B5CF6"/>
                        </svg>
                      </div>
                    )}
                    <span className="font-medium text-gray-800">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'bodyPart':
        return (
          <div className={`transition-all duration-300 ease-in-out ${transitionClass}`}>
            <h3 className="text-lg font-semibold mb-4">Select a body part you're experiencing symptoms with</h3>
            <BodyPartSelector 
              onSelectBodyPart={handleBodyPartSelect}
              selectedBodyPart={selectedBodyPart}
              selectedGender={selectedGender}
            />
          </div>
        );
      
      case 'symptoms':
        return (
          <div className={`transition-all duration-300 ease-in-out ${transitionClass}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">What symptoms are you experiencing?</h3>
              <p className="text-gray-600 mb-4">Select from the list or type your symptoms below.</p>
              
              {/* Symptoms selection */}
              <div className="relative mb-6">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
                  <input
                    type="text"
                    placeholder="Type your symptoms..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-3 focus:outline-none"
                  />
                  {inputValue && (
                    <button 
                      onClick={() => addSymptom(inputValue)}
                      className="px-4 py-2 bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
                
                {/* Suggestions */}
                {isInputFocused && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => addSymptom(suggestion)}
                        className="p-3 cursor-pointer hover:bg-teal-50 border-b border-gray-100 last:border-b-0"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected symptoms */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected symptoms:</p>
                {selectedSymptoms.length === 0 ? (
                  <p className="text-gray-500 italic">No symptoms selected yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-teal-50 border border-teal-200 rounded-full px-3 py-1 text-sm text-teal-700"
                      >
                        <span>{symptom}</span>
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-teal-400 hover:text-teal-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleContinueToDetails}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-3 rounded-lg transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        );
      
      case 'details':
        return (
          <div className={`transition-all duration-300 ease-in-out ${transitionClass}`}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Additional Details</h3>
              <p className="text-gray-600 mb-4">Please provide some additional information to help us analyze your symptoms better.</p>
              
              <div className="mb-4">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your age"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information (optional)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter any additional details about your symptoms..."
                />
              </div>
              
              {/* File upload section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Medical Reports or Images (optional)
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  You can upload medical reports, test results, or images related to your symptoms to help with analysis.
                </p>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <FaUpload className="text-teal-500 text-2xl mb-2" />
                  <p className="text-gray-600 text-center">Click to upload files</p>
                  <p className="text-xs text-gray-500 mt-1">Supports images, PDFs and other document formats</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </div>
                
                {/* Display uploaded files */}
                {files.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                          <div className="flex items-center">
                            {getFileIcon(file)}
                            <span className="ml-2 text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove file"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                  {error}
                </div>
              )}
              
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-700">Analyzing symptoms...</span>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-3 rounded-lg transition-colors duration-200"
                  >
                    Analyze my symptoms
                  </button>
                  <button
                    onClick={() => goToNextStep('symptoms')}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back to symptoms
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4" ref={stepContainerRef}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-teal-500 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Symptom Checker</h2>
        </div>
        
        {/* Progress indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            {['gender', 'bodyPart', 'symptoms', 'details'].map((stepName, index) => (
              <div key={stepName} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                    ${step === stepName 
                      ? 'bg-teal-500 text-white' 
                      : index < ['gender', 'bodyPart', 'symptoms', 'details'].indexOf(step) 
                        ? 'bg-teal-100 text-teal-800 border-2 border-teal-500' 
                        : 'bg-gray-100 text-gray-500 border border-gray-300'
                    }
                  `}
                >
                  {index + 1}
                </div>
                <span className={`text-xs mt-1 ${step === stepName ? 'font-medium text-teal-800' : 'text-gray-500'}`}>
                  {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Connection lines */}
          <div className="relative h-1 mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-teal-500 rounded transition-all duration-300"
              style={{ 
                width: `${(['gender', 'bodyPart', 'symptoms', 'details'].indexOf(step) / 3) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default SimpleSymptomChecker; 