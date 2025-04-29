'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PatientLayout from '@/app/components/layout/PatientLayout';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/app/components/ui/Card';

export default function RefillRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prescriptionId = searchParams.get('id');
  
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>(
    prescriptionId ? [parseInt(prescriptionId)] : []
  );
  const [preferredPharmacy, setPreferredPharmacy] = useState('MedPlus Pharmacy');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Sample data
  const availablePrescriptions = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      refillsRemaining: 2,
      prescribedBy: 'Dr. John Doe',
    },
    {
      id: 2,
      name: 'Atorvastatin',
      dosage: '20mg',
      refillsRemaining: 3,
      prescribedBy: 'Dr. John Doe',
    },
    {
      id: 3,
      name: 'Metformin',
      dosage: '500mg',
      refillsRemaining: 1,
      prescribedBy: 'Dr. Jane Smith',
    },
  ];

  const pharmacies = [
    'MedPlus Pharmacy',
    'HealthCare Pharmacy',
    'Community Drugs',
    'City Pharmacy'
  ];

  const handlePrescriptionToggle = (id: number) => {
    setSelectedPrescriptions(prev => 
      prev.includes(id) 
        ? prev.filter(prescId => prescId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
    }, 1500);
  };

  if (hasSubmitted) {
    return (
      <PatientLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Refill Request Submitted</h2>
                <p className="text-gray-600 mt-1">
                  Your refill request has been sent successfully. You will be notified when it's ready for pickup or delivery.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Medications: </span>
                    {selectedPrescriptions.map(id => {
                      const prescription = availablePrescriptions.find(p => p.id === id);
                      return prescription ? `${prescription.name} ${prescription.dosage}` : '';
                    }).join(', ')}
                  </p>
                  <p><span className="font-medium">Pharmacy: </span>{preferredPharmacy}</p>
                  <p>
                    <span className="font-medium">Method: </span>
                    {deliveryMethod === 'pickup' ? 'Pickup at pharmacy' : 'Home delivery'}
                  </p>
                  {additionalNotes && (
                    <p><span className="font-medium">Notes: </span>{additionalNotes}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Link 
                  href="/patient/prescriptions"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  Return to Prescriptions
                </Link>
                <Link 
                  href="/patient/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Go to Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Request Prescription Refill</h1>
          <p className="text-gray-600 mt-1">Select the prescriptions you need refilled and specify your preferences.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Prescription Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Medications</CardTitle>
                <CardDescription>Choose the prescriptions you need refilled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availablePrescriptions.map(prescription => (
                    <div 
                      key={prescription.id}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`prescription-${prescription.id}`}
                        checked={selectedPrescriptions.includes(prescription.id)}
                        onChange={() => handlePrescriptionToggle(prescription.id)}
                        className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label 
                        htmlFor={`prescription-${prescription.id}`}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{prescription.name}</span>
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {prescription.dosage}
                          </span>
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {prescription.refillsRemaining} refills left
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Prescribed by {prescription.prescribedBy}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pharmacy Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Information</CardTitle>
                <CardDescription>Choose your preferred pharmacy and delivery method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pharmacy" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Pharmacy
                    </label>
                    <select
                      id="pharmacy"
                      value={preferredPharmacy}
                      onChange={(e) => setPreferredPharmacy(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    >
                      {pharmacies.map(pharmacy => (
                        <option key={pharmacy} value={pharmacy}>{pharmacy}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Method
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="pickup"
                          name="deliveryMethod"
                          type="radio"
                          checked={deliveryMethod === 'pickup'}
                          onChange={() => setDeliveryMethod('pickup')}
                          className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <label htmlFor="pickup" className="ml-3 block text-sm font-medium text-gray-700">
                          Pickup at pharmacy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="delivery"
                          name="deliveryMethod"
                          type="radio"
                          checked={deliveryMethod === 'delivery'}
                          onChange={() => setDeliveryMethod('delivery')}
                          className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <label htmlFor="delivery" className="ml-3 block text-sm font-medium text-gray-700">
                          Home delivery
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Provide any special instructions or notes</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  id="notes"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any special instructions for your prescription refill..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </CardContent>
            </Card>
            
            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/patient/prescriptions"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={selectedPrescriptions.length === 0 || isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit Refill Request'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PatientLayout>
  );
} 