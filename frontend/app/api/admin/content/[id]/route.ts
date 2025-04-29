import { NextRequest, NextResponse } from 'next/server';

// Removed MongoDB and auth utility imports

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // In a real app, this would fetch content from database
    // For demo purposes, return mock data
    return NextResponse.json({
      content: {
        id,
        title: 'Sample Content Item',
        type: 'article',
        content: 'This is a sample content item for demonstration purposes.',
        active: true,
        created: '2023-04-01T12:00:00Z',
        updated: '2023-04-02T10:30:00Z'
      }
    });
  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const contentData = await req.json();
    
    // In a real app, this would update content in database
    // For demo, return success
    return NextResponse.json({
      message: 'Content updated successfully',
      content: {
        ...contentData,
        id,
        updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Content update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // In a real app, this would delete content from database
    // For demo, return success
    return NextResponse.json({
      message: `Content item ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Content deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}