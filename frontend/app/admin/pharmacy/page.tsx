'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import {
  FaPills, FaSearch, FaFilter, FaSortAmountDown,
  FaSortAmountUp, FaEye, FaTruck, FaEdit, FaTrash,
  FaSpinner, FaCheck, FaTimes
} from 'react-icons/fa';

interface MedicineOrder {
  _id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  medications: {
    name: string;
    dosage: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  prescriptionId?: string;
  orderDate: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  deliveryAddress: string;
  contactNumber: string;
  notes?: string;
}

// Mock data for pharmacy orders
const mockOrders: MedicineOrder[] = [
  {
    _id: 'order1',
    orderId: 'ORD12345',
    patientId: 'patient1',
    patientName: 'John Smith',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '500mg',
        quantity: 20,
        price: 15.99
      },
      {
        name: 'Ibuprofen',
        dosage: '200mg',
        quantity: 30,
        price: 8.50
      }
    ],
    totalAmount: 24.49,
    status: 'delivered',
    paymentStatus: 'paid',
    prescriptionId: 'pres123',
    orderDate: '2023-10-10',
    estimatedDelivery: '2023-10-12',
    actualDelivery: '2023-10-12',
    deliveryAddress: '123 Main St, Anytown, AN 12345',
    contactNumber: '555-123-4567'
  },
  {
    _id: 'order2',
    orderId: 'ORD12346',
    patientId: 'patient2',
    patientName: 'Sarah Johnson',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        quantity: 30,
        price: 12.75
      }
    ],
    totalAmount: 12.75,
    status: 'processing',
    paymentStatus: 'paid',
    prescriptionId: 'pres124',
    orderDate: '2023-10-15',
    estimatedDelivery: '2023-10-17',
    deliveryAddress: '456 Oak Ave, Somewhere, SM 67890',
    contactNumber: '555-987-6543',
    notes: 'Leave package at the door'
  },
  {
    _id: 'order3',
    orderId: 'ORD12347',
    patientId: 'patient3',
    patientName: 'David Williams',
    medications: [
      {
        name: 'Metformin',
        dosage: '850mg',
        quantity: 60,
        price: 25.30
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        quantity: 30,
        price: 18.75
      }
    ],
    totalAmount: 44.05,
    status: 'shipped',
    paymentStatus: 'paid',
    prescriptionId: 'pres125',
    orderDate: '2023-10-14',
    estimatedDelivery: '2023-10-16',
    deliveryAddress: '789 Pine St, Elsewhere, EL 54321',
    contactNumber: '555-456-7890'
  },
  {
    _id: 'order4',
    orderId: 'ORD12348',
    patientId: 'patient4',
    patientName: 'Emily Chen',
    medications: [
      {
        name: 'Albuterol',
        dosage: '90mcg',
        quantity: 1,
        price: 35.20
      }
    ],
    totalAmount: 35.20,
    status: 'pending',
    paymentStatus: 'pending',
    orderDate: '2023-10-16',
    estimatedDelivery: '2023-10-18',
    deliveryAddress: '101 Maple Dr, Township, TS 13579',
    contactNumber: '555-789-0123',
    notes: 'Call before delivery'
  },
  {
    _id: 'order5',
    orderId: 'ORD12349',
    patientId: 'patient5',
    patientName: 'Michael Brown',
    medications: [
      {
        name: 'Fluoxetine',
        dosage: '20mg',
        quantity: 30,
        price: 22.45
      }
    ],
    totalAmount: 22.45,
    status: 'cancelled',
    paymentStatus: 'refunded',
    prescriptionId: 'pres126',
    orderDate: '2023-10-08',
    estimatedDelivery: '2023-10-10',
    deliveryAddress: '202 Cedar Ln, Cityville, CV 97531',
    contactNumber: '555-321-6540',
    notes: 'Cancelled due to patient request'
  }
];

const PharmacyPage = () => {
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Fetch orders from API in a real application
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admin/pharmacy/orders');
        // const data = await response.json();
        
        // Using mock data for demonstration
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 800); // simulate network delay
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate order statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const fieldA = a[sortField as keyof MedicineOrder];
    const fieldB = b[sortField as keyof MedicineOrder];
    
    if (fieldA && fieldB) {
      if (fieldA < fieldB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  // Paginate orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Get status badge style based on status
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get payment status badge style
  const getPaymentBadgeStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'refunded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format status string for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <AdminLayout>
      <div className="px-6 py-6 max-w-7xl mx-auto bg-gray-900 dark:bg-gray-900">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Pharmacy Management</h1>
          <p className="text-gray-400">View and manage all medication orders in the system</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <FaPills className="h-6 w-6 text-teal-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="bg-yellow-900/30 p-3 rounded-lg">
                <FaPills className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-purple-400">{stats.processing}</p>
              </div>
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <FaPills className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Shipped</p>
                <p className="text-2xl font-bold text-indigo-400">{stats.shipped}</p>
              </div>
              <div className="bg-indigo-900/30 p-3 rounded-lg">
                <FaTruck className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                <FaCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Cancelled</p>
                <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                <FaTimes className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full p-2.5 pl-10 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500"
                placeholder="Search by order ID, patient, or medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-center">
              <FaFilter className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden mb-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
              <span className="ml-2 text-white">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-400 text-center">{error}</div>
          ) : currentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No orders found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('orderId')}>
                      <div className="flex items-center">
                        Order ID
                        {sortField === 'orderId' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('patientName')}>
                      <div className="flex items-center">
                        Patient
                        {sortField === 'patientName' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Medications
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('orderDate')}>
                      <div className="flex items-center">
                        Order Date
                        {sortField === 'orderDate' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('paymentStatus')}>
                      <div className="flex items-center">
                        Payment
                        {sortField === 'paymentStatus' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        {order.patientName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">
                          {order.medications.map((med, index) => (
                            <div key={index} className="text-xs">
                              {med.name} ({med.dosage}) x{med.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.orderDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentBadgeStyle(order.paymentStatus)}`}>
                          {formatStatus(order.paymentStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <button title="View Details" className="text-teal-400 hover:text-teal-300">
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button title="Update Status" className="text-blue-400 hover:text-blue-300">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button title="Delete Order" className="text-red-400 hover:text-red-300">
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && sortedOrders.length > 0 && (
          <div className="flex items-center justify-between flex-wrap">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to <span className="font-medium text-white">{Math.min(indexOfLastItem, sortedOrders.length)}</span> of <span className="font-medium text-white">{sortedOrders.length}</span> entries
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === pageNumber 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PharmacyPage; 