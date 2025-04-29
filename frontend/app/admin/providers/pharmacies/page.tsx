'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Trash, UserCheck, UserX, MapPin, Star, Pill } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Define types
type PharmacyStatus = 'active' | 'inactive' | 'pending' | 'suspended';
type PharmacyType = '24-hour' | 'retail' | 'hospital' | 'specialty' | 'online' | 'other';

interface Pharmacy {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: PharmacyType;
  address: string;
  registeredDate: string;
  lastActive: string;
  status: PharmacyStatus;
  verified: boolean;
  rating: number;
  ordersProcessed: number;
  operatingHours: string;
  deliveryAvailable: boolean;
}

// Mock data
const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'PH-2001',
    name: 'HealthPlus Pharmacy',
    email: 'info@healthplus.com',
    phone: '(555) 789-0123',
    type: 'retail',
    address: '123 Health Blvd, San Francisco, CA 94115',
    registeredDate: '2022-01-10',
    lastActive: '2023-03-14',
    status: 'active',
    verified: true,
    rating: 4.7,
    ordersProcessed: 3450,
    operatingHours: '9AM-9PM',
    deliveryAvailable: true
  },
  {
    id: 'PH-2002',
    name: 'MedExpress',
    email: 'support@medexpress.com',
    phone: '(555) 890-1234',
    type: '24-hour',
    address: '456 Medical Center Dr, Oakland, CA 94612',
    registeredDate: '2022-02-15',
    lastActive: '2023-03-13',
    status: 'active',
    verified: true,
    rating: 4.9,
    ordersProcessed: 5620,
    operatingHours: '24 hours',
    deliveryAvailable: true
  },
  {
    id: 'PH-2003',
    name: 'CareRx Specialty Pharmacy',
    email: 'contact@carerx.com',
    phone: '(555) 901-2345',
    type: 'specialty',
    address: '789 Medication St, San Jose, CA 95113',
    registeredDate: '2022-03-20',
    lastActive: '2023-03-12',
    status: 'active',
    verified: true,
    rating: 4.6,
    ordersProcessed: 2180,
    operatingHours: '8AM-7PM',
    deliveryAvailable: true
  },
  {
    id: 'PH-2004',
    name: 'Hospital Pharmacy Services',
    email: 'pharmacy@hospital.org',
    phone: '(555) 012-3456',
    type: 'hospital',
    address: '321 Hospital Way, Berkeley, CA 94704',
    registeredDate: '2022-04-05',
    lastActive: '2023-03-10',
    status: 'inactive',
    verified: true,
    rating: 4.4,
    ordersProcessed: 8730,
    operatingHours: '7AM-10PM',
    deliveryAvailable: false
  },
  {
    id: 'PH-2005',
    name: 'QuickMeds Online',
    email: 'help@quickmeds.com',
    phone: '(555) 123-4567',
    type: 'online',
    address: '555 Digital Dr, Palo Alto, CA 94301',
    registeredDate: '2022-05-15',
    lastActive: '2023-03-01',
    status: 'pending',
    verified: false,
    rating: 0,
    ordersProcessed: 0,
    operatingHours: '24 hours',
    deliveryAvailable: true
  }
];

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PharmacyStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<PharmacyType | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPharmacies(MOCK_PHARMACIES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter pharmacies
  const filteredPharmacies = pharmacies.filter(pharmacy => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || pharmacy.status === selectedStatus;
    
    // Filter by type
    const matchesType = selectedType === 'all' || pharmacy.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Format pharmacy type for display
  const formatType = (type: PharmacyType): string => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy Management</h1>
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
            <Pill className="inline-block mr-2 h-6 w-6 text-teal-500" />
            Pharmacy Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage pharmacy providers, verification, and services
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Pharmacy
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
                placeholder="Search pharmacies..."
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
                      setSelectedType('24-hour');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === '24-hour' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    24-Hour
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('retail');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'retail' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Retail
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('hospital');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'hospital' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Hospital
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('specialty');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'specialty' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Specialty
                  </div>
                  <div
                    onClick={() => {
                      setSelectedType('online');
                      setTypeDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedType === 'online' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    Online
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

      {/* Pharmacies List */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPharmacies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No pharmacies found
                  </td>
                </tr>
              ) : (
                filteredPharmacies.map(pharmacy => (
                  <tr key={pharmacy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {pharmacy.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {pharmacy.name}
                      <div className="text-xs text-gray-400">
                        {pharmacy.ordersProcessed > 0 ? `${pharmacy.ordersProcessed} orders processed` : 'New pharmacy'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {formatType(pharmacy.type)}
                      <div className="text-xs text-gray-400">
                        {pharmacy.deliveryAvailable ? 'Delivery available' : 'No delivery'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {pharmacy.email}
                      <div className="text-xs text-gray-400">
                        {pharmacy.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{pharmacy.address}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Hours: {pharmacy.operatingHours}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${pharmacy.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            pharmacy.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                            pharmacy.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                        >
                          {pharmacy.status}
                        </span>
                        {pharmacy.verified ? (
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
                          onClick={() => toggleDropdown(pharmacy.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === pharmacy.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                Edit
                              </button>
                              {!pharmacy.verified && (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserCheck className="mr-3 h-4 w-4 text-gray-500 group-hover:text-teal-500" />
                                  Verify
                                </button>
                              )}
                              {pharmacy.status !== 'active' ? (
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