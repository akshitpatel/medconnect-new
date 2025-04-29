'use client';

import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import { Notification } from '@/app/lib/models/notification';
import { FaBell, FaCheckDouble, FaSpinner } from 'react-icons/fa';

interface NotificationListProps {
  limit?: number;
  className?: string;
}

/**
 * NotificationList component
 * Displays a list of notifications with loading and empty states
 */
const NotificationList: React.FC<NotificationListProps> = ({ 
  limit = 10, 
  className = '' 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch notifications
  const fetchNotifications = async (pageNum: number = 1, replace: boolean = true) => {
    try {
      setLoading(true);
      const skip = (pageNum - 1) * limit;
      const response = await fetch(`/api/notifications?limit=${limit}&skip=${skip}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      
      if (replace) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }
      
      setTotalCount(data.total);
      setUnreadCount(data.unread);
      setHasMore(pageNum < data.pages);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, false);
    }
  };

  // Mark a notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'mark_read' })
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id?.toString() === id 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Delete a notification
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      const deletedNotification = notifications.find(
        n => n._id?.toString() === id
      );
      
      setNotifications(prev => 
        prev.filter(notification => notification._id?.toString() !== id)
      );
      
      setTotalCount(prev => Math.max(0, prev - 1));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every minute
    const intervalId = setInterval(() => {
      fetchNotifications(1, true);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Render empty state
  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FaBell className="h-12 w-12 text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-700">No notifications</h3>
      <p className="text-sm text-gray-500 mt-1">
        You don't have any notifications at the moment.
      </p>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="text-center p-4 text-red-500">
      <p>{error}</p>
      <button 
        onClick={() => fetchNotifications()} 
        className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">
          Notifications
          {totalCount > 0 && (
            <span className="ml-2 text-sm text-gray-500">({totalCount})</span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm py-1 px-3 flex items-center bg-teal-50 hover:bg-teal-100 text-teal-700 rounded transition-colors"
          >
            <FaCheckDouble className="h-3 w-3 mr-1" /> Mark all as read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[500px] overflow-y-auto">
        {error ? (
          renderError()
        ) : notifications.length === 0 && !loading ? (
          renderEmpty()
        ) : (
          <div>
            {notifications.map(notification => (
              <NotificationItem 
                key={notification._id?.toString()}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
            
            {/* Load more button */}
            {hasMore && (
              <div className="p-3 text-center">
                <button 
                  onClick={loadMore} 
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="inline-block h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
            
            {/* Initial loading state */}
            {loading && notifications.length === 0 && (
              <div className="flex justify-center items-center p-8">
                <FaSpinner className="h-8 w-8 text-teal-500 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList; 