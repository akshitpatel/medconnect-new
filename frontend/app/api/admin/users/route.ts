import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withRoles, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { User } from '@/app/types/api-types';

/**
 * GET handler for fetching all users (admin only)
 * Uses the withRoles middleware to restrict access to admins
 */
export const GET = withRoles(async (request: NextRequest, session: any) => {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const role = searchParams.get('role');
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    const skip = searchParams.get('skip') ? parseInt(searchParams.get('skip') as string) : 0;
    
    // Construct the query based on parameters
    let dbQuery: any = {};
    
    if (role) {
      dbQuery.role = role;
    }
    
    if (query) {
      dbQuery.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Fetch users from the database
    const db = await DatabaseService.getDb();
    const totalUsers = await db.collection('users').countDocuments(dbQuery);
    
    const users = await db.collection('users')
      .find(dbQuery)
      .sort({ fullName: 1 })
      .skip(skip)
      .limit(limit)
      .project({ password: 0 }) // Exclude password field
      .toArray();
    
    return apiResponse({ 
      users,
      pagination: {
        total: totalUsers,
        limit,
        skip,
        hasMore: skip + users.length < totalUsers
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return apiError('Failed to fetch users. Please try again later.', 500);
  }
}, ['admin']); // Only admins can access this endpoint

/**
 * POST handler for creating new users (admin only)
 */
export const POST = withRoles(async (request: NextRequest, session: any) => {
  try {
    const userData = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'fullName', 'role'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return apiError(`Missing required field: ${field}`, 400);
      }
    }
    
    // Validate role
    const validRoles = ['patient', 'doctor', 'admin'];
    if (!validRoles.includes(userData.role)) {
      return apiError('Invalid role specified', 400);
    }
    
    // Check if user already exists
    const db = await DatabaseService.getDb();
    const existingUser = await db.collection('users').findOne({ email: userData.email });
    
    if (existingUser) {
      return apiError('User with this email already exists', 409);
    }
    
    // Create the user
    const newUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    if (!result.insertedId) {
      return apiError('Failed to create user', 500);
    }
    
    // Fetch the created user without the password field
    const createdUser = await db.collection('users')
      .findOne(
        { _id: result.insertedId },
        { projection: { password: 0 } }
      );
    
    return apiResponse({ user: createdUser }, 201);
  } catch (error) {
    console.error('Error creating user:', error);
    return apiError('Failed to create user. Please check your input and try again.', 500);
  }
}, ['admin']); // Only admins can access this endpoint

/**
 * PATCH handler for updating user information (admin only)
 */
export const PATCH = withRoles(async (request: NextRequest, session: any) => {
  try {
    const { userId, updates } = await request.json();
    
    if (!userId || !updates) {
      return apiError('Missing required parameters: userId and updates', 400);
    }
    
    // Validate user ID
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return apiError('Invalid user ID format', 400);
    }
    
    // Prevent updating sensitive fields
    const allowedUpdates = ['fullName', 'email', 'role', 'gender', 'address', 'phone', 'dateOfBirth'];
    const updateFields: Record<string, any> = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateFields[key] = updates[key];
      }
    });
    
    if (Object.keys(updateFields).length === 0) {
      return apiError('No valid fields to update', 400);
    }
    
    // Add the updatedAt timestamp
    updateFields.updatedAt = new Date();
    updateFields.updatedBy = session.user.id;
    
    // Update the user
    const db = await DatabaseService.getDb();
    const result = await db.collection('users').updateOne(
      { _id: userObjectId },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return apiError('User not found', 404);
    }
    
    // Fetch the updated user without the password field
    const updatedUser = await db.collection('users')
      .findOne(
        { _id: userObjectId },
        { projection: { password: 0 } }
      );
    
    return apiResponse({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return apiError('Failed to update user. Please try again later.', 500);
  }
}, ['admin']); // Only admins can access this endpoint

/**
 * DELETE handler for removing users (admin only)
 */
export const DELETE = withRoles(async (request: NextRequest, session: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return apiError('Missing required parameter: id', 400);
    }
    
    // Validate user ID
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      return apiError('Invalid user ID format', 400);
    }
    
    // Prevent admins from deleting themselves
    if (userId === session.user.id) {
      return apiError('Cannot delete your own account', 403);
    }
    
    // Delete the user
    const db = await DatabaseService.getDb();
    const result = await db.collection('users').deleteOne({ _id: userObjectId });
    
    if (result.deletedCount === 0) {
      return apiError('User not found', 404);
    }
    
    return apiResponse({ 
      success: true, 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return apiError('Failed to delete user. Please try again later.', 500);
  }
}, ['admin']); // Only admins can access this endpoint 