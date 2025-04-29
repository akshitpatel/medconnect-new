'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import PatientLayout from '@/app/components/layout/PatientLayout';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/Card';
import Tabs from '@/app/components/ui/Tabs';
import { cn } from '@/app/utils/cn';
import { MedicationChart } from '@/app/components/ui/MedicationChart';

// Mock data for prescriptions
const prescriptions = [
  {
    id: '1',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. John Doe',
    dateIssued: 'February 15, 2023',
    expirationDate: 'August 15, 2023',
    refillsRemaining: 2,
    pharmacy: 'MedPlus Pharmacy',
    instructions: 'Take in the morning with food.',
    purpose: 'Treatment of high blood pressure and heart failure.',
    sideEffects: [
      'Dizziness',
      'Headache',
      'Dry cough',
      'Fatigue',
      'Nausea'
    ],
    warnings: [
      'Do not use if pregnant',
      'May cause low blood pressure',
      'Avoid potassium supplements'
    ],
    interactions: [
      'NSAIDs may reduce effectiveness',
      'Potassium-sparing diuretics may cause hyperkalemia',
      'ACE inhibitors may increase lithium levels'
    ],
    refillHistory: [
      { date: 'May 1, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' },
      { date: 'April 1, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' },
      { date: 'March 1, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' }
    ],
    type: 'Tablet',
    quantity: 30,
    active: true,
    schedule: {
      morning: true,
      noon: false,
      evening: false,
      bedtime: false
    },
    color: 'blue'
  },
  {
    id: '2',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. John Doe',
    dateIssued: 'January 20, 2023',
    expirationDate: 'January 20, 2024',
    refillsRemaining: 3,
    pharmacy: 'MedPlus Pharmacy',
    instructions: 'Take in the evening.',
    purpose: 'Lowers cholesterol and triglycerides in the blood.',
    sideEffects: [
      'Muscle pain',
      'Joint pain',
      'Mild nausea',
      'Diarrhea',
      'Constipation'
    ],
    warnings: [
      'Avoid grapefruit juice',
      'Notify doctor if muscle pain occurs',
      'May affect liver function'
    ],
    interactions: [
      'Certain antibiotics may increase risk of side effects',
      'Some antifungal medications may interact',
      'Alcohol may increase risk of liver damage'
    ],
    refillHistory: [
      { date: 'April 15, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' },
      { date: 'March 15, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' },
      { date: 'February 15, 2023', quantity: 30, pharmacy: 'MedPlus Pharmacy' }
    ],
    type: 'Tablet',
    quantity: 30,
    active: true,
    schedule: {
      morning: false,
      noon: false,
      evening: true,
      bedtime: false
    },
    color: 'red'
  },
  {
    id: '3',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Jane Smith',
    dateIssued: 'March 10, 2023',
    expirationDate: 'September 10, 2023',
    refillsRemaining: 1,
    pharmacy: 'HealthCare Pharmacy',
    instructions: 'Take with meals.',
    purpose: 'Treatment of type 2 diabetes.',
    sideEffects: [
      'Stomach upset',
      'Diarrhea',
      'Nausea',
      'Metallic taste',
      'Loss of appetite'
    ],
    warnings: [
      'May cause vitamin B12 deficiency with long-term use',
      'Discontinue before certain imaging procedures',
      'Not for use in patients with kidney disease'
    ],
    interactions: [
      'Certain heart medications may interact',
      'Alcohol may increase risk of lactic acidosis',
      'Some diabetes medications may cause low blood sugar'
    ],
    refillHistory: [
      { date: 'May 5, 2023', quantity: 60, pharmacy: 'HealthCare Pharmacy' },
      { date: 'April 5, 2023', quantity: 60, pharmacy: 'HealthCare Pharmacy' }
    ],
    type: 'Tablet',
    quantity: 60,
    active: true,
    schedule: {
      morning: true,
      noon: false,
      evening: true,
      bedtime: false
    },
    color: 'green'
  },
  {
    id: '4',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    prescribedBy: 'Dr. Emily Johnson',
    dateIssued: 'November 5, 2022',
    expirationDate: 'December 5, 2022',
    refillsRemaining: 0,
    pharmacy: 'MedPlus Pharmacy',
    instructions: 'Take until complete. Do not skip doses.',
    purpose: 'Treatment of bacterial infections.',
    sideEffects: [
      'Diarrhea',
      'Stomach upset',
      'Rash',
      'Vomiting'
    ],
    warnings: [
      'May cause allergic reactions',
      'Take entire course of antibiotics',
      'May reduce effectiveness of birth control pills'
    ],
    interactions: [
      'Probenecid may increase amoxicillin levels',
      'May interfere with certain lab tests',
      'Other antibiotics may reduce effectiveness'
    ],
    refillHistory: [
      { date: 'November 5, 2022', quantity: 21, pharmacy: 'MedPlus Pharmacy' }
    ],
    type: 'Capsule',
    quantity: 21,
    active: false,
    schedule: {
      morning: true,
      noon: true,
      evening: true,
      bedtime: false
    },
    color: 'yellow'
  },
  {
    id: '5',
    name: 'Prednisone',
    genericName: 'Prednisone',
    dosage: '10mg',
    frequency: 'Once daily for 7 days',
    prescribedBy: 'Dr. Michael Brown',
    dateIssued: 'October 15, 2022',
    expirationDate: 'October 22, 2022',
    refillsRemaining: 0,
    pharmacy: 'HealthCare Pharmacy',
    instructions: 'Take in the morning with food.',
    purpose: 'Reduction of inflammation and immune system suppression.',
    sideEffects: [
      'Increased appetite',
      'Weight gain',
      'Mood changes',
      'Insomnia',
      'Increased blood sugar'
    ],
    warnings: [
      'Do not stop taking suddenly',
      'May mask signs of infection',
      'Long-term use may cause bone loss'
    ],
    interactions: [
      'NSAIDs may increase risk of stomach bleeding',
      'Live vaccines may be less effective',
      'Diabetes medications may need adjustment'
    ],
    refillHistory: [
      { date: 'October 15, 2022', quantity: 7, pharmacy: 'HealthCare Pharmacy' }
    ],
    type: 'Tablet',
    quantity: 7,
    active: false,
    schedule: {
      morning: true,
      noon: false,
      evening: false,
      bedtime: false
    },
    color: 'purple'
  }
];

export default function PrescriptionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const prescription = prescriptions.find(p => p.id === id);
  
  if (!prescription) {
    return notFound();
  }
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'info', label: 'Medication Info' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'history', label: 'Refill History' }
  ];

  // Format the medication data for the MedicationChart component
  const medicationChartData = [{
    id: prescription.id,
    name: `${prescription.name} ${prescription.dosage}`,
    timeSlots: prescription.schedule,
    color: prescription.color
  }];

  return (
    <PatientLayout>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <Link
              href="/patient/prescriptions"
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
            >
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Prescriptions
            </Link>
            
            <Link
              href="/patient/prescriptions/interactions"
              className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
            >
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                <line x1="2" y1="2" x2="22" y2="22"/>
              </svg>
              View Interactions
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{prescription.name} {prescription.dosage}</h1>
              <p className="text-lg text-gray-600 mt-2">{prescription.genericName} • {prescription.type}</p>
            </div>
            {prescription.active && prescription.refillsRemaining > 0 && (
              <Link 
                href={`/patient/prescriptions/refill?id=${prescription.id}`}
                className="inline-flex items-center justify-center rounded-md text-sm px-5 py-2.5 font-medium bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Request Refill
              </Link>
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mb-8">
          {prescription.active ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Active Medication
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Inactive Medication
            </span>
          )}
        </div>
        
        {/* Tabs */}
        <div className="mb-8">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </div>
        
        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle>Prescription Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Prescribed By</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.prescribedBy}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Pharmacy</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.pharmacy}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date Issued</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.dateIssued}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Expiration Date</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.expirationDate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Dosage</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.dosage}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.frequency}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                      <dd className="mt-1 text-base text-gray-900">{prescription.quantity} {prescription.type}s</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Refills Remaining</dt>
                      <dd className="mt-1 text-base text-gray-900">
                        <span 
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            prescription.refillsRemaining === 0 
                              ? "bg-red-100 text-red-800" 
                              : prescription.refillsRemaining === 1 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-green-100 text-green-800"
                          )}
                        >
                          {prescription.refillsRemaining}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border border-gray-200 shadow-sm h-full">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle>Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700">{prescription.instructions}</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 shadow-sm h-full">
                  <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle>Purpose</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700">{prescription.purpose}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle>Last Refill</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {prescription.refillHistory.length > 0 ? (
                    <div className="text-gray-700">
                      <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="mb-4 md:mb-0">
                          <p className="font-medium text-gray-500 mb-1">Date</p>
                          <p>{prescription.refillHistory[0].date}</p>
                        </div>
                        <div className="mb-4 md:mb-0">
                          <p className="font-medium text-gray-500 mb-1">Quantity</p>
                          <p>{prescription.refillHistory[0].quantity} {prescription.type}s</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-500 mb-1">Pharmacy</p>
                          <p>{prescription.refillHistory[0].pharmacy}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">No refill history available.</p>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-200">
                  <button
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    onClick={() => setActiveTab('history')}
                  >
                    View full refill history
                  </button>
                </CardFooter>
              </Card>
            </>
          )}
          
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle>Side Effects</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {prescription.sideEffects.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle>Warnings</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {prescription.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 shadow-sm md:col-span-2">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle>Drug Interactions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {prescription.interactions.map((interaction, index) => (
                      <li key={index}>{interaction}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle>Medication Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
                  <MedicationChart medications={medicationChartData} />
                </div>
                
                <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Instructions</h4>
                  <p className="text-gray-700 mb-3">{prescription.instructions}</p>
                  <p className="text-gray-700">
                    <span className="font-medium">Frequency:</span> {prescription.frequency}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'history' && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle>Refill History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {prescription.refillHistory.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pharmacy
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {prescription.refillHistory.map((refill, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {refill.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {refill.quantity} {prescription.type}s
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {refill.pharmacy}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-1">No refill history</p>
                    <p className="text-gray-500">This medication has not been refilled yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PatientLayout>
  );
} 