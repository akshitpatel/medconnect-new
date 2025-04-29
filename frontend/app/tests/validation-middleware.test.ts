/// <reference types="jest" />

import { NextRequest } from 'next/server';
import { validateData, validateBody, validateQuery, ValidationSchema } from '../lib/validation-middleware';

// Mock the NextRequest for testing
const createMockRequest = (body: any = {}, url: string = 'http://localhost:3000/api/test'): NextRequest => {
  return {
    json: jest.fn().mockResolvedValue(body),
    url
  } as unknown as NextRequest;
};

// Mock the apiError function from auth-middleware
jest.mock('../lib/auth-middleware', () => ({
  apiError: jest.fn((message: string, status = 400) => ({
    error: true,
    message,
    status
  }))
}));

describe('Validation Middleware', () => {
  describe('validateData function', () => {
    test('should return no errors for valid data', () => {
      const schema: ValidationSchema = {
        name: { type: 'string', required: true },
        age: { type: 'number', min: 18, max: 100 },
        email: { type: 'email', required: true }
      };
      
      const data = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };
      
      const errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
    
    test('should return errors for missing required fields', () => {
      const schema: ValidationSchema = {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true }
      };
      
      const data = {
        name: 'John Doe'
      };
      
      const errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('email is required');
    });
    
    test('should validate string length constraints', () => {
      const schema: ValidationSchema = {
        username: { type: 'string', required: true, min: 3, max: 10 }
      };
      
      // Too short
      let data = { username: 'ab' };
      let errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('at least 3 characters');
      
      // Too long
      data = { username: 'abcdefghijk' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('at most 10 characters');
      
      // Just right
      data = { username: 'abcdef' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
    
    test('should validate number constraints', () => {
      const schema: ValidationSchema = {
        age: { type: 'number', required: true, min: 18, max: 65 }
      };
      
      // Too small
      let data = { age: 16 };
      let errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('at least 18');
      
      // Too large
      data = { age: 70 };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('at most 65');
      
      // Just right
      data = { age: 30 };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
    
    test('should validate enum values', () => {
      const schema: ValidationSchema = {
        role: { type: 'string', required: true, enum: ['admin', 'user', 'guest'] }
      };
      
      // Invalid value
      let data = { role: 'manager' };
      let errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('must be one of');
      
      // Valid value
      data = { role: 'admin' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
    
    test('should validate email format', () => {
      const schema: ValidationSchema = {
        email: { type: 'email', required: true }
      };
      
      // Invalid format
      let data = { email: 'notanemail' };
      let errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('valid email');
      
      // Valid format
      data = { email: 'user@example.com' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
    
    test('should validate using custom functions', () => {
      const schema: ValidationSchema = {
        password: {
          type: 'string',
          required: true,
          custom: (value) => {
            if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
            if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
            return true;
          }
        }
      };
      
      // Missing uppercase
      let data = { password: 'password123' };
      let errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('uppercase letter');
      
      // Missing number
      data = { password: 'Password' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('one number');
      
      // Valid
      data = { password: 'Password123' };
      errors = validateData(data, schema);
      expect(errors).toHaveLength(0);
    });
  });
  
  describe('validateBody middleware', () => {
    test('should call the handler for valid body', async () => {
      const schema: ValidationSchema = {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true }
      };
      
      const mockHandler = jest.fn().mockReturnValue({ success: true });
      const middleware = validateBody(mockHandler, schema);
      
      const req = createMockRequest({ name: 'John', email: 'john@example.com' });
      await middleware(req);
      
      expect(mockHandler).toHaveBeenCalledWith(req);
    });
    
    test('should return error for invalid body', async () => {
      const schema: ValidationSchema = {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true }
      };
      
      const mockHandler = jest.fn().mockReturnValue({ success: true });
      const middleware = validateBody(mockHandler, schema);
      
      const req = createMockRequest({ name: 'John' }); // Missing email
      const response = await middleware(req);
      
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response).toHaveProperty('error', true);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('email is required');
    });
  });
  
  describe('validateQuery middleware', () => {
    test('should call the handler for valid query parameters', async () => {
      const schema: ValidationSchema = {
        limit: { type: 'number', min: 1, max: 100 },
        page: { type: 'number', min: 1 }
      };
      
      const mockHandler = jest.fn().mockReturnValue({ success: true });
      const middleware = validateQuery(mockHandler, schema);
      
      const req = createMockRequest({}, 'http://localhost:3000/api/test?limit=10&page=2');
      await middleware(req);
      
      expect(mockHandler).toHaveBeenCalledWith(req);
    });
    
    test('should return error for invalid query parameters', async () => {
      const schema: ValidationSchema = {
        limit: { type: 'number', min: 1, max: 100 },
        page: { type: 'number', min: 1, required: true }
      };
      
      const mockHandler = jest.fn().mockReturnValue({ success: true });
      const middleware = validateQuery(mockHandler, schema);
      
      // Missing required page parameter
      const req = createMockRequest({}, 'http://localhost:3000/api/test?limit=10');
      const response = await middleware(req);
      
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response).toHaveProperty('error', true);
      expect(response).toHaveProperty('message');
      expect(response.message).toContain('page is required');
    });
  });
}); 