'use client';

import React, { useState, useEffect } from 'react';
import { useProviderContext } from '@/app/contexts/ProviderContext';
import { 
  Activity, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Pill,
  Stethoscope,
  Building2,
  Microscope,
  HeartPulse,
  Layers,
  Thermometer,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

interface AppointmentProps {
  id: string;
  patientName: string;
  time: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: string;
}

const Dashboard = () => {
  const { providerType } = useProviderContext();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // For animation purposes
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get provider-specific icon
  const getProviderIcon = () => {
    switch(providerType) {
      case 'doctor':
        return <Stethoscope className="h-8 w-8 text-teal-500" />;
      case 'hospital':
        return <Building2 className="h-8 w-8 text-teal-500" />;
      case 'lab':
        return <Microscope className="h-8 w-8 text-teal-500" />;
      case 'pharmacy':
        return <Pill className="h-8 w-8 text-teal-500" />;
      default:
        return <Activity className="h-8 w-8 text-teal-500" />;
    }
  };
  
  // Get welcome message based on provider type
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    let greeting = 'Good ';
    
    if (currentHour < 12) {
      greeting += 'Morning';
    } else if (currentHour < 18) {
      greeting += 'Afternoon';
    } else {
      greeting += 'Evening';
    }
    
    switch(providerType) {
      case 'doctor':
        return `${greeting}, Dr. Richard Davis`;
      case 'hospital':
        return `${greeting}, Central Hospital Team`;
      case 'lab':
        return `${greeting}, City Diagnostics Team`;
      case 'pharmacy':
        return `${greeting}, MedLife Pharmacy Team`;
      default:
        return `${greeting}, Healthcare Provider`;
    }
  };
  
  // Get statistics based on provider type
  const getStatistics = (): StatCardProps[] => {
    switch(providerType) {
      case 'doctor':
        return [
          {
            title: 'Total Patients',
            value: '256',
            icon: <Users className="h-6 w-6" />,
            trend: { value: 12, isUp: true },
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Today\'s Appointments',
            value: '12',
            icon: <Calendar className="h-6 w-6" />,
            trend: { value: 4, isUp: true },
            color: 'from-teal-500 to-teal-600',
          },
          {
            title: 'Pending Reports',
            value: '8',
            icon: <FileText className="h-6 w-6" />,
            trend: { value: 2, isUp: false },
            color: 'from-amber-500 to-amber-600',
          },
          {
            title: 'Monthly Earnings',
            value: '$8,540',
            icon: <DollarSign className="h-6 w-6" />,
            trend: { value: 8.5, isUp: true },
            color: 'from-emerald-500 to-emerald-600',
          },
        ];
      case 'hospital':
        return [
          {
            title: 'Admitted Patients',
            value: '124',
            icon: <HeartPulse className="h-6 w-6" />,
            trend: { value: 5, isUp: true },
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Available Beds',
            value: '37',
            icon: <Layers className="h-6 w-6" />,
            trend: { value: 2, isUp: false },
            color: 'from-teal-500 to-teal-600',
          },
          {
            title: 'Emergency Cases',
            value: '18',
            icon: <HeartPulse className="h-6 w-6" />,
            trend: { value: 12, isUp: true },
            color: 'from-red-500 to-red-600',
          },
          {
            title: 'Revenue',
            value: '$126,540',
            icon: <DollarSign className="h-6 w-6" />,
            trend: { value: 10.2, isUp: true },
            color: 'from-emerald-500 to-emerald-600',
          },
        ];
      case 'lab':
        return [
          {
            title: 'Pending Tests',
            value: '76',
            icon: <Thermometer className="h-6 w-6" />,
            trend: { value: 8, isUp: true },
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Completed Tests',
            value: '128',
            icon: <CheckCircle className="h-6 w-6" />,
            trend: { value: 15, isUp: true },
            color: 'from-teal-500 to-teal-600',
          },
          {
            title: 'Sample Collection',
            value: '43',
            icon: <Thermometer className="h-6 w-6" />,
            trend: { value: 5, isUp: false },
            color: 'from-amber-500 to-amber-600',
          },
          {
            title: 'Revenue',
            value: '$42,390',
            icon: <DollarSign className="h-6 w-6" />,
            trend: { value: 7.8, isUp: true },
            color: 'from-emerald-500 to-emerald-600',
          },
        ];
      case 'pharmacy':
        return [
          {
            title: 'Prescriptions',
            value: '98',
            icon: <FileText className="h-6 w-6" />,
            trend: { value: 12, isUp: true },
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Pending Orders',
            value: '23',
            icon: <Clock className="h-6 w-6" />,
            trend: { value: 5, isUp: true },
            color: 'from-amber-500 to-amber-600',
          },
          {
            title: 'Delivered Orders',
            value: '156',
            icon: <CheckCircle className="h-6 w-6" />,
            trend: { value: 18, isUp: true },
            color: 'from-teal-500 to-teal-600',
          },
          {
            title: 'Revenue',
            value: '$36,780',
            icon: <DollarSign className="h-6 w-6" />,
            trend: { value: 6.2, isUp: true },
            color: 'from-emerald-500 to-emerald-600',
          },
        ];
      default:
        return [
          {
            title: 'Total Users',
            value: '1,256',
            icon: <Users className="h-6 w-6" />,
            trend: { value: 12, isUp: true },
            color: 'from-blue-500 to-blue-600',
          },
          {
            title: 'Activities',
            value: '432',
            icon: <Activity className="h-6 w-6" />,
            trend: { value: 8, isUp: true },
            color: 'from-teal-500 to-teal-600',
          },
          {
            title: 'Pending',
            value: '64',
            icon: <Clock className="h-6 w-6" />,
            trend: { value: 2, isUp: false },
            color: 'from-amber-500 to-amber-600',
          },
          {
            title: 'Revenue',
            value: '$24,350',
            icon: <DollarSign className="h-6 w-6" />,
            trend: { value: 5.3, isUp: true },
            color: 'from-emerald-500 to-emerald-600',
          },
        ];
    }
  };
  
  // Get upcoming appointments/events based on provider type
  const getAppointments = (): AppointmentProps[] => {
    switch(providerType) {
      case 'doctor':
        return [
          { id: 'APP001', patientName: 'Jane Smith', time: new Date(2023, 6, 15, 9, 30), status: 'scheduled', type: 'Consultation' },
          { id: 'APP002', patientName: 'Michael Johnson', time: new Date(2023, 6, 15, 11, 15), status: 'scheduled', type: 'Follow-up' },
          { id: 'APP003', patientName: 'Emily Wilson', time: new Date(2023, 6, 15, 13, 0), status: 'in-progress', type: 'Emergency' },
          { id: 'APP004', patientName: 'Robert Brown', time: new Date(2023, 6, 15, 15, 45), status: 'scheduled', type: 'Vaccination' },
          { id: 'APP005', patientName: 'Sarah Davis', time: new Date(2023, 6, 16, 10, 0), status: 'scheduled', type: 'Check-up' },
        ];
      case 'hospital':
        return [
          { id: 'ADM001', patientName: 'James Wilson', time: new Date(2023, 6, 15, 8, 0), status: 'completed', type: 'Admission' },
          { id: 'SUR001', patientName: 'Emma Thompson', time: new Date(2023, 6, 15, 10, 30), status: 'in-progress', type: 'Surgery' },
          { id: 'ADM002', patientName: 'Thomas Brown', time: new Date(2023, 6, 15, 14, 15), status: 'scheduled', type: 'Discharge' },
          { id: 'EMG001', patientName: 'Olivia White', time: new Date(2023, 6, 15, 16, 0), status: 'in-progress', type: 'Emergency' },
          { id: 'SUR002', patientName: 'William Davis', time: new Date(2023, 6, 16, 9, 0), status: 'scheduled', type: 'Surgery' },
        ];
      case 'lab':
        return [
          { id: 'TST001', patientName: 'Daniel Wilson', time: new Date(2023, 6, 15, 9, 0), status: 'completed', type: 'Blood Test' },
          { id: 'TST002', patientName: 'Sophia Martinez', time: new Date(2023, 6, 15, 11, 45), status: 'in-progress', type: 'X-Ray' },
          { id: 'TST003', patientName: 'Matthew Taylor', time: new Date(2023, 6, 15, 13, 30), status: 'scheduled', type: 'MRI Scan' },
          { id: 'TST004', patientName: 'Ava Garcia', time: new Date(2023, 6, 15, 15, 15), status: 'scheduled', type: 'CT Scan' },
          { id: 'TST005', patientName: 'Ethan Rodriguez', time: new Date(2023, 6, 16, 10, 30), status: 'scheduled', type: 'COVID Test' },
        ];
      case 'pharmacy':
        return [
          { id: 'ORD001', patientName: 'Isabella Miller', time: new Date(2023, 6, 15, 9, 15), status: 'completed', type: 'Prescription' },
          { id: 'ORD002', patientName: 'Noah Wilson', time: new Date(2023, 6, 15, 10, 45), status: 'in-progress', type: 'Delivery' },
          { id: 'ORD003', patientName: 'Charlotte Brown', time: new Date(2023, 6, 15, 13, 0), status: 'scheduled', type: 'Pickup' },
          { id: 'ORD004', patientName: 'Alexander Davis', time: new Date(2023, 6, 15, 15, 30), status: 'scheduled', type: 'Prescription' },
          { id: 'ORD005', patientName: 'Mia Johnson', time: new Date(2023, 6, 16, 11, 0), status: 'scheduled', type: 'Delivery' },
        ];
      default:
        return [
          { id: 'EVT001', patientName: 'User 1', time: new Date(2023, 6, 15, 9, 0), status: 'scheduled', type: 'Event' },
          { id: 'EVT002', patientName: 'User 2', time: new Date(2023, 6, 15, 11, 0), status: 'in-progress', type: 'Event' },
          { id: 'EVT003', patientName: 'User 3', time: new Date(2023, 6, 15, 13, 0), status: 'scheduled', type: 'Event' },
          { id: 'EVT004', patientName: 'User 4', time: new Date(2023, 6, 15, 15, 0), status: 'scheduled', type: 'Event' },
          { id: 'EVT005', patientName: 'User 5', time: new Date(2023, 6, 16, 10, 0), status: 'scheduled', type: 'Event' },
        ];
    }
  };
  
  // Get appointment status badge
  const getStatusBadge = (status: AppointmentProps['status']) => {
    switch(status) {
      case 'scheduled':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Cancelled
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            In Progress
          </span>
        );
      default:
        return null;
    }
  };
  
  // Get recent activities based on provider type
  const getRecentActivities = () => {
    switch(providerType) {
      case 'doctor':
        return [
          { action: 'Completed consultation with Jane Smith', time: '35 minutes ago' },
          { action: 'Updated medical record for Michael Johnson', time: '1 hour ago' },
          { action: 'Prescribed medication for Emily Wilson', time: '2 hours ago' },
          { action: 'Added new patient: Robert Brown', time: '3 hours ago' },
        ];
      case 'hospital':
        return [
          { action: 'Emergency patient admitted: James Wilson', time: '30 minutes ago' },
          { action: 'Surgery completed: Emma Thompson', time: '1 hour ago' },
          { action: 'Patient discharged: Thomas Brown', time: '2 hours ago' },
          { action: 'New staff member added: Dr. Jennifer Lee', time: '4 hours ago' },
        ];
      case 'lab':
        return [
          { action: 'Blood test results ready: Daniel Wilson', time: '45 minutes ago' },
          { action: 'New sample received: Sophia Martinez', time: '1 hour ago' },
          { action: 'X-Ray completed: Matthew Taylor', time: '2 hours ago' },
          { action: 'Test order received: Ava Garcia', time: '3 hours ago' },
        ];
      case 'pharmacy':
        return [
          { action: 'Prescription filled: Isabella Miller', time: '30 minutes ago' },
          { action: 'Order delivered: Noah Wilson', time: '1 hour ago' },
          { action: 'New medication added to inventory', time: '2 hours ago' },
          { action: 'Received new order: Charlotte Brown', time: '3 hours ago' },
        ];
      default:
        return [
          { action: 'New user registered', time: '40 minutes ago' },
          { action: 'System update completed', time: '1 hour ago' },
          { action: 'New feature added', time: '2 hours ago' },
          { action: 'User feedback received', time: '4 hours ago' },
        ];
    }
  };
  
  // Get appropriate action label based on provider type
  const getActionLabel = () => {
    switch(providerType) {
      case 'doctor':
        return 'View Patient';
      case 'hospital':
        return 'View Details';
      case 'lab':
        return 'View Test';
      case 'pharmacy':
        return 'View Order';
      default:
        return 'View Details';
    }
  };
  
  const statistics = getStatistics();
  const appointments = getAppointments();
  const activities = getRecentActivities();
  
  const StatCard = ({ title, value, icon, trend, color = 'from-teal-500 to-teal-600' }: StatCardProps) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
      mounted ? 'animate-slide-in opacity-100' : 'opacity-0'
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          </div>
          <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center">
            {trend.isUp ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm font-medium ${
              trend.isUp ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.value}% {trend.isUp ? 'increase' : 'decrease'}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-36"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96"></div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Welcome Section */}
      <div className={`flex items-center justify-between mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getWelcomeMessage()}</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Here's what's happening today.</p>
        </div>
        <div className="hidden sm:block">
          {getProviderIcon()}
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat, index) => (
          <StatCard 
            key={stat.title} 
            {...stat} 
            color={stat.color}
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend}
          />
        ))}
      </div>
      
      {/* Appointments and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
          mounted ? 'animate-slide-in' : 'opacity-0'
        }`} style={{ animationDelay: '150ms' }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {providerType === 'doctor' || providerType === 'lab' 
                ? 'Upcoming Appointments' 
                : providerType === 'hospital' 
                  ? 'Recent Admissions' 
                  : providerType === 'pharmacy' 
                    ? 'Recent Orders' 
                    : 'Upcoming Events'}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {providerType === 'doctor' || providerType === 'hospital' || providerType === 'lab' 
                        ? 'Patient' 
                        : providerType === 'pharmacy' 
                          ? 'Customer' 
                          : 'Name'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {appointments.slice(0, 5).map((appointment, index) => (
                    <tr 
                      key={appointment.id} 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                            {appointment.patientName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {appointment.patientName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {appointment.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {format(appointment.time, 'h:mm a')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(appointment.time, 'MMM d, yyyy')}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {appointment.type}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                          {getActionLabel()}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                View All
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
          mounted ? 'animate-slide-in' : 'opacity-0'
        }`} style={{ animationDelay: '200ms' }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h2>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                >
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                View More
              </button>
            </div>
          </div>
        </div>
        
        {/* Provider-specific graphs */}
        <div className={`col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${
          mounted ? 'animate-slide-in' : 'opacity-0'
        }`} style={{ animationDelay: '250ms' }}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {providerType === 'doctor' 
                  ? 'Patient Statistics' 
                  : providerType === 'hospital' 
                    ? 'Hospital Analytics' 
                    : providerType === 'lab' 
                      ? 'Test Analytics' 
                      : providerType === 'pharmacy' 
                        ? 'Order Statistics' 
                        : 'Performance Overview'}
              </h2>
              <div className="flex items-center gap-2">
                <select className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
                <button className="p-1 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                  <BarChart3 className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="h-80 flex items-center justify-center border-t border-gray-100 dark:border-gray-700/50 pt-4">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Analytics chart will be displayed here</p>
                <button className="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400">
                  View detailed analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 