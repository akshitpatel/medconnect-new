/**
 * Authentication utilities for API routes
 */

/**
 * Get the authentication token from cookies or headers
 * This is used by API routes to forward the token to the backend
 */
export const getAuthToken = (): string | null => {
  // For server-side API routes, we need to get the token from cookies or headers
  // In a real implementation, this would extract the token from cookies or headers
  // For now, we'll return a mock token for development
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser environment, get token from localStorage
    return localStorage.getItem('auth_token');
  }
  
  // For development, let's use a hardcoded token that bypasses authentication
  // In a real app, we would extract this from cookies or headers
  // For the dashboard to work in development mode, we'll modify our service to use mock data
  // instead of trying to authenticate with an invalid token
  return null;
};

/**
 * Set the authentication token in cookies or localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Remove the authentication token
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Check if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_token');
  }
  return false;
};
