'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ModernDashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main dashboard
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Redirecting to Dashboard...</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Please wait while we redirect you to the main dashboard.</p>
    </div>
  );
} 