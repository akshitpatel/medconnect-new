'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Trash, UserCheck, UserX, Users } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Define types
type PatientStatus = 'active' | 'inactive' | 'pending' | 'blocked';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: BloodType;
  address: string;
  registeredDate: string;
  lastLogin: string;
  status: PatientStatus;
  insuranceProvider: string;
  insuranceNumber: string;
  emergencyContact: string;
  medicalConditions: string[];
}

// Mock data
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'PT-1001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    bloodType: 'O+',
    address: '123 Main St, San Francisco, CA 94105',
    registeredDate: '2022-01-10',
    lastLogin: '2023-03-14',
    status: 'active',
    insuranceProvider: 'Blue Shield',
    insuranceNumber: 'BSC123456789',
    emergencyContact: 'Mary Smith (555) 987-6543',
    medicalConditions: ['Hypertension', 'Asthma']
  },
  {
    id: 'PT-1002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1990-03-22',
    gender: 'female',
    bloodType: 'A+',
    address: '456 Oak Ave, Oakland, CA 94610',
    registeredDate: '2022-02-15',
    lastLogin: '2023-03-13',
    status: 'active',
    insuranceProvider: 'Kaiser Permanente',
    insuranceNumber: 'KP987654321',
    emergencyContact: 'Robert Johnson (555) 876-5432',
    medicalConditions: ['Diabetes Type 2']
  },
  {
    id: 'PT-1003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1978-11-05',
    gender: 'male',
    bloodType: 'B-',
    address: '789 Pine St, San Jose, CA 95113',
    registeredDate: '2022-03-01',
    lastLogin: '2023-03-12',
    status: 'active',
    insuranceProvider: 'Anthem',
    insuranceNumber: 'ANT567891234',
    emergencyContact: 'Lisa Chen (555) 765-4321',
    medicalConditions: ['Arthritis']
  },
  {
    id: 'PT-1004',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1995-08-30',
    gender: 'female',
    bloodType: 'AB+',
    address: '321 Cedar Rd, Berkeley, CA 94704',
    registeredDate: '2022-04-10',
    lastLogin: '2023-03-10',
    status: 'inactive',
    insuranceProvider: 'UnitedHealthcare',
    insuranceNumber: 'UHC654321987',
    emergencyContact: 'David Wilson (555) 654-3210',
    medicalConditions: ['Allergies', 'Migraine']
  },
  {
    id: 'PT-1005',
    name: 'James Rodriguez',
    email: 'james.rodriguez@example.com',
    phone: '(555) 567-8901',
    dateOfBirth: '1982-01-25',
    gender: 'male',
    bloodType: 'O-',
    address: '555 Maple Dr, Palo Alto, CA 94301',
    registeredDate: '2022-05-05',
    lastLogin: '2023-03-01',
    status: 'pending',
    insuranceProvider: 'Cigna',
    insuranceNumber: 'CIG789123456',
    emergencyContact: 'Maria Rodriguez (555) 543-2109',
    medicalConditions: []
  }
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPatients(MOCK_PATIENTS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
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
            <Users className="inline-block mr-2 h-6 w-6 text-blue-500" />
            Patient Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage patient accounts, information, and access
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patients by name, email, ID, or phone..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      selectedStatus === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
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
                      selectedStatus === 'active' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
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
                      selectedStatus === 'inactive' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
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
                      selectedStatus === 'pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    Pending
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('blocked');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'blocked' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  >
                    Blocked
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Patients List */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medical Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Insurance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {patient.name}
                      <div className="text-xs text-gray-400">
                        {calculateAge(patient.dateOfBirth)} years • {patient.gender}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {patient.email}
                      <div className="text-xs text-gray-400">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 mr-2">
                          {patient.bloodType}
                        </span>
                        {patient.medicalConditions.length > 0 ? (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {patient.medicalConditions.join(', ')}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            No conditions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {patient.insuranceProvider}
                      <div className="text-xs text-gray-400">
                        {patient.insuranceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${patient.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          patient.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          patient.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                      >
                        {patient.status}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        Last login: {formatDate(patient.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(patient.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === patient.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                                Edit
                              </button>
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-blue-500" />
                                View Records
                              </button>
                              {patient.status !== 'active' ? (
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