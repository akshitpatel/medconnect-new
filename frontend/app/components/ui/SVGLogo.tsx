'use client';

import React from 'react';

interface SVGLogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
}

export default function SVGLogo({ size = 40, className = '', withText = true }: SVGLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 80 80" 
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          className="animated-logo"
        >
          <defs>
            <style>
              {`
                @keyframes subtle-glow {
                  0%, 100% { filter: drop-shadow(0 0 1px #14b8a630); }
                  50% { filter: drop-shadow(0 0 3px #14b8a650); }
                }
                @keyframes gentle-beat {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.03); }
                }
                @keyframes soft-wave {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes light-fade {
                  0%, 100% { opacity: 0.8; }
                  50% { opacity: 0.9; }
                }
                
                .animated-logo {
                  animation: subtle-glow 4s ease-in-out infinite;
                }
                .animated-cross {
                  animation: gentle-beat 3s ease-in-out infinite;
                }
                .animated-wave {
                  animation: soft-wave 3s linear infinite;
                }
                .animated-shield {
                  animation: light-fade 4s ease-in-out infinite;
                }
              `}
            </style>
          </defs>
          
          {/* Background Shield */}
          <path
            d="M40 5L10 15V40C10 55 20 65 40 75C60 65 70 55 70 40V15L40 5Z"
            fill="#0d9488"
            className="dark:opacity-95"
          />
          
          {/* Inner Shield */}
          <path
            d="M40 15L20 22V40C20 50 28 58 40 65C52 58 60 50 60 40V22L40 15Z"
            fill="#14b8a6"
            opacity="0.7"
            className="animated-shield"
          />
          
          {/* Medical Cross */}
          <path
            d="M40 25V55M25 40H55"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            className="animated-cross"
          />
          
          {/* Heartbeat Line - simplified */}
          <path
            d="M25 48C25 48 30 48 33 48C36 48 37 42 40 42C43 42 44 48 47 48C50 48 55 48 55 48"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 2"
            className="animated-wave"
          />
          
          {/* Single DNA Helix - simplified */}
          <g opacity="0.6">
            <path
              d="M18 30C18 30 16 34 18 38C20 42 18 46 18 46"
              fill="none"
              stroke="#0f766e"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M22 30C22 30 24 34 22 38C20 42 22 46 22 46"
              fill="none"
              stroke="#0f766e"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* DNA Connections */}
            <line x1="18" y1="36" x2="22" y2="36" stroke="#0f766e" strokeWidth="1" />
            <line x1="18" y1="40" x2="22" y2="40" stroke="#0f766e" strokeWidth="1" />
          </g>
        </svg>
      </div>
      
      {withText && (
        <div className="ml-3 flex flex-col">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Med<span className="text-teal-500">Connect</span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-teal-600 dark:text-teal-400 -mt-1">
            Healthcare Platform
          </span>
        </div>
      )}
    </div>
  );
} 