'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  Calendar, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell,
  FileText,
  Clipboard,
  Stethoscope,
  Scissors,
  Sun,
  Moon
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [provider, setProvider] = useState({
    name: 'Dr. Alex Smith',
    avatar: '/avatars/doctor.jpg',
    specialty: 'Cardiologist',
    notifications: 3
  });
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/provider/dashboard', icon: <Home className="h-6 w-6" /> },
    { name: 'Patients', href: '/provider/patients', icon: <Users className="h-6 w-6" /> },
    { name: 'Appointments', href: '/provider/appointments', icon: <Calendar className="h-6 w-6" /> },
    { name: 'Documentation', href: '/provider/documentation', icon: <FileText className="h-6 w-6" />, count: 5 },
    { name: 'Messages', href: '/provider/messages', icon: <MessageSquare className="h-6 w-6" />, count: 12 },
    { name: 'Surgeries', href: '/provider/surgeries', icon: <Scissors className="h-6 w-6" /> },
  ];
  
  const isActive = (href: string) => {
    if (href === '/provider') {
      return pathname === '/provider';
    }
    return pathname?.startsWith(href);
  };
  
  // Add signout handler
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/provider/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Redirect to sign in page after successful signout
        window.location.href = '/provider/auth/signin';
      } else {
        console.error('Failed to sign out');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex items-center">
          <Link href="/provider" className="flex items-center">
            <div className="relative h-8 w-8 overflow-hidden">
              <Image src="/logo.svg" alt="MedConnect Logo" width={32} height={32} className="animated-logo" />
            </div>
            <span className="ml-2 font-semibold">
              <span className="text-gray-800 dark:text-gray-200">Med</span>
              <span className="text-secondary-600 dark:text-secondary-500">Connect</span>
            </span>
          </Link>
        </div>
        <button className="relative p-1 text-gray-700 dark:text-gray-300 focus:outline-none">
          <Bell className="h-6 w-6" />
          {provider.notifications > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-emergency-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {provider.notifications}
            </span>
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <Link href="/provider" className="flex items-center">
              <div className="relative h-8 w-8 overflow-hidden">
                <Image src="/logo.svg" alt="MedConnect Logo" width={32} height={32} className="animated-logo" />
              </div>
              <span className="ml-2 font-semibold">
                <span className="text-gray-800 dark:text-gray-200">Med</span>
                <span className="text-secondary-600 dark:text-secondary-500">Connect</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-secondary-600 text-white flex items-center justify-center overflow-hidden">
                <User className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{provider.specialty}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                  >
                    <span className="mr-3 h-5 w-5">{item.icon}</span>
                    {item.name}
                    {item.count && item.count > 0 && (
                      <span className="ml-auto bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 py-0.5 px-2 rounded-full text-xs font-medium">
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-3 text-sm font-medium text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md w-full"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:bg-white lg:dark:bg-gray-800">
        <div className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-700">
          <Link href="/provider" className="flex items-center">
            <div className="relative h-8 w-8 overflow-hidden">
              <Image src="/logo.svg" alt="MedConnect Logo" width={32} height={32} className="animated-logo" />
            </div>
            <span className="ml-2 font-semibold">
              <span className="text-gray-800 dark:text-gray-200">Med</span>
              <span className="text-secondary-600 dark:text-secondary-500">Connect</span>
            </span>
          </Link>
        </div>
        
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-secondary-600 text-white flex items-center justify-center overflow-hidden">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{provider.specialty}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <span className="mr-3 h-5 w-5">{item.icon}</span>
                  {item.name}
                  {item.count && item.count > 0 && (
                    <span className="ml-auto bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 py-0.5 px-2 rounded-full text-xs font-medium">
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-3 text-sm font-medium text-red-700 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md w-full"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 