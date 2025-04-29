'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the provider types
export type ProviderType = 'doctor' | 'hospital' | 'lab' | 'pharmacy' | null;

// Define the context type
interface ProviderContextType {
  providerType: ProviderType;
  setProviderType: (type: ProviderType) => void;
}

// Create the context with a default value
const ProviderContext = createContext<ProviderContextType>({
  providerType: 'doctor',
  setProviderType: () => {},
});

// Custom hook to use the context
export const useProviderContext = () => useContext(ProviderContext);

// Provider component
export const ProviderContextProvider = ({ children }: { children: ReactNode }) => {
  const [providerType, setProviderType] = useState<ProviderType>('doctor');

  const value = {
    providerType,
    setProviderType,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
}; 