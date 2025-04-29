'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUserMd, 
  FaFlask, 
  FaPills, 
  FaAmbulance, 
  FaUserCog,
  FaCalendarAlt,
  FaStar,
  FaCheckCircle,
  FaPhone,
  FaMedkit,
  FaHospital,
  FaHeartbeat,
  FaShieldAlt,
  FaBrain,
  FaBone,
  FaChild,
  FaAllergies,
  FaEye,
  FaEarlybirds,
  FaTooth,
  FaFemale,
  FaMale,
  FaBrain as FaPsychiatry,
  FaEllipsisH,
  FaQuestion,
  FaChevronDown,
  FaArrowRight,
  FaQuoteLeft,
  FaApple,
  FaGooglePlay,
  FaStethoscope,
  FaHandHoldingHeart,
  FaClock,
  FaLaptopMedical,
  FaCertificate,
  FaRobot,
  FaTrophy,
  FaUsers,
  FaLock,
  FaLightbulb,
  FaHeadset,
  FaRegHeart,
  FaRegLightbulb,
  FaRegClock,
  FaFileMedicalAlt,
  FaClipboardCheck,
  FaUserClock,
  FaSmile,
  FaChevronRight,
  FaDna,
  FaHouseDamage,
  FaUniversalAccess,
  FaIdCard
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Logo from './components/Logo';
import DoctorSearch from './components/DoctorSearch';
import EnhancedFooter from './components/EnhancedFooter';
import HowItWorks3D from './components/HowItWorks3D';
import Head from 'next/head';
import EnhancedNavbar from './components/EnhancedNavbar';
import MedConnectLogo from './logo-selection/medconnect-logo';
import HealthcareSearch from './components/HealthcareSearch';
import { Metadata, ResolvingMetadata } from 'next';
import HealthCard from './components/HealthCard';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState<string | undefined>('hero');

  // Handle scroll effect for navbar and animations
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setScrollY(window.scrollY);
      
      // Update active section based on scroll position
      if (window.scrollY < 800) {
        setActiveSection('hero');
      } else if (window.scrollY >= 800 && window.scrollY < 1600) {
        setActiveSection('how-it-works');
      } else {
        setActiveSection(undefined);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* SEO Metadata */}
      <Head>
        <title>MedConnect - Healthcare Made Simple and Accessible</title>
        <meta name="description" content="Connect with top healthcare providers, book appointments, and manage your health journey all in one place with MedConnect." />
        <meta name="keywords" content="healthcare, doctors, appointments, medical, health, telehealth" />
        <meta property="og:title" content="MedConnect - Healthcare Made Simple" />
        <meta property="og:description" content="Find doctors, schedule appointments, and access healthcare services online with MedConnect." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://medconnect.com" />
        <meta property="og:image" content="https://medconnect.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      
      {/* Replace the old navbar with EnhancedNavbar */}
      <EnhancedNavbar transparent={true} />

      {/* ENHANCED HERO SECTION WITH PREMIUM DESIGN */}
      <div className="relative pt-16 bg-gradient-to-br from-medical-teal-900 via-medical-teal-800 to-medical-mint-800 min-h-screen flex items-center overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Improved dot pattern */}
          <div className="absolute inset-0 bg-[url('/images/dots-pattern.svg')] opacity-[0.05]"></div>
          
          {/* Enhanced gradient orbs */}
          <motion.div 
            className="absolute -right-40 top-20 w-[40rem] h-[40rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(20,184,166,0.06) 50%, rgba(0,0,0,0) 70%)"
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -20, 0],
              opacity: [0.06, 0.12, 0.06] 
            }} 
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute -left-20 bottom-0 w-[50rem] h-[50rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(6,148,162,0.10) 0%, rgba(6,148,162,0.05) 40%, rgba(0,0,0,0) 70%)"
            }}
            animate={{ 
              scale: [1, 1.15, 1],
              y: [0, 30, 0],
              opacity: [0.06, 0.10, 0.06] 
            }} 
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          
          {/* Enhanced depth grid */}
          <div className="absolute inset-0 opacity-[0.07]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Custom animated medical icons */}
          <motion.div 
            className="absolute top-1/4 right-1/4 text-medical-teal-200 opacity-10"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaHeartbeat className="w-24 h-24" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 left-1/4 text-medical-mint-200 opacity-10"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <FaStethoscope className="w-20 h-20" />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/3 left-1/5 text-medical-teal-300 opacity-5"
            animate={{ 
              y: [0, 10, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          >
            <FaMedkit className="w-16 h-16" />
          </motion.div>
          
          <motion.div 
            className="absolute top-2/3 right-1/3 text-medical-mint-300 opacity-5"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, -8, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <FaPills className="w-14 h-14" />
          </motion.div>
          
          {/* DNA Helix Animation - Custom Medical Icon */}
          <div className="absolute top-1/2 left-[15%] opacity-5">
            <motion.div className="relative h-40 w-20">
              {[...Array(8)].map((_, i) => (
                <React.Fragment key={i}>
                  <motion.div 
                    className="absolute left-0 w-4 h-1.5 rounded-full bg-medical-teal-400"
                    style={{ top: `${i * 5}px` }}
                    animate={{
                      x: [0, 12, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div 
                    className="absolute right-0 w-4 h-1.5 rounded-full bg-medical-mint-400"
                    style={{ top: `${i * 5 + 20}px` }}
                    animate={{
                      x: [0, -12, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1 + 1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* Microscope Custom Icon */}
          <div className="absolute top-1/3 right-[15%] opacity-5">
            <motion.div 
              className="relative h-24 w-24 flex items-center justify-center"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <motion.div 
                className="absolute top-0 w-1.5 h-14 bg-medical-teal-300 rounded-t-full"
                animate={{ height: [56, 60, 56] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="absolute top-14 left-[-6px] w-14 h-3 bg-medical-teal-400 rounded-lg" />
              <motion.div 
                className="absolute bottom-0 w-10 h-6 bg-medical-teal-300 rounded-md"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute top-14 left-3 w-2 h-8 bg-medical-teal-500 rotate-[30deg] origin-top"
                animate={{ rotate: ['30deg', '32deg', '30deg'] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Pulse Animation */}
          <div className="absolute bottom-[15%] right-[25%] opacity-5">
            <motion.div className="relative h-20 w-40">
              <motion.div 
                className="absolute top-1/2 left-0 right-0 h-0.5 w-full bg-medical-teal-400"
                animate={{ 
                  opacity: [0.6, 1, 0.6] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* ECG Pattern */}
              <motion.svg width="100%" height="100%" viewBox="0 0 200 100" className="absolute inset-0">
                <motion.path
                  d="M0,50 L40,50 L50,20 L60,80 L70,50 L80,50 L100,10 L120,50 L140,50 L150,30 L160,70 L170,50 L200,50"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: 1,
                    x: [0, -200]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                />
              </motion.svg>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left content area - Enhanced */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Enhanced status badge */}
                <motion.div
                  className="inline-flex items-center mb-8 bg-medical-teal-800/40 backdrop-blur-sm border border-medical-teal-700/30 px-4 py-1.5 rounded-full shadow-glow-sm" 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.span 
                    className="w-2 h-2 bg-medical-mint-400 rounded-full mr-2.5"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.span>
                  <span className="text-xs text-white/90 font-medium tracking-wider">TRUSTED BY 2M+ USERS</span>
                </motion.div>
                
                {/* Enhanced main headline with mask effect */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                  <motion.span 
                    className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
              >
                    Complete
                  </motion.span>
                  <motion.div 
                    className="relative inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-medical-mint-300 via-medical-teal-200 to-medical-emerald-300 mt-2 pb-1">
                    Healthcare Platform
                    </span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-medical-mint-500 to-medical-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1 }}
                    />
                  </motion.div>
                </h1>
                
                {/* Enhanced description with icon */}
                <motion.div 
                  className="mt-6 text-xl text-white/90 max-w-xl leading-relaxed font-light flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
              >
                  <p>
                  Your unified healthcare solution offering doctor consultations, lab tests, pharmacy services, and comprehensive health monitoring in one integrated platform.
                  </p>
                  <motion.div 
                    className="ml-4 p-2 rounded-full bg-medical-teal-700/30 backdrop-blur-sm"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaHandHoldingHeart className="w-5 h-5 text-medical-mint-300" />
                  </motion.div>
                </motion.div>
              
                {/* Enhanced statistics with hover effects */}
              <motion.div 
                  className="mt-12 grid grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {[
                    { value: "2M+", label: "Active Users", icon: <FaUsers className="w-4 h-4" /> },
                    { value: "10K+", label: "Doctors", icon: <FaUserMd className="w-4 h-4" /> },
                    { value: "99.9%", label: "Satisfaction", icon: <FaStar className="w-4 h-4" /> },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors duration-300"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center mb-1">
                        <div className="text-2xl font-bold text-white mr-2">{stat.value}</div>
                        <motion.div
                          animate={{ rotate: [0, 10, 0] }}
                          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                          className="text-medical-mint-400"
                        >
                          {stat.icon}
                        </motion.div>
                    </div>
                      <div className="text-sm text-medical-mint-300/80 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Enhanced action buttons with 3D effects */}
                <motion.div 
                  className="mt-12 flex flex-wrap gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <Link href="/symptom-checker" 
                    className="relative group flex-none inline-flex justify-center items-center py-4 px-7 text-base font-medium rounded-full text-white overflow-hidden shadow-glow-md"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-medical-teal-600 to-medical-mint-500 group-hover:opacity-90"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-medical-mint-500 to-medical-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    
                    {/* Custom 3D button effect */}
                    <span className="absolute inset-0 w-full h-full rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                          style={{
                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.5) 0%, transparent 60%)"
                          }}></span>
                    
                    <span className="absolute inset-0 w-full h-full border border-white/20 rounded-full"></span>
                    <span className="relative flex items-center">
                      <motion.span
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, 0] 
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        className="mr-3 text-xl text-white"
                      >
                        <FaHeartbeat />
                      </motion.span>
                      <span>Symptom Checker</span>
                    </span>
                    </Link>
                  
                    <Link href="/emergency" 
                    className="relative group flex-none inline-flex justify-center items-center py-4 px-7 text-base font-medium rounded-full text-white overflow-hidden shadow-glow-md"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-500 group-hover:opacity-90"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    
                    {/* Custom 3D button effect */}
                    <span className="absolute inset-0 w-full h-full rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                          style={{
                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.5) 0%, transparent 60%)"
                          }}></span>
                          
                    <span className="absolute inset-0 w-full h-full border border-white/20 rounded-full"></span>
                    <span className="relative flex items-center">
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="mr-3 text-xl"
                      >
                        <FaAmbulance className="group-hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                      <span>Emergency Care</span>
                    </span>
                    </Link>
                </motion.div>
                
                {/* Trust badges - New section */}
                <motion.div
                  className="mt-8 flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {[
                    { icon: <FaShieldAlt className="w-3.5 h-3.5" />, text: "HIPAA Compliant" },
                    { icon: <FaLock className="w-3.5 h-3.5" />, text: "Secure & Private" },
                    { icon: <FaCertificate className="w-3.5 h-3.5" />, text: "Certified Doctors" },
                  ].map((badge, i) => (
                    <div 
                      key={i}
                      className="flex items-center space-x-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10"
                    >
                      <span className="text-medical-mint-400">{badge.icon}</span>
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
                </div>
            
            {/* Right search area with enhanced glass morphism */}
            <div className="block md:block">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {/* Enhanced glass card effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-medical-teal-500/15 to-medical-mint-500/15 blur-xl transform rotate-1"></div>
                <div className="absolute inset-5 rounded-2xl bg-gradient-to-r from-medical-teal-500/5 to-medical-mint-500/5 blur-lg transform -rotate-1"></div>
                
                <div className="relative backdrop-blur-lg rounded-2xl overflow-hidden border border-medical-teal-400/20 shadow-glow-lg">
                  {/* Animated top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-teal-500 to-medical-mint-500">
                    <motion.div 
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  
                  <div className="relative p-4 sm:p-8 bg-medical-teal-900/20 backdrop-blur-md">
                    <motion.div 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <div className="flex items-center">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center">
                          Find Services
                        <motion.span 
                            className="ml-2 text-medical-mint-300 opacity-80"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <FaStethoscope className="w-4 h-4" />
                        </motion.span>
                      </h3>
                        
                        {/* New pulsing dot */}
                        <motion.div
                          className="ml-auto w-2.5 h-2.5 rounded-full bg-medical-mint-400"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 1, 0.7] 
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      <p className="text-white/70 text-sm">Search for doctors, labs, medications, and more</p>
              </motion.div>

              <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      {/* Enhanced search box */}
                      <div className="bg-white/10 backdrop-blur-md p-3 sm:p-5 rounded-xl border border-white/10 mb-4 sm:mb-6 shadow-inner-light">
                        <HealthcareSearch />
                      </div>
              </motion.div>
                    
                    {/* Enhanced feature bullets */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="hidden sm:block"
                    >
                      <div className="grid grid-cols-2 gap-4 mt-5">
                        {[
                          { icon: <FaUserMd/>, text: "Verified Providers" },
                          { icon: <FaCalendarAlt/>, text: "Instant Booking" },
                          { icon: <FaShieldAlt/>, text: "Secure & Private" },
                          { icon: <FaClock/>, text: "24/7 Support" }
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center text-white/80 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-white/5"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <span className="text-medical-mint-400 mr-3 text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.text}</span>
                          </motion.div>
                        ))}
              </div>
                    </motion.div>
            
                      {/* Enhanced specialties with animation */}
                      <div className="mt-7 pb-2">
                        <div className="text-sm text-white/70 mb-3 font-medium flex items-center">
                        <span>Popular categories:</span>
                          <motion.div 
                            className="ml-2"
                            animate={{ rotate: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            <FaHeartbeat className="text-medical-mint-400 w-3 h-3" />
                          </motion.div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                          { name: "Doctors", icon: <FaUserMd className="w-3 h-3 mr-1" /> },
                          { name: "Lab Tests", icon: <FaFlask className="w-3 h-3 mr-1" /> },
                          { name: "Pharmacy", icon: <FaPills className="w-3 h-3 mr-1" /> },
                          { name: "Emergency", icon: <FaAmbulance className="w-3 h-3 mr-1" /> },
                          ].map((term, i) => (
                            <Link 
                            href={`/${term.name.toLowerCase().replace(' ', '-')}`}
                              key={i}
                              className="text-xs px-3 py-2 bg-medical-teal-800/80 hover:bg-medical-teal-700/80 text-medical-mint-200 rounded-full transition-colors border border-medical-teal-700/50 shadow-glow-sm hover:shadow-glow-md flex items-center"
                            >
                              {term.icon}
                              {term.name}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* New animated search tip */}
                      <motion.div
                        className="mt-4 flex items-center justify-center text-xs text-white/50 bg-white/5 py-2 rounded-lg border border-white/5"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <FaLightbulb className="mr-2 text-medical-mint-400" /> 
                        <span>Try searching by symptoms or conditions</span>
                    </motion.div>
                  </div>

                  {/* Card footer with custom pulse animation */}
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-medical-mint-500/30 to-transparent">
                    <motion.div 
                      className="h-full w-20 bg-medical-mint-500"
                      animate={{ x: ['-100%', '600%', '-100%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                
                {/* Enhanced floating trust badge */}
              <motion.div 
                  className="absolute -right-12 top-10 bg-gradient-to-br from-medical-teal-800/90 to-medical-teal-900/90 backdrop-blur-md p-3 rounded-lg shadow-elevation-high border border-medical-teal-700/50 flex items-center space-x-3 sm:block md:hidden lg:block overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.7 }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-medical-mint-900/80 flex items-center justify-center text-medical-mint-400 shadow-inner-light relative">
                      <FaShieldAlt />
                      {/* Animated ring */}
                      <motion.div 
                        className="absolute inset-0 w-full h-full rounded-full border-2 border-medical-mint-400/30"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">HIPAA Compliant</p>
                      <p className="text-xs text-medical-mint-200/70">End-to-end encrypted</p>
                    </div>
                  </div>
                  {/* Accent line */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-medical-mint-500/50"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex flex-col items-center">
            <div className="text-xs uppercase tracking-wider text-white/50 mb-3 font-medium">Scroll to explore</div>
            <div className="w-5 h-9 rounded-full border border-medical-mint-400/30 flex items-center justify-center p-1 shadow-glow-sm relative overflow-hidden">
              <motion.div 
                className="w-1 h-2 bg-medical-mint-400/70 rounded-full"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Extra flourish */}
              <motion.div 
                className="absolute inset-0 bg-medical-mint-400/10"
                animate={{ y: ['100%', '-100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* HEALTH CARD SECTION */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Your Digital Health Passport</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access your health information anytime, anywhere with the MedConnect Health Card. Share securely with healthcare providers.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="w-full lg:w-1/2 max-w-lg">
              <HealthCard />
            </div>
            
            <div className="w-full lg:w-1/2 max-w-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">All Your Health Data in One Place</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-medical-teal-100 rounded-full flex items-center justify-center text-medical-teal-600">
                    <FaIdCard className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Digital Health Card</h4>
                    <p className="text-gray-600">Your health identity that can be shared with providers for faster care.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-medical-teal-100 rounded-full flex items-center justify-center text-medical-teal-600">
                    <FaFileMedicalAlt className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Medical Records Access</h4>
                    <p className="text-gray-600">View your complete medical history, test results, and doctor's notes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-medical-teal-100 rounded-full flex items-center justify-center text-medical-teal-600">
                    <FaHeartbeat className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Health Monitoring</h4>
                    <p className="text-gray-600">Track your health vitals and see improvement trends over time.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-medical-teal-100 rounded-full flex items-center justify-center text-medical-teal-600">
                    <FaShieldAlt className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-800">Secure & Private</h4>
                    <p className="text-gray-600">Your data is encrypted and only shared with your explicit permission.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/membership/health-passport"
                  className="inline-block px-6 py-3 bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  Learn More About Health Passport
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modernized Features Section with premium design and enhanced icons */}
      <div id="features" className="py-24 bg-white relative overflow-hidden">
        {/* Modern gradient line separator */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-medical-teal-500 to-transparent opacity-50"></div>
        
        <div className="absolute -top-64 -right-64 w-[30rem] h-[30rem] bg-medical-teal-50 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-64 -left-64 w-[30rem] h-[30rem] bg-medical-emerald-50 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-medical-teal-600 font-semibold text-sm tracking-wider mb-2 uppercase">All-in-one platform</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 lg:text-5xl flex items-center justify-center">
              <span>Complete Healthcare Solution</span>
              <div className="ml-3 relative w-10 h-10">
                <div className="absolute inset-0 bg-medical-teal-500/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaMedkit className="text-medical-teal-600 w-5 h-5" />
                </div>
              </div>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need for your health, all in one place.
            </p>
          </motion.div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
              <ModernFeatureCard 
                icon={<FaUserMd className="h-8 w-8 text-white" />}
                title="Expert Doctors" 
                description="Connect with highly qualified and experienced specialists for personalized care."
                color="from-medical-teal-600 to-medical-teal-500"
                iconBg="medical-teal-gradient"
              />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
              <ModernFeatureCard 
                icon={<FaFlask className="h-8 w-8 text-white" />}
                title="Lab Tests" 
                description="Book diagnostic tests with home sample collection and get digital reports."
                color="from-medical-teal-500 to-medical-emerald-500"
                iconBg="medical-emerald-gradient"
              />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
              <ModernFeatureCard 
                icon={<FaPills className="h-8 w-8 text-white" />}
                title="Online Pharmacy" 
                description="Order medicines with doorstep delivery and automatic prescription refills."
                color="from-medical-teal-500 to-medical-blue-500"
                iconBg="medical-blue-gradient"
              />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
              <ModernFeatureCard 
                icon={<FaAmbulance className="h-8 w-8 text-white" />}
                title="Emergency Care" 
                description="24/7 emergency assistance with rapid response system when you need it most."
                color="from-medical-teal-400 to-medical-teal-600"
                iconBg="medical-gradient-emergency"
              />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* REPLACED How It Works Section */}
      <div id="how-it-works" className="py-20 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How MedConnect Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Get the care you need in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-medical-teal-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg">
                    {step.icon}
                  </div>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-medical-teal-200 -z-10">
                      <div className="absolute right-0 -top-1 w-3 h-3 border-t-2 border-r-2 border-medical-teal-200 transform rotate-45"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/get-started" 
              className="inline-flex items-center py-3 px-6 rounded-lg bg-medical-teal-600 text-white font-medium hover:bg-medical-teal-700 transition-colors duration-300 shadow-md hover:shadow-lg">
              Get Started Now <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Specialties Section with custom teal themed icons */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              transform: `translateY(${Math.max(0, (scrollY - 1300) * 0.05)}px)`,
              transition: "transform 0.1s ease-out"
            }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Browse by Specialties
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Find the right specialist for your specific health concerns.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {specialtyData.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.3 } }}
              >
                <TealSpecialtyCard title={item.title} icon={item.icon} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section with enhanced background */}
      <div className="py-16 bg-gradient-to-br from-medical-teal-800 to-medical-teal-900 text-white relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-dots.svg')] opacity-5"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-medical-teal-500 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-medical-mint-500 rounded-full filter blur-3xl opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ 
              transform: `translateY(${Math.max(0, (scrollY - 1800) * 0.05)}px)`,
              transition: "transform 0.1s ease-out"
            }}
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-medical-teal-100 mx-auto">
              Real experiences from people who've used MedConnect.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
            <TestimonialCardTeal 
                quote="MedConnect made finding the right specialist so easy. I booked an appointment and had my issue resolved within days." 
              author="Sarah Johnson"
              role="Patient"
              rating={5}
            />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
            <TestimonialCardTeal 
                quote="As a busy professional, I appreciate how simple it is to order medications and book lab tests from my phone." 
                author="Michael Rodriguez" 
              role="Patient"
              rating={5}
            />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <TestimonialCardTeal 
                quote="MedConnect has transformed how I manage my practice. Patient scheduling and communication are now seamless." 
                author="Dr. Emily Chang" 
                role="Healthcare Provider" 
                rating={4}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatCard value="2M+" label="Active Users" />
            <StatCard value="10K+" label="Healthcare Providers" />
            <StatCard value="500K+" label="Appointments Booked" />
            <StatCard value="100+" label="Cities Covered" />
          </div>
        </div>
      </div>

      {/* New Medical Articles and Health Tips Section with stock images */}
      <section className="py-20 bg-gradient-to-br from-medical-teal-50 to-medical-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Medical Articles & Health Tips
            </motion.h2>
            <motion.p 
              className="mt-3 max-w-2xl mx-auto text-xl text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Stay informed with the latest medical research and health advice from our experts
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {healthArticles.map((article, index) => (
              <ArticleCard 
                key={index}
                article={article}
                index={index}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-medical-teal-600 hover:bg-medical-teal-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              View All Articles <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Download Our App Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-medical-teal-600 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-medical-blue-600 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:justify-between md:space-x-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold sm:text-4xl mb-6">Get the MedConnect App</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Take control of your health journey with our mobile app. Book appointments, view medical records, and get medication reminders on the go.
                </p>
                
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                  <a href="#" className="group flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition duration-300">
                    <FaApple className="h-6 w-6 mr-3" />
                    <span className="flex flex-col items-start">
                      <span className="text-xs">Download on the</span>
                      <span className="text-sm font-semibold">App Store</span>
                    </span>
                  </a>
                  
                  <a href="#" className="group flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition duration-300">
                    <FaGooglePlay className="h-6 w-6 mr-3" />
                    <span className="flex flex-col items-start">
                      <span className="text-xs">Get it on</span>
                      <span className="text-sm font-semibold">Google Play</span>
                    </span>
                  </a>
                </div>
                
                <div className="mt-8 flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gradient-to-br ${
                          i === 0 ? 'from-medical-blue-400 to-medical-blue-500' :
                          i === 1 ? 'from-medical-teal-400 to-medical-teal-500' :
                          i === 2 ? 'from-medical-green-400 to-medical-green-500' :
                          'from-medical-purple-400 to-medical-purple-500'
                        }`}></div>
                      ))}
                    </div>
                    <div className="ml-3 text-sm text-gray-300">
                      <span className="font-medium">4.8/5</span> from 10k+ reviews
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 relative">
              <motion.div
                className="relative z-10 mx-auto w-full max-w-xs"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ 
                  transform: `rotate(${scrollY * 0.01}deg)`,
                  transition: "transform 0.1s ease-out"
                }}
              >
                {/* App mockup */}
                <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                  <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <div className="w-full h-full bg-gradient-to-b from-medical-teal-500 to-medical-teal-600 flex flex-col">
                      <div className="flex justify-between px-4 pt-6 text-white">
                        <div className="text-sm font-medium">9:41</div>
                        <div className="flex space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2v5a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 px-4 flex justify-between items-center">
                        <div>
                          <div className="text-white text-lg font-semibold">Hello, John</div>
                          <div className="text-medical-teal-100 text-sm">How are you feeling today?</div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-white/20"></div>
                      </div>
                      <div className="flex-1 mt-6 bg-white rounded-t-3xl p-4">
                        <div className="bg-medical-teal-50 rounded-xl p-4 mb-4">
                          <div className="text-sm font-medium text-medical-teal-800">Your next appointment</div>
                          <div className="flex justify-between items-center mt-2">
                            <div>
                              <div className="text-xs text-gray-500">Today, 2:00 PM</div>
                              <div className="text-sm font-medium">Dr. Sarah Johnson</div>
                            </div>
                            <button className="bg-medical-teal-500 text-white text-xs px-3 py-1 rounded-full">View</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-medical-blue-50 rounded-xl p-3 flex flex-col items-center justify-center">
                            <FaCalendarAlt className="text-medical-blue-500 mb-1" />
                            <div className="text-xs font-medium text-gray-800">Appointments</div>
                          </div>
                          <div className="bg-medical-green-50 rounded-xl p-3 flex flex-col items-center justify-center">
                            <FaPills className="text-medical-green-500 mb-1" />
                            <div className="text-xs font-medium text-gray-800">Medications</div>
                          </div>
                          <div className="bg-medical-purple-50 rounded-xl p-3 flex flex-col items-center justify-center">
                            <FaFlask className="text-medical-purple-500 mb-1" />
                            <div className="text-xs font-medium text-gray-800">Lab Results</div>
                          </div>
                          <div className="bg-medical-amber-50 rounded-xl p-3 flex flex-col items-center justify-center">
                            <FaUserMd className="text-medical-amber-500 mb-1" />
                            <div className="text-xs font-medium text-gray-800">Find Doctor</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-sm font-medium text-gray-800">Health Metrics</div>
                            <div className="text-xs text-medical-teal-600">View All</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 mb-2">
                            <div className="flex justify-between">
                              <div className="text-xs text-gray-500">Heart Rate</div>
                              <div className="text-xs font-medium text-medical-green-600">Normal</div>
                            </div>
                            <div className="flex items-center mt-1">
                              <FaHeartbeat className="text-red-500 mr-1" />
                              <div className="text-sm font-medium">78 BPM</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex justify-between">
                              <div className="text-xs text-gray-500">Blood Pressure</div>
                              <div className="text-xs font-medium text-medical-green-600">Normal</div>
                            </div>
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-medical-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                              </svg>
                              <div className="text-sm font-medium">120/80 mmHg</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Partners and Affiliations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-2xl font-bold text-gray-900 sm:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Partners & Affiliations
            </motion.h2>
            <motion.p 
              className="mt-3 max-w-2xl mx-auto text-lg text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Trusted by leading healthcare organizations
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-12 py-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                <div className="w-32 h-16 flex items-center justify-center rounded-md">
                  <div className={`text-4xl font-bold ${partner.color}`}>{partner.name}</div>
                </div>
              </div>
            ))}
          </motion.div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/partners" 
              className="inline-flex items-center text-medical-teal-600 hover:text-medical-teal-800 transition-colors"
            >
              View all our partners and affiliations <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Quick Appointment Widget */}
      <section className="py-20 bg-gradient-to-br from-medical-teal-500 to-medical-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <path d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63" stroke="#fff" strokeWidth="100" fill="none" />
          </svg>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-medical-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Need to See a Doctor?</h2>
              <p className="mt-3 text-lg text-gray-500">Schedule an appointment in just a few clicks</p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select 
                    id="service-type"
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                  >
                    <option value="">Select service...</option>
                    <option value="consultation">General Consultation</option>
                    <option value="specialist">Specialist Visit</option>
                    <option value="followup">Follow-up Visit</option>
                    <option value="urgent">Urgent Care</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <select 
                    id="specialty"
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                  >
                    <option value="">Select specialty...</option>
                    <option value="general">General Practice</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    id="date"
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <select 
                    id="time"
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                  >
                    <option value="">Select time...</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                  </select>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-medical-teal-600 hover:bg-medical-teal-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Find Available Appointments <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Need immediate assistance? Call our 24/7 helpline at <a href="tel:1-800-MEDCONNECT" className="font-medium text-medical-teal-600 hover:text-medical-teal-800">1-800-MEDCONNECT</a>
            </div>
          </div>
        </div>
      </section>
      
      {/* EnhancedFooter component - KEEPING ONLY ONE FOOTER */}
      <EnhancedFooter />
    </div>
  );
}

// Data for specialties with enhanced visual icons (no backgrounds)
const specialtyData = [
  { title: "Cardiology", icon: <FaHeartbeat className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Neurology", icon: <FaBrain className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Orthopedics", icon: <FaBone className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Pediatrics", icon: <FaChild className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Allergy", icon: <FaAllergies className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Ophthalmology", icon: <FaEye className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "ENT", icon: <FaEarlybirds className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Dental", icon: <FaTooth className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Gynecology", icon: <FaFemale className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Urology", icon: <FaMale className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "Psychiatry", icon: <FaPsychiatry className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> },
  { title: "More", icon: <FaEllipsisH className="text-medical-teal-600 text-4xl group-hover:scale-110 transition-transform duration-300" /> }
];

// Healthcare services data
const healthcareServices = [
  {
    title: "Primary Care",
    description: "Comprehensive medical care for all ages, including preventive care, treatment of acute illnesses, and management of chronic conditions.",
    icon: <FaUserMd />,
    color: "bg-blue-50 text-blue-600",
    link: "/services/primary-care"
  },
  {
    title: "Specialist Consultations",
    description: "Connect with top specialists in various medical fields for expert diagnosis and treatment recommendations.",
    icon: <FaStethoscope />,
    color: "bg-teal-50 text-teal-600",
    link: "/services/specialists"
  },
  {
    title: "Telemedicine",
    description: "Virtual consultations with healthcare providers from the comfort of your home, available 24/7 for your convenience.",
    icon: <FaLaptopMedical />,
    color: "bg-indigo-50 text-indigo-600",
    link: "/services/telemedicine"
  },
  {
    title: "Emergency Care",
    description: "Immediate medical attention for urgent health concerns, with rapid response and coordination with emergency services.",
    icon: <FaAmbulance />,
    color: "bg-red-50 text-red-600",
    link: "/services/emergency"
  },
  {
    title: "Mental Health Services",
    description: "Comprehensive mental health support, including therapy, counseling, and psychiatric care for various conditions.",
    icon: <FaBrain />,
    color: "bg-purple-50 text-purple-600",
    link: "/services/mental-health"
  },
  {
    title: "AI Health Assistant",
    description: "Get personalized health recommendations and symptom assessment through our advanced AI-powered health assistant.",
    icon: <FaRobot />,
    color: "bg-amber-50 text-amber-600",
    link: "/services/ai-assistant"
  }
];

// Partners data
const partners = [
  { name: "MedCorp", color: "text-blue-600" },
  { name: "HealthPlus", color: "text-teal-600" },
  { name: "LifeCare", color: "text-green-600" },
  { name: "VitalLabs", color: "text-purple-600" },
  { name: "PrimeCare", color: "text-red-600" },
  { name: "MediTech", color: "text-indigo-600" }
];

// Data for How It Works section
const howItWorksSteps = [
  {
    icon: <FaSearch />,
    title: "Find Care",
    description: "Search for doctors, specialists, and healthcare services based on your needs, location, and availability."
  },
  {
    icon: <FaCalendarAlt />,
    title: "Book Appointment",
    description: "Select a convenient time slot and instantly book your appointment online, without any phone calls."
  },
  {
    icon: <FaUserMd />,
    title: "Receive Care",
    description: "Visit your healthcare provider in-person or through a virtual consultation. Access your reports and prescriptions online."
  }
];

// New component: Article Card
interface ArticleProps {
  article: {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    author: string;
    image: string;
    readTime: string;
  };
  index: number;
}

function ArticleCard({ article, index }: ArticleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-card-soft hover:shadow-card-hover transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue-500 to-medical-teal-600 opacity-80"></div>
        <Image 
          src={article.image} 
          alt={article.title} 
          fill 
          className="object-cover mix-blend-overlay" 
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white text-medical-blue-800 text-xs font-semibold rounded-full">
          {article.category}
          </span>
        </div>
        </div>
      <div className="p-5 flex-grow">
        <h3 className="font-bold text-xl mb-2 text-gray-800 hover:text-medical-blue-600 transition-colors duration-300">{article.title}</h3>
        <p className="text-gray-600 mb-4 text-sm">{article.excerpt}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-auto">
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

// New component: Service Card
interface ServiceProps {
  service: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    link: string;
  };
  index: number;
}

function ServiceCard({ service, index }: ServiceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-lg shadow-card-soft hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${service.color}`}>
          {service.icon}
        </div>
      <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-medical-blue-600 transition-colors duration-300">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
        <Link 
          href={service.link} 
        className="text-medical-blue-600 hover:text-medical-blue-800 font-medium flex items-center transition-colors duration-300"
        >
        Learn more
        <FaArrowRight className="ml-2 text-sm" />
        </Link>
    </motion.div>
  );
}

// Stat Card Component
interface StatCardProps {
  value: string;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 card-glossy">
      <p className="text-4xl font-extrabold gradient-text mb-2">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

// Health articles data with stock images
const healthArticles = [
  {
    title: "Understanding COVID-19 Long-Term Effects",
    excerpt: "New research reveals the long-term impacts of COVID-19 infection and how to manage ongoing symptoms.",
    category: "Research",
    date: "May 15, 2023",
    author: "Dr. Michael Chen",
    image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    readTime: "5 min read"
  },
  {
    title: "The Benefits of Meditation for Heart Health",
    excerpt: "Recent studies show that regular meditation practice can significantly improve cardiovascular health.",
    category: "Wellness",
    date: "June 2, 2023",
    author: "Dr. Sarah Johnson",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    readTime: "4 min read"
  },
  {
    title: "Nutrition Guide for Diabetes Management",
    excerpt: "Learn about the best dietary approaches to manage diabetes and maintain healthy blood sugar levels.",
    category: "Nutrition",
    date: "June 10, 2023",
    author: "Dr. Rebecca Martinez",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    readTime: "7 min read"
  }
];

// Teal Specialty Card Component with enhanced visual design (no background)
interface TealSpecialtyCardProps {
  title: string;
  icon: React.ReactNode;
}

function TealSpecialtyCard({ title, icon }: TealSpecialtyCardProps) {
  return (
    <div className="text-center p-5 bg-white rounded-lg shadow-card-soft hover:shadow-card-hover transition-all duration-300 hover:bg-gradient-to-b hover:from-white hover:to-medical-teal-50 group">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 group-hover:text-medical-teal-700 transition-all duration-300">
          {icon}
        </div>
        <h3 className="font-medium text-gray-800 group-hover:text-medical-teal-700 transition-colors">{title}</h3>
      </div>
    </div>
  );
}

// Testimonial Card Component with teal theme
interface TestimonialCardTealProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

function TestimonialCardTeal({ quote, author, role, rating }: TestimonialCardTealProps) {
  return (
    <div className="p-6 bg-medical-teal-700/30 backdrop-blur-md rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative border border-medical-teal-600/20">
      <FaQuoteLeft className="text-2xl text-medical-teal-300 mb-4" />
      <p className="text-white/90 mb-6">{quote}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-medical-teal-200">{role}</p>
        </div>
        <div className="flex text-medical-mint-300">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ENHANCED Modern Feature Card Component 
interface ModernFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  iconBg: string;
}

function ModernFeatureCard({ icon, title, description, color, iconBg }: ModernFeatureCardProps) {
  return (
    <div className="relative rounded-xl group transition-all duration-300 hover:z-10">
      <div className="absolute -inset-2 scale-90 group-hover:scale-100 rounded-xl bg-gradient-to-r from-medical-teal-500 to-medical-teal-600 opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
      <div className="relative p-6 bg-white shadow-card-soft group-hover:shadow-card-hover rounded-xl border border-gray-100 transition-all duration-300 h-full">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-r ${color} shadow-md group-hover:shadow-lg transition-all`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-medical-teal-700 transition-colors">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}