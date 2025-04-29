import { NextRequest, NextResponse } from 'next/server';
import { successResponse, handleApiError } from '@/app/lib/api-utils';

// Mock medicine orders data
const mockMedicineOrders = Array.from({ length: 20 }, (_, i) => ({
  _id: `order_${i + 1}`,
  orderId: `ORD${100000 + i}`,
  patientId: `pat_${100 + i}`,
  patientName: `Patient ${i + 1}`,
  orderDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
  items: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
    medicineId: `med_${j + 1}`,
    medicineName: `${['Aspirin', 'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Lisinopril'][(i + j) % 5]} ${(i + j) % 2 === 0 ? '500mg' : '250mg'}`,
    quantity: (j + 1) * 5,
    price: 10 + j * 5
  })),
  totalAmount: 30 + (i % 5) * 20,
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5],
  paymentStatus: ['pending', 'paid', 'refunded'][i % 3],
  paymentMethod: ['card', 'cash', 'insurance', 'wallet'][i % 4],
  prescriptionId: i % 3 === 0 ? `presc_${i + 1}` : undefined,
  prescriptionVerified: i % 3 !== 0 || i % 2 === 0,
  shippingAddress: `${i + 100} ${['Main St', 'Oak Ave', 'Pine Rd', 'Maple Ln', 'Cedar Blvd'][i % 5]}, City`,
  expectedDelivery: i % 5 < 3 ? new Date(Date.now() + ((i % 5) * 24 * 60 * 60 * 1000)).toISOString() : undefined,
  actualDelivery: i % 5 === 3 ? new Date(Date.now() - ((i % 3) * 24 * 60 * 60 * 1000)).toISOString() : undefined,
  pharmacyId: `pharm_${i % 3 + 1}`,
  pharmacyName: `Pharmacy ${i % 3 + 1}`,
  notes: i % 4 === 0 ? `Delivery instructions: ${['Leave at door', 'Call before delivery', 'Hand to recipient only'][i % 3]}` : undefined
}));

// Mock order statistics
const mockStats = {
  pending: mockMedicineOrders.filter(o => o.status === 'pending').length,
  processing: mockMedicineOrders.filter(o => o.status === 'processing').length,
  shipped: mockMedicineOrders.filter(o => o.status === 'shipped').length,
  delivered: mockMedicineOrders.filter(o => o.status === 'delivered').length,
  cancelled: mockMedicineOrders.filter(o => o.status === 'cancelled').length,
  total: mockMedicineOrders.length,
  paymentStats: {
    pending: mockMedicineOrders.filter(o => o.paymentStatus === 'pending').length,
    paid: mockMedicineOrders.filter(o => o.paymentStatus === 'paid').length,
    refunded: mockMedicineOrders.filter(o => o.paymentStatus === 'refunded').length
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const sort = searchParams.get('sort') || 'orderDate_desc';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // Filter orders based on search query, status, and payment status
    let filteredOrders = [...mockMedicineOrders];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.orderId.toLowerCase().includes(searchLower) ||
        order.patientName.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.medicineName.toLowerCase().includes(searchLower))
      );
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus);
    }
    
    // Sort orders
    const [sortField, sortDirection] = sort.split('_');
    filteredOrders.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For dates
      if (sortField === 'orderDate' || sortField === 'expectedDelivery' || sortField === 'actualDelivery') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // For numeric values like totalAmount
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    // Paginate orders
    const paginatedOrders = filteredOrders.slice(skip, skip + limit);
    
    return successResponse({
      orders: paginatedOrders,
      total: filteredOrders.length,
      limit,
      skip,
      stats: mockStats
    });
  } catch (error) {
    return handleApiError(error);
  }
} 