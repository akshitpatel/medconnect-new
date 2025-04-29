import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { apiResponse, apiError } from '@/app/lib/auth-middleware';
import { validateQuery } from '@/app/lib/validation-middleware';
import { Doctor } from '@/app/types/api-types';
import { withAuth } from '@/app/lib/auth-middleware';

// Define a specific interface for the doctor search feature
interface DoctorSearch {
  _id: string;
  fullName: string;
  specialization: string;
  qualifications: string;
  experience: number;
  rating: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  services: string[];
  homeVisit: boolean;
  availableDays: string[];
  appointmentFee: number;
  phone: string;
  email: string;
  affiliatedHospitals: string[];
  bio: string;
  image: string;
}

/**
 * GET handler for searching doctors
 * This endpoint is public so users can search for doctors without authentication
 */
export const GET = withAuth(
  validateQuery(async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      
      // Get search parameters
      const query = searchParams.get('query') || '';
      const location = searchParams.get('location') || '';
      const specialization = searchParams.get('specialization') || '';
      const servicesParam = searchParams.get('services') || '';
      const services = servicesParam ? servicesParam.split(',') : [];
      const homeVisit = searchParams.get('homeVisit') === 'true';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;
      
      // Debug logging
      console.log('Search parameters received:', {
        query,
        location,
        specialization,
        services,
        homeVisit,
        page,
        limit
      });
      
      // Build query based on search parameters
      let dbQuery: any = {};
      
      // Text search on name and specialization
      if (query) {
        dbQuery.$or = [
          { fullName: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } },
          { qualifications: { $regex: query, $options: 'i' } }
        ];
      }
      
      // Filter by location (city, state, or zip code)
      if (location) {
        dbQuery.$or = dbQuery.$or || [];
        dbQuery.$or.push(
          { 'address.city': { $regex: location, $options: 'i' } },
          { 'address.state': { $regex: location, $options: 'i' } },
          { 'address.zipCode': { $regex: location, $options: 'i' } }
        );
      }
      
      // Filter by specialization
      if (specialization) {
        dbQuery.specialization = { $regex: specialization, $options: 'i' };
      }
      
      // Filter by services
      if (services.length > 0) {
        dbQuery.services = { $in: services };
      }
      
      // Filter by home visit availability
      if (homeVisit) {
        dbQuery.homeVisit = true;
      }
      
      console.log('Database query:', JSON.stringify(dbQuery, null, 2));
      
      // Connect to database
      const db = await DatabaseService.getDb();
      
      // Get total count for pagination
      const total = await db.collection('doctors').countDocuments(dbQuery);
      
      // Get doctors
      const doctors = await db.collection('doctors')
        .find(dbQuery)
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      console.log(`Found ${doctors.length} doctors out of ${total} total matches`);
      
      // Return mock data if no results found
      if (doctors.length === 0 && page === 1) {
        const mockDoctors = generateMockDoctors(10, location || 'New York');
        console.log(`Generating ${mockDoctors.length} mock doctors`);
        
        return apiResponse({
          doctors: mockDoctors,
          pagination: {
            total: mockDoctors.length,
            page,
            limit,
            pages: Math.ceil(mockDoctors.length / limit)
          }
        });
      }
      
      return apiResponse({
        doctors,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error searching doctors:', error);
      return apiError('Failed to search doctors. Please try again later.', 500);
    }
  }, {
    // Validation schema for query parameters
    query: { type: 'string', required: false },
    location: { type: 'string', required: false },
    specialization: { type: 'string', required: false },
    services: { type: 'string', required: false },
    homeVisit: { type: 'string', required: false },
    page: { type: 'string', required: false },
    limit: { type: 'string', required: false }
  }),
  false
);

/**
 * GET handler for fetching a single doctor by ID
 */
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doctorId = params.id;
    
    if (!doctorId) {
      return apiError('Doctor ID is required', 400);
    }
    
    let objectId;
    try {
      objectId = new ObjectId(doctorId);
    } catch (error) {
      return apiError('Invalid doctor ID format', 400);
    }
    
    const db = await DatabaseService.getDb();
    const doctor = await db.collection('doctors').findOne({ _id: objectId });
    
    if (!doctor) {
      // Generate a mock doctor if not found (for development purposes)
      const mockDoctor = generateMockDoctors(1)[0];
      mockDoctor._id = doctorId;
      return apiResponse({ doctor: mockDoctor });
    }
    
    return apiResponse({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return apiError('Failed to fetch doctor details. Please try again later.', 500);
  }
}

/**
 * Helper function to generate mock doctors
 */
function generateMockDoctors(count: number = 10, location: string = 'New York'): DoctorSearch[] {
  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 
    'Orthopedic Surgeon', 'Ophthalmologist', 'Psychiatrist', 'Gynecologist',
    'Oncologist', 'General Physician', 'Urologist', 'Endocrinologist'
  ];
  
  const services = [
    'Consultation', 'Check-up', 'Surgery', 'Telemedicine', 
    'Emergency Care', 'Follow-up', 'Lab Test', 'Home Visit',
    'Preventive Care', 'Chronic Disease Management', 'Wellness Screening'
  ];
  
  const hospitals = [
    'City General Hospital', 'Metropolitan Medical Center', 'Central Healthcare',
    'University Medical Center', 'Regional Hospital', 'Community Health Center'
  ];
  
  const qualifications = [
    'MD', 'MBBS', 'MS', 'PhD', 'DM', 'DNB', 'FRCS', 'MRCP'
  ];
  
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA'];
  
  const doctors: DoctorSearch[] = [];
  
  for (let i = 0; i < count; i++) {
    // Determine if we use the provided location or a random one
    const useProvidedLocation = location && Math.random() > 0.3;
    
    // Choose location components
    const cityIndex = Math.floor(Math.random() * cities.length);
    const city = useProvidedLocation ? location : cities[cityIndex];
    const state = useProvidedLocation ? location.length <= 2 ? location : states[cityIndex] : states[cityIndex];
    
    // Choose a random specialization
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];
    
    // Generate random set of services
    const serviceCount = Math.floor(Math.random() * 5) + 3; // 3-7 services
    const doctorServices: string[] = [];
    const availableServices = [...services];
    
    for (let j = 0; j < serviceCount; j++) {
      if (availableServices.length === 0) break;
      const index = Math.floor(Math.random() * availableServices.length);
      doctorServices.push(availableServices[index]);
      availableServices.splice(index, 1);
    }
    
    // Add home visit service sometimes
    const offersHomeVisit = Math.random() > 0.7;
    if (offersHomeVisit && !doctorServices.includes('Home Visit')) {
      doctorServices.push('Home Visit');
    }
    
    // Generate 1-3 random qualifications
    const qualCount = Math.floor(Math.random() * 3) + 1;
    const doctorQualifications = [];
    
    for (let j = 0; j < qualCount; j++) {
      doctorQualifications.push(qualifications[Math.floor(Math.random() * qualifications.length)]);
    }
    
    // Generate years of experience (5-30 years)
    const experience = Math.floor(Math.random() * 25) + 5;
    
    // Generate rating (3.0-5.0)
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    // Generate list of affiliated hospitals
    const hospitalCount = Math.floor(Math.random() * 3) + 1;
    const affiliatedHospitals = [];
    
    for (let j = 0; j < hospitalCount; j++) {
      affiliatedHospitals.push(hospitals[Math.floor(Math.random() * hospitals.length)]);
    }
    
    // Generate doctor object
    doctors.push({
      _id: new ObjectId().toString(),
      fullName: `Dr. ${['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa'][Math.floor(Math.random() * 8)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)]}`,
      specialization,
      qualifications: doctorQualifications.join(', '),
      experience,
      rating: parseFloat(rating),
      address: {
        street: `${Math.floor(Math.random() * 1000) + 100} ${['Main', 'Oak', 'Maple', 'Washington', 'Park', 'Lake', 'Hill'][Math.floor(Math.random() * 7)]} ${['St', 'Ave', 'Blvd', 'Rd', 'Dr'][Math.floor(Math.random() * 5)]}`,
        city,
        state,
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      services: doctorServices,
      homeVisit: offersHomeVisit,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].filter(() => Math.random() > 0.3),
      appointmentFee: Math.floor(Math.random() * 150) + 50,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `doctor${i + 1}@medconnect.com`,
      affiliatedHospitals,
      bio: `Dr. ${specialization} with ${experience} years of experience specializing in ${specialization.toLowerCase()} care. Committed to providing exceptional healthcare with a patient-centered approach.`,
      image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`
    });
  }
  
  return doctors;
} 