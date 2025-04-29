'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { cn } from '@/app/utils/cn';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'default', 
  size = 'md',
  className = ''
}: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  // Size variants
  const sizeClasses = {
    sm: {
      button: "p-1.5 rounded-full",
      icon: "w-4 h-4",
      text: "text-xs"
    },
    md: {
      button: "p-2 rounded-full",
      icon: "w-5 h-5",
      text: "text-sm"
    },
    lg: {
      button: "p-3 rounded-full",
      icon: "w-6 h-6",
      text: "text-base"
    }
  };

  // Base styling based on size
  const { button: buttonSize, icon: iconSize, text: textSize } = sizeClasses[size];

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          buttonSize,
          "transition-all duration-300",
          isDarkMode 
            ? "text-yellow-300 hover:text-yellow-200" 
            : "text-indigo-700 hover:text-indigo-600",
          className
        )}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </button>
    );
  }
  
  if (variant === 'icon-only') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          buttonSize,
          "transition-all duration-300",
          isDarkMode 
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" 
            : "bg-gray-100 text-indigo-700 hover:bg-gray-200",
          className
        )}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconSize}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        )}
      </button>
    );
  }

  // Default variant with text
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-300",
        isDarkMode 
          ? "bg-gray-800 text-gray-200 hover:bg-gray-700" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200",
        className
      )}
    >
      {isDarkMode ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn(iconSize, "text-yellow-300")}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <span className={textSize}>Light Mode</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cn(iconSize, "text-indigo-700")}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
          <span className={textSize}>Dark Mode</span>
        </>
      )}
    </button>
  );
} 