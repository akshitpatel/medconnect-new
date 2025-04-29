'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaUserMd, 
  FaPrint, 
  FaDownload, 
  FaShare,
  FaExclamationTriangle,
  FaSpinner,
  FaPen,
  FaPlus
} from 'react-icons/fa';
import HealthPassportCard, { HealthPassportData } from '@/app/components/health-passport/HealthPassportCard';

// Mock patient data
const getMockPatientData = (id: string): {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  age: number;
  lastVisit: string;
} => {
  return {
    id,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    age: 42,
    lastVisit: '2023-11-15'
  };
};

// Mock health passport data
const getMockHealthPassportData = (patientId: string): HealthPassportData => {
  return {
    patientId,
    fullName: 'Sarah Johnson',
    dateOfBirth: '1981-06-23',
    gender: 'Female',
    weight: '65',
    height: '167',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts', 'Latex'],
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily'
      },
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals'
      }
    ],
    conditions: [
      'Type 2 Diabetes',
      'Hypertension',
      'Osteoarthritis (mild)'
    ],
    notes: 'Patient manages diabetes well with diet and medication. Regular exercise program 3x weekly. Family history of cardiovascular disease.',
    lastUpdated: '2023-12-10'
  };
};

export default function PatientHealthPassport() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<ReturnType<typeof getMockPatientData> | null>(null);
  const [healthPassport, setHealthPassport] = useState<HealthPassportData | null>(null);
  
  useEffect(() => {
    // Simulate API call to get patient data
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const patientData = getMockPatientData(patientId);
        const passportData = getMockHealthPassportData(patientId);
        
        setPatient(patientData);
        setHealthPassport(passportData);
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [patientId]);
  
  const printHealthPassport = () => {
    window.print();
  };
  
  const downloadHealthPassport = () => {
    alert('In a real application, this would download the health passport as a PDF file.');
  };
  
  const shareHealthPassport = () => {
    alert('In a real application, this would open sharing options for the health passport.');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
        <FaSpinner className="animate-spin text-primary-600 text-3xl mb-4" />
        <p className="text-neutral-600">Loading patient health data...</p>
      </div>
    );
  }
  
  if (!patient || !healthPassport) {
    return (
      <div className="min-h-screen p-8 bg-neutral-50">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center text-alert-red mb-4">
            <FaExclamationTriangle className="mr-2" />
            <h2 className="text-xl font-semibold">Patient Data Not Found</h2>
          </div>
          <p className="text-neutral-600 mb-4">
            The requested patient data could not be found. This may be due to an invalid ID or the data may have been removed.
          </p>
          <Link 
            href="/provider/patients" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Return to patient list
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 print:bg-white print:p-0">
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6 print:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Link 
              href={`/provider/patients/${patientId}`} 
              className="mr-4 text-primary-600 hover:text-primary-700 print:hidden"
            >
              <FaArrowLeft className="text-lg" />
            </Link>
            <div className="flex items-center">
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-12 h-12 rounded-full object-cover border border-neutral-200" 
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-neutral-800">{patient.name}</h1>
                <div className="flex items-center text-neutral-500 text-sm mt-1">
                  <FaUserMd className="mr-2" />
                  <span>Patient ID: {patientId}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 print:hidden">
            <button 
              onClick={printHealthPassport}
              className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
            <button 
              onClick={downloadHealthPassport}
              className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
            <button 
              onClick={shareHealthPassport}
              className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
            >
              <FaShare className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Age</p>
                  <p className="font-medium">{patient.age} years</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Last Visit</p>
                  <p className="font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6 print:hidden">
                <Link
                  href={`/provider/patients/${patientId}/edit`}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  <FaPen className="mr-2 h-3 w-3" />
                  Edit patient info
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6 print:shadow-none print:mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-neutral-800">Medical Records</h2>
                <Link
                  href={`/provider/patients/${patientId}/records/add`}
                  className="text-primary-600 hover:text-primary-700 print:hidden"
                >
                  <FaPlus />
                </Link>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50">
                  <p className="font-medium">Annual Checkup</p>
                  <p className="text-sm text-neutral-500">March 15, 2023</p>
                </div>
                <div className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50">
                  <p className="font-medium">Blood Work Results</p>
                  <p className="text-sm text-neutral-500">February 2, 2023</p>
                </div>
                <div className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50">
                  <p className="font-medium">Diabetes Follow-up</p>
                  <p className="text-sm text-neutral-500">December 8, 2022</p>
                </div>
              </div>
              
              <div className="mt-4 text-center print:hidden">
                <Link
                  href={`/provider/patients/${patientId}/records`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all records
                </Link>
              </div>
            </div>
          </div>
          
          {/* Health Passport */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <h2 className="text-xl font-semibold text-neutral-800">Health Passport</h2>
              <Link
                href={`/provider/patients/${patientId}/health-passport/edit`}
                className="inline-flex items-center px-3 py-2 border border-primary-300 shadow-sm text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
              >
                <FaPen className="mr-2" />
                Update health data
              </Link>
            </div>
            
            <HealthPassportCard data={healthPassport} />
          </div>
        </div>
      </div>
    </div>
  );
} 