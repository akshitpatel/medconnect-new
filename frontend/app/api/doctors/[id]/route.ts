import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // In a real app, this would fetch doctor data from a database
    // For demo purposes, return mock data
    return NextResponse.json({
      doctor: {
        id,
        name: 'Dr. John Smith',
        specialization: 'General Medicine',
        licenseNumber: '12345',
        email: 'john.smith@medconnect.com',
        phone: '555-0123',
        status: 'active',
        type: 'doctor',
        bio: 'Experienced general practitioner with 15 years of practice.',
        location: {
          address: '123 Health St, Suite 456',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        availability: {
          monday: ['09:00-12:00', '14:00-17:00'],
          tuesday: ['09:00-12:00', '14:00-17:00'],
          wednesday: ['09:00-12:00'],
          thursday: ['09:00-12:00', '14:00-17:00'],
          friday: ['09:00-12:00', '14:00-16:00']
        },
        rating: 4.8,
        reviewsCount: 127
      }
    });
  } catch (error) {
    console.error('Doctor fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updateData = await req.json();
    
    // In a real app, this would update doctor data in database
    // For demo, return success
    return NextResponse.json({
      message: 'Doctor information updated successfully',
      doctor: {
        id,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Doctor update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}