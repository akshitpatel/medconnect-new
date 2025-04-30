'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Building,
  Edit,
  Trash2,
  Star,
  MapPin,
  PhoneCall,
  Mail,
  Check,
  X,
  Shield,
  Stethoscope,
  Pill,
  TestTube,
  ExternalLink,
  CalendarClock,
  FileText,
  Clock,
  RefreshCw,
  Download,
  ShieldCheck,
  UserPlus,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { adminAPI } from '@/app/services/api';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Avatar } from '@/app/components/ui/Avatar';

type ProviderType = 'doctor' | 'hospital' | 'pharmacy' | 'lab' | 'diagnostic' | 'imaging' | 'insurance' | 'homeservice';
type ProviderStatus = 'active' | 'pending' | 'suspended' | 'inactive';

interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  specialty?: string;
  location: string;
  rating: number;
  contactEmail: string;
  contactPhone: string;
  status: ProviderStatus;
  verified: boolean;
  createdAt: Date;
  photo?: string;
  services?: string[];
}

interface ProviderStats {
  total: number;
  active: number;
  verified: number;
  byType: {
    doctor: number;
    pharmacy: number;
    lab: number;
  }
}

export default function ProviderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ProviderType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProviderStatus | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [providerList, setProviderList] = useState<Provider[]>([]);
  const [providerStats, setProviderStats] = useState<ProviderStats | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  useEffect(() => {
    // Fetch providers from API
    const fetchProviders = async () => {
      setLoading(true);
      try {
        console.log('Fetching providers from backend API...');
        const response = await adminAPI.getProviders({
          verified: verifiedFilter === 'verified' ? true : verifiedFilter === 'unverified' ? false : undefined,
          // Translate the status filter to what the API expects
          status: statusFilter === 'all' ? undefined : statusFilter,
          provider_type: typeFilter === 'all' ? undefined : typeFilter
        });

        console.log('Successfully retrieved providers data');
        
        if (response?.data?.data?.providers) {
          // Format providers from API to match our Provider interface
          const formattedProviders = response.data.data.providers.map((apiProvider: any) => ({
            id: apiProvider.id,
            name: apiProvider.name,
            type: apiProvider.type || apiProvider.provider_type || 'doctor',
            specialty: apiProvider.specialty,
            location: apiProvider.location || apiProvider.address || '',
            rating: apiProvider.rating || 4.0,
            contactEmail: apiProvider.contact_email || apiProvider.email || '',
            contactPhone: apiProvider.contact_phone || apiProvider.phone || '',
            status: apiProvider.status || 'active',
            verified: apiProvider.verified || false,
            createdAt: apiProvider.created_at ? new Date(apiProvider.created_at) : new Date(),
            photo: apiProvider.photo,
            services: apiProvider.services || []
          }));
          
          setProviderList(formattedProviders);
          
          // Calculate stats from the providers
          const stats: ProviderStats = {
            total: formattedProviders.length,
            active: formattedProviders.filter((p: Provider) => p.status === 'active').length,
            verified: formattedProviders.filter((p: Provider) => p.verified).length,
            byType: {
              doctor: formattedProviders.filter((p: Provider) => p.type === 'doctor').length,
              pharmacy: formattedProviders.filter((p: Provider) => p.type === 'pharmacy').length,
              lab: formattedProviders.filter((p: Provider) => p.type === 'lab').length
            }
          };
          
          setProviderStats(stats);
        } else {
          console.warn('No providers returned from API, using empty array');
          setProviderList([]);
          setProviderStats({
            total: 0,
            active: 0,
            verified: 0,
            byType: {
              doctor: 0,
              pharmacy: 0,
              lab: 0
            }
          });
        }
      } catch (err) {
        console.error('Failed to fetch providers:', err);
        // Fallback to empty arrays if API fails
        setProviderList([]);
        setProviderStats({
          total: 0,
          active: 0,
          verified: 0,
          byType: {
            doctor: 0,
            pharmacy: 0,
            lab: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProviders();
    
    // Set up refresh interval (5 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Refreshing providers data...');
      fetchProviders();
    }, 5 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(refreshInterval);
  }, [typeFilter, statusFilter, verifiedFilter]); // Re-fetch when filters change

  // Toggle provider dropdown
  const toggleDropdown = (providerId: string) => {
    if (activeDropdown === providerId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(providerId);
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Sort providers
  const sortedProviders = [...providerList].sort((a, b) => {
    let compareResult = 0;
    
    switch (sortBy) {
      case 'name':
        compareResult = a.name.localeCompare(b.name);
        break;
      case 'type':
        compareResult = a.type.localeCompare(b.type);
        break;
      case 'location':
        compareResult = a.location.localeCompare(b.location);
        break;
      case 'rating':
        compareResult = a.rating - b.rating;
        break;
      case 'status':
        compareResult = a.status.localeCompare(b.status);
        break;
      case 'createdAt':
        compareResult = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      default:
        compareResult = 0;
    }
    
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });
  
  // Filter providers
  const filteredProviders = sortedProviders.filter((provider) => {
    const matchesSearch =
      searchQuery === '' ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider.specialty && provider.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || provider.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || provider.status === statusFilter;
    const matchesVerified = 
      verifiedFilter === 'all' || 
      (verifiedFilter === 'verified' && provider.verified) ||
      (verifiedFilter === 'unverified' && !provider.verified);
    
    const matchesTab = 
      selectedTab === 'all' || 
      (selectedTab === 'doctors' && provider.type === 'doctor') || 
      (selectedTab === 'hospitals' && provider.type === 'hospital') ||
      (selectedTab === 'pharmacies' && provider.type === 'pharmacy') || 
      (selectedTab === 'labs' && provider.type === 'lab') ||
      (selectedTab === 'diagnostic' && provider.type === 'diagnostic') ||
      (selectedTab === 'imaging' && provider.type === 'imaging') ||
      (selectedTab === 'insurance' && provider.type === 'insurance') ||
      (selectedTab === 'homeservice' && provider.type === 'homeservice');
    
    return matchesSearch && matchesType && matchesStatus && matchesVerified && matchesTab;
  });
  
  // Render stars for ratings
  const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < fullStars 
                ? 'text-yellow-400 fill-yellow-400' 
                : i === fullStars && hasHalfStar 
                ? 'text-yellow-400 fill-yellow-400 half-star' 
                : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  const ProviderTypeBadge = ({ type }: { type: ProviderType }) => {
    const typeData: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      doctor: {
        label: 'Doctor',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: <Stethoscope className="h-3 w-3 mr-1" />
      },
      hospital: {
        label: 'Hospital',
        className: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: <Building className="h-3 w-3 mr-1" />
      },
      pharmacy: {
        label: 'Pharmacy',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <Pill className="h-3 w-3 mr-1" />
      },
      lab: {
        label: 'Lab',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <TestTube className="h-3 w-3 mr-1" />
      },
      diagnostic: {
        label: 'Diagnostic',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: <TestTube className="h-3 w-3 mr-1" />
      },
      imaging: {
        label: 'Imaging',
        className: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: <TestTube className="h-3 w-3 mr-1" />
      },
      insurance: {
        label: 'Insurance',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: <Shield className="h-3 w-3 mr-1" />
      },
      homeservice: {
        label: 'Home Service',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: <Users className="h-3 w-3 mr-1" />
      }
    };
    
    return (
      <Badge variant="outline" className={typeData[type].className}>
        {typeData[type].icon}
        {typeData[type].label}
      </Badge>
    );
  };
  
  const StatusBadge = ({ status }: { status: ProviderStatus }) => {
    const statusData = {
      active: {
        label: 'Active',
        className: 'bg-green-50 text-green-700 border-green-200',
        icon: <Check className="h-3 w-3 mr-1" />
      },
      inactive: {
        label: 'Inactive',
        className: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      pending: {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      suspended: {
        label: 'Suspended',
        className: 'bg-red-50 text-red-700 border-red-200',
        icon: <X className="h-3 w-3 mr-1" />
      }
    };
    
    return (
      <Badge variant="outline" className={statusData[status].className}>
        {statusData[status].icon}
        {statusData[status].label}
      </Badge>
    );
  };
  
  const VerificationBadge = ({ verified }: { verified: boolean }) => {
    return verified ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        <Shield className="h-3 w-3 mr-1" />
        Unverified
      </Badge>
    );
  };
  
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Building className="mr-3 h-8 w-8 text-blue-500" />
          Provider Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage healthcare providers, pharmacies, and labs
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerStats?.total || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-500" />
              {providerStats?.active || 0} active providers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerStats?.verified || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {providerStats ? Math.round((providerStats.verified / providerStats.total) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Healthcare Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerStats?.byType.doctor || 0}</div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{providerStats?.byType.pharmacy || 0} Pharmacies</span>
              <span>{providerStats?.byType.lab || 0} Labs</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Provider Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providerList.length > 0 
                ? (providerList.reduce((acc, p) => acc + p.rating, 0) / providerList.length).toFixed(1) 
                : '0.0'}
            </div>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Add New Provider
        </Button>
      </div>
      
      {/* Tabs and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setSelectedTab('all')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'all' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                All Providers
              </button>
              <button 
                onClick={() => setSelectedTab('doctors')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'doctors' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Doctors
              </button>
              <button 
                onClick={() => setSelectedTab('pharmacies')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'pharmacies' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Pharmacies
              </button>
              <button 
                onClick={() => setSelectedTab('labs')} 
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === 'labs' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Labs
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search providers..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Type Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(prev => !prev)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Type: {typeFilter === 'all' ? 'All' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                {showFilters && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => { setTypeFilter('all'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        typeFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => { setTypeFilter('doctor'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        typeFilter === 'doctor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Doctor
                    </div>
                    <div
                      onClick={() => { setTypeFilter('pharmacy'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        typeFilter === 'pharmacy' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Pharmacy
                    </div>
                    <div
                      onClick={() => { setTypeFilter('lab'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        typeFilter === 'lab' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Lab
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(prev => !prev)}
                  className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
                {showFilters && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-300 dark:border-gray-600 py-1">
                    <div
                      onClick={() => { setStatusFilter('all'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      All
                    </div>
                    <div
                      onClick={() => { setStatusFilter('active'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'active' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Active
                    </div>
                    <div
                      onClick={() => { setStatusFilter('inactive'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'inactive' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Inactive
                    </div>
                    <div
                      onClick={() => { setStatusFilter('pending'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Pending
                    </div>
                    <div
                      onClick={() => { setStatusFilter('suspended'); setShowFilters(false); }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        statusFilter === 'suspended' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      Suspended
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Providers List */}
      <Card>
        <CardHeader>
          <CardTitle>Providers ({filteredProviders.length})</CardTitle>
          <CardDescription>
            {selectedTab === 'all' ? 'All healthcare providers' : 
             selectedTab === 'doctors' ? 'Doctor providers' :
             selectedTab === 'pharmacies' ? 'Pharmacy providers' : 'Laboratory providers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProviders.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No providers found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10 mt-1">
                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-800 rounded-full">
                          {provider.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mr-2">
                            {provider.name}
                          </h3>
                          {provider.verified && (
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <ProviderTypeBadge type={provider.type} />
                          <StatusBadge status={provider.status} />
                          {provider.specialty && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {provider.specialty}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {provider.location}
                          </div>
                          <div className="mt-1">
                            <RatingStars rating={provider.rating} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-right">
                        <div className="flex items-center justify-end">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {provider.contactEmail}
                        </div>
                        <div className="flex items-center justify-end mt-1">
                          <PhoneCall className="h-4 w-4 mr-1 text-gray-400" />
                          {provider.contactPhone}
                        </div>
                        <div className="mt-1">Since {formatDate(provider.createdAt)}</div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className="text-gray-700 dark:text-gray-300">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {!provider.verified ? (
                          <Button variant="outline" size="sm" className="text-blue-600 dark:text-blue-400">
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        ) : null}
                        {provider.status === 'active' ? (
                          <Button variant="outline" size="sm" className="text-amber-600 dark:text-amber-400">
                            <X className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="text-green-600 dark:text-green-400">
                            <Check className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {provider.services && provider.services.length > 0 && (
                    <div className="mt-4 ml-14">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.services.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredProviders.length} of {providerList.length} providers
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 