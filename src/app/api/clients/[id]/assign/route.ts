import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../../utils/auth.utils';
import { DatabaseUtils } from '../../../../utils/db.utils';
import { UserRole } from '../../../../../generated/prisma';

// PUT - Update client assignments
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id);
    const { userIds } = await request.json();

    // Check authentication
    const currentUser = await AuthUtils.getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    if (!AuthUtils.hasPermission(currentUser.role, UserRole.ADMIN)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Update assignments
    await DatabaseUtils.assignUsersToClient(clientId, userIds);

    // Get updated assignments
    const assignedUsers = await DatabaseUtils.getClientAssignedUsers(clientId);

    return NextResponse.json({
      success: true,
      assignedUsers,
    });

  } catch (error) {
    console.error('Error updating client assignments:', error);
    return NextResponse.json(
      { error: 'Failed to update assignments' },
      { status: 500 }
    );
  }
}