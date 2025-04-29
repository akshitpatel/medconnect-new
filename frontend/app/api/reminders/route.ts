import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { Reminder } from '@/app/types/api-types';

/**
 * GET handler for fetching reminders
 * Uses the new authentication middleware pattern
 */
export const GET = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    // Construct the query based on parameters
    let query: any = { patientId: userId };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by type
    if (type) {
      query.reminder_type = type;
    }
    
    // Filter by date range
    if (from && to) {
      query.date = { 
        $gte: from,
        $lte: to
      };
    }
    
    // Fetch reminders from the database
    const db = await DatabaseService.getDb();
    let reminders = db.collection('reminders')
      .find(query)
      .sort({ date: 1, time: 1 });
    
    if (limit) {
      reminders = reminders.limit(limit);
    }
    
    const results = await reminders.toArray();
    
    // Generate mock data if no results are found
    if (results.length === 0) {
      const mockReminders = generateMockReminders(userId, limit || 5);
      return apiResponse({ reminders: mockReminders });
    }
    
    return apiResponse({ reminders: results });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return apiError('Failed to fetch reminders', 500);
  }
});

/**
 * POST handler for creating new reminders
 */
export const POST = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const reminderData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'reminder_type', 'date', 'time', 'status'];
    for (const field of requiredFields) {
      if (!reminderData[field]) {
        return apiError(`Missing required field: ${field}`, 400);
      }
    }
    
    const newReminder = {
      ...reminderData,
      patientId: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Create the reminder
    const db = await DatabaseService.getDb();
    const result = await db.collection('reminders').insertOne(newReminder);
    
    if (!result.insertedId) {
      return apiError('Failed to create reminder', 500);
    }
    
    const createdReminder = await db.collection('reminders').findOne({ _id: result.insertedId });
    
    return apiResponse({ reminder: createdReminder }, 201);
  } catch (error) {
    console.error('Error creating reminder:', error);
    return apiError('Failed to create reminder', 500);
  }
});

/**
 * PATCH handler for updating reminder status
 */
export const PATCH = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { reminderData } = await request.json();
    
    if (!reminderData || !reminderData._id) {
      return apiError('Missing reminder ID', 400);
    }
    
    // Ensure the reminder belongs to the user
    const db = await DatabaseService.getDb();
    const reminder = await db.collection('reminders').findOne({
      _id: new ObjectId(reminderData._id),
      patientId: userId
    });
    
    if (!reminder) {
      return apiError('Reminder not found or access denied', 404);
    }
    
    // Update the reminder
    const updateData = {
      ...reminderData,
      updated_at: new Date().toISOString()
    };
    
    delete updateData._id; // Remove _id as it shouldn't be updated
    
    const result = await db.collection('reminders').updateOne(
      { _id: new ObjectId(reminderData._id), patientId: userId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return apiError('Failed to update reminder', 500);
    }
    
    const updatedReminder = await db.collection('reminders').findOne({
      _id: new ObjectId(reminderData._id)
    });
    
    return apiResponse({ reminder: updatedReminder });
  } catch (error) {
    console.error('Error updating reminder:', error);
    return apiError('Failed to update reminder', 500);
  }
});

/**
 * DELETE handler for removing reminders
 */
export const DELETE = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const reminderId = searchParams.get('id');
    
    if (!reminderId) {
      return apiError('Missing reminder ID', 400);
    }
    
    // Ensure the reminder belongs to the user
    const db = await DatabaseService.getDb();
    const reminder = await db.collection('reminders').findOne({
      _id: new ObjectId(reminderId),
      patientId: userId
    });
    
    if (!reminder) {
      return apiError('Reminder not found or access denied', 404);
    }
    
    // Delete the reminder
    const result = await db.collection('reminders').deleteOne({
      _id: new ObjectId(reminderId),
      patientId: userId
    });
    
    if (result.deletedCount === 0) {
      return apiError('Failed to delete reminder', 500);
    }
    
    return apiResponse({ success: true, message: 'Reminder deleted successfully' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return apiError('Failed to delete reminder', 500);
  }
});

/**
 * Helper function to generate mock reminders
 */
function generateMockReminders(userId: string, count: number): Reminder[] {
  const reminderTypes = ['medication', 'appointment', 'lab_test', 'other'];
  const statuses = ['pending', 'completed', 'missed'];
  const titles = [
    'Take medication',
    'Doctor appointment',
    'Lab test',
    'Blood pressure check',
    'Exercise reminder',
    'Drink water',
    'Check glucose level',
    'Refill prescription'
  ];
  
  const today = new Date();
  const mockReminders: Reminder[] = [];
  
  for (let i = 0; i < count; i++) {
    const reminderDate = new Date(today);
    const isPast = Math.random() > 0.6;
    
    if (isPast) {
      reminderDate.setDate(today.getDate() - Math.floor(Math.random() * 14)); // Last 2 weeks
    } else {
      reminderDate.setDate(today.getDate() + Math.floor(Math.random() * 14)); // Next 2 weeks
    }
    
    const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const type = reminderTypes[Math.floor(Math.random() * reminderTypes.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const status = isPast ? (Math.random() > 0.3 ? 'completed' : 'missed') : 'pending';
    
    let description = '';
    if (type === 'medication') {
      description = 'Remember to take your prescribed medication with food.';
    } else if (type === 'appointment') {
      description = 'You have an upcoming appointment with your doctor.';
    } else if (type === 'lab_test') {
      description = 'Your lab test is scheduled. Ensure to fast for 8 hours before.';
    } else {
      description = 'General health reminder.';
    }
    
    mockReminders.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      title,
      description,
      reminder_type: type,
      date: reminderDate.toISOString().split('T')[0],
      time: timeString,
      recurring: Math.random() > 0.7,
      frequency: Math.random() > 0.7 ? 'daily' : 'weekly',
      status,
      created_at: new Date(reminderDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return mockReminders;
} 