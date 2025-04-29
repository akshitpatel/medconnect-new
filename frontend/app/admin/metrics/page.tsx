'use client';

import { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, Activity, Users, Clock, Calendar, BarChart2, Download, Filter, ChevronDown } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

interface Metrics {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  appointments: {
    scheduled: number;
    completed: number;
    cancelled: number;
    total: number;
  };
  patientRegistrations: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  providerUtilization: {
    name: string;
    percent: number;
    patients: number;
  }[];
  responseTime: {
    average: number;
    min: number;
    max: number;
    trend: number[];
  };
  systemPerformance: {
    uptime: number;
    errors: number;
    warnings: number;
    apiCalls: number;
  };
}

const MOCK_METRICS: Metrics = {
  activeUsers: {
    daily: 324,
    weekly: 1876,
    monthly: 7290,
    total: 23145
  },
  appointments: {
    scheduled: 127,
    completed: 98,
    cancelled: 12,
    total: 237
  },
  patientRegistrations: {
    daily: [12, 18, 15, 23, 27, 19, 14],
    weekly: [124, 142, 156, 169, 183, 178, 192],
    monthly: [735, 892, 1023, 1156, 1289, 1342, 1456, 1523, 1687, 1790, 1845, 1932]
  },
  providerUtilization: [
    { name: 'Dr. Johnson', percent: 87, patients: 42 },
    { name: 'Dr. Smith', percent: 72, patients: 35 },
    { name: 'Dr. Williams', percent: 94, patients: 48 },
    { name: 'Dr. Brown', percent: 63, patients: 31 },
    { name: 'Dr. Davis', percent: 78, patients: 39 }
  ],
  responseTime: {
    average: 2.4,
    min: 0.8,
    max: 5.2,
    trend: [2.1, 2.3, 2.0, 2.5, 2.7, 2.4, 2.2, 2.6, 2.3, 2.4]
  },
  systemPerformance: {
    uptime: 99.98,
    errors: 7,
    warnings: 23,
    apiCalls: 15674
  }
};

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [timeRangeMenuOpen, setTimeRangeMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch metrics
    const timer = setTimeout(() => {
      setMetrics(MOCK_METRICS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const exportData = () => {
    // In a real application, this would generate a CSV or PDF file
    alert('Exporting metrics data...');
  };

  const getPercentChange = (value: number, percentage: number) => {
    return Math.round(value * (percentage / 100));
  };

  const getColorByTrend = (value: number) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getColorByUtilization = (value: number) => {
    if (value >= 85) return 'bg-green-500';
    if (value >= 70) return 'bg-blue-500';
    if (value >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metrics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <AnimatedCard key={i} className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-6"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No metrics data available</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart2 className="mr-2 text-teal-500" />
          Platform Metrics
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setTimeRangeMenuOpen(!timeRangeMenuOpen)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center"
            >
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {timeRange === 'daily' ? 'Last 24 Hours' : 
                 timeRange === 'weekly' ? 'Last 7 Days' : 
                 timeRange === 'monthly' ? 'Last 30 Days' : 'Last 12 Months'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
            </button>
            {timeRangeMenuOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
                  <div
                    key={range}
                    onClick={() => {
                      setTimeRange(range as TimeRange);
                      setTimeRangeMenuOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      timeRange === range ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''
                    }`}
                  >
                    {range === 'daily' ? 'Last 24 Hours' : 
                     range === 'weekly' ? 'Last 7 Days' : 
                     range === 'monthly' ? 'Last 30 Days' : 'Last 12 Months'}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={exportData}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.activeUsers[timeRange === 'yearly' ? 'monthly' : timeRange]}
              </h3>
              <p className="text-sm flex items-center mt-2">
                <span className={`${getColorByTrend(7)} flex items-center mr-1`}>
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  7%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last period</span>
              </p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-teal-500 dark:text-teal-400" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointments</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.appointments.total}
              </h3>
              <p className="text-sm flex items-center mt-2">
                <span className={`${getColorByTrend(3)} flex items-center mr-1`}>
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  3%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last period</span>
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response Time</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.responseTime.average}s
              </h3>
              <p className="text-sm flex items-center mt-2">
                <span className={`${getColorByTrend(-5)} flex items-center mr-1`}>
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                  5%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last period</span>
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Uptime</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {metrics.systemPerformance.uptime}%
              </h3>
              <p className="text-sm flex items-center mt-2">
                <span className={`${getColorByTrend(0.1)} flex items-center mr-1`}>
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                  0.1%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last period</span>
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-full">
              <Activity className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Registrations Chart */}
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-teal-500" />
              Patient Registrations
            </h3>
          </div>
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Fake Line Chart - In a real app, use a chart library like Chart.js, Recharts, etc. */}
              <svg className="w-full h-full" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* X Axis */}
                <line x1="40" y1="150" x2="280" y2="150" stroke="#9CA3AF" strokeWidth="1" />
                {/* Y Axis */}
                <line x1="40" y1="20" x2="40" y2="150" stroke="#9CA3AF" strokeWidth="1" />
                
                {/* X Axis Labels */}
                <text x="40" y="170" className="text-xs" fill="#9CA3AF">Mon</text>
                <text x="80" y="170" className="text-xs" fill="#9CA3AF">Tue</text>
                <text x="120" y="170" className="text-xs" fill="#9CA3AF">Wed</text>
                <text x="160" y="170" className="text-xs" fill="#9CA3AF">Thu</text>
                <text x="200" y="170" className="text-xs" fill="#9CA3AF">Fri</text>
                <text x="240" y="170" className="text-xs" fill="#9CA3AF">Sat</text>
                <text x="280" y="170" className="text-xs" fill="#9CA3AF">Sun</text>
                
                {/* Y Axis Labels */}
                <text x="30" y="150" className="text-xs" textAnchor="end" fill="#9CA3AF">0</text>
                <text x="30" y="120" className="text-xs" textAnchor="end" fill="#9CA3AF">10</text>
                <text x="30" y="90" className="text-xs" textAnchor="end" fill="#9CA3AF">20</text>
                <text x="30" y="60" className="text-xs" textAnchor="end" fill="#9CA3AF">30</text>
                <text x="30" y="30" className="text-xs" textAnchor="end" fill="#9CA3AF">40</text>
                
                {/* Grid Lines */}
                <line x1="40" y1="120" x2="280" y2="120" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="40" y1="90" x2="280" y2="90" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="40" y1="60" x2="280" y2="60" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="5,5" />
                <line x1="40" y1="30" x2="280" y2="30" stroke="#9CA3AF" strokeWidth="0.5" strokeDasharray="5,5" />
                
                {/* Data Line - This would be generated from actual data in a real app */}
                <path d="M40,130 L80,120 L120,123 L160,100 L200,90 L240,102 L280,110" 
                      stroke="#14B8A6" strokeWidth="3" fill="none" />
                
                {/* Area under the line */}
                <path d="M40,130 L80,120 L120,123 L160,100 L200,90 L240,102 L280,110 L280,150 L40,150 Z" 
                      fill="url(#gradient)" opacity="0.2" />
                
                {/* Data Points */}
                <circle cx="40" cy="130" r="4" fill="#14B8A6" />
                <circle cx="80" cy="120" r="4" fill="#14B8A6" />
                <circle cx="120" cy="123" r="4" fill="#14B8A6" />
                <circle cx="160" cy="100" r="4" fill="#14B8A6" />
                <circle cx="200" cy="90" r="4" fill="#14B8A6" />
                <circle cx="240" cy="102" r="4" fill="#14B8A6" />
                <circle cx="280" cy="110" r="4" fill="#14B8A6" />
                
                {/* Gradient for area under the line */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {metrics.patientRegistrations.daily[metrics.patientRegistrations.daily.length - 1]}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {metrics.patientRegistrations.weekly[metrics.patientRegistrations.weekly.length - 1]}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {metrics.patientRegistrations.monthly[metrics.patientRegistrations.monthly.length - 1]}
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Appointments Chart */}
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
              Appointment Status
            </h3>
          </div>
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Fake Pie Chart - Replace with a real chart library in production */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>
                
                {/* Completed */}
                <path d="M100,100 L100,0 A100,100 0 0,1 183,150 z"
                      fill="#10B981" filter="url(#shadow)"/>
                      
                {/* Scheduled */}
                <path d="M100,100 L183,150 A100,100 0 0,1 30,180 z"
                      fill="#6366F1" filter="url(#shadow)"/>
                      
                {/* Cancelled */}
                <path d="M100,100 L30,180 A100,100 0 0,1 100,0 z"
                      fill="#F43F5E" filter="url(#shadow)"/>
                      
                {/* Center circle */}
                <circle cx="100" cy="100" r="60" fill="white" className="dark:fill-gray-800" filter="url(#shadow)"/>

                <text x="100" y="90" textAnchor="middle" fill="#6B7280" className="text-sm font-semibold">Total</text>
                <text x="100" y="120" textAnchor="middle" fill="#1F2937" className="text-xl font-bold dark:fill-white">
                  {metrics.appointments.total}
                </text>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Scheduled</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{metrics.appointments.scheduled}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round((metrics.appointments.scheduled / metrics.appointments.total) * 100)}%
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{metrics.appointments.completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round((metrics.appointments.completed / metrics.appointments.total) * 100)}%
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Cancelled</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{metrics.appointments.cancelled}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round((metrics.appointments.cancelled / metrics.appointments.total) * 100)}%
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Utilization */}
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-500" />
              Provider Utilization
            </h3>
          </div>
          <div className="space-y-4">
            {metrics.providerUtilization.map((provider, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{provider.name}</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {provider.percent}% ({provider.patients} patients)
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getColorByUtilization(provider.percent)}`} 
                    style={{ width: `${provider.percent}%` }}>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* System Performance */}
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              System Performance
            </h3>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Uptime</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.uptime}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${metrics.systemPerformance.uptime}%` }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">API Calls (24h)</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.systemPerformance.apiCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Errors (24h)</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">{metrics.systemPerformance.errors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Warnings (24h)</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{metrics.systemPerformance.warnings}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Average Response Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.responseTime.average}s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full" 
                  style={{ width: `${(metrics.responseTime.average / metrics.responseTime.max) * 100}%` }}>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{metrics.responseTime.min}s</span>
                <span>{metrics.responseTime.max}s</span>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
} 