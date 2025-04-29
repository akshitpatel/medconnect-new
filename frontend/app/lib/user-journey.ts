import { DatabaseService } from './db-service';
import { ObjectId } from 'mongodb';

export interface UserJourneyEvent {
  eventType: string;
  timestamp: Date;
  data: any;
}

export interface UserJourney {
  _id?: string | ObjectId;
  userId?: string;
  anonymousId: string;
  sessionId: string;
  startedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  journeyType: 'symptom_checker' | 'appointment_booking' | 'doctor_search' | 'other';
  events: UserJourneyEvent[];
  metadata: {
    userAgent?: string;
    clientIp?: string;
    referrer?: string;
    entryPage?: string;
    exitPage?: string;
    screenResolution?: string;
    deviceType?: string;
    browser?: string;
    platform?: string;
  };
  outcome?: {
    symptoms?: string[];
    bodyPart?: string;
    conditions?: string[];
    recommendedAction?: string;
    feedback?: 'helpful' | 'not-helpful';
    conversionType?: string;
  };
}

export class UserJourneyService {
  static async createJourney(journeyData: Partial<UserJourney>): Promise<string> {
    try {
      const db = await DatabaseService.getDb();
      const defaultJourney: Partial<UserJourney> = {
        anonymousId: `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        startedAt: new Date(),
        isCompleted: false,
        events: [],
        metadata: {},
      };
      
      const journey = { ...defaultJourney, ...journeyData };
      const result = await db.collection('userJourneys').insertOne(journey);
      
      return result.insertedId.toString();
    } catch (error) {
      console.error('Error creating user journey:', error);
      throw error;
    }
  }
  
  static async addEvent(journeyId: string, event: UserJourneyEvent): Promise<void> {
    try {
      const db = await DatabaseService.getDb();
      await db.collection('userJourneys').updateOne(
        { _id: new ObjectId(journeyId) },
        { 
          $push: { events: event },
          $set: { lastUpdated: new Date() }
        }
      );
    } catch (error) {
      console.error('Error adding event to user journey:', error);
      throw error;
    }
  }
  
  static async completeJourney(journeyId: string, outcome?: any): Promise<void> {
    try {
      const db = await DatabaseService.getDb();
      await db.collection('userJourneys').updateOne(
        { _id: new ObjectId(journeyId) },
        { 
          $set: { 
            isCompleted: true,
            completedAt: new Date(),
            outcome: outcome || {},
            lastUpdated: new Date()
          }
        }
      );
    } catch (error) {
      console.error('Error completing user journey:', error);
      throw error;
    }
  }
  
  static async getJourneysByUser(userId: string, limit = 10, skip = 0): Promise<UserJourney[]> {
    try {
      const db = await DatabaseService.getDb();
      const journeys = await db.collection('userJourneys')
        .find({ userId })
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      return journeys as UserJourney[];
    } catch (error) {
      console.error('Error getting user journeys:', error);
      throw error;
    }
  }
  
  static async getJourneysByAnonymousId(anonymousId: string): Promise<UserJourney[]> {
    try {
      const db = await DatabaseService.getDb();
      const journeys = await db.collection('userJourneys')
        .find({ anonymousId })
        .sort({ startedAt: -1 })
        .toArray();
      
      return journeys as UserJourney[];
    } catch (error) {
      console.error('Error getting anonymous user journeys:', error);
      throw error;
    }
  }
  
  static async getJourneyById(journeyId: string): Promise<UserJourney | null> {
    try {
      const db = await DatabaseService.getDb();
      const journey = await db.collection('userJourneys').findOne({
        _id: new ObjectId(journeyId)
      });
      
      return journey as UserJourney | null;
    } catch (error) {
      console.error('Error getting user journey by ID:', error);
      throw error;
    }
  }
  
  static async getRecentJourneys(limit = 20): Promise<UserJourney[]> {
    try {
      const db = await DatabaseService.getDb();
      const journeys = await db.collection('userJourneys')
        .find()
        .sort({ startedAt: -1 })
        .limit(limit)
        .toArray();
      
      return journeys as UserJourney[];
    } catch (error) {
      console.error('Error getting recent user journeys:', error);
      throw error;
    }
  }
  
  static async getJourneyStats(): Promise<any> {
    try {
      const db = await DatabaseService.getDb();
      const stats = await db.collection('userJourneys').aggregate([
        {
          $facet: {
            "byType": [
              { $group: { _id: "$journeyType", count: { $sum: 1 } } }
            ],
            "byCompletion": [
              { $group: { _id: "$isCompleted", count: { $sum: 1 } } }
            ],
            "byOutcome": [
              { $match: { "outcome.feedback": { $exists: true } } },
              { $group: { _id: "$outcome.feedback", count: { $sum: 1 } } }
            ],
            "recent": [
              { $sort: { startedAt: -1 } },
              { $limit: 10 },
              { $project: { 
                journeyType: 1, 
                isCompleted: 1, 
                startedAt: 1,
                completedAt: 1,
                sessionId: 1,
                "eventCount": { $size: "$events" }
              }}
            ]
          }
        }
      ]).toArray();
      
      return stats[0];
    } catch (error) {
      console.error('Error getting user journey stats:', error);
      throw error;
    }
  }
} 