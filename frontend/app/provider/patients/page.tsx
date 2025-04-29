'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download, 
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  MoreHorizontal,
  MapPin,
  ChevronDown,
  ChevronRight,
  Clock,
  Heart
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  lastVisit?: string;
  nextAppointment?: string;
  conditions?: string[];
  insuranceProvider?: string;
  insuranceId?: string;
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Mock patients data
  const patients: PatientData[] = [
    {
      id: 'PT100123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      age: 42,
      gender: 'Male',
      address: '123 Main St, Anytown, CA 94502',
      lastVisit: '2023-03-01',
      nextAppointment: '2023-04-15',
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      insuranceProvider: 'Blue Cross',
      insuranceId: 'BC9876543'
    },
    {
      id: 'PT100124',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 234-5678',
      age: 35,
      gender: 'Female',
      address: '456 Oak Ave, Somewhere, CA 94503',
      lastVisit: '2023-03-10',
      nextAppointment: '2023-04-20',
      conditions: ['Asthma', 'Allergies'],
      insuranceProvider: 'Aetna',
      insuranceId: 'AE1234567'
    },
    {
      id: 'PT100125',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '(555) 345-6789',
      age: 58,
      gender: 'Male',
      address: '789 Pine Ln, Elsewhere, CA 94504',
      lastVisit: '2023-02-25',
      conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      insuranceProvider: 'Medicare',
      insuranceId: 'MC7654321'
    },
    {
      id: 'PT100126',
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      phone: '(555) 456-7890',
      age: 29,
      gender: 'Female',
      address: '321 Cedar St, Nowhere, CA 94505',
      lastVisit: '2023-03-15',
      nextAppointment: '2023-04-05',
      conditions: ['Anxiety', 'Depression'],
      insuranceProvider: 'Cigna',
      insuranceId: 'CI2345678'
    },
    {
      id: 'PT100127',
      name: 'Robert Garcia',
      email: 'robert.g@example.com',
      phone: '(555) 567-8901',
      age: 65,
      gender: 'Male',
      address: '654 Redwood Dr, Anywhere, CA 94506',
      lastVisit: '2023-03-05',
      nextAppointment: '2023-04-10',
      conditions: ['Osteoarthritis', 'Hypertension'],
      insuranceProvider: 'Medicare',
      insuranceId: 'MC8765432'
    },
    {
      id: 'PT100128',
      name: 'Jennifer Lee',
      email: 'jennifer.l@example.com',
      phone: '(555) 678-9012',
      age: 32,
      gender: 'Female',
      address: '987 Maple Rd, Someplace, CA 94507',
      lastVisit: '2023-03-20',
      conditions: ['Migraine', 'Insomnia'],
      insuranceProvider: 'United Healthcare',
      insuranceId: 'UH3456789'
    }
  ];
  
  // Pagination config
  const patientsPerPage = 5;
  
  // Filter and sort patients
  const filteredPatients = patients.filter(patient => {
    // Search term filter
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    // Gender filter
    const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });
  
  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'id':
        return a.id.localeCompare(b.id);
      case 'age':
        return a.age - b.age;
      case 'lastVisit':
        return (a.lastVisit || '') > (b.lastVisit || '') ? -1 : 1;
      default:
        return 0;
    }
  });
  
  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  
  // Toggle patient expanded info
  const toggleExpanded = (patientId: string) => {
    if (expanded === patientId) {
      setExpanded(null);
    } else {
      setExpanded(patientId);
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Get days since last visit
  const getDaysSince = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get upcoming appointment status
  const getAppointmentStatus = (dateString?: string) => {
    if (!dateString) return null;
    
    const appointmentDate = new Date(dateString);
    const today = new Date();
    
    if (appointmentDate < today) {
      return { label: 'Past', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' };
    }
    
    const diffTime = Math.abs(appointmentDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return { label: 'Soon', classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' };
    } else {
      return { label: 'Upcoming', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    }
  };
  
  // Pagination controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Patients
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and access patient records
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link 
            href="/provider/patients/add" 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700 flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </Link>
          <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
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
              placeholder="Search by name, ID, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="id">Sort by ID</option>
              <option value="age">Sort by Age</option>
              <option value="lastVisit">Sort by Last Visit</option>
            </select>
          </div>
        </div>
        
        {/* Filter options */}
        {filterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button className="w-full px-3 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Patients List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Visit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentPatients.map(patient => (
                <React.Fragment key={patient.id}>
                  <tr 
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                    onClick={() => toggleExpanded(patient.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            {patient.id} • {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-1">
                        <Phone className="h-3 w-3 mr-1" />
                        {patient.phone}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {patient.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.lastVisit ? (
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(patient.lastVisit)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getDaysSince(patient.lastVisit)} days ago
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No visits yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.nextAppointment ? (
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-teal-500" />
                            {formatDate(patient.nextAppointment)}
                          </div>
                          <div className="mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getAppointmentStatus(patient.nextAppointment)?.classes}`}>
                              {getAppointmentStatus(patient.nextAppointment)?.label}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No appointment scheduled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          href={`/provider/patients/${patient.id}`}
                          className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/provider/appointments/new?patient=${patient.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar className="h-5 w-5" />
                        </Link>
                        <div className="relative">
                          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-400 transform transition-transform ${expanded === patient.id ? 'rotate-180' : ''}`} />
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded details */}
                  {expanded === patient.id && (
                    <tr className="bg-gray-50 dark:bg-gray-750">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Patient Details</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-start">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{patient.address}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Insurance:</span> {patient.insuranceProvider} ({patient.insuranceId})
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Medical Conditions</h4>
                            <div className="flex flex-wrap">
                              {patient.conditions && patient.conditions.length > 0 ? (
                                patient.conditions.map(condition => (
                                  <span 
                                    key={condition} 
                                    className="mr-2 mb-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs flex items-center"
                                  >
                                    <Heart className="h-3 w-3 mr-1" />
                                    {condition}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">No conditions recorded</span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
                            <div className="flex space-x-2">
                              <Link
                                href={`/provider/patients/${patient.id}`}
                                className="px-3 py-1 bg-teal-600 text-white rounded text-xs flex items-center"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                View Record
                              </Link>
                              <Link
                                href={`/provider/messages/new?patient=${patient.id}`}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center"
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Message
                              </Link>
                              <Link
                                href={`/provider/appointments/new?patient=${patient.id}`}
                                className="px-3 py-1 bg-purple-600 text-white rounded text-xs flex items-center"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Schedule
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastPatient, sortedPatients.length)}
                </span>{' '}
                of <span className="font-medium">{sortedPatients.length}</span> patients
              </p>
            </div>
            <div>
              <nav className="flex items-center" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === index + 1
                        ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-500 dark:border-teal-700 text-teal-600 dark:text-teal-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } text-sm font-medium`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 