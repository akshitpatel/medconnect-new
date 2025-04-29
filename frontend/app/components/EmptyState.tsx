import React, { ReactNode } from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { FaInbox } from 'react-icons/fa';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FaInbox className="text-gray-300" size={36} />,
  actionText,
  actionLink,
  onActionClick,
  children,
  className = '',
}) => {
  return (
    <div className={`text-center py-8 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-500 mb-4 mx-auto max-w-md px-4">{description}</p>
      )}
      
      {actionText && actionLink && (
        <Link 
          href={actionLink} 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </Link>
      )}
      
      {actionText && onActionClick && (
        <button 
          onClick={onActionClick} 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </button>
      )}
      
      {children}
    </div>
  );
};

export default EmptyState; 