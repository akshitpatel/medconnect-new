import { NextRequest } from 'next/server';
import { 
  successResponse, 
  handleApiError 
} from '@/app/lib/api-utils';
import DatabaseService from '@/app/lib/db-service';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const location = url.searchParams.get('location');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Build query
    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Get emergency services from database
    const emergencyServices = await DatabaseService.findEmergencyServices(query);
    
    // Return emergency services
    return successResponse(
      { emergencyServices: emergencyServices.slice(0, limit) },
      200,
      'Emergency services retrieved successfully'
    );
    
  } catch (error) {
    return handleApiError(error);
  }
} 