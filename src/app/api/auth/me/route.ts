// api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../utils/auth.utils';
import { DatabaseUtils } from '../../../utils/db.utils';

export async function GET(request: NextRequest) {
  try {
    // Try multiple ways to get the token to handle different scenarios
    let token = request.cookies.get('auth-token')?.value;
    
    // If no cookie, try Authorization header (for localStorage-based auth)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Verify token
    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid token' 
        },
        { status: 401 }
      );
    }

    // Get user data
    const user = await DatabaseUtils.findUserById(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User not found or inactive' 
        },
        { status: 401 }
      );
    }

    // Get user stats
    const stats = await DatabaseUtils.getUserStats(user.id, user.role);

    return NextResponse.json({
      success: true,
      user,
      stats
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get user profile' 
      },
      { status: 500 }
    );
  }
}