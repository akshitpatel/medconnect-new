'use client';

import React from 'react';
import AppointmentCard from './AppointmentCard';

// Local interface to match the page.tsx structure
interface PageAppointment {
  id: string;
  provider: {
    id: string;
    full_name: string;
    email: string;
  };
  appointment_datetime: string;
  duration_minutes: number;
  status: string;
  appointment_type: string;
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  location?: string;
}

interface AppointmentCardWrapperProps {
  appointment: PageAppointment;
  showActions?: boolean;
  onCancel?: (appointmentId: string) => void;
  onReschedule?: (appointment: PageAppointment) => void;
  className?: string;
}

// This wrapper component handles the type conversion between the page's appointment interface
// and the AppointmentCard component's interface
export default function AppointmentCardWrapper({
  appointment,
  showActions = true,
  onCancel,
  onReschedule,
  className = ''
}: AppointmentCardWrapperProps) {
  // Handle cancel action
  const handleCancel = onCancel ? () => onCancel(appointment.id) : undefined;
  
  // Handle reschedule action
  const handleReschedule = onReschedule ? () => onReschedule(appointment) : undefined;
  
  return (
    <AppointmentCard
      appointment={appointment as any} // Type cast to any to bridge the interface gap
      showActions={showActions}
      onCancel={handleCancel}
      onReschedule={handleReschedule}
      className={className}
    />
  );
}

// Export the interface for use in other files
export type { PageAppointment };
