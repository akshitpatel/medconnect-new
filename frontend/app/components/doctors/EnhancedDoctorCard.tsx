"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaStar, 
  FaRegCalendarAlt, 
  FaMapMarkerAlt, 
  FaVideo, 
  FaClinicMedical, 
  FaHome, 
  FaCertificate, 
  FaCheck, 
  FaHeart, 
  FaRegHeart,
  FaThumbsUp,
  FaPhoneAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { RiVerifiedBadgeFill, RiShieldStarFill } from 'react-icons/ri';
import { MdRecommend, MdVerified } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Doctor {
  id: string;
  name: string;
  imageUrl: string;
  qualifications: string;
  specializations: string[];
  experience: number;
  clinicName: string;
  clinicLocation: string;
  clinicDistance?: number;
  consultationFeeClinic: number;
  consultationFeeOnline: number;
  availability: {
    nextAvailable: string;
    slots: {
      date: string;
      available: boolean;
      times: string[];
    }[];
  };
  rating: number;
  reviewCount: number;
  isGuruProgram: boolean;
  services: string[];
  languages: string[];
  insuranceAccepted: string[];
  conditions: string[];
  awards: string[];
  recommendations: number;
}

interface EnhancedDoctorCardProps {
  doctor: Doctor;
  onFavorite?: (doctorId: string) => void;
  isFavorite?: boolean;
}

const EnhancedDoctorCard: React.FC<EnhancedDoctorCardProps> = ({ 
  doctor, 
  onFavorite, 
  isFavorite = false 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [currentFavorite, setCurrentFavorite] = useState(isFavorite);

  const handleFavoriteClick = () => {
    setCurrentFavorite(!currentFavorite);
    if (onFavorite) {
      onFavorite(doctor.id);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get next 3 available dates
  const nextAvailableDates = doctor.availability.slots
    .filter(slot => slot.available)
    .slice(0, 3);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 overflow-hidden"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Doctor Card Header */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Doctor Image Section */}
        <div className="relative flex-shrink-0 w-full md:w-40 flex justify-center md:justify-start">
          <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-medical-teal-50">
            <Image 
              src={doctor.imageUrl} 
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>
          {doctor.isGuruProgram && (
            <div className="absolute top-0 right-0 md:-right-1">
              <div className="group relative">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-medical-teal-500 to-medical-teal-700 rounded-full shadow-lg">
                  <RiShieldStarFill className="text-white w-5 h-5" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-10 w-40 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg pointer-events-none">
                  Verified MedConnect Provider
                  <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-[5px] w-0 h-0 border-x-4 border-t-4 border-t-gray-900 border-x-transparent"></div>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={handleFavoriteClick}
            className="absolute bottom-0 right-0 md:-right-1 bg-white rounded-full p-2 shadow-md"
          >
            {currentFavorite ? (
              <FaHeart className="text-red-500" size={20} />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500" size={20} />
            )}
          </button>
        </div>

        {/* Doctor Info Section */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <Link href={`/doctors/${doctor.id}`} className="inline-block">
                <h2 className="text-xl font-bold text-gray-800 hover:text-medical-teal-600 transition-colors">
                  Dr. {doctor.name}
                  {doctor.isGuruProgram && (
                    <MdVerified className="inline-block ml-1 text-medical-teal-500" />
                  )}
                </h2>
              </Link>
              <p className="text-sm text-gray-600">{doctor.qualifications}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {doctor.specializations.map((specialization, idx) => (
                  <span 
                    key={idx} 
                    className="inline-block bg-medical-teal-50 text-medical-teal-700 text-xs px-2 py-1 rounded-full"
                  >
                    {specialization}
                  </span>
                ))}
              </div>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full mr-2">
                  <FaStar className="text-amber-500 mr-1" />
                  <span>{doctor.rating}</span>
                </div>
                <span className="text-xs text-gray-600">
                  {doctor.reviewCount} reviews
                </span>
                {doctor.recommendations > 0 && (
                  <span className="ml-2 flex items-center text-xs text-gray-600">
                    <FaThumbsUp className="text-medical-teal-600 mr-1" />
                    {doctor.recommendations} recommendations
                  </span>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-600 flex items-center">
                <FaMapMarkerAlt className="text-medical-teal-500 mr-1" />
                <span>{doctor.clinicName}, {doctor.clinicLocation}</span>
                {doctor.clinicDistance && (
                  <span className="ml-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">
                    {doctor.clinicDistance} km
                  </span>
                )}
              </div>
            </div>
            
            {/* Experience Badge */}
            <div className="mt-3 md:mt-0 flex items-center bg-medical-teal-50 text-medical-teal-700 px-3 py-1.5 rounded-full">
              <FaCertificate className="mr-1.5" />
              <span className="text-sm font-medium">{doctor.experience} Years Exp</span>
            </div>
          </div>
          
          {/* Fee and Consultation Options */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-medical-teal-100 flex items-center justify-center mr-3">
                <FaClinicMedical className="text-medical-teal-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">In-Clinic Consultation</p>
                <p className="font-bold text-gray-800">₹{doctor.consultationFeeClinic}</p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FaVideo className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Video Consultation</p>
                <p className="font-bold text-gray-800">₹{doctor.consultationFeeOnline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Available Time Slots */}
      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between text-gray-700 mb-3">
          <div className="flex items-center">
            <FaRegCalendarAlt className="mr-2 text-medical-teal-600" />
            <span className="text-sm font-medium">Next Available Slots</span>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/doctors/${doctor.id}`}
              className="px-3 py-1.5 bg-medical-teal-600 text-white rounded-md text-sm font-medium hover:bg-medical-teal-700 transition-colors inline-flex items-center"
            >
              <FaPhoneAlt className="mr-1.5 text-xs" />
              Contact
            </Link>
            <Link
              href={`/doctors/${doctor.id}/book`}
              className="px-4 py-1.5 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 text-white rounded-md text-sm font-medium hover:from-medical-teal-700 hover:to-medical-teal-600 transition-colors inline-flex items-center shadow-sm"
            >
              <FaRegCalendarAlt className="mr-1.5 text-xs" />
              Book Now
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {nextAvailableDates.map((slot, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-3 text-center hover:border-medical-teal-300 transition-colors cursor-pointer hover:bg-medical-teal-50/30">
              <p className="text-xs font-medium text-gray-800">{formatDate(slot.date)}</p>
              <p className="text-xs text-medical-teal-600 font-medium mt-1">
                {slot.times.length} slots available
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Expanded View Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 w-full flex items-center justify-center text-sm text-medical-teal-600 hover:text-medical-teal-700 font-medium py-1"
      >
        {expanded ? (
          <>
            <span>Show Less</span>
            <FaChevronUp className="ml-1 text-xs" />
          </>
        ) : (
          <>
            <span>Show More</span>
            <FaChevronDown className="ml-1 text-xs" />
          </>
        )}
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-gray-200">
              {/* Services */}
              {doctor.services.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.services.map((service, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                      >
                        <FaCheck className="mr-1 text-medical-teal-500 text-xs" />
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Languages */}
              {doctor.languages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Languages Spoken</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language, idx) => (
                      <span 
                        key={idx} 
                        className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Insurance */}
              {doctor.insuranceAccepted.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Insurance Accepted</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.insuranceAccepted.map((insurance, idx) => (
                      <span 
                        key={idx} 
                        className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md"
                      >
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Conditions Treated */}
              {doctor.conditions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Conditions Treated</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.conditions.map((condition, idx) => (
                      <span 
                        key={idx} 
                        className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-md"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Awards & Recognition */}
              {doctor.awards.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Awards & Recognition</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.awards.map((award, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md"
                      >
                        <FaCertificate className="mr-1 text-yellow-500 text-xs" />
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedDoctorCard; 