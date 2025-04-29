import React from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';

type ProfileAvatarProps = {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  initials?: string;
  role?: 'patient' | 'doctor' | 'admin' | 'nurse' | 'staff';
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt = 'User',
  size = 'md',
  className,
  initials,
  role = 'patient'
}) => {
  const { isDarkMode } = useTheme();
  
  // Size configurations
  const sizeConfig = {
    xs: { containerSize: 'h-6 w-6', fontSize: 'text-xs', strokeWidth: 1.75 },
    sm: { containerSize: 'h-8 w-8', fontSize: 'text-sm', strokeWidth: 1.5 },
    md: { containerSize: 'h-10 w-10', fontSize: 'text-base', strokeWidth: 1.5 },
    lg: { containerSize: 'h-12 w-12', fontSize: 'text-lg', strokeWidth: 1.25 },
    xl: { containerSize: 'h-16 w-16', fontSize: 'text-xl', strokeWidth: 1 }
  };
  
  // Role-based colors
  const roleConfig = {
    patient: {
      bgGradient: 'from-teal-500 to-cyan-600',
      iconColor: '#0d9488'
    },
    doctor: {
      bgGradient: 'from-blue-500 to-indigo-600',
      iconColor: '#4f46e5'
    },
    admin: {
      bgGradient: 'from-violet-500 to-purple-600',
      iconColor: '#8b5cf6'
    },
    nurse: {
      bgGradient: 'from-rose-500 to-pink-600',
      iconColor: '#e11d48'
    },
    staff: {
      bgGradient: 'from-amber-500 to-orange-600',
      iconColor: '#f59e0b'
    }
  };
  
  // Get user initials from the alt text if not provided
  const userInitials = initials || alt
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Ensure size is a valid value from sizeConfig, fallback to 'md' if not
  const validSize = (size in sizeConfig) ? size : 'md';
  
  // Current configuration based on size and role
  const currentSize = sizeConfig[validSize];
  const currentRole = roleConfig[role] || roleConfig.patient; // fallback to patient if role is invalid
  
  return (
    <div 
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        "bg-gradient-to-br shadow-sm",
        currentSize.containerSize,
        currentRole.bgGradient,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
        />
      ) : (
        <>
          {/* Decorative SVG pattern for the background */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-10" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="80" cy="20" r="12" fill="white" />
            <circle cx="20" cy="85" r="8" fill="white" />
            <path d="M50,0 L50,100" stroke="white" strokeWidth="1" strokeDasharray="4,6" />
            <path d="M0,50 L100,50" stroke="white" strokeWidth="1" strokeDasharray="4,6" />
          </svg>
          
          {/* Different SVG icons based on role */}
          {userInitials.length > 0 ? (
            <span className={cn(
              "font-medium text-white",
              currentSize.fontSize
            )}>
              {userInitials}
            </span>
          ) : (
            <svg 
              className="w-1/2 h-1/2 text-white opacity-80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={currentSize.strokeWidth}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {role === 'doctor' && (
                <path d="M8 20h8m-4-4v4m8-12a6 6 0 01-6 6h-4a6 6 0 01-6-6V4h16v4zm-8-4v8" />
              )}
              {role === 'nurse' && (
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l3 3m0 0l3-3m-3 3V9" />
              )}
              {(role === 'patient' || role === 'staff' || role === 'admin') && (
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileAvatar; 