'use client';

import React, { useState } from 'react';
import { cn } from '@/app/utils/cn';

export interface Reminder {
  id: string;
  time: string;
  medication: string;
  enabled: boolean;
}

export interface ReminderProps {
  className?: string;
}

export function Reminders({ className }: ReminderProps) {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', time: '08:00', medication: 'Atorvastatin 20mg', enabled: true },
    { id: '2', time: '13:00', medication: 'Lisinopril 10mg', enabled: true },
    { id: '3', time: '20:00', medication: 'Metformin 500mg', enabled: false },
  ]);
  
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id'>>({
    time: '',
    medication: '',
    enabled: true
  });
  
  const addReminder = () => {
    if (newReminder.time && newReminder.medication) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        ...newReminder
      };
      setReminders([...reminders, reminder]);
      setNewReminder({ time: '', medication: '', enabled: true });
    }
  };
  
  const removeReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };
  
  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, enabled: !reminder.enabled } 
        : reminder
    ));
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        {reminders.length > 0 ? (
          reminders.map(reminder => (
            <div 
              key={reminder.id} 
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                reminder.enabled 
                  ? "bg-white border-gray-200" 
                  : "bg-gray-50 border-gray-200 opacity-70"
              )}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full border",
                    reminder.enabled
                      ? "bg-teal-100 border-teal-200 text-teal-800"
                      : "bg-gray-100 border-gray-200 text-gray-400"
                  )}
                >
                  {reminder.enabled ? (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
                <div>
                  <p className="font-medium text-gray-900">{reminder.time}</p>
                  <p className="text-sm text-gray-600">{reminder.medication}</p>
                </div>
              </div>
              <button
                onClick={() => removeReminder(reminder.id)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No reminders set</p>
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Reminder</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <label htmlFor="reminder-time" className="sr-only">Time</label>
            <input
              id="reminder-time"
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="reminder-medication" className="sr-only">Medication</label>
            <input
              id="reminder-medication"
              type="text"
              placeholder="Medication name"
              value={newReminder.medication}
              onChange={(e) => setNewReminder({...newReminder, medication: e.target.value})}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              required
            />
          </div>
          <button
            onClick={addReminder}
            disabled={!newReminder.time || !newReminder.medication}
            className="inline-flex items-center justify-center rounded-md text-sm px-3 py-2 font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </div>
      </div>
      
      <div className="bg-teal-50 border border-teal-100 rounded-md p-3 text-sm text-teal-800">
        <div className="flex">
          <svg className="w-5 h-5 text-teal-600 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>
            Reminders will show as browser notifications and can be synced with your mobile device through the MedConnect app.
          </p>
        </div>
      </div>
    </div>
  );
} 