"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes 
} from 'react-icons/fa';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationToastProps {
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number; // in milliseconds, default 4000
  onClose?: () => void;
  isVisible: boolean;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  message,
  description,
  duration = 4000,
  onClose,
  isVisible
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsClosing(false);
      
      // Auto close after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, duration]);

  // Handle close animation and then call onClose prop
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      if (onClose) onClose();
    }, 300); // animation duration
  };

  // Don't render if not visible
  if (!shouldRender) return null;

  // Set icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-xl" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: 'text-green-700',
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          icon: <FaExclamationCircle className="text-xl" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-700',
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle className="text-xl" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-700',
          iconColor: 'text-yellow-500'
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle className="text-xl" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-700',
          iconColor: 'text-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 transform ${
        isClosing ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className={`${styles.bgColor} ${styles.borderColor} border-l-4 rounded-md shadow-md p-4 flex items-start`}>
        <div className={`mr-3 ${styles.iconColor}`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${styles.textColor}`}>{message}</h3>
          {description && (
            <p className="text-sm mt-1 text-gray-600">{description}</p>
          )}
        </div>
        <button 
          onClick={handleClose}
          className="ml-4 text-gray-400 hover:text-gray-700 focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast; 