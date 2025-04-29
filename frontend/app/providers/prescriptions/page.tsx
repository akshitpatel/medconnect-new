'use client';

import React, { useState, useEffect } from 'react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { 
  ClipboardList, 
  User, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown,
  Download,
  Send,
  FileText,
  MoreHorizontal,
  Printer,
  Pill,
  Check,
  Clock,
  XCircle,
  CalendarClock,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  patientAvatar?: string;
  medications: Medication[];
  dateIssued: Date;
  expiryDate: Date;
  status: 'active' | 'completed' | 'expired' | 'pending' | 'cancelled';
  notes?: string;
  refillable: boolean;
  refillsRemaining?: number;
  isNew?: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('dateIssued');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        // Generate fake prescriptions
        const mockPrescriptions: Prescription[] = [];
        
        const medications = [
          {
            id: 'med1',
            name: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with food'
          },
          {
            id: 'med2',
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning'
          },
          {
            id: 'med3',
            name: 'Metformin',
            dosage: '1000mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with meals'
          },
          {
            id: 'med4',
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take at bedtime'
          },
          {
            id: 'med5',
            name: 'Levothyroxine',
            dosage: '50mcg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take 30 minutes before breakfast'
          }
        ];
        
        const patients = [
          'John Smith', 
          'Jane Doe', 
          'Robert Johnson', 
          'Emily Davis', 
          'Michael Wilson', 
          'Sarah Adams', 
          'David Brown'
        ];
        
        const statuses: Prescription['status'][] = ['active', 'completed', 'expired', 'pending', 'cancelled'];
        
        // Generate 15 prescriptions
        for (let i = 0; i < 15; i++) {
          const dateIssued = new Date();
          dateIssued.setDate(dateIssued.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
          
          const expiryDate = new Date(dateIssued);
          expiryDate.setDate(expiryDate.getDate() + 30); // Expires 30 days after issue
          
          const patientName = patients[Math.floor(Math.random() * patients.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Create 1-3 medications per prescription
          const prescriptionMeds = [];
          const numMeds = Math.floor(Math.random() * 3) + 1;
          
          for (let j = 0; j < numMeds; j++) {
            const randomMed = medications[Math.floor(Math.random() * medications.length)];
            prescriptionMeds.push({...randomMed, id: `${randomMed.id}-${i}-${j}`});
          }
          
          mockPrescriptions.push({
            id: `rx-${i}`,
            patientName,
            patientId: `patient-${i}`,
            medications: prescriptionMeds,
            dateIssued,
            expiryDate,
            status,
            refillable: Math.random() > 0.5,
            refillsRemaining: Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : 0,
            isNew: i < 2 // First two are new
          });
        }
        
        setPrescriptions(mockPrescriptions);
        filterAndSortPrescriptions(mockPrescriptions, searchTerm, statusFilter, sortField, sortDirection);
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    filterAndSortPrescriptions(prescriptions, searchTerm, statusFilter, sortField, sortDirection);
  }, [searchTerm, statusFilter, sortField, sortDirection]);
  
  const filterAndSortPrescriptions = (
    prescList: Prescription[], 
    search: string, 
    status: string,
    sort: string,
    direction: 'asc' | 'desc'
  ) => {
    // Filter by search term
    let filtered = prescList;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(presc => 
        presc.patientName.toLowerCase().includes(searchLower) ||
        presc.medications.some(med => med.name.toLowerCase().includes(searchLower))
      );
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(presc => presc.status === status);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let compareA;
      let compareB;
      
      switch (sort) {
        case 'patientName':
          compareA = a.patientName;
          compareB = b.patientName;
          break;
        case 'dateIssued':
          compareA = a.dateIssued.getTime();
          compareB = b.dateIssued.getTime();
          break;
        case 'expiryDate':
          compareA = a.expiryDate.getTime();
          compareB = b.expiryDate.getTime();
          break;
        default:
          compareA = a.dateIssued.getTime();
          compareB = b.dateIssued.getTime();
      }
      
      if (direction === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
    
    setFilteredPrescriptions(filtered);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusBadgeColor = (status: Prescription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getStatusIcon = (status: Prescription['status']) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 mr-1" />;
      case 'completed':
        return <Check className="h-4 w-4 mr-1" />;
      case 'expired':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'pending':
        return <CalendarClock className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor patient prescriptions
          </p>
        </div>
        <div>
          <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients or medications..."
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
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Prescriptions List */}
      <AnimatedCard className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('patientName')}
                >
                  <div className="flex items-center">
                    Patient
                    {sortField === 'patientName' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medications</th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('dateIssued')}
                >
                  <div className="flex items-center">
                    Date Issued
                    {sortField === 'dateIssued' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('expiryDate')}
                >
                  <div className="flex items-center">
                    Expiry Date
                    {sortField === 'expiryDate' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <React.Fragment key={prescription.id}>
                    <tr className={`${showDetails === prescription.id ? 'bg-gray-50 dark:bg-gray-750' : 'hover:bg-gray-50 dark:hover:bg-gray-750'}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center text-teal-700 dark:text-teal-300 font-medium">
                            {prescription.patientName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-white">{prescription.patientName}</p>
                            {prescription.isNew && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col space-y-1">
                          {prescription.medications.slice(0, 2).map((med) => (
                            <div key={med.id} className="flex items-center">
                              <Pill className="h-4 w-4 text-teal-500 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                                {med.name} {med.dosage}
                              </span>
                            </div>
                          ))}
                          {prescription.medications.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{prescription.medications.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(prescription.dateIssued)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(prescription.expiryDate)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(prescription.status)}`}>
                          {getStatusIcon(prescription.status)}
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <FileText className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <Printer className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                            onClick={() => setShowDetails(showDetails === prescription.id ? null : prescription.id)}
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${showDetails === prescription.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Details Expandable Row */}
                    {showDetails === prescription.id && (
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="py-2">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Prescription Details</h4>
                            
                            <div className="mb-4">
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                <span className="font-medium">Refills:</span> {prescription.refillable ? 
                                  `${prescription.refillsRemaining} remaining` : 
                                  'No refills authorized'}
                              </p>
                              
                              {prescription.notes && (
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  <span className="font-medium">Notes:</span> {prescription.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Medications:</h5>
                              
                              <div className="space-y-3">
                                {prescription.medications.map((medication) => (
                                  <div key={medication.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium text-gray-900 dark:text-white flex items-center">
                                          <Pill className="h-4 w-4 text-teal-500 mr-2" />
                                          {medication.name}
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
                                          {medication.dosage} - {medication.frequency} for {medication.duration}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
                                      <span className="font-medium">Instructions:</span> {medication.instructions}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end space-x-3">
                              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Send className="h-4 w-4 mr-2" />
                                Send to Pharmacy
                              </button>
                              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </button>
                              <button className="flex items-center px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Refill
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
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Prescriptions Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm 
                        ? `No prescriptions match your search criteria.` 
                        : (statusFilter !== 'all' 
                          ? `No ${statusFilter} prescriptions found.` 
                          : 'No prescriptions found with the current filters.')}
                    </p>
                    <button
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Create Prescription
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