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
    const category = url.searchParams.get('category');
    const name = url.searchParams.get('name');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Build query
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    // Get medicines from database
    const medicines = await DatabaseService.findMedicines(query);
    
    // Return medicines
    return successResponse(
      { medicines: medicines.slice(0, limit) },
      200,
      'Medicines retrieved successfully'
    );
    
  } catch (error) {
    return handleApiError(error);
  }
} 