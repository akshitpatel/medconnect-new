'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreVertical, Edit, Trash, UserCheck, UserX, Shield, Key } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Define types
type AdminStatus = 'active' | 'inactive' | 'suspended';
type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'analyst';
type Permission = 'read' | 'write' | 'delete' | 'manage_users' | 'manage_providers' | 'manage_content' | 'view_analytics' | 'system_settings';

interface Administrator {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  department: string;
  registeredDate: string;
  lastLogin: string;
  status: AdminStatus;
  permissions: Permission[];
  twoFactorEnabled: boolean;
}

// Mock data
const MOCK_ADMINISTRATORS: Administrator[] = [
  {
    id: 'ADM-1001',
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '(555) 123-4567',
    role: 'super_admin',
    department: 'IT',
    registeredDate: '2022-01-05',
    lastLogin: '2023-03-14',
    status: 'active',
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_providers', 'manage_content', 'view_analytics', 'system_settings'],
    twoFactorEnabled: true
  },
  {
    id: 'ADM-1002',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    phone: '(555) 234-5678',
    role: 'admin',
    department: 'Operations',
    registeredDate: '2022-02-10',
    lastLogin: '2023-03-13',
    status: 'active',
    permissions: ['read', 'write', 'manage_users', 'manage_providers', 'view_analytics'],
    twoFactorEnabled: true
  },
  {
    id: 'ADM-1003',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '(555) 345-6789',
    role: 'moderator',
    department: 'Customer Support',
    registeredDate: '2022-03-15',
    lastLogin: '2023-03-12',
    status: 'active',
    permissions: ['read', 'write', 'manage_content'],
    twoFactorEnabled: false
  },
  {
    id: 'ADM-1004',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 456-7890',
    role: 'support',
    department: 'Customer Support',
    registeredDate: '2022-04-20',
    lastLogin: '2023-03-10',
    status: 'inactive',
    permissions: ['read', 'write'],
    twoFactorEnabled: true
  },
  {
    id: 'ADM-1005',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '(555) 567-8901',
    role: 'analyst',
    department: 'Analytics',
    registeredDate: '2022-05-25',
    lastLogin: '2023-03-01',
    status: 'active',
    permissions: ['read', 'view_analytics'],
    twoFactorEnabled: false
  }
];

export default function AdministratorsPage() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AdminStatus | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<AdminRole | 'all'>('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAdministrators(MOCK_ADMINISTRATORS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter administrators
  const filteredAdministrators = administrators.filter(admin => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || admin.status === selectedStatus;
    
    // Filter by role
    const matchesRole = selectedRole === 'all' || admin.role === selectedRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  // Format role for display
  const formatRole = (role: AdminRole): string => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administrator Management</h1>
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            <Shield className="inline-block mr-2 h-6 w-6 text-purple-500" />
            Administrator Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage system administrators, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search administrators..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Status: {selectedStatus === 'all' ? 'All' : selectedStatus}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {statusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  <div
                    onClick={() => {
                      setSelectedStatus('all');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'all' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('active');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'active' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Active
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('inactive');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'inactive' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Inactive
                  </div>
                  <div
                    onClick={() => {
                      setSelectedStatus('suspended');
                      setStatusDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedStatus === 'suspended' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Suspended
                  </div>
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Role: {selectedRole === 'all' ? 'All' : formatRole(selectedRole)}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
              {roleDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  <div
                    onClick={() => {
                      setSelectedRole('all');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'all' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    All
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('super_admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'super_admin' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Super Admin
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('admin');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Admin
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('moderator');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'moderator' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Moderator
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('support');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'support' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Support
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('analyst');
                      setRoleDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      selectedRole === 'analyst' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : ''
                    }`}
                  >
                    Analyst
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Administrators List */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAdministrators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No administrators found
                  </td>
                </tr>
              ) : (
                filteredAdministrators.map(admin => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {admin.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {admin.name}
                      <div className="text-xs text-gray-400">
                        {admin.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        admin.role === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                        admin.role === 'moderator' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        admin.role === 'support' ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}
                      >
                        {formatRole(admin.role)}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {admin.permissions.length} permissions
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {admin.email}
                      <div className="text-xs text-gray-400">
                        {admin.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Key className={`h-4 w-4 mr-2 ${admin.twoFactorEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>{admin.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${admin.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          admin.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                      >
                        {admin.status}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        Last login: {formatDate(admin.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(admin.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        {activeDropdown === admin.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Edit className="mr-3 h-4 w-4 text-gray-500 group-hover:text-purple-500" />
                                Edit
                              </button>
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Shield className="mr-3 h-4 w-4 text-gray-500 group-hover:text-purple-500" />
                                Permissions
                              </button>
                              {admin.status !== 'active' ? (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserCheck className="mr-3 h-4 w-4 text-gray-500 group-hover:text-green-500" />
                                  Activate
                                </button>
                              ) : (
                                <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <UserX className="mr-3 h-4 w-4 text-gray-500 group-hover:text-yellow-500" />
                                  Deactivate
                                </button>
                              )}
                              <button className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Trash className="mr-3 h-4 w-4 text-gray-500 group-hover:text-red-500" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
} 