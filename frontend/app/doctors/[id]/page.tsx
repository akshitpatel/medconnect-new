'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaStethoscope, 
         FaGraduationCap, FaClinicMedical, FaClock, FaMoneyBillWave, 
         FaVideo, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';

// Mock doctor data for now, in a real app would fetch from API based on ID
const doctorData = {
  id: 1,
  name: 'Dr. Anil Kumar',
  credentials: 'MD, MBBS',
  specializations: ['Cardiologist'],
  bio: 'Dr. Anil Kumar is a highly experienced cardiologist with over 15 years of practice. He specializes in interventional cardiology and non-invasive cardiac diagnostics. Dr. Kumar is known for his patient-centered approach and has been recognized multiple times for excellence in cardiac care.',
  qualifications: [
    { degree: 'MBBS', institution: 'All India Institute of Medical Sciences, Delhi', year: '2002' },
    { degree: 'MD (Cardiology)', institution: 'Post Graduate Institute of Medical Education and Research, Chandigarh', year: '2006' },
    { degree: 'Fellowship in Interventional Cardiology', institution: 'Cleveland Clinic, USA', year: '2008' },
  ],
  servicesOffered: [
    'Cardiac Consultation',
    'Electrocardiogram (ECG)',
    'Echocardiography',
    'Stress Test',
    'Holter Monitoring',
    'Cardiac Risk Assessment',
    'Cardiac Rehabilitation',
  ],
  clinics: [
    {
      name: 'City Heart Clinic',
      address: '123 Health Street, Koramangala, Bangalore',
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'cityheart@example.com',
        website: 'www.cityheartclinic.com',
      },
      operatingHours: [
        { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 1:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 1:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ],
      facilities: ['Wheelchair Accessible', 'Parking Available', 'Laboratory', 'Pharmacy'],
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      ],
    },
    {
      name: 'Bangalore Medical Center',
      address: '456 Hospital Road, Indiranagar, Bangalore',
      contactInfo: {
        phone: '+91 99876 54321',
        email: 'contact@bangaloremedical.com',
        website: 'www.bangaloremedical.com',
      },
      operatingHours: [
        { day: 'Monday', hours: 'Closed' },
        { day: 'Tuesday', hours: 'Closed' },
        { day: 'Wednesday', hours: 'Closed' },
        { day: 'Thursday', hours: 'Closed' },
        { day: 'Friday', hours: '2:00 PM - 8:00 PM' },
        { day: 'Saturday', hours: '2:00 PM - 8:00 PM' },
        { day: 'Sunday', hours: 'Closed' },
      ],
      facilities: ['Wheelchair Accessible', 'Valet Parking', 'Emergency Services'],
      images: [
        'https://images.unsplash.com/photo-1512678080530-7760d81faba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      ],
    },
  ],
  consultationFees: {
    clinic: 800,
    online: 600,
  },
  availability: {
    snippet: 'Available Today',
    online: true,
    calendar: [
      { date: '2023-05-24', slots: ['10:00 AM', '11:00 AM', '4:00 PM'] },
      { date: '2023-05-25', slots: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'] },
      { date: '2023-05-26', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] },
    ],
  },
  rating: 4.8,
  reviewCount: 124,
  reviews: [
    {
      id: 1,
      patientName: 'Rahul Sharma',
      rating: 5,
      date: '2023-04-15',
      comment: 'Dr. Kumar is very thorough and took the time to explain everything. The clinic is clean and well-maintained.',
    },
    {
      id: 2,
      patientName: 'Sunita Patel',
      rating: 4,
      date: '2023-03-22',
      comment: 'Good doctor, but had to wait 30 minutes for my appointment. The consultation was excellent though.',
    },
    {
      id: 3,
      patientName: 'Vijay Mehta',
      rating: 5,
      date: '2023-02-10',
      comment: 'Very knowledgeable doctor who explained my condition in simple terms. Would definitely recommend.',
    },
  ],
  guruProgram: true,
  image: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Types
interface DoctorProfile {
  id: number;
  name: string;
  credentials: string;
  specializations: string[];
  bio: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  servicesOffered: string[];
  clinics: Array<{
    name: string;
    address: string;
    contactInfo: {
      phone: string;
      email: string;
      website: string;
    };
    operatingHours: Array<{
      day: string;
      hours: string;
    }>;
    facilities: string[];
    images: string[];
  }>;
  consultationFees: {
    clinic: number;
    online: number;
  };
  availability: {
    snippet: string;
    online: boolean;
    calendar: Array<{
      date: string;
      slots: string[];
    }>;
  };
  rating: number;
  reviewCount: number;
  reviews: Array<{
    id: number;
    patientName: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  guruProgram: boolean;
  image: string;
}

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [selectedClinic, setSelectedClinic] = useState(0);
  const [consultationType, setConsultationType] = useState<'clinic' | 'online'>('clinic');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  
  // In a real app, this would fetch doctor data from the API
  useEffect(() => {
    // Simulate API call with doctorData
    setDoctor(doctorData);
    
    // Initialize selected date if availability exists
    if (doctorData.availability.calendar && doctorData.availability.calendar.length > 0) {
      setSelectedDate(doctorData.availability.calendar[0].date);
    }
  }, [params.id]);
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Get available slots for selected date
  const getAvailableSlots = () => {
    const dateData = doctor.availability.calendar.find(d => d.date === selectedDate);
    return dateData ? dateData.slots : [];
  };
  
  // Handle appointment booking
  const handleBookAppointment = () => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }
    
    console.log('Booking appointment:', {
      doctorId: doctor.id,
      consultationType,
      clinicId: consultationType === 'clinic' ? doctor.clinics[selectedClinic].name : null,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    });
    
    // In a real app, this would submit the booking to an API
    alert('Appointment booking would be processed here');
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Doctor Profile Header */}
      <section className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row">
            {/* Doctor Image and Rating */}
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-40 h-40 rounded-full object-cover border-2 border-gray-200"
                />
                {doctor.guruProgram && (
                  <span className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    Guru+
                  </span>
                )}
              </div>
              <div className="flex items-center mt-3">
                <FaStar className="text-yellow-400" />
                <span className="ml-1 font-semibold">{doctor.rating}</span>
                <span className="ml-1 text-gray-500">({doctor.reviewCount} reviews)</span>
              </div>
            </div>
            
            {/* Doctor Information */}
            <div className="md:w-2/4 mt-6 md:mt-0">
              <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
              <p className="text-lg text-gray-600">{doctor.credentials}</p>
              <p className="text-md text-gray-700 mt-1">
                {doctor.specializations.join(', ')}
              </p>
              
              {doctor.clinics.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-start">
                    <FaClinicMedical className="text-primary-500 mt-1 mr-2" />
                    <div>
                      <p className="font-medium">{doctor.clinics[0].name}</p>
                      <p className="text-sm text-gray-600">{doctor.clinics[0].address}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {doctor.clinics.length > 1 && (
                <p className="mt-2 text-sm text-primary-600">+{doctor.clinics.length - 1} more clinics</p>
              )}
            </div>
            
            {/* Book Appointment Button */}
            <div className="md:w-1/4 mt-6 md:mt-0 flex flex-col items-center md:items-end">
              <button 
                className="btn-primary w-full md:w-auto" 
                onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Appointment
              </button>
              
              {doctor.availability.online && (
                <span className="mt-2 inline-flex items-center text-primary-600">
                  <FaVideo className="mr-1" /> Online Consultation Available
                </span>
              )}
              
              <div className="mt-4 flex flex-col md:items-end">
                <div className="flex items-center">
                  <FaCalendarAlt className="text-primary-500 mr-2" />
                  <span className="text-sm font-medium">{doctor.availability.snippet}</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Clinic Fee</p>
                  <p className="font-semibold">₹{doctor.consultationFees.clinic}</p>
                </div>
                {doctor.availability.online && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Online Fee</p>
                    <p className="font-semibold">₹{doctor.consultationFees.online}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs Navigation */}
      <section className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'about' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button 
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'services' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('services')}
            >
              Services Offered
            </button>
            <button 
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'clinics' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('clinics')}
            >
              Clinic Details
            </button>
            <button 
              className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
        </div>
      </section>
      
      {/* Tab Content */}
      <section className="container mx-auto px-4 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">About Dr. {doctor.name.split(' ')[1]}</h3>
            <p className="text-gray-700 mb-6">{doctor.bio}</p>
            
            <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <FaGraduationCap className="mr-2 text-primary-500" /> Qualifications & Education
            </h4>
            <div className="space-y-3 mb-8">
              {doctor.qualifications.map((qual, index) => (
                <div key={index} className="flex">
                  <div className="w-16 text-right text-primary-600 font-medium mr-4">
                    {qual.year}
                  </div>
                  <div>
                    <p className="font-medium">{qual.degree}</p>
                    <p className="text-sm text-gray-600">{qual.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaStethoscope className="mr-2 text-primary-500" /> Services Offered
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.servicesOffered.map((service, index) => (
                <div key={index} className="flex items-center bg-gray-50 p-3 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mr-3"></div>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Clinics Tab */}
        {activeTab === 'clinics' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {doctor.clinics.length > 1 && (
              <div className="mb-6 flex overflow-x-auto space-x-2">
                {doctor.clinics.map((clinic, index) => (
                  <button 
                    key={index} 
                    className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none transition-colors ${
                      selectedClinic === index 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedClinic(index)}
                  >
                    {clinic.name}
                  </button>
                ))}
              </div>
            )}
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {doctor.clinics[selectedClinic].name}
              </h3>
              
              {/* Clinic Images */}
              {doctor.clinics[selectedClinic].images.length > 0 && (
                <div className="mb-6 overflow-x-auto">
                  <div className="flex space-x-4">
                    {doctor.clinics[selectedClinic].images.map((img, index) => (
                      <img 
                        key={index} 
                        src={img} 
                        alt={`${doctor.clinics[selectedClinic].name} - ${index + 1}`} 
                        className="w-60 h-40 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Address & Contact */}
                <div>
                  <div className="flex items-start mb-4">
                    <FaMapMarkerAlt className="text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Address</h4>
                      <p className="text-gray-600">{doctor.clinics[selectedClinic].address}</p>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(doctor.clinics[selectedClinic].address)}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-primary-600 text-sm hover:underline mt-1 inline-block">
                        Get Directions
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaPhoneAlt className="text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Phone</h4>
                      <p className="text-gray-600">{doctor.clinics[selectedClinic].contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaEnvelope className="text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">{doctor.clinics[selectedClinic].contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaGlobe className="text-primary-500 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Website</h4>
                      <a href={`https://${doctor.clinics[selectedClinic].contactInfo.website}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-primary-600 hover:underline">
                        {doctor.clinics[selectedClinic].contactInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Hours & Facilities */}
                <div>
                  <div className="mb-6">
                    <div className="flex items-start mb-2">
                      <FaClock className="text-primary-500 mt-1 mr-3" />
                      <h4 className="font-medium text-gray-800">Operating Hours</h4>
                    </div>
                    <div className="ml-7">
                      {doctor.clinics[selectedClinic].operatingHours.map((oh, index) => (
                        <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-100">
                          <span className="font-medium">{oh.day}</span>
                          <span className={oh.hours === 'Closed' ? 'text-red-500' : 'text-gray-600'}>
                            {oh.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Facilities & Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.clinics[selectedClinic].facilities.map((facility, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Patient Reviews</h3>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-semibold">{doctor.rating}</span>
                <span className="text-gray-500 ml-1">({doctor.reviewCount} reviews)</span>
              </div>
            </div>
            
            {/* Review List */}
            <div className="space-y-6">
              {doctor.reviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 pb-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{review.patientName}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button className="btn-secondary">Write a Review</button>
            </div>
          </div>
        )}
      </section>
      
      {/* Booking Section */}
      <section id="booking-section" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Book an Appointment</h3>
          
          {/* Consultation Type */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Select Consultation Type</h4>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md flex items-center border ${
                  consultationType === 'clinic' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setConsultationType('clinic')}
              >
                <FaClinicMedical className="mr-2" />
                Clinic Visit
              </button>
              
              {doctor.availability.online && (
                <button
                  className={`px-4 py-2 rounded-md flex items-center border ${
                    consultationType === 'online' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setConsultationType('online')}
                >
                  <FaVideo className="mr-2" />
                  Online Consultation
                </button>
              )}
            </div>
          </div>
          
          {/* Clinic Selection (if Clinic Visit) */}
          {consultationType === 'clinic' && doctor.clinics.length > 1 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Select Clinic</h4>
              <div className="flex flex-wrap gap-2">
                {doctor.clinics.map((clinic, index) => (
                  <button 
                    key={index} 
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                      selectedClinic === index 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClinic(index)}
                  >
                    {clinic.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Date Selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Select Date</h4>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {doctor.availability.calendar.map((date, index) => {
                const dateObj = new Date(date.date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString('default', { month: 'short' });
                const dayName = dateObj.toLocaleString('default', { weekday: 'short' });
                
                return (
                  <button 
                    key={index} 
                    className={`px-4 py-3 rounded-md border min-w-[90px] ${
                      selectedDate === date.date 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedDate(date.date);
                      setSelectedTimeSlot('');
                    }}
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium">{dayName}</p>
                      <p className="text-lg font-bold">{day}</p>
                      <p className="text-xs">{month}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Select Time Slot</h4>
              <div className="flex flex-wrap gap-2">
                {getAvailableSlots().map((slot, index) => (
                  <button 
                    key={index} 
                    className={`px-4 py-2 rounded-md border ${
                      selectedTimeSlot === slot 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Booking Summary */}
          {selectedTimeSlot && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-800 mb-3">Appointment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Type:</span>
                  <span className="font-medium">{consultationType === 'clinic' ? 'Clinic Visit' : 'Online Consultation'}</span>
                </div>
                {consultationType === 'clinic' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clinic:</span>
                    <span className="font-medium">{doctor.clinics[selectedClinic].name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })} - {selectedTimeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-medium">
                    ₹{consultationType === 'clinic' ? doctor.consultationFees.clinic : doctor.consultationFees.online}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="reason" className="block font-medium text-gray-700 mb-2">
                  Reason for Appointment (Optional)
                </label>
                <textarea 
                  id="reason" 
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Briefly describe your symptoms or reason for consultation"
                ></textarea>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <button 
              className="btn-primary px-8 py-3"
              onClick={handleBookAppointment}
              disabled={!selectedTimeSlot}
            >
              Confirm & Proceed to Payment
            </button>
          </div>
        </div>
      </section>
    </main>
  );
} 