import { ObjectId } from 'mongodb';

// Health Passport Interfaces

// Current Medication Interface
export interface CurrentMedication {
  name: string;
  dosage: string;
  frequency: string;
  start_date: Date;
  end_date?: Date;
  prescribing_doctor?: {
    doctor_id: ObjectId;
    name: string;
  };
}

// Emergency Contact Interface
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Medical Record Interface
export interface MedicalRecord {
  record_id: ObjectId;
  title: string;
  type: string; // "Lab Result", "Prescription", "Imaging", "Consultation", etc.
  provider?: {
    provider_id: ObjectId;
    name: string;
    specialization?: string;
  };
  date: Date;
  file_url?: string; // Encrypted storage URL
  notes?: string;
  tags?: string[];
}

// Vaccination Interface
export interface Vaccination {
  name: string;
  date: Date;
  provider?: string;
  batch_number?: string;
  next_due?: Date;
}

// Vital Signs Interface
export interface VitalSigns {
  date: Date;
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  pulse?: number;
  temperature?: number;
  oxygen_saturation?: number;
}

// Access Log Interface
export interface AccessLog {
  accessed_by: {
    type: string; // "Doctor", "Hospital", "Patient", "Emergency Services", etc.
    id: ObjectId;
    name: string;
  };
  access_time: Date;
  access_method: string; // "QR", "Direct", "Emergency"
  records_accessed?: string[]; // List of record IDs accessed
  reason?: string;
  ip_address?: string;
  device_info?: string;
}

// Health Passport Interface
export interface HealthPassport {
  _id?: ObjectId;
  user_id: ObjectId; // Reference to user
  created_at: Date;
  updated_at: Date;
  passport_number: string; // Unique identifier
  active: boolean;
  access_code?: string; // For QR code generation
  access_code_expires?: Date;
  emergency_access: boolean; // Can be accessed in emergency without full authentication
  
  // Health profile
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: CurrentMedication[];
  emergency_contacts?: EmergencyContact[];
  
  // Medical records
  medical_records?: MedicalRecord[];
  
  // Vaccination records
  vaccinations?: Vaccination[];
  
  // Health metrics history
  vital_signs?: VitalSigns[];
  
  // Access logs
  access_logs?: AccessLog[];
}

// Access Request Interface
export interface PassportAccessRequest {
  _id?: ObjectId;
  passport_id: ObjectId;
  requestor: {
    type: string; // "Doctor", "Hospital", etc.
    id: ObjectId;
    name: string;
  };
  requested_at: Date;
  expires_at: Date;
  status: string; // "Pending", "Approved", "Rejected", "Expired"
  approved_by?: ObjectId; // User ID who approved
  approved_at?: Date;
  access_level: string; // "Full", "Limited", "Emergency"
  specific_records?: ObjectId[]; // If limited access, specify which records
  reason?: string;
  notification_sent: boolean;
}

// Health Passport Collection Names
export const HEALTH_PASSPORT_COLLECTION = 'health_passport';
export const PASSPORT_ACCESS_REQUESTS_COLLECTION = 'passport_access_requests'; 