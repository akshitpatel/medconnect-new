'use client';

import React, { useState, useEffect } from 'react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  MoreHorizontal,
  AlertCircle,
  Check,
  CalendarPlus
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientAvatar?: string;
  dateTime: Date;
  endTime: Date;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  notes?: string;
  isNew?: boolean;
}

export default function AppointmentsPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        // Generate fake appointments for the next 30 days
        const today = new Date();
        const mockAppointments: Appointment[] = [];
        
        const appointmentTypes = ['Check-up', 'Follow-up', 'Consultation', 'Procedure', 'Emergency'];
        const statuses: Appointment['status'][] = ['scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'];
        
        // Generate some appointments for today
        for (let i = 0; i < 5; i++) {
          const startHour = 9 + i;
          const startDate = new Date(today);
          startDate.setHours(startHour, 0, 0, 0);
          
          const endDate = new Date(startDate);
          endDate.setMinutes(30);
          
          mockAppointments.push({
            id: `appt-today-${i}`,
            patientName: ['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][Math.floor(Math.random() * 5)],
            patientId: `patient-${i}`,
            dateTime: startDate,
            endTime: endDate,
            status: i === 0 ? 'completed' : (i === 4 ? 'cancelled' : 'scheduled'),
            type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)],
            isNew: i === 2
          });
        }
        
        // Generate appointments for the next 30 days
        for (let day = 1; day <= 30; day++) {
          const date = new Date(today);
          date.setDate(today.getDate() + day);
          
          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) continue;
          
          const numAppointments = Math.floor(Math.random() * 6) + 1; // 1-6 appointments per day
          
          for (let i = 0; i < numAppointments; i++) {
            const startHour = 8 + Math.floor(Math.random() * 8); // 8 AM - 4 PM
            const startMinute = [0, 30][Math.floor(Math.random() * 2)]; // 0 or 30 minutes
            
            const startDate = new Date(date);
            startDate.setHours(startHour, startMinute, 0, 0);
            
            const endDate = new Date(startDate);
            endDate.setMinutes(startDate.getMinutes() + 30);
            
            mockAppointments.push({
              id: `appt-${day}-${i}`,
              patientName: ['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis', 'Michael Wilson', 'Sarah Adams', 'David Brown'][Math.floor(Math.random() * 7)],
              patientId: `patient-${day}-${i}`,
              dateTime: startDate,
              endTime: endDate,
              status: statuses[Math.floor(Math.random() * 3)], // Mostly scheduled, checked-in, or in-progress
              type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)]
            });
          }
        }
        
        setAppointments(mockAppointments);
        filterAppointments(mockAppointments, selectedDate, searchTerm, statusFilter);
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    filterAppointments(appointments, selectedDate, searchTerm, statusFilter);
  }, [selectedDate, searchTerm, statusFilter]);
  
  const filterAppointments = (
    appts: Appointment[], 
    date: Date, 
    search: string, 
    status: string
  ) => {
    // Filter by date (if we're in calendar view)
    let filtered = appts;
    if (viewMode === 'calendar') {
      filtered = appts.filter(appt => {
        return (
          appt.dateTime.getDate() === date.getDate() &&
          appt.dateTime.getMonth() === date.getMonth() &&
          appt.dateTime.getFullYear() === date.getFullYear()
        );
      });
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(appt => 
        appt.patientName.toLowerCase().includes(searchLower) ||
        appt.type.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(appt => appt.status === status);
    }
    
    // Sort by date/time
    filtered.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    
    setFilteredAppointments(filtered);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const getStatusBadgeColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'checked-in':
        return <Check className="h-4 w-4 mr-1" />;
      case 'in-progress':
        return <User className="h-4 w-4 mr-1" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1" />;
      case 'no-show':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };
  
  // Generate calendar days for the current month view
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Grouped appointments by hour and display them in a timeline
  const getTimelineAppointments = () => {
    // Group appointments by hour
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    
    return hours.map(hour => {
      const hourAppointments = filteredAppointments.filter(appt => 
        appt.dateTime.getHours() === hour
      );
      
      return {
        hour,
        appointments: hourAppointments
      };
    });
  };
  
  const getAppointmentsForDay = (date: Date) => {
    const dayAppointments = appointments.filter(appt => 
      appt.dateTime.getDate() === date.getDate() &&
      appt.dateTime.getMonth() === date.getMonth() &&
      appt.dateTime.getFullYear() === date.getFullYear()
    );
    
    return dayAppointments.length;
  };
  
  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Create blank spaces for days before the first day of the month
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`blank-${i}`} className="h-32 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"></div>
    ));
    
    // Create a day cell for each day of the month
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDay.toDateString() === date.toDateString();
      const appointmentCount = getAppointmentsForDay(date);
      
      return (
        <div 
          key={`day-${day}`} 
          className={`h-32 border border-gray-200 dark:border-gray-700 ${
            isToday ? 'bg-teal-50 dark:bg-teal-900/10' : 'bg-white dark:bg-gray-800'
          } ${
            isSelected ? 'ring-2 ring-teal-500 dark:ring-teal-400' : ''
          } relative`}
          onClick={() => {
            setSelectedDay(date);
            setSelectedDate(date);
          }}
        >
          <div className="flex justify-between p-2">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${
              isToday 
                ? 'bg-teal-500 text-white' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {day}
            </span>
            {appointmentCount > 0 && (
              <span className="text-xs font-medium bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 rounded-full px-2 py-1">
                {appointmentCount}
              </span>
            )}
          </div>
        </div>
      );
    });
    
    return [...blanks, ...days];
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="animate-pulse grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and schedule your patient appointments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md ${
                viewMode === 'calendar' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Calendar className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients or appointment types..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="checked-in">Checked In</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>
            
            {viewMode === 'calendar' && (
              <button
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setSelectedDate(new Date())}
              >
                <Calendar className="h-4 w-4 mr-2 text-teal-500" />
                <span className="text-gray-700 dark:text-gray-300">Today</span>
              </button>
            )}
          </div>
        </div>
      </AnimatedCard>
      
      {viewMode === 'calendar' ? (
        <>
          {/* Calendar View */}
          <AnimatedCard className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Calendar Header with Month/Year */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={handlePreviousMonth}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="p-3">
              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-2 font-medium text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </div>
          </AnimatedCard>
          
          {/* Day View with Appointments */}
          <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm" delay={1}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatDate(selectedDate)}
              </h3>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() - 1);
                    setSelectedDate(newDate);
                    setSelectedDay(newDate);
                  }}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button 
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() + 1);
                    setSelectedDate(newDate);
                    setSelectedDay(newDate);
                  }}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
            
            {/* Timeline View */}
            <div className="space-y-6">
              {getTimelineAppointments().map(({ hour, appointments }) => (
                <div key={hour} className="flex">
                  {/* Time Column */}
                  <div className="w-20 flex-shrink-0 pt-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                    </span>
                  </div>
                  
                  {/* Appointments Column */}
                  <div className="flex-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                    {appointments.length > 0 ? (
                      <div className="space-y-3">
                        {appointments.map((appointment) => (
                          <div 
                            key={appointment.id} 
                            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow transition-shadow relative"
                          >
                            {appointment.isNew && (
                              <div className="absolute top-0 right-0 w-3 h-3 bg-teal-500 rounded-full transform translate-x-1 -translate-y-1"></div>
                            )}
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="block font-medium text-gray-900 dark:text-white">{appointment.patientName}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {formatTime(appointment.dateTime)} - {formatTime(appointment.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeColor(appointment.status)}`}>
                                  {getStatusIcon(appointment.status)}
                                  {appointment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                {appointment.type}
                              </span>
                              <div className="flex space-x-2">
                                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">
                                  <MessageSquare className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">
                                  <FileText className="h-4 w-4" />
                                </button>
                                <button className="p-1 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div 
                        className="flex items-center justify-center h-12 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No appointments
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredAppointments.length === 0 && (
              <div className="p-8 text-center border-t border-gray-200 dark:border-gray-700 mt-6">
                <CalendarPlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Appointments</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {statusFilter !== 'all' 
                    ? `No ${statusFilter.replace('-', ' ')} appointments for this date.` 
                    : 'No appointments scheduled for this date.'}
                </p>
                <button
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  Schedule Appointment
                </button>
              </div>
            )}
          </AnimatedCard>
        </>
      ) : (
        /* List View */
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-700 dark:text-teal-300 font-medium">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</p>
                            {appointment.isNew && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                                New Patient
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <p className="text-gray-900 dark:text-white">
                          {new Intl.DateTimeFormat('en-US', { 
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }).format(appointment.dateTime)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(appointment.dateTime)} - {formatTime(appointment.endTime)}
                        </p>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">{appointment.type}</span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <FileText className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center">
                      <CalendarPlus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Appointments Found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm 
                          ? `No appointments match your search criteria.` 
                          : (statusFilter !== 'all' 
                            ? `No ${statusFilter.replace('-', ' ')} appointments found.` 
                            : 'No appointments found with the current filters.')}
                      </p>
                      <button
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                        onClick={() => setShowModal(true)}
                      >
                        Schedule Appointment
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
} 