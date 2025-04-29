'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Trash, UserCheck, UserX, Star, Stethoscope } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Define types
type DoctorStatus = 'active' | 'inactive' | 'pending' | 'suspended';
type Specialty = 'cardiology' | 'dermatology' | 'neurology' | 'pediatrics' | 'oncology' | 'family medicine' | 'other';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: Specialty;
  experience: number;
  registeredDate: string;
  lastActive: string;
  status: DoctorStatus;
  verified: boolean;
  rating: number;
  patientsCount: number;
  address: string;
  availability: string[];
}

// Mock data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'DR-1001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    specialty: 'cardiology',
    experience: 12,
    registeredDate: '2022-02-15',
    lastActive: '2023-03-14',
    status: 'active',
    verified: true,
    rating: 4.8,
    patientsCount: 124,
    address: '123 Medical Center Dr, San Francisco, CA 94143',
    availability: ['Monday', 'Wednesday', 'Friday']
  },
  {
    id: 'DR-1002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    specialty: 'pediatrics',
    experience: 8,
    registeredDate: '2022-03-05',
    lastActive: '2023-03-13',
    status: 'active',
    verified: true,
    rating: 4.9,
    patientsCount: 156,
    address: '456 Children\'s Way, Oakland, CA 94609',
    availability: ['Tuesday', 'Thursday', 'Saturday']
  },
  {
    id: 'DR-1003',
    name: 'Dr. Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '(555) 345-6789',
    specialty: 'neurology',
    experience: 15,
    registeredDate: '2022-01-10',
    lastActive: '2023-03-12',
    status: 'active',
    verified: true,
    rating: 4.7,
    patientsCount: 98,
    address: '789 Brain Ave, San Jose, CA 95113',
    availability: ['Monday', 'Tuesday', 'Thursday']
  },
  {
    id: 'DR-1004',
    name: 'Dr. James Williams',
    email: 'james.williams@example.com',
    phone: '(555) 456-7890',
    specialty: 'dermatology',
    experience: 10,
    registeredDate: '2022-04-20',
    lastActive: '2023-03-10',
    status: 'inactive',
    verified: true,
    rating: 4.5,
    patientsCount: 112,
    address: '321 Skin St, Berkeley, CA 94704',
    availability: ['Wednesday', 'Friday']
  },
  {
    id: 'DR-1005',
    name: 'Dr. Robert Kim',
    email: 'robert.kim@example.com',
    phone: '(555) 567-8901',
    specialty: 'family medicine',
    experience: 6,
    registeredDate: '2022-05-15',
    lastActive: '2023-03-01',
    status: 'pending',
    verified: false,
    rating: 0,
    patientsCount: 0,
    address: '654 Family Dr, Palo Alto, CA 94301',
    availability: ['Monday', 'Wednesday', 'Friday']
  }
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DoctorStatus | 'all'>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDoctors(MOCK_DOCTORS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || doctor.status === selectedStatus;
    
    // Filter by specialty
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Format specialty name for display
  const formatSpecialty = (specialty: Specialty): string => {
    return specialty.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Display rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        )}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        ))}
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Management</h1>
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
            <Stethoscope className="inline-block mr-2 h-6 w-6 text-teal-500" />
            Doctor Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage doctors, specialties, and verification
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
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
                placeholder="Search doctors..."
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

            {/* Specialty Filter */}
            <div className="relative">
              <button
                onClick={() => setSpecialtyDropdownOpen(!specialtyDropdownOpen)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Specialty: {selectedSpecialty === 'all' ? 'All' : formatSpecialty(selectedSpecialty)}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {specialtyDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  <div
                    onClick={() => {
                      setSelectedSpecialty('all');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'all' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('cardiology');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'cardiology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Cardiology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('dermatology');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'dermatology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Dermatology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('neurology');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'neurology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Neurology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('pediatrics');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'pediatrics' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Pediatrics
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('oncology');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'oncology' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Oncology
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('family medicine');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'family medicine' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Family Medicine
                  </div>
                  <div
                    onClick={() => {
                      setSelectedSpecialty('other');
                      setSpecialtyDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedSpecialty === 'other' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
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

      {/* Doctors List */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No doctors found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map(doctor => (
                  <tr key={doctor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {doctor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {doctor.name}
                      <div className="text-xs text-gray-400">
                        {doctor.experience} years experience
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {formatSpecialty(doctor.specialty)}
                      <div className="text-xs text-gray-400">
                        {doctor.patientsCount} patients
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {doctor.email}
                      <div className="text-xs text-gray-400">
                        {doctor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {renderRating(doctor.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${doctor.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            doctor.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            doctor.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                        >
                          {doctor.status}
                        </span>
                        {doctor.verified ? (
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
                          onClick={() => toggleDropdown(doctor.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === doctor.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                Edit
                              </button>
                              {!doctor.verified && (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserCheck className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                  Verify
                                </button>
                              )}
                              {doctor.status !== 'active' ? (
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