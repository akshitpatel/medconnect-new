import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

interface Params {
  params: {
    passport_id: string;
  };
}

// Get a health passport by passport ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const passportId = params.passport_id;
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportById(passportId);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json({ passport });
    
  } catch (error) {
    console.error('Error retrieving health passport:', error);
    return NextResponse.json({ error: 'Failed to retrieve health passport' }, { status: 500 });
  }
}

// Update a health passport
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const passportId = params.passport_id;
    
    // Get the current passport to check ownership
    const passport = await HealthPassportService.getHealthPassportById(passportId);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Update the health passport
    const updatedPassport = await HealthPassportService.updateHealthPassport(passportId, updates);
    
    if (!updatedPassport) {
      return NextResponse.json({ error: 'Failed to update health passport' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Health passport updated successfully',
      passport: updatedPassport
    });
    
  } catch (error) {
    console.error('Error updating health passport:', error);
    return NextResponse.json({ error: 'Failed to update health passport' }, { status: 500 });
  }
}

// Delete a health passport (soft delete)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const passportId = params.passport_id;
    
    // Get the current passport to check ownership
    const passport = await HealthPassportService.getHealthPassportById(passportId);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Only allow users with admin role to delete passports
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Only administrators can delete health passports' }, { status: 403 });
    }
    
    // Delete the health passport (soft delete)
    const deleted = await HealthPassportService.deleteHealthPassport(passportId);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete health passport' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Health passport deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting health passport:', error);
    return NextResponse.json({ error: 'Failed to delete health passport' }, { status: 500 });
  }
} 