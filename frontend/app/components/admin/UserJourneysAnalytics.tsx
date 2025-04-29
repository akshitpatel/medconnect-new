'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaUserClock, FaFilter, FaDownload, 
  FaSearch, FaChartLine, FaRoute, FaChevronDown,
  FaChevronRight, FaCalendarAlt, FaEye, FaCheckCircle,
  FaTimesCircle, FaMobileAlt, FaDesktop, FaTabletAlt,
  FaThumbsUp, FaThumbsDown
} from 'react-icons/fa';
import { UserJourney, UserJourneyEvent } from '@/app/lib/user-journey';

interface UserJourneysAnalyticsProps {
  initialData?: any;
}

const UserJourneysAnalytics: React.FC<UserJourneysAnalyticsProps> = ({ initialData }) => {
  const [journeys, setJourneys] = useState<UserJourney[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedJourneys, setExpandedJourneys] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalJourneys, setTotalJourneys] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const itemsPerPage = 10;

  // Fetch journeys and stats when component mounts
  useEffect(() => {
    if (initialData) {
      setJourneys(initialData.journeys || []);
      setStats(initialData.stats || null);
      setTotalJourneys(initialData.total || 0);
    } else {
      fetchJourneyData();
    }
  }, [initialData]);

  // Fetch journey data
  const fetchJourneyData = async (page = 1, filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch journey stats
      const statsResponse = await fetch('/api/admin/user-journeys?stats=true');
      if (!statsResponse.ok) throw new Error('Failed to fetch journey stats');
      const statsData = await statsResponse.json();
      
      // Fetch journeys with pagination
      const skip = (page - 1) * itemsPerPage;
      const journeyType = filterType !== 'all' ? filterType : undefined;
      
      let url = `/api/admin/user-journeys?limit=${itemsPerPage}&skip=${skip}`;
      if (journeyType) url += `&type=${journeyType}`;
      
      const journeysResponse = await fetch(url);
      if (!journeysResponse.ok) throw new Error('Failed to fetch journeys');
      const journeysData = await journeysResponse.json();
      
      setJourneys(journeysData.journeys || []);
      setStats(statsData.stats || null);
      setTotalJourneys(journeysData.total || 0);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error fetching journey data:', error);
      setError(`Failed to fetch data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/user-journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchTerm,
          filters: {
            journeyType: filterType !== 'all' ? filterType : undefined,
            startDate: selectedDate ? new Date(selectedDate) : undefined,
          },
          limit: itemsPerPage,
          skip: 0,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to search journeys');
      const data = await response.json();
      
      setJourneys(data.journeys || []);
      setTotalJourneys(data.total || 0);
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Error searching journeys:', error);
      setError(`Search failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle journey expansion
  const toggleJourneyExpansion = (journeyId: string) => {
    const newExpandedJourneys = new Set(expandedJourneys);
    if (newExpandedJourneys.has(journeyId)) {
      newExpandedJourneys.delete(journeyId);
    } else {
      newExpandedJourneys.add(journeyId);
    }
    setExpandedJourneys(newExpandedJourneys);
  };

  // Change page
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= Math.ceil(totalJourneys / itemsPerPage)) {
      fetchJourneyData(page);
    }
  };

  // Export data as CSV
  const exportAsCSV = () => {
    if (journeys.length === 0) return;
    
    const headers = [
      'Journey ID', 
      'Session ID', 
      'Start Time', 
      'End Time', 
      'Journey Type',
      'Completed',
      'Events',
      'Feedback',
      'Device Type',
    ];
    
    const data = journeys.map(journey => [
      journey._id,
      journey.sessionId,
      new Date(journey.startedAt).toLocaleString(),
      journey.completedAt ? new Date(journey.completedAt).toLocaleString() : 'Not completed',
      journey.journeyType,
      journey.isCompleted ? 'Yes' : 'No',
      journey.events?.length || 0,
      journey.outcome?.feedback || 'None',
      journey.metadata?.deviceType || 'Unknown',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `user-journeys-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Format event data for display
  const formatEventData = (eventData: any) => {
    if (!eventData) return 'No data';
    
    return Object.entries(eventData)
      .filter(([key]) => key !== 'timestamp' && key !== 'sessionId')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(', ')}`;
        }
        return `${key}: ${value}`;
      })
      .join(' | ');
  };

  // Get device icon
  const getDeviceIcon = (deviceType: string) => {
    if (!deviceType || deviceType === 'unknown') return <FaDesktop className="text-gray-400" />;
    
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <FaMobileAlt className="text-blue-400" />;
      case 'tablet':
        return <FaTabletAlt className="text-green-400" />;
      default:
        return <FaDesktop className="text-purple-400" />;
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaRoute className="mr-3 text-blue-400" />
          User Journey Analytics
        </h2>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-900 p-3 rounded-lg mr-4">
                  <FaUserClock className="text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Journeys</p>
                  <p className="text-2xl font-bold">{totalJourneys}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-green-900 p-3 rounded-lg mr-4">
                  <FaCheckCircle className="text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Completion Rate</p>
                  <p className="text-2xl font-bold">
                    {stats.byCompletion && stats.byCompletion.find((x: any) => x._id === true)
                      ? Math.round((stats.byCompletion.find((x: any) => x._id === true).count / totalJourneys) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-purple-900 p-3 rounded-lg mr-4">
                  <FaRoute className="text-purple-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Popular Journey</p>
                  <p className="text-lg font-bold">
                    {stats.byType && stats.byType[0]
                      ? stats.byType.sort((a: any, b: any) => b.count - a.count)[0]._id.replace('_', ' ')
                      : 'None'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-yellow-900 p-3 rounded-lg mr-4">
                  <FaThumbsUp className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Positive Feedback</p>
                  <p className="text-2xl font-bold">
                    {stats.byOutcome && stats.byOutcome.find((x: any) => x._id === 'helpful')
                      ? Math.round((stats.byOutcome.find((x: any) => x._id === 'helpful').count / 
                          (stats.byOutcome.reduce((acc: number, curr: any) => acc + curr.count, 0))) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input 
              type="text"
              placeholder="Search journeys..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <select 
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              fetchJourneyData(1, { type: e.target.value });
            }}
          >
            <option value="all">All Journey Types</option>
            <option value="symptom_checker">Symptom Checker</option>
            <option value="appointment_booking">Appointment Booking</option>
            <option value="doctor_search">Doctor Search</option>
            <option value="other">Other</option>
          </select>
          
          <div className="relative">
            <input 
              type="date"
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <FaCalendarAlt className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center"
            onClick={handleSearch}
          >
            <FaFilter className="mr-2" />
            Apply Filters
          </button>
          
          <button 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center"
            onClick={exportAsCSV}
            disabled={journeys.length === 0}
          >
            <FaDownload className="mr-2" />
            Export CSV
          </button>
        </div>
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Journey List */}
        {!isLoading && journeys.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <FaRoute className="mx-auto text-4xl text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">No journeys found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Journey
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Events
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {journeys.map((journey: UserJourney, index: number) => {
                  const isExpanded = expandedJourneys.has(journey._id?.toString() || '');
                  
                  return (
                    <React.Fragment key={journey._id?.toString() || index}>
                      <tr className={`hover:bg-gray-750 ${isExpanded ? 'bg-gray-750' : ''}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleJourneyExpansion(journey._id?.toString() || '')}
                              className="mr-2 text-gray-400 hover:text-white"
                            >
                              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-200">
                                {journey.sessionId.substring(0, 12)}...
                              </div>
                              <div className="text-xs text-gray-400">
                                ID: {journey._id?.toString().substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {new Date(journey.startedAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            journey.journeyType === 'symptom_checker' 
                              ? 'bg-blue-900 text-blue-200' 
                              : journey.journeyType === 'appointment_booking'
                                ? 'bg-green-900 text-green-200'
                                : journey.journeyType === 'doctor_search'
                                  ? 'bg-purple-900 text-purple-200'
                                  : 'bg-gray-700 text-gray-300'
                          }`}>
                            {journey.journeyType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {journey.isCompleted ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-200 flex items-center w-fit">
                              <FaCheckCircle className="mr-1" /> Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-200 flex items-center w-fit">
                              <FaTimesCircle className="mr-1" /> Incomplete
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {journey.events?.length || 0} events
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {getDeviceIcon(journey.metadata?.deviceType || '')}
                            <span className="ml-2 text-sm text-gray-300">
                              {journey.metadata?.platform || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                            onClick={() => window.open(`/admin/user-journeys/${journey._id}`, '_blank')}
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Journey Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="bg-gray-850 p-4">
                            <div className="text-sm">
                              <h4 className="text-white font-semibold mb-2">Journey Events Timeline</h4>
                              <div className="space-y-3">
                                {journey.events && journey.events.map((event: UserJourneyEvent, eventIndex: number) => (
                                  <div key={eventIndex} className="flex">
                                    <div className="mr-4 relative">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full z-10 relative"></div>
                                      {eventIndex < (journey.events?.length || 0) - 1 && (
                                        <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-700 -ml-0.5 h-5"></div>
                                      )}
                                    </div>
                                    <div className="flex-grow pb-4">
                                      <div className="flex justify-between">
                                        <div className="font-medium text-blue-400">
                                          {event.eventType.replace('symptom_check_', '')}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                          {new Date(event.timestamp).toLocaleString()}
                                        </div>
                                      </div>
                                      <div className="mt-1 text-gray-400 text-sm">
                                        {formatEventData(event.data)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                {journey.isCompleted && (
                                  <div className="flex">
                                    <div className="mr-4">
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div>
                                      <div className="font-medium text-green-400">
                                        Journey Completed
                                      </div>
                                      <div className="text-gray-400 text-xs">
                                        {journey.completedAt ? new Date(journey.completedAt).toLocaleString() : 'Unknown time'}
                                      </div>
                                      {journey.outcome && (
                                        <div className="mt-2 bg-gray-800 p-3 rounded">
                                          <h5 className="text-white text-sm mb-1">Outcome</h5>
                                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                            {journey.outcome.symptoms && (
                                              <div>
                                                <span className="text-gray-500">Symptoms:</span> {journey.outcome.symptoms.join(', ')}
                                              </div>
                                            )}
                                            {journey.outcome.bodyPart && (
                                              <div>
                                                <span className="text-gray-500">Body Part:</span> {journey.outcome.bodyPart}
                                              </div>
                                            )}
                                            {journey.outcome.conditions && (
                                              <div>
                                                <span className="text-gray-500">Conditions:</span> {journey.outcome.conditions.join(', ')}
                                              </div>
                                            )}
                                            {journey.outcome.feedback && (
                                              <div>
                                                <span className="text-gray-500">Feedback:</span> {journey.outcome.feedback}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 border-t border-gray-700 pt-4">
                              <h4 className="text-white font-semibold mb-2">User Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">IP Address:</span> {journey.metadata?.clientIp || 'Unknown'}
                                </div>
                                <div>
                                  <span className="text-gray-500">Browser:</span> {journey.metadata?.browser || 'Unknown'}
                                </div>
                                <div>
                                  <span className="text-gray-500">Device:</span> {journey.metadata?.deviceType || 'Unknown'}
                                </div>
                                <div>
                                  <span className="text-gray-500">Platform:</span> {journey.metadata?.platform || 'Unknown'}
                                </div>
                                {journey.metadata?.referrer && (
                                  <div className="col-span-2">
                                    <span className="text-gray-500">Referrer:</span> {journey.metadata.referrer}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && totalJourneys > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-400">
              Showing {Math.min(((currentPage - 1) * itemsPerPage) + 1, totalJourneys)} to {Math.min(currentPage * itemsPerPage, totalJourneys)} of {totalJourneys} journeys
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, Math.ceil(totalJourneys / itemsPerPage)) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalJourneys / itemsPerPage)}
                className={`px-3 py-1 rounded ${currentPage >= Math.ceil(totalJourneys / itemsPerPage) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserJourneysAnalytics; 