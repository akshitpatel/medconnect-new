'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';
import { Tabs } from '@/app/components/ui/Tabs';
import { 
  Calendar, 
  Syringe, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  Shield,
  Activity,
  Heart
} from 'lucide-react';

interface ScreeningRecommendation {
  id: string;
  name: string;
  frequency: string;
  lastDate?: string;
  nextDue?: string;
  status: 'up-to-date' | 'due-soon' | 'overdue' | 'not-started';
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  ageRange: string;
  genderSpecific?: 'male' | 'female' | 'all';
}

interface Vaccination {
  id: string;
  name: string;
  lastDate?: string;
  nextDue?: string;
  status: 'up-to-date' | 'due-soon' | 'overdue' | 'not-started';
  description: string;
  doses: number;
  dosesReceived: number;
}

interface RiskAssessment {
  id: string;
  name: string;
  lastCompleted?: string;
  status: 'complete' | 'incomplete' | 'not-started';
  result?: 'low' | 'medium' | 'high';
  description: string;
  recommendedFrequency: string;
}

export default function PreventiveCarePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('screenings');
  const [userAge] = useState(42);
  const [userGender] = useState<'male' | 'female'>('male');
  
  // Mock data for screenings based on age and gender
  const [screenings, setScreenings] = useState<ScreeningRecommendation[]>([
    {
      id: '1',
      name: 'Blood Pressure Check',
      frequency: 'Annual',
      lastDate: '2022-11-15',
      nextDue: '2023-11-15',
      status: 'up-to-date',
      description: 'Regular blood pressure checks help detect hypertension which can lead to heart disease and stroke.',
      riskLevel: 'low',
      ageRange: '18+',
      genderSpecific: 'all'
    },
    {
      id: '2',
      name: 'Cholesterol Screening',
      frequency: 'Every 5 years',
      lastDate: '2019-05-20',
      nextDue: '2024-05-20',
      status: 'up-to-date',
      description: 'Monitors cholesterol levels to assess risk of heart disease.',
      riskLevel: 'medium',
      ageRange: '20+',
      genderSpecific: 'all'
    },
    {
      id: '3',
      name: 'Colorectal Cancer Screening',
      frequency: 'Every 10 years',
      status: 'due-soon',
      nextDue: '2023-08-10',
      description: 'Colonoscopy to detect polyps and early signs of colorectal cancer.',
      riskLevel: 'medium',
      ageRange: '45-75',
      genderSpecific: 'all'
    },
    {
      id: '4',
      name: 'Prostate Cancer Screening',
      frequency: 'Discuss with doctor',
      status: 'not-started',
      description: 'PSA test to screen for prostate cancer in men.',
      riskLevel: 'medium',
      ageRange: '40-70',
      genderSpecific: 'male'
    },
    {
      id: '5',
      name: 'Type 2 Diabetes Screening',
      frequency: 'Every 3 years',
      lastDate: '2021-03-12',
      nextDue: '2024-03-12',
      status: 'up-to-date',
      description: 'Blood tests to check for diabetes or prediabetes.',
      riskLevel: 'medium',
      ageRange: '40+',
      genderSpecific: 'all'
    },
    {
      id: '6',
      name: 'Skin Cancer Screening',
      frequency: 'Annual',
      status: 'overdue',
      nextDue: '2023-01-15',
      description: 'Full body examination to check for suspicious moles or skin lesions.',
      riskLevel: 'medium',
      ageRange: '20+',
      genderSpecific: 'all'
    }
  ]);

  // Mock data for vaccinations
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: '1',
      name: 'Influenza (Flu)',
      lastDate: '2022-10-05',
      nextDue: '2023-10-05',
      status: 'up-to-date',
      description: 'Annual vaccination to protect against seasonal influenza.',
      doses: 1,
      dosesReceived: 1
    },
    {
      id: '2',
      name: 'Tetanus, Diphtheria, Pertussis (Tdap)',
      lastDate: '2018-06-30',
      nextDue: '2028-06-30',
      status: 'up-to-date',
      description: 'Protects against tetanus, diphtheria, and pertussis (whooping cough).',
      doses: 1,
      dosesReceived: 1
    },
    {
      id: '3',
      name: 'Shingles (Shingrix)',
      status: 'due-soon',
      nextDue: '2023-07-01',
      description: 'Recommended for adults 50 years and older to prevent shingles.',
      doses: 2,
      dosesReceived: 0
    },
    {
      id: '4',
      name: 'COVID-19',
      lastDate: '2022-12-15',
      status: 'up-to-date',
      description: 'Protects against COVID-19 virus.',
      doses: 3,
      dosesReceived: 3
    },
    {
      id: '5',
      name: 'Pneumococcal (PPSV23)',
      status: 'not-started',
      description: 'Recommended for adults 65 years and older to prevent pneumonia.',
      doses: 1,
      dosesReceived: 0
    }
  ]);

  // Mock data for risk assessments
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([
    {
      id: '1',
      name: 'Heart Disease Risk Assessment',
      lastCompleted: '2022-05-10',
      status: 'complete',
      result: 'low',
      description: 'Evaluates your risk factors for developing heart disease.',
      recommendedFrequency: 'Annual'
    },
    {
      id: '2',
      name: 'Diabetes Risk Assessment',
      status: 'not-started',
      description: 'Identifies your risk for developing type 2 diabetes.',
      recommendedFrequency: 'Annual'
    },
    {
      id: '3',
      name: 'Depression Screening',
      lastCompleted: '2023-02-15',
      status: 'complete',
      result: 'low',
      description: 'Screens for signs of depression and anxiety.',
      recommendedFrequency: 'Annual'
    },
    {
      id: '4',
      name: 'Fall Risk Assessment',
      status: 'not-started',
      description: 'Evaluates your risk of falls, especially important for older adults.',
      recommendedFrequency: 'Annual for 65+'
    }
  ]);

  // Filter screenings based on age and gender
  const filteredScreenings = screenings.filter(screening => {
    // Parse age range
    const [minAge, maxAge] = screening.ageRange.replace('+', '-120').split('-').map(Number);
    const ageMatch = userAge >= minAge && userAge <= maxAge;
    
    // Check gender specificity
    const genderMatch = screening.genderSpecific === 'all' || screening.genderSpecific === userGender;
    
    return ageMatch && genderMatch;
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up-to-date': return 'text-green-500';
      case 'due-soon': return 'text-yellow-500';
      case 'overdue': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up-to-date': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'due-soon': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="h-5 w-5 text-green-500" />;
      case 'medium': return <Activity className="h-5 w-5 text-yellow-500" />;
      case 'high': return <Heart className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-400" />;
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
                  Preventive Care
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Stay ahead of health issues with personalized recommendations
                </p>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center px-4 py-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Next Appointment</p>
                    <p className="font-medium">June 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              tabs={[
                { id: 'screenings', label: 'Screenings' },
                { id: 'vaccinations', label: 'Vaccinations' },
                { id: 'assessments', label: 'Risk Assessments' }
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </CardContent>
        </Card>

        {activeTab === 'screenings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recommended Screenings
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                    Based on your age and gender
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredScreenings.map((screening) => (
                      <div 
                        key={screening.id} 
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start mb-2 md:mb-0">
                            {getStatusIcon(screening.status)}
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {screening.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {screening.description}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                                  Frequency: {screening.frequency}
                                </span>
                                {screening.lastDate && (
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Last: {new Date(screening.lastDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              {getRiskIcon(screening.riskLevel)}
                              <span className="ml-1 text-sm font-medium capitalize">
                                {screening.riskLevel} risk
                              </span>
                            </div>
                            <button className="inline-flex items-center px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                              Schedule
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                        {screening.status !== 'up-to-date' && screening.nextDue && (
                          <div className={`mt-2 text-sm ${getStatusColor(screening.status)}`}>
                            {screening.status === 'overdue' ? 'Overdue since' : 'Due'}: {new Date(screening.nextDue).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'vaccinations' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Vaccination History & Recommendations
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <Syringe className="h-4 w-4 mr-1" />
                    Stay Protected
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vaccinations.map((vaccination) => (
                      <div 
                        key={vaccination.id} 
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start mb-2 md:mb-0">
                            {getStatusIcon(vaccination.status)}
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {vaccination.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {vaccination.description}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {vaccination.dosesReceived} of {vaccination.doses} doses
                                </span>
                                {vaccination.lastDate && (
                                  <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Last dose: {new Date(vaccination.lastDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            {vaccination.status !== 'up-to-date' && (
                              <button className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                                Schedule
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </button>
                            )}
                          </div>
                        </div>
                        {vaccination.status !== 'up-to-date' && vaccination.nextDue && (
                          <div className={`mt-2 text-sm ${getStatusColor(vaccination.status)}`}>
                            {vaccination.status === 'overdue' ? 'Overdue since' : 'Due'}: {new Date(vaccination.nextDue).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'assessments' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Health Risk Assessments
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Identify risks early
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {riskAssessments.map((assessment) => (
                      <div 
                        key={assessment.id} 
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start mb-2 md:mb-0">
                            {assessment.status === 'complete' 
                              ? <CheckCircle className="h-5 w-5 text-green-500" />
                              : <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            }
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {assessment.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {assessment.description}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                                  Recommended: {assessment.recommendedFrequency}
                                </span>
                                {assessment.lastCompleted && (
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Last completed: {new Date(assessment.lastCompleted).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {assessment.result && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                assessment.result === 'low' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : assessment.result === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {assessment.result} risk
                              </span>
                            )}
                            <button className="inline-flex items-center px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                              {assessment.status === 'complete' ? 'View Results' : 'Take Assessment'}
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Preventive Care Timeline
            </h2>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 inset-y-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-6">
                {[...vaccinations, ...filteredScreenings]
                  .filter(item => item.nextDue)
                  .sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime())
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        {'doses' in item ? <Syringe className="h-4 w-4 text-teal-500" /> : <Calendar className="h-4 w-4 text-teal-500" />}
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {'doses' in item ? 'Vaccination' : 'Screening'}
                            </p>
                          </div>
                          <div className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {new Date(item.nextDue!).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
} 