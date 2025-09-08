// api/users/smm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../utils/auth.utils';
import { DatabaseUtils } from '../../../utils/db.utils';
import { UserRole } from '../../../../generated/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await AuthUtils.getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions - only ADMIN and SUPER_ADMIN can view SMM users for assignment
    if (!AuthUtils.hasPermission(currentUser.role, UserRole.ADMIN)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get all SMM users using the method from DatabaseUtils
    const users = await DatabaseUtils.getAllSMMUsers();

    return NextResponse.json({
      success: true,
      users,
    });

  } catch (error) {
    console.error('Error getting SMM users:', error);
    return NextResponse.json(
      { error: 'Failed to get SMM users' },
      { status: 500 }
    );
  }
}