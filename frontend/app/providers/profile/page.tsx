'use client';

import React, { useState } from 'react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Calendar, 
  Award, 
  Edit2,
  Save,
  X,
  Upload,
  Camera
} from 'lucide-react';
import Image from 'next/image';

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  year: string;
  expiryYear?: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startYear: string;
  endYear?: string;
}

interface ProviderSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export default function ProviderProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState('/placeholder-profile.jpg');
  const [formData, setFormData] = useState({
    name: 'Dr. Sarah Connor',
    specialization: 'Cardiologist',
    email: 'sarah.connor@medconnect.com',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Blvd, San Francisco, CA 94143',
    website: 'www.drconnor-cardio.com',
    bio: 'Board-certified cardiologist with over 10 years of experience specializing in interventional cardiology and heart disease prevention. Committed to providing compassionate care using the latest evidence-based practices.',
    education: [
      {
        id: 'edu1',
        degree: 'MD, Medicine',
        institution: 'Stanford University School of Medicine',
        year: '2008'
      },
      {
        id: 'edu2',
        degree: 'Residency, Internal Medicine',
        institution: 'UCSF Medical Center',
        year: '2011'
      },
      {
        id: 'edu3',
        degree: 'Fellowship, Cardiovascular Disease',
        institution: 'Mayo Clinic',
        year: '2014'
      }
    ] as Education[],
    certifications: [
      {
        id: 'cert1',
        name: 'Board Certification, Cardiovascular Disease',
        issuedBy: 'American Board of Internal Medicine',
        year: '2014',
        expiryYear: '2024'
      },
      {
        id: 'cert2',
        name: 'Advanced Cardiac Life Support (ACLS)',
        issuedBy: 'American Heart Association',
        year: '2020',
        expiryYear: '2022'
      }
    ] as Certification[],
    experience: [
      {
        id: 'exp1',
        position: 'Cardiologist',
        company: 'MedConnect Clinic',
        location: 'San Francisco, CA',
        startYear: '2018',
        endYear: 'Present'
      },
      {
        id: 'exp2',
        position: 'Attending Physician, Cardiology',
        company: 'San Francisco General Hospital',
        location: 'San Francisco, CA',
        startYear: '2014',
        endYear: '2018'
      }
    ] as Experience[],
    schedule: [
      { day: 'Monday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: true },
      { day: 'Tuesday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: true },
      { day: 'Wednesday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: true },
      { day: 'Thursday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: true },
      { day: 'Friday', startTime: '9:00 AM', endTime: '12:00 PM', isWorking: true },
      { day: 'Saturday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: false },
      { day: 'Sunday', startTime: '9:00 AM', endTime: '5:00 PM', isWorking: false }
    ] as ProviderSchedule[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    // In a real app, you would save the data to the backend here
    setIsEditMode(false);
  };

  const handleCancel = () => {
    // Reset any unsaved changes
    setIsEditMode(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Provider Profile</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal and professional information
          </p>
        </div>
        <div>
          {!isEditMode ? (
            <button 
              onClick={toggleEditMode}
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button 
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <AnimatedCard className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex flex-col items-center pb-6">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image 
                    src={profileImage} 
                    alt="Profile Picture" 
                    width={128} 
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                {isEditMode && (
                  <label 
                    htmlFor="profileImageUpload" 
                    className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Camera className="h-5 w-5" />
                    <input 
                      id="profileImageUpload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfileImageChange}
                    />
                  </label>
                )}
              </div>
              
              {isEditMode ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-xl font-bold text-center text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg mb-1 w-full"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formData.name}</h2>
              )}
              
              {isEditMode ? (
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="text-sm text-teal-600 dark:text-teal-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg mb-4 w-full"
                />
              ) : (
                <p className="text-sm text-teal-600 dark:text-teal-400 mb-4">{formData.specialization}</p>
              )}
              
              <div className="w-full space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  {isEditMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  {isEditMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                  {isEditMode ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formData.address}</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  {isEditMode ? (
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-300">{formData.website}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Office Hours</h3>
              <div className="space-y-3">
                {formData.schedule.map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">{day.day}</span>
                    </div>
                    {isEditMode ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.isWorking}
                          onChange={() => {
                            const updatedSchedule = [...formData.schedule];
                            updatedSchedule[index].isWorking = !day.isWorking;
                            setFormData({
                              ...formData,
                              schedule: updatedSchedule
                            });
                          }}
                          className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={day.startTime}
                            onChange={(e) => {
                              const updatedSchedule = [...formData.schedule];
                              updatedSchedule[index].startTime = e.target.value;
                              setFormData({
                                ...formData,
                                schedule: updatedSchedule
                              });
                            }}
                            disabled={!day.isWorking}
                            className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-24"
                          />
                          <span className="text-gray-600 dark:text-gray-400">-</span>
                          <input
                            type="text"
                            value={day.endTime}
                            onChange={(e) => {
                              const updatedSchedule = [...formData.schedule];
                              updatedSchedule[index].endTime = e.target.value;
                              setFormData({
                                ...formData,
                                schedule: updatedSchedule
                              });
                            }}
                            disabled={!day.isWorking}
                            className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded w-24"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {day.isWorking ? `${day.startTime} - ${day.endTime}` : 'Closed'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Main Content */}
        <AnimatedCard className="lg:col-span-2" delay={1}>
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About Me</h3>
              {isEditMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{formData.bio}</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
                {isEditMode && (
                  <button 
                    onClick={() => {
                      const newId = `edu${formData.education.length + 1}`;
                      setFormData({
                        ...formData,
                        education: [
                          ...formData.education,
                          { id: newId, degree: '', institution: '', year: '' }
                        ]
                      });
                    }}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    + Add Education
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={edu.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updatedEducation = [...formData.education];
                              updatedEducation[index].degree = e.target.value;
                              setFormData({
                                ...formData,
                                education: updatedEducation
                              });
                            }}
                            placeholder="Degree"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                          <button 
                            onClick={() => {
                              setFormData({
                                ...formData,
                                education: formData.education.filter(e => e.id !== edu.id)
                              });
                            }}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const updatedEducation = [...formData.education];
                            updatedEducation[index].institution = e.target.value;
                            setFormData({
                              ...formData,
                              education: updatedEducation
                            });
                          }}
                          placeholder="Institution"
                          className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const updatedEducation = [...formData.education];
                            updatedEducation[index].year = e.target.value;
                            setFormData({
                              ...formData,
                              education: updatedEducation
                            });
                          }}
                          placeholder="Year"
                          className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{edu.year}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{edu.institution}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Certifications</h3>
                {isEditMode && (
                  <button 
                    onClick={() => {
                      const newId = `cert${formData.certifications.length + 1}`;
                      setFormData({
                        ...formData,
                        certifications: [
                          ...formData.certifications,
                          { id: newId, name: '', issuedBy: '', year: '', expiryYear: '' }
                        ]
                      });
                    }}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    + Add Certification
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <div key={cert.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const updatedCertifications = [...formData.certifications];
                              updatedCertifications[index].name = e.target.value;
                              setFormData({
                                ...formData,
                                certifications: updatedCertifications
                              });
                            }}
                            placeholder="Certification Name"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                          <button 
                            onClick={() => {
                              setFormData({
                                ...formData,
                                certifications: formData.certifications.filter(c => c.id !== cert.id)
                              });
                            }}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={cert.issuedBy}
                          onChange={(e) => {
                            const updatedCertifications = [...formData.certifications];
                            updatedCertifications[index].issuedBy = e.target.value;
                            setFormData({
                              ...formData,
                              certifications: updatedCertifications
                            });
                          }}
                          placeholder="Issuing Organization"
                          className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                        />
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => {
                              const updatedCertifications = [...formData.certifications];
                              updatedCertifications[index].year = e.target.value;
                              setFormData({
                                ...formData,
                                certifications: updatedCertifications
                              });
                            }}
                            placeholder="Issue Year"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                          <input
                            type="text"
                            value={cert.expiryYear || ''}
                            onChange={(e) => {
                              const updatedCertifications = [...formData.certifications];
                              updatedCertifications[index].expiryYear = e.target.value;
                              setFormData({
                                ...formData,
                                certifications: updatedCertifications
                              });
                            }}
                            placeholder="Expiry Year (Optional)"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{cert.name}</h4>
                        <div className="flex items-center mt-1">
                          <Award className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {cert.year}{cert.expiryYear && ` - ${cert.expiryYear}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{cert.issuedBy}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Experience</h3>
                {isEditMode && (
                  <button 
                    onClick={() => {
                      const newId = `exp${formData.experience.length + 1}`;
                      setFormData({
                        ...formData,
                        experience: [
                          ...formData.experience,
                          { id: newId, position: '', company: '', location: '', startYear: '', endYear: '' }
                        ]
                      });
                    }}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    + Add Experience
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={exp.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                    {isEditMode ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const updatedExperience = [...formData.experience];
                              updatedExperience[index].position = e.target.value;
                              setFormData({
                                ...formData,
                                experience: updatedExperience
                              });
                            }}
                            placeholder="Position"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                          <button 
                            onClick={() => {
                              setFormData({
                                ...formData,
                                experience: formData.experience.filter(e => e.id !== exp.id)
                              });
                            }}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updatedExperience = [...formData.experience];
                            updatedExperience[index].company = e.target.value;
                            setFormData({
                              ...formData,
                              experience: updatedExperience
                            });
                          }}
                          placeholder="Company/Organization"
                          className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => {
                            const updatedExperience = [...formData.experience];
                            updatedExperience[index].location = e.target.value;
                            setFormData({
                              ...formData,
                              experience: updatedExperience
                            });
                          }}
                          placeholder="Location"
                          className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                        />
                        <div className="flex space-x-3">
                          <input
                            type="text"
                            value={exp.startYear}
                            onChange={(e) => {
                              const updatedExperience = [...formData.experience];
                              updatedExperience[index].startYear = e.target.value;
                              setFormData({
                                ...formData,
                                experience: updatedExperience
                              });
                            }}
                            placeholder="Start Year"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                          <input
                            type="text"
                            value={exp.endYear || ''}
                            onChange={(e) => {
                              const updatedExperience = [...formData.experience];
                              updatedExperience[index].endYear = e.target.value;
                              setFormData({
                                ...formData,
                                experience: updatedExperience
                              });
                            }}
                            placeholder="End Year (or 'Present')"
                            className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg w-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{exp.position}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {exp.company}, {exp.location}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {exp.startYear} - {exp.endYear || 'Present'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
} 