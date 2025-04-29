import React from 'react';
import SymptomTrackerDashboard from '@/app/components/admin/SymptomTrackerDashboard';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/app/components/admin/AdminLayout';

export const metadata = {
  title: 'Symptom Tracker Dashboard | Admin',
  description: 'View and analyze symptom checker usage data',
};

export default async function SymptomTrackerPage() {
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
  
  return (
    <AdminLayout>
      <div className="px-4 py-6">
        <SymptomTrackerDashboard />
      </div>
    </AdminLayout>
  );
} 