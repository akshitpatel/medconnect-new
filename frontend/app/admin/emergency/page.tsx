'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import {
  FaAmbulance, FaSearch, FaFilter, FaSortAmountDown,
  FaSortAmountUp, FaEye, FaEdit, FaTrash, FaSpinner,
  FaPhone, FaMapMarkerAlt, FaExclamationTriangle, 
  FaClipboardCheck, FaHospital, FaExclamationCircle, FaTimes
} from 'react-icons/fa';

// Define interface for emergency calls
interface EmergencyCall {
  _id: string;
  callId: string;
  callerName: string;
  callerPhone: string;
  callerLocation: string;
  emergencyType: string;
  description: string;
  status: 'pending' | 'dispatched' | 'in-progress' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  dispatchedUnits?: string[];
  responderId?: string;
  responderName?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  resolvedTime?: string;
  notes?: string;
}

// Mock data for emergency calls
const mockEmergencyCalls: EmergencyCall[] = [
  {
    _id: 'call1',
    callId: 'EM12345',
    callerName: 'John Smith',
    callerPhone: '555-123-4567',
    callerLocation: '123 Main St, Anytown, AN 12345',
    emergencyType: 'Medical',
    description: 'Person experiencing severe chest pain and shortness of breath',
    status: 'resolved',
    priority: 'high',
    timestamp: '2023-10-15T08:45:22',
    dispatchedUnits: ['Ambulance-342', 'Medic-27'],
    responderId: 'resp001',
    responderName: 'Sarah Johnson',
    estimatedArrivalTime: '2023-10-15T09:00:00',
    actualArrivalTime: '2023-10-15T08:58:12',
    resolvedTime: '2023-10-15T09:45:30',
    notes: 'Patient transported to Memorial Hospital'
  },
  {
    _id: 'call2',
    callId: 'EM12346',
    callerName: 'Emily Chen',
    callerPhone: '555-987-6543',
    callerLocation: '456 Oak Ave, Somewhere, SM 67890',
    emergencyType: 'Fire',
    description: 'Small kitchen fire, smoke visible from apartment',
    status: 'dispatched',
    priority: 'medium',
    timestamp: '2023-10-15T10:22:18',
    dispatchedUnits: ['Fire-215', 'Ambulance-118'],
    responderId: 'resp015',
    responderName: 'Michael Wong',
    estimatedArrivalTime: '2023-10-15T10:35:00'
  },
  {
    _id: 'call3',
    callId: 'EM12347',
    callerName: 'David Williams',
    callerPhone: '555-456-7890',
    callerLocation: '789 Pine St, Elsewhere, EL 54321',
    emergencyType: 'Accident',
    description: 'Two-car collision, no apparent serious injuries',
    status: 'in-progress',
    priority: 'medium',
    timestamp: '2023-10-15T12:05:33',
    dispatchedUnits: ['Police-42', 'Ambulance-205'],
    responderId: 'resp008',
    responderName: 'Robert Garcia',
    estimatedArrivalTime: '2023-10-15T12:15:00',
    actualArrivalTime: '2023-10-15T12:13:45'
  },
  {
    _id: 'call4',
    callId: 'EM12348',
    callerName: 'Sarah Johnson',
    callerPhone: '555-789-0123',
    callerLocation: '101 Maple Dr, Township, TS 13579',
    emergencyType: 'Medical',
    description: 'Elderly woman fallen and unable to get up',
    status: 'pending',
    priority: 'low',
    timestamp: '2023-10-15T14:38:44'
  },
  {
    _id: 'call5',
    callId: 'EM12349',
    callerName: 'Michael Brown',
    callerPhone: '555-321-6540',
    callerLocation: '202 Cedar Ln, Cityville, CV 97531',
    emergencyType: 'Security',
    description: 'Suspicious person attempting to enter property',
    status: 'cancelled',
    priority: 'medium',
    timestamp: '2023-10-15T15:12:05',
    dispatchedUnits: ['Police-18'],
    notes: 'Caller called back to report person was a delivery driver'
  },
  {
    _id: 'call6',
    callId: 'EM12350',
    callerName: 'Lisa Taylor',
    callerPhone: '555-234-5678',
    callerLocation: '303 Birch Ct, Townsville, TV 86420',
    emergencyType: 'Medical',
    description: 'Child with severe allergic reaction',
    status: 'in-progress',
    priority: 'critical',
    timestamp: '2023-10-15T16:03:27',
    dispatchedUnits: ['Ambulance-117', 'Medic-34'],
    responderId: 'resp022',
    responderName: 'Jennifer Smith',
    estimatedArrivalTime: '2023-10-15T16:10:00',
    actualArrivalTime: '2023-10-15T16:07:52'
  }
];

const EmergencyPage = () => {
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Fetch emergency calls from API in a real application
    const fetchEmergencyCalls = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admin/emergency/calls');
        // const data = await response.json();
        
        // Using mock data for demonstration
        setTimeout(() => {
          setEmergencyCalls(mockEmergencyCalls);
          setLoading(false);
        }, 800); // simulate network delay
      } catch (err) {
        setError('Failed to fetch emergency calls');
        setLoading(false);
      }
    };

    fetchEmergencyCalls();
  }, []);

  // Calculate emergency statistics
  const stats = {
    total: emergencyCalls.length,
    pending: emergencyCalls.filter(call => call.status === 'pending').length,
    dispatched: emergencyCalls.filter(call => call.status === 'dispatched').length,
    inProgress: emergencyCalls.filter(call => call.status === 'in-progress').length,
    resolved: emergencyCalls.filter(call => call.status === 'resolved').length,
    cancelled: emergencyCalls.filter(call => call.status === 'cancelled').length,
    critical: emergencyCalls.filter(call => call.priority === 'critical').length
  };

  // Filter emergency calls based on search term, status, and priority
  const filteredCalls = emergencyCalls.filter(call => {
    const matchesSearch = 
      call.callId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || call.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort emergency calls
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    const fieldA = a[sortField as keyof EmergencyCall];
    const fieldB = b[sortField as keyof EmergencyCall];
    
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

  // Paginate emergency calls
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCalls = sortedCalls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCalls.length / itemsPerPage);

  // Get status badge style based on status
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get priority badge style based on priority
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format status string for display
  const formatStatus = (status: string) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format priority string for display
  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
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
          <h1 className="text-2xl font-bold text-white">Emergency Services</h1>
          <p className="text-gray-400">Monitor and manage emergency service calls</p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <FaAmbulance className="h-6 w-6 text-teal-400" />
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
                <FaExclamationCircle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Dispatched</p>
                <p className="text-2xl font-bold text-blue-400">{stats.dispatched}</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <FaAmbulance className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-purple-400">{stats.inProgress}</p>
              </div>
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <FaHospital className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                <FaClipboardCheck className="h-6 w-6 text-green-400" />
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
          
          <div className="bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                <FaExclamationTriangle className="h-6 w-6 text-red-400" />
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
                placeholder="Search by ID, caller name, or emergency type..."
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
              <option value="dispatched">Dispatched</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2.5"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center justify-center">
              <FaFilter className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Emergency calls table */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden mb-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
              <span className="ml-2 text-white">Loading emergency calls...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-red-400 text-center">{error}</div>
          ) : currentCalls.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No emergency calls found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-white">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('callId')}>
                      <div className="flex items-center">
                        Call ID
                        {sortField === 'callId' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('timestamp')}>
                      <div className="flex items-center">
                        Time
                        {sortField === 'timestamp' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('callerName')}>
                      <div className="flex items-center">
                        Caller
                        {sortField === 'callerName' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('emergencyType')}>
                      <div className="flex items-center">
                        Type
                        {sortField === 'emergencyType' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          sortOrder === 'asc' ? <FaSortAmountUp className="ml-1 w-3 h-3" /> : <FaSortAmountDown className="ml-1 w-3 h-3" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('priority')}>
                      <div className="flex items-center">
                        Priority
                        {sortField === 'priority' && (
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
                  {currentCalls.map((call) => (
                    <tr key={call._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {call.callId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTimestamp(call.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {call.callerName}
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <FaPhone className="mr-1" />
                            {call.callerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {call.emergencyType}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">
                          {call.description}
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <FaMapMarkerAlt className="mr-1" />
                            {call.callerLocation}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(call.status)}`}>
                          {formatStatus(call.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadgeStyle(call.priority)}`}>
                          {formatPriority(call.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center space-x-2">
                        <button title="View Details" className="text-teal-400 hover:text-teal-300">
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button title="Update Status" className="text-blue-400 hover:text-blue-300">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button title="Delete Call" className="text-red-400 hover:text-red-300">
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
        {!loading && !error && sortedCalls.length > 0 && (
          <div className="flex items-center justify-between flex-wrap">
            <div className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to <span className="font-medium text-white">{Math.min(indexOfLastItem, sortedCalls.length)}</span> of <span className="font-medium text-white">{sortedCalls.length}</span> entries
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

export default EmergencyPage; 