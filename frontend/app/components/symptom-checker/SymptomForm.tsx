"use client";

import React, { useState } from 'react';
import { 
  FaCalendarAlt, FaUser, FaBirthdayCake, FaVenusMars, FaWeight, 
  FaRulerVertical, FaCheck, FaTimes, FaUpload, FaPrescriptionBottleAlt,
  FaFileMedical, FaFilePrescription
} from 'react-icons/fa';
import type { BodyPart } from './BodyPartSelector';

interface SymptomFormProps {
  selectedBodyPart: BodyPart | null;
  onSubmit: (formData: SymptomFormData) => void;
}

export interface SymptomFormData {
  bodyPartId: string;
  primarySymptoms: string[];
  secondarySymptoms: string[];
  symptomDuration: string;
  symptomSeverity: string;
  symptomProgression: string;
  medicalHistory: string[];
  currentMedications: string;
  recentReports: boolean;
  reportDescription: string;
  age: string;
  gender: string;
  weight?: string;
  height?: string;
  additionalNotes: string;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
    preferredContactMethod: 'email' | 'phone';
  };
}

// Common symptoms for different body parts
const bodyPartSymptoms: Record<string, string[]> = {
  head: [
    'Headache', 'Dizziness', 'Blurred vision', 'Memory issues', 
    'Confusion', 'Difficulty speaking', 'Face pain', 'Ear pain',
    'Hearing loss', 'Eye pain', 'Sensitivity to light',
    'Trouble swallowing', 'Neck stiffness', 'Ringing in ears'
  ],
  chest: [
    'Chest pain', 'Shortness of breath', 'Heart palpitations', 
    'Cough', 'Wheezing', 'Difficulty breathing', 'Rapid heartbeat',
    'Coughing up blood', 'Chest tightness', 'Pain when breathing'
  ],
  abdomen: [
    'Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 
    'Constipation', 'Bloating', 'Heartburn', 'Loss of appetite',
    'Blood in stool', 'Jaundice', 'Excessive gas'
  ],
  back: [
    'Back pain', 'Stiffness', 'Limited mobility', 'Numbness', 
    'Tingling sensation', 'Muscle spasms', 'Pain radiating to legs',
    'Pain when bending', 'Difficulty standing straight'
  ],
  arms: [
    'Arm pain', 'Joint pain', 'Swelling', 'Numbness', 
    'Weakness', 'Limited range of motion', 'Tingling sensation',
    'Stiffness', 'Redness', 'Warmth'
  ],
  legs: [
    'Leg pain', 'Joint pain', 'Swelling', 'Numbness', 
    'Weakness', 'Limited range of motion', 'Tingling sensation',
    'Stiffness', 'Redness', 'Warmth', 'Difficulty walking'
  ],
  skin: [
    'Rash', 'Itching', 'Redness', 'Swelling', 'Hives', 
    'Dry skin', 'Blisters', 'Changes in skin color', 'Bruising',
    'Excessive sweating', 'Burning sensation'
  ],
  general: [
    'Fever', 'Fatigue', 'Weight loss', 'Weakness', 'Night sweats', 
    'Chills', 'Loss of appetite', 'General discomfort', 'Malaise'
  ]
};

// Common medical conditions
const medicalConditions = [
  'Diabetes', 'Hypertension (High Blood Pressure)', 'Heart Disease', 
  'Asthma', 'COPD', 'Cancer', 'Stroke', 'Arthritis', 'Thyroid Disorder', 
  'Kidney Disease', 'Liver Disease', 'Autoimmune Disorder', 
  'Mental Health Condition', 'Neurological Disorder', 'Obesity',
  'High Cholesterol', 'Sleep Apnea', 'Gastrointestinal Disorder'
];

const SymptomForm: React.FC<SymptomFormProps> = ({ selectedBodyPart, onSubmit }) => {
  const [formData, setFormData] = useState<SymptomFormData>({
    bodyPartId: selectedBodyPart?.id || '',
    primarySymptoms: [],
    secondarySymptoms: [],
    symptomDuration: '',
    symptomSeverity: 'moderate',
    symptomProgression: 'same',
    medicalHistory: [],
    currentMedications: '',
    recentReports: false,
    reportDescription: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    additionalNotes: '',
    contactDetails: {
      name: '',
      email: '',
      phone: '',
      preferredContactMethod: 'email'
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  
  // Get symptoms based on selected body part or fallback to general
  const relevantBodyPart = selectedBodyPart?.id.toLowerCase() || 'general';
  const relevantSymptoms = bodyPartSymptoms[relevantBodyPart] || bodyPartSymptoms.general;
  
  // Additional symptom lists for secondary symptoms
  const allSymptoms = Array.from(new Set([
    ...bodyPartSymptoms.general,
    ...(relevantBodyPart !== 'general' ? relevantSymptoms : [])
  ])).sort();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parentField, childField] = name.split('.');
      setFormData({
        ...formData,
        [parentField]: {
          ...formData[parentField as keyof SymptomFormData] as any,
          [childField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...(formData[name as keyof SymptomFormData] as string[]), value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof SymptomFormData] as string[]).filter(item => item !== value)
      });
    }
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Symptom Information</h2>
      
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Please select your symptoms related to {selectedBodyPart?.name || 'your condition'}:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {relevantSymptoms.map((symptom, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md transition-colors">
                    <input
                      type="checkbox"
                      name="primarySymptoms"
                      value={symptom}
                      checked={formData.primarySymptoms.includes(symptom)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
              {formData.primarySymptoms.length === 0 && (
                <p className="text-sm text-red-600 mt-1">Please select at least one symptom</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have any other symptoms? (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {allSymptoms
                  .filter(symptom => !formData.primarySymptoms.includes(symptom))
                  .map((symptom, index) => (
                    <label key={index} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md transition-colors">
                      <input
                        type="checkbox"
                        name="secondarySymptoms"
                        value={symptom}
                        checked={formData.secondarySymptoms.includes(symptom)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span>{symptom}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <label htmlFor="symptomDuration" className="block text-sm font-medium text-gray-700 mb-1">
                How long have you been experiencing these symptoms?
              </label>
              <select
                id="symptomDuration"
                name="symptomDuration"
                value={formData.symptomDuration}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="">Select duration</option>
                <option value="hours">Hours (less than a day)</option>
                <option value="days">Days (less than a week)</option>
                <option value="weeks">Weeks (less than a month)</option>
                <option value="months">Months (less than a year)</option>
                <option value="years">Years</option>
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">How would you rate the severity of your symptoms?</p>
              <div className="flex flex-wrap gap-4 justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomSeverity === 'mild'}
                    onChange={() => handleRadioChange('symptomSeverity', 'mild')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomSeverity === 'mild' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">😐</span>
                    <span className="text-sm">Mild</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomSeverity === 'moderate'}
                    onChange={() => handleRadioChange('symptomSeverity', 'moderate')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomSeverity === 'moderate' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">😟</span>
                    <span className="text-sm">Moderate</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomSeverity === 'severe'}
                    onChange={() => handleRadioChange('symptomSeverity', 'severe')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomSeverity === 'severe' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">😣</span>
                    <span className="text-sm">Severe</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomSeverity === 'very_severe'}
                    onChange={() => handleRadioChange('symptomSeverity', 'very_severe')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomSeverity === 'very_severe' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">😫</span>
                    <span className="text-sm">Very Severe</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">Are your symptoms:</p>
              <div className="flex flex-wrap gap-4 justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomProgression === 'improving'}
                    onChange={() => handleRadioChange('symptomProgression', 'improving')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomProgression === 'improving' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">👍</span>
                    <span className="text-sm">Improving</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomProgression === 'same'}
                    onChange={() => handleRadioChange('symptomProgression', 'same')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomProgression === 'same' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">👉</span>
                    <span className="text-sm">Staying Same</span>
                  </div>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="hidden"
                    checked={formData.symptomProgression === 'worse'}
                    onChange={() => handleRadioChange('symptomProgression', 'worse')}
                  />
                  <div className={`flex flex-col items-center p-3 rounded-md border ${formData.symptomProgression === 'worse' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}>
                    <span className="text-lg mb-1">👎</span>
                    <span className="text-sm">Getting Worse</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">Do you have any of the following medical conditions?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                {medicalConditions.map((condition, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 hover:bg-white rounded-md transition-colors">
                    <input
                      type="checkbox"
                      name="medicalHistory"
                      value={condition}
                      checked={formData.medicalHistory.includes(condition)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span>{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-1">
                Are you currently taking any medications? (If yes, please list them)
              </label>
              <textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="List medications (including over-the-counter medicines and supplements)"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  name="recentReports"
                  checked={formData.recentReports}
                  onChange={handleBooleanChange}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Do you have any recent medical reports or prescriptions?</span>
              </label>
              
              {formData.recentReports && (
                <div className="space-y-3 ml-7">
                  <div className="flex flex-col">
                    <label htmlFor="reportDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Please describe the reports/prescriptions you have:
                    </label>
                    <textarea
                      id="reportDescription"
                      name="reportDescription"
                      value={formData.reportDescription}
                      onChange={handleInputChange}
                      rows={2}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g., Recent blood test results, X-ray report from last week"
                    />
                  </div>
                  
                  <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
                      <FaUpload />
                      <span>Upload your documents</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      You'll be able to upload these during your consultation
                    </p>
                    <div className="flex justify-center space-x-3">
                      <div className="flex items-center text-teal-600">
                        <FaFileMedical className="mr-1" />
                        <span className="text-xs">Medical Reports</span>
                      </div>
                      <div className="flex items-center text-teal-600">
                        <FaFilePrescription className="mr-1" />
                        <span className="text-xs">Prescriptions</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Age
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaBirthdayCake className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your age"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaVenusMars className="text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Weight (kg) - Optional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaWeight className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Weight in kg"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Height (cm) - Optional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaRulerVertical className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Height in cm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Any additional information you'd like to share? (Optional)
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Any other details that might be relevant to your condition"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide your contact details so we can follow up with you after the analysis.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactDetails.name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="contactDetails.name"
                      name="contactDetails.name"
                      value={formData.contactDetails.name}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="contactDetails.email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contactDetails.email"
                    name="contactDetails.email"
                    value={formData.contactDetails.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="contactDetails.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contactDetails.phone"
                    name="contactDetails.phone"
                    value={formData.contactDetails.phone}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Contact Method
                  </p>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactDetails.preferredContactMethod"
                        value="email"
                        checked={formData.contactDetails.preferredContactMethod === 'email'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contactDetails.preferredContactMethod"
                        value="phone"
                        checked={formData.contactDetails.preferredContactMethod === 'phone'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Phone</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ml-auto"
              disabled={currentStep === 1 && formData.primarySymptoms.length === 0}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 ml-auto"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SymptomForm; 