'use client';


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CursorEffectProps {
  activeSection?: string;
}

const CursorEffect: React.FC<CursorEffectProps> = ({ activeSection }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener("mousemove", mouseMove);
    
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);
  
  useEffect(() => {
    // Change cursor variant based on active section
    if (activeSection === 'hero') {
      setCursorVariant('hero');
    } else if (activeSection === 'how-it-works') {
      setCursorVariant('howItWorks');
    } else {
      setCursorVariant('default');
    }
  }, [activeSection]);
  
  // Only show on larger screens
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (windowWidth < 768) {
    return null;
  }
  
  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      opacity: 0.5,
    },
    hero: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      opacity: 0.4,
      backgroundColor: "#14b8a6",
      mixBlendMode: "lighten" as const,
    },
    howItWorks: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      opacity: 0.5,
      backgroundColor: "#059669",
      mixBlendMode: "darken" as const,
    }
  };
  
  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          mass: 0.5
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          height: 32,
          width: 32,
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          border: '1px solid rgba(20, 184, 166, 0.6)',
          backdropFilter: 'blur(5px)'
        }}
      />
      <motion.div
        className="cursor-trail"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          opacity: [0, 0.2, 0]
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
        style={{
          position: 'fixed',
          left: -10,
          top: -10,
          zIndex: 9998,
          pointerEvents: 'none',
          height: 20,
          width: 20,
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          boxShadow: '0 0 20px 2px rgba(20, 184, 166, 0.2)'
        }}
      />
    </>
  );
};

export default CursorEffect; 