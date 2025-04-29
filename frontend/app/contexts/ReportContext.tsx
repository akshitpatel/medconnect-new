'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
export interface UserData {
  name: string;
  phoneNumber: string;
}

type ReportContextType = {
  reports: File[];
  setReports: React.Dispatch<React.SetStateAction<File[]>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

// Create context with default values
const ReportContext = createContext<ReportContextType>({
  reports: [],
  setReports: () => {},
  userData: { name: '', phoneNumber: '' },
  setUserData: () => {},
});

// Custom hook to use the context
export const useReportContext = () => useContext(ReportContext);

// Provider component
export function ReportProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<File[]>([]);
  const [userData, setUserData] = useState<UserData>({ name: '', phoneNumber: '' });

  return (
    <ReportContext.Provider
      value={{
        reports,
        setReports,
        userData,
        setUserData,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
} 