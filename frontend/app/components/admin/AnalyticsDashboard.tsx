'use client';

import React, { useState } from 'react';
import { 
  FaUsers, FaUserMd, FaChartLine, FaCalendarAlt, 
  FaPills, FaFlask, FaAmbulance, FaMoneyBillWave, FaStethoscope
} from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface AnalyticsProps {
  stats: {
    users: number;
    doctors: number;
    pharmacies: number;
    appointments: number;
    prescriptions: number;
    emergencyServices: number;
    medicines: number;
    labTests: number;
    symptomChecks?: number;
    revenueData?: {
      total: number;
      previous: number;
      change: number;
    };
    userGrowth?: {
      total: number;
      previous: number;
      change: number;
    };
  };
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ 
  stats, 
  timeframe, 
  onTimeframeChange 
}) => {
  // Mocked data for the charts - in a real app this would come from the API
  const mockChartData = {
    userGrowth: {
      daily: [10, 12, 15, 18, 20, 22, 25],
      weekly: [100, 120, 140, 160, 180, 200, 220],
      monthly: [500, 550, 600, 650, 700, 750, 800]
    },
    appointments: {
      daily: [5, 8, 10, 12, 15, 18, 20],
      weekly: [30, 35, 40, 45, 50, 55, 60],
      monthly: [120, 140, 160, 180, 200, 220, 240]
    },
    revenue: {
      daily: [500, 600, 700, 800, 850, 900, 1000],
      weekly: [3500, 4000, 4500, 5000, 5500, 6000, 6500],
      monthly: [15000, 18000, 21000, 24000, 27000, 30000, 33000]
    }
  };

  const chartData = mockChartData.userGrowth[timeframe as keyof typeof mockChartData.userGrowth] || [];
  
  const statsCards = [
    {
      title: 'Symptom Checks',
      value: stats.symptomChecks || 0,
      icon: <FaStethoscope className="text-teal-500" size={24} />,
      change: 12.8,
      trend: 'up'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => onTimeframeChange('daily')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'daily' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onTimeframeChange('weekly')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'weekly' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => onTimeframeChange('monthly')}
            className={`px-4 py-2 rounded-md ${
              timeframe === 'monthly' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Growth metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaUsers className="text-teal-600 text-xl" />
            </div>
            <div className={`flex items-center ${stats.userGrowth?.change && stats.userGrowth.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.userGrowth?.change && stats.userGrowth.change > 0 ? (
                <MdTrendingUp className="mr-1" />
              ) : (
                <MdTrendingDown className="mr-1" />
              )}
              <span className="text-sm font-medium">
                {stats.userGrowth?.change ? `${Math.abs(stats.userGrowth.change).toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.users}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">users</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaUserMd className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">2.5%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Active Doctors</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.doctors}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">doctors</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaCalendarAlt className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">5.2%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Appointments</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.appointments}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">bookings</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">
                {stats.revenueData?.change ? `${stats.revenueData.change.toFixed(1)}%` : '3.8%'}
              </span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">${stats.revenueData?.total.toLocaleString() || '0'}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">USD</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaPills className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">3.4%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Prescriptions</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.prescriptions}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">orders</span>
          </div>
        </div>
      
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaFlask className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">1.8%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Lab Tests</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.labTests}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">tests</span>
          </div>
        </div>
      
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaAmbulance className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-red-600">
              <MdTrendingDown className="mr-1" />
              <span className="text-sm font-medium">2.5%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Emergency Services</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.emergencyServices}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">calls</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <FaStethoscope className="text-teal-600 text-xl" />
            </div>
            <div className="flex items-center text-green-600">
              <MdTrendingUp className="mr-1" />
              <span className="text-sm font-medium">12.3%</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm">Symptom Checks</h3>
          <div className="flex items-end mt-1">
            <h2 className="text-3xl font-bold">{stats.symptomChecks || 0}</h2>
            <span className="text-gray-500 text-xs ml-2 mb-1">checks</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((value: number, index: number) => (
              <div key={index} className="relative flex-1 flex flex-col items-center">
                <div 
                  className="bg-teal-500 rounded-t-sm w-full" 
                  style={{ 
                    height: `${(value / Math.max(...chartData)) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">
                  {timeframe === 'daily' ? `Day ${index + 1}` : 
                   timeframe === 'weekly' ? `Week ${index + 1}` : 
                   `Month ${index + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Service Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="flex">
              {/* Simple pie chart visualization */}
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full border-8 border-teal-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}></div>
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 0 100%, 100% 100%)' }}></div>
                </div>
              </div>
              
              <div className="ml-8 space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-teal-500 mr-2"></div>
                  <span>Appointments ({stats.appointments})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                  <span>Prescriptions ({stats.prescriptions})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2"></div>
                  <span>Lab Tests ({stats.labTests})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                  <span>Emergency ({stats.emergencyServices})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Healthcare Services</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pharmacies</span>
              <span className="font-semibold">{stats.pharmacies}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${(stats.pharmacies / 100) * 100}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Medicines</span>
              <span className="font-semibold">{stats.medicines}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${(stats.medicines / 1000) * 100}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lab Tests</span>
              <span className="font-semibold">{stats.labTests}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${(stats.labTests / 500) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Activity Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-teal-600 mr-2" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointments Today</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="text-xs text-green-600">↑ 12% from yesterday</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaPills className="text-teal-600 mr-2" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prescriptions</span>
                  <span className="font-semibold">{stats.prescriptions}</span>
                </div>
                <div className="text-xs text-green-600">↑ 5% from last week</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <FaAmbulance className="text-teal-600 mr-2" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency Requests</span>
                  <span className="font-semibold">{stats.emergencyServices}</span>
                </div>
                <div className="text-xs text-red-600">↓ 3% from last week</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Server Uptime</span>
                <span className="font-semibold">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">API Response Time</span>
                <span className="font-semibold">120ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Database Load</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 