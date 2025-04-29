'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Pill,
  Syringe,
  Droplet,
  Package,
  FileText,
  RefreshCw, 
  Download,
  ArrowUpDown,
  Clock,
  Printer,
  BarChart3,
  ListFilter
} from 'lucide-react';
import Link from 'next/link';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

type MedicationType = 'pill' | 'syrup' | 'injection' | 'topical' | 'other';
type MedicationStatus = 'active' | 'archived' | 'restricted' | 'under-review';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  type: MedicationType;
  manufacturer: string;
  status: MedicationStatus;
  prescriptionRequired: boolean;
  created: Date;
  updated: Date;
  formulation?: string;
  interactions?: string[];
  sideEffects?: string[];
}

interface MedicationStats {
  total: number;
  active: number;
  restricted: number;
  underReview: number;
  byType: {
    pill: number;
    syrup: number;
    injection: number;
    topical: number;
    other: number;
  };
  prescriptionRequired: number;
}

export default function MedicationManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [medicationStats, setMedicationStats] = useState<MedicationStats>({
    total: 0,
    active: 0,
    restricted: 0,
    underReview: 0,
    byType: {
      pill: 0,
      syrup: 0,
      injection: 0,
      topical: 0,
      other: 0
    },
    prescriptionRequired: 0
  });

  // Mock data
  const medications: Medication[] = [
    {
      id: 'med1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      type: 'pill',
      manufacturer: 'Pfizer',
      status: 'active',
      prescriptionRequired: true,
      created: new Date(2023, 1, 10),
      updated: new Date(2023, 4, 15),
      formulation: '10mg, 20mg tablets',
      interactions: ['Potassium supplements', 'Diuretics', 'NSAIDs'],
      sideEffects: ['Dry cough', 'Dizziness', 'Headache'],
    },
    {
      id: 'med2',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      type: 'pill',
      manufacturer: 'GlaxoSmithKline',
      status: 'active',
      prescriptionRequired: true,
      created: new Date(2022, 6, 5),
      updated: new Date(2023, 3, 20),
      formulation: '250mg, 500mg capsules',
      interactions: ['Allopurinol', 'Probenecid', 'Oral contraceptives'],
      sideEffects: ['Diarrhea', 'Rash', 'Nausea'],
    },
    {
      id: 'med3',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      type: 'pill',
      manufacturer: 'Johnson & Johnson',
      status: 'active',
      prescriptionRequired: false,
      created: new Date(2022, 3, 15),
      updated: new Date(2023, 1, 10),
      formulation: '200mg, 400mg, 600mg tablets',
      interactions: ['Aspirin', 'Blood thinners', 'ACE inhibitors'],
      sideEffects: ['Stomach pain', 'Heartburn', 'Dizziness'],
    },
    {
      id: 'med4',
      name: 'Insulin Glargine',
      genericName: 'Insulin Glargine',
      type: 'injection',
      manufacturer: 'Sanofi',
      status: 'active',
      prescriptionRequired: true,
      created: new Date(2022, 8, 22),
      updated: new Date(2023, 2, 8),
      formulation: '100 units/mL injectable solution',
      interactions: ['Beta-blockers', 'Alcohol', 'Corticosteroids'],
      sideEffects: ['Hypoglycemia', 'Injection site reactions', 'Weight gain'],
    },
    {
      id: 'med5',
      name: 'Hydrocortisone Cream',
      genericName: 'Hydrocortisone',
      type: 'topical',
      manufacturer: 'Novartis',
      status: 'active',
      prescriptionRequired: false,
      created: new Date(2022, 11, 3),
      updated: new Date(2023, 3, 12),
      formulation: '1% cream, ointment',
      interactions: ['Local antibiotics'],
      sideEffects: ['Skin irritation', 'Thinning of skin', 'Acne'],
    },
    {
      id: 'med6',
      name: 'OxyContin',
      genericName: 'Oxycodone HCl',
      type: 'pill',
      manufacturer: 'Purdue Pharma',
      status: 'restricted',
      prescriptionRequired: true,
      created: new Date(2021, 5, 18),
      updated: new Date(2023, 0, 25),
      formulation: '10mg, 20mg, 40mg controlled-release tablets',
      interactions: ['CNS depressants', 'MAO inhibitors', 'Alcohol'],
      sideEffects: ['Respiratory depression', 'Constipation', 'Drowsiness'],
    },
    {
      id: 'med7',
      name: 'Proair HFA',
      genericName: 'Albuterol Sulfate',
      type: 'other',
      manufacturer: 'Teva Pharmaceuticals',
      status: 'active',
      prescriptionRequired: true,
      created: new Date(2022, 2, 10),
      updated: new Date(2023, 2, 15),
      formulation: 'Inhalation aerosol, 90 mcg/actuation',
      interactions: ['Beta-blockers', 'Diuretics', 'Digoxin'],
      sideEffects: ['Tremor', 'Nervousness', 'Headache'],
    },
    {
      id: 'med8',
      name: 'New Experimental Drug',
      genericName: 'Research Compound ABC',
      type: 'pill',
      manufacturer: 'Research Pharmaceuticals',
      status: 'under-review',
      prescriptionRequired: true,
      created: new Date(2023, 3, 5),
      updated: new Date(2023, 4, 10),
      formulation: '50mg tablets',
      interactions: ['Unknown - under investigation'],
      sideEffects: ['Under investigation'],
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Calculate medication statistics
      const stats: MedicationStats = {
        total: medications.length,
        active: medications.filter(m => m.status === 'active').length,
        restricted: medications.filter(m => m.status === 'restricted').length,
        underReview: medications.filter(m => m.status === 'under-review').length,
        byType: {
          pill: medications.filter(m => m.type === 'pill').length,
          syrup: medications.filter(m => m.type === 'syrup').length,
          injection: medications.filter(m => m.type === 'injection').length,
          topical: medications.filter(m => m.type === 'topical').length,
          other: medications.filter(m => m.type === 'other').length
        },
        prescriptionRequired: medications.filter(m => m.prescriptionRequired).length
      };
      
      setMedicationStats(stats);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter medications based on current filters
  const filteredMedications = medications.filter((medication) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type
    const matchesType = typeFilter === 'all' || medication.type === typeFilter;

    // Filter by status
    const matchesStatus = statusFilter === 'all' || medication.status === statusFilter;

    // Filter by prescription requirement
    const matchesPrescription =
      prescriptionFilter === 'all' ||
      (prescriptionFilter === 'required' && medication.prescriptionRequired) ||
      (prescriptionFilter === 'not-required' && !medication.prescriptionRequired);

    return matchesSearch && matchesType && matchesStatus && matchesPrescription;
  });

  // Sort medications based on current sort settings
  const sortedMedications = [...filteredMedications].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'genericName':
        comparison = a.genericName.localeCompare(b.genericName);
        break;
      case 'manufacturer':
        comparison = a.manufacturer.localeCompare(b.manufacturer);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'created':
        comparison = a.created.getTime() - b.created.getTime();
        break;
      case 'updated':
        comparison = a.updated.getTime() - b.updated.getTime();
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleDropdown = (medicationId: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [medicationId]: !prev[medicationId],
    }));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medication Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <AnimatedCard key={i} className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </AnimatedCard>
          ))}
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    );
  }

  // Type badge component
  const TypeBadge = ({ type }: { type: MedicationType }) => {
    const typeConfig: {
      [key in MedicationType]: { icon: React.ReactNode; bgColor: string; textColor: string; label: string };
    } = {
      'pill': {
        icon: <Pill className="h-3 w-3 mr-1" />,
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-800 dark:text-blue-300',
        label: 'Pill',
      },
      'syrup': {
        icon: <Droplet className="h-3 w-3 mr-1" />,
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        textColor: 'text-purple-800 dark:text-purple-300',
        label: 'Syrup',
      },
      'injection': {
        icon: <Syringe className="h-3 w-3 mr-1" />,
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        label: 'Injection',
      },
      'topical': {
        icon: <Droplet className="h-3 w-3 mr-1" />,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        label: 'Topical',
      },
      'other': {
        icon: <Package className="h-3 w-3 mr-1" />,
        bgColor: 'bg-gray-100 dark:bg-gray-900/20',
        textColor: 'text-gray-800 dark:text-gray-300',
        label: 'Other',
      },
    };

    const config = typeConfig[type];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: MedicationStatus }) => {
    const statusConfig: {
      [key in MedicationStatus]: { bgColor: string; textColor: string; icon: React.ReactNode; label: string };
    } = {
      'active': {
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-800 dark:text-green-300',
        icon: <Pill className="h-3 w-3 mr-1" />,
        label: 'Active',
      },
      'archived': {
        bgColor: 'bg-gray-100 dark:bg-gray-900/20',
        textColor: 'text-gray-800 dark:text-gray-300',
        icon: <Package className="h-3 w-3 mr-1" />,
        label: 'Archived',
      },
      'restricted': {
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        textColor: 'text-red-800 dark:text-red-300',
        icon: <ShieldAlert className="h-3 w-3 mr-1" />,
        label: 'Restricted',
      },
      'under-review': {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        label: 'Under Review',
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Prescription Required badge
  const PrescriptionBadge = ({ required }: { required: boolean }) => {
    return required ? (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
      >
        <ShieldAlert className="h-3 w-3 mr-1" />
        Rx Required
      </span>
    ) : (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
      >
        OTC
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Pill className="h-6 w-6 mr-2 text-blue-500" />
            Medication Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage medications, formulations, and restrictions
          </p>
        </div>
        <Link href="/admin/medications/new">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Medications</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{medicationStats.total}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Pill className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">View All</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Medications</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{medicationStats.active}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Package className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-green-500 dark:text-green-400 font-medium">{Math.round((medicationStats.active / medicationStats.total) * 100)}% </span>
            <span className="ml-1">of total medications</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Restricted</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{medicationStats.restricted}</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>Requires special authorization</span>
          </div>
        </AnimatedCard>

        <AnimatedCard className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescription Required</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{medicationStats.prescriptionRequired}</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-purple-500 dark:text-purple-400 font-medium">{Math.round((medicationStats.prescriptionRequired / medicationStats.total) * 100)}% </span>
            <span className="ml-1">of total medications</span>
          </div>
        </AnimatedCard>
      </div>

      {/* Quick Actions */}
      <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Actions</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/medications/import">
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Download className="h-3 w-3 mr-1" />
              Import Medications
            </button>
          </Link>
          <Link href="/admin/medications/export">
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Download className="h-3 w-3 mr-1" />
              Export Catalog
            </button>
          </Link>
          <Link href="/admin/medications/print">
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Printer className="h-3 w-3 mr-1" />
              Print Formulary
            </button>
          </Link>
          <Link href="/admin/medications/analytics">
            <button className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <BarChart3 className="h-3 w-3 mr-1" />
              Usage Analytics
            </button>
          </Link>
          <button 
            className="flex items-center px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 800);
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Data
          </button>
        </div>
      </AnimatedCard>

      {/* Medication Categories */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-4">
            <Pill className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Pills</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medicationStats.byType.pill}</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center">
          <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg mr-4">
            <Droplet className="h-5 w-5 text-teal-500 dark:text-teal-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Syrups</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medicationStats.byType.syrup}</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-4">
            <Syringe className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Injections</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medicationStats.byType.injection}</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg mr-4">
            <Droplet className="h-5 w-5 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Topical</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medicationStats.byType.topical}</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex items-center">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">
            <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Others</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{medicationStats.byType.other}</p>
          </div>
        </AnimatedCard>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search medications by name, generic name, or manufacturer..."
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={() => handleSort('name')}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="pill">Pills</option>
                <option value="syrup">Syrups</option>
                <option value="injection">Injections</option>
                <option value="topical">Topical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="restricted">Restricted</option>
                <option value="under-review">Under Review</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prescription</label>
              <select
                value={prescriptionFilter}
                onChange={(e) => setPrescriptionFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="required">Prescription Required</option>
                <option value="not-required">No Prescription Required</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Medications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Medication
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Generic Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Manufacturer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Status & Prescription
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedMedications.length > 0 ? (
                sortedMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Pill className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {medication.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {medication.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {medication.genericName}
                      </div>
                      {medication.formulation && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {medication.formulation}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeBadge type={medication.type} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {medication.manufacturer}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <StatusBadge status={medication.status} />
                        <PrescriptionBadge required={medication.prescriptionRequired} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(medication.updated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(medication.id)}
                          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        {dropdownOpen[medication.id] && (
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                            onClick={() => toggleDropdown(medication.id)}
                          >
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                            >
                              <Link
                                href={`/admin/medications/edit/${medication.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                              >
                                <Edit className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                Edit
                              </Link>
                              <Link
                                href={`/admin/medications/view/${medication.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                              >
                                <FileText className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                View Details
                              </Link>
                              {medication.status !== 'archived' && (
                                <button
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  role="menuitem"
                                >
                                  <Package className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  Archive
                                </button>
                              )}
                              {medication.status === 'active' && medication.prescriptionRequired && (
                                <button
                                  className="w-full flex items-center px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  role="menuitem"
                                >
                                  <ShieldAlert className="mr-3 h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                                  Mark Restricted
                                </button>
                              )}
                              <button
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                              >
                                <Trash2 className="mr-3 h-4 w-4 text-red-500 dark:text-red-400" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No medications found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 