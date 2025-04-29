'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, FaPills, FaCalendarAlt, FaFlask, FaHeartbeat, 
  FaBell, FaClock, FaRegCalendarAlt, FaCheckCircle, FaEdit, 
  FaTrashAlt, FaHistory, FaExclamationTriangle
} from 'react-icons/fa';
import { ReminderService, Reminder } from '@/app/lib/services/reminder-service';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import NotificationToast from '@/app/components/NotificationToast';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

const ReminderDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const reminderId = params.id as string;
  
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as NotificationType,
    message: '',
  });

  // Fetch reminder details
  useEffect(() => {
    const fetchReminderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reminders/${reminderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reminder details');
        }
        
        const data = await response.json();
        setReminder(data.reminder);
      } catch (err) {
        console.error('Error fetching reminder details:', err);
        setError('Failed to load reminder details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (reminderId) {
      fetchReminderDetails();
    }
  }, [reminderId]);

  const handleMarkAsCompleted = async () => {
    try {
      const success = await ReminderService.markAsCompleted(reminderId);
      
      if (success) {
        // Update the reminder in the state
        setReminder(prev => prev ? { ...prev, status: 'completed' } : null);
        
        // Show success notification
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Reminder marked as completed',
        });
      } else {
        throw new Error('Failed to mark reminder as completed');
      }
    } catch (err) {
      console.error('Error marking reminder as completed:', err);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Failed to mark reminder as completed',
      });
    }
  };

  const handleSnoozeReminder = async () => {
    try {
      const success = await ReminderService.snoozeReminder(reminderId, 30);
      
      if (success) {
        // Update the reminder in the state
        setReminder(prev => prev ? { ...prev, status: 'snoozed' } : null);
        
        // Show success notification
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Reminder snoozed for 30 minutes',
        });
      } else {
        throw new Error('Failed to snooze reminder');
      }
    } catch (err) {
      console.error('Error snoozing reminder:', err);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Failed to snooze reminder',
      });
    }
  };

  const handleDeleteReminder = async () => {
    try {
      setIsDeleting(true);
      const success = await ReminderService.deleteReminder(reminderId);
      
      if (success) {
        // Show success notification
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Reminder deleted successfully',
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/reminders');
        }, 1500);
      } else {
        throw new Error('Failed to delete reminder');
      }
    } catch (err) {
      console.error('Error deleting reminder:', err);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Failed to delete reminder',
      });
      setIsDeleting(false);
    }
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <FaPills className="text-purple-500" />;
      case 'appointment':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'test':
        return <FaFlask className="text-green-500" />;
      case 'vitals':
        return <FaHeartbeat className="text-red-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  const formatTime = (time: string) => {
    // Format time from 24-hour to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
            <FaCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'snoozed':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center">
            <FaClock className="mr-1" /> Snoozed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
            <FaBell className="mr-1" /> Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LoadingSpinner text="Loading reminder details..." />
        </div>
      </div>
    );
  }

  if (error || !reminder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-500">
            <p>{error || 'Reminder not found'}</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Try Again
              </button>
              <Link 
                href="/dashboard/reminders" 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
              >
                Back to Reminders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link href="/dashboard/reminders" className="text-gray-500 hover:text-gray-700 mr-4">
              <FaArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Reminder Details</h1>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  {getReminderIcon(reminder.reminder_type)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{reminder.title}</h2>
                  <div className="text-sm text-gray-500 capitalize">
                    {reminder.reminder_type} Reminder
                  </div>
                </div>
              </div>
              
              {reminder.description && (
                <div className="mb-6">
                  <h3 className="text-gray-700 font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{reminder.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-gray-700 font-medium mb-2">Status</h3>
                  {getStatusBadge(reminder.status)}
                </div>
                
                <div>
                  <h3 className="text-gray-700 font-medium mb-2">Time</h3>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    {formatTime(reminder.time)}
                  </div>
                </div>
                
                {reminder.date && (
                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">Date</h3>
                    <div className="flex items-center text-gray-600">
                      <FaRegCalendarAlt className="mr-2" />
                      {new Date(reminder.date).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-gray-700 font-medium mb-2">Recurring</h3>
                  <div className="text-gray-600">
                    {reminder.recurring ? (
                      <div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Yes
                        </span>
                        {reminder.frequency && (
                          <span className="ml-2 text-gray-500">
                            ({reminder.frequency})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm">
                        No
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {reminder.recurring && reminder.frequency === 'custom' && reminder.custom_frequency?.days && reminder.custom_frequency.days.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gray-700 font-medium mb-2">Custom Schedule</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                      reminder.custom_frequency?.days?.includes(index) && (
                        <span key={day} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {day}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-2">Created</h3>
                <div className="text-gray-600">
                  {reminder.created_at ? new Date(reminder.created_at).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>
            
            <div className="md:ml-8 md:w-64 mt-6 md:mt-0">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  {reminder.status !== 'completed' && (
                    <button 
                      onClick={handleMarkAsCompleted}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700"
                    >
                      <FaCheckCircle className="mr-2" />
                      Mark as Completed
                    </button>
                  )}
                  
                  {reminder.status === 'pending' && (
                    <button 
                      onClick={handleSnoozeReminder}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md flex items-center justify-center hover:bg-yellow-600"
                    >
                      <FaClock className="mr-2" />
                      Snooze (30 min)
                    </button>
                  )}
                  
                  <Link 
                    href={`/dashboard/reminders/${reminderId}/edit`}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700"
                  >
                    <FaEdit className="mr-2" />
                    Edit Reminder
                  </Link>
                  
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md flex items-center justify-center hover:bg-red-200"
                  >
                    <FaTrashAlt className="mr-2" />
                    Delete Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <FaExclamationTriangle className="text-xl mr-2" />
              <h3 className="text-lg font-medium">Delete Reminder</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this reminder? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteReminder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification toast */}
      <NotificationToast
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default ReminderDetailPage; 