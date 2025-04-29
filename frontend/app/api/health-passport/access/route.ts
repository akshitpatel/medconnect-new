import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

// Access a health passport using an access code
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const { access_code } = await request.json();
    
    if (!access_code) {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
    }
    
    // Create accessor info
    const accessorInfo = {
      type: user.role,
      id: new ObjectId(user.userId),
      name: user.email
    };
    
    // Access the passport with the code
    const passport = await HealthPassportService.accessWithCode(access_code, accessorInfo);
    
    if (!passport) {
      return NextResponse.json({ error: 'Invalid or expired access code' }, { status: 404 });
    }
    
    // Return the passport data
    return NextResponse.json({
      message: 'Health passport accessed successfully',
      passport
    });
    
  } catch (error) {
    console.error('Error accessing health passport:', error);
    return NextResponse.json({ error: 'Failed to access health passport' }, { status: 500 });
  }
} 