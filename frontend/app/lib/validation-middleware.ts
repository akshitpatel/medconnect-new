import { NextRequest, NextResponse } from 'next/server';
import { apiError } from './auth-middleware';

/**
 * Type for validation schema objects
 */
export type ValidationSchema = {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'email' | 'phone' | 'objectId';
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | string;
  }
};

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

/**
 * Phone number validation regex - supports multiple formats
 */
export const PHONE_REGEX = /^(\+\d{1,3}[-\s]?)?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/;

/**
 * Object ID validation regex for MongoDB
 */
export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Middleware to validate request body against a schema
 * @param handler The next handler to call if validation passes
 * @param schema Validation schema object
 */
export function validateBody(handler: Function, schema: ValidationSchema) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      // Get the request body
      const body = await request.json();
      
      // Validate the body against the schema
      const validationErrors = validateData(body, schema);
      
      if (validationErrors.length > 0) {
        return apiError(`Validation error: ${validationErrors.join(', ')}`, 400);
      }
      
      // Call the next handler if validation passes
      return handler(request, ...args);
    } catch (error) {
      console.error('Validation error:', error);
      return apiError('Invalid request body', 400);
    }
  };
}

/**
 * Middleware to validate query parameters against a schema
 * @param handler The next handler to call if validation passes
 * @param schema Validation schema object
 */
export function validateQuery(handler: Function, schema: ValidationSchema) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      // Get the query parameters
      const { searchParams } = new URL(request.url);
      const query: Record<string, any> = {};
      
      // Convert URLSearchParams to a regular object
      // Fix for URLSearchParams iteration in older TypeScript targets
      searchParams.forEach((value, key) => {
        query[key] = value;
      });
      
      // Validate the query against the schema
      const validationErrors = validateData(query, schema);
      
      if (validationErrors.length > 0) {
        return apiError(`Validation error: ${validationErrors.join(', ')}`, 400);
      }
      
      // Call the next handler if validation passes
      return handler(request, ...args);
    } catch (error) {
      console.error('Validation error:', error);
      return apiError('Invalid query parameters', 400);
    }
  };
}

/**
 * Validate data against a schema
 * @param data Data to validate
 * @param schema Validation schema
 * @returns Array of validation error messages
 */
export function validateData(data: any, schema: ValidationSchema): string[] {
  const errors: string[] = [];
  
  // Check each field in the schema
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Check if field is required but missing
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation if field is not required and not provided
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Validate type
    switch (rules.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        } else {
          // Check string length
          if (rules.min !== undefined && value.length < rules.min) {
            errors.push(`${field} must be at least ${rules.min} characters`);
          }
          if (rules.max !== undefined && value.length > rules.max) {
            errors.push(`${field} must be at most ${rules.max} characters`);
          }
          // Check pattern
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`${field} has an invalid format`);
          }
          // Check enum
          if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
          }
        }
        break;
        
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push(`${field} must be a number`);
        } else {
          const numValue = Number(value);
          // Check range
          if (rules.min !== undefined && numValue < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
          if (rules.max !== undefined && numValue > rules.max) {
            errors.push(`${field} must be at most ${rules.max}`);
          }
          // Check enum
          if (rules.enum && !rules.enum.includes(numValue)) {
            errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
          }
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors.push(`${field} must be a boolean`);
        }
        break;
        
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push(`${field} must be an object`);
        }
        break;
        
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${field} must be an array`);
        } else {
          // Check array length
          if (rules.min !== undefined && value.length < rules.min) {
            errors.push(`${field} must have at least ${rules.min} items`);
          }
          if (rules.max !== undefined && value.length > rules.max) {
            errors.push(`${field} must have at most ${rules.max} items`);
          }
        }
        break;
        
      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push(`${field} must be a valid date`);
        }
        break;
        
      case 'email':
        if (typeof value !== 'string' || !EMAIL_REGEX.test(value)) {
          errors.push(`${field} must be a valid email address`);
        }
        break;
        
      case 'phone':
        if (typeof value !== 'string' || !PHONE_REGEX.test(value)) {
          errors.push(`${field} must be a valid phone number`);
        }
        break;
        
      case 'objectId':
        if (typeof value !== 'string' || !OBJECT_ID_REGEX.test(value)) {
          errors.push(`${field} must be a valid object ID`);
        }
        break;
    }
    
    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        if (typeof customResult === 'string') {
          errors.push(customResult);
        } else {
          errors.push(`${field} is invalid`);
        }
      }
    }
  }
  
  return errors;
}

/**
 * Common validation schemas for reuse
 */
export const ValidationSchemas = {
  // User schemas
  userCreate: {
    email: { type: 'email', required: true },
    fullName: { type: 'string', required: true, min: 2, max: 100 },
    role: { type: 'string', required: true, enum: ['patient', 'doctor', 'admin'] },
    password: { type: 'string', required: true, min: 8 },
    gender: { type: 'string', enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: 'date' }
  },
  
  userUpdate: {
    fullName: { type: 'string', min: 2, max: 100 },
    email: { type: 'email' },
    role: { type: 'string', enum: ['patient', 'doctor', 'admin'] },
    gender: { type: 'string', enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: 'date' },
    phone: { type: 'phone' },
    address: { type: 'string', max: 200 }
  },
  
  // Appointment schemas
  appointmentCreate: {
    doctorId: { type: 'objectId', required: true },
    date: { type: 'date', required: true },
    time: { type: 'string', required: true, pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    reason: { type: 'string', required: true, max: 500 },
    type: { type: 'string', required: true, enum: ['in-person', 'video', 'phone'] }
  },
  
  appointmentUpdate: {
    date: { type: 'date' },
    time: { type: 'string', pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    reason: { type: 'string', max: 500 },
    type: { type: 'string', enum: ['in-person', 'video', 'phone'] },
    status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'] }
  },
  
  // Query filters for date ranges
  dateRangeQuery: {
    from: { type: 'date' },
    to: { type: 'date' },
    limit: { type: 'number', min: 1, max: 100 },
    skip: { type: 'number', min: 0 }
  },
  
  // ID parameter
  idParam: {
    id: { type: 'objectId', required: true }
  }
}; 