import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reminder Details | MedConnect',
  description: 'View and manage your health reminder details',
};

export default function ReminderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 