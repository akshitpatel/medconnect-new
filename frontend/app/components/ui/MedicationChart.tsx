import React from 'react';
import { Reminders } from './Reminders';

// Define interfaces for our component props
export interface Medication {
  id: string;
  name: string;
  timeSlots: {
    morning?: boolean;
    noon?: boolean;
    evening?: boolean;
    bedtime?: boolean;
  };
  color?: string;
}

export interface MedicationChartProps {
  medications: Medication[];
}

// Color classes for different medications
const colorClasses = {
  teal: 'bg-teal-100 text-teal-800 border-teal-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  rose: 'bg-rose-100 text-rose-800 border-rose-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
};

export function MedicationChart({ medications }: MedicationChartProps) {
  const timeSlots = [
    { id: 'morning', label: 'Morning', icon: 'sunrise' },
    { id: 'noon', label: 'Noon', icon: 'sun' },
    { id: 'evening', label: 'Evening', icon: 'sunset' },
    { id: 'bedtime', label: 'Bedtime', icon: 'moon' }
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-1/3 px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Medication
                </th>
                {timeSlots.map((slot) => (
                  <th 
                    key={slot.id} 
                    className="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-1">
                        {slot.icon === 'sunrise' && (
                          <svg className="w-5 h-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 18a5 5 0 0 0-10 0"></path>
                            <line x1="12" y1="2" x2="12" y2="9"></line>
                            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                            <line x1="1" y1="18" x2="3" y2="18"></line>
                            <line x1="21" y1="18" x2="23" y2="18"></line>
                            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                            <line x1="23" y1="22" x2="1" y2="22"></line>
                            <polyline points="8 6 12 2 16 6"></polyline>
                          </svg>
                        )}
                        {slot.icon === 'sun' && (
                          <svg className="w-5 h-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                          </svg>
                        )}
                        {slot.icon === 'sunset' && (
                          <svg className="w-5 h-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 18a5 5 0 0 0-10 0"></path>
                            <line x1="12" y1="9" x2="12" y2="2"></line>
                            <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line>
                            <line x1="1" y1="18" x2="3" y2="18"></line>
                            <line x1="21" y1="18" x2="23" y2="18"></line>
                            <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line>
                            <line x1="23" y1="22" x2="1" y2="22"></line>
                            <polyline points="16 5 12 9 8 5"></polyline>
                          </svg>
                        )}
                        {slot.icon === 'moon' && (
                          <svg className="w-5 h-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                          </svg>
                        )}
                      </div>
                      {slot.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medications.map((medication) => (
                <tr key={medication.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900 font-medium">
                    {medication.name}
                  </td>
                  {timeSlots.map((slot) => (
                    <td key={`${medication.id}-${slot.id}`} className="px-4 py-4 text-center">
                      {medication.timeSlots[slot.id as keyof typeof medication.timeSlots] ? (
                        <div className="flex justify-center">
                          <div 
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full border ${
                              medication.color ? colorClasses[medication.color as keyof typeof colorClasses] : colorClasses.default
                            }`}
                          >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-300">—</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
        <h3 className="text-base font-medium text-gray-900 mb-4">Medication Reminders</h3>
        <Reminders />
      </div>
    </div>
  );
} 