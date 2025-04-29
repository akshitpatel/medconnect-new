'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  FileText,
  Truck,
  AlertCircle,
  Check,
  MoreHorizontal
} from 'lucide-react';
import Image from 'next/image';

// Order status types
type OrderStatus = 'pending' | 'accepted' | 'processing' | 'completed' | 'cancelled' | 'rejected';

// Interface for order data
interface Order {
  id: string;
  patientName: string;
  patientId: string;
  patientImage?: string;
  service: string;
  dateRequested: string;
  status: OrderStatus;
  priority: 'normal' | 'urgent' | 'high';
  notes?: string;
  total: number;
}

// Generate mock order data
const generateMockOrders = (count: number): Order[] => {
  const services = [
    'Blood Test', 'X-Ray', 'MRI Scan', 'Prescription Refill',
    'Physical Therapy', 'Dental Checkup', 'Eye Examination',
    'Vaccination', 'Medical Certificate', 'Mental Health Consultation'
  ];
  
  const statuses: OrderStatus[] = ['pending', 'accepted', 'processing', 'completed', 'cancelled', 'rejected'];
  const priorities = ['normal', 'urgent', 'high'];
  
  return Array.from({ length: count }, (_, i) => {
    const randomStatus = statuses[Math.floor(Math.random() * 3)]; // More pending/accepted/processing
    const randomPriority = priorities[Math.floor(Math.random() * 3)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    
    // Generate a date between 1 and 30 days ago
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `ORD-${10000 + i}`,
      patientName: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
      patientId: `PAT-${20000 + Math.floor(Math.random() * 5000)}`,
      service: randomService,
      dateRequested: date.toISOString().split('T')[0],
      status: randomStatus,
      priority: randomPriority,
      notes: Math.random() > 0.7 ? 'Patient has allergies to penicillin' : undefined,
      total: Math.floor(Math.random() * 500) + 50,
    };
  });
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'normal' | 'urgent' | 'high'>('all');
  const [sortField, setSortField] = useState<keyof Order>('dateRequested');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch orders (simulated)
  useEffect(() => {
    const fetchOrders = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockOrders = generateMockOrders(20);
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchOrders();
  }, []);

  // Handle filtering and searching
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(order => order.priority === priorityFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order => 
          order.patientName.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term) ||
          order.service.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });
    
    setFilteredOrders(result);
  }, [orders, statusFilter, priorityFilter, searchTerm, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle order status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  };

  // Get status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          icon: <Clock className="h-4 w-4 mr-1.5" />
        };
      case 'accepted':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          icon: <CheckCircle className="h-4 w-4 mr-1.5" />
        };
      case 'processing':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-800 dark:text-purple-300',
          icon: <Clock className="h-4 w-4 mr-1.5" />
        };
      case 'completed':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          icon: <CheckCircle className="h-4 w-4 mr-1.5" />
        };
      case 'cancelled':
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-300',
          icon: <XCircle className="h-4 w-4 mr-1.5" />
        };
      case 'rejected':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          icon: <XCircle className="h-4 w-4 mr-1.5" />
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-300',
          icon: <Clock className="h-4 w-4 mr-1.5" />
        };
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300'
        };
      case 'high':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-300'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-800 dark:text-gray-300'
        };
    }
  };

  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-8"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-6"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Orders</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and process your incoming service orders</p>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Search orders by patient, ID or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-48">
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="w-48">
              <select
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-teal-500 focus:border-teal-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'normal' | 'urgent' | 'high')}
              >
                <option value="all">All Priorities</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    Order ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('patientName')}>
                  <div className="flex items-center">
                    Patient
                    {sortField === 'patientName' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('service')}>
                  <div className="flex items-center">
                    Service
                    {sortField === 'service' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dateRequested')}>
                  <div className="flex items-center">
                    Date Requested
                    {sortField === 'dateRequested' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('total')}>
                  <div className="flex items-center justify-end">
                    Total
                    {sortField === 'total' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {order.patientImage ? (
                            <Image src={order.patientImage} alt={order.patientName} width={40} height={40} className="rounded-full" />
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                              {order.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{order.patientName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{order.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.dateRequested}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status).bg} ${getStatusBadge(order.status).text}`}>
                        {getStatusBadge(order.status).icon}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(order.priority).bg} ${getPriorityBadge(order.priority).text}`}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => viewOrderDetails(order)} 
                          className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        
                        {order.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'accepted')} 
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Accept Order"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(order.id, 'rejected')} 
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Reject Order"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {order.status === 'accepted' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'processing')} 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Start Processing"
                          >
                            <Clock className="h-5 w-5" />
                          </button>
                        )}
                        
                        {order.status === 'processing' && (
                          <button 
                            onClick={() => handleStatusChange(order.id, 'completed')} 
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-12 w-12 mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-1">No orders found</p>
                      <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
          </div>
          {/* Pagination would go here */}
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Details</h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date Requested</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.dateRequested}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status).bg} ${getStatusBadge(selectedOrder.status).text} mt-1`}>
                    {getStatusBadge(selectedOrder.status).icon}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(selectedOrder.priority).bg} ${getPriorityBadge(selectedOrder.priority).text} mt-1`}>
                    {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Patient Information</h4>
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {selectedOrder.patientImage ? (
                      <Image src={selectedOrder.patientImage} alt={selectedOrder.patientName} width={48} height={48} className="rounded-full" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {selectedOrder.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.patientId}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Service Details</h4>
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-900 dark:text-white">{selectedOrder.service}</span>
                    <span className="text-gray-900 dark:text-white font-medium">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="font-medium mb-1">Notes:</div>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'accepted');
                          setIsDetailModalOpen(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept Order
                      </button>
                      <button 
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, 'rejected');
                          setIsDetailModalOpen(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Order
                      </button>
                    </>
                  )}
                  
                  {selectedOrder.status === 'accepted' && (
                    <button 
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'processing');
                        setIsDetailModalOpen(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start Processing
                    </button>
                  )}
                  
                  {selectedOrder.status === 'processing' && (
                    <button 
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'completed');
                        setIsDetailModalOpen(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </button>
                  )}
                  
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 