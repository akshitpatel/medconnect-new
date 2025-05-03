'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, Users, Activity, BarChart, PieChart, LineChart } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

// Types for the chart data
interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

interface PredictionData {
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
  nextWeekPrediction: number[];
}

interface EngagementMetric {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// Line Chart Component
interface LineChartProps {
  title: string;
  description: string;
  data: ChartData;
  height?: string;
  loading?: boolean;
}

export const EnhancedLineChart: React.FC<LineChartProps> = ({ 
  title, 
  description, 
  data, 
  height = 'h-64',
  loading = false
}) => {
  const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));
  
  if (loading) {
    return (
      <AnimatedCard>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`${height} flex items-center justify-center`}>
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-8 bg-teal-200 dark:bg-teal-800 rounded-full mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    );
  }
  
  return (
    <AnimatedCard>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChart className="h-5 w-5 mr-2 text-teal-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`${height} flex items-end justify-between space-x-2 relative`}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500 py-2">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute left-10 right-0 top-0 bottom-0 flex flex-col justify-between py-2">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 w-full h-0"></div>
            ))}
          </div>
          
          {/* Chart bars */}
          <div className="ml-10 flex-1 flex items-end justify-between space-x-2 z-10">
            {data.labels.map((label, idx) => {
              // Calculate heights for each dataset at this label index
              const bars = data.datasets.map((dataset, datasetIdx) => {
                const value = dataset.data[idx] || 0;
                const height = `${(value / maxValue) * 100}%`;
                const bgColor = dataset.backgroundColor || `hsl(${174 + (datasetIdx * 30)}, 70%, 50%)`;
                
                return (
                  <div 
                    key={`${idx}-${datasetIdx}`}
                    className="rounded-t-sm" 
                    style={{ 
                      height, 
                      backgroundColor: bgColor,
                      width: '100%',
                      minHeight: '4px',
                      transition: 'height 0.5s ease-in-out'
                    }}
                    title={`${dataset.label}: ${value}`}
                  ></div>
                );
              });
              
              return (
                <div key={idx} className="relative flex-1 flex flex-col items-center">
                  <div className="w-full flex space-x-1">
                    {bars}
                  </div>
                  <span className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%' }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center mt-4 gap-3">
          {data.datasets.map((dataset, idx) => (
            <div key={idx} className="flex items-center">
              <div 
                className="w-3 h-3 mr-1 rounded-sm"
                style={{ backgroundColor: dataset.backgroundColor || `hsl(${174 + (idx * 30)}, 70%, 50%)` }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{dataset.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </AnimatedCard>
  );
};

// Predictive Analytics Component
interface PredictiveAnalyticsProps {
  title: string;
  description: string;
  data: PredictionData;
  icon?: React.ReactNode;
}

export const PredictiveAnalyticsCard: React.FC<PredictiveAnalyticsProps> = ({ 
  title, 
  description, 
  data,
  icon = <Calendar className="h-5 w-5 text-teal-500" />
}) => {
  return (
    <AnimatedCard>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current</p>
            <p className="text-2xl font-bold">{data.current}</p>
          </div>
          <div className="h-8 border-r border-gray-200 dark:border-gray-700"></div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Predicted</p>
            <p className="text-2xl font-bold">{data.predicted}</p>
          </div>
          <div className="h-8 border-r border-gray-200 dark:border-gray-700"></div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
            <p className={`text-lg font-semibold flex items-center ${data.trend === 'up' ? 'text-green-600' : data.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {data.trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : 
               data.trend === 'down' ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
              {data.percentageChange}%
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next 7 Days Prediction</p>
          <div className="h-24 flex items-end justify-between space-x-1">
            {data.nextWeekPrediction.map((value, idx) => {
              const maxValue = Math.max(...data.nextWeekPrediction);
              const height = `${(value / maxValue) * 100}%`;
              const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx % 7];
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-teal-500 bg-opacity-80 rounded-t-sm" 
                    style={{ height, minHeight: '4px' }}
                    title={`${dayOfWeek}: ${value}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">{dayOfWeek}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <p className="text-sm text-teal-800 dark:text-teal-200">
            <strong>AI Insight:</strong> {data.trend === 'up' ? 
              `Expect increased demand. Consider ${Math.round(data.percentageChange)}% more capacity.` : 
              data.trend === 'down' ? 
              `Expect decreased demand. Plan for ${Math.abs(Math.round(data.percentageChange))}% reduction.` : 
              'Demand is stable. Maintain current capacity.'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10">
          View Detailed Forecast
        </Button>
      </CardFooter>
    </AnimatedCard>
  );
};

// User Engagement Metrics Component
interface EngagementMetricsProps {
  title: string;
  description: string;
  metrics: EngagementMetric[];
  timeframe: string;
}

export const UserEngagementCard: React.FC<EngagementMetricsProps> = ({ 
  title, 
  description, 
  metrics,
  timeframe
}) => {
  return (
    <AnimatedCard>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-teal-500" />
            {title}
          </CardTitle>
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800">
            {timeframe}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.name}</p>
                <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                   metric.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                  {metric.change}%
                </div>
              </div>
              <p className="text-2xl font-bold mt-1">{metric.value.toLocaleString()}</p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${metric.trend === 'up' ? 'bg-green-500' : metric.trend === 'down' ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${Math.min(100, Math.max(5, (metric.value / (metric.value + 100)) * 100))}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Previous: {metric.previousValue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/10">
          View All Metrics
        </Button>
      </CardFooter>
    </AnimatedCard>
  );
};
