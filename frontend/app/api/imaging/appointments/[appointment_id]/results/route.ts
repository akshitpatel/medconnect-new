import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

interface Params {
  params: {
    appointment_id: string;
  };
}

// Get imaging results for a specific appointment
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { appointment_id } = params;
    
    // Get the appointment to verify it exists and check permissions
    const appointment = await ImagingService.getAppointmentById(appointment_id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Only the appointment owner, admin, or provider can access the results
    if (appointment.user_id.toString() !== user.userId && 
        user.role !== 'admin' && 
        user.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get the results for this appointment
    const result = await ImagingService.getAppointmentResults(appointment_id);
    
    if (!result) {
      return NextResponse.json({ 
        message: 'No results found for this appointment',
        results: null
      });
    }
    
    // If the user is the patient, mark this result as viewed by the patient
    if (appointment.user_id.toString() === user.userId && !result.viewed_by_patient && result._id) {
      await ImagingService.markResultViewedByPatient(result._id);
      result.viewed_by_patient = true;
    }
    
    // If the user is a provider (not the patient), mark this result as viewed by provider
    if (user.role === 'provider' && !result.viewed_by_provider && result._id) {
      await ImagingService.markResultViewedByProvider(result._id);
      result.viewed_by_provider = true;
    }
    
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('Error retrieving appointment results:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointment results' }, { status: 500 });
  }
} 