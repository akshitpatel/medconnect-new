import axios from 'axios';

// Base API URL - centralized configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Get the JWT token from localStorage
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('healcard_token');
  }
  return null;
};

/**
 * Store the JWT token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('healcard_token', token);
  }
};

/**
 * Remove the JWT token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('healcard_token');
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
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error?.response?.data || error.message);
    
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

// Authentication API Endpoints
export const authAPI = {
  register: (userData: any) => apiClient.post('/auth/register', { user: userData }),
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.delete('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
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
  getUsers: (filters = {}) => apiClient.get('/admin/users', { params: filters }),
  getUser: (id: string) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, userData: any) => apiClient.put(`/admin/users/${id}`, { user: userData }),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  
  // System Statistics 
  getSystemStats: () => apiClient.get('/admin/statistics'),
  getAuditLogs: (filters = {}) => apiClient.get('/admin/audit_logs', { params: filters }),
};

export default apiClient;