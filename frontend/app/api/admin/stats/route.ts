import { NextRequest, NextResponse } from 'next/server';
import { successResponse, handleApiError } from '@/app/lib/api-utils';

// Mock dashboard statistics
const mockDashboardStats = {
  stats: {
    totalUsers: 12584,
    totalDoctors: 823,
    totalAppointments: 45962,
    symptomChecks: 18743
  },
  contentStats: {
    articles: 143,
    announcements: 87,
    faqs: 256,
    help: 52,
    total: 538
  },
  recentActivity: [
    {
      id: '1',
      type: 'user',
      title: 'New User Registration',
      description: 'John Doe registered as a new patient',
      time: '10 minutes ago'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: 'Dr. Sarah Williams has a new appointment with Emily Clark',
      time: '25 minutes ago'
    },
    {
      id: '3',
      type: 'doctor',
      title: 'Doctor Verification',
      description: 'Dr. Michael Brown submitted documents for verification',
      time: '45 minutes ago'
    },
    {
      id: '4',
      type: 'content',
      title: 'New Article Published',
      description: 'Admin published "Understanding Diabetes Management"',
      time: '1 hour ago'
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      description: 'New features released for appointment scheduling',
      time: '3 hours ago'
    }
  ],
  monthlySignups: [
    { _id: { year: 2023, month: 7 }, count: 342 },
    { _id: { year: 2023, month: 8 }, count: 386 },
    { _id: { year: 2023, month: 9 }, count: 411 },
    { _id: { year: 2023, month: 10 }, count: 495 },
    { _id: { year: 2023, month: 11 }, count: 524 },
    { _id: { year: 2023, month: 12 }, count: 618 }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // In a real application, this would fetch data from a database
    // For now, we'll use mock data
    return successResponse(mockDashboardStats);
  } catch (error) {
    return handleApiError(error);
  }
} 