'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import Logo from '@/app/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { BellIcon } from 'lucide-react';
import ProfileAvatar from '@/app/components/ui/ProfileAvatar';

// Custom icon components with minimalistic design
const ChevronIcon = ({ className, direction = 'down' }: { className?: string, direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const getPath = () => {
    switch(direction) {
      case 'up': return 'M7 15l5-5 5 5';
      case 'down': return 'M7 10l5 5 5-5';
      case 'left': return 'M15 7l-5 5 5 5';
      case 'right': return 'M9 7l5 5-5 5';
      default: return 'M7 10l5 5 5-5';
    }
  };
  
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={getPath()} />
  </svg>
);
};

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h16M4 16h16" />
  </svg>
);

// Navigation items with more descriptive labels
const navItems = [
  { label: 'Dashboard', href: '/patient/dashboard', description: 'Overview of your health', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Appointments', href: '/patient/appointments', description: 'Manage your doctor visits', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { label: 'Messages', href: '/patient/messages', description: 'Communications with your care team', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { label: 'Records', href: '/patient/records', description: 'Your medical history', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Analytics', href: '/patient/analytics', description: 'Health data and trends', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: 'Adherence', href: '/patient/adherence', description: 'Track your treatment progress', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2-2m0 0l2 2m-2-2v6' },
  { label: 'Insurance', href: '/patient/insurance', description: 'Insurance plans and billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { label: 'Profile', href: '/patient/profile', description: 'Personal information', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export function Navbar() {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Toggle menu state
  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // Toggle notifications dropdown
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setUserMenuOpen(false);
  };
  
  // Toggle user menu dropdown
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    setNotificationsOpen(false);
  };
  
  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollValue = window.scrollY > 10;
      if (scrollValue !== isScrolled) {
        setIsScrolled(scrollValue);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  // Format current time with AM/PM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get current date in a nice format
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Check if a menu item is active
  const isActive = (path: string) => pathname === path;
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        isDarkMode 
          ? "bg-gray-900 text-white border-b border-gray-800" 
          : "bg-white text-gray-900 border-b border-gray-200",
        isScrolled && (isDarkMode 
          ? "shadow-lg shadow-black/20" 
          : "shadow-md shadow-black/5")
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and navigation - Fixed to always show logo properly */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <Logo variant="default" size="medium" animated={true} />
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                  key={item.label} 
                    href={item.href}
                  legacyBehavior
                >
                  <a 
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                      isActive(item.href)
                        ? isDarkMode 
                          ? "text-teal-400 bg-teal-900/20"
                          : "text-teal-600 bg-teal-50" 
                        : isDarkMode 
                          ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                          : "text-gray-700 hover:text-teal-600 hover:bg-gray-100"
                    )}
                  >
                      {item.label}
                    {isActive(item.href) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full mx-3" />
                    )}
                  </a>
                  </Link>
                ))}
            </nav>
              </div>
          
          {/* Right section with theme toggle, notifications, and user menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Notification button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "relative rounded-full p-2 mr-2",
                isDarkMode 
                  ? "hover:bg-gray-800" 
                  : "hover:bg-gray-100",
                notificationsOpen && (isDarkMode 
                  ? "bg-gray-800" 
                  : "bg-gray-100")
              )}
              onClick={toggleNotifications}
            >
              <BellIcon className={cn(
                "h-5 w-5",
                isDarkMode ? "text-gray-300" : "text-gray-700"
              )} />
              {/* Notification dot indicator */}
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
            </Button>
            
            {/* Profile button */}
                <button
              className="flex items-center focus:outline-none group"
              onClick={toggleUserMenu}
            >
              <ProfileAvatar 
                initials="JD"
                size="sm"
                role="patient"
                className="cursor-pointer"
              />
                </button>
                
            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  isDarkMode 
                    ? "text-gray-400 hover:text-white hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
                onClick={toggleMenu}
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
            </div>
          </div>
        </div>
        
      {/* Mobile menu panel */}
        <AnimatePresence>
        {menuOpen && (
            <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "md:hidden overflow-hidden",
              isDarkMode ? "bg-gray-900" : "bg-white"
            )}
          >
            <nav className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-800">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  legacyBehavior
                >
                  <a 
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive(item.href)
                        ? isDarkMode 
                          ? "text-teal-400 bg-teal-900/20"
                          : "text-teal-600 bg-teal-50" 
                        : isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-700 hover:text-teal-600 hover:bg-gray-100"
                    )}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* User menu dropdown */}
      <AnimatePresence>
        {userMenuOpen && (
                    <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
                        className={cn(
              "absolute right-4 w-56 mt-2 rounded-md shadow-lg z-50",
              isDarkMode ? "bg-gray-800 ring-1 ring-black ring-opacity-5" : "bg-white ring-1 ring-black ring-opacity-5"
            )}
          >
            <div className="py-1">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>John Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">patient@medconnect.com</p>
              </div>
              <Link href="/patient/profile" legacyBehavior>
                <a className={cn(
                  "block px-4 py-2 text-sm",
                  isDarkMode 
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}>
                  Your Profile
                </a>
              </Link>
              <Link href="/patient/settings" legacyBehavior>
                <a className={cn(
                  "block px-4 py-2 text-sm",
                  isDarkMode 
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}>
                  Settings
                </a>
              </Link>
              <Link href="#" legacyBehavior>
                <a className={cn(
                  "block px-4 py-2 text-sm",
                  isDarkMode 
                    ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}>
                  Sign out
                </a>
                      </Link>
            </div>
                    </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notifications dropdown */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-16 md:right-12 w-80 mt-2 rounded-md shadow-lg z-50 overflow-hidden",
              isDarkMode ? "bg-gray-800 ring-1 ring-black ring-opacity-5" : "bg-white ring-1 ring-black ring-opacity-5"
            )}
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>Notifications</p>
              <Link href="/patient/notifications" legacyBehavior>
                <a className="text-xs text-teal-600 dark:text-teal-400 hover:underline">View all</a>
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {/* Placeholder notifications */}
              <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-800 rounded-full p-1">
                    <svg className="h-5 w-5 text-teal-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      New lab results available
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your blood work results are ready to view.</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">1 hour ago</p>
                  </div>
                </div>
                      </div>
              <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-full p-1">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Appointment Reminder
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dr. Wilson tomorrow at 10:00 AM.</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Yesterday</p>
                      </div>
                      </div>
                    </div>
              <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-800 rounded-full p-1">
                    <svg className="h-5 w-5 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className={cn("text-sm font-medium", isDarkMode ? "text-white" : "text-gray-900")}>
                      Prescription Refill
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your medication is ready for pickup.</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">2 days ago</p>
                  </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
} 