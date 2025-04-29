'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Video,
  Phone,
  MessageSquare,
  X,
  Check,
  FileText,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Appointment interface
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAvatar: string | null;
  date: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'canceled' | 'completed';
  reason: string;
  notes: string | null;
  isNew: boolean;
  patientPhoto: string;
  duration: number; // in minutes
  mode: 'in-person' | 'video' | 'phone';
}

// Mock appointments data
const appointmentsData: Appointment[] = [
  {
    id: 'A10001',
    patientId: 'P10023',
    patientName: 'John Doe',
    patientAge: 42,
    patientGender: 'Male',
    patientAvatar: null,
    date: '2023-11-20',
    startTime: '09:00',
    endTime: '09:30',
    type: 'in-person',
    status: 'confirmed',
    reason: 'Annual Check-up',
    notes: 'Patient has reported occasional headaches',
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/men/42.jpg',
    duration: 30,
    mode: 'in-person'
  },
  {
    id: 'A10002',
    patientId: 'P10054',
    patientName: 'Sarah Johnson',
    patientAge: 35,
    patientGender: 'Female',
    patientAvatar: null,
    date: '2023-11-20',
    startTime: '10:30',
    endTime: '11:00',
    type: 'video',
    status: 'confirmed',
    reason: 'Follow-up Consultation',
    notes: 'Review medication effectiveness',
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
    duration: 45,
    mode: 'video'
  },
  {
    id: 'A10003',
    patientId: 'P10078',
    patientName: 'Michael Brown',
    patientAge: 58,
    patientGender: 'Male',
    patientAvatar: null,
    date: '2023-11-20',
    startTime: '13:15',
    endTime: '14:00',
    type: 'in-person',
    status: 'confirmed',
    reason: 'Lab Results Review',
    notes: 'Discuss recent blood work results',
    isNew: true,
    patientPhoto: 'https://randomuser.me/api/portraits/men/22.jpg',
    duration: 60,
    mode: 'in-person'
  },
  {
    id: 'A10004',
    patientId: 'P10045',
    patientName: 'Robert Chen',
    patientAge: 62,
    patientGender: 'Male',
    patientAvatar: null,
    date: '2023-11-20',
    startTime: '15:30',
    endTime: '16:00',
    type: 'phone',
    status: 'pending',
    reason: 'Prescription Renewal',
    notes: null,
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/men/91.jpg',
    duration: 30,
    mode: 'phone'
  },
  {
    id: 'A10005',
    patientId: 'P10062',
    patientName: 'Lisa Garcia',
    patientAge: 45,
    patientGender: 'Female',
    patientAvatar: null,
    date: '2023-11-21',
    startTime: '09:00',
    endTime: '09:30',
    type: 'in-person',
    status: 'confirmed',
    reason: 'Thyroid Check',
    notes: 'Annual thyroid function test review',
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/women/67.jpg',
    duration: 30,
    mode: 'in-person'
  },
  {
    id: 'A10006',
    patientId: 'P10039',
    patientName: 'James Wilson',
    patientAge: 55,
    patientGender: 'Male',
    patientAvatar: null,
    date: '2023-11-21',
    startTime: '11:00',
    endTime: '11:30',
    type: 'in-person',
    status: 'confirmed',
    reason: 'Joint Pain Consultation',
    notes: 'Patient reports increased pain in right knee',
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/men/33.jpg',
    duration: 45,
    mode: 'in-person'
  },
  {
    id: 'A10007',
    patientId: 'P10101',
    patientName: 'Amanda Patel',
    patientAge: 31,
    patientGender: 'Female',
    patientAvatar: null,
    date: '2023-11-21',
    startTime: '14:15',
    endTime: '14:45',
    type: 'video',
    status: 'confirmed',
    reason: 'Skin Condition Follow-up',
    notes: 'Review improvement after prescribed treatment',
    isNew: false,
    patientPhoto: 'https://randomuser.me/api/portraits/women/54.jpg',
    duration: 30,
    mode: 'video'
  },
  {
    id: 'A10008',
    patientId: 'P10092',
    patientName: 'Emily Wilson',
    patientAge: 29,
    patientGender: 'Female',
    patientAvatar: null,
    date: '2023-11-22',
    startTime: '10:00',
    endTime: '10:30',
    type: 'in-person',
    status: 'pending',
    reason: 'Migraines Consultation',
    notes: 'Discuss frequency and triggers',
    isNew: true,
    patientPhoto: 'https://randomuser.me/api/portraits/women/54.jpg',
    duration: 30,
    mode: 'in-person'
  }
];

// Helper function to format time
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Generate days for calendar view
const generateCalendarDays = (date: Date, numDays: number) => {
  const days = [];
  const startDate = new Date(date);
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push(currentDate);
  }
  
  return days;
};

// Get appointment type icon
const getAppointmentTypeIcon = (type: Appointment['type']) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-blue-500" />;
    case 'phone':
      return <Phone className="h-4 w-4 text-indigo-500" />;
    default:
      return <User className="h-4 w-4 text-teal-500" />;
  }
};

// Get appointment status badge
const getStatusBadge = (status: Appointment['status']) => {
  let badgeClasses = "px-2 py-0.5 rounded-full text-xs font-medium";
  
  switch (status) {
    case 'confirmed':
      badgeClasses += " bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      break;
    case 'pending':
      badgeClasses += " bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      break;
    case 'canceled':
      badgeClasses += " bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      break;
    case 'completed':
      badgeClasses += " bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      break;
  }
  
  return (
    <span className={badgeClasses}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function AppointmentsPage() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'list'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  // Time slots for day view (30 minute intervals from 9am to 5pm)
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Format date for calendar header
  const formatCalendarHeaderDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format day for calendar header
  const formatCalendarHeaderDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Navigate to previous or next day/week
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (currentView === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };
  
  // Set current date to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get appointments for the selected date in day view
  const getDayAppointments = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateString);
  };
  
  // Check if a time slot has an appointment in day view
  const getAppointmentForTimeSlot = (date: Date, timeSlot: string) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.find(app => 
      app.date === dateString && 
      app.startTime <= timeSlot && 
      app.endTime > timeSlot
    );
  };
  
  // Calculate appointment duration in 30-min slots for day view
  const getAppointmentDuration = (appointment: Appointment) => {
    const startHour = parseInt(appointment.startTime.split(':')[0]);
    const startMinute = parseInt(appointment.startTime.split(':')[1]);
    const endHour = parseInt(appointment.endTime.split(':')[0]);
    const endMinute = parseInt(appointment.endTime.split(':')[1]);
    
    const startSlot = (startHour - 9) * 2 + (startMinute === 30 ? 1 : 0);
    const endSlot = (endHour - 9) * 2 + (endMinute === 30 ? 1 : 0);
    
    return endSlot - startSlot;
  };
  
  // Calculate appointment position in day view grid
  const getAppointmentStyle = (appointment: Appointment) => {
    const startHour = parseInt(appointment.startTime.split(':')[0]);
    const startMinute = parseInt(appointment.startTime.split(':')[1]);
    const startSlot = (startHour - 9) * 2 + (startMinute === 30 ? 1 : 0);
    
    return {
      gridRowStart: startSlot + 1,
      gridRowEnd: `span ${getAppointmentDuration(appointment)}`
    };
  };
  
  // Get appointments for list view with filtering
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = 
        statusFilter === 'all' || 
        appointment.status === statusFilter;
        
      const matchesType = 
        typeFilter === 'all' || 
        appointment.type === typeFilter;
        
      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      // Sort by date and then time
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  };
  
  // Filter appointments based on selected date and filter
  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const dateMatches = appointment.date.toDateString() === selectedDate.toDateString();
      
      if (filter === 'all') return dateMatches;
      if (filter === 'confirmed') return dateMatches && appointment.status === 'confirmed';
      if (filter === 'pending') return dateMatches && appointment.status === 'pending';
      if (filter === 'canceled') return dateMatches && appointment.status === 'canceled';
      if (filter === 'completed') return dateMatches && appointment.status === 'completed';
      if (filter === 'in-person') return dateMatches && appointment.mode === 'in-person';
      if (filter === 'video') return dateMatches && appointment.mode === 'video';
      if (filter === 'phone') return dateMatches && appointment.mode === 'phone';
      
      return dateMatches;
    });
    
    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, filter]);
  
  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Select a date
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  // Check if a date has appointments
  const hasAppointments = (date: Date) => {
    return appointments.some(appointment => appointment.date.toDateString() === date.toDateString());
  };
  
  // Get appointment mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'in-person':
        return <User className="h-4 w-4 text-gray-500" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  // Render calendar
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Create blank cells for days before first day of month
    const blanks = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      blanks.push(
        <div key={`blank-${i}`} className="h-10 border border-gray-200 dark:border-gray-700"></div>
      );
    }
    
    // Create calendar days
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const hasAppts = hasAppointments(date);
      
      days.push(
        <button
          key={`day-${d}`}
          className={`relative h-10 border ${isToday ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''
          } hover:bg-gray-100 dark:hover:bg-gray-800`}
          onClick={() => handleDateSelect(date)}
        >
          <span className={`text-sm ${isToday ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {d}
          </span>
          {hasAppts && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </button>
      );
    }
    
    // Combine blanks and days
    const totalSlots = [...blanks, ...days];
    let rows: JSX.Element[] = [];
    let cells: JSX.Element[] = [];
    
    totalSlots.forEach((slot, i) => {
      if (i % 7 !== 0) {
        cells.push(slot);
      } else {
        rows.push(<div key={`row-${i}`} className="grid grid-cols-7">{cells}</div>);
        cells = [];
        cells.push(slot);
      }
      if (i === totalSlots.length - 1) {
        rows.push(<div key={`row-${i}`} className="grid grid-cols-7">{cells}</div>);
      }
    });
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={previousMonth}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{day}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-px">
          {rows}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            + New Appointment
          </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          {renderCalendar()}
          
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Filter Appointments</h3>
            <div className="space-y-2">
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Appointments</option>
                <optgroup label="Status">
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
              <option value="completed">Completed</option>
                </optgroup>
                <optgroup label="Type">
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </optgroup>
            </select>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h2>
      </div>
      
            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No appointments scheduled for this day.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAppointments.map((appointment) => (
                  <li key={appointment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={appointment.patientPhoto} 
                          alt={appointment.patientName} 
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{appointment.patientName}</h3>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{appointment.startTime} - {appointment.endTime} ({appointment.duration} min)</span>
                            <span className="mx-2">•</span>
                            <span>{appointment.type}</span>
                            <span className="mx-2">•</span>
                            <div className="flex items-center">
                              {getModeIcon(appointment.mode)}
                              <span className="ml-1 capitalize">{appointment.mode}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <div className="flex space-x-1">
                          {appointment.status !== 'canceled' && appointment.status !== 'completed' && (
                            <>
                              <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                <XCircle className="h-4 w-4" />
                          </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2 ml-14">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic flex items-start">
                          <AlertCircle className="h-3 w-3 mr-1 mt-0.5 text-yellow-500" />
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
                )}
              </div>
            </div>
          </div>
    </div>
  );
} 