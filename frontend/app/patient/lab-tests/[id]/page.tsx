'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import DefaultLayout from '@/app/components/DefaultLayout';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { cn } from '@/app/utils/cn';

// Define types for lab test data
interface LabResult {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: 'normal' | 'high' | 'low' | 'abnormal';
  description?: string;
}

interface LabTest {
  id: string;
  name: string;
  date: string;
  provider: string;
  facility: string;
  status: 'completed' | 'pending';
  description: string;
  collectionDate: string;
  resultDate: string;
  orderNumber: string;
  results: LabResult[];
  notes?: string;
  recommendations?: string;
}

// Mock data for lab tests - same data from the lab-tests page
const labTests: LabTest[] = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    date: '2023-07-05',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    description: 'A blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    collectionDate: '2023-07-04',
    resultDate: '2023-07-05',
    orderNumber: 'LAB12345',
    results: [
      { name: 'WBC', value: '7.2', unit: 'K/uL', range: '4.5-11.0', status: 'normal', description: 'White blood cells help fight infection' },
      { name: 'RBC', value: '4.8', unit: 'M/uL', range: '4.5-5.9', status: 'normal', description: 'Red blood cells carry oxygen throughout the body' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '13.5-17.5', status: 'normal', description: 'Protein in red blood cells that carries oxygen' },
      { name: 'Hematocrit', value: '42', unit: '%', range: '41-50', status: 'normal', description: 'Percentage of red blood cells in total blood volume' },
      { name: 'Platelets', value: '290', unit: 'K/uL', range: '150-450', status: 'normal', description: 'Cells that help blood clot' },
      { name: 'MCV', value: '88', unit: 'fL', range: '80-100', status: 'normal', description: 'Average size of red blood cells' },
      { name: 'MCH', value: '30', unit: 'pg', range: '27-33', status: 'normal', description: 'Average amount of hemoglobin in red blood cells' },
      { name: 'MCHC', value: '34', unit: 'g/dL', range: '32-36', status: 'normal', description: 'Average concentration of hemoglobin in red blood cells' },
      { name: 'RDW', value: '13.2', unit: '%', range: '11.5-14.5', status: 'normal', description: 'Measure of the variation in red blood cell size' },
      { name: 'Neutrophils', value: '60', unit: '%', range: '40-70', status: 'normal', description: 'Type of white blood cell that fights infection' },
      { name: 'Lymphocytes', value: '30', unit: '%', range: '20-40', status: 'normal', description: 'Type of white blood cell that produces antibodies' },
      { name: 'Monocytes', value: '7', unit: '%', range: '2-8', status: 'normal', description: 'Type of white blood cell that fights infection' },
      { name: 'Eosinophils', value: '2', unit: '%', range: '0-4', status: 'normal', description: 'Type of white blood cell that fights allergies and parasites' },
      { name: 'Basophils', value: '1', unit: '%', range: '0-2', status: 'normal', description: 'Type of white blood cell involved in inflammatory reactions' }
    ],
    notes: 'Overall normal blood count values with no significant abnormalities detected.',
    recommendations: 'No specific recommendations at this time. Continue with regular health maintenance.'
  },
  {
    id: '2',
    name: 'Comprehensive Metabolic Panel',
    date: '2023-07-05',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    description: 'A blood test that measures your sugar (glucose) level, electrolyte and fluid balance, kidney function, and liver function.',
    collectionDate: '2023-07-04',
    resultDate: '2023-07-05',
    orderNumber: 'LAB12346',
    results: [
      { name: 'Glucose', value: '102', unit: 'mg/dL', range: '70-99', status: 'high', description: 'Blood sugar level' },
      { name: 'BUN', value: '16', unit: 'mg/dL', range: '7-20', status: 'normal', description: 'Blood urea nitrogen, kidney function test' },
      { name: 'Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6-1.2', status: 'normal', description: 'Kidney function test' },
      { name: 'Sodium', value: '138', unit: 'mmol/L', range: '136-145', status: 'normal', description: 'Electrolyte important for nerve and muscle function' },
      { name: 'Potassium', value: '4.1', unit: 'mmol/L', range: '3.5-5.1', status: 'normal', description: 'Electrolyte important for heart function' },
      { name: 'Chloride', value: '102', unit: 'mmol/L', range: '98-107', status: 'normal', description: 'Electrolyte that helps maintain fluid balance' },
      { name: 'CO2', value: '24', unit: 'mmol/L', range: '23-29', status: 'normal', description: 'Measures bicarbonate, related to acid/base balance' },
      { name: 'Calcium', value: '9.5', unit: 'mg/dL', range: '8.5-10.2', status: 'normal', description: 'Mineral important for bones and muscle function' },
      { name: 'Protein', value: '7.0', unit: 'g/dL', range: '6.0-8.3', status: 'normal', description: 'Total amount of protein in blood' },
      { name: 'Albumin', value: '4.2', unit: 'g/dL', range: '3.5-5.0', status: 'normal', description: 'Major protein in blood' },
      { name: 'Bilirubin', value: '0.7', unit: 'mg/dL', range: '0.1-1.2', status: 'normal', description: 'Substance formed during breakdown of red blood cells' },
      { name: 'Alkaline Phosphatase', value: '75', unit: 'U/L', range: '44-147', status: 'normal', description: 'Enzyme found in liver and bone' },
      { name: 'AST', value: '22', unit: 'U/L', range: '8-48', status: 'normal', description: 'Liver enzyme' },
      { name: 'ALT', value: '25', unit: 'U/L', range: '7-55', status: 'normal', description: 'Liver enzyme' }
    ],
    notes: 'Slightly elevated fasting glucose level. All other results within normal limits.',
    recommendations: 'Consider follow-up with your physician regarding elevated glucose level. Dietary modifications and regular exercise are recommended.'
  },
  {
    id: '3',
    name: 'Lipid Panel',
    date: '2023-06-15',
    provider: 'Dr. Michael Chen',
    facility: 'HealthFirst Diagnostics',
    status: 'completed',
    description: 'A blood test that measures lipids—fats and fatty substances used as a source of energy in your body.',
    collectionDate: '2023-06-14',
    resultDate: '2023-06-15',
    orderNumber: 'LAB12347',
    results: [
      { name: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'high', description: 'Measure of all cholesterol in your blood' },
      { name: 'HDL', value: '45', unit: 'mg/dL', range: '>40', status: 'normal', description: 'Good cholesterol, helps remove LDL from arteries' },
      { name: 'LDL', value: '135', unit: 'mg/dL', range: '<100', status: 'high', description: 'Bad cholesterol, contributes to plaque buildup in arteries' },
      { name: 'Triglycerides', value: '150', unit: 'mg/dL', range: '<150', status: 'normal', description: 'Type of fat found in your blood' },
      { name: 'Cholesterol/HDL Ratio', value: '4.7', unit: '', range: '<5.0', status: 'normal', description: 'Ratio of total cholesterol to HDL' }
    ],
    notes: 'Elevated total cholesterol and LDL cholesterol. HDL cholesterol and triglycerides are within normal limits.',
    recommendations: 'Lifestyle modifications including diet changes, regular exercise, and weight management are recommended. Consider follow-up with your physician for possible medication if lifestyle changes do not sufficiently improve lipid profile.'
  },
  {
    id: '4',
    name: 'Thyroid Function Tests',
    date: '2023-05-20',
    provider: 'Dr. Emily Roberts',
    facility: 'MedCenter Labs',
    status: 'completed',
    description: 'Blood tests that check how well your thyroid gland is functioning.',
    collectionDate: '2023-05-19',
    resultDate: '2023-05-20',
    orderNumber: 'LAB12348',
    results: [
      { name: 'TSH', value: '2.5', unit: 'mIU/L', range: '0.4-4.0', status: 'normal', description: 'Thyroid stimulating hormone, signals thyroid to produce hormones' },
      { name: 'Free T4', value: '1.2', unit: 'ng/dL', range: '0.8-1.8', status: 'normal', description: 'Thyroxine, main hormone produced by thyroid' },
      { name: 'Free T3', value: '3.1', unit: 'pg/mL', range: '2.3-4.2', status: 'normal', description: 'Triiodothyronine, active thyroid hormone' }
    ],
    notes: 'Thyroid function is within normal limits.',
    recommendations: 'No specific recommendations at this time. Continue with regular health maintenance.'
  },
  {
    id: '5',
    name: 'Urinalysis',
    date: '2023-04-10',
    provider: 'Dr. Sarah Johnson',
    facility: 'MedCenter Labs',
    status: 'completed',
    description: 'A test of your urine that is used to detect and manage a wide range of disorders.',
    collectionDate: '2023-04-10',
    resultDate: '2023-04-10',
    orderNumber: 'LAB12349',
    results: [
      { name: 'Color', value: 'Yellow', unit: '', range: 'Clear to Yellow', status: 'normal', description: 'Visual appearance of urine' },
      { name: 'Clarity', value: 'Clear', unit: '', range: 'Clear', status: 'normal', description: 'Visual appearance of urine' },
      { name: 'pH', value: '6.0', unit: '', range: '4.5-8.0', status: 'normal', description: 'Acidity or alkalinity of urine' },
      { name: 'Specific Gravity', value: '1.020', unit: '', range: '1.005-1.030', status: 'normal', description: 'Concentration of particles in urine' },
      { name: 'Glucose', value: 'Negative', unit: '', range: 'Negative', status: 'normal', description: 'Sugar in urine' },
      { name: 'Protein', value: 'Trace', unit: '', range: 'Negative', status: 'abnormal', description: 'Protein in urine' },
      { name: 'WBC', value: '2-5', unit: '/HPF', range: '0-5', status: 'normal', description: 'White blood cells in urine' },
      { name: 'RBC', value: '0-2', unit: '/HPF', range: '0-2', status: 'normal', description: 'Red blood cells in urine' },
      { name: 'Epithelial Cells', value: 'Few', unit: '', range: 'Few', status: 'normal', description: 'Cells from the lining of the urinary tract' },
      { name: 'Bacteria', value: 'None', unit: '', range: 'None', status: 'normal', description: 'Bacteria in urine' },
      { name: 'Crystals', value: 'None', unit: '', range: 'None to Few', status: 'normal', description: 'Crystallized minerals in urine' }
    ],
    notes: 'Trace protein detected in the urine. All other parameters are within normal limits.',
    recommendations: 'Consider follow-up urinalysis to monitor protein levels. Ensure adequate hydration and follow up with your physician if protein persists in subsequent tests.'
  },
  {
    id: '6',
    name: 'Vitamin D, 25-Hydroxy',
    date: '2023-07-20',
    provider: 'Dr. Michael Chen',
    facility: 'HealthFirst Diagnostics',
    status: 'pending',
    description: 'A blood test that measures the amount of vitamin D in your body.',
    collectionDate: '2023-07-20',
    resultDate: '',
    orderNumber: 'LAB12350',
    results: [],
    notes: '',
    recommendations: ''
  }
];

export default function LabTestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const test = labTests.find(t => t.id === id);
  
  if (!test) {
    return notFound();
  }
  
  // Count normal, abnormal results
  const normalCount = test.results.filter(r => r.status === 'normal').length;
  const abnormalCount = test.results.filter(r => r.status !== 'normal').length;
  
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/patient/lab-tests"
            className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 mb-3"
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Lab Results
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{test.name}</h1>
              <p className="text-gray-600 mt-1">
                {new Date(test.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {test.status === 'completed' ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5"></span>
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                Pending
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-medium text-gray-900 mb-2">Ordered By</h3>
              <p className="text-gray-800">{test.provider}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-medium text-gray-900 mb-2">Facility</h3>
              <p className="text-gray-800">{test.facility}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-medium text-gray-900 mb-2">Order Number</h3>
              <p className="text-gray-800">{test.orderNumber}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardHeader className="bg-white px-6 py-4 border-b border-gray-200">
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{test.description}</p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Collection Date</h3>
                    <p className="text-gray-700">
                      {test.collectionDate 
                        ? new Date(test.collectionDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Result Date</h3>
                    <p className="text-gray-700">
                      {test.resultDate 
                        ? new Date(test.resultDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Pending'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {test.status === 'completed' && test.results.length > 0 ? (
          <>
            <Card className="border border-gray-200 shadow-sm mb-8">
              <CardHeader className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle>Results</CardTitle>
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2 py-1 mr-2 rounded text-xs font-medium bg-teal-100 text-teal-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-1.5"></span>
                      {normalCount} Normal
                    </span>
                    {abnormalCount > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                        {abnormalCount} Abnormal
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Standard Range
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {test.results.map((result, index) => (
                        <tr key={index} className={cn(index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{result.name}</div>
                            {result.description && (
                              <div className="text-xs text-gray-500 mt-1">{result.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.value} {result.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.range}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span 
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                result.status === 'normal' 
                                  ? "bg-teal-100 text-teal-800" 
                                  : result.status === 'high' || result.status === 'low' || result.status === 'abnormal'
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                              )}
                            >
                              {result.status === 'normal' 
                                ? 'Normal' 
                                : result.status === 'high' 
                                  ? 'High' 
                                  : result.status === 'low' 
                                    ? 'Low'
                                    : 'Abnormal'
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            {(test.notes || test.recommendations) && (
              <Card className="border border-gray-200 shadow-sm mb-8">
                <CardHeader className="bg-white px-6 py-4 border-b border-gray-200">
                  <CardTitle>Notes & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {test.notes && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                      <p className="text-gray-700">{test.notes}</p>
                    </div>
                  )}
                  {test.recommendations && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                      <p className="text-gray-700">{test.recommendations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            <div className="flex justify-between mt-8">
              <button
                className="inline-flex items-center rounded-md text-sm px-4 py-2.5 font-medium border border-teal-300 bg-white text-teal-700 hover:bg-teal-50 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Results
              </button>
              <button
                className="inline-flex items-center rounded-md text-sm px-4 py-2.5 font-medium border border-teal-300 bg-white text-teal-700 hover:bg-teal-50 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share Results
              </button>
            </div>
          </>
        ) : (
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-5">
            <div className="flex">
              <svg className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <h3 className="text-base font-medium text-amber-800 mb-1">Results Pending</h3>
                <p className="text-sm text-amber-700">
                  This test was ordered on {new Date(test.collectionDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}. Results are typically available within 1-3 business days. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
} 