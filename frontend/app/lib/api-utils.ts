import { NextResponse } from 'next/server';

// Base API URL - used for API requests from the client
// In production, this should be your actual API domain
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Success response
export const successResponse = <T>(
  data: T,
  status = HTTP_STATUS.OK,
  message = 'Success'
) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status }
  );
};

// Error response
export const errorResponse = (
  message = 'An error occurred',
  status = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  errors?: any
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      errors
    },
    { status }
  );
};

// Validation error response
export const validationErrorResponse = (errors: any) => {
  return errorResponse('Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
};

// Not found response
export const notFoundResponse = (message = 'Resource not found') => {
  return errorResponse(message, HTTP_STATUS.NOT_FOUND);
};

// Unauthorized response
export const unauthorizedResponse = (message = 'Unauthorized access') => {
  return errorResponse(message, HTTP_STATUS.UNAUTHORIZED);
};

// Forbidden response
export const forbiddenResponse = (message = 'Access forbidden') => {
  return errorResponse(message, HTTP_STATUS.FORBIDDEN);
};

// Conflict response
export const conflictResponse = (message = 'Resource already exists') => {
  return errorResponse(message, HTTP_STATUS.CONFLICT);
};

// Handle API errors
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.name === 'ValidationError') {
    return validationErrorResponse(error.errors);
  }
  
  if (error.code === 11000) {
    return conflictResponse('Duplicate entry found');
  }
  
  return errorResponse(
    error.message || 'An unexpected error occurred',
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}; 