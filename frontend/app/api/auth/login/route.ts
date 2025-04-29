import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // If login successful, get JWT token from response headers
    let token = '';
    if (response.headers.get('Authorization')) {
      token = response.headers.get('Authorization')!.split(' ')[1];
    }
    
    // Return response with token
    return NextResponse.json({
      success: response.ok,
      data: {
        token,
        user: data.data?.user || {},
      },
      message: data.message || 'Login failed'
    }, { status: response.status });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during login'
    }, { status: 500 });
  }
} 