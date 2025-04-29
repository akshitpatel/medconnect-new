import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { MongoClient } from 'mongodb';
import { UserJourneyService } from '@/app/lib/user-journey';

// For direct MongoDB connection (as a fallback)
let cachedClient: MongoClient | null = null;
async function getDirectDbConnection() {
  if (cachedClient) {
    return {
      client: cachedClient,
      db: cachedClient.db()
    };
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  console.log('Direct MongoDB connection established');
  
  return {
    client,
    db: client.db()
  };
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log the received data for debugging
    console.log('Analytics log received:', JSON.stringify(data));
    
    // Validate required fields
    if (!data.action) {
      return NextResponse.json(
        { error: 'Action field is required' },
        { status: 400 }
      );
    }
    
    // Add timestamp if not provided
    if (!data.data?.timestamp) {
      data.data = {
        ...data.data,
        timestamp: new Date().toISOString()
      };
    }
    
    // Add client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    
    // Add user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    // Add referrer if available
    const referrer = request.headers.get('referer') || undefined;
    
    // Extract resolution from UA if possible (simplified)
    let deviceInfo = {
      deviceType: 'unknown',
      browser: 'unknown',
      platform: 'unknown'
    };
    
    if (userAgent) {
      if (userAgent.includes('Mobile')) deviceInfo.deviceType = 'mobile';
      else if (userAgent.includes('Tablet')) deviceInfo.deviceType = 'tablet';
      else deviceInfo.deviceType = 'desktop';
      
      if (userAgent.includes('Chrome')) deviceInfo.browser = 'Chrome';
      else if (userAgent.includes('Firefox')) deviceInfo.browser = 'Firefox';
      else if (userAgent.includes('Safari')) deviceInfo.browser = 'Safari';
      else if (userAgent.includes('Edge')) deviceInfo.browser = 'Edge';
      
      if (userAgent.includes('Windows')) deviceInfo.platform = 'Windows';
      else if (userAgent.includes('Mac')) deviceInfo.platform = 'Mac';
      else if (userAgent.includes('Linux')) deviceInfo.platform = 'Linux';
      else if (userAgent.includes('Android')) deviceInfo.platform = 'Android';
      else if (userAgent.includes('iOS')) deviceInfo.platform = 'iOS';
    }
    
    // Create analytics entry
    const analyticsEntry = {
      action: data.action,
      data: data.data || {},
      clientIp,
      userAgent,
      referrer,
      deviceInfo,
      createdAt: new Date()
    };
    
    let dbInsertResult;
    let directDbUsed = false;
    
    // First try using DatabaseService
    try {
      const db = await DatabaseService.getDb();
      dbInsertResult = await db.collection('analytics').insertOne(analyticsEntry);
      console.log('Analytics entry saved via DatabaseService:', dbInsertResult.insertedId.toString());
    } catch (dbServiceError) {
      console.error('Error using DatabaseService, falling back to direct connection:', dbServiceError);
      
      // Fallback to direct connection
      try {
        const { db } = await getDirectDbConnection();
        dbInsertResult = await db.collection('analytics').insertOne(analyticsEntry);
        directDbUsed = true;
        console.log('Analytics entry saved via direct connection:', dbInsertResult.insertedId.toString());
      } catch (directDbError) {
        console.error('Failed to save analytics with direct connection:', directDbError);
        throw directDbError;
      }
    }
    
    // Also update related collections for specific actions
    if (data.action.startsWith('symptom_check_')) {
      try {
        let db;
        if (directDbUsed) {
          db = (await getDirectDbConnection()).db;
        } else {
          db = await DatabaseService.getDb();
        }
        await updateSymptomCheckerStats(data, db);
        
        // Update or create user journey
        await updateUserJourney(data, analyticsEntry);
      } catch (updateError) {
        console.error('Error updating stats or user journey:', updateError);
        // Continue execution - we don't want to fail the request if this update fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      id: dbInsertResult?.insertedId?.toString(),
      message: 'Analytics logged successfully'
    });
    
  } catch (error: any) {
    console.error('Error logging analytics:', error);
    return NextResponse.json(
      { error: 'Failed to log analytics', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to update symptom checker related stats
async function updateSymptomCheckerStats(data: any, db: any) {
  try {
    console.log('Updating symptom checker stats for action:', data.action);
    
    // If this is a symptom_check_completed event, update the symptom checks collection
    if (data.action === 'symptom_check_completed') {
      const predictionId = data.data?.predictionId || data.data?.sessionId;
      
      if (predictionId) {
        const result = await db.collection('symptomChecks').updateOne(
          { _id: predictionId },
          { 
            $set: { 
              completed: true,
              completedAt: new Date(),
              symptoms: data.data?.symptoms || []
            } 
          },
          { upsert: true } // Create if not exists
        );
        console.log('Updated/created symptom check for completion:', predictionId, result);
      }
    }
    
    // If this is a symptom_check_user_info event, update the symptom checks collection with user info
    if (data.action === 'symptom_check_user_info') {
      const predictionId = data.data?.predictionId || data.data?.sessionId;
      
      if (predictionId && data.data?.user) {
        const result = await db.collection('symptomChecks').updateOne(
          { _id: predictionId },
          { 
            $set: { 
              userData: data.data.user,
              hasReports: data.data.hasReports || false
            } 
          },
          { upsert: true } // Create if not exists
        );
        console.log('Updated/created symptom check for user info:', predictionId, result);
      }
    }
    
    // If this is a symptom_check_feedback event, update the symptom checks collection with feedback
    if (data.action === 'symptom_check_feedback') {
      const predictionId = data.data?.predictionId || data.data?.sessionId;
      
      if (predictionId) {
        const updateData: any = { 
          feedback: data.data.isHelpful ? 'helpful' : 'not-helpful',
          feedbackAt: new Date()
        };
        
        // Also include symptoms if they're provided in the feedback
        if (data.data?.symptoms && Array.isArray(data.data.symptoms)) {
          updateData.symptoms = data.data.symptoms;
        }
        
        // For any symptom_check event, we'll create an entry in symptomChecks if one doesn't exist
        const result = await db.collection('symptomChecks').updateOne(
          { _id: predictionId },
          { 
            $set: updateData 
          },
          { upsert: true } // Create if not exists
        );
        
        console.log('Updated/created symptom check for feedback:', predictionId, result);
      } else {
        console.error('Missing predictionId or sessionId for feedback event:', data);
      }
    }
    
    // For ANY symptom check event, ensure we have at least a basic record
    if (data.data?.sessionId && !data.data?.predictionId) {
      const sessionId = data.data.sessionId;
      
      // Create a basic record for any symptom check event
      const checkData: any = {
        lastUpdated: new Date(),
        action: data.action
      };
      
      // Include any symptoms if they're in the data
      if (data.data?.symptoms) {
        checkData.symptoms = data.data.symptoms;
      }
      
      // Include any body part if it's in the data
      if (data.data?.bodyPart) {
        checkData.bodyPart = data.data.bodyPart;
      }
      
      const result = await db.collection('symptomChecks').updateOne(
        { _id: sessionId },
        { 
          $set: checkData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true } // Create if not exists
      );
      
      console.log('Created/updated basic symptom check record:', sessionId, result);
    }
  } catch (error) {
    console.error('Error updating symptom checker stats:', error);
    throw error; // Re-throw to let caller handle it
  }
}

// Helper function to update user journey
async function updateUserJourney(data: any, analyticsEntry: any) {
  if (!data.data?.sessionId) {
    console.log('No sessionId provided, skipping user journey update');
    return;
  }
  
  const sessionId = data.data.sessionId;
  const userId = data.data.userId || undefined;
  const action = data.action;
  
  try {
    // Get any existing journey for this session
    const db = await DatabaseService.getDb();
    const existingJourney = await db.collection('userJourneys').findOne({ sessionId });
    
    // Create a new event from the analytics data
    const journeyEvent = {
      eventType: action,
      timestamp: new Date(data.data.timestamp),
      data: data.data
    };
    
    if (!existingJourney) {
      // Create a new journey if none exists
      console.log('Creating new user journey for session:', sessionId);
      
      // Determine journey type
      let journeyType: 'symptom_checker' | 'appointment_booking' | 'doctor_search' | 'other' = 'other';
      
      if (action.startsWith('symptom_check_')) {
        journeyType = 'symptom_checker';
      } else if (action.includes('appointment')) {
        journeyType = 'appointment_booking';
      } else if (action.includes('doctor')) {
        journeyType = 'doctor_search';
      }
      
      // Create metadata from analytics entry
      const metadata = {
        userAgent: analyticsEntry.userAgent,
        clientIp: analyticsEntry.clientIp,
        referrer: analyticsEntry.referrer,
        deviceType: analyticsEntry.deviceInfo?.deviceType,
        browser: analyticsEntry.deviceInfo?.browser,
        platform: analyticsEntry.deviceInfo?.platform,
      };
      
      // Create the journey
      const journeyData = {
        userId,
        sessionId,
        journeyType,
        metadata,
        events: [journeyEvent],
        startedAt: new Date(data.data.timestamp),
        isCompleted: false,
      };
      
      await UserJourneyService.createJourney(journeyData);
    } else {
      // Update existing journey
      console.log('Adding event to existing user journey:', existingJourney._id);
      
      // Add the event
      await db.collection('userJourneys').updateOne(
        { _id: existingJourney._id },
        { 
          $push: { events: journeyEvent },
          $set: { lastUpdated: new Date() }
        }
      );
      
      // If this is a completion event, mark the journey as completed
      if (action === 'symptom_check_completed') {
        let outcome = {};
        
        // Extract outcome data from the completion event
        if (data.data.symptoms) outcome = { ...outcome, symptoms: data.data.symptoms };
        if (data.data.bodyPart) outcome = { ...outcome, bodyPart: data.data.bodyPart };
        if (data.data.possibleCauses) outcome = { ...outcome, conditions: data.data.possibleCauses };
        
        await db.collection('userJourneys').updateOne(
          { _id: existingJourney._id },
          { 
            $set: { 
              isCompleted: true,
              completedAt: new Date(data.data.timestamp),
              outcome,
              lastUpdated: new Date()
            }
          }
        );
      }
      
      // If this is a feedback event, update the outcome
      if (action === 'symptom_check_feedback' && data.data.isHelpful !== undefined) {
        await db.collection('userJourneys').updateOne(
          { _id: existingJourney._id },
          { 
            $set: { 
              'outcome.feedback': data.data.isHelpful ? 'helpful' : 'not-helpful',
              lastUpdated: new Date()
            }
          }
        );
      }
      
      // If user ID is provided and journey doesn't have it, add it
      if (userId && !existingJourney.userId) {
        await db.collection('userJourneys').updateOne(
          { _id: existingJourney._id },
          { 
            $set: { 
              userId,
              lastUpdated: new Date()
            }
          }
        );
      }
    }
  } catch (error) {
    console.error('Error updating user journey:', error);
    throw error;
  }
} 