'use client';

import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

interface Provider {
  id: string;
  full_name: string;
  email?: string;
}

interface Appointment {
  id: string;
  provider: Provider;
  appointment_datetime: string;
  duration_minutes: number;
  status: string;
  appointment_type: string;
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  showActions?: boolean;
  onCancel?: (appointmentId: string) => void;
  onReschedule?: (appointment: Appointment) => void;
  className?: string;
}

export default function AppointmentCard({
  appointment,
  showActions = true,
  onCancel,
  onReschedule,
  className = ''
}: AppointmentCardProps) {
  const router = useRouter();
  
  const {
    id,
    provider,
    appointment_datetime,
    duration_minutes,
    status,
    appointment_type,
    reason
  } = appointment;

  // Format the date and time
  const appointmentDate = parseISO(appointment_datetime);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(appointmentDate, 'h:mm a');
  
  // Calculate end time
  const endTime = new Date(appointmentDate.getTime() + duration_minutes * 60000);
  const formattedEndTime = format(endTime, 'h:mm a');
  
  // Determine if appointment is in the past
  const isPast = appointmentDate < new Date();
  
  // Determine if the appointment can be cancelled/rescheduled
  const canModify = status === 'scheduled' && !isPast;
  
  // Determine status colors
  const getStatusColors = () => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'bg-teal-50 dark:bg-teal-900/30',
          text: 'text-teal-700 dark:text-teal-300',
          border: 'border-teal-200 dark:border-teal-800'
        };
      case 'completed':
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-200 dark:border-green-800'
        };
      case 'cancelled_by_patient':
      case 'cancelled_by_provider':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-200 dark:border-red-800'
        };
      case 'no_show':
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-800'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/30',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-200 dark:border-gray-800'
        };
    }
  };
  
  const statusColors = getStatusColors();
  
  // Get appointment type icon
  const getAppointmentTypeIcon = () => {
    switch (appointment_type) {
      case 'in-person':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'phone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Format status for display
  const getDisplayStatus = () => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'cancelled_by_patient':
        return 'Cancelled by You';
      case 'cancelled_by_provider':
        return 'Cancelled by Provider';
      case 'no_show':
        return 'Missed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel(id);
    }
  };
  
  // Handle reschedule button click
  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(appointment);
    }
  };
  
  // Handle view details click
  const handleViewDetails = () => {
    router.push(`/patient/appointments/${id}`);
  };
  
  return (
    <div className={`appointment-card rounded-lg border shadow-sm overflow-hidden ${className}`}>
      {/* Appointment header with status */}
      <div className={`px-4 py-3 flex justify-between items-center ${statusColors.bg} ${statusColors.border} border-b`}>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${statusColors.text} bg-white/50 dark:bg-black/10`}>
            {getDisplayStatus()}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{formattedDate}</span>
        </div>
        <div className="flex items-center">
          {getAppointmentTypeIcon()}
        </div>
      </div>
      
      {/* Appointment details */}
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formattedTime} - {formattedEndTime} ({duration_minutes} min)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {provider.full_name}
              </span>
            </div>
            
            {reason && (
              <div className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {reason}
                </span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          {showActions && (
            <div className="flex flex-col sm:flex-row gap-2 self-stretch sm:self-end mt-2 sm:mt-0">
              <Button
                onClick={handleViewDetails}
                className="text-sm px-3 py-1 h-auto bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Details
              </Button>
              
              {canModify && (
                <>
                  <Button
                    onClick={handleReschedule}
                    disabled={!onReschedule}
                    className="text-sm px-3 py-1 h-auto bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/30"
                  >
                    Reschedule
                  </Button>
                  
                  <Button
                    onClick={handleCancel}
                    disabled={!onCancel}
                    className="text-sm px-3 py-1 h-auto bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
