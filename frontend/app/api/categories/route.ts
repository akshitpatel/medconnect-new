import { NextResponse } from 'next/server';

export async function GET() {
  // This would typically fetch from a database
  const data = {
    specializations: [
      'Cardiologist',
      'Dermatologist',
      'Neurologist',
      'Pediatrician',
      'Orthopedic',
      'Ophthalmologist',
      'Gynecologist',
      'ENT Specialist',
      'Psychiatrist',
      'Dentist',
    ],
    services: [
      // Lab Tests
      'Complete Blood Count',
      'Blood Glucose',
      'Lipid Profile',
      'Liver Function Test',
      'Kidney Function Test',
      'Thyroid Profile',
      'COVID-19 Test',
      
      // Medicine Categories
      'Antibiotics',
      'Pain Relief',
      'Vitamins & Supplements',
      'Diabetes Care',
      'Heart Health',
      
      // Therapies & Procedures
      'Physiotherapy',
      'Acupuncture',
      'Vaccination',
      'X-Ray',
      'MRI Scan',
      'Ultrasound',
    ],
    conditions: [
      'Diabetes',
      'Hypertension',
      'Asthma',
      'Arthritis',
      'Migraine',
      'Common Cold',
      'Flu',
      'Allergies',
      'Back Pain',
      'Depression',
      'Anxiety',
    ],
  };

  return NextResponse.json(data);
} 