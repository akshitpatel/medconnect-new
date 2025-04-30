'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Building, Stethoscope, Hospital,
  TestTube, Scan, Pill, Shield, Home, X, Users,
  Microscope, Calendar, ChevronDown, Phone, Mail,
  MapPin, Clock, Info, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { adminAPI } from '@/app/services/api';

// Provider types
type ProviderType = 
  | 'all' 
  | 'hospital' 
  | 'doctor' 
  | 'diagnostic' 
  | 'lab' 
  | 'imaging' 
  | 'pharmacy' 
  | 'insurance' 
  | 'homeservice';

// Provider entity interface
interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  specialty?: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  verified: boolean;
  availability?: {
    nextAvailable: string;
    slots: number;
  };
  description: string;
  services: string[];
  insuranceAccepted?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Mock data for providers
const MOCK_PROVIDERS: Provider[] = [
  // Hospitals
  {
    id: 'H001',
    name: 'City General Hospital',
    type: 'hospital',
    address: '123 Main St, Metropolis',
    phone: '(555) 123-4567',
    email: 'info@citygeneral.com',
    rating: 4.5,
    verified: true,
    availability: {
      nextAvailable: '2025-05-02T09:00:00Z',
      slots: 25,
    },
    description: 'Leading general hospital with advanced medical facilities.',
    services: ['Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
    insuranceAccepted: ['MediCare', 'BlueCross', 'Aetna', 'UnitedHealth'],
  },
  // Doctors
  {
    id: 'D001',
    name: 'Dr. Sarah Johnson',
    type: 'doctor',
    specialty: 'Cardiologist',
    address: '456 Health Ave, Metropolis',
    phone: '(555) 234-5678',
    email: 'dr.johnson@heartcare.com',
    rating: 4.8,
    verified: true,
    availability: {
      nextAvailable: '2025-05-01T10:30:00Z',
      slots: 3,
    },
    description: 'Board-certified cardiologist with 15 years of experience.',
    services: ['Cardiac Consultation', 'ECG', 'Stress Test', 'Heart Health Screening'],
  },
  // Labs
  {
    id: 'L001',
    name: 'MetroLab Diagnostics',
    type: 'lab',
    address: '789 Science Blvd, Metropolis',
    phone: '(555) 345-6789',
    email: 'tests@metrolab.com',
    rating: 4.2,
    verified: true,
    description: 'Full-service medical laboratory offering comprehensive testing.',
    services: ['Blood Tests', 'Urine Analysis', 'Genetic Testing', 'Microbiology'],
  },
  // Imaging centers
  {
    id: 'I001',
    name: 'Clear View Imaging',
    type: 'imaging',
    address: '101 Scan Street, Metropolis',
    phone: '(555) 456-7890',
    email: 'appointments@clearview.com',
    rating: 4.6,
    verified: true,
    availability: {
      nextAvailable: '2025-05-03T14:00:00Z',
      slots: 8,
    },
    description: 'State-of-the-art imaging center for MRI, CT, and other advanced scans.',
    services: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', '3D Imaging'],
  },
  // Pharmacies
  {
    id: 'P001',
    name: 'HealthPlus Pharmacy',
    type: 'pharmacy',
    address: '222 Med Avenue, Metropolis',
    phone: '(555) 567-8901',
    email: 'rx@healthplus.com',
    rating: 4.3,
    verified: true,
    description: '24-hour pharmacy with prescription and OTC medications.',
    services: ['Prescription Filling', 'Medication Consultation', 'Immunizations', 'Health Supplies'],
  },
];

export default function UnifiedSearchPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ProviderType>('all');
  const [filters, setFilters] = useState({
    verified: false,
    hasAvailability: false,
  });
  const [error, setError] = useState<string | null>(null);
  
  // Fetch providers data from API
  const fetchProviders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching providers from backend API...');
      let response;

      if (searchTerm.trim() !== '') {
        // Use unified search when there's a search term
        response = await adminAPI.unifiedSearch(searchTerm, {
          provider_type: selectedType === 'all' ? undefined : selectedType,
          verified: filters.verified ? true : undefined,
          include_users: false // Only search for providers
        });
        
        if (response.data?.data?.results) {
          // Format the results from unified search to match our Provider interface
          const formattedProviders = response.data.data.results.map((result: any) => formatProviderFromAPI(result));
          setProviders(formattedProviders);
        }
      } else {
        // Use the type-specific endpoints when no search term
        if (selectedType === 'all') {
          response = await adminAPI.getProviders({
            verified: filters.verified ? true : undefined
          });
        } else {
          // Use the specific provider type endpoint
          const typeEndpoints = {
            hospital: adminAPI.getHospitals,
            doctor: adminAPI.getDoctors,
            diagnostic: adminAPI.getDiagnosticCenters,
            lab: adminAPI.getLabs,
            imaging: adminAPI.getImagingCenters,
            pharmacy: adminAPI.getPharmacies,
            insurance: adminAPI.getInsuranceProviders,
            homeservice: adminAPI.getHomeServices
          };
          
          const fetchMethod = typeEndpoints[selectedType];
          if (fetchMethod) {
            response = await fetchMethod({
              verified: filters.verified ? true : undefined
            });
          }
        }

        if (response?.data?.data?.providers) {
          // Format providers from API to match our Provider interface
          const formattedProviders = response.data.data.providers.map((provider: any) => formatProviderFromAPI(provider));
          setProviders(formattedProviders);
        } else {
          // Fallback to mock data if no providers returned
          console.log('No providers returned from API, using mock data');
          setProviders(MOCK_PROVIDERS);
        }
      }
      
      console.log('Successfully retrieved providers data');
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setError('Failed to load providers. Using mock data instead.');
      // Fallback to mock data if API fails
      setProviders(MOCK_PROVIDERS);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format provider data from API to match our Provider interface
  const formatProviderFromAPI = (apiProvider: any): Provider => {
    return {
      id: apiProvider.id,
      name: apiProvider.name,
      type: apiProvider.type || apiProvider.subtype || 'doctor',
      specialty: apiProvider.specialty,
      address: apiProvider.location || apiProvider.address || 'Address not provided',
      phone: apiProvider.contact_phone || apiProvider.phone || 'Phone not provided',
      email: apiProvider.contact_email || apiProvider.email || 'Email not provided',
      rating: apiProvider.rating || 4.0,
      verified: apiProvider.verified || false,
      availability: apiProvider.availability ? {
        nextAvailable: apiProvider.availability.next_available || new Date().toISOString(),
        slots: apiProvider.availability.slots || 0
      } : undefined,
      description: apiProvider.bio || apiProvider.description || 'No description available',
      services: apiProvider.services || [],
      insuranceAccepted: apiProvider.insurance_providers || apiProvider.insurance_accepted || [],
      coordinates: apiProvider.coordinates
    };
  };
  
  // Authentication check and initial data fetch
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        // If we're not authenticated, try to log in with admin credentials
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          console.log('No authentication token found, redirecting to login...');
          // For development purposes, we can try to authenticate automatically
          // In production, this should redirect to login
          try {
            const response = await fetch(`${window.location.origin}/api/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                email: 'admin@medconnect.com', 
                password: 'password' 
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.token) {
                localStorage.setItem('auth_token', data.token);
                console.log('Auto-login successful');
                fetchProviders();
              }
            } else {
              // If auto-login fails, we need to redirect to the login page
              console.log('Auto-login failed, redirecting to login page');
              window.location.href = '/auth/login';
              return;
            }
          } catch (error) {
            console.error('Auto-login error:', error);
            window.location.href = '/auth/login';
            return;
          }
        } else {
          // We already have a token, fetch providers
          fetchProviders();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // If there's an error, we still try to fetch providers
        // The API service will handle redirecting if the token is invalid
        fetchProviders();
      }
    };
    
    checkAuthAndFetch();
  }, []);
  
  // Fetch data on type change
  useEffect(() => {
    fetchProviders();
  }, [selectedType]);
  
  // Apply filters and search
  const filteredProviders = providers.filter(provider => {
    // Filter by provider type
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply additional filters
    const matchesVerified = !filters.verified || provider.verified;
    const matchesAvailability = !filters.hasAvailability || provider.availability !== undefined;
    
    return matchesType && matchesSearch && matchesVerified && matchesAvailability;
  });
  
  // Get the appropriate icon for each provider type
  const getProviderIcon = (type: ProviderType) => {
    const iconClass = "h-5 w-5";
    switch(type) {
      case 'hospital': return <Hospital className={iconClass} />;
      case 'doctor': return <Stethoscope className={iconClass} />;
      case 'diagnostic': return <Microscope className={iconClass} />;
      case 'lab': return <TestTube className={iconClass} />;
      case 'imaging': return <Scan className={iconClass} />;
      case 'pharmacy': return <Pill className={iconClass} />;
      case 'insurance': return <Shield className={iconClass} />;
      case 'homeservice': return <Home className={iconClass} />;
      default: return <Building className={iconClass} />;
    }
  };
  
  // Format the provider type for display
  const formatProviderType = (type: ProviderType): string => {
    switch(type) {
      case 'hospital': return 'Hospital';
      case 'doctor': return 'Doctor';
      case 'diagnostic': return 'Diagnostic Center';
      case 'lab': return 'Laboratory';
      case 'imaging': return 'Imaging Center';
      case 'pharmacy': return 'Pharmacy';
      case 'insurance': return 'Insurance Provider';
      case 'homeservice': return 'Home Service';
      case 'all': return 'All Providers';
      default: return type;
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Unified Provider Search</h1>
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Search className="inline-block mr-2 h-6 w-6 text-teal-500" />
            Unified Provider Search
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Search across all healthcare providers in one place
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="fixed top-4 right-4 z-50 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg" role="alert">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Refresh button */}
        <Button
          onClick={() => fetchProviders()}
          size="sm"
          variant="outline"
          className="mt-4 sm:mt-0 flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
      
      {/* Search and filters */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, services, or description..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            
            {/* Provider type filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as ProviderType)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Providers</option>
                <option value="hospital">Hospitals & Clinics</option>
                <option value="doctor">Doctors</option>
                <option value="diagnostic">Diagnostic Centers</option>
                <option value="lab">Laboratories</option>
                <option value="imaging">MRI & CT Centers</option>
                <option value="pharmacy">Pharmacies</option>
                <option value="insurance">Insurance Providers</option>
                <option value="homeservice">Home Services</option>
              </select>
            </div>
          </div>
          
          {/* Additional filters */}
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={() => setFilters({...filters, verified: !filters.verified})}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Verified Providers Only</span>
            </label>
            
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={filters.hasAvailability}
                onChange={() => setFilters({...filters, hasAvailability: !filters.hasAvailability})}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Has Availability</span>
            </label>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Provider type tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {(['all', 'hospital', 'doctor', 'diagnostic', 'lab', 'imaging', 'pharmacy', 'insurance', 'homeservice'] as ProviderType[]).map((type) => (
            <li key={type} className="mr-2">
              <button
                onClick={() => setSelectedType(type)}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  selectedType === type
                    ? 'text-teal-600 dark:text-teal-500 border-teal-600 dark:border-teal-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{getProviderIcon(type)}</span>
                {formatProviderType(type)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Results */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        {filteredProviders.length === 0 ? (
          <div className="p-10 text-center">
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="font-medium mb-1 text-lg">No providers found</p>
              <p className="text-sm mb-4">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setFilters({ verified: false, hasAvailability: false });
                }}
                variant="outline" 
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProviders.map((provider) => (
              <div key={provider.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Provider info */}
                  <div className="flex-1">
                    <div className="flex items-start">
                      <div className="mr-3 p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600 dark:text-teal-400">
                        {getProviderIcon(provider.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {provider.name}
                          </h3>
                          {provider.verified && (
                            <Badge className="ml-2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <span className="font-medium mr-1">{formatProviderType(provider.type)}</span>
                          {provider.specialty && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{provider.specialty}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{provider.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{provider.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{provider.email}</span>
                      </div>
                      {provider.availability && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Next available: {new Date(provider.availability.nextAvailable).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      {provider.description}
                    </p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Services</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {provider.services.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-50 dark:bg-gray-800">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[140px] self-start mt-4 md:mt-0">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                    <Button variant="ghost" className="w-full flex items-center justify-center">
                      <Info className="h-4 w-4 mr-1.5" />
                      <span>More Info</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>
    </div>
  );
}
