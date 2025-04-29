'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import { 
  FaFileMedical, FaSearch, FaFilter, FaSortAmountDown, 
  FaSortAmountUp, FaEye, FaPrint, FaTrash, FaEdit,
  FaSpinner
} from 'react-icons/fa';

interface Prescription {
  _id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  issuedDate: string;
  expiryDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  refillsAllowed: number;
  refillsUsed: number;
  pharmacyId?: string;
  pharmacyName?: string;
  notes?: string;
}

// Mock data for demonstration
const mockPrescriptions: Prescription[] = [
  {
    _id: 'p1',
    patientId: 'patient1',
    patientName: 'John Smith',
    doctorId: 'doctor1',
    doctorName: 'Dr. Sarah Johnson',
    medicationName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    instructions: 'Take with food',
    issuedDate: '2023-10-15',
    expiryDate: '2023-10-22',
    status: 'completed',
    refillsAllowed: 0,
    refillsUsed: 0,
    pharmacyId: 'pharmacy1',
    pharmacyName: 'City Pharmacy'
  },
  // More mock data here as needed
  {
    _id: 'p2',
    patientId: 'patient2',
    patientName: 'Emily Chen',
    doctorId: 'doctor2',
    doctorName: 'Dr. Michael Rodriguez',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '30 days',
    instructions: 'Take in the morning',
    issuedDate: '2023-10-10',
    expiryDate: '2023-11-10',
    status: 'active',
    refillsAllowed: 3,
    refillsUsed: 0
  },
  {
    _id: 'p3',
    patientId: 'patient3',
    patientName: 'David Williams',
    doctorId: 'doctor3',
    doctorName: 'Dr. Lisa Patel',
    medicationName: 'Metformin',
    dosage: '850mg',
    frequency: 'Twice daily',
    duration: '90 days',
    instructions: 'Take with meals',
    issuedDate: '2023-09-20',
    expiryDate: '2023-12-20',
    status: 'active',
    refillsAllowed: 2,
    refillsUsed: 1
  },
  {
    _id: 'p4',
    patientId: 'patient4',
    patientName: 'Sarah Johnson',
    doctorId: 'doctor1',
    doctorName: 'Dr. Sarah Johnson',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    duration: '60 days',
    instructions: 'Take at bedtime',
    issuedDate: '2023-09-15',
    expiryDate: '2023-11-15',
    status: 'cancelled',
    refillsAllowed: 1,
    refillsUsed: 0
  },
  {
    _id: 'p5',
    patientId: 'patient5',
    patientName: 'Michael Brown',
    doctorId: 'doctor2',
    doctorName: 'Dr. Michael Rodriguez',
    medicationName: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    duration: '30 days',
    instructions: 'Use for shortness of breath',
    issuedDate: '2023-08-30',
    expiryDate: '2023-09-30',
    status: 'expired',
    refillsAllowed: 0,
    refillsUsed: 0
  }
];

// Mock statistics
const stats = {
  active: 28,
  completed: 164,
  cancelled: 12,
  expired: 47,
  total: 251,
  recentlyIssued: 42,
  pendingRefills: 15
};

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('issuedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Fetch prescriptions from API in a real application
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admin/prescriptions');
        // const data = await response.json();
        
        // Using mock data for demonstration
        setTimeout(() => {
          setPrescriptions(mockPrescriptions);
          setLoading(false);
        }, 800); // simulate network delay
      } catch (err) {
        setError('Failed to fetch prescriptions');
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Calculate prescription statistics
  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.status === 'active').length,
    completed: prescriptions.filter(p => p.status === 'completed').length,
    cancelled: prescriptions.filter(p => p.status === 'cancelled').length,
    expired: prescriptions.filter(p => p.status === 'expired').length
  };

  // Filter prescriptions based on search term and status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medicationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort prescriptions
  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    const fieldA = a[sortField as keyof Prescription];
    const fieldB = b[sortField as keyof Prescription];
    
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

  // Paginate prescriptions
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrescriptions = sortedPrescriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedPrescriptions.length / itemsPerPage);

  // Get status badge style based on status
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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
          <h1 className="text-2xl font-bold text-white">Prescriptions Management</h1>
          <p className="text-gray-400">View and manage all prescriptions in the system</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <FaFileMedical className="h-6 w-6 text-teal-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                <FaFileMedical className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <FaFileMedical className="h-6 w-6 text-blue-400" />
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
                <FaFileMedical className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Expired</p>
                <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <FaFileMedical className="h-6 w-6 text-gray-400" />
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
                placeholder="Search by patient, doctor, or medication..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-center">
              <FaFilter className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Prescriptions table */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden mb-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
              <span className="ml-2 text-white">Loading prescriptions...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-400 text-center">{error}</div>
          ) : currentPrescriptions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No prescriptions found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('patientName')}>
                      <div className="flex items-center">
                        Patient
                        {sortField === 'patientName' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('medicationName')}>
                      <div className="flex items-center">
                        Medication
                        {sortField === 'medicationName' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('doctorName')}>
                      <div className="flex items-center">
                        Doctor
                        {sortField === 'doctorName' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('issuedDate')}>
                      <div className="flex items-center">
                        Issued Date
                        {sortField === 'issuedDate' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('expiryDate')}>
                      <div className="flex items-center">
                        Expiry Date
                        {sortField === 'expiryDate' && (
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
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPrescriptions.map((prescription) => (
                    <tr key={prescription._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {prescription.patientName}
                      </td>
                      <td className="px-6 py-4">
                        {prescription.medicationName} ({prescription.dosage})
                      </td>
                      <td className="px-6 py-4">
                        {prescription.doctorName}
                      </td>
                      <td className="px-6 py-4">
                        {prescription.issuedDate}
                      </td>
                      <td className="px-6 py-4">
                        {prescription.expiryDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(prescription.status)}`}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <button title="View Details" className="text-teal-400 hover:text-teal-300">
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button title="Print Prescription" className="text-gray-400 hover:text-white">
                          <FaPrint className="w-5 h-5" />
                        </button>
                        <button title="Edit Prescription" className="text-blue-400 hover:text-blue-300">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button title="Delete Prescription" className="text-red-400 hover:text-red-300">
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
        {!loading && !error && sortedPrescriptions.length > 0 && (
          <div className="flex items-center justify-between flex-wrap">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to <span className="font-medium text-white">{Math.min(indexOfLastItem, sortedPrescriptions.length)}</span> of <span className="font-medium text-white">{sortedPrescriptions.length}</span> entries
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

export default PrescriptionsPage;