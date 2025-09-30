import { NextRequest, NextResponse } from 'next/server';
import { AuthUtils } from '../../../../utils/auth.utils';
import { DatabaseUtils } from '../../../../utils/db.utils';
import { UserRole } from '../../../../../generated/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params in Next.js 15
    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get current user
    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const currentUser = await DatabaseUtils.findUserById(payload.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Check permissions - only SUPER_ADMIN can delete users
    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Only Super Admins can delete users' },
        { status: 403 }
      );
    }

    // Check if trying to delete self
    if (currentUser.id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get the user to be deleted
    const userToDelete = await DatabaseUtils.findUserById(userId);
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete the user
    await DatabaseUtils.deleteUser(userId);

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: userToDelete.id,
        name: userToDelete.name,
        email: userToDelete.email
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// Add POST for editing user (editusermodal.tsx expects: name, email, role, avatar, isActive, password)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get current user
    const payload = AuthUtils.parseJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const currentUser = await DatabaseUtils.findUserById(payload.userId);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN or ADMIN can edit users (but only SUPER_ADMIN can edit other SUPER_ADMINs)
    const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;

    // Get the user to be edited
    const userToEdit = await DatabaseUtils.findUserById(userId);
    if (!userToEdit) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only SUPER_ADMIN can edit another SUPER_ADMIN
    if (
      userToEdit.role === UserRole.SUPER_ADMIN &&
      !isSuperAdmin
    ) {
      return NextResponse.json(
        { error: 'Only Super Admins can edit Super Admin accounts' },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { name, email, role, avatar, isActive, password } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // If password is provided, validate length
    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Only SUPER_ADMIN can set role to SUPER_ADMIN
    if (role === UserRole.SUPER_ADMIN && !isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only Super Admins can assign Super Admin role' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || userToEdit.role,
      avatar: avatar?.trim() || null,
      isActive: typeof isActive === "boolean" ? isActive : userToEdit.isActive,
    };

    if (password) {
      updateData.password = password;
    }

    // Update user (DatabaseUtils.updateUser will hash password if present)
    const updatedUser = await DatabaseUtils.updateUser(userId, updateData);

    // Remove password from response
    const { password: _pw, ...userResponse } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse,
    });

  } catch (error) {
    console.error('Edit user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}