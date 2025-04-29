import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

// Create context for authentication
const AuthContext = createContext(null);

// Authentication provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch current user data
  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
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
    } catch (err) {
      console.error('Error fetching current user:', err);
      setError('Failed to fetch user data');
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { token, user: userData } = response.data?.data || {};
      
      if (token && userData) {
        setAuthToken(token);
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data?.data || {};
      
      if (token && newUser) {
        setAuthToken(token);
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call backend logout endpoint
      await authAPI.logout().catch(err => {
        console.warn('Logout API error (continuing anyway):', err);
      });
      
      // Always clean up local state regardless of API response
      removeAuthToken();
      setUser(null);
      router.push('/auth/login');
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      // Still remove token on error
      removeAuthToken();
      setUser(null);
      return { success: true }; // Consider logout successful even if API fails
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on initial load and token changes
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Expose the auth context
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUser: fetchCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [loading, isAuthenticated, router, redirectTo]);

  return { user, loading, isAuthenticated };
}
