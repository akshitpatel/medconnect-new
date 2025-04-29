import { NextRequest, NextResponse } from 'next/server';
import { successResponse, handleApiError } from '@/app/lib/api-utils';

// Mock emergency requests data
const mockEmergencyRequests = Array.from({ length: 20 }, (_, i) => ({
  _id: `emerg_${i + 1}`,
  requestId: `ER${10000 + i}`,
  patientId: `pat_${100 + i}`,
  patientName: `Patient ${i + 1}`,
  contactPhone: `+1 555-${1000 + i}`,
  emergencyType: ['medical', 'accident', 'cardiac', 'respiratory', 'other'][i % 5],
  description: `${['Severe pain', 'Injury', 'Breathing difficulty', 'Unconscious', 'Bleeding'][i % 5]} at ${['home', 'work', 'public place', 'road', 'sports facility'][i % 5]}`,
  location: {
    address: `${i + 100} ${['Main St', 'Oak Ave', 'Pine Rd', 'Maple Ln', 'Cedar Blvd'][i % 5]}, City`,
    coordinates: {
      latitude: 37.7749 + (i * 0.01),
      longitude: -122.4194 + (i * 0.01)
    }
  },
  requestTime: new Date(Date.now() - (i * (i % 5 === 0 ? 10 : 60) * 60 * 1000)).toISOString(),
  status: ['pending', 'dispatched', 'en-route', 'arrived', 'completed', 'cancelled'][i % 6],
  priority: ['low', 'medium', 'high', 'critical'][i % 5 === 0 ? 3 : i % 4],
  assignedAmbulanceId: i % 6 > 0 ? `amb_${i % 5 + 1}` : undefined,
  assignedAmbulanceNumber: i % 6 > 0 ? `AMB-${1000 + i % 5}` : undefined,
  assignedHospitalId: i % 6 > 1 ? `hosp_${i % 3 + 1}` : undefined,
  assignedHospitalName: i % 6 > 1 ? `${['City', 'General', 'Memorial', 'Community', 'University'][i % 5]} Hospital` : undefined,
  estimatedArrivalTime: i % 6 === 1 || i % 6 === 2 ? new Date(Date.now() + (15 * 60 * 1000)).toISOString() : undefined,
  actualArrivalTime: i % 6 > 2 ? new Date(Date.now() - (i % 6 === 3 ? 5 : 30) * 60 * 1000).toISOString() : undefined,
  completionTime: i % 6 === 4 ? new Date(Date.now() - (20 * 60 * 1000)).toISOString() : undefined,
  notes: i % 3 === 0 ? `${['Patient has history of cardiac issues', 'Multiple injuries reported', 'Possible stroke symptoms', 'Requires immediate attention', 'Allergic to penicillin'][i % 5]}` : undefined,
  medicalInfo: i % 2 === 0 ? {
    age: 20 + (i % 60),
    gender: i % 2 === 0 ? 'male' : 'female',
    allergies: i % 3 === 0 ? ['penicillin', 'dust', 'pollen'] : [],
    conditions: i % 4 === 0 ? ['diabetes', 'hypertension'] : [],
    medications: i % 5 === 0 ? ['insulin', 'lisinopril'] : [],
    bloodType: ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'][i % 8]
  } : undefined,
  emergencyContactName: i % 2 === 0 ? `Contact ${i + 1}` : undefined,
  emergencyContactPhone: i % 2 === 0 ? `+1 555-${2000 + i}` : undefined
}));

// Mock emergency statistics
const mockStats = {
  pending: mockEmergencyRequests.filter(e => e.status === 'pending').length,
  dispatched: mockEmergencyRequests.filter(e => e.status === 'dispatched').length,
  enRoute: mockEmergencyRequests.filter(e => e.status === 'en-route').length,
  arrived: mockEmergencyRequests.filter(e => e.status === 'arrived').length,
  completed: mockEmergencyRequests.filter(e => e.status === 'completed').length,
  cancelled: mockEmergencyRequests.filter(e => e.status === 'cancelled').length,
  total: mockEmergencyRequests.length,
  priorityStats: {
    low: mockEmergencyRequests.filter(e => e.priority === 'low').length,
    medium: mockEmergencyRequests.filter(e => e.priority === 'medium').length,
    high: mockEmergencyRequests.filter(e => e.priority === 'high').length,
    critical: mockEmergencyRequests.filter(e => e.priority === 'critical').length
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const emergencyType = searchParams.get('type') || '';
    const sort = searchParams.get('sort') || 'requestTime_desc';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Filter emergency requests
    let filteredRequests = [...mockEmergencyRequests];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRequests = filteredRequests.filter(request => 
        request.requestId.toLowerCase().includes(searchLower) ||
        request.patientName.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.location.address.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      filteredRequests = filteredRequests.filter(request => request.status === status);
    }

    if (priority) {
      filteredRequests = filteredRequests.filter(request => request.priority === priority);
    }

    if (emergencyType) {
      filteredRequests = filteredRequests.filter(request => request.emergencyType === emergencyType);
    }
    
    // Sort requests
    const [sortField, sortDirection] = sort.split('_');
    filteredRequests.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For dates
      if (sortField === 'requestTime' || sortField === 'estimatedArrivalTime' || 
          sortField === 'actualArrivalTime' || sortField === 'completionTime') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      return 0;
    });
    
    // Paginate requests
    const paginatedRequests = filteredRequests.slice(skip, skip + limit);
    
    return successResponse({
      emergencies: paginatedRequests,
      total: filteredRequests.length,
      limit,
      skip,
      stats: mockStats
    });
  } catch (error) {
    return handleApiError(error);
  }
} 