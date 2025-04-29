import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Medical Record | Health Passport | MedConnect',
  description: 'Add a new medical record to your digital health passport.',
};

export default function AddRecordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 