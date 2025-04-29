'use client';

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

/**
 * NotificationSettings interface
 * Represents user notification preferences
 */
interface NotificationSettings {
  appointments: {
    email: boolean;
    inApp: boolean;
  };
  results: {
    email: boolean;
    inApp: boolean;
  };
  reminders: {
    email: boolean;
    inApp: boolean;
  };
  system: {
    email: boolean;
    inApp: boolean;
  };
}

/**
 * NotificationSettingsForm component
 * Form for managing notification preferences with auto-save functionality
 */
const NotificationSettingsForm: React.FC = () => {
  // State for settings
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: { email: true, inApp: true },
    results: { email: true, inApp: true },
    reminders: { email: true, inApp: true },
    system: { email: false, inApp: true }
  });
  
  // UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications/settings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notification settings');
        }
        
        const data = await response.json();
        setSettings(data.settings);
        setError(null);
      } catch (err) {
        console.error('Error fetching notification settings:', err);
        setError('Failed to load your notification settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  // Save settings with debounce
  useEffect(() => {
    if (loading) return; // Skip initial load
    
    const saveSettings = async () => {
      try {
        setSaving(true);
        setSaveStatus('idle');
        
        const response = await fetch('/api/notifications/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ settings })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save notification settings');
        }
        
        setSaveStatus('success');
        setError(null);
        
        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } catch (err) {
        console.error('Error saving notification settings:', err);
        setSaveStatus('error');
        setError('Failed to save your settings. Please try again.');
      } finally {
        setSaving(false);
      }
    };
    
    // Debounce save operation
    const debounceTimer = setTimeout(() => {
      saveSettings();
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [settings, loading]);

  // Handle setting toggle
  const handleToggle = (category: keyof NotificationSettings, channel: 'email' | 'inApp') => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
  };

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="mb-6">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              <div className="h-6 bg-gray-200 rounded-full w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Save Status Indicator */}
      {(saving || saveStatus !== 'idle') && (
        <div className={`mb-4 p-2 rounded-md flex items-center text-sm ${
          saveStatus === 'error' ? 'bg-red-50 text-red-700' : 
          saveStatus === 'success' ? 'bg-green-50 text-green-700' : 
          'bg-gray-50 text-gray-700'
        }`}>
          {saving && <FaSpinner className="animate-spin mr-2" />}
          {saveStatus === 'success' && <FaCheckCircle className="mr-2" />}
          {saveStatus === 'error' && <FaExclamationCircle className="mr-2" />}
          {saving ? 'Saving changes...' : 
           saveStatus === 'success' ? 'Settings saved successfully' : 
           saveStatus === 'error' ? error || 'Failed to save settings' : ''}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
      
      {/* Appointments */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Appointments</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="appointments-email" className="text-gray-600">
              Email Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="appointments-email"
                className="opacity-0 w-0 h-0"
                checked={settings.appointments.email}
                onChange={() => handleToggle('appointments', 'email')}
              />
              <label
                htmlFor="appointments-email"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.appointments.email ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.appointments.email ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="appointments-inapp" className="text-gray-600">
              In-App Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="appointments-inapp"
                className="opacity-0 w-0 h-0"
                checked={settings.appointments.inApp}
                onChange={() => handleToggle('appointments', 'inApp')}
              />
              <label
                htmlFor="appointments-inapp"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.appointments.inApp ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.appointments.inApp ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Test & Imaging Results</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="results-email" className="text-gray-600">
              Email Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="results-email"
                className="opacity-0 w-0 h-0"
                checked={settings.results.email}
                onChange={() => handleToggle('results', 'email')}
              />
              <label
                htmlFor="results-email"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.results.email ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.results.email ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="results-inapp" className="text-gray-600">
              In-App Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="results-inapp"
                className="opacity-0 w-0 h-0"
                checked={settings.results.inApp}
                onChange={() => handleToggle('results', 'inApp')}
              />
              <label
                htmlFor="results-inapp"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.results.inApp ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.results.inApp ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Reminders & Follow-ups</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="reminders-email" className="text-gray-600">
              Email Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="reminders-email"
                className="opacity-0 w-0 h-0"
                checked={settings.reminders.email}
                onChange={() => handleToggle('reminders', 'email')}
              />
              <label
                htmlFor="reminders-email"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.reminders.email ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.reminders.email ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="reminders-inapp" className="text-gray-600">
              In-App Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="reminders-inapp"
                className="opacity-0 w-0 h-0"
                checked={settings.reminders.inApp}
                onChange={() => handleToggle('reminders', 'inApp')}
              />
              <label
                htmlFor="reminders-inapp"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.reminders.inApp ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.reminders.inApp ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Notifications */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">System Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="system-email" className="text-gray-600">
              Email Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="system-email"
                className="opacity-0 w-0 h-0"
                checked={settings.system.email}
                onChange={() => handleToggle('system', 'email')}
              />
              <label
                htmlFor="system-email"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.system.email ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.system.email ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="system-inapp" className="text-gray-600">
              In-App Notifications
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                id="system-inapp"
                className="opacity-0 w-0 h-0"
                checked={settings.system.inApp}
                onChange={() => handleToggle('system', 'inApp')}
              />
              <label
                htmlFor="system-inapp"
                className={`absolute top-0 left-0 right-0 bottom-0 rounded-full cursor-pointer transition-colors duration-200
                 ${settings.system.inApp ? 'bg-teal-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out
                  ${settings.system.inApp ? 'transform translate-x-6' : ''}`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-6">
        <p>Changes are saved automatically. Some critical notifications cannot be disabled.</p>
      </div>
    </div>
  );
};

export default NotificationSettingsForm; 