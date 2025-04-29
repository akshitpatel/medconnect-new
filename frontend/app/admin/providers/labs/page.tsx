'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Trash, UserCheck, UserX, MapPin, FlaskConical } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Define types
type LabStatus = 'active' | 'inactive' | 'pending' | 'suspended';
type LabType = 'clinical' | 'diagnostic' | 'pathology' | 'radiology' | 'research' | 'other';

interface Lab {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: LabType;
  address: string;
  registeredDate: string;
  lastActive: string;
  status: LabStatus;
  verified: boolean;
  testsOffered: number;
  turnaroundTime: string;
  certification: string;
  operatingHours: string;
}

// Mock data
const MOCK_LABS: Lab[] = [
  {
    id: 'LAB-3001',
    name: 'Precision Diagnostics',
    email: 'info@precisiondiagnostics.com',
    phone: '(555) 234-5678',
    type: 'diagnostic',
    address: '123 Testing Way, San Francisco, CA 94107',
    registeredDate: '2022-01-05',
    lastActive: '2023-03-14',
    status: 'active',
    verified: true,
    testsOffered: 120,
    turnaroundTime: '24-48 hours',
    certification: 'CLIA, CAP',
    operatingHours: '8AM-6PM'
  },
  {
    id: 'LAB-3002',
    name: 'Bay Area Pathology',
    email: 'labs@bayareapathology.com',
    phone: '(555) 345-6789',
    type: 'pathology',
    address: '456 Science Dr, Oakland, CA 94612',
    registeredDate: '2022-02-10',
    lastActive: '2023-03-13',
    status: 'active',
    verified: true,
    testsOffered: 85,
    turnaroundTime: '48-72 hours',
    certification: 'CLIA, ISO 15189',
    operatingHours: '7AM-7PM'
  },
  {
    id: 'LAB-3003',
    name: 'Advanced Imaging Center',
    email: 'scheduling@advancedimaging.com',
    phone: '(555) 456-7890',
    type: 'radiology',
    address: '789 X-Ray Blvd, San Jose, CA 95113',
    registeredDate: '2022-03-15',
    lastActive: '2023-03-12',
    status: 'active',
    verified: true,
    testsOffered: 45,
    turnaroundTime: 'Same day - 24 hours',
    certification: 'ACR, JCAHO',
    operatingHours: '6AM-9PM'
  },
  {
    id: 'LAB-3004',
    name: 'City Clinical Laboratory',
    email: 'contact@cityclinical.com',
    phone: '(555) 567-8901',
    type: 'clinical',
    address: '321 Lab Lane, Berkeley, CA 94704',
    registeredDate: '2022-04-01',
    lastActive: '2023-03-10',
    status: 'inactive',
    verified: true,
    testsOffered: 150,
    turnaroundTime: '24 hours',
    certification: 'CLIA, CAP, ISO 9001',
    operatingHours: '24 hours'
  },
  {
    id: 'LAB-3005',
    name: 'BioResearch Labs',
    email: 'research@bioresearch.com',
    phone: '(555) 678-9012',
    type: 'research',
    address: '555 Science Park, Palo Alto, CA 94301',
    registeredDate: '2022-05-01',
    lastActive: '2023-03-01',
    status: 'pending',
    verified: false,
    testsOffered: 30,
    turnaroundTime: '3-5 days',
    certification: 'Pending',
    operatingHours: '9AM-5PM'
  }
];

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LabStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<LabType | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLabs(MOCK_LABS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter labs
  const filteredLabs = labs.filter(lab => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.certification.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || lab.status === selectedStatus;
    
    // Filter by type
    const matchesType = selectedType === 'all' || lab.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Format lab type for display
  const formatType = (type: LabType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lab Management</h1>
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
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <FlaskConical className="inline-block mr-2 h-6 w-6 text-teal-500" />
            Lab Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage laboratory providers, verification, and services
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Lab
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search labs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Status: {selectedStatus === 'all' ? 'All' : selectedStatus}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  <div
                    onClick={() => {
                      setSelectedStatus('all');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'all' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('active');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'active' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Active
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('inactive');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'inactive' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Inactive
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('pending');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'pending' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Pending
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('suspended');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'suspended' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Suspended
                  </div>
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Type: {selectedType === 'all' ? 'All' : formatType(selectedType)}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {typeDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  <div
                    onClick={() => {
                      setSelectedType('all');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'all' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('clinical');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'clinical' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Clinical
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('diagnostic');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'diagnostic' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Diagnostic
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('pathology');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'pathology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Pathology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('radiology');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'radiology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Radiology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('research');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'research' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Research
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('other');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'other' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Other
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Labs List */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLabs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No labs found
                  </td>
                </tr>
              ) : (
                filteredLabs.map(lab => (
                  <tr key={lab.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {lab.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {lab.name}
                      <div className="text-xs text-gray-400">
                        {lab.certification}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {formatType(lab.type)}
                      <div className="text-xs text-gray-400">
                        {lab.operatingHours}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        {lab.testsOffered} tests offered
                      </div>
                      <div className="text-xs text-gray-400">
                        TAT: {lab.turnaroundTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {lab.email}
                      <div className="text-xs text-gray-400">
                        {lab.phone}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[150px]">{lab.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${lab.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            lab.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            lab.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                        >
                          {lab.status}
                        </span>
                        {lab.verified ? (
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">
                            Verified
                          </span>
                        ) : (
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                            Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(lab.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === lab.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                Edit
                              </button>
                              {!lab.verified && (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserCheck className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                  Verify
                                </button>
                              )}
                              {lab.status !== 'active' ? (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserCheck className="mr-3 h-4 w-4 text-gray-500 group-hover:text-green-500" />
                                  Activate
                                </button>
                              ) : (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserX className="mr-3 h-4 w-4 text-gray-500 group-hover:text-yellow-500" />
                                  Deactivate
                                </button>
                              )}
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Trash className="mr-3 h-4 w-4 text-gray-500 group-hover:text-red-500" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
} 