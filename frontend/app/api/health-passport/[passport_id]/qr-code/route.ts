import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { HealthPassportService } from '@/app/lib/services/health-passport-service';
import { generateQRCode } from '@/app/lib/utils';

interface Params {
  params: {
    passport_id: string;
  };
}

// Generate a QR code for a health passport
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Verify user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { passport_id } = params;
    
    // Get the health passport
    const passport = await HealthPassportService.getHealthPassportById(passport_id);
    
    if (!passport) {
      return NextResponse.json({ error: 'Health passport not found' }, { status: 404 });
    }
    
    // Check if the authenticated user is the owner of the passport or has admin rights
    if (passport.user_id.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get URL parameters
    const searchParams = request.nextUrl.searchParams;
    const expirationHours = parseInt(searchParams.get('expiration') || '24');
    
    // Generate an access code for the passport
    const accessCode = await HealthPassportService.generateAccessCode(passport_id, expirationHours);
    
    if (!accessCode) {
      return NextResponse.json({ error: 'Failed to generate access code' }, { status: 500 });
    }
    
    // Create the data to encode in the QR code
    const qrData = JSON.stringify({
      type: 'health_passport',
      access_code: accessCode,
      passport_id: passport_id,
      expires_in: `${expirationHours} hours`
    });
    
    // Generate QR code
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    // Return the QR code data URL and access code
    return NextResponse.json({
      qr_code: qrCodeDataUrl,
      access_code: accessCode,
      expires_in: `${expirationHours} hours`
    });
    
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
} 