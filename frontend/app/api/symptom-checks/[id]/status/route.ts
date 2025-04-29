import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import DatabaseService from '../../../../lib/db-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid symptom check ID' },
        { status: 400 }
      );
    }
    
    // Get the new status from request body
    const data = await request.json();
    const { status } = data;
    
    // Validate status
    if (!status || !['pending', 'reviewed', 'escalated'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the status in the database
    const result = await DatabaseService.updateSymptomCheckStatus(id, status);
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Symptom check not found or status not updated' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating symptom check status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
} 