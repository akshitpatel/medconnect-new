import { ObjectId } from 'mongodb';

export interface EmailTemplate {
  subject: string;
  body?: string;
  enabled: boolean;
  lastModified?: Date;
}

export interface GeneralConfig {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  contactPhone: string;
  defaultLanguage: string;
  defaultTimeZone: string;
  maintenanceMode: boolean;
}

export interface NotificationConfig {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  newsletterFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  adminAlerts: boolean;
}

export interface FeesConfig {
  platformFee: number;
  doctorCommission: number;
  labTestCommission: number;
  pharmacyCommission: number;
  taxRate: number;
  currencySymbol: string;
  allowPromoCode: boolean;
}

export interface SystemConfig {
  _id?: ObjectId;
  general: GeneralConfig;
  notifications: NotificationConfig;
  emailTemplates: {
    welcomeEmail: EmailTemplate;
    appointmentConfirmation: EmailTemplate;
    appointmentReminder: EmailTemplate;
    prescriptionReady: EmailTemplate;
    labResultsReady: EmailTemplate;
  };
  fees: FeesConfig;
  lastUpdated: Date;
  updatedBy?: string;
} 