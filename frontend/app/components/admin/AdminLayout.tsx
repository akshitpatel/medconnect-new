'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FaChartLine, FaUsers, FaCalendarAlt, FaClipboardList, 
  FaSignOutAlt, FaBars, FaTimes, FaHome, FaStethoscope,
  FaCog, FaNewspaper, FaBell, FaUserMd, FaFileMedical,
  FaPills, FaFlask, FaAmbulance, FaMoon, FaSun, FaRoute
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Only run this effect on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('medconnect-admin-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, [mounted]);
  
  const toggleTheme = () => {
    if (!mounted) return;
    
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('medconnect-admin-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('medconnect-admin-theme', 'light');
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: <FaChartLine className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: <FaChartLine className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: <FaUsers className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Doctors', 
      href: '/admin/doctors', 
      icon: <FaUserMd className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Appointments', 
      href: '/admin/appointments', 
      icon: <FaCalendarAlt className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Symptom Tracker', 
      href: '/admin/symptom-tracker', 
      icon: <FaClipboardList className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'User Journeys', 
      href: '/admin/user-journeys', 
      icon: <FaRoute className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Prescriptions', 
      href: '/admin/prescriptions', 
      icon: <FaFileMedical className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Lab Tests', 
      href: '/admin/lab-tests', 
      icon: <FaFlask className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Pharmacy', 
      href: '/admin/pharmacy', 
      icon: <FaPills className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Emergency', 
      href: '/admin/emergency', 
      icon: <FaAmbulance className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Content', 
      href: '/admin/content', 
      icon: <FaNewspaper className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: <FaCog className="text-teal-500 dark:text-teal-400" /> 
    },
    { 
      name: 'Back to Site', 
      href: '/', 
      icon: <FaHome className="text-teal-500 dark:text-teal-400" /> 
    },
  ];
  
  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 backdrop-blur-sm lg:hidden dark:bg-opacity-70"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 shadow-lg lg:static lg:translate-x-0 
                  ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-200 ease-in-out
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className={`flex h-16 items-center justify-between px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="flex-shrink-0 flex items-center">
              <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-44 h-10">
                <g>
                  <defs>
                    <linearGradient id="crossGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5eead4"></stop>
                      <stop offset="100%" stopColor="#0f766e"></stop>
                    </linearGradient>
                  </defs>
                  <rect x="5" y="15" width="30" height="10" rx="5" fill="url(#crossGradient)"></rect>
                  <rect x="15" y="5" width="10" height="30" rx="5" fill="url(#crossGradient)"></rect>
                  <circle cx="20" cy="20" r="15" fill="#14b8a6" fillOpacity="0.2"></circle>
                  <text x="45" y="25" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#14b8a6">
                    <tspan fill={darkMode ? "#5eead4" : "#14b8a6"}>Med</tspan>
                    <tspan fill={darkMode ? "#14b8a6" : "#0f766e"}>Connect</tspan>
                  </text>
                  <text x="45" y="35" fontFamily="Arial, sans-serif" fontSize="6.666666666666667" fill="#14b8a6" opacity="0.8">Healthcare • Connected • Simplified</text>
                </g>
              </svg>
            </div>
          </Link>
          <button 
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none lg:hidden`}
            onClick={toggleSidebar}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="px-3 py-4 h-[calc(100%-140px)] overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive
                      ? `${darkMode ? 'bg-gray-700 text-teal-400' : 'bg-teal-50 text-teal-700'} font-medium`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className={`ml-auto w-1 h-5 ${darkMode ? 'bg-teal-400' : 'bg-teal-500'} rounded-full`} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className={`absolute bottom-0 w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-3 shadow-sm`}>
            <div className="flex items-center">
              <div className={`w-9 h-9 rounded-full ${darkMode ? 'bg-teal-800 text-teal-300' : 'bg-teal-100 text-teal-700'} flex items-center justify-center font-semibold shadow-sm`}>
                A
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin User</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@medconnect.com</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <button 
              onClick={toggleTheme} 
              className={`flex items-center justify-center w-full px-3 py-2 text-sm ${
                darkMode 
                  ? 'text-white bg-gray-700 hover:bg-gray-600' 
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              } rounded-lg transition-colors shadow-sm`}
            >
              {darkMode ? <FaSun className="mr-2 text-amber-400" /> : <FaMoon className="mr-2 text-teal-500" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link
              href="/api/auth/signout"
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-lg transition-colors shadow-sm"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} transition-shadow duration-300 z-10 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center">
              <button
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:outline-none lg:hidden`}
                onClick={toggleSidebar}
              >
                <FaBars size={20} />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-colors`}
              >
                {darkMode ? <FaSun size={18} className="text-amber-400" /> : <FaMoon size={18} className="text-teal-500" />}
              </button>
              
              <div className="relative">
                <button className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-colors relative`}>
                  <FaBell size={18} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="relative ml-3">
                <div className={`w-9 h-9 rounded-full ${darkMode ? 'bg-teal-800 text-teal-300' : 'bg-teal-100 text-teal-700'} flex items-center justify-center font-semibold shadow-sm`}>
                  A
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 