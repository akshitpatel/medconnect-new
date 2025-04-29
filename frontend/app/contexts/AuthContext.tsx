'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '@/app/services/api';

// Define User Type
interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  profilePicture?: string;
}

// Interface for authentication errors
interface AuthError {
  message: string;
  field?: string;
}

// Define Auth Context Type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  error: string | null;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        const token = getAuthToken();
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        const response = await authAPI.getCurrentUser();
        const userData = response.data?.data?.user;
        
        if (userData) {
          setUser(userData);
        } else {
          // Invalid response format, clear token
          removeAuthToken();
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        removeAuthToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string, rememberMe = false) => {
    console.log('[LOGIN DEBUG] login() called with', { email, rememberMe });
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('[LOGIN DEBUG] Sending login request to API...');
      
      // Call the API endpoint for login
      const response = await authAPI.login({ 
        email, 
        password,
        remember_me: rememberMe
      });
      
      const data = response.data;
      
      if (data.success) {
        // Save token to local storage
        const token = data.data.token;
        setAuthToken(token);
        
        // Set user data from response
        setUser(data.data.user);
        console.log('[LOGIN DEBUG] Login successful');
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      console.error('[LOGIN DEBUG] Login error:', errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      const data = response.data;
      
      if (data.success) {
        // For registration responses that include a token
        if (data.data.token) {
          const token = data.data.token;
          setAuthToken(token);
          
          // If the backend returns user data, set it
          if (data.data.user) {
            setUser(data.data.user);
          }
          
          console.log('Registration successful:', data.message);
          return data; // Return data for potential further actions
        } else {
          throw new Error('No token received after registration');
        }
      } else {
        // Handle specific errors from backend if available
        const errorMessages = data.errors?.join(', ') || data.message || 'Registration failed';
        throw new Error(errorMessages);
      }
    } catch (error: any) {
      // Handle specific error format from your API
      const errorMsg = error.response?.data?.errors?.join(', ') || 
                      error.response?.data?.message || 
                      error.message || 
                      'Registration failed';
      
      setError(errorMsg);
      throw new Error(errorMsg); // Re-throw to allow handling in the component
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Call backend logout endpoint
      await authAPI.logout().catch((err: any) => {
        console.warn('Logout API error (continuing anyway):', err);
      });
      
      // Always clean up local state regardless of API response
      removeAuthToken();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token on error
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 