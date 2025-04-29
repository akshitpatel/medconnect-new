'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaUsers, FaCalendarCheck, FaUserMd, FaThumbsUp, FaThumbsDown, 
  FaFileUpload, FaChartLine, FaFilter, FaDownload, FaSync, FaSearch, FaSortAmountDown, FaSortAmountUp
} from 'react-icons/fa';

interface SymptomTrackerProps {
  timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
}

// Main component for tracking symptom checker activities
const SymptomTrackerDashboard: React.FC<SymptomTrackerProps> = ({ 
  timeframe = 'all' 
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<string>(timeframe);
  const [trackerData, setTrackerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'analytics'>('summary');

  // Fetch tracker data on component mount and when timeframe changes
  useEffect(() => {
    fetchTrackerData();
  }, [activeTimeframe]);

  // Fetch data from the API
  const fetchTrackerData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/symptom-tracker?timeframe=${activeTimeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch symptom tracker data');
      }
      
      const data = await response.json();
      setTrackerData(data);
    } catch (error) {
      console.error('Error fetching symptom tracker data:', error);
      setError('Failed to fetch symptom tracker data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export data as CSV
  const exportData = () => {
    if (!trackerData) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Headers for the CSV
    const headers = ['Action', 'Timestamp', 'Session ID', 'Details'];
    csvContent += headers.join(',') + '\r\n';
    
    // Add each analytics event
    trackerData.analytics.data.forEach((event: any) => {
      const row = [
        event.action,
        event.createdAt,
        event.data.sessionId || 'N/A',
        JSON.stringify(event.data).replace(/,/g, ';')
      ];
      csvContent += row.join(',') + '\r\n';
    });
    
    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `symptom-tracker-data-${activeTimeframe}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Symptom Tracker Dashboard</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={activeTimeframe}
              onChange={(e) => setActiveTimeframe(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
            
            <div className="text-sm text-gray-400 self-end">
              {trackerData && trackerData.source === 'mock' && (
                <span className="bg-amber-800 text-amber-100 px-2 py-1 rounded">
                  Using mock data (Database unavailable)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">Symptom Tracker Dashboard</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={activeTimeframe}
              onChange={(e) => setActiveTimeframe(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
            
            <div className="text-sm text-gray-400 self-end">
              {trackerData && trackerData.source === 'mock' && (
                <span className="bg-amber-800 text-amber-100 px-2 py-1 rounded">
                  Using mock data (Database unavailable)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg">
          <p className="font-semibold">Error loading data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render the dashboard when data is available
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Symptom Tracker Dashboard</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={activeTimeframe}
            onChange={(e) => setActiveTimeframe(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
          
          <div className="text-sm text-gray-400 self-end">
            {trackerData && trackerData.source === 'mock' && (
              <span className="bg-amber-800 text-amber-100 px-2 py-1 rounded">
                Using mock data (Database unavailable)
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Timeframe selector */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveTimeframe('day')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTimeframe === 'day' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Last 24 Hours
        </button>
        <button 
          onClick={() => setActiveTimeframe('week')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTimeframe === 'week' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Last Week
        </button>
        <button 
          onClick={() => setActiveTimeframe('month')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTimeframe === 'month' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Last Month
        </button>
        <button 
          onClick={() => setActiveTimeframe('year')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTimeframe === 'year' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Last Year
        </button>
        <button 
          onClick={() => setActiveTimeframe('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTimeframe === 'all' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          All Time
        </button>
      </div>
      
      {/* Tab selector */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            User Analytics
          </button>
        </nav>
      </div>
      
      {/* Show content based on active tab */}
      {trackerData && activeTab === 'summary' && (
        <SummaryTab data={trackerData.summary} />
      )}
      
      {trackerData && activeTab === 'details' && (
        <DetailsTab data={trackerData.symptomChecks} />
      )}
      
      {trackerData && activeTab === 'analytics' && (
        <AnalyticsTab data={trackerData.analytics} />
      )}
    </div>
  );
};

// Summary tab component
const SummaryTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      {/* Key metrics */}
      <h3 className="text-lg font-semibold mb-4 text-white">Key Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500 text-white rounded">
              <FaUsers />
            </div>
            <h4 className="ml-2 text-blue-300 font-medium">Total Sessions</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">{data.counts.totalStarted}</p>
          <p className="text-sm text-blue-300 mt-1">
            {data.counts.totalCompleted} completed ({Math.round((data.counts.totalCompleted / data.counts.totalStarted) * 100) || 0}%)
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center">
            <div className="p-2 bg-green-500 text-white rounded">
              <FaCalendarCheck />
            </div>
            <h4 className="ml-2 text-green-300 font-medium">Completed Checks</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">{data.counts.totalCompleted}</p>
          <p className="text-sm text-green-300 mt-1">
            Completion Rate: {data.rates.completionRate}%
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-500 text-white rounded">
              <FaThumbsUp />
            </div>
            <h4 className="ml-2 text-indigo-300 font-medium">Feedback Received</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">{data.counts.totalFeedbackProvided}</p>
          <p className="text-sm text-indigo-300 mt-1">
            {data.counts.totalPositiveFeedback} positive ({data.rates.positiveFeedbackRate}%)
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center">
            <div className="p-2 bg-purple-500 text-white rounded">
              <FaFileUpload />
            </div>
            <h4 className="ml-2 text-purple-300 font-medium">File Uploads</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-white">{data.counts.totalWithFiles}</p>
          <p className="text-sm text-purple-300 mt-1">
            {Math.round((data.counts.totalWithFiles / data.counts.totalCompleted) * 100) || 0}% of completed
          </p>
        </div>
      </div>
      
      {/* Top data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top symptoms */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Top Reported Symptoms</h4>
          <div className="space-y-2">
            {data.topData.symptoms.length === 0 ? (
              <p className="text-gray-500 italic">No data available</p>
            ) : (
              data.topData.symptoms.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item._id}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.count} {item.count === 1 ? 'report' : 'reports'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Top body parts */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Most Common Areas</h4>
          <div className="space-y-2">
            {data.topData.bodyParts.length === 0 ? (
              <p className="text-gray-500 italic">No data available</p>
            ) : (
              data.topData.bodyParts.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item._id || 'Unspecified'}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.count} {item.count === 1 ? 'check' : 'checks'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Top conditions */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Top AI Predictions</h4>
          <div className="space-y-2">
            {data.topData.conditions.length === 0 ? (
              <p className="text-gray-500 italic">No data available</p>
            ) : (
              data.topData.conditions.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item._id || 'Unspecified'}</span>
                  <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.count} {item.count === 1 ? 'diagnosis' : 'diagnoses'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Details tab component
const DetailsTab: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Symptom Check Details</h3>
      <p className="text-gray-400 mb-4">Showing {data.data.length} of {data.total} records.</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symptoms</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Diagnoses</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Urgency</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Files</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-400">No records found</td>
              </tr>
            ) : (
              data.data.map((check: any) => (
                <tr key={check._id} className="hover:bg-gray-750">
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {new Date(check.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {check.userData?.name || 'Anonymous'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {check.symptoms?.join(', ') || 'None reported'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {check.prediction?.possibleCauses?.join(', ') || 'No diagnoses'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {check.prediction?.urgency === 'emergency' ? (
                      <span className="px-2 py-1 bg-red-900 text-red-200 rounded-full text-xs">Emergency</span>
                    ) : check.prediction?.urgency === 'urgent' ? (
                      <span className="px-2 py-1 bg-amber-900 text-amber-200 rounded-full text-xs">Urgent</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-900 text-green-200 rounded-full text-xs">Routine</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {check.hasReports ? (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-900 text-purple-200 rounded-full text-xs">
                        <FaFileUpload className="mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {check.feedback === 'helpful' ? (
                      <span className="inline-flex items-center px-2 py-1 bg-green-900 text-green-200 rounded-full text-xs">
                        <FaThumbsUp className="mr-1" />
                        Helpful
                      </span>
                    ) : check.feedback === 'not-helpful' ? (
                      <span className="inline-flex items-center px-2 py-1 bg-red-900 text-red-200 rounded-full text-xs">
                        Not Helpful
                      </span>
                    ) : (
                      <span className="text-gray-500">No feedback</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Analytics tab component
const AnalyticsTab: React.FC<{ data: any }> = ({ data }) => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  
  // Process the analytics data when it changes or filters are applied
  useEffect(() => {
    let filtered = [...data.data];
    
    // Apply action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(event => event.action === actionFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.action.toLowerCase().includes(query) ||
        (event.data.sessionId && event.data.sessionId.toLowerCase().includes(query)) ||
        JSON.stringify(event.data).toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(filtered);
  }, [data.data, actionFilter, searchQuery]);
  
  // Get unique action types for filtering
  const actionTypes = Array.from(new Set(data.data.map((event: any) => event.action)));
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">User Analytics</h3>
      <p className="text-gray-400 mb-4">Showing user interactions and analytics events. Filter to find specific data.</p>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input 
            type="text"
            placeholder="Search analytics data..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <select 
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="all">All Actions</option>
          {actionTypes.map((action, index) => (
            <option key={index} value={action as string}>
              {(action as string).replace('symptom_check_', '')}
            </option>
          ))}
        </select>
      </div>
      
      {/* Analytics data table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Session ID</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
              <th className="py-2 px-4 border-b border-gray-600 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-400">No matching analytics events found</td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr key={index} className="hover:bg-gray-750">
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                      {event.action.replace('symptom_check_', '')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {event.data?.sessionId || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {event.data?.symptoms ? `Symptoms: ${event.data.symptoms.join(', ')}` : ''}
                      {event.data?.bodyPart ? `Body part: ${event.data.bodyPart}` : ''}
                      {event.data?.isHelpful !== undefined ? `Feedback: ${event.data.isHelpful ? 'Helpful' : 'Not helpful'}` : ''}
                      {!event.data?.symptoms && !event.data?.bodyPart && event.data?.isHelpful === undefined ? 'No details' : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    <div className="text-xs text-gray-400">
                      IP: {event.clientIp || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400 max-w-xs truncate">
                      {event.userAgent || 'Unknown'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SymptomTrackerDashboard; 