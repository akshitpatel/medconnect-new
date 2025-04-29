'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/app/components/ui/Navbar';
import { cn } from '@/app/utils/cn';

// Mock data for providers
const providers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Primary Care Physician',
    rating: 4.9,
    reviewCount: 124,
    image: '/images/doctor1.jpg',
    distance: '0.8 miles',
    availableToday: true,
    nextAvailable: 'Today, 2:30 PM',
    address: '123 Medical Center Drive, Suite 101',
    city: 'San Francisco',
    state: 'CA',
    acceptingNewPatients: true,
    insuranceAccepted: ['Aetna', 'Blue Cross', 'Cigna', 'Medicare'],
    education: 'Stanford University School of Medicine',
    languages: ['English', 'Spanish'],
    gender: 'Female'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviewCount: 98,
    image: '/images/doctor2.jpg',
    distance: '1.2 miles',
    availableToday: false,
    nextAvailable: 'Tomorrow, 10:15 AM',
    address: '456 Heart Center Blvd',
    city: 'San Francisco',
    state: 'CA',
    acceptingNewPatients: true,
    insuranceAccepted: ['Aetna', 'Blue Cross', 'United Healthcare'],
    education: 'UCSF School of Medicine',
    languages: ['English', 'Mandarin'],
    gender: 'Male'
  },
  {
    id: '3',
    name: 'Dr. Emily Roberts',
    specialty: 'Dermatologist',
    rating: 4.7,
    reviewCount: 87,
    image: '/images/doctor3.jpg',
    distance: '2.5 miles',
    availableToday: true,
    nextAvailable: 'Today, 4:45 PM',
    address: '789 Skin Health Plaza',
    city: 'San Francisco',
    state: 'CA',
    acceptingNewPatients: true,
    insuranceAccepted: ['Blue Cross', 'Cigna', 'Medicare', 'Kaiser'],
    education: 'Harvard Medical School',
    languages: ['English'],
    gender: 'Female'
  },
  {
    id: '4',
    name: 'Dr. David Wilson',
    specialty: 'Orthopedic Surgeon',
    rating: 4.9,
    reviewCount: 156,
    image: '/images/doctor4.jpg',
    distance: '3.1 miles',
    availableToday: false,
    nextAvailable: 'Friday, 11:30 AM',
    address: '101 Bone & Joint Center',
    city: 'Oakland',
    state: 'CA',
    acceptingNewPatients: true,
    insuranceAccepted: ['Aetna', 'Blue Cross', 'Medicare', 'United Healthcare'],
    education: 'Johns Hopkins School of Medicine',
    languages: ['English'],
    gender: 'Male'
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Psychiatrist',
    rating: 4.6,
    reviewCount: 72,
    image: '/images/doctor5.jpg',
    distance: '1.7 miles',
    availableToday: true,
    nextAvailable: 'Today, 1:00 PM',
    address: '222 Mental Health Center',
    city: 'San Francisco',
    state: 'CA',
    acceptingNewPatients: false,
    insuranceAccepted: ['Blue Cross', 'United Healthcare', 'Cigna'],
    education: 'Yale School of Medicine',
    languages: ['English', 'French'],
    gender: 'Female'
  },
  {
    id: '6',
    name: 'Dr. James Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.9,
    reviewCount: 143,
    image: '/images/doctor6.jpg',
    distance: '0.5 miles',
    availableToday: false,
    nextAvailable: 'Wednesday, 9:15 AM',
    address: '333 Children\'s Health Building',
    city: 'San Francisco',
    state: 'CA',
    acceptingNewPatients: true,
    insuranceAccepted: ['Aetna', 'Blue Cross', 'United Healthcare', 'Tricare'],
    education: 'Northwestern University Feinberg School of Medicine',
    languages: ['English', 'Spanish'],
    gender: 'Male'
  }
];

// Mock data for specialties
const specialties = [
  { id: 'primary-care', name: 'Primary Care', icon: '👨‍⚕️' },
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
  { id: 'psychiatry', name: 'Psychiatry', icon: '🧠' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
  { id: 'ob-gyn', name: 'Obstetrics & Gynecology', icon: '🤰' },
  { id: 'ent', name: 'ENT', icon: '👂' }
];

// Mock data for insurances
const insurances = [
  { id: 'aetna', name: 'Aetna' },
  { id: 'blue-cross', name: 'Blue Cross' },
  { id: 'cigna', name: 'Cigna' },
  { id: 'medicare', name: 'Medicare' },
  { id: 'united', name: 'United Healthcare' },
  { id: 'kaiser', name: 'Kaiser' },
  { id: 'tricare', name: 'Tricare' }
];

export default function FindCarePage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('');
  const [acceptingNewPatients, setAcceptingNewPatients] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<string>('distance');
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter providers based on filters
  const filteredProviders = providers.filter(provider => {
    // Filter by search query
    if (searchQuery && !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !provider.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by specialty
    if (selectedSpecialty && provider.specialty.toLowerCase() !== selectedSpecialty.toLowerCase() && 
        !provider.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
      return false;
    }
    
    // Filter by availability today
    if (selectedAvailability === 'today' && !provider.availableToday) {
      return false;
    }
    
    // Filter by gender
    if (selectedGender && provider.gender.toLowerCase() !== selectedGender.toLowerCase()) {
      return false;
    }
    
    // Filter by accepting new patients
    if (acceptingNewPatients && !provider.acceptingNewPatients) {
      return false;
    }
    
    // Filter by insurance
    if (selectedInsurance && !provider.insuranceAccepted.some(
      insurance => insurance.toLowerCase() === selectedInsurance.toLowerCase()
    )) {
      return false;
    }
    
    return true;
  });
  
  // Sort providers based on sort criteria
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'rating':
        return b.rating - a.rating;
      case 'availability':
        if (a.availableToday && !b.availableToday) return -1;
        if (!a.availableToday && b.availableToday) return 1;
        return 0;
      default:
        return 0;
    }
  });
  
  // Get a placeholder image with provider first letter if no image is available
  const getProviderImagePlaceholder = (providerName: string) => {
    return providerName.charAt(0);
  };
  
  return (
    <div className="min-h-screen gradient-bg-blue pattern-bg">
      {/* Navbar */}
      <Navbar activePage="find-care" />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md mb-8 fade-in visible">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Find Care</h1>
              <p className="text-gray-600 text-lg">Find the right healthcare provider for your needs</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'list' ? 'bg-teal-100 text-teal-700' : 'bg-white text-gray-500'}`}
                onClick={() => setViewMode('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${viewMode === 'map' ? 'bg-teal-100 text-teal-700' : 'bg-white text-gray-500'}`}
                onClick={() => setViewMode('map')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </button>
            </div>
          </div>
          
          {/* Search and Filters Section */}
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search doctors, specialties, or conditions"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialty Filter */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select
                  id="specialty"
                  className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Availability Filter */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  id="availability"
                  className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                >
                  <option value="">Any time</option>
                  <option value="today">Available today</option>
                  <option value="this-week">Available this week</option>
                  <option value="next-week">Available next week</option>
                </select>
              </div>
              
              {/* Insurance Filter */}
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                <select
                  id="insurance"
                  className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  value={selectedInsurance}
                  onChange={(e) => setSelectedInsurance(e.target.value)}
                >
                  <option value="">All insurances</option>
                  {insurances.map((insurance) => (
                    <option key={insurance.id} value={insurance.name}>
                      {insurance.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Gender Filter */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Provider Gender</label>
                <select
                  id="gender"
                  className="block w-full bg-white border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="">Any gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            
            {/* Additional Filters Row */}
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                <input
                  id="new-patients"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={acceptingNewPatients}
                  onChange={(e) => setAcceptingNewPatients(e.target.checked)}
                />
                <label htmlFor="new-patients" className="ml-2 block text-sm text-gray-700">
                  Accepting new patients
                </label>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center mt-2 sm:mt-0">
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mr-2">Sort by:</label>
                <select
                  id="sort"
                  className="bg-white border border-gray-300 rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Highest rated</option>
                  <option value="availability">Earliest available</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {/* Results Count */}
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <p className="text-gray-700">
                <span className="font-semibold">{sortedProviders.length}</span> healthcare providers found
              </p>
            </div>
            
            {/* Provider List */}
            {sortedProviders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {sortedProviders.map((provider, index) => (
                  <div 
                    key={provider.id}
                    className={`fade-in ${loading ? '' : 'visible'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="md:flex">
                        <div className="md:flex-shrink-0 w-full md:w-56 h-60 md:h-full relative">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-4xl font-bold">
                            {getProviderImagePlaceholder(provider.name)}
                          </div>
                          {provider.availableToday && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Available Today
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900 mb-1">{provider.name}</h2>
                              <p className="text-gray-600 mb-2">{provider.specialty}</p>
                              <div className="flex items-center mb-4">
                                <div className="flex items-center">
                                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="ml-1 text-gray-700">{provider.rating}</span>
                                  <span className="ml-1 text-gray-500">({provider.reviewCount} reviews)</span>
                                </div>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-gray-500">{provider.distance}</span>
                              </div>
                              <p className="text-gray-700 mb-2">
                                <span className="font-medium">Next available:</span> {provider.nextAvailable}
                              </p>
                              <p className="text-gray-700 mb-4">{provider.address}, {provider.city}, {provider.state}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {provider.acceptingNewPatients && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Accepting new patients
                                  </span>
                                )}
                                {provider.languages.map((language, i) => (
                                  <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col">
                              <button className="btn-primary mb-2 whitespace-nowrap">
                                Book Appointment
                              </button>
                              <button className="btn-secondary whitespace-nowrap">
                                View Profile
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Insurance accepted</h3>
                            <div className="flex flex-wrap gap-2">
                              {provider.insuranceAccepted.map((insurance, i) => (
                                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {insurance}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-8 text-center shadow-md">
                <div className="animate-float inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No providers found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Try adjusting your search filters to find more healthcare providers in your area.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSpecialty('');
                    setSelectedAvailability('');
                    setSelectedGender('');
                    setSelectedInsurance('');
                    setAcceptingNewPatients(false);
                  }}
                  className="btn-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-8 text-center shadow-md">
            <div className="animate-float inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Map View Coming Soon</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We're working on an interactive map to help you find healthcare providers in your area. Stay tuned for updates!
            </p>
            <button 
              onClick={() => setViewMode('list')}
              className="btn-primary"
            >
              Switch to List View
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 