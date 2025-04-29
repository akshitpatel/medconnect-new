import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';
import { Content, ContentType, ContentStatus } from './models/content';
import { SystemConfig } from './models/config';

// Database and collection names
const DB_NAME = 'medconnect';
const COLLECTIONS = {
  USERS: 'users',
  DOCTORS: 'doctors',
  APPOINTMENTS: 'appointments',
  MEDICAL_RECORDS: 'medicalRecords',
  PRESCRIPTIONS: 'prescriptions',
  LAB_TESTS: 'labTests',
  PHARMACIES: 'pharmacies',
  MEDICINES: 'medicines',
  EMERGENCY_SERVICES: 'emergencyServices',
  SYMPTOM_CHECKS: 'symptomChecks',
  SYMPTOMS: 'symptoms',
  CONTENT: 'content',
  SYSTEM_CONFIG: 'systemConfig'
};

export class DatabaseService {
  // Get the database instance
  static async getDb() {
    const { db } = await connectToDatabase();
    return db;
  }

  // User operations
  static async findUserByEmail(email: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.USERS).findOne({ email: email.toLowerCase() });
  }

  static async findUserById(id: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(id) });
  }

  static async createUser(userData: any) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.USERS).insertOne({
      ...userData,
      email: userData.email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  static async updateUser(id: string, updateData: any) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }

  // Doctor operations
  static async findDoctors(query = {}, options = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.DOCTORS).find(query, options).toArray();
  }

  static async findDoctorById(id: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.DOCTORS).findOne({ _id: new ObjectId(id) });
  }

  // Appointment operations
  static async createAppointment(appointmentData: any) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.APPOINTMENTS).insertOne({
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  static async findAppointmentsByUserId(userId: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.APPOINTMENTS)
      .find({ patientId: userId })
      .sort({ appointmentDate: -1 })
      .toArray();
  }

  static async findAppointmentsByDoctorId(doctorId: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.APPOINTMENTS)
      .find({ doctorId })
      .sort({ appointmentDate: -1 })
      .toArray();
  }

  // Medical Records operations
  static async findMedicalRecordsByUserId(userId: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.MEDICAL_RECORDS)
      .find({ patientId: userId })
      .sort({ recordDate: -1 })
      .toArray();
  }

  // Prescription operations
  static async findPrescriptionsByUserId(userId: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.PRESCRIPTIONS)
      .find({ patientId: userId })
      .sort({ prescribedDate: -1 })
      .toArray();
  }

  // Lab Test operations
  static async findLabTests(query = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.LAB_TESTS).find(query).toArray();
  }

  static async bookLabTest(testData: any) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.LAB_TESTS).insertOne({
      ...testData,
      status: 'booked',
      bookedAt: new Date()
    });
    return result;
  }

  // Pharmacy operations
  static async findPharmacies(query = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.PHARMACIES).find(query).toArray();
  }

  // Medicine operations
  static async findMedicines(query = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.MEDICINES).find(query).toArray();
  }

  // Emergency Services operations
  static async findEmergencyServices(query = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.EMERGENCY_SERVICES).find(query).toArray();
  }

  // Symptom operations
  static async findSymptomsByBodyPart(bodyPartId: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.SYMPTOMS)
      .find({ relatedBodyParts: bodyPartId })
      .toArray();
  }
  
  static async findAllSymptoms() {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.SYMPTOMS).find({}).toArray();
  }
  
  // Symptom Check operations
  static async saveSymptomCheck(symptomCheckData: any) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.SYMPTOM_CHECKS).insertOne({
      ...symptomCheckData,
      createdAt: new Date(),
      status: 'pending'
    });
    return result;
  }
  
  static async findSymptomChecks(query = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.SYMPTOM_CHECKS)
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }
  
  static async updateSymptomCheckStatus(id: string, status: 'pending' | 'reviewed' | 'escalated') {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.SYMPTOM_CHECKS).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date() 
        } 
      }
    );
  }
  
  static async getSymptomChecksCount() {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.SYMPTOM_CHECKS).countDocuments();
  }

  // Content Management operations
  static async findContent(query = {}, options = {}) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.CONTENT).find(query, options).toArray();
  }

  static async findContentById(id: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.CONTENT).findOne({ _id: new ObjectId(id) });
  }

  static async createContent(contentData: Content) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.CONTENT).insertOne({
      ...contentData,
      views: 0,
      createdAt: new Date(),
      lastModified: new Date()
    });
    return result;
  }

  static async updateContent(id: string, updateData: Partial<Content>) {
    const db = await this.getDb();
    const result = await db.collection(COLLECTIONS.CONTENT).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData,
          lastModified: new Date() 
        } 
      }
    );
    return result;
  }

  static async deleteContent(id: string) {
    const db = await this.getDb();
    return db.collection(COLLECTIONS.CONTENT).deleteOne({ _id: new ObjectId(id) });
  }

  static async getContentStats() {
    const db = await this.getDb();
    const articles = await db.collection(COLLECTIONS.CONTENT).countDocuments({ type: 'article' });
    const announcements = await db.collection(COLLECTIONS.CONTENT).countDocuments({ type: 'announcement' });
    const faqs = await db.collection(COLLECTIONS.CONTENT).countDocuments({ type: 'faq' });
    const help = await db.collection(COLLECTIONS.CONTENT).countDocuments({ type: 'help' });
    
    const published = await db.collection(COLLECTIONS.CONTENT).countDocuments({ status: 'published' });
    const draft = await db.collection(COLLECTIONS.CONTENT).countDocuments({ status: 'draft' });
    const scheduled = await db.collection(COLLECTIONS.CONTENT).countDocuments({ status: 'scheduled' });
    const archived = await db.collection(COLLECTIONS.CONTENT).countDocuments({ status: 'archived' });
    
    return {
      articles,
      announcements,
      faqs,
      help,
      total: articles + announcements + faqs + help,
      published,
      draft,
      scheduled,
      archived
    };
  }

  // System Configuration operations
  static async getSystemConfig() {
    const db = await this.getDb();
    const config = await db.collection(COLLECTIONS.SYSTEM_CONFIG).findOne({});
    
    if (!config) {
      // Return default config if not found
      return {
        general: {
          siteName: 'MedConnect',
          siteDescription: 'Patient-Centric Healthcare Platform',
          supportEmail: 'support@medconnect.com',
          contactPhone: '+1 (555) 123-4567',
          defaultLanguage: 'en-US',
          defaultTimeZone: 'America/New_York',
          maintenanceMode: false
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          appointmentReminders: true,
          medicationReminders: true,
          newsletterFrequency: 'weekly',
          adminAlerts: true
        },
        emailTemplates: {
          welcomeEmail: {
            subject: 'Welcome to MedConnect',
            enabled: true
          },
          appointmentConfirmation: {
            subject: 'Your Appointment has been Confirmed',
            enabled: true
          },
          appointmentReminder: {
            subject: 'Reminder: Upcoming Appointment',
            enabled: true
          },
          prescriptionReady: {
            subject: 'Your Prescription is Ready',
            enabled: true
          },
          labResultsReady: {
            subject: 'Your Lab Results are Available',
            enabled: true
          }
        },
        fees: {
          platformFee: 5,
          doctorCommission: 10,
          labTestCommission: 8,
          pharmacyCommission: 6,
          taxRate: 7,
          currencySymbol: '$',
          allowPromoCode: true
        },
        lastUpdated: new Date()
      };
    }
    
    return config;
  }

  static async updateSystemConfig(configData: Partial<SystemConfig>) {
    const db = await this.getDb();
    
    // Check if config exists
    const existingConfig = await db.collection(COLLECTIONS.SYSTEM_CONFIG).findOne({});
    
    if (!existingConfig) {
      // Create new config if it doesn't exist
      return db.collection(COLLECTIONS.SYSTEM_CONFIG).insertOne({
        ...configData,
        lastUpdated: new Date()
      });
    } else {
      // Update existing config
      return db.collection(COLLECTIONS.SYSTEM_CONFIG).updateOne(
        { _id: existingConfig._id },
        { 
          $set: { 
            ...configData,
            lastUpdated: new Date() 
          } 
        }
      );
    }
  }

  // Admin Dashboard Statistics
  static async getAdminDashboardStats() {
    const db = await this.getDb();
    
    const totalUsers = await db.collection(COLLECTIONS.USERS).countDocuments();
    const totalDoctors = await db.collection(COLLECTIONS.DOCTORS).countDocuments();
    const totalAppointments = await db.collection(COLLECTIONS.APPOINTMENTS).countDocuments();
    const symptomChecks = await db.collection(COLLECTIONS.SYMPTOM_CHECKS).countDocuments();
    
    // Get monthly signups for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySignups = await db.collection(COLLECTIONS.USERS).aggregate([
      { 
        $match: { 
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).toArray();
    
    // Get recent activity (appointments, symptom checks, content updates)
    const recentActivity = await db.collection(COLLECTIONS.APPOINTMENTS)
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
      
    return {
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        symptomChecks
      },
      monthlySignups,
      recentActivity
    };
  }
}

export default DatabaseService; 