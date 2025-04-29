'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This is a redirect page that will send users to the appropriate dashboard
 * based on their role (patient or provider)
 */
export default function DashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // In a real application, this would check the user's role from authentication context
    // For now, we'll redirect to the patient dashboard as default
    
    // Simulating user role check
    const checkUserRoleAndRedirect = () => {
      // This would normally be fetched from your auth context or API
      // For demo purposes, we'll default to patient
      const isProvider = false; // Set to true to redirect to provider dashboard
      
      if (isProvider) {
        router.push('/provider/dashboard');
      } else {
        router.push('/patient/dashboard');
      }
    };
    
    // Add a small delay to show the loading state (optional)
    const redirectTimer = setTimeout(() => {
      checkUserRoleAndRedirect();
    }, 500);
    
    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h2>
        <p className="text-gray-600 mb-4">You are being redirected to your dashboard.</p>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className="bg-teal-500 h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
} 