import { NextRequest, NextResponse } from 'next/server';
import DatabaseService from '../../lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Save to database
    const result = await DatabaseService.saveSymptomCheck(data);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: 'Symptom check saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving symptom check:', error);
    return NextResponse.json(
      { error: 'Failed to save symptom check' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    const query: any = {};
    
    // Build query based on params
    if (id) query._id = id;
    if (userId) query.userId = userId;
    if (status) query.status = status;
    
    const symptomChecks = await DatabaseService.findSymptomChecks(query);
    
    return NextResponse.json({ symptomChecks });
    
  } catch (error) {
    console.error('Error fetching symptom checks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch symptom checks' },
      { status: 500 }
    );
  }
} 