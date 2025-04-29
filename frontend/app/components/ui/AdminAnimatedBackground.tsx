'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface AdminAnimatedBackgroundProps {
  particleCount?: number;
  className?: string;
}

export default function AdminAnimatedBackground({
  particleCount = 20,
  className = '',
}: AdminAnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const initialParticles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    setParticles(initialParticles);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          // Update position
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Boundary checking
          if (newX < 0 || newX > dimensions.width) {
            newX = newX < 0 ? 0 : dimensions.width;
            particle.speedX *= -1;
          }
          
          if (newY < 0 || newY > dimensions.height) {
            newY = newY < 0 ? 0 : dimensions.height;
            particle.speedY *= -1;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles, dimensions]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-teal-500 dark:bg-teal-400"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transition: 'transform 0.3s ease',
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.2})`,
          }}
        />
      ))}
    </div>
  );
} 