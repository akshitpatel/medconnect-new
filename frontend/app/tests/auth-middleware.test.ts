import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRoles, apiResponse, apiError } from '../lib/auth-middleware';
import { getServerSession } from 'next-auth/next';

// Mock the next-auth module
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

describe('Authentication Middleware', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('withAuth middleware', () => {
    it('should return 401 when no session exists', async () => {
      // Mock getServerSession to return null (no session)
      (getServerSession as jest.Mock).mockResolvedValue(null);

      // Create a mock handler function
      const mockHandler = jest.fn();
      
      // Create a mock request
      const mockRequest = {
        url: 'https://medconnect.app/api/test',
      } as unknown as NextRequest;

      // Call the withAuth middleware with the mock handler
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest);
      
      // Assert that the response is an unauthorized response
      expect(response.status).toBe(401);
      
      // Parse the response to get the JSON
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
      
      // Assert that the handler was not called
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should call the handler when a valid session exists', async () => {
      // Mock a valid session
      const mockSession = { 
        user: { 
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'patient'
        } 
      };
      
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Create a mock handler that returns a successful response
      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ data: 'test data' }, { status: 200 })
      );
      
      // Create a mock request
      const mockRequest = {
        url: 'https://medconnect.app/api/test',
      } as unknown as NextRequest;

      // Call the withAuth middleware with the mock handler
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest);
      
      // Assert that the handler was called with the request and session
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockSession);
      
      // Assert that the response is the one returned by the handler
      expect(response.status).toBe(200);
      
      // Parse the response to get the JSON
      const responseData = await response.json();
      expect(responseData.data).toBe('test data');
    });

    it('should handle errors during authentication', async () => {
      // Mock getServerSession to throw an error
      (getServerSession as jest.Mock).mockRejectedValue(new Error('Auth error'));

      // Create a mock handler function
      const mockHandler = jest.fn();
      
      // Create a mock request
      const mockRequest = {
        url: 'https://medconnect.app/api/test',
      } as unknown as NextRequest;

      // Call the withAuth middleware with the mock handler
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest);
      
      // Assert that the response is a server error
      expect(response.status).toBe(500);
      
      // Parse the response to get the JSON
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Authentication error');
      
      // Assert that the handler was not called
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('withRoles middleware', () => {
    it('should return 403 when user has an invalid role', async () => {
      // Mock a valid session but with a role not in the allowed roles
      const mockSession = { 
        user: { 
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'patient'
        } 
      };
      
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Create a mock handler function
      const mockHandler = jest.fn();
      
      // Create a mock request
      const mockRequest = {
        url: 'https://medconnect.app/api/admin/test',
      } as unknown as NextRequest;

      // Call the withRoles middleware with roles that don't include the user's role
      const wrappedHandler = withRoles(mockHandler, ['admin', 'doctor']);
      const response = await wrappedHandler(mockRequest);
      
      // Assert that the response is a forbidden response
      expect(response.status).toBe(403);
      
      // Parse the response to get the JSON
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Forbidden');
      
      // Assert that the handler was not called
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should call the handler when user has a valid role', async () => {
      // Mock a valid session with a role in the allowed roles
      const mockSession = { 
        user: { 
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'admin'
        } 
      };
      
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Create a mock handler that returns a successful response
      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ data: 'admin data' }, { status: 200 })
      );
      
      // Create a mock request
      const mockRequest = {
        url: 'https://medconnect.app/api/admin/test',
      } as unknown as NextRequest;

      // Call the withRoles middleware with roles that include the user's role
      const wrappedHandler = withRoles(mockHandler, ['admin', 'superadmin']);
      const response = await wrappedHandler(mockRequest);
      
      // Assert that the handler was called with the request and session
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockSession);
      
      // Assert that the response is the one returned by the handler
      expect(response.status).toBe(200);
      
      // Parse the response to get the JSON
      const responseData = await response.json();
      expect(responseData.data).toBe('admin data');
    });
  });

  describe('API response helpers', () => {
    it('should format apiResponse correctly', () => {
      const data = { test: 'data' };
      const response = apiResponse(data);
      
      expect(response.status).toBe(200);
      
      // Parse the response to get the JSON
      response.json().then(json => {
        expect(json.success).toBe(true);
        expect(json.data).toEqual(data);
      });
    });

    it('should format apiResponse with custom status', () => {
      const data = { created: true };
      const response = apiResponse(data, 201);
      
      expect(response.status).toBe(201);
      
      // Parse the response to get the JSON
      response.json().then(json => {
        expect(json.success).toBe(true);
        expect(json.data).toEqual(data);
      });
    });

    it('should format apiError correctly', () => {
      const message = 'Test error message';
      const response = apiError(message);
      
      expect(response.status).toBe(400);
      
      // Parse the response to get the JSON
      response.json().then(json => {
        expect(json.success).toBe(false);
        expect(json.message).toBe(message);
        expect(json.error).toBe('error');
      });
    });

    it('should format apiError with custom status and code', () => {
      const message = 'Resource not found';
      const response = apiError(message, 404, 'not_found');
      
      expect(response.status).toBe(404);
      
      // Parse the response to get the JSON
      response.json().then(json => {
        expect(json.success).toBe(false);
        expect(json.message).toBe(message);
        expect(json.error).toBe('not_found');
      });
    });
  });
}); 