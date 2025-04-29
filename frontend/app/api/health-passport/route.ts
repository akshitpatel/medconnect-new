import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth-options';
import { HealthPassport } from '@/app/types/api-types';
import QRCode from 'qrcode';

// GET handler for fetching health passport
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Fetch health passport from the database
    const db = await DatabaseService.getDb();
    const passport = await db.collection('healthPassports').findOne({ patientId: userId });
    
    // Generate mock data if no passport is found
    if (!passport) {
      const mockPassport = await generateMockHealthPassport(userId as string);
      return NextResponse.json({ passport: mockPassport });
    }
    
    return NextResponse.json({ passport });
  } catch (error) {
    console.error('Error fetching health passport:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health passport' },
      { status: 500 }
    );
  }
}

// POST handler for creating/updating health passport
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const passportData = await request.json();
    
    // Validate required fields
    if (!passportData.bloodGroup || !passportData.emergencyContact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a QR code for the passport
    const qrCodeData = {
      passportId: passportData._id || new ObjectId().toString(),
      patientId: userId,
      accessToken: generateAccessToken(),
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour validity
    };
    
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
    
    const db = await DatabaseService.getDb();
    
    // Check if passport exists and update it, or create a new one
    const existingPassport = await db.collection('healthPassports').findOne({ patientId: userId });
    
    if (existingPassport) {
      // Update existing passport
      const result = await db.collection('healthPassports').updateOne(
        { patientId: userId },
        { 
          $set: {
            ...passportData,
            qrCode,
            updatedAt: new Date().toISOString()
          } 
        }
      );
      
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'Failed to update health passport' },
          { status: 500 }
        );
      }
      
      const updatedPassport = await db.collection('healthPassports').findOne({ patientId: userId });
      return NextResponse.json({ passport: updatedPassport, success: true });
      
    } else {
      // Create new passport
      const newPassport = {
        ...passportData,
        _id: new ObjectId().toString(),
        patientId: userId,
        qrCode,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await db.collection('healthPassports').insertOne(newPassport);
      
      if (!result.insertedId) {
        return NextResponse.json(
          { error: 'Failed to create health passport' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ passport: newPassport, success: true }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Error creating/updating health passport:', error);
    return NextResponse.json(
      { error: 'Failed to create/update health passport' },
      { status: 500 }
    );
  }
}

// Helper function to generate a mock health passport
async function generateMockHealthPassport(userId: string): Promise<HealthPassport> {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const allergies = [
    'Penicillin', 
    'Peanuts', 
    'Shellfish', 
    'Dust mites', 
    'Pollen', 
    'Latex',
    'Eggs',
    'Milk'
  ];
  
  // Generate 0-3 random allergies
  const patientAllergies = [];
  const allergyCount = Math.floor(Math.random() * 4);
  
  for (let i = 0; i < allergyCount; i++) {
    const allergyIndex = Math.floor(Math.random() * allergies.length);
    if (!patientAllergies.includes(allergies[allergyIndex])) {
      patientAllergies.push(allergies[allergyIndex]);
    }
  }
  
  // Generate QR code
  const qrCodeData = {
    passportId: new ObjectId().toString(),
    patientId: userId,
    accessToken: generateAccessToken(),
    expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour validity
  };
  
  const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
  
  return {
    _id: qrCodeData.passportId,
    patientId: userId,
    bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
    allergies: patientAllergies,
    emergencyContact: {
      name: 'Emergency Contact',
      relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
      phone: `+1${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`
    },
    isActive: true,
    qrCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Helper function to generate a random access token
function generateAccessToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
} 