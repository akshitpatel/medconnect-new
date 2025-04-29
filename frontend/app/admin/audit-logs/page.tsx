'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Download, Calendar, ClipboardList, AlertCircle, User, Shield, Clock, Activity } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import Link from 'next/link';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'warning';
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'user-123',
    userName: 'Dr. Emily Johnson',
    userRole: 'doctor',
    action: 'view',
    resource: 'patient_record',
    resourceId: 'patient-456',
    details: 'Viewed patient medical history',
    ipAddress: '192.168.1.101',
    timestamp: '2023-05-15T10:30:00Z',
    severity: 'low',
    status: 'success'
  },
  {
    id: 'log-002',
    userId: 'user-234',
    userName: 'Admin Alice',
    userRole: 'administrator',
    action: 'update',
    resource: 'system_settings',
    resourceId: 'setting-789',
    details: 'Updated notification preferences',
    ipAddress: '192.168.1.102',
    timestamp: '2023-05-15T09:45:00Z',
    severity: 'medium',
    status: 'success'
  },
  {
    id: 'log-003',
    userId: 'user-345',
    userName: 'Pharmacist Bob',
    userRole: 'pharmacist',
    action: 'create',
    resource: 'prescription',
    resourceId: 'prescription-567',
    details: 'Created new prescription for Patient #789',
    ipAddress: '192.168.1.103',
    timestamp: '2023-05-15T09:15:00Z',
    severity: 'medium',
    status: 'success'
  },
  {
    id: 'log-004',
    userId: 'user-456',
    userName: 'Unknown User',
    userRole: 'guest',
    action: 'login',
    resource: 'system',
    resourceId: 'n/a',
    details: 'Failed login attempt',
    ipAddress: '203.0.113.42',
    timestamp: '2023-05-15T08:30:00Z',
    severity: 'critical',
    status: 'failure'
  },
  {
    id: 'log-005',
    userId: 'user-567',
    userName: 'Dr. Michael Lee',
    userRole: 'doctor',
    action: 'delete',
    resource: 'appointment',
    resourceId: 'appointment-234',
    details: 'Cancelled appointment with Patient #345',
    ipAddress: '192.168.1.105',
    timestamp: '2023-05-15T08:00:00Z',
    severity: 'low',
    status: 'success'
  },
  {
    id: 'log-006',
    userId: 'user-678',
    userName: 'Nurse Carol',
    userRole: 'nurse',
    action: 'update',
    resource: 'patient_record',
    resourceId: 'patient-678',
    details: 'Updated vital signs',
    ipAddress: '192.168.1.106',
    timestamp: '2023-05-14T16:45:00Z',
    severity: 'low',
    status: 'success'
  },
  {
    id: 'log-007',
    userId: 'user-789',
    userName: 'Admin David',
    userRole: 'administrator',
    action: 'create',
    resource: 'user',
    resourceId: 'user-890',
    details: 'Created new user account for Dr. Rachel White',
    ipAddress: '192.168.1.107',
    timestamp: '2023-05-14T15:30:00Z',
    severity: 'medium',
    status: 'success'
  },
  {
    id: 'log-008',
    userId: 'user-890',
    userName: 'Patient Eric',
    userRole: 'patient',
    action: 'view',
    resource: 'billing',
    resourceId: 'invoice-123',
    details: 'Viewed personal billing information',
    ipAddress: '192.168.1.108',
    timestamp: '2023-05-14T14:15:00Z',
    severity: 'low',
    status: 'success'
  },
  {
    id: 'log-009',
    userId: 'system',
    userName: 'System',
    userRole: 'system',
    action: 'backup',
    resource: 'database',
    resourceId: 'n/a',
    details: 'Daily database backup completed',
    ipAddress: '192.168.1.1',
    timestamp: '2023-05-14T02:00:00Z',
    severity: 'medium',
    status: 'success'
  },
  {
    id: 'log-010',
    userId: 'user-123',
    userName: 'Dr. Emily Johnson',
    userRole: 'doctor',
    action: 'export',
    resource: 'patient_record',
    resourceId: 'patient-901',
    details: 'Exported patient data for external consultation',
    ipAddress: '192.168.1.101',
    timestamp: '2023-05-13T11:20:00Z',
    severity: 'high',
    status: 'warning'
  },
  {
    id: 'log-011',
    userId: 'user-456',
    userName: 'Unknown User',
    userRole: 'guest',
    action: 'login',
    resource: 'system',
    resourceId: 'n/a',
    details: 'Multiple failed login attempts',
    ipAddress: '203.0.113.50',
    timestamp: '2023-05-13T10:05:00Z',
    severity: 'critical',
    status: 'failure'
  },
  {
    id: 'log-012',
    userId: 'user-234',
    userName: 'Admin Alice',
    userRole: 'administrator',
    action: 'update',
    resource: 'permissions',
    resourceId: 'role-123',
    details: 'Modified role permissions for pharmacists',
    ipAddress: '192.168.1.102',
    timestamp: '2023-05-13T09:45:00Z',
    severity: 'high',
    status: 'success'
  }
];

const actions = ['all', 'view', 'create', 'update', 'delete', 'login', 'export', 'backup'];
const resources = ['all', 'patient_record', 'system_settings', 'prescription', 'system', 'appointment', 'user', 'billing', 'database', 'permissions'];
const userRoles = ['all', 'doctor', 'nurse', 'pharmacist', 'administrator', 'patient', 'guest', 'system'];
const severities = ['all', 'low', 'medium', 'high', 'critical'];
const statuses = ['all', 'success', 'failure', 'warning'];

type FilterValue = string | null;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [actionFilter, setActionFilter] = useState<FilterValue>('all');
  const [resourceFilter, setResourceFilter] = useState<FilterValue>('all');
  const [roleFilter, setRoleFilter] = useState<FilterValue>('all');
  const [severityFilter, setSeverityFilter] = useState<FilterValue>('all');
  const [statusFilter, setStatusFilter] = useState<FilterValue>('all');
  
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [resourceMenuOpen, setResourceMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [severityMenuOpen, setSeverityMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const [dateRange, setDateRange] = useState<{start: string | null, end: string | null}>({
    start: null,
    end: null
  });

  useEffect(() => {
    // Simulate API call to get audit logs
    const timer = setTimeout(() => {
      setLogs(MOCK_AUDIT_LOGS);
      setFilteredLogs(MOCK_AUDIT_LOGS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters when they change
    let results = logs;
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(log => 
        log.userName.toLowerCase().includes(lowercasedTerm) ||
        log.userId.toLowerCase().includes(lowercasedTerm) ||
        log.ipAddress.toLowerCase().includes(lowercasedTerm) ||
        log.details.toLowerCase().includes(lowercasedTerm) ||
        log.resourceId.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    // Apply action filter
    if (actionFilter && actionFilter !== 'all') {
      results = results.filter(log => log.action === actionFilter);
    }
    
    // Apply resource filter
    if (resourceFilter && resourceFilter !== 'all') {
      results = results.filter(log => log.resource === resourceFilter);
    }
    
    // Apply role filter
    if (roleFilter && roleFilter !== 'all') {
      results = results.filter(log => log.userRole === roleFilter);
    }
    
    // Apply severity filter
    if (severityFilter && severityFilter !== 'all') {
      results = results.filter(log => log.severity === severityFilter);
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      results = results.filter(log => log.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      results = results.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      results = results.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    setFilteredLogs(results);
  }, [searchTerm, actionFilter, resourceFilter, roleFilter, severityFilter, statusFilter, dateRange, logs]);

  const exportLogs = () => {
    // In a real application, this would generate a CSV file
    alert('Exporting logs to CSV...');
    // Implementation would depend on server-side capabilities
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            Success
          </span>
        );
      case 'failure':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            Failure
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            Warning
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const closeAllMenus = () => {
    setActionMenuOpen(false);
    setResourceMenuOpen(false);
    setRoleMenuOpen(false);
    setSeverityMenuOpen(false);
    setStatusMenuOpen(false);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ClipboardList className="mr-2 text-teal-500" />
          Audit Logs
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={exportLogs}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-full">
              <input
                type="date"
                value={dateRange.start || ''}
                onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Start Date"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="w-full">
              <input
                type="date"
                value={dateRange.end || ''}
                onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setActionFilter('all');
                setResourceFilter('all');
                setRoleFilter('all');
                setSeverityFilter('all');
                setStatusFilter('all');
                setDateRange({ start: null, end: null });
                closeAllMenus();
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {/* Action Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setActionMenuOpen(!actionMenuOpen);
                setResourceMenuOpen(false);
                setRoleMenuOpen(false);
                setSeverityMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-gray-400" />
                <span>Action: {actionFilter === 'all' ? 'All' : actionFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {actionMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1 max-h-60 overflow-y-auto">
                {actions.map((action) => (
                  <div
                    key={action}
                    onClick={() => {
                      setActionFilter(action);
                      setActionMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      actionFilter === action ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {action === 'all' ? 'All Actions' : action}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resource Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setResourceMenuOpen(!resourceMenuOpen);
                setActionMenuOpen(false);
                setRoleMenuOpen(false);
                setSeverityMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                <span>Resource: {resourceFilter === 'all' ? 'All' : resourceFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {resourceMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1 max-h-60 overflow-y-auto">
                {resources.map((resource) => (
                  <div
                    key={resource}
                    onClick={() => {
                      setResourceFilter(resource);
                      setResourceMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      resourceFilter === resource ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {resource === 'all' ? 'All Resources' : resource.replace('_', ' ')}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleMenuOpen(!roleMenuOpen);
                setActionMenuOpen(false);
                setResourceMenuOpen(false);
                setSeverityMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-400" />
                <span>Role: {roleFilter === 'all' ? 'All' : roleFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {roleMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1 max-h-60 overflow-y-auto">
                {userRoles.map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      roleFilter === role ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Severity Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setSeverityMenuOpen(!severityMenuOpen);
                setActionMenuOpen(false);
                setResourceMenuOpen(false);
                setRoleMenuOpen(false);
                setStatusMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-gray-400" />
                <span>Severity: {severityFilter === 'all' ? 'All' : severityFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {severityMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {severities.map((severity) => (
                  <div
                    key={severity}
                    onClick={() => {
                      setSeverityFilter(severity);
                      setSeverityMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      severityFilter === severity ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusMenuOpen(!statusMenuOpen);
                setActionMenuOpen(false);
                setResourceMenuOpen(false);
                setRoleMenuOpen(false);
                setSeverityMenuOpen(false);
              }}
              className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-400" />
                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            {statusMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {statuses.map((status) => (
                  <div
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      statusFilter === status ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No audit logs found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Resource
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.userName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Role: {log.userRole}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {log.resource.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {log.resourceId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedCard>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredLogs.length} of {logs.length} audit logs
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 