import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { ImagingService } from '@/app/lib/services/imaging-service';

// Get all imaging providers with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query: any = {};
    
    // Extract search parameters
    if (searchParams.has('name')) {
      query.name = searchParams.get('name');
    }
    
    if (searchParams.has('specialty')) {
      query.specialty = searchParams.get('specialty');
    }
    
    // Handle location search
    if (searchParams.has('city') || searchParams.has('state') || searchParams.has('zip')) {
      query.location = {};
      
      if (searchParams.has('city')) {
        query.location.city = searchParams.get('city');
      }
      
      if (searchParams.has('state')) {
        query.location.state = searchParams.get('state');
      }
      
      if (searchParams.has('zip')) {
        query.location.zip = searchParams.get('zip');
      }
    }
    
    // Handle coordinates-based search
    if (searchParams.has('lat') && searchParams.has('lng') && searchParams.has('distance')) {
      const lat = parseFloat(searchParams.get('lat') || '0');
      const lng = parseFloat(searchParams.get('lng') || '0');
      const distance = parseFloat(searchParams.get('distance') || '10000'); // default 10km
      
      query.location = {
        coordinates: [lng, lat], // MongoDB uses [longitude, latitude]
        maxDistance: distance
      };
    }
    
    if (searchParams.has('insurance')) {
      query.insurance = searchParams.get('insurance');
    }
    
    // Handle pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Search for imaging providers
    const result = await ImagingService.searchImagingProviders(query, page, limit);
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to search imaging providers' }, { status: 500 });
    }
    
    // Return search results with pagination info
    return NextResponse.json({
      providers: result.providers,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching imaging providers:', error);
    return NextResponse.json({ error: 'Failed to search imaging providers' }, { status: 500 });
  }
}

// Create a new imaging provider (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is an admin
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only admins can create imaging providers' }, { status: 403 });
    }
    
    // Parse request body
    const providerData = await request.json();
    
    // Validate required fields
    if (!providerData.name || !providerData.address || !providerData.contact || !providerData.specialties) {
      return NextResponse.json({ 
        error: 'Missing required fields. Please provide name, address, contact information, and specialties.' 
      }, { status: 400 });
    }
    
    // Set active status and verification status
    providerData.active = true;
    providerData.verification_status = providerData.verification_status || 'pending';
    
    // Create the imaging provider
    const provider = await ImagingService.createImagingProvider(providerData);
    
    return NextResponse.json({ 
      message: 'Imaging provider created successfully',
      provider
    });
    
  } catch (error) {
    console.error('Error creating imaging provider:', error);
    return NextResponse.json({ error: 'Failed to create imaging provider' }, { status: 500 });
  }
} 