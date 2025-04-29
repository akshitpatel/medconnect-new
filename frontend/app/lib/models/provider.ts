// Basic Provider model for authentication purposes
export interface Provider {
  _id?: string;
  email: string;
  password?: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  phone?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  type: string; // 'doctor', 'hospital', 'pharmacy', etc.
  name: string;
  address?: string;
  verified?: boolean;
}

// Input type for provider registration
export interface ProviderInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  address?: string;
  type?: string;
}

// Convert provider data to public representation (without sensitive info)
export function toPublicProvider(provider: Provider): Omit<Provider, 'password'> {
  const { password, ...publicProvider } = provider;
  return publicProvider;
}
