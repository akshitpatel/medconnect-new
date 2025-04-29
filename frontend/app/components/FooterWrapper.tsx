'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isProvidersPath = pathname?.startsWith('/providers');
  
  // Don't render the Footer on providers pages
  if (isProvidersPath) {
    return null;
  }
  
  return <Footer />;
} 