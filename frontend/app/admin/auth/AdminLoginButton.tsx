'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { authAPI, setAuthToken } from '@/app/services/api';

/**
 * A specialized login button component for admin authentication
 * Provides direct login capability to streamline admin access
 */
export default function AdminLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Attempt login with admin credentials from our seed data
      console.log('Attempting admin login...');
      const response = await authAPI.login({
        email: 'admin@medconnect.com',
        password: 'password',
        remember_me: true
      });
      
      console.log('Login response:', response.data);
      
      // Extract token based on response format
      let token = null;
      const data = response.data;
      
      if (data.success && data.data?.token) {
        token = data.data.token;
      } else if (data.token) {
        token = data.token;
      } else if (data.authentication_token) {
        token = data.authentication_token;
      } else if (data.jwt) {
        token = data.jwt;
      }
      
      if (token) {
        // Save token to localStorage
        setAuthToken(token);
        setSuccess(true);
        
        // Redirect to admin dashboard or providers page
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh(); // Force refresh to update auth state
        }, 1000);
      } else {
        setError('Authentication failed - No token received');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 text-sm">Login successful! Redirecting...</p>
        </div>
      )}
      
      <Button 
        onClick={handleAdminLogin}
        disabled={isLoading || success}
        className="w-full bg-teal-600 hover:bg-teal-700"
      >
        {isLoading ? 'Logging in...' : 'Admin Quick Login'}
      </Button>
      
      <p className="mt-2 text-sm text-gray-500 text-center">
        Uses admin@medconnect.com / password
      </p>
    </div>
  );
}
