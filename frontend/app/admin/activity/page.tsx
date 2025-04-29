'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Clock, User, Calendar, FileText, Pill, HeartPulse, Clipboard, Activity } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import Link from 'next/link';

interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  action: string;
  category: 'login' | 'appointment' | 'record' | 'prescription' | 'test' | 'other';
  details: string;
  timestamp: string;
}

const MOCK_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-001',
    userId: 'user-123',
    userName: 'Dr. Emily Johnson',
    userRole: 'doctor',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    action: 'logged in',
    category: 'login',
    details: 'Successful login from IP 192.168.1.101',
    timestamp: '2023-05-15T10:30:00Z'
  },
  {
    id: 'act-002',
    userId: 'user-456',
    userName: 'John Smith',
    userRole: 'patient',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    action: 'scheduled appointment',
    category: 'appointment',
    details: 'Scheduled a follow-up visit for May 20th, 2:30 PM with Dr. Johnson',
    timestamp: '2023-05-15T10:15:00Z'
  },
  {
    id: 'act-003',
    userId: 'user-789',
    userName: 'Nurse Wilson',
    userRole: 'nurse',
    userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    action: 'updated record',
    category: 'record',
    details: 'Updated vital signs for patient #12345',
    timestamp: '2023-05-15T09:45:00Z'
  },
  {
    id: 'act-004',
    userId: 'user-234',
    userName: 'Dr. Robert Chen',
    userRole: 'doctor',
    userAvatar: 'https://randomuser.me/api/portraits/men/64.jpg',
    action: 'created prescription',
    category: 'prescription',
    details: 'Prescribed Amoxicillin 500mg for patient #67890',
    timestamp: '2023-05-15T09:30:00Z'
  },
  {
    id: 'act-005',
    userId: 'user-567',
    userName: 'Lab Tech Sarah',
    userRole: 'technician',
    userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    action: 'uploaded test results',
    category: 'test',
    details: 'Uploaded blood work results for patient #23456',
    timestamp: '2023-05-15T09:15:00Z'
  },
  {
    id: 'act-006',
    userId: 'user-890',
    userName: 'Admin David',
    userRole: 'administrator',
    userAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
    action: 'reset password',
    category: 'other',
    details: 'Reset password for user #34567',
    timestamp: '2023-05-15T09:00:00Z'
  },
  {
    id: 'act-007',
    userId: 'user-135',
    userName: 'Mary Williams',
    userRole: 'patient',
    userAvatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    action: 'cancelled appointment',
    category: 'appointment',
    details: 'Cancelled appointment scheduled for May 17th, 10:00 AM',
    timestamp: '2023-05-15T08:45:00Z'
  },
  {
    id: 'act-008',
    userId: 'user-246',
    userName: 'Dr. James Wilson',
    userRole: 'doctor',
    userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    action: 'viewed record',
    category: 'record',
    details: 'Accessed medical records for patient #78901',
    timestamp: '2023-05-15T08:30:00Z'
  },
  {
    id: 'act-009',
    userId: 'user-357',
    userName: 'Pharmacist Lisa',
    userRole: 'pharmacist',
    userAvatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    action: 'filled prescription',
    category: 'prescription',
    details: 'Filled prescription #12345 for patient #89012',
    timestamp: '2023-05-15T08:15:00Z'
  },
  {
    id: 'act-010',
    userId: 'user-468',
    userName: 'Robert Johnson',
    userRole: 'patient',
    userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    action: 'logged in',
    category: 'login',
    details: 'Successful login from mobile device',
    timestamp: '2023-05-15T08:00:00Z'
  },
  {
    id: 'act-011',
    userId: 'user-579',
    userName: 'Nurse Thompson',
    userRole: 'nurse',
    userAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    action: 'scheduled test',
    category: 'test',
    details: 'Scheduled MRI scan for patient #90123',
    timestamp: '2023-05-14T17:45:00Z'
  },
  {
    id: 'act-012',
    userId: 'user-680',
    userName: 'System',
    userRole: 'system',
    action: 'performed backup',
    category: 'other',
    details: 'Daily database backup completed successfully',
    timestamp: '2023-05-14T02:00:00Z'
  }
];

const categories = ['all', 'login', 'appointment', 'record', 'prescription', 'test', 'other'];
const roles = ['all', 'doctor', 'nurse', 'patient', 'administrator', 'pharmacist', 'technician', 'system'];

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });

  useEffect(() => {
    // Simulate API call to get activities
    const timer = setTimeout(() => {
      setActivities(MOCK_ACTIVITIES);
      setFilteredActivities(MOCK_ACTIVITIES);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters when they change
    let results = activities;
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(activity => 
        activity.userName.toLowerCase().includes(lowercasedTerm) ||
        activity.userId.toLowerCase().includes(lowercasedTerm) ||
        activity.action.toLowerCase().includes(lowercasedTerm) ||
        activity.details.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(activity => activity.category === categoryFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      results = results.filter(activity => activity.userRole === roleFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      results = results.filter(activity => new Date(activity.timestamp) >= startDate);
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      results = results.filter(activity => new Date(activity.timestamp) <= endDate);
    }
    
    setFilteredActivities(results);
  }, [searchTerm, categoryFilter, roleFilter, dateRange, activities]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getGroupedActivitiesByDate = () => {
    const groups: { [key: string]: ActivityEvent[] } = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(activity);
    });
    
    // Sort each group by timestamp (newest first)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
    
    return groups;
  };

  const getActivityIcon = (category: string) => {
    switch(category) {
      case 'login':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'record':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'prescription':
        return <Pill className="h-5 w-5 text-red-500" />;
      case 'test':
        return <HeartPulse className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clipboard className="h-5 w-5 text-gray-500" />;
    }
  };

  const closeAllMenus = () => {
    setCategoryMenuOpen(false);
    setRoleMenuOpen(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Activity</h1>
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

  const groupedActivities = getGroupedActivitiesByDate();
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Activity className="mr-2 text-teal-500" />
          User Activity
        </h1>
      </div>

      <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setCategoryMenuOpen(!categoryMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                <span>Category: {categoryFilter === 'all' ? 'All' : categoryFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {categoryMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category}
                    onClick={() => {
                      setCategoryFilter(category);
                      setCategoryMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      categoryFilter === category ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setCategoryMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-400" />
                <span>Role: {roleFilter === 'all' ? 'All' : roleFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {roleMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1 max-h-60 overflow-y-auto">
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      roleFilter === role ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setRoleFilter('all');
                setDateRange({ start: null, end: null });
                closeAllMenus();
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={dateRange.start || ''}
              onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={dateRange.end || ''}
              onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-10">
            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No activities found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map(date => (
              <div key={date} className="space-y-4">
                <h3 className="text-md font-medium text-gray-500 dark:text-gray-400 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-6 pl-6">
                  {groupedActivities[date].map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-9 mt-1.5 h-5 w-5 rounded-full bg-white dark:bg-gray-800 border-2 border-teal-500"></div>
                      <div className="flex items-start space-x-4">
                        <div className="min-w-0 flex-1 pb-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {activity.userAvatar ? (
                                <img 
                                  src={activity.userAvatar} 
                                  alt={activity.userName} 
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
                                  <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                </div>
                              )}
                              <div>
                                <Link 
                                  href={`/admin/users/${activity.userId}`} 
                                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400"
                                >
                                  {activity.userName}
                                </Link>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {activity.userRole.charAt(0).toUpperCase() + activity.userRole.slice(1)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {formatDate(activity.timestamp)}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <span className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm">
                              <span className="mr-2">{getActivityIcon(activity.category)}</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{activity.action}</span>
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {activity.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredActivities.length} of {activities.length} activities
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 