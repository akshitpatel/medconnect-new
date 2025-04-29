'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { useAuth } from '@/app/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { BellIcon, HomeIcon, UserIcon, LogOutIcon, ChevronDownIcon } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Check if link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  // Determine dashboard link based on user role
  const isProvider = false; // Set to true for provider, false for patient
  const dashboardLink = isProvider ? '/provider/dashboard' : '/patient/dashboard';
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 5C11.716 5 5 11.716 5 20c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15zm0 4c1.105 0 2 .895 2 2v7h7c1.105 0 2 .895 2 2s-.895 2-2 2h-7v7c0 1.105-.895 2-2 2s-2-.895-2-2v-7H11c-1.105 0-2-.895-2-2s.895-2 2-2h7v-7c0-1.105.895-2 2-2z"
                  fill="url(#logoGradient)"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
              MedConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: '/doctors', label: 'Find Doctors' },
              { href: '/lab-tests', label: 'Lab Tests' },
              { href: '/pharmacy', label: 'Medicines' },
              { href: '/emergency', label: 'Emergency' }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-teal-600 dark:hover:text-teal-400",
                  isActive(href)
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">
                      {user.fullName?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.fullName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email || 'user@example.com'}
                            </p>
                          </div>

                          <div className="py-1">
                            {[
                              { href: dashboardLink, label: 'Dashboard', icon: HomeIcon },
                              { href: '/appointments', label: 'Appointments' },
                              { href: '/medical-records', label: 'Medical Records' },
                              { href: '/prescriptions', label: 'Prescriptions' }
                            ].map(({ href, label, icon: Icon }) => (
                              <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                onClick={() => setIsProfileOpen(false)}
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                                {label}
                              </Link>
                            ))}
                          </div>

                          <div className="py-1 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                              <LogOutIcon className="h-4 w-4" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-2">
                {[
                  { href: '/doctors', label: 'Find Doctors' },
                  { href: '/lab-tests', label: 'Lab Tests' },
                  { href: '/pharmacy', label: 'Medicines' },
                  { href: '/emergency', label: 'Emergency' }
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(href)
                        ? "bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={closeMenu}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 