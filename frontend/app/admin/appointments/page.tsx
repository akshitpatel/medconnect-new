'use client';

import React, { useState, useEffect } from 'react';
import { CalendarClock, Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Calendar, X, Trash, Eye, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/Avatar';

// Define types
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';
type AppointmentType = 'consultation' | 'follow-up' | 'annual-checkup' | 'urgent-care' | 'lab-test';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  type: AppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-1001',
    patientName: 'John Smith',
    patientId: 'P-7890',
    doctorName: 'Dr. Sarah Johnson',
    doctorId: 'D-1001',
    type: 'consultation',
    date: '2023-05-15',
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    createdAt: '2023-05-01'
  },
  {
    id: 'APT-1002',
    patientName: 'Emma Wilson',
    patientId: 'P-7891',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'D-1002',
    type: 'follow-up',
    date: '2023-05-15',
    startTime: '10:00',
    endTime: '10:15',
    status: 'completed',
    notes: 'Patient reported improvement in symptoms',
    createdAt: '2023-04-28'
  },
  {
    id: 'APT-1003',
    patientName: 'Robert Brown',
    patientId: 'P-7892',
    doctorName: 'Dr. Emily Davis',
    doctorId: 'D-1003',
    type: 'annual-checkup',
    date: '2023-05-16',
    startTime: '11:00',
    endTime: '12:00',
    status: 'scheduled',
    createdAt: '2023-05-02'
  },
  {
    id: 'APT-1004',
    patientName: 'Lisa Johnson',
    patientId: 'P-7893',
    doctorName: 'Dr. James Wilson',
    doctorId: 'D-1004',
    type: 'urgent-care',
    date: '2023-05-14',
    startTime: '14:00',
    endTime: '14:30',
    status: 'cancelled',
    notes: 'Patient requested cancellation',
    createdAt: '2023-05-10'
  },
  {
    id: 'APT-1005',
    patientName: 'Michael Davis',
    patientId: 'P-7894',
    doctorName: 'Dr. Lisa Chen',
    doctorId: 'D-1005',
    type: 'lab-test',
    date: '2023-05-17',
    startTime: '15:00',
    endTime: '15:30',
    status: 'scheduled',
    createdAt: '2023-05-03'
  },
  {
    id: 'APT-1006',
    patientName: 'Jennifer Lee',
    patientId: 'P-7895',
    doctorName: 'Dr. Robert Johnson',
    doctorId: 'D-1006',
    type: 'consultation',
    date: '2023-05-18',
    startTime: '09:30',
    endTime: '10:00',
    status: 'no-show',
    notes: 'Patient did not show up for appointment',
    createdAt: '2023-05-05'
  }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<AppointmentType | 'all'>('all');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAppointments(MOCK_APPOINTMENTS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    
    // Filter by type
    const matchesType = selectedType === 'all' || appointment.type === selectedType;
    
    // Filter by tab
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'today' && isToday(appointment.date)) ||
      (currentTab === 'upcoming' && isFuture(appointment.date)) ||
      (currentTab === 'past' && isPast(appointment.date));
    
    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Format appointment type for display
  const formatType = (type: AppointmentType): string => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Check if date is today
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if date is in the future
  const isFuture = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date > today;
  };

  // Check if date is in the past
  const isPast = (dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
    return date < today;
  };

  // Get status badge
  const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />Scheduled
        </Badge>;
    case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />Completed
        </Badge>;
    case 'cancelled':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <XCircle className="h-3 w-3 mr-1" />Cancelled
        </Badge>;
    case 'no-show':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />No Show
        </Badge>;
    default:
        return null;
    }
  };

  // Get type badge
  const getTypeBadge = (type: AppointmentType) => {
    const colors: Record<AppointmentType, string> = {
      'consultation': 'bg-purple-50 text-purple-700 border-purple-200',
      'follow-up': 'bg-teal-50 text-teal-700 border-teal-200',
      'annual-checkup': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'urgent-care': 'bg-red-50 text-red-700 border-red-200',
      'lab-test': 'bg-amber-50 text-amber-700 border-amber-200'
    };
    
    return <Badge variant="outline" className={colors[type]}>
      {formatType(type)}
    </Badge>;
  };

  // If still loading, show skeleton
  if (isLoading) {
  return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Management</h1>
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    );
  }
  
  // Get appointment counts
  const todayCount = appointments.filter(a => isToday(a.date)).length;
  const upcomingCount = appointments.filter(a => isFuture(a.date) && !isToday(a.date)).length;
  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <CalendarClock className="inline-block mr-3 h-8 w-8 text-teal-500" />
          Appointment Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Schedule and manage patient appointments efficiently
        </p>
          </div>
          
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
          </div>
          
      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
          </div>
          
      {/* Tabs and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setCurrentTab('all')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === 'all' 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                All Appointments
              </button>
              <button 
                onClick={() => setCurrentTab('today')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === 'today' 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentTab('upcoming')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === 'upcoming' 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setCurrentTab('past')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === 'past' 
                    ? 'border-teal-500 text-teal-600 dark:text-teal-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Past
              </button>
        </div>
        
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search appointments..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Status: {selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => {
                        setSelectedStatus('all');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedStatus === 'all' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => {
                        setSelectedStatus('scheduled');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedStatus === 'scheduled' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Scheduled
            </div>
                    <div
                      onClick={() => {
                        setSelectedStatus('completed');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedStatus === 'completed' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Completed
            </div>
                    <div
                      onClick={() => {
                        setSelectedStatus('cancelled');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedStatus === 'cancelled' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Cancelled
            </div>
                    <div
                      onClick={() => {
                        setSelectedStatus('no-show');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedStatus === 'no-show' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      No Show
                    </div>
                  </div>
                )}
            </div>
            
              {/* Type Filter */}
              <div className="relative">
            <button
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Type: {selectedType === 'all' ? 'All' : formatType(selectedType)}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
                {typeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => {
                        setSelectedType('all');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'all' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => {
                        setSelectedType('consultation');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'consultation' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Consultation
                    </div>
                    <div
                      onClick={() => {
                        setSelectedType('follow-up');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'follow-up' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Follow-up
                    </div>
                    <div
                      onClick={() => {
                        setSelectedType('annual-checkup');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'annual-checkup' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Annual Checkup
                    </div>
                    <div
                      onClick={() => {
                        setSelectedType('urgent-care');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'urgent-care' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Urgent Care
        </div>
                    <div
                      onClick={() => {
                        setSelectedType('lab-test');
                        setTypeDropdownOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedType === 'lab-test' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    >
                      Lab Test
                    </div>
                  </div>
                )}
                        </div>
                        </div>
                      </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
          <CardDescription>
            {currentTab === 'all' ? 'All appointments' : 
             currentTab === 'today' ? 'Appointments scheduled for today' :
             currentTab === 'upcoming' ? 'Upcoming appointments' : 'Past appointments'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No appointments found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <div className="flex h-full w-full items-center justify-center bg-teal-100 text-teal-800 rounded-full">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-2">
                            {appointment.patientName}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({appointment.patientId})
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.type)}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDate(appointment.date)}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                        </div>
                      </div>
                      </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-400">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">
                        <Trash className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      </div>
          </div>
          
                  {appointment.notes && (
                    <div className="mt-3 ml-14 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                      <span className="font-medium">Notes:</span> {appointment.notes}
              </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
        </CardFooter>
      </Card>
      </div>
  );
} 