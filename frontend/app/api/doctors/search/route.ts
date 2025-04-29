import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // In a real app, we would extract query parameters and filter data accordingly
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const categoryLevel1 = searchParams.get('categoryLevel1') || '';
  const categoryLevel2 = searchParams.get('categoryLevel2') || '';
  const categoryLevel3 = searchParams.get('categoryLevel3') || '';
  const location = searchParams.get('location') || '';
  
  // Mock data for demonstration purposes
  const doctors = [
    {
      id: 1,
      name: 'Dr. Anil Kumar',
      credentials: 'MD, MBBS',
      specializations: ['Cardiologist'],
      clinic: 'City Heart Clinic',
      location: 'Bangalore',
      address: '123 Health Street, Bangalore',
      consultationFees: {
        clinic: 800,
        online: 600
      },
      availability: {
        snippet: 'Available Today',
        online: true
      },
      rating: 4.8,
      reviewCount: 124,
      guruProgram: true,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Priya Singh',
      credentials: 'MBBS, DNB',
      specializations: ['Dermatologist'],
      clinic: 'SkinCare Center',
      location: 'Mumbai',
      address: '456 Medical Avenue, Mumbai',
      consultationFees: {
        clinic: 1000,
        online: 800
      },
      availability: {
        snippet: 'Next Available: Tomorrow',
        online: true
      },
      rating: 4.9,
      reviewCount: 98,
      guruProgram: false,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'Dr. Rajan Menon',
      credentials: 'MBBS, MS, MCh',
      specializations: ['Neurologist'],
      clinic: 'Brain & Spine Institute',
      location: 'Delhi',
      address: '789 Healthcare Boulevard, Delhi',
      consultationFees: {
        clinic: 1500,
        online: 1200
      },
      availability: {
        snippet: 'Available This Week',
        online: false
      },
      rating: 4.7,
      reviewCount: 156,
      guruProgram: true,
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      name: 'Dr. Meera Patel',
      credentials: 'MBBS, MD',
      specializations: ['Pediatrician'],
      clinic: 'Children\'s Wellness Center',
      location: 'Chennai',
      address: '101 Child Care Road, Chennai',
      consultationFees: {
        clinic: 700,
        online: 600
      },
      availability: {
        snippet: 'Available Today',
        online: true
      },
      rating: 4.9,
      reviewCount: 210,
      guruProgram: true,
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
  ];

  // In a real implementation, we would filter based on parameters
  // For now, just return the mock data
  const filteredDoctors = doctors;

  return NextResponse.json({ 
    doctors: filteredDoctors,
    total: filteredDoctors.length,
    searchParams: { query, categoryLevel1, categoryLevel2, categoryLevel3, location }
  });
} 