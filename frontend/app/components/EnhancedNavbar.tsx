'use client';


import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUserCog,
  FaIdCard,
  FaHospital,
  FaFlask,
  FaPills,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronRight,
  FaBookMedical,
  FaRegCreditCard,
  FaCalendarAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSelector from './LocationSelector';
import MedConnectLogo from '../logo-selection/medconnect-logo';

interface EnhancedNavbarProps {
  transparent?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export default function EnhancedNavbar({ transparent = false, user = null }: EnhancedNavbarProps) {
  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse pathname to create breadcrumbs
  const breadcrumbs = pathname && pathname !== '/' 
    ? pathname.split('/').filter(Boolean).map((path, index, array) => ({
        name: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        href: '/' + array.slice(0, index + 1).join('/'),
        current: index === array.length - 1
      }))
    : [];
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine navbar styles based on transparent prop and scroll state
  const navbarBg = transparent && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-sm border-b border-gray-100';

  const textColor = transparent && !isScrolled
    ? 'text-white hover:text-white/90'
    : 'text-medical-teal-600 hover:text-medical-teal-700';

  const hoverBg = transparent && !isScrolled
    ? 'bg-white/0 group-hover:bg-white/10'
    : 'bg-medical-teal-50/0 group-hover:bg-medical-teal-50';

  const iconColor = transparent && !isScrolled
    ? 'text-white'
    : 'text-medical-teal-600';
  
  // Main navigation links
  const mainNavLinks: NavItem[] = [
    { href: "/doctors", label: "Doctors", icon: <FaUserCog className="w-3.5 h-3.5" /> },
    { href: "/lab-tests", label: "Tests", icon: <FaFlask className="w-3.5 h-3.5" /> },
    { href: "/pharmacy", label: "Pharmacy", icon: <FaPills className="w-3.5 h-3.5" /> },
    { href: "/membership/health-passport", label: "Passport", icon: <FaIdCard className="w-3.5 h-3.5" /> }
  ];
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
          {/* Logo and main nav */}
          <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <MedConnectLogo 
                  variant="full"
                  isAnimated={true}
                  darkMode={transparent && !isScrolled}
                  className="h-8"
                />
                <span className="ml-1.5 px-1 text-xs font-bold uppercase rounded-sm bg-gradient-to-r from-medical-teal-500 to-medical-teal-600 text-white">
                  Beta
                </span>
            </Link>
            
            {/* Desktop navigation */}
              <div className="hidden md:ml-6 md:flex md:space-x-0.5">
                {mainNavLinks.map((item, i) => (
                <Link 
                  key={i}
                  href={item.href} 
                    className={`relative group px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                    item.highlight 
                        ? 'text-medical-red-600 hover:text-medical-red-700' 
                      : textColor
                  }`}
                >
                    <span className={`absolute inset-0 ${hoverBg} rounded-md transition-all duration-200`}></span>
                    <span className="relative flex items-center">
                      <span className="mr-1 transform group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      {item.label}
                    </span>
                </Link>
              ))}
            </div>
          </div>
          
            {/* Right section: Location, Sign In */}
            <div className="flex items-center space-x-1.5">
              {/* Location selector - visible on all screens */}
              <div className="flex-shrink-0">
              <LocationSelector />
            </div>
            
              {/* User profile dropdown (if logged in) */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex text-sm rounded-full focus:outline-none"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                    }}
                    aria-expanded={showUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatar ? (
                      <img
                        className="h-7 w-7 rounded-full"
                        src={user.avatar}
                        alt={`${user.name}'s profile`}
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-medical-teal-50 flex items-center justify-center">
                        <FaUser className="text-medical-teal-600 w-3.5 h-3.5" />
                      </div>
                    )}
            </button>
            
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        className="absolute right-0 mt-1 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-lg border border-gray-100 z-20"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="px-3 py-2">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-xs font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {[
                            { label: 'Profile', href: '/profile', icon: <FaUser /> },
                            { label: 'Records', href: '/profile/records', icon: <FaBookMedical /> },
                            { label: 'Appointments', href: '/profile/appointments', icon: <FaCalendarAlt /> },
                            { label: 'Payments', href: '/profile/payments', icon: <FaRegCreditCard /> }
                          ].map((item, i) => (
                            <Link
                              key={i}
                              href={item.href}
                              className="text-gray-700 hover:bg-gray-50 flex items-center px-3 py-1.5 text-xs"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <span className="mr-2 text-medical-teal-600 w-3 h-3">{item.icon}</span>
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="py-1">
            <Link 
                            href="/settings"
                            className="text-gray-700 hover:bg-gray-50 flex items-center px-3 py-1.5 text-xs"
                            onClick={() => setShowUserMenu(false)}
            >
                            <span className="mr-2 text-medical-teal-600 w-3 h-3"><FaCog /></span>
                            Settings
            </Link>
                        </div>
                        <div className="py-1">
                          <button
                            className="text-gray-700 hover:bg-gray-50 flex w-full items-center px-3 py-1.5 text-xs"
                            onClick={() => {
                              // Handle sign out logic
                              setShowUserMenu(false);
                            }}
                          >
                            <FaSignOutAlt className="mr-2 text-medical-red-500 w-3 h-3" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
            {/* Sign in button */}
            <Link 
              href="/auth/login" 
                    className="relative group px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hidden sm:block"
                  >
                    <span className="absolute inset-0 border border-medical-teal-200 group-hover:border-medical-teal-300 group-hover:bg-medical-teal-50/70 rounded-md transition-all duration-200"></span>
                    <span className="relative text-medical-teal-600 group-hover:text-medical-teal-700">Sign In</span>
            </Link>
            
            {/* Sign up button */}
            <Link 
              href="/auth/signup" 
                    className="relative group px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hidden sm:block"
                  >
                    <span className="absolute inset-0 bg-medical-teal-600 group-hover:bg-medical-teal-700 rounded-md transition-all duration-200"></span>
                    <span className="relative text-white z-10">Sign Up</span>
            </Link>
                </>
              )}
            
            {/* Mobile menu button */}
            <button 
                className="md:hidden inline-flex items-center justify-center p-1.5 rounded-md text-medical-teal-600 hover:text-medical-teal-700 hover:bg-medical-teal-50 focus:outline-none transition duration-150 ease-in-out"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
        <AnimatePresence>
      {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-white border-t border-gray-100 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {mainNavLinks.map((item, i) => (
              <Link 
                key={i}
                href={item.href} 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  item.highlight 
                        ? 'text-medical-red-600 hover:bg-medical-red-50' 
                        : 'text-medical-teal-600 hover:bg-medical-teal-50 hover:text-medical-teal-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                    <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {/* Mobile sign in/up buttons */}
            <div className="px-3 py-2 flex flex-col space-y-2">
              <Link 
                href="/auth/login" 
                        className="block w-full px-3 py-2 text-center border border-medical-teal-200 rounded-md text-medical-teal-600 hover:bg-medical-teal-50 text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                        className="block w-full px-3 py-2 text-center bg-medical-teal-600 hover:bg-medical-teal-700 rounded-md text-white text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Breadcrumbs for inner pages */}
      {isScrolled && breadcrumbs.length > 0 && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm transition-all duration-300 py-1.5">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1.5">
                <li>
                  <Link 
                    href="/" 
                    className="text-medical-teal-600 hover:text-medical-teal-700"
                  >
                    <FaHospital className="w-3.5 h-3.5" />
                    <span className="sr-only">Home</span>
                  </Link>
                </li>
                
                {breadcrumbs.map((item, i) => (
                  <li key={i} className="flex items-center">
                    <FaChevronRight className="h-2.5 w-2.5 text-gray-400" />
                    <Link
                      href={item.href}
                      className={`ml-1 text-xs font-medium ${
                        item.current 
                          ? 'text-medical-teal-600' 
                          : 'text-gray-600 hover:text-medical-teal-600'
                      }`}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 