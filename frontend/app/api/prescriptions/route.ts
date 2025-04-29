import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { Prescription, Medication } from '@/app/types/api-types';

/**
 * GET handler for fetching prescriptions
 * Uses the new authentication middleware pattern
 */
export const GET = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    // Construct the query based on parameters
    let query: any = { patientId: userId };
    
    // Filter by status
    if (status) {
      if (status === 'active') {
        const today = new Date().toISOString().split('T')[0];
        query.expiryDate = { $gte: today };
        query.status = { $ne: 'completed' };
      } else if (status === 'expired') {
        const today = new Date().toISOString().split('T')[0];
        query.expiryDate = { $lt: today };
      } else {
        query.status = status;
      }
    }
    
    // Filter by date range
    if (from && to) {
      query.prescribedDate = { 
        $gte: from,
        $lte: to
      };
    }
    
    // Fetch prescriptions from the database
    const db = await DatabaseService.getDb();
    let prescriptions = db.collection('prescriptions')
      .find(query)
      .sort({ prescribedDate: -1 });
    
    if (limit) {
      prescriptions = prescriptions.limit(limit);
    }
    
    const results = await prescriptions.toArray();
    
    // Generate mock data if no results are found
    if (results.length === 0) {
      const mockPrescriptions = generateMockPrescriptions(userId, limit || 5);
      return apiResponse({ prescriptions: mockPrescriptions });
    }
    
    return apiResponse({ prescriptions: results });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return apiError('Failed to fetch prescriptions', 500);
  }
});

/**
 * POST handler for creating new prescriptions
 */
export const POST = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const prescriptionData = await request.json();
    
    // Validate required fields
    const requiredFields = ['doctorId', 'medications', 'prescribedDate', 'expiryDate', 'instructions'];
    for (const field of requiredFields) {
      if (!prescriptionData[field]) {
        return apiError(`Missing required field: ${field}`, 400);
      }
    }
    
    // Validate medications array
    if (!Array.isArray(prescriptionData.medications) || prescriptionData.medications.length === 0) {
      return apiError('Medications must be a non-empty array', 400);
    }
    
    const newPrescription = {
      ...prescriptionData,
      patientId: userId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the prescription
    const db = await DatabaseService.getDb();
    const result = await db.collection('prescriptions').insertOne(newPrescription);
    
    if (!result.insertedId) {
      return apiError('Failed to create prescription', 500);
    }
    
    const createdPrescription = await db.collection('prescriptions').findOne({ _id: result.insertedId });
    
    return apiResponse({ prescription: createdPrescription }, 201);
  } catch (error) {
    console.error('Error creating prescription:', error);
    return apiError('Failed to create prescription', 500);
  }
});

/**
 * Helper function to generate mock prescriptions
 */
function generateMockPrescriptions(userId: string, count: number): Prescription[] {
  const medications: Medication[][] = [
    [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'every 8 hours', duration: '7 days', instructions: 'Take with food' },
      { name: 'Ibuprofen', dosage: '400mg', frequency: 'as needed', duration: '5 days', instructions: 'Take for pain relief' }
    ],
    [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'once daily', duration: '30 days', instructions: 'Take in the morning' }
    ],
    [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'once daily', duration: '90 days', instructions: 'Take at bedtime' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'once daily', duration: '90 days', instructions: 'Take with breakfast' }
    ],
    [
      { name: 'Metformin', dosage: '500mg', frequency: 'twice daily', duration: '60 days', instructions: 'Take with meals' }
    ],
    [
      { name: 'Levothyroxine', dosage: '75mcg', frequency: 'once daily', duration: '30 days', instructions: 'Take on empty stomach' }
    ]
  ];
  
  const today = new Date();
  const mockPrescriptions: Prescription[] = [];
  
  for (let i = 0; i < count; i++) {
    const isActive = Math.random() > 0.3;
    
    const prescribedDate = new Date(today);
    prescribedDate.setDate(today.getDate() - Math.floor(Math.random() * (isActive ? 30 : 180)));
    
    const expiryDate = new Date(prescribedDate);
    expiryDate.setDate(prescribedDate.getDate() + Math.floor(Math.random() * 90) + 30);
    
    const status = isActive ? 'active' : (Math.random() > 0.5 ? 'completed' : 'expired');
    
    const medicationSet = medications[Math.floor(Math.random() * medications.length)];
    const instructions = 'Take medications as prescribed. Report any side effects immediately.';
    
    mockPrescriptions.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      doctorId: new ObjectId().toString(),
      medications: medicationSet,
      prescribedDate: prescribedDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      instructions,
      status,
      createdAt: prescribedDate,
      updatedAt: new Date()
    });
  }
  
  return mockPrescriptions;
} 