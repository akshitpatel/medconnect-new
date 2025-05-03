import { NextRequest, NextResponse } from 'next/server';

/**
 * Analytics logging endpoint that doesn't require MongoDB
 * This mock implementation just logs events to the console
 * In production, this would send data to a proper analytics service
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log the received data for debugging
    console.log('Analytics log received:', JSON.stringify(data));
    
    // Validate required fields
    if (!data.action) {
      return NextResponse.json(
        { error: 'Action field is required' },
        { status: 400 }
      );
    }
    
    // Add timestamp if not provided
    if (!data.data?.timestamp) {
      data.data = {
        ...data.data,
        timestamp: new Date().toISOString()
      };
    }
    
    // Add client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    
    // Add user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    // Add referrer if available
    const referrer = request.headers.get('referer') || undefined;
    
    // Extract resolution from UA if possible (simplified)
    let deviceInfo = {
      deviceType: 'unknown',
      browser: 'unknown',
      platform: 'unknown'
    };
    
    if (userAgent) {
      if (userAgent.includes('Mobile')) deviceInfo.deviceType = 'mobile';
      else if (userAgent.includes('Tablet')) deviceInfo.deviceType = 'tablet';
      else deviceInfo.deviceType = 'desktop';
      
      if (userAgent.includes('Chrome')) deviceInfo.browser = 'Chrome';
      else if (userAgent.includes('Firefox')) deviceInfo.browser = 'Firefox';
      else if (userAgent.includes('Safari')) deviceInfo.browser = 'Safari';
      else if (userAgent.includes('Edge')) deviceInfo.browser = 'Edge';
      
      if (userAgent.includes('Windows')) deviceInfo.platform = 'Windows';
      else if (userAgent.includes('Mac')) deviceInfo.platform = 'Mac';
      else if (userAgent.includes('Linux')) deviceInfo.platform = 'Linux';
      else if (userAgent.includes('Android')) deviceInfo.platform = 'Android';
      else if (userAgent.includes('iOS')) deviceInfo.platform = 'iOS';
    }
    
    // Create analytics entry
    const analyticsEntry = {
      action: data.action,
      data: data.data || {},
      clientIp,
      userAgent,
      referrer,
      deviceInfo,
      createdAt: new Date()
    };
    
    // In a real application, this would be sent to a database or analytics service
    // For now, we'll just log it to the console
    console.log('ANALYTICS EVENT:', JSON.stringify(analyticsEntry, null, 2));
    
    // Option 1: Send to backend API if available
    try {
      // This would be implemented in production to forward to the Rails backend
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/log`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsEntry)
      // });
      
      // Option 2: In the future, this could use a third-party analytics service
      // await sendToAnalyticsService(analyticsEntry);
    } catch (apiError) {
      console.warn('Failed to forward analytics to backend:', apiError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Analytics event logged'
    });
  } catch (error: any) {
    console.error('Error logging analytics:', error);
    return NextResponse.json(
      { error: 'Failed to log analytics', details: error.message },
      { status: 500 }
    );
  }
}
 