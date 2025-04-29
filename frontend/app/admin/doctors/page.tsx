import React from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import { apiUrl } from '@/app/lib/api-utils';
import { FaUserMd, FaUserPlus, FaUserEdit, FaTrash, FaEnvelope, FaPhone, FaCalendarAlt, FaSearch, FaFilter, FaSort, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Define data interfaces
interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationFee: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  totalPatients: number;
  totalAppointments: number;
  location: string;
  availableDays?: string[];
  profilePicture?: string;
  createdAt: string;
  lastActive?: string;
}

interface DoctorListResponse {
  doctors: Doctor[];
  total: number;
  limit: number;
  skip: number;
  stats: {
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    total: number;
    specializations: { name: string; count: number }[];
  };
}

// Function to fetch doctors from our API
async function fetchDoctors(
  search: string = '',
  status: string = '',
  specialization: string = '',
  sort: string = 'rating_desc',
  limit: number = 10,
  skip: number = 0
): Promise<{ data: DoctorListResponse }> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);
    if (specialization) queryParams.append('specialization', specialization);
    queryParams.append('sort', sort);
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());
    
    const response = await fetch(`/api/admin/doctors?${queryParams.toString()}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    // Return mock data if API fails
    const specializations = [
      'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 
      'Psychiatrist', 'Orthopedic', 'Gynecologist', 'Oncologist'
    ];
    
    return {
      data: {
        doctors: Array.from({ length: 10 }, (_, i) => ({
          _id: `doc_${i + 1}`,
          fullName: `Dr. ${['John Smith', 'Sarah Miller', 'Robert Jones', 'Emma Davis', 'Michael Brown', 'Linda Wilson', 'David Moore', 'Jennifer Lee', 'William Taylor', 'Jessica White'][i % 10]}`,
          email: `doctor${i + 1}@example.com`,
          phone: `+1 (555) ${100 + i}-${1000 + i}`,
          specialization: specializations[i % specializations.length],
          experience: 5 + (i % 15),
          rating: 3.5 + (i % 5) * 0.3,
          consultationFee: 50 + (i % 10) * 15,
          status: i % 4 === 0 ? 'pending' : i % 7 === 0 ? 'suspended' : i % 5 === 0 ? 'inactive' : 'active',
          totalPatients: 50 + (i * 12),
          totalAppointments: 120 + (i * 30),
          location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'][i % 10],
          availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'].slice(0, 2 + (i % 3)),
          createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
          lastActive: i % 3 === 0 ? new Date(Date.now() - i * 86400000).toISOString() : undefined
        })),
        total: 54,
        limit,
        skip,
        stats: {
          active: 35,
          inactive: 8,
          pending: 6,
          suspended: 5,
          total: 54,
          specializations: specializations.map((spec, i) => ({
            name: spec,
            count: 4 + (i % 4)
          }))
        }
      }
    };
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to get status badge style
function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to display rating stars
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < fullStars ? (
            <FaStar className="h-4 w-4" />
          ) : i === fullStars && hasHalfStar ? (
            <span className="relative">
              <FaStar className="h-4 w-4 text-gray-300" />
              <span className="absolute top-0 left-0 overflow-hidden w-1/2">
                <FaStar className="h-4 w-4" />
              </span>
            </span>
          ) : (
            <FaStar className="h-4 w-4 text-gray-300" />
          )}
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export const metadata = {
  title: 'Doctor Management | MedConnect Admin',
  description: 'Manage doctors and their profiles on the MedConnect platform',
};

export default async function DoctorManagementPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    status?: string; 
    specialization?: string; 
    sort?: string;
    page?: string;
  };
}) {
  // Get query parameters with defaults
  const { search, status, specialization, sort } = searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;
  
  // Fetch doctors data
  const { data } = await fetchDoctors(search, status, specialization, sort, limit, skip);
  const { doctors, stats, total } = data;
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);
  
  return (
    <AdminLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>
            <p className="mt-1 text-gray-500">Manage doctors and their profiles on the platform</p>
          </div>
          <Link 
            href="/admin/doctors/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FaUserPlus className="mr-2 -ml-1 h-4 w-4" />
            Add New Doctor
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-teal-50 rounded-lg">
                <FaUserMd className="h-5 w-5 text-teal-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Doctors</p>
                <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <FaUserMd className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-xl font-bold text-gray-800">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <FaUserMd className="h-5 w-5 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-xl font-bold text-gray-800">{stats.inactive}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <FaUserMd className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-xl font-bold text-gray-800">{stats.suspended}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <FaUserMd className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top specializations */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Top Specializations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {stats.specializations.map((spec, i) => (
              <Link 
                key={i} 
                href={`/admin/doctors?${new URLSearchParams({
                  ...(search && { search }),
                  ...(status && { status }),
                  specialization: spec.name
                })}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:bg-teal-50 transition-colors duration-150"
              >
                <p className="text-xs font-medium text-gray-500 mb-1">{spec.name}</p>
                <p className="text-lg font-bold text-gray-800">{spec.count}</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name, email, or specialization"
                  defaultValue={search}
                />
              </div>
            </div>
            
            {/* Status filter */}
            <div>
              <select
                id="status"
                name="status"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                defaultValue={status || ''}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            {/* Specialization filter */}
            <div>
              <select
                id="specialization"
                name="specialization"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                defaultValue={specialization || ''}
              >
                <option value="">All Specializations</option>
                {stats.specializations.map((spec, i) => (
                  <option key={i} value={spec.name}>{spec.name}</option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <select
                id="sort"
                name="sort"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                defaultValue={sort || 'rating_desc'}
              >
                <option value="rating_desc">Highest Rating</option>
                <option value="rating_asc">Lowest Rating</option>
                <option value="experience_desc">Most Experienced</option>
                <option value="totalPatients_desc">Most Patients</option>
                <option value="fullName_asc">Name (A-Z)</option>
                <option value="fullName_desc">Name (Z-A)</option>
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <FaFilter className="mr-2 -ml-1 h-4 w-4" />
              Filter
            </button>
          </form>
        </div>
        
        {/* Doctor cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="h-16 w-16 flex-shrink-0 mr-4">
                    {doctor.profilePicture ? (
                      <Image
                        src={doctor.profilePicture}
                        alt={doctor.fullName}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-xl">
                        {doctor.fullName.split(' ')[1] ? 
                          `${doctor.fullName.split(' ')[0][0]}${doctor.fullName.split(' ')[1][0]}` : 
                          doctor.fullName[0]
                        }
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{doctor.fullName}</h3>
                      <span className={`px-2 h-6 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(doctor.status)}`}>
                        {doctor.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{doctor.specialization}</p>
                    <div className="mt-1">
                      <RatingStars rating={doctor.rating} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1 h-3 w-3" /> {doctor.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 flex items-center">
                      <FaMapMarkerAlt className="mr-1 h-3 w-3" /> {doctor.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Patients: {doctor.totalPatients}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fee: ${doctor.consultationFee}</p>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between">
                  <div className="text-xs text-gray-500">
                    <p>Joined: {formatDate(doctor.createdAt)}</p>
                    {doctor.lastActive && (
                      <p className="mt-1">Last active: {formatDate(doctor.lastActive)}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/doctors/${doctor._id}/view`} 
                      className="text-teal-600 hover:text-teal-900"
                      title="View Profile"
                    >
                      <span className="sr-only">View</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    
                    <Link 
                      href={`/admin/doctors/${doctor._id}/edit`} 
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Profile"
                    >
                      <span className="sr-only">Edit</span>
                      <FaUserEdit className="h-5 w-5" />
                    </Link>
                    
                    <Link 
                      href={`/admin/doctors/${doctor._id}/delete`} 
                      className="text-red-600 hover:text-red-900"
                      title="Delete Doctor"
                    >
                      <span className="sr-only">Delete</span>
                      <FaTrash className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <Link
                href={`/admin/doctors?${new URLSearchParams({
                  ...(search && { search }),
                  ...(status && { status }),
                  ...(specialization && { specialization }),
                  ...(sort && { sort }),
                  page: Math.max(1, page - 1).toString(),
                })}`}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/doctors?${new URLSearchParams({
                  ...(search && { search }),
                  ...(status && { status }),
                  ...(specialization && { specialization }),
                  ...(sort && { sort }),
                  page: Math.min(totalPages, page + 1).toString(),
                })}`}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next
              </Link>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{skip + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(skip + limit, total)}
                  </span>{' '}
                  of <span className="font-medium">{total}</span> doctors
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Link
                    href={`/admin/doctors?${new URLSearchParams({
                      ...(search && { search }),
                      ...(status && { status }),
                      ...(specialization && { specialization }),
                      ...(sort && { sort }),
                      page: '1',
                    })}`}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">First</span>
                    <span>First</span>
                  </Link>
                  
                  <Link
                    href={`/admin/doctors?${new URLSearchParams({
                      ...(search && { search }),
                      ...(status && { status }),
                      ...(specialization && { specialization }),
                      ...(sort && { sort }),
                      page: Math.max(1, page - 1).toString(),
                    })}`}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Previous</span>
                    <span>Prev</span>
                  </Link>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <Link
                        key={i}
                        href={`/admin/doctors?${new URLSearchParams({
                          ...(search && { search }),
                          ...(status && { status }),
                          ...(specialization && { specialization }),
                          ...(sort && { sort }),
                          page: pageNum.toString(),
                        })}`}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          page === pageNum
                            ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  
                  <Link
                    href={`/admin/doctors?${new URLSearchParams({
                      ...(search && { search }),
                      ...(status && { status }),
                      ...(specialization && { specialization }),
                      ...(sort && { sort }),
                      page: Math.min(totalPages, page + 1).toString(),
                    })}`}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Next</span>
                    <span>Next</span>
                  </Link>
                  
                  <Link
                    href={`/admin/doctors?${new URLSearchParams({
                      ...(search && { search }),
                      ...(status && { status }),
                      ...(specialization && { specialization }),
                      ...(sort && { sort }),
                      page: totalPages.toString(),
                    })}`}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="sr-only">Last</span>
                    <span>Last</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 