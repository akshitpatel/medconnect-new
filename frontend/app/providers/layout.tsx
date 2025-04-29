'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Users, 
  Pill, 
  ClipboardList, 
  Home, 
  Settings, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  Search,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  User,
  FileText,
  MessageSquare,
  BarChart2,
  Activity,
  Building2,
  Microscope,
  GraduationCap,
  HeartPulse,
  Stethoscope,
  TestTube,
  Thermometer,
  Syringe,
  Bed,
  BookOpen,
  ReceiptText,
  Layers,
  Truck,
  Clock,
  DollarSign
} from 'lucide-react';
import { ProviderContextProvider, useProviderContext, ProviderType } from '../contexts/ProviderContext';

// Define navigation item interface
interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

// Inner component that uses context
function ProvidersLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { providerType, setProviderType } = useProviderContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Handle scroll for glass navbar effect
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
  
  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Component mount animation
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#profile-menu-button') && !target.closest('#profile-menu')) {
        setShowProfileMenu(false);
      }
      if (!target.closest('#notifications-button') && !target.closest('#notifications-menu')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Mock notifications data
  const notifications = [
    { id: 1, title: 'New appointment', message: 'John Doe scheduled an appointment', time: '5 minutes ago', read: false },
    { id: 2, title: 'Appointment cancelled', message: 'Emily Smith cancelled her appointment', time: '1 hour ago', read: false },
    { id: 3, title: 'Lab results available', message: 'New lab results for patient #12345', time: '3 hours ago', read: true },
    { id: 4, title: 'System maintenance', message: 'Scheduled maintenance tonight at 2 AM', time: 'Yesterday', read: true },
  ];
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const getProviderIcon = (type: ProviderType | null) => {
    switch(type) {
      case 'doctor':
        return <Stethoscope className="h-5 w-5 text-teal-500" />;
      case 'hospital':
        return <Building2 className="h-5 w-5 text-teal-500" />;
      case 'lab':
        return <Microscope className="h-5 w-5 text-teal-500" />;
      case 'pharmacy':
        return <Pill className="h-5 w-5 text-teal-500" />;
      default:
        return <User className="h-5 w-5 text-teal-500" />;
    }
  };

  // Navigation items for doctor
  const doctorNavItems: NavItem[] = [
    { href: '/providers/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/providers/appointments', icon: <Calendar className="h-5 w-5" />, label: 'Appointments' },
    { href: '/providers/patients', icon: <Users className="h-5 w-5" />, label: 'Patients' },
    { href: '/providers/prescriptions', icon: <ClipboardList className="h-5 w-5" />, label: 'Prescriptions' },
    { href: '/providers/records', icon: <FileText className="h-5 w-5" />, label: 'Medical Records' },
    { href: '/providers/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', badge: 3 },
    { href: '/providers/analytics', icon: <BarChart2 className="h-5 w-5" />, label: 'Analytics' },
  ];

  // Navigation items for hospital
  const hospitalNavItems: NavItem[] = [
    { href: '/providers/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/providers/departments', icon: <Layers className="h-5 w-5" />, label: 'Departments' },
    { href: '/providers/admissions', icon: <Calendar className="h-5 w-5" />, label: 'Admissions' },
    { href: '/providers/patients', icon: <Bed className="h-5 w-5" />, label: 'Patients' },
    { href: '/providers/staff', icon: <Users className="h-5 w-5" />, label: 'Staff' },
    { href: '/providers/emergencies', icon: <HeartPulse className="h-5 w-5" />, label: 'Emergencies', badge: 1 },
    { href: '/providers/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', badge: 5 },
    { href: '/providers/analytics', icon: <BarChart2 className="h-5 w-5" />, label: 'Analytics' },
    { href: '/providers/billing', icon: <DollarSign className="h-5 w-5" />, label: 'Billing' },
  ];

  // Navigation items for lab
  const labNavItems: NavItem[] = [
    { href: '/providers/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/providers/orders', icon: <ClipboardList className="h-5 w-5" />, label: 'Test Orders' },
    { href: '/providers/tests', icon: <TestTube className="h-5 w-5" />, label: 'Lab Tests' },
    { href: '/providers/samples', icon: <Thermometer className="h-5 w-5" />, label: 'Samples' },
    { href: '/providers/results', icon: <FileText className="h-5 w-5" />, label: 'Results' },
    { href: '/providers/patients', icon: <Users className="h-5 w-5" />, label: 'Patients' },
    { href: '/providers/appointments', icon: <Calendar className="h-5 w-5" />, label: 'Appointments' },
    { href: '/providers/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
    { href: '/providers/analytics', icon: <BarChart2 className="h-5 w-5" />, label: 'Analytics' },
    { href: '/providers/billing', icon: <DollarSign className="h-5 w-5" />, label: 'Billing' },
  ];

  // Navigation items for pharmacy
  const pharmacyNavItems: NavItem[] = [
    { href: '/providers/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/providers/orders', icon: <ClipboardList className="h-5 w-5" />, label: 'Orders' },
    { href: '/providers/prescriptions', icon: <FileText className="h-5 w-5" />, label: 'Prescriptions' },
    { href: '/providers/medications', icon: <Pill className="h-5 w-5" />, label: 'Medications' },
    { href: '/providers/deliveries', icon: <Truck className="h-5 w-5" />, label: 'Deliveries' },
    { href: '/providers/customers', icon: <Users className="h-5 w-5" />, label: 'Customers' },
    { href: '/providers/messages', icon: <MessageSquare className="h-5 w-5" />, label: 'Messages' },
    { href: '/providers/analytics', icon: <BarChart2 className="h-5 w-5" />, label: 'Analytics' },
    { href: '/providers/billing', icon: <DollarSign className="h-5 w-5" />, label: 'Billing' },
  ];

  // Get current navigation items based on provider type
  const getCurrentNavItems = (): NavItem[] => {
    switch(providerType) {
      case 'doctor':
        return doctorNavItems;
      case 'hospital':
        return hospitalNavItems;
      case 'lab':
        return labNavItems;
      case 'pharmacy':
        return pharmacyNavItems;
      default:
        return doctorNavItems;
    }
  };

  // Get profile title based on provider type
  const getProfileTitle = (): string => {
    switch(providerType) {
      case 'doctor':
        return 'Dr. Richard Davis';
      case 'hospital':
        return 'Central Hospital';
      case 'lab':
        return 'City Diagnostics';
      case 'pharmacy':
        return 'MedLife Pharmacy';
      default:
        return 'Provider Profile';
    }
  };

  // Get profile subtitle based on provider type
  const getProfileSubtitle = (): string => {
    switch(providerType) {
      case 'doctor':
        return 'Cardiologist';
      case 'hospital':
        return 'Multi-Specialty Hospital';
      case 'lab':
        return 'Diagnostic Center';
      case 'pharmacy':
        return 'Retail Pharmacy';
      default:
        return 'Healthcare Provider';
    }
  };

  // Get profile initials
  const getProfileInitials = (): string => {
    switch(providerType) {
      case 'doctor':
        return 'DR';
      case 'hospital':
        return 'CH';
      case 'lab':
        return 'CD';
      case 'pharmacy':
        return 'MP';
      default:
        return 'HC';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/providers/dashboard" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.svg" 
                  alt="MedConnect Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                MedConnect
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Provider type selector */}
          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <div 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors duration-200"
              onClick={() => setProviderType(providerType !== null ? 'doctor' : 'doctor')}
            >
              {getProviderIcon(providerType)}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {providerType ? providerType.charAt(0).toUpperCase() + providerType.slice(1) : 'Select Type'}
              </span>
              <ChevronDown className={`ml-auto h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200`} />
            </div>
            <div className="mt-2 space-y-1 pl-2 animate-fade-in">
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors duration-200 ${providerType === 'doctor' ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                onClick={() => setProviderType('doctor')}
              >
                <Stethoscope className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Doctor</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors duration-200 ${providerType === 'hospital' ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                onClick={() => setProviderType('hospital')}
              >
                <Building2 className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Hospital</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors duration-200 ${providerType === 'lab' ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                onClick={() => setProviderType('lab')}
              >
                <Microscope className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Laboratory</span>
              </div>
              <div 
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer transition-colors duration-200 ${providerType === 'pharmacy' ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
                onClick={() => setProviderType('pharmacy')}
              >
                <Pill className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Pharmacy</span>
              </div>
            </div>
          </div>
          
          {/* Sidebar navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {getCurrentNavItems().map((item, index) => (
                <li 
                  key={item.href} 
                  className="animate-slide-in" 
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <Link 
                    href={item.href} 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 group transition-colors duration-200"
                  >
                    <div className="flex justify-center items-center w-5 h-5 text-teal-500 transition duration-200 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center h-5 w-5 text-xs font-semibold text-white bg-teal-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 animate-slide-in" style={{ animationDelay: '450ms' }}>
              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Settings
              </h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link 
                    href="/providers/profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 group transition-colors duration-200"
                  >
                    <div className="flex justify-center items-center w-5 h-5 text-teal-500 transition duration-200 group-hover:scale-110">
                      <User className="h-5 w-5" />
                    </div>
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/providers/settings" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-700 dark:text-gray-300 group transition-colors duration-200"
                  >
                    <div className="flex justify-center items-center w-5 h-5 text-teal-500 transition duration-200 group-hover:scale-110">
                      <Settings className="h-5 w-5" />
                    </div>
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-slide-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-md">
                {getProfileInitials()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{getProfileTitle()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getProfileSubtitle()}</p>
              </div>
              <LogOut className="ml-auto h-5 w-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-teal-500 dark:hover:text-teal-400 transition-colors" />
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* Top navigation */}
        <header className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm' 
            : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md'
        }`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 focus:outline-none transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Page title - on mobile only */}
              <div className="lg:hidden flex items-center">
                <div className="relative h-8 w-8">
                  <Image 
                    src="/logo.svg" 
                    alt="MedConnect Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="ml-2 text-lg font-bold text-teal-600 dark:text-teal-500">
                  MedConnect
                </span>
              </div>
              
              {/* Search */}
              <div className="hidden md:flex flex-1 max-w-md mx-auto lg:mx-0 lg:ml-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300/70 dark:border-gray-600/70 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Search ${providerType === 'doctor' ? 'patients, appointments...' : 
                                  providerType === 'hospital' ? 'patients, staff, departments...' : 
                                  providerType === 'lab' ? 'tests, samples, patients...' : 
                                  providerType === 'pharmacy' ? 'medications, prescriptions...' : 
                                  'items...'}`}
                  />
                </div>
              </div>
              
              {/* Right navigation */}
              <div className="flex items-center gap-4">
                {/* Theme toggle */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                
                {/* Help */}
                <button 
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                  aria-label="Help"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    id="notifications-button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                    aria-label={`Notifications ${unreadNotificationsCount > 0 ? `(${unreadNotificationsCount} unread)` : ''}`}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-teal-500 text-white animate-pulse">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div 
                      id="notifications-menu"
                      className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200/70 dark:border-gray-700/70 z-50 animate-fade-in"
                    >
                      <div className="p-3 border-b border-gray-200/70 dark:border-gray-700/70 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button className="text-xs text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification, index) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-gray-200/70 dark:border-gray-700/70 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors animate-slide-in`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex">
                              <div className={`flex-shrink-0 h-9 w-9 rounded-full ${
                                !notification.read 
                                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' 
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              } flex items-center justify-center`}>
                                <Bell className="h-4 w-4" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200/70 dark:border-gray-700/70 text-center">
                        <Link href="/providers/notifications" className="text-sm text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    id="profile-menu-button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center text-sm transition-all duration-200 ease-in-out hover:ring-2 hover:ring-teal-500/50 rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center text-white shadow-md">
                      {getProfileInitials()}
                    </div>
                  </button>
                  
                  {/* Profile dropdown menu */}
                  {showProfileMenu && (
                    <div 
                      id="profile-menu"
                      className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200/70 dark:border-gray-700/70 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-3 border-b border-gray-200/70 dark:border-gray-700/70">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getProfileTitle()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {providerType === 'doctor' ? 'richard.davis@example.com' : 
                           providerType === 'hospital' ? 'info@centralhospital.com' :
                           providerType === 'lab' ? 'info@citydiagnostics.com' :
                           providerType === 'pharmacy' ? 'info@medlifepharmacy.com' :
                           'info@medconnect.com'}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link 
                          href="/providers/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        >
                          Your Profile
                        </Link>
                        <Link 
                          href="/providers/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        >
                          Settings
                        </Link>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                          onClick={() => setDarkMode(!darkMode)}
                        >
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <Link 
                          href="/providers/help" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        >
                          Help Center
                        </Link>
                      </div>
                      <div className="py-1 border-t border-gray-200/70 dark:border-gray-700/70">
                        <Link 
                          href="/auth/logout" 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                        >
                          Sign out
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-6 px-4 sm:px-6 lg:px-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative h-8 w-8 transition-transform duration-300 hover:scale-110">
                <Image 
                  src="/logo.svg" 
                  alt="MedConnect Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                © 2023 MedConnect. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                Privacy
              </Link>
              <Link href="/security" className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                Security
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>MedConnect is a platform connecting patients with healthcare providers. Not for use in emergencies.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Wrapper component that provides the context
export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderContextProvider>
      <ProvidersLayoutInner>
        {children}
      </ProvidersLayoutInner>
    </ProviderContextProvider>
  );
} 