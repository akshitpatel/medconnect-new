'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import { cn, formatDate } from '@/app/lib/utils';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import Logo from '@/app/components/Logo';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import MedConnectLogo from '@/app/logo-selection/medconnect-logo';

interface FlippableHealthCardProps {
  patientName: string;
  dateOfBirth: string;
  bloodType: string;
  patientId: string;
  emergencyContact: string;
  allergies: string[] | string;
  conditions: string[];
  className?: string;
  // Insurance fields
  insuranceProvider?: string;
  policyNumber?: string;
  groupNumber?: string;
  isPrimaryInsurance?: boolean;
  // Other health fields
  medications?: string[];
  primaryPhysician?: string;
  lastCheckup?: string;
  healthScore?: number;
}

// Function to get health status based on score
const getHealthStatus = (score: number) => {
  if (score >= 90) return { text: 'Excellent', color: 'emerald' };
  if (score >= 70) return { text: 'Good', color: 'teal' };
  if (score >= 50) return { text: 'Fair', color: 'yellow' };
  return { text: 'Needs Attention', color: 'red' };
};

// Floating particle component for background effects
const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [0, -20],
      x: Math.random() * 20 - 10,
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Medical Icon Component
const MedicalIcon = ({ icon, position }: { icon: string; position: string }) => (
  <motion.div
    className={`absolute ${position}`}
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {icon}
  </motion.div>
);

// Holographic scan effect component
const HolographicScan = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-t from-teal-400/10 to-transparent"
    animate={{
      y: ["100%", "-100%"],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

// Pulse animation component
const PulseEffect = () => (
  <motion.div
    className="absolute inset-0 rounded-xl border-2 border-teal-400/30"
    animate={{
      scale: [1, 1.02, 1],
      opacity: [0.3, 0, 0.3],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

// Dynamic import for 3D rendering - will only run client-side
const SparklesComponent = dynamic(() => Promise.resolve(() => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          delay: Math.random() * 5,
          repeat: Infinity,
          repeatDelay: Math.random() * 5
        }}
      />
    ))}
  </div>
)), { ssr: false });

// AI Prediction Indicator Component
const AIPredictionIndicator = ({ trend = 'stable', size = 'small' }: { trend?: 'up' | 'down' | 'stable'; size?: 'small' | 'large' }) => {
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-blue-400';
  
  return (
    <motion.div 
      className={cn(
        "flex items-center gap-1 backdrop-blur-md rounded-full overflow-hidden",
        size === 'small' ? "px-1 py-0" : "px-3 py-1",
        trend === 'up' ? "bg-emerald-500/10" : trend === 'down' ? "bg-red-500/10" : "bg-blue-500/10"
      )}
      initial={{ opacity: 0.8 }}
      animate={{ 
        opacity: [0.8, 1, 0.8],
        scale: [1, 1.02, 1]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg className={cn("w-2 h-2", trendColor)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {trend === 'up' && <path d="M12 5l0 14M18 11l-6 -6M6 11l6 -6" />}
        {trend === 'down' && <path d="M12 5l0 14M18 11l-6 6M6 11l6 6" />}
        {trend === 'stable' && <path d="M8 9l4 0l0 -4M16 15l-4 0l0 4" />}
      </svg>
      <span className={cn("text-2xs font-semibold", trendColor)}>
        {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
      </span>
    </motion.div>
  );
};

// Neural Network Animation
const NeuralNetworkAnimation = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-teal-400/30 rounded-full"
        style={{
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          x: [
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
          ],
          y: [
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
            Math.random() * 50 - 25,
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    ))}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={`line-${i}`}
        className="absolute h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent"
        style={{
          width: `${Math.random() * 100 + 50}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          rotate: `${Math.random() * 180}deg`,
        }}
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 3,
          delay: Math.random() * 3,
          repeat: Infinity,
          repeatDelay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// Mini Health Chart Component
const MiniHealthChart = ({ data = [60, 68, 75, 72, 70, 78, 85], color = 'teal' }: { data?: number[]; color?: string }) => {
  const normalizedData = data.map(val => ((val - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * 40);
  const chartColors: Record<string, string> = {
    teal: 'stroke-teal-500',
    red: 'stroke-red-500',
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500',
    blue: 'stroke-blue-500',
  };
  
  return (
    <div className="h-10 w-full flex items-end justify-between relative">
      <div className="absolute inset-0 flex items-end">
        <svg className="w-full h-full" viewBox={`0 0 ${data.length * 10} 40`}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={`var(--${color}-500)`} stopOpacity="0.1" />
              <stop offset="100%" stopColor={`var(--${color}-500)`} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Line */}
          <path
            d={`M 0,${40 - normalizedData[0]} ${data.map((_, i) => `L ${i * 10},${40 - normalizedData[i]}`).join(' ')}`}
            fill="none"
            className={cn("stroke-2", chartColors[color] || 'stroke-teal-500')}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Area */}
          <path
            d={`M 0,${40 - normalizedData[0]} ${data.map((_, i) => `L ${i * 10},${40 - normalizedData[i]}`).join(' ')} L ${(data.length - 1) * 10},40 L 0,40 Z`}
            fill={`url(#gradient-${color})`}
          />
          
          {/* Dots */}
          {normalizedData.map((val, i) => (
            <circle
              key={i}
              cx={i * 10}
              cy={40 - val}
              r="1.5"
              className={cn(chartColors[color] || 'fill-teal-500')}
            />
          ))}
          
          {/* Target line */}
          <line
            x1="0"
            y1="10"
            x2={data.length * 10}
            y2="10"
            className="stroke-gray-300 dark:stroke-gray-700 stroke-dasharray-2"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      
      {/* AI Prediction arrow */}
      <motion.div
        className="absolute -right-2 -top-1"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5l0 14M18 11l-6 -6M6 11l6 -6" />
        </svg>
      </motion.div>
    </div>
  );
};

export function FlippableHealthCard({
  patientName,
  dateOfBirth,
  bloodType,
  patientId,
  emergencyContact,
  allergies,
  conditions,
  medications = [],
  primaryPhysician = '',
  insuranceProvider = '',
  policyNumber = '',
  groupNumber = '',
  isPrimaryInsurance = false,
  lastCheckup = '',
  healthScore = 85,
  className,
}: FlippableHealthCardProps) {
  const { isDarkMode } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAIData, setShowAIData] = useState(false);
  const [aiPredictions, setAiPredictions] = useState({
    predictedScore: healthScore + 4,
    trend: 'up',
    insights: [
      "Heart health is improving based on recent vitals",
      "Sleep quality has increased by 12% this month",
      "Medication adherence: 98% (excellent)"
    ]
  });
  
  const healthStatus = getHealthStatus(healthScore);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize animations
  useEffect(() => {
    // AI data delay
    const timer = setTimeout(() => {
      setShowAIData(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle card flip
  const flipCard = () => {
    if (!showQR) {
      setIsFlipped(!isFlipped);
    }
  };

  // Toggle QR code modal
  const toggleQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQR(!showQR);
  };

  // Copy patient ID to clipboard
  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(patientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "w-full max-w-2xl h-[400px] perspective-1000 relative",
        className
      )}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.02 }}
        onClick={flipCard}
      >
        {/* Front of card */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border",
            isDarkMode ? 
              "bg-gray-900 border-gray-800 text-white" : 
              "bg-white border-gray-200 text-gray-900"
          )}
        >
          {/* Subtle pattern */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-[0.02]" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
          
          {/* Card content */}
          <div className="relative h-full p-8 flex flex-col">
            {/* Header with new logo and health score */}
            <div className="flex justify-between items-start mb-6">
              {/* New minimalist logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <MedConnectLogo 
                    isAnimated={true}
                    darkMode={isDarkMode}
                    variant="icon"
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">MedConnect</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Digital Health Card</p>
                </div>
              </div>
              
              {/* Health score */}
              <div className="flex flex-col items-end">
                <div className="relative">
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-white text-base font-medium flex items-center gap-2",
                    "bg-teal-500"
                  )}>
                    <span className="text-xl font-bold">{healthScore}</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  {/* AI Badge */}
                  <motion.div 
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-white dark:text-gray-900 shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    AI
                  </motion.div>
                </div>
                <span className="text-sm mt-2 font-medium text-gray-600 dark:text-gray-300">
                  {healthStatus.text}
                </span>
              </div>
            </div>
            
            {/* Patient name and info */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-3">{patientName}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      ID: {String(patientId || '').substring(0, 10)}
                    </span>
                    <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      Blood: {bloodType}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQR(true);
                  }}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h7v7H3z"/>
                    <path d="M14 3h7v7h-7z"/>
                    <path d="M14 14h7v7h-7z"/>
                    <path d="M3 14h7v7H3z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Main info grid */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">Primary Doctor</p>
                <p className="text-sm font-medium truncate">{primaryPhysician || 'Not assigned'}</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">Insurance</p>
                <p className="text-sm font-medium truncate">{insuranceProvider || 'Not provided'}</p>
              </div>
            </div>
            
            {/* Health trend section */}
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Health Trend</span>
                  <motion.div
                    className="flex items-center gap-1.5 text-sm rounded-full px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5l0 14M18 11l-6 -6M6 11l6 -6" />
                    </svg>
                    <span>Improving</span>
                  </motion.div>
                </div>

                {/* AI prediction */}
                <AnimatePresence>
                  {showAIData && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-sm font-medium text-teal-600 dark:text-teal-400"
                    >
                      Pred: {aiPredictions.predictedScore}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Health trend visualization */}
              <div className="mt-2 h-12 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden relative">
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-full flex items-end"
                  initial="hidden"
                  animate="visible"
                >
                  {[65, 70, 73, 68, 75, 80, healthScore].map((value, i) => {
                    const normalizedHeight = (value - 50) / 50 * 100;
                    return (
                      <motion.div
                        key={i}
                        className="flex-1 mx-0.5 bg-teal-500/80"
                        initial={{ height: 0 }}
                        animate={{ height: `${normalizedHeight}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    );
                  })}
                </motion.div>
              </div>
            </div>
            
            {/* Tap to flip indicator */}
            <div className="absolute bottom-4 right-4">
              <motion.div
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 12l5 5l5 -5" />
                  <path d="M7 7l5 5l5 -5" />
                </svg>
                Tap to flip
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back of card - Similar minimalist styling */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border rotate-y-180",
            isDarkMode ? 
              "bg-gray-900 border-gray-800 text-white" : 
              "bg-white border-gray-200 text-gray-900"
          )}
        >
          {/* Card content */}
          <div className="relative h-full p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                DOB: {dateOfBirth ? (() => {
                  try {
                    // Try to parse the date and format it
                    const date = new Date(dateOfBirth);
                    // Check if date is valid before formatting
                    return !isNaN(date.getTime()) 
                      ? format(date, 'MMM d, yyyy') 
                      : 'Invalid Date';
                  } catch (error) {
                    return 'Invalid Date';
                  }
                })() : 'Not provided'}
              </span>
            </div>

            <div className="space-y-4 flex-grow overflow-auto">
              {/* Medical conditions */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-sm uppercase font-semibold mb-3 text-gray-900 dark:text-white">Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {conditions.length > 0 ? conditions.map((condition, index) => (
                    <span 
                      key={index} 
                      className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {condition}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500">None reported</span>
                  )}
                </div>
              </div>
              
              {/* Allergies */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-sm uppercase font-semibold mb-3 text-gray-900 dark:text-white">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    // Handle both string and array formats for allergies
                    const allergyList = (() => {
                      if (!allergies) return [];
                      if (typeof allergies === 'string') {
                        // If it's a string, split by commas
                        return allergies.split(',').map(item => item.trim()).filter(item => item);
                      }
                      // If it's already an array, use it directly
                      return Array.isArray(allergies) ? allergies : [];
                    })();
                    
                    return allergyList.length > 0 ? allergyList.map((allergy, index) => (
                      <span 
                        key={index} 
                        className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      >
                        {allergy}
                      </span>
                    )) : (
                      <span className="text-sm text-gray-500">None reported</span>
                    );
                  })()}
                </div>
              </div>
              
              {/* Insurance Information */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <h4 className="text-sm uppercase font-semibold mb-3 text-gray-900 dark:text-white">Insurance</h4>
                <div className="flex flex-col space-y-2">
                  {insuranceProvider ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Provider:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{insuranceProvider}</span>
                      </div>
                      {policyNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Policy #:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{policyNumber}</span>
                        </div>
                      )}
                      {groupNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Group #:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{groupNumber}</span>
                        </div>
                      )}
                      {isPrimaryInsurance && (
                        <div className="mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                            Primary Insurance
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">No insurance information</span>
                  )}
                </div>
              </div>
              
              {/* Medications */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm uppercase font-semibold text-gray-900 dark:text-white">Medications</h4>
                  <span className="text-sm text-teal-600 dark:text-teal-400">98% adherence</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {medications && medications.length > 0 ? medications.map((medication, index) => (
                    <span 
                      key={index} 
                      className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {medication}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500">No current medications</span>
                  )}
                </div>
              </div>

              {/* AI Insights */}
              {showAIData && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm uppercase font-semibold text-gray-900 dark:text-white">AI Insights</h4>
                  </div>
                  <ul className="space-y-2 pl-6 list-disc marker:text-teal-500">
                    {aiPredictions.insights.map((insight, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Emergency contact */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Contact</p>
              <p className="text-sm font-medium">{emergencyContact}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code Modal - Updated with minimalist style */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl max-w-xs w-full border border-gray-200 dark:border-gray-800"
              onClick={e => e.stopPropagation()}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Medical ID</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowQR(false)}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl flex justify-center">
                <QRCodeSVG 
                  value={`MEDCONNECT:${patientId}`} 
                  size={200}
                  bgColor={isDarkMode ? "#1f2937" : "#FFFFFF"}
                  fgColor={isDarkMode ? "#e5e7eb" : "#111827"}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scan to access medical information</p>
                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400">{patientId}</p>
              </div>
              <div className="mt-6 flex space-x-3">
                <button 
                  className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  onClick={() => setShowQR(false)}
                >
                  Close
                </button>
                <button 
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy ID'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 