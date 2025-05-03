'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  highlightedDates?: Date[];
  minDate?: Date;
  className?: string;
}

export default function CalendarDatePicker({
  selectedDate,
  onDateChange,
  highlightedDates = [],
  minDate = new Date(),
  className = ''
}: CalendarDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  
  // Reset current month view when selected date changes significantly
  useEffect(() => {
    if (!isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate, currentMonth]);

  // Navigate to previous month
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    // Don't allow navigating to past months before minDate
    if (newMonth >= startOfMonth(minDate)) {
      setCurrentMonth(newMonth);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Get all days in the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Format days into weeks for rendering
  const weeks: Date[][] = [];
  let week: Date[] = [];

  calendarDays.forEach((day, index) => {
    week.push(day);
    if (index % 7 === 6 || index === calendarDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className={`calendar-picker ${className}`}>
      {/* Calendar header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={startOfMonth(minDate) >= monthStart}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            startOfMonth(minDate) >= monthStart ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const isPastDay = day < new Date(minDate.setHours(0, 0, 0, 0));
          const isHighlighted = highlightedDates.some(highlightedDate => isSameDay(day, highlightedDate));
          
          return (
            <button
              key={i}
              onClick={() => !isPastDay && isCurrentMonth && onDateChange(day)}
              disabled={isPastDay || !isCurrentMonth}
              className={`
                p-2 rounded-md text-sm relative
                ${isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-30 cursor-default'}
                ${isSelected ? 'bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 font-medium' : ''}
                ${isCurrentDay && !isSelected ? 'font-bold' : ''}
                ${isPastDay ? 'cursor-not-allowed text-gray-400 dark:text-gray-600' : ''}
                ${isHighlighted && !isSelected ? 'ring-1 ring-offset-1 ring-teal-500 dark:ring-teal-500' : ''}
                transition-all duration-150
              `}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
              {isHighlighted && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
