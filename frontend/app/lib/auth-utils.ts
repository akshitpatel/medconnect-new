// User interface
export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  [key: string]: any;
}

// JWT Token interface - basic structure for development purposes
// The actual verification will happen on the backend
export interface JwtPayload {
  id?: string;
  user_id?: string;
  userId?: string;
  email?: string;
  role?: string;
  exp?: number;
}

// Token storage and retrieval methods
// These functions are client-safe

/**
 * Store a JWT token in local storage
 */
export const storeToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('healcard_token', token);
    console.log('[AUTH] Token stored in localStorage');
  }
};

/**
 * Remove the stored JWT token
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('healcard_token');
    console.log('[AUTH] Token removed from localStorage');
  }
};

/**
 * Get the stored JWT token
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('healcard_token');
  }
  return null;
};

/**
 * Check if a user is logged in (has a token)
 */
export const isLoggedIn = (): boolean => {
  return getToken() !== null;
};

/**
 * Function to extract basic information from a JWT without verification
 * This is just for displaying user info after login, the actual verification happens on the backend
 */
export const extractTokenInfo = (token: string): JwtPayload | null => {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[AUTH] Invalid token format');
      return null;
    }
    
    // Base64Url decode the payload (middle part)
    const payload = parts[1];
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4); // Add padding if needed
    const decoded = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
    
    console.log('[AUTH] Token info extracted (not verified)');
    return decoded as JwtPayload;
  } catch (error) {
    console.error('[AUTH] Error extracting token info:', error);
    return null;
  }
};

/**
 * Make an authenticated API request (adds the Authorization header)
 */
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  
  return fetch(url, {
    ...options,
    headers
  });
};

/**
 * Check if the user is authenticated with the backend
 * This makes an actual API call to verify the token
 */
export const checkAuthStatus = async (): Promise<{authenticated: boolean, user?: any}> => {
  try {
    const token = getToken();
    if (!token) {
      return { authenticated: false };
    }
    
    // API URL for the backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Call the backend auth verification endpoint
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return { authenticated: true, user: data.user };
    } else {
      // If the token is invalid, clear it
      removeToken();
      return { authenticated: false };
    }
  } catch (error) {
    console.error('[AUTH] Error checking auth status:', error);
    return { authenticated: false };
  }
};

/**
 * Logout function - clears token and redirects to login
 */
export const logout = (): void => {
  removeToken();
  // Optionally call a logout endpoint on your backend if you need to invalidate the token server-side
  window.location.href = '/auth/login';
};

/**
 * Get current user information from token
 * @returns User information extracted from token
 */
export const getCurrentUser = (): JwtPayload | null => {
  const authToken = getToken();
  
  if (!authToken) {
    return null;
  }
  
  return extractTokenInfo(authToken);
};

/**
 * Remove sensitive data from user object
 */
export const sanitizeUser = (user: any): UserData => {
  const sanitized = { ...user };
  delete sanitized.password;
  delete sanitized.__v;
  return sanitized as UserData;
}; 