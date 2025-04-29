'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProviderRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the dashboard page
    router.push('/provider/dashboard');
  }, [router]);
  
  // Return a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Redirecting...</h2>
        <p className="text-gray-500 dark:text-gray-400">Taking you to your dashboard</p>
      </div>
    </div>
  );
} 