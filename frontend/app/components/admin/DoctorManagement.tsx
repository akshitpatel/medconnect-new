'use client';

import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaStar } from 'react-icons/fa';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specializations: string[];
  experience: number;
  location: string;
  consultationFees: {
    clinic: number;
    online: number;
  };
  availability: {
    online: boolean;
    inClinic: boolean;
  };
  rating: number;
  reviewCount: number;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  image?: string;
}

interface DoctorManagementProps {
  initialDoctors?: Doctor[];
}

const DoctorManagement: React.FC<DoctorManagementProps> = ({ initialDoctors = [] }) => {
  // In a real app, this would come from an API call
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors.length > 0 ? initialDoctors : [
    {
      id: '1',
      name: 'Dr. John Smith',
      email: 'john.smith@example.com',
      specializations: ['Cardiology', 'Internal Medicine'],
      experience: 15,
      location: 'New York, NY',
      consultationFees: {
        clinic: 150,
        online: 100
      },
      availability: {
        online: true,
        inClinic: true
      },
      rating: 4.8,
      reviewCount: 243,
      status: 'active',
      joinedDate: '2022-05-10'
    },
    {
      id: '2',
      name: 'Dr. Emily Johnson',
      email: 'emily.johnson@example.com',
      specializations: ['Pediatrics'],
      experience: 8,
      location: 'Boston, MA',
      consultationFees: {
        clinic: 120,
        online: 90
      },
      availability: {
        online: true,
        inClinic: true
      },
      rating: 4.9,
      reviewCount: 186,
      status: 'active',
      joinedDate: '2022-08-15'
    },
    {
      id: '3',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      specializations: ['Neurology', 'Psychiatry'],
      experience: 12,
      location: 'San Francisco, CA',
      consultationFees: {
        clinic: 200,
        online: 150
      },
      availability: {
        online: true,
        inClinic: false
      },
      rating: 4.7,
      reviewCount: 157,
      status: 'active',
      joinedDate: '2022-03-22'
    },
    {
      id: '4',
      name: 'Dr. Sarah Patel',
      email: 'sarah.patel@example.com',
      specializations: ['Dermatology'],
      experience: 7,
      location: 'Chicago, IL',
      consultationFees: {
        clinic: 180,
        online: 120
      },
      availability: {
        online: false,
        inClinic: true
      },
      rating: 4.6,
      reviewCount: 112,
      status: 'pending',
      joinedDate: '2023-01-05'
    },
    {
      id: '5',
      name: 'Dr. Robert Williams',
      email: 'robert.williams@example.com',
      specializations: ['Orthopedics', 'Sports Medicine'],
      experience: 20,
      location: 'Miami, FL',
      consultationFees: {
        clinic: 220,
        online: 160
      },
      availability: {
        online: true,
        inClinic: true
      },
      rating: 4.9,
      reviewCount: 289,
      status: 'suspended',
      joinedDate: '2021-11-30'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // All specializations for the filter dropdown
  const allSpecializations = Array.from(
    new Set(doctors.flatMap(doctor => doctor.specializations))
  ).sort();
  
  // Filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'All' || 
                                 doctor.specializations.includes(specializationFilter);
    const matchesStatus = statusFilter === 'All' || doctor.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesSpecialization && matchesStatus;
  });
  
  // Edit Doctor
  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };
  
  // Delete Doctor
  const handleDelete = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsConfirmDeleteOpen(true);
  };
  
  // View Doctor Details
  const handleViewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsViewDetailsOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(doctor => doctor.id !== selectedDoctor.id));
      setIsConfirmDeleteOpen(false);
      setSelectedDoctor(null);
    }
  };
  
  // Update Doctor Status
  const updateDoctorStatus = (doctorId: string, newStatus: 'active' | 'pending' | 'suspended') => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId ? {...doctor, status: newStatus} : doctor
    ));
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400" style={{ opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Doctor Management</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors">
          Add New Doctor
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors by name, email, or location..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div>
          <select
            className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="All">All Specializations</option>
            {allSpecializations.map(specialization => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>
      
      {/* Doctors Table */}
      <div className="bg-white rounded-md shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specializations
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees (USD)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-800 font-medium text-sm">
                        {doctor.name.split(' ')[1][0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                      <div className="text-sm text-gray-500">{doctor.email}</div>
                      <div className="text-xs text-gray-500">{doctor.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializations.map(specialization => (
                      <span 
                        key={specialization}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {specialization}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.experience} years
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>Clinic: ${doctor.consultationFees.clinic}</div>
                    <div>Online: ${doctor.consultationFees.online}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    {renderStarRating(doctor.rating)}
                    <span className="text-xs text-gray-500 mt-1">({doctor.reviewCount} reviews)</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${doctor.status === 'active' ? 'bg-green-100 text-green-800' : 
                      doctor.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`
                  }>
                    {doctor.status === 'active' && <FaCheckCircle className="mr-1 text-green-500" />}
                    {doctor.status === 'suspended' && <FaTimesCircle className="mr-1 text-red-500" />}
                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleViewDetails(doctor)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(doctor)}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(doctor)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                    <div className="relative group">
                      <button className="text-gray-500 hover:text-gray-900 focus:outline-none">
                        ⋮
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <button
                          onClick={() => updateDoctorStatus(doctor.id, 'active')} 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Approve/Activate
                        </button>
                        <button
                          onClick={() => updateDoctorStatus(doctor.id, 'suspended')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Suspend
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Feature Doctor
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDoctors.length}</span> of{' '}
              <span className="font-medium">{filteredDoctors.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* View Doctor Details Modal */}
      {isViewDetailsOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{selectedDoctor.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-600 mb-1">Email: {selectedDoctor.email}</p>
                <p className="text-gray-600 mb-1">Location: {selectedDoctor.location}</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Professional Details</h3>
                <p className="text-gray-600 mb-1">Experience: {selectedDoctor.experience} years</p>
                <p className="text-gray-600 mb-1">Specializations:</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedDoctor.specializations.map(specialization => (
                    <span 
                      key={specialization}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {specialization}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Consultation Fees</h3>
                <p className="text-gray-600 mb-1">Clinic: ${selectedDoctor.consultationFees.clinic}</p>
                <p className="text-gray-600 mb-1">Online: ${selectedDoctor.consultationFees.online}</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Availability</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${selectedDoctor.availability.inClinic ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>In-clinic consultations: {selectedDoctor.availability.inClinic ? 'Available' : 'Unavailable'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${selectedDoctor.availability.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Online consultations: {selectedDoctor.availability.online ? 'Available' : 'Unavailable'}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">Ratings & Reviews</h3>
                <div className="flex items-center mb-1">
                  {renderStarRating(selectedDoctor.rating)}
                  <span className="ml-2">{selectedDoctor.rating} out of 5</span>
                </div>
                <p className="text-gray-600">Based on {selectedDoctor.reviewCount} patient reviews</p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Account Status</h3>
            <div className="flex items-center mb-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${selectedDoctor.status === 'active' ? 'bg-green-100 text-green-800' : 
                  selectedDoctor.status === 'suspended' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`
              }>
                {selectedDoctor.status === 'active' && <FaCheckCircle className="mr-1 text-green-500" />}
                {selectedDoctor.status === 'suspended' && <FaTimesCircle className="mr-1 text-red-500" />}
                {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
              </span>
              <span className="ml-4 text-gray-600">
                Joined: {new Date(selectedDoctor.joinedDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-end space-x-4 mt-4">
              <button 
                onClick={() => setIsViewDetailsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setIsViewDetailsOpen(false);
                  handleEdit(selectedDoctor);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Edit Doctor
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Doctor Modal */}
      {isEditModalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.name}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.email}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.experience}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.location}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Fee ($)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.consultationFees.clinic}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Fee ($)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.consultationFees.online}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedDoctor.specializations.map(specialization => (
                    <span 
                      key={specialization}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {specialization}
                      <button className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Add specialization..."
                    className="p-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="inClinic" 
                      className="mr-2"
                      defaultChecked={selectedDoctor.availability.inClinic} 
                    />
                    <label htmlFor="inClinic">Available for in-clinic consultations</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="online" 
                      className="mr-2"
                      defaultChecked={selectedDoctor.availability.online} 
                    />
                    <label htmlFor="online">Available for online consultations</label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedDoctor.status}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, you would save the changes to the backend
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Delete Modal */}
      {isConfirmDeleteOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete doctor <span className="font-medium">{selectedDoctor.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement; 