'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  ChevronDown,
  Eye,
  Stethoscope,
  Pill,
  TestTube,
  Star
} from 'lucide-react';

// Provider type definitions
type ProviderType = 'doctors' | 'pharmacies' | 'labs';
type ProviderStatus = 'active' | 'inactive' | 'pending';

// Base provider interface
interface Provider {
  id: string;
  name: string;
  contact: string;
  email: string;
  location: string;
  rating: number;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Doctor-specific interface
interface Doctor extends Provider {
  specialty: string;
  qualifications: string;
  experience: number; // years
  availability: string[];
  consultationFee: number;
}

// Pharmacy-specific interface
interface Pharmacy extends Provider {
  operatingHours: string;
  deliveryAvailable: boolean;
  hasLoyaltyProgram: boolean;
  deliveryRadius: number; // in miles/km
  minimumOrderValue: number;
}

// Lab-specific interface
interface Lab extends Provider {
  testTypes: string[];
  homeCollection: boolean;
  turnaroundTime: { [test: string]: string }; // e.g., "24 hours"
  accreditations: string[];
  homeCollectionFee: number;
}

export default function ProviderManagementPanel() {
  const [selectedType, setSelectedType] = useState<ProviderType>('doctors');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  
  // Mock data for each provider type
  const mockDoctors: Doctor[] = [
    {
      id: 'd1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      contact: '+1 (555) 123-4567',
      email: 'sarah.johnson@medconnect.com',
      location: '123 Medical Center, New York',
      rating: 4.8,
      qualifications: 'MD, FACC',
      experience: 12,
      availability: ['Monday', 'Wednesday', 'Friday'],
      consultationFee: 150,
      status: 'active',
      createdAt: new Date(2022, 3, 15),
      updatedAt: new Date(2023, 1, 10)
    },
    {
      id: 'd2',
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      contact: '+1 (555) 987-6543',
      email: 'michael.chen@medconnect.com',
      location: '456 Neuro Sciences Building, Boston',
      rating: 4.6,
      qualifications: 'MD, PhD',
      experience: 8,
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      consultationFee: 180,
      status: 'active',
      createdAt: new Date(2022, 5, 20),
      updatedAt: new Date(2023, 0, 5)
    },
    {
      id: 'd3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      contact: '+1 (555) 234-5678',
      email: 'emily.rodriguez@medconnect.com',
      location: '789 Children\'s Hospital, Chicago',
      rating: 4.9,
      qualifications: 'MD, FAAP',
      experience: 15,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      consultationFee: 120,
      status: 'inactive',
      createdAt: new Date(2022, 1, 8),
      updatedAt: new Date(2022, 11, 15)
    }
  ];

  const mockPharmacies: Pharmacy[] = [
    {
      id: 'p1',
      name: 'City Care Pharmacy',
      contact: '+1 (555) 345-6789',
      email: 'contact@citycarepharmacy.com',
      location: '101 Health Avenue, San Francisco',
      rating: 4.7,
      operatingHours: '8AM - 10PM',
      deliveryAvailable: true,
      hasLoyaltyProgram: true,
      deliveryRadius: 5,
      minimumOrderValue: 20,
      status: 'active',
      createdAt: new Date(2022, 2, 12),
      updatedAt: new Date(2023, 2, 1)
    },
    {
      id: 'p2',
      name: 'MediQuick Pharmacy',
      contact: '+1 (555) 456-7890',
      email: 'support@mediquick.com',
      location: '202 Wellness Road, Los Angeles',
      rating: 4.5,
      operatingHours: '24/7',
      deliveryAvailable: true,
      hasLoyaltyProgram: false,
      deliveryRadius: 8,
      minimumOrderValue: 15,
      status: 'pending',
      createdAt: new Date(2022, 6, 25),
      updatedAt: new Date(2022, 10, 12)
    },
    {
      id: 'p3',
      name: 'HealthPlus Pharmacy',
      contact: '+1 (555) 567-8901',
      email: 'info@healthplus.com',
      location: '303 Medication Drive, Seattle',
      rating: 4.3,
      operatingHours: '9AM - 9PM',
      deliveryAvailable: false,
      hasLoyaltyProgram: true,
      deliveryRadius: 0,
      minimumOrderValue: 0,
      status: 'active',
      createdAt: new Date(2022, 4, 10),
      updatedAt: new Date(2023, 3, 5)
    }
  ];

  const mockLabs: Lab[] = [
    {
      id: 'l1',
      name: 'HealthTest Laboratories',
      contact: '+1 (555) 678-9012',
      email: 'info@healthtest.com',
      location: '404 Diagnostic Lane, Houston',
      rating: 4.6,
      testTypes: ['Blood Work', 'X-Ray', 'MRI', 'CT Scan'],
      homeCollection: true,
      turnaroundTime: { 'Blood Work': '24 hours', 'X-Ray': '2 hours', 'MRI': '48 hours', 'CT Scan': '24 hours' },
      accreditations: ['CAP', 'CLIA'],
      homeCollectionFee: 25,
      status: 'active',
      createdAt: new Date(2022, 7, 18),
      updatedAt: new Date(2023, 2, 20)
    },
    {
      id: 'l2',
      name: 'Precision Diagnostics',
      contact: '+1 (555) 789-0123',
      email: 'contact@precisiondiag.com',
      location: '505 Testing Center, Dallas',
      rating: 4.4,
      testTypes: ['Blood Work', 'Ultrasound', 'Biopsy', 'ECG'],
      homeCollection: false,
      turnaroundTime: { 'Blood Work': '12 hours', 'Ultrasound': '1 hour', 'Biopsy': '72 hours', 'ECG': '1 hour' },
      accreditations: ['CLIA', 'NABL'],
      homeCollectionFee: 0,
      status: 'inactive',
      createdAt: new Date(2022, 8, 5),
      updatedAt: new Date(2022, 11, 30)
    },
    {
      id: 'l3',
      name: 'QuickScan Imaging',
      contact: '+1 (555) 890-1234',
      email: 'appointments@quickscan.com',
      location: '606 Radiology Plaza, Atlanta',
      rating: 4.8,
      testTypes: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'PET Scan'],
      homeCollection: false,
      turnaroundTime: { 'X-Ray': '1 hour', 'MRI': '24 hours', 'CT Scan': '2 hours', 'Ultrasound': '1 hour', 'PET Scan': '48 hours' },
      accreditations: ['ACR', 'IAC'],
      homeCollectionFee: 0,
      status: 'active',
      createdAt: new Date(2022, 9, 15),
      updatedAt: new Date(2023, 1, 28)
    }
  ];

  // Load providers based on selected type
  useEffect(() => {
    const loadProviders = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (selectedType) {
        case 'doctors':
          setProviders(mockDoctors);
          break;
        case 'pharmacies':
          setProviders(mockPharmacies);
          break;
        case 'labs':
          setProviders(mockLabs);
          break;
        default:
          setProviders([]);
      }
      
      setIsLoading(false);
    };
    
    loadProviders();
  }, [selectedType]);

  // Change provider type
  const handleProviderTypeChange = (type: ProviderType) => {
    setSelectedType(type);
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Filter providers
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle provider status
  const toggleProviderStatus = (id: string) => {
    setProviders(prevProviders =>
      prevProviders.map(provider =>
        provider.id === id
          ? {
              ...provider,
              status: provider.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date()
            }
          : provider
      )
    );
  };

  // Delete provider
  const deleteProvider = (id: string) => {
    if (window.confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
      setProviders(prevProviders => prevProviders.filter(provider => provider.id !== id));
    }
  };

  // Open edit modal with provider data
  const openEditModal = (provider: Provider) => {
    setCurrentProvider(provider);
    setIsEditModalOpen(true);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Provider status badge
  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    
    switch (status) {
      case 'active':
        bgColor = 'bg-green-100 dark:bg-green-900/20';
        textColor = 'text-green-800 dark:text-green-300';
        icon = <Check className="w-3 h-3 mr-1" />;
        break;
      case 'inactive':
        bgColor = 'bg-red-100 dark:bg-red-900/20';
        textColor = 'text-red-800 dark:text-red-300';
        icon = <X className="w-3 h-3 mr-1" />;
        break;
      case 'pending':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/20';
        textColor = 'text-yellow-800 dark:text-yellow-300';
        icon = <Clock className="w-3 h-3 mr-1" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );

  // Provider type icon
  const getProviderTypeIcon = () => {
    switch (selectedType) {
      case 'doctors':
        return <Stethoscope className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case 'pharmacies':
        return <Pill className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'labs':
        return <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            {getProviderTypeIcon()}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-2">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Management
            </h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New {selectedType.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Provider Type Selector */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => handleProviderTypeChange('doctors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'doctors'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650'
            }`}
          >
            <Stethoscope className="w-4 h-4 inline mr-2" /> Doctors
          </button>
          <button
            onClick={() => handleProviderTypeChange('pharmacies')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'pharmacies'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650'
            }`}
          >
            <Pill className="w-4 h-4 inline mr-2" /> Pharmacies
          </button>
          <button
            onClick={() => handleProviderTypeChange('labs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedType === 'labs'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650'
            }`}
          >
            <TestTube className="w-4 h-4 inline mr-2" /> Labs
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedType} by name, location, or email...`}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Provider List */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6">
            {renderSkeleton()}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-850">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{provider.contact}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{provider.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{provider.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                        <span className="text-sm text-gray-900 dark:text-white">{provider.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={provider.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(provider.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(provider)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => toggleProviderStatus(provider.id)}
                          className={provider.status === 'active' 
                            ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }
                        >
                          {provider.status === 'active' ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                        </button>
                        <button 
                          onClick={() => deleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No {selectedType} found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Provider Details Modal - Would add forms for each provider type with proper fields */}
      {/* This would be implemented in a real app with proper forms */}
    </div>
  );
} 