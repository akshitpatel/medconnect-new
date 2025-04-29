'use client';

import React, { useState } from 'react';
import PatientLayout from '@/app/components/layout/PatientLayout';
import Link from 'next/link';
import { cn } from '@/app/utils/cn';

export default function HealthPassportPage() {
  const [activeTab, setActiveTab] = useState('summary');

  // Mock patient data
  const patientInfo = {
    name: 'Sarah Johnson',
    dob: 'May 15, 1985',
    gender: 'Female',
    bloodType: 'A+',
    height: '5\'7"',
    weight: '140 lbs',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: {
      name: 'Robert Johnson',
      relationship: 'Spouse',
      phone: '(555) 123-4567'
    }
  };

  // Mock health metrics
  const healthMetrics = [
    {
      date: 'Apr 10, 2023',
      systolic: 120,
      diastolic: 80,
      heartRate: 72, 
      weight: 140,
      glucose: 90
    },
    {
      date: 'Mar 15, 2023',
      systolic: 122,
      diastolic: 82,
      heartRate: 70,
      weight: 141, 
      glucose: 95
    },
    {
      date: 'Feb 20, 2023',
      systolic: 124,
      diastolic: 84,
      heartRate: 74,
      weight: 142,
      glucose: 92
    }
  ];

  // Mock medications
  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      purpose: 'Blood pressure',
      prescriber: 'Dr. John Doe',
      startDate: 'Jan 2023',
      refills: 2
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      purpose: 'Blood sugar',
      prescriber: 'Dr. John Doe',
      startDate: 'Feb 2023',
      refills: 3
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      purpose: 'Cholesterol',
      prescriber: 'Dr. Jane Smith',
      startDate: 'Dec 2022',
      refills: 1
    }
  ];

  // Mock conditions
  const conditions = [
    {
      name: 'Hypertension',
      diagnosedDate: 'Jan 10, 2022',
      diagnosedBy: 'Dr. John Doe',
      status: 'Active',
      notes: 'Well controlled with medication'
    },
    {
      name: 'Type 2 Diabetes',
      diagnosedDate: 'Feb 5, 2022',
      diagnosedBy: 'Dr. John Doe',
      status: 'Active',
      notes: 'Diet and medication controlled'
    },
    {
      name: 'Seasonal Allergies',
      diagnosedDate: 'Mar 15, 2020',
      diagnosedBy: 'Dr. Jane Smith',
      status: 'Recurring',
      notes: 'Symptoms during spring and fall'
    }
  ];

  // Mock immunizations
  const immunizations = [
    {
      name: 'Influenza (Flu)',
      date: 'Oct 15, 2022',
      provider: 'Main Street Pharmacy',
      nextDue: 'Oct 2023'
    },
    {
      name: 'COVID-19',
      date: 'Apr 20, 2022',
      provider: 'City Health Center',
      nextDue: 'N/A'
    },
    {
      name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
      date: 'Jul 10, 2019',
      provider: 'Dr. Jane Smith',
      nextDue: 'Jul 2029'
    }
  ];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health Passport</h1>
            <p className="text-gray-600 mt-1">View and share your complete health information.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/patient/health-passport/share" 
              className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2 font-medium bg-white text-teal-600 border border-teal-600 hover:bg-teal-50"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share Passport
            </Link>
            <Link 
              href="/patient/health-passport/download" 
              className="inline-flex items-center justify-center rounded-md text-sm px-4 py-2 font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                activeTab === 'summary'
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                activeTab === 'metrics'
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Health Metrics
            </button>
            <button
              onClick={() => setActiveTab('medications')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                activeTab === 'medications'
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Medications
            </button>
            <button
              onClick={() => setActiveTab('conditions')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                activeTab === 'conditions'
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Conditions
            </button>
            <button
              onClick={() => setActiveTab('immunizations')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
                activeTab === 'immunizations'
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Immunizations
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div>
          {/* Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Patient Info Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.dob}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Gender</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.gender}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.bloodType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Height</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.height}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Weight</dt>
                          <dd className="mt-1 text-sm text-gray-900">{patientInfo.weight}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allergies & Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allergies */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Allergies</h3>
                  </div>
                  <div className="p-6">
                    {patientInfo.allergies.length > 0 ? (
                      <ul className="space-y-2">
                        {patientInfo.allergies.map((allergy, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span className="text-sm text-gray-900">{allergy}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No allergies recorded.</p>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
                  </div>
                  <div className="p-6">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.relationship}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{patientInfo.emergencyContact.phone}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Recent Health Activity</h3>
                  <Link 
                    href="/patient/activities" 
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="p-6">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Cardiology Appointment</h4>
                        <p className="text-sm text-gray-500">Tomorrow, 10:00 AM with Dr. John Doe</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-amber-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 2v6M15 2v6M3 10h18M5 18h14M8 22h8"></path>
                        <path d="M9 14v4M15 14v4"></path>
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Lab Test Results</h4>
                        <p className="text-sm text-gray-500">Blood work results received on April 10, 2023</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3"></path>
                        <path d="M8 3v4h8V3"></path>
                        <path d="M11 13h6"></path>
                        <path d="M11 17h6"></path>
                        <path d="M7 13h.01"></path>
                        <path d="M7 17h.01"></path>
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Prescription Refill</h4>
                        <p className="text-sm text-gray-500">Lisinopril refilled on April 12, 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Metrics */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Latest Metrics */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Latest Metrics</h3>
                  <Link 
                    href="/patient/health-records/metrics/log"
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Log New Entry
                  </Link>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Blood Pressure</h4>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{healthMetrics[0].systolic}/{healthMetrics[0].diastolic}</p>
                      <p className="mt-1 text-xs text-gray-500">mmHg</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Heart Rate</h4>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{healthMetrics[0].heartRate}</p>
                      <p className="mt-1 text-xs text-gray-500">bpm</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Blood Glucose</h4>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{healthMetrics[0].glucose}</p>
                      <p className="mt-1 text-xs text-gray-500">mg/dL</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Weight</h4>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">{healthMetrics[0].weight}</p>
                      <p className="mt-1 text-xs text-gray-500">lbs</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                      <p className="mt-1 text-xl font-semibold text-gray-900">{healthMetrics[0].date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric History */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Metrics History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Pressure
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Heart Rate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blood Glucose
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {healthMetrics.map((metric, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.systolic}/{metric.diastolic} mmHg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.heartRate} bpm
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.glucose} mg/dL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metric.weight} lbs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Medications */}
          {activeTab === 'medications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
                </div>
                <div className="p-6">
                  {medications.length > 0 ? (
                    <ul className="space-y-6">
                      {medications.map((medication, index) => (
                        <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{medication.name}</h4>
                              <p className="text-gray-600 mt-1">{medication.dosage} - {medication.frequency}</p>
                              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                  </svg>
                                  Purpose: {medication.purpose}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                  </svg>
                                  Prescribed by: {medication.prescriber}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                  </svg>
                                  Start date: {medication.startDate}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {medication.refills} Refills left
                              </span>
                              <div className="mt-3">
                                <Link
                                  href={`/patient/prescriptions/refill/${index}`}
                                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                                >
                                  Request Refill
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No current medications.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conditions */}
          {activeTab === 'conditions' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Medical Conditions</h3>
              </div>
              <div className="p-6">
                {conditions.length > 0 ? (
                  <ul className="space-y-6">
                    {conditions.map((condition, index) => (
                      <li key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-lg font-medium text-gray-900">{condition.name}</h4>
                              <span 
                                className={cn(
                                  "ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  condition.status === 'Active' 
                                    ? "bg-green-100 text-green-800" 
                                    : condition.status === 'Recurring'
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-blue-100 text-blue-800"
                                )}
                              >
                                {condition.status}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Diagnosed: {condition.diagnosedDate}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Diagnosed by: {condition.diagnosedBy}
                              </div>
                            </div>
                            {condition.notes && (
                              <p className="mt-2 text-sm text-gray-600">{condition.notes}</p>
                            )}
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <Link
                              href={`/patient/health-records/conditions/${index}`}
                              className="text-sm font-medium text-teal-600 hover:text-teal-700"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No medical conditions recorded.</p>
                )}
              </div>
            </div>
          )}

          {/* Immunizations */}
          {activeTab === 'immunizations' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Immunization Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Immunization
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Received
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Due
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {immunizations.map((immunization, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {immunization.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {immunization.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {immunization.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {immunization.nextDue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Add Missing Record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
} 