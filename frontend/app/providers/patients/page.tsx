'use client';

import React, { useState, useEffect } from 'react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { 
  Search, 
  Users, 
  Plus, 
  ChevronDown,
  User,
  Filter,
  MoreHorizontal,
  Edit,
  FileText,
  MessageSquare,
  Calendar,
  HeartPulse,
  Bell,
  Mail,
  Phone,
  Badge,
  UserPlus,
  ArrowUpDown,
  Clipboard
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  lastVisit?: Date;
  upcomingAppointment?: Date;
  insuranceProvider?: string;
  policyNumber?: string;
  medicalConditions: string[];
  allergies: string[];
  profileComplete: boolean;
  status: 'active' | 'inactive' | 'new';
  avatar?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        // Generate fake patient data
        const mockPatients: Patient[] = [];
        
        const firstNames = [
          'John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Mary', 
          'James', 'Patricia', 'Richard', 'Linda', 'Charles', 'Barbara', 'Thomas', 'Elizabeth'
        ];
        
        const lastNames = [
          'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
          'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'
        ];
        
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
        const genders = ['male', 'female', 'other'] as const;
        const statuses = ['active', 'inactive', 'new'] as const;
        
        const medicalConditions = [
          'Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Depression', 'Anxiety',
          'Hypothyroidism', 'Hyperlipidemia', 'COPD', 'Coronary Artery Disease'
        ];
        
        const allergies = [
          'Penicillin', 'Peanuts', 'Shellfish', 'Dust Mites', 'Pollen', 'Latex',
          'Eggs', 'Milk', 'Soy', 'Wheat', 'Fish', 'Sulfa Drugs'
        ];
        
        const insuranceProviders = [
          'Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Cigna', 'Humana',
          'Kaiser Permanente', 'Medicare', 'Medicaid', 'Anthem', 'Centene'
        ];
        
        // Generate 20 patients
        for (let i = 0; i < 20; i++) {
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const name = `${firstName} ${lastName}`;
          const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
          
          const dateOfBirth = new Date();
          dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 20 - Math.floor(Math.random() * 60)); // Age between 20-80
          
          const lastVisit = new Date();
          lastVisit.setDate(lastVisit.getDate() - Math.floor(Math.random() * 180)); // Within last 6 months
          
          let upcomingAppointment: Date | undefined;
          if (Math.random() > 0.3) { // 70% have upcoming appointments
            upcomingAppointment = new Date();
            upcomingAppointment.setDate(upcomingAppointment.getDate() + Math.floor(Math.random() * 30)); // Within next 30 days
          }
          
          // Pick 0-3 random medical conditions
          const patientConditions = [];
          const numConditions = Math.floor(Math.random() * 4);
          for (let j = 0; j < numConditions; j++) {
            const condition = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
            if (!patientConditions.includes(condition)) {
              patientConditions.push(condition);
            }
          }
          
          // Pick 0-2 random allergies
          const patientAllergies = [];
          const numAllergies = Math.floor(Math.random() * 3);
          for (let j = 0; j < numAllergies; j++) {
            const allergy = allergies[Math.floor(Math.random() * allergies.length)];
            if (!patientAllergies.includes(allergy)) {
              patientAllergies.push(allergy);
            }
          }
          
          mockPatients.push({
            id: `patient-${i}`,
            name,
            email,
            phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            dateOfBirth,
            gender: genders[Math.floor(Math.random() * genders.length)],
            address: `${Math.floor(Math.random() * 1000) + 100} Main St, Anytown, USA`,
            bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
            lastVisit,
            upcomingAppointment,
            insuranceProvider: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
            policyNumber: `POL-${Math.floor(Math.random() * 10000000)}`,
            medicalConditions: patientConditions,
            allergies: patientAllergies,
            profileComplete: Math.random() > 0.2, // 80% have complete profiles
            status: statuses[Math.floor(Math.random() * statuses.length)]
          });
        }
        
        setPatients(mockPatients);
        filterAndSortPatients(mockPatients, searchTerm, statusFilter, sortField, sortDirection);
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    filterAndSortPatients(patients, searchTerm, statusFilter, sortField, sortDirection);
  }, [searchTerm, statusFilter, sortField, sortDirection]);
  
  const filterAndSortPatients = (
    patientList: Patient[], 
    search: string, 
    status: string,
    sort: string,
    direction: 'asc' | 'desc'
  ) => {
    // Filter by search term
    let filtered = patientList;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(search)
      );
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(patient => patient.status === status);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let compareA;
      let compareB;
      
      switch (sort) {
        case 'name':
          compareA = a.name;
          compareB = b.name;
          break;
        case 'lastVisit':
          compareA = a.lastVisit ? a.lastVisit.getTime() : 0;
          compareB = b.lastVisit ? b.lastVisit.getTime() : 0;
          break;
        case 'upcomingAppointment':
          compareA = a.upcomingAppointment ? a.upcomingAppointment.getTime() : Number.MAX_SAFE_INTEGER;
          compareB = b.upcomingAppointment ? b.upcomingAppointment.getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'dateOfBirth':
          compareA = a.dateOfBirth.getTime();
          compareB = b.dateOfBirth.getTime();
          break;
        default:
          compareA = a.name;
          compareB = b.name;
      }
      
      if (direction === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
    
    setFilteredPatients(filtered);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getAge = (dateOfBirth: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  };
  
  const getStatusBadgeColor = (status: Patient['status']) => {
    switch (status) {
      case 'active':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const togglePatientDetails = (patientId: string) => {
    setSelectedPatient(selectedPatient === patientId ? null : patientId);
  };
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-24"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your patients
          </p>
        </div>
        <div>
          <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-teal-100 dark:bg-teal-900/20">
              <Users className="h-6 w-6 text-teal-700 dark:text-teal-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Patients</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{patients.length}</h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/20">
              <UserPlus className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Patients</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.filter(p => p.status === 'new').length}
              </h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-amber-100 dark:bg-amber-900/20">
              <Calendar className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Appointments</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.filter(p => p.upcomingAppointment).length}
              </h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-700">
              <HeartPulse className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Health Monitoring</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {patients.filter(p => p.medicalConditions.length > 0).length}
              </h3>
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Search and Filter Bar */}
      <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name, email or phone..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Calendar className="h-4 w-4 mr-2" />
          View Appointments
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Clipboard className="h-4 w-4 mr-2" />
          Health Records
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Badge className="h-4 w-4 mr-2" />
          Insurance Verification
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="h-4 w-4 mr-2" />
          Send Reminder
        </button>
      </div>
      
      {/* Patients List */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center">
                    Patient
                    {sortField === 'name' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                  onClick={() => toggleSort('dateOfBirth')}
                >
                  <div className="flex items-center">
                    Age/Gender
                    {sortField === 'dateOfBirth' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                  onClick={() => toggleSort('lastVisit')}
                >
                  <div className="flex items-center">
                    Last Visit
                    {sortField === 'lastVisit' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden xl:table-cell"
                  onClick={() => toggleSort('upcomingAppointment')}
                >
                  <div className="flex items-center">
                    Next Appointment
                    {sortField === 'upcomingAppointment' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <React.Fragment key={patient.id}>
                    <tr className={`${selectedPatient === patient.id ? 'bg-gray-50 dark:bg-gray-750' : 'hover:bg-gray-50 dark:hover:bg-gray-750'}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-700 dark:text-teal-300 font-medium">
                            {patient.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                patient.bloodType.includes('+') ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                              }`}>
                                {patient.bloodType}
                              </span>
                              {patient.profileComplete ? (
                                <span className="text-xs text-teal-600 dark:text-teal-400">
                                  Complete
                                </span>
                              ) : (
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  Incomplete
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">{patient.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 dark:text-white">{getAge(patient.dateOfBirth)} years</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{patient.gender}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {patient.upcomingAppointment ? formatDate(patient.upcomingAppointment) : 'None scheduled'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(patient.status)}`}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <Calendar className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                            onClick={() => togglePatientDetails(patient.id)}
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${selectedPatient === patient.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {selectedPatient === patient.id && (
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="py-2">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Patient Details</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                                <p className="text-sm text-gray-900 dark:text-white">{formatDate(patient.dateOfBirth)} ({getAge(patient.dateOfBirth)} years)</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                                <p className="text-sm text-gray-900 dark:text-white">{patient.address}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Insurance</p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {patient.insuranceProvider} <br />
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Policy: {patient.policyNumber}</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Medical Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                  {patient.medicalConditions.length > 0 ? patient.medicalConditions.map((condition, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                                      {condition}
                                    </span>
                                  )) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">No medical conditions</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                  {patient.allergies.length > 0 ? patient.allergies.map((allergy, index) => (
                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                                      {allergy}
                                    </span>
                                  )) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">No allergies</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end space-x-3">
                              <Link href={`/providers/patients/${patient.id}`}>
                                <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Full Profile
                                </button>
                              </Link>
                              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Patient
                              </button>
                              <button className="flex items-center px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Appointment
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Patients Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm 
                        ? `No patients match your search criteria.` 
                        : (statusFilter !== 'all' 
                          ? `No ${statusFilter} patients found.` 
                          : 'No patients in your database yet. Add your first patient.')}
                    </p>
                    <button
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Add New Patient
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
} 