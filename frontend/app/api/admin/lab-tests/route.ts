import { NextRequest, NextResponse } from 'next/server';
import { successResponse, handleApiError } from '@/app/lib/api-utils';

// Mock lab tests data
const mockLabTests = Array.from({ length: 20 }, (_, i) => ({
  _id: `lab_${i + 1}`,
  testName: `${['Blood', 'Urine', 'X-Ray', 'MRI', 'CT Scan'][i % 5]} Test ${i + 1}`,
  testType: ['routine', 'emergency', 'follow-up', 'pre-surgery'][i % 4],
  patientId: `pat_${100 + i}`,
  patientName: `Patient ${i + 1}`,
  doctorId: i % 3 === 0 ? undefined : `doc_${50 + (i % 5)}`,
  doctorName: i % 3 === 0 ? undefined : `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
  labId: `lab_${i % 3 + 1}`,
  labName: `Lab ${i % 3 + 1}`,
  scheduledDate: new Date(Date.now() + ((i % 14) * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  scheduledTime: `${(i % 12) + 8}:${i % 2 === 0 ? '00' : '30'}`,
  status: ['scheduled', 'sample-collected', 'processing', 'completed', 'cancelled'][i % 5],
  results: i % 5 === 3 || i % 5 === 4 ? {
    reportUrl: i % 5 === 3 ? `https://example.com/reports/lab_${i + 1}.pdf` : undefined,
    isAbnormal: i % 3 === 0,
    notes: i % 2 === 0 ? `Notes for test ${i + 1}` : undefined
  } : undefined,
  createdAt: new Date(Date.now() - (i * 48 * 60 * 60 * 1000)).toISOString(),
  price: 50 + (i % 5) * 25,
  isFasting: i % 2 === 0,
  isHomeCollection: i % 3 === 0,
  collectionAddress: i % 3 === 0 ? `${i + 100} Main St, City` : undefined,
  notes: i % 4 === 0 ? `Additional notes for test ${i + 1}` : undefined
}));

// Mock lab test statistics
const mockStats = {
  scheduled: mockLabTests.filter(t => t.status === 'scheduled').length,
  sampleCollected: mockLabTests.filter(t => t.status === 'sample-collected').length,
  processing: mockLabTests.filter(t => t.status === 'processing').length,
  completed: mockLabTests.filter(t => t.status === 'completed').length,
  cancelled: mockLabTests.filter(t => t.status === 'cancelled').length,
  total: mockLabTests.length,
  types: [
    { name: 'routine', count: mockLabTests.filter(t => t.testType === 'routine').length },
    { name: 'emergency', count: mockLabTests.filter(t => t.testType === 'emergency').length },
    { name: 'follow-up', count: mockLabTests.filter(t => t.testType === 'follow-up').length },
    { name: 'pre-surgery', count: mockLabTests.filter(t => t.testType === 'pre-surgery').length }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const testType = searchParams.get('testType') || '';
    const sort = searchParams.get('sort') || 'scheduledDate_asc';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Filter lab tests based on search query, status, and test type
    let filteredLabTests = [...mockLabTests];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLabTests = filteredLabTests.filter(test => 
        test.testName.toLowerCase().includes(searchLower) ||
        test.patientName.toLowerCase().includes(searchLower) ||
        (test.doctorName && test.doctorName.toLowerCase().includes(searchLower))
      );
    }
    
    if (status) {
      filteredLabTests = filteredLabTests.filter(test => test.status === status);
    }

    if (testType) {
      filteredLabTests = filteredLabTests.filter(test => test.testType === testType);
    }
    
    // Sort lab tests
    const [sortField, sortDirection] = sort.split('_');
    filteredLabTests.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For dates
      if (sortField === 'scheduledDate' || sortField === 'createdAt') {
        const aDate = new Date(a[sortField as keyof typeof a] as string).getTime();
        const bDate = new Date(b[sortField as keyof typeof b] as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // For numeric values like price
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    // Paginate lab tests
    const paginatedLabTests = filteredLabTests.slice(skip, skip + limit);
    
    return successResponse({
      labTests: paginatedLabTests,
      total: filteredLabTests.length,
      limit,
      skip,
      stats: mockStats
    });
  } catch (error) {
    return handleApiError(error);
  }
} 