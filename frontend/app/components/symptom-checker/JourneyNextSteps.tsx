'use client';

import React from 'react';
import { 
  FaCalendarAlt, FaUser, FaNotesMedical, 
  FaPhone, FaArrowRight, FaInfoCircle,
  FaBell, FaBookMedical
} from 'react-icons/fa';
import Link from 'next/link';
import { Prediction } from '../../utils/gemini-api';

interface JourneyNextStepsProps {
  prediction: Prediction;
  sessionId: string;
  onFindDoctor: (specialization: string) => void;
  onScheduleReminder: () => void;
}

const JourneyNextSteps: React.FC<JourneyNextStepsProps> = ({ 
  prediction, 
  sessionId, 
  onFindDoctor,
  onScheduleReminder
}) => {
  // Log recommendation interaction
  const logRecommendationClick = (action: string, data: any = {}) => {
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data: {
            sessionId,
            journeyType: 'symptom_checker',
            ...data,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to log recommendation click:', error);
    }
  };

  // Define journey paths based on prediction
  const hasUrgentCondition = prediction.possibleCauses.some(
    cause => cause.urgency === 'urgent' || cause.urgency === 'emergency'
  );
  
  const primaryRecommendedSpecialty = prediction.recommendedSpecialties?.[0] || 'General Practitioner';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaInfoCircle className="mr-2 text-teal-600" />
          Recommended Next Steps
        </h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Based on your symptoms and results, here are some recommended actions you can take.
            These suggestions are not a substitute for professional medical advice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Book an appointment card */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-5 border border-teal-100 shadow-sm">
            <div className="flex items-start">
              <div className="bg-teal-600 rounded-full p-3 mr-4">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-teal-800 mb-2">Book an Appointment</h3>
                <p className="text-gray-600 mb-4">
                  Schedule a consultation with a healthcare provider to discuss your symptoms.
                </p>
                <Link 
                  href="/appointments/new"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  onClick={() => logRecommendationClick('journey_next_step_book_appointment')}
                >
                  Book Now <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Find a doctor card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 shadow-sm">
            <div className="flex items-start">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-medium text-lg text-blue-800 mb-2">Find a Specialist</h3>
                <p className="text-gray-600 mb-4">
                  Connect with a {primaryRecommendedSpecialty} who can help with your condition.
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    logRecommendationClick('journey_next_step_find_doctor', {
                      specialty: primaryRecommendedSpecialty
                    });
                    onFindDoctor(primaryRecommendedSpecialty);
                  }}
                >
                  Find {primaryRecommendedSpecialty} <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Get a second opinion */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <FaNotesMedical className="text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-800">Get a Second Opinion</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Want another perspective on your symptoms?
            </p>
            <Link 
              href="/second-opinion"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => logRecommendationClick('journey_next_step_second_opinion')}
            >
              Request Second Opinion <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
          
          {/* Schedule a follow-up reminder */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <FaBell className="text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-800">Set a Reminder</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Get notified to check in about your symptoms later.
            </p>
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => {
                logRecommendationClick('journey_next_step_schedule_reminder');
                onScheduleReminder();
              }}
            >
              Schedule Reminder <FaArrowRight className="ml-1 text-xs" />
            </button>
          </div>
          
          {/* Learn more about condition */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <FaBookMedical className="text-gray-600 mr-2" />
              <h3 className="font-medium text-gray-800">Learn More</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Read about {prediction.possibleCauses[0]?.condition || 'your symptoms'}.
            </p>
            <Link 
              href={`/health-library/conditions/${encodeURIComponent(prediction.possibleCauses[0]?.condition || 'general')}`}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              onClick={() => logRecommendationClick('journey_next_step_learn_more', {
                condition: prediction.possibleCauses[0]?.condition || 'general'
              })}
            >
              View Health Information <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>
        </div>
        
        {hasUrgentCondition && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaPhone className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Need urgent care?</h3>
                <p className="mt-2 text-red-700">
                  Based on your symptoms, you might need urgent medical attention.
                  Please consider contacting emergency services or visiting your nearest emergency room.
                </p>
                <div className="mt-3">
                  <a 
                    href="tel:911" 
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => logRecommendationClick('journey_next_step_emergency_call')}
                  >
                    <FaPhone className="-ml-1 mr-2 h-4 w-4" />
                    Call Emergency Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyNextSteps; 