import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '../../lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bodyPartId = searchParams.get('bodyPartId');
    
    let symptoms;
    if (bodyPartId) {
      // Fetch symptoms for specific body part
      symptoms = await DatabaseService.findSymptomsByBodyPart(bodyPartId);
    } else {
      // Fetch all symptoms
      symptoms = await DatabaseService.findAllSymptoms();
    }
    
    // If no symptoms in the database yet, return an empty array
    // In production, you'd want to seed the database with symptoms first
    return NextResponse.json({ symptoms: symptoms || [] });
    
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch symptoms' },
      { status: 500 }
    );
  }
}

// Seed data - used only if the database is empty
export async function POST(request: NextRequest) {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const db = await DatabaseService.getDb();
    const symptomsCollection = db.collection('symptoms');
    
    // Check if collection is empty before seeding
    const count = await symptomsCollection.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Symptoms collection already populated' });
    }
    
    // Insert seed data
    await symptomsCollection.insertMany(data.symptoms);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Symptoms seeded successfully',
      count: data.symptoms.length
    });
    
  } catch (error) {
    console.error('Error seeding symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to seed symptoms' },
      { status: 500 }
    );
  }
} 