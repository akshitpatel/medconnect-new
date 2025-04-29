// Test script to insert symptom tracker data directly into MongoDB
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  // Connection URL
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB successfully');

    // Get the database
    const db = client.db();
    
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
    console.log('Inserting analytics data...');
    const analyticsResult = await db.collection('analytics').insertMany(analyticsData);
    console.log(`Inserted ${analyticsResult.insertedCount} analytics documents`);
    
    // Insert symptom check data
    console.log('Inserting symptom check data...');
    const symptomCheckResult = await db.collection('symptomChecks').insertOne(symptomCheckData);
    console.log(`Inserted symptom check document with ID: ${symptomCheckResult.insertedId}`);
    
    console.log('Test data inserted successfully');
    
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error); 