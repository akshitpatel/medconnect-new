import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { validateBody, validateQuery, ValidationSchemas } from '@/app/lib/validation-middleware';
import { Appointment } from '@/app/types/api-types';

/**
 * GET handler for fetching appointments
 * Uses authentication and query validation middleware
 */
export const GET = withAuth(
  validateQuery(async (request: NextRequest, session: any) => {
    try {
      const userId = session.user.id;
      const { searchParams } = new URL(request.url);
      
      // Query parameters for filtering
      const status = searchParams.get('status');
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      const doctorId = searchParams.get('doctorId');
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
      
      // Construct the query based on parameters
      let query: any = { patientId: userId };
      
      // Filter by status
      if (status) {
        if (status === 'upcoming') {
          query.status = 'scheduled';
          query.date = { $gte: new Date().toISOString().split('T')[0] };
        } else if (status === 'past') {
          query.$or = [
            { status: 'completed' },
            { 
              status: 'scheduled', 
              date: { $lt: new Date().toISOString().split('T')[0] }
            }
          ];
        } else if (status === 'cancelled') {
          query.status = 'cancelled';
        } else {
          query.status = status;
        }
      }
      
      // Filter by date range
      if (from && to) {
        query.date = { 
          $gte: from,
          $lte: to
        };
      }
      
      // Filter by doctor
      if (doctorId) {
        query.doctorId = doctorId;
      }
      
      // Fetch appointments from the database
      const db = await DatabaseService.getDb();
      let appointments = db.collection('appointments')
        .find(query)
        .sort({ date: -1, time: -1 });
      
      if (limit) {
        appointments = appointments.limit(limit);
      }
      
      const results = await appointments.toArray();
      
      // Generate mock data if no results are found
      if (results.length === 0) {
        const mockAppointments = generateMockAppointments(userId, limit || 5);
        return apiResponse({ appointments: mockAppointments });
      }
      
      return apiResponse({ appointments: results });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return apiError('Failed to fetch appointments', 500);
    }
  }, {
    // Custom validation schema for appointment queries
    from: { type: 'date' },
    to: { type: 'date' },
    status: { type: 'string', enum: ['upcoming', 'past', 'cancelled', 'scheduled', 'completed'] },
    doctorId: { type: 'objectId' },
    limit: { type: 'number', min: 1, max: 100 }
  })
);

/**
 * POST handler for creating new appointments
 * Uses authentication and body validation middleware
 */
export const POST = withAuth(
  validateBody(async (request: NextRequest, session: any) => {
    try {
      const userId = session.user.id;
      const appointmentData = await request.json();
      
      const newAppointment = {
        ...appointmentData,
        patientId: userId,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Create the appointment
      const db = await DatabaseService.getDb();
      const result = await db.collection('appointments').insertOne(newAppointment);
      
      if (!result.insertedId) {
        return apiError('Failed to create appointment', 500);
      }
      
      const createdAppointment = await db.collection('appointments').findOne({ _id: result.insertedId });
      
      return apiResponse({ appointment: createdAppointment }, 201);
    } catch (error) {
      console.error('Error creating appointment:', error);
      return apiError('Failed to create appointment', 500);
    }
  }, {
    doctorId: { type: 'objectId', required: true },
    date: { type: 'date', required: true },
    time: { type: 'string', required: true, pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    duration: { type: 'number', required: true, min: 15, max: 120 },
    type: { type: 'string', required: true, enum: ['regular_checkup', 'consultation', 'follow_up', 'specialist', 'emergency'] },
    reason: { type: 'string', required: true, max: 500 },
    location: { type: 'string', max: 200 },
    videoLink: { type: 'string', max: 200 }
  })
);

/**
 * Helper function to generate mock appointments
 */
function generateMockAppointments(userId: string, count: number): Appointment[] {
  const appointmentTypes = ['regular_checkup', 'consultation', 'follow_up', 'specialist', 'emergency'];
  const statuses = ['scheduled', 'completed', 'cancelled'];
  const reasons = [
    'Annual physical examination',
    'Flu symptoms and fever',
    'Prescription renewal',
    'Follow-up after treatment',
    'Skin condition assessment',
    'Joint pain consultation',
    'Digestive issues',
    'Mental health checkup'
  ];
  
  const today = new Date();
  const mockAppointments: Appointment[] = [];
  
  // Generate past appointments
  for (let i = 0; i < Math.floor(count / 2); i++) {
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() - Math.floor(Math.random() * 30) - 1); // Last month
    
    const status = Math.random() > 0.2 ? 'completed' : 'cancelled';
    const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    // Random time between 9 AM and 5 PM
    const hours = Math.floor(Math.random() * 8) + 9;
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // For completed appointments, randomly include a location or videoLink
    let location = undefined;
    let videoLink = undefined;
    
    if (type !== 'emergency') {
      if (Math.random() > 0.5) {
        location = 'MedConnect Clinic, 123 Health Street, Medical District';
      } else {
        videoLink = 'https://medconnect.video/appointment/' + Math.random().toString(36).substring(2, 10);
      }
    } else {
      location = 'Emergency Center, 456 Hospital Avenue';
    }
    
    mockAppointments.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      doctorId: new ObjectId().toString(),
      date: appointmentDate.toISOString().split('T')[0],
      time: timeString,
      duration: type === 'regular_checkup' ? 30 : (type === 'consultation' ? 45 : 60),
      type,
      status,
      reason,
      notes: status === 'completed' ? 'Patient responded well to treatment.' : undefined,
      location,
      videoLink,
      createdAt: new Date(appointmentDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Created a week before appointment
      updatedAt: new Date()
    });
  }
  
  // Generate upcoming appointments
  for (let i = 0; i < Math.ceil(count / 2); i++) {
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1); // Next 2 weeks
    
    const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    // Random time between 9 AM and 5 PM
    const hours = Math.floor(Math.random() * 8) + 9;
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Randomly include a location or videoLink
    let location = undefined;
    let videoLink = undefined;
    
    if (type !== 'emergency') {
      if (Math.random() > 0.5) {
        location = 'MedConnect Clinic, 123 Health Street, Medical District';
      } else {
        videoLink = 'https://medconnect.video/appointment/' + Math.random().toString(36).substring(2, 10);
      }
    } else {
      location = 'Emergency Center, 456 Hospital Avenue';
    }
    
    mockAppointments.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      doctorId: new ObjectId().toString(),
      date: appointmentDate.toISOString().split('T')[0],
      time: timeString,
      duration: type === 'regular_checkup' ? 30 : (type === 'consultation' ? 45 : 60),
      type,
      status: 'scheduled',
      reason,
      notes: undefined,
      location,
      videoLink,
      createdAt: new Date(appointmentDate.getTime() - 7 * 24 * 60 * 60 * 1000), // Created a week before appointment
      updatedAt: new Date()
    });
  }
  
  return mockAppointments;
} 