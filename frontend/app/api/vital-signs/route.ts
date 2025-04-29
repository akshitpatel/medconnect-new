import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { VitalSign } from '@/app/types/api-types';

/**
 * GET handler for fetching vital signs
 * Uses the new authentication middleware pattern
 */
export const GET = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    let query: any = { patientId: userId };
    
    if (type) {
      query.vitalType = type;
    }
    
    if (from && to) {
      query.recordedAt = { 
        $gte: new Date(from).toISOString(),
        $lte: new Date(to).toISOString()
      };
    }
    
    // Fetch vital signs from the database
    const db = await DatabaseService.getDb();
    let vitalSigns = db.collection('vitalSigns')
      .find(query)
      .sort({ recordedAt: -1 });
    
    if (limit) {
      vitalSigns = vitalSigns.limit(limit);
    }
    
    const results = await vitalSigns.toArray();
    
    // Generate mock data if no results are found
    if (results.length === 0) {
      const mockVitalSigns = generateMockVitalSigns(userId, limit || 5);
      return apiResponse({ vitalSigns: mockVitalSigns });
    }
    
    return apiResponse({ vitalSigns: results });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    return apiError('Failed to fetch vital signs', 500);
  }
});

/**
 * POST handler for adding a new vital sign record
 */
export const POST = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const vitalSignData = await request.json();
    
    // Validate required fields
    if (!vitalSignData.vitalType || !vitalSignData.value || !vitalSignData.unit) {
      return apiError('Missing required fields', 400);
    }
    
    const newVitalSign = {
      ...vitalSignData,
      patientId: userId,
      recordedAt: vitalSignData.recordedAt || new Date().toISOString(),
      isAbnormal: vitalSignData.isAbnormal || false,
      source: vitalSignData.source || 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the vital sign record
    const db = await DatabaseService.getDb();
    const result = await db.collection('vitalSigns').insertOne(newVitalSign);
    
    if (!result.insertedId) {
      return apiError('Failed to create vital sign record', 500);
    }
    
    const createdVitalSign = await db.collection('vitalSigns').findOne({ _id: result.insertedId });
    
    return apiResponse({ vitalSign: createdVitalSign }, 201);
  } catch (error) {
    console.error('Error creating vital sign:', error);
    return apiError('Failed to create vital sign record', 500);
  }
});

/**
 * Helper function to generate mock vital signs
 */
function generateMockVitalSigns(userId: string, count: number): VitalSign[] {
  const vitalTypes = [
    { type: 'blood_pressure', unit: 'mmHg', values: () => `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 20) + 70}` },
    { type: 'heart_rate', unit: 'bpm', values: () => Math.floor(Math.random() * 30) + 60 },
    { type: 'temperature', unit: '°C', values: () => (Math.random() * 1.5 + 36).toFixed(1) },
    { type: 'blood_glucose', unit: 'mg/dL', values: () => Math.floor(Math.random() * 50) + 70 },
    { type: 'oxygen_saturation', unit: '%', values: () => Math.floor(Math.random() * 5) + 95 },
    { type: 'weight', unit: 'kg', values: () => (Math.random() * 30 + 60).toFixed(1) }
  ];
  
  const today = new Date();
  const mockVitalSigns: VitalSign[] = [];
  
  for (let i = 0; i < count; i++) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - Math.floor(Math.random() * 14)); // Last 2 weeks
    recordDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const vitalType = vitalTypes[Math.floor(Math.random() * vitalTypes.length)];
    const value = vitalType.values();
    
    // Determine if value is abnormal
    let isAbnormal = false;
    if (vitalType.type === 'blood_pressure') {
      const [systolic, diastolic] = (value as string).split('/').map(Number);
      isAbnormal = systolic > 140 || systolic < 90 || diastolic > 90 || diastolic < 60;
    } else if (vitalType.type === 'heart_rate') {
      isAbnormal = (value as number) > 100 || (value as number) < 60;
    }
    
    mockVitalSigns.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      recordedAt: recordDate.toISOString(),
      vitalType: vitalType.type,
      value: value,
      unit: vitalType.unit,
      isAbnormal,
      source: 'manual',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return mockVitalSigns;
} 