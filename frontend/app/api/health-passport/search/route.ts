import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

// Search for health passports
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is a provider or admin (only they can search)
    if (user.role !== 'provider' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - only providers and admins can search health passports' }, { status: 403 });
    }
    
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query: any = {};
    
    // Extract search parameters
    if (searchParams.has('name')) {
      query.name = searchParams.get('name');
    }
    
    if (searchParams.has('dob')) {
      query.dob = searchParams.get('dob');
    }
    
    if (searchParams.has('passport_id')) {
      query.passport_id = searchParams.get('passport_id');
    }
    
    if (searchParams.has('email')) {
      query.email = searchParams.get('email');
    }
    
    if (searchParams.has('phone')) {
      query.phone = searchParams.get('phone');
    }
    
    if (searchParams.has('user_id')) {
      query.user_id = searchParams.get('user_id');
    }
    
    // Handle pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Search for health passports
    const result = await HealthPassportService.searchHealthPassports(query, page, limit);
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to search health passports' }, { status: 500 });
    }
    
    // Return search results with pagination info
    return NextResponse.json({
      passports: result.passports,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error searching health passports:', error);
    return NextResponse.json({ error: 'Failed to search health passports' }, { status: 500 });
  }
} 