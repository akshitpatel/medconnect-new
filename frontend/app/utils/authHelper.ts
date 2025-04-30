import { authAPI, setAuthToken, getAuthToken } from '@/app/services/api';

/**
 * Helper function for direct admin login
 * This is especially useful for development and testing
 */
export const loginAdmin = async () => {
  try {
    // Use the admin credentials from our seeds file
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
      setAuthToken(token);
      console.log('Admin login successful, token saved');
      return true;
    } else {
      console.error('Admin login failed - no token in response');
      return false;
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
