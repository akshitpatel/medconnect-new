/**
 * API Types for MedConnect
 * 
 * This file contains TypeScript interfaces for all data models used in the API routes.
 */

export interface User {
  _id: string;
  email: string;
  password?: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  _id: string;
  userId: string;
  fullName: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  hospital: string;
  rating: string;
  availability: {
    [key: string]: string[];
  };
  consultationFee: number;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  location?: string;
  videoLink?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  prescribedDate: string;
  expiryDate: string;
  instructions: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Reminder {
  _id: string;
  patientId: string;
  title: string;
  description: string;
  reminder_type: string;
  date: string;
  time: string;
  recurring: boolean;
  frequency?: string;
  custom_frequency?: {
    days: string[];
    times: string[];
  };
  end_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VitalSign {
  _id: string;
  patientId: string;
  recordedAt: string;
  vitalType: string;
  value: string | number;
  unit: string;
  isAbnormal: boolean;
  source: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LabTestResult {
  _id: string;
  patientId: string;
  test_name: string;
  test_type: string;
  result_date: string;
  is_normal: boolean;
  conclusion: string;
  details: {
    performed_by: string;
    lab_name: string;
  };
  file_url: string | null;
  parameters?: {
    name: string;
    value: string;
    unit: string;
    reference: string;
    is_normal: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

export interface HealthPassport {
  _id: string;
  patientId: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  isActive: boolean;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: string;
  recordType: string;
  title: string;
  date: string;
  provider: string;
  description: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ImagingService {
  _id: string;
  name: string;
  category: string;
  description: string;
  preparation: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImagingProvider {
  _id: string;
  name: string;
  address: string;
  contact: string;
  services: string[];
  availability: {
    [key: string]: string[];
  };
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImagingAppointment {
  _id: string;
  patientId: string;
  providerId: string;
  serviceId: string;
  date: string;
  time: string;
  status: string;
  prescriptionId?: string;
  reportId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImagingReport {
  _id: string;
  appointmentId: string;
  patientId: string;
  providerId: string;
  serviceId: string;
  date: string;
  findings: string;
  conclusion: string;
  imageUrls: string[];
  radiologistName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRating {
  _id: string;
  patientId: string;
  providerId: string;
  serviceType: string;
  rating: number;
  review: string;
  isHelpful: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequest {
  _id: string;
  patientId: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: string;
  emergencyType: string;
  responderInfo?: {
    name: string;
    contact: string;
    eta: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Response types
export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  error?: string;
  message?: string;
} 