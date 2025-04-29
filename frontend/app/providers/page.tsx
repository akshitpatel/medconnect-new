'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedCard from '@/app/components/ui/AnimatedCard';

export default function ProvidersPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Auto-redirect to dashboard
    router.push('/providers/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <AnimatedCard className="p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Redirecting to Provider Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">Please wait while we redirect you to the provider dashboard.</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-4">
            <div className="bg-teal-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
} 