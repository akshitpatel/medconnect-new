'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaPlus, FaFilter, FaSort, FaSearch, FaPills, FaCalendarAlt, 
  FaFlask, FaHeartbeat, FaBell, FaCheck, FaClock, FaHourglass
} from 'react-icons/fa';
import { ReminderService, Reminder } from '@/app/lib/services/reminder-service';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import EmptyState from '@/app/components/EmptyState';

const RemindersPage: React.FC = () => {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const data = await ReminderService.getAllReminders();
        setReminders(data);
      } catch (err) {
        console.error('Error fetching reminders:', err);
        setError('Failed to load reminders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <FaPills className="text-blue-500" />;
      case 'appointment':
        return <FaCalendarAlt className="text-green-500" />;
      case 'test':
        return <FaFlask className="text-purple-500" />;
      case 'vitals':
        return <FaHeartbeat className="text-red-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-blue-500" />;
      case 'snoozed':
        return <FaHourglass className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Handle HH:MM format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }
    
    return timeString;
  };

  const getRecurrenceText = (reminder: Reminder) => {
    if (!reminder.recurring) return 'One-time';
    
    switch (reminder.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'custom':
        if (reminder.custom_frequency?.days?.length) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const days = reminder.custom_frequency.days
            .map(day => dayNames[day])
            .join(', ');
          return `Custom (${days})`;
        }
        return 'Custom';
      default:
        return reminder.frequency || '';
    }
  };

  const filteredReminders = reminders
    .filter(reminder => {
      // Filter by search term
      const matchesSearch = 
        searchTerm === '' || 
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reminder.description && reminder.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status
      const matchesStatus = 
        filterStatus === 'all' || 
        reminder.status === filterStatus;
      
      // Filter by type
      const matchesType = 
        filterType === 'all' || 
        reminder.reminder_type === filterType;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.reminder_type.localeCompare(b.reminder_type)
          : b.reminder_type.localeCompare(a.reminder_type);
      } else if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === 'date') {
        // For recurring reminders without a date, use a far future date for sorting
        const dateA = a.recurring && !a.date ? '9999-12-31' : (a.date as string) || '9999-12-31';
        const dateB = b.recurring && !b.date ? '9999-12-31' : (b.date as string) || '9999-12-31';
        
        return sortOrder === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      } else if (sortBy === 'time') {
        return sortOrder === 'asc'
          ? (a.time || '').localeCompare(b.time || '')
          : (b.time || '').localeCompare(a.time || '');
      }
      
      // Default sort by date
      return 0;
    });

  const toggleSortOrder = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LoadingSpinner text="Loading reminders..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Health Reminders</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              <Link
                href="/dashboard/reminders/add"
                className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Add Reminder
              </Link>
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSortOrder(sortBy)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200"
              >
                <FaSort className="mr-2" />
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
                <option value="status">Sort by Status</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Filter by Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'completed', 'snoozed'].map(status => (
                      <button
                        key={status}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filterStatus === status
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilterStatus(status)}
                      >
                        {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Filter by Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'medication', 'appointment', 'test', 'vitals', 'other'].map(type => (
                      <button
                        key={type}
                        className={`px-3 py-1 rounded-full text-sm ${
                          filterType === type
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilterType(type)}
                      >
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Reminders list */}
        <div className="p-6">
          {filteredReminders.length === 0 ? (
            <EmptyState
              title="No reminders found"
              description={
                searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? "Try adjusting your filters or search term"
                  : "You don't have any reminders yet. Create your first reminder to get started."
              }
              icon={<FaBell className="text-gray-400" size={40} />}
              actionText="Add Reminder"
              actionLink="/dashboard/reminders/add"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSortOrder('title')}
                    >
                      Title
                      {sortBy === 'title' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSortOrder('date')}
                    >
                      Date/Recurrence
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSortOrder('time')}
                    >
                      Time
                      {sortBy === 'time' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSortOrder('status')}
                    >
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReminders.map((reminder) => (
                    <tr 
                      key={reminder._id?.toString()} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/reminders/${reminder._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getReminderTypeIcon(reminder.reminder_type)}
                          <span className="ml-2 text-sm text-gray-500 hidden md:inline">
                            {reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{reminder.title}</div>
                        {reminder.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {reminder.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reminder.recurring ? (
                            <span className="text-blue-600">{getRecurrenceText(reminder)}</span>
                          ) : (
                            formatDate(reminder.date as string)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatTime(reminder.time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(reminder.status)}
                          <span className={`ml-2 text-sm ${
                            reminder.status === 'completed' ? 'text-green-600' :
                            reminder.status === 'pending' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/reminders/${reminder._id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/reminders/${reminder._id}`}
                          className="text-gray-600 hover:text-gray-900"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemindersPage; 