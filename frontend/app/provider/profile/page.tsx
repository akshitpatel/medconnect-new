'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FaUserMd, 
  FaHospital, 
  FaCertificate, 
  FaLanguage, 
  FaMoneyBillWave,
  FaRegClock,
  FaCheck,
  FaPlus,
  FaTimes,
  FaUpload
} from 'react-icons/fa';

// Types for profile data
interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  id: string;
  position: string;
  hospital: string;
  startYear: string;
  endYear: string | 'Present';
}

interface Service {
  id: string;
  name: string;
  price?: number;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  languages: string[];
  profileImage: string;
  licenseNumber: string;
  education: Education[];
  experience: Experience[];
  services: Service[];
  consultationFee: number;
  availability: {
    monday: { start: string; end: string } | null;
    tuesday: { start: string; end: string } | null;
    wednesday: { start: string; end: string } | null;
    thursday: { start: string; end: string } | null;
    friday: { start: string; end: string } | null;
    saturday: { start: string; end: string } | null;
    sunday: { start: string; end: string } | null;
  };
}

// Mock data
const mockDoctorProfile: Doctor = {
  id: 'doc-1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@medconnect.com',
  phone: '(555) 123-4567',
  specialization: 'Cardiologist',
  bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 10 years of experience in treating various heart conditions. She specializes in preventive cardiology and heart failure management.',
  languages: ['English', 'Spanish'],
  profileImage: '/doctor-profile.jpg',
  licenseNumber: 'MD-12345-CA',
  education: [
    {
      id: 'edu-1',
      degree: 'M.D.',
      institution: 'Stanford University School of Medicine',
      year: '2008'
    },
    {
      id: 'edu-2',
      degree: 'Residency in Internal Medicine',
      institution: 'Johns Hopkins Hospital',
      year: '2011'
    },
    {
      id: 'edu-3',
      degree: 'Fellowship in Cardiology',
      institution: 'Mayo Clinic',
      year: '2014'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      position: 'Cardiologist',
      hospital: 'MedConnect Hospital',
      startYear: '2018',
      endYear: 'Present'
    },
    {
      id: 'exp-2',
      position: 'Cardiologist',
      hospital: 'City General Hospital',
      startYear: '2014',
      endYear: '2018'
    }
  ],
  services: [
    { id: 'ser-1', name: 'Initial Consultation', price: 250 },
    { id: 'ser-2', name: 'Follow-up Visit', price: 150 },
    { id: 'ser-3', name: 'ECG', price: 100 },
    { id: 'ser-4', name: 'Echocardiogram', price: 350 },
    { id: 'ser-5', name: 'Stress Test', price: 300 }
  ],
  consultationFee: 250,
  availability: {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '13:00' },
    saturday: null,
    sunday: null
  }
};

export default function ProviderProfile() {
  // State for the doctor profile (in a real app, this would be fetched from an API)
  const [doctorProfile, setDoctorProfile] = useState<Doctor>(mockDoctorProfile);
  
  // State for the form sections
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for new entries
  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({ 
    degree: '', institution: '', year: '' 
  });
  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({ 
    position: '', hospital: '', startYear: '', endYear: '' 
  });
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({ 
    name: '', price: undefined 
  });
  const [newLanguage, setNewLanguage] = useState('');
  
  // Helper function to generate IDs
  const generateId = (prefix: string) => `${prefix}-${Date.now()}`;
  
  // Handle adding new education
  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.institution || !newEducation.year) return;
    
    setDoctorProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { ...newEducation, id: generateId('edu') }
      ]
    }));
    
    setNewEducation({ degree: '', institution: '', year: '' });
  };
  
  // Handle adding new experience
  const handleAddExperience = () => {
    if (!newExperience.position || !newExperience.hospital || !newExperience.startYear) return;
    
    setDoctorProfile(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { ...newExperience, id: generateId('exp') }
      ]
    }));
    
    setNewExperience({ position: '', hospital: '', startYear: '', endYear: '' });
  };
  
  // Handle adding new service
  const handleAddService = () => {
    if (!newService.name) return;
    
    setDoctorProfile(prev => ({
      ...prev,
      services: [
        ...prev.services,
        { ...newService, id: generateId('ser') }
      ]
    }));
    
    setNewService({ name: '', price: undefined });
  };
  
  // Handle adding new language
  const handleAddLanguage = () => {
    if (!newLanguage || doctorProfile.languages.includes(newLanguage)) return;
    
    setDoctorProfile(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
    
    setNewLanguage('');
  };
  
  // Handle removing items
  const handleRemoveEducation = (id: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };
  
  const handleRemoveExperience = (id: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };
  
  const handleRemoveService = (id: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      services: prev.services.filter(service => service.id !== id)
    }));
  };
  
  const handleRemoveLanguage = (language: string) => {
    setDoctorProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language)
    }));
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDoctorProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to the backend
    console.log('Profile data submitted:', doctorProfile);
    
    // Show a success message to the user
    alert('Profile updated successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Profile Management</h2>
          <p className="text-neutral-500">Update your profile information and practice details</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
      
      {/* Profile picture section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="relative">
            <Image 
              src={doctorProfile.profileImage} 
              alt="Doctor Profile" 
              width={120} 
              height={120} 
              className="rounded-full object-cover border-4 border-neutral-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/120x120?text=Dr";
              }}
            />
            <button className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-sm hover:bg-primary-700 transition-colors duration-200">
              <FaUpload size={14} />
            </button>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <h3 className="text-xl font-semibold text-neutral-800">
              Dr. {doctorProfile.firstName} {doctorProfile.lastName}
            </h3>
            <p className="text-neutral-500">{doctorProfile.specialization}</p>
            <p className="text-neutral-500 mt-1">{doctorProfile.email}</p>
            <p className="text-neutral-500">{doctorProfile.phone}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex space-x-6">
          {[
            { id: 'personal', label: 'Personal Information', icon: <FaUserMd className="mr-2" /> },
            { id: 'professional', label: 'Professional Details', icon: <FaCertificate className="mr-2" /> },
            { id: 'services', label: 'Services & Fees', icon: <FaMoneyBillWave className="mr-2" /> },
            { id: 'schedule', label: 'Schedule', icon: <FaRegClock className="mr-2" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-200 
                        ${activeTab === tab.id 
                          ? 'border-primary-600 text-primary-700' 
                          : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content sections */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Personal Information */}
        {activeTab === 'personal' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={doctorProfile.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={doctorProfile.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={doctorProfile.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={doctorProfile.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={doctorProfile.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Languages
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {doctorProfile.languages.map(language => (
                    <span 
                      key={language} 
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm flex items-center"
                    >
                      {language}
                      <button 
                        onClick={() => handleRemoveLanguage(language)} 
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    className="w-full p-2 border border-neutral-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={handleAddLanguage}
                    className="px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors duration-200"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Professional Details */}
        {activeTab === 'professional' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Professional Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={doctorProfile.specialization}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={doctorProfile.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Education */}
              <div>
                <h4 className="text-md font-medium text-neutral-800 mb-2">Education</h4>
                <div className="space-y-4 mb-4">
                  {doctorProfile.education.map(edu => (
                    <div 
                      key={edu.id} 
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-md border border-neutral-200"
                    >
                      <div>
                        <p className="font-medium text-neutral-800">{edu.degree}</p>
                        <p className="text-sm text-neutral-500">{edu.institution}, {edu.year}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveEducation(edu.id)} 
                        className="text-neutral-400 hover:text-alert-red"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div>
                    <input
                      type="text"
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                      placeholder="Degree"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                      placeholder="Institution"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({...newEducation, year: e.target.value})}
                      placeholder="Year"
                      className="w-full p-2 border border-neutral-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={handleAddEducation}
                      className="px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors duration-200"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Experience */}
              <div>
                <h4 className="text-md font-medium text-neutral-800 mb-2">Experience</h4>
                <div className="space-y-4 mb-4">
                  {doctorProfile.experience.map(exp => (
                    <div 
                      key={exp.id} 
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-md border border-neutral-200"
                    >
                      <div>
                        <p className="font-medium text-neutral-800">{exp.position}</p>
                        <p className="text-sm text-neutral-500">
                          {exp.hospital}, {exp.startYear} - {exp.endYear}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemoveExperience(exp.id)} 
                        className="text-neutral-400 hover:text-alert-red"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                  <div>
                    <input
                      type="text"
                      value={newExperience.position}
                      onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                      placeholder="Position"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newExperience.hospital}
                      onChange={(e) => setNewExperience({...newExperience, hospital: e.target.value})}
                      placeholder="Hospital/Institution"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newExperience.startYear}
                      onChange={(e) => setNewExperience({...newExperience, startYear: e.target.value})}
                      placeholder="Start Year"
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newExperience.endYear}
                      onChange={(e) => setNewExperience({...newExperience, endYear: e.target.value})}
                      placeholder="End Year or 'Present'"
                      className="w-full p-2 border border-neutral-300 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={handleAddExperience}
                      className="px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors duration-200"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Services & Fees */}
        {activeTab === 'services' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Services & Fees</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Standard Consultation Fee ($)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={doctorProfile.consultationFee}
                  onChange={handleInputChange}
                  className="w-full md:w-1/3 p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <h4 className="text-md font-medium text-neutral-800 mb-2">Services Offered</h4>
                <div className="space-y-3 mb-4">
                  {doctorProfile.services.map(service => (
                    <div 
                      key={service.id} 
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-md border border-neutral-200"
                    >
                      <div>
                        <p className="font-medium text-neutral-800">{service.name}</p>
                        {service.price && <p className="text-sm text-neutral-500">${service.price}</p>}
                      </div>
                      <button 
                        onClick={() => handleRemoveService(service.id)} 
                        className="text-neutral-400 hover:text-alert-red"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 mb-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                      placeholder="Service Name"
                      className="w-full p-2 border border-neutral-300 rounded-md md:rounded-l-md md:rounded-r-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex md:w-1/3">
                    <input
                      type="number"
                      value={newService.price || ''}
                      onChange={(e) => setNewService({...newService, price: e.target.value ? Number(e.target.value) : undefined})}
                      placeholder="Price ($)"
                      className="w-full p-2 border border-neutral-300 rounded-l-md md:rounded-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={handleAddService}
                      className="px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors duration-200"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Schedule */}
        {activeTab === 'schedule' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Work Schedule</h3>
            <div className="space-y-4">
              {(Object.keys(doctorProfile.availability) as Array<keyof typeof doctorProfile.availability>).map(day => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <div className="md:col-span-1">
                    <p className="text-neutral-700 capitalize">{day}</p>
                  </div>
                  <div className="md:col-span-3 flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`available-${day}`}
                        checked={!!doctorProfile.availability[day]}
                        onChange={(e) => {
                          setDoctorProfile(prev => ({
                            ...prev,
                            availability: {
                              ...prev.availability,
                              [day]: e.target.checked ? { start: '09:00', end: '17:00' } : null
                            }
                          }));
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor={`available-${day}`} className="ml-2 text-sm text-neutral-700">
                        Available
                      </label>
                    </div>
                    
                    {doctorProfile.availability[day] && (
                      <>
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`start-${day}`} className="text-sm text-neutral-700">
                            From
                          </label>
                          <input
                            type="time"
                            id={`start-${day}`}
                            value={doctorProfile.availability[day]?.start || ''}
                            onChange={(e) => {
                              setDoctorProfile(prev => ({
                                ...prev,
                                availability: {
                                  ...prev.availability,
                                  [day]: {
                                    ...prev.availability[day]!,
                                    start: e.target.value
                                  }
                                }
                              }));
                            }}
                            className="w-24 p-1 border border-neutral-300 rounded-md text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`end-${day}`} className="text-sm text-neutral-700">
                            To
                          </label>
                          <input
                            type="time"
                            id={`end-${day}`}
                            value={doctorProfile.availability[day]?.end || ''}
                            onChange={(e) => {
                              setDoctorProfile(prev => ({
                                ...prev,
                                availability: {
                                  ...prev.availability,
                                  [day]: {
                                    ...prev.availability[day]!,
                                    end: e.target.value
                                  }
                                }
                              }));
                            }}
                            className="w-24 p-1 border border-neutral-300 rounded-md text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 