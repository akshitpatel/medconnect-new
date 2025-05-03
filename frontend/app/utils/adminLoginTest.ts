import { authAPI, setAuthToken, getAuthToken } from '@/app/services/api';

/**
 * Utility to test admin login functionality
 * This helps diagnose authentication issues
 */
export const testAdminLogin = async () => {
  console.log('Testing admin login...');
  
  try {
    // Clear any existing token
    localStorage.removeItem('auth_token');
    console.log('Existing token cleared');
    
    // Attempt login with admin credentials
    const response = await authAPI.login({
      email: 'admin@medconnect.com',
      password: 'password',
      remember_me: true
    });
    
    console.log('Admin login response:', response.data);
    
    // Extract token from response
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
      // Save token to local storage
      setAuthToken(token);
      console.log('Admin login successful - token saved:', token.substring(0, 15) + '...');
      
      // Try to get the current token to verify it was saved
      const savedToken = getAuthToken();
      console.log('Saved token verification:', savedToken ? 'Present' : 'Missing');
      
      // Show the decoded payload
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        console.log('Token payload:', payload);
      } catch (e) {
        console.error('Failed to decode token:', e);
      }
      
      return {
        success: true,
        token,
        user: data.data?.user || data.user
      };
    } else {
      console.error('Admin login failed - no token in response');
      return {
        success: false,
        error: 'No token in response'
      };
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
