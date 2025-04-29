import React from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import { apiUrl } from '@/app/lib/api-utils';
import { FaNewspaper, FaBell, FaQuestionCircle, FaInfoCircle, FaPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa';
import Link from 'next/link';

// Define interfaces for our data types
interface ContentItem {
  _id: string;
  title: string;
  type: 'article' | 'announcement' | 'faq' | 'help';
  content: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  views: number;
  tags?: string[];
  featuredImage?: string;
  lastModified: string;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface ContentResponse {
  content: ContentItem[];
  stats: {
    articles: number;
    announcements: number;
    faqs: number;
    help: number;
    total: number;
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
  };
  pagination: {
    limit: number;
    skip: number;
    total: number;
  };
}

// Function to fetch content data from our API
async function fetchContentData(
  type?: string,
  status?: string,
  limit: number = 20,
  skip: number = 0
): Promise<{ data: ContentResponse }> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (status) queryParams.append('status', status);
    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());
    
    const response = await fetch(`${apiUrl}/admin/content?${queryParams.toString()}`, {
      cache: 'no-store', // Don't cache this API response
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch content data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching content data:', error);
    // Return fallback data if API fails
    return {
      data: {
        content: [],
        stats: {
          articles: 0,
          announcements: 0,
          faqs: 0,
          help: 0,
          total: 0,
          published: 0,
          draft: 0,
          scheduled: 0,
          archived: 0
        },
        pagination: {
          limit,
          skip,
          total: 0
        }
      }
    };
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper function to get icon for content type
function getContentTypeIcon(type: string) {
  switch (type) {
    case 'article':
      return <FaNewspaper className="text-blue-500" />;
    case 'announcement':
      return <FaBell className="text-amber-500" />;
    case 'faq':
      return <FaQuestionCircle className="text-purple-500" />;
    case 'help':
      return <FaInfoCircle className="text-teal-500" />;
    default:
      return <FaNewspaper className="text-gray-500" />;
  }
}

// Helper function to get badge color for content status
function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'archived':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export const metadata = {
  title: 'Content Management | MedConnect Admin',
  description: 'Manage articles, announcements, FAQs and help documents',
};

export default async function ContentManagementPage({
  searchParams,
}: {
  searchParams: { type?: string; status?: string; page?: string };
}) {
  // Get query parameters
  const { type, status } = searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 10;
  const skip = (page - 1) * limit;
  
  // Fetch content data
  const { data } = await fetchContentData(type, status, limit, skip);
  const { content, stats, pagination } = data;
  
  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return (
    <AdminLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
            <p className="mt-1 text-gray-500">Manage articles, announcements, FAQs and help documents</p>
          </div>
          <Link 
            href="/admin/content/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
            Create Content
          </Link>
        </div>
        
        {/* Content Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Content Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FaNewspaper className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Articles</p>
                  <p className="text-xl font-bold text-gray-800">{stats.articles}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <FaBell className="h-5 w-5 text-amber-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Announcements</p>
                  <p className="text-xl font-bold text-gray-800">{stats.announcements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FaQuestionCircle className="h-5 w-5 text-purple-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">FAQs</p>
                  <p className="text-xl font-bold text-gray-800">{stats.faqs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <FaInfoCircle className="h-5 w-5 text-teal-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Help Docs</p>
                  <p className="text-xl font-bold text-gray-800">{stats.help}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Published</p>
                  <p className="text-xl font-bold text-green-600">{stats.published}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Drafts</p>
                  <p className="text-xl font-bold text-gray-600">{stats.draft}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Scheduled</p>
                  <p className="text-xl font-bold text-blue-600">{stats.scheduled}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Archived</p>
                  <p className="text-xl font-bold text-red-600">{stats.archived}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <FaFilter className="mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter Content:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/admin/content"
                className={`px-3 py-1 text-sm rounded-full ${!type && !status ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                All
              </Link>
              
              <Link 
                href="/admin/content?type=article"
                className={`px-3 py-1 text-sm rounded-full ${type === 'article' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Articles
              </Link>
              
              <Link 
                href="/admin/content?type=announcement"
                className={`px-3 py-1 text-sm rounded-full ${type === 'announcement' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Announcements
              </Link>
              
              <Link 
                href="/admin/content?type=faq"
                className={`px-3 py-1 text-sm rounded-full ${type === 'faq' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                FAQs
              </Link>
              
              <Link 
                href="/admin/content?type=help"
                className={`px-3 py-1 text-sm rounded-full ${type === 'help' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Help Docs
              </Link>
              
              <Link 
                href="/admin/content?status=published"
                className={`px-3 py-1 text-sm rounded-full ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Published
              </Link>
              
              <Link 
                href="/admin/content?status=draft"
                className={`px-3 py-1 text-sm rounded-full ${status === 'draft' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Drafts
              </Link>
            </div>
          </div>
        </div>
        
        {/* Content Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {content.length > 0 ? (
                  content.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {getContentTypeIcon(item.type)}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">{item.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.lastModified)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/content/${item._id}/view`} className="text-teal-600 hover:text-teal-900">
                            <FaEye />
                          </Link>
                          <Link href={`/admin/content/${item._id}/edit`} className="text-blue-600 hover:text-blue-900">
                            <FaEdit />
                          </Link>
                          <Link href={`/admin/content/${item._id}/delete`} className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No content items found. {type || status ? (
                        <Link href="/admin/content" className="text-teal-600 hover:text-teal-900">
                          Clear filters
                        </Link>
                      ) : (
                        <Link href="/admin/content/new" className="text-teal-600 hover:text-teal-900">
                          Create your first content item
                        </Link>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Link
                  href={`/admin/content?${new URLSearchParams({
                    ...(type && { type }),
                    ...(status && { status }),
                    page: Math.max(1, page - 1).toString(),
                  })}`}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </Link>
                <Link
                  href={`/admin/content?${new URLSearchParams({
                    ...(type && { type }),
                    ...(status && { status }),
                    page: Math.min(totalPages, page + 1).toString(),
                  })}`}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pagination.skip + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.skip + pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Link
                      href={`/admin/content?${new URLSearchParams({
                        ...(type && { type }),
                        ...(status && { status }),
                        page: '1',
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">First</span>
                      <span>First</span>
                    </Link>
                    
                    <Link
                      href={`/admin/content?${new URLSearchParams({
                        ...(type && { type }),
                        ...(status && { status }),
                        page: Math.max(1, page - 1).toString(),
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">Previous</span>
                      <span>Prev</span>
                    </Link>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to show
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/admin/content?${new URLSearchParams({
                            ...(type && { type }),
                            ...(status && { status }),
                            page: pageNum.toString(),
                          })}`}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            page === pageNum
                              ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                    
                    <Link
                      href={`/admin/content?${new URLSearchParams({
                        ...(type && { type }),
                        ...(status && { status }),
                        page: Math.min(totalPages, page + 1).toString(),
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">Next</span>
                      <span>Next</span>
                    </Link>
                    
                    <Link
                      href={`/admin/content?${new URLSearchParams({
                        ...(type && { type }),
                        ...(status && { status }),
                        page: totalPages.toString(),
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="sr-only">Last</span>
                      <span>Last</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 