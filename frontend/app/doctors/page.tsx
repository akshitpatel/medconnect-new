'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdvancedSearch from '../components/doctors/AdvancedSearch';
import AdvancedFilters, { FilterState } from '../components/doctors/AdvancedFilters';
import SearchResults from '../components/doctors/SearchResults';
import EnhancedNavbar from '../components/EnhancedNavbar';
import { FaUserMd, FaSearch, FaMapMarkerAlt, FaStethoscope, FaHospital, FaUserCog } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mock data for demonstration
import { mockDoctors, mockSpecialties, mockHospitals, mockInsurance, mockLanguages } from '../data/mockDoctorData';

// Types for search history and suggestions
type SearchHistoryItemType = 'doctor' | 'specialty' | 'condition' | 'symptom' | 'location';
type SuggestionItemType = 'doctor' | 'specialty' | 'condition' | 'symptom' | 'location';

interface SearchHistoryItem {
  id: string;
  text: string;
  type: SearchHistoryItemType;
  timestamp: Date;
}

interface SuggestionItem {
  id: string;
  text: string;
  type: SuggestionItemType;
  popularity?: number;
}

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('query') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams?.get('location') || '');
  const [conditionsQuery, setConditionsQuery] = useState<string[]>(
    searchParams?.get('conditions') ? searchParams.get('conditions')!.split(',') : []
  );
  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page')) || 1);
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'relevance');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState<string[]>([]);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    specialization: searchQuery ? [searchQuery] : [],
    availability: '',
    consultationType: [],
    gender: '',
    languages: [],
    experience: {
      min: 0,
      max: 30
    },
    fees: {
      min: 0,
      max: 500
    },
    rating: 0,
    distance: 50,
    onlyGuruProgram: false,
    hospitalAffiliations: [],
    insuranceAccepted: [],
    symptoms: [],
    conditions: conditionsQuery,
    treatments: []
  });
  
  // Filtered doctors based on search and filters
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  
  // Mock search history for demonstration
  const recentSearches = [
    { id: '1', query: 'Cardiologist', timestamp: new Date() },
    { id: '2', query: 'Pediatrician near me', timestamp: new Date() },
    { id: '3', query: 'Dermatologist for acne', timestamp: new Date() }
  ];
  
  const searchHistory: SearchHistoryItem[] = [
    { id: '1', text: 'Dr. Sharma', type: 'doctor', timestamp: new Date() },
    { id: '2', text: 'Cardiology', type: 'specialty', timestamp: new Date() },
    { id: '3', text: 'Diabetes', type: 'condition', timestamp: new Date() },
    { id: '4', text: 'Headache', type: 'symptom', timestamp: new Date() },
    { id: '5', text: 'Mumbai', type: 'location', timestamp: new Date() }
  ];
  
  const popularSearches: SuggestionItem[] = [
    { id: '1', text: 'COVID-19', type: 'condition', popularity: 100 },
    { id: '2', text: 'Gynecologist', type: 'specialty', popularity: 90 },
    { id: '3', text: 'Skin specialist', type: 'specialty', popularity: 85 },
    { id: '4', text: 'Fever', type: 'symptom', popularity: 80 },
    { id: '5', text: 'Orthopedic', type: 'specialty', popularity: 75 }
  ];
  
  // Mock user location
  const userLocation = {
    city: 'Mumbai',
    state: 'Maharashtra'
  };
  
  // Update filters based on URL parameters
  useEffect(() => {
    // Log all search parameters for debugging
    console.log('Search params:', {
      query: searchParams?.get('query'),
      location: searchParams?.get('location'),
      conditions: searchParams?.get('conditions'),
      page: searchParams?.get('page'),
      sort: searchParams?.get('sort'),
    });

    // Update states based on URL parameters
    if (searchParams) {
      setSearchQuery(searchParams.get('query') || '');
      setLocationQuery(searchParams.get('location') || '');
      setConditionsQuery(
        searchParams.get('conditions') ? searchParams.get('conditions')!.split(',') : []
      );
      setCurrentPage(Number(searchParams.get('page')) || 1);
      setSortBy(searchParams.get('sort') || 'relevance');
      
      // If query is a specialty, add it to specialization filter
      const query = searchParams.get('query');
      if (query && mockSpecialties.some(s => s.toLowerCase().includes(query.toLowerCase()))) {
        setFilters(prev => ({
          ...prev,
          specialization: [query]
        }));
      }
      
      // If there are conditions, handle them in the search
      const conditions = searchParams.get('conditions');
      if (conditions) {
        console.log('Conditions found:', conditions);
        // You might want to handle conditions differently based on your UI
      }
    }
  }, [searchParams]);
  
  // Apply filters to doctors
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let results = [...mockDoctors];
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(doctor => 
          doctor.name.toLowerCase().includes(query) ||
          doctor.specializations.some((s: string) => s.toLowerCase().includes(query)) ||
          doctor.conditions.some((c: string) => c.toLowerCase().includes(query))
        );
      }
      
      // Apply location filter
      if (locationQuery) {
        const location = locationQuery.toLowerCase();
        results = results.filter(doctor => 
          doctor.clinicLocation.toLowerCase().includes(location)
        );
      }
      
      // Apply specialization filter
      if (filters.specialization.length > 0) {
        results = results.filter(doctor => 
          doctor.specializations.some(s => 
            filters.specialization.includes(s)
          )
        );
      }
      
      // Apply gender filter
      if (filters.gender) {
        results = results.filter(doctor => 
          doctor.gender === filters.gender
        );
      }
      
      // Apply consultation type filter
      if (filters.consultationType.length > 0) {
        results = results.filter(doctor => 
          filters.consultationType.some(type => 
            doctor.consultationTypes.includes(type)
          )
        );
      }
      
      // Apply experience filter
      if (filters.experience.min > 0) {
        results = results.filter(doctor => 
          doctor.experience >= filters.experience.min
        );
      }
      
      // Apply fee filter
      if (filters.fees.min > 0 || filters.fees.max < 5000) {
        results = results.filter(doctor => 
          doctor.consultationFeeClinic >= filters.fees.min && 
          doctor.consultationFeeClinic <= filters.fees.max
        );
      }
      
      // Apply rating filter
      if (filters.rating > 0) {
        results = results.filter(doctor => 
          doctor.rating >= filters.rating
        );
      }
      
      // Apply Guru program filter
      if (filters.onlyGuruProgram) {
        results = results.filter(doctor => 
          doctor.isGuruProgram
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'experience-high':
          results.sort((a, b) => b.experience - a.experience);
          break;
        case 'experience-low':
          results.sort((a, b) => a.experience - b.experience);
          break;
        case 'fee-low':
          results.sort((a, b) => a.consultationFeeClinic - b.consultationFeeClinic);
          break;
        case 'fee-high':
          results.sort((a, b) => b.consultationFeeClinic - a.consultationFeeClinic);
          break;
        case 'availability':
          results.sort((a, b) => new Date(a.availability.nextAvailable).getTime() - new Date(b.availability.nextAvailable).getTime());
          break;
        default:
          // Default relevance sorting (no change)
          break;
      }
      
      setFilteredDoctors(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, locationQuery, filters, sortBy]);
  
  // Handle search
  const handleSearch = (query: string, location?: string) => {
    setSearchQuery(query);
    if (location) setLocationQuery(location);
    setCurrentPage(1);
  };
  
  // Handle filter change
  const handleFilterChange = (filterName: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = (doctorId: string) => {
    setFavoriteDoctors(prev => {
      if (prev.includes(doctorId)) {
        return prev.filter(id => id !== doctorId);
      } else {
        return [...prev, doctorId];
      }
    });
  };
  
  // Calculate pagination
  const resultsPerPage = 10;
  const totalResults = filteredDoctors.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  
  // Get current page doctors
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );
  
  // Apply filters
  const handleApplyFilters = () => {
    // Filters are already applied via useEffect
    // This is just for the UI to close mobile filters if needed
  };
  
  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      specialization: [],
      availability: '',
      consultationType: [],
      gender: '',
      languages: [],
      experience: {
        min: 0,
        max: 30
      },
      fees: {
        min: 0,
        max: 5000
      },
      rating: 0,
      distance: 0,
      onlyGuruProgram: false,
      hospitalAffiliations: [],
      insuranceAccepted: [],
      symptoms: [],
      conditions: [],
      treatments: []
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-medical-teal-700 to-medical-teal-900 relative overflow-hidden pt-24 pb-16">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/dots-pattern.svg')] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-extrabold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Perfect Doctor
            </motion.h1>
            <motion.p 
              className="max-w-3xl mx-auto text-medical-teal-100 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Search from our network of qualified healthcare professionals, read reviews, 
              book appointments, and receive exceptional care.
            </motion.p>
            
            {/* Featured Specializations */}
            <motion.div 
              className="flex flex-wrap justify-center gap-2 mt-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {['Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic', 'Gynecologist', 'Neurologist'].map((specialty, index) => (
                <button 
                  key={index}
                  onClick={() => handleSearch(specialty)}
                  className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <FaStethoscope className="mr-1.5 w-3 h-3" />
                  {specialty}
                </button>
              ))}
            </motion.div>
          </div>
          
          {/* Enhanced Search Box */}
          <motion.div 
            className="mt-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/20 shadow-lg">
              <AdvancedSearch
                onSearch={handleSearch}
                recentSearches={recentSearches}
                searchHistory={searchHistory}
                popularSearches={popularSearches}
                userLocation={userLocation}
              />
              
              {/* Key features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {[
                  { icon: <FaUserMd />, text: "Verified Doctors" },
                  { icon: <FaHospital />, text: "Top Hospitals" },
                  { icon: <FaUserCog />, text: "Specialist Care" },
                  { icon: <FaMapMarkerAlt />, text: "Nearby Options" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center text-white/80">
                    <span className="mr-2 text-medical-teal-200">{feature.icon}</span>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="sticky top-20">
              <AdvancedFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                specialties={mockSpecialties}
                hospitals={mockHospitals}
                insurance={mockInsurance}
                languages={mockLanguages}
                symptoms={[]}
                conditions={[]}
                treatments={[]}
              />
            </div>
          </div>
          
          {/* Search Results */}
          <div className="md:w-3/4">
            <SearchResults
              doctors={currentDoctors}
              totalResults={totalResults}
              isLoading={isLoading}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteDoctors={favoriteDoctors}
              currentPage={currentPage}
              totalPages={totalPages}
              resultsPerPage={resultsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 