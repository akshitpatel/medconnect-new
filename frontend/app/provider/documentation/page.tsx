'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Plus, 
  Calendar, 
  ChevronDown, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MessageSquare,
  User,
  Mic
} from 'lucide-react';

// Define template interfaces
interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'soap' | 'history' | 'examination' | 'procedure' | 'discharge' | 'referral';
  lastUsed?: Date;
}

interface NoteCategory {
  id: string;
  name: string;
  count: number;
}

interface PatientNote {
  id: string;
  title: string;
  patientName: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'pending' | 'final';
  category: string;
  creator: string;
  tags: string[];
}

// Mock data
const noteTemplates: DocumentTemplate[] = [
  {
    id: 'temp1',
    name: 'SOAP Note Template',
    description: 'Standard SOAP note format for general encounters',
    category: 'soap',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    id: 'temp2',
    name: 'Comprehensive History & Physical',
    description: 'Complete H&P format for new patient visits',
    category: 'history',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
  },
  {
    id: 'temp3',
    name: 'Pre-Procedure Note',
    description: 'Pre-procedure assessment and plan',
    category: 'procedure',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) // 14 days ago
  },
  {
    id: 'temp4',
    name: 'Follow-up Visit Note',
    description: 'Brief follow-up visit documentation',
    category: 'soap',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: 'temp5',
    name: 'Cardiac Examination Template',
    description: 'Specialized cardiac exam documentation',
    category: 'examination',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    id: 'temp6',
    name: 'Discharge Summary',
    description: 'Hospital discharge documentation',
    category: 'discharge'
  }
];

const noteCategories: NoteCategory[] = [
  { id: 'all', name: 'All Notes', count: 12 },
  { id: 'soap', name: 'SOAP Notes', count: 5 },
  { id: 'history', name: 'History & Physical', count: 2 },
  { id: 'procedure', name: 'Procedure Notes', count: 3 },
  { id: 'discharge', name: 'Discharge Summaries', count: 1 },
  { id: 'referral', name: 'Referral Letters', count: 1 }
];

const recentNotes: PatientNote[] = [
  {
    id: 'note1',
    title: 'Follow-up Visit',
    patientName: 'John Doe',
    patientId: 'P10023',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'final',
    category: 'soap',
    creator: 'Dr. Alex Smith',
    tags: ['hypertension', 'follow-up']
  },
  {
    id: 'note2',
    title: 'Initial Consultation',
    patientName: 'Sarah Johnson',
    patientId: 'P10054',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'final',
    category: 'history',
    creator: 'Dr. Alex Smith',
    tags: ['new patient', 'asthma']
  },
  {
    id: 'note3',
    title: 'Pre-Surgery Assessment',
    patientName: 'Michael Brown',
    patientId: 'P10078',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: 'final',
    category: 'procedure',
    creator: 'Dr. Alex Smith',
    tags: ['surgery', 'pre-op']
  },
  {
    id: 'note4',
    title: 'Medication Review',
    patientName: 'Emily Wilson',
    patientId: 'P10092',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'draft',
    category: 'soap',
    creator: 'Dr. Alex Smith',
    tags: ['medication', 'review']
  }
];

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNotes, setFilteredNotes] = useState<PatientNote[]>(recentNotes);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Filter notes when search term or category changes
  useEffect(() => {
    const filtered = recentNotes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredNotes(filtered);
  }, [searchTerm, selectedCategory]);
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Format relative time (e.g. "2 hours ago")
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get status badge styles
  const getStatusBadge = (status: PatientNote['status']) => {
    let classes = "px-2 py-0.5 rounded-full text-xs font-medium ";
    
    switch (status) {
      case 'draft':
        classes += "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        break;
      case 'pending':
        classes += "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        break;
      case 'final':
        classes += "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        break;
    }
    
    return classes;
  };
  
  // Get status icon
  const getStatusIcon = (status: PatientNote['status']) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'final':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setIsRecording(false);
      // In a real app, we would stop recording and process the audio here
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval as unknown as NodeJS.Timeout);
    }
  };
  
  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Clinical Documentation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create, manage, and search patient notes
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            className={`${
              isRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            } px-4 py-2 rounded-lg shadow-sm text-sm flex items-center justify-center hover:bg-opacity-90 transition-colors`}
            onClick={toggleRecording}
          >
            <Mic className={`h-4 w-4 ${isRecording ? "text-white" : "text-gray-500 dark:text-gray-400"} mr-2`} />
            {isRecording ? formatRecordingTime(recordingTime) : "Voice Dictation"}
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-sm text-sm hover:bg-teal-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Search notes by title, patient, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Filter */}
        <div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="block w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {noteCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Note Templates */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Templates</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {noteTemplates.map(template => (
                  <div key={template.id} className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FileText className="h-5 w-5 text-teal-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                        {template.lastUsed && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last used {getRelativeTime(template.lastUsed)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full py-2 text-sm text-teal-600 dark:text-teal-500 hover:text-teal-700 dark:hover:text-teal-400 flex items-center justify-center">
                <Plus className="h-4 w-4 mr-1" />
                Create Template
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Notes */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notes</h2>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <div key={note.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white mr-3">{note.title}</h3>
                          <span className={getStatusBadge(note.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(note.status)}
                              <span className="ml-1 capitalize">{note.status}</span>
                            </div>
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                          <span className="text-gray-800 dark:text-gray-200">{note.patientName}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500 dark:text-gray-400">{note.patientId}</span>
                        </div>
                        <div className="flex flex-wrap mt-2">
                          {note.tags.map(tag => (
                            <span key={tag} className="mr-2 mb-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>{formatDate(note.createdAt)}</div>
                        <div className="mt-1 text-xs">Updated {getRelativeTime(note.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notes found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchTerm ? 
                      `No notes match your search "${searchTerm}"` : 
                      "You haven't created any notes in this category yet."}
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 flex items-center justify-center">
                <Calendar className="h-4 w-4 mr-2" />
                View All Notes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Documentation Assistant - Fixed at bottom */}
      <div className="fixed bottom-6 right-6">
        <button className="flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none">
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
} 