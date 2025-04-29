'use client';

import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Bell,
  Globe,
  Lock,
  Mail,
  Database,
  Layers,
  Settings,
  FileText,
  Calendar,
  Monitor,
  CloudUpload,
  Server,
  ShieldCheck,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  settings: Setting[];
}

type SettingType = 'toggle' | 'text' | 'select' | 'textarea' | 'color' | 'number';

interface Setting {
  id: string;
  name: string;
  description: string;
  type: SettingType;
  value: string | boolean | number;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export default function SystemSettings() {
  // Mock data for settings
  const initialSettings: SettingSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      icon: <Settings className="h-5 w-5" />,
      settings: [
        {
          id: 'site_name',
          name: 'Site Name',
          description: 'The name of your healthcare platform',
          type: 'text',
          value: 'MedConnect Healthcare Platform',
          placeholder: 'Enter site name'
        },
        {
          id: 'site_description',
          name: 'Site Description',
          description: 'A brief description of your platform',
          type: 'textarea',
          value: 'MedConnect connects patients with healthcare providers for better healthcare access.',
          placeholder: 'Enter site description'
        },
        {
          id: 'maintenance_mode',
          name: 'Maintenance Mode',
          description: 'Enable maintenance mode to make the site unavailable to regular users',
          type: 'toggle',
          value: false
        },
        {
          id: 'timezone',
          name: 'Default Timezone',
          description: 'The default timezone for the platform',
          type: 'select',
          value: 'UTC',
          options: [
            { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
            { value: 'EST', label: 'EST (Eastern Standard Time)' },
            { value: 'CST', label: 'CST (Central Standard Time)' },
            { value: 'MST', label: 'MST (Mountain Standard Time)' },
            { value: 'PST', label: 'PST (Pacific Standard Time)' },
            { value: 'IST', label: 'IST (Indian Standard Time)' }
          ]
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Monitor className="h-5 w-5" />,
      settings: [
        {
          id: 'primary_color',
          name: 'Primary Color',
          description: 'The main brand color for the platform',
          type: 'color',
          value: '#4f46e5',
          placeholder: 'Enter hex color code'
        },
        {
          id: 'secondary_color',
          name: 'Secondary Color',
          description: 'The secondary color for accents and highlights',
          type: 'color',
          value: '#10b981',
          placeholder: 'Enter hex color code'
        },
        {
          id: 'default_theme',
          name: 'Default Theme',
          description: 'The default theme for new users',
          type: 'select',
          value: 'light',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System Default' }
          ]
        },
        {
          id: 'logo_url',
          name: 'Logo URL',
          description: 'URL to the platform logo image',
          type: 'text',
          value: '/images/logo.svg',
          placeholder: 'Enter logo URL'
        }
      ]
    },
    {
      id: 'email',
      title: 'Email Settings',
      icon: <Mail className="h-5 w-5" />,
      settings: [
        {
          id: 'smtp_host',
          name: 'SMTP Host',
          description: 'The SMTP server host for sending emails',
          type: 'text',
          value: 'smtp.example.com',
          placeholder: 'Enter SMTP host'
        },
        {
          id: 'smtp_port',
          name: 'SMTP Port',
          description: 'The SMTP server port',
          type: 'number',
          value: 587,
          min: 1,
          max: 65535
        },
        {
          id: 'smtp_encryption',
          name: 'SMTP Encryption',
          description: 'The encryption method for SMTP',
          type: 'select',
          value: 'tls',
          options: [
            { value: 'none', label: 'None' },
            { value: 'ssl', label: 'SSL' },
            { value: 'tls', label: 'TLS' }
          ]
        },
        {
          id: 'from_email',
          name: 'From Email',
          description: 'The email address emails will be sent from',
          type: 'text',
          value: 'noreply@medconnect.com',
          placeholder: 'Enter from email'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: <Bell className="h-5 w-5" />,
      settings: [
        {
          id: 'email_notifications',
          name: 'Email Notifications',
          description: 'Enable sending email notifications',
          type: 'toggle',
          value: true
        },
        {
          id: 'sms_notifications',
          name: 'SMS Notifications',
          description: 'Enable sending SMS notifications',
          type: 'toggle',
          value: true
        },
        {
          id: 'push_notifications',
          name: 'Push Notifications',
          description: 'Enable sending browser push notifications',
          type: 'toggle',
          value: true
        },
        {
          id: 'notification_frequency',
          name: 'Notification Frequency',
          description: 'How often to send digest notifications',
          type: 'select',
          value: 'daily',
          options: [
            { value: 'realtime', label: 'Real-time' },
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' }
          ]
        }
      ]
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Lock className="h-5 w-5" />,
      settings: [
        {
          id: 'require_2fa',
          name: 'Require 2FA for Admins',
          description: 'Require two-factor authentication for all administrator accounts',
          type: 'toggle',
          value: true
        },
        {
          id: 'password_expiry',
          name: 'Password Expiry (Days)',
          description: 'Number of days after which passwords must be changed (0 for never)',
          type: 'number',
          value: 90,
          min: 0,
          max: 365
        },
        {
          id: 'session_timeout',
          name: 'Session Timeout (Minutes)',
          description: 'Time in minutes before inactive sessions are terminated',
          type: 'number',
          value: 30,
          min: 5,
          max: 1440
        },
        {
          id: 'login_attempts',
          name: 'Max Login Attempts',
          description: 'Maximum number of failed login attempts before account lockout',
          type: 'number',
          value: 5,
          min: 1,
          max: 20
        }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Globe className="h-5 w-5" />,
      settings: [
        {
          id: 'google_analytics',
          name: 'Google Analytics ID',
          description: 'Your Google Analytics tracking ID',
          type: 'text',
          value: 'UA-XXXXXXXX-X',
          placeholder: 'Enter GA tracking ID'
        },
        {
          id: 'recaptcha_site_key',
          name: 'reCAPTCHA Site Key',
          description: 'Google reCAPTCHA site key for form protection',
          type: 'text',
          value: '',
          placeholder: 'Enter reCAPTCHA site key'
        },
        {
          id: 'recaptcha_secret_key',
          name: 'reCAPTCHA Secret Key',
          description: 'Google reCAPTCHA secret key for form protection',
          type: 'text',
          value: '',
          placeholder: 'Enter reCAPTCHA secret key'
        },
        {
          id: 'enable_stripe',
          name: 'Enable Stripe Payments',
          description: 'Enable integration with Stripe for payment processing',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      id: 'healthcare',
      title: 'Healthcare Settings',
      icon: <FileText className="h-5 w-5" />,
      settings: [
        {
          id: 'appointment_duration',
          name: 'Default Appointment Duration (Minutes)',
          description: 'The default duration for appointments',
          type: 'number',
          value: 30,
          min: 10,
          max: 180
        },
        {
          id: 'prescription_expiry',
          name: 'Prescription Expiry (Days)',
          description: 'Default number of days until prescriptions expire',
          type: 'number',
          value: 90,
          min: 1,
          max: 365
        },
        {
          id: 'require_doctor_approval',
          name: 'Require Doctor Approval',
          description: 'Require manual approval for new doctor registrations',
          type: 'toggle',
          value: true
        },
        {
          id: 'medical_specialties',
          name: 'Medical Specialties',
          description: 'Comma-separated list of available medical specialties',
          type: 'textarea',
          value: 'Cardiology, Dermatology, Endocrinology, Gastroenterology, Neurology, Oncology, Pediatrics, Psychiatry, Radiology, Urology',
          placeholder: 'Enter medical specialties'
        }
      ]
    }
  ];

  const [settings, setSettings] = useState<SettingSection[]>(initialSettings);
  const [activeSection, setActiveSection] = useState<string>('general');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Handle setting changes
  const handleSettingChange = (sectionId: string, settingId: string, newValue: string | boolean | number) => {
    const newSettings = settings.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: section.settings.map(setting => {
            if (setting.id === settingId) {
              return {
                ...setting,
                value: newValue
              };
            }
            return setting;
          })
        };
      }
      return section;
    });

    setSettings(newSettings);
    setIsModified(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');

    // Simulating API call to save settings
    setTimeout(() => {
      // In a real application, you would make an API call here
      setSaveStatus('success');
      setIsModified(false);

      // Reset status after showing success message
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1000);
  };

  // Reset settings to initial state
  const handleReset = () => {
    setSettings(initialSettings);
    setIsModified(true);
  };

  // Render setting input based on type
  const renderSettingInput = (section: SettingSection, setting: Setting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={setting.id}
              checked={setting.value as boolean}
              onChange={(e) => handleSettingChange(section.id, setting.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={setting.id} className="ml-2 text-sm text-gray-900 dark:text-gray-300">
              {(setting.value as boolean) ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            id={setting.id}
            value={setting.value as string}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            placeholder={setting.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        );

      case 'textarea':
        return (
          <textarea
            id={setting.id}
            value={setting.value as string}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            placeholder={setting.placeholder}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        );

      case 'select':
        return (
          <select
            id={setting.id}
            value={setting.value as string}
            onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center mt-1">
            <input
              type="color"
              id={`color-${setting.id}`}
              value={setting.value as string}
              onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
              className="h-8 w-8 rounded border-gray-300 mr-2"
            />
            <input
              type="text"
              id={setting.id}
              value={setting.value as string}
              onChange={(e) => handleSettingChange(section.id, setting.id, e.target.value)}
              placeholder={setting.placeholder}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            id={setting.id}
            value={setting.value as number}
            onChange={(e) => handleSettingChange(section.id, setting.id, parseInt(e.target.value))}
            min={setting.min}
            max={setting.max}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        );

      default:
        return null;
    }
  };

  // Get the active section
  const activeSectionData = settings.find((section) => section.id === activeSection);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Configure global settings for the MedConnect platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0 space-x-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isModified || saveStatus === 'saving'}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-wider hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            {saveStatus === 'saving' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save status message */}
      {saveStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <p className="text-sm text-green-800 dark:text-green-300">
              Settings have been saved successfully.
            </p>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-800 dark:text-red-300">
              An error occurred while saving settings. Please try again.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {settings.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 flex items-center ${
                      activeSection === section.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <span className={`mr-3 ${
                      activeSection === section.id
                        ? 'text-indigo-600 dark:text-indigo-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {React.cloneElement(section.icon as React.ReactElement, {
                        className: 'h-5 w-5',
                      })}
                    </span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Settings Form */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                {activeSectionData?.icon && (
                  <span className="mr-2 text-indigo-600 dark:text-indigo-400">
                    {React.cloneElement(activeSectionData.icon as React.ReactElement, {
                      className: 'h-5 w-5',
                    })}
                  </span>
                )}
                {activeSectionData?.title}
              </h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {activeSectionData?.settings.map((setting) => (
                    <div key={setting.id} className="mb-6">
                      <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {setting.name}
                      </label>
                      {renderSettingInput(activeSectionData, setting)}
                      {setting.description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {setting.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 