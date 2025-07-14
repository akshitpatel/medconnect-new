/**
 * API Response Handler Utility
 * 
 * This utility handles different response formats from the Rails backend
 * and provides consistent data extraction for the frontend.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  code?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
}

/**
 * Extract data from API response with multiple format support
 */
export function extractApiData<T>(response: any): T | null {
  if (!response || !response.data) {
    return null;
  }

  const data = response.data;

  // Format 1: Rails standard format { success: true, data: { ... } }
  if (data.success === true && data.data) {
    return data.data;
  }

  // Format 2: Direct data object { data: { ... } }
  if (data.data) {
    return data.data;
  }

  // Format 3: Direct response { ... }
  return data;
}

/**
 * Extract list data from API response
 */
export function extractListData<T>(response: any, key?: string): T[] {
  const data = extractApiData(response);
  
  if (!data) {
    return [];
  }

  // If key is provided, look for that specific key
  if (key && typeof data === 'object' && data[key] && Array.isArray(data[key])) {
    return data[key];
  }

  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data;
  }

  // Look for common array keys
  const commonKeys = ['items', 'results', 'list', 'data', 'users', 'patients', 'providers', 'appointments', 'medications', 'messages', 'records'];
  
  for (const commonKey of commonKeys) {
    if (typeof data === 'object' && data[commonKey] && Array.isArray(data[commonKey])) {
      return data[commonKey];
    }
  }

  return [];
}

/**
 * Extract pagination data from API response
 */
export function extractPaginationData(response: any) {
  const data = extractApiData(response);
  
  if (!data || typeof data !== 'object' || !('pagination' in data)) {
    return null;
  }

  return (data as any).pagination;
}

/**
 * Extract error messages from API response
 */
export function extractErrorMessages(response: any): string[] {
  if (!response || !response.data) {
    return ['Unknown error occurred'];
  }

  const data = response.data;

  // Format 1: { success: false, errors: [...] }
  if (data.errors && Array.isArray(data.errors)) {
    return data.errors;
  }

  // Format 2: { success: false, error: "message" }
  if (data.error) {
    return [data.error];
  }

  // Format 3: { message: "error message" }
  if (data.message) {
    return [data.message];
  }

  return ['Unknown error occurred'];
}

/**
 * Check if API response indicates success
 */
export function isApiSuccess(response: any): boolean {
  if (!response || !response.data) {
    return false;
  }

  const data = response.data;

  // Rails format: { success: true/false }
  if (typeof data.success === 'boolean') {
    return data.success;
  }

  // If no success field, check HTTP status
  return response.status >= 200 && response.status < 300;
}

/**
 * Create a standardized error object
 */
export function createApiError(response: any, fallbackMessage = 'API request failed'): Error {
  const errorMessages = extractErrorMessages(response);
  const message = errorMessages.length > 0 ? errorMessages[0] : fallbackMessage;
  
  const error = new Error(message);
  (error as any).status = response?.status;
  (error as any).response = response;
  (error as any).errors = errorMessages;
  
  return error;
}

/**
 * Handle API response with automatic data extraction
 */
export function handleApiResponse<T>(
  response: any,
  dataKey?: string
): { data: T | null; error: Error | null; success: boolean } {
  try {
    if (!isApiSuccess(response)) {
      const error = createApiError(response);
      return { data: null, error, success: false };
    }

    let data: T | null = null;

    if (dataKey) {
      // Extract specific data key
      const extractedData = extractApiData(response);
      data = extractedData?.[dataKey] || null;
    } else {
      // Extract general data
      data = extractApiData<T>(response);
    }

    return { data, error: null, success: true };
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to parse API response'), 
      success: false 
    };
  }
}

/**
 * Handle paginated API response
 */
export function handlePaginatedResponse<T>(
  response: any,
  dataKey?: string
): { data: T[]; pagination: any; error: Error | null; success: boolean } {
  try {
    if (!isApiSuccess(response)) {
      const error = createApiError(response);
      return { data: [], pagination: null, error, success: false };
    }

    const data = extractListData<T>(response, dataKey);
    const pagination = extractPaginationData(response);

    return { data, pagination, error: null, success: true };
  } catch (error) {
    return { 
      data: [], 
      pagination: null,
      error: error instanceof Error ? error : new Error('Failed to parse paginated API response'), 
      success: false 
    };
  }
}

/**
 * Transform Rails backend data to frontend format
 */
export function transformPatientProfile(railsData: any) {
  if (!railsData) return null;

  return {
    id: railsData.personal_info?.id || railsData.id,
    fullName: railsData.personal_info?.name || railsData.full_name,
    email: railsData.personal_info?.email || railsData.email,
    phone: railsData.personal_info?.phone || railsData.phone,
    dateOfBirth: railsData.personal_info?.date_of_birth || railsData.date_of_birth,
    gender: railsData.personal_info?.gender || railsData.gender,
    bloodType: railsData.health_metrics?.blood_type || railsData.blood_type,
    height: railsData.health_metrics?.height || railsData.height,
    weight: railsData.health_metrics?.weight || railsData.weight,
    allergies: railsData.health_metrics?.allergies || railsData.allergies || [],
    conditions: railsData.health_metrics?.conditions || railsData.conditions || [],
    emergencyContact: railsData.emergency_contact || railsData.emergency_contact,
    insurance: railsData.insurance || railsData.insurance_info,
    healthHistory: railsData.health_history || railsData.health_history || []
  };
}

/**
 * Transform appointment data from Rails format
 */
export function transformAppointment(railsData: any) {
  if (!railsData) return null;

  return {
    id: railsData.id,
    appointment_datetime: railsData.appointment_datetime,
    duration_minutes: railsData.duration_minutes,
    status: railsData.status,
    appointment_type: railsData.appointment_type,
    reason: railsData.reason,
    notes: railsData.notes,
    provider: railsData.provider ? {
      id: railsData.provider.id,
      fullName: railsData.provider.full_name || railsData.provider.name,
      specialty: railsData.provider.specialization || railsData.provider.specialty
    } : null,
    patient: railsData.patient ? {
      id: railsData.patient.id,
      fullName: railsData.patient.full_name || railsData.patient.name
    } : null
  };
}

/**
 * Transform medication/prescription data from Rails format
 */
export function transformMedication(railsData: any) {
  if (!railsData) return null;

  return {
    id: railsData.id,
    name: railsData.medication_name || railsData.name,
    dosage: railsData.dosage,
    frequency: railsData.frequency,
    start_date: railsData.start_date,
    end_date: railsData.end_date,
    instructions: railsData.instructions,
    refills_allowed: railsData.refills_allowed,
    refills_remaining: railsData.refills_remaining,
    status: railsData.status,
    prescriber: railsData.provider ? {
      id: railsData.provider.id,
      fullName: railsData.provider.full_name || railsData.provider.name
    } : null
  };
}

/**
 * Transform message data from Rails format
 */
export function transformMessage(railsData: any) {
  if (!railsData) return null;

  return {
    id: railsData.id,
    content: railsData.body || railsData.content,
    created_at: railsData.created_at,
    read: railsData.read_at ? true : false,
    message_type: railsData.message_type || 'text',
    status: railsData.status || 'sent',
    sender: railsData.sender ? {
      id: railsData.sender.id,
      fullName: railsData.sender.full_name || railsData.sender.name,
      role: railsData.sender.role
    } : null,
    conversation: railsData.conversation ? {
      id: railsData.conversation.id,
      title: railsData.conversation.title
    } : null
  };
}