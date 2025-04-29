'use client';

import React, { useState } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaNewspaper, FaBell, FaFileAlt, FaQuestionCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Content types
const CONTENT_TYPES = [
  { id: 'article', name: 'Health Article', icon: <FaNewspaper className="text-teal-500" /> },
  { id: 'announcement', name: 'Announcement', icon: <FaBell className="text-teal-500" /> },
  { id: 'faq', name: 'FAQ', icon: <FaQuestionCircle className="text-teal-500" /> },
  { id: 'help', name: 'Help Document', icon: <FaFileAlt className="text-teal-500" /> }
];

// Sample content data
const SAMPLE_CONTENT = [
  {
    id: 1,
    title: 'Understanding COVID-19 Vaccine Boosters',
    type: 'article',
    author: 'Dr. Michael Chen',
    published: '2023-12-10',
    status: 'published',
    views: 2547
  },
  {
    id: 2,
    title: 'Scheduled Maintenance: January 15th',
    type: 'announcement',
    author: 'System Admin',
    published: '2023-12-15',
    status: 'scheduled',
    views: 854
  },
  {
    id: 3,
    title: 'How to Schedule a Lab Test',
    type: 'help',
    author: 'Support Team',
    published: '2023-11-28',
    status: 'published',
    views: 1267
  },
  {
    id: 4,
    title: 'What insurance plans do you accept?',
    type: 'faq',
    author: 'Support Team',
    published: '2023-11-20',
    status: 'published',
    views: 3254
  },
  {
    id: 5,
    title: 'Managing Seasonal Allergies',
    type: 'article',
    author: 'Dr. Sarah Johnson',
    published: '2023-12-05',
    status: 'draft',
    views: 0
  },
  {
    id: 6,
    title: 'New Lab Test Services Available',
    type: 'announcement',
    author: 'System Admin',
    published: '2023-12-01',
    status: 'published',
    views: 1856
  },
  {
    id: 7,
    title: 'How to Use the Symptom Checker',
    type: 'help',
    author: 'Support Team',
    published: '2023-10-15',
    status: 'published',
    views: 4253
  }
];

// Status badge component for content items
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    published: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    scheduled: 'bg-teal-100 text-teal-800 border-teal-200',
    archived: 'bg-amber-100 text-amber-800 border-amber-200'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Content type icon component
const ContentTypeIcon = ({ type }: { type: string }) => {
  const contentType = CONTENT_TYPES.find(t => t.id === type);
  if (!contentType) return null;
  
  return (
    <div className="p-2 rounded-lg bg-teal-50">
      {contentType.icon}
    </div>
  );
};

const ContentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter content based on search and filters
  const filteredContent = SAMPLE_CONTENT.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Animation variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage health articles, announcements, FAQs, and help documentation</p>
      </div>
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search content..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {CONTENT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          {/* Create New Button */}
          <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <FaPlus className="mr-2" />
            Create New
          </button>
        </div>
      </div>
      
      {/* Content Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {CONTENT_TYPES.map((type) => (
          <div key={type.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              {type.icon}
              <span className="ml-2 text-sm font-medium text-gray-700">{type.name}s</span>
            </div>
            <p className="text-2xl font-bold text-teal-600">
              {SAMPLE_CONTENT.filter(item => item.type === type.id).length}
            </p>
          </div>
        ))}
      </div>
      
      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Published
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Views
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No content found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredContent.map((content, index) => (
                  <motion.tr
                    key={content.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={listItemVariants}
                    className="hover:bg-teal-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ContentTypeIcon type={content.type} />
                        <span className="ml-2 text-sm text-gray-500">
                          {CONTENT_TYPES.find(t => t.id === content.type)?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{content.published}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={content.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-teal-600 hover:text-teal-800 transition-colors">
                          <FaEdit />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-3 bg-teal-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredContent.length} of {SAMPLE_CONTENT.length} results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement; 