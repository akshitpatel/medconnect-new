import { NextRequest, NextResponse } from 'next/server';

// Get system configuration
export async function GET(request: NextRequest) {
  try {
    // In a real app, this would fetch config from a database
    // For demo purposes, return mock configuration data
    return NextResponse.json({
      config: {
        systemSettings: {
          maintenanceMode: false,
          registrationEnabled: true
        },
        featureFlags: {
          aiDiagnosis: true,
          telemedicine: true,
          healthPassport: true
        }
      }
    });
  } catch (error) {
    console.error('Admin config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update system configuration
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // In a real app, this would update config in database
    // For demo, just return success
    return NextResponse.json({ message: 'Configuration updated successfully', updatedConfig: data });
  } catch (error) {
    console.error('Admin config update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}