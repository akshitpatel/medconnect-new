'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/app/components/ui/Navbar';
import { cn } from '@/app/utils/cn';

// Mock data for lab results
const labResults = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    date: '2023-07-15',
    status: 'completed',
    category: 'Blood',
    orderedBy: 'Dr. Sarah Johnson',
    facility: 'MedConnect Labs',
    abnormalFlags: ['Low White Blood Cells'],
    viewedByPatient: true,
    results: [
      { 
        name: 'White Blood Cell (WBC)', 
        value: '3.8', 
        unit: '10^9/L', 
        referenceRange: '4.5-11.0', 
        abnormal: true,
        trend: 'down' 
      },
      { 
        name: 'Red Blood Cell (RBC)', 
        value: '4.9', 
        unit: '10^12/L', 
        referenceRange: '4.5-5.9', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Hemoglobin (Hgb)', 
        value: '14.2', 
        unit: 'g/dL', 
        referenceRange: '13.5-17.5', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Hematocrit (Hct)', 
        value: '42', 
        unit: '%', 
        referenceRange: '41-50', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Platelet Count', 
        value: '250', 
        unit: '10^9/L', 
        referenceRange: '150-450', 
        abnormal: false,
        trend: 'up' 
      }
    ]
  },
  {
    id: '2',
    name: 'Comprehensive Metabolic Panel (CMP)',
    date: '2023-07-15',
    status: 'completed',
    category: 'Blood',
    orderedBy: 'Dr. Sarah Johnson',
    facility: 'MedConnect Labs',
    abnormalFlags: ['High Glucose'],
    viewedByPatient: false,
    results: [
      { 
        name: 'Glucose', 
        value: '110', 
        unit: 'mg/dL', 
        referenceRange: '70-99', 
        abnormal: true,
        trend: 'up' 
      },
      { 
        name: 'Blood Urea Nitrogen (BUN)', 
        value: '15', 
        unit: 'mg/dL', 
        referenceRange: '7-20', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Creatinine', 
        value: '0.9', 
        unit: 'mg/dL', 
        referenceRange: '0.6-1.2', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Sodium', 
        value: '140', 
        unit: 'mmol/L', 
        referenceRange: '135-145', 
        abnormal: false,
        trend: 'stable' 
      }
    ]
  },
  {
    id: '3',
    name: 'Lipid Panel',
    date: '2023-06-01',
    status: 'completed',
    category: 'Blood',
    orderedBy: 'Dr. Sarah Johnson',
    facility: 'MedConnect Labs',
    abnormalFlags: ['High LDL Cholesterol'],
    viewedByPatient: true,
    results: [
      { 
        name: 'Total Cholesterol', 
        value: '210', 
        unit: 'mg/dL', 
        referenceRange: '<200', 
        abnormal: true,
        trend: 'up' 
      },
      { 
        name: 'LDL Cholesterol', 
        value: '145', 
        unit: 'mg/dL', 
        referenceRange: '<100', 
        abnormal: true,
        trend: 'up' 
      },
      { 
        name: 'HDL Cholesterol', 
        value: '55', 
        unit: 'mg/dL', 
        referenceRange: '>40', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Triglycerides', 
        value: '120', 
        unit: 'mg/dL', 
        referenceRange: '<150', 
        abnormal: false,
        trend: 'stable' 
      }
    ]
  },
  {
    id: '4',
    name: 'Thyroid Function Panel',
    date: '2023-05-10',
    status: 'completed',
    category: 'Blood',
    orderedBy: 'Dr. David Chen',
    facility: 'MedConnect Labs',
    abnormalFlags: [],
    viewedByPatient: true,
    results: [
      { 
        name: 'Thyroid Stimulating Hormone (TSH)', 
        value: '2.5', 
        unit: 'mIU/L', 
        referenceRange: '0.4-4.0', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Free Thyroxine (T4)', 
        value: '1.2', 
        unit: 'ng/dL', 
        referenceRange: '0.8-1.8', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Free Triiodothyronine (T3)', 
        value: '3.1', 
        unit: 'pg/mL', 
        referenceRange: '2.3-4.2', 
        abnormal: false,
        trend: 'stable' 
      }
    ]
  },
  {
    id: '5',
    name: 'Urinalysis',
    date: '2023-04-15',
    status: 'completed',
    category: 'Urine',
    orderedBy: 'Dr. Sarah Johnson',
    facility: 'MedConnect Labs',
    abnormalFlags: [],
    viewedByPatient: true,
    results: [
      { 
        name: 'pH', 
        value: '6.0', 
        unit: '', 
        referenceRange: '4.5-8.0', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Specific Gravity', 
        value: '1.020', 
        unit: '', 
        referenceRange: '1.005-1.030', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Glucose', 
        value: 'Negative', 
        unit: '', 
        referenceRange: 'Negative', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Protein', 
        value: 'Negative', 
        unit: '', 
        referenceRange: 'Negative', 
        abnormal: false,
        trend: 'stable' 
      },
      { 
        name: 'Red Blood Cells', 
        value: '0-2', 
        unit: 'per HPF', 
        referenceRange: '0-2', 
        abnormal: false,
        trend: 'stable' 
      }
    ]
  }
];

export default function LabResultsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const tabs = [
    { id: 'all', label: 'All Results' },
    { id: 'unread', label: 'Unread Results' },
    { id: 'abnormal', label: 'Abnormal Results' }
  ];
  
  // Get test categories for filtering
  const categories = [...new Set(labResults.map(test => test.category))];
  
  // Filter test results based on active tab
  const filteredResults = labResults.filter(test => {
    if (activeTab === 'unread') return !test.viewedByPatient;
    if (activeTab === 'abnormal') return test.abnormalFlags.length > 0;
    return true;
  });
  
  // Find currently selected test
  const currentTest = selectedTest 
    ? labResults.find(test => test.id === selectedTest) 
    : null;
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get icon based on test category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'blood':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'urine':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 01-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        );
    }
  };
  
  // Get trend indicator icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500">
            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
          </svg>
        );
      case 'down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
            <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  return (
    <div className="min-h-screen gradient-bg-green pattern-bg">
      {/* Navbar */}
      <Navbar activePage="lab-results" />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md mb-8 fade-in visible">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Lab Results</h1>
              <p className="text-gray-600 text-lg">View and track your laboratory test results</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary inline-flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
                Download All Results
              </button>
              <button className="btn-primary inline-flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Request New Test
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 rounded-lg bg-gray-100 p-1 w-full md:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.label}
                {tab.id === 'unread' && (
                  <span className="ml-2 bg-teal-100 text-teal-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {labResults.filter(test => !test.viewedByPatient).length}
                  </span>
                )}
                {tab.id === 'abnormal' && (
                  <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {labResults.filter(test => test.abnormalFlags.length > 0).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test List */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'unread' ? 'Unread Results' : 
                   activeTab === 'abnormal' ? 'Abnormal Results' : 'All Test Results'}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredResults.length})
                  </span>
                </h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                {filteredResults.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredResults.map((test, index) => (
                      <li 
                        key={test.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors duration-150 cursor-pointer",
                          selectedTest === test.id ? "bg-teal-50 border-l-4 border-teal-500" : "",
                          !test.viewedByPatient ? "bg-blue-50/50" : ""
                        )}
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <div 
                          className={`fade-in ${loading ? '' : 'visible'}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                                  {test.name}
                                  {!test.viewedByPatient && (
                                    <span className="ml-2 h-2 w-2 bg-blue-500 rounded-full animate-pulse-slow"></span>
                                  )}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                  {formatDate(test.date)} • {test.orderedBy}
                                </p>
                              </div>
                              <div className="ml-4 flex-shrink-0 flex">
                                <span className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                  test.category.toLowerCase() === 'blood' ? "bg-red-100 text-red-800" :
                                  test.category.toLowerCase() === 'urine' ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                )}>
                                  <span className="mr-1">{getCategoryIcon(test.category)}</span>
                                  {test.category}
                                </span>
                              </div>
                            </div>
                            
                            {test.abnormalFlags.length > 0 && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                  </svg>
                                  {test.abnormalFlags.length} abnormal {test.abnormalFlags.length === 1 ? 'result' : 'results'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">No test results available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Test Details */}
          <div className="lg:col-span-2">
            {currentTest ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md fade-in visible">
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">{currentTest.name}</h2>
                    <button className="btn-secondary text-xs py-1 px-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 inline">
                        <path d="M2.5 3A1.5 1.5 0 001 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0115 5.293V4.5A1.5 1.5 0 0013.5 3h-11z" />
                        <path d="M8 10.414L1.05 6.1c-.033.021-.064.045-.094.071a1.5 1.5 0 00-.437 1.253v5.148a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5V7.425a1.5 1.5 0 00-.44-1.06L8 10.414z" />
                      </svg>
                      Email Results
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Collected on {formatDate(currentTest.date)} • Ordered by {currentTest.orderedBy}
                  </p>
                </div>
                
                <div className="p-4">
                  {/* Test Information */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Test Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Test Date</p>
                        <p className="text-sm text-gray-900">{formatDate(currentTest.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Ordered By</p>
                        <p className="text-sm text-gray-900">{currentTest.orderedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Facility</p>
                        <p className="text-sm text-gray-900">{currentTest.facility}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Test Results */}
                  <div className="overflow-auto">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Results</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Test
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reference Range
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentTest.results.map((result, index) => (
                          <tr 
                            key={`${currentTest.id}-${index}`}
                            className={cn(
                              result.abnormal ? "bg-amber-50" : ""
                            )}
                          >
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.name}
                              {result.abnormal && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                  Abnormal
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className={cn(
                                "text-sm",
                                result.abnormal ? "font-semibold text-amber-600" : "text-gray-900"
                              )}>
                                {result.value} {result.unit}
                              </span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.referenceRange}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getTrendIcon(result.trend)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Comments / Notes */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        {currentTest.abnormalFlags.length > 0 ? (
                          <>
                            The following results are abnormal and may require attention:
                            <ul className="mt-2 pl-5 list-disc space-y-1">
                              {currentTest.abnormalFlags.map((flag, index) => (
                                <li key={index} className="text-sm text-amber-700">{flag}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          "All results are within normal reference ranges."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <button className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 inline-block">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download PDF
                      </button>
                      <button className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 inline-block">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Full Report
                      </button>
                    </div>
                    <div>
                      <button className="btn-primary text-xs py-1 px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 inline">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                        </svg>
                        Ask a Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-8 text-center shadow-md fade-in visible">
                <div className="animate-float inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Select a Test</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Please select a test from the list to view detailed results and information.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 