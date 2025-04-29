import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, MongoClientOptions, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let isConnecting = false;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Helper function to connect to the database with retry logic
async function connectToDatabase(retryCount = 0): Promise<{ client: MongoClient, db: Db }> {
  // Return cached connection if available
  if (cachedClient) {
    try {
      // Test the connection with a ping
      await cachedClient.db().admin().ping();
      return {
        client: cachedClient,
        db: cachedClient.db()
      };
    } catch (error) {
      console.warn("Cached MongoDB connection no longer valid, reconnecting...");
      cachedClient = null;
    }
  }
  
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    // Wait for ongoing connection attempt to finish
    await new Promise(resolve => setTimeout(resolve, 500));
    if (cachedClient) {
      return {
        client: cachedClient,
        db: cachedClient.db()
      };
    }
  }
  
  isConnecting = true;
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    // Connection options with timeout
    const options: MongoClientOptions = {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    };
    
    console.log(`Connecting to MongoDB... (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    const client = await MongoClient.connect(process.env.MONGODB_URI, options);
    cachedClient = client;
    console.log('Connected to MongoDB successfully');
    
    isConnecting = false;
    return {
      client,
      db: client.db()
    };
  } catch (error: any) {
    isConnecting = false;
    
    // Handle retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`MongoDB connection failed, retrying in ${RETRY_DELAY_MS}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectToDatabase(retryCount + 1);
    }
    
    console.error('Failed to connect to MongoDB after retries:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the collections parameter
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const createTestData = searchParams.get('createTestData') === 'true';
    
    try {
      // Connect to database with retry logic
      const { db } = await connectToDatabase();
      
      // Create test data if requested and collections are empty
      if (createTestData) {
        const analyticsCount = await db.collection('analytics').countDocuments({});
        const symptomChecksCount = await db.collection('symptomChecks').countDocuments({});
        
        if (analyticsCount === 0 && symptomChecksCount === 0) {
          console.log('Creating test data for symptom tracker...');
          await createMockData(db);
        }
      }
      
      // Return different data based on requested collection
      if (collection === 'analytics' || collection === 'all') {
        const analytics = await db.collection('analytics')
          .find({ action: { $regex: '^symptom_check_' } })
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
        
        const analyticsCount = await db.collection('analytics')
          .countDocuments({ action: { $regex: '^symptom_check_' } });
          
        if (collection === 'analytics') {
          return NextResponse.json({
            analytics: {
              count: analyticsCount,
              data: JSON.parse(JSON.stringify(analytics, (key, value) => 
                key === '_id' ? value.toString() : value
              ))
            }
          });
        }
      }
      
      if (collection === 'symptomChecks' || collection === 'all') {
        const symptomChecks = await db.collection('symptomChecks')
          .find({})
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray();
        
        const symptomChecksCount = await db.collection('symptomChecks')
          .countDocuments({});
          
        if (collection === 'symptomChecks') {
          return NextResponse.json({
            symptomChecks: {
              count: symptomChecksCount,
              data: JSON.parse(JSON.stringify(symptomChecks, (key, value) => 
                key === '_id' ? value.toString() : value
              ))
            }
          });
        }
      }
      
      // If we get here, return all data (collection === 'all')
      const analytics = await db.collection('analytics')
        .find({ action: { $regex: '^symptom_check_' } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      const analyticsCount = await db.collection('analytics')
        .countDocuments({ action: { $regex: '^symptom_check_' } });
        
      const symptomChecks = await db.collection('symptomChecks')
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      const symptomChecksCount = await db.collection('symptomChecks')
        .countDocuments({});
        
      return NextResponse.json({
        analytics: {
          count: analyticsCount,
          data: JSON.parse(JSON.stringify(analytics, (key, value) => 
            key === '_id' ? value.toString() : value
          ))
        },
        symptomChecks: {
          count: symptomChecksCount,
          data: JSON.parse(JSON.stringify(symptomChecks, (key, value) => 
            key === '_id' ? value.toString() : value
          ))
        }
      });
      
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database error', message: dbError.message, stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in symptom debug endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message }, 
      { status: 500 }
    );
  }
}

// Function to create mock data for testing
async function createMockData(db: any) {
  try {
    // Create test analytics data
    const analyticsData = [
      {
        action: 'symptom_check_started',
        data: {
          sessionId: 'test_session_123',
          timestamp: new Date()
        },
        clientIp: '127.0.0.1',
        userAgent: 'Test Script',
        createdAt: new Date()
      },
      {
        action: 'symptom_check_bodypart_selected',
        data: {
          sessionId: 'test_session_123',
          bodyPart: 'Head',
          timestamp: new Date()
        },
        clientIp: '127.0.0.1',
        userAgent: 'Test Script',
        createdAt: new Date()
      },
      {
        action: 'symptom_check_completed',
        data: {
          sessionId: 'test_session_123',
          symptoms: ['Headache', 'Fever', 'Fatigue'],
          timestamp: new Date()
        },
        clientIp: '127.0.0.1',
        userAgent: 'Test Script',
        createdAt: new Date()
      },
      {
        action: 'symptom_check_feedback',
        data: {
          sessionId: 'test_session_123',
          isHelpful: true,
          symptoms: ['Headache', 'Fever'],
          timestamp: new Date()
        },
        clientIp: '127.0.0.1',
        userAgent: 'Test Script',
        createdAt: new Date()
      }
    ];
    
    // Create test symptom check data
    const symptomCheckData = {
      _id: 'test_session_123',
      symptoms: ['Headache', 'Fever', 'Fatigue'],
      bodyPart: 'Head',
      prediction: {
        possibleCauses: ['Common Cold', 'Influenza', 'Migraine']
      },
      feedback: 'helpful',
      hasReports: false,
      completed: true,
      createdAt: new Date(),
      completedAt: new Date(),
      feedbackAt: new Date()
    };
    
    // Insert analytics data
    const analyticsResult = await db.collection('analytics').insertMany(analyticsData);
    console.log(`Inserted ${analyticsResult.insertedCount} analytics documents`);
    
    // Insert symptom check data
    const symptomCheckResult = await db.collection('symptomChecks').insertOne(symptomCheckData);
    console.log(`Inserted symptom check document with ID: ${symptomCheckResult.insertedId}`);
    
    return true;
  } catch (error) {
    console.error('Error creating mock data:', error);
    return false;
  }
} 