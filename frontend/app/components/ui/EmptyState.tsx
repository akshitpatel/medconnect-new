import React from 'react';
import Link from 'next/link';
import { cn } from '@/app/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLink?: string;
  actionLabel?: string;
  actionOnClick?: () => void;
  className?: string;
}

/**
 * EmptyState component for displaying a message when no data is available
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLink,
  actionLabel,
  actionOnClick,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-6 text-center", className)}>
      {icon && (
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {(actionLink || actionOnClick) && (
        <div className="mt-6">
          {actionLink ? (
            <Link
              href={actionLink}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={actionOnClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 