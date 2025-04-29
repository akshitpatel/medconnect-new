import React from 'react';
import { Metadata } from 'next';
import NotificationList from '@/app/components/notifications/NotificationList';
import Link from 'next/link';
import { FaCog, FaBell } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Notifications | MedConnect',
  description: 'Manage your notifications and stay updated with your healthcare journey.',
};

/**
 * NotificationsPage component
 * Displays all user notifications and provides access to notification settings
 */
export default function NotificationsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBell className="mr-2 text-teal-600" /> Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your appointments, test results, and important healthcare information.
            </p>
          </div>
          <Link
            href="/notifications/settings"
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FaCog className="mr-2" /> Settings
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <NotificationList limit={20} className="min-h-[400px]" />
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-2">About Notifications</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>You'll receive notifications for appointment confirmations, reminders, and updates.</li>
            <li>Test and imaging results are notified as soon as they become available.</li>
            <li>System notifications inform you about maintenance and new features.</li>
            <li>You can customize your notification preferences in the Settings page.</li>
          </ul>
          <div className="mt-4 text-sm text-gray-500">
            Not receiving notifications? Check your notification settings or contact support.
          </div>
        </div>
      </div>
    </main>
  );
} 