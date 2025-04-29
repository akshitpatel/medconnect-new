'use client';

import React, { useState } from 'react';
import { 
  FaSave, FaCog, FaBell, FaEnvelope, FaPercent, 
  FaCreditCard, FaGlobe, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Sample system configuration data
const initialConfig = {
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
  }
};

const SystemConfiguration: React.FC = () => {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleInputChange = (section: string, field: string, value: any) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value
      }
    });
  };
  
  const handleTemplateChange = (templateName: string, field: string, value: any) => {
    setConfig({
      ...config,
      emailTemplates: {
        ...config.emailTemplates,
        [templateName]: {
          ...config.emailTemplates[templateName as keyof typeof config.emailTemplates],
          [field]: value
        }
      }
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate saving to backend
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Configuration</h1>
        <p className="text-gray-600">Configure platform settings, notifications, and financial parameters</p>
      </div>
      
      {/* Configuration Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['general', 'notifications', 'emailTemplates', 'fees'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Configuration Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  value={config.general.siteName}
                  onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                <input
                  type="text"
                  value={config.general.siteDescription}
                  onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={config.general.supportEmail}
                  onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={config.general.contactPhone}
                  onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                <select
                  value={config.general.defaultLanguage}
                  onChange={(e) => handleInputChange('general', 'defaultLanguage', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                <select
                  value={config.general.defaultTimeZone}
                  onChange={(e) => handleInputChange('general', 'defaultTimeZone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={config.general.maintenanceMode}
                  onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                  className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
              {config.general.maintenanceMode && (
                <p className="mt-1 text-sm text-amber-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" /> The site will be inaccessible to regular users when enabled
                </p>
              )}
            </motion.div>
          </div>
        )}
        
        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={config.notifications.emailNotifications}
                    onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={config.notifications.smsNotifications}
                    onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={config.notifications.pushNotifications}
                    onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-700">
                    Push Notifications
                  </label>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Reminder Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="appointmentReminders"
                    checked={config.notifications.appointmentReminders}
                    onChange={(e) => handleInputChange('notifications', 'appointmentReminders', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="appointmentReminders" className="ml-2 block text-sm text-gray-700">
                    Appointment Reminders
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="medicationReminders"
                    checked={config.notifications.medicationReminders}
                    onChange={(e) => handleInputChange('notifications', 'medicationReminders', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="medicationReminders" className="ml-2 block text-sm text-gray-700">
                    Medication Reminders
                  </label>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Other Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Newsletter Frequency</label>
                  <select
                    value={config.notifications.newsletterFrequency}
                    onChange={(e) => handleInputChange('notifications', 'newsletterFrequency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    id="adminAlerts"
                    checked={config.notifications.adminAlerts}
                    onChange={(e) => handleInputChange('notifications', 'adminAlerts', e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="adminAlerts" className="ml-2 block text-sm text-gray-700">
                    Send Critical Alerts to Admins
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Email Templates */}
        {activeTab === 'emailTemplates' && (
          <div className="space-y-6">
            {Object.keys(config.emailTemplates).map((templateKey) => {
              const template = config.emailTemplates[templateKey as keyof typeof config.emailTemplates];
              return (
                <motion.div key={templateKey} variants={itemVariants} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {templateKey.replace(/([A-Z])/g, ' $1').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <div className="flex items-center">
                      <label className="mr-2 text-sm text-gray-600">Active</label>
                      <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${template.enabled ? 'bg-teal-500' : 'bg-gray-300'}`}>
                        <input
                          type="checkbox"
                          className="opacity-0 absolute w-full h-full cursor-pointer z-10"
                          checked={template.enabled}
                          onChange={(e) => handleTemplateChange(templateKey, 'enabled', e.target.checked)}
                        />
                        <span className={`absolute left-0 top-0 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-linear transform ${template.enabled ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                    <input
                      type="text"
                      value={template.subject}
                      onChange={(e) => handleTemplateChange(templateKey, 'subject', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Fee Settings */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPercent className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.fees.platformFee}
                    onChange={(e) => handleInputChange('fees', 'platformFee', parseFloat(e.target.value))}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Commission (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPercent className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.fees.doctorCommission}
                    onChange={(e) => handleInputChange('fees', 'doctorCommission', parseFloat(e.target.value))}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Test Commission (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPercent className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.fees.labTestCommission}
                    onChange={(e) => handleInputChange('fees', 'labTestCommission', parseFloat(e.target.value))}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Commission (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPercent className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.fees.pharmacyCommission}
                    onChange={(e) => handleInputChange('fees', 'pharmacyCommission', parseFloat(e.target.value))}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPercent className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.fees.taxRate}
                    onChange={(e) => handleInputChange('fees', 'taxRate', parseFloat(e.target.value))}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    maxLength={1}
                    value={config.fees.currencySymbol}
                    onChange={(e) => handleInputChange('fees', 'currencySymbol', e.target.value)}
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowPromoCode"
                  checked={config.fees.allowPromoCode}
                  onChange={(e) => handleInputChange('fees', 'allowPromoCode', e.target.checked)}
                  className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                />
                <label htmlFor="allowPromoCode" className="ml-2 block text-sm text-gray-700">
                  Allow Promotion Codes
                </label>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
      
      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-green-600">
            <FaCheck className="mr-2" />
            <span>Settings saved successfully</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center px-4 py-2 rounded-lg text-white transition-all ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SystemConfiguration; 