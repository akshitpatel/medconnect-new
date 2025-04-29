import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { 
  HealthPassport, 
  PassportAccessRequest, 
  MedicalRecord, 
  VitalSigns,
  HEALTH_PASSPORT_COLLECTION,
  PASSPORT_ACCESS_REQUESTS_COLLECTION
} from '../models/health-passport';
import { generateRandomString } from '@/app/lib/utils';

export class HealthPassportService {
  // Create a new health passport
  static async createHealthPassport(passportData: Omit<HealthPassport, '_id' | 'created_at' | 'updated_at' | 'passport_number'>): Promise<HealthPassport> {
    const { db } = await connectToDatabase();
    
    // Generate a unique passport number
    const passport_number = await this.generateUniquePassportNumber(passportData.user_id);
    
    const newPassport: HealthPassport = {
      ...passportData,
      passport_number,
      created_at: new Date(),
      updated_at: new Date(),
      active: true,
      emergency_access: passportData.emergency_access || false,
      medical_records: passportData.medical_records || [],
      vaccinations: passportData.vaccinations || [],
      vital_signs: passportData.vital_signs || [],
      access_logs: passportData.access_logs || []
    };
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).insertOne(newPassport);
    
    return {
      ...newPassport,
      _id: result.insertedId
    };
  }
  
  // Get a health passport by user ID
  static async getHealthPassportByUserId(userId: string | ObjectId): Promise<HealthPassport | null> {
    const { db } = await connectToDatabase();
    
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return await db.collection(HEALTH_PASSPORT_COLLECTION).findOne({ user_id: userObjectId });
  }
  
  // Get a health passport by passport ID
  static async getHealthPassportById(passportId: string | ObjectId): Promise<HealthPassport | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    return await db.collection(HEALTH_PASSPORT_COLLECTION).findOne({ _id: passportObjectId });
  }
  
  // Update a health passport
  static async updateHealthPassport(passportId: string | ObjectId, updates: Partial<HealthPassport>): Promise<HealthPassport | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    // Remove fields that shouldn't be updated directly
    const { _id, passport_number, created_at, user_id, ...updateData } = updates;
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).findOneAndUpdate(
      { _id: passportObjectId },
      { 
        $set: { 
          ...updateData,
          updated_at: new Date() 
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result.value;
  }
  
  // Delete a health passport (soft delete)
  static async deleteHealthPassport(passportId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).updateOne(
      { _id: passportObjectId },
      { $set: { active: false, updated_at: new Date() } }
    );
    
    return result.modifiedCount === 1;
  }
  
  // Add a medical record to a health passport
  static async addMedicalRecord(passportId: string | ObjectId, record: Omit<MedicalRecord, 'record_id'>): Promise<MedicalRecord | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    const recordId = new ObjectId();
    const newRecord: MedicalRecord = {
      ...record,
      record_id: recordId
    };
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).findOneAndUpdate(
      { _id: passportObjectId },
      { 
        $push: { medical_records: newRecord },
        $set: { updated_at: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (!result.value) return null;
    
    const addedRecord = result.value.medical_records?.find(
      (r: MedicalRecord) => r.record_id.toString() === recordId.toString()
    );
    
    return addedRecord || null;
  }
  
  // Update a medical record
  static async updateMedicalRecord(passportId: string | ObjectId, recordId: string | ObjectId, updates: Partial<MedicalRecord>): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    const recordObjectId = typeof recordId === 'string' ? new ObjectId(recordId) : recordId;
    
    // Build update object for nested array update
    const updateFields: { [key: string]: any } = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'record_id') { // Don't allow updating the record_id
        updateFields[`medical_records.$.${key}`] = value;
      }
    });
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).updateOne(
      { 
        _id: passportObjectId,
        "medical_records.record_id": recordObjectId
      },
      { 
        $set: {
          ...updateFields,
          updated_at: new Date()
        }
      }
    );
    
    return result.modifiedCount === 1;
  }
  
  // Delete a medical record
  static async deleteMedicalRecord(passportId: string | ObjectId, recordId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    const recordObjectId = typeof recordId === 'string' ? new ObjectId(recordId) : recordId;
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).updateOne(
      { _id: passportObjectId },
      { 
        $pull: { medical_records: { record_id: recordObjectId } },
        $set: { updated_at: new Date() }
      }
    );
    
    return result.modifiedCount === 1;
  }
  
  // Add vital signs to a health passport
  static async addVitalSigns(passportId: string | ObjectId, vitalSigns: VitalSigns): Promise<VitalSigns | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    // Ensure date is set
    const newVitalSigns: VitalSigns = {
      ...vitalSigns,
      date: vitalSigns.date || new Date()
    };
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).findOneAndUpdate(
      { _id: passportObjectId },
      { 
        $push: { vital_signs: newVitalSigns },
        $set: { updated_at: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (!result.value) return null;
    
    // Get the latest vital signs entry (assuming it's the one we just added)
    const addedVitalSigns = result.value.vital_signs?.slice(-1)[0];
    
    return addedVitalSigns || null;
  }
  
  // Generate access code for QR
  static async generateAccessCode(passportId: string | ObjectId, expirationHours: number = 24): Promise<string | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    // Generate a random access code
    const accessCode = generateRandomString(16);
    
    // Set expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);
    
    const result = await db.collection(HEALTH_PASSPORT_COLLECTION).findOneAndUpdate(
      { _id: passportObjectId },
      { 
        $set: { 
          access_code: accessCode,
          access_code_expires: expiresAt,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    return result.value ? accessCode : null;
  }
  
  // Access passport with access code
  static async accessWithCode(accessCode: string, accessorInfo: { type: string; id: ObjectId; name: string; }): Promise<HealthPassport | null> {
    const { db } = await connectToDatabase();
    
    // Find passport with the given access code that hasn't expired
    const passport = await db.collection(HEALTH_PASSPORT_COLLECTION).findOne({
      access_code: accessCode,
      access_code_expires: { $gt: new Date() },
      active: true
    });
    
    if (!passport) return null;
    
    // Log the access
    const accessLog = {
      accessed_by: accessorInfo,
      access_time: new Date(),
      access_method: 'QR',
      ip_address: '', // In a real implementation, this would come from the request
      device_info: '' // In a real implementation, this would come from the request
    };
    
    await db.collection(HEALTH_PASSPORT_COLLECTION).updateOne(
      { _id: passport._id },
      { 
        $push: { access_logs: accessLog },
        $set: { updated_at: new Date() }
      }
    );
    
    return passport;
  }
  
  // Request access to a passport
  static async requestAccess(passportId: string | ObjectId, requestorInfo: PassportAccessRequest['requestor'], accessLevel: string, reason?: string): Promise<PassportAccessRequest | null> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    // Check if passport exists
    const passport = await db.collection(HEALTH_PASSPORT_COLLECTION).findOne({
      _id: passportObjectId,
      active: true
    });
    
    if (!passport) return null;
    
    // Set expiration for the request (default 48 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    const accessRequest: PassportAccessRequest = {
      passport_id: passportObjectId,
      requestor: requestorInfo,
      requested_at: new Date(),
      expires_at: expiresAt,
      status: 'Pending',
      access_level: accessLevel,
      reason: reason || '',
      notification_sent: false
    };
    
    const result = await db.collection(PASSPORT_ACCESS_REQUESTS_COLLECTION).insertOne(accessRequest);
    
    return {
      ...accessRequest,
      _id: result.insertedId
    };
  }
  
  // Get access requests for a passport
  static async getAccessRequests(passportId: string | ObjectId, status?: string): Promise<PassportAccessRequest[]> {
    const { db } = await connectToDatabase();
    
    const passportObjectId = typeof passportId === 'string' ? new ObjectId(passportId) : passportId;
    
    const query: any = { passport_id: passportObjectId };
    if (status) query.status = status;
    
    return await db.collection(PASSPORT_ACCESS_REQUESTS_COLLECTION).find(query).toArray();
  }
  
  // Respond to an access request
  static async respondToAccessRequest(requestId: string | ObjectId, response: 'Approved' | 'Rejected', approverId?: string | ObjectId): Promise<PassportAccessRequest | null> {
    const { db } = await connectToDatabase();
    
    const requestObjectId = typeof requestId === 'string' ? new ObjectId(requestId) : requestId;
    const approverObjectId = approverId ? (typeof approverId === 'string' ? new ObjectId(approverId) : approverId) : undefined;
    
    const updateData: any = {
      status: response,
      notification_sent: false
    };
    
    if (response === 'Approved') {
      updateData.approved_at = new Date();
      if (approverObjectId) {
        updateData.approved_by = approverObjectId;
      }
    }
    
    const result = await db.collection(PASSPORT_ACCESS_REQUESTS_COLLECTION).findOneAndUpdate(
      { _id: requestObjectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result.value;
  }
  
  // Generate a unique passport number
  private static async generateUniquePassportNumber(userId?: string | ObjectId): Promise<string> {
    const { db } = await connectToDatabase();
    let isUnique = false;
    let passportNumber = '';
    
    // Get user data to access phone number
    let userPhone = '';
    if (userId) {
      const user = await db.collection('users').findOne({ _id: typeof userId === 'string' ? new ObjectId(userId) : userId });
      if (user && user.phone) {
        // Clean the phone number to use only the last 6 digits
        userPhone = user.phone.replace(/\D/g, '').slice(-6);
      }
    }
    
    while (!isUnique) {
      // If we have a phone number, use it as part of the passport number
      if (userPhone) {
        // Format: HP-PHONE-XXXX (where PHONE is last 6 digits of phone and X is random)
        passportNumber = 'HP-' + userPhone + '-' + generateRandomString(4);
      } else {
        // Fallback to completely random number
        passportNumber = 'HP-' + generateRandomString(8);
      }
      
      // Check if this passport number already exists
      const existingPassport = await db.collection(HEALTH_PASSPORT_COLLECTION).findOne({ 
        passport_number: passportNumber 
      });
      
      // If no existing passport with this number is found, it's unique
      if (!existingPassport) {
        isUnique = true;
      }
    }
    
    return passportNumber;
  }
  
  /**
   * Search for health passports using various criteria
   * @param query Search criteria
   * @param page Page number
   * @param limit Results per page
   * @returns Object containing passports and total count
   */
  static async searchHealthPassports(query: any, page: number = 1, limit: number = 10) {
    try {
      const { db } = await connectToDatabase();
      
      const skip = (page - 1) * limit;
      const filter: any = { active: true };
      
      // Build filter based on provided query parameters
      if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
      }
      
      if (query.dob) {
        filter.dob = new Date(query.dob);
      }
      
      if (query.passport_id) {
        filter._id = new ObjectId(query.passport_id);
      }
      
      if (query.email) {
        filter.email = { $regex: query.email, $options: 'i' };
      }
      
      if (query.phone) {
        filter.phone = { $regex: query.phone, $options: 'i' };
      }
      
      if (query.user_id) {
        filter.user_id = new ObjectId(query.user_id);
      }
      
      // Get total count for pagination
      const total = await db.collection(HEALTH_PASSPORT_COLLECTION).countDocuments(filter);
      
      // Get the passports with pagination
      const passports = await db.collection(HEALTH_PASSPORT_COLLECTION)
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      return { passports, total };
    } catch (error) {
      console.error('Error searching health passports:', error);
      return null;
    }
  }
} 