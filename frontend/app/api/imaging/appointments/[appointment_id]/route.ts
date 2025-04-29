import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

interface Params {
  params: {
    appointment_id: string;
  };
}

// Get a specific appointment
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { appointment_id } = params;
    
    // Get the appointment
    const appointment = await ImagingService.getAppointmentById(appointment_id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the appointment or has admin/provider rights
    if (appointment.user_id.toString() !== user.userId && 
        user.role !== 'admin' && 
        user.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(appointment);
    
  } catch (error) {
    console.error('Error retrieving appointment:', error);
    return NextResponse.json({ error: 'Failed to retrieve appointment' }, { status: 500 });
  }
}

// Update a specific appointment
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { appointment_id } = params;
    
    // Get the appointment to verify it exists
    const appointment = await ImagingService.getAppointmentById(appointment_id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Only the appointment owner, admin, or provider can update an appointment
    if (appointment.user_id.toString() !== user.userId && 
        user.role !== 'admin' && 
        user.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Don't allow updating user_id
    delete updates.user_id;
    
    // If appointment_date is being updated, convert it to a Date object and validate it
    if (updates.appointment_date) {
      updates.appointment_date = new Date(updates.appointment_date);
      
      // Check if the chosen date is valid
      if (isNaN(updates.appointment_date.getTime())) {
        return NextResponse.json({ error: 'Invalid appointment date' }, { status: 400 });
      }
      
      // Check if the appointment date is in the future
      if (updates.appointment_date < new Date()) {
        return NextResponse.json({ error: 'Appointment date must be in the future' }, { status: 400 });
      }
      
      // Check provider availability for the new date
      const availability = await ImagingService.checkProviderAvailability(
        appointment.provider_id, 
        updates.appointment_date
      );
      
      if (!availability.available) {
        return NextResponse.json({ error: 'Provider is not available at the selected time' }, { status: 400 });
      }
      
      // Verify that the selected time matches one of the available slots
      const selectedTimeString = updates.appointment_date.toISOString();
      const availableSlotExists = availability.availableSlots?.some(slot => 
        slot.toISOString() === selectedTimeString
      );
      
      if (!availableSlotExists) {
        return NextResponse.json({ error: 'Selected time slot is not available' }, { status: 400 });
      }
      
      // If date is changed, update status to rescheduled
      if (appointment.appointment_date.toISOString() !== updates.appointment_date.toISOString()) {
        updates.status = 'rescheduled';
      }
    }
    
    // Update the appointment
    const updatedAppointment = await ImagingService.updateAppointment(appointment_id, updates);
    
    if (!updatedAppointment) {
      return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
    
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// Cancel a specific appointment
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { appointment_id } = params;
    
    // Get the appointment to verify it exists
    const appointment = await ImagingService.getAppointmentById(appointment_id);
    
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }
    
    // Only the appointment owner, admin, or provider can cancel an appointment
    if (appointment.user_id.toString() !== user.userId && 
        user.role !== 'admin' && 
        user.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if the appointment is already completed or cancelled
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return NextResponse.json({ 
        error: `Cannot cancel an appointment that is already ${appointment.status}` 
      }, { status: 400 });
    }
    
    // Get cancellation reason if provided
    let cancellationReason;
    
    try {
      const body = await request.json();
      cancellationReason = body.reason;
    } catch (e) {
      // If no body is provided or it's not valid JSON, proceed without a reason
    }
    
    // Cancel the appointment
    const success = await ImagingService.cancelAppointment(appointment_id, cancellationReason);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Appointment cancelled successfully'
    });
    
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
  }
} 