/**
 * MedConnect Database Setup Script
 * 
 * This script initializes the MongoDB collections and populates them with mock data.
 * It creates all the necessary collections for the MedConnect platform.
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medconnect';

// Collections to be created
const collections = [
  'users',
  'doctors',
  'appointments',
  'prescriptions',
  'reminders',
  'vitalSigns',
  'labResults',
  'healthPassports',
  'medicalRecords',
  'pharmacies',
  'medications',
  'labTests',
  'imagingServices',
  'emergencyServices',
  'reviews'
];

// Connect to MongoDB
async function setupDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Create collections if they don't exist
    for (const collection of collections) {
      const collectionExists = await db.listCollections({ name: collection }).hasNext();
      
      if (!collectionExists) {
        await db.createCollection(collection);
        console.log(`Created collection: ${collection}`);
      } else {
        console.log(`Collection ${collection} already exists`);
      }
    }
    
    // Add mock data if collections are empty
    await populateMockUsers(db);
    await populateMockDoctors(db);
    await populateMockAppointments(db);
    await populateMockPrescriptions(db);
    await populateMockReminders(db);
    await populateMockVitalSigns(db);
    await populateMockLabResults(db);
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

async function populateMockUsers(db) {
  const usersCollection = db.collection('users');
  const count = await usersCollection.countDocuments();
  
  if (count === 0) {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    
    const mockUsers = [
      {
        email: 'patient@example.com',
        password: await bcrypt.hash('password123', salt),
        fullName: 'John Patient',
        dateOfBirth: '1985-05-15',
        gender: 'male',
        address: '123 Patient St, Medical City',
        phone: '555-123-4567',
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'doctor@example.com',
        password: await bcrypt.hash('password123', salt),
        fullName: 'Dr. Jane Doctor',
        dateOfBirth: '1980-03-20',
        gender: 'female',
        address: '456 Doctor Ave, Medical City',
        phone: '555-987-6543',
        role: 'doctor',
        specialty: 'Cardiology',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', salt),
        fullName: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await usersCollection.insertMany(mockUsers);
    console.log(`${result.insertedCount} mock users inserted`);
    return result.insertedIds;
  } else {
    console.log('Users collection already has data, skipping mock data insertion');
    return null;
  }
}

async function populateMockDoctors(db) {
  const doctorsCollection = db.collection('doctors');
  const count = await doctorsCollection.countDocuments();
  
  if (count === 0) {
    const specialties = [
      'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
      'Neurology', 'Oncology', 'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery'
    ];
    
    const mockDoctors = [];
    
    for (let i = 0; i < 20; i++) {
      const firstName = ['James', 'Robert', 'John', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda'][Math.floor(Math.random() * 10)];
      const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][Math.floor(Math.random() * 10)];
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];
      
      mockDoctors.push({
        userId: new ObjectId(),
        fullName: `Dr. ${firstName} ${lastName}`,
        specialty,
        qualifications: ['MD', 'Board Certified'].concat(Math.random() > 0.5 ? ['FACP'] : []),
        experience: Math.floor(Math.random() * 30) + 5,
        hospital: `${['City', 'Central', 'Metro', 'Regional', 'United'][Math.floor(Math.random() * 5)]} Medical Center`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        availability: {
          monday: ['09:00-12:00', '14:00-17:00'],
          tuesday: ['09:00-12:00', '14:00-17:00'],
          wednesday: ['10:00-13:00', '15:00-18:00'],
          thursday: ['09:00-12:00', '14:00-17:00'],
          friday: ['09:00-12:00', '14:00-17:00']
        },
        consultationFee: Math.floor(Math.random() * 100) + 50,
        profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    const result = await doctorsCollection.insertMany(mockDoctors);
    console.log(`${result.insertedCount} mock doctors inserted`);
  } else {
    console.log('Doctors collection already has data, skipping mock data insertion');
  }
}

async function populateMockAppointments(db) {
  const appointmentsCollection = db.collection('appointments');
  const count = await appointmentsCollection.countDocuments();
  
  if (count === 0) {
    const usersCollection = db.collection('users');
    const doctorsCollection = db.collection('doctors');
    
    const patient = await usersCollection.findOne({ role: 'patient' });
    const doctors = await doctorsCollection.find().limit(5).toArray();
    
    if (!patient || doctors.length === 0) {
      console.log('No patients or doctors found, skipping appointment creation');
      return;
    }
    
    const patientId = patient._id.toString();
    const reasons = [
      'Annual Check-up', 'Follow-up Consultation', 'Medication Review',
      'Flu Symptoms', 'Back Pain', 'Heart Palpitations', 'Skin Rash', 'Allergies'
    ];
    
    const mockAppointments = [];
    const today = new Date();
    
    // Past appointments
    for (let i = 0; i < 5; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() - (i + 1) * 7);
      
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const startHour = 9 + Math.floor(Math.random() * 8);
      const startMinute = Math.floor(Math.random() * 4) * 15;
      
      mockAppointments.push({
        patientId,
        doctorId: doctor._id.toString(),
        doctorName: doctor.fullName,
        date: appointmentDate.toISOString().split('T')[0],
        startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        endTime: `${(startHour + 1).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        type: Math.random() > 0.5 ? 'in-person' : 'video',
        status: 'completed',
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        notes: Math.random() > 0.5 ? 'Patient responded well to treatment.' : null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Upcoming appointments
    for (let i = 0; i < 3; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + (i + 1) * 7);
      
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const startHour = 9 + Math.floor(Math.random() * 8);
      const startMinute = Math.floor(Math.random() * 4) * 15;
      
      mockAppointments.push({
        patientId,
        doctorId: doctor._id.toString(),
        doctorName: doctor.fullName,
        date: appointmentDate.toISOString().split('T')[0],
        startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        endTime: `${(startHour + 1).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
        type: Math.random() > 0.5 ? 'in-person' : 'video',
        status: 'scheduled',
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    const result = await appointmentsCollection.insertMany(mockAppointments);
    console.log(`${result.insertedCount} mock appointments inserted`);
  } else {
    console.log('Appointments collection already has data, skipping mock data insertion');
  }
}

async function populateMockPrescriptions(db) {
  const prescriptionsCollection = db.collection('prescriptions');
  const count = await prescriptionsCollection.countDocuments();
  
  if (count === 0) {
    const usersCollection = db.collection('users');
    const doctorsCollection = db.collection('doctors');
    
    const patient = await usersCollection.findOne({ role: 'patient' });
    const doctors = await doctorsCollection.find().limit(5).toArray();
    
    if (!patient || doctors.length === 0) {
      console.log('No patients or doctors found, skipping prescription creation');
      return;
    }
    
    const patientId = patient._id.toString();
    const medications = [
      { name: 'Lisinopril', class: 'ACE Inhibitor', commonUse: 'High blood pressure' },
      { name: 'Atorvastatin', class: 'Statin', commonUse: 'High cholesterol' },
      { name: 'Levothyroxine', class: 'Thyroid hormone', commonUse: 'Hypothyroidism' },
      { name: 'Metformin', class: 'Biguanide', commonUse: 'Type 2 diabetes' },
      { name: 'Amlodipine', class: 'Calcium channel blocker', commonUse: 'High blood pressure' }
    ];
    
    const mockPrescriptions = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      const prescribedDate = new Date(today);
      prescribedDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
      
      const durationMonths = Math.floor(Math.random() * 6) + 1;
      const expiryDate = new Date(prescribedDate);
      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
      
      const isActive = expiryDate > today;
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      
      const numMeds = Math.floor(Math.random() * 2) + 1;
      const prescriptionMeds = [];
      
      for (let j = 0; j < numMeds; j++) {
        const med = medications[Math.floor(Math.random() * medications.length)];
        
        prescriptionMeds.push({
          name: med.name,
          dosage: `${(Math.random() * 200 + 10).toFixed(0)} mg Tablet`,
          frequency: `${Math.floor(Math.random() * 3) + 1} time(s) daily`,
          instructions: 'Take with food',
          refills: Math.floor(Math.random() * 3),
          medicationClass: med.class,
          commonUses: [med.commonUse]
        });
      }
      
      mockPrescriptions.push({
        patientId,
        doctorId: doctor._id.toString(),
        doctorName: doctor.fullName,
        medications: prescriptionMeds,
        prescribedDate: prescribedDate.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        refillsRemaining: Math.floor(Math.random() * 4),
        status: isActive ? 'active' : 'expired',
        pharmacyId: new ObjectId().toString(),
        pharmacyName: 'MedConnect Pharmacy',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    const result = await prescriptionsCollection.insertMany(mockPrescriptions);
    console.log(`${result.insertedCount} mock prescriptions inserted`);
  } else {
    console.log('Prescriptions collection already has data, skipping mock data insertion');
  }
}

async function populateMockReminders(db) {
  const remindersCollection = db.collection('reminders');
  const count = await remindersCollection.countDocuments();
  
  if (count === 0) {
    const usersCollection = db.collection('users');
    const patient = await usersCollection.findOne({ role: 'patient' });
    
    if (!patient) {
      console.log('No patients found, skipping reminder creation');
      return;
    }
    
    const patientId = patient._id.toString();
    const reminderTypes = ['medication', 'appointment', 'test', 'vitals'];
    const today = new Date();
    
    const mockReminders = [];
    
    for (let i = 0; i < 10; i++) {
      const reminderDate = new Date(today);
      reminderDate.setDate(today.getDate() + Math.floor(Math.random() * 10) - 5);
      
      const reminderType = reminderTypes[Math.floor(Math.random() * reminderTypes.length)];
      let title, description;
      
      switch (reminderType) {
        case 'medication':
          title = `Take ${['Aspirin', 'Lisinopril', 'Metformin'][Math.floor(Math.random() * 3)]}`;
          description = `${Math.floor(Math.random() * 3) + 1} tablet(s) with food`;
          break;
        case 'appointment':
          title = 'Doctor Appointment';
          description = 'Follow-up consultation';
          break;
        case 'test':
          title = `${['Blood test', 'Urine test', 'X-ray'][Math.floor(Math.random() * 3)]}`;
          description = 'Fasting required';
          break;
        case 'vitals':
          title = `Record ${['blood pressure', 'heart rate', 'blood sugar'][Math.floor(Math.random() * 3)]}`;
          description = 'Regular monitoring required';
          break;
      }
      
      mockReminders.push({
        patientId,
        title,
        description,
        reminder_type: reminderType,
        date: reminderDate.toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        recurring: Math.random() > 0.5,
        frequency: 'daily',
        status: reminderDate < today ? 'completed' : 'pending',
        created_at: new Date(today.getTime() - 86400000 * 10).toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    const result = await remindersCollection.insertMany(mockReminders);
    console.log(`${result.insertedCount} mock reminders inserted`);
  } else {
    console.log('Reminders collection already has data, skipping mock data insertion');
  }
}

async function populateMockVitalSigns(db) {
  const vitalSignsCollection = db.collection('vitalSigns');
  const count = await vitalSignsCollection.countDocuments();
  
  if (count === 0) {
    const usersCollection = db.collection('users');
    const patient = await usersCollection.findOne({ role: 'patient' });
    
    if (!patient) {
      console.log('No patients found, skipping vital signs creation');
      return;
    }
    
    const patientId = patient._id.toString();
    const today = new Date();
    
    const mockVitalSigns = [];
    
    // Blood pressure readings
    for (let i = 0; i < 10; i++) {
      const recordDate = new Date(today);
      recordDate.setDate(today.getDate() - i * 3);
      
      const systolic = Math.floor(Math.random() * 30) + 110;
      const diastolic = Math.floor(Math.random() * 20) + 70;
      
      mockVitalSigns.push({
        patientId,
        recordedAt: recordDate.toISOString(),
        vitalType: 'blood_pressure',
        value: `${systolic}/${diastolic}`,
        unit: 'mmHg',
        isAbnormal: systolic > 130 || diastolic > 85,
        source: 'manual',
        createdAt: recordDate,
        updatedAt: recordDate
      });
    }
    
    // Heart rate readings
    for (let i = 0; i < 10; i++) {
      const recordDate = new Date(today);
      recordDate.setDate(today.getDate() - i * 2);
      
      const heartRate = Math.floor(Math.random() * 30) + 60;
      
      mockVitalSigns.push({
        patientId,
        recordedAt: recordDate.toISOString(),
        vitalType: 'heart_rate',
        value: heartRate,
        unit: 'bpm',
        isAbnormal: heartRate > 100 || heartRate < 60,
        source: 'manual',
        createdAt: recordDate,
        updatedAt: recordDate
      });
    }
    
    // Weight readings
    for (let i = 0; i < 5; i++) {
      const recordDate = new Date(today);
      recordDate.setDate(today.getDate() - i * 7);
      
      const weight = Math.floor(Math.random() * 20) + 70;
      
      mockVitalSigns.push({
        patientId,
        recordedAt: recordDate.toISOString(),
        vitalType: 'weight',
        value: weight,
        unit: 'kg',
        isAbnormal: false,
        source: 'manual',
        createdAt: recordDate,
        updatedAt: recordDate
      });
    }
    
    const result = await vitalSignsCollection.insertMany(mockVitalSigns);
    console.log(`${result.insertedCount} mock vital signs inserted`);
  } else {
    console.log('Vital signs collection already has data, skipping mock data insertion');
  }
}

async function populateMockLabResults(db) {
  const labResultsCollection = db.collection('labResults');
  const count = await labResultsCollection.countDocuments();
  
  if (count === 0) {
    const usersCollection = db.collection('users');
    const patient = await usersCollection.findOne({ role: 'patient' });
    
    if (!patient) {
      console.log('No patients found, skipping lab results creation');
      return;
    }
    
    const patientId = patient._id.toString();
    const today = new Date();
    
    const testTypes = [
      'Complete Blood Count (CBC)',
      'Comprehensive Metabolic Panel (CMP)',
      'Lipid Panel',
      'Thyroid Function Tests'
    ];
    
    const mockLabResults = [];
    
    for (let i = 0; i < 5; i++) {
      const resultDate = new Date(today);
      resultDate.setDate(today.getDate() - i * 30);
      
      const testName = testTypes[Math.floor(Math.random() * testTypes.length)];
      const isNormal = Math.random() > 0.3;
      
      const mockResult = {
        patientId,
        test_name: testName,
        test_type: testName.toLowerCase().replace(/\s+/g, '_'),
        result_date: resultDate.toISOString(),
        is_normal: isNormal,
        conclusion: isNormal ? 'Results are within normal range.' : 'Minor abnormality detected. Monitoring advised.',
        details: {
          performed_by: 'Dr. Johnson',
          lab_name: 'MedConnect Labs'
        },
        file_url: null,
        created_at: resultDate.toISOString(),
        updated_at: resultDate.toISOString(),
        parameters: []
      };
      
      // Add test-specific parameters
      if (testName.includes('Blood Count')) {
        mockResult.parameters = [
          { name: 'WBC', value: `${(Math.random() * 5 + 4).toFixed(1)}`, unit: 'x10^9/L', reference: '4.5-11.0', is_normal: Math.random() > 0.2 },
          { name: 'RBC', value: `${(Math.random() * 2 + 3.5).toFixed(2)}`, unit: 'x10^12/L', reference: '4.5-6.5', is_normal: Math.random() > 0.2 },
          { name: 'Hemoglobin', value: `${(Math.random() * 4 + 11).toFixed(1)}`, unit: 'g/dL', reference: '12-18', is_normal: Math.random() > 0.2 },
          { name: 'Platelets', value: `${Math.floor(Math.random() * 150 + 150)}`, unit: 'x10^9/L', reference: '150-450', is_normal: Math.random() > 0.2 }
        ];
      } else if (testName.includes('Lipid')) {
        mockResult.parameters = [
          { name: 'Total Cholesterol', value: `${Math.floor(Math.random() * 100 + 150)}`, unit: 'mg/dL', reference: '<200', is_normal: Math.random() > 0.3 },
          { name: 'LDL', value: `${Math.floor(Math.random() * 60 + 70)}`, unit: 'mg/dL', reference: '<100', is_normal: Math.random() > 0.3 },
          { name: 'HDL', value: `${Math.floor(Math.random() * 30 + 40)}`, unit: 'mg/dL', reference: '>40', is_normal: Math.random() > 0.3 },
          { name: 'Triglycerides', value: `${Math.floor(Math.random() * 100 + 50)}`, unit: 'mg/dL', reference: '<150', is_normal: Math.random() > 0.3 }
        ];
      }
      
      mockLabResults.push(mockResult);
    }
    
    const result = await labResultsCollection.insertMany(mockLabResults);
    console.log(`${result.insertedCount} mock lab results inserted`);
  } else {
    console.log('Lab results collection already has data, skipping mock data insertion');
  }
}

// Run the setup
setupDatabase().catch(console.error); 