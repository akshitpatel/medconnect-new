import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

interface Params {
  params: {
    type_id: string;
  };
}

// Get a specific imaging type
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { type_id } = params;
    
    // Get the imaging type
    const type = await ImagingService.getImagingTypeById(type_id);
    
    if (!type) {
      return NextResponse.json({ error: 'Imaging type not found' }, { status: 404 });
    }
    
    return NextResponse.json(type);
    
  } catch (error) {
    console.error('Error retrieving imaging type:', error);
    return NextResponse.json({ error: 'Failed to retrieve imaging type' }, { status: 500 });
  }
}

// Update a specific imaging type (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can update imaging types' }, { status: 403 });
    }
    
    const { type_id } = params;
    
    // Get the imaging type to verify it exists
    const type = await ImagingService.getImagingTypeById(type_id);
    
    if (!type) {
      return NextResponse.json({ error: 'Imaging type not found' }, { status: 404 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Update the imaging type
    const updatedType = await ImagingService.updateImagingType(type_id, updates);
    
    if (!updatedType) {
      return NextResponse.json({ error: 'Failed to update imaging type' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Imaging type updated successfully',
      type: updatedType
    });
    
  } catch (error) {
    console.error('Error updating imaging type:', error);
    return NextResponse.json({ error: 'Failed to update imaging type' }, { status: 500 });
  }
}

// Delete a specific imaging type (admin only, soft delete)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can delete imaging types' }, { status: 403 });
    }
    
    const { type_id } = params;
    
    // Get the imaging type to verify it exists
    const type = await ImagingService.getImagingTypeById(type_id);
    
    if (!type) {
      return NextResponse.json({ error: 'Imaging type not found' }, { status: 404 });
    }
    
    // Delete the imaging type (soft delete)
    const success = await ImagingService.deleteImagingType(type_id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete imaging type' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Imaging type deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting imaging type:', error);
    return NextResponse.json({ error: 'Failed to delete imaging type' }, { status: 500 });
  }
} 