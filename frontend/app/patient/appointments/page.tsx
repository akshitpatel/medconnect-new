'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, addMonths, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/button';
import { Navbar } from '@/app/components/ui/Navbar';
import { patientAPI } from '@/app/services/api'; // Import the API module

// DEBUG: Log when the appointment page module is loaded
console.log('[APPOINTMENTS DEBUG] patient/appointments/page.tsx loaded');

// Define interfaces matching the backend serializer
interface Provider {
  id: string;
  full_name: string;
  email: string;
  // Specialization comes from ProviderProfile, fetch separately or add to serializer
}

interface Appointment {
  id: string;
  provider: Provider; // Nested provider object
  appointment_datetime: string; // Use backend field name
  duration_minutes: number; // Use backend field name
  status: string; // Backend status (e.g., 'scheduled') - map later if needed
  appointment_type: string; // Use backend field name
  reason?: string; // Optional
  notes?: string; // Optional
  created_at: string;
  updated_at: string;
  location?: string; // Keep if needed, but not directly from backend model yet
}

// Mock data removed - will fetch real data

// Function to format appointment time (adjust field names)
const formatAppointmentTime = (dateTime: string, duration: number) => {
  const date = parseISO(dateTime); // Already handles ISO string
  const startTime = format(date, 'h:mm a');
  const endTime = format(new Date(date.getTime() + duration * 60000), 'h:mm a');
  return `${startTime} - ${endTime}`;
};

// Function to get the status color (adapt status values if backend differs)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'canceled': // Ensure backend uses this or map it
    case 'cancelled_by_patient':
    case 'cancelled_by_provider':
      return 'bg-red-100 text-red-800';
    case 'no-show': // Ensure backend uses this or map it
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Function to get the appointment type icon (adapt type values if backend differs)
const getAppointmentTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) { // Handle potential case differences
    case 'in-person':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      );
    case 'video':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    case 'phone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State for fetched data

  useEffect(() => {
    console.log('[APPOINTMENTS DEBUG] Appointments state updated:', appointments);
  }, [appointments]);

  const [loading, setLoading] = useState(true); // Keep loading state
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    if (error) {
      console.error('[APPOINTMENTS DEBUG] Error state set:', error);
    }
  }, [error]);

  const [activeAppointment, setActiveAppointment] = useState<string | null>(null);
  const [showCalendarView, setShowCalendarView] = useState(false);

  // Fetch appointments on mount
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      setError(null);
      console.log('[APPOINTMENTS DEBUG] Fetching patient appointments...');
      try {
        const response = await patientAPI.getAppointments();
        console.log('[APPOINTMENTS DEBUG] Appointments API response:', response.data);
        const data = response.data?.data?.appointments || [];
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointments');
        console.error('[APPOINTMENTS DEBUG] Error fetching appointments:', err);
      } finally {
        setLoading(false);
        console.log('[APPOINTMENTS DEBUG] Loading state set to false');
      }
    };

    loadAppointments();
  }, []); // Empty dependency array means run once on mount

  // Filter appointments based on selected filter
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.appointment_datetime);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only

    // Backend status might need mapping here if different from frontend values
    const isActive = !['cancelled_by_patient', 'cancelled_by_provider', 'completed', 'no_show'].includes(appointment.status);
    const isPast = appointmentDate < today;

    if (filter === 'upcoming') {
      return isActive && !isPast;
    } else if (filter === 'past') {
      return !isActive || isPast;
    }
    return true; // filter === 'all'
  });

  // Further filter by selected month
  const monthFilteredAppointments = filteredAppointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.appointment_datetime);
    return isSameMonth(appointmentDate, selectedMonth);
  });

  // Group appointments by date
  const groupedAppointments: { [date: string]: Appointment[] } = {};
  monthFilteredAppointments.forEach(appointment => {
    const dateKey = format(parseISO(appointment.appointment_datetime), 'yyyy-MM-dd');
    if (!groupedAppointments[dateKey]) {
      groupedAppointments[dateKey] = [];
    }
    groupedAppointments[dateKey].push(appointment);
  });

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedAppointments).sort((a, b) => {
    return parseISO(a).getTime() - parseISO(b).getTime();
  });

  // Updated status color function (adapt if backend status differs)
  const getModernStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'bg-teal-50 dark:bg-teal-900/30',
          text: 'text-teal-700 dark:text-teal-300',
          border: 'border-teal-200 dark:border-teal-800',
          icon: 'text-teal-500'
        };
      case 'completed':
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800',
          icon: 'text-green-500'
        };
      case 'canceled':
      case 'cancelled_by_patient':
      case 'cancelled_by_provider':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-500'
        };
      case 'no-show':
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-500'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-800',
          icon: 'text-gray-500'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-teal-200/20 dark:bg-teal-900/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-blue-200/10 dark:bg-blue-900/10 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Appointments
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
              Manage your upcoming and past appointments with healthcare providers
            </p>
          </div>

          <div className="self-end md:self-auto">
            <Button 
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-200/50 dark:shadow-teal-900/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-xl px-6"
            >
              <span className="relative flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </span>
                Schedule Appointment
              </span>
            </Button>
          </div>
        </div>

        {/* View Toggles and Filters */}
        <div className="mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl shadow-sm border border-white/20 dark:border-gray-700/30 p-4">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            {/* View toggle buttons */}
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center">
                <button
                  className={`p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    !showCalendarView
                      ? "bg-white dark:bg-gray-800 shadow-sm text-teal-700 dark:text-teal-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300"
                  }`}
                  onClick={() => setShowCalendarView(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span className="sr-only">List View</span>
                </button>
                <button
                  className={`p-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    showCalendarView
                      ? "bg-white dark:bg-gray-800 shadow-sm text-teal-700 dark:text-teal-300"
                      : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300"
                  }`}
                  onClick={() => setShowCalendarView(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="sr-only">Calendar View</span>
                </button>
              </div>

              {/* Filter buttons */}
              <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${filter === 'upcoming' ? 'bg-white dark:bg-gray-800 shadow-sm text-teal-700 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300'}`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${filter === 'past' ? 'bg-white dark:bg-gray-800 shadow-sm text-teal-700 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300'}`}
                  onClick={() => setFilter('past')}
                >
                  Past
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${filter === 'all' ? 'bg-white dark:bg-gray-800 shadow-sm text-teal-700 dark:text-teal-300' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-300'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
              </div>
            </div>

            {/* Month selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button 
                className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 text-gray-600 dark:text-gray-300"
                onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <span className="text-gray-700 dark:text-gray-200 font-medium px-2 py-1">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
              <button 
                className="p-2 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 text-gray-600 dark:text-gray-300"
                onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {sortedDates.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className={`w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-8 text-center transition-all duration-500 ${loading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
              <div className="mx-auto w-20 h-20 bg-teal-50 dark:bg-teal-900/40 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-500 dark:text-teal-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No appointments found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                {filter === 'upcoming' 
                  ? "You don't have any upcoming appointments scheduled for this period." 
                  : filter === 'past' 
                    ? "You don't have any past appointments for the selected time frame." 
                    : "You don't have any appointments for this month."}
              </p>
              <Button 
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-200/30 dark:shadow-teal-900/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-xl"
              >
                Schedule New Appointment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((dateKey, dateIndex) => (
              <div 
                key={dateKey}
                className={`transition-all duration-500 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
                style={{ transitionDelay: `${dateIndex * 100}ms` }}
              >
                <div className="mb-4 flex items-center">
                  <div className="flex items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-full shadow-sm px-4 py-2 border border-white/20 dark:border-gray-700/30">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center mr-3">
                      <span className="text-teal-600 dark:text-teal-300 font-bold">
                        {format(parseISO(dateKey), 'd')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
                      </h2>
                    </div>
                    {isSameDay(parseISO(dateKey), new Date()) && (
                      <span className="ml-2 text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 py-0.5 px-3 rounded-full">Today</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {groupedAppointments[dateKey].map((appointment, apptIndex) => {
                    const statusColors = getModernStatusColor(appointment.status);
                    return (
                      <div 
                        key={appointment.id}
                        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                          activeAppointment === appointment.id ? 'ring-2 ring-teal-300 dark:ring-teal-700' : ''
                        }`}
                        onMouseEnter={() => setActiveAppointment(appointment.id)}
                        onMouseLeave={() => setActiveAppointment(null)}
                        style={{ 
                          transitionDelay: `${(apptIndex * 50)}ms`,
                          opacity: loading ? 0 : 1,
                          transform: loading ? 'translateY(20px)' : 'translateY(0)'
                        }}
                      >
                        {/* Status indicator line at top */}
                        <div className={`h-1 ${statusColors.bg} ${statusColors.border} w-full`}></div>
                        
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-grow">
                              {/* Doctor/Provider Information */}
                              <div className="flex items-start">
                                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mr-4 text-teal-600 dark:text-teal-300 font-medium text-lg">
                                  {appointment.provider?.full_name?.split(' ').map(name => name[0]).join('') || ''}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                      {appointment.provider?.full_name || 'N/A'}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                                      {appointment.status.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {/* TODO: Fetch/display specialization from provider profile */}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Appointment Details */}
                              <div className="mt-4 ml-16 space-y-2">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mr-2 ${statusColors.icon}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium">{formatAppointmentTime(appointment.appointment_datetime, appointment.duration_minutes)}</span>
                                  <span className="ml-2 text-gray-500 dark:text-gray-400">({appointment.duration_minutes} min)</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  <span className={`mr-2 ${statusColors.icon}`}>{getAppointmentTypeIcon(appointment.appointment_type)}</span>
                                  <span className="font-medium">
                                    {appointment.appointment_type === 'in-person' ? 'In-person visit' : appointment.appointment_type === 'video' ? 'Video call' : 'Phone call'}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                  {appointment.location && appointment.appointment_type === 'in-person' && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      <strong className="font-medium">Location:</strong> {appointment.location}
                                    </p>
                                  )}
                                </div>
                                {appointment.notes && (
                                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                    <div>
                                      <p className="font-medium text-gray-700 dark:text-gray-200">Notes:</p>
                                      <p>{appointment.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4 lg:mt-0 justify-end">
                              {appointment.status === 'scheduled' && (
                                <>
                                  {appointment.appointment_type === 'video' && (
                                    <Button 
                                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-xl"
                                    >
                                      Join Call
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:border-teal-300 dark:hover:border-teal-700 rounded-xl"
                                  >
                                    Reschedule
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 rounded-xl"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'completed' && (
                                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-xl">
                                  View Summary
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 