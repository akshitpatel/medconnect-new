'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaMapMarkerAlt, FaStethoscope, FaHome, FaCalendarAlt, FaDollarSign, FaFilter, FaHospital, FaChevronDown } from 'react-icons/fa';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

// Define the doctor interface
interface Doctor {
  _id: string;
  fullName: string;
  specialization: string;
  qualifications: string;
  experience: number;
  rating: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  services: string[];
  homeVisit: boolean;
  availableDays: string[];
  appointmentFee: number;
  phone: string;
  email: string;
  affiliatedHospitals: string[];
  bio: string;
  image: string;
}

// Define pagination interface
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function DoctorSearchResults() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showHomeVisitOnly, setShowHomeVisitOnly] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  
  // Get search parameters
  const query = searchParams.get('query') || '';
  const specialization = searchParams.get('specialization') || '';
  const services = searchParams.get('services') || '';
  const homeVisit = searchParams.get('homeVisit') === 'true';
  const page = parseInt(searchParams.get('page') || '1');
  
  // Get location from localStorage
  const [userLocation, setUserLocation] = useState('');
  
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);
  
  // Fetch doctors based on search parameters
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Build query string
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (userLocation) params.append('location', userLocation);
        if (specialization) params.append('specialization', specialization);
        if (services) params.append('services', services);
        if (homeVisit) params.append('homeVisit', 'true');
        params.append('page', page.toString());
        params.append('limit', '10');
        
        // Filter by selected specialties
        if (selectedSpecialties.length > 0) {
          params.append('specialties', selectedSpecialties.join(','));
        }
        
        // Filter by selected services
        if (selectedServices.length > 0) {
          params.append('services', selectedServices.join(','));
        }
        
        // Filter by price range
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
        
        // Filter by home visit
        if (showHomeVisitOnly) {
          params.append('homeVisit', 'true');
        }
        
        // Filter by available today
        if (availableToday) {
          params.append('availableToday', 'true');
        }
        
        // Sort option
        params.append('sort', sortOption);
        
        console.log('Fetching doctors with params:', params.toString());
        
        // Fetch data from API
        const response = await fetch(`/api/doctors?${params.toString()}`);
        const data = await response.json();
        
        console.log('API response:', data);
        
        if (data.status === 'success') {
          setDoctors(data.data.doctors);
          setPagination(data.data.pagination);
        } else {
          setError('Failed to fetch doctors. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('An error occurred while fetching doctors.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [query, userLocation, specialization, services, homeVisit, page, selectedSpecialties, selectedServices, priceRange, showHomeVisitOnly, availableToday, sortOption]);
  
  // Generate pagination links
  const paginationLinks = () => {
    const links = [];
    const maxPages = Math.min(pagination.pages, 5);
    let startPage = Math.max(1, pagination.page - 2);
    let endPage = Math.min(pagination.pages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <Link
          key={i}
          href={`/doctors/search?${new URLSearchParams({
            ...(query ? { query } : {}),
            ...(specialization ? { specialization } : {}),
            ...(services ? { services } : {}),
            ...(homeVisit ? { homeVisit: 'true' } : {}),
            page: i.toString()
          })}`}
          className={`px-3 py-1.5 rounded-md ${
            i === pagination.page
              ? 'bg-medical-teal-600 text-white'
              : 'bg-white border border-gray-300 text-medical-teal-700 hover:bg-medical-teal-50'
          } font-medium transition-colors`}
        >
          {i}
        </Link>
      );
    }
    
    return links;
  };
  
  // Available specialties (for filter)
  const specialties = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 
    'Orthopedist', 'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
    'Psychiatrist', 'Dentist', 'Urologist', 'Endocrinologist'
  ];
  
  // Available services (for filter)
  const availableServices = [
    'Consultation', 'Surgery', 'Telemedicine', 'Emergency Care',
    'Home Visit', 'Follow-up', 'Preventive Care', 'Lab Test Interpretation'
  ];
  
  // Handle specialty selection
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty) 
        : [...prev, specialty]
    );
  };
  
  // Handle service selection
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };
  
  // Handles price range changes
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <EnhancedNavbar />
      
      {/* Search Results Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="bg-gradient-to-r from-medical-teal-700 to-medical-teal-900 rounded-xl p-6 shadow-lg text-white mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <FaStethoscope className="mr-2" /> Doctor Search Results
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {query && (
                    <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium mr-1">Search:</span> {query}
                    </div>
                  )}
                  {userLocation && (
                    <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                      <FaMapMarkerAlt className="mr-1" /> {userLocation}
                    </div>
                  )}
                  {specialization && (
                    <div className="flex items-center bg-white/10 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium mr-1">Specialty:</span> {specialization}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-lg font-semibold bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
          {pagination.total} {pagination.total === 1 ? 'Doctor' : 'Doctors'} Found
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Column */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-card-soft border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h2 className="font-bold text-gray-900 flex items-center">
                    <FaFilter className="mr-2 text-medical-teal-600" /> Filters
                  </h2>
        <button
                    className="text-sm text-medical-teal-600 hover:text-medical-teal-800 transition-colors"
                    onClick={() => {
                      setSelectedSpecialties([]);
                      setSelectedServices([]);
                      setPriceRange([0, 500]);
                      setShowHomeVisitOnly(false);
                      setAvailableToday(false);
                      setSortOption('recommended');
                    }}
                  >
                    Clear All
        </button>
      </div>
      
                {/* Filter sections */}
                <div className="p-4 space-y-6">
                  {/* Specialties */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">Specialties</h3>
                      <button
                        className="text-xs text-medical-teal-600"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        {showFilters ? "Show Less" : "Show All"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {specialties.slice(0, showFilters ? specialties.length : 5).map((specialty, idx) => (
                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                            checked={selectedSpecialties.includes(specialty)}
                            onChange={() => toggleSpecialty(specialty)}
                          />
                          <span className="text-sm text-gray-700">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
            <div>
                    <h3 className="font-medium text-gray-900 mb-2">Consultation Fee</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-full">
              <input
                          type="range"
                          min="0"
                          max="500"
                          step="10"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-medical-teal-600"
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
            </div>
            
                  {/* Services */}
            <div>
                    <h3 className="font-medium text-gray-900 mb-2">Services</h3>
                    <div className="space-y-2">
                      {availableServices.slice(0, 5).map((service, idx) => (
                        <label key={idx} className="flex items-center space-x-2 cursor-pointer">
              <input
                            type="checkbox"
                            className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                            checked={selectedServices.includes(service)}
                            onChange={() => toggleService(service)}
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
            </div>
            
                  {/* Additional Filters */}
            <div>
                    <h3 className="font-medium text-gray-900 mb-2">Additional Filters</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={showHomeVisitOnly}
                          onChange={() => setShowHomeVisitOnly(!showHomeVisitOnly)}
                        />
                        <span className="text-sm text-gray-700">Home Visit Available</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
              <input
                          type="checkbox"
                          className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={availableToday}
                          onChange={() => setAvailableToday(!availableToday)}
                        />
                        <span className="text-sm text-gray-700">Available Today</span>
                      </label>
            </div>
          </div>
          
                  {/* Sort Options */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                    <select
                      className="w-full rounded-lg border-gray-300 focus:ring-medical-teal-500 focus:border-medical-teal-500 text-sm"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="experience">Most Experienced</option>
                    </select>
                  </div>
                  
                  {/* Apply Filters Button (Mobile only) */}
                  <div className="pt-2 lg:hidden">
                    <button className="w-full py-2 bg-medical-teal-600 hover:bg-medical-teal-700 text-white rounded-lg transition-colors shadow-sm">
              Apply Filters
            </button>
          </div>
        </div>
              </div>
            </div>
            
            {/* Results Column */}
            <div className="lg:w-3/4">
              {/* Loading state */}
              {loading && doctors.length === 0 && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-teal-500"></div>
                </div>
              )}
              
              {/* Error state */}
              {error && doctors.length === 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {/* Doctor Cards */}
      <div className="space-y-6">
        {doctors.map((doctor) => (
                  <div 
                    key={doctor._id} 
                    className="bg-white rounded-xl shadow-card-soft hover:shadow-card-hover overflow-hidden border border-gray-100 transition-all duration-300"
                  >
            <div className="md:flex">
              {/* Doctor image */}
              <div className="md:w-1/4 p-4 flex justify-center">
                <div className="relative h-48 w-48 md:h-full md:w-full max-w-[200px]">
                  <Image
                    src={doctor.image || '/placeholder-doctor.jpg'}
                    alt={doctor.fullName}
                    fill
                            className="object-cover rounded-lg border-2 border-medical-teal-100"
                  />
                </div>
              </div>
              
              {/* Doctor info */}
              <div className="md:w-3/4 p-4">
                <div className="flex justify-between items-start">
                  <div>
                            <h2 className="text-xl font-bold text-gray-800 hover:text-medical-teal-700 transition-colors">{doctor.fullName}</h2>
                            <p className="text-medical-teal-700 font-medium">{doctor.specialization}</p>
                    <p className="text-gray-600 text-sm">{doctor.qualifications}</p>
                  </div>
                  
                  <div className="flex items-center">
                            <div className="flex items-center bg-medical-teal-50 text-medical-teal-700 px-3 py-1.5 rounded-full">
                              <FaStar className="text-yellow-500 mr-1.5" />
                              <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-1.5 text-medical-teal-600" />
                    <span>{doctor.address.city}, {doctor.address.state}</span>
                  </div>
                  
                          <div className="flex items-center">
                            <FaStethoscope className="mr-1.5 text-medical-teal-600" />
                            <span>{doctor.experience} years exp.</span>
                  </div>
                  
                          {doctor.homeVisit && (
                            <div className="flex items-center">
                              <FaHome className="mr-1.5 text-medical-teal-600" />
                              <span>Home visits</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-1.5 text-medical-teal-600" />
                            <span>{doctor.availableDays.slice(0, 3).join(', ')}{doctor.availableDays.length > 3 ? '...' : ''}</span>
                  </div>
                  
                          <div className="flex items-center">
                            <FaDollarSign className="mr-1.5 text-medical-teal-600" />
                            <span>${doctor.appointmentFee}</span>
                  </div>
                </div>
                
                        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <p>{doctor.bio.length > 150 ? `${doctor.bio.substring(0, 150)}...` : doctor.bio}</p>
                  </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {doctor.services.slice(0, 4).map((service, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-medical-teal-100 text-medical-teal-800"
                            >
                        {service}
                      </span>
                    ))}
                          {doctor.services.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{doctor.services.length - 4} more
                      </span>
                    )}
                  </div>
                        
                        {/* Affiliated Hospital */}
                        {doctor.affiliatedHospitals && doctor.affiliatedHospitals.length > 0 && (
                          <div className="mt-4 flex items-center text-sm text-gray-600">
                            <FaHospital className="mr-1.5 text-medical-teal-600" />
                            <span>Affiliated: {doctor.affiliatedHospitals[0]}{doctor.affiliatedHospitals.length > 1 ? ` + ${doctor.affiliatedHospitals.length - 1} more` : ''}</span>
                </div>
                        )}
                
                        <div className="mt-4 flex justify-end gap-3">
                  <Link
                    href={`/doctors/${doctor._id}`}
                            className="px-4 py-2 bg-white border border-medical-teal-300 text-medical-teal-700 rounded-lg hover:bg-medical-teal-50 transition-colors"
                  >
                    View Profile
                  </Link>
                          <Link
                            href={`/appointments/book?doctorId=${doctor._id}`}
                            className="px-4 py-2 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors shadow-sm"
                          >
                            Book Appointment
                          </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
              
              {/* No results */}
              {!loading && doctors.length === 0 && !error && (
                <div className="bg-white rounded-lg shadow-card-soft p-8 text-center">
                  <div className="text-medical-teal-500 mb-4">
                    <FaStethoscope className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Doctors Found</h3>
                  <p className="text-gray-600 mb-4">We couldn't find any doctors matching your search criteria.</p>
                  <Link 
                    href="/doctors"
                    className="px-4 py-2 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors shadow-sm"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}
      
      {/* Pagination */}
      {pagination.pages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
          {pagination.page > 1 && (
            <Link
              href={`/doctors/search?${new URLSearchParams({
                ...(query ? { query } : {}),
                ...(specialization ? { specialization } : {}),
                ...(services ? { services } : {}),
                ...(homeVisit ? { homeVisit: 'true' } : {}),
                page: (pagination.page - 1).toString()
              })}`}
                        className="px-3 py-1.5 rounded-md bg-white border border-gray-300 text-medical-teal-700 hover:bg-medical-teal-50 font-medium transition-colors"
            >
              Previous
            </Link>
          )}
          
          {paginationLinks()}
          
          {pagination.page < pagination.pages && (
            <Link
              href={`/doctors/search?${new URLSearchParams({
                ...(query ? { query } : {}),
                ...(specialization ? { specialization } : {}),
                ...(services ? { services } : {}),
                ...(homeVisit ? { homeVisit: 'true' } : {}),
                page: (pagination.page + 1).toString()
              })}`}
                        className="px-3 py-1.5 rounded-md bg-white border border-gray-300 text-medical-teal-700 hover:bg-medical-teal-50 font-medium transition-colors"
            >
              Next
            </Link>
          )}
                  </div>
        </div>
      )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <EnhancedFooter />
    </div>
  );
} 