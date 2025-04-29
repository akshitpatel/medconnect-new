'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  Users,
  FileText, 
  Clock, 
  Bell,
  TrendingUp,
  Stethoscope,
  Pill,
  PenTool,
  User,
  MessageSquare,
  CalendarClock,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import Image from 'next/image';

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  imageUrl?: string;
  appointmentTime?: string;
  appointmentDate?: string;
  appointmentType?: string;
  lastVisit?: string;
  condition?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'no-show';
}

interface NotificationData {
  id: string;
  type: 'appointment' | 'message' | 'lab' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function ProviderDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: 'notif1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      description: 'John Doe at 2:30 PM for Annual Physical',
      time: '30 minutes',
      read: false
    },
    {
      id: 'notif2',
      type: 'message',
      title: 'New Message',
      description: 'Sarah Johnson has a question about medication',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'notif3',
      type: 'lab',
      title: 'Lab Results Ready',
      description: "Michael Brown's blood work results are available",
      time: '2 hours ago',
      read: true
    },
    {
      id: 'notif4',
      type: 'alert',
      title: 'Urgent: Medication Alert',
      description: 'Potential interaction detected for patient Emily Wilson',
      time: 'Yesterday',
      read: true
    }
  ]);

  // Mock data for today's patients
  const todaysPatients: PatientData[] = [
    {
      id: 'pt1',
      name: 'John Doe',
      age: 42,
      gender: 'Male',
      appointmentTime: '9:00 AM',
      appointmentType: 'Annual Physical',
      status: 'completed'
    },
    {
      id: 'pt2',
      name: 'Sarah Johnson',
      age: 35,
      gender: 'Female',
      appointmentTime: '10:30 AM',
      appointmentType: 'Follow-up',
      status: 'completed'
    },
    {
      id: 'pt3',
      name: 'Michael Brown',
      age: 58,
      gender: 'Male',
      appointmentTime: '12:00 PM',
      appointmentType: 'Consultation',
      status: 'in-progress'
    },
    {
      id: 'pt4',
      name: 'Emily Wilson',
      age: 29,
      gender: 'Female',
      appointmentTime: '2:30 PM',
      appointmentType: 'Prescription Renewal',
      status: 'scheduled'
    },
    {
      id: 'pt5',
      name: 'Robert Garcia',
      age: 65,
      gender: 'Male',
      appointmentTime: '4:00 PM',
      appointmentType: 'Chronic Disease Management',
      status: 'scheduled'
    }
  ];

  // Recent patients data
  const recentPatients: PatientData[] = [
    {
      id: 'rpt1',
      name: 'Jennifer Lee',
      age: 32,
      gender: 'Female',
      lastVisit: '2 days ago',
      condition: 'Hypertension'
    },
    {
      id: 'rpt2',
      name: 'David Wilson',
      age: 45,
      gender: 'Male',
      lastVisit: '1 week ago',
      condition: 'Type 2 Diabetes'
    },
    {
      id: 'rpt3',
      name: 'Maria Rodriguez',
      age: 28,
      gender: 'Female',
      lastVisit: '2 weeks ago',
      condition: 'Anxiety'
    }
  ];

  // Mock stats data
  const stats = [
    { title: 'Patients Today', value: 12, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: 'Total Appointments', value: 24, icon: <CalendarDays className="h-6 w-6 text-teal-500" /> },
    { title: 'Pending Reports', value: 5, icon: <FileText className="h-6 w-6 text-amber-500" /> },
    { title: 'Surgery Schedule', value: 3, icon: <Stethoscope className="h-6 w-6 text-red-500" /> }
  ];

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Get status badge
  const getStatusBadge = (status: PatientData['status']) => {
    let classes = "px-2 py-0.5 rounded-full text-xs font-medium ";
    let label = status;
    let icon = null;
    
    switch (status) {
      case 'scheduled':
        classes += "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'checked-in':
        classes += "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        icon = <User className="h-3 w-3 mr-1" />;
        break;
      case 'in-progress':
        classes += "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
        icon = <Stethoscope className="h-3 w-3 mr-1" />;
        break;
      case 'completed':
        classes += "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        icon = <CheckCircle2 className="h-3 w-3 mr-1" />;
        break;
      case 'no-show':
        classes += "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        icon = <X className="h-3 w-3 mr-1" />;
        break;
    }
    
    return (
      <span className={classes}>
        <div className="flex items-center">
          {icon}
          <span className="capitalize">{label}</span>
        </div>
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Provider Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, Dr. Alex Smith
          </p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="Show notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {notification.type === 'appointment' && (
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <CalendarClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            {notification.type === 'message' && (
                              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            )}
                            {notification.type === 'lab' && (
                              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                            )}
                            {notification.type === 'alert' && (
                              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{notification.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                  <Link href="/provider/notifications" className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Patients */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Today's Appointments</h2>
            <Link href="/provider/appointments" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center">
              <span>View All</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {todaysPatients.map(patient => (
              <div key={patient.id} className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/provider/patients/${patient.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400">
                      {patient.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.age} years • {patient.gender} • {patient.appointmentType}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{patient.appointmentTime}</div>
                    <div className="mt-1">{getStatusBadge(patient.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <Link href="/provider/appointments/schedule" className="w-full inline-flex justify-center px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700">
              Manage Schedule
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link 
              href="/provider/patients/add" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Users className="h-6 w-6 text-teal-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">New Patient</span>
            </Link>
            <Link 
              href="/provider/appointments/add" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CalendarDays className="h-6 w-6 text-blue-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">New Appointment</span>
            </Link>
            <Link 
              href="/provider/documentation" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PenTool className="h-6 w-6 text-purple-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Clinical Notes</span>
            </Link>
            <Link 
              href="/provider/surgeries" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Stethoscope className="h-6 w-6 text-red-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Surgeries</span>
            </Link>
            <Link 
              href="/provider/messages" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MessageSquare className="h-6 w-6 text-green-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Messages</span>
            </Link>
            <Link 
              href="/provider/prescriptions" 
              className="flex flex-col items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Pill className="h-6 w-6 text-amber-600 mb-3" />
              <span className="text-sm font-medium text-gray-900 dark:text-white text-center">Prescriptions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Patients & Medical Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Patients */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Patients</h2>
            <Link href="/provider/patients" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center">
              <span>View All</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentPatients.map(patient => (
              <div key={patient.id} className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/provider/patients/${patient.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400">
                      {patient.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {patient.age} years • {patient.gender} • {patient.condition}
                    </p>
                  </div>
                  <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                    <p>Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Total Patients</p>
                    <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">42</h3>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>12% increase from last week</span>
                </p>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-lg border border-teal-100 dark:border-teal-900/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-teal-800 dark:text-teal-300 font-medium">Completed Visits</p>
                    <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-200 mt-1">36</h3>
                  </div>
                  <div className="p-2 bg-teal-100 dark:bg-teal-800/30 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <p className="text-xs text-teal-700 dark:text-teal-400 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>85% completion rate</span>
                </p>
              </div>
            </div>

            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">This Week's Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Patient Satisfaction</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Documentation Completion</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Appointment Punctuality</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 