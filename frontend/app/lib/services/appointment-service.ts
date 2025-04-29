import { ObjectId } from 'mongodb';

export interface Appointment {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  doctorId: string | ObjectId;
  specialtyId?: string | ObjectId;
  clinicId?: string | ObjectId;
  date: Date | string;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "09:30"
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'video' | 'phone';
  reason: string;
  notes?: string;
  symptoms?: string[];
  visitSummary?: string;
  prescriptionIds?: (string | ObjectId)[];
  followUpDate?: Date | string;
  paymentStatus?: 'pending' | 'paid' | 'insurance_claimed' | 'refunded';
  paymentAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Doctor {
  _id?: string | ObjectId;
  name: string;
  title?: string;
  specialties: string[];
  qualifications?: string[];
  experience?: number; // in years
  languages?: string[];
  bio?: string;
  profileImage?: string;
  clinics?: {
    clinicId: string | ObjectId;
    name: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    workingHours?: {
      monday?: { start: string; end: string }[];
      tuesday?: { start: string; end: string }[];
      wednesday?: { start: string; end: string }[];
      thursday?: { start: string; end: string }[];
      friday?: { start: string; end: string }[];
      saturday?: { start: string; end: string }[];
      sunday?: { start: string; end: string }[];
    };
  }[];
  rating?: number;
  reviewCount?: number;
  consultationFee?: number;
  acceptsInsurance?: boolean;
  insuranceProviders?: string[];
}

export interface TimeSlot {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

export class AppointmentService {
  // Fetch all appointments for the current user
  static async getAllAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch('/api/appointments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      return data.appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }
  
  // Fetch appointment by ID
  static async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }
      
      const data = await response.json();
      return data.appointment;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
  }
  
  // Get upcoming appointments
  static async getUpcomingAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch('/api/appointments?type=upcoming');
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming appointments');
      }
      
      const data = await response.json();
      return data.appointments;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return [];
    }
  }
  
  // Get past appointments
  static async getPastAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch('/api/appointments?type=past');
      
      if (!response.ok) {
        throw new Error('Failed to fetch past appointments');
      }
      
      const data = await response.json();
      return data.appointments;
    } catch (error) {
      console.error('Error fetching past appointments:', error);
      return [];
    }
  }
  
  // Search for doctors
  static async searchDoctors(
    specialty?: string,
    location?: string,
    name?: string
  ): Promise<Doctor[]> {
    try {
      let url = '/api/doctors/search?';
      
      if (specialty) {
        url += `specialty=${encodeURIComponent(specialty)}&`;
      }
      
      if (location) {
        url += `location=${encodeURIComponent(location)}&`;
      }
      
      if (name) {
        url += `name=${encodeURIComponent(name)}&`;
      }
      
      // Remove trailing '&' or '?'
      url = url.replace(/[?&]$/, '');
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to search doctors');
      }
      
      const data = await response.json();
      return data.doctors;
    } catch (error) {
      console.error('Error searching doctors:', error);
      return [];
    }
  }
  
  // Get doctor details
  static async getDoctorDetails(doctorId: string): Promise<Doctor | null> {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }
      
      const data = await response.json();
      return data.doctor;
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      return null;
    }
  }
  
  // Get available time slots for a doctor
  static async getDoctorTimeSlots(
    doctorId: string,
    clinicId: string,
    startDate: Date | string,
    endDate?: Date | string
  ): Promise<TimeSlot[]> {
    try {
      // Convert dates to ISO strings if they are Date objects
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
      const end = endDate 
        ? (typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0])
        : start;
      
      const response = await fetch(
        `/api/doctors/${doctorId}/timeslots?clinicId=${clinicId}&startDate=${start}&endDate=${end}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor time slots');
      }
      
      const data = await response.json();
      return data.timeSlots;
    } catch (error) {
      console.error('Error fetching doctor time slots:', error);
      return [];
    }
  }
  
  // Book an appointment
  static async bookAppointment(
    appointment: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Appointment | null> {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      
      const data = await response.json();
      return data.appointment;
    } catch (error) {
      console.error('Error booking appointment:', error);
      return null;
    }
  }
  
  // Reschedule an appointment
  static async rescheduleAppointment(
    appointmentId: string,
    date: Date | string,
    startTime: string,
    endTime: string
  ): Promise<Appointment | null> {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reschedule appointment');
      }
      
      const data = await response.json();
      return data.appointment;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return null;
    }
  }
  
  // Cancel an appointment
  static async cancelAppointment(
    appointmentId: string, 
    reason?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel appointment');
      }
      
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return false;
    }
  }
  
  // Update appointment notes
  static async updateAppointmentNotes(
    appointmentId: string,
    notes: string
  ): Promise<Appointment | null> {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment notes');
      }
      
      const data = await response.json();
      return data.appointment;
    } catch (error) {
      console.error('Error updating appointment notes:', error);
      return null;
    }
  }
  
  // Get video consultation link
  static async getVideoConsultationLink(appointmentId: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/video-link`);
      
      if (!response.ok) {
        throw new Error('Failed to get video consultation link');
      }
      
      const data = await response.json();
      return data.videoLink;
    } catch (error) {
      console.error('Error getting video consultation link:', error);
      return null;
    }
  }
} 