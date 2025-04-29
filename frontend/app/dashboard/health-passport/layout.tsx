import React from 'react';
import { Metadata } from 'next';

// This is a server component (no 'use client' directive)
// so it can export metadata
export const metadata: Metadata = {
  title: 'Health Passport | MedConnect',
  description: 'Your digital health passport with all your medical information in one place.',
};

export default function HealthPassportLayout({
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