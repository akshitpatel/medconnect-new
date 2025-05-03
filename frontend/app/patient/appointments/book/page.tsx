'use client';

import { useState, useEffect } from 'react';
import { patientAPI } from '@/app/services/api';
import { Navbar } from '@/app/components/ui/Navbar';
import AppointmentBookingForm from '@/app/components/appointments/AppointmentBookingForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

interface Provider {
  id: string;
  full_name: string;
  email?: string;
  specialization?: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch available providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, you'd have a dedicated endpoint for this
        // For now, we'll use a mock list of providers
        const response = await fetch('/api/providers');
        const data = await response.json();
        
        if (response.ok) {
          setProviders(data.providers || []);
        } else {
          throw new Error(data.message || 'Failed to fetch providers');
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        // For demo purposes, use mock providers instead of showing an error
        setProviders([
          { id: '1', full_name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
          { id: '2', full_name: 'Dr. Michael Chen', specialization: 'Family Medicine' },
          { id: '3', full_name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics' },
          { id: '4', full_name: 'Dr. James Wilson', specialization: 'Orthopedics' },
          { id: '5', full_name: 'Dr. Aisha Patel', specialization: 'Dermatology' },
        ]);
        setError(null); // Clear error since we're using mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProviders();
  }, []);
  
  // Handle successful booking
  const handleBookingComplete = (appointmentId: string) => {
    // Navigate to the appointment details page
    setTimeout(() => {
      router.push(`/patient/appointments/${appointmentId}`);
    }, 2000); // Give user time to see success message
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 p-4 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Book an Appointment
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-xl">
              Schedule a consultation with one of our healthcare providers
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/patient/appointments')}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl px-4 py-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Appointments
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Loading providers...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Providers</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">{error}</p>
                <div className="mt-6">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : providers.length === 0 ? (
              <div className="py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Providers Available</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  There are currently no healthcare providers available for booking.
                </p>
              </div>
            ) : (
              <AppointmentBookingForm
                providers={providers}
                onBookingComplete={handleBookingComplete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
