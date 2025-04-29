import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

interface Params {
  params: {
    provider_id: string;
  };
}

// Get a specific imaging provider
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { provider_id } = params;
    
    // Get the imaging provider
    const provider = await ImagingService.getImagingProviderById(provider_id);
    
    if (!provider) {
      return NextResponse.json({ error: 'Imaging provider not found' }, { status: 404 });
    }
    
    return NextResponse.json(provider);
    
  } catch (error) {
    console.error('Error retrieving imaging provider:', error);
    return NextResponse.json({ error: 'Failed to retrieve imaging provider' }, { status: 500 });
  }
}

// Update a specific imaging provider (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can update imaging providers' }, { status: 403 });
    }
    
    const { provider_id } = params;
    
    // Get the imaging provider to verify it exists
    const provider = await ImagingService.getImagingProviderById(provider_id);
    
    if (!provider) {
      return NextResponse.json({ error: 'Imaging provider not found' }, { status: 404 });
    }
    
    // Parse request body
    const updates = await request.json();
    
    // Update the imaging provider
    const updatedProvider = await ImagingService.updateImagingProvider(provider_id, updates);
    
    if (!updatedProvider) {
      return NextResponse.json({ error: 'Failed to update imaging provider' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Imaging provider updated successfully',
      provider: updatedProvider
    });
    
  } catch (error) {
    console.error('Error updating imaging provider:', error);
    return NextResponse.json({ error: 'Failed to update imaging provider' }, { status: 500 });
  }
}

// Delete a specific imaging provider (admin only, soft delete)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can delete imaging providers' }, { status: 403 });
    }
    
    const { provider_id } = params;
    
    // Get the imaging provider to verify it exists
    const provider = await ImagingService.getImagingProviderById(provider_id);
    
    if (!provider) {
      return NextResponse.json({ error: 'Imaging provider not found' }, { status: 404 });
    }
    
    // Delete the imaging provider (soft delete)
    const success = await ImagingService.deleteImagingProvider(provider_id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete imaging provider' }, { status: 500 });
    }
    
    return NextResponse.json({
      message: 'Imaging provider deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting imaging provider:', error);
    return NextResponse.json({ error: 'Failed to delete imaging provider' }, { status: 500 });
  }
} 