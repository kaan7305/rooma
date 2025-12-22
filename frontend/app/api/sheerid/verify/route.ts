import { NextRequest, NextResponse } from 'next/server';

// SheerID API Configuration
// To use SheerID, you need to:
// 1. Sign up at https://www.sheerid.com/
// 2. Get your API credentials (Program ID, Access Token)
// 3. Add them to your .env.local file:
//    SHEERID_PROGRAM_ID=your_program_id
//    SHEERID_ACCESS_TOKEN=your_access_token
//    SHEERID_BASE_URL=https://services.sheerid.com/rest/v2

const SHEERID_CONFIG = {
  baseUrl: process.env.SHEERID_BASE_URL || 'https://services.sheerid.com/rest/v2',
  programId: process.env.SHEERID_PROGRAM_ID || '',
  accessToken: process.env.SHEERID_ACCESS_TOKEN || '',
};

interface SheerIDVerificationRequest {
  firstName: string;
  lastName: string;
  email: string;
  universityName: string;
  organization: string;
}

interface SheerIDVerificationResponse {
  verificationId: string;
  status: 'pending' | 'complete' | 'rejected';
  token?: string;
  currentStep?: string;
  metadata?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: SheerIDVerificationRequest = await request.json();
    const { firstName, lastName, email, universityName, organization } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !organization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if SheerID is configured
    if (!SHEERID_CONFIG.programId || !SHEERID_CONFIG.accessToken) {
      console.warn('SheerID not configured. Using mock verification for development.');

      // Mock verification for development/testing
      // In production, this should return an error
      const mockResponse: SheerIDVerificationResponse = {
        verificationId: `mock-${Date.now()}`,
        status: 'complete',
        token: `mock-token-${Date.now()}`,
        metadata: {
          organization: organization,
          email: email,
        },
      };

      return NextResponse.json(mockResponse);
    }

    // SheerID API Request
    // Step 1: Create verification request
    const verificationPayload = {
      programId: SHEERID_CONFIG.programId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      organization: {
        name: organization,
      },
      metadata: {
        universityName: universityName,
      },
    };

    const verificationResponse = await fetch(
      `${SHEERID_CONFIG.baseUrl}/verification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SHEERID_CONFIG.accessToken}`,
        },
        body: JSON.stringify(verificationPayload),
      }
    );

    if (!verificationResponse.ok) {
      const errorData = await verificationResponse.json();
      console.error('SheerID verification failed:', errorData);

      return NextResponse.json(
        {
          error: 'SheerID verification failed',
          details: errorData,
        },
        { status: verificationResponse.status }
      );
    }

    const verificationData = await verificationResponse.json();

    // Step 2: Check verification status
    const statusResponse = await fetch(
      `${SHEERID_CONFIG.baseUrl}/verification/${verificationData.verificationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SHEERID_CONFIG.accessToken}`,
        },
      }
    );

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      console.error('SheerID status check failed:', errorData);

      return NextResponse.json(
        {
          error: 'SheerID status check failed',
          details: errorData,
        },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();

    // Transform SheerID response to our format
    const response: SheerIDVerificationResponse = {
      verificationId: statusData.verificationId,
      status: statusData.currentStatus === 'complete' ? 'complete' :
              statusData.currentStatus === 'rejected' ? 'rejected' : 'pending',
      token: statusData.verificationToken,
      currentStep: statusData.currentStep,
      metadata: statusData.metadata,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('SheerID verification error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check verification status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verificationId = searchParams.get('verificationId');

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID is required' },
        { status: 400 }
      );
    }

    // Check if SheerID is configured
    if (!SHEERID_CONFIG.programId || !SHEERID_CONFIG.accessToken) {
      console.warn('SheerID not configured. Using mock verification for development.');

      // Mock response
      const mockResponse: SheerIDVerificationResponse = {
        verificationId: verificationId,
        status: 'complete',
        token: `mock-token-${Date.now()}`,
      };

      return NextResponse.json(mockResponse);
    }

    // Check verification status with SheerID
    const statusResponse = await fetch(
      `${SHEERID_CONFIG.baseUrl}/verification/${verificationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SHEERID_CONFIG.accessToken}`,
        },
      }
    );

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      console.error('SheerID status check failed:', errorData);

      return NextResponse.json(
        {
          error: 'SheerID status check failed',
          details: errorData,
        },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();

    // Transform response
    const response: SheerIDVerificationResponse = {
      verificationId: statusData.verificationId,
      status: statusData.currentStatus === 'complete' ? 'complete' :
              statusData.currentStatus === 'rejected' ? 'rejected' : 'pending',
      token: statusData.verificationToken,
      currentStep: statusData.currentStep,
      metadata: statusData.metadata,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('SheerID status check error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
