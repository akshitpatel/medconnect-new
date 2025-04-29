'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';
import Tabs from '@/app/components/ui/Tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Heart, 
  Activity, 
  Scale, 
  Flag,
  Award,
  LineChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  BarChart4,
  PieChart,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  normalRange?: { min: number; max: number };
  history: { date: string; value: number }[];
  category: 'vital' | 'fitness' | 'lab' | 'lifestyle';
  icon: React.ReactNode;
}

interface HealthGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  category: 'fitness' | 'lifestyle' | 'health';
  startDate: string;
  targetDate: string;
  progress: number;
  status: 'on-track' | 'behind' | 'achieved';
  icon: React.ReactNode;
}

export default function HealthAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock health metrics data
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      trend: 'down',
      change: -5,
      normalRange: { min: 90, max: 120 },
      history: [
        { date: '2023-01-01', value: 130 },
        { date: '2023-02-01', value: 128 },
        { date: '2023-03-01', value: 125 },
        { date: '2023-04-01', value: 123 },
        { date: '2023-05-01', value: 120 }
      ],
      category: 'vital',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      id: '2',
      name: 'Steps',
      value: 8524,
      unit: 'steps',
      trend: 'up',
      change: 12,
      history: [
        { date: '2023-04-25', value: 7500 },
        { date: '2023-04-26', value: 8100 },
        { date: '2023-04-27', value: 7800 },
        { date: '2023-04-28', value: 8300 },
        { date: '2023-04-29', value: 7900 },
        { date: '2023-04-30', value: 8200 },
        { date: '2023-05-01', value: 8524 }
      ],
      category: 'fitness',
      icon: <Activity className="h-5 w-5 text-blue-500" />
    },
    {
      id: '3',
      name: 'Weight',
      value: 175,
      unit: 'lbs',
      trend: 'down',
      change: -2.5,
      history: [
        { date: '2023-01-01', value: 185 },
        { date: '2023-02-01', value: 182 },
        { date: '2023-03-01', value: 180 },
        { date: '2023-04-01', value: 177.5 },
        { date: '2023-05-01', value: 175 }
      ],
      category: 'fitness',
      icon: <Scale className="h-5 w-5 text-green-500" />
    },
    {
      id: '4',
      name: 'Resting Heart Rate',
      value: 68,
      unit: 'bpm',
      trend: 'down',
      change: -3,
      normalRange: { min: 60, max: 100 },
      history: [
        { date: '2023-01-01', value: 75 },
        { date: '2023-02-01', value: 73 },
        { date: '2023-03-01', value: 72 },
        { date: '2023-04-01', value: 70 },
        { date: '2023-05-01', value: 68 }
      ],
      category: 'vital',
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      id: '5',
      name: 'Cholesterol',
      value: 185,
      unit: 'mg/dL',
      trend: 'down',
      change: -10,
      normalRange: { min: 125, max: 200 },
      history: [
        { date: '2022-05-01', value: 210 },
        { date: '2022-08-01', value: 205 },
        { date: '2022-11-01', value: 195 },
        { date: '2023-02-01', value: 190 },
        { date: '2023-05-01', value: 185 }
      ],
      category: 'lab',
      icon: <BarChart4 className="h-5 w-5 text-purple-500" />
    },
    {
      id: '6',
      name: 'Sleep',
      value: 7.2,
      unit: 'hours',
      trend: 'up',
      change: 0.5,
      normalRange: { min: 7, max: 9 },
      history: [
        { date: '2023-04-25', value: 6.5 },
        { date: '2023-04-26', value: 6.8 },
        { date: '2023-04-27', value: 7.0 },
        { date: '2023-04-28', value: 6.7 },
        { date: '2023-04-29', value: 7.1 },
        { date: '2023-04-30', value: 7.0 },
        { date: '2023-05-01', value: 7.2 }
      ],
      category: 'lifestyle',
      icon: <Activity className="h-5 w-5 text-indigo-500" />
    }
  ]);

  // Mock health goals data
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([
    {
      id: '1',
      name: 'Daily Steps',
      target: 10000,
      current: 8524,
      unit: 'steps',
      category: 'fitness',
      startDate: '2023-04-01',
      targetDate: '2023-06-30',
      progress: 85.24,
      status: 'on-track',
      icon: <Activity className="h-5 w-5 text-blue-500" />
    },
    {
      id: '2',
      name: 'Weight Loss',
      target: 170,
      current: 175,
      unit: 'lbs',
      category: 'fitness',
      startDate: '2023-01-01',
      targetDate: '2023-07-31',
      progress: 66.7,
      status: 'on-track',
      icon: <Scale className="h-5 w-5 text-green-500" />
    },
    {
      id: '3',
      name: 'Sleep Duration',
      target: 8,
      current: 7.2,
      unit: 'hours',
      category: 'lifestyle',
      startDate: '2023-04-01',
      targetDate: '2023-05-31',
      progress: 90,
      status: 'on-track',
      icon: <Activity className="h-5 w-5 text-indigo-500" />
    },
    {
      id: '4',
      name: 'Lower Blood Pressure',
      target: 120,
      current: 125,
      unit: 'mmHg',
      category: 'health',
      startDate: '2023-01-01',
      targetDate: '2023-12-31',
      progress: 83.3,
      status: 'on-track',
      icon: <Heart className="h-5 w-5 text-red-500" />
    }
  ]);

  // AI-generated insights based on health data
  const [insights, setInsights] = useState([
    {
      id: '1',
      title: 'Blood Pressure Improvement',
      description: 'Your systolic blood pressure has decreased by 5 mmHg over the past month. Keep up the good work with your diet and exercise routine.',
      category: 'positive',
      relatedMetric: 'Blood Pressure'
    },
    {
      id: '2',
      title: 'Step Count Increasing',
      description: 'Your average daily step count has increased by 12% compared to last month. This is excellent progress toward your fitness goal.',
      category: 'positive',
      relatedMetric: 'Steps'
    },
    {
      id: '3',
      title: 'Sleep Optimization',
      description: 'Your sleep duration is still below your target of 8 hours. Try going to bed 30 minutes earlier to reach your goal.',
      category: 'suggestion',
      relatedMetric: 'Sleep'
    },
    {
      id: '4',
      title: 'Cholesterol Trend',
      description: 'Your cholesterol levels have been steadily decreasing over the past year and are now within normal range. Your dietary changes appear to be working.',
      category: 'positive',
      relatedMetric: 'Cholesterol'
    }
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <LineChart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-500';
      case 'behind': return 'text-yellow-500';
      case 'achieved': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  // Chart data for health metrics
  const generateChartData = (metric: HealthMetric) => {
    return {
      labels: metric.history.map(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      values: metric.history.map(h => h.value)
    };
  };

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Health Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Track your progress and discover health trends
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  <Flag className="h-5 w-5 mr-2" />
                  Set New Goal
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'vitals', label: 'Vital Signs' },
                { id: 'fitness', label: 'Fitness' },
                { id: 'lifestyle', label: 'Lifestyle' },
                { id: 'goals', label: 'Goals' }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </CardContent>
        </Card>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  </div>
                ))
              ) : (
                healthMetrics.map(metric => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {metric.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {metric.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {metric.trend === 'up' ? (
                            <ArrowUpRight className={`h-5 w-5 ${metric.name === 'Blood Pressure' || metric.name === 'Cholesterol' ? 'text-yellow-500' : 'text-green-500'}`} />
                          ) : (
                            <ArrowDownRight className={`h-5 w-5 ${metric.name === 'Blood Pressure' || metric.name === 'Cholesterol' ? 'text-green-500' : 'text-yellow-500'}`} />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {metric.value}
                          </span>
                          <span className="ml-1 text-gray-500 dark:text-gray-400">
                            {metric.unit}
                          </span>
                        </div>
                        <div className={`text-sm font-medium ${
                          (metric.trend === 'up' && (metric.name !== 'Blood Pressure' && metric.name !== 'Cholesterol')) || 
                          (metric.trend === 'down' && (metric.name === 'Blood Pressure' || metric.name === 'Cholesterol')) 
                            ? 'text-green-500' 
                            : (metric.trend === 'down' && (metric.name !== 'Blood Pressure' && metric.name !== 'Cholesterol')) ||
                              (metric.trend === 'up' && (metric.name === 'Blood Pressure' || metric.name === 'Cholesterol'))
                              ? 'text-yellow-500'
                              : 'text-gray-500'
                        }`}>
                          {metric.trend === 'up' ? '+' : ''}{metric.change}{metric.unit === 'steps' ? '%' : ''}
                        </div>
                      </div>
                      
                      {metric.normalRange && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Normal range: {metric.normalRange.min} - {metric.normalRange.max} {metric.unit}
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full" style={{ 
                              width: `${Math.min(100, Math.max(0, ((metric.value - metric.normalRange.min) / (metric.normalRange.max - metric.normalRange.min)) * 100))}%` 
                            }}></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="w-full h-12 mt-4">
                        <div className="flex justify-between items-end h-full">
                          {metric.history.map((point, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div 
                                className="w-1.5 bg-teal-500 rounded-t" 
                                style={{ 
                                  height: `${((point.value - Math.min(...metric.history.map(h => h.value))) / (Math.max(...metric.history.map(h => h.value)) - Math.min(...metric.history.map(h => h.value)))) * 100}%`,
                                  minHeight: '4px'
                                }}
                              ></div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 -rotate-45 origin-top-left">
                                {new Date(point.date).getDate()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Health Goals
                  </h2>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 border border-teal-500 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200">
                    <Target className="h-4 w-4 mr-1" />
                    Add New Goal
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {healthGoals.map(goal => (
                      <div 
                        key={goal.id} 
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start mb-4 md:mb-0">
                            <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                              {goal.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {goal.name}
                              </h3>
                              <div className="flex items-center mt-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Current: <span className="font-medium">{goal.current} {goal.unit}</span>
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  Target: <span className="font-medium">{goal.target} {goal.unit}</span>
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  By {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-3">
                              <span className={`text-lg font-bold ${getStatusColor(goal.status)}`}>
                                {Math.round(goal.progress)}%
                              </span>
                            </div>
                            <button className="inline-flex items-center px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                              Update
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                goal.status === 'on-track' 
                                  ? 'bg-teal-500' 
                                  : goal.status === 'behind' 
                                    ? 'bg-yellow-500' 
                                    : 'bg-blue-500'
                              }`} 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Recently Achieved
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
                        <Award className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No achievements yet
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Keep working toward your health goals. Your achievements will be displayed here when you reach them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthMetrics.map(metric => (
                <Card key={`trend-${metric.id}`}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        {metric.icon}
                        <span className="ml-2">{metric.name} Trend</span>
                      </h3>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (metric.trend === 'up' && (metric.name !== 'Blood Pressure' && metric.name !== 'Cholesterol')) || 
                          (metric.trend === 'down' && (metric.name === 'Blood Pressure' || metric.name === 'Cholesterol')) 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : (metric.trend === 'down' && (metric.name !== 'Blood Pressure' && metric.name !== 'Cholesterol')) ||
                              (metric.trend === 'up' && (metric.name === 'Blood Pressure' || metric.name === 'Cholesterol'))
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {metric.trend === 'up' ? '+' : ''}{metric.change}{metric.unit === 'steps' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end space-x-2">
                      {metric.history.map((point, index) => {
                        const max = Math.max(...metric.history.map(h => h.value));
                        const min = Math.min(...metric.history.map(h => h.value));
                        const range = max - min;
                        const heightPercent = range === 0 ? 50 : ((point.value - min) / range) * 100;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center justify-end">
                            <div 
                              className={`w-full rounded-t ${
                                (metric.name === 'Blood Pressure' || metric.name === 'Cholesterol') 
                                  ? point.value > (metric.normalRange?.max || Infinity) 
                                    ? 'bg-red-500' : point.value < (metric.normalRange?.min || 0) 
                                      ? 'bg-yellow-500' : 'bg-green-500'
                                  : 'bg-teal-500'
                              }`}
                              style={{ height: `${Math.max(10, heightPercent)}%` }}
                            ></div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {metric.normalRange && (
                      <div className="mt-4 flex items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Normal range: {metric.normalRange.min} - {metric.normalRange.max} {metric.unit}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI-Generated Health Insights
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Updated daily
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.map(insight => (
                      <div 
                        key={insight.id} 
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${
                            insight.category === 'positive' 
                              ? 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-300' 
                              : insight.category === 'warning'
                                ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {insight.category === 'positive' 
                              ? <TrendingUp className="h-5 w-5" />
                              : insight.category === 'warning'
                                ? <AlertCircle className="h-5 w-5" />
                                : <TrendingUp className="h-5 w-5" />
                            }
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {insight.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {insight.description}
                            </p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {insight.relatedMetric}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 flex justify-center">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                    <PieChart className="h-5 w-5 mr-2" />
                    Generate Comprehensive Health Report
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DefaultLayout>
  );
} 