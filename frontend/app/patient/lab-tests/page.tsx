'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import Link from 'next/link';
import Tabs from '@/app/components/ui/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { cn } from '@/app/utils/cn';

// Define types for lab test data
interface LabResult {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: 'normal' | 'high' | 'low' | 'abnormal';
}

interface LabTest {
  id: string;
  name: string;
  date: string;
  provider: string;
  facility: string;
  status: 'completed' | 'pending';
  results: LabResult[];
}

// Mock data for lab tests
const labTests: LabTest[] = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    date: '2023-07-05',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    results: [
      { name: 'WBC', value: '7.2', unit: 'K/uL', range: '4.5-11.0', status: 'normal' },
      { name: 'RBC', value: '4.8', unit: 'M/uL', range: '4.5-5.9', status: 'normal' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
      { name: 'Hematocrit', value: '42', unit: '%', range: '41-50', status: 'normal' },
      { name: 'Platelets', value: '290', unit: 'K/uL', range: '150-450', status: 'normal' }
    ]
  },
  {
    id: '2',
    name: 'Comprehensive Metabolic Panel',
    date: '2023-07-05',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    results: [
      { name: 'Glucose', value: '102', unit: 'mg/dL', range: '70-99', status: 'high' },
      { name: 'BUN', value: '16', unit: 'mg/dL', range: '7-20', status: 'normal' },
      { name: 'Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6-1.2', status: 'normal' },
      { name: 'Sodium', value: '138', unit: 'mmol/L', range: '136-145', status: 'normal' },
      { name: 'Potassium', value: '4.1', unit: 'mmol/L', range: '3.5-5.1', status: 'normal' },
      { name: 'Chloride', value: '102', unit: 'mmol/L', range: '98-107', status: 'normal' },
      { name: 'CO2', value: '24', unit: 'mmol/L', range: '23-29', status: 'normal' },
      { name: 'Calcium', value: '9.5', unit: 'mg/dL', range: '8.5-10.2', status: 'normal' }
    ]
  },
  {
    id: '3',
    name: 'Lipid Panel',
    date: '2023-06-15',
    provider: 'Dr. Michael Chen',
    facility: 'HealthFirst Diagnostics',
    status: 'completed',
    results: [
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high' },
      { name: 'HDL', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
      { name: 'LDL', value: '135', unit: 'mg/dL', range: '<100', status: 'high' },
      { name: 'Triglycerides', value: '150', unit: 'mg/dL', range: '<150', status: 'normal' }
    ]
  },
  {
    id: '4',
    name: 'Thyroid Function Tests',
    date: '2023-05-20',
    provider: 'Dr. Emily Roberts',
    facility: 'MedCenter Labs',
    status: 'completed',
    results: [
      { name: 'TSH', value: '2.5', unit: 'mIU/L', range: '0.4-4.0', status: 'normal' },
      { name: 'Free T4', value: '1.2', unit: 'ng/dL', range: '0.8-1.8', status: 'normal' },
      { name: 'Free T3', value: '3.1', unit: 'pg/mL', range: '2.3-4.2', status: 'normal' }
    ]
  },
  {
    id: '5',
    name: 'Urinalysis',
    date: '2023-04-10',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    results: [
      { name: 'Color', value: 'Yellow', unit: '', range: 'Clear to Yellow', status: 'normal' },
      { name: 'Clarity', value: 'Clear', unit: '', range: 'Clear', status: 'normal' },
      { name: 'pH', value: '6.0', unit: '', range: '4.5-8.0', status: 'normal' },
      { name: 'Specific Gravity', value: '1.020', unit: '', range: '1.005-1.030', status: 'normal' },
      { name: 'Glucose', value: 'Negative', unit: '', range: 'Negative', status: 'normal' },
      { name: 'Protein', value: 'Trace', unit: '', range: 'Negative', status: 'abnormal' },
      { name: 'WBC', value: '2-5', unit: '/HPF', range: '0-5', status: 'normal' },
      { name: 'RBC', value: '0-2', unit: '/HPF', range: '0-2', status: 'normal' }
    ]
  },
  {
    id: '6',
    name: 'Vitamin D, 25-Hydroxy',
    date: '2023-07-20',
    provider: 'Dr. Michael Chen',
    facility: 'HealthFirst Diagnostics',
    status: 'pending',
    results: []
  }
];

export default function LabTestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'pending', label: 'Pending Results' }
  ];
  
  const allTests = labTests;
  const pendingTests = labTests.filter(test => test.status === 'pending');
  
  const currentTests = activeTab === 'all' ? allTests : pendingTests;
  
  // Group tests by date for a timeline view
  const groupedTests: Record<string, LabTest[]> = currentTests.reduce((acc: Record<string, LabTest[]>, test) => {
    const date = test.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(test);
    return acc;
  }, {});

  // Convert to array and sort by date (newest first)
  const sortedDates = Object.keys(groupedTests).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Results</h1>
            <p className="text-gray-600">View and monitor your lab test results</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/patient/lab-tests/upcoming"
              className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2.5 font-medium border border-teal-300 bg-white text-teal-700 hover:bg-teal-50 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Upcoming Tests
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2.5 font-medium bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Schedule New Test
            </Link>
          </div>
        </div>
        
        <div className="mb-8">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </div>
        
        {currentTests.length > 0 ? (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date}>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {new Date(date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <div className="space-y-4">
                  {groupedTests[date].map((test) => (
                    <Card 
                      key={test.id} 
                      className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <CardTitle className="text-lg text-gray-900">{test.name}</CardTitle>
                          {test.status === 'completed' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-2 sm:mt-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5"></span>
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mt-2 sm:mt-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                              Pending
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-500">Ordered By</p>
                            <p className="font-medium text-gray-900">{test.provider}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Facility</p>
                            <p className="font-medium text-gray-900">{test.facility}</p>
                          </div>
                        </div>
                        
                        {test.status === 'completed' && test.results.length > 0 ? (
                          <div>
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <h3 className="font-medium text-gray-900 mb-3">Results</h3>
                              <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Result
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Standard Range
                                      </th>
                                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {test.results.map((result, index) => (
                                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {result.name}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          {result.value} {result.unit}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {result.range}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          <span 
                                            className={cn(
                                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                              result.status === 'normal' 
                                                ? "bg-teal-100 text-teal-800" 
                                                : result.status === 'high' || result.status === 'low' || result.status === 'abnormal'
                                                  ? "bg-amber-100 text-amber-800"
                                                  : "bg-red-100 text-red-800"
                                            )}
                                          >
                                            {result.status === 'normal' 
                                              ? 'Normal' 
                                              : result.status === 'high' 
                                                ? 'High' 
                                                : result.status === 'low' 
                                                  ? 'Low'
                                                  : 'Abnormal'
                                            }
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Link
                                href={`/patient/lab-tests/${test.id}`}
                                className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                              >
                                View Full Results
                                <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ) : test.status === 'pending' ? (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-lg">
                              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                              </svg>
                              <p className="text-sm">Results pending. Please check back later.</p>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-1">No lab results found</p>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all' 
                ? 'You do not have any lab results at the moment.' 
                : 'You do not have any pending lab results.'}
            </p>
            {activeTab !== 'all' && (
              <button
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2 font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
              >
                View All Results
              </button>
            )}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
} 