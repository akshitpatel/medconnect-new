import React from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import { apiUrl } from '@/app/lib/api-utils';
import { FaCog, FaBell, FaEnvelope, FaMoneyBill, FaGlobe, FaLanguage, FaClock, FaToggleOn } from 'react-icons/fa';
import Link from 'next/link';

// Define interfaces for our data types
interface SystemConfig {
  _id?: string;
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    contactPhone: string;
    defaultLanguage: string;
    defaultTimeZone: string;
    maintenanceMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
    newsletterFrequency: string;
    adminAlerts: boolean;
  };
  emailTemplates: {
    welcomeEmail: {
      subject: string;
      enabled: boolean;
      body?: string;
      lastModified?: string;
    };
    appointmentConfirmation: {
      subject: string;
      enabled: boolean;
      body?: string;
      lastModified?: string;
    };
    appointmentReminder: {
      subject: string;
      enabled: boolean;
      body?: string;
      lastModified?: string;
    };
    prescriptionReady: {
      subject: string;
      enabled: boolean;
      body?: string;
      lastModified?: string;
    };
    labResultsReady: {
      subject: string;
      enabled: boolean;
      body?: string;
      lastModified?: string;
    };
  };
  fees: {
    platformFee: number;
    doctorCommission: number;
    labTestCommission: number;
    pharmacyCommission: number;
    taxRate: number;
    currencySymbol: string;
    allowPromoCode: boolean;
  };
  lastUpdated: string;
  updatedBy?: string;
}

// Function to fetch system configuration from our API
async function fetchSystemConfig(): Promise<{ data: { config: SystemConfig } }> {
  try {
    const response = await fetch(`${apiUrl}/admin/config`, {
      cache: 'no-store', // Don't cache this API response
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch system configuration');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching system configuration:', error);
    // Return fallback data if API fails
    return {
      data: {
        config: {
          general: {
            siteName: 'MedConnect',
            siteDescription: 'Patient-Centric Healthcare Platform',
            supportEmail: 'support@medconnect.com',
            contactPhone: '+1 (555) 123-4567',
            defaultLanguage: 'en-US',
            defaultTimeZone: 'America/New_York',
            maintenanceMode: false
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: true,
            pushNotifications: true,
            appointmentReminders: true,
            medicationReminders: true,
            newsletterFrequency: 'weekly',
            adminAlerts: true
          },
          emailTemplates: {
            welcomeEmail: {
              subject: 'Welcome to MedConnect',
              enabled: true
            },
            appointmentConfirmation: {
              subject: 'Your Appointment has been Confirmed',
              enabled: true
            },
            appointmentReminder: {
              subject: 'Reminder: Upcoming Appointment',
              enabled: true
            },
            prescriptionReady: {
              subject: 'Your Prescription is Ready',
              enabled: true
            },
            labResultsReady: {
              subject: 'Your Lab Results are Available',
              enabled: true
            }
          },
          fees: {
            platformFee: 5,
            doctorCommission: 10,
            labTestCommission: 8,
            pharmacyCommission: 6,
            taxRate: 7,
            currencySymbol: '$',
            allowPromoCode: true
          },
          lastUpdated: new Date().toISOString()
        }
      }
    };
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const metadata = {
  title: 'System Configuration | MedConnect Admin',
  description: 'Configure system settings for the MedConnect platform',
};

export default async function SystemConfigPage() {
  // Fetch system configuration
  const { data } = await fetchSystemConfig();
  const { config } = data;
  
  return (
    <AdminLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">System Configuration</h1>
            <p className="mt-1 text-gray-500">Configure system settings for the MedConnect platform</p>
          </div>
          <Link 
            href="/admin/config/edit" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FaCog className="mr-2 -ml-1 h-4 w-4" />
            Edit Configuration
          </Link>
        </div>
        
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-teal-50 rounded-lg mr-3">
              <FaGlobe className="h-5 w-5 text-teal-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">General Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.general.siteName}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.general.siteDescription}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.general.supportEmail}
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.general.contactPhone}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaLanguage className="mr-2 text-gray-500" />
                  {config.general.defaultLanguage}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Time Zone</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaClock className="mr-2 text-gray-500" />
                  {config.general.defaultTimeZone}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Mode</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.general.maintenanceMode ? 'text-red-500' : 'text-green-500'}`} />
                  {config.general.maintenanceMode ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-50 rounded-lg mr-3">
              <FaBell className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Notification Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.emailNotifications ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.emailNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">SMS Notifications</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.smsNotifications ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.smsNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Push Notifications</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.pushNotifications ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.pushNotifications ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Reminders</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.appointmentReminders ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.appointmentReminders ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication Reminders</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.medicationReminders ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.medicationReminders ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Frequency</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 capitalize">
                  {config.notifications.newsletterFrequency}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Alerts</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.notifications.adminAlerts ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.notifications.adminAlerts ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <FaEnvelope className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Email Templates</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {Object.entries(config.emailTemplates).map(([key, template]) => (
              <div key={key} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${template.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {template.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Subject: {template.subject}</p>
                {template.lastModified && (
                  <p className="text-xs text-gray-500">Last modified: {formatDate(template.lastModified)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-50 rounded-lg mr-3">
              <FaMoneyBill className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Fees & Payments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.platformFee}%
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Commission</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.doctorCommission}%
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Test Commission</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.labTestCommission}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Commission</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.pharmacyCommission}%
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.taxRate}%
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800">
                  {config.fees.currencySymbol}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allow Promo Codes</label>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-gray-800 flex items-center">
                  <FaToggleOn className={`mr-2 ${config.fees.allowPromoCode ? 'text-green-500' : 'text-gray-400'}`} />
                  {config.fees.allowPromoCode ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
          <p>Last updated: {formatDate(config.lastUpdated)}</p>
          {config.updatedBy && <p>Updated by: {config.updatedBy}</p>}
        </div>
      </div>
    </AdminLayout>
  );
} 