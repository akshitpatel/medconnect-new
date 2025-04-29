'use client';

import React, { useState } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';
import Tabs from '@/app/components/ui/Tabs';
import { 
  CreditCard, 
  FileText, 
  DollarSign, 
  Calendar, 
  Check, 
  AlertCircle, 
  Clock,
  Download,
  Filter,
  ChevronRight,
  Building,
  Shield
} from 'lucide-react';

interface InsurancePlan {
  id: string;
  provider: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  type: 'primary' | 'secondary' | 'dental' | 'vision';
  coverageStart: string;
  coverageEnd: string;
  contactPhone: string;
  logoUrl: string;
}

interface Claim {
  id: string;
  serviceDate: string;
  provider: string;
  description: string;
  chargedAmount: number;
  coveredAmount: number;
  patientResponsibility: number;
  status: 'pending' | 'processed' | 'denied' | 'approved' | 'paid';
  claimNumber: string;
  filingDate: string;
}

interface Bill {
  id: string;
  provider: string;
  serviceDate: string;
  dueDate: string;
  amount: number;
  description: string;
  status: 'paid' | 'unpaid' | 'overdue' | 'processing';
  paidDate?: string;
  paymentMethod?: string;
  invoiceNumber: string;
}

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([
    {
      id: '1',
      provider: 'Blue Cross Blue Shield',
      planName: 'PPO Family Plan',
      memberId: 'XYZ12345678',
      groupNumber: 'G9876543',
      type: 'primary',
      coverageStart: '2023-01-01',
      coverageEnd: '2023-12-31',
      contactPhone: '1-800-123-4567',
      logoUrl: '/images/bcbs-logo.png'
    },
    {
      id: '2',
      provider: 'Delta Dental',
      planName: 'Comprehensive Dental',
      memberId: 'DEN98765432',
      groupNumber: 'GD123456',
      type: 'dental',
      coverageStart: '2023-01-01',
      coverageEnd: '2023-12-31',
      contactPhone: '1-888-555-1234',
      logoUrl: '/images/delta-dental-logo.png'
    },
    {
      id: '3',
      provider: 'VSP Vision Care',
      planName: 'Vision Plus',
      memberId: 'VSP87654321',
      groupNumber: 'GV654321',
      type: 'vision',
      coverageStart: '2023-01-01',
      coverageEnd: '2023-12-31',
      contactPhone: '1-877-456-7890',
      logoUrl: '/images/vsp-logo.png'
    }
  ]);

  const [claims, setClaims] = useState<Claim[]>([
    {
      id: '1',
      serviceDate: '2023-03-15',
      provider: 'Dr. John Smith',
      description: 'Annual Physical Examination',
      chargedAmount: 350.00,
      coveredAmount: 350.00,
      patientResponsibility: 0.00,
      status: 'paid',
      claimNumber: 'CLM12345678',
      filingDate: '2023-03-16'
    },
    {
      id: '2',
      serviceDate: '2023-04-10',
      provider: 'City Hospital',
      description: 'MRI - Lower Back',
      chargedAmount: 1200.00,
      coveredAmount: 960.00,
      patientResponsibility: 240.00,
      status: 'processed',
      claimNumber: 'CLM23456789',
      filingDate: '2023-04-12'
    },
    {
      id: '3',
      serviceDate: '2023-05-05',
      provider: 'Dr. Lisa Johnson',
      description: 'Specialist Consultation',
      chargedAmount: 275.00,
      coveredAmount: 220.00,
      patientResponsibility: 55.00,
      status: 'pending',
      claimNumber: 'CLM34567890',
      filingDate: '2023-05-06'
    }
  ]);

  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      provider: 'City Hospital',
      serviceDate: '2023-04-10',
      dueDate: '2023-06-10',
      amount: 240.00,
      description: 'MRI - Lower Back',
      status: 'unpaid',
      invoiceNumber: 'INV87654321'
    },
    {
      id: '2',
      provider: 'Dr. Lisa Johnson',
      serviceDate: '2023-05-05',
      dueDate: '2023-07-05',
      amount: 55.00,
      description: 'Specialist Consultation',
      status: 'unpaid',
      invoiceNumber: 'INV76543210'
    },
    {
      id: '3',
      provider: 'Lakeside Pharmacy',
      serviceDate: '2023-05-10',
      dueDate: '2023-06-01',
      amount: 35.00,
      description: 'Prescription Medication',
      status: 'paid',
      paidDate: '2023-05-15',
      paymentMethod: 'Credit Card',
      invoiceNumber: 'INV65432109'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'approved':
        return 'text-green-500';
      case 'pending':
      case 'processing':
        return 'text-yellow-500';
      case 'denied':
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'approved':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'denied':
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <h3 className="text-md font-medium">Insurance Status</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-teal-500 mr-3" />
              <div>
                <div className="text-lg font-semibold">3 Active Plans</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Coverage until Dec 31, 2023</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <h3 className="text-md font-medium">Pending Bills</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <div className="text-lg font-semibold">{formatCurrency(295.00)}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2 unpaid bills</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <h3 className="text-md font-medium">Next Payment Due</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="text-lg font-semibold">June 1, 2023</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">15 days remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Claims</h2>
      <div className="space-y-4">
        {claims.slice(0, 2).map(claim => (
          <motion.div
            key={claim.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-medium">{claim.description}</h3>
                      <span className={`ml-2 text-sm font-medium ${getStatusColor(claim.status)}`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {claim.provider} • {new Date(claim.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{formatCurrency(claim.patientResponsibility)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      of {formatCurrency(claim.chargedAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        <div className="text-center">
          <button className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium text-sm flex items-center mx-auto">
            View all claims <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">Upcoming Bills</h2>
      <div className="space-y-4">
        {bills.filter(bill => bill.status === 'unpaid').map(bill => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{bill.description}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bill.provider} • Due {new Date(bill.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{formatCurrency(bill.amount)}</div>
                    <button className="mt-1 px-3 py-1 bg-teal-500 text-white text-sm rounded-md hover:bg-teal-600 transition-colors">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderInsuranceTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Your Insurance Plans</h2>
      <div className="space-y-6">
        {insurancePlans.map(plan => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                    <Building className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{plan.provider}</h3>
                        <p className="text-md text-gray-600 dark:text-gray-300">{plan.planName}</p>
                      </div>
                      <div className="px-3 py-1 bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 text-sm rounded-full">
                        {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member ID</p>
                        <p className="text-md font-medium">{plan.memberId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Group Number</p>
                        <p className="text-md font-medium">{plan.groupNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Coverage Period</p>
                        <p className="text-md font-medium">
                          {new Date(plan.coverageStart).toLocaleDateString()} - {new Date(plan.coverageEnd).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                        <p className="text-md font-medium">{plan.contactPhone}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <button 
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium"
                      >
                        View Benefits
                      </button>
                      <button 
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" /> Download Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderClaimsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Claims History</h2>
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
          <Filter className="h-4 w-4 mr-1" /> Filter Claims
        </button>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date of Service
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Charged
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Covered
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Your Cost
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {claims.map(claim => (
              <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(claim.serviceDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {claim.provider}
                </td>
                <td className="px-6 py-4 text-sm">
                  {claim.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(claim.chargedAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatCurrency(claim.coveredAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {formatCurrency(claim.patientResponsibility)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {getStatusIcon(claim.status)}
                    <span className={`ml-1.5 ${getStatusColor(claim.status)}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Billing & Payments</h2>
        <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm flex items-center">
          <CreditCard className="h-4 w-4 mr-2" /> Manage Payment Methods
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium">Payment Summary</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Bills</span>
                <span className="font-semibold">{formatCurrency(330.00)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Paid</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(35.00)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Pending</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{formatCurrency(295.00)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="text-lg font-semibold">Next Payment Due</span>
                <span className="text-lg font-semibold">{formatCurrency(240.00)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <h3 className="text-lg font-medium">Quick Pay</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Bill to Pay</label>
                <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option value="">City Hospital - MRI ($240.00)</option>
                  <option value="">Dr. Lisa Johnson - Consultation ($55.00)</option>
                  <option value="">Pay All Outstanding Bills ($295.00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600">
                  <option value="">Visa ending in 4242</option>
                  <option value="">Mastercard ending in 5555</option>
                  <option value="">Add New Payment Method</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
                Pay Now
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Recent Bills</h3>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {bills.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(bill.serviceDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {bill.provider}
                </td>
                <td className="px-6 py-4 text-sm">
                  {bill.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {formatCurrency(bill.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(bill.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {getStatusIcon(bill.status)}
                    <span className={`ml-1.5 ${getStatusColor(bill.status)}`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {bill.status === 'unpaid' && (
                    <button className="px-3 py-1 bg-teal-500 text-white text-xs rounded-md hover:bg-teal-600 transition-colors">
                      Pay
                    </button>
                  )}
                  {bill.status === 'paid' && (
                    <button className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-xs">
                      Receipt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insurance & Billing</h1>
        </div>

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'insurance', label: 'Insurance' },
            { id: 'claims', label: 'Claims' },
            { id: 'billing', label: 'Billing & Payments' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'insurance' && renderInsuranceTab()}
          {activeTab === 'claims' && renderClaimsTab()}
          {activeTab === 'billing' && renderBillingTab()}
        </div>
      </div>
    </DefaultLayout>
  );
} 