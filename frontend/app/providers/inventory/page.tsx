'use client';

import React, { useState, useEffect } from 'react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { 
  Search, 
  Filter, 
  Box, 
  ShoppingBag, 
  Package, 
  Plus, 
  ChevronDown, 
  AlertTriangle, 
  BarChart3, 
  ArrowDown, 
  ArrowUp,
  CheckCircle,
  Truck,
  Download,
  Printer,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  supplier: string;
  reorderLevel: number;
  location: string;
  lastRestock: Date;
  expirationDate?: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'discontinued';
  image?: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0
  });
  
  // Categories
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        // Generate fake inventory data
        const mockInventory: InventoryItem[] = [];
        
        const itemNames = [
          'Surgical Gloves (S)',
          'Surgical Gloves (M)',
          'Surgical Gloves (L)',
          'Disposable Syringes',
          'Bandages',
          'Antiseptic Solution',
          'Gauze Pads',
          'IV Fluid Bags',
          'Surgical Masks',
          'N95 Respirators',
          'Thermometer Strips',
          'Blood Pressure Cuffs',
          'Stethoscopes',
          'Pulse Oximeters',
          'Cotton Swabs',
          'Medical Tape',
          'Tongue Depressors',
          'Patient Gowns',
          'Examination Gloves',
          'Suture Kits'
        ];
        
        const categoryNames = [
          'Personal Protective Equipment',
          'Disposables',
          'Medical Devices',
          'Surgical Supplies',
          'Diagnostic Equipment',
          'First Aid Supplies'
        ];
        
        const suppliers = [
          'MedSupply Co.',
          'Healthcare Essentials',
          'Professional Medical',
          'ProHealth Systems',
          'MedTech Solutions'
        ];
        
        const locations = [
          'Storage Room A',
          'Storage Room B',
          'Cabinet 1',
          'Cabinet 2',
          'Supply Closet',
          'Examination Room 1',
          'Examination Room 2'
        ];
        
        const statuses: InventoryItem['status'][] = [
          'in-stock',
          'low-stock',
          'out-of-stock',
          'expired',
          'discontinued'
        ];
        
        // Generate 20 inventory items
        for (let i = 0; i < 20; i++) {
          const name = itemNames[i % itemNames.length];
          const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
          const quantity = Math.floor(Math.random() * 200);
          
          // Determine status based on quantity
          let status: InventoryItem['status'];
          if (quantity === 0) {
            status = 'out-of-stock';
          } else if (quantity < 10) {
            status = 'low-stock';
          } else if (Math.random() < 0.1) {
            status = 'expired';
          } else if (Math.random() < 0.05) {
            status = 'discontinued';
          } else {
            status = 'in-stock';
          }
          
          const lastRestock = new Date();
          lastRestock.setDate(lastRestock.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days
          
          let expirationDate: Date | undefined;
          if (Math.random() > 0.3) { // 70% items have expiration
            expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + Math.floor(Math.random() * 365)); // Random date within next year
          }
          
          mockInventory.push({
            id: `inv-${i}`,
            name,
            sku: `SKU-${100000 + i}`,
            category,
            quantity,
            unit: Math.random() > 0.5 ? 'box' : 'unit',
            price: parseFloat((Math.random() * 100 + 5).toFixed(2)),
            supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
            reorderLevel: Math.floor(Math.random() * 20) + 5,
            location: locations[Math.floor(Math.random() * locations.length)],
            lastRestock,
            expirationDate,
            status
          });
        }
        
        setInventory(mockInventory);
        
        // Extract all categories
        const uniqueCategories = Array.from(new Set(mockInventory.map(item => item.category)));
        setCategories(uniqueCategories);
        
        // Calculate statistics
        const stats = {
          totalItems: mockInventory.length,
          lowStock: mockInventory.filter(item => item.status === 'low-stock').length,
          outOfStock: mockInventory.filter(item => item.status === 'out-of-stock').length,
          expiringSoon: mockInventory.filter(item => {
            if (!item.expirationDate) return false;
            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);
            return item.expirationDate < thirtyDaysFromNow && item.expirationDate > today;
          }).length
        };
        setStatistics(stats);
        
        filterAndSortInventory(mockInventory, searchTerm, categoryFilter, statusFilter, sortField, sortDirection);
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    filterAndSortInventory(inventory, searchTerm, categoryFilter, statusFilter, sortField, sortDirection);
  }, [searchTerm, categoryFilter, statusFilter, sortField, sortDirection]);
  
  const filterAndSortInventory = (
    invList: InventoryItem[], 
    search: string, 
    category: string,
    status: string,
    sort: string,
    direction: 'asc' | 'desc'
  ) => {
    // Filter by search term
    let filtered = invList;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        item.supplier.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
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
        case 'quantity':
          compareA = a.quantity;
          compareB = b.quantity;
          break;
        case 'price':
          compareA = a.price;
          compareB = b.price;
          break;
        case 'lastRestock':
          compareA = a.lastRestock.getTime();
          compareB = b.lastRestock.getTime();
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
    
    setFilteredInventory(filtered);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusBadgeColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300';
      case 'low-stock':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'expired':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'low-stock':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'out-of-stock':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'discontinued':
        return <Trash2 className="h-4 w-4 mr-1" />;
      default:
        return <Package className="h-4 w-4 mr-1" />;
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
        
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-16"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor and manage your medical supplies and equipment
          </p>
        </div>
        <div>
          <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Inventory Item
          </button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-teal-100 dark:bg-teal-900/20">
              <Package className="h-6 w-6 text-teal-700 dark:text-teal-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Items</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalItems}</h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-amber-100 dark:bg-amber-900/20">
              <AlertTriangle className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.lowStock}</h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-red-100 dark:bg-red-900/20">
              <ShoppingBag className="h-6 w-6 text-red-700 dark:text-red-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Out of Stock</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.outOfStock}</h3>
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/20">
              <AlertTriangle className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiring Soon</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.expiringSoon}</h3>
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
              placeholder="Search by name, SKU, or supplier..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0 w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Category:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 w-full md:w-auto"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Status:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 w-full md:w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="expired">Expired</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>
      </AnimatedCard>
      
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export Inventory
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
        <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <BarChart3 className="h-4 w-4 mr-2" />
          Usage Analytics
        </button>
      </div>
      
      {/* Inventory Table */}
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
                    Item Name
                    {sortField === 'name' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('quantity')}
                >
                  <div className="flex items-center">
                    Quantity
                    {sortField === 'quantity' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {sortField === 'price' && (
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
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className={`${showDetails === item.id ? 'bg-gray-50 dark:bg-gray-750' : 'hover:bg-gray-50 dark:hover:bg-gray-750'} transition-colors`}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Package className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.supplier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.sku}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {item.quantity} {item.unit}
                          </div>
                          {item.quantity <= item.reorderLevel && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Reorder needed
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(item.price)} / {item.unit}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
                            <FileText className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                            onClick={() => setShowDetails(showDetails === item.id ? null : item.id)}
                          >
                            <ChevronDown className={`h-4 w-4 transition-transform ${showDetails === item.id ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Details Expandable Row */}
                    {showDetails === item.id && (
                      <tr className="bg-gray-50 dark:bg-gray-750">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="py-2">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Item Details</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Supplier</p>
                                <p className="text-sm text-gray-900 dark:text-white">{item.supplier}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                                <p className="text-sm text-gray-900 dark:text-white">{item.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reorder Level</p>
                                <p className="text-sm text-gray-900 dark:text-white">{item.reorderLevel} {item.unit}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Restocked</p>
                                <p className="text-sm text-gray-900 dark:text-white">{formatDate(item.lastRestock)}</p>
                              </div>
                              {item.expirationDate && (
                                <div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expiration Date</p>
                                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(item.expirationDate)}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
                                <p className="text-sm text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end space-x-3">
                              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Item
                              </button>
                              <button className="flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Truck className="h-4 w-4 mr-2" />
                                Order More
                              </button>
                              <button className="flex items-center px-3 py-1.5 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Stock
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
                    <Box className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Inventory Items Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'No items match your current filters.'
                        : 'No inventory items found. Add some items to your inventory.'}
                    </p>
                    <button
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Add Inventory Item
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