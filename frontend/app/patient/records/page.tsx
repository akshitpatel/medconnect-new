'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/utils/cn';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';

// Mock data for medical records
const medicalRecords = [
  {
    id: '1',
    type: 'Visit Summary',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedConnect Primary Care',
    date: '2023-09-15',
    description: 'Annual physical examination',
    details: 'Routine check-up with blood work. All results within normal range. Recommended continued exercise and healthy diet.',
    attachments: [
      { name: 'Physical Exam Report.pdf', size: '1.2 MB' },
      { name: 'Lab Results.pdf', size: '0.8 MB' }
    ],
    category: 'primary-care'
  },
  {
    id: '2',
    type: 'Lab Results',
    provider: 'Quest Diagnostics',
    facility: 'Quest Diagnostics Lab',
    date: '2023-09-10',
    description: 'Complete Blood Count (CBC)',
    details: 'Blood test ordered by Dr. Sarah Johnson. Results show normal white blood cell count, red blood cell count, and platelet levels.',
    attachments: [
      { name: 'CBC Results.pdf', size: '0.5 MB' }
    ],
    category: 'lab'
  },
  {
    id: '3',
    type: 'Imaging',
    provider: 'Dr. Michael Chen',
    facility: 'City Medical Imaging Center',
    date: '2023-08-22',
    description: 'Chest X-ray',
    details: 'Chest X-ray performed due to persistent cough. Results show no abnormalities in the lungs or heart.',
    attachments: [
      { name: 'Chest X-ray Report.pdf', size: '0.7 MB' },
      { name: 'X-ray Images.zip', size: '15.3 MB' }
    ],
    category: 'imaging'
  },
  {
    id: '4',
    type: 'Specialist Consultation',
    provider: 'Dr. Emily Roberts',
    facility: 'Dermatology Associates',
    date: '2023-07-18',
    description: 'Dermatology consultation',
    details: 'Evaluation of skin rash on forearm. Diagnosed as contact dermatitis. Prescribed topical corticosteroid cream.',
    attachments: [
      { name: 'Dermatology Report.pdf', size: '0.9 MB' },
      { name: 'Prescription.pdf', size: '0.3 MB' }
    ],
    category: 'specialist'
  },
  {
    id: '5',
    type: 'Vaccination',
    provider: 'Nurse Practitioner Jessica Williams',
    facility: 'MedConnect Primary Care',
    date: '2023-06-05',
    description: 'Influenza Vaccine',
    details: 'Annual flu shot administered. No adverse reactions observed.',
    attachments: [
      { name: 'Vaccination Record.pdf', size: '0.4 MB' }
    ],
    category: 'vaccination'
  },
  {
    id: '6',
    type: 'Procedure',
    provider: 'Dr. David Wilson',
    facility: 'City Medical Center',
    date: '2023-04-12',
    description: 'Minor surgical procedure',
    details: 'Removal of benign skin lesion on back. Procedure completed without complications. Pathology report confirmed benign nature.',
    attachments: [
      { name: 'Procedure Notes.pdf', size: '1.1 MB' },
      { name: 'Pathology Report.pdf', size: '0.6 MB' },
      { name: 'Post-Procedure Instructions.pdf', size: '0.4 MB' }
    ],
    category: 'procedure'
  },
  {
    id: '7',
    type: 'Visit Summary',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedConnect Primary Care',
    date: '2023-03-08',
    description: 'Follow-up appointment',
    details: 'Follow-up for previously reported fatigue. Blood work shows slight vitamin D deficiency. Recommended supplement and increased outdoor activity.',
    attachments: [
      { name: 'Visit Summary.pdf', size: '0.7 MB' },
      { name: 'Lab Results.pdf', size: '0.5 MB' }
    ],
    category: 'primary-care'
  },
  {
    id: '8',
    type: 'Mental Health',
    provider: 'Dr. Lisa Thompson',
    facility: 'Behavioral Health Center',
    date: '2023-02-14',
    description: 'Initial psychiatric evaluation',
    details: 'Assessment for reported anxiety symptoms. Discussed coping strategies and stress management techniques. Follow-up scheduled in one month.',
    attachments: [
      { name: 'Mental Health Assessment.pdf', size: '1.3 MB' }
    ],
    category: 'mental-health'
  }
];

// Record categories with icons
const recordCategories = [
  { id: 'all', name: 'All Records', icon: '📋' },
  { id: 'primary-care', name: 'Primary Care', icon: '👨‍⚕️' },
  { id: 'specialist', name: 'Specialist', icon: '🧠' },
  { id: 'lab', name: 'Lab Results', icon: '🧪' },
  { id: 'imaging', name: 'Imaging', icon: '🔬' },
  { id: 'procedure', name: 'Procedures', icon: '🔧' },
  { id: 'vaccination', name: 'Vaccinations', icon: '💉' },
  { id: 'mental-health', name: 'Mental Health', icon: '🧘‍♂️' }
];

export default function MedicalRecordsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter records based on category and search query
  const filteredRecords = medicalRecords.filter(record => {
    // Filter by category
    if (selectedCategory !== 'all' && record.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !record.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.provider.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !record.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort records by date
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  // Get the selected record details
  const selectedRecordDetails = selectedRecord 
    ? medicalRecords.find(record => record.id === selectedRecord) 
    : null;
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  // Get icon for record type
  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'Visit Summary': return '📝';
      case 'Lab Results': return '🧪';
      case 'Imaging': return '🔬';
      case 'Specialist Consultation': return '👨‍⚕️';
      case 'Vaccination': return '💉';
      case 'Procedure': return '🔧';
      case 'Mental Health': return '🧠';
      default: return '📋';
    }
  };
  
  return (
    <DefaultLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Medical Records
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  View and manage your complete medical history
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download All Records
                </button>
                <button className="inline-flex items-center px-4 py-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Request Records
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search records by provider, type, or description..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300 whitespace-nowrap">Sort by:</span>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            
            {/* Category Tabs */}
            <div className="flex space-x-1 mb-6 overflow-x-auto rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
              <AnimatePresence>
                {recordCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex-1 min-w-fit px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center",
                      selectedCategory === category.id
                        ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                    initial={false}
                    animate={{
                      scale: selectedCategory === category.id ? 1.05 : 1,
                    }}
                    whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <span className="mr-2">📋</span>
                  Records ({sortedRecords.length})
                </h2>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : sortedRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No records found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {sortedRecords.map((record) => (
                      <div
                        key={record.id}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                          selectedRecord === record.id
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700"
                        )}
                        onClick={() => setSelectedRecord(record.id)}
                      >
                        <div className="flex items-start">
                          <div className="text-2xl mr-3">{getRecordTypeIcon(record.type)}</div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900 dark:text-white">{record.description}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{record.provider} • {formatDate(record.date)}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{record.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Record Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              {selectedRecordDetails ? (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="mr-2">{getRecordTypeIcon(selectedRecordDetails.type)}</span>
                        {selectedRecordDetails.description}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">{selectedRecordDetails.type} • {formatDate(selectedRecordDetails.date)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Provider Information</h3>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Provider:</span> {selectedRecordDetails.provider}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Facility:</span> {selectedRecordDetails.facility}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Record Information</h3>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Record Type:</span> {selectedRecordDetails.type}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Date:</span> {formatDate(selectedRecordDetails.date)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">{selectedRecordDetails.details}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedRecordDetails.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{attachment.size}</p>
                            </div>
                          </div>
                          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Select a record</h3>
                    <p className="text-gray-500 dark:text-gray-400">Choose a record from the list to view details</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DefaultLayout>
  );
} 