import { ObjectId } from 'mongodb';

export interface User {
  _id?: string | ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date | string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profilePicture?: string;
  bloodType?: string;
  weight?: number;
  height?: number;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    validUntil: Date | string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FamilyMember {
  _id?: string | ObjectId;
  userId: string | ObjectId;
  name: string;
  relationship: string;
  dateOfBirth?: Date | string;
  gender?: string;
  bloodType?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminderEmail: boolean;
    reminderSms: boolean;
    reminderPush: boolean;
    appointmentEmail: boolean;
    appointmentSms: boolean;
    appointmentPush: boolean;
    labResultsEmail: boolean;
    labResultsSms: boolean;
    labResultsPush: boolean;
    prescriptionEmail: boolean;
    prescriptionSms: boolean;
    prescriptionPush: boolean;
  };
  displayPreferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
}

export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
  
  // Update user profile
  static async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }
  
  // Get family members
  static async getFamilyMembers(): Promise<FamilyMember[]> {
    try {
      const response = await fetch('/api/users/me/family');
      
      if (!response.ok) {
        throw new Error('Failed to fetch family members');
      }
      
      const data = await response.json();
      return data.familyMembers;
    } catch (error) {
      console.error('Error fetching family members:', error);
      return [];
    }
  }
  
  // Add family member
  static async addFamilyMember(familyMember: Omit<FamilyMember, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember | null> {
    try {
      const response = await fetch('/api/users/me/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(familyMember),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add family member');
      }
      
      const data = await response.json();
      return data.familyMember;
    } catch (error) {
      console.error('Error adding family member:', error);
      return null;
    }
  }
  
  // Update family member
  static async updateFamilyMember(memberId: string, updates: Partial<FamilyMember>): Promise<FamilyMember | null> {
    try {
      const response = await fetch(`/api/users/me/family/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update family member');
      }
      
      const data = await response.json();
      return data.familyMember;
    } catch (error) {
      console.error('Error updating family member:', error);
      return null;
    }
  }
  
  // Remove family member
  static async removeFamilyMember(memberId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/me/family/${memberId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove family member');
      }
      
      return true;
    } catch (error) {
      console.error('Error removing family member:', error);
      return false;
    }
  }
  
  // Get user preferences
  static async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/users/me/preferences');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user preferences');
      }
      
      const data = await response.json();
      return data.preferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }
  
  // Update user preferences
  static async updateUserPreferences(updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const response = await fetch('/api/users/me/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }
      
      const data = await response.json();
      return data.preferences;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }
} 