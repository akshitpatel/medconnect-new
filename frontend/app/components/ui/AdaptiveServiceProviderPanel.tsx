'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  Filter, 
  Search, 
  Clock, 
  PlusCircle, 
  Pill, 
  Truck, 
  Gift, 
  TestTube, 
  Mail, 
  Home, 
  DollarSign,
  Stethoscope,
  ChevronDown
} from 'lucide-react';

// Provider type definitions
type ProviderType = 'doctors' | 'pharmacies' | 'labs';

interface Provider {
  id: string;
  name: string;
  contact: string;
  location: string;
  rating: number;
}

// Doctor-specific interface
interface Doctor extends Provider {
  specialty: string;
  availability: string[];
  reviews: { id: string; rating: number; comment: string; author: string }[];
  education: string;
  experience: number; // years
}

// Pharmacy-specific interface
interface Pharmacy extends Provider {
  deliveryAvailable: boolean;
  operatingHours: string;
  hasLoyaltyProgram: boolean;
  inventoryStatus: { [medication: string]: 'in-stock' | 'low-stock' | 'out-of-stock' };
}

// Lab-specific interface
interface Lab extends Provider {
  testTypes: string[];
  homeCollection: boolean;
  turnaroundTime: { [test: string]: string }; // e.g., "24 hours"
  prices: { [test: string]: number };
}

export default function AdaptiveServiceProviderPanel() {
  const [selectedType, setSelectedType] = useState<ProviderType>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Provider-specific states
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedMedication, setSelectedMedication] = useState<string>('');
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState(false);
  const [homeCollectionFilter, setHomeCollectionFilter] = useState(false);

  // Mock data (in a real app this would come from an API)
  const specialties = [
    'All', 'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology'
  ];
  
  const testTypes = [
    'All', 'Blood Work', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound'
  ];

  // Function to handle loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Handle provider type change
  const handleTypeChange = (type: ProviderType) => {
    setIsLoading(true);
    setSelectedType(type);
    // Reset filters when changing provider type
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedTest('all');
    setSelectedMedication('');
    setDeliveryFilter(false);
    setHomeCollectionFilter(false);
  };

  // Render the loading skeleton
  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );

  // Render provider-specific filters
  const renderFilters = () => {
    if (!showFilters) return null;

    switch (selectedType) {
      case 'doctors':
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 space-y-3 transition-all duration-300">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Filter by Specialty</h3>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSpecialty === specialty.toLowerCase()
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  } transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>
        );

      case 'pharmacies':
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 space-y-3 transition-all duration-300">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Pharmacy Filters</h3>
            <div className="flex flex-col space-y-2">
              <label className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={deliveryFilter}
                  onChange={() => setDeliveryFilter(!deliveryFilter)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Delivery Available</span>
              </label>
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 space-y-3 transition-all duration-300">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Lab Test Filters</h3>
            <div className="flex flex-wrap gap-2">
              {testTypes.map((test) => (
                <button
                  key={test}
                  onClick={() => setSelectedTest(test.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTest === test.toLowerCase()
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  } transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950`}
                >
                  {test}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
              <input
                type="checkbox"
                checked={homeCollectionFilter}
                onChange={() => setHomeCollectionFilter(!homeCollectionFilter)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Home Sample Collection</span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Render provider-specific content
  const renderProviderContent = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    switch (selectedType) {
      case 'doctors':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Doctor Card Example */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Dr. Sarah Johnson</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cardiology</p>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-gray-300 dark:text-gray-600" />
                          <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">(4.0)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span>123 Medical Center, New York</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={16} className="mr-2 flex-shrink-0" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span>Available: Mon, Wed, Fri</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
                      Book Appointment
                    </button>
                    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-md transition-colors">
                      <Star size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pharmacies':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pharmacy Card Example */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300">
                        <Pill size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">City Care Pharmacy</h3>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">(5.0)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span>456 Health Avenue, Boston</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={16} className="mr-2 flex-shrink-0" />
                      <span>+1 (555) 987-6543</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      <span>Open: 8AM - 10PM</span>
                    </div>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <Truck size={16} className="mr-2 flex-shrink-0" />
                      <span>Delivery Available</span>
                    </div>
                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                      <Gift size={16} className="mr-2 flex-shrink-0" />
                      <span>Loyalty Program</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
                      Request Refill
                    </button>
                    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-md transition-colors">
                      <Star size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Lab Card Example */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <TestTube size={24} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">HealthTest Laboratories</h3>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <Star size={14} className="text-gray-300 dark:text-gray-600" />
                          <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">(4.2)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2 flex-shrink-0" />
                      <span>789 Test Boulevard, Chicago</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone size={16} className="mr-2 flex-shrink-0" />
                      <span>+1 (555) 789-0123</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} className="mr-2 flex-shrink-0" />
                      <span>Turnaround: 24-48 hours</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Home size={16} className="mr-2 flex-shrink-0" />
                      <span>Home Collection Available</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign size={16} className="mr-2 flex-shrink-0" />
                      <span>Tests from $50</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
                      Book Test
                    </button>
                    <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-md transition-colors">
                      <Mail size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Select a service provider type</div>;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-xl shadow-sm">
      {/* Provider Type Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Find Healthcare Services</h2>
        <div className="flex space-x-1 md:space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => handleTypeChange('doctors')}
            className={`flex-1 py-2 px-3 md:px-4 rounded-md text-sm md:text-base transition-colors flex items-center justify-center ${
              selectedType === 'doctors'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Stethoscope size={18} className="mr-2 hidden md:inline" />
            Doctors
          </button>
          <button
            onClick={() => handleTypeChange('pharmacies')}
            className={`flex-1 py-2 px-3 md:px-4 rounded-md text-sm md:text-base transition-colors flex items-center justify-center ${
              selectedType === 'pharmacies'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Pill size={18} className="mr-2 hidden md:inline" />
            Pharmacies
          </button>
          <button
            onClick={() => handleTypeChange('labs')}
            className={`flex-1 py-2 px-3 md:px-4 rounded-md text-sm md:text-base transition-colors flex items-center justify-center ${
              selectedType === 'labs'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <TestTube size={18} className="mr-2 hidden md:inline" />
            Labs
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Search ${selectedType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter size={18} className="mr-2" />
          Filters
          <ChevronDown size={16} className={`ml-2 transition-transform duration-200 ${showFilters ? 'transform rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Section */}
      {renderFilters()}

      {/* Content Area */}
      <div className="mt-4">
        {renderProviderContent()}
      </div>
    </div>
  );
} 