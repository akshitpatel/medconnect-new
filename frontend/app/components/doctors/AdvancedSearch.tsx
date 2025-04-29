'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaExchangeAlt,
  FaMicroscope,
  FaHeartbeat,
  FaGhost,
  FaHistory
} from 'react-icons/fa';

// Types
interface SearchHistoryItem {
  id: string;
  text: string;
  type: 'doctor' | 'specialty' | 'condition' | 'symptom' | 'location';
  timestamp: Date;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
}

interface SuggestionItem {
  id: string;
  text: string;
  type: 'doctor' | 'specialty' | 'condition' | 'symptom' | 'location';
  popularity?: number;
}

interface AdvancedSearchProps {
  onSearch?: (query: string, location?: string) => void;
  recentSearches?: RecentSearch[];
  searchHistory?: SearchHistoryItem[];
  popularSearches?: SuggestionItem[];
  userLocation?: {
    city: string;
    state: string;
  };
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  recentSearches = [],
  searchHistory = [],
  popularSearches = [],
  userLocation
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('query') || '');
  const [locationQuery, setLocationQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'search' | 'location' | null>(null);
  
  // Effect to get location from localStorage, URL params, or user location prop
  useEffect(() => {
    // Priority: 1. URL param, 2. localStorage, 3. userLocation prop
    const urlLocation = searchParams?.get('location');
    const savedLocation = localStorage.getItem('userLocation');
    
    if (urlLocation) {
      setLocationQuery(urlLocation);
    } else if (savedLocation) {
      setLocationQuery(savedLocation);
    } else if (userLocation?.city) {
      setLocationQuery(userLocation.city);
    }
    
    // Listen for location changes from LocationSelector component
    const handleLocationChange = (e: CustomEvent) => {
      if (e.detail && e.detail.location) {
        setLocationQuery(e.detail.location);
      }
    };
    
    window.addEventListener('locationChanged' as any, handleLocationChange as any);
    
    return () => {
      window.removeEventListener('locationChanged' as any, handleLocationChange as any);
    };
  }, [searchParams, userLocation]);
  
  // Group history by type for suggestions
  const doctors = searchHistory.filter(item => item.type === 'doctor').slice(0, 5);
  const specialties = searchHistory.filter(item => item.type === 'specialty').slice(0, 5);
  const conditions = searchHistory.filter(item => item.type === 'condition').slice(0, 5);
  const symptoms = searchHistory.filter(item => item.type === 'symptom').slice(0, 5);
  const locations = searchHistory.filter(item => item.type === 'location').slice(0, 5);
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setShowSuggestions(false);
    setShowLocationSuggestions(false);
    
    if (searchQuery.trim() === '') return;
    
    if (onSearch) {
      onSearch(searchQuery, locationQuery);
    } else {
      // Build query string
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (locationQuery) params.set('location', locationQuery);
      
      // Navigate to search results
      router.push(`/doctors?${params.toString()}`);
    }
  };
  
  const handleSuggestionClick = (suggestion: SuggestionItem | SearchHistoryItem) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    // Can auto-submit if needed
    // handleSearch();
  };
  
  const handleLocationSuggestionClick = (location: SearchHistoryItem) => {
    setLocationQuery(location.text);
    setShowLocationSuggestions(false);
  };
  
  const handleInputFocus = (inputType: 'search' | 'location') => {
    setFocusedInput(inputType);
    if (inputType === 'search') {
      setShowSuggestions(true);
      setShowLocationSuggestions(false);
    } else {
      setShowLocationSuggestions(true);
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Find Doctors & Book Appointments</h2>
      
      <form onSubmit={handleSearch} className="relative">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => handleInputFocus('search')}
              placeholder="Search doctors, specialties, conditions, symptoms..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Recent Searches
                    </h3>
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.query);
                          setShowSuggestions(false);
                        }}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-gray-100 rounded"
                      >
                        <FaHistory className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{item.query}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Doctors */}
                {doctors.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Doctors
                    </h3>
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleSuggestionClick(doctor)}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-gray-100 rounded"
                      >
                        <span className="text-sm text-gray-700">{doctor.text}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Specialties */}
                {specialties.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Specialties
                    </h3>
                    {specialties.map((specialty) => (
                      <button
                        key={specialty.id}
                        onClick={() => handleSuggestionClick(specialty)}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-gray-100 rounded"
                      >
                        <FaMicroscope className="text-teal-500 mr-2" />
                        <span className="text-sm text-gray-700">{specialty.text}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Conditions */}
                {conditions.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Conditions
                    </h3>
                    {conditions.map((condition) => (
                      <button
                        key={condition.id}
                        onClick={() => handleSuggestionClick(condition)}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-gray-100 rounded"
                      >
                        <FaHeartbeat className="text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">{condition.text}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Symptoms */}
                {symptoms.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Symptoms
                    </h3>
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => handleSuggestionClick(symptom)}
                        className="flex items-center w-full px-2 py-1.5 text-left hover:bg-gray-100 rounded"
                      >
                        <FaGhost className="text-purple-500 mr-2" />
                        <span className="text-sm text-gray-700">{symptom.text}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Popular Searches */}
                {popularSearches.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 px-2">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-1 px-2">
                      {popularSearches.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSuggestionClick(item)}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Location Input */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onFocus={() => handleInputFocus('location')}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            
            {userLocation && (
              <button
                type="button"
                onClick={() => setLocationQuery(`${userLocation.city}, ${userLocation.state}`)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-600 hover:text-teal-800"
              >
                <FaExchangeAlt className="h-4 w-4" />
              </button>
            )}
            
            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {/* Use current location */}
                {userLocation && (
                  <button
                    onClick={() => {
                      setLocationQuery(`${userLocation.city}, ${userLocation.state}`);
                      setShowLocationSuggestions(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    <FaMapMarkerAlt className="text-teal-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      Current Location: {userLocation.city}, {userLocation.state}
                    </span>
                  </button>
                )}
                
                {/* Previous Locations */}
                {locations.length > 0 && (
                  <>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-2 mb-1 px-3">
                      Recent Locations
                    </h3>
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSuggestionClick(location)}
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
                      >
                        <FaMapMarkerAlt className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{location.text}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Search Button */}
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-md transition-colors duration-200 text-base font-medium"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Quick Select Options */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Select:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSearchQuery('General Physician');
              handleSearch();
            }}
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
          >
            General Physician
          </button>
          <button
            onClick={() => {
              setSearchQuery('Dentist');
              handleSearch();
            }}
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
          >
            Dentist
          </button>
          <button
            onClick={() => {
              setSearchQuery('Gynecologist');
              handleSearch();
            }}
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
          >
            Gynecologist
          </button>
          <button
            onClick={() => {
              setSearchQuery('Pediatrician');
              handleSearch();
            }}
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
          >
            Pediatrician
          </button>
          <button
            onClick={() => {
              setSearchQuery('Dermatologist');
              handleSearch();
            }}
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm hover:bg-teal-100 transition-colors"
          >
            Dermatologist
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch; 