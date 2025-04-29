import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      specialization,
      licenseNumber,
      phone,
      type = 'doctor'
    } = await req.json();
    
    // Basic validation
    if (!email || !password || !firstName || !lastName || !specialization || !licenseNumber) {
      return NextResponse.json({ error: 'All required fields must be provided' }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    
    // Mock checking if user already exists - in a real app, this would check the database
    const mockExistingEmails = ['test@provider.com'];
    if (mockExistingEmails.includes(email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    // In a real app, we would hash the password and store the provider in the database
    // For demo purposes, we'll just return a success message
    return NextResponse.json({
      message: 'Provider registered successfully',
      provider: {
        email,
        firstName,
        lastName,
        specialization,
        licenseNumber,
        phone,
        type,
        name: `${firstName} ${lastName}`
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}