/**
 * Database Seeding Script for Healcard
 * 
 * This script populates the MongoDB database with initial data for the Healcard application.
 * It creates sample users, doctors, lab tests, pharmacies, medicines, and emergency services.
 */

require('dotenv').config({ path: '.env.local' }); // Try .env.local first
if (!process.env.MONGODB_URI) {
  require('dotenv').config(); // Fall back to .env if .env.local doesn't have MONGODB_URI
}

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB Connection URI
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

console.log(`Using MongoDB connection: ${uri.split('@')[0]}...`);

// Database and Collections
const dbName = 'healcard';
const collections = {
  users: 'users',
  doctors: 'doctors',
  appointments: 'appointments',
  medicalRecords: 'medicalRecords',
  prescriptions: 'prescriptions',
  labTests: 'labTests',
  pharmacies: 'pharmacies',
  medicines: 'medicines',
  emergencyServices: 'emergencyServices'
};

// Sample Data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    dateOfBirth: new Date('1990-01-15'),
    gender: 'male',
    bloodGroup: 'O+',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1987654321'
    },
    medicalHistory: {
      allergies: ['Peanuts', 'Penicillin'],
      chronicConditions: ['Asthma'],
      surgeries: [{ name: 'Appendectomy', date: new Date('2015-03-10') }],
      medications: ['Albuterol']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1345678901',
    dateOfBirth: new Date('1985-05-20'),
    gender: 'female',
    bloodGroup: 'A+',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Bob Smith',
      relationship: 'Brother',
      phone: '+1876543210'
    },
    medicalHistory: {
      allergies: ['Shellfish'],
      chronicConditions: ['Hypertension'],
      surgeries: [],
      medications: ['Lisinopril']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleDoctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'doctor123',
    phone: '+1234567891',
    specialization: 'Cardiology',
    qualifications: [
      { degree: 'MBBS', institution: 'Harvard Medical School', year: 2005 },
      { degree: 'MD', institution: 'Johns Hopkins University', year: 2009 }
    ],
    experience: 12,
    languages: ['English', 'Spanish'],
    address: {
      street: '789 Medical Plaza',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'USA'
    },
    hospital: 'Boston Medical Center',
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '13:00' }],
      saturday: [],
      sunday: []
    },
    consultationFee: 150,
    rating: 4.8,
    reviews: [
      { userId: 'user1', rating: 5, comment: 'Excellent doctor, very thorough', date: new Date('2023-01-15') },
      { userId: 'user2', rating: 4, comment: 'Good experience overall', date: new Date('2023-02-20') }
    ],
    about: 'Dr. Sarah Johnson is a board-certified cardiologist with over 12 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.',
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@example.com',
    password: 'doctor123',
    phone: '+1234567892',
    specialization: 'Neurology',
    qualifications: [
      { degree: 'MBBS', institution: 'Stanford University', year: 2007 },
      { degree: 'MD', institution: 'UCLA Medical School', year: 2011 }
    ],
    experience: 10,
    languages: ['English', 'Mandarin'],
    address: {
      street: '101 Neuro Center',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94143',
      country: 'USA'
    },
    hospital: 'UCSF Medical Center',
    availability: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [{ start: '10:00', end: '14:00' }],
      sunday: []
    },
    consultationFee: 180,
    rating: 4.9,
    reviews: [
      { userId: 'user3', rating: 5, comment: 'Dr. Chen is very knowledgeable and patient', date: new Date('2023-03-10') },
      { userId: 'user4', rating: 5, comment: 'Excellent neurologist, helped me with my migraines', date: new Date('2023-04-05') }
    ],
    about: 'Dr. Michael Chen is a neurologist specializing in headache disorders, stroke, and neurodegenerative diseases. He is committed to providing compassionate care using the latest advances in neurology.',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    password: 'doctor123',
    phone: '+1234567893',
    specialization: 'Pediatrics',
    qualifications: [
      { degree: 'MBBS', institution: 'University of Pennsylvania', year: 2008 },
      { degree: 'MD', institution: 'Children\'s Hospital of Philadelphia', year: 2012 }
    ],
    experience: 9,
    languages: ['English', 'Spanish'],
    address: {
      street: '555 Children\'s Way',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19104',
      country: 'USA'
    },
    hospital: 'Children\'s Hospital of Philadelphia',
    availability: {
      monday: [{ start: '09:00', end: '16:00' }],
      tuesday: [{ start: '09:00', end: '16:00' }],
      wednesday: [{ start: '09:00', end: '16:00' }],
      thursday: [{ start: '09:00', end: '16:00' }],
      friday: [{ start: '09:00', end: '16:00' }],
      saturday: [],
      sunday: []
    },
    consultationFee: 130,
    rating: 4.7,
    reviews: [
      { userId: 'user5', rating: 5, comment: 'Dr. Rodriguez is amazing with kids', date: new Date('2023-02-15') },
      { userId: 'user6', rating: 4, comment: 'Very caring and professional', date: new Date('2023-03-22') }
    ],
    about: 'Dr. Emily Rodriguez is a pediatrician dedicated to providing comprehensive care for children from infancy through adolescence. She has a special interest in childhood development and preventive care.',
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleLabTests = [
  {
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of blood including red and white blood cells, hemoglobin, and platelets.',
    category: 'Hematology',
    price: 25.99,
    preparationInstructions: 'No special preparation required. Fasting may be required for certain tests.',
    turnaroundTime: '24 hours',
    homeCollection: true,
    labLocations: [
      {
        name: 'HealthLab Central',
        address: '123 Lab Street, New York, NY 10001',
        phone: '+1234567894',
        openingHours: '8:00 AM - 6:00 PM'
      },
      {
        name: 'MediTest Labs',
        address: '456 Test Avenue, Los Angeles, CA 90001',
        phone: '+1234567895',
        openingHours: '7:30 AM - 7:00 PM'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lipid Profile',
    description: 'Measures cholesterol levels including HDL, LDL, triglycerides, and total cholesterol.',
    category: 'Biochemistry',
    price: 35.50,
    preparationInstructions: 'Fast for 9-12 hours before the test. Water is allowed.',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    labLocations: [
      {
        name: 'HealthLab Central',
        address: '123 Lab Street, New York, NY 10001',
        phone: '+1234567894',
        openingHours: '8:00 AM - 6:00 PM'
      },
      {
        name: 'CardioCheck Labs',
        address: '789 Heart Blvd, Chicago, IL 60601',
        phone: '+1234567896',
        openingHours: '8:00 AM - 5:00 PM'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Thyroid Function Test',
    description: 'Measures thyroid hormones (T3, T4) and thyroid-stimulating hormone (TSH) to assess thyroid function.',
    category: 'Endocrinology',
    price: 45.75,
    preparationInstructions: 'No special preparation required. Inform your doctor about any medications you are taking.',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    labLocations: [
      {
        name: 'EndoLab Specialists',
        address: '101 Hormone Street, Boston, MA 02115',
        phone: '+1234567897',
        openingHours: '7:00 AM - 6:00 PM'
      },
      {
        name: 'MediTest Labs',
        address: '456 Test Avenue, Los Angeles, CA 90001',
        phone: '+1234567895',
        openingHours: '7:30 AM - 7:00 PM'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'COVID-19 PCR Test',
    description: 'Detects genetic material of the SARS-CoV-2 virus to diagnose active COVID-19 infection.',
    category: 'Microbiology',
    price: 120.00,
    preparationInstructions: 'No eating, drinking, or smoking 30 minutes before the test.',
    turnaroundTime: '24-72 hours',
    homeCollection: true,
    labLocations: [
      {
        name: 'CovidCheck Center',
        address: '555 Virus Lane, San Francisco, CA 94143',
        phone: '+1234567898',
        openingHours: '8:00 AM - 8:00 PM'
      },
      {
        name: 'HealthLab Central',
        address: '123 Lab Street, New York, NY 10001',
        phone: '+1234567894',
        openingHours: '8:00 AM - 6:00 PM'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Liver Function Test',
    description: 'Measures various enzymes and proteins to assess liver function and detect liver damage.',
    category: 'Biochemistry',
    price: 40.25,
    preparationInstructions: 'Fast for 8 hours before the test. Water is allowed.',
    turnaroundTime: '24-48 hours',
    homeCollection: true,
    labLocations: [
      {
        name: 'GastroLab Diagnostics',
        address: '202 Digestive Way, Miami, FL 33101',
        phone: '+1234567899',
        openingHours: '7:30 AM - 5:30 PM'
      },
      {
        name: 'MediTest Labs',
        address: '456 Test Avenue, Los Angeles, CA 90001',
        phone: '+1234567895',
        openingHours: '7:30 AM - 7:00 PM'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const samplePharmacies = [
  {
    name: 'HealthPlus Pharmacy',
    address: {
      street: '123 Pharmacy Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    phone: '+1234567900',
    email: 'info@healthplus.com',
    openingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    services: ['Prescription Filling', 'Medication Counseling', 'Vaccination', 'Health Screenings'],
    deliveryAvailable: true,
    rating: 4.7,
    reviews: [
      { userId: 'user1', rating: 5, comment: 'Great service and knowledgeable staff', date: new Date('2023-01-10') },
      { userId: 'user2', rating: 4, comment: 'Quick prescription filling', date: new Date('2023-02-15') }
    ],
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'MediCare Pharmacy',
    address: {
      street: '456 Health Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    phone: '+1234567901',
    email: 'contact@medicare-pharm.com',
    openingHours: {
      monday: { open: '07:00', close: '23:00' },
      tuesday: { open: '07:00', close: '23:00' },
      wednesday: { open: '07:00', close: '23:00' },
      thursday: { open: '07:00', close: '23:00' },
      friday: { open: '07:00', close: '23:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '09:00', close: '20:00' }
    },
    services: ['Prescription Filling', 'Medication Counseling', 'Home Delivery', 'Compounding'],
    deliveryAvailable: true,
    rating: 4.8,
    reviews: [
      { userId: 'user3', rating: 5, comment: 'Excellent delivery service', date: new Date('2023-03-05') },
      { userId: 'user4', rating: 5, comment: 'Very helpful pharmacists', date: new Date('2023-04-12') }
    ],
    location: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Community Care Pharmacy',
    address: {
      street: '789 Wellness Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    phone: '+1234567902',
    email: 'help@communitycare.com',
    openingHours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    services: ['Prescription Filling', 'Medication Therapy Management', 'Immunizations', 'Health Consultations'],
    deliveryAvailable: true,
    rating: 4.6,
    reviews: [
      { userId: 'user5', rating: 4, comment: 'Good community pharmacy', date: new Date('2023-02-20') },
      { userId: 'user6', rating: 5, comment: 'They really care about their patients', date: new Date('2023-03-15') }
    ],
    location: {
      type: 'Point',
      coordinates: [-87.6298, 41.8781] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleMedicines = [
  {
    name: 'Amoxicillin',
    description: 'Antibiotic used to treat bacterial infections.',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'Generic Pharma',
    price: 15.99,
    requiresPrescription: true,
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Vomiting'],
    contraindications: ['Allergy to penicillin'],
    storage: 'Store at room temperature away from moisture and heat.',
    usage: 'Take as directed by your doctor, usually every 8-12 hours with or without food.',
    availableAt: ['HealthPlus Pharmacy', 'MediCare Pharmacy', 'Community Care Pharmacy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Lisinopril',
    description: 'ACE inhibitor used to treat high blood pressure and heart failure.',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'Heart Pharmaceuticals',
    price: 12.50,
    requiresPrescription: true,
    sideEffects: ['Dizziness', 'Headache', 'Dry cough', 'Fatigue'],
    contraindications: ['Pregnancy', 'History of angioedema'],
    storage: 'Store at room temperature away from moisture and heat.',
    usage: 'Take once daily with or without food. Take at the same time each day.',
    availableAt: ['HealthPlus Pharmacy', 'MediCare Pharmacy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Ibuprofen',
    description: 'Nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain and reduce inflammation and fever.',
    category: 'Pain Relief',
    dosageForm: 'Tablet',
    strength: '200mg',
    manufacturer: 'Relief Pharmaceuticals',
    price: 8.99,
    requiresPrescription: false,
    sideEffects: ['Stomach pain', 'Heartburn', 'Nausea', 'Dizziness'],
    contraindications: ['Allergy to NSAIDs', 'Active stomach ulcer', 'Third trimester of pregnancy'],
    storage: 'Store at room temperature away from moisture and heat.',
    usage: 'Take with food or milk to prevent stomach upset. Do not take more than directed.',
    availableAt: ['HealthPlus Pharmacy', 'MediCare Pharmacy', 'Community Care Pharmacy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Metformin',
    description: 'Oral diabetes medicine that helps control blood sugar levels.',
    category: 'Diabetes',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Diabetes Care Inc.',
    price: 10.75,
    requiresPrescription: true,
    sideEffects: ['Nausea', 'Vomiting', 'Stomach upset', 'Diarrhea'],
    contraindications: ['Kidney disease', 'Metabolic acidosis'],
    storage: 'Store at room temperature away from moisture, heat, and light.',
    usage: 'Take with meals to reduce stomach upset. Follow your doctor\'s instructions carefully.',
    availableAt: ['HealthPlus Pharmacy', 'Community Care Pharmacy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cetirizine',
    description: 'Antihistamine used to relieve allergy symptoms such as sneezing, itching, and runny nose.',
    category: 'Allergy',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'Allergy Relief Labs',
    price: 9.25,
    requiresPrescription: false,
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    contraindications: ['Kidney disease (may need dosage adjustment)'],
    storage: 'Store at room temperature away from moisture and heat.',
    usage: 'Take once daily with or without food. May cause drowsiness.',
    availableAt: ['HealthPlus Pharmacy', 'MediCare Pharmacy', 'Community Care Pharmacy'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleEmergencyServices = [
  {
    name: 'City General Hospital Emergency',
    type: 'Hospital Emergency',
    address: {
      street: '123 Emergency Lane',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    phone: '+1234567903',
    operatingHours: '24/7',
    services: ['Trauma Care', 'Cardiac Emergency', 'Stroke Treatment', 'Pediatric Emergency'],
    waitTime: '15-30 minutes',
    location: {
      type: 'Point',
      coordinates: [-73.9857, 40.7484] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Westside Urgent Care',
    type: 'Urgent Care',
    address: {
      street: '456 Urgent Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    phone: '+1234567904',
    operatingHours: '8:00 AM - 10:00 PM',
    services: ['Minor Injuries', 'Illness Treatment', 'X-rays', 'Lab Testing'],
    waitTime: '10-20 minutes',
    location: {
      type: 'Point',
      coordinates: [-118.2437, 34.0522] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Rapid Response Ambulance',
    type: 'Ambulance Service',
    address: {
      street: '789 Response Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    phone: '+1234567905',
    operatingHours: '24/7',
    services: ['Emergency Transport', 'Basic Life Support', 'Advanced Life Support', 'Critical Care Transport'],
    responseTime: '5-10 minutes',
    location: {
      type: 'Point',
      coordinates: [-87.6298, 41.8781] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Community Mental Health Crisis Center',
    type: 'Mental Health Crisis',
    address: {
      street: '101 Support Avenue',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'USA'
    },
    phone: '+1234567906',
    operatingHours: '24/7',
    services: ['Crisis Intervention', 'Suicide Prevention', 'Psychiatric Assessment', 'Referral Services'],
    waitTime: '15-30 minutes',
    location: {
      type: 'Point',
      coordinates: [-71.0589, 42.3601] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Pediatric Emergency Center',
    type: 'Pediatric Emergency',
    address: {
      street: '555 Children\'s Way',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19104',
      country: 'USA'
    },
    phone: '+1234567907',
    operatingHours: '24/7',
    services: ['Pediatric Trauma', 'Pediatric Critical Care', 'Child-Friendly Environment', 'Specialized Equipment'],
    waitTime: '10-25 minutes',
    location: {
      type: 'Point',
      coordinates: [-75.1652, 39.9526] // longitude, latitude
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Clear existing data
    for (const collection of Object.values(collections)) {
      await db.collection(collection).deleteMany({});
      console.log(`Cleared ${collection} collection`);
    }

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    // Hash passwords for doctors
    const hashedDoctors = await Promise.all(
      sampleDoctors.map(async (doctor) => {
        const hashedPassword = await bcrypt.hash(doctor.password, 10);
        return { ...doctor, password: hashedPassword };
      })
    );

    // Insert data into collections
    await db.collection(collections.users).insertMany(hashedUsers);
    console.log(`Inserted ${hashedUsers.length} users`);

    await db.collection(collections.doctors).insertMany(hashedDoctors);
    console.log(`Inserted ${hashedDoctors.length} doctors`);

    await db.collection(collections.labTests).insertMany(sampleLabTests);
    console.log(`Inserted ${sampleLabTests.length} lab tests`);

    await db.collection(collections.pharmacies).insertMany(samplePharmacies);
    console.log(`Inserted ${samplePharmacies.length} pharmacies`);

    await db.collection(collections.medicines).insertMany(sampleMedicines);
    console.log(`Inserted ${sampleMedicines.length} medicines`);

    await db.collection(collections.emergencyServices).insertMany(sampleEmergencyServices);
    console.log(`Inserted ${sampleEmergencyServices.length} emergency services`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeding function
seedDatabase().catch(console.error); 