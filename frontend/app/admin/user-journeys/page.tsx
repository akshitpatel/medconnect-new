import React from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import UserJourneysAnalytics from '@/app/components/admin/UserJourneysAnalytics';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'User Journeys | Admin',
  description: 'Track and analyze user journeys and interactions',
};

async function fetchJourneyData() {
  try {
    // In a production app, you would use the server host to fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    
    // Fetch journey stats
    const statsResponse = await fetch(`${baseUrl}/api/admin/user-journeys?stats=true`, {
      cache: 'no-store'
    });
    if (!statsResponse.ok) throw new Error('Failed to fetch journey stats');
    const statsData = await statsResponse.json();
    
    // Fetch recent journeys
    const journeysResponse = await fetch(`${baseUrl}/api/admin/user-journeys?limit=10&skip=0`, {
      cache: 'no-store'
    });
    if (!journeysResponse.ok) throw new Error('Failed to fetch journeys');
    const journeysData = await journeysResponse.json();
    
    return {
      stats: statsData.stats,
      journeys: journeysData.journeys || [],
      total: journeysData.total || 0
    };
  } catch (error) {
    console.error('Error pre-fetching journey data:', error);
    return {
      stats: null,
      journeys: [],
      total: 0
    };
  }
}

export default async function UserJourneysPage() {
  // In a real app, you would check if the user is authenticated and is an admin
  const session = await getServerSession();
  
  // DEVELOPMENT ONLY: Bypass authentication check
  // REMOVE THIS IN PRODUCTION
  // if (!session) {
  //   redirect('/api/auth/signin');
  // }
  
  // For a real app with proper role management
  // if (!session || !session.user || session.user.role !== 'admin') {
  //   redirect('/');
  // }
  
  // Pre-fetch initial data for SSR
  const initialData = await fetchJourneyData();
  
  return (
    <AdminLayout>
      <div className="px-4 py-6">
        <UserJourneysAnalytics initialData={initialData} />
      </div>
    </AdminLayout>
  );
} 