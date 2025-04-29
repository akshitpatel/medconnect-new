import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Reminder | MedConnect',
  description: 'Create a new health reminder or medication schedule',
};

export default function AddReminderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 