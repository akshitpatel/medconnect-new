'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Link as LinkIcon,
  User,
  Star,
  Filter,
  ChevronDown,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Department {
  id: string;
  name: string;
}

interface HospitalAffiliation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  image?: string;
  departments: Department[];
  isAffiliated: boolean;
  isPrimary: boolean;
  rating: number;
  admittingPrivileges: boolean;
  lastVisit?: Date;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalAffiliation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);

  // Load mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock hospitals data
        const mockHospitals: HospitalAffiliation[] = [
          {
            id: 'hosp1',
            name: 'Memorial General Hospital',
            address: '123 Healthcare Ave',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94110',
            phone: '(415) 555-1234',
            email: 'info@memorialgeneral.org',
            website: 'https://www.memorialgeneral.org',
            image: '/images/hospitals/memorial-general.jpg',
            departments: [
              { id: 'dep1', name: 'Cardiology' },
              { id: 'dep2', name: 'Neurology' },
              { id: 'dep3', name: 'Oncology' }
            ],
            isAffiliated: true,
            isPrimary: true,
            rating: 4.8,
            admittingPrivileges: true,
            lastVisit: new Date(2023, 8, 15)
          },
          {
            id: 'hosp2',
            name: 'City Medical Center',
            address: '456 Health Blvd',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94112',
            phone: '(415) 555-2345',
            email: 'contact@citymedical.org',
            website: 'https://www.citymedical.org',
            image: '/images/hospitals/city-medical.jpg',
            departments: [
              { id: 'dep4', name: 'Emergency Medicine' },
              { id: 'dep5', name: 'Surgery' },
              { id: 'dep6', name: 'Pediatrics' }
            ],
            isAffiliated: true,
            isPrimary: false,
            rating: 4.5,
            admittingPrivileges: true,
            lastVisit: new Date(2023, 7, 22)
          },
          {
            id: 'hosp3',
            name: 'University Medical Center',
            address: '789 Academic Way',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94118',
            phone: '(415) 555-3456',
            email: 'info@universitymedical.edu',
            website: 'https://www.universitymedical.edu',
            image: '/images/hospitals/university-medical.jpg',
            departments: [
              { id: 'dep7', name: 'Cardiology' },
              { id: 'dep8', name: 'Research' },
              { id: 'dep9', name: 'Psychiatry' }
            ],
            isAffiliated: true,
            isPrimary: false,
            rating: 4.7,
            admittingPrivileges: true,
            lastVisit: new Date(2023, 9, 5)
          },
          {
            id: 'hosp4',
            name: 'North Shore Hospital',
            address: '321 Coastal Hwy',
            city: 'Oakland',
            state: 'CA',
            zipCode: '94601',
            phone: '(510) 555-4567',
            email: 'contact@northshore.org',
            website: 'https://www.northshorehospital.org',
            image: '/images/hospitals/north-shore.jpg',
            departments: [
              { id: 'dep10', name: 'Orthopedics' },
              { id: 'dep11', name: 'Physical Therapy' }
            ],
            isAffiliated: false,
            isPrimary: false,
            rating: 4.2,
            admittingPrivileges: false
          },
          {
            id: 'hosp5',
            name: 'Valley Community Hospital',
            address: '567 Valley Road',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95123',
            phone: '(408) 555-5678',
            email: 'info@valleycommunity.org',
            website: 'https://www.valleycommunity.org',
            image: '/images/hospitals/valley-community.jpg',
            departments: [
              { id: 'dep12', name: 'Family Medicine' },
              { id: 'dep13', name: 'OB/GYN' },
              { id: 'dep14', name: 'Geriatrics' }
            ],
            isAffiliated: false,
            isPrimary: false,
            rating: 4.0,
            admittingPrivileges: false
          },
          {
            id: 'hosp6',
            name: 'Pacific Children\'s Hospital',
            address: '890 Pediatric Lane',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94115',
            phone: '(415) 555-6789',
            email: 'contact@pacificchildrens.org',
            website: 'https://www.pacificchildrens.org',
            image: '/images/hospitals/pacific-childrens.jpg',
            departments: [
              { id: 'dep15', name: 'Pediatric Cardiology' },
              { id: 'dep16', name: 'Neonatal ICU' },
              { id: 'dep17', name: 'Pediatric Oncology' }
            ],
            isAffiliated: true,
            isPrimary: false,
            rating: 4.9,
            admittingPrivileges: true,
            lastVisit: new Date(2023, 6, 10)
          }
        ];
        
        setHospitals(mockHospitals);
      } catch (error) {
        console.error('Error loading hospitals data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Never visited';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Format address
  const formatAddress = (hospital: HospitalAffiliation) => {
    return `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zipCode}`;
  };
  
  // Toggle hospital expanded view
  const toggleHospitalExpanded = (id: string) => {
    setExpandedHospital(expandedHospital === id ? null : id);
  };
  
  // Update affiliation status
  const toggleAffiliation = (id: string) => {
    setHospitals(prevHospitals => 
      prevHospitals.map(hospital => 
        hospital.id === id ? { ...hospital, isAffiliated: !hospital.isAffiliated } : hospital
      )
    );
  };
  
  // Set primary hospital
  const setPrimaryHospital = (id: string) => {
    setHospitals(prevHospitals => 
      prevHospitals.map(hospital => ({
        ...hospital,
        isPrimary: hospital.id === id
      }))
    );
  };
  
  // Delete hospital
  const deleteHospital = (id: string) => {
    if (window.confirm('Are you sure you want to remove this hospital from your list?')) {
      setHospitals(prevHospitals => prevHospitals.filter(hospital => hospital.id !== id));
    }
  };
  
  // Filter hospitals
  const filteredHospitals = hospitals.filter(hospital => {
    // Search filter
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'affiliated' && hospital.isAffiliated) ||
      (statusFilter === 'unaffiliated' && !hospital.isAffiliated) ||
      (statusFilter === 'primary' && hospital.isPrimary) ||
      (statusFilter === 'admitting' && hospital.admittingPrivileges);
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate stats
  const totalHospitals = hospitals.length;
  const affiliatedHospitals = hospitals.filter(h => h.isAffiliated).length;
  const admittingPrivileges = hospitals.filter(h => h.admittingPrivileges).length;
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-500 fill-current opacity-50" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />);
      }
    }
    
    return <div className="flex items-center">{stars}</div>;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Hospital Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your hospital affiliations and admitting privileges
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link 
            href="/provider/hospitals/add" 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hospital
          </Link>
          <Link 
            href="/provider/hospitals/credentials" 
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center"
          >
            <User className="h-4 w-4 mr-2" />
            My Credentials
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 mr-4">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Hospitals</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totalHospitals}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 mr-4">
              <LinkIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Affiliated With</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{affiliatedHospitals}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admitting Privileges</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{admittingPrivileges}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search hospitals by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Hospitals</option>
                <option value="affiliated">Affiliated Only</option>
                <option value="unaffiliated">Unaffiliated Only</option>
                <option value="primary">Primary Hospital</option>
                <option value="admitting">Admitting Privileges</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Hospitals List */}
      <div className="space-y-6">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map(hospital => (
            <div 
              key={hospital.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => toggleHospitalExpanded(hospital.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 w-full md:w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                    {hospital.image ? (
                      <Image 
                        src={hospital.image} 
                        alt={hospital.name} 
                        width={64} 
                        height={64} 
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {hospital.name}
                      </h3>
                      {hospital.isPrimary && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          Primary
                        </span>
                      )}
                      {hospital.isAffiliated && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          Affiliated
                        </span>
                      )}
                      {hospital.admittingPrivileges && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                          Admitting
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{formatAddress(hospital)}</span>
                      </div>
                      <span className="hidden sm:inline mx-2">•</span>
                      <div className="flex items-center mt-1 sm:mt-0">
                        <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{hospital.phone}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {renderStarRating(hospital.rating)}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{hospital.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end md:text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {hospital.lastVisit ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Last visit: {formatDate(hospital.lastVisit)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>No visits recorded</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {hospital.departments.length} departments
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded view */}
              {expandedHospital === hospital.id && (
                <div className="p-6 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">{hospital.email}</p>
                          </div>
                        </div>
                        {hospital.website && (
                          <div className="flex items-start">
                            <LinkIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <a 
                                href={hospital.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                {hospital.website}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6 mb-3">Departments</h4>
                      <div className="flex flex-wrap gap-2">
                        {hospital.departments.map(department => (
                          <span 
                            key={department.id} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {department.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Actions</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {hospital.isAffiliated ? (
                          <button 
                            onClick={() => toggleAffiliation(hospital.id)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Affiliation
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleAffiliation(hospital.id)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center"
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Add Affiliation
                          </button>
                        )}
                        
                        {hospital.isAffiliated && !hospital.isPrimary && (
                          <button 
                            onClick={() => setPrimaryHospital(hospital.id)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Set as Primary
                          </button>
                        )}
                        
                        <Link 
                          href={`/provider/hospitals/${hospital.id}`}
                          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </Link>
                        
                        {!hospital.isPrimary && (
                          <button 
                            onClick={() => deleteHospital(hospital.id)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          href={`/provider/hospitals/${hospital.id}/patients`}
                          className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium flex items-center"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Patients at This Hospital
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hospitals found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try adjusting your search or filter criteria' : 
                  'Add hospitals to manage your affiliations and privileges'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-650 mb-4"
                >
                  Reset Filters
                </button>
              )}
              <Link
                href="/provider/hospitals/add"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hospital
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 