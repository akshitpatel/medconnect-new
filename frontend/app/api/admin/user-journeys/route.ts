import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch user journey data from database
    // For demo purposes, return mock data
    return NextResponse.json({
      journeys: [
        {
          id: '1',
          userId: 'user123',
          path: ['login', 'profile', 'symptom-checker', 'results'],
          completed: true,
          lastActive: '2023-05-10T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user456',
          path: ['login', 'health-passport'],
          completed: false,
          lastActive: '2023-05-11T14:20:00Z'
        }
      ],
      analytics: {
        totalJourneys: 2,
        completionRate: 0.5,
        avgSteps: 3
      }
    });
  } catch (error: any) {
    console.error('User journeys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add search capability
export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    // const session = await getServerSession();
    // if (!session || !session.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const data = await request.json();
    const { query, filters, limit = 20, skip = 0 } = data;
    
    // Build search query
    const searchQuery: any = {};
    
    // Apply text search if query is provided
    if (query) {
      // If MongoDB has text index on userJourneys collection
      // searchQuery.$text = { $search: query };
      
      // Alternatively, use regex for simple search
      searchQuery.$or = [
        { sessionId: { $regex: query, $options: 'i' } },
        { 'metadata.clientIp': { $regex: query, $options: 'i' } },
        { 'events.data.symptoms': { $regex: query, $options: 'i' } }
      ];
    }
    
    // Apply filters
    if (filters) {
      if (filters.startDate) {
        searchQuery.startedAt = { $gte: new Date(filters.startDate) };
      }
      
      if (filters.endDate) {
        searchQuery.startedAt = { 
          ...searchQuery.startedAt || {},
          $lte: new Date(filters.endDate)
        };
      }
      
      if (filters.journeyType) {
        searchQuery.journeyType = filters.journeyType;
      }
      
      if (filters.isCompleted !== undefined) {
        searchQuery.isCompleted = filters.isCompleted;
      }
      
      if (filters.hasFeedback) {
        searchQuery['outcome.feedback'] = { $exists: true };
      }
    }
    
    // In a real app, this would fetch user journey data from database
    // For demo purposes, return mock data
    return NextResponse.json({
      journeys: [
        {
          id: '1',
          userId: 'user123',
          path: ['login', 'profile', 'symptom-checker', 'results'],
          completed: true,
          lastActive: '2023-05-10T10:30:00Z'
        },
        {
          id: '2',
          userId: 'user456',
          path: ['login', 'health-passport'],
          completed: false,
          lastActive: '2023-05-11T14:20:00Z'
        }
      ],
      count: 2,
      total: 2,
      skip,
      limit
    });
  } catch (error: any) {
    console.error('Error searching user journeys:', error);
    return NextResponse.json(
      { error: 'Failed to search user journeys', details: error.message },
      { status: 500 }
    );
  }
}