'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  X,
  UserPlus,
  ArrowDown,
  ArrowUp,
  Check,
  Trash2,
  AlignJustify,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Info,
  FileText,
  Edit,
  MoreVertical,
  Plus,
  Filter,
  Search,
  Save,
  AlertTriangle,
  ChevronDown,
  Mail,
  Phone,
  RefreshCw,
  Clock,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { adminAPI } from '@/app/services/api';

// Simple tooltip component to avoid import issues
const SimpleTooltip = ({ children, content }: { children: React.ReactElement, content: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Clone the child element to add mouse event handlers
  const childWithEvents = React.cloneElement(children, {
    onMouseEnter: () => setIsVisible(true),
    onMouseLeave: () => setIsVisible(false),
    onClick: (e: React.MouseEvent) => {
      // Preserve the original onClick if it exists
      if (children.props.onClick) {
        children.props.onClick(e);
      }
    },
  });

  return (
    <div className="relative inline-block">
      {childWithEvents}
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-1">
          <div className="px-2 py-1 text-xs font-medium text-white bg-gray-800 dark:bg-gray-900 rounded shadow-lg whitespace-nowrap">
            {content}
          </div>
          <div className="absolute w-0 h-0 top-full left-1/2 transform -translate-x-1/2 border-4 border-t-gray-800 dark:border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent"></div>
        </div>
      )}
    </div>
  );
};

// Define types
type PatientStatus = 'active' | 'inactive' | 'pending' | 'blocked';
type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: BloodType;
  address: string;
  registeredDate: string;
  lastLogin: string;
  status: PatientStatus;
  insuranceProvider: string;
  insuranceNumber: string;
  emergencyContact: string;
  medicalConditions: string[];
  appointmentsThisMonth: number;
  totalAppointments: number;
  lastAppointment: string | null;
}

// Fallback mock data in case API fails
const MOCK_PATIENTS: Patient[] = [
  {
    id: 'PT-1001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    bloodType: 'O+',
    address: '123 Main St, Anytown, CA 90210',
    registeredDate: '2023-01-15T10:30:00Z',
    lastLogin: '2023-06-20T14:45:00Z',
    status: 'active',
    insuranceProvider: 'BlueCross BlueShield',
    insuranceNumber: 'BCBS-123456789',
    emergencyContact: 'Mary Smith, (555) 987-6543',
    medicalConditions: ['Hypertension', 'Allergies'],
    appointmentsThisMonth: 2,
    totalAppointments: 12,
    lastAppointment: '2023-06-15T09:00:00Z'
  },
  {
    id: 'PT-1002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1990-08-22',
    gender: 'female',
    bloodType: 'A+',
    address: '456 Oak Ave, Springfield, IL 62704',
    registeredDate: '2023-02-20T09:15:00Z',
    lastLogin: new Date().toISOString(), // Today
    status: 'active',
    insuranceProvider: 'Aetna',
    insuranceNumber: 'AET-987654321',
    emergencyContact: 'Robert Johnson, (555) 876-5432',
    medicalConditions: [],
    appointmentsThisMonth: 1,
    totalAppointments: 5,
    lastAppointment: new Date().toISOString() // Today
  }
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMedicalRecordsModalOpen, setIsMedicalRecordsModalOpen] = useState(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0
  });

  // Sorting state
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Patient statistics
  const [patientStats, setPatientStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.action-dropdown')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Fetch patients from API with pagination, sorting, and filtering
  const fetchPatients = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching patients from backend API...');
      const response = await adminAPI.getUsers({
        role: 'patient',
        page,
        per_page: pageSize,
        sort_by: sortField,
        sort_direction: sortDirection,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });
      console.log('Raw API response:', response);
      console.log('Users array from API:', response.data?.data?.users);
      
      // Update pagination data
      if (response.data?.data?.pagination) {
        setPagination({
          currentPage: response.data.data.pagination.current_page,
          totalPages: response.data.data.pagination.total_pages,
          perPage: response.data.data.pagination.per_page,
          totalItems: response.data.data.pagination.total_items
        });
      }
      
      // Update patient statistics
      if (response.data?.data?.stats) {
        setPatientStats({
          total: response.data.data.stats.patients || 0,
          active: response.data.data.stats.active_patients || response.data.data.stats.patients || 0,
          newThisMonth: response.data.data.stats.new_this_month || 0
        });
      }
      
      // Map API response to our Patient interface based on actual API structure
      const formattedPatients: Patient[] = response.data?.data?.users?.map((user: any) => ({
        id: user.id.toString(), // Convert to string as the filter expects string IDs
        name: user.name, // Use the name field directly as it comes from API
        email: user.email,
        phone: user.phone || 'Not provided',
        dateOfBirth: user.date_of_birth || new Date().toISOString(),
        gender: user.gender || 'other',
        bloodType: user.blood_type || 'unknown',
        address: user.address || 'Not provided',
        registeredDate: user.join_date || user.created_at, 
        lastLogin: user.last_active || user.join_date,
        status: user.status || 'active',
        insuranceProvider: user.insurance_provider || 'Not provided',
        insuranceNumber: user.insurance_number || 'Not provided',
        emergencyContact: user.emergency_contact || 'Not provided',
        medicalConditions: user.medical_conditions || [],
        appointmentsThisMonth: user.appointments_count?.this_month || 0,
        totalAppointments: user.appointments_count?.total || 0,
        lastAppointment: user.last_appointment || null
      })) || [];
      
      console.log('Successfully mapped patient data:', formattedPatients.length, 'records');
      setPatients(formattedPatients);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError('Failed to load patients. Using mock data instead.');
      
      // Fallback to mock data if API fails for resilience
      console.warn('Using mock data as fallback due to API failure');
      setPatients(MOCK_PATIENTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Component mounted, fetching patients data...');
    fetchPatients(pagination.currentPage, pagination.perPage);
    
    // Auto-refresh data every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Refreshing patients data...');
      fetchPatients(pagination.currentPage, pagination.perPage);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    // Clean up the interval when component unmounts
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Handle pagination page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPatients(page, pagination.perPage);
  };
  
  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5; // Show at most 5 buttons
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtonsToShow - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`h-8 w-8 ${pagination.currentPage === i ? 'bg-teal-500 hover:bg-teal-600 text-white' : ''}`}
        >
          {i}
        </Button>
      );
    }
    
    return buttons;
  };
  
  // CSV Export Functionality
  const exportPatientsToCSV = () => {
    // Create CSV content from patients data
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Gender', 'Age', 'Status', 'Registered Date'];
    
    let csvContent = headers.join(',') + '\n';
    
    // Add each patient as a row
    patients.forEach(patient => {
      const row = [
        patient.id,
        `"${patient.name}"`,
        `"${patient.email}"`,
        `"${patient.phone}"`,
        patient.gender,
        calculateAge(patient.dateOfBirth),
        patient.status,
        new Date(patient.registeredDate).toLocaleDateString()
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    
    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
  };

  // Filter patients
  const filteredPatients = patients ? patients.filter(patient => {
    // Filter by search term
    const matchesSearch = searchTerm === '' ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(patient.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  }) : [];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format dates in a readable way with relative time indicators
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    // Format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
    
    // Add a relative time indicator
    let relativeTime = '';
    if (diffInDays === 0) {
      relativeTime = 'Today';
    } else if (diffInDays === 1) {
      relativeTime = 'Yesterday';
    } else if (diffInDays < 7) {
      relativeTime = `${diffInDays} days ago`;
    }
    
    return { formattedDate, relativeTime, isRecent: diffInDays < 3 };
  };
  
  const handleDropdownClick = (patientId: string) => {
    setActiveDropdown(activeDropdown === patientId ? null : patientId);
  };

  const handlePatientAction = (action: string, patientId: string) => {
    console.log(`Action: ${action}, Patient ID: ${patientId}`);

    // Find the patient by ID
    const patient = patients?.find(p => String(p.id) === String(patientId));
    if (!patient) return;

    // Set the selected patient
    setSelectedPatient(patient);

    // Execute action based on selection
    switch(action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
      case 'edit':
        setIsEditModalOpen(true);
        break;
      case 'medical-records':
        setIsMedicalRecordsModalOpen(true);
        break;
      case 'appointments':
        setIsAppointmentsModalOpen(true);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }

    // Close dropdown
    setActiveDropdown(null);
  };
  
  // Toggle patient active status with enhanced backend integration and real-time feedback
  const togglePatientStatus = async (patientId: string) => {
    // Find the patient to get current status
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      console.error(`Patient with ID ${patientId} not found`);
      return;
    }
    
    // New status will be the opposite of current status
    const newStatus = patient.status === 'active' ? 'inactive' : 'active';
    
    // Set loading state for this patient - provides visual feedback
    setIsUpdating(patientId);
    console.log(`Toggling patient ${patient.name} (${patientId}) status from ${patient.status} to ${newStatus}...`);
    
    try {
      // First update UI optimistically for immediate feedback to improve UX
      setPatients(prevPatients => 
        prevPatients.map(p => {
          if (p.id === patientId) {
            return { ...p, status: newStatus };
          }
          return p;
        })
      );
      
      // Then send API request to update the backend
      const response = await adminAPI.updateUser(patientId, { status: newStatus });
      
      // On success, we don't need to do anything as UI is already updated
      console.log(`Successfully updated patient ${patient.name} (${patientId}) status to ${newStatus}`, response);
    } catch (err) {
      console.error(`Failed to update patient ${patientId} status:`, err);
      
      // On error, revert the optimistic update for data consistency
      setPatients(prevPatients => 
        prevPatients.map(p => {
          if (p.id === patientId) {
            return { ...p, status: patient.status }; // Revert to original status
          }
          return p;
        })
      );
      
      // Show error in UI with more descriptive message
      setError(`Failed to update ${patient.name}'s status. The server could not process your request. Please try again.`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      // Clear loading state
      setIsUpdating(null);
    }
  };

  // Modal components for patient actions
  const PatientViewModal = () => {
    if (!selectedPatient) return null;
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Patient Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                    <span className="text-base font-medium text-gray-900 dark:text-white">{selectedPatient.name}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.email}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.phone}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.dateOfBirth}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.gender}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Blood Type</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.bloodType}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedPatient.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 
                        selectedPatient.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500' : 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                      }`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered Date</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.registeredDate}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.lastLogin}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Insurance Provider</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.insuranceProvider}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Insurance Number</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.insuranceNumber}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</span>
                    <span className="text-base text-gray-900 dark:text-white">{selectedPatient.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Medical Conditions</h3>
                {selectedPatient.medicalConditions.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {selectedPatient.medicalConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No medical conditions recorded</p>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsMedicalRecordsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Medical Records
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
  
  const PatientEditModal = () => {
    if (!selectedPatient) return null;
    
    // State for form fields
    const [formData, setFormData] = useState({
      name: selectedPatient.name,
      email: selectedPatient.email,
      phone: selectedPatient.phone,
      dateOfBirth: selectedPatient.dateOfBirth,
      gender: selectedPatient.gender,
      bloodType: selectedPatient.bloodType,
      address: selectedPatient.address,
      insuranceProvider: selectedPatient.insuranceProvider,
      insuranceNumber: selectedPatient.insuranceNumber,
      emergencyContact: selectedPatient.emergencyContact,
      status: selectedPatient.status
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Saving patient data:', formData);
      // Here you would call the API to update the patient
      // For now, we'll just close the modal
      setIsEditModalOpen(false);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Patient</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Insurance Number</label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const PatientMedicalRecordsModal = () => {
    if (!selectedPatient) return null;
    
    // Mock medical records data
    const mockMedicalRecords = [
      {
        id: 'MR-1001',
        date: '2025-03-15',
        doctorName: 'Dr. Sarah Johnson',
        diagnosis: 'Seasonal Allergies',
        prescription: 'Cetirizine 10mg daily',
        notes: 'Patient reported sneezing and itchy eyes. Advised to avoid outdoor activities during high pollen count.'
      },
      {
        id: 'MR-1002',
        date: '2025-01-22',
        doctorName: 'Dr. Robert Chen',
        diagnosis: 'Influenza Type A',
        prescription: 'Oseltamivir 75mg twice daily for 5 days',
        notes: 'Patient presented with fever, body aches, and fatigue. Recommended rest and increased fluid intake.'
      },
      {
        id: 'MR-1003',
        date: '2024-11-05',
        doctorName: 'Dr. Emily Rodriguez',
        diagnosis: 'Annual Physical Examination',
        prescription: '',
        notes: 'All vitals normal. Recommended to continue current exercise regimen and balanced diet.'
      }
    ];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medical Records: {selectedPatient.name}</h2>
              <button
                onClick={() => setIsMedicalRecordsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {mockMedicalRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Diagnosis</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prescription</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockMedicalRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.doctorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.diagnosis}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{record.prescription || 'None'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <button
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => alert(`View details for record ${record.id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No medical records found for this patient.</p>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  alert('This would allow adding a new medical record.');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Record
              </button>
              
              <button
                onClick={() => setIsMedicalRecordsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const PatientAppointmentsModal = () => {
    if (!selectedPatient) return null;
    
    // Mock appointments data
    const mockAppointments = [
      {
        id: 'APT-1001',
        date: '2025-05-10',
        time: '09:30 AM',
        doctorName: 'Dr. James Wilson',
        department: 'Cardiology',
        status: 'upcoming',
        notes: 'Annual heart checkup'
      },
      {
        id: 'APT-1002',
        date: '2025-04-22',
        time: '02:15 PM',
        doctorName: 'Dr. Maria Lopez',
        department: 'Dermatology',
        status: 'completed',
        notes: 'Skin condition follow-up'
      },
      {
        id: 'APT-1003',
        date: '2025-03-15',
        time: '11:00 AM',
        doctorName: 'Dr. Sarah Johnson',
        department: 'General Medicine',
        status: 'cancelled',
        notes: 'Regular health checkup'
      }
    ];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appointments: {selectedPatient.name}</h2>
              <button
                onClick={() => setIsAppointmentsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {mockAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {appointment.date} <br/> {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{appointment.doctorName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{appointment.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' : 
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <button
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                            onClick={() => alert(`View details for appointment ${appointment.id}`)}
                          >
                            Details
                          </button>
                          {appointment.status === 'upcoming' && (
                            <button
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => alert(`Cancel appointment ${appointment.id}`)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No appointments found for this patient.</p>
            )}
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => {
                  alert('This would allow scheduling a new appointment.');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </button>
              
              <button
                onClick={() => setIsAppointmentsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // If still loading, show skeleton
  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Render modals when their state is active */}
      {isViewModalOpen && <PatientViewModal />}
      {isEditModalOpen && <PatientEditModal />}
      {isMedicalRecordsModalOpen && <PatientMedicalRecordsModal />}
      {isAppointmentsModalOpen && <PatientAppointmentsModal />}
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="inline-block mr-2 h-6 w-6 text-teal-500" />
            Patient Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage patient accounts, information, and access
          </p>
        </div>

        {/* Patient Statistics Dashboard */}
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Patients</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{patientStats.total}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Patients</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{patientStats.active}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{patientStats.newThisMonth}</p>
            </div>
          </div>
        </div>
        
        {/* Error message banner */}
        {error && (
          <div className="fixed top-4 right-4 z-50 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg" role="alert">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button size="sm" variant="outline" className="flex items-center" onClick={() => {
            console.log('Exporting patient data as CSV...');
            // In a real implementation, this would trigger CSV export functionality
            setError('CSV export functionality will be implemented soon.');
            setTimeout(() => setError(null), 3000);
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button 
            size="sm" 
            className="flex items-center bg-teal-600 hover:bg-teal-700"
            onClick={() => {
              console.log('Add Patient button clicked');
              // In a real implementation, this would open a form to add a new patient
              setError('Add Patient functionality will be implemented soon.');
              setTimeout(() => setError(null), 3000);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search patients by name, email, ID, or phone..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Button
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                variant="outline" 
                className="px-4 py-2 w-full justify-between"
              >
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-gray-400" />
                  <span>Status: {selectedStatus === 'all' ? 'All' : selectedStatus}</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </Button>
              {statusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                  {['all', 'active', 'inactive', 'pending', 'blocked'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status as PatientStatus | 'all');
                        setStatusDropdownOpen(false);
                      }}
                      className={`px-4 py-2 w-full text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedStatus === status ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : ''}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Patients List - Enhanced with backend integration */}
      <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-teal-50/50 dark:bg-gray-800/30 border-b border-teal-100 dark:border-gray-700">
                <th scope="col" className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider">Patient</span>
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider">Contact Info</span>
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider">Health Profile</span>
                </th>
                <th scope="col" className="px-4 py-2 text-left">
                  <span className="text-xs font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider">Activity & Metrics</span>
                </th>
                <th scope="col" className="px-4 py-2 text-right">
                  <span className="text-xs font-medium text-teal-500 dark:text-teal-400 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Users className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="font-medium mb-1">No patients found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-teal-50/30 dark:hover:bg-teal-900/5">
                    {/* Patient */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {/* Avatar with initials */}
                        <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3">
                          <span className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.name}
                            </h3>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            <span>ID: {patient.id}</span>
                            <span className="mx-1">•</span>
                            <span>{calculateAge(patient.dateOfBirth)}y</span>
                            <span className="mx-1">•</span>
                            <span>{patient.gender === 'male' ? 'M' : patient.gender === 'female' ? 'F' : 'O'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Contact Info */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-teal-400" />
                          <span className="truncate max-w-[180px]">{patient.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-teal-400" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Health Profile - Medical Conditions */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-700 dark:text-gray-300">Medical Conditions:</p>
                        <div className="mt-1">
                          {patient.medicalConditions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {patient.medicalConditions.map((condition, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400 italic">No conditions</span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* Activity & Metrics */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center justify-center rounded-md h-7 w-7 bg-teal-100 dark:bg-teal-900/20 mr-2">
                            <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">{patient.appointmentsThisMonth}</span>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">This Month</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex items-center justify-center rounded-md h-7 w-7 bg-gray-100 dark:bg-gray-800 mr-2">
                            <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">{patient.totalAppointments}</span>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Total</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center relative">
                        <div className="flex items-center mr-3">
                          {patient.lastAppointment && (
                            <span className="text-sm text-teal-600 dark:text-teal-400 mr-2 flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              <span>
                                {new Date(patient.lastAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </span>
                          )}
                          
                          {/* Status Toggle */}
                          <SimpleTooltip content={
                            isUpdating === patient.id
                              ? 'Updating status...'
                              : patient.status === 'active' || patient.status === 'inactive'
                                ? `Click to ${patient.status === 'active' ? 'deactivate' : 'activate'} account`
                                : `${patient.status.charAt(0).toUpperCase() + patient.status.slice(1)} Account`
                          }>
                            <div 
                              className={`${(patient.status === 'active' || patient.status === 'inactive') ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${isUpdating === patient.id ? 'animate-pulse' : ''}`}
                              onClick={() => {
                                if (isUpdating === null && (patient.status === 'active' || patient.status === 'inactive')) {
                                  togglePatientStatus(patient.id);
                                }
                              }}
                            >
                              {isUpdating === patient.id ? (
                                <span className="text-gray-400 dark:text-gray-500"><RefreshCw className="h-4 w-4 animate-spin" /></span>
                              ) : patient.status === 'active' ? (
                                <span className="text-teal-500 dark:text-teal-400"><Check className="h-4 w-4" /></span>
                              ) : patient.status === 'pending' ? (
                                <span className="text-blue-500 dark:text-blue-400"><Clock className="h-4 w-4" /></span>
                              ) : patient.status === 'inactive' ? (
                                <span className="text-amber-500 dark:text-amber-400"><AlertCircle className="h-4 w-4" /></span>
                              ) : (
                                <span className="text-red-500 dark:text-red-400"><X className="h-4 w-4" /></span>
                              )}
                            </div>
                          </SimpleTooltip>
                        </div>
                        
                        <div className="relative action-dropdown">
                          <Button
                            onClick={() => setActiveDropdown(activeDropdown === patient.id ? null : patient.id)}
                            variant="ghost" 
                            size="sm" 
                            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 group"
                          >
                            <span className="mr-1">Actions</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === patient.id ? 'transform rotate-180' : ''}`} />
                          </Button>
                          
                          {activeDropdown === patient.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-10">
                              <div className="py-1">
                                {[
                                  { id: 'view', label: 'View Profile', icon: <Users className="h-4 w-4 mr-2 text-teal-500" /> },
                                  { id: 'edit', label: 'Edit Details', icon: <Edit className="h-4 w-4 mr-2 text-amber-500" /> },
                                  { id: 'appointments', label: 'View Appointments', icon: <Calendar className="h-4 w-4 mr-2 text-teal-500" /> },
                                  { id: 'records', label: 'Medical Records', icon: <FileText className="h-4 w-4 mr-2 text-teal-500" /> },
                                ].map(action => (
                                  <button
                                    key={action.id}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
                                    onClick={() => {
                                      handlePatientAction(action.id, patient.id);
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination and Export Controls */}
        <div className="px-4 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-medium">{Math.min((pagination.currentPage - 1) * pagination.perPage + 1, pagination.totalItems)}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)}</span> of <span className="font-medium">{pagination.totalItems}</span> patients
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Export Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="text-teal-600 border-teal-200 hover:border-teal-300 dark:text-teal-400 dark:border-teal-900 flex items-center mr-4"
              onClick={exportPatientsToCSV}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(1)}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {generatePaginationButtons()}
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.totalPages)}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
