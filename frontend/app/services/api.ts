import axios from 'axios';

// Base API URL - centralized configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Development helpers
const isDev = process.env.NODE_ENV !== 'production';
const logApiRequests = isDev;
const logApiResponses = isDev;

/**
 * Get the JWT token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('auth_token');
};

/**
 * Parse and decode a JWT token to get user information
 * @param {string} token - The JWT token to decode
 * @returns {any} The decoded token payload or null if invalid
 */
export const parseJwtToken = (token: string): any => {
  try {
    // JWT tokens are three parts separated by dots: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};

/**
 * Store the JWT token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Remove the JWT token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the JWT token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log API requests in development
    if (logApiRequests) {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, 
                 config.params ? `
Params: ${JSON.stringify(config.params)}` : '',
                 config.data ? `
Data: ${JSON.stringify(config.data)}` : '');
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log API responses in development
    if (logApiResponses) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
                 `
Status: ${response.status}`,
                 `
Data: ${JSON.stringify(response.data)}`);
    }
    return response;
  },
  (error) => {
    // Log detailed API errors
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
                 `
Status: ${error.response?.status || 'Network Error'}`,
                 `
Data: ${JSON.stringify(error.response?.data || error.message)}`);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Authentication error detected, redirecting to login');
      removeAuthToken();
      // Handle redirect to login in a way that works with Next.js
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication// Auth endpoints with flexible payload structures for Rails backend compatibility
export const authAPI = {
  /**
   * Authenticate user and get JWT token
   * @param credentials User credentials including email and password
   * @returns Promise with authentication response
   */
  login: (credentials: { email: string; password: string; remember_me?: boolean }) => {
    // Rails Devise typically expects either {user: credentials} or direct parameters
    // Try the Rails conventional format first
    return apiClient.post('/auth/login', { user: credentials });
  },
  
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with registration response
   */
  register: (userData: any) => {
    // Rails typically expects {user: userData}
    return apiClient.post('/auth/register', { user: userData });
  },
  
  /**
   * Log out the current user (invalidate token)
   * @returns Promise with logout response
   */
  logout: () => apiClient.delete('/auth/logout'),
  
  /**
   * Get current authenticated user information
   * @returns Promise with user information
   */
  getCurrentUser: () => apiClient.get('/auth/me'),
  
  /**
   * Request password reset for a user
   * @param email User's email address
   * @returns Promise with reset request response
   */
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { user: { email } }),
  
  /**
   * Reset password with provided token
   * @param token Password reset token
   * @param newPassword New password
   * @returns Promise with password reset response
   */
  resetPassword: (token: string, newPassword: string) => 
    apiClient.post('/auth/reset-password', { 
      user: {
        reset_password_token: token,
        password: newPassword,
        password_confirmation: newPassword
      }
    })
};

// Patient API Endpoints
export const patientAPI = {
  // Profile
  getProfile: () => apiClient.get('/patients/profile'),
  updateProfile: (profileData: any) => apiClient.put('/patients/profile', profileData),
  
  // Appointments
  getAppointments: (filters = {}) => apiClient.get('/patients/appointments', { params: filters }),
  getAppointment: (id: string) => apiClient.get(`/patients/appointments/${id}`),
  createAppointment: (appointmentData: any) => apiClient.post('/patients/appointments', { appointment: appointmentData }),
  updateAppointment: (id: string, appointmentData: any) => apiClient.put(`/patients/appointments/${id}`, { appointment: appointmentData }),
  cancelAppointment: (id: string) => apiClient.delete(`/patients/appointments/${id}`),
  
  // Medications
  getMedications: (filters = {}) => apiClient.get('/patients/medications', { params: filters }),
  getMedication: (id: string) => apiClient.get(`/patients/medications/${id}`),
  requestRefill: (id: string) => apiClient.post(`/patients/medications/${id}/refill`),
  
  // Medical Records
  getMedicalRecords: (filters = {}) => apiClient.get('/patients/records', { params: filters }),
  getMedicalRecord: (id: string) => apiClient.get(`/patients/records/${id}`),
  
  // Messages
  getMessages: () => apiClient.get('/patients/messages'),
  getConversations: () => apiClient.get('/patients/conversations'),
  getConversation: (id: string) => apiClient.get(`/patients/conversations/${id}`),
  sendMessage: (conversationId: string, messageData: any) => apiClient.post(`/patients/conversations/${conversationId}/messages`, { message: messageData }),
  startConversation: (providerId: string, messageData: any) => apiClient.post('/patients/conversations', { provider_id: providerId, message: messageData }),
};

// Provider API Endpoints
export const providerAPI = {
  getAppointments: (filters = {}) => apiClient.get('/providers/appointments', { params: filters }),
  getAppointment: (id: string) => apiClient.get(`/providers/appointments/${id}`),
  updateAppointment: (id: string, appointmentData: any) => apiClient.put(`/providers/appointments/${id}`, { appointment: appointmentData }),
  cancelAppointment: (id: string) => apiClient.delete(`/providers/appointments/${id}`),
  
  // Patient Records
  getPatients: () => apiClient.get('/providers/patients'),
  getPatientRecords: (patientId: string) => apiClient.get(`/providers/patients/${patientId}/records`),
  addMedicalRecord: (patientId: string, recordData: any) => apiClient.post(`/providers/patients/${patientId}/records`, { record: recordData }),
  
  // Messages
  getConversations: () => apiClient.get('/providers/messages'),
  getConversation: (id: string) => apiClient.get(`/providers/messages/${id}`),
  sendMessage: (conversationId: string, messageData: any) => apiClient.post(`/providers/messages/${conversationId}`, { message: messageData }),
};

// Admin API Endpoints
export const adminAPI = {
  // User management
  getUsers: (filters = {}) => apiClient.get('/admin/users', { params: filters }),
  getUser: (id: string) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, userData: any) => apiClient.put(`/admin/users/${id}`, { user: userData }),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  
  // Provider management - generic endpoints
  getProviders: (filters = {}) => apiClient.get('/admin/providers', { params: filters }),
  getProvider: (id: string) => apiClient.get(`/admin/providers/${id}`),
  updateProvider: (id: string, providerData: any) => apiClient.put(`/admin/providers/${id}`, { provider: providerData }),
  deleteProvider: (id: string) => apiClient.delete(`/admin/providers/${id}`),
  verifyProvider: (id: string) => apiClient.post(`/admin/providers/${id}/verify`),
  
  // Provider type-specific endpoints - these map to the same backend controllers with type filters
  getHospitals: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'hospital', ...filters } }),
  getDoctors: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'doctor', ...filters } }),
  getDiagnosticCenters: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'diagnostic', ...filters } }),
  getLabs: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'lab', ...filters } }),
  getImagingCenters: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'imaging', ...filters } }),
  getPharmacies: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'pharmacy', ...filters } }),
  getInsuranceProviders: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'insurance', ...filters } }),
  getHomeServices: (filters = {}) => apiClient.get('/admin/providers', { params: { provider_type: 'homeservice', ...filters } }),
  
  // Unified search endpoint
  unifiedSearch: (query: string, filters = {}) => 
    apiClient.get('/admin/unified_search', { params: { query, ...filters } }),
  
  // System Statistics 
  getSystemStats: () => apiClient.get('/admin/statistics'),
  getAuditLogs: (filters = {}) => apiClient.get('/admin/audit_logs', { params: filters }),
};

export default apiClient;