import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

interface Params {
  params: {
    passport_id: string;
    record_id: string;
  };
}

// Get a specific medical record
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { passport_id, record_id } = params;
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportById(passport_id);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Find the specific medical record
    const record = passport.medical_records?.find(r => r.record_id.toString() === record_id);
    
    if (!record) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    
    return NextResponse.json(record);
    
  } catch (error) {
    console.error('Error retrieving medical record:', error);
    return NextResponse.json({ error: 'Failed to retrieve medical record' }, { status: 500 });
  }
}

// Update a medical record
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { passport_id, record_id } = params;
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportById(passport_id);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if the record exists
    const recordExists = passport.medical_records?.some(r => r.record_id.toString() === record_id);
    
    if (!recordExists) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Convert date to Date object if provided
    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    
    // Update the medical record
    const success = await HealthPassportService.updateMedicalRecord(passport_id, record_id, updates);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update medical record' }, { status: 400 });
    }
    
    // Get the updated passport to return the updated record
    const updatedPassport = await HealthPassportService.getHealthPassportById(passport_id);
    const updatedRecord = updatedPassport?.medical_records?.find(r => r.record_id.toString() === record_id);
    
    return NextResponse.json({ 
      message: 'Medical record updated successfully',
      record: updatedRecord
    });
    
  } catch (error) {
    console.error('Error updating medical record:', error);
    return NextResponse.json({ error: 'Failed to update medical record' }, { status: 500 });
  }
}

// Delete a medical record
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { passport_id, record_id } = params;
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportById(passport_id);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if the record exists
    const recordExists = passport.medical_records?.some(r => r.record_id.toString() === record_id);
    
    if (!recordExists) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }
    
    // Delete the medical record
    const success = await HealthPassportService.deleteMedicalRecord(passport_id, record_id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete medical record' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: 'Medical record deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json({ error: 'Failed to delete medical record' }, { status: 500 });
  }
} 