import { NextRequest, NextResponse } from 'next/server';

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * API Route for handling login requests
 * Acts as a proxy to the backend authentication API
 */
export async function POST(request: NextRequest) {
  try {
    // Get login credentials from request body
    const body = await request.json();
    
    console.log('Login API route called with:', { email: body.email });
    
    // Call the backend API to authenticate
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: body }),
    });
    
    // Get the response data
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Backend login failed:', data);
      return NextResponse.json(
        { error: data.error || 'Authentication failed' },
        { status: response.status }
      );
    }
    
    // Parse different response formats from the backend
    let token = null;
    let userData = null;
    
    if (data.success && data.data?.token) {
      token = data.data.token;
      userData = data.data.user;
    } else if (data.token) {
      token = data.token;
      userData = data.user;
    } else if (data.authentication_token) {
      token = data.authentication_token;
      userData = data.user || data;
    } else if (data.jwt) {
      token = data.jwt;
      userData = data.user;
    }
    
    if (!token) {
      console.error('No token found in response:', data);
      return NextResponse.json(
        { error: 'Invalid authentication response from server' },
        { status: 500 }
      );
    }
    
    // Return the token and user data
    return NextResponse.json({
      token,
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred during authentication' },
      { status: 500 }
    );
  }
}
