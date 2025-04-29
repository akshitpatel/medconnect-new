'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Heart,
  Calendar,
  Pill,
  DollarSign,
  Clock,
  ArrowRight,
  Filter,
  Download,
  ChevronDown,
  Layers,
  AlertTriangle,
  ExternalLink,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Building,
  CheckCircle,
} from 'lucide-react';

interface TabProps {
  title: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ title, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg transition-colors ${
      active
        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <span className={`${active ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'} mr-2`}>
      {icon}
    </span>
    <span className="font-medium">{title}</span>
  </button>
);

// Simple bar chart component
const SimpleBarChart = () => {
  const data = [65, 40, 80, 55, 95, 60, 70];
  const maxValue = Math.max(...data);

  return (
    <div className="flex items-end justify-between h-40 w-full space-x-3">
      {data.map((value, index) => {
        const height = (value / maxValue) * 100;
        return (
          <div key={index} className="relative flex flex-col items-center flex-1">
            <div 
              style={{ height: `${height}%` }} 
              className="w-full bg-gradient-to-t from-teal-500 to-teal-400 dark:from-teal-500 dark:to-teal-400 rounded-t-md transition-all hover:bg-teal-400 dark:hover:bg-teal-400 group"
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs transition-opacity">
                {value}
              </div>
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
          </div>
        );
      })}
    </div>
  );
};

// Line chart component
const SimpleLineChart = () => {
  // Sample data for a simple line chart (x,y) coordinates
  const points = [
    { x: 0, y: 20 },
    { x: 1, y: 35 },
    { x: 2, y: 25 },
    { x: 3, y: 45 },
    { x: 4, y: 30 },
    { x: 5, y: 55 },
    { x: 6, y: 40 },
  ];

  // Chart dimensions
  const width = 100;
  const height = 100;
  
  // Calculate SVG viewBox and path
  const maxX = 6;
  const maxY = Math.max(...points.map(p => p.y));
  const minY = Math.min(...points.map(p => p.y));
  
  // Generate SVG path string
  const pathData = points
    .map((point, i) => {
      // Map data points to SVG coordinates
      const x = (point.x / maxX) * width;
      const y = height - ((point.y - minY) / (maxY - minY)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="h-40 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line 
            key={y} 
            x1="0" 
            y1={height - (y / 100) * height} 
            x2={width} 
            y2={height - (y / 100) * height} 
            stroke="currentColor" 
            strokeOpacity="0.1" 
            strokeWidth="0.5"
          />
        ))}
        
        {/* Line chart path */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        
        {/* Data points */}
        {points.map((point, i) => {
          const x = (point.x / maxX) * width;
          const y = height - ((point.y - minY) / (maxY - minY)) * height;
          return (
            <circle 
              key={i} 
              cx={x} 
              cy={y} 
              r="2" 
              fill="#14b8a6" 
              stroke="#0d9488" 
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
};

const Donut = ({ percentage, color }: { percentage: number, color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg height="100" width="100" viewBox="0 0 100 100" className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="currentColor"
        strokeWidth="8"
        fill="transparent"
        className="text-gray-200 dark:text-gray-700"
      />
      {/* Foreground circle */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke={color}
        strokeWidth="8"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      {/* Percentage text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-current text-gray-700 dark:text-gray-300 text-lg font-semibold transform rotate-90"
      >
        {percentage}%
      </text>
    </svg>
  );
};

// Card component
interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  showViewAll?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  subtitle, 
  value, 
  icon, 
  change, 
  showViewAll = false,
  children,
  className = ""
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center mb-1">
          <span className="text-teal-600 dark:text-teal-400 mr-2">{icon}</span>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <button className="text-teal-600 dark:text-teal-400 text-sm flex items-center">
          View All <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      )}
    </div>
    
    {value && (
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
          {change && (
            <span 
              className={`ml-2 text-sm ${
                change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              } flex items-center`}
            >
              {change.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
              )}
              {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
            </span>
          )}
        </div>
      </div>
    )}
    
    {children}
  </div>
);

// Metric List Component
interface MetricItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, icon, change, iconColor = "text-teal-500" }) => (
  <div className="flex items-start mb-4 last:mb-0">
    <div className={`${iconColor} p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3`}>
      {icon}
    </div>
    <div>
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {change && (
          <span 
            className={`ml-2 text-xs ${
              change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            } flex items-center`}
          >
            {change.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            )}
            {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
          </span>
        )}
      </div>
      <div className="text-base font-semibold text-gray-900 dark:text-white mt-1">{value}</div>
    </div>
  </div>
);

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track and monitor key performance metrics across the platform
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
            </div>
          </div>
      
      {/* Time range selector */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setTimeRange('day')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              timeRange === 'day'
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              timeRange === 'week'
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              timeRange === 'month'
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              timeRange === 'year'
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setTimeRange('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              timeRange === 'custom'
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Custom
          </button>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <button className="p-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="mx-2 font-medium">
            {
              timeRange === 'day' ? 'May 15, 2023' :
              timeRange === 'week' ? 'May 9 - May 15, 2023' :
              timeRange === 'month' ? 'May 2023' :
              timeRange === 'year' ? '2023' : 'Custom Range'
            }
          </span>
          <button className="p-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
              </div>
            </div>
      
      {/* Navigation Tabs */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tab
          title="Overview"
          active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <Tab
          title="User Analytics"
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
          icon={<Users className="h-5 w-5" />}
        />
        <Tab
          title="Provider Analytics"
          active={activeTab === 'providers'}
          onClick={() => setActiveTab('providers')}
          icon={<Activity className="h-5 w-5" />}
        />
        <Tab
          title="Platform Health"
          active={activeTab === 'platform'}
          onClick={() => setActiveTab('platform')}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <AnalyticsCard
          title="Total Users"
          value="14,328"
          icon={<Users className="h-5 w-5" />}
          change={{ value: 5.4, isPositive: true }}
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400">Active Users</div>
            <div className="text-right font-medium text-gray-900 dark:text-white">10,846</div>
            <div className="text-gray-500 dark:text-gray-400">New Sign-ups</div>
            <div className="text-right font-medium text-gray-900 dark:text-white">1,324</div>
            </div>
        </AnalyticsCard>
        
        <AnalyticsCard
          title="Patient Engagement"
          value="78%"
          icon={<Heart className="h-5 w-5" />}
          change={{ value: 2.1, isPositive: true }}
        >
          <SimpleLineChart />
        </AnalyticsCard>
        
        <AnalyticsCard
          title="Appointments"
          value="3,842"
          icon={<Calendar className="h-5 w-5" />}
          change={{ value: 1.2, isPositive: false }}
        >
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400">Completed</div>
            <div className="text-right font-medium text-gray-900 dark:text-white">2,954</div>
            <div className="text-gray-500 dark:text-gray-400">Cancelled</div>
            <div className="text-right font-medium text-gray-900 dark:text-white">268</div>
          </div>
        </AnalyticsCard>
        
        <AnalyticsCard
          title="Total Revenue"
          value="$128,540"
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: 8.9, isPositive: true }}
        >
          <SimpleBarChart />
        </AnalyticsCard>
              </div>
      
      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* User Activity Chart */}
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="User Activity"
            subtitle="Daily active users over time"
            value=""
            icon={<Activity className="h-5 w-5" />}
            showViewAll
            className="h-full"
          >
            <div className="mt-4 h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="text-center p-6">
                <BarChart3 className="h-10 w-10 text-teal-500 dark:text-teal-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Advanced chart visualization would be rendered here</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Showing user activity trends over time</p>
              </div>
            </div>
          </AnalyticsCard>
        </div>
        
        {/* Key Metrics */}
        <div>
          <AnalyticsCard
            title="Key Metrics"
            subtitle="Most important performance indicators"
            value=""
            icon={<Activity className="h-5 w-5" />}
            className="h-full"
          >
            <div className="space-y-4 mt-4">
              <MetricItem 
                label="Average Session Duration" 
                value="4m 32s" 
                icon={<Clock className="h-4 w-4" />} 
                change={{ value: 3.5, isPositive: true }}
              />
              <MetricItem 
                label="Provider Satisfaction" 
                value="92%" 
                icon={<Activity className="h-4 w-4" />} 
                change={{ value: 1.2, isPositive: true }}
              />
              <MetricItem 
                label="Medication Adherence" 
                value="78%" 
                icon={<Activity className="h-4 w-4" />} 
                change={{ value: 4.3, isPositive: true }}
              />
              <MetricItem 
                label="Error Rate" 
                value="0.24%" 
                icon={<Activity className="h-4 w-4" />} 
                change={{ value: 0.12, isPositive: false }}
              />
            </div>
          </AnalyticsCard>
            </div>
          </div>
          
      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Provider Distribution */}
        <AnalyticsCard
          title="Provider Distribution"
          subtitle="By type and specialty"
          value=""
          icon={<Building className="h-5 w-5" />}
          className="lg:col-span-1"
        >
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Doctors</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">58%</span>
            </div>
            <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Pharmacies</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">26%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Labs</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">16%</span>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top Specialties</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Family Medicine</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">24%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pediatrics</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cardiology</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">14%</span>
                </div>
              </div>
            </div>
          </div>
        </AnalyticsCard>
        
        {/* Performance Metrics */}
        <AnalyticsCard
          title="Platform Performance"
          subtitle="Response times and uptime"
          value=""
          icon={<Activity className="h-5 w-5" />}
          className="lg:col-span-2"
        >
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Donut percentage={99.98} color="#14b8a6" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">Server Uptime</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</span>
            </div>
            <div className="flex flex-col items-center">
              <Donut percentage={94} color="#0ea5e9" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">API Response</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">241ms avg</span>
              </div>
            <div className="flex flex-col items-center">
              <Donut percentage={86} color="#8b5cf6" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">User Satisfaction</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Based on feedback</span>
            </div>
            
            <div className="col-span-full mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Overall System Health</span>
                <span className="text-teal-600 dark:text-teal-400 font-medium">Excellent</span>
                    </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </AnalyticsCard>
        </div>
        
      {/* Recent Performance Alerts */}
      <div className="mb-6">
        <AnalyticsCard
          title="Recent Performance Alerts"
          subtitle="System alerts and notifications"
          value=""
          icon={<Activity className="h-5 w-5" />}
        >
          <div className="mt-4 space-y-4">
            <div className="flex items-start p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">High Database Load</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Database load exceeded 80% for 15 minutes. Automatic scaling was triggered.
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-amber-600 dark:text-amber-500">May 14, 2023 - 14:35</span>
                  <a href="#" className="ml-auto text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center">
                    View Details <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Backup Completed</h4>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Full system backup completed successfully. All data has been archived.
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 dark:text-green-500">May 14, 2023 - 02:15</span>
                  <a href="#" className="ml-auto text-xs text-green-700 dark:text-green-300 font-medium flex items-center">
                    View Details <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
} 