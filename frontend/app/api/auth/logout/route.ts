import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    // Get Authorization header from request
    const authorization = request.headers.get('Authorization');
    
    if (!authorization) {
      return NextResponse.json({
        success: false,
        message: 'Authorization header missing'
      }, { status: 401 });
    }
    
    const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'DELETE',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during logout'
    }, { status: 500 });
  }
} 