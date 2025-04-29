'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/app/components/ui/AdminSidebar';
import { Bell, Moon, Sun, Search, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import AdminAnimatedBackground from '@/app/components/ui/AdminAnimatedBackground';
import SVGLogo from '@/app/components/ui/SVGLogo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Handle scroll for header shadow
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    // Handle outside clicks for dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Dummy search suggestions
  const searchSuggestions = [
    'Patient Records',
    'Provider Directory',
    'Appointment Schedule',
    'Medication Database',
    'System Settings'
  ];

  // Dummy notifications
  const notificationItems = [
    {
      id: 1,
      title: 'New Patient Registration',
      message: 'John Doe registered as a new patient',
      time: '10 minutes ago',
      type: 'info',
    },
    {
      id: 2,
      title: 'System Update',
      message: 'Update completed successfully',
      time: '1 hour ago',
      type: 'success',
    },
    {
      id: 3,
      title: 'Security Alert',
      message: 'Unusual login attempt detected',
      time: '2 hours ago',
      type: 'warning',
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <AdminAnimatedBackground particleCount={10} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          className={`
            fixed md:sticky top-0 h-screen z-30 w-72 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onToggle={toggleSidebar} 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-0">
          {/* Header */}
          <header 
            className={`
              sticky top-0 z-20 bg-white dark:bg-gray-800 transition-all duration-300
              ${scrollY > 10 ? 'shadow-md bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm' : ''}
            `}
          >
            <div className="flex items-center justify-between px-4 py-3">
              {/* Left: Sidebar Toggle & Logo */}
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar} 
                  className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? (
                    <X size={20} className="transition-transform duration-300" />
                  ) : (
                    <Menu size={20} className="transition-transform duration-300" />
                  )}
                </button>
                <div className="ml-2 md:hidden">
                  <SVGLogo size={32} withText={false} />
                </div>
              </div>
              
              {/* Center: Search */}
              <div ref={searchRef} className="relative mx-4 flex-1 max-w-xl hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
                </div>
                
                {/* Search Suggestions */}
                {showSearchSuggestions && searchQuery.length > 0 && (
                  <div 
                    className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-10"
                  >
                    <div className="py-2">
                      {searchSuggestions
                        .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item, index) => (
                          <div 
                            key={index} 
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                            onClick={() => {
                              setSearchQuery(item);
                              setShowSearchSuggestions(false);
                            }}
                          >
                            <Search size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right: User Actions */}
              <div className="flex items-center space-x-3">
                {/* Mobile Search Button */}
                <button 
                  className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    const searchInput = document.querySelector('#mobile-search') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.classList.toggle('w-0');
                      searchInput.classList.toggle('w-52');
                      searchInput.classList.toggle('opacity-0');
                      searchInput.classList.toggle('opacity-100');
                      if (!searchInput.classList.contains('w-0')) {
                        searchInput.focus();
                      }
                    }
                  }}
                >
                  <Search size={20} />
                </button>
                <div id="mobile-search" className="md:hidden w-0 opacity-0 overflow-hidden transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-3 pr-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                
                {/* Theme Toggle */}
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* Notifications */}
                <div ref={notificationRef} className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-xs rounded-full px-1.5 py-px">
                        {notifications}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                          {notifications} new
                        </span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notificationItems.map((item) => (
                          <div 
                            key={item.id}
                            className="p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                        <button className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Profile */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link 
                    href="/admin/profile" 
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-teal-500 to-teal-300 shadow-sm">
                      <img 
                        src="/profile-placeholder.jpg" 
                        alt="User"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
                        }}
                      />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">admin@medconnect.com</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
      {children}
          </main>
        </div>
      </div>
    </div>
  );
} 