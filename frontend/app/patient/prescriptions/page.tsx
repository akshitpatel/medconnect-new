'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/app/components/ui/Card';
import { Navbar } from '@/app/components/ui/Navbar';
import { cn } from '@/app/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Mock data for prescriptions
const prescriptions = [
  {
    id: '1',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20mg',
    frequency: 'Once daily',
    active: true,
    pharmacy: 'CVS Pharmacy',
    prescribedBy: 'Dr. Sarah Johnson',
    dateIssued: '2023-06-15',
    expirationDate: '2024-06-15',
    refillsRemaining: 2,
    type: 'tablet',
    quantity: 30,
    purpose: 'Cholesterol management',
    instructions: 'Take 1 tablet by mouth once daily in the evening.',
    refillHistory: [
      { date: '2023-06-15', quantity: 30, pharmacy: 'CVS Pharmacy' },
      { date: '2023-07-15', quantity: 30, pharmacy: 'CVS Pharmacy' },
    ],
    sideEffects: [
      'Muscle pain or weakness',
      'Dizziness',
      'Nausea',
      'Headache',
      'Difficulty sleeping'
    ],
    warnings: [
      'Do not take with grapefruit juice',
      'Avoid excessive alcohol use',
      'Tell your doctor if you experience unexplained muscle pain'
    ],
    interactions: [
      'May interact with certain antibiotics',
      'May interact with certain antifungal medications',
      'May interact with certain HIV medications'
    ],
    schedule: {
      evening: true
    },
    color: 'teal'
  },
  {
    id: '2',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    active: true,
    pharmacy: 'Walgreens',
    prescribedBy: 'Dr. Sarah Johnson',
    dateIssued: '2023-05-20',
    expirationDate: '2024-05-20',
    refillsRemaining: 3,
    type: 'tablet',
    quantity: 30,
    purpose: 'Blood pressure management',
    instructions: 'Take 1 tablet by mouth once daily in the morning with water, with or without food.',
    refillHistory: [
      { date: '2023-05-20', quantity: 30, pharmacy: 'Walgreens' },
      { date: '2023-06-20', quantity: 30, pharmacy: 'Walgreens' },
    ],
    sideEffects: [
      'Dry cough',
      'Dizziness',
      'Headache',
      'Fatigue'
    ],
    warnings: [
      'Do not use potassium supplements without talking to your doctor',
      'Contact your doctor if you experience swelling of the face, lips, tongue, or throat',
      'May cause dizziness when standing up too quickly'
    ],
    interactions: [
      'May interact with certain diuretics',
      'May interact with NSAIDs (like ibuprofen)',
      'May interact with potassium supplements'
    ],
    schedule: {
      morning: true
    },
    color: 'blue'
  },
  {
    id: '3',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    frequency: 'Twice daily',
    active: true,
    pharmacy: 'CVS Pharmacy',
    prescribedBy: 'Dr. Michael Chen',
    dateIssued: '2023-04-10',
    expirationDate: '2024-04-10',
    refillsRemaining: 1,
    type: 'tablet',
    quantity: 60,
    purpose: 'Diabetes management',
    instructions: 'Take 1 tablet by mouth twice daily with meals.',
    refillHistory: [
      { date: '2023-04-10', quantity: 60, pharmacy: 'CVS Pharmacy' },
      { date: '2023-05-10', quantity: 60, pharmacy: 'CVS Pharmacy' },
      { date: '2023-06-10', quantity: 60, pharmacy: 'CVS Pharmacy' },
    ],
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Stomach pain',
      'Metallic taste in mouth'
    ],
    warnings: [
      'Take with food to minimize stomach upset',
      'May cause vitamin B12 deficiency with long-term use',
      'Avoid excessive alcohol use'
    ],
    interactions: [
      'May interact with certain diabetes medications',
      'May interact with certain heart medications',
      'May interact with certain contrast dyes used in medical imaging'
    ],
    schedule: {
      morning: true,
      evening: true
    },
    color: 'purple'
  },
  {
    id: '4',
    name: 'Sertraline',
    genericName: 'Sertraline Hydrochloride',
    dosage: '50mg',
    frequency: 'Once daily',
    active: false,
    pharmacy: 'Walgreens',
    prescribedBy: 'Dr. Emily Roberts',
    dateIssued: '2022-11-15',
    expirationDate: '2023-11-15',
    refillsRemaining: 0,
    type: 'tablet',
    quantity: 30,
    purpose: 'Depression and anxiety management',
    instructions: 'Take 1 tablet by mouth once daily in the morning or evening at the same time each day.',
    refillHistory: [
      { date: '2022-11-15', quantity: 30, pharmacy: 'Walgreens' },
      { date: '2022-12-15', quantity: 30, pharmacy: 'Walgreens' },
      { date: '2023-01-15', quantity: 30, pharmacy: 'Walgreens' },
    ],
    sideEffects: [
      'Nausea',
      'Dizziness',
      'Dry mouth',
      'Insomnia',
      'Fatigue'
    ],
    warnings: [
      'Do not stop taking this medication without talking to your doctor',
      'May increase risk of suicidal thoughts in some patients',
      'May cause sexual problems'
    ],
    interactions: [
      'May interact with certain migraine medications',
      'May interact with certain pain medications',
      'May interact with certain blood thinners'
    ],
    schedule: {
      morning: true
    },
    color: 'amber'
  },
  {
    id: '5',
    name: 'Albuterol',
    genericName: 'Albuterol Sulfate',
    dosage: '90mcg',
    frequency: 'As needed',
    active: true,
    pharmacy: 'CVS Pharmacy',
    prescribedBy: 'Dr. Sarah Johnson',
    dateIssued: '2023-03-05',
    expirationDate: '2024-03-05',
    refillsRemaining: 5,
    type: 'inhaler',
    quantity: 1,
    purpose: 'Asthma and COPD management',
    instructions: 'Inhale 1-2 puffs every 4-6 hours as needed for shortness of breath or wheezing.',
    refillHistory: [
      { date: '2023-03-05', quantity: 1, pharmacy: 'CVS Pharmacy' },
    ],
    sideEffects: [
      'Tremor',
      'Nervousness',
      'Headache',
      'Rapid heartbeat',
      'Throat irritation'
    ],
    warnings: [
      'Do not exceed recommended dose',
      'Seek medical attention if symptoms worsen',
      'Keep track of how often you use this medication'
    ],
    interactions: [
      'May interact with certain blood pressure medications',
      'May interact with certain antidepressants',
      'May interact with certain diuretics'
    ],
    schedule: {
      morning: true,
      noon: true,
      evening: true,
      bedtime: true
    },
    color: 'green'
  }
];

export default function PrescriptionsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const tabs = [
    { id: 'active', label: 'Active Medications' },
    { id: 'past', label: 'Past Medications' }
  ];
  
  const activePrescriptions = prescriptions.filter(p => p.active);
  const pastPrescriptions = prescriptions.filter(p => !p.active);
  
  const currentPrescriptions = activeTab === 'active' ? activePrescriptions : pastPrescriptions;
  
  // Get the selected prescription details
  const selectedPrescriptionDetails = selectedPrescription 
    ? prescriptions.find(p => p.id === selectedPrescription) 
    : null;
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  // Get background color based on medication color
  const getMedicationColorClass = (color: string) => {
    switch (color) {
      case 'teal':
        return 'bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200';
      case 'blue':
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200';
      case 'purple':
        return 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200';
      case 'amber':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      case 'green':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
    }
  };
  
  // Get text color based on medication color
  const getMedicationTextClass = (color: string) => {
    switch (color) {
      case 'teal':
        return 'text-teal-800';
      case 'blue':
        return 'text-blue-800';
      case 'purple':
        return 'text-purple-800';
      case 'amber':
        return 'text-amber-800';
      case 'green':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                My Prescriptions
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage your medications and request refills
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/patient/prescriptions/interactions"
                className="inline-flex items-center px-4 py-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                View Interactions
              </Link>
              {activeTab === 'active' && activePrescriptions.length > 0 && (
                <button
                  onClick={() => setShowRefillModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  Request Refills
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 p-1">
            <AnimatePresence>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 min-w-fit px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  initial={false}
                  animate={{
                    scale: activeTab === tab.id ? 1.05 : 1,
                  }}
                  whileHover={{ scale: activeTab === tab.id ? 1.05 : 1.02 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescriptions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="mr-2">💊</span>
                Medications ({currentPrescriptions.length})
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : currentPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No {activeTab === 'active' ? 'active' : 'past'} medications found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {currentPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                        selectedPrescription === prescription.id
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700"
                      )}
                      onClick={() => setSelectedPrescription(prescription.id)}
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-full border-2 mr-3",
                          prescription.color === 'teal' ? "bg-teal-100 border-teal-400 text-teal-800" : 
                          prescription.color === 'blue' ? "bg-blue-100 border-blue-400 text-blue-800" :
                          prescription.color === 'purple' ? "bg-purple-100 border-purple-400 text-purple-800" :
                          prescription.color === 'amber' ? "bg-amber-100 border-amber-400 text-amber-800" :
                          prescription.color === 'green' ? "bg-green-100 border-green-400 text-green-800" :
                          "bg-gray-100 border-gray-400 text-gray-800"
                        )}>
                          <span className="text-sm font-bold">
                            {prescription.type === 'tablet' ? 'TAB' : 
                             prescription.type === 'capsule' ? 'CAP' : 
                             prescription.type === 'liquid' ? 'LIQ' : 
                             prescription.type === 'inhaler' ? 'INH' : 
                             prescription.type.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900 dark:text-white">{prescription.name} {prescription.dosage}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{prescription.frequency}</p>
                          <div className="flex items-center mt-1">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                              prescription.refillsRemaining === 0 
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                                : prescription.refillsRemaining === 1 
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            )}>
                              {prescription.refillsRemaining} refill{prescription.refillsRemaining !== 1 && 's'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Prescription Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg h-full">
              {selectedPrescriptionDetails ? (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        {selectedPrescriptionDetails.name} {selectedPrescriptionDetails.dosage}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">{selectedPrescriptionDetails.genericName}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedPrescriptionDetails.active && selectedPrescriptionDetails.refillsRemaining > 0 && (
                        <button 
                          onClick={() => setShowRefillModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <polyline points="1 20 1 14 7 14"></polyline>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                          </svg>
                          Request Refill
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Prescription Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Type:</span> {selectedPrescriptionDetails.type.charAt(0).toUpperCase() + selectedPrescriptionDetails.type.slice(1)}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Quantity:</span> {selectedPrescriptionDetails.quantity}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Frequency:</span> {selectedPrescriptionDetails.frequency}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Refills:</span> {selectedPrescriptionDetails.refillsRemaining}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Issued:</span> {formatDate(selectedPrescriptionDetails.dateIssued)}</p>
                        <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Expires:</span> {formatDate(selectedPrescriptionDetails.expirationDate)}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Provider Information</h3>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Prescribed By:</span> {selectedPrescriptionDetails.prescribedBy}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Pharmacy:</span> {selectedPrescriptionDetails.pharmacy}</p>
                      <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Purpose:</span> {selectedPrescriptionDetails.purpose}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Instructions</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">{selectedPrescriptionDetails.instructions}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Side Effects</h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedPrescriptionDetails.sideEffects.map((effect, index) => (
                            <li key={index} className="text-gray-600 dark:text-gray-300">{effect}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Warnings</h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedPrescriptionDetails.warnings.map((warning, index) => (
                            <li key={index} className="text-gray-600 dark:text-gray-300">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Refill History</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Quantity</th>
                            <th className="pb-2">Pharmacy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPrescriptionDetails.refillHistory.map((refill, index) => (
                            <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                              <td className="py-2 text-gray-600 dark:text-gray-300">{formatDate(refill.date)}</td>
                              <td className="py-2 text-gray-600 dark:text-gray-300">{refill.quantity}</td>
                              <td className="py-2 text-gray-600 dark:text-gray-300">{refill.pharmacy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="text-6xl mb-4">💊</div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Select a Medication</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    Select a medication from the list to view its details, including dosage instructions, side effects, and refill history.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Refill Modal */}
        <AnimatePresence>
          {showRefillModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowRefillModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Request Medication Refill</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Select the medications you would like to refill. Your request will be sent to your healthcare provider for approval.
                </p>
                
                <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                  {activePrescriptions.filter(p => p.refillsRemaining > 0).map(prescription => (
                    <div key={prescription.id} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <input
                        type="checkbox"
                        id={`refill-${prescription.id}`}
                        className="h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      />
                      <label htmlFor={`refill-${prescription.id}`} className="ml-3 flex-1">
                        <span className="block font-medium text-gray-900 dark:text-white">{prescription.name} {prescription.dosage}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{prescription.refillsRemaining} refill{prescription.refillsRemaining !== 1 && 's'} remaining</span>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRefillModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600"
                  >
                    Submit Request
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 