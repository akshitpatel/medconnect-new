'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/app/contexts/ThemeContext';
import { cn } from '@/app/lib/utils';
import DefaultLayout from '@/app/components/DefaultLayout';
import { Card } from '@/app/components/ui/Card';
import { AnimatedContainer } from '@/app/components/ui/AnimatedContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { FlippableHealthCard } from '@/app/components/ui/FlippableHealthCard';
import Logo from '@/app/components/Logo';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BellIcon, 
  CreditCardIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  PillIcon, 
  ClipboardIcon, 
  MessageSquareIcon,
  ActivityIcon,
  HeartIcon,
  Users2Icon,
  SearchIcon,
  AlertCircleIcon
} from 'lucide-react';
import ProfileAvatar from '@/app/components/ui/ProfileAvatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { patientAPI } from '@/app/services/api';

// Dashboard Stats with practical health tracking focus
const dashboardStats = [
  {
    label: 'Steps Today',
    value: '8,527',
    icon: <ActivityIcon className="h-5 w-5" />,
    trend: 'increasing',
    percent: '+12%',
    description: '1,473 steps to goal'
  },
  {
    label: 'Appointments',
    value: '3',
    icon: <CalendarIcon className="h-5 w-5" />,
    trend: 'upcoming',
    percent: 'Next: Mar 25',
    description: 'Dr. Wilson at 10:30 AM'
  },
  {
    label: 'Medications',
    value: '4',
    icon: <PillIcon className="h-5 w-5" />,
    trend: 'stable',
    percent: '2 today',
    description: 'Next: Lisinopril at 8 PM'
  },
  {
    label: 'Adherence',
    value: '88%',
    icon: <HeartIcon className="h-5 w-5" />,
    trend: 'increasing',
    percent: '+5%',
    description: 'Overall treatment adherence'
  },
  {
    label: 'Messages',
    value: '5',
    icon: <MessageSquareIcon className="h-5 w-5" />,
    trend: 'increasing',
    percent: '+40%',
    description: '2 unread from Dr. Chen'
  },
  {
    label: 'Insurance',
    value: '3',
    icon: <CreditCardIcon className="h-5 w-5" />,
    trend: 'stable',
    percent: '$295',
    description: 'Pending bills due soon'
  }
];

// Enhanced AI Health Insights focusing on practical data
const sampleInsights = [
  {
    id: '1',
    title: 'Appointment Reminder',
    description: 'Your annual check-up is due in 2 weeks. Would you like me to help schedule it?',
    actionUrl: '/patient/appointments/schedule',
    actionText: 'Schedule Now',
    priority: 'medium',
    aiGenerated: true,
    trend: 'upcoming',
    confidence: 100,
    icon: <CalendarIcon className="h-5 w-5" />
  },
  {
    id: '2',
    title: 'Prescription Renewal',
    description: 'Your Lisinopril prescription will need renewal in 10 days. I can help coordinate with Dr. Wilson.',
    actionUrl: '/patient/prescriptions/renew',
    actionText: 'Renew Prescription',
    priority: 'high',
    aiGenerated: true,
    trend: 'urgent',
    confidence: 100,
    icon: <PillIcon className="h-5 w-5" />
  },
  {
    id: '3',
    title: 'Step Goal Achievement',
    description: 'You\'ve been consistently meeting your daily step goal of 10,000 steps. Great job maintaining your activity level!',
    actionUrl: '/patient/activity',
    actionText: 'View Activity History',
    priority: 'low',
    aiGenerated: true,
    trend: 'improving',
    confidence: 95,
    icon: <ActivityIcon className="h-5 w-5" />
  },
  {
    id: '4',
    title: 'Blood Pressure Update',
    description: 'Your blood pressure readings over the past month show improvement. Continue with your current treatment plan.',
    actionUrl: '/patient/vitals',
    actionText: 'View Vitals',
    priority: 'medium',
    aiGenerated: true,
    trend: 'improving',
    confidence: 89,
    icon: <HeartIcon className="h-5 w-5" />
  },
  {
    id: '5',
    title: 'Medication Effectiveness',
    description: 'Based on your reported symptoms, your current medications appear to be effective in managing your conditions.',
    actionUrl: '/patient/medications',
    actionText: 'Review Medications',
    priority: 'medium',
    aiGenerated: true,
    trend: 'stable',
    confidence: 92,
    icon: <PillIcon className="h-5 w-5" />
  }
];

// Quick actions for the dashboard
const quickActions = [
  { 
    name: 'Schedule Appointment', 
    href: '/patient/appointments/schedule', 
    icon: <CalendarIcon className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    name: 'Message Provider', 
    href: '/patient/messages/new', 
    icon: <MessageSquareIcon className="h-5 w-5" />,
    color: 'bg-indigo-100 text-indigo-600'
  },
  { 
    name: 'Medication Refill', 
    href: '/patient/prescriptions/refill', 
    icon: <PillIcon className="h-5 w-5" />,
    color: 'bg-amber-100 text-amber-600'
  },
  { 
    name: 'Find Care', 
    href: '/patient/find-care', 
    icon: <SearchIcon className="h-5 w-5" />,
    color: 'bg-emerald-100 text-emerald-600'
  },
  { 
    name: 'Track Adherence', 
    href: '/patient/adherence', 
    icon: <ActivityIcon className="h-5 w-5" />,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    name: 'View Insurance', 
    href: '/patient/insurance', 
    icon: <CreditCardIcon className="h-5 w-5" />,
    color: 'bg-cyan-100 text-cyan-600'
  },
];

// Get trend indicator with improved styling
const getTrendIndicator = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return { icon: <ArrowUpIcon className="h-4 w-4" />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
    case 'decreasing':
      return { icon: <ArrowDownIcon className="h-4 w-4" />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' };
    case 'urgent':
      return { icon: '⚡', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' };
    case 'new':
      return { icon: '✦', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
    case 'upcoming':
      return { icon: '◈', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20' };
    default:
      return { icon: '•', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800' };
  }
};

// Calculate health score based on available data
const calculateHealthScore = (data: {
  hasProfile: boolean;
  hasAppointments: boolean;
  hasMedications: boolean;
  appointmentsCount: number;
  medicationsCount: number;
  hasEmergencyContact: boolean;
  hasAllergies: boolean;
  hasConditions: boolean;
}) => {
  // Base score - everyone starts at 70
  let score = 70;
  
  // Increment score based on completeness and activity
  if (data.hasProfile) score += 5;
  if (data.hasAppointments) score += 5;
  if (data.hasMedications) score += 5;
  if (data.hasEmergencyContact) score += 5;
  if (data.hasAllergies) score += 3;
  if (data.hasConditions) score += 2;
  
  // Additional points for more data
  score += Math.min(data.appointmentsCount * 2, 10); // Up to 10 points for appointments
  score += Math.min(data.medicationsCount, 5); // Up to 5 points for medications
  
  // Cap at 100
  return Math.min(score, 100);
};

// Get priority styling with better visual distinction
const getPriorityStyle = (priority: string, isDark = false) => {
  const style = {
    bg: isDark ? 'bg-gray-800' : 'bg-white',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    text: isDark ? 'text-white' : 'text-gray-900',
    highlight: ''
  };
  
  if (priority === 'high') {
    style.border = isDark ? 'border-teal-700' : 'border-teal-300';
    style.highlight = isDark ? 'from-teal-700/20 to-transparent' : 'from-teal-50 to-transparent';
  } else if (priority === 'medium') {
    style.highlight = isDark ? 'from-blue-700/10 to-transparent' : 'from-blue-50 to-transparent';
  }
  
  return style;
};

// Define interfaces for the data we'll be fetching
interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  bloodType?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  allergies?: string[];
  conditions?: string[];
}

interface Appointment {
  id: string;
  appointment_datetime: string;
  duration_minutes: number;
  status: string;
  appointment_type: string;
  reason: string;
  notes?: string;
  provider: {
    id: string;
    fullName: string;
    specialty?: string;
  };
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date?: string;
  instructions: string;
  prescriber: {
    id: string;
    fullName: string;
  };
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
  conversation: {
    id: string;
    title: string;
  };
}

export default function PatientDashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  // Set the actual patient name
  const patientName = 'Akshit Patel';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const router = useRouter();

  // Fetch patient data from the API
  useEffect(() => {
    // Don't attempt to fetch if user is not authenticated
    if (!user || !user.id) {
      console.warn('User not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data from real API endpoints with individual error handling
        let hasData = false; // Track if we received any data successfully

        // Fetch patient profile
        try {
          console.log('Fetching profile from live API...');
          const profileResponse = await patientAPI.getProfile();
          console.log('Profile response:', profileResponse);
          if (profileResponse?.data?.success) {
            setProfile(profileResponse.data.data.profile);
            hasData = true;
            console.log('Profile data loaded successfully');
          } else {
            console.warn('Profile API returned unsuccessful response', profileResponse);
          }
        } catch (profileErr: any) {
          console.error('Error fetching profile:', profileErr?.response?.status, profileErr?.message);
          // Continue with other requests even if profile fails
        }
        
        // Fetch appointments
        try {
          console.log('Fetching appointments from live API...');
          const appointmentsResponse = await patientAPI.getAppointments();
          if (appointmentsResponse?.data?.success) {
            setAppointments(appointmentsResponse.data.data.appointments || []);
            hasData = true;
            console.log('Appointments data loaded successfully', appointmentsResponse.data.data.appointments);
          } else {
            console.warn('Appointments API returned unsuccessful response');
          }
        } catch (appointmentsErr: any) {
          console.error('Error fetching appointments:', appointmentsErr?.response?.status, appointmentsErr?.message);
          // Continue with other requests
        }
        
        // Fetch medications
        try {
          console.log('Fetching medications from live API...');
          const medicationsResponse = await patientAPI.getMedications();
          if (medicationsResponse?.data?.success) {
            setMedications(medicationsResponse.data.data.medications || []);
            hasData = true;
            console.log('Medications data loaded successfully', medicationsResponse.data.data.medications);
          } else {
            console.warn('Medications API returned unsuccessful response');
          }
        } catch (medicationsErr: any) {
          console.error('Error fetching medications:', medicationsErr?.response?.status, medicationsErr?.message);
          // Continue with other requests
        }
        
        // Fetch messages
        try {
          console.log('Fetching messages from live API...');
          const messagesResponse = await patientAPI.getMessages();
          if (messagesResponse?.data?.success) {
            setMessages(messagesResponse.data.data.messages || messagesResponse.data.data.conversations || []);
            hasData = true;
            console.log('Messages data loaded successfully');
          } else {
            console.warn('Messages API returned unsuccessful response');
          }
        } catch (messagesErr: any) {
          console.error('Error fetching messages:', messagesErr?.response?.status, messagesErr?.message);
          // Continue with other requests
        }
        
        // If we didn't get any data at all, throw an error
        if (!hasData) {
          throw new Error('Unable to load any patient data from the API. Please check your network connection and try again.');
        }
      } catch (err: any) {
        // This is now just a fallback for overall errors
        console.error('Error fetching patient data:', err);
        
        // Check if it's an authentication error
        if (err?.response?.status === 401) {
          console.warn('Authentication error, redirecting to login');
          router.push('/auth/login');
          setError('Your session has expired. Please login again.');
        } else {
          setError(err.message || 'Failed to load patient data. Please refresh the page or try again later.');
        }
      } finally {
        setLoading(false);
        
        // Show AI insights after data is loaded
        const insightTimer = setTimeout(() => {
          setShowAIInsights(true);
        }, 500);
        
        return () => {
          clearTimeout(insightTimer);
        };
      }
    };
    
    fetchPatientData();
  }, [user, router]);

  return (
    <DefaultLayout>
      {/* Welcome Banner with updated professional gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-medical-teal-600 via-medical-teal-500 to-medical-blue-500 p-6 mb-8 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/dots-pattern.svg')]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {patientName}</h1>
              <p className="text-teal-50">Your health dashboard is {loading ? 'updating' : 'up to date'}.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button onClick={() => router.push('/patient/profile')} className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-white backdrop-blur-sm">
                <ProfileAvatar 
                  src={user?.profilePicture || "/images/profile-female.jpg"}
                  alt={patientName} 
                  initials={patientName.charAt(0)}
                  size="sm"
                  className="mr-2 border-2 border-white/50"
                />
                <span>Your Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Stats Overview - Updated styling */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Health Overview</h2>
              <button className="text-medical-blue-500 dark:text-medical-blue-400 hover:text-medical-blue-600 dark:hover:text-medical-blue-300 text-sm font-medium">
                See All
              </button>
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Failed to load dashboard data</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Appointments Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card-soft hover:shadow-card-hover transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center justify-center p-2 bg-medical-blue-50 dark:bg-medical-blue-900/30 text-medical-blue-500 dark:text-medical-blue-400 rounded-lg">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  {!loading && appointments.length > 0 && (
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`}>
                      <span>{new Date(appointments[0].appointment_datetime).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : appointments.length}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Appointments</p>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {loading ? 
                    <Skeleton className="h-3 w-32" /> : 
                    appointments.length > 0 ? 
                      `Next: ${appointments[0].provider.fullName} on ${new Date(appointments[0].appointment_datetime).toLocaleDateString()}` : 
                      'No upcoming appointments'
                  }
                </div>
              </div>
              
              {/* Medications Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card-soft hover:shadow-card-hover transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center justify-center p-2 bg-medical-mint-50 dark:bg-medical-mint-900/30 text-medical-mint-600 dark:text-medical-mint-400 rounded-lg">
                    <PillIcon className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : medications.length}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Active Medications</p>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {loading ? 
                    <Skeleton className="h-3 w-32" /> : 
                    medications.length > 0 ? 
                      `Latest: ${medications[0].name} ${medications[0].dosage}` : 
                      'No active medications'
                  }
                </div>
              </div>
              
              {/* Messages Stat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card-soft hover:shadow-card-hover transition-shadow border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center justify-center p-2 bg-medical-lavender-50 dark:bg-medical-lavender-900/30 text-medical-lavender-600 dark:text-medical-lavender-400 rounded-lg">
                    <MessageSquareIcon className="h-5 w-5" />
                  </span>
                  {!loading && messages.filter(m => !m.read).length > 0 && (
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400`}>
                      <span>{messages.filter(m => !m.read).length} new</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-2xl text-gray-800 dark:text-white mb-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : messages.length}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Messages</p>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {loading ? 
                    <Skeleton className="h-3 w-32" /> : 
                    messages.length > 0 ? 
                      `${messages.filter(m => !m.read).length} unread messages` : 
                      'No recent messages'
                  }
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions - Updated with new colors */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-card-soft hover:shadow-card-hover transition-all border border-gray-100 dark:border-gray-700 hover:border-medical-teal-200 dark:hover:border-medical-teal-700"
                >
                  <span className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${action.color} dark:bg-opacity-20`}>
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                    {action.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Health Activities with enhanced styling */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-card-soft p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activities</h2>
              <button className="text-medical-blue-500 dark:text-medical-blue-400 hover:text-medical-blue-600 dark:hover:text-medical-blue-300 text-sm font-medium">
                See All
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                // Activity skeleton loaders
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                // Actual activity items
                <>
                  {medications.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-medical-mint-100 dark:bg-medical-mint-900/20 text-medical-mint-600 dark:text-medical-mint-400">
                        <PillIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Medication Reminder</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{medications[0].name} {medications[0].dosage} - {medications[0].instructions}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{medications[0].frequency}</p>
                      </div>
                    </div>
                  )}
                  
                  {appointments.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-medical-lavender-100 dark:bg-medical-lavender-900/20 text-medical-lavender-600 dark:text-medical-lavender-400">
                        <CalendarIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">Upcoming Appointment</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{appointments[0].provider.fullName} - {appointments[0].appointment_type}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(appointments[0].appointment_datetime).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {messages.length > 0 && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-medical-blue-100 dark:bg-medical-blue-900/20 text-medical-blue-600 dark:text-medical-blue-400">
                        <MessageSquareIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">New Message</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{messages[0].sender.fullName} - {messages[0].content.substring(0, 30)}...</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(messages[0].created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  {medications.length === 0 && appointments.length === 0 && messages.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">No recent activities to display</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Insights and Health Card */}
        <div className="space-y-6">
          {/* Flippable Health Card */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Health Card</h2>
            <div className="w-full aspect-[1.586/1] max-w-sm mx-auto">
              {loading ? (
                <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-500">Loading health card...</p>
                </div>
              ) : (
                <FlippableHealthCard 
                  patientName={patientName}
                  patientId={'4'}
                  dateOfBirth={'1992-05-30'}
                  // Using real health metrics
                  healthScore={92}
                  bloodType={'O+'}
                  emergencyContact={'Rihal (Bro)'}
                  insuranceProvider={'ICICI Insurance'}
                  policyNumber={'3231231231'}
                  groupNumber={''}
                  allergies={['non', 'heat']}
                  conditions={[]}
                  primaryPhysician={'Dr. Sarah Johnson'}
                  lastCheckup={'March 15, 2025'}
                />
              )}
            </div>
          </div>

          {/* AI Health Insights - Updated with new colors */}
          <section>
            <AnimatePresence>
              {showAIInsights && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Health Insights</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-medical-blue-100 dark:bg-medical-blue-900/30 text-medical-blue-800 dark:text-medical-blue-300">
                      AI-powered
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {sampleInsights.map((insight) => {
                      const priority = getPriorityStyle(insight.priority, isDarkMode);
                      const trend = getTrendIndicator(insight.trend);
                      
                      return (
                        <div
                          key={insight.id}
                          className={`relative border rounded-xl p-4 transition-all cursor-pointer ${
                            selectedInsight === insight.id
                              ? 'bg-medical-teal-50 border-medical-teal-200 dark:bg-medical-teal-900/20 dark:border-medical-teal-700'
                              : `${priority.bg} ${priority.border}`
                          }`}
                          onClick={() => setSelectedInsight(
                            selectedInsight === insight.id ? null : insight.id
                          )}
                        >
                          {priority.highlight && (
                            <div className={`absolute inset-0 bg-gradient-to-r ${priority.highlight} rounded-xl opacity-50`}></div>
                          )}
                          
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center justify-center p-2 ${
                                  selectedInsight === insight.id
                                    ? 'bg-medical-teal-100 text-medical-teal-600 dark:bg-medical-teal-800/30 dark:text-medical-teal-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                } rounded-lg`}>
                                  {insight.icon}
                                </span>
                                <h3 className="font-semibold text-gray-800 dark:text-white">
                                  {insight.title}
                                </h3>
                              </div>
                              
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${trend.bg} ${trend.color}`}>
                                {typeof trend.icon === 'string' ? (
                                  <span>{trend.icon}</span>
                                ) : (
                                  trend.icon
                                )}
                                <span>{insight.trend}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {insight.description}
                            </p>
                            
                            <div className={`flex items-center justify-between ${
                              selectedInsight === insight.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                            } transition-all duration-200`}>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Confidence: {insight.confidence}%
                                </span>
                              </div>
                              
                              <Link
                                href={insight.actionUrl}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-medical-teal-500 hover:bg-medical-teal-600 rounded-lg transition-colors"
                              >
                                {insight.actionText}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
}