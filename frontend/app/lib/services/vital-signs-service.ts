import { ObjectId } from 'mongodb';

export interface VitalSign {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  recordedBy?: string | ObjectId; // User ID who recorded it
  recordedAt: Date | string;
  vitalType: 'blood_pressure' | 'heart_rate' | 'respiratory_rate' | 'temperature' | 'oxygen_saturation' | 'blood_glucose' | 'weight' | 'height' | 'bmi' | 'other';
  value: number | string; // For blood pressure, it might be "120/80"
  unit: string; // "mmHg", "bpm", "breaths/min", "°C", "°F", "%", "mg/dL", "kg", "cm", "kg/m²"
  notes?: string;
  source?: 'manual' | 'device' | 'integration'; // How the data was entered
  deviceInfo?: {
    deviceId?: string;
    deviceName?: string;
    manufacturer?: string;
  };
  isAbnormal?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VitalSignsStatistics {
  bloodPressure?: {
    average: string; // e.g., "120/80"
    min: string; 
    max: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  heartRate?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  temperature?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  oxygenSaturation?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  bloodGlucose?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  weight?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  bmi?: {
    average: number;
    min: number;
    max: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export class VitalSignsService {
  // Fetch all vital signs for the current user
  static async getAllVitalSigns(): Promise<VitalSign[]> {
    try {
      const response = await fetch('/api/vital-signs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vital signs');
      }
      
      const data = await response.json();
      return data.vitalSigns;
    } catch (error) {
      console.error('Error fetching vital signs:', error);
      return [];
    }
  }
  
  // Fetch vital signs by type
  static async getVitalSignsByType(type: VitalSign['vitalType']): Promise<VitalSign[]> {
    try {
      const response = await fetch(`/api/vital-signs?type=${type}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} vital signs`);
      }
      
      const data = await response.json();
      return data.vitalSigns;
    } catch (error) {
      console.error(`Error fetching ${type} vital signs:`, error);
      return [];
    }
  }
  
  // Fetch vital signs within a date range
  static async getVitalSignsByDateRange(
    startDate: Date | string, 
    endDate: Date | string
  ): Promise<VitalSign[]> {
    try {
      // Convert dates to ISO strings if they are Date objects
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString();
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString();
      
      const response = await fetch(`/api/vital-signs?startDate=${start}&endDate=${end}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vital signs for the specified date range');
      }
      
      const data = await response.json();
      return data.vitalSigns;
    } catch (error) {
      console.error('Error fetching vital signs by date range:', error);
      return [];
    }
  }
  
  // Get vital sign statistics
  static async getVitalSignsStatistics(): Promise<VitalSignsStatistics | null> {
    try {
      const response = await fetch('/api/vital-signs/statistics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vital signs statistics');
      }
      
      const data = await response.json();
      return data.statistics;
    } catch (error) {
      console.error('Error fetching vital signs statistics:', error);
      return null;
    }
  }
  
  // Add a new vital sign record
  static async addVitalSign(
    vitalSign: Omit<VitalSign, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<VitalSign | null> {
    try {
      const response = await fetch('/api/vital-signs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vitalSign),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add vital sign record');
      }
      
      const data = await response.json();
      return data.vitalSign;
    } catch (error) {
      console.error('Error adding vital sign record:', error);
      return null;
    }
  }
  
  // Update a vital sign record
  static async updateVitalSign(
    vitalSignId: string, 
    updates: Partial<VitalSign>
  ): Promise<VitalSign | null> {
    try {
      const response = await fetch(`/api/vital-signs/${vitalSignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vital sign record');
      }
      
      const data = await response.json();
      return data.vitalSign;
    } catch (error) {
      console.error('Error updating vital sign record:', error);
      return null;
    }
  }
  
  // Delete a vital sign record
  static async deleteVitalSign(vitalSignId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/vital-signs/${vitalSignId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vital sign record');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting vital sign record:', error);
      return false;
    }
  }
  
  // Calculate BMI
  static calculateBMI(weightInKg: number, heightInCm: number): number {
    if (heightInCm <= 0 || weightInKg <= 0) {
      throw new Error('Height and weight must be positive values');
    }
    
    // Convert height from cm to meters
    const heightInMeters = heightInCm / 100;
    
    // BMI formula: weight (kg) / (height (m))²
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    
    // Round to 1 decimal place
    return Math.round(bmi * 10) / 10;
  }
  
  // Get BMI classification
  static getBMIClassification(bmi: number): string {
    if (bmi < 18.5) {
      return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      return 'Normal weight';
    } else if (bmi >= 25 && bmi < 30) {
      return 'Overweight';
    } else if (bmi >= 30 && bmi < 35) {
      return 'Obesity (Class 1)';
    } else if (bmi >= 35 && bmi < 40) {
      return 'Obesity (Class 2)';
    } else {
      return 'Obesity (Class 3)';
    }
  }
} 