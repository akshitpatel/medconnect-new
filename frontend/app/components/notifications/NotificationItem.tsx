'use client';

import React from 'react';
import Link from 'next/link';
import { FaCheck, FaTrash, FaBell, FaCalendarCheck, FaFileMedical, FaKey, FaExclamationCircle } from 'react-icons/fa';
import { Notification, NotificationType } from '@/app/lib/models/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Get the appropriate icon for a notification type
 */
const getIconForType = (type: NotificationType) => {
  switch (type) {
    case 'appointment_confirmation':
    case 'appointment_reminder':
    case 'appointment_cancellation':
      return <FaCalendarCheck className="h-5 w-5 text-teal-500" />;
    case 'result_available':
    case 'result_viewed':
      return <FaFileMedical className="h-5 w-5 text-blue-500" />;
    case 'passport_access':
      return <FaKey className="h-5 w-5 text-purple-500" />;
    case 'system_alert':
      return <FaExclamationCircle className="h-5 w-5 text-amber-500" />;
    default:
      return <FaBell className="h-5 w-5 text-gray-500" />;
  }
};

/**
 * Get the relative time string from a date
 */
const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
};

/**
 * NotificationItem component
 * Displays a single notification with actions
 */
const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const { _id, title, message, created_at, is_read, action_url, type } = notification;
  const notificationId = _id ? _id.toString() : '';
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!is_read && notificationId) {
      onMarkAsRead(notificationId);
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (notificationId) {
      onDelete(notificationId);
    }
  };
  
  const content = (
    <div 
      className={`flex items-start p-4 border-b hover:bg-gray-50 transition-colors ${!is_read ? 'bg-blue-50' : ''}`}
    >
      <div className="flex-shrink-0 mr-3 mt-1">
        {getIconForType(type)}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-semibold ${!is_read ? 'text-black' : 'text-gray-700'}`}>
            {title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {getRelativeTimeString(created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 break-words">
          {message}
        </p>
        <div className="flex mt-2 space-x-2">
          {!is_read && (
            <button 
              onClick={handleMarkAsRead}
              className="text-xs py-1 px-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded flex items-center transition-colors"
              title="Mark as read"
            >
              <FaCheck className="h-3 w-3 mr-1" /> Mark as read
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center transition-colors"
            title="Delete notification"
          >
            <FaTrash className="h-3 w-3 mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
  
  if (action_url) {
    return (
      <Link href={action_url} className="block">
        {content}
      </Link>
    );
  }
  
  return <div>{content}</div>;
};

export default NotificationItem; 