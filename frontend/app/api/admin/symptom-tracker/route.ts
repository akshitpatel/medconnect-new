import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';

let cachedClient: MongoClient | null = null;

// Helper function to connect to the database
async function connectToDatabase() {
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
  
  return {
    client,
    db: client.db()
  };
}

export async function GET(request: NextRequest) {
  try {
    // NOTE: Disabled auth check for development
    // const session = await getServerSession();
    // if (!session || !session.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Get the timeframe parameter
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'all';
    
    try {
      // Attempt to connect to MongoDB with a short timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 5000);
      });
      
      const dbPromise = connectToDatabase();
      
      // Race the connection against a timeout
      const { db } = await Promise.race([dbPromise, timeoutPromise]) as any;
      
      // Date filters based on timeframe
      const dateFilter = getDateFilter(timeframe);
      
      // Get symptom checks data
      const symptomChecksData = await getSymptomChecksData(db, dateFilter);
      
      // Get analytics data
      const analyticsData = await getAnalyticsData(db, dateFilter);
      
      // Get summary stats
      const summaryData = await getSummaryData(db, dateFilter);
      
      return NextResponse.json({
        symptomChecks: symptomChecksData,
        analytics: analyticsData,
        summary: summaryData,
        source: 'database'
      });
    } catch (dbError) {
      console.error('Database connection failed, using mock data:', dbError);
      
      // Generate mock data instead
      const mockData = generateMockData(timeframe);
      
      return NextResponse.json({
        ...mockData,
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching symptom tracker data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch symptom tracker data' }, 
      { status: 500 }
    );
  }
}

// Generate realistic mock data for development
function generateMockData(timeframe: string) {
  const currentDate = new Date();
  
  // Common symptoms for demo data
  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Sore throat', 
    'Nausea', 'Back pain', 'Chest pain', 'Shortness of breath',
    'Dizziness', 'Abdominal pain', 'Joint pain', 'Rash', 'Insomnia'
  ];
  
  // Body parts
  const bodyParts = [
    'Head', 'Chest', 'Abdomen', 'Back', 'Legs', 
    'Arms', 'Neck', 'Eyes', 'Ears', 'Throat'
  ];
  
  // Possible conditions
  const conditions = [
    'Common Cold', 'Influenza', 'Migraine', 'Tension Headache', 
    'Gastritis', 'Hypertension', 'Anxiety', 'Depression', 
    'Allergic Rhinitis', 'Asthma', 'Diabetes', 'GERD', 
    'Irritable Bowel Syndrome', 'UTI', 'Bronchitis'
  ];
  
  // Generate top symptoms mock data
  const topSymptoms = commonSymptoms.slice(0, 10).map((symptom, index) => ({
    _id: symptom,
    count: Math.floor(Math.random() * 100) + 20 - (index * 5)
  }));
  
  // Generate top body parts mock data
  const topBodyParts = bodyParts.slice(0, 5).map((part, index) => ({
    _id: part,
    count: Math.floor(Math.random() * 50) + 10 - (index * 3)
  }));
  
  // Generate top conditions mock data
  const topConditions = conditions.slice(0, 10).map((condition, index) => ({
    _id: condition,
    count: Math.floor(Math.random() * 40) + 5 - (index * 2)
  }));
  
  // Generate mock analytics events
  const analyticsEvents = Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - i * 2);
    
    const actions = [
      'symptom_check_started',
      'symptom_check_completed',
      'symptom_check_feedback',
      'symptom_check_file_uploaded',
      'symptom_check_user_info'
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      _id: `mock_event_${i}`,
      action,
      clientIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: date.toISOString(),
      data: {
        sessionId: `session_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: date.toISOString(),
        symptoms: action === 'symptom_check_completed' 
          ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
              commonSymptoms[Math.floor(Math.random() * commonSymptoms.length)]
            )
          : undefined,
        bodyPart: action === 'symptom_check_completed'
          ? bodyParts[Math.floor(Math.random() * bodyParts.length)]
          : undefined,
        isHelpful: action === 'symptom_check_feedback'
          ? Math.random() > 0.3
          : undefined
      }
    };
  });
  
  // Generate mock symptom checks
  const symptomChecks = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() - i * 5);
    
    const selectedSymptoms = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 }, 
      () => commonSymptoms[Math.floor(Math.random() * commonSymptoms.length)]
    );
    
    const selectedBodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
    
    const possibleCauses = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => conditions[Math.floor(Math.random() * conditions.length)]
    );
    
    const urgency = Math.random() > 0.9 
      ? 'emergency' 
      : Math.random() > 0.7 
        ? 'urgent' 
        : 'routine';
        
    const hasReports = Math.random() > 0.7;
    
    const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson', 'Taylor Brown'];
    const name = Math.random() > 0.3 ? names[Math.floor(Math.random() * names.length)] : undefined;
    
    return {
      _id: `mock_check_${i}`,
      createdAt: date.toISOString(),
      symptoms: selectedSymptoms,
      bodyPart: selectedBodyPart,
      prediction: {
        possibleCauses,
        urgency
      },
      hasReports,
      feedback: Math.random() > 0.5 
        ? Math.random() > 0.7 ? 'not-helpful' : 'helpful'
        : null,
      userData: name ? {
        name,
        phoneNumber: `+1${Math.floor(Math.random() * 1000000000) + 9000000000}`
      } : null
    };
  });
  
  // Calculate stats
  const totalStarted = 250;
  const totalCompleted = 178;
  const totalFeedbackProvided = 95;
  const totalPositiveFeedback = 72;
  const totalNegativeFeedback = totalFeedbackProvided - totalPositiveFeedback;
  const totalWithFiles = 54;
  
  return {
    symptomChecks: {
      total: symptomChecks.length,
      data: symptomChecks
    },
    analytics: {
      total: analyticsEvents.length,
      data: analyticsEvents
    },
    summary: {
      counts: {
        totalStarted,
        totalCompleted,
        totalFeedbackProvided,
        totalPositiveFeedback,
        totalNegativeFeedback,
        totalWithFiles
      },
      rates: {
        completionRate: Math.round((totalCompleted / totalStarted) * 100),
        positiveFeedbackRate: Math.round((totalPositiveFeedback / totalFeedbackProvided) * 100)
      },
      topData: {
        symptoms: topSymptoms,
        bodyParts: topBodyParts,
        conditions: topConditions
      }
    }
  };
}

// Helper function to get date filter based on timeframe
function getDateFilter(timeframe: string) {
  const now = new Date();
  
  switch (timeframe) {
    case 'day':
      const oneDayAgo = new Date();
      oneDayAgo.setDate(now.getDate() - 1);
      return { createdAt: { $gte: oneDayAgo } };
      
    case 'week':
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return { createdAt: { $gte: oneWeekAgo } };
      
    case 'month':
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return { createdAt: { $gte: oneMonthAgo } };
      
    case 'year':
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return { createdAt: { $gte: oneYearAgo } };
      
    case 'all':
    default:
      return {};
  }
}

// Get symptom checks data
async function getSymptomChecksData(db: any, dateFilter: any) {
  try {
    console.log('Fetching symptom checks data with filter:', JSON.stringify(dateFilter));
    
    // Get total count - handle both string ID and ObjectId
    const total = await db.collection('symptomChecks').countDocuments(dateFilter);
    
    console.log('Symptom checks count:', total);
    
    // Get recent symptom checks (limited to 100 for performance)
    const data = await db.collection('symptomChecks')
      .find(dateFilter)
      .sort({ lastUpdated: -1, createdAt: -1 })
      .limit(100)
      .toArray();
    
    return {
      total,
      data: JSON.parse(JSON.stringify(data, (key, value) => 
        key === '_id' ? value.toString() : value
      ))
    };
  } catch (error) {
    console.error('Error fetching symptom checks:', error);
    return { total: 0, data: [] };
  }
}

// Get analytics data
async function getAnalyticsData(db: any, dateFilter: any) {
  try {
    console.log('Fetching analytics data with filter:', JSON.stringify(dateFilter));
    
    // Get total count
    const total = await db.collection('analytics')
      .countDocuments({
        ...dateFilter,
        action: { $regex: '^symptom_check_' }
      });
    
    console.log('Analytics count:', total);
    
    // Get analytics events (limited to 500 for performance)
    const data = await db.collection('analytics')
      .find({
        ...dateFilter,
        action: { $regex: '^symptom_check_' }
      })
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    
    return {
      total,
      data: JSON.parse(JSON.stringify(data, (key, value) => 
        key === '_id' ? value.toString() : value
      ))
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return { total: 0, data: [] };
  }
}

// Get summary data
async function getSummaryData(db: any, dateFilter: any) {
  try {
    console.log('Generating summary data with filter:', JSON.stringify(dateFilter));
    
    // Get counts from analytics collection for started and completed events
    const totalStarted = await db.collection('analytics').countDocuments({
      ...dateFilter,
      action: 'symptom_check_started'
    });
    
    const totalCompleted = await db.collection('analytics').countDocuments({
      ...dateFilter,
      action: 'symptom_check_completed'
    });
    
    console.log('Analytics counts - Started:', totalStarted, 'Completed:', totalCompleted);
    
    // Get counts from symptomChecks collection - handle both string ID and ObjectId
    const totalFeedbackProvided = await db.collection('symptomChecks').countDocuments({
      ...dateFilter,
      feedback: { $exists: true, $ne: null }
    });
    
    const totalPositiveFeedback = await db.collection('symptomChecks').countDocuments({
      ...dateFilter,
      feedback: 'helpful'
    });
    
    const totalNegativeFeedback = await db.collection('symptomChecks').countDocuments({
      ...dateFilter,
      feedback: 'not-helpful'
    });
    
    const totalWithFiles = await db.collection('symptomChecks').countDocuments({
      ...dateFilter,
      hasReports: true
    });
    
    console.log('Symptom checks - Feedback:', totalFeedbackProvided, 
                'Positive:', totalPositiveFeedback, 
                'Negative:', totalNegativeFeedback,
                'With Files:', totalWithFiles);

    // Calculate rates
    const completionRate = totalStarted > 0 
      ? Math.round((totalCompleted / totalStarted) * 100) 
      : 0;
      
    const positiveFeedbackRate = totalFeedbackProvided > 0 
      ? Math.round((totalPositiveFeedback / totalFeedbackProvided) * 100) 
      : 0;
    
    // Get top reported symptoms - adjusted for actual data structure
    // Use $match to handle both array and scalar symptoms
    const topSymptomsPipeline = [
      { 
        $match: { 
          ...dateFilter,
          $or: [
            { symptoms: { $exists: true, $ne: null, $not: { $size: 0 } } },
            { 'data.symptoms': { $exists: true, $ne: null, $not: { $size: 0 } } }
          ]
        } 
      },
      {
        $project: {
          symptoms: {
            $cond: {
              if: { $isArray: '$symptoms' },
              then: '$symptoms',
              else: {
                $cond: {
                  if: { $isArray: '$data.symptoms' },
                  then: '$data.symptoms',
                  else: []
                }
              }
            }
          }
        }
      },
      { $unwind: '$symptoms' },
      { $group: { _id: '$symptoms', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];
    
    const topSymptoms = await db.collection('symptomChecks').aggregate(topSymptomsPipeline).toArray();
    console.log('Top symptoms pipeline result:', topSymptoms.length);
    
    // Get top body parts - adjusted for actual data structure
    const topBodyParts = await db.collection('symptomChecks').aggregate([
      { 
        $match: { 
          ...dateFilter,
          $or: [
            { bodyPart: { $exists: true, $ne: null } },
            { 'data.bodyPart': { $exists: true, $ne: null } }
          ]
        } 
      },
      {
        $project: {
          bodyPart: {
            $cond: {
              if: { $ne: ['$bodyPart', null] },
              then: '$bodyPart',
              else: '$data.bodyPart'
            }
          }
        }
      },
      { $group: { _id: '$bodyPart', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    console.log('Top body parts pipeline result:', topBodyParts.length);
    
    // Get top conditions diagnosed - adjusted for actual data structure
    const topConditionsPipeline = [
      { 
        $match: { 
          ...dateFilter,
          $or: [
            { 'prediction.possibleCauses': { $exists: true } },
            { 'data.symptoms': { $exists: true } } // Use symptoms as fallback
          ]
        } 
      },
      {
        $project: {
          conditions: {
            $cond: {
              if: { $isArray: '$prediction.possibleCauses' },
              then: '$prediction.possibleCauses',
              else: {
                $cond: {
                  if: { $isArray: '$data.symptoms' },
                  then: '$data.symptoms',
                  else: []
                }
              }
            }
          }
        }
      },
      { $unwind: { path: '$conditions', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$conditions', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ];
    
    const topConditions = await db.collection('symptomChecks').aggregate(topConditionsPipeline).toArray();
    console.log('Top conditions pipeline result:', topConditions.length);
    
    return {
      counts: {
        totalStarted,
        totalCompleted,
        totalFeedbackProvided,
        totalPositiveFeedback,
        totalNegativeFeedback,
        totalWithFiles
      },
      rates: {
        completionRate,
        positiveFeedbackRate
      },
      topData: {
        symptoms: topSymptoms,
        bodyParts: topBodyParts,
        conditions: topConditions
      }
    };
  } catch (error) {
    console.error('Error generating summary data:', error);
    return {
      counts: {
        totalStarted: 0,
        totalCompleted: 0,
        totalFeedbackProvided: 0,
        totalPositiveFeedback: 0,
        totalNegativeFeedback: 0,
        totalWithFiles: 0
      },
      rates: {
        completionRate: 0,
        positiveFeedbackRate: 0
      },
      topData: {
        symptoms: [],
        bodyParts: [],
        conditions: []
      }
    };
  }
} 