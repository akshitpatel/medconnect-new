'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  Building,
  TestTube,
  CalendarClock,
  Pill,
  FileText,
  BarChart3,
  Bell,
  FileEdit,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  X
} from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import SVGLogo from './SVGLogo';
import AdminPulseEffect from './AdminPulseEffect';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ isOpen = true, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    users: false,
    providers: true, // Open by default
    content: false,
  });
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Toggle submenu
  const toggleSubmenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Check if path is active
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  // Menu items
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      submenu: [
        {
          title: 'Patients',
          path: '/admin/users/patients',
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: 'Providers',
          path: '/admin/users/providers',
          icon: <Stethoscope className="h-4 w-4" />,
        },
        {
          title: 'Administrators',
          path: '/admin/users/administrators',
          icon: <UserCog className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Providers',
      path: '/admin/providers',
      icon: <Building className="h-5 w-5" />,
      submenu: [
        {
          title: 'Doctors',
          path: '/admin/providers/doctors',
          icon: <Stethoscope className="h-4 w-4" />,
        },
        {
          title: 'Pharmacies',
          path: '/admin/providers/pharmacies',
          icon: <Pill className="h-4 w-4" />,
        },
        {
          title: 'Labs',
          path: '/admin/providers/labs',
          icon: <TestTube className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Appointments',
      path: '/admin/appointments',
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      title: 'Medications',
      path: '/admin/medications',
      icon: <Pill className="h-5 w-5" />,
    },
    {
      title: 'Health Records',
      path: '/admin/health-records',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Notifications',
      path: '/admin/notifications',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: 'Content',
      path: '/admin/content',
      icon: <FileEdit className="h-5 w-5" />,
      submenu: [
        {
          title: 'Articles',
          path: '/admin/content/articles',
          icon: <FileEdit className="h-4 w-4" />,
        },
        {
          title: 'FAQs',
          path: '/admin/content/faqs',
          icon: <ClipboardList className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Audit Logs',
      path: '/admin/audit-logs',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: 'System Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center">
          <SVGLogo size={45} />
        </Link>
        {/* Mobile close button - only shown on mobile */}
        {onToggle && (
          <button 
            onClick={onToggle}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title.toLowerCase())}
                    onMouseEnter={() => setActiveItem(item.title)}
                    onMouseLeave={() => setActiveItem(null)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${activeItem === item.title ? 'shadow-md transform -translate-y-px' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="text-teal-600 dark:text-teal-400 transition-transform duration-200 transform group-hover:scale-110">
                        {item.icon}
                        {activeItem === item.title && isActive(item.path) && (
                          <AdminPulseEffect size={24} className="absolute -z-10" />
                        )}
                      </span>
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {openMenus[item.title.toLowerCase()] ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </button>

                  {/* Submenu */}
                  <div 
                    className={`mt-1 pl-4 space-y-1 overflow-hidden transition-all duration-300 ${
                      openMenus[item.title.toLowerCase()] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.submenu.map((subitem) => (
                      <li key={subitem.title}>
                        <Link
                          href={subitem.path}
                          className={`flex items-center px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                            isActive(subitem.path)
                              ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                          } hover:shadow-sm hover:-translate-y-px`}
                          onClick={() => {
                            if (onToggle && window.innerWidth < 768) {
                              onToggle();
                            }
                          }}
                        >
                          <span className="text-teal-500 dark:text-teal-400 transition-transform duration-200 hover:scale-110">
                            {subitem.icon}
                          </span>
                          <span className="ml-3">{subitem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.path}
                  onMouseEnter={() => setActiveItem(item.title)}
                  onMouseLeave={() => setActiveItem(null)}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${activeItem === item.title ? 'shadow-md -translate-y-px' : ''}`}
                  onClick={() => {
                    if (onToggle && window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                >
                  <span className="relative text-teal-600 dark:text-teal-400 transition-transform duration-200 transform group-hover:scale-110">
                    {item.icon}
                    {activeItem === item.title && isActive(item.path) && (
                      <AdminPulseEffect size={24} className="absolute -z-10" />
                    )}
                  </span>
                  <span className="ml-3">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 flex items-center justify-center text-white font-medium relative overflow-hidden group">
            <span className="transition-transform duration-300 group-hover:scale-0">AP</span>
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 scale-0 group-hover:scale-100">
              <UserCog className="h-5 w-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-20" style={{ transform: 'rotate(45deg) translateX(-100%)', transition: 'all 0.5s ease' }}></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@medconnect.com</p>
          </div>
        </div>
        <button 
          className="mt-4 flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 group hover:shadow-sm"
        >
          <LogOut className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:translate-x-[-4px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 