'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/ui/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/utils/cn';

// Enhanced medication interactions component
interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  type: string;
  color?: string;
}

interface Interaction {
  severity: 'high' | 'moderate' | 'low';
  description: string;
  medications: string[]; // Array of medication ids involved in interaction
  recommendation?: string;
  details?: string;
  sources?: { name: string; url: string }[];
}

// Mock data for active medications
const activeMedications: Medication[] = [
  {
    id: '1',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosage: '20mg',
    type: 'tablet',
    color: 'blue'
  },
  {
    id: '2',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosage: '10mg',
    type: 'tablet',
    color: 'green'
  },
  {
    id: '3',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosage: '500mg',
    type: 'tablet',
    color: 'purple'
  },
  {
    id: '5',
    name: 'Albuterol',
    genericName: 'Albuterol Sulfate',
    dosage: '90mcg',
    type: 'inhaler',
    color: 'teal'
  }
];

// Mock data for interactions
const medicationInteractions: Interaction[] = [
  {
    severity: 'moderate',
    medications: ['1', '2'], // Atorvastatin and Lisinopril
    description: 'Taking these medications together may increase the risk of muscle pain, tenderness, or weakness (myopathy).',
    recommendation: 'Monitor for unusual muscle pain and report to your doctor immediately if you experience symptoms.',
    details: 'Some studies suggest that the combination of ACE inhibitors like Lisinopril with statins like Atorvastatin can increase the risk of muscle-related side effects in some patients, though the overall risk is still considered moderate.',
    sources: [
      { name: 'National Library of Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
      { name: 'Mayo Clinic', url: 'https://www.mayoclinic.org/' }
    ]
  },
  {
    severity: 'low',
    medications: ['2', '3'], // Lisinopril and Metformin
    description: 'This combination may slightly increase the risk of hypoglycemia (low blood sugar) in some patients.',
    recommendation: 'Monitor your blood sugar levels regularly and watch for signs of hypoglycemia such as dizziness, confusion, or unusual hunger.',
    details: 'ACE inhibitors like Lisinopril can improve insulin sensitivity, which when combined with diabetes medications like Metformin, may occasionally lead to lower than expected blood sugar levels.',
    sources: [
      { name: 'American Diabetes Association', url: 'https://diabetes.org/' }
    ]
  },
  {
    severity: 'high',
    medications: ['3', '5'], // Metformin and Albuterol
    description: 'Albuterol may increase blood glucose levels, potentially reducing the effectiveness of Metformin.',
    recommendation: 'More frequent blood glucose monitoring is recommended. Your doctor may need to adjust your Metformin dosage.',
    details: 'Beta-agonists like Albuterol can cause temporary increases in blood glucose levels by stimulating glycogenolysis (the breakdown of glycogen to glucose) in the liver. This may counteract the glucose-lowering effects of Metformin.',
    sources: [
      { name: 'Journal of Clinical Endocrinology & Metabolism', url: 'https://academic.oup.com/jcem' },
      { name: 'American Thoracic Society', url: 'https://www.thoracic.org/' }
    ]
  }
];

export default function MedicationInteractionsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [foodInteractionsVisible, setFoodInteractionsVisible] = useState(false);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get medication names from ids
  const getMedicationNames = (medicationIds: string[]) => {
    return medicationIds.map(id => {
      const med = activeMedications.find(m => m.id === id);
      return med ? `${med.name} ${med.dosage}` : 'Unknown medication';
    });
  };
  
  // Get medication color class
  const getMedicationColorClass = (medicationId: string) => {
    const med = activeMedications.find(m => m.id === medicationId);
    if (!med || !med.color) return 'bg-gray-100 border-gray-300';
    
    switch (med.color) {
      case 'blue': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'green': return 'bg-green-100 border-green-300 text-green-800';
      case 'purple': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'teal': return 'bg-teal-100 border-teal-300 text-teal-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  // Get severity classes
  const getSeverityClasses = (severity: 'high' | 'moderate' | 'low') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800/30',
          text: 'text-red-800 dark:text-red-300',
          icon: 'text-red-500 dark:text-red-400',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
          pill: 'bg-red-500 dark:bg-red-600'
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800/30',
          text: 'text-amber-800 dark:text-amber-300',
          icon: 'text-amber-500 dark:text-amber-400',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
          pill: 'bg-amber-500 dark:bg-amber-600'
        };
      case 'low':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800/30',
          text: 'text-blue-800 dark:text-blue-300',
          icon: 'text-blue-500 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
          pill: 'bg-blue-500 dark:bg-blue-600'
        };
    }
  };
  
  // Get selected interaction
  const selectedInteractionDetails = selectedInteraction 
    ? medicationInteractions.find((_, index) => index.toString() === selectedInteraction) 
    : null;
  
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
                Medication Interactions
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Understand potential interactions between your medications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/patient/prescriptions"
                className="inline-flex items-center px-4 py-2 border-2 border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Prescriptions
              </Link>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active Medications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="mr-2">💊</span>
                Your Medications ({activeMedications.length})
              </h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-200"
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-full border-2 mr-3",
                          medication.color === 'blue' ? "bg-blue-100 border-blue-400 text-blue-800" : 
                          medication.color === 'green' ? "bg-green-100 border-green-400 text-green-800" :
                          medication.color === 'purple' ? "bg-purple-100 border-purple-400 text-purple-800" :
                          medication.color === 'teal' ? "bg-teal-100 border-teal-400 text-teal-800" :
                          "bg-gray-100 border-gray-400 text-gray-800"
                        )}>
                          <span className="text-sm font-bold">
                            {medication.type === 'tablet' ? 'TAB' : 
                             medication.type === 'capsule' ? 'CAP' : 
                             medication.type === 'liquid' ? 'LIQ' : 
                             medication.type === 'inhaler' ? 'INH' : 
                             medication.type.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-900 dark:text-white">{medication.name} {medication.dosage}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{medication.genericName}</p>
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {medication.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <Link
                  href="/patient/prescriptions"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline"
                >
                  Manage your medications
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Interactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <span className="mr-2">⚠️</span>
                  Medication Interactions
                </h2>
                <div className="flex items-center">
                  <span className="inline-flex items-center mr-3">
                    <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">High</span>
                  </span>
                  <span className="inline-flex items-center mr-3">
                    <span className="h-3 w-3 rounded-full bg-amber-500 mr-1"></span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Moderate</span>
                  </span>
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">Low</span>
                  </span>
                </div>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : medicationInteractions.length === 0 ? (
                <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mb-3">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mb-2">No Interactions Found</h3>
                  <p className="text-green-700 dark:text-green-400 max-w-md mx-auto">
                    There are no known interactions between your current medications. Always consult your healthcare provider before starting new medications.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicationInteractions.map((interaction, index) => {
                    const colors = getSeverityClasses(interaction.severity);
                    const medicationNames = getMedicationNames(interaction.medications);
                    
                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                          selectedInteraction === index.toString()
                            ? `${colors.border} ${colors.bg}`
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        )}
                        onClick={() => setSelectedInteraction(index.toString())}
                      >
                        <div className="flex items-start">
                          <div className={`min-w-[24px] h-6 w-6 rounded-full ${colors.pill} flex items-center justify-center mr-3`}>
                            <span className="text-white text-xs font-bold">
                              {interaction.severity === 'high' ? '!' : 
                               interaction.severity === 'moderate' ? '!' : 'i'}
                            </span>
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center mb-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.badge} mr-2`}>
                                {interaction.severity === 'high' ? 'High Risk' : 
                                 interaction.severity === 'moderate' ? 'Moderate Risk' : 'Low Risk'}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Between: {medicationNames.join(' and ')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{interaction.description}</p>
                            {selectedInteraction === index.toString() && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Recommendation:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{interaction.recommendation}</p>
                                {interaction.details && (
                                  <>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">Details:</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{interaction.details}</p>
                                  </>
                                )}
                                {interaction.sources && interaction.sources.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sources:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {interaction.sources.map((source, idx) => (
                                        <a
                                          key={idx}
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-teal-600 dark:text-teal-400 hover:underline bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded"
                                        >
                                          {source.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-2">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={cn(
                                "h-5 w-5 transition-transform",
                                selectedInteraction === index.toString() ? "rotate-180 text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                              )}
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Food Interactions Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setFoodInteractionsVisible(!foodInteractionsVisible)}
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <span className="mr-2">🍎</span>
                  Food Interactions
                </h2>
                <button className="text-gray-500 dark:text-gray-400">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={cn(
                      "h-5 w-5 transition-transform",
                      foodInteractionsVisible ? "rotate-180" : ""
                    )}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
              
              <AnimatePresence>
                {foodInteractionsVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Atorvastatin (Lipitor) - Grapefruit</h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                              <p>Grapefruit and grapefruit juice can increase the level of Atorvastatin in your blood, which may increase the risk of side effects including muscle breakdown.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Metformin - Alcohol</h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                              <p>Drinking alcohol while taking Metformin may increase the risk of low blood sugar (hypoglycemia) and lactic acidosis, a rare but serious side effect.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                        Consult your healthcare provider or pharmacist for complete information about food and drink interactions with your medications.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-5">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
              <line x1="12" y1="8" x2="12" y2="12"></line>
            </svg>
            <div>
              <h3 className="text-base font-medium text-blue-800 dark:text-blue-300 mb-1">Important Information</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                This information is provided as a reference and is not a substitute for professional medical advice. 
                The interactions displayed may not be comprehensive. Always consult with your healthcare provider or 
                pharmacist before making any changes to your medication regimen.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 