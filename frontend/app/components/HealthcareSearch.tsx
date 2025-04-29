'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaClinicMedical, FaUserMd, FaHospital, FaSyringe, FaFlask, FaPills } from 'react-icons/fa';
import { BiBody } from 'react-icons/bi';

// API endpoint for doctor search
const SEARCH_API_ENDPOINT = '/api/search';
const LOCATION_API_ENDPOINT = '/api/locations';

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

export default function HealthcareSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<{text: string, type: string}[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

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
      setIsLoading(true);

      // Simulated API call - in production this would be a real fetch to SEARCH_API_ENDPOINT
      const fetchSuggestions = async () => {
        try {
          // In a real implementation, this would be:
          // const response = await fetch(`${SEARCH_API_ENDPOINT}/suggestions?query=${encodeURIComponent(query)}`);
          // const data = await response.json();
          
          // For now, we'll simulate the API response with our local data
          // Determine search category from query or default to service
          let searchTerms = SEARCH_TERMS.map(text => ({ 
            text, 
            type: text.toLowerCase().includes('test') || text.toLowerCase().includes('scan') || text.toLowerCase().includes('x-ray') ? 'test' :
                  text.toLowerCase().includes('medicine') || text.toLowerCase().includes('prescription') ? 'pharmacy' :
                  text.toLowerCase().includes('vaccination') || text.toLowerCase().includes('vaccine') ? 'vaccine' : 'doctor'
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
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      };

      // Add a small delay to prevent excessive API calls while typing
      const timeoutId = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, selectedConditions, searchFocused]);

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
    setIsLoading(true);
    
    if (!query.trim() && selectedConditions.length === 0 && !location.trim()) {
      console.log('Please enter a search term, condition, or location');
      setIsLoading(false);
      return;
    }
    
    // In a real implementation, we would call the search API here
    // const searchData = await fetch(`${SEARCH_API_ENDPOINT}?query=${query}&location=${location}&conditions=${selectedConditions.join(',')}`)
    
    // Build the query string
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    if (selectedConditions.length > 0) params.append('conditions', selectedConditions.join(','));
    
    // Get the appropriate search path
    const searchPath = getSearchPath(query);
    
    // Navigate to the search results page
    const queryString = params.toString();
    
    // Slight delay to simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push(`${searchPath}?${queryString}`);
    }, 500);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-medical-teal-200 overflow-hidden transition-all duration-300">
      <div className="p-5 sm:p-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          {/* Search input with autocomplete */}
          <div className="relative" ref={searchRef}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            
            <div className={`flex flex-wrap gap-2 pl-11 pr-4 py-3 w-full border ${searchFocused ? 'border-medical-teal-600 ring-2 ring-medical-teal-200/50' : 'border-gray-200'} bg-white rounded-lg min-h-[52px] transition-all duration-200 shadow-inner`}>
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
                placeholder={selectedConditions.length ? "" : "Search for healthcare services..."}
                className="flex-grow outline-none min-w-[60px] bg-transparent text-gray-800 placeholder-gray-400 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true);
                  setShowSuggestions(filteredSuggestions.length > 0);
                }}
                style={{ caretColor: '#155e75' }} // Ensures the cursor is visible
              />
            </div>
            
            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-medical-teal-100 rounded-lg shadow-xl max-h-72 overflow-auto">
                <div className="px-4 py-2.5 text-xs font-semibold text-medical-teal-700 border-b border-medical-teal-50 bg-medical-teal-50/60">
                  Suggestions
                </div>
                {isLoading ? (
                  <div className="px-4 py-8 flex justify-center">
                    <div className="w-6 h-6 border-2 border-medical-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredSuggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No matches found. Try a different search term.
                  </div>
                ) : (
                  filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.text}-${index}`}
                      className="px-4 py-3 hover:bg-medical-teal-50 cursor-pointer flex items-center transition-colors duration-150"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="mr-3 text-lg flex-shrink-0">
                        {CATEGORY_ICONS[suggestion.type] || <FaUserMd className="text-medical-teal-600" />}
                      </div>
                      <span className="text-gray-800 font-medium">{suggestion.text}</span>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {suggestion.type === 'condition' ? 'Condition' : 
                         suggestion.type === 'test' ? 'Lab Test' :
                         suggestion.type === 'pharmacy' ? 'Medication' :
                         suggestion.type === 'vaccine' ? 'Vaccine' :
                         'Provider/Specialty'}
                      </span>
                    </div>
                  ))
                )}
                <div className="px-4 py-2.5 text-xs text-gray-500 border-t border-gray-100 bg-gray-50">
                  {selectedConditions.length > 0 
                    ? "You can select multiple conditions" 
                    : "Search by specialty, location, or doctor's name"}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4 flex gap-4 flex-col md:flex-row">
            {/* Location input - using the current location */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-medical-teal-600" />
              </div>
              <div className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg flex items-center text-sm bg-white shadow-inner min-h-[48px]">
                {location ? (
                  <div className="text-gray-800">{location}</div>
                ) : (
                  <div className="text-gray-400">Using your current location</div>
                )}
              </div>
            </div>

            {/* Enhanced search button with teal theme */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group disabled:opacity-70"
            >
              <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30" style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)" }}></span>
              <span className="flex items-center relative">
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : (
                  <FaSearch className="mr-2" />
                )}
                <span className="whitespace-nowrap">Find Services</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 