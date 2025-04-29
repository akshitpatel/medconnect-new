import { ObjectId } from 'mongodb';

export interface Reminder {
  _id?: string | ObjectId;
  patientId: string | ObjectId;
  title: string;
  description?: string;
  reminder_type: 'medication' | 'appointment' | 'test' | 'vitals' | 'other';
  date: string; // ISO date string
  time: string; // Time in 24-hour format (HH:MM)
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
  custom_frequency?: {
    days: string[]; // Array of weekdays, e.g., ['monday', 'wednesday', 'friday']
    times?: string[]; // Array of times in 24-hour format (HH:MM)
  };
  end_date?: string; // ISO date string, only used for recurring reminders
  notifications?: {
    enabled: boolean;
    notification_time: number; // Minutes before the reminder
  };
  status: 'pending' | 'completed' | 'snoozed' | 'missed';
  snooze_until?: string; // ISO date-time string
  additional_info?: Record<string, any>;
  created_at?: string; // ISO date-time string
  updated_at?: string; // ISO date-time string
}

export class ReminderService {
  // Get all reminders for the current user
  static async getAllReminders(): Promise<Reminder[]> {
    try {
      const response = await fetch('/api/reminders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      
      const data = await response.json();
      return data.reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  }

  // Get today's reminders
  static async getTodayReminders(): Promise<Reminder[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const response = await fetch(`/api/reminders?start=${today.toISOString()}&end=${tomorrow.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s reminders');
      }
      
      const data = await response.json();
      return data.reminders;
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
      return [];
    }
  }
  
  // Get reminder by id
  static async getReminderById(id: string): Promise<Reminder | null> {
    try {
      const response = await fetch(`/api/reminders/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reminder');
      }
      
      const data = await response.json();
      return data.reminder;
    } catch (error) {
      console.error('Error fetching reminder:', error);
      return null;
    }
  }
  
  // Create new reminder
  static async createReminder(reminder: Omit<Reminder, '_id' | 'created_at' | 'updated_at'>): Promise<Reminder | null> {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminder),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }
      
      const data = await response.json();
      return data.reminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
  }
  
  // Update reminder
  static async updateReminder(id: string, updates: Partial<Reminder>): Promise<Reminder | null> {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update reminder');
      }
      
      const data = await response.json();
      return data.reminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return null;
    }
  }
  
  // Delete reminder
  static async deleteReminder(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete reminder');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return false;
    }
  }

  // Mark reminder as completed
  static async markAsCompleted(id: string): Promise<Reminder | null> {
    return this.updateReminder(id, { status: 'completed' });
  }

  // Snooze reminder
  static async snoozeReminder(id: string, snoozeUntil: Date): Promise<Reminder | null> {
    return this.updateReminder(id, { 
      status: 'snoozed',
      snooze_until: snoozeUntil.toISOString()
    });
  }
  
  // Get upcoming reminders (for next 7 days)
  static async getUpcomingReminders(): Promise<Reminder[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const response = await fetch(`/api/reminders?start=${today.toISOString()}&end=${nextWeek.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming reminders');
      }
      
      const data = await response.json();
      return data.reminders;
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      return [];
    }
  }
} 