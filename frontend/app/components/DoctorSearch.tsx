"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaClinicMedical, FaUserMd, FaHospital, FaSyringe, FaFlask, FaPills } from 'react-icons/fa';
import { BiBody } from 'react-icons/bi';
import Script from 'next/script';

// Define combined search terms for autocomplete (specializations and services)
const SEARCH_TERMS = [
  // Specializations
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Ophthalmologist',
  'Psychiatrist',
  'Gynecologist',
  'Oncologist',
  'General Physician',
  'Urologist',
  'Endocrinologist',
  // Common services
  'Consultation',
  'Check-up',
  'Surgery',
  'Telemedicine',
  'Emergency Care',
  'Follow-up',
  'Lab Test',
  'Home Visit',
  'Preventive Care',
  'Chronic Disease Management',
  'Wellness Screening',
  // Lab Tests
  'Blood Test',
  'Urinalysis',
  'X-Ray',
  'MRI Scan',
  'CT Scan',
  'Ultrasound',
  'ECG/EKG',
  'Colonoscopy',
  // Medications & Pharmacy
  'Prescription Refill',
  'Over-the-counter Medicine',
  'Vaccination',
  'Medical Supplies'
];

// Common health conditions
const HEALTH_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Arthritis',
  'Asthma',
  'Migraine',
  'Depression',
  'Anxiety',
  'Thyroid Disorders',
  'Heart Disease',
  'Back Pain',
  'Allergies',
  'Skin Conditions'
];

// Category icons mapping
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  service: <FaUserMd className="text-medical-teal-600" />,
  doctor: <FaUserMd className="text-medical-teal-600" />,
  condition: <BiBody className="text-medical-teal-700" />,
  hospital: <FaHospital className="text-medical-teal-700" />,
  clinic: <FaClinicMedical className="text-medical-teal-500" />,
  test: <FaFlask className="text-medical-teal-600" />,
  pharmacy: <FaPills className="text-medical-teal-500" />,
  vaccine: <FaSyringe className="text-medical-teal-600" />
};

declare global {
  interface Window {
    initAutocomplete: () => void;
    google: any;
  }
}

export default function HealthcareSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<{text: string, type: string}[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);

  // On component mount, check for location in localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // Set up a listener for location changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        setLocation(savedLocation);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for location changes from the navbar
    const handleLocationUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.location) {
        setLocation(e.detail.location);
      }
    };
    
    window.addEventListener('locationChanged' as any, handleLocationUpdate as any);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('locationChanged' as any, handleLocationUpdate as any);
    };
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (query) {
      // Determine search category from query or default to service
      let searchTerms = SEARCH_TERMS.map(text => ({ 
        text, 
        type: text.includes('Test') || text.includes('Scan') || text.includes('X-Ray') ? 'test' :
              text.includes('Medicine') || text.includes('Prescription') ? 'pharmacy' :
              text.includes('Vaccination') || text.includes('Vaccine') ? 'vaccine' : 'doctor'
      }));
      
      // Search in terms
      const termMatches = searchTerms
        .filter(term => term.text.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4);
      
      // Search in conditions
      const conditionMatches = HEALTH_CONDITIONS
        .filter(condition => 
          condition.toLowerCase().includes(query.toLowerCase()) && 
          !selectedConditions.includes(condition)
        )
        .map(text => ({ text, type: 'condition' }))
        .slice(0, 3);
      
      // Combine and limit results
      const combined = [...termMatches, ...conditionMatches];
      setFilteredSuggestions(combined);
      setShowSuggestions(combined.length > 0 && searchFocused);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, selectedConditions, searchFocused]);

  // Initialize Google Places autocomplete
  useEffect(() => {
    if (placesLoaded && locationInputRef.current) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['(cities)'],
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setLocation(place.formatted_address);
            console.log('Selected place:', place);
          }
        });
        
        console.log('Google Places Autocomplete initialized');
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }
  }, [placesLoaded, locationInputRef.current]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSearchFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle Google Maps script load
  const handleGoogleMapsLoaded = () => {
    setPlacesLoaded(true);
    console.log('Google Maps script loaded');
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: {text: string, type: string}) => {
    if (suggestion.type === 'condition') {
      // Add to selected conditions
      setSelectedConditions([...selectedConditions, suggestion.text]);
      setQuery('');
    } else {
      // Set as main search term
      setQuery(suggestion.text);
    }
    setShowSuggestions(false);
  };

  // Remove a selected condition
  const removeCondition = (condition: string) => {
    setSelectedConditions(selectedConditions.filter(c => c !== condition));
  };

  // Determine the search path based on query content
  const getSearchPath = (query: string) => {
    if (query.toLowerCase().includes('test') || query.toLowerCase().includes('scan') || 
        query.toLowerCase().includes('x-ray') || query.toLowerCase().includes('lab')) {
      return '/lab-tests/search';
    } else if (query.toLowerCase().includes('medicine') || query.toLowerCase().includes('drug') || 
               query.toLowerCase().includes('pill') || query.toLowerCase().includes('prescription')) {
      return '/pharmacy/search';
    } else {
      return '/doctors/search';
    }
  };

  // Create a function to handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() && selectedConditions.length === 0 && !location.trim()) {
      console.log('Please enter a search term, condition, or location');
      return;
    }
    
    // Build the query string
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    if (selectedConditions.length > 0) params.append('conditions', selectedConditions.join(','));
    
    // Get the appropriate search path
    const searchPath = getSearchPath(query);
    
    // Navigate to the search results page
    const queryString = params.toString();
    router.push(`${searchPath}?${queryString}`);
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`}
        onLoad={handleGoogleMapsLoaded}
      />
      
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-medical-blue-100 overflow-hidden transition-all duration-300">
        <div className="p-5">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            {/* Search input with autocomplete */}
            <div className="relative" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-medical-blue-500" />
              </div>
              
              <div className={`flex flex-wrap gap-2 pl-11 pr-4 py-3 w-full border ${searchFocused ? 'border-medical-blue-500 ring-2 ring-medical-blue-100' : 'border-gray-200'} bg-white rounded-lg min-h-[48px] transition-all duration-200`}>
                {/* Show selected conditions as tags */}
                {selectedConditions.map(condition => (
                  <span 
                    key={condition}
                    className="bg-medical-teal-50 text-medical-teal-700 text-xs px-3 py-1.5 rounded-full flex items-center font-medium transition-all duration-200 hover:bg-medical-teal-100"
                  >
                    {condition}
                    <button 
                      type="button"
                      onClick={() => removeCondition(condition)}
                      className="ml-2 text-medical-teal-500 hover:text-medical-teal-700 transition-colors"
                      aria-label={`Remove ${condition}`}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  placeholder={selectedConditions.length ? "" : "Search for healthcare services, providers, medications..."}
                  className="flex-grow outline-none min-w-[60px] bg-transparent text-gray-800 placeholder-gray-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowSuggestions(filteredSuggestions.length > 0);
                  }}
                />
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-auto">
                  <div className="px-4 py-2.5 text-xs font-semibold text-medical-blue-700 border-b border-gray-100 bg-medical-blue-50">
                    Suggestions
                  </div>
                  {filteredSuggestions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No matches found. Try a different search term.
                    </div>
                  ) : (
                    filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={`${suggestion.text}-${index}`}
                        className="px-4 py-3 hover:bg-medical-blue-50 cursor-pointer flex items-center transition-colors duration-150"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div className="mr-3 text-lg">
                          {CATEGORY_ICONS[suggestion.type] || <FaUserMd className="text-medical-teal-600" />}
                        </div>
                        <span className="text-gray-800 font-medium">{suggestion.text}</span>
                        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {suggestion.type === 'condition' ? 'Condition' : 
                           suggestion.type === 'test' ? 'Lab Test' :
                           suggestion.type === 'pharmacy' ? 'Medication' :
                           suggestion.type === 'vaccine' ? 'Vaccine' :
                           'Provider/Service'}
                        </span>
                      </div>
                    ))
                  )}
                  <div className="px-4 py-2.5 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
                    {selectedConditions.length > 0 
                      ? "You can select multiple conditions" 
                      : "Type to search, click to select"}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex gap-4 flex-col md:flex-row">
              {/* Location input with Google Places */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-medical-teal-600" />
                </div>
                <input
                  type="text"
                  ref={locationInputRef}
                  placeholder="Enter city, state or zip code"
                  className={`w-full pl-11 pr-4 py-3 border ${locationFocused ? 'border-medical-teal-500 ring-2 ring-medical-teal-100' : 'border-gray-200'} rounded-lg transition-all duration-200 focus:outline-none`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </div>

              {/* Enhanced search button with teal theme */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)" }}></span>
                <span className="flex items-center relative">
                  <FaSearch className="mr-2" />
                  <span className="whitespace-nowrap">Find Healthcare Services</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 