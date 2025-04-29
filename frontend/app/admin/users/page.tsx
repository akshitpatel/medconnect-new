'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  MoreHorizontal,
  UserPlus,
  Edit,
  Lock,
  Trash2,
  Mail,
  Users,
  UserRound,
  UserCog,
  CircleUser,
  Clock,
  LayoutDashboard,
  ArrowUpDown,
  Download,
  RefreshCw,
  Check,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UserX,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/Avatar';

type UserRole = 'patient' | 'doctor' | 'admin' | 'pharmacist' | 'lab_technician';
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: Date;
  joinDate: Date;
}

interface UserStats {
  total: number;
    active: number;
    inactive: number;
  newThisMonth: number;
  roleDistribution: {
    patient: number;
    doctor: number;
    admin: number;
    pharmacist: number;
    lab_technician: number;
  };
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  useEffect(() => {
    // Mock data
    const mockUsers: User[] = [
      {
        id: "USR001",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "patient",
        status: "active",
        lastActive: new Date(2023, 4, 15, 10, 30),
        joinDate: new Date(2022, 1, 15)
      },
      {
        id: "USR002",
        name: "Dr. Emily Davis",
        email: "emily.davis@example.com",
        role: "doctor",
        status: "active",
        lastActive: new Date(2023, 4, 15, 9, 45),
        joinDate: new Date(2021, 8, 20)
      },
      {
        id: "USR003",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        role: "patient",
        status: "inactive",
        lastActive: new Date(2023, 3, 20, 14, 15),
        joinDate: new Date(2022, 3, 10)
      },
      {
        id: "USR004",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "admin",
        status: "active",
        lastActive: new Date(2023, 4, 15, 16, 20),
        joinDate: new Date(2020, 6, 5)
      },
      {
        id: "USR005",
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        role: "pharmacist",
        status: "active",
        lastActive: new Date(2023, 4, 14, 11, 10),
        joinDate: new Date(2021, 10, 8)
      },
      {
        id: "USR006",
        name: "Lisa Brown",
        email: "lisa.brown@example.com",
        role: "lab_technician",
        status: "pending",
        lastActive: new Date(2023, 4, 12, 9, 30),
        joinDate: new Date(2023, 4, 12)
      },
      {
        id: "USR007",
        name: "Dr. James Wilson",
        email: "james.wilson@example.com",
        role: "doctor",
        status: "suspended",
        lastActive: new Date(2023, 3, 5, 15, 45),
        joinDate: new Date(2021, 5, 15)
      },
      {
        id: "USR008",
        name: "Emma Garcia",
        email: "emma.garcia@example.com",
        role: "patient",
        status: "active",
        lastActive: new Date(2023, 4, 14, 17, 30),
        joinDate: new Date(2022, 8, 22)
      }
    ];
    
    const mockStats: UserStats = {
      total: mockUsers.length,
      active: mockUsers.filter(user => user.status === 'active').length,
      inactive: mockUsers.filter(user => user.status === 'inactive' || user.status === 'suspended').length,
      newThisMonth: 12,
      roleDistribution: {
        patient: mockUsers.filter(user => user.role === 'patient').length,
        doctor: mockUsers.filter(user => user.role === 'doctor').length,
        admin: mockUsers.filter(user => user.role === 'admin').length,
        pharmacist: mockUsers.filter(user => user.role === 'pharmacist').length,
        lab_technician: mockUsers.filter(user => user.role === 'lab_technician').length
      }
    };
    
    setTimeout(() => {
      setUserList(mockUsers);
      setUserStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleDropdown = (userId: string) => {
    if (activeDropdown === userId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(userId);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
    }).format(date);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const sortedUsers = [...userList].sort((a, b) => {
    let compareResult = 0;
    
    switch (sortBy) {
      case 'name':
        compareResult = a.name.localeCompare(b.name);
        break;
      case 'email':
        compareResult = a.email.localeCompare(b.email);
        break;
      case 'role':
        compareResult = a.role.localeCompare(b.role);
        break;
      case 'status':
        compareResult = a.status.localeCompare(b.status);
        break;
      case 'lastActive':
        compareResult = a.lastActive.getTime() - b.lastActive.getTime();
        break;
      case 'joinDate':
        compareResult = a.joinDate.getTime() - b.joinDate.getTime();
        break;
    default:
        compareResult = 0;
    }
    
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });
  
  const filteredUsers = sortedUsers.filter(user => {
    const matchesSearch = 
      searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'patients' && user.role === 'patient') ||
      (selectedTab === 'doctors' && user.role === 'doctor') ||
      (selectedTab === 'staff' && ['admin', 'pharmacist', 'lab_technician'].includes(user.role));
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });
  
  const RoleBadge = ({ role }: { role: UserRole }) => {
    const roleData = {
      patient: {
        label: 'Patient',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <UserRound className="h-3 w-3 mr-1" />
      },
      doctor: {
        label: 'Doctor',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: <UserCog className="h-3 w-3 mr-1" />
      },
      admin: {
        label: 'Admin',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <ShieldCheck className="h-3 w-3 mr-1" />
      },
      pharmacist: {
        label: 'Pharmacist',
        className: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: <CircleUser className="h-3 w-3 mr-1" />
      },
      lab_technician: {
        label: 'Lab Tech',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <CircleUser className="h-3 w-3 mr-1" />
      }
    };
    
    return (
      <Badge variant="outline" className={roleData[role].className}>
        {roleData[role].icon}
        {roleData[role].label}
      </Badge>
    );
  };
  
  const StatusBadge = ({ status }: { status: UserStatus }) => {
    const statusData = {
      active: {
        label: 'Active',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: <Check className="h-3 w-3 mr-1" />
      },
      inactive: {
        label: 'Inactive',
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      pending: {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <ShieldAlert className="h-3 w-3 mr-1" />
      },
      suspended: {
        label: 'Suspended',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: <ShieldX className="h-3 w-3 mr-1" />
      }
    };
    
    return (
      <Badge variant="outline" className={statusData[status].className}>
        {statusData[status].icon}
        {statusData[status].label}
      </Badge>
    );
  };
  
  if (loading) {
  return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
              </div>
            </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Users className="mr-3 h-8 w-8 text-blue-500" />
          User Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage users, roles, and access permissions
        </p>
          </div>
          
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.total || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              +{userStats?.newThisMonth || 0} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.active || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {userStats ? Math.round((userStats.active / userStats.total) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.roleDistribution.patient || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {userStats ? Math.round((userStats.roleDistribution.patient / userStats.total) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Healthcare Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.roleDistribution.doctor || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {userStats ? Math.round((userStats.roleDistribution.doctor / userStats.total) * 100) : 0}% of total users
            </p>
          </CardContent>
        </Card>
          </div>
          
      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
          </div>
          
      {/* Tabs and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setSelectedTab('all')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'all' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                All Users
              </button>
              <button 
                onClick={() => setSelectedTab('patients')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'patients' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Patients
              </button>
              <button 
                onClick={() => setSelectedTab('doctors')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'doctors' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Doctors
              </button>
              <button 
                onClick={() => setSelectedTab('staff')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'staff' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Staff
              </button>
        </div>
        
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Role Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(prev => !prev)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Role: {roleFilter === 'all' ? 'All' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1).replace('_', ' ')}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                {showFilters && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => { setRoleFilter('all'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => { setRoleFilter('patient'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'patient' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Patient
                    </div>
                    <div
                      onClick={() => { setRoleFilter('doctor'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'doctor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Doctor
            </div>
                    <div
                      onClick={() => { setRoleFilter('admin'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'admin' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Admin
            </div>
                    <div
                      onClick={() => { setRoleFilter('pharmacist'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'pharmacist' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Pharmacist
            </div>
                    <div
                      onClick={() => { setRoleFilter('lab_technician'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        roleFilter === 'lab_technician' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Lab Technician
                    </div>
                  </div>
                )}
            </div>
            
              {/* Status Filter */}
              <div className="relative">
            <button
                  onClick={() => setShowFilters(prev => !prev)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
                {showFilters && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      All
        </div>
                    <div
                      onClick={() => { setStatusFilter('active'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'active' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Active
                    </div>
                    <div
                      onClick={() => { setStatusFilter('inactive'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'inactive' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Inactive
                    </div>
                    <div
                      onClick={() => { setStatusFilter('pending'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Pending
                    </div>
                    <div
                      onClick={() => { setStatusFilter('suspended'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'suspended' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Suspended
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {selectedTab === 'all' ? 'All users' : 
             selectedTab === 'patients' ? 'Patient users' :
             selectedTab === 'doctors' ? 'Doctor users' : 'Staff users'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search criteria</p>
                          </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <div key={user.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-800 rounded-full">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-2">
                            {user.name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({user.id})
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <RoleBadge role={user.role} />
                          <StatusBadge status={user.status} />
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-right">
                        <div>Joined: {formatDate(user.joinDate)}</div>
                        <div>Last active: {formatDate(user.lastActive)} at {formatTime(user.lastActive)}</div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="outline" size="sm" className="text-amber-600 dark:text-amber-400">
                            <UserX className="h-4 w-4 mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-green-600 dark:text-green-400">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
          </div>
              </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredUsers.length} of {userList.length} users
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
        </div>
        </CardFooter>
      </Card>
      </div>
  );
} 