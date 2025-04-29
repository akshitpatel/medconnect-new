'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaExclamationTriangle, FaCheckCircle, FaQuestionCircle, FaUser } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';

interface SymptomCheck {
  id: string;
  patientName: string;
  date: string;
  bodyPart: string;
  symptoms: string[];
  prediction: {
    possibleCauses: string[];
    urgency: 'emergency' | 'urgent' | 'routine';
  };
  status: 'pending' | 'reviewed' | 'escalated';
  contactInfo: {
    email: string;
    phone?: string;
  };
  createdAt?: string; // Added for real data
}

const SymptomCheckerManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [symptomChecks, setSymptomChecks] = useState<SymptomCheck[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchSymptomChecks();
  }, []);

  // Fetch symptom checks from the API
  const fetchSymptomChecks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/symptom-checks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch symptom checks');
      }
      
      const data = await response.json();
      
      // Format the data
      const formattedChecks = data.symptomChecks.map((check: any) => ({
        id: check._id || check.id,
        patientName: check.patientName || 'Anonymous',
        date: check.createdAt ? new Date(check.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        bodyPart: check.bodyPart || 'Not specified',
        symptoms: check.symptoms || [],
        prediction: {
          possibleCauses: check.prediction?.possibleCauses || ['Not specified'],
          urgency: check.prediction?.urgency || 'routine'
        },
        status: check.status || 'pending',
        contactInfo: {
          email: check.contactInfo?.email || 'No email provided',
          phone: check.contactInfo?.phone || 'No phone provided'
        },
        createdAt: check.createdAt
      }));
      
      setSymptomChecks(formattedChecks);
    } catch (error) {
      console.error('Error fetching symptom checks:', error);
      setError('Failed to fetch symptom checks. Please try again later.');
      // Use mock data as fallback if available in development
      if (process.env.NODE_ENV === 'development') {
        setSymptomChecks([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter symptom checks based on search query and filters
  const filteredChecks = symptomChecks.filter(check => {
    // Search filter
    const matchesSearch = 
      check.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter;
    
    // Urgency filter
    const matchesUrgency = urgencyFilter === 'all' || check.prediction.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'reviewed' | 'escalated') => {
    try {
      // Optimistically update UI
      setSymptomChecks(prev => 
        prev.map(check => 
          check.id === id ? { ...check, status: newStatus } : check
        )
      );
      
      // Send update to API
      const response = await fetch(`/api/symptom-checks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert to previous state on error
      fetchSymptomChecks();
    }
  };

  const getUrgencyBadge = (urgency: 'emergency' | 'urgent' | 'routine') => {
    switch (urgency) {
      case 'emergency':
        return (
          <span className="bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaExclamationTriangle className="mr-1" /> Emergency
          </span>
        );
      case 'urgent':
        return (
          <span className="bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaExclamationTriangle className="mr-1" /> Urgent
          </span>
        );
      case 'routine':
        return (
          <span className="bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaCheckCircle className="mr-1" /> Routine
          </span>
        );
    }
  };

  const getStatusBadge = (status: 'pending' | 'reviewed' | 'escalated') => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-gray-100 text-gray-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaQuestionCircle className="mr-1" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaCheckCircle className="mr-1" /> Reviewed
          </span>
        );
      case 'escalated':
        return (
          <span className="bg-purple-100 text-purple-800 font-medium px-2.5 py-0.5 rounded-full text-xs flex items-center">
            <FaExclamationTriangle className="mr-1" /> Escalated
          </span>
        );
    }
  };

  const exportData = () => {
    // In a real application, this would generate a CSV or PDF export
    alert('Exporting data for ' + filteredChecks.length + ' symptom check records');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Symptom Checker Management</h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchSymptomChecks}
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <MdRefresh className="text-lg" />
            Refresh
          </button>
          
          <button 
            onClick={exportData}
            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <FaDownload className="text-lg" />
            Export
          </button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, ID, or symptom"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="escalated">Escalated</option>
          </select>
          
          <select 
            className="px-4 py-2 border rounded-lg"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="all">All Urgency</option>
            <option value="emergency">Emergency</option>
            <option value="urgent">Urgent</option>
            <option value="routine">Routine</option>
          </select>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading symptom checks...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <FaExclamationTriangle className="inline-block text-3xl mb-2" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Results */}
      {!isLoading && !error && filteredChecks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No symptom checks found.</p>
        </div>
      )}
      
      {!isLoading && !error && filteredChecks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body Part</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Possible Causes</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredChecks.map(check => (
                <tr key={check.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{check.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {check.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{check.date}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{check.bodyPart}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <ul className="list-disc pl-5">
                      {check.symptoms.slice(0, 3).map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                      {check.symptoms.length > 3 && <li>+{check.symptoms.length - 3} more</li>}
                    </ul>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <ul className="list-disc pl-5">
                      {check.prediction.possibleCauses.slice(0, 2).map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                      {check.prediction.possibleCauses.length > 2 && 
                        <li>+{check.prediction.possibleCauses.length - 2} more</li>}
                    </ul>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getUrgencyBadge(check.prediction.urgency)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(check.status)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    <div>{check.contactInfo.email}</div>
                    {check.contactInfo.phone && <div>{check.contactInfo.phone}</div>}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <select 
                        className="px-2 py-1 border rounded text-sm"
                        value={check.status}
                        onChange={(e) => handleStatusChange(check.id, e.target.value as 'pending' | 'reviewed' | 'escalated')}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="escalated">Escalated</option>
                      </select>
                      <button 
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        onClick={() => window.open(`/symptom-checker/details/${check.id}`, '_blank')}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SymptomCheckerManagement; 