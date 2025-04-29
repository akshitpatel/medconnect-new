'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Clipboard,
  ChevronRight,
  ChevronDown,
  CircleSlash,
  Info,
  FileText,
  CheckSquare
} from 'lucide-react';

// Interfaces
interface SurgeryStatus {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface Team {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface SurgeryProcedure {
  id: string;
  name: string;
  code: string;
  duration: number; // in minutes
  description: string;
}

interface Surgery {
  id: string;
  title: string;
  patientName: string;
  patientId: string;
  patientAge: number;
  patientGender: string;
  scheduledDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  location: string;
  roomNumber: string;
  priority: 'routine' | 'urgent' | 'emergency';
  duration: number; // in minutes
  procedure: SurgeryProcedure;
  surgeons: Team[];
  anesthesiologists: Team[];
  nurses: Team[];
  preOpChecklist: {
    completed: boolean;
    itemsTotal: number;
    itemsCompleted: number;
  };
  notes?: string;
}

// Mock data
const surgeryStatuses: SurgeryStatus[] = [
  { 
    id: 'scheduled', 
    name: 'Scheduled', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: <Calendar className="h-4 w-4 text-blue-500" />
  },
  { 
    id: 'in-progress', 
    name: 'In Progress', 
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    icon: <Clock className="h-4 w-4 text-amber-500" />
  },
  { 
    id: 'completed', 
    name: 'Completed', 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: <CheckCircle className="h-4 w-4 text-green-500" />
  },
  { 
    id: 'cancelled', 
    name: 'Cancelled', 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    icon: <CircleSlash className="h-4 w-4 text-red-500" />
  }
];

const surgeryProcedures: SurgeryProcedure[] = [
  {
    id: 'proc1',
    name: 'Total Hip Replacement',
    code: 'CPT 27130',
    duration: 120,
    description: 'Replacement of the hip joint with a prosthetic implant'
  },
  {
    id: 'proc2',
    name: 'Laparoscopic Cholecystectomy',
    code: 'CPT 47562',
    duration: 60,
    description: 'Removal of the gallbladder using laparoscopic technique'
  },
  {
    id: 'proc3',
    name: 'Coronary Artery Bypass Grafting',
    code: 'CPT 33533',
    duration: 240,
    description: 'Bypass surgery to restore normal blood flow to the heart'
  },
  {
    id: 'proc4',
    name: 'Cataract Extraction',
    code: 'CPT 66984',
    duration: 30,
    description: 'Removal of the clouded lens from the eye'
  }
];

const surgeries: Surgery[] = [
  {
    id: 'surg1',
    title: 'Total Hip Replacement',
    patientName: 'John Doe',
    patientId: 'P10023',
    patientAge: 62,
    patientGender: 'Male',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    status: 'scheduled',
    location: 'Main OR',
    roomNumber: 'OR-3',
    priority: 'routine',
    duration: 120,
    procedure: surgeryProcedures[0],
    surgeons: [
      { id: 'doc1', name: 'Dr. Alex Smith', role: 'Lead Surgeon' },
      { id: 'doc2', name: 'Dr. Jane Wilson', role: 'Assistant Surgeon' }
    ],
    anesthesiologists: [
      { id: 'anes1', name: 'Dr. Robert Chen', role: 'Anesthesiologist' }
    ],
    nurses: [
      { id: 'nurse1', name: 'Sarah Johnson', role: 'Scrub Nurse' },
      { id: 'nurse2', name: 'Michael Brown', role: 'Circulating Nurse' }
    ],
    preOpChecklist: {
      completed: false,
      itemsTotal: 15,
      itemsCompleted: 9
    },
    notes: 'Patient has a history of hypertension. Cleared for surgery by cardiology.'
  },
  {
    id: 'surg2',
    title: 'Laparoscopic Cholecystectomy',
    patientName: 'Sarah Johnson',
    patientId: 'P10054',
    patientAge: 45,
    patientGender: 'Female',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day from now
    status: 'scheduled',
    location: 'Outpatient Surgery Center',
    roomNumber: 'OR-2',
    priority: 'routine',
    duration: 60,
    procedure: surgeryProcedures[1],
    surgeons: [
      { id: 'doc3', name: 'Dr. Lisa Garcia', role: 'Lead Surgeon' }
    ],
    anesthesiologists: [
      { id: 'anes2', name: 'Dr. Mark Davis', role: 'Anesthesiologist' }
    ],
    nurses: [
      { id: 'nurse3', name: 'Emily Wilson', role: 'Scrub Nurse' },
      { id: 'nurse4', name: 'James Taylor', role: 'Circulating Nurse' }
    ],
    preOpChecklist: {
      completed: false,
      itemsTotal: 15,
      itemsCompleted: 12
    }
  },
  {
    id: 'surg3',
    title: 'CABG',
    patientName: 'Michael Brown',
    patientId: 'P10078',
    patientAge: 68,
    patientGender: 'Male',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    status: 'scheduled',
    location: 'Cardiac Surgery Suite',
    roomNumber: 'OR-5',
    priority: 'urgent',
    duration: 240,
    procedure: surgeryProcedures[2],
    surgeons: [
      { id: 'doc4', name: 'Dr. James Wilson', role: 'Lead Surgeon' },
      { id: 'doc5', name: 'Dr. Maria Lopez', role: 'Assistant Surgeon' }
    ],
    anesthesiologists: [
      { id: 'anes3', name: 'Dr. Emily Chen', role: 'Anesthesiologist' }
    ],
    nurses: [
      { id: 'nurse5', name: 'David Rodriguez', role: 'Scrub Nurse' },
      { id: 'nurse6', name: 'Karen Mitchell', role: 'Circulating Nurse' },
      { id: 'nurse7', name: 'Robert Johnson', role: 'Cardiac Nurse' }
    ],
    preOpChecklist: {
      completed: false,
      itemsTotal: 20,
      itemsCompleted: 15
    },
    notes: 'Patient has severe three-vessel disease. Requires close post-op monitoring.'
  },
  {
    id: 'surg4',
    title: 'Cataract Extraction',
    patientName: 'Lisa Garcia',
    patientId: 'P10062',
    patientAge: 72,
    patientGender: 'Female',
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'completed',
    location: 'Eye Surgery Center',
    roomNumber: 'OR-1',
    priority: 'routine',
    duration: 30,
    procedure: surgeryProcedures[3],
    surgeons: [
      { id: 'doc6', name: 'Dr. Sarah Thompson', role: 'Ophthalmologist' }
    ],
    anesthesiologists: [
      { id: 'anes4', name: 'Dr. Thomas Jackson', role: 'Anesthesiologist' }
    ],
    nurses: [
      { id: 'nurse8', name: 'Amanda Patel', role: 'Scrub Nurse' },
      { id: 'nurse9', name: 'John Davis', role: 'Circulating Nurse' }
    ],
    preOpChecklist: {
      completed: true,
      itemsTotal: 12,
      itemsCompleted: 12
    }
  },
  {
    id: 'surg5',
    title: 'Total Knee Replacement',
    patientName: 'Emily Wilson',
    patientId: 'P10092',
    patientAge: 58,
    patientGender: 'Female',
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'in-progress',
    location: 'Main OR',
    roomNumber: 'OR-4',
    priority: 'routine',
    duration: 150,
    procedure: {
      id: 'proc5',
      name: 'Total Knee Replacement',
      code: 'CPT 27447',
      duration: 150,
      description: 'Replacement of the knee joint with a prosthetic implant'
    },
    surgeons: [
      { id: 'doc1', name: 'Dr. Alex Smith', role: 'Lead Surgeon' },
      { id: 'doc2', name: 'Dr. Jane Wilson', role: 'Assistant Surgeon' }
    ],
    anesthesiologists: [
      { id: 'anes1', name: 'Dr. Robert Chen', role: 'Anesthesiologist' }
    ],
    nurses: [
      { id: 'nurse1', name: 'Sarah Johnson', role: 'Scrub Nurse' },
      { id: 'nurse2', name: 'Michael Brown', role: 'Circulating Nurse' }
    ],
    preOpChecklist: {
      completed: true,
      itemsTotal: 15,
      itemsCompleted: 15
    }
  }
];

export default function SurgeriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('upcoming');
  const [expandedSurgery, setExpandedSurgery] = useState<string | null>(null);
  
  // Filtered surgeries based on search term and filters
  const filteredSurgeries = surgeries.filter(surgery => {
    // Search term filter
    const matchesSearch = 
      surgery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || surgery.status === statusFilter;
    
    // Timeframe filter
    const now = new Date();
    const isUpcoming = surgery.scheduledDate > now && ['scheduled'].includes(surgery.status);
    const isToday = 
      surgery.scheduledDate.getDate() === now.getDate() && 
      surgery.scheduledDate.getMonth() === now.getMonth() && 
      surgery.scheduledDate.getFullYear() === now.getFullYear();
    const isPast = surgery.scheduledDate < now && ['completed', 'cancelled'].includes(surgery.status);
    
    const matchesTimeframe = 
      (timeframeFilter === 'upcoming' && isUpcoming) ||
      (timeframeFilter === 'today' && isToday) ||
      (timeframeFilter === 'past' && isPast) ||
      timeframeFilter === 'all';
    
    return matchesSearch && matchesStatus && matchesTimeframe;
  });
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time (e.g. "9:00 AM")
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Format duration (e.g. "2h 30m")
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: Surgery['status']) => {
    const statusObj = surgeryStatuses.find(s => s.id === status);
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusObj?.color}`}>
        <div className="flex items-center">
          {statusObj?.icon}
          <span className="ml-1 capitalize">{statusObj?.name}</span>
        </div>
      </span>
    );
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: Surgery['priority']) => {
    let classes = "px-2 py-0.5 rounded-full text-xs font-medium ";
    
    switch (priority) {
      case 'routine':
        classes += "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        break;
      case 'urgent':
        classes += "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
        break;
      case 'emergency':
        classes += "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        break;
    }
    
    return (
      <span className={classes}>
        <span className="capitalize">{priority}</span>
      </span>
    );
  };
  
  // Toggle expanded view for a surgery
  const toggleSurgeryExpand = (id: string) => {
    if (expandedSurgery === id) {
      setExpandedSurgery(null);
    } else {
      setExpandedSurgery(id);
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Surgery Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Schedule and track surgical procedures
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Surgery
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search surgeries by title, patient, ID, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value)}
            >
              <option value="all">All Timeframes</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
            </select>
            
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Surgery List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredSurgeries.length > 0 ? (
            filteredSurgeries.map(surgery => (
              <li key={surgery.id}>
                {/* Main surgery info */}
                <div 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  onClick={() => toggleSurgeryExpand(surgery.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mr-3">{surgery.title}</h3>
                        {getStatusBadge(surgery.status)}
                        <ChevronDown className={`ml-auto md:hidden h-5 w-5 text-gray-400 transform transition-transform ${expandedSurgery === surgery.id ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="flex items-center mt-1 text-sm">
                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-800 dark:text-gray-200">{surgery.patientName}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{surgery.patientId}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{surgery.patientAge} • {surgery.patientGender}</span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Date & Time</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(surgery.scheduledDate)}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{formatTime(surgery.scheduledDate)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{surgery.location}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">Room {surgery.roomNumber}</div>
                      </div>
                      <div className="hidden md:block">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(surgery.duration)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center">
                            Priority: {getPriorityBadge(surgery.priority)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`hidden md:block ml-4 h-5 w-5 text-gray-400 transform transition-transform ${expandedSurgery === surgery.id ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="md:hidden mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(surgery.duration)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <div className="flex items-center">
                        Priority: {getPriorityBadge(surgery.priority)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded surgery details */}
                {expandedSurgery === surgery.id && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Procedure details */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Procedure Details</h3>
                        <dl className="space-y-1">
                          <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Procedure Name</dt>
                            <dd className="text-sm font-medium text-gray-900 dark:text-white">{surgery.procedure.name}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Procedure Code</dt>
                            <dd className="text-sm text-gray-800 dark:text-gray-200">{surgery.procedure.code}</dd>
                          </div>
                          <div>
                            <dt className="text-xs text-gray-500 dark:text-gray-400">Description</dt>
                            <dd className="text-sm text-gray-800 dark:text-gray-200">{surgery.procedure.description}</dd>
                          </div>
                          {surgery.notes && (
                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-100 dark:border-yellow-900/20">
                              <div className="flex">
                                <Info className="h-4 w-4 text-yellow-500 mr-1 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-800 dark:text-yellow-300">{surgery.notes}</p>
                              </div>
                            </div>
                          )}
                        </dl>
                      </div>
                      
                      {/* Surgical team */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Surgical Team</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Surgeons</div>
                            {surgery.surgeons.map(person => (
                              <div key={person.id} className="flex items-center text-sm mb-1 last:mb-0">
                                <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mr-2">
                                  <User className="w-3 h-3" />
                                </div>
                                <span className="text-gray-900 dark:text-white font-medium">{person.name}</span>
                                <span className="mx-1 text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400">{person.role}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Anesthesiologists</div>
                            {surgery.anesthesiologists.map(person => (
                              <div key={person.id} className="flex items-center text-sm mb-1 last:mb-0">
                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                                  <User className="w-3 h-3" />
                                </div>
                                <span className="text-gray-900 dark:text-white font-medium">{person.name}</span>
                                <span className="mx-1 text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400">{person.role}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nurses</div>
                            {surgery.nurses.map(person => (
                              <div key={person.id} className="flex items-center text-sm mb-1 last:mb-0">
                                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2">
                                  <User className="w-3 h-3" />
                                </div>
                                <span className="text-gray-900 dark:text-white font-medium">{person.name}</span>
                                <span className="mx-1 text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400">{person.role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Pre-op checklist and actions */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pre-Op Checklist</h3>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {surgery.preOpChecklist.itemsCompleted} of {surgery.preOpChecklist.itemsTotal} items completed
                            </span>
                            <span className={`text-xs font-medium ${
                              surgery.preOpChecklist.completed
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {surgery.preOpChecklist.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                surgery.preOpChecklist.completed
                                  ? 'bg-green-500'
                                  : 'bg-amber-500'
                              }`}
                              style={{ width: `${(surgery.preOpChecklist.itemsCompleted / surgery.preOpChecklist.itemsTotal) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            href={`/provider/surgeries/${surgery.id}`}
                            className="block w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center justify-center"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Full Details
                          </Link>
                          
                          {surgery.status === 'scheduled' && (
                            <>
                              <Link
                                href={`/provider/surgeries/${surgery.id}/checklist`}
                                className="block w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center justify-center"
                              >
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Complete Checklist
                              </Link>
                              <button
                                className="w-full py-2 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center"
                              >
                                <CircleSlash className="h-4 w-4 mr-2" />
                                Cancel Surgery
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="p-8 text-center">
              <Clipboard className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No surgeries found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {searchTerm ? 
                  `No surgeries match your search "${searchTerm}"` : 
                  "There are no surgeries matching your filters."}
              </p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 