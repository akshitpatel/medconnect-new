'use client';

import React from 'react';
import { cn } from '@/app/utils/cn';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  type?: string;
}

export interface Interaction {
  severity: 'high' | 'moderate' | 'low';
  description: string;
  medications: string[]; // Array of medication ids that are involved in this interaction
  recommendation?: string;
}

export interface MedicationInteractionsProps {
  medications: Medication[];
  interactions: Interaction[];
  className?: string;
}

export function MedicationInteractions({ medications, interactions, className }: MedicationInteractionsProps) {
  // Severity colors for different levels
  const severityColors = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500'
    },
    moderate: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500'
    },
    low: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500'
    }
  };

  // Get medication names from ids
  const getMedicationNames = (medicationIds: string[]) => {
    return medicationIds.map(id => {
      const med = medications.find(m => m.id === id);
      return med ? `${med.name} ${med.dosage}` : 'Unknown medication';
    });
  };

  // If there are no interactions, show a message
  if (interactions.length === 0) {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-white p-6", className)}>
        <div className="flex items-center text-green-700">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3 className="text-base font-medium">No interactions detected</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          There are no known interactions between your current medications. Always consult your healthcare provider 
          before starting new medications.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white", className)}>
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-base font-medium text-gray-900">Medication Interactions</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {interactions.map((interaction, index) => {
          const colors = severityColors[interaction.severity];
          const medicationNames = getMedicationNames(interaction.medications);
          
          return (
            <li key={index} className="p-4">
              <div className={cn("rounded-lg p-3 mb-3", colors.bg, colors.border)}>
                <div className="flex items-center mb-2">
                  <svg className={cn("h-5 w-5 mr-2", colors.icon)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {interaction.severity === 'high' ? (
                      <>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </>
                    ) : interaction.severity === 'moderate' ? (
                      <>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </>
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </>
                    )}
                  </svg>
                  <span className={cn("font-medium", colors.text)}>
                    {interaction.severity === 'high' ? 'Significant Interaction' : 
                     interaction.severity === 'moderate' ? 'Moderate Interaction' : 'Minor Interaction'}
                  </span>
                </div>
                <div className={cn("text-sm", colors.text)}>
                  <p className="mb-1"><strong>Between:</strong> {medicationNames.join(' and ')}</p>
                  <p className="mb-1">{interaction.description}</p>
                  {interaction.recommendation && (
                    <p className="mt-2 font-medium">Recommendation: {interaction.recommendation}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <p className="flex items-center">
          <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
            <line x1="12" y1="8" x2="12" y2="12"></line>
          </svg>
          Always consult with your healthcare provider or pharmacist about potential medication interactions.
        </p>
      </div>
    </div>
  );
} 