import { NextRequest, NextResponse } from 'next/server';
import { DatabaseUtils } from '../../../utils/db.utils';
import { UserRole } from '../../../../generated/prisma';
import { prisma } from '../../../lib/prisma'; // Add this missing import

export async function POST(request: NextRequest) {
  try {
    // Check if any super admin exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN }
    });

    if (existingSuperAdmin) {
      return NextResponse.json(
        { message: 'Super admin already exists' },
        { status: 409 }
      );
    }

    // Create initial super admin
    const superAdmin = await DatabaseUtils.createUser({
      email: 'superadmin@boombox.com',
      name: 'Super Administrator',
      password: 'SuperAdmin123!',
      role: UserRole.SUPER_ADMIN
    });

    return NextResponse.json({
      message: 'Initial super admin created successfully',
      user: superAdmin
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to create initial super admin' },
      { status: 500 }
    );
  }
}