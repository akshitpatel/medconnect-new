import { 
  authAPI, 
  patientAPI, 
  providerAPI, 
  adminAPI 
} from './api';
import {
  handleApiResponse,
  handlePaginatedResponse,
  transformPatientProfile,
  transformAppointment,
  transformMedication,
  transformMessage,
  extractListData
} from '../utils/api-response-handler';

/**
 * Enhanced API Service with better error handling and data transformation
 */

// Enhanced Authentication API
export const enhancedAuthAPI = {
  login: async (credentials: { email: string; password: string; remember_me?: boolean }) => {
    try {
      const response = await authAPI.login(credentials);
      const result = handleApiResponse(response, 'data');
      
      if (result.success && result.data) {
        // Store the token
        const token = (result.data as any).token;
        if (token) {
          localStorage.setItem('auth_token', token);
        }
        return { success: true, data: result.data, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Login failed') 
      };
    }
  },

  register: async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      const result = handleApiResponse(response, 'data');
      
      if (result.success && result.data) {
        // Store the token
        const token = (result.data as any).token;
        if (token) {
          localStorage.setItem('auth_token', token);
        }
        return { success: true, data: result.data, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Registration failed') 
      };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      return { success: true, error: null };
    } catch (error) {
      // Even if logout fails, remove the token locally
      localStorage.removeItem('auth_token');
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Logout failed') 
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const result = handleApiResponse(response, 'data');
      
      if (result.success && result.data) {
        return { success: true, data: result.data, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to get user data') 
      };
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      const result = handleApiResponse(response);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to send password reset') 
      };
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      const result = handleApiResponse(response);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to reset password') 
      };
    }
  }
};

// Enhanced Patient API
export const enhancedPatientAPI = {
  getProfile: async () => {
    try {
      const response = await patientAPI.getProfile();
      const result = handleApiResponse(response, 'profile');
      
      if (result.success && result.data) {
        const transformedProfile = transformPatientProfile(result.data);
        return { success: true, data: transformedProfile, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to load profile') 
      };
    }
  },

  updateProfile: async (profileData: any) => {
    try {
      const response = await patientAPI.updateProfile(profileData);
      const result = handleApiResponse(response, 'profile');
      
      if (result.success && result.data) {
        const transformedProfile = transformPatientProfile(result.data);
        return { success: true, data: transformedProfile, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to update profile') 
      };
    }
  },

  getAppointments: async (filters = {}) => {
    try {
      const response = await patientAPI.getAppointments(filters);
      const result = handlePaginatedResponse(response, 'appointments');
      
      if (result.success) {
        const transformedAppointments = result.data.map(transformAppointment).filter(Boolean);
        return { 
          success: true, 
          data: transformedAppointments, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load appointments') 
      };
    }
  },

  createAppointment: async (appointmentData: any) => {
    try {
      const response = await patientAPI.createAppointment(appointmentData);
      const result = handleApiResponse(response, 'appointment');
      
      if (result.success && result.data) {
        const transformedAppointment = transformAppointment(result.data);
        return { success: true, data: transformedAppointment, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to create appointment') 
      };
    }
  },

  getMedications: async (filters = {}) => {
    try {
      const response = await patientAPI.getMedications(filters);
      const result = handlePaginatedResponse(response, 'medications');
      
      if (result.success) {
        const transformedMedications = result.data.map(transformMedication).filter(Boolean);
        return { 
          success: true, 
          data: transformedMedications, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load medications') 
      };
    }
  },

  requestRefill: async (medicationId: string) => {
    try {
      const response = await patientAPI.requestRefill(medicationId);
      const result = handleApiResponse(response);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to request refill') 
      };
    }
  },

  getMessages: async () => {
    try {
      const response = await patientAPI.getMessages();
      const result = handlePaginatedResponse(response, 'messages');
      
      if (result.success) {
        const transformedMessages = result.data.map(transformMessage).filter(Boolean);
        return { 
          success: true, 
          data: transformedMessages, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load messages') 
      };
    }
  },

  sendMessage: async (conversationId: string, messageData: any) => {
    try {
      const response = await patientAPI.sendMessage(conversationId, messageData);
      const result = handleApiResponse(response, 'message');
      
      if (result.success && result.data) {
        const transformedMessage = transformMessage(result.data);
        return { success: true, data: transformedMessage, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to send message') 
      };
    }
  }
};

// Enhanced Provider API
export const enhancedProviderAPI = {
  getDashboard: async () => {
    try {
      const response = await providerAPI.getAppointments();
      const result = handleApiResponse(response, 'dashboard');
      
      if (result.success && result.data) {
        return { success: true, data: result.data, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to load dashboard') 
      };
    }
  },

  getAppointments: async (filters = {}) => {
    try {
      const response = await providerAPI.getAppointments(filters);
      const result = handlePaginatedResponse(response, 'appointments');
      
      if (result.success) {
        const transformedAppointments = result.data.map(transformAppointment).filter(Boolean);
        return { 
          success: true, 
          data: transformedAppointments, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load appointments') 
      };
    }
  },

  getPatients: async () => {
    try {
      const response = await providerAPI.getPatients();
      const result = handlePaginatedResponse(response, 'patients');
      
      if (result.success) {
        return { 
          success: true, 
          data: result.data, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load patients') 
      };
    }
  }
};

// Enhanced Admin API
export const enhancedAdminAPI = {
  getUsers: async (filters = {}) => {
    try {
      const response = await adminAPI.getUsers(filters);
      const result = handlePaginatedResponse(response, 'users');
      
      if (result.success) {
        return { 
          success: true, 
          data: result.data, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load users') 
      };
    }
  },

  getProviders: async (filters = {}) => {
    try {
      const response = await adminAPI.getProviders(filters);
      const result = handlePaginatedResponse(response, 'providers');
      
      if (result.success) {
        return { 
          success: true, 
          data: result.data, 
          pagination: result.pagination,
          error: null 
        };
      } else {
        return { success: false, data: [], pagination: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: [], 
        pagination: null,
        error: error instanceof Error ? error : new Error('Failed to load providers') 
      };
    }
  },

  updateUser: async (userId: string, userData: any) => {
    try {
      const response = await adminAPI.updateUser(userId, userData);
      const result = handleApiResponse(response, 'user');
      
      if (result.success && result.data) {
        return { success: true, data: result.data, error: null };
      } else {
        return { success: false, data: null, error: result.error };
      }
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to update user') 
      };
    }
  },

  deleteUser: async (userId: string) => {
    try {
      const response = await adminAPI.deleteUser(userId);
      const result = handleApiResponse(response);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to delete user') 
      };
    }
  }
};