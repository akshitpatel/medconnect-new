import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

// Get imaging results for the current user
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get imaging results for the user
    const results = await ImagingService.getUserImagingResults(user.userId);
    
    return NextResponse.json({ results });
    
  } catch (error) {
    console.error('Error retrieving imaging results:', error);
    return NextResponse.json({ error: 'Failed to retrieve imaging results' }, { status: 500 });
  }
}

// Create a new imaging result (provider or admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and has the correct role
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'provider' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only providers and admins can create imaging results' }, { status: 403 });
    }
    
    // Parse request body
    const resultData = await request.json();
    
    // Validate required fields
    if (!resultData.appointment_id || !resultData.user_id || !resultData.provider_id || 
        !resultData.imaging_type_id || !resultData.findings || !resultData.impression || 
        !resultData.radiologist || !resultData.images) {
      return NextResponse.json({ 
        error: 'Missing required fields for imaging result.' 
      }, { status: 400 });
    }
    
    // Convert string IDs to ObjectIds
    resultData.appointment_id = new ObjectId(resultData.appointment_id);
    resultData.user_id = new ObjectId(resultData.user_id);
    resultData.provider_id = new ObjectId(resultData.provider_id);
    resultData.imaging_type_id = new ObjectId(resultData.imaging_type_id);
    
    // If passport_id is provided, convert it to ObjectId
    if (resultData.passport_id) {
      resultData.passport_id = new ObjectId(resultData.passport_id);
    }
    
    // Set upload date if not provided
    resultData.upload_date = resultData.upload_date ? new Date(resultData.upload_date) : new Date();
    
    // Set default values if not provided
    resultData.status = resultData.status || 'final';
    resultData.is_critical = resultData.is_critical || false;
    resultData.viewed_by_patient = false;
    resultData.viewed_by_provider = user.role === 'provider';
    
    // Create the imaging result
    const result = await ImagingService.createImagingResult(resultData);
    
    return NextResponse.json({ 
      message: 'Imaging result created successfully',
      result
    });
    
  } catch (error) {
    console.error('Error creating imaging result:', error);
    return NextResponse.json({ error: 'Failed to create imaging result' }, { status: 500 });
  }
} 