import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Reminder | MedConnect',
  description: 'Modify your health reminder details',
};

export default function EditReminderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 