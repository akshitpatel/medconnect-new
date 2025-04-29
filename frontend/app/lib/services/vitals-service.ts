import { ObjectId } from 'mongodb';

export interface VitalReading {
  _id?: string | ObjectId;
  patient_id: string | ObjectId;
  vital_type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'temperature' | 'oxygen_saturation' | 'weight' | 'height' | 'bmi' | 'sleep_hours';
  value: string | number;
  unit: string;
  date: Date | string;
  time: string;
  notes?: string;
  recorded_by: 'patient' | 'doctor' | 'system';
  doctor_id?: string | ObjectId;
  doctor_name?: string;
  is_abnormal?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface VitalStats {
  vital_type: string;
  latest_value: string | number;
  latest_date: Date | string;
  unit: string;
  min_value: string | number;
  max_value: string | number;
  avg_value: string | number;
  change_percent: number;
  readings: VitalReading[];
}

export class VitalsService {
  // Get latest vitals readings
  static async getLatestVitals(): Promise<Record<string, VitalReading>> {
    try {
      const response = await fetch('/api/vitals/latest');
      
      if (!response.ok) {
        throw new Error('Failed to fetch latest vitals');
      }
      
      const data = await response.json();
      return data.vitals;
    } catch (error) {
      console.error('Error fetching latest vitals:', error);
      return {};
    }
  }
  
  // Get vital stats and history for a specific vital type
  static async getVitalHistory(vitalType: string, limit: number = 30): Promise<VitalStats | null> {
    try {
      const response = await fetch(`/api/vitals/${vitalType}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${vitalType} history`);
      }
      
      const data = await response.json();
      return data.vitalStats;
    } catch (error) {
      console.error(`Error fetching ${vitalType} history:`, error);
      return null;
    }
  }
  
  // Get all vitals stats
  static async getAllVitalStats(timeframe: 'week' | 'month' | 'year' = 'month'): Promise<Record<string, VitalStats>> {
    try {
      const response = await fetch(`/api/vitals/stats?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vital stats');
      }
      
      const data = await response.json();
      return data.vitalStats;
    } catch (error) {
      console.error('Error fetching vital stats:', error);
      return {};
    }
  }
  
  // Add a new vital reading
  static async addVitalReading(reading: Omit<VitalReading, '_id' | 'patient_id' | 'created_at' | 'updated_at'>): Promise<VitalReading | null> {
    try {
      const response = await fetch('/api/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reading),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add vital reading');
      }
      
      const data = await response.json();
      return data.vitalReading;
    } catch (error) {
      console.error('Error adding vital reading:', error);
      return null;
    }
  }
  
  // Get abnormal readings
  static async getAbnormalReadings(limit: number = 10): Promise<VitalReading[]> {
    try {
      const response = await fetch(`/api/vitals/abnormal?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch abnormal readings');
      }
      
      const data = await response.json();
      return data.readings;
    } catch (error) {
      console.error('Error fetching abnormal readings:', error);
      return [];
    }
  }
  
  // Delete a vital reading
  static async deleteVitalReading(readingId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/vitals/${readingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete vital reading');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting vital reading:', error);
      return false;
    }
  }
  
  // Update a vital reading
  static async updateVitalReading(readingId: string, updates: Partial<VitalReading>): Promise<VitalReading | null> {
    try {
      const response = await fetch(`/api/vitals/${readingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update vital reading');
      }
      
      const data = await response.json();
      return data.vitalReading;
    } catch (error) {
      console.error('Error updating vital reading:', error);
      return null;
    }
  }
} 