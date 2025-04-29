'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EnhancedDoctorCard from './EnhancedDoctorCard';
import { FaSortAmountDown, FaFilter, FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Doctor {
  id: string;
  name: string;
  imageUrl: string;
  qualifications: string;
  specializations: string[];
  experience: number;
  clinicName: string;
  clinicLocation: string;
  clinicDistance?: number;
  consultationFeeClinic: number;
  consultationFeeOnline: number;
  availability: {
    nextAvailable: string;
    slots: {
      date: string;
      available: boolean;
      times: string[];
    }[];
  };
  rating: number;
  reviewCount: number;
  isGuruProgram: boolean;
  services: string[];
  languages: string[];
  insuranceAccepted: string[];
  conditions: string[];
  awards: string[];
  recommendations: number;
}

interface SearchResultsProps {
  doctors: Doctor[];
  totalResults: number;
  isLoading?: boolean;
  onSortChange?: (sortBy: string) => void;
  onPageChange?: (page: number) => void;
  onFavoriteToggle?: (doctorId: string) => void;
  favoriteDoctors?: string[];
  currentPage?: number;
  totalPages?: number;
  resultsPerPage?: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  doctors = [],
  totalResults = 0,
  isLoading = false,
  onSortChange,
  onPageChange,
  onFavoriteToggle,
  favoriteDoctors = [],
  currentPage = 1,
  totalPages = 1,
  resultsPerPage = 10
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    
    if (onSortChange) {
      onSortChange(newSortBy);
    } else {
      // Update URL with new sort parameter
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('sort', newSortBy);
      router.push(`/doctors?${params.toString()}`);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Update URL with new page parameter
      const params = new URLSearchParams(searchParams?.toString() || '');
      params.set('page', page.toString());
      router.push(`/doctors?${params.toString()}`);
    }
  };
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(1);
    
    // Calculate range to show around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range if at the beginning or end
    if (currentPage <= 3) {
      rangeEnd = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      rangeStart = Math.max(2, totalPages - 4);
    }
    
    // Add ellipsis if needed before range
    if (rangeStart > 2) {
      items.push('...');
    }
    
    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(i);
    }
    
    // Add ellipsis if needed after range
    if (rangeEnd < totalPages - 1) {
      items.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };
  
  return (
    <div className="w-full">
      {/* Results Header */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2 text-medical-teal-500" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span className="text-medical-teal-600 font-bold mr-2">{totalResults}</span>
                  <span>Doctors Found</span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchParams?.get('query') && (
                <>
                  <span className="inline-flex items-center bg-medical-teal-50 text-medical-teal-700 px-2 py-1 rounded-md text-xs font-medium">
                    <FaSearch className="mr-1 text-xs" />
                    {searchParams.get('query')}
                  </span>
                </>
              )}
              {searchParams?.get('location') && (
                <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium ml-2">
                  <FaFilter className="mr-1 text-xs" />
                  {searchParams.get('location')}
                </span>
              )}
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            className="md:hidden mt-3 sm:mt-0 px-3 py-2 bg-medical-teal-50 text-medical-teal-700 rounded-md flex items-center text-sm font-medium hover:bg-medical-teal-100 transition-colors"
            onClick={() => setShowMobileFilters(true)}
          >
            <FaFilter className="mr-1.5" />
            Filters
          </button>
          
          {/* Sort Options */}
          <div className="mt-3 sm:mt-0 w-full sm:w-auto">
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <FaSortAmountDown className="text-medical-teal-500 mr-2" />
              <span className="text-sm text-gray-700 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border-0 focus:ring-0 text-gray-700 font-medium cursor-pointer bg-transparent pl-1 pr-8 py-0 appearance-none focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="experience-high">Experience: High to Low</option>
                <option value="experience-low">Experience: Low to High</option>
                <option value="fee-low">Fee: Low to High</option>
                <option value="fee-high">Fee: High to Low</option>
                <option value="availability">Earliest Available</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Applied Filters */}
      {searchParams && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-2">
            {searchParams.get('query') && (
              <button 
                className="inline-flex items-center bg-medical-teal-50 hover:bg-medical-teal-100 text-medical-teal-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('query');
                  router.push(`/doctors?${params.toString()}`);
                }}
              >
                Search: {searchParams.get('query')} 
                <FaTimes className="ml-2 text-xs" />
              </button>
            )}
            
            {searchParams.get('location') && (
              <button 
                className="inline-flex items-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('location');
                  router.push(`/doctors?${params.toString()}`);
                }}
              >
                Location: {searchParams.get('location')} 
                <FaTimes className="ml-2 text-xs" />
              </button>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <motion.div 
          className="flex flex-col justify-center items-center py-20 bg-white rounded-xl shadow-md border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-medical-teal-100 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-medical-teal-500 animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Finding the best doctors for you...</p>
        </motion.div>
      )}
      
      {/* No Results */}
      {!isLoading && doctors.length === 0 && (
        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-20 h-20 mx-auto bg-medical-teal-50 rounded-full flex items-center justify-center mb-6">
            <FaSearch className="text-medical-teal-400 text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">No doctors found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We couldn't find any doctors matching your search criteria. Try adjusting your filters or search for a different specialty.
          </p>
          <button
            onClick={() => router.push('/doctors')}
            className="px-5 py-2.5 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors shadow-sm font-medium"
          >
            Reset Search
          </button>
        </motion.div>
      )}
      
      {/* Results List */}
      {!isLoading && doctors.length > 0 && (
        <div className="space-y-5">
          {doctors.map((doctor, index) => (
            <motion.div 
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <EnhancedDoctorCard
                doctor={doctor}
                onFavorite={onFavoriteToggle}
                isFavorite={favoriteDoctors.includes(doctor.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <nav className="flex items-center bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md mr-1 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-medical-teal-600 hover:bg-medical-teal-50'
              } font-medium flex items-center`}
            >
              <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
            
            <div className="flex">
              {getPaginationItems().map((item, index) => (
                <React.Fragment key={index}>
                  {item === '...' ? (
                    <span className="px-3 py-1 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => typeof item === 'number' && handlePageChange(item)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full mx-0.5 ${
                        currentPage === item
                          ? 'bg-medical-teal-600 text-white font-bold'
                          : 'text-gray-700 hover:bg-medical-teal-50 font-medium'
                      }`}
                    >
                      {item}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ml-1 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-medical-teal-600 hover:bg-medical-teal-50'
              } font-medium flex items-center`}
            >
              Next
              <svg className="h-5 w-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults; 