import { NextRequest, NextResponse } from 'next/server';
import { successResponse, handleApiError } from '@/app/lib/api-utils';

// Mock prescriptions data
const mockPrescriptions = Array.from({ length: 20 }, (_, i) => ({
  _id: `presc_${i + 1}`,
  patientId: `pat_${100 + i}`,
  patientName: `Patient ${i + 1}`,
  doctorId: `doc_${50 + (i % 5)}`,
  doctorName: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
  medicationName: `Medication ${i + 1}`,
  dosage: `${(i % 3) + 1} pill${(i % 3) + 1 > 1 ? 's' : ''}`,
  frequency: `${['Once', 'Twice', 'Three times'][i % 3]} daily`,
  duration: `${(i % 4) + 1} week${(i % 4) + 1 > 1 ? 's' : ''}`,
  instructions: `Take with ${['water', 'food', 'milk', 'juice'][i % 4]}`,
  issuedDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  expiryDate: new Date(Date.now() + ((30 - i) * 24 * 60 * 60 * 1000)).toISOString(),
  status: ['active', 'completed', 'cancelled', 'expired'][i % 4],
  refillsAllowed: i % 3,
  refillsUsed: i % 2,
  pharmacyId: i % 5 === 0 ? undefined : `pharm_${i % 5}`,
  pharmacyName: i % 5 === 0 ? undefined : `Pharmacy ${i % 5 + 1}`,
  notes: i % 3 === 0 ? `Special notes for prescription ${i + 1}` : undefined
}));

// Mock prescription statistics
const mockStats = {
  active: mockPrescriptions.filter(p => p.status === 'active').length,
  completed: mockPrescriptions.filter(p => p.status === 'completed').length,
  cancelled: mockPrescriptions.filter(p => p.status === 'cancelled').length,
  expired: mockPrescriptions.filter(p => p.status === 'expired').length,
  total: mockPrescriptions.length
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || 'issuedDate_desc';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Filter prescriptions based on search query and status
    let filteredPrescriptions = [...mockPrescriptions];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPrescriptions = filteredPrescriptions.filter(prescription => 
        prescription.patientName.toLowerCase().includes(searchLower) ||
        prescription.doctorName.toLowerCase().includes(searchLower) ||
        prescription.medicationName.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      filteredPrescriptions = filteredPrescriptions.filter(
        prescription => prescription.status === status
      );
    }
    
    // Sort prescriptions
    const [sortField, sortDirection] = sort.split('_');
    filteredPrescriptions.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For dates
      if (sortField === 'issuedDate' || sortField === 'expiryDate') {
        const aDate = new Date(a[sortField as keyof typeof a] as string).getTime();
        const bDate = new Date(b[sortField as keyof typeof b] as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      return 0;
    });
    
    // Paginate prescriptions
    const paginatedPrescriptions = filteredPrescriptions.slice(skip, skip + limit);
    
    return successResponse({
      prescriptions: paginatedPrescriptions,
      total: filteredPrescriptions.length,
      limit,
      skip,
      stats: mockStats
    });
  } catch (error) {
    return handleApiError(error);
  }
} 