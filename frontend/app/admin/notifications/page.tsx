'use client';

import { useState, useEffect } from 'react';
import { Bell, Filter, ChevronDown, Search, CheckCircle, AlertTriangle, Info, Shield, Calendar, User, MessageSquare, Settings } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'security' | 'user' | 'appointment' | 'message';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not-001',
    title: 'System Update Scheduled',
    message: 'A system update is scheduled for 2:00 AM tomorrow. Expected downtime: 15 minutes.',
    type: 'system',
    priority: 'medium',
    timestamp: '2023-05-15T10:30:00Z',
    isRead: false
  },
  {
    id: 'not-002',
    title: 'New User Registration',
    message: 'Dr. Emily Wilson has registered as a new provider.',
    type: 'user',
    priority: 'low',
    timestamp: '2023-05-15T09:15:00Z',
    isRead: false
  },
  {
    id: 'not-003',
    title: 'Security Alert',
    message: 'Multiple failed login attempts detected from IP 192.168.1.1',
    type: 'security',
    priority: 'high',
    timestamp: '2023-05-15T08:45:00Z',
    isRead: true
  },
  {
    id: 'not-004',
    title: 'Appointment Cancellation',
    message: 'Patient John Doe has cancelled their appointment scheduled for May 16th, 2:30 PM',
    type: 'appointment',
    priority: 'medium',
    timestamp: '2023-05-15T07:20:00Z',
    isRead: false
  },
  {
    id: 'not-005',
    title: 'New Message',
    message: 'You have a new message from Dr. Sarah Johnson regarding patient referral',
    type: 'message',
    priority: 'medium',
    timestamp: '2023-05-14T16:45:00Z',
    isRead: true
  },
  {
    id: 'not-006',
    title: 'Storage Space Alert',
    message: 'System storage is reaching 85% capacity. Consider cleaning up old records.',
    type: 'system',
    priority: 'high',
    timestamp: '2023-05-14T14:30:00Z',
    isRead: true
  },
  {
    id: 'not-007',
    title: 'New User Registration',
    message: 'Patient Maria Garcia has completed registration',
    type: 'user',
    priority: 'low',
    timestamp: '2023-05-14T11:20:00Z',
    isRead: true
  },
  {
    id: 'not-008',
    title: 'Security Certificate Expiring',
    message: 'SSL Certificate will expire in 15 days. Please renew.',
    type: 'security',
    priority: 'high',
    timestamp: '2023-05-14T10:15:00Z',
    isRead: false
  },
  {
    id: 'not-009',
    title: 'Server Performance',
    message: 'Database queries are running slower than usual. Investigation recommended.',
    type: 'system',
    priority: 'medium',
    timestamp: '2023-05-13T19:10:00Z',
    isRead: true
  },
  {
    id: 'not-010',
    title: 'Appointment Request',
    message: 'New appointment request from patient Robert Brown for May 20th',
    type: 'appointment',
    priority: 'low',
    timestamp: '2023-05-13T15:45:00Z',
    isRead: true
  }
];

type NotificationType = 'all' | 'system' | 'security' | 'user' | 'appointment' | 'message';
type NotificationPriority = 'all' | 'high' | 'medium' | 'low';
type NotificationStatus = 'all' | 'read' | 'unread';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [typeFilter, setTypeFilter] = useState<NotificationType>('all');
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority>('all');
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>('all');
  
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to get notifications
    const timer = setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setFilteredNotifications(MOCK_NOTIFICATIONS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters when they change
    let results = notifications;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(notification => 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(notification => notification.type === typeFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      results = results.filter(notification => notification.priority === priorityFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(notification => 
        statusFilter === 'read' ? notification.isRead : !notification.isRead
      );
    }
    
    setFilteredNotifications(results);
  }, [searchTerm, typeFilter, priorityFilter, statusFilter, notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'system':
        return <Settings className="h-5 w-5 text-blue-500" />;
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'user':
        return <User className="h-5 w-5 text-green-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="mr-2 text-teal-500" />
          Notifications
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.filter(n => !n.isRead).length} unread
          </span>
          <button 
            onClick={markAllAsRead}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
            disabled={notifications.every(n => n.isRead)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </button>
        </div>
      </div>

      <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setTypeMenuOpen(!typeMenuOpen);
                setPriorityMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                <span>Type: {typeFilter === 'all' ? 'All' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {typeMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {['all', 'system', 'security', 'user', 'appointment', 'message'].map((type) => (
                  <div
                    key={type}
                    onClick={() => {
                      setTypeFilter(type as NotificationType);
                      setTypeMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      typeFilter === type ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setPriorityMenuOpen(!priorityMenuOpen);
                setTypeMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-gray-400" />
                <span>Priority: {priorityFilter === 'all' ? 'All' : priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {priorityMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {['all', 'high', 'medium', 'low'].map((priority) => (
                  <div
                    key={priority}
                    onClick={() => {
                      setPriorityFilter(priority as NotificationPriority);
                      setPriorityMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      priorityFilter === priority ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Read/Unread Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusMenuOpen(!statusMenuOpen);
                setTypeMenuOpen(false);
                setPriorityMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-gray-400" />
                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {statusMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {['all', 'read', 'unread'].map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      setStatusFilter(status as NotificationStatus);
                      setStatusMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      statusFilter === status ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No notifications found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border ${
                  !notification.isRead 
                    ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-900/20' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                } transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center space-x-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(notification.timestamp)}
                        </span>
                        {getPriorityBadge(notification.priority)}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {!notification.isRead && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      title="Delete notification"
                    >
                      <span className="sr-only">Delete</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedCard>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredNotifications.length} of {notifications.length} notifications
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