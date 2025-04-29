import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';
import { formatDate } from '@/app/lib/utils';

interface Params {
  params: {
    provider_id: string;
  };
}

// Check availability for a specific imaging provider
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { provider_id } = params;
    
    // Verify provider exists
    const provider = await ImagingService.getImagingProviderById(provider_id);
    
    if (!provider) {
      return NextResponse.json({ error: 'Imaging provider not found' }, { status: 404 });
    }
    
    // Get date parameter
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    
    // Parse date
    const date = new Date(dateParam);
    
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    
    // Check availability
    const availability = await ImagingService.checkProviderAvailability(provider_id, date);
    
    // Format the date strings for the available slots
    const formattedSlots = availability.availableSlots?.map(slot => ({
      time: formatDate(slot, true),
      timestamp: slot.toISOString()
    }));
    
    // Return availability information
    return NextResponse.json({
      provider_id,
      provider_name: provider.name,
      date: formatDate(date),
      available: availability.available,
      available_slots: formattedSlots || []
    });
    
  } catch (error) {
    console.error('Error checking provider availability:', error);
    return NextResponse.json({ error: 'Failed to check provider availability' }, { status: 500 });
  }
} 