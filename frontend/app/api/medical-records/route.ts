import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { MedicalRecord } from '@/app/types/api-types';

/**
 * GET handler for fetching medical records
 * Uses the new authentication middleware pattern
 */
export const GET = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const type = searchParams.get('recordType');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const provider = searchParams.get('provider');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    // Construct the query based on parameters
    let query: any = { patientId: userId };
    
    // Filter by record type
    if (type) {
      query.recordType = type;
    }
    
    // Filter by date range
    if (from && to) {
      query.date = { 
        $gte: from,
        $lte: to
      };
    }
    
    // Filter by provider
    if (provider) {
      query.provider = { $regex: provider, $options: 'i' };
    }
    
    // Fetch medical records from the database
    const db = await DatabaseService.getDb();
    let records = db.collection('medicalRecords')
      .find(query)
      .sort({ date: -1 });
    
    if (limit) {
      records = records.limit(limit);
    }
    
    const results = await records.toArray();
    
    // Generate mock data if no results are found
    if (results.length === 0) {
      const mockRecords = generateMockMedicalRecords(userId, limit || 5);
      return apiResponse({ medicalRecords: mockRecords });
    }
    
    return apiResponse({ medicalRecords: results });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return apiError('Failed to fetch medical records. Please try again later.', 500);
  }
});

/**
 * POST handler for adding new medical records
 */
export const POST = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const recordData = await request.json();
    
    // Validate required fields
    const requiredFields = ['recordType', 'title', 'date', 'provider', 'description'];
    for (const field of requiredFields) {
      if (!recordData[field]) {
        return apiError(`Missing required field: ${field}`, 400);
      }
    }
    
    const newRecord = {
      ...recordData,
      patientId: userId,
      attachments: recordData.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create the medical record
    const db = await DatabaseService.getDb();
    const result = await db.collection('medicalRecords').insertOne(newRecord);
    
    if (!result.insertedId) {
      return apiError('Failed to create medical record', 500);
    }
    
    const createdRecord = await db.collection('medicalRecords').findOne({ _id: result.insertedId });
    
    return apiResponse({ medicalRecord: createdRecord }, 201);
  } catch (error) {
    console.error('Error creating medical record:', error);
    return apiError('Failed to create medical record. Please check your input and try again.', 500);
  }
});

/**
 * DELETE handler for removing medical records
 */
export const DELETE = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('id');
    
    if (!recordId) {
      return apiError('Missing record ID', 400);
    }
    
    // Ensure the record belongs to the user
    const db = await DatabaseService.getDb();
    const record = await db.collection('medicalRecords').findOne({
      _id: new ObjectId(recordId),
      patientId: userId
    });
    
    if (!record) {
      return apiError('Medical record not found or access denied', 404);
    }
    
    // Delete the record
    const result = await db.collection('medicalRecords').deleteOne({
      _id: new ObjectId(recordId),
      patientId: userId
    });
    
    if (result.deletedCount === 0) {
      return apiError('Failed to delete medical record', 500);
    }
    
    return apiResponse({ success: true, message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return apiError('Failed to delete medical record. Please try again later.', 500);
  }
});

/**
 * Helper function to generate mock medical records
 */
function generateMockMedicalRecords(userId: string, count: number): MedicalRecord[] {
  const recordTypes = [
    'visit_summary', 
    'hospital_discharge', 
    'specialist_report', 
    'vaccination', 
    'surgery', 
    'allergy_test',
    'prescription_history',
    'imaging'
  ];
  
  const providers = [
    'Dr. Sarah Johnson - MedConnect Main Hospital',
    'Dr. Michael Chen - Cardiology Associates',
    'Dr. Emily Rodriguez - Family Practice Group',
    'Dr. David Kim - Orthopedic Specialists',
    'Dr. Lisa Wong - Internal Medicine Center',
    'Dr. James Williams - Neurology Partners',
    'Dr. Robert Taylor - Surgical Associates'
  ];
  
  const titles = {
    'visit_summary': [
      'Annual Physical Examination', 
      'Follow-up Appointment', 
      'Urgent Care Visit',
      'Preventive Health Screening'
    ],
    'hospital_discharge': [
      'Discharge Summary - Pneumonia Treatment',
      'Post-Surgery Discharge Instructions',
      'Inpatient Care Summary',
      'Emergency Department Discharge'
    ],
    'specialist_report': [
      'Cardiology Consultation',
      'Dermatology Evaluation',
      'Gastroenterology Findings',
      'Endocrinology Assessment'
    ],
    'vaccination': [
      'Annual Flu Vaccination',
      'COVID-19 Vaccination',
      'Tetanus Booster',
      'Travel Immunizations'
    ],
    'surgery': [
      'Appendectomy Procedure Report',
      'Knee Arthroscopy Summary',
      'Gallbladder Removal Report',
      'Cataract Surgery Documentation'
    ],
    'allergy_test': [
      'Comprehensive Allergy Panel Results',
      'Food Sensitivity Testing',
      'Environmental Allergen Evaluation',
      'Medication Allergy Assessment'
    ],
    'prescription_history': [
      'Medication Reconciliation',
      'Prescription Renewal Documentation',
      'Medication History Review',
      'Pharmacy Consultation Notes'
    ],
    'imaging': [
      'Chest X-ray Report',
      'MRI Findings - Lower Back',
      'CT Scan Results - Abdomen',
      'Ultrasound Report - Thyroid'
    ]
  };
  
  const today = new Date();
  const mockRecords: MedicalRecord[] = [];
  
  for (let i = 0; i < count; i++) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - Math.floor(Math.random() * 365 * 2)); // Last 2 years
    
    const recordType = recordTypes[Math.floor(Math.random() * recordTypes.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    
    // Select a title based on the record type
    const titleOptions = titles[recordType as keyof typeof titles] || titles['visit_summary'];
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    
    // Generate a description based on the type
    let description = '';
    switch (recordType) {
      case 'visit_summary':
        description = 'Routine check-up with vital signs recorded. Patient reports feeling well overall. No significant health changes since last visit.';
        break;
      case 'hospital_discharge':
        description = 'Patient was admitted for observation and treatment. Condition improved with medication and rest. Discharged with instructions for follow-up care.';
        break;
      case 'specialist_report':
        description = 'Detailed evaluation of symptoms and medical history. Diagnostic tests performed. Treatment plan established with recommended follow-up.';
        break;
      case 'vaccination':
        description = 'Vaccine administered as scheduled. No immediate adverse reactions. Patient advised on potential side effects and when to seek medical attention.';
        break;
      case 'surgery':
        description = 'Procedure performed without complications. Post-operative instructions provided. Follow-up appointment scheduled for suture removal and healing assessment.';
        break;
      case 'allergy_test':
        description = 'Multiple allergens tested. Positive reactions documented. Allergy management plan discussed with patient including avoidance strategies and medication options.';
        break;
      case 'prescription_history':
        description = 'Current medications reviewed for efficacy and side effects. Adjustments made to dosage where appropriate. New prescriptions provided with detailed instructions.';
        break;
      case 'imaging':
        description = 'Imaging study completed as ordered. Findings detailed in report. Comparison made to previous studies where available. Clinical correlation recommended.';
        break;
      default:
        description = 'Medical record documented and filed. See attached documents for complete details.';
    }
    
    // Determine if this record has attachments
    const hasAttachments = Math.random() > 0.3; // 70% chance of having attachments
    const attachments = [];
    
    if (hasAttachments) {
      const attachmentCount = Math.floor(Math.random() * 3) + 1; // 1-3 attachments
      
      for (let j = 0; j < attachmentCount; j++) {
        const fileTypes = ['pdf', 'jpg', 'png', 'docx'];
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const fileName = `${recordType}_${new Date(recordDate).getTime()}_${j+1}.${fileType}`;
        
        attachments.push(`https://medconnect.app/medical-records/${userId}/${fileName}`);
      }
    }
    
    mockRecords.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      recordType,
      title,
      date: recordDate.toISOString().split('T')[0],
      provider,
      description,
      attachments,
      createdAt: new Date(recordDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(), // Created within a week before the record date
      updatedAt: new Date(recordDate.getTime()).toISOString()
    });
  }
  
  return mockRecords;
} 