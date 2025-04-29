import { ObjectId } from 'mongodb';

export interface Prescription {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  doctorId: string | ObjectId;
  doctorName?: string;
  appointmentId?: string | ObjectId;
  issueDate: Date | string;
  expiryDate?: Date | string;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  medications: Medication[];
  instructions?: string;
  diagnosis?: string;
  refillsAllowed?: number;
  refillsRemaining?: number;
  lastRefillDate?: Date | string;
  pharmacyId?: string | ObjectId;
  pharmacyName?: string;
  isElectronic?: boolean;
  documentUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Medication {
  name: string;
  dosage: string; // e.g., "10mg"
  form?: string; // e.g., "tablet", "capsule", "liquid"
  frequency: string; // e.g., "twice daily", "every 8 hours"
  duration: string; // e.g., "7 days", "2 weeks"
  quantity: number;
  instructions?: string; // e.g., "Take with food"
  sideEffects?: string[];
  warnings?: string[];
  isGeneric?: boolean;
  alternatives?: string[];
}

export interface Pharmacy {
  _id?: string | ObjectId;
  name: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: string[];
  isDeliveryAvailable?: boolean;
  isOpenNow?: boolean;
  rating?: number;
  reviews?: number;
}

export class PrescriptionService {
  // Fetch all prescriptions for the current user
  static async getAllPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await fetch('/api/prescriptions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      
      const data = await response.json();
      return data.prescriptions;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }
  }
  
  // Fetch prescription by ID
  static async getPrescriptionById(prescriptionId: string): Promise<Prescription | null> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescription');
      }
      
      const data = await response.json();
      return data.prescription;
    } catch (error) {
      console.error('Error fetching prescription:', error);
      return null;
    }
  }
  
  // Get active prescriptions
  static async getActivePrescriptions(): Promise<Prescription[]> {
    try {
      const response = await fetch('/api/prescriptions?status=active');
      
      if (!response.ok) {
        throw new Error('Failed to fetch active prescriptions');
      }
      
      const data = await response.json();
      return data.prescriptions;
    } catch (error) {
      console.error('Error fetching active prescriptions:', error);
      return [];
    }
  }
  
  // Request prescription refill
  static async requestRefill(prescriptionId: string, pharmacyId?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/refill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pharmacyId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to request prescription refill');
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting prescription refill:', error);
      return false;
    }
  }
  
  // Download prescription
  static async downloadPrescription(prescriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download prescription');
      }
      
      // Handle the blob response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'prescription.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Error downloading prescription:', error);
      return false;
    }
  }
  
  // Get nearby pharmacies
  static async getNearbyPharmacies(
    latitude: number,
    longitude: number,
    radius: number = 5 // Default 5 km
  ): Promise<Pharmacy[]> {
    try {
      const response = await fetch(
        `/api/pharmacies/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch nearby pharmacies');
      }
      
      const data = await response.json();
      return data.pharmacies;
    } catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
      return [];
    }
  }
  
  // Get pharmacies by city
  static async getPharmaciesByCity(city: string, state?: string): Promise<Pharmacy[]> {
    try {
      let url = `/api/pharmacies?city=${encodeURIComponent(city)}`;
      if (state) {
        url += `&state=${encodeURIComponent(state)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies');
      }
      
      const data = await response.json();
      return data.pharmacies;
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      return [];
    }
  }
  
  // Get pharmacy details
  static async getPharmacyDetails(pharmacyId: string): Promise<Pharmacy | null> {
    try {
      const response = await fetch(`/api/pharmacies/${pharmacyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pharmacy details');
      }
      
      const data = await response.json();
      return data.pharmacy;
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      return null;
    }
  }
  
  // Send prescription to pharmacy
  static async sendToPharmacy(prescriptionId: string, pharmacyId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pharmacyId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send prescription to pharmacy');
      }
      
      return true;
    } catch (error) {
      console.error('Error sending prescription to pharmacy:', error);
      return false;
    }
  }
  
  // Track prescription order status
  static async trackPrescriptionOrder(prescriptionId: string): Promise<{ status: string; estimatedDelivery?: string } | null> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/track`);
      
      if (!response.ok) {
        throw new Error('Failed to track prescription order');
      }
      
      const data = await response.json();
      return {
        status: data.status,
        estimatedDelivery: data.estimatedDelivery
      };
    } catch (error) {
      console.error('Error tracking prescription order:', error);
      return null;
    }
  }
  
  // Add medication reminder
  static async addMedicationReminder(
    prescriptionId: string, 
    medicationName: string, 
    reminderTime: string, // e.g., "08:00"
    notes?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/prescriptions/${prescriptionId}/reminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicationName,
          reminderTime,
          notes
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add medication reminder');
      }
      
      return true;
    } catch (error) {
      console.error('Error adding medication reminder:', error);
      return false;
    }
  }
} 