'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Logo from '../../components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to send a password reset email
      console.log('Requesting password reset for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setMessage({ 
        type: 'success', 
        text: 'If an account exists with this email, we\'ve sent password reset instructions.' 
      });
      setSubmitted(true);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">Reset your password</h2>
          <p className="text-gray-600">We'll send you instructions to reset your password</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {message.text && (
            <div className={`mb-4 p-4 rounded border-l-4 ${
              message.type === 'error' 
                ? 'bg-red-50 border-red-500 text-red-700' 
                : 'bg-green-50 border-green-500 text-green-700'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}
          
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="input-field pl-10"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We'll send a password reset link to this email address
                </p>
              </div>
              
              <button
                type="submit"
                className={`w-full btn-primary py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-700 mb-4">
                Check your email for instructions to reset your password. 
                If you don't see it in your inbox, check your spam folder.
              </p>
              <button
                onClick={() => {
                  setEmail('');
                  setSubmitted(false);
                  setMessage({ type: '', text: '' });
                }}
                className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center"
              >
                <FaEnvelope className="mr-2" />
                Resend email
              </button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              href="/auth/login"
              className="text-teal-600 hover:text-teal-800 font-medium inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 