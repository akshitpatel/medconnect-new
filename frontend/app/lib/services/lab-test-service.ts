import { ObjectId } from 'mongodb';

export interface LabTest {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  labId?: string | ObjectId;
  doctorId?: string | ObjectId;
  testName: string;
  testType: string;
  testCode?: string;
  description?: string;
  status: 'scheduled' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  scheduledDate: Date | string;
  collectionDate?: Date | string;
  reportDate?: Date | string;
  results?: LabTestResult[];
  reportUrl?: string;
  cost?: number;
  insuranceCovered?: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LabTestResult {
  parameterName: string;
  value: string | number;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  interpretation?: string;
}

export interface Laboratory {
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
  accreditations?: string[];
  rating?: number;
  reviews?: number;
}

export interface LabResult {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  doctorId?: string | ObjectId;
  test_name: string;
  test_type: string;
  test_date: string; // ISO date string when test was taken
  result_date: string; // ISO date string when results were received
  results: Record<string, any>; // Test-specific results
  conclusion: string;
  is_normal: boolean;
  notes?: string;
  file_url?: string; // URL to PDF or image of test results
  created_at?: string; // ISO date-time string
  updated_at?: string; // ISO date-time string
}

export class LabTestService {
  // Fetch all lab tests for the current user
  static async getAllLabTests(): Promise<LabTest[]> {
    try {
      const response = await fetch('/api/lab-tests');
      
      if (!response.ok) {
        throw new Error('Failed to fetch lab tests');
      }
      
      const data = await response.json();
      return data.labTests;
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      return [];
    }
  }
  
  // Fetch lab test by ID
  static async getLabTestById(testId: string): Promise<LabTest | null> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lab test');
      }
      
      const data = await response.json();
      return data.labTest;
    } catch (error) {
      console.error('Error fetching lab test:', error);
      return null;
    }
  }
  
  // Get lab tests by status
  static async getLabTestsByStatus(status: LabTest['status']): Promise<LabTest[]> {
    try {
      const response = await fetch(`/api/lab-tests?status=${status}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${status} lab tests`);
      }
      
      const data = await response.json();
      return data.labTests;
    } catch (error) {
      console.error(`Error fetching ${status} lab tests:`, error);
      return [];
    }
  }
  
  // Get upcoming lab tests
  static async getUpcomingLabTests(): Promise<LabTest[]> {
    try {
      const response = await fetch('/api/lab-tests?type=upcoming');
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming lab tests');
      }
      
      const data = await response.json();
      return data.labTests;
    } catch (error) {
      console.error('Error fetching upcoming lab tests:', error);
      return [];
    }
  }
  
  // Get lab test history
  static async getLabTestHistory(limit: number = 10): Promise<LabTest[]> {
    try {
      const response = await fetch(`/api/lab-tests/history?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lab test history');
      }
      
      const data = await response.json();
      return data.labTests;
    } catch (error) {
      console.error('Error fetching lab test history:', error);
      return [];
    }
  }
  
  // Get lab test results
  static async getLabTestResults(testId: string): Promise<LabTestResult[] | null> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}/results`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lab test results');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching lab test results:', error);
      return null;
    }
  }
  
  // Get all lab results for current user
  static async getAllLabResults(limit?: number): Promise<LabResult[]> {
    try {
      const url = limit ? `/api/lab-results?limit=${limit}` : '/api/lab-results';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lab results');
      }
      
      const data = await response.json();
      return data.labResults;
    } catch (error) {
      console.error('Error fetching lab results:', error);
      return [];
    }
  }
  
  // Schedule a new lab test
  static async scheduleLabTest(
    labTest: Omit<LabTest, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<LabTest | null> {
    try {
      const response = await fetch('/api/lab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(labTest),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule lab test');
      }
      
      const data = await response.json();
      return data.labTest;
    } catch (error) {
      console.error('Error scheduling lab test:', error);
      return null;
    }
  }
  
  // Update lab test
  static async updateLabTest(
    testId: string, 
    updates: Partial<LabTest>
  ): Promise<LabTest | null> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update lab test');
      }
      
      const data = await response.json();
      return data.labTest;
    } catch (error) {
      console.error('Error updating lab test:', error);
      return null;
    }
  }
  
  // Cancel lab test
  static async cancelLabTest(testId: string, reason?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel lab test');
      }
      
      return true;
    } catch (error) {
      console.error('Error cancelling lab test:', error);
      return false;
    }
  }
  
  // Get labs by location
  static async getLabsByLocation(
    city: string, 
    state?: string
  ): Promise<Laboratory[]> {
    try {
      let url = `/api/laboratories?city=${encodeURIComponent(city)}`;
      if (state) {
        url += `&state=${encodeURIComponent(state)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch laboratories');
      }
      
      const data = await response.json();
      return data.laboratories;
    } catch (error) {
      console.error('Error fetching laboratories:', error);
      return [];
    }
  }
  
  // Get labs by service
  static async getLabsByService(service: string): Promise<Laboratory[]> {
    try {
      const response = await fetch(`/api/laboratories?service=${encodeURIComponent(service)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch laboratories');
      }
      
      const data = await response.json();
      return data.laboratories;
    } catch (error) {
      console.error('Error fetching laboratories:', error);
      return [];
    }
  }
  
  // Get lab details
  static async getLabDetails(labId: string): Promise<Laboratory | null> {
    try {
      const response = await fetch(`/api/laboratories/${labId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch laboratory details');
      }
      
      const data = await response.json();
      return data.laboratory;
    } catch (error) {
      console.error('Error fetching laboratory details:', error);
      return null;
    }
  }
  
  // Download lab test report
  static async downloadLabTestReport(testId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}/report/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download lab test report');
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
      let filename = 'lab-test-report.pdf';
      
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
      console.error('Error downloading lab test report:', error);
      return false;
    }
  }
  
  // Share lab test results
  static async shareLabTestResults(
    testId: string, 
    recipientEmail: string, 
    message?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/lab-tests/${testId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to share lab test results');
      }
      
      return true;
    } catch (error) {
      console.error('Error sharing lab test results:', error);
      return false;
    }
  }
} 