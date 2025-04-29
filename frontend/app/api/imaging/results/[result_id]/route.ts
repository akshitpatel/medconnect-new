import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

interface Params {
  params: {
    result_id: string;
  };
}

// Get a specific imaging result
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { result_id } = params;
    
    // Get the imaging result
    const result = await ImagingService.getImagingResultById(result_id);
    
    if (!result) {
      return NextResponse.json({ error: 'Imaging result not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the result or has admin/provider rights
    if (result.user_id.toString() !== user.userId && 
        user.role !== 'admin' && 
        user.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // If the user is the patient, mark this result as viewed by the patient
    if (result.user_id.toString() === user.userId && !result.viewed_by_patient) {
      await ImagingService.markResultViewedByPatient(result_id);
      result.viewed_by_patient = true;
    }
    
    // If the user is a provider (not the patient), mark this result as viewed by provider
    if (user.role === 'provider' && !result.viewed_by_provider) {
      await ImagingService.markResultViewedByProvider(result_id);
      result.viewed_by_provider = true;
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error retrieving imaging result:', error);
    return NextResponse.json({ error: 'Failed to retrieve imaging result' }, { status: 500 });
  }
}

// Update a specific imaging result (provider or admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated and has the correct role
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'provider' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only providers and admins can update imaging results' }, { status: 403 });
    }
    
    const { result_id } = params;
    
    // Get the imaging result to verify it exists
    const result = await ImagingService.getImagingResultById(result_id);
    
    if (!result) {
      return NextResponse.json({ error: 'Imaging result not found' }, { status: 404 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Don't allow updating certain fields
    delete updates.user_id;
    delete updates.appointment_id;
    delete updates.created_at;
    
    // If status is being changed to 'amended', update the appropriate fields
    if (updates.status === 'amended' && result.status === 'final') {
      updates.status = 'amended';
      // Reset viewed flags when an amendment is made
      updates.viewed_by_patient = false;
      updates.viewed_by_provider = user.role === 'provider';
    }
    
    // Update the imaging result
    const updatedResult = await ImagingService.updateImagingResult(result_id, updates);
    
    if (!updatedResult) {
      return NextResponse.json({ error: 'Failed to update imaging result' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Imaging result updated successfully',
      result: updatedResult
    });
    
  } catch (error) {
    console.error('Error updating imaging result:', error);
    return NextResponse.json({ error: 'Failed to update imaging result' }, { status: 500 });
  }
}

// Mark a result as viewed
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { result_id } = params;
    
    // Get the imaging result to verify it exists
    const result = await ImagingService.getImagingResultById(result_id);
    
    if (!result) {
      return NextResponse.json({ error: 'Imaging result not found' }, { status: 404 });
    }
    
    // Parse request body
    const body = await request.json();
    const action = body.action;
    
    if (action === 'mark_viewed_patient') {
      // Only the patient can mark the result as viewed by patient
      if (result.user_id.toString() !== user.userId) {
        return NextResponse.json({ error: 'Forbidden - only the patient can mark as viewed by patient' }, { status: 403 });
      }
      
      const success = await ImagingService.markResultViewedByPatient(result_id);
      
      if (!success) {
        return NextResponse.json({ error: 'Failed to mark result as viewed by patient' }, { status: 500 });
      }
      
      return NextResponse.json({
        message: 'Imaging result marked as viewed by patient'
      });
    } 
    else if (action === 'mark_viewed_provider') {
      // Only a provider can mark the result as viewed by provider
      if (user.role !== 'provider' && user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - only providers can mark as viewed by provider' }, { status: 403 });
      }
      
      const success = await ImagingService.markResultViewedByProvider(result_id);
      
      if (!success) {
        return NextResponse.json({ error: 'Failed to mark result as viewed by provider' }, { status: 500 });
      }
      
      return NextResponse.json({
        message: 'Imaging result marked as viewed by provider'
      });
    } 
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Error updating imaging result status:', error);
    return NextResponse.json({ error: 'Failed to update imaging result status' }, { status: 500 });
  }
} 