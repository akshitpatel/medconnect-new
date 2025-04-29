import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

// Get appointments for the current user
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as any;
    
    // Get appointments for the user
    const appointments = await ImagingService.getUserAppointments(user.userId, status);
    
    return NextResponse.json({ appointments });
    
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointments' }, { status: 500 });
  }
}

// Create a new appointment
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const appointmentData = await request.json();
    
    // Validate required fields
    if (!appointmentData.provider_id || !appointmentData.imaging_type_id || !appointmentData.appointment_date || !appointmentData.body_part) {
      return NextResponse.json({ 
        error: 'Missing required fields. Please provide provider_id, imaging_type_id, appointment_date, and body_part.' 
      }, { status: 400 });
    }
    
    // Convert string IDs to ObjectIds
    appointmentData.provider_id = new ObjectId(appointmentData.provider_id);
    appointmentData.imaging_type_id = new ObjectId(appointmentData.imaging_type_id);
    
    // Set user_id to the authenticated user
    appointmentData.user_id = new ObjectId(user.userId);
    
    // If passport_id is provided, convert it to ObjectId
    if (appointmentData.passport_id) {
      appointmentData.passport_id = new ObjectId(appointmentData.passport_id);
    }
    
    // Convert appointment_date string to Date object
    appointmentData.appointment_date = new Date(appointmentData.appointment_date);
    
    // Check if the chosen date is valid
    if (isNaN(appointmentData.appointment_date.getTime())) {
      return NextResponse.json({ error: 'Invalid appointment date' }, { status: 400 });
    }
    
    // Check if the appointment date is in the future
    if (appointmentData.appointment_date < new Date()) {
      return NextResponse.json({ error: 'Appointment date must be in the future' }, { status: 400 });
    }
    
    // Check provider availability
    const availability = await ImagingService.checkProviderAvailability(
      appointmentData.provider_id, 
      appointmentData.appointment_date
    );
    
    if (!availability.available) {
      return NextResponse.json({ error: 'Provider is not available at the selected time' }, { status: 400 });
    }
    
    // Verify that the selected time matches one of the available slots
    const selectedTimeString = appointmentData.appointment_date.toISOString();
    const availableSlotExists = availability.availableSlots?.some(slot => 
      slot.toISOString() === selectedTimeString
    );
    
    if (!availableSlotExists) {
      return NextResponse.json({ error: 'Selected time slot is not available' }, { status: 400 });
    }
    
    // Set initial status and notification status
    appointmentData.status = 'scheduled';
    appointmentData.notification_status = {
      confirmation_sent: false,
      reminder_sent: false,
      result_available_sent: false
    };
    
    // Create the appointment
    const appointment = await ImagingService.createAppointment(appointmentData);
    
    return NextResponse.json({ 
      message: 'Appointment scheduled successfully',
      appointment
    });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
} 