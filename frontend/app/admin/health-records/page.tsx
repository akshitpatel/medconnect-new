'use client';

import { useState, useEffect } from 'react';
import { FileText, ChevronDown, Search, Filter, Download, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

interface HealthRecord {
  id: string;
  patientName: string;
  patientId: string;
  recordType: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Archived' | 'Pending';
  provider: string;
}

const MOCK_RECORDS: HealthRecord[] = [
  {
    id: 'HR-12345',
    patientName: 'John Smith',
    patientId: 'P-7890',
    recordType: 'Medical History',
    createdAt: '2023-04-15',
    updatedAt: '2023-05-02',
    status: 'Active',
    provider: 'Dr. Sarah Johnson'
  },
  {
    id: 'HR-12346',
    patientName: 'Emma Wilson',
    patientId: 'P-7891',
    recordType: 'Lab Results',
    createdAt: '2023-04-18',
    updatedAt: '2023-04-18',
    status: 'Pending',
    provider: 'Dr. Michael Chen'
  },
  {
    id: 'HR-12347',
    patientName: 'Robert Brown',
    patientId: 'P-7892',
    recordType: 'Allergy Information',
    createdAt: '2023-03-10',
    updatedAt: '2023-03-10',
    status: 'Active',
    provider: 'Dr. Emily Davis'
  },
  {
    id: 'HR-12348',
    patientName: 'Lisa Johnson',
    patientId: 'P-7893',
    recordType: 'Surgical History',
    createdAt: '2023-02-22',
    updatedAt: '2023-02-28',
    status: 'Active',
    provider: 'Dr. James Wilson'
  },
  {
    id: 'HR-12349',
    patientName: 'David Miller',
    patientId: 'P-7894',
    recordType: 'Vaccination Records',
    createdAt: '2023-01-15',
    updatedAt: '2023-01-15',
    status: 'Archived',
    provider: 'Dr. Sarah Johnson'
  },
  {
    id: 'HR-12350',
    patientName: 'Jennifer Taylor',
    patientId: 'P-7895',
    recordType: 'Medical History',
    createdAt: '2023-05-01',
    updatedAt: '2023-05-01',
    status: 'Active',
    provider: 'Dr. Michael Chen'
  },
  {
    id: 'HR-12351',
    patientName: 'Michael Harris',
    patientId: 'P-7896',
    recordType: 'Prescription History',
    createdAt: '2023-04-28',
    updatedAt: '2023-04-30',
    status: 'Active',
    provider: 'Dr. Emily Davis'
  },
  {
    id: 'HR-12352',
    patientName: 'Sarah Martinez',
    patientId: 'P-7897',
    recordType: 'Lab Results',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
    status: 'Pending',
    provider: 'Dr. James Wilson'
  }
];

const recordTypes = [
  'All Types',
  'Medical History',
  'Lab Results',
  'Allergy Information',
  'Surgical History',
  'Vaccination Records',
  'Prescription History'
];

const statuses = ['All Statuses', 'Active', 'Pending', 'Archived'];

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRecords(MOCK_RECORDS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter records based on search term, type, and status
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Types' || record.recordType === selectedType;
    const matchesStatus = selectedStatus === 'All Statuses' || record.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Records</h1>
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="mr-2 text-teal-500" />
          Health Records
        </h1>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </button>
        </div>
      </div>

      <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setTypeMenuOpen(!typeMenuOpen)}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                <span>{selectedType}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {typeMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {recordTypes.map(type => (
                  <div
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setTypeMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === type ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                <span>{selectedStatus}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {statusMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {statuses.map(status => (
                  <div
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setStatusMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === status ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Record ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Record Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {record.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.patientName}
                      <div className="text-xs text-gray-400">
                        {record.patientId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.recordType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${record.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                            record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {record.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredRecords.length} of {records.length} records
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 