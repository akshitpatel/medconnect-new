'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { patientAPI } from '@/app/services/api';
import CalendarDatePicker from './CalendarDatePicker';
import TimeSlotPicker from './TimeSlotPicker';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/app/contexts/AuthContext';

interface Provider {
  id: string;
  full_name: string;
  email?: string;
  specialization?: string;
}

interface TimeSlot {
  start_time: string;
  end_time: string;
  formatted_time: string;
}

interface AppointmentBookingFormProps {
  providers: Provider[];
  selectedProvider?: Provider | null;
  onProviderChange?: (provider: Provider | null) => void;
  onBookingComplete?: (appointmentId: string) => void;
  className?: string;
}

export default function AppointmentBookingForm({
  providers,
  selectedProvider = null,
  onProviderChange,
  onBookingComplete,
  className = ''
}: AppointmentBookingFormProps) {
  const { user } = useAuth();
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(selectedProvider);
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1)); // Default to tomorrow
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<string>('in-person');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [appointmentNotes, setAppointmentNotes] = useState<string>('');
  
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle provider change
  useEffect(() => {
    if (selectedProvider && (!currentProvider || currentProvider.id !== selectedProvider.id)) {
      setCurrentProvider(selectedProvider);
      // Reset slot selection when provider changes
      setSelectedSlot(null);
      fetchAvailableSlots(selectedProvider.id, selectedDate);
    }
  }, [selectedProvider]);

  // Fetch available slots when provider or date changes
  useEffect(() => {
    if (currentProvider) {
      fetchAvailableSlots(currentProvider.id, selectedDate);
    }
  }, [currentProvider, selectedDate]);

  // Fetch available appointment slots
  const fetchAvailableSlots = async (providerId: string, date: Date) => {
    if (!providerId) return;
    
    setIsLoadingSlots(true);
    setError(null);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await patientAPI.getProviderAvailableSlots(providerId, formattedDate);
      
      if (response.data?.success) {
        setAvailableSlots(response.data.data.available_slots || []);
      } else {
        setAvailableSlots([]);
        setError('Could not load available slots. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setAvailableSlots([]);
      setError('Failed to load available time slots. Please try again later.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProvider || !selectedSlot) {
      setError('Please select a provider and appointment time');
      return;
    }
    
    if (!appointmentReason.trim()) {
      setError('Please provide a reason for your appointment');
      return;
    }
    
    setIsBooking(true);
    setError(null);
    
    try {
      // Parse the selected slot time
      const appointmentDateTime = selectedSlot.start_time;
      
      // Create appointment data
      const appointmentData = {
        provider_id: currentProvider.id,
        appointment_datetime: appointmentDateTime,
        duration_minutes: 30, // Default duration
        appointment_type: appointmentType,
        reason: appointmentReason,
        notes: appointmentNotes || undefined
      };
      
      // Submit the appointment request
      const response = await patientAPI.createAppointment(appointmentData);
      
      if (response.data?.success) {
        setSuccess(true);
        // Reset form
        setSelectedSlot(null);
        setAppointmentReason('');
        setAppointmentNotes('');
        
        // Callback for parent component
        if (onBookingComplete && response.data.data.appointment?.id) {
          onBookingComplete(response.data.data.appointment.id);
        }
      } else {
        setError(response.data?.errors?.[0] || 'Failed to book appointment. Please try again.');
      }
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.errors?.[0] || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsBooking(false);
    }
  };

  // Handle provider selection
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const providerId = e.target.value;
    const provider = providers.find(p => p.id === providerId) || null;
    
    setCurrentProvider(provider);
    if (onProviderChange) {
      onProviderChange(provider);
    }
    
    // Reset slot selection
    setSelectedSlot(null);
  };

  return (
    <div className={`appointment-booking-form ${className}`}>
      {success ? (
        <div className="text-center py-8 px-4 border border-green-200 dark:border-green-900 rounded-lg bg-green-50 dark:bg-green-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Appointment Booked!</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => setSuccess(false)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Book Another Appointment
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Provider
              </label>
              <select
                id="provider"
                value={currentProvider?.id || ''}
                onChange={handleProviderChange}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">-- Select a healthcare provider --</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.full_name}{provider.specialization ? ` - ${provider.specialization}` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Date
                </h3>
                <CalendarDatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  minDate={addDays(new Date(), 1)} // Can't book same day
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Time
                </h3>
                <TimeSlotPicker
                  timeSlots={availableSlots}
                  selectedSlot={selectedSlot}
                  onSelectTimeSlot={setSelectedSlot}
                  isLoading={isLoadingSlots}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Appointment Type
              </label>
              <select
                id="appointmentType"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="in-person">In-Person Visit</option>
                <option value="video">Video Consultation</option>
                <option value="phone">Phone Consultation</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                rows={3}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Briefly describe the reason for your appointment"
                required
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Additional Notes <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                rows={2}
                className="block w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Any additional information or special requests"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isBooking || !currentProvider || !selectedSlot || !appointmentReason.trim()}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-200/50 dark:shadow-teal-900/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-xl px-6 py-3 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isBooking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </>
              ) : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
