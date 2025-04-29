'use client';

import React, { useState } from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaVenusMars, 
  FaWeight, 
  FaRulerVertical, 
  FaTint, 
  FaAllergies, 
  FaPills, 
  FaFileMedical, 
  FaNotesMedical, 
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import MedConnectLogo from '@/app/logo-selection/medconnect-logo';
import { useTheme } from '@/app/contexts/ThemeContext';

export interface HealthPassportData {
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  weight: string; // in kg
  height: string; // in cm
  bloodType: string;
  allergies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  conditions: string[];
  notes: string;
  lastUpdated: string;
}

interface HealthPassportCardProps {
  data: HealthPassportData;
  className?: string;
}

export default function HealthPassportCard({ data, className = '' }: HealthPassportCardProps) {
  const { isDarkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState<{
    allergies: boolean;
    medications: boolean;
    conditions: boolean;
    notes: boolean;
  }>({
    allergies: false,
    medications: false,
    conditions: false,
    notes: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDateString: string) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MedConnectLogo 
              isAnimated={true}
              darkMode={true}
              variant="icon"
              className="w-8 h-8"
            />
            <h3 className="text-xl font-semibold">Health Passport</h3>
          </div>
          <span className="text-xs opacity-80">Last updated: {formatDate(data.lastUpdated)}</span>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <FaUser className="mr-2" />
            <span className="font-medium">{data.fullName}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>{formatDate(data.dateOfBirth)} ({calculateAge(data.dateOfBirth)} years)</span>
          </div>
          <div className="flex items-center">
            <FaVenusMars className="mr-2" />
            <span>{data.gender}</span>
          </div>
        </div>
      </div>

      {/* Body measurements */}
      <div className="p-4 bg-neutral-50 border-b">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-primary-700 mb-1">
              <FaWeight className="mr-1" />
              <span className="text-sm font-medium">Weight</span>
            </div>
            <span className="text-lg font-semibold">{data.weight} kg</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-primary-700 mb-1">
              <FaRulerVertical className="mr-1" />
              <span className="text-sm font-medium">Height</span>
            </div>
            <span className="text-lg font-semibold">{data.height} cm</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-primary-700 mb-1">
              <FaTint className="mr-1" />
              <span className="text-sm font-medium">Blood Type</span>
            </div>
            <span className="text-lg font-semibold">{data.bloodType}</span>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="border-b">
        <button 
          className="w-full px-6 py-3 flex justify-between items-center hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          onClick={() => toggleSection('allergies')}
        >
          <div className="flex items-center text-primary-700">
            <FaAllergies className="mr-2" />
            <span className="font-medium">Allergies</span>
          </div>
          {expandedSections.allergies ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.allergies && (
          <div className="px-6 py-3 bg-neutral-50">
            {data.allergies.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {data.allergies.map((allergy, index) => (
                  <li key={index} className="text-neutral-700">{allergy}</li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500 italic">No known allergies</p>
            )}
          </div>
        )}
      </div>

      {/* Medications */}
      <div className="border-b">
        <button 
          className="w-full px-6 py-3 flex justify-between items-center hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          onClick={() => toggleSection('medications')}
        >
          <div className="flex items-center text-primary-700">
            <FaPills className="mr-2" />
            <span className="font-medium">Current Medications</span>
          </div>
          {expandedSections.medications ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.medications && (
          <div className="px-6 py-3 bg-neutral-50">
            {data.medications.length > 0 ? (
              <div className="space-y-3">
                {data.medications.map((medication, index) => (
                  <div key={index} className="p-3 bg-white rounded border border-neutral-200">
                    <div className="font-medium text-neutral-800">{medication.name}</div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-neutral-600">
                      <div>Dosage: {medication.dosage}</div>
                      <div>Frequency: {medication.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 italic">No current medications</p>
            )}
          </div>
        )}
      </div>

      {/* Medical Conditions */}
      <div className="border-b">
        <button 
          className="w-full px-6 py-3 flex justify-between items-center hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          onClick={() => toggleSection('conditions')}
        >
          <div className="flex items-center text-primary-700">
            <FaFileMedical className="mr-2" />
            <span className="font-medium">Medical Conditions</span>
          </div>
          {expandedSections.conditions ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.conditions && (
          <div className="px-6 py-3 bg-neutral-50">
            {data.conditions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {data.conditions.map((condition, index) => (
                  <li key={index} className="text-neutral-700">{condition}</li>
                ))}
              </ul>
            ) : (
              <p className="text-neutral-500 italic">No known medical conditions</p>
            )}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <button 
          className="w-full px-6 py-3 flex justify-between items-center hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          onClick={() => toggleSection('notes')}
        >
          <div className="flex items-center text-primary-700">
            <FaNotesMedical className="mr-2" />
            <span className="font-medium">Additional Notes</span>
          </div>
          {expandedSections.notes ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        
        {expandedSections.notes && (
          <div className="px-6 py-3 bg-neutral-50">
            {data.notes ? (
              <p className="text-neutral-700 whitespace-pre-line">{data.notes}</p>
            ) : (
              <p className="text-neutral-500 italic">No additional notes</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 