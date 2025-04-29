import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth-options';

/**
 * Middleware function for protecting API routes
 * Validates user session and returns standardized error responses
 * If requireAuth is false, it will skip authentication and pass through
 */
export async function withAuth(handler: Function, requireAuth: boolean = true) {
  return async function(request: NextRequest, ...args: any[]) {
    try {
      // If authentication is not required, just call the handler
      if (!requireAuth) {
        return handler(request, null, ...args);
      }
      
      // Get the user session
      const session = await getServerSession(authOptions);
      
      // Check if user is authenticated
      if (!session || !session.user) {
        return NextResponse.json({
          success: false,
          error: 'Unauthorized',
          message: 'You must be logged in to access this resource',
        }, { status: 401 });
      }
      
      // Call the original handler with the session user
      return handler(request, session, ...args);
    } catch (error) {
      console.error('Authentication error:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        message: 'An error occurred while authenticating your request',
      }, { status: 500 });
    }
  };
}

/**
 * Middleware function for role-based access control
 * @param handler - The API route handler function
 * @param allowedRoles - Array of roles allowed to access this resource
 */
export function withRoles(handler: Function, allowedRoles: string[]) {
  return withAuth(async (request: NextRequest, session: any) => {
    const userRole = session.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      }, { status: 403 });
    }
    
    return handler(request, session);
  });
}

/**
 * Standardized API response format
 */
export function apiResponse(data: any, status = 200) {
  return NextResponse.json({
    success: true,
    data,
  }, { status });
}

/**
 * Standardized API error response
 */
export function apiError(message: string, statusCode = 400, errorCode?: string) {
  return NextResponse.json({
    success: false,
    error: errorCode || 'error',
    message,
  }, { status: statusCode });
} 