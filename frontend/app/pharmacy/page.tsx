'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSearch, 
  FaFilter, 
  FaPills, 
  FaCapsules, 
  FaPercent, 
  FaClock, 
  FaTruck, 
  FaPhoneAlt, 
  FaStar,
  FaArrowRight,
  FaChevronDown,
  FaShieldAlt,
  FaPrescriptionBottleAlt,
  FaUserMd
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

// Sample medication data
const medications = [
  {
    id: 1,
    name: 'Amoxicillin',
    brandName: 'Amoxil',
    description: 'Antibiotic used to treat a number of bacterial infections.',
    price: 15.99,
    category: 'Antibiotics',
    dosage: '500mg',
    form: 'Capsule',
    requiresPrescription: true,
    rating: 4.8,
    reviewCount: 245,
    image: '/images/pharmacy/amoxicillin.jpg',
    discounted: false,
    inStock: true
  },
  {
    id: 2,
    name: 'Lisinopril',
    brandName: 'Prinivil',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    price: 12.50,
    category: 'Cardiovascular',
    dosage: '10mg',
    form: 'Tablet',
    requiresPrescription: true,
    rating: 4.7,
    reviewCount: 189,
    image: '/images/pharmacy/lisinopril.jpg',
    discounted: true,
    discountPercentage: 15,
    originalPrice: 14.75,
    inStock: true
  },
  {
    id: 3,
    name: 'Vitamin D3',
    brandName: 'Nature\'s Bounty',
    description: 'Dietary supplement for vitamin D deficiency and bone health.',
    price: 9.99,
    category: 'Vitamins & Supplements',
    dosage: '1000 IU',
    form: 'Softgel',
    requiresPrescription: false,
    rating: 4.9,
    reviewCount: 312,
    image: '/images/pharmacy/vitamind.jpg',
    discounted: true,
    discountPercentage: 20,
    originalPrice: 12.49,
    inStock: true
  },
  {
    id: 4,
    name: 'Ibuprofen',
    brandName: 'Advil',
    description: 'Nonsteroidal anti-inflammatory drug used to treat pain and inflammation.',
    price: 8.75,
    category: 'Pain Relief',
    dosage: '200mg',
    form: 'Tablet',
    requiresPrescription: false,
    rating: 4.6,
    reviewCount: 278,
    image: '/images/pharmacy/ibuprofen.jpg',
    discounted: false,
    inStock: true
  },
  {
    id: 5,
    name: 'Metformin',
    brandName: 'Glucophage',
    description: 'Anti-diabetic medication used to treat type 2 diabetes.',
    price: 11.25,
    category: 'Diabetes',
    dosage: '500mg',
    form: 'Tablet',
    requiresPrescription: true,
    rating: 4.7,
    reviewCount: 205,
    image: '/images/pharmacy/metformin.jpg',
    discounted: false,
    inStock: true
  },
  {
    id: 6,
    name: 'Cetirizine',
    brandName: 'Zyrtec',
    description: 'Antihistamine used to relieve allergy symptoms.',
    price: 14.50,
    category: 'Allergy',
    dosage: '10mg',
    form: 'Tablet',
    requiresPrescription: false,
    rating: 4.8,
    reviewCount: 197,
    image: '/images/pharmacy/cetirizine.jpg',
    discounted: true,
    discountPercentage: 10,
    originalPrice: 16.25,
    inStock: false
  }
];

// Medication categories
const categories = [
  { id: 1, name: 'Antibiotics', icon: <FaPills /> },
  { id: 2, name: 'Cardiovascular', icon: <FaHeartbeat /> },
  { id: 3, name: 'Diabetes', icon: <FaSyringe /> },
  { id: 4, name: 'Pain Relief', icon: <FaBandAid /> },
  { id: 5, name: 'Allergy', icon: <FaLeaf /> },
  { id: 6, name: 'Vitamins', icon: <FaCapsules /> },
  { id: 7, name: 'Skin Care', icon: <FaHandHoldingMedical /> },
  { id: 8, name: 'First Aid', icon: <FaFirstAid /> }
];

// Import icons
import { 
  FaHeartbeat, 
  FaSyringe, 
  FaBandAid, 
  FaLeaf,
  FaHandHoldingMedical,
  FaFirstAid
} from 'react-icons/fa';

export default function PharmacyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [requiresPrescription, setRequiresPrescription] = useState<boolean | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  
  // Get location from localStorage
  const [userLocation, setUserLocation] = useState('');
  
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);
  
  // Filter medications based on filters
  const filteredMedications = medications.filter(medication => {
    // Filter by search term
    const matchesSearch = 
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      medication.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === '' || medication.category === selectedCategory;
    
    // Filter by prescription requirement
    const matchesPrescription = requiresPrescription === null || medication.requiresPrescription === requiresPrescription;
    
    // Filter by stock status
    const matchesStock = !inStockOnly || medication.inStock;
    
    // Filter by discount status
    const matchesDiscount = !discountedOnly || medication.discounted;
    
    // Filter by price range
    const matchesPrice = medication.price >= priceRange[0] && medication.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrescription && matchesStock && matchesDiscount && matchesPrice;
  });
  
  // Sort medications based on sort option
  const sortedMedications = [...filteredMedications].sort((a, b) => {
    switch (sortOption) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default:
        return 0; // Recommended - keep original order
    }
  });
  
  // Handle price range changes
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Navbar */}
      <EnhancedNavbar />
      
      {/* Pharmacy Content */}
      <div className="pt-20 pb-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-medical-teal-900 via-medical-teal-800 to-medical-mint-800 pt-16 pb-20">
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
                Online Pharmacy <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-mint-300 to-medical-teal-300">Delivered to Your Door</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/90 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Order prescription medications and over-the-counter products with fast, reliable delivery.
                Our licensed pharmacists ensure you get the right medicines, right when you need them.
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
                      placeholder="Search medications, health products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => console.log('Search for:', searchTerm)}
                    className="px-6 py-3 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center justify-center whitespace-nowrap"
                  >
                    <FaSearch className="mr-2" />
                    <span>Find Products</span>
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
                  { icon: <FaTruck />, label: "Free Delivery" },
                  { icon: <FaClock />, label: "24/7 Pharmacist Support" },
                  { icon: <FaPercent />, label: "Regular Discounts" },
                  { icon: <FaShieldAlt />, label: "Secure & Authentic" }
                ].map((feature, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                    <div className="text-medical-mint-400 text-2xl mb-2">
                      {feature.icon}
                    </div>
                    <div className="text-white text-sm font-medium">{feature.label}</div>
                  </div>
                ))}
              </motion.div>
              
              {/* Call to upload prescription */}
              <motion.div 
                className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-3xl mx-auto border border-white/10 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-4xl text-medical-mint-300">
                    <FaPrescriptionBottleAlt />
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Have a Prescription?</h3>
                    <p className="text-medical-mint-100">Upload your prescription and we'll deliver your medications to your doorstep.</p>
                  </div>
                  <div>
                    <Link 
                      href="/pharmacy/upload-prescription"
                      className="inline-flex items-center px-5 py-3 bg-white text-medical-teal-700 rounded-lg hover:bg-medical-teal-50 transition-colors font-medium shadow-md"
                    >
                      Upload Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
              <Link href="/pharmacy/categories" className="text-medical-teal-600 hover:text-medical-teal-700 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map(category => (
                <motion.div 
                  key={category.id} 
                  className={`text-center p-4 bg-white rounded-lg shadow-card-soft hover:shadow-card-hover transition-all duration-300 cursor-pointer hover:bg-medical-teal-50 ${selectedCategory === category.name ? 'ring-2 ring-medical-teal-500 bg-medical-teal-50' : ''}`}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedCategory(prev => prev === category.name ? '' : category.name)}
                >
                  <div className={`text-3xl mb-3 mx-auto ${selectedCategory === category.name ? 'text-medical-teal-700' : 'text-medical-teal-600'}`}>
                    {category.icon}
                  </div>
                  <div className={`text-sm font-medium ${selectedCategory === category.name ? 'text-medical-teal-700' : 'text-gray-800'}`}>
                    {category.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Column */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-card-soft border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h2 className="font-bold text-gray-900 flex items-center">
                    <FaFilter className="mr-2 text-medical-teal-600" /> Filters
                  </h2>
                  <button 
                    className="text-sm text-medical-teal-600 hover:text-medical-teal-800 transition-colors"
                    onClick={() => {
                      setSelectedCategory('');
                      setRequiresPrescription(null);
                      setInStockOnly(false);
                      setDiscountedOnly(false);
                      setPriceRange([0, 50]);
                      setSortOption('recommended');
                    }}
                  >
                    Clear All
                  </button>
                </div>
                
                {/* Filter sections */}
                <div className="p-4 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-full">
                        <input 
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-medical-teal-600"
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prescription Requirement */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Prescription</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="prescription"
                          className="text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={requiresPrescription === null}
                          onChange={() => setRequiresPrescription(null)}
                        />
                        <span className="text-sm text-gray-700">All Products</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="prescription"
                          className="text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={requiresPrescription === false}
                          onChange={() => setRequiresPrescription(false)}
                        />
                        <span className="text-sm text-gray-700">Over-the-Counter</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="prescription"
                          className="text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={requiresPrescription === true}
                          onChange={() => setRequiresPrescription(true)}
                        />
                        <span className="text-sm text-gray-700">Prescription Required</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Additional Filters */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Additional Filters</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={inStockOnly}
                          onChange={() => setInStockOnly(!inStockOnly)}
                        />
                        <span className="text-sm text-gray-700">In Stock Only</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-medical-teal-600 focus:ring-medical-teal-500 border-gray-300"
                          checked={discountedOnly}
                          onChange={() => setDiscountedOnly(!discountedOnly)}
                        />
                        <span className="text-sm text-gray-700">Discounted Only</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Sort Options */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sort By</h3>
                    <select
                      className="w-full rounded-lg border-gray-300 focus:ring-medical-teal-500 focus:border-medical-teal-500 text-sm"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name_asc">Name: A to Z</option>
                      <option value="name_desc">Name: Z to A</option>
                    </select>
                  </div>
                  
                  {/* Apply Filters Button (Mobile only) */}
                  <div className="pt-2 lg:hidden">
                    <button className="w-full py-2 bg-medical-teal-600 hover:bg-medical-teal-700 text-white rounded-lg transition-colors shadow-sm">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Column */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory : 'All Products'}
                  {userLocation && (
                    <span className="text-base font-normal text-gray-500 ml-2">
                      in {userLocation}
                    </span>
                  )}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {sortedMedications.length} of {medications.length} products
                </div>
              </div>
              
              {/* Medication Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMedications.map((medication) => (
                  <motion.div 
                    key={medication.id}
                    className="bg-white rounded-xl shadow-card-soft hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100"
                    whileHover={{ y: -5 }}
                  >
                    {/* Top badge for prescription or discount */}
                    {(medication.requiresPrescription || medication.discounted) && (
                      <div className="relative">
                        {medication.requiresPrescription && (
                          <div className="absolute left-3 top-3 bg-medical-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase z-10">
                            Rx
                          </div>
                        )}
                        {medication.discounted && (
                          <div className="absolute right-3 top-3 bg-medical-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase z-10">
                            {medication.discountPercentage}% Off
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image 
                        src={medication.image} 
                        alt={medication.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-300 p-4"
                      />
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-1">
                        <span className="text-xs text-medical-teal-600 font-medium">{medication.category}</span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-1">{medication.name}</h3>
                      <div className="text-sm text-gray-600 mb-1">{medication.brandName}</div>
                      
                      <div className="flex items-start mb-3">
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-500 mr-1">
                            <FaStar />
                          </div>
                          <span className="text-sm text-gray-700">
                            <span className="font-medium">{medication.rating}</span>
                            <span className="text-gray-500"> ({medication.reviewCount})</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-4">
                        {medication.form} • {medication.dosage}
                      </div>
                      
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          {medication.discounted ? (
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-medical-teal-700">${medication.price.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through">${medication.originalPrice?.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-medical-teal-700">${medication.price.toFixed(2)}</span>
                          )}
                        </div>
                        
                        <div className={`text-xs font-medium ${medication.inStock ? 'text-medical-green-600' : 'text-medical-red-600'}`}>
                          {medication.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                      
                      <div className="flex justify-between space-x-3">
                        <Link 
                          href={`/pharmacy/product/${medication.id}`}
                          className="flex-1 px-3 py-2 bg-white border border-medical-teal-300 text-medical-teal-700 rounded-lg hover:bg-medical-teal-50 transition-colors text-center text-sm font-medium"
                        >
                          Details
                        </Link>
                        <button 
                          className={`flex-1 px-3 py-2 text-white rounded-lg transition-colors text-center text-sm font-medium ${
                            medication.inStock ? 'bg-medical-teal-600 hover:bg-medical-teal-700' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!medication.inStock}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* No results */}
              {sortedMedications.length === 0 && (
                <div className="bg-white rounded-lg shadow-card-soft p-8 text-center">
                  <div className="text-medical-teal-500 mb-4">
                    <FaPills className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-4">We couldn't find any products matching your search criteria.</p>
                  <button 
                    onClick={() => {
                      setSelectedCategory('');
                      setRequiresPrescription(null);
                      setSearchTerm('');
                      setInStockOnly(false);
                      setDiscountedOnly(false);
                    }}
                    className="px-4 py-2 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors shadow-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Consultation Section */}
        <div className="bg-gradient-to-br from-medical-teal-50 to-medical-blue-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 md:p-12 bg-gradient-to-br from-medical-teal-700 to-medical-teal-900 text-white">
                  <h2 className="text-3xl font-bold mb-4">Need Medication Advice?</h2>
                  <p className="text-medical-teal-100 mb-6">
                    Speak with one of our licensed pharmacists for professional guidance on medications, side effects, and drug interactions.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      'Personalized medication reviews',
                      'Drug interaction checks',
                      'Side effect management',
                      'Prescription counseling',
                      'OTC medication guidance'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-medical-teal-300 mr-2">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div>
                    <Link 
                      href="/pharmacy/consult"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-medical-teal-700 bg-white hover:bg-medical-teal-50 transition-colors"
                    >
                      <FaUserMd className="mr-2" /> Schedule a Consultation
                    </Link>
                  </div>
                </div>
                
                <div className="lg:w-1/2 p-8 md:p-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Online Prescription Refills</h3>
                  <p className="text-gray-600 mb-6">
                    Need to refill your prescription? Upload your prescription or transfer it from another pharmacy for quick and hassle-free service.
                  </p>
                  
                  <div className="bg-medical-teal-50 rounded-xl p-5 mb-6 border border-medical-teal-100">
                    <div className="flex items-start">
                      <div className="text-medical-teal-600 text-xl mr-4 mt-1">
                        <FaPrescriptionBottleAlt />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Automatic Refill Program</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Never run out of your important medications. Sign up for automatic refills and we'll deliver your medications before you run out.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/pharmacy/refill"
                      className="px-5 py-3 bg-medical-teal-600 text-white rounded-lg hover:bg-medical-teal-700 transition-colors text-center font-medium"
                    >
                      Refill Prescription
                    </Link>
                    <Link 
                      href="/pharmacy/transfer"
                      className="px-5 py-3 bg-white border border-medical-teal-300 text-medical-teal-700 rounded-lg hover:bg-medical-teal-50 transition-colors text-center font-medium"
                    >
                      Transfer Prescription
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Footer */}
      <EnhancedFooter />
    </div>
  );
} 