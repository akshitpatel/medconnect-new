import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header from request
    const authorization = request.headers.get('Authorization');
    
    if (!authorization) {
      return NextResponse.json({
        success: false,
        message: 'Authorization header missing'
      }, { status: 401 });
    }
    
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      data: data.data || {},
      message: data.message || 'Failed to fetch user data'
    }, { status: response.status });
    
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching user data'
    }, { status: 500 });
  }
} 