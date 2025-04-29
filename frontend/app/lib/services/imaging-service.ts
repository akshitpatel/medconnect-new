import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { 
  ImagingProvider, 
  ImagingType, 
  ImagingAppointment, 
  ImagingResult,
  AppointmentStatus,
  ResultStatus,
  IMAGING_PROVIDERS_COLLECTION,
  IMAGING_APPOINTMENTS_COLLECTION,
  IMAGING_RESULTS_COLLECTION,
  IMAGING_TYPES_COLLECTION
} from '../models/imaging-services';
import { formatDate } from '../utils';

export class ImagingService {
  /*** IMAGING PROVIDERS ***/
  
  /**
   * Create a new imaging provider
   */
  static async createImagingProvider(providerData: Omit<ImagingProvider, '_id' | 'created_at' | 'updated_at'>): Promise<ImagingProvider> {
    const { db } = await connectToDatabase();
    
    const newProvider: ImagingProvider = {
      ...providerData,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection(IMAGING_PROVIDERS_COLLECTION).insertOne(newProvider);
    
    return {
      ...newProvider,
      _id: result.insertedId
    };
  }
  
  /**
   * Get an imaging provider by ID
   */
  static async getImagingProviderById(providerId: string | ObjectId): Promise<ImagingProvider | null> {
    const { db } = await connectToDatabase();
    
    const providerObjectId = typeof providerId === 'string' ? new ObjectId(providerId) : providerId;
    
    return await db.collection(IMAGING_PROVIDERS_COLLECTION).findOne({ _id: providerObjectId });
  }
  
  /**
   * Update an imaging provider
   */
  static async updateImagingProvider(providerId: string | ObjectId, updates: Partial<ImagingProvider>): Promise<ImagingProvider | null> {
    const { db } = await connectToDatabase();
    
    const providerObjectId = typeof providerId === 'string' ? new ObjectId(providerId) : providerId;
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, ...updateData } = updates;
    
    const result = await db.collection(IMAGING_PROVIDERS_COLLECTION).findOneAndUpdate(
      { _id: providerObjectId },
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
  
  /**
   * Delete an imaging provider (soft delete)
   */
  static async deleteImagingProvider(providerId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const providerObjectId = typeof providerId === 'string' ? new ObjectId(providerId) : providerId;
    
    const result = await db.collection(IMAGING_PROVIDERS_COLLECTION).updateOne(
      { _id: providerObjectId },
      { $set: { active: false, updated_at: new Date() } }
    );
    
    return result.modifiedCount === 1;
  }
  
  /**
   * Search for imaging providers
   */
  static async searchImagingProviders(query: any, page: number = 1, limit: number = 10) {
    const { db } = await connectToDatabase();
    
    const skip = (page - 1) * limit;
    const filter: any = { active: true };
    
    // Build filter based on provided query parameters
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }
    
    if (query.specialty) {
      filter.specialties = { $in: [query.specialty] };
    }
    
    if (query.location) {
      // If location coordinates and max distance are provided, use geospatial query
      if (query.location.coordinates && query.location.maxDistance) {
        filter.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: query.location.coordinates // [longitude, latitude]
            },
            $maxDistance: query.location.maxDistance // in meters
          }
        };
      } 
      // Otherwise, search by city/state/zip
      else {
        if (query.location.city) {
          filter['address.city'] = { $regex: query.location.city, $options: 'i' };
        }
        if (query.location.state) {
          filter['address.state'] = { $regex: query.location.state, $options: 'i' };
        }
        if (query.location.zip) {
          filter['address.zip'] = query.location.zip;
        }
      }
    }
    
    if (query.insurance) {
      filter.insurance_accepted = { $in: [query.insurance] };
    }
    
    // Get total count for pagination
    const total = await db.collection(IMAGING_PROVIDERS_COLLECTION).countDocuments(filter);
    
    // Get the providers with pagination
    const providers = await db.collection(IMAGING_PROVIDERS_COLLECTION)
      .find(filter)
      .sort({ rating: -1, name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return { providers, total };
  }
  
  /*** IMAGING TYPES ***/
  
  /**
   * Create a new imaging type
   */
  static async createImagingType(typeData: Omit<ImagingType, '_id' | 'created_at' | 'updated_at'>): Promise<ImagingType> {
    const { db } = await connectToDatabase();
    
    const newType: ImagingType = {
      ...typeData,
      created_at: new Date(),
      updated_at: new Date(),
      active: true
    };
    
    const result = await db.collection(IMAGING_TYPES_COLLECTION).insertOne(newType);
    
    return {
      ...newType,
      _id: result.insertedId
    };
  }
  
  /**
   * Get an imaging type by ID
   */
  static async getImagingTypeById(typeId: string | ObjectId): Promise<ImagingType | null> {
    const { db } = await connectToDatabase();
    
    const typeObjectId = typeof typeId === 'string' ? new ObjectId(typeId) : typeId;
    
    return await db.collection(IMAGING_TYPES_COLLECTION).findOne({ _id: typeObjectId, active: true });
  }
  
  /**
   * Get all active imaging types
   */
  static async getAllImagingTypes(): Promise<ImagingType[]> {
    const { db } = await connectToDatabase();
    
    return await db.collection(IMAGING_TYPES_COLLECTION)
      .find({ active: true })
      .sort({ name: 1 })
      .toArray();
  }
  
  /**
   * Update an imaging type
   */
  static async updateImagingType(typeId: string | ObjectId, updates: Partial<ImagingType>): Promise<ImagingType | null> {
    const { db } = await connectToDatabase();
    
    const typeObjectId = typeof typeId === 'string' ? new ObjectId(typeId) : typeId;
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, ...updateData } = updates;
    
    const result = await db.collection(IMAGING_TYPES_COLLECTION).findOneAndUpdate(
      { _id: typeObjectId },
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
  
  /**
   * Delete an imaging type (soft delete)
   */
  static async deleteImagingType(typeId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const typeObjectId = typeof typeId === 'string' ? new ObjectId(typeId) : typeId;
    
    const result = await db.collection(IMAGING_TYPES_COLLECTION).updateOne(
      { _id: typeObjectId },
      { $set: { active: false, updated_at: new Date() } }
    );
    
    return result.modifiedCount === 1;
  }
  
  /*** IMAGING APPOINTMENTS ***/
  
  /**
   * Create a new imaging appointment
   */
  static async createAppointment(appointmentData: Omit<ImagingAppointment, '_id' | 'created_at' | 'updated_at'>): Promise<ImagingAppointment> {
    const { db } = await connectToDatabase();
    
    const newAppointment: ImagingAppointment = {
      ...appointmentData,
      created_at: new Date(),
      updated_at: new Date(),
      status: appointmentData.status || 'scheduled',
      notification_status: appointmentData.notification_status || {
        confirmation_sent: false,
        reminder_sent: false,
        result_available_sent: false
      }
    };
    
    const result = await db.collection(IMAGING_APPOINTMENTS_COLLECTION).insertOne(newAppointment);
    
    return {
      ...newAppointment,
      _id: result.insertedId
    };
  }
  
  /**
   * Get an appointment by ID
   */
  static async getAppointmentById(appointmentId: string | ObjectId): Promise<ImagingAppointment | null> {
    const { db } = await connectToDatabase();
    
    const appointmentObjectId = typeof appointmentId === 'string' ? new ObjectId(appointmentId) : appointmentId;
    
    return await db.collection(IMAGING_APPOINTMENTS_COLLECTION).findOne({ _id: appointmentObjectId });
  }
  
  /**
   * Get appointments for a user
   */
  static async getUserAppointments(userId: string | ObjectId, status?: AppointmentStatus): Promise<ImagingAppointment[]> {
    const { db } = await connectToDatabase();
    
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const filter: any = { user_id: userObjectId };
    
    if (status) {
      filter.status = status;
    }
    
    return await db.collection(IMAGING_APPOINTMENTS_COLLECTION)
      .find(filter)
      .sort({ appointment_date: 1 })
      .toArray();
  }
  
  /**
   * Get appointments for a provider
   */
  static async getProviderAppointments(providerId: string | ObjectId, date?: Date, status?: AppointmentStatus): Promise<ImagingAppointment[]> {
    const { db } = await connectToDatabase();
    
    const providerObjectId = typeof providerId === 'string' ? new ObjectId(providerId) : providerId;
    
    const filter: any = { provider_id: providerObjectId };
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      // Create start and end of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.appointment_date = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    return await db.collection(IMAGING_APPOINTMENTS_COLLECTION)
      .find(filter)
      .sort({ appointment_date: 1 })
      .toArray();
  }
  
  /**
   * Update an appointment
   */
  static async updateAppointment(appointmentId: string | ObjectId, updates: Partial<ImagingAppointment>): Promise<ImagingAppointment | null> {
    const { db } = await connectToDatabase();
    
    const appointmentObjectId = typeof appointmentId === 'string' ? new ObjectId(appointmentId) : appointmentId;
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, user_id, ...updateData } = updates;
    
    const result = await db.collection(IMAGING_APPOINTMENTS_COLLECTION).findOneAndUpdate(
      { _id: appointmentObjectId },
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
  
  /**
   * Cancel an appointment
   */
  static async cancelAppointment(appointmentId: string | ObjectId, reason?: string): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const appointmentObjectId = typeof appointmentId === 'string' ? new ObjectId(appointmentId) : appointmentId;
    
    const result = await db.collection(IMAGING_APPOINTMENTS_COLLECTION).updateOne(
      { _id: appointmentObjectId },
      { 
        $set: { 
          status: 'cancelled',
          cancellation_reason: reason,
          updated_at: new Date() 
        } 
      }
    );
    
    return result.modifiedCount === 1;
  }
  
  /**
   * Check provider availability
   */
  static async checkProviderAvailability(providerId: string | ObjectId, date: Date): Promise<{ available: boolean, availableSlots?: Date[] }> {
    const { db } = await connectToDatabase();
    
    const providerObjectId = typeof providerId === 'string' ? new ObjectId(providerId) : providerId;
    
    // Get provider to check operating hours
    const provider = await this.getImagingProviderById(providerObjectId);
    
    if (!provider) {
      return { available: false };
    }
    
    // Check if the provider is open on the specified date
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'monday' }).toLowerCase();
    const operatingHours = provider.hours_of_operation[dayOfWeek];
    
    if (!operatingHours) {
      return { available: false }; // Provider is closed on this day
    }
    
    // Create start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all appointments for the provider on the specified date
    const appointments = await db.collection(IMAGING_APPOINTMENTS_COLLECTION).find({
      provider_id: providerObjectId,
      appointment_date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled', 'no_show'] }
    }).toArray();
    
    // Convert operating hours to Date objects
    const [openHour, openMinute] = operatingHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = operatingHours.close.split(':').map(Number);
    
    const openTime = new Date(date);
    openTime.setHours(openHour, openMinute, 0, 0);
    
    const closeTime = new Date(date);
    closeTime.setHours(closeHour, closeMinute, 0, 0);
    
    // Generate available time slots (assuming 30-minute slots)
    const availableSlots = [];
    const slotDuration = 30; // in minutes
    let currentSlot = new Date(openTime);
    
    while (currentSlot < closeTime) {
      // Check if this slot overlaps with any existing appointment
      const isSlotTaken = appointments.some(appointment => {
        const appointmentStart = new Date(appointment.appointment_date);
        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration_minutes);
        
        const slotEnd = new Date(currentSlot);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
        
        // Check for overlap
        return (currentSlot < appointmentEnd && slotEnd > appointmentStart);
      });
      
      if (!isSlotTaken) {
        availableSlots.push(new Date(currentSlot));
      }
      
      // Move to next slot
      currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
    }
    
    return { 
      available: availableSlots.length > 0,
      availableSlots
    };
  }
  
  /*** IMAGING RESULTS ***/
  
  /**
   * Create a new imaging result
   */
  static async createImagingResult(resultData: Omit<ImagingResult, '_id' | 'created_at' | 'updated_at'>): Promise<ImagingResult> {
    const { db } = await connectToDatabase();
    
    const newResult: ImagingResult = {
      ...resultData,
      created_at: new Date(),
      updated_at: new Date(),
      viewed_by_patient: false,
      viewed_by_provider: false,
      notifications_sent: resultData.notifications_sent || {
        patient: false,
        referring_provider: false
      }
    };
    
    const result = await db.collection(IMAGING_RESULTS_COLLECTION).insertOne(newResult);
    
    // Update the corresponding appointment status to completed
    if (resultData.appointment_id) {
      await this.updateAppointment(resultData.appointment_id, { 
        status: 'completed',
        notification_status: {
          confirmation_sent: true,
          reminder_sent: true,
          result_available_sent: true
        }
      });
    }
    
    return {
      ...newResult,
      _id: result.insertedId
    };
  }
  
  /**
   * Get an imaging result by ID
   */
  static async getImagingResultById(resultId: string | ObjectId): Promise<ImagingResult | null> {
    const { db } = await connectToDatabase();
    
    const resultObjectId = typeof resultId === 'string' ? new ObjectId(resultId) : resultId;
    
    return await db.collection(IMAGING_RESULTS_COLLECTION).findOne({ _id: resultObjectId });
  }
  
  /**
   * Get imaging results for a user
   */
  static async getUserImagingResults(userId: string | ObjectId): Promise<ImagingResult[]> {
    const { db } = await connectToDatabase();
    
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    return await db.collection(IMAGING_RESULTS_COLLECTION)
      .find({ user_id: userObjectId })
      .sort({ upload_date: -1 })
      .toArray();
  }
  
  /**
   * Get imaging results for an appointment
   */
  static async getAppointmentResults(appointmentId: string | ObjectId): Promise<ImagingResult | null> {
    const { db } = await connectToDatabase();
    
    const appointmentObjectId = typeof appointmentId === 'string' ? new ObjectId(appointmentId) : appointmentId;
    
    return await db.collection(IMAGING_RESULTS_COLLECTION).findOne({ appointment_id: appointmentObjectId });
  }
  
  /**
   * Update an imaging result
   */
  static async updateImagingResult(resultId: string | ObjectId, updates: Partial<ImagingResult>): Promise<ImagingResult | null> {
    const { db } = await connectToDatabase();
    
    const resultObjectId = typeof resultId === 'string' ? new ObjectId(resultId) : resultId;
    
    // Remove fields that shouldn't be updated directly
    const { _id, created_at, user_id, appointment_id, ...updateData } = updates;
    
    const result = await db.collection(IMAGING_RESULTS_COLLECTION).findOneAndUpdate(
      { _id: resultObjectId },
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
  
  /**
   * Mark result as viewed by patient
   */
  static async markResultViewedByPatient(resultId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const resultObjectId = typeof resultId === 'string' ? new ObjectId(resultId) : resultId;
    
    const result = await db.collection(IMAGING_RESULTS_COLLECTION).updateOne(
      { _id: resultObjectId },
      { 
        $set: { 
          viewed_by_patient: true,
          updated_at: new Date() 
        } 
      }
    );
    
    return result.modifiedCount === 1;
  }
  
  /**
   * Mark result as viewed by provider
   */
  static async markResultViewedByProvider(resultId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const resultObjectId = typeof resultId === 'string' ? new ObjectId(resultId) : resultId;
    
    const result = await db.collection(IMAGING_RESULTS_COLLECTION).updateOne(
      { _id: resultObjectId },
      { 
        $set: { 
          viewed_by_provider: true,
          updated_at: new Date() 
        } 
      }
    );
    
    return result.modifiedCount === 1;
  }
} 