import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const data = await request.json();
    
    // Check if the user already has a health passport
    const existingPassport = await HealthPassportService.getHealthPassportByUserId(user.userId);
    if (existingPassport) {
      return NextResponse.json({ error: 'User already has a health passport' }, { status: 400 });
    }
    
    // Create a new health passport
    const newPassport = await HealthPassportService.createHealthPassport({
      user_id: new ObjectId(user.userId),
      active: true,
      emergency_access: data.emergency_access || false,
      blood_type: data.blood_type,
      allergies: data.allergies || [],
      chronic_conditions: data.chronic_conditions || [],
      current_medications: data.current_medications || [],
      emergency_contacts: data.emergency_contacts || []
    });
    
    return NextResponse.json({ 
      message: 'Health passport created successfully',
      passport: {
        _id: newPassport._id,
        passport_number: newPassport.passport_number,
        created_at: newPassport.created_at
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating health passport:', error);
    return NextResponse.json({ error: 'Failed to create health passport' }, { status: 500 });
  }
} 