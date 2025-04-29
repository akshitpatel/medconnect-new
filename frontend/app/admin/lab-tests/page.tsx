'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import {
  FaFlask, FaSearch, FaFilter, FaSortAmountDown,
  FaSortAmountUp, FaEye, FaFileDownload, FaEdit, FaTrash,
  FaSpinner
} from 'react-icons/fa';

interface LabTest {
  _id: string;
  testName: string;
  testType: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  labId: string;
  labName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'sample-collected' | 'processing' | 'completed' | 'cancelled';
  results?: {
    reportUrl?: string;
    isAbnormal: boolean;
    notes?: string;
  };
  createdAt: string;
  price: number;
  isFasting: boolean;
  isHomeCollection: boolean;
  collectionAddress?: string;
  notes?: string;
}

// Mock data for lab tests
const mockLabTests: LabTest[] = [
  {
    _id: 'lt1',
    testName: 'Complete Blood Count (CBC)',
    testType: 'Hematology',
    patientId: 'patient1',
    patientName: 'John Smith',
    doctorId: 'doctor1',
    doctorName: 'Dr. Sarah Johnson',
    labId: 'lab1',
    labName: 'MedLife Diagnostics',
    scheduledDate: '2023-10-18',
    scheduledTime: '09:00',
    status: 'completed',
    results: {
      reportUrl: '/reports/cbc-report-123.pdf',
      isAbnormal: false,
      notes: 'All values within normal range'
    },
    createdAt: '2023-10-15',
    price: 750,
    isFasting: true,
    isHomeCollection: false,
    notes: 'Patient has history of anemia'
  },
  {
    _id: 'lt2',
    testName: 'Lipid Profile',
    testType: 'Biochemistry',
    patientId: 'patient2',
    patientName: 'Mary Johnson',
    doctorId: 'doctor2',
    doctorName: 'Dr. Robert Chen',
    labId: 'lab2',
    labName: 'City Diagnostics',
    scheduledDate: '2023-10-20',
    scheduledTime: '08:30',
    status: 'scheduled',
    createdAt: '2023-10-17',
    price: 850,
    isFasting: true,
    isHomeCollection: true,
    collectionAddress: '123 Main St, Apt 4B, New York, NY 10001',
    notes: 'Patient is on statins'
  },
  {
    _id: 'lt3',
    testName: 'HbA1c',
    testType: 'Biochemistry',
    patientId: 'patient3',
    patientName: 'David Wilson',
    doctorId: 'doctor3',
    doctorName: 'Dr. Emily Rodriguez',
    labId: 'lab1',
    labName: 'MedLife Diagnostics',
    scheduledDate: '2023-10-19',
    scheduledTime: '10:15',
    status: 'sample-collected',
    createdAt: '2023-10-16',
    price: 650,
    isFasting: false,
    isHomeCollection: false,
    notes: 'Diabetic patient, routine monitoring'
  },
  {
    _id: 'lt4',
    testName: 'Thyroid Profile',
    testType: 'Endocrinology',
    patientId: 'patient4',
    patientName: 'Jennifer Brown',
    doctorId: 'doctor4',
    doctorName: 'Dr. Michael Lee',
    labId: 'lab3',
    labName: 'HealthFirst Labs',
    scheduledDate: '2023-10-18',
    scheduledTime: '14:30',
    status: 'processing',
    createdAt: '2023-10-15',
    price: 1200,
    isFasting: false,
    isHomeCollection: true,
    collectionAddress: '456 Park Ave, New York, NY 10022',
    notes: 'Patient has hypothyroidism'
  },
  {
    _id: 'lt5',
    testName: 'Liver Function Test',
    testType: 'Biochemistry',
    patientId: 'patient5',
    patientName: 'Robert Garcia',
    doctorId: 'doctor2',
    doctorName: 'Dr. Robert Chen',
    labId: 'lab2',
    labName: 'City Diagnostics',
    scheduledDate: '2023-10-21',
    scheduledTime: '11:00',
    status: 'scheduled',
    createdAt: '2023-10-17',
    price: 950,
    isFasting: true,
    isHomeCollection: false,
    notes: 'Patient on hepatotoxic drugs'
  },
  {
    _id: 'lt6',
    testName: 'COVID-19 RT-PCR',
    testType: 'Microbiology',
    patientId: 'patient6',
    patientName: 'Lisa Zhang',
    labId: 'lab1',
    labName: 'MedLife Diagnostics',
    scheduledDate: '2023-10-17',
    scheduledTime: '16:45',
    status: 'completed',
    results: {
      reportUrl: '/reports/covid-report-789.pdf',
      isAbnormal: false,
      notes: 'Negative for SARS-CoV-2'
    },
    createdAt: '2023-10-16',
    price: 1500,
    isFasting: false,
    isHomeCollection: true,
    collectionAddress: '789 Broadway, New York, NY 10003'
  },
];

const stats = {
  scheduled: 2,
  sampleCollected: 1,
  processing: 1,
  completed: 2,
  cancelled: 0,
  total: 6,
  homeCollection: 3,
  todayTests: 1,
};

export default function LabTestsPage() {
  const [labTests, setLabTests] = useState<LabTest[]>(mockLabTests);
  const [filteredLabTests, setFilteredLabTests] = useState<LabTest[]>(mockLabTests);
  const [stats, setStats] = useState({
    scheduled: 0,
    sampleCollected: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
    homeCollection: 0,
    todayTests: 0,
    types: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('scheduledDate');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch lab tests data
  useEffect(() => {
    const fetchLabTests = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch from API
        const response = await fetch('/api/admin/lab-tests');
        if (!response.ok) {
          throw new Error('Failed to fetch lab tests');
        }
        
        const data = await response.json();
        setLabTests(data.data.labTests);
        setFilteredLabTests(data.data.labTests);
        setStats(data.data.stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
        setError('Failed to load lab tests');
        setLoading(false);
      }
    };

    fetchLabTests();
  }, []);

  // Filter and sort lab tests when dependencies change
  useEffect(() => {
    let result = [...labTests];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        test =>
          test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.labName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(test => test.status === statusFilter);
    }
    
    // Apply test type filter
    if (testTypeFilter) {
      result = result.filter(test => test.testType === testTypeFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField as keyof LabTest];
      const fieldB = b[sortField as keyof LabTest];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      return 0;
    });
    
    setFilteredLabTests(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, testTypeFilter, sortOrder, sortField, labTests]);

  // Handle sorting of lab tests
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Get CSS class for status badges
  const getStatusBadgeStyle = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'sample collected':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Return the current page of lab tests
  const currentLabTests = filteredLabTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <div className="min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lab Tests Management</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage diagnostic tests and lab reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Status Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.scheduled}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Sample Collected</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.sampleCollected}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Processing</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.processing}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Totals</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Tests</p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{stats.total}</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400">Home Collection</p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.homeCollection}</p>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Today's Schedule</h3>
            <div className="flex items-center h-20">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-teal-500 dark:bg-teal-400 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((stats.todayTests / stats.total) * 100)}%` }}
                ></div>
              </div>
              <div className="ml-4 whitespace-nowrap">
                <p className="text-sm text-gray-500 dark:text-gray-400">Tests Today</p>
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{stats.todayTests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Search by test name, patient, or lab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <select
                className="block w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="sample collected">Sample Collected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="block w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={testTypeFilter}
                onChange={(e) => setTestTypeFilter(e.target.value)}
              >
                <option value="">All Test Types</option>
                <option value="blood">Blood Test</option>
                <option value="urine">Urine Test</option>
                <option value="imaging">Imaging</option>
                <option value="pathology">Pathology</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md shadow-sm">
                <FaFilter className="mr-2" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-teal-600 text-3xl" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-800 dark:text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredLabTests.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
            <FaFlask className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-1">No Lab Tests Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Lab Tests Table */}
        {!loading && filteredLabTests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('testName')}
                    >
                      <div className="flex items-center">
                        <span>Test Name</span>
                        {sortField === 'testName' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('patientName')}
                    >
                      <div className="flex items-center">
                        <span>Patient Name</span>
                        {sortField === 'patientName' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('scheduledDate')}
                    >
                      <div className="flex items-center">
                        <span>Scheduled Date</span>
                        {sortField === 'scheduledDate' && (
                          <span className="ml-1">
                            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Test Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Lab
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentLabTests.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {test.testName}
                        {test.isFasting && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                            Fasting
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {test.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {test.scheduledDate}
                        <div className="text-xs">{test.scheduledTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {test.testType.charAt(0).toUpperCase() + test.testType.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {test.labName}
                        {test.isHomeCollection && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">
                            Home
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(test.status)}`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300">
                            <FaEye />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            disabled={test.status !== 'completed'}
                          >
                            <FaFileDownload />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                            <FaEdit />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredLabTests.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredLabTests.length)}
              </span>{' '}
              of <span className="font-medium">{filteredLabTests.length}</span> lab tests
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage < Math.ceil(filteredLabTests.length / itemsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={currentPage >= Math.ceil(filteredLabTests.length / itemsPerPage)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage >= Math.ceil(filteredLabTests.length / itemsPerPage)
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
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
} 