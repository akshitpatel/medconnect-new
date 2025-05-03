import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '../../../../utils/auth';

// This is a proxy API route that forwards requests to the backend
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('timeRange') || 'This Week';
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const apiUrl = `${backendUrl}/api/v1/admin/dashboard/user-engagement?timeRange=${timeRange}`;
  
  try {
    // Get auth token from utility function - now synchronous and returns properly formatted JWT
    const token = getAuthToken();
    
    if (!token) {
      console.warn('No authentication token found. Request may fail if authentication is required.');
    }
    
    console.log(`Proxying user engagement request to: ${apiUrl} with token: ${token ? 'Bearer ' + token.substring(0, 10) + '...' : 'none'}`);
    
    // Set timeout for the fetch request to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        console.error(`Backend API error (${response.status}):`, errorText);
        throw new Error(`Backend API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error proxying user engagement request to backend:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch data from backend', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
