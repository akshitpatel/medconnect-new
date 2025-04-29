'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaFilter, 
  FaFlask, 
  FaVial, 
  FaHeartbeat, 
  FaHome, 
  FaCalendarAlt, 
  FaClock,
  FaTruck, 
  FaPhoneAlt, 
  FaStar,
  FaArrowRight,
  FaChevronDown
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import EnhancedFooter from '../components/EnhancedFooter';

// Sample lab test data
const labTests = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description: 'Evaluates overall health and detects a wide range of disorders including anemia, infection, and leukemia.',
    price: 45,
    sampleType: 'Blood',
    preparationRequired: 'None',
    turnaroundTime: '24 hours',
    rating: 4.9,
    reviewCount: 328,
    image: '/images/lab/cbc.jpg'
  },
  {
    id: 2,
    name: 'Comprehensive Metabolic Panel',
    description: 'Provides important information about the current status of your kidneys, liver, and electrolyte balance.',
    price: 60,
    sampleType: 'Blood',
    preparationRequired: 'Fasting for 8-12 hours',
    turnaroundTime: '24 hours',
    rating: 4.8,
    reviewCount: 267,
    image: '/images/lab/metabolic.jpg'
  },
  {
    id: 3,
    name: 'Lipid Profile',
    description: 'Measures cholesterol levels to help determine risk of heart disease.',
    price: 50,
    sampleType: 'Blood',
    preparationRequired: 'Fasting for 9-12 hours',
    turnaroundTime: '24 hours',
    rating: 4.7,
    reviewCount: 192,
    image: '/images/lab/lipid.jpg'
  },
  {
    id: 4,
    name: 'Thyroid Function Test',
    description: 'Checks how well your thyroid is working by measuring hormone levels.',
    price: 65,
    sampleType: 'Blood',
    preparationRequired: 'None',
    turnaroundTime: '24-48 hours',
    rating: 4.9,
    reviewCount: 215,
    image: '/images/lab/thyroid.jpg'
  },
  {
    id: 5,
    name: 'Vitamin D Test',
    description: 'Determines if you have a vitamin D deficiency.',
    price: 55,
    sampleType: 'Blood',
    preparationRequired: 'None',
    turnaroundTime: '48 hours',
    rating: 4.6,
    reviewCount: 178,
    image: '/images/lab/vitamind.jpg'
  },
  {
    id: 6,
    name: 'HbA1c (Glycated Hemoglobin)',
    description: 'Provides information about average blood sugar levels over the past 3 months.',
    price: 58,
    sampleType: 'Blood',
    preparationRequired: 'None',
    turnaroundTime: '24 hours',
    rating: 4.8,
    reviewCount: 203,
    image: '/images/lab/hba1c.jpg'
  }
];

// Lab test categories
const categories = [
  { id: 1, name: 'Blood Tests', icon: <FaVial /> },
  { id: 2, name: 'Heart Health', icon: <FaHeartbeat /> },
  { id: 3, name: 'Diabetes', icon: <FaFlask /> },
  { id: 4, name: 'Women\'s Health', icon: <FaVial /> },
  { id: 5, name: 'Men\'s Health', icon: <FaVial /> },
  { id: 6, name: 'Thyroid Functions', icon: <FaFlask /> },
  { id: 7, name: 'Vitamin Tests', icon: <FaVial /> },
  { id: 8, name: 'Cancer Screening', icon: <FaFlask /> }
];

export default function LabTestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter lab tests based on search and category
  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || test.name.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-medical-teal-900 via-medical-teal-800 to-medical-mint-800 pt-24 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-[0.05]"></div>
          <motion.div 
            className="absolute -right-40 top-20 w-[30rem] h-[30rem] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(20,184,166,0.06) 50%, rgba(0,0,0,0) 70%)"
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -20, 0]
            }} 
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          </div>
          
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Professional Lab Tests <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-mint-300 to-medical-teal-300">Without The Wait</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Convenient home sample collection, accurate results, and expert guidance.
              Get your lab tests done without leaving the comfort of your home.
            </motion.p>
            
            {/* Search */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-xl mb-8 max-w-2xl mx-auto shadow-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-medical-teal-600" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-3 w-full bg-white/90 backdrop-blur-sm rounded-lg border border-white/20 focus:ring-2 focus:ring-medical-teal-500 focus:border-medical-teal-500 outline-none transition-all"
                    placeholder="Search for lab tests, health packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center justify-center whitespace-nowrap">
                  <FaSearch className="mr-2" />
                  <span>Find Tests</span>
                </button>
              </div>
            </motion.div>
            
            {/* Features */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                { icon: <FaHome />, label: "Home Collection" },
                { icon: <FaCalendarAlt />, label: "Same-Day Appointments" },
                { icon: <FaClock />, label: "Fast Results" },
                { icon: <FaTruck />, label: "Free Delivery" }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                  <div className="text-medical-mint-400 text-2xl mb-2">
                    {feature.icon}
                  </div>
                  <div className="text-white text-sm font-medium">{feature.label}</div>
            </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Test Categories</h2>
            <Link href="/lab-tests/all-categories" className="text-medical-teal-600 hover:text-medical-teal-700 flex items-center">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <motion.div 
                key={category.id} 
                className="text-center p-4 bg-white rounded-lg shadow-card-soft hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:bg-medical-teal-50"
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="text-medical-teal-600 text-3xl mb-3 mx-auto">
                  {category.icon}
                </div>
                <div className="text-sm font-medium text-gray-800">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Filters and Labs List */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="text-medical-teal-600" />
                <span>Filter</span>
                <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      <input type="number" placeholder="Max" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Sample Type</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-medical-teal-600 focus:ring-medical-teal-500" />
                        <span className="ml-2 text-sm text-gray-700">Blood</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-medical-teal-600 focus:ring-medical-teal-500" />
                        <span className="ml-2 text-sm text-gray-700">Urine</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-medical-teal-600 focus:ring-medical-teal-500" />
                        <span className="ml-2 text-sm text-gray-700">Swab</span>
                      </label>
                    </div>
                  </div>
                  
                  <button className="w-full bg-medical-teal-600 text-white py-2 rounded-lg hover:bg-medical-teal-700 transition-colors">
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
            
            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-medical-teal-500">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>
          </div>
        </div>
        
        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <motion.div 
              key={test.id}
              className="bg-white rounded-xl shadow-card-soft hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src={test.image} 
                  alt={test.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{test.name}</h3>
                  <div className="bg-medical-teal-100 text-medical-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                    ${test.price}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {test.description}
                </p>
                
                <div className="flex flex-wrap gap-y-2 mb-4">
                  <div className="w-1/2 flex items-center text-xs text-gray-600">
                    <FaVial className="text-medical-teal-600 mr-2" /> 
                    <span>{test.sampleType}</span>
                  </div>
                  <div className="w-1/2 flex items-center text-xs text-gray-600">
                    <FaClock className="text-medical-teal-600 mr-2" /> 
                    <span>{test.turnaroundTime}</span>
                  </div>
                  <div className="w-full flex items-center text-xs text-gray-600">
                    <FaFlask className="text-medical-teal-600 mr-2" /> 
                    <span>Prep: {test.preparationRequired}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="flex text-yellow-500 mr-1">
                      <FaStar />
                    </div>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">{test.rating}</span>
                      <span className="text-gray-500"> ({test.reviewCount})</span>
                    </span>
                  </div>
                  
                  <Link 
                    href={`/lab-tests/${test.id}`}
                    className="px-4 py-2 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
          
        {/* Health Packages Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Health Packages</h2>
            <Link href="/lab-tests/health-packages" className="text-medical-teal-600 hover:text-medical-teal-700 flex items-center">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Health Package */}
            <div className="bg-gradient-to-br from-medical-teal-50 to-white rounded-xl shadow-card-soft border border-medical-teal-100 overflow-hidden">
              <div className="bg-medical-teal-600 py-4 px-6 text-white">
                <h3 className="text-xl font-bold">Basic Health Package</h3>
                <p className="text-medical-teal-100">Recommended for ages 18-40</p>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl font-bold text-medical-teal-800">$99</div>
                  <div className="text-sm text-gray-500">
                    <span className="line-through">$140</span>
                    <span className="ml-2 text-medical-teal-600 font-medium">30% OFF</span>
                  </div>
            </div>
            
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-medical-teal-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Complete Blood Count</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-teal-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Liver Function Test</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-teal-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Kidney Function Test</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-teal-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Lipid Profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-teal-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Blood Glucose (Fasting)</span>
                  </li>
                </ul>
                
                <button className="w-full py-3 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white rounded-lg transition-colors font-medium">
                  Book Package
                </button>
              </div>
            </div>
            
            {/* Comprehensive Health Package */}
            <div className="bg-gradient-to-br from-medical-blue-50 to-white rounded-xl shadow-card-soft border border-medical-blue-100 overflow-hidden relative">
              <div className="absolute top-3 right-3 bg-medical-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Most Popular
              </div>
              
              <div className="bg-medical-blue-600 py-4 px-6 text-white">
                <h3 className="text-xl font-bold">Comprehensive Package</h3>
                <p className="text-medical-blue-100">Recommended for ages 40+</p>
        </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl font-bold text-medical-blue-800">$179</div>
                  <div className="text-sm text-gray-500">
                    <span className="line-through">$250</span>
                    <span className="ml-2 text-medical-blue-600 font-medium">28% OFF</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">All Basic Package Tests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Thyroid Profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">HbA1c</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Vitamin B12 & D3</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Cardiac Risk Markers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-blue-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Free Doctor Consultation</span>
                  </li>
                </ul>
                
                <button className="w-full py-3 bg-gradient-to-r from-medical-blue-600 to-medical-blue-500 hover:from-medical-blue-700 hover:to-medical-blue-600 text-white rounded-lg transition-colors font-medium">
                  Book Package
                </button>
              </div>
            </div>
            
            {/* Women's Health Package */}
            <div className="bg-gradient-to-br from-medical-mint-50 to-white rounded-xl shadow-card-soft border border-medical-mint-100 overflow-hidden">
              <div className="bg-medical-mint-600 py-4 px-6 text-white">
                <h3 className="text-xl font-bold">Women's Health Package</h3>
                <p className="text-medical-mint-100">Comprehensive female checkup</p>
                  </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-3xl font-bold text-medical-mint-800">$149</div>
                  <div className="text-sm text-gray-500">
                    <span className="line-through">$200</span>
                    <span className="ml-2 text-medical-mint-600 font-medium">25% OFF</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-medical-mint-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Complete Blood Count</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-mint-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Thyroid Profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-mint-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Vitamin D & B12</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-mint-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Iron Studies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-mint-600 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Hormonal Assessment</span>
                  </li>
                </ul>
                
                <button className="w-full py-3 bg-gradient-to-r from-medical-mint-600 to-medical-mint-500 hover:from-medical-mint-700 hover:to-medical-mint-600 text-white rounded-lg transition-colors font-medium">
                  Book Package
                </button>
              </div>
            </div>
          </div>
        </div>
                    </div>
      
      {/* Process Section */}
      <div className="bg-gradient-to-br from-medical-teal-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our seamless process ensures you get accurate lab results without the hassle
            </p>
                  </div>
                  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Book Your Test",
                description: "Choose from our wide range of tests and health packages, then select a convenient time slot for sample collection.",
                icon: <FaCalendarAlt className="text-white text-xl" />
              },
              {
                title: "Home Sample Collection",
                description: "Our trained phlebotomist will visit your home at the scheduled time to collect the sample with all safety precautions.",
                icon: <FaHome className="text-white text-xl" />
              },
              {
                title: "Get Digital Reports",
                description: "Receive your test results digitally within the promised turnaround time, with an option for doctor consultation.",
                icon: <FaFlask className="text-white text-xl" />
              }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 shadow-lg">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(100%-2rem)] w-1/3 border-t-2 border-dashed border-medical-teal-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions about our lab tests? Find answers to common questions below
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Do I need to fast before my lab test?",
                answer: "It depends on the test. Some tests like lipid profile and glucose tests require 8-12 hours of fasting, while others don't. The specific fasting requirements will be clearly mentioned for each test when you book."
              },
              {
                question: "How soon will I get my results?",
                answer: "Most routine tests have a turnaround time of 24-48 hours. Specialized tests may take longer. The exact turnaround time is specified for each test on our platform."
              },
              {
                question: "Are home sample collections safe?",
                answer: "Yes, our trained phlebotomists follow all safety protocols and use sterile, disposable equipment for sample collection. They wear appropriate PPE and sanitize thoroughly before and after the procedure."
              },
              {
                question: "How accurate are the test results?",
                answer: "All samples are processed in NABL accredited laboratories using state-of-the-art equipment. Our partner labs maintain strict quality control measures to ensure accurate and reliable results."
              },
              {
                question: "Can I cancel or reschedule my appointment?",
                answer: "Yes, you can cancel or reschedule your appointment up to 6 hours before the scheduled time through your account or by contacting our customer support team."
              }
            ].map((faq, idx) => (
              <div key={idx} className="mb-6 bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
            </div>
            
          <div className="text-center mt-10">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/contact" 
                className="flex items-center text-medical-teal-600 hover:text-medical-teal-700"
              >
                <FaPhoneAlt className="mr-2" /> Contact Support
              </Link>
              <Link 
                href="/faq" 
                className="flex items-center text-medical-teal-600 hover:text-medical-teal-700"
              >
                <FaArrowRight className="mr-2" /> View All FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trust Section */}
      <div className="bg-gradient-to-br from-medical-teal-900 via-medical-teal-800 to-medical-mint-800 py-14 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Trusted by Patients and Doctors</h2>
            <p className="text-lg text-medical-teal-100 mb-10">
              Join thousands of satisfied users who rely on our services for accurate lab testing
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { count: "50,000+", label: "Tests Conducted" },
                { count: "98%", label: "Satisfaction Rate" },
                { count: "200+", label: "Certified Phlebotomists" },
                { count: "24/7", label: "Customer Support" }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.count}</div>
                  <div className="text-medical-teal-200">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-medical-teal-700">
              <p className="text-medical-teal-100 mb-6">Our Accreditations & Partners</p>
              
              <div className="flex flex-wrap justify-center gap-8">
                {[1, 2, 3, 4].map((partner) => (
                  <div key={partner} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="w-24 h-12 bg-white/20 rounded-md flex items-center justify-center">
                      Logo {partner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Take Control of Your Health Today</h2>
              <p className="text-lg text-medical-teal-100 mb-8 max-w-3xl mx-auto">
                Book your lab test now and get accurate results delivered to your doorstep
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-3 bg-white text-medical-teal-700 rounded-lg hover:bg-medical-teal-50 transition-colors font-medium">
                  Book a Test
                </button>
                <button className="px-8 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium">
                  View Health Packages
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <EnhancedFooter />
    </div>
  );
} 