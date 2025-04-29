import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/app/contexts/ThemeContext';
import { cn } from '@/app/lib/utils';
import MedConnectLogo from '../logo-selection/medconnect-logo';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'inverted' | 'light' | 'dark';
  className?: string;
  href?: string;
  animated?: boolean;
}

/**
 * A reusable MedConnect logo component that supports different sizes and themes.
 * 
 * @param size - 'small', 'medium', or 'large'
 * @param variant - 'default', 'inverted', 'light', or 'dark'
 * @param className - Optional additional CSS classes
 * @param href - Optional link to redirect to when clicked
 * @param animated - Whether to animate the logo
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  variant = 'default',
  className = '',
  href = '/',
  animated = false,
}) => {
  const { isDarkMode } = useTheme();

  // Define sizes
  const sizeConfig = {
    small: { width: 24, height: 24, textSize: 'text-sm', logoClass: 'w-6 h-6' },
    medium: { width: 32, height: 32, textSize: 'text-lg', logoClass: 'w-8 h-8' },
    large: { width: 40, height: 40, textSize: 'text-xl', logoClass: 'w-10 h-10' },
  };

  // Should logo be inverted based on variant and theme
  const isInverted = variant === 'inverted' || 
    (variant === 'default' && isDarkMode) || 
    (variant === 'light' && !isDarkMode) || 
    (variant === 'dark' && isDarkMode);

  const currentSize = sizeConfig[size];

  const logoContent = (
    <div className={cn(
      'flex items-center gap-2', 
      className
    )}>
      <MedConnectLogo 
        isAnimated={animated}
        darkMode={isDarkMode}
        variant="icon"
        className={currentSize.logoClass}
      />
      <span className={cn(
        currentSize.textSize,
        'font-semibold tracking-tight',
        isDarkMode 
          ? 'text-white' 
          : 'text-gray-800'
      )}>
        MedConnect
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo; 