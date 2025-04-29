import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';

interface Params {
  params: {
    user_id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = params.user_id;
    
    // Check if the authenticated user is requesting their own passport or has admin rights
    if (user.userId !== userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportByUserId(userId);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    return NextResponse.json({ passport });
    
  } catch (error) {
    console.error('Error retrieving health passport:', error);
    return NextResponse.json({ error: 'Failed to retrieve health passport' }, { status: 500 });
  }
} 