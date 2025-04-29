import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use a proper environment variable

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    // Mock user data - in a real app, this would be stored in a database
    const mockProviders = [
      {
        _id: '1',
        email: 'test@provider.com',
        passwordHash: '$2a$10$X7VYFDeMB7FB1Mh0vC99v.cAEGAVVUBhJPC5eErU5IMw9H8w5M7jO', // bcrypt hash for 'password123'
        firstName: 'Test',
        lastName: 'Provider',
        specialization: 'General Medicine',
        licenseNumber: '12345',
        phone: '555-1234',
        status: 'active',
        type: 'doctor',
        name: 'Test Provider'
      }
    ];
    
    // Find the provider by email
    const provider = mockProviders.find(p => p.email === email);
    
    if (!provider) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, provider.passwordHash || '');
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: provider._id,
        email: provider.email,
        type: provider.type,
        name: provider.name
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Return success response with token and public provider data
    return NextResponse.json({
      token,
      provider: {
        _id: provider._id,
        email: provider.email,
        firstName: provider.firstName,
        lastName: provider.lastName,
        specialization: provider.specialization,
        licenseNumber: provider.licenseNumber,
        phone: provider.phone,
        status: provider.status,
        type: provider.type,
        name: provider.name
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}