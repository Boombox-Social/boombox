// utils/db.utils.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class DatabaseUtils {
  static async seedSuperAdmin() {
    const email = 'admin@boombox.com';
    const plainPassword = 'SuperAdmin123!';

    // Check if super admin already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log('⚠️ Super admin already exists');
      return user;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create super admin
    user = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        lastLogin: new Date(),
      },
    });

    console.log('✅ Super admin created:', user.email);
    return user;
  }
}
