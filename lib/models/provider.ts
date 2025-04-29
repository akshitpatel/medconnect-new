import { ObjectId } from "mongodb";

export interface Provider {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  clinicName?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  
  // Adding timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new provider (without password hash)
export interface ProviderInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  clinicName?: string;
  address?: string;
  bio?: string;
}

// Type for public provider data (excluding sensitive information)
export interface PublicProvider {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  clinicName?: string;
  bio?: string;
  avatar?: string;
}

// Function to convert Provider document to PublicProvider
export function toPublicProvider(provider: Provider): PublicProvider {
  return {
    id: provider._id?.toString() || '',
    email: provider.email,
    firstName: provider.firstName,
    lastName: provider.lastName,
    specialization: provider.specialization,
    clinicName: provider.clinicName,
    bio: provider.bio,
    avatar: provider.avatar
  };
} 