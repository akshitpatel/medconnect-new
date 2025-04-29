import { NextRequest } from 'next/server';
import { DatabaseService } from '@/app/lib/db-service';
import { ObjectId } from 'mongodb';
import { withAuth, apiResponse, apiError } from '@/app/lib/auth-middleware';
import { LabTestResult } from '@/app/types/api-types';

/**
 * GET handler for fetching lab test results
 * Uses the new authentication middleware pattern
 */
export const GET = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering
    const type = searchParams.get('type');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const isNormal = searchParams.get('isNormal');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 50;
    
    // Construct the query based on parameters
    let query: any = { patientId: userId };
    
    // Filter by test type
    if (type) {
      query.test_type = type;
    }
    
    // Filter by date range
    if (from && to) {
      query.result_date = { 
        $gte: from,
        $lte: to
      };
    }
    
    // Filter by normal/abnormal results
    if (isNormal !== null) {
      query.is_normal = isNormal === 'true';
    }
    
    // Fetch lab results from the database
    const db = await DatabaseService.getDb();
    let results = db.collection('labResults')
      .find(query)
      .sort({ result_date: -1 });
    
    if (limit) {
      results = results.limit(limit);
    }
    
    const labResults = await results.toArray();
    
    // Generate mock data if no results are found
    if (labResults.length === 0) {
      const mockResults = generateMockLabResults(userId, limit || 5);
      return apiResponse({ labResults: mockResults });
    }
    
    return apiResponse({ labResults });
  } catch (error) {
    console.error('Error fetching lab test results:', error);
    return apiError('Failed to fetch lab test results. Please try again later.', 500);
  }
});

/**
 * POST handler for adding new lab test results
 */
export const POST = withAuth(async (request: NextRequest, session: any) => {
  try {
    const userId = session.user.id;
    const resultData = await request.json();
    
    // Validate required fields
    const requiredFields = ['test_name', 'test_type', 'result_date', 'is_normal', 'conclusion', 'details'];
    for (const field of requiredFields) {
      if (!resultData[field]) {
        return apiError(`Missing required field: ${field}`, 400);
      }
    }
    
    // Validate details object
    if (!resultData.details.performed_by || !resultData.details.lab_name) {
      return apiError('Details must include performed_by and lab_name', 400);
    }
    
    const newResult = {
      ...resultData,
      patientId: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Create the lab result
    const db = await DatabaseService.getDb();
    const result = await db.collection('labResults').insertOne(newResult);
    
    if (!result.insertedId) {
      return apiError('Failed to create lab test result', 500);
    }
    
    const createdResult = await db.collection('labResults').findOne({ _id: result.insertedId });
    
    return apiResponse({ labResult: createdResult }, 201);
  } catch (error) {
    console.error('Error creating lab test result:', error);
    return apiError('Failed to create lab test result. Please check your input and try again.', 500);
  }
});

/**
 * Helper function to generate mock lab test results
 */
function generateMockLabResults(userId: string, count: number): LabTestResult[] {
  const testTypes = [
    {
      name: 'Complete Blood Count (CBC)',
      type: 'blood',
      parameters: [
        { name: 'White Blood Cells', unit: '10^9/L', reference: '4.0-11.0' },
        { name: 'Red Blood Cells', unit: '10^12/L', reference: '4.5-5.9' },
        { name: 'Hemoglobin', unit: 'g/dL', reference: '13.5-17.5' },
        { name: 'Hematocrit', unit: '%', reference: '41.0-53.0' },
        { name: 'Platelets', unit: '10^9/L', reference: '150-400' }
      ]
    },
    {
      name: 'Comprehensive Metabolic Panel',
      type: 'blood',
      parameters: [
        { name: 'Glucose', unit: 'mg/dL', reference: '70-99' },
        { name: 'Calcium', unit: 'mg/dL', reference: '8.6-10.2' },
        { name: 'Sodium', unit: 'mmol/L', reference: '135-145' },
        { name: 'Potassium', unit: 'mmol/L', reference: '3.5-5.0' },
        { name: 'Carbon Dioxide', unit: 'mmol/L', reference: '23-29' },
        { name: 'Chloride', unit: 'mmol/L', reference: '96-106' },
        { name: 'BUN', unit: 'mg/dL', reference: '7-20' },
        { name: 'Creatinine', unit: 'mg/dL', reference: '0.8-1.3' }
      ]
    },
    {
      name: 'Lipid Panel',
      type: 'blood',
      parameters: [
        { name: 'Total Cholesterol', unit: 'mg/dL', reference: '<200' },
        { name: 'HDL Cholesterol', unit: 'mg/dL', reference: '>40' },
        { name: 'LDL Cholesterol', unit: 'mg/dL', reference: '<100' },
        { name: 'Triglycerides', unit: 'mg/dL', reference: '<150' }
      ]
    },
    {
      name: 'Urinalysis',
      type: 'urine',
      parameters: [
        { name: 'Color', unit: '', reference: 'Pale Yellow to Amber' },
        { name: 'Clarity', unit: '', reference: 'Clear' },
        { name: 'pH', unit: '', reference: '4.5-8.0' },
        { name: 'Specific Gravity', unit: '', reference: '1.005-1.030' },
        { name: 'Glucose', unit: '', reference: 'Negative' },
        { name: 'Ketones', unit: '', reference: 'Negative' },
        { name: 'Protein', unit: '', reference: 'Negative' }
      ]
    },
    {
      name: 'Thyroid Function Tests',
      type: 'blood',
      parameters: [
        { name: 'TSH', unit: 'mIU/L', reference: '0.4-4.0' },
        { name: 'T4', unit: 'µg/dL', reference: '4.5-11.2' },
        { name: 'T3', unit: 'ng/dL', reference: '80-200' }
      ]
    }
  ];

  const labNames = [
    'MedConnect Diagnostic Lab',
    'City Medical Laboratory',
    'Central Diagnostics',
    'Premier Health Labs',
    'Regional Medical Center Lab'
  ];
  
  const today = new Date();
  const mockResults: LabTestResult[] = [];
  
  for (let i = 0; i < count; i++) {
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() - Math.floor(Math.random() * 180)); // Last 6 months
    
    const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
    const isNormal = Math.random() > 0.3;
    const labName = labNames[Math.floor(Math.random() * labNames.length)];
    
    // Generate test parameters with values
    const parameters = testType.parameters.map(param => {
      // Generate a value that might be abnormal ~30% of the time
      let isParamNormal = Math.random() > 0.3;
      let value;
      
      if (param.reference.includes('-')) {
        const [min, max] = param.reference.split('-').map(parseFloat);
        if (isParamNormal) {
          // Generate a value within the reference range
          value = (Math.random() * (max - min) + min).toFixed(1);
        } else {
          // Generate a value outside the reference range
          value = Math.random() > 0.5 
            ? (max + Math.random() * (max * 0.2)).toFixed(1) 
            : (min - Math.random() * (min * 0.2)).toFixed(1);
        }
      } else if (param.reference.includes('<')) {
        const max = parseFloat(param.reference.replace('<', ''));
        if (isParamNormal) {
          // Generate a value below the max
          value = (Math.random() * (max * 0.9)).toFixed(1);
        } else {
          // Generate a value above the max
          value = (max + Math.random() * (max * 0.3)).toFixed(1);
        }
      } else if (param.reference.includes('>')) {
        const min = parseFloat(param.reference.replace('>', ''));
        if (isParamNormal) {
          // Generate a value above the min
          value = (min + Math.random() * (min * 0.5)).toFixed(1);
        } else {
          // Generate a value below the min
          value = (min * (0.5 + Math.random() * 0.3)).toFixed(1);
        }
      } else {
        // For descriptive ranges like "Negative" or "Clear"
        value = isParamNormal ? param.reference : 'Abnormal';
      }
      
      return {
        name: param.name,
        value: value.toString(),
        unit: param.unit,
        reference: param.reference,
        is_normal: isParamNormal
      };
    });
    
    // Some parameters are abnormal, so the overall result might be abnormal
    const anyAbnormalParams = parameters.some(p => !p.is_normal);
    const finalIsNormal = isNormal && !anyAbnormalParams;
    
    const conclusion = finalIsNormal 
      ? 'All results are within normal ranges. No further action required.' 
      : 'Some results are outside normal ranges. Follow-up with healthcare provider recommended.';
    
    mockResults.push({
      _id: new ObjectId().toString(),
      patientId: userId,
      test_name: testType.name,
      test_type: testType.type,
      result_date: resultDate.toISOString().split('T')[0],
      is_normal: finalIsNormal,
      conclusion,
      details: {
        performed_by: `Dr. ${['Johnson', 'Smith', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
        lab_name: labName
      },
      parameters,
      file_url: Math.random() > 0.5 ? `https://medconnect.app/reports/${new ObjectId().toString()}.pdf` : null,
      created_at: resultDate.toISOString(),
      updated_at: resultDate.toISOString()
    });
  }
  
  return mockResults;
} 