import { NextRequest } from 'next/server';
import { 
  successResponse, 
  validationErrorResponse,
  handleApiError 
} from '@/app/lib/api-utils';
import DatabaseService from '@/app/lib/db-service';
import { withAuth, ApiContext } from '@/app/lib/api-middleware';

// Get lab tests
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
    
    // Get lab tests from database
    const labTests = await DatabaseService.findLabTests(query);
    
    // Return lab tests
    return successResponse(
      { labTests: labTests.slice(0, limit) },
      200,
      'Lab tests retrieved successfully'
    );
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Book a lab test
async function handlePost(req: NextRequest, context: ApiContext) {
  try {
    if (!context.user) {
      return validationErrorResponse({ message: 'User not found' });
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['testId', 'testName', 'appointmentDate', 'appointmentTime', 'labId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return validationErrorResponse({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        fields: missingFields
      });
    }
    
    // Validate appointment date
    const appointmentDate = new Date(body.appointmentDate);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
      return validationErrorResponse({
        message: 'Invalid appointment date',
        fields: ['appointmentDate']
      });
    }
    
    // Book lab test
    const testData = {
      patientId: context.user.userId,
      testId: body.testId,
      testName: body.testName,
      labId: body.labId,
      labName: body.labName || '',
      appointmentDate: appointmentDate,
      appointmentTime: body.appointmentTime,
      prescriptionImage: body.prescriptionImage || null,
      notes: body.notes || '',
      status: 'booked',
      price: body.price || 0,
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await DatabaseService.bookLabTest(testData);
    
    // Return success response
    return successResponse(
      { 
        message: 'Lab test booked successfully',
        bookingId: result.insertedId
      },
      201,
      'Lab test booked'
    );
    
  } catch (error) {
    return handleApiError(error);
  }
}

export const POST = withAuth(handlePost); 