'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect to the index page
const LogoSelectionRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/logo-selection/index');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Redirecting to Logo Selection...</p>
    </div>
  );
};

export default LogoSelectionRedirect;
