'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

interface NotificationBadgeProps {
  className?: string;
}

/**
 * NotificationBadge component
 * Displays a bell icon with a badge showing unread notification count
 */
const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications?read=false&limit=1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        setUnreadCount(data.unread || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching notification count:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Link 
      href="/notifications" 
      className={`relative inline-flex items-center p-2 hover:bg-gray-100 rounded-full transition-colors ${className}`}
      title={loading ? 'Loading notifications...' : error ? error : `${unreadCount} unread notifications`}
    >
      <FaBell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs flex items-center justify-center min-w-[18px] h-[18px] px-1">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge; 