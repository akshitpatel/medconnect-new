import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Reminders | MedConnect',
  description: 'Manage your health reminders and medication schedules',
};

export default function RemindersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 