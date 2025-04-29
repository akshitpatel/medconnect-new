import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth-utils';
import { unauthorizedResponse, forbiddenResponse } from './api-utils';

// Type for the context
export interface ApiContext {
  params: any;
  user?: any;
}

// Type for the handler function
export type ApiHandler = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse> | NextResponse;

// Middleware to check if user is authenticated
export const withAuth = (handler: ApiHandler): ApiHandler => {
  return async (req: NextRequest, context: ApiContext) => {
    try {
      // Get current user from token
      const user = await getCurrentUser();
      
      if (!user) {
        return unauthorizedResponse('Authentication required');
      }
      
      // Add user to context
      return handler(req, { ...context, user });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return unauthorizedResponse('Authentication failed');
    }
  };
};

// Middleware to check if user has required role
export const withRole = (roles: string | string[], handler: ApiHandler): ApiHandler => {
  return async (req: NextRequest, context: ApiContext) => {
    try {
      // Get current user from token
      const user = await getCurrentUser();
      
      if (!user) {
        return unauthorizedResponse('Authentication required');
      }
      
      // Check if user has required role
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      
      if (!allowedRoles.includes(user.role)) {
        return forbiddenResponse('You do not have permission to access this resource');
      }
      
      // Add user to context
      return handler(req, { ...context, user });
    } catch (error) {
      console.error('Role middleware error:', error);
      return unauthorizedResponse('Authentication failed');
    }
  };
}; 