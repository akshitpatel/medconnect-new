import { ObjectId } from 'mongodb';

// Collection names
export const IMAGING_PROVIDERS_COLLECTION = 'imaging_providers';
export const IMAGING_APPOINTMENTS_COLLECTION = 'imaging_appointments';
export const IMAGING_RESULTS_COLLECTION = 'imaging_results';
export const IMAGING_TYPES_COLLECTION = 'imaging_types';

/**
 * Imaging Provider model
 */
export interface ImagingProvider {
  _id?: ObjectId;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  specialties: string[]; // e.g., ["MRI", "X-Ray", "CT Scan"]
  insurance_accepted: string[];
  hours_of_operation: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  rating?: number; // Average rating from 1-5
  verification_status: 'verified' | 'pending' | 'unverified';
  created_at: Date;
  updated_at: Date;
  active: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

/**
 * Imaging Type model
 */
export interface ImagingType {
  _id?: ObjectId;
  name: string; // e.g., "MRI", "X-Ray", "CT Scan"
  description: string;
  preparation_instructions?: string;
  duration_minutes: number;
  risks?: string[];
  body_parts: string[]; // e.g., ["Head", "Chest", "Abdomen"]
  requires_contrast?: boolean;
  price_range?: {
    min: number;
    max: number;
    currency: string;
  };
  created_at: Date;
  updated_at: Date;
  active: boolean;
}

/**
 * Appointment Status
 */
export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show' 
  | 'rescheduled';

/**
 * Insurance Information
 */
export interface InsuranceInfo {
  provider: string;
  policy_number: string;
  group_number?: string;
  subscriber_name?: string;
  verification_status?: 'verified' | 'pending' | 'failed';
}

/**
 * Imaging Appointment model
 */
export interface ImagingAppointment {
  _id?: ObjectId;
  user_id: ObjectId;
  provider_id: ObjectId;
  imaging_type_id: ObjectId;
  passport_id?: ObjectId; // Reference to health passport
  appointment_date: Date;
  duration_minutes: number;
  status: AppointmentStatus;
  body_part: string;
  reason_for_exam?: string;
  referral_doctor?: {
    name: string;
    npi?: string; // National Provider Identifier
  };
  insurance_info?: InsuranceInfo;
  notes?: string;
  contrast_required: boolean;
  preparation_confirmed: boolean;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
  notification_status: {
    confirmation_sent: boolean;
    reminder_sent: boolean;
    result_available_sent: boolean;
  };
  price?: {
    amount: number;
    currency: string;
    paid: boolean;
    payment_method?: string;
    payment_date?: Date;
  };
}

/**
 * Imaging Result Status
 */
export type ResultStatus = 
  | 'pending' 
  | 'preliminary' 
  | 'final' 
  | 'amended';

/**
 * Imaging Result model
 */
export interface ImagingResult {
  _id?: ObjectId;
  appointment_id: ObjectId;
  user_id: ObjectId;
  provider_id: ObjectId;
  imaging_type_id: ObjectId;
  passport_id?: ObjectId;
  upload_date: Date;
  status: ResultStatus;
  findings: string;
  impression: string;
  radiologist: {
    name: string;
    npi?: string; // National Provider Identifier
  };
  images: {
    url: string; // Encrypted storage URL
    thumbnail_url?: string;
    type: string; // e.g., "DICOM", "JPG", "PNG"
    description?: string;
  }[];
  report_url?: string; // URL to the full report PDF
  is_critical: boolean;
  viewed_by_patient: boolean;
  viewed_by_provider: boolean;
  created_at: Date;
  updated_at: Date;
  notifications_sent: {
    patient: boolean;
    referring_provider: boolean;
  };
} 