'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarClock, Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Calendar, X, Trash, Eye, Clock, AlertCircle, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/Avatar';
import { adminAPI } from '@/app/services/api';
import { format, parseISO, addDays, isToday, isPast, isFuture } from 'date-fns';

// Define types
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled_by_patient' | 'cancelled_by_provider' | 'no_show';
type AppointmentType = 'consultation' | 'follow_up' | 'annual_check_up' | 'urgent_care' | 'specialist';
type TabType = 'all' | 'today' | 'upcoming' | 'past';
type SortDirection = 'asc' | 'desc';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
  email: string;
  phone_number: string;
  avatar_url?: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  scheduled_at: string;
  duration_minutes: number;
  notes?: string;
  reason?: string;
  patient: Patient;
  provider: Provider;
  created_at: string;
  updated_at: string;
}

interface AppointmentStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled_by_patient: number;
  cancelled_by_provider: number;
  no_show: number;
  today: number;
  this_week: number;
  this_month: number;
  by_type: {
    consultation: number;
    follow_up: number;
    annual_check_up: number;
    urgent_care: number;
    specialist: number;
  }
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface AppointmentFilters {
  status?: AppointmentStatus;
  appointment_type?: AppointmentType;
  provider_id?: string;
  patient_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: SortDirection;
  search_term?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface AppointmentResponse {
  appointments: Appointment[];
  pagination: PaginationData;
  stats: AppointmentStats;
}

export default function AdminAppointmentsPage() {
  // State for appointments and stats
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 10
  });
  
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and UI controls
  const [filters, setFilters] = useState<AppointmentFilters>({
    page: 1,
    per_page: 10,
    sort_by: 'scheduled_at',
    sort_direction: 'desc'
  });
  
  // UI state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | null>(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('all');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // Filtered appointments for display
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  
  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create API filters object
      const apiFilters: AppointmentFilters = { ...filters };
      
      // Add search term if exists
      if (searchTerm.trim() !== '') {
        apiFilters.search_term = searchTerm.trim();
      }
      
      // Set date filters based on current tab
      if (currentTab === 'today') {
        const today = new Date();
        apiFilters.date_from = format(today, 'yyyy-MM-dd');
        apiFilters.date_to = format(today, 'yyyy-MM-dd');
      } else if (currentTab === 'upcoming') {
        const today = new Date();
        apiFilters.date_from = format(addDays(today, 1), 'yyyy-MM-dd');
      } else if (currentTab === 'past') {
        const today = new Date();
        apiFilters.date_to = format(addDays(today, -1), 'yyyy-MM-dd');
      }
      
      // Set status filter if selected
      if (selectedStatus) {
        apiFilters.status = selectedStatus;
      }
      
      // Set appointment type filter if selected
      if (selectedType) {
        apiFilters.appointment_type = selectedType;
      }
      
      const response = await adminAPI.getAppointments(apiFilters);
      const responseData = response.data as ApiResponse<AppointmentResponse>;
      
      if (responseData.success) {
        setAppointments(responseData.data.appointments);
        setFilteredAppointments(responseData.data.appointments);
        setPagination(responseData.data.pagination);
        setStats(responseData.data.stats);
      } else {
        setError(responseData.message || 'Error fetching appointments');
      }
    } catch (err) {
      setError('Failed to fetch appointments. Please try again.');
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm, currentTab, selectedStatus, selectedType]);
  
  // Fetch stats separately (used for refresh)
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminAPI.getAppointmentStats();
      const responseData = response.data as ApiResponse<AppointmentStats>;
      
      if (responseData.success) {
        setStats(responseData.data);
      }
    } catch (err) {
      console.error('Error fetching appointment stats:', err);
    }
  }, []);
  
  // Initial data load
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };
  
  // Handle sorting
  const handleSort = (sortBy: string) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_direction: prev.sort_by === sortBy && prev.sort_direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments();
  };
  
  // Handle data refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Helper to format appointment type for display
  const formatAppointmentType = (type: AppointmentType): string => {
    const typeMap: Record<AppointmentType, string> = {
      consultation: 'Consultation',
      follow_up: 'Follow-up',
      annual_check_up: 'Annual Check-up',
      urgent_care: 'Urgent Care',
      specialist: 'Specialist'
    };
    
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  };
  
  // Helper to format appointment status for display
  const formatAppointmentStatus = (status: AppointmentStatus): string => {
    const statusMap: Record<AppointmentStatus, string> = {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled_by_patient: 'Cancelled by Patient',
      cancelled_by_provider: 'Cancelled by Provider',
      no_show: 'No Show'
    };
    
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };
  
  // Helper to get status badge color
  const getStatusBadgeColor = (status: AppointmentStatus): string => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled_by_patient':
      case 'cancelled_by_provider':
        return 'bg-yellow-100 text-yellow-800';
      case 'no_show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper to get status icon
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled_by_patient':
      case 'cancelled_by_provider':
        return <XCircle className="h-4 w-4 text-yellow-600" />;
      case 'no_show':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Helper to get appointment type badge color
  const getTypeBadgeColor = (type: AppointmentType): string => {
    const typeColorMap: Record<AppointmentType, string> = {
      consultation: 'bg-purple-100 text-purple-800',
      follow_up: 'bg-indigo-100 text-indigo-800',
      annual_check_up: 'bg-teal-100 text-teal-800',
      urgent_care: 'bg-red-100 text-red-800',
      specialist: 'bg-amber-100 text-amber-800'
    };
    
    return typeColorMap[type] || 'bg-gray-100 text-gray-800';
  };
  
  // Render stat cards
  const renderStatCards = () => {
    if (!stats) return null;
    
    const statCards = [
      {
        title: 'Total Appointments',
        value: stats.total,
        icon: <CalendarClock className="h-8 w-8 text-blue-500" />,
        color: 'border-blue-200 bg-blue-50'
      },
      {
        title: 'Scheduled',
        value: stats.scheduled,
        icon: <Clock className="h-8 w-8 text-indigo-500" />,
        color: 'border-indigo-200 bg-indigo-50'
      },
      {
        title: 'Completed',
        value: stats.completed,
        icon: <CheckCircle className="h-8 w-8 text-green-500" />,
        color: 'border-green-200 bg-green-50'
      },
      {
        title: 'Today',
        value: stats.today,
        icon: <Calendar className="h-8 w-8 text-purple-500" />,
        color: 'border-purple-200 bg-purple-50'
      }
    ];
    
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {statCards.map((card, index) => (
          <AnimatedCard key={index} delay={index * 0.1}>
            <Card className={`border-l-4 ${card.color}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-1 text-3xl font-semibold">{card.value}</p>
                </div>
                <div>{card.icon}</div>
              </CardContent>
            </Card>
          </AnimatedCard>
        ))}
      </div>
    );
  };
  
  // Render filters and search
  const renderFilters = () => {
    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by patient or provider name..."
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        
        <div className="flex flex-row gap-2">
          {/* Status filter dropdown */}
          <div className="relative">
            <Button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {selectedStatus ? formatAppointmentStatus(selectedStatus) : 'Status'}
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {statusDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedStatus(null);
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === null && <span className="font-semibold">✓</span>} All Statuses
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('scheduled');
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === 'scheduled' && <span className="font-semibold">✓</span>} Scheduled
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('completed');
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === 'completed' && <span className="font-semibold">✓</span>} Completed
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('cancelled_by_patient');
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === 'cancelled_by_patient' && <span className="font-semibold">✓</span>} Cancelled by Patient
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('cancelled_by_provider');
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === 'cancelled_by_provider' && <span className="font-semibold">✓</span>} Cancelled by Provider
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('no_show');
                      setStatusDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedStatus === 'no_show' && <span className="font-semibold">✓</span>} No Show
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Appointment type filter dropdown */}
          <div className="relative">
            <Button
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {selectedType ? formatAppointmentType(selectedType) : 'Type'}
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {typeDropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedType(null);
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === null && <span className="font-semibold">✓</span>} All Types
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType('consultation');
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === 'consultation' && <span className="font-semibold">✓</span>} Consultation
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType('follow_up');
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === 'follow_up' && <span className="font-semibold">✓</span>} Follow-up
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType('annual_check_up');
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === 'annual_check_up' && <span className="font-semibold">✓</span>} Annual Check-up
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType('urgent_care');
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === 'urgent_care' && <span className="font-semibold">✓</span>} Urgent Care
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType('specialist');
                      setTypeDropdownOpen(false);
                    }}
                    className="text-left block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {selectedType === 'specialist' && <span className="font-semibold">✓</span>} Specialist
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
    );
  };
  
  // Render tabs for different views
  const renderTabs = () => {
    return (
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setCurrentTab('all')}
          className={`px-4 py-2 text-sm font-medium ${
            currentTab === 'all'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All Appointments
        </button>
        <button
          onClick={() => setCurrentTab('today')}
          className={`px-4 py-2 text-sm font-medium ${
            currentTab === 'today'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setCurrentTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium ${
            currentTab === 'upcoming'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setCurrentTab('past')}
          className={`px-4 py-2 text-sm font-medium ${
            currentTab === 'past'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Past
        </button>
      </div>
    );
  };
  
  // Render the appointments list
  const renderAppointmentsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="ml-2 text-gray-500">Loading appointments...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex justify-center items-center py-12 text-red-500">
          <AlertCircle className="h-6 w-6 mr-2" />
          <p>{error}</p>
        </div>
      );
    }
    
    if (filteredAppointments.length === 0) {
      let message = 'No appointments found';
      
      if (currentTab === 'today') {
        message = 'No appointments scheduled for today';
      } else if (currentTab === 'upcoming') {
        message = 'No upcoming appointments scheduled';
      } else if (currentTab === 'past') {
        message = 'No past appointments found';
      }
      
      return (
        <div className="flex justify-center items-center py-12 text-gray-500">
          <CalendarClock className="h-6 w-6 mr-2" />
          <p>{message}</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Provider</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('scheduled_at')}>
                <div className="flex items-center">
                  <span>Date & Time</span>
                  {filters.sort_by === 'scheduled_at' && (
                    <ChevronDown className={`ml-1 h-4 w-4 ${filters.sort_direction === 'desc' ? 'transform rotate-180' : ''}`} />
                  )}
                </div>
              </th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment, index) => (
              <AnimatedCard key={appointment.id} delay={index * 0.05} className="block">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={appointment.patient.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${appointment.patient.first_name} ${appointment.patient.last_name}`
                        )}&background=random`}
                        alt={`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient.first_name} {appointment.patient.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        src={appointment.provider.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${appointment.provider.first_name} ${appointment.provider.last_name}`
                        )}&background=random`}
                        alt={`${appointment.provider.first_name} ${appointment.provider.last_name}`}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {appointment.provider.first_name} {appointment.provider.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.provider.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {format(parseISO(appointment.scheduled_at), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(parseISO(appointment.scheduled_at), 'h:mm a')} ({appointment.duration_minutes} min)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${getTypeBadgeColor(appointment.appointment_type)}`}>
                      {formatAppointmentType(appointment.appointment_type)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(appointment.status)}
                      <span className={`ml-1.5 inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${getStatusBadgeColor(appointment.status)}`}>
                        {formatAppointmentStatus(appointment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900" title="Edit Appointment">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Cancel Appointment">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </AnimatedCard>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (filteredAppointments.length === 0 || !pagination) return null;
    
    return (
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.total_pages}
            variant="outline"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)}
              </span>{' '}
              of <span className="font-medium">{pagination.total_count}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium"
              >
                Previous
              </Button>
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={pagination.current_page === page ? 'default' : 'outline'}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
                variant="outline"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium"
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Management</h1>
      </div>
      
      {renderStatCards()}
      {renderFilters()}
      {renderTabs()}
      
      <Card>
        <CardContent className="p-0">
          {renderAppointmentsList()}
        </CardContent>
        <CardFooter className="border-t border-gray-200">
          {renderPagination()}
        </CardFooter>
      </Card>
    </div>
  );
}
