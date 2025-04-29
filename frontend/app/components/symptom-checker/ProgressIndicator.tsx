'use client';

import React from 'react';
import { FaCheck, FaInfoCircle, FaUserMd, FaClipboardList, FaThumbsUp } from 'react-icons/fa';

interface ProgressIndicatorProps {
  currentStep: 'instructions' | 'input' | 'userinfo' | 'results' | 'feedback';
  completedSteps: ('instructions' | 'input' | 'userinfo' | 'results' | 'feedback')[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, completedSteps }) => {
  const steps = [
    { id: 'instructions', label: 'Information', icon: <FaInfoCircle /> },
    { id: 'input', label: 'Symptoms', icon: <FaClipboardList /> },
    { id: 'userinfo', label: 'Profile', icon: <FaUserMd /> },
    { id: 'results', label: 'Results', icon: <FaClipboardList /> },
    { id: 'feedback', label: 'Feedback', icon: <FaThumbsUp /> },
  ];

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId as any)) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'pending';
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                    ${status === 'completed' ? 'bg-green-600 text-white' : 
                      status === 'current' ? 'bg-blue-600 text-white border-4 border-blue-200' : 
                      'bg-gray-200 text-gray-500'}`}
                >
                  {status === 'completed' ? <FaCheck /> : step.icon}
                </div>
                <span 
                  className={`mt-2 text-xs font-medium hidden md:block
                    ${status === 'completed' ? 'text-green-600' : 
                      status === 'current' ? 'text-blue-600' : 
                      'text-gray-500'}`}
                >
                  {step.label}
                </span>
                <span 
                  className={`mt-2 text-xs font-medium block md:hidden
                    ${status === 'completed' ? 'text-green-600' : 
                      status === 'current' ? 'text-blue-600' : 
                      'text-gray-500'}`}
                >
                  {index + 1}
                </span>
              </div>
              
              {/* Connecting line (except after the last item) */}
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2
                    ${completedSteps.includes(step.id as any) ? 'bg-green-600' : 'bg-gray-200'}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile labels */}
      <div className="mt-4 text-center md:hidden">
        <p className="text-sm font-medium text-gray-800">
          {steps.find(step => step.id === currentStep)?.label}
        </p>
        <p className="text-xs text-gray-500">
          Step {steps.findIndex(step => step.id === currentStep) + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator; 