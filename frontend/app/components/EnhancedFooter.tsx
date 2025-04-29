'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/contexts/ThemeContext';
import MedConnectLogo from '../logo-selection/medconnect-logo';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone,
  FaHeart
} from 'react-icons/fa';

const EnhancedFooter = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <footer className={`w-full pt-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Wave SVG for top design */}
      <div className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className={`w-full h-12 -mt-12 ${isDarkMode ? 'fill-gray-900' : 'fill-gray-100'}`} preserveAspectRatio="none">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Logo and description */}
          <motion.div 
            className="col-span-1 md:col-span-4"
            variants={itemVariants}
          >
            <MedConnectLogo 
              isAnimated={true}
              darkMode={isDarkMode}
              className="w-40 h-12 mb-4"
            />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              Connecting patients with healthcare providers for a healthier tomorrow. Our platform simplifies healthcare access and management.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FaFacebookF />} url="#" />
              <SocialIcon icon={<FaTwitter />} url="#" />
              <SocialIcon icon={<FaInstagram />} url="#" />
              <SocialIcon icon={<FaYoutube />} url="#" />
              <SocialIcon icon={<FaLinkedinIn />} url="#" />
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/services" text="Services" />
              <FooterLink href="/doctors" text="Find Doctors" />
              <FooterLink href="/contact" text="Contact" />
            </ul>
          </motion.div>
          
          {/* Resources */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink href="/blog" text="Blog" />
              <FooterLink href="/faq" text="FAQ" />
              <FooterLink href="/emergency" text="Emergency" />
              <FooterLink href="/privacy" text="Privacy Policy" />
              <FooterLink href="/terms" text="Terms of Use" />
            </ul>
          </motion.div>
          
          {/* Contact Us */}
          <motion.div 
            className="col-span-1 md:col-span-4"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className={`mt-1 mr-3 ${isDarkMode ? 'text-teal-500' : 'text-teal-600'}`} />
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  123 Healthcare Avenue<br />
                  Medical District, MD 12345
                </span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className={`mr-3 ${isDarkMode ? 'text-teal-500' : 'text-teal-600'}`} />
                <a href="mailto:info@medconnect.com" className={`${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                  info@medconnect.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className={`mr-3 ${isDarkMode ? 'text-teal-500' : 'text-teal-600'}`} />
                <a href="tel:+11234567890" className={`${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Newsletter Subscription */}
        <motion.div 
          className={`py-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stay updated with our latest health tips and services.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`flex-grow px-4 py-2 rounded-lg focus:outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border`} 
                />
                <button 
                  type="submit" 
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>
        
        {/* Copyright and Secondary Links */}
        <div className={`py-6 text-center border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © {currentYear} MedConnect. All rights reserved.
            </p>
            <div className="flex items-center text-sm space-x-4">
              <Link href="/privacy" className={`${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                Privacy Policy
              </Link>
              <span className={`${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>|</span>
              <Link href="/terms" className={`${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                Terms of Service
              </Link>
              <span className={`${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`}>|</span>
              <Link href="/sitemap" className={`${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                Sitemap
              </Link>
            </div>
          </div>
          <div className="mt-4 text-xs text-center">
            <p className={`flex items-center justify-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Made with <FaHeart className="mx-1 text-red-500" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper components
const SocialIcon = ({ icon, url }: { icon: React.ReactNode, url: string }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <a 
      href={url} 
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-400 hover:bg-teal-600 hover:text-white' 
          : 'bg-gray-200 text-gray-600 hover:bg-teal-500 hover:text-white'
      }`}
    >
      {icon}
    </a>
  );
};

const FooterLink = ({ href, text }: { href: string, text: string }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <li>
      <Link 
        href={href} 
        className={`block transition-all duration-300 ${
          isDarkMode 
            ? 'text-gray-400 hover:text-teal-400 hover:translate-x-1' 
            : 'text-gray-600 hover:text-teal-600 hover:translate-x-1'
        }`}
      >
        {text}
      </Link>
    </li>
  );
};

export default EnhancedFooter; 