import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the health passport for the current user
    const passport = await HealthPassportService.getHealthPassportByUserId(user.userId);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    return NextResponse.json({ passport });
    
  } catch (error) {
    console.error('Error retrieving health passport:', error);
    return NextResponse.json({ error: 'Failed to retrieve health passport' }, { status: 500 });
  }
} 