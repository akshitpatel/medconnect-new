'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call to request password reset
      console.log('Password reset requested for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSubmitted(true);
    } catch (err) {
      setError('There was an error processing your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-800">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-neutral-300 rounded-md"
                    placeholder="doctor@example.com"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="text-alert-red text-sm mt-2">
                  {error}
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/provider/auth/signin" 
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <FaArrowLeft className="mr-2 h-3 w-3" />
                  Back to sign in
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-success-green bg-opacity-10 border border-success-green border-opacity-30 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCheck className="h-5 w-5 text-success-green" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-success-green">Email sent</h3>
                    <div className="mt-2 text-sm text-success-green text-opacity-80">
                      <p>
                        If an account exists with the email {email}, you will receive a password reset link shortly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-neutral-600">
                Please check your email inbox and follow the instructions in the email to reset your password. 
                The link will expire in 30 minutes for security reasons.
              </p>
              
              <div className="text-center">
                <Link 
                  href="/provider/auth/signin" 
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <FaArrowLeft className="mr-2 h-3 w-3" />
                  Back to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 