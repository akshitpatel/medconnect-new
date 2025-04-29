'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, FaPills, FaCalendarAlt, FaFlask, 
  FaHeartbeat, FaBell, FaSave, FaTimes 
} from 'react-icons/fa';
import { ReminderService, Reminder } from '@/app/lib/services/reminder-service';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import NotificationToast from '@/app/components/NotificationToast';

type NotificationType = 'success' | 'error' | 'warning' | 'info';
type FormData = Omit<Reminder, '_id' | 'created_at' | 'updated_at' | 'snooze_until'>;

const EditReminderPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const reminderId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success' as NotificationType,
    message: '',
  });
  
  const [formData, setFormData] = useState<FormData>({
    patient_id: '',
    title: '',
    description: '',
    reminder_type: 'medication',
    time: '',
    date: '',
    recurring: false,
    frequency: 'daily',
    custom_frequency: {
      days: [],
      interval: 1
    },
    status: 'pending'
  });

  const reminderTypeOptions = [
    { value: 'medication', label: 'Medication', icon: <FaPills /> },
    { value: 'appointment', label: 'Appointment', icon: <FaCalendarAlt /> },
    { value: 'test', label: 'Medical Test', icon: <FaFlask /> },
    { value: 'vitals', label: 'Vital Signs', icon: <FaHeartbeat /> },
    { value: 'other', label: 'Other', icon: <FaBell /> }
  ];

  // Fetch reminder details
  useEffect(() => {
    const fetchReminderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reminders/${reminderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reminder details');
        }
        
        const data = await response.json();
        const reminder = data.reminder;
        
        // Format date for input field if it exists
        let formattedDate = reminder.date;
        if (formattedDate && typeof formattedDate === 'string') {
          // Ensure date is in YYYY-MM-DD format for the input
          if (formattedDate.includes('T')) {
            formattedDate = formattedDate.split('T')[0];
          }
        }
        
        setFormData({
          ...reminder,
          date: formattedDate || ''
        });
      } catch (err) {
        console.error('Error fetching reminder details:', err);
        setError('Failed to load reminder details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (reminderId) {
      fetchReminderDetails();
    }
  }, [reminderId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear the error for this field when it changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleReminderTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, reminder_type: type as Reminder['reminder_type'] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.recurring && !formData.date) {
      newErrors.date = 'Date is required for non-recurring reminders';
    }
    
    if (formData.recurring && formData.frequency === 'custom') {
      if (!formData.custom_frequency?.days?.length) {
        newErrors.custom_frequency = 'Please select at least one day for custom frequency';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedReminder = await ReminderService.updateReminder(reminderId, formData);
      
      if (updatedReminder) {
        setNotification({
          isVisible: true,
          type: 'success',
          message: 'Reminder updated successfully!',
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/dashboard/reminders/${reminderId}`);
        }, 1500);
      } else {
        throw new Error('Failed to update reminder');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Failed to update reminder. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LoadingSpinner text="Loading reminder details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Try Again
              </button>
              <Link 
                href={`/dashboard/reminders/${reminderId}`} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
              >
                Back to Reminder
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Link href={`/dashboard/reminders/${reminderId}`} className="text-gray-500 hover:text-gray-700 mr-4">
              <FaArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit Reminder</h1>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Reminder Type */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                Reminder Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {reminderTypeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex flex-col items-center p-4 rounded-lg border ${
                      formData.reminder_type === option.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleReminderTypeSelect(option.value)}
                  >
                    <div className={`text-xl mb-2 ${
                      formData.reminder_type === option.value ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {option.icon}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter reminder title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter reminder description (optional)"
                rows={3}
              />
            </div>
            
            {/* Status */}
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="snoozed">Snoozed</option>
              </select>
            </div>
            
            {/* Recurring */}
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="recurring" className="text-gray-700 font-medium">
                  Recurring Reminder
                </label>
              </div>
            </div>
            
            {/* Frequency (only show if recurring) */}
            {formData.recurring && (
              <div className="mb-4">
                <label htmlFor="frequency" className="block text-gray-700 font-medium mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            )}
            
            {/* Custom Frequency (only show if recurring and frequency is custom) */}
            {formData.recurring && formData.frequency === 'custom' && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Select Days</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      className={`p-2 rounded-md text-center ${
                        formData.custom_frequency?.days?.includes(index)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        const days = formData.custom_frequency?.days || [];
                        const newDays = days.includes(index)
                          ? days.filter(d => d !== index)
                          : [...days, index];
                          
                        setFormData(prev => ({
                          ...prev,
                          custom_frequency: {
                            ...prev.custom_frequency,
                            days: newDays
                          }
                        }));
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {errors.custom_frequency && (
                  <p className="text-red-500 text-sm mt-2">{errors.custom_frequency}</p>
                )}
              </div>
            )}
            
            {/* Date (only show if not recurring) */}
            {!formData.recurring && (
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date as string}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            )}
            
            {/* Time */}
            <div className="mb-6">
              <label htmlFor="time" className="block text-gray-700 font-medium mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
            
            {/* Submit and Cancel buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                <FaSave className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/dashboard/reminders/${reminderId}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200"
              >
                <FaTimes className="mr-2" />
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Notification toast */}
      <NotificationToast
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default EditReminderPage; 