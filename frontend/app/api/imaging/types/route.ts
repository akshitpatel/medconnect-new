import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

// Get all imaging types
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all active imaging types
    const types = await ImagingService.getAllImagingTypes();
    
    return NextResponse.json({ types });
    
  } catch (error) {
    console.error('Error retrieving imaging types:', error);
    return NextResponse.json({ error: 'Failed to retrieve imaging types' }, { status: 500 });
  }
}

// Create a new imaging type (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can create imaging types' }, { status: 403 });
    }
    
    // Parse request body
    const typeData = await request.json();
    
    // Validate required fields
    if (!typeData.name || !typeData.description || !typeData.duration_minutes || !typeData.body_parts) {
      return NextResponse.json({ 
        error: 'Missing required fields. Please provide name, description, duration_minutes, and body_parts.' 
      }, { status: 400 });
    }
    
    // Create the imaging type
    const type = await ImagingService.createImagingType(typeData);
    
    return NextResponse.json({ 
      message: 'Imaging type created successfully',
      type
    });
    
  } catch (error) {
    console.error('Error creating imaging type:', error);
    return NextResponse.json({ error: 'Failed to create imaging type' }, { status: 500 });
  }
} 