import { NextRequest, NextResponse } from 'next/server';

// Removed MongoDB imports

export async function GET(request: NextRequest, { params }: { params: { passport_id: string } }) {
  try {
    const { passport_id } = params;
    
    // In a real app, this would fetch records from a database
    // For demo purposes, return mock data
    return NextResponse.json({
      records: [
        {
          id: 'rec1',
          passportId: passport_id,
          type: 'vaccination',
          description: 'Flu Vaccine',
          date: '2023-01-15',
          provider: 'Local Clinic',
          details: { dosage: '0.5mL', batch: 'FL123' }
        },
        {
          id: 'rec2',
          passportId: passport_id,
          type: 'test',
          description: 'Blood Test',
          date: '2023-03-10',
          provider: 'MedLab',
          details: { result: 'Normal', notes: 'Annual checkup' }
        }
      ]
    });
  } catch (error) {
    console.error('Health records fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { passport_id: string } }) {
  try {
    const { passport_id } = params;
    const recordData = await request.json();
    
    // In a real app, this would save to a database
    // For demo, return success with mock ID
    return NextResponse.json({
      message: 'Record added successfully',
      record: {
        ...recordData,
        id: 'rec3',
        passportId: passport_id,
        date: recordData.date || new Date().toISOString().split('T')[0]
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Health record creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}