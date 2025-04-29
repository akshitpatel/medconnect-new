'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaExchangeAlt, FaHeartbeat, FaPrescriptionBottleAlt, FaHistory } from 'react-icons/fa';
import MedConnectLogo from '../logo-selection/medconnect-logo';

interface HealthCardProps {
  patientName?: string;
  patientId?: string;
  bloodType?: string;
  primaryDoctor?: string;
  insurance?: string;
  healthScore?: number;
  healthTrend?: 'Improving' | 'Stable' | 'Declining';
  predictionScore?: number;
  className?: string;
}

export default function HealthCard({
  patientName = 'Sarah Johnson',
  patientId = 'P-12345678',
  bloodType = 'O+',
  primaryDoctor = 'Dr. Wilson',
  insurance = 'Not provided',
  healthScore = 85,
  healthTrend = 'Improving',
  predictionScore = 89,
  className = '',
}: HealthCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine health score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Determine trend color and icon
  const getTrendDisplay = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return {
          color: 'text-green-500',
          icon: '↑',
          bgColor: 'bg-green-100',
        };
      case 'Declining':
        return {
          color: 'text-red-500',
          icon: '↓',
          bgColor: 'bg-red-100',
        };
      default:
        return {
          color: 'text-yellow-500',
          icon: '→',
          bgColor: 'bg-yellow-100',
        };
    }
  };

  const trendDisplay = getTrendDisplay(healthTrend);
  
  // Calculate score percentage for the circular progress
  const scorePercent = healthScore; // Out of 100

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <motion.div
        className="relative w-full rounded-xl overflow-hidden cursor-pointer"
        style={{ height: '380px' }}
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
        transition={{ 
          duration: 0.6,
          boxShadow: {
            duration: 0.2
          }
        }}
        whileHover={{ y: -5 }}
      >
        {/* Card flip icon */}
        <motion.div
          className="absolute right-4 top-4 z-10 bg-white/10 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-white/70"
          whileHover={{ rotate: 180, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          transition={{ duration: 0.3 }}
        >
          <FaExchangeAlt size={14} />
        </motion.div>

        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full p-6 backface-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200"
          style={{ 
            backfaceVisibility: 'hidden',
            borderRadius: '0.75rem'
          }}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/dots-pattern.svg')]"></div>
          
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="flex items-center">
              <div className="w-14 h-14 relative overflow-hidden flex items-center justify-center bg-medical-teal-50 rounded-lg shadow-sm">
                <MedConnectLogo 
                  variant="icon"
                  isAnimated={false}
                  className="w-10 h-10"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-medical-teal-700">MedConnect</h3>
                <p className="text-xs text-gray-500">Digital Health Card</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full bg-gray-100"></div>
                
                {/* Progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  <motion.circle 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    fill="none" 
                    stroke="#0d9488" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 226, strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: 226 - (226 * scorePercent / 100) }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
                
                {/* Score value */}
                <div className="flex flex-col items-center justify-center z-10">
                  <span className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}</span>
                </div>
              </div>
              <motion.div 
                className="absolute top-14 right-7 text-xs text-gray-400"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaInfoCircle />
              </motion.div>
              <span className="text-xs font-medium text-gray-500 mt-2">Good</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-200 py-4 relative z-10">
            <h2 className="text-2xl font-bold text-gray-800">{patientName}</h2>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">ID</p>
              <p className="text-sm font-semibold text-gray-800">{patientId}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 mb-1">Blood Type</p>
              <p className="text-sm font-semibold text-gray-800">{bloodType}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-3 relative z-10">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaHeartbeat className="text-medical-teal-500 mr-3" size={14} />
                <p className="text-sm font-medium text-gray-700">Primary Doctor</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">{primaryDoctor}</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaHistory className="text-medical-teal-500 mr-3" size={14} />
                <p className="text-sm font-medium text-gray-700">Insurance</p>
              </div>
              <p className="text-sm font-semibold text-gray-800">{insurance}</p>
            </div>
          </div>
          
          <div className="mt-5 relative z-10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-700 mr-2">Health Trend</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trendDisplay.bgColor} ${trendDisplay.color}`}>
                  {trendDisplay.icon} {healthTrend}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Pred: <span className="font-semibold text-gray-800">{predictionScore}</span>
              </p>
            </div>
            
            <div className="w-full h-7 bg-gray-100 rounded-lg overflow-hidden">
              <div className="flex h-full rounded-lg">
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-200 to-medical-teal-300" 
                  style={{ width: '10%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-300 to-medical-teal-400" 
                  style={{ width: '10%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-400 to-medical-teal-500" 
                  style={{ width: '15%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-500 to-medical-teal-600" 
                  style={{ width: '15%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-600 to-medical-teal-700" 
                  style={{ width: '20%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                <motion.div 
                  className="h-full bg-gradient-to-r from-medical-teal-700 to-medical-teal-800" 
                  style={{ width: '30%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full p-6 backface-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-200"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '0.75rem'
          }}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/images/dots-pattern.svg')]"></div>
          
          <div className="h-full flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center">
                <div className="w-14 h-14 relative overflow-hidden flex items-center justify-center bg-medical-teal-50 rounded-lg shadow-sm">
                  <MedConnectLogo 
                    variant="icon"
                    isAnimated={false}
                    className="w-10 h-10"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-bold text-medical-teal-700">MedConnect</h3>
                  <p className="text-xs text-gray-500">Digital Health Card</p>
                </div>
              </div>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h3 className="text-lg font-bold text-gray-800">Health Information</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto my-4 pr-2 space-y-4 custom-scrollbar">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mr-2">
                    <span className="text-red-500 text-xs">!</span>
                  </span>
                  Allergies
                </h4>
                <p className="text-sm text-gray-700">Penicillin, Peanuts</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaPrescriptionBottleAlt className="text-medical-teal-500 mr-2" size={14} />
                  Current Medications
                </h4>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                    Lisinopril 10mg (Daily)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                    Metformin 500mg (Twice daily)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                    Vitamin D3 2000 IU (Daily)
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaHeartbeat className="text-medical-teal-500 mr-2" size={14} />
                  Chronic Conditions
                </h4>
                <ul className="text-sm text-gray-700 space-y-1.5">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                    Hypertension
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-400 mr-2"></span>
                    Type 2 Diabetes
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contact</h4>
                <p className="text-sm text-gray-700">John Johnson (Spouse)</p>
                <p className="text-sm text-gray-700">(555) 123-4567</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Card instruction hint */}
      <motion.div 
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 flex items-center opacity-80"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="mr-2">Tap card to flip</span>
        <FaExchangeAlt size={10} />
      </motion.div>
    </div>
  );
} 