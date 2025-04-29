'use client';

import React from 'react';

interface PulseEffectProps {
  color?: string;
  size?: number;
  duration?: number;
  className?: string;
}

export default function AdminPulseEffect({
  color = 'rgba(20, 184, 166, 0.3)', // teal-500 with opacity
  size = 100,
  duration = 2,
  className = '',
}: PulseEffectProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full z-0 animate-ping"
        style={{
          backgroundColor: color,
          width: '100%',
          height: '100%',
          animationDuration: `${duration}s`,
        }}
      ></div>
      <div
        className="absolute rounded-full z-0 animate-ping"
        style={{
          backgroundColor: color,
          width: '100%',
          height: '100%',
          animationDuration: `${duration * 1.5}s`,
          animationDelay: '0.5s',
        }}
      ></div>
    </div>
  );
} 