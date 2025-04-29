import { NextRequest, NextResponse } from 'next/server';

// Get all content or filtered by query params
export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch content from database
    // For demo, return mock content data
    return NextResponse.json({
      contentItems: [
        {
          id: '1',
          title: 'Welcome to MedConnect',
          type: 'banner',
          content: 'Discover comprehensive healthcare services.',
          active: true,
          created: '2023-04-01T12:00:00Z',
          updated: '2023-04-02T10:30:00Z'
        },
        {
          id: '2',
          title: 'How to Use Symptom Checker',
          type: 'tutorial',
          content: 'Step by step guide on using our AI symptom checker.',
          active: true,
          created: '2023-04-05T09:15:00Z',
          updated: '2023-04-06T14:20:00Z'
        }
      ],
      totalItems: 2
    });
  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new content
export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json();
    
    // In a real app, this would save content to database
    // For demo, return success with mock ID
    return NextResponse.json({
      message: 'Content created successfully',
      content: {
        ...contentData,
        id: '3',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Content creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update content items in bulk (for status updates etc)
export async function PUT(request: NextRequest) {
  try {
    const { ids, updates } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Content IDs array is required' },
        { status: 400 }
      );
    }
    
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      );
    }
    
    // Perform updates one by one
    // In a real app, this would update content in database
    // For demo, return success
    return NextResponse.json({
      message: `${ids.length} content items updated successfully`
    });
  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}