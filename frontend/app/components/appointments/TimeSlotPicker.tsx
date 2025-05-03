'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

interface TimeSlot {
  start_time: string;
  end_time: string;
  formatted_time: string;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectTimeSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
  className?: string;
}

export default function TimeSlotPicker({
  timeSlots,
  selectedSlot,
  onSelectTimeSlot,
  isLoading = false,
  className = ''
}: TimeSlotPickerProps) {
  // Group slots by morning, afternoon, evening
  const groupedSlots = {
    morning: [] as TimeSlot[],
    afternoon: [] as TimeSlot[],
    evening: [] as TimeSlot[]
  };
  
  // Group time slots by time of day
  timeSlots.forEach(slot => {
    const hour = parseISO(slot.start_time).getHours();
    
    if (hour < 12) {
      groupedSlots.morning.push(slot);
    } else if (hour < 17) {
      groupedSlots.afternoon.push(slot);
    } else {
      groupedSlots.evening.push(slot);
    }
  });
  
  // Skeleton loader for loading state
  if (isLoading) {
    return (
      <div className={`time-slot-picker ${className}`}>
        <div className="space-y-4">
          {['Morning', 'Afternoon', 'Evening'].map((timeOfDay) => (
            <div key={timeOfDay} className="animate-pulse">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{timeOfDay}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Empty state when no slots available
  if (timeSlots.length === 0) {
    return (
      <div className={`time-slot-picker ${className}`}>
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No available appointments</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no available appointment slots for this date.
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Please select a different date or check back later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`time-slot-picker ${className}`}>
      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([timeOfDay, slots]) => {
          // Skip time periods with no slots
          if (slots.length === 0) return null;
          
          const formattedTimeOfDay = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
          
          return (
            <div key={timeOfDay}>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{formattedTimeOfDay}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlot && slot.start_time === selectedSlot.start_time;
                  
                  return (
                    <button
                      key={slot.start_time}
                      onClick={() => onSelectTimeSlot(slot)}
                      className={`
                        py-2 px-1 text-sm rounded-md border text-center
                        ${isSelected 
                          ? 'bg-teal-100 dark:bg-teal-800 border-teal-500 dark:border-teal-600 text-teal-800 dark:text-teal-100' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
                        transition-colors duration-150
                      `}
                    >
                      {slot.formatted_time}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
