'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import NotificationBadge from './NotificationBadge';
import NotificationList from './NotificationList';

interface NotificationDropdownProps {
  className?: string;
}

/**
 * NotificationDropdown component
 * Displays a dropdown with notifications that can be integrated into the header
 */
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Notification Badge/Icon */}
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        aria-label="Open notifications"
      >
        <NotificationBadge />
      </button>
      
      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 origin-top-right">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden ring-1 ring-black ring-opacity-5">
            {/* Dropdown Header */}
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close notifications"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              <NotificationList limit={5} />
            </div>
            
            {/* Dropdown Footer */}
            <div className="p-3 text-center border-t bg-gray-50">
              <Link 
                href="/notifications" 
                className="text-sm text-teal-600 hover:text-teal-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 