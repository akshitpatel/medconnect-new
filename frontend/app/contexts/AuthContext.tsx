'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken, parseJwtToken } from '@/app/services/api';

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
  updateUserProfile: (updatedUser: User) => void;
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
        
        // Try to get current user details
        const response = await authAPI.getCurrentUser();
        console.log('[AUTH] Current user response:', response.data);
        
        // Handle various response formats
        let userData = null;
        
        if (response.data?.data?.user) {
          // Format 1: {data: {user: {...}}}
          userData = response.data.data.user;
        } else if (response.data?.user) {
          // Format 2: {user: {...}}
          userData = response.data.user;
        } else if (response.data && typeof response.data === 'object' && response.data.id) {
          // Format 3: Direct user object
          userData = response.data;
        }
        
        if (userData) {
          setUser(userData);
        } else {
          // No valid user data, try to extract from token
          try {
            const decodedToken = parseJwtToken(token);
            if (decodedToken && (decodedToken.sub || decodedToken.user_id)) {
              // Basic user info from token
              const tokenUserId = decodedToken.sub || decodedToken.user_id;
              const tokenEmail = decodedToken.email;
              
              if (tokenUserId) {
                // Create minimal user object from token
                setUser({
                  id: tokenUserId.toString(),
                  email: tokenEmail || 'unknown@example.com',
                  fullName: decodedToken.name || tokenEmail?.split('@')[0] || 'User',
                  role: decodedToken.role || 'patient'
                });
                return;
              }
            }
            
            // If we get here, we couldn't extract valid user data
            console.warn('Could not extract user data from token');
            removeAuthToken();
            setUser(null);
          } catch (tokenError) {
            console.error('Failed to parse token:', tokenError);
            removeAuthToken();
            setUser(null);
          }
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
      console.log('[AUTH] Login response:', data);
      
      // Handle different response formats from Rails backend
      // Format 1: {success: true, data: {token: '...', user: {...}}}
      // Format 2: {token: '...', user: {...}}
      // Format 3: {authentication_token: '...', user: {...}}
      // Format 4: {jwt: '...', user: {...}}
      // Format 5 (Rails): {success: true, data: {token: '...', user: {...}}} - from auth_controller.rb
      
      let token = null;
      let userData = null;
      
      console.log('[AUTH] Parsing login response format:', data);
      
      if (data.success && data.data?.token) {
        // Format 1 or Format 5 (Rails)
        token = data.data.token;
        userData = data.data.user;
      } else if (data.token) {
        // Format 2
        token = data.token;
        userData = data.user;
      } else if (data.authentication_token) {
        // Format 3 - Rails Devise token auth
        token = data.authentication_token;
        userData = data.user || data;
      } else if (data.jwt) {
        // Format 4 - Rails JWT format
        token = data.jwt;
        userData = data.user;
      } else if (data.success && data.data) {
        // Try to extract from Rails API response shape, auth_controller.rb uses 'warden-jwt_auth.token'
        token = data.data?.token;
        userData = data.data?.user;
      }
      
      if (token) {
        // Save token to local storage
        setAuthToken(token);
        
        // If user data is in the response, use that
        if (userData) {
          setUser(userData);
        } else {
          // If no user data in response, try to extract from JWT token
          const decodedToken = parseJwtToken(token);
          if (decodedToken && decodedToken.sub) {
            // Get user data from the API
            try {
              const userResponse = await authAPI.getCurrentUser();
              if (userResponse.data?.user) {
                setUser(userResponse.data.user);
              } else if (userResponse.data) {
                setUser(userResponse.data);
              }
            } catch (userError) {
              console.error('Failed to fetch user data after login:', userError);
            }
          }
        }
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
      console.log('[AUTH] Registration attempt with data:', userData);
      const response = await authAPI.register(userData);
      const data = response.data;
      console.log('[AUTH] Registration response:', data);
      
      // Check for Rails success response format first
      if (data.success === true && data.data) {
        // Rails successful registration format
        if (data.data.token) {
          const token = data.data.token;
          setAuthToken(token);
          
          // If the backend returns user data, set it
          if (data.data.user) {
            setUser(data.data.user);
          }
          
          console.log('Registration successful:', data.message);
          return data; // Return data for potential further actions
        }
      } else if (data.token) {
        // Legacy format
        const token = data.token;
        setAuthToken(token);
        
        if (data.user) {
          setUser(data.user);
        }
        
        console.log('Registration successful (legacy format)');
        return data;
      } else if (data.success === false && data.errors) {
        // Rails error format
        const errorMessages = Array.isArray(data.errors) ? data.errors.join(', ') : data.errors;
        console.error('Registration failed with errors:', errorMessages);
        throw new Error(errorMessages);
      } else {
        // Unknown response format
        console.error('Unknown registration response format:', data);
        throw new Error('Registration failed: Unexpected response format');
      }
    } catch (error: any) {
      // Enhanced error handling for various API response formats
      console.error('[AUTH] Registration error:', error);
      
      // Check for Rails API specific error format first
      if (error.response?.data?.success === false && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMsg = Array.isArray(errors) ? errors.join(', ') : errors.toString();
        setError(errorMsg);
        throw new Error(errorMsg);
      } else {
        // Fall back to more generic error formats
        const errorMsg = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Registration failed';
        
        setError(errorMsg);
        throw new Error(errorMsg); // Re-throw to allow handling in the component
      }
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
  
  // Method to update user profile data
  const updateUserProfile = (updatedUser: User) => {
    console.log('Updating user profile in AuthContext:', updatedUser);
    setUser(updatedUser);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
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