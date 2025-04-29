'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaUser, FaCalendarAlt, FaPhone, FaFileMedical, FaFilePrescription, FaDownload, FaShareAlt } from 'react-icons/fa';
import { Prediction } from '../../utils/gemini-api';
import { useReportContext, UserData } from '../../contexts/ReportContext';

interface AIPredictionProps {
  prediction?: Prediction;  // Make it optional for backward compatibility
  formData?: any;  // Keep this for backward compatibility
  onBackToForm: () => void;
  onFindDoctor: (specialization: string) => void;
  userData?: UserData;
}

const AIPrediction: React.FC<AIPredictionProps> = ({ 
  prediction, 
  formData, 
  onBackToForm, 
  onFindDoctor,
  userData
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  // Get reports from context
  const { reports } = useReportContext();
  
  useEffect(() => {
    if (prediction) {
      // If prediction is directly provided, use it
      setPredictionResult(prediction);
      // Add a short delay before animation to ensure DOM is ready
      setTimeout(() => setAnimateIn(true), 100);
    } else if (formData) {
      // For backward compatibility - load from formData if needed
      setPredictionResult(null);
    }
  }, [prediction, formData]);

  // Function to handle clicking on a condition card
  const handleConditionClick = (condition: string) => {
    setActiveCondition(activeCondition === condition ? null : condition);
  };
  
  // If there's no prediction yet, show loading
  if (!predictionResult) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t-4 border-teal-500 rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing your symptoms</h3>
        <p className="text-gray-600">Our AI is reviewing your health information...</p>
      </div>
    );
  }
  
  const { 
    possibleCauses, 
    recommendedSpecialties, 
    generalAdvice, 
    disclaimer, 
    emergencyWarning,
    genderSpecificConsiderations
  } = predictionResult;
  
  const renderReports = () => {
    if (!reports || reports.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaFileMedical className="mr-2 text-blue-500" />
          Uploaded Reports
        </h3>
        <div className="space-y-3">
          {reports.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
              <div className="flex items-center">
                {file.type.includes('pdf') ? (
                  <FaFilePrescription className="text-red-500 mr-2" />
                ) : (
                  <FaFileMedical className="text-blue-500 mr-2" />
                )}
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <FaDownload size={16} />
                </button>
                <button className="text-gray-500 hover:text-gray-700 p-1">
                  <FaShareAlt size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`max-w-3xl mx-auto transition-opacity duration-500 ease-in-out ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Back Button */}
      <button 
        onClick={onBackToForm}
        className="flex items-center text-teal-600 hover:text-teal-800 mb-6 group transition-all duration-200"
      >
        <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back</span>
      </button>
      
      {/* Emergency Warning */}
      {emergencyWarning && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 animate-pulse">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2 text-red-500" />
            Emergency Warning
          </h3>
          <p className="text-red-700 font-medium">
            Some of your symptoms may indicate a serious medical condition that requires immediate attention. 
            Please consider seeking emergency medical care or calling emergency services.
          </p>
        </div>
      )}
      
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Personalized greeting */}
          {userData && userData.name && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Hello, {userData.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Here's your personalized symptom analysis
              </p>
            </div>
          )}
          
          {/* AI Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-teal-500" />
              AI Analysis
            </h3>
            <p className="text-gray-700">{generalAdvice}</p>
          </div>
          
          {/* Possible Conditions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Possible Conditions</h3>
            <div className="space-y-4">
              {possibleCauses.map((cause, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    activeCondition === cause.condition 
                      ? 'border-teal-500 shadow-md' 
                      : 'border-gray-200 hover:border-teal-300 cursor-pointer'
                  }`}
                  onClick={() => handleConditionClick(cause.condition)}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div 
                        className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                          cause.urgency === 'emergency' 
                            ? 'bg-red-100 text-red-500' 
                            : cause.urgency === 'urgent' 
                            ? 'bg-amber-100 text-amber-500' 
                            : 'bg-green-100 text-green-500'
                        }`}
                      >
                        {cause.urgency === 'emergency' ? (
                          <FaExclamationTriangle />
                        ) : cause.urgency === 'urgent' ? (
                          <FaExclamationCircle />
                        ) : (
                          <FaInfoCircle />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{cause.condition}</h4>
                        <div className="flex items-center mt-1">
                          <span 
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                              cause.probability === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : cause.probability === 'medium' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {cause.probability.charAt(0).toUpperCase() + cause.probability.slice(1)} Probability
                          </span>
                          <span 
                            className={`ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                              cause.urgency === 'emergency' 
                                ? 'bg-red-100 text-red-800' 
                                : cause.urgency === 'urgent' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {cause.urgency.charAt(0).toUpperCase() + cause.urgency.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className={`w-5 h-5 transform transition-transform ${activeCondition === cause.condition ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {activeCondition === cause.condition && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
                      <p className="text-gray-700 mb-4">{cause.description}</p>
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://www.google.com/search?q=${encodeURIComponent(cause.condition)}`, '_blank');
                          }}
                          className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                        >
                          Learn more
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onFindDoctor(cause.condition);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          Find a doctor
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended specialists */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2 text-indigo-500" />
              Recommended Specialists
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedSpecialties.map((specialty, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{specialty}</span>
                  <button 
                    onClick={() => onFindDoctor(specialty)}
                    className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                  >
                    Find {specialty}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Display uploaded reports */}
          {renderReports()}
          
          {genderSpecificConsiderations && (
            <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-purple-500" />
                Gender-Specific Considerations
              </h3>
              <p className="text-gray-700">{genderSpecificConsiderations}</p>
            </div>
          )}
          
          {/* Disclaimer */}
          <div className="mb-4 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaExclamationCircle className="mr-2 text-yellow-500" />
              Disclaimer
            </h3>
            <p className="text-gray-700">{disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPrediction; 