'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  UsersIcon, 
  MedicationIcon, 
  DoctorIcon, 
  AppointmentIcon, 
  AnalyticsIcon,
  HealthIcon,
  SecurityIcon,
  SettingsIcon,
  NotificationIcon
} from '@/app/components/ui/CustomIcons';
import SVGLogo from '@/app/components/ui/SVGLogo';
import AdminPulseEffect from '@/app/components/ui/AdminPulseEffect';
import AdminAnimatedBackground from '@/app/components/ui/AdminAnimatedBackground';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  AlertTriangle, 
  Bell, 
  BarChart, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Database,
  FileText,
  HardDrive,
  Heart, 
  LayoutDashboard, 
  Pill, 
  Server, 
  Settings, 
  Shield, 
  User, 
  UserCheck,
  UserCog, 
  UserPlus,
  Users, 
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  Activity,
  BellRing,
  DollarSign,
  Zap,
  Cpu,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/Avatar';

const timeRanges = ['Today', 'This Week', 'This Month', 'This Year'];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  delay?: number;
}

function StatCard({ title, value, change, changeType, icon, delay = 0 }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <AnimatedCard hoverEffect="both" glowColor="rgba(20, 184, 166, 0.3)">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-between">
            {title}
            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
              {icon}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <div className="flex items-center mt-1">
              <span 
                className={`text-sm font-medium flex items-center
                  ${changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 
                    changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 
                    'text-gray-600 dark:text-gray-400'}`
                }
              >
                {changeType === 'positive' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                 changeType === 'negative' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                {change}
              </span>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  time: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

function ActivityItem({ title, time, description, icon, delay = 0 }: ActivityItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{time}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  delay?: number;
  badgeCount?: number;
}

function QuickAccessCard({ title, description, icon, link, color, delay = 0, badgeCount }: QuickAccessCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <Link href={link}>
        <AnimatedCard className="h-full" hoverEffect="both">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-lg ${color}`}>
                {icon}
              </div>
              {badgeCount !== undefined && badgeCount > 0 && (
                <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                  {badgeCount}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="mb-1">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardContent>
          <CardFooter>
            <div className="text-teal-600 dark:text-teal-400 flex items-center text-sm font-medium">
              <span>Manage</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardFooter>
        </AnimatedCard>
      </Link>
    </div>
  );
}

interface HealthMetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  percentage: number;
  status?: 'healthy' | 'warning' | 'critical';
}

function HealthMetricCard({ title, value, icon, color, percentage, status = 'healthy' }: HealthMetricProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };
  
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
      <div className={`p-2 rounded-lg ${color} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
          <div 
            className={`h-1.5 rounded-full ${
              status === 'healthy' ? 'bg-green-500' :
              status === 'warning' ? 'bg-amber-500' :
              'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// New component for real-time metrics
function RealTimeMetric({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: 'up' | 'down' | 'stable' }) {
  return (
    <div className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
      <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <div className="flex items-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mr-2">{value}</p>
          {trend === 'up' && <TrendingUp className="h-4 w-4 text-teal-500" />}
          {trend === 'down' && <TrendingDown className="h-4 w-4 text-teal-500" />}
          {trend === 'stable' && <Activity className="h-4 w-4 text-teal-500" />}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Week');
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1500);
  };
  
  // Sample data
  const userData = {
    totalUsers: '8,429',
    change: '+12.5% this week',
    newUsers: '342',
    newUsersChange: '+24.3% this week',
    activeUsers: '6,218',
    activeUsersChange: '+8.7% this week',
  };
  
  const healthMetrics = [
    { title: 'System Response Time', value: '285ms', icon: <Server className="h-5 w-5 text-white" />, color: 'bg-teal-500 text-white', percentage: 92, status: 'healthy' },
    { title: 'Database Performance', value: '99.2%', icon: <Database className="h-5 w-5 text-white" />, color: 'bg-indigo-500 text-white', percentage: 99, status: 'healthy' },
    { title: 'API Error Rate', value: '2.3%', icon: <AlertTriangle className="h-5 w-5 text-white" />, color: 'bg-amber-500 text-white', percentage: 75, status: 'warning' },
    { title: 'Storage Usage', value: '73.5%', icon: <HardDrive className="h-5 w-5 text-white" />, color: 'bg-purple-500 text-white', percentage: 73, status: 'warning' },
  ];

  const realTimeMetrics = [
    { title: 'Active Sessions', value: '342', icon: <Users className="h-4 w-4 text-teal-500" />, trend: 'up' as const },
    { title: 'Server Load', value: '42%', icon: <Cpu className="h-4 w-4 text-teal-500" />, trend: 'stable' as const },
    { title: 'Response Time', value: '124ms', icon: <Zap className="h-4 w-4 text-teal-500" />, trend: 'down' as const },
    { title: 'Error Rate', value: '0.8%', icon: <AlertTriangle className="h-4 w-4 text-teal-500" />, trend: 'stable' as const },
  ];
  
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <AdminAnimatedBackground particleCount={15} />
      </div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
              <LayoutDashboard className="h-8 w-8 mr-3 text-teal-500" />
              Welcome back, Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your healthcare platform today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center hover:bg-teal-50 dark:hover:bg-teal-900/10 border-teal-200 dark:border-teal-800"
            >
              <RefreshCw className={`h-4 w-4 mr-1 text-teal-500 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        {/* Stats Section */}
        <div 
          ref={stickyHeaderRef}
          className={`sticky top-16 z-10 mb-8 pt-4 pb-2 bg-gray-50 dark:bg-gray-900 transition-all duration-200 ${
            scrollY > 100 ? 'shadow-md rounded-xl px-4 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border-b border-teal-100 dark:border-teal-900/20' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-teal-500" />
              Dashboard Overview
            </h2>
            
            <div className="flex space-x-1 mt-2 sm:mt-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {timeRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeRange === range 
                      ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {realTimeMetrics.map((metric, index) => (
            <RealTimeMetric
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
            />
          ))}
        </div>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Users" 
            value={userData.totalUsers} 
            change={userData.change} 
            changeType="positive" 
            icon={<Users className="h-5 w-5 text-teal-500" />} 
            delay={0}
          />
          <StatCard 
            title="New Users" 
            value={userData.newUsers} 
            change={userData.newUsersChange} 
            changeType="positive" 
            icon={<UserPlus className="h-5 w-5 text-teal-500" />} 
            delay={100}
          />
          <StatCard 
            title="Active Users" 
            value={userData.activeUsers} 
            change={userData.activeUsersChange} 
            changeType="positive" 
            icon={<UserCheck className="h-5 w-5 text-teal-500" />} 
            delay={200}
          />
          <StatCard 
            title="Appointments Today" 
            value="42" 
            change="+8% from yesterday" 
            changeType="positive" 
            icon={<Calendar className="h-5 w-5 text-teal-500" />} 
            delay={300}
          />
        </div>
        
        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="md:col-span-2">
            <AnimatedCard className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-teal-500" />
                    Recent Activity
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10">
                    View All
                  </Button>
                </div>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <ActivityItem 
                    title="New Patient Registration" 
                    time="10 min ago" 
                    description="John Smith has registered as a new patient" 
                    icon={<User className="h-5 w-5 text-teal-500" />} 
                    delay={0}
                  />
                  <ActivityItem 
                    title="New Appointment" 
                    time="25 min ago" 
                    description="Dr. Emily Davis has a new appointment scheduled" 
                    icon={<Calendar className="h-5 w-5 text-teal-500" />} 
                    delay={100}
                  />
                  <ActivityItem 
                    title="Medication Update" 
                    time="1 hour ago" 
                    description="The medication database has been updated with 15 new entries" 
                    icon={<Pill className="h-5 w-5 text-teal-500" />} 
                    delay={200}
                  />
                  <ActivityItem 
                    title="System Update Complete" 
                    time="2 hours ago" 
                    description="The system was successfully updated to version 2.4.0" 
                    icon={<Settings className="h-5 w-5 text-teal-500" />} 
                    delay={300}
                  />
                  <ActivityItem 
                    title="Security Alert" 
                    time="3 hours ago" 
                    description="Multiple failed login attempts detected for user admin@example.com" 
                    icon={<Shield className="h-5 w-5 text-teal-500" />} 
                    delay={400}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10">
                  View All Activity
                </Button>
              </CardFooter>
            </AnimatedCard>
          </div>
          
          {/* System Health */}
          <div>
            <AnimatedCard className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-teal-500" />
                    System Health
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    All Operational
                  </Badge>
                </div>
                <CardDescription>Current system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.map((metric, index) => (
                    <HealthMetricCard 
                      key={index}
                      title={metric.title}
                      value={metric.value}
                      icon={metric.icon}
                      color={metric.color}
                      percentage={metric.percentage}
                      status={metric.status as 'healthy' | 'warning' | 'critical'}
                    />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10">
                  View Detailed Metrics
                </Button>
              </CardFooter>
            </AnimatedCard>
          </div>
        </div>
        
        {/* Quick Access Cards */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ArrowUpRight className="h-5 w-5 mr-2 text-teal-500" />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAccessCard 
            title="User Management" 
            description="Manage patients, doctors and staff accounts" 
            icon={<Users className="h-5 w-5 text-white" />} 
            link="/admin/users" 
            color="bg-teal-500 text-white"
            delay={0}
            badgeCount={3}
          />
          <QuickAccessCard 
            title="Provider Directory" 
            description="View and manage healthcare providers" 
            icon={<UserCog className="h-5 w-5 text-white" />} 
            link="/admin/providers" 
            color="bg-teal-500 text-white"
            delay={100}
          />
          <QuickAccessCard 
            title="Appointments" 
            description="Schedule and manage patient appointments" 
            icon={<Calendar className="h-5 w-5 text-white" />} 
            link="/admin/appointments" 
            color="bg-teal-500 text-white"
            delay={200}
          />
          <QuickAccessCard 
            title="Health Records" 
            description="Access and manage patient health records" 
            icon={<FileText className="h-5 w-5 text-white" />} 
            link="/admin/health-records" 
            color="bg-teal-500 text-white"
            delay={300}
          />
        </div>
        
        {/* Second Row of Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAccessCard 
            title="Medications" 
            description="Manage medication database and prescriptions" 
            icon={<Pill className="h-5 w-5 text-white" />} 
            link="/admin/medications" 
            color="bg-teal-500 text-white"
            delay={400}
          />
          <QuickAccessCard 
            title="Analytics" 
            description="View platform statistics and reports" 
            icon={<BarChart className="h-5 w-5 text-white" />} 
            link="/admin/analytics" 
            color="bg-teal-500 text-white"
            delay={500}
          />
          <QuickAccessCard 
            title="System Settings" 
            description="Configure platform settings and preferences" 
            icon={<Settings className="h-5 w-5 text-white" />} 
            link="/admin/settings" 
            color="bg-teal-500 text-white"
            delay={600}
          />
          <QuickAccessCard 
            title="Notifications" 
            description="Manage system notifications and alerts" 
            icon={<Bell className="h-5 w-5 text-white" />} 
            link="/admin/notifications" 
            color="bg-teal-500 text-white"
            delay={700}
            badgeCount={5}
          />
        </div>
      </div>
    </div>
  );
} 