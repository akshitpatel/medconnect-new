'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import AdminPulseEffect from './AdminPulseEffect';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AnimatedLogo({ size = 'md', className = '' }: AnimatedLogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Size variants
  const sizes = {
    sm: {
      container: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-lg',
      subtext: 'text-[8px]',
    },
    md: {
      container: 'h-10 w-10',
      icon: 'h-6 w-6',
      text: 'text-xl',
      subtext: 'text-[9px]',
    },
    lg: {
      container: 'h-14 w-14',
      icon: 'h-8 w-8',
      text: 'text-2xl',
      subtext: 'text-[10px]',
    },
  };
  
  const sizeConfig = sizes[size];
  
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Logo container with gradient background */}
      <div className={`relative flex items-center justify-center ${sizeConfig.container} rounded-md bg-gradient-to-r from-teal-500 to-teal-400 text-white overflow-hidden`}>
        {/* Animated heartbeat icon */}
        <Heart 
          className={`${sizeConfig.icon} ${isAnimating ? 'animate-ping' : 'animate-pulse'}`} 
        />
        
        {/* Pulse effect that shows occasionally */}
        {isAnimating && (
          <AdminPulseEffect 
            size={size === 'sm' ? 30 : size === 'md' ? 40 : 56} 
            duration={1.5}
            className="absolute"
          />
        )}
        
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 animate-pulse"
          style={{
            background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.5) 50%, transparent 55%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 3s ease infinite',
          }}
        />
      </div>
      
      {/* Text part */}
      <div className="ml-3 flex flex-col">
        <span className={`${sizeConfig.text} font-bold text-gray-900 dark:text-white`}>
          Med<span className="text-teal-500">Connect</span>
        </span>
        <span className={`${sizeConfig.subtext} uppercase tracking-widest text-teal-600 dark:text-teal-400 -mt-1`}>
          Healthcare Platform
        </span>
      </div>
      
      {/* Add CSS animation keyframes */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
      `}</style>
    </div>
  );
} 