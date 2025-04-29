'use client';

import React from 'react';
import { cn } from '@/app/utils/cn';
import Link from 'next/link';

interface LogoProps {
  withText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ withText = true, size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/patient/dashboard" className={cn("flex items-center", className)}>
      <div className="flex-shrink-0">
        <div className={cn("text-teal-600", sizeClasses[size])}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-full w-full"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      </div>
      {withText && (
        <div className={cn("ml-2 font-bold tracking-tight text-gray-900", textSizeClasses[size])}>
          Med<span className="text-teal-600">Connect</span>
        </div>
      )}
    </Link>
  );
}

export function LogoSquare({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg bg-white p-2 shadow-md", className)}>
      <div className="flex items-center justify-center">
        <div className="text-teal-600 h-10 w-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-full w-full"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="font-bold tracking-tight text-gray-900 text-xs">
          Med<span className="text-teal-600">Connect</span>
        </div>
      </div>
    </div>
  );
}

export function FullLogo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-4 rounded-lg shadow-md flex items-center justify-center", className)}>
      <div className="text-teal-600 h-12 w-12 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-full w-full"
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
      <div>
        <div className="font-bold tracking-tight text-gray-900 text-3xl">
          Med<span className="text-teal-600">Connect</span>
        </div>
        <div className="text-gray-500 text-sm">Your Health, Connected</div>
      </div>
    </div>
  );
} 