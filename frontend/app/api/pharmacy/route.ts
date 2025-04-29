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
    const location = url.searchParams.get('location');
    const name = url.searchParams.get('name');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Build query
    const query: any = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    // Get pharmacies from database
    const pharmacies = await DatabaseService.findPharmacies(query);
    
    // Return pharmacies
    return successResponse(
      { pharmacies: pharmacies.slice(0, limit) },
      200,
      'Pharmacies retrieved successfully'
    );
    
  } catch (error) {
    return handleApiError(error);
  }
} 