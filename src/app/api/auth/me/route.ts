// api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../utils/auth.utils';
import { DatabaseUtils } from '../../../utils/db.utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user data
    const user = await DatabaseUtils.findUserById(payload.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Get user stats - THIS SHOULD NOW WORK
    const stats = await DatabaseUtils.getUserStats(user.id, user.role);

    return NextResponse.json({
      success: true,
      user,
      stats
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}