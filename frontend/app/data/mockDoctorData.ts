// Mock data for doctor search functionality

// Doctor data
export const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Anil Kumar',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    qualifications: 'MD, MBBS, Cardiology',
    specializations: ['Cardiologist', 'Heart Specialist'],
    experience: 15,
    clinicName: 'City Heart Clinic',
    clinicLocation: 'Mumbai',
    clinicDistance: 2.5,
    consultationFeeClinic: 800,
    consultationFeeOnline: 600,
    availability: {
      nextAvailable: '2023-06-15T10:00:00',
      slots: [
        {
          date: '2023-06-15',
          available: true,
          times: ['10:00 AM', '11:30 AM', '4:00 PM']
        },
        {
          date: '2023-06-16',
          available: true,
          times: ['9:30 AM', '2:00 PM']
        },
        {
          date: '2023-06-17',
          available: false,
          times: []
        }
      ]
    },
    rating: 4.8,
    reviewCount: 124,
    isGuruProgram: true,
    services: ['ECG', 'Echocardiogram', 'Stress Test', 'Cardiac Consultation'],
    languages: ['English', 'Hindi', 'Marathi'],
    insuranceAccepted: ['Aditya Birla', 'HDFC ERGO', 'Star Health'],
    conditions: ['Heart Disease', 'Hypertension', 'Arrhythmia'],
    awards: ['Best Cardiologist Award 2020', 'Medical Excellence Award'],
    recommendations: 45,
    gender: 'male',
    consultationTypes: ['clinic', 'online']
  },
  {
    id: '2',
    name: 'Dr. Priya Singh',
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    qualifications: 'MBBS, MD, Dermatology',
    specializations: ['Dermatologist', 'Cosmetologist'],
    experience: 8,
    clinicName: 'SkinCare Center',
    clinicLocation: 'Delhi',
    clinicDistance: 3.8,
    consultationFeeClinic: 1000,
    consultationFeeOnline: 800,
    availability: {
      nextAvailable: '2023-06-14T14:30:00',
      slots: [
        {
          date: '2023-06-14',
          available: true,
          times: ['2:30 PM', '3:30 PM', '5:00 PM']
        },
        {
          date: '2023-06-15',
          available: true,
          times: ['10:00 AM', '11:00 AM', '12:00 PM']
        },
        {
          date: '2023-06-16',
          available: true,
          times: ['3:00 PM', '4:00 PM']
        }
      ]
    },
    rating: 4.9,
    reviewCount: 98,
    isGuruProgram: false,
    services: ['Skin Consultation', 'Acne Treatment', 'Laser Therapy', 'Chemical Peels'],
    languages: ['English', 'Hindi', 'Punjabi'],
    insuranceAccepted: ['HDFC ERGO', 'Max Bupa', 'Religare'],
    conditions: ['Acne', 'Eczema', 'Psoriasis', 'Hair Loss'],
    awards: ['Young Dermatologist Award'],
    recommendations: 32,
    gender: 'female',
    consultationTypes: ['clinic', 'online', 'home']
  },
  {
    id: '3',
    name: 'Dr. Rajan Menon',
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    qualifications: 'MBBS, MS, MCh, Neurosurgery',
    specializations: ['Neurologist', 'Neurosurgeon'],
    experience: 20,
    clinicName: 'Brain & Spine Institute',
    clinicLocation: 'Bangalore',
    clinicDistance: 5.2,
    consultationFeeClinic: 1500,
    consultationFeeOnline: 1200,
    availability: {
      nextAvailable: '2023-06-18T09:00:00',
      slots: [
        {
          date: '2023-06-18',
          available: true,
          times: ['9:00 AM', '10:00 AM']
        },
        {
          date: '2023-06-20',
          available: true,
          times: ['11:00 AM', '12:00 PM', '4:00 PM']
        },
        {
          date: '2023-06-22',
          available: true,
          times: ['2:00 PM', '3:00 PM']
        }
      ]
    },
    rating: 4.7,
    reviewCount: 156,
    isGuruProgram: true,
    services: ['Neurological Consultation', 'Brain Surgery', 'Spine Surgery'],
    languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
    insuranceAccepted: ['Aditya Birla', 'HDFC ERGO', 'Star Health', 'Religare'],
    conditions: ['Brain Tumor', 'Epilepsy', 'Parkinson\'s Disease', 'Stroke'],
    awards: ['Lifetime Achievement Award', 'Best Neurosurgeon 2019'],
    recommendations: 78,
    gender: 'male',
    consultationTypes: ['clinic']
  },
  {
    id: '4',
    name: 'Dr. Meera Patel',
    imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    qualifications: 'MBBS, MD, Pediatrics',
    specializations: ['Pediatrician', 'Child Specialist'],
    experience: 12,
    clinicName: 'Children\'s Wellness Center',
    clinicLocation: 'Mumbai',
    clinicDistance: 1.8,
    consultationFeeClinic: 700,
    consultationFeeOnline: 600,
    availability: {
      nextAvailable: '2023-06-14T09:30:00',
      slots: [
        {
          date: '2023-06-14',
          available: true,
          times: ['9:30 AM', '10:30 AM', '11:30 AM', '4:30 PM', '5:30 PM']
        },
        {
          date: '2023-06-15',
          available: true,
          times: ['9:30 AM', '10:30 AM', '11:30 AM', '4:30 PM']
        },
        {
          date: '2023-06-16',
          available: true,
          times: ['9:30 AM', '10:30 AM', '11:30 AM']
        }
      ]
    },
    rating: 4.9,
    reviewCount: 210,
    isGuruProgram: true,
    services: ['Child Health Checkup', 'Vaccination', 'Growth Monitoring'],
    languages: ['English', 'Hindi', 'Gujarati', 'Marathi'],
    insuranceAccepted: ['Aditya Birla', 'HDFC ERGO', 'Star Health'],
    conditions: ['Childhood Diseases', 'Growth Issues', 'Developmental Delays'],
    awards: ['Best Pediatrician 2021', 'Child Care Excellence Award'],
    recommendations: 65,
    gender: 'female',
    consultationTypes: ['clinic', 'online', 'home']
  },
  {
    id: '5',
    name: 'Dr. Vikram Sharma',
    imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    qualifications: 'MBBS, MS, Orthopedics',
    specializations: ['Orthopedic Surgeon', 'Sports Medicine'],
    experience: 18,
    clinicName: 'Joint & Bone Care Hospital',
    clinicLocation: 'Delhi',
    clinicDistance: 4.5,
    consultationFeeClinic: 1200,
    consultationFeeOnline: 900,
    availability: {
      nextAvailable: '2023-06-16T11:00:00',
      slots: [
        {
          date: '2023-06-16',
          available: true,
          times: ['11:00 AM', '12:00 PM', '5:00 PM']
        },
        {
          date: '2023-06-17',
          available: true,
          times: ['10:00 AM', '11:00 AM', '12:00 PM']
        },
        {
          date: '2023-06-19',
          available: true,
          times: ['4:00 PM', '5:00 PM', '6:00 PM']
        }
      ]
    },
    rating: 4.6,
    reviewCount: 178,
    isGuruProgram: true,
    services: ['Joint Replacement', 'Fracture Treatment', 'Sports Injury Management'],
    languages: ['English', 'Hindi', 'Punjabi'],
    insuranceAccepted: ['Aditya Birla', 'HDFC ERGO', 'Star Health', 'Max Bupa'],
    conditions: ['Arthritis', 'Fractures', 'Sports Injuries', 'Back Pain'],
    awards: ['Excellence in Orthopedic Surgery', 'Sports Medicine Award'],
    recommendations: 52,
    gender: 'male',
    consultationTypes: ['clinic', 'online']
  }
];

// Specialties
export const mockSpecialties = [
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Gynecologist',
  'ENT Specialist',
  'Ophthalmologist',
  'Psychiatrist',
  'Dentist',
  'Urologist',
  'Endocrinologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Nephrologist'
];

// Hospitals
export const mockHospitals = [
  'Apollo Hospitals',
  'Fortis Healthcare',
  'Max Healthcare',
  'Medanta - The Medicity',
  'Manipal Hospitals',
  'Narayana Health',
  'AIIMS',
  'Kokilaben Dhirubhai Ambani Hospital',
  'Lilavati Hospital',
  'Tata Memorial Hospital',
  'Jaslok Hospital',
  'Columbia Asia Hospitals',
  'Wockhardt Hospitals',
  'BLK Super Speciality Hospital',
  'Sir Ganga Ram Hospital'
];

// Insurance
export const mockInsurance = [
  'Aditya Birla Health Insurance',
  'HDFC ERGO Health Insurance',
  'Star Health Insurance',
  'Max Bupa Health Insurance',
  'Religare Health Insurance',
  'ICICI Lombard Health Insurance',
  'Bajaj Allianz Health Insurance',
  'SBI Health Insurance',
  'Tata AIG Health Insurance',
  'National Insurance',
  'Oriental Insurance',
  'New India Assurance',
  'United India Insurance',
  'Reliance Health Insurance',
  'Cigna TTK Health Insurance'
];

// Languages
export const mockLanguages = [
  'English',
  'Hindi',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Urdu',
  'Gujarati',
  'Kannada',
  'Odia',
  'Punjabi',
  'Malayalam',
  'Assamese',
  'Maithili',
  'Sanskrit'
]; 