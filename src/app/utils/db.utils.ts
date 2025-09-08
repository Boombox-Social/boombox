// utils/db.utils.ts
import { PrismaClient, UserRole } from '../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class DatabaseUtils {
  // User management
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar?: string;
  }) {
    try {
      // ENHANCED: Hash the password with stronger settings
      const saltRounds = 12; // Increased from 10 for better security
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      
      const user = await prisma.user.create({
        data: {
          ...data,
          email: data.email.toLowerCase(), // Normalize email
          password: hashedPassword,
          isActive: true, // Default to active
          lastLogin: new Date(),
        },
      });

      // Log successful creation (without password)
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ User created successfully:', {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }

      return user;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  }

  static async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findUserById(id: number) {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async updateUser(id: number, data: Record<string, unknown>) {
    try {
      // ENHANCED: Hash password if it's being updated
      if (data.password && typeof data.password === 'string') {
        const saltRounds = 12;
        data.password = await bcrypt.hash(data.password, saltRounds);
      }
      
      // Normalize email if provided
      if (data.email && typeof data.email === 'string') {
        data.email = data.email.toLowerCase();
      }
      
      return await prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: number) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          // SECURITY: Never select password field
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Enhanced getUserStats method
  static async getUserStats(userId: number, role: UserRole) {
    try {
      if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
        // Admin users can see all stats
        const [totalClients, totalUsers, recentClients] = await Promise.all([
          prisma.client.count(),
          prisma.user.count(),
          prisma.client.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          }),
        ]);

        return {
          totalClients,
          totalUsers,
          assignedClients: totalClients,
          recentClients,
        };
      } else {
        // SMM users can only see their assigned clients
        const [assignedClients, recentClients] = await Promise.all([
          prisma.client.count({
            where: {
              OR: [
                { assignedUserId: userId },
                { createdById: userId },
              ],
            },
          }),
          prisma.client.findMany({
            where: {
              OR: [
                { assignedUserId: userId },
                { createdById: userId },
              ],
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          }),
        ]);

        return {
          assignedClients,
          recentClients,
          totalClients: assignedClients, // For SMM, total = assigned
        };
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalClients: 0,
        totalUsers: 0,
        assignedClients: 0,
        recentClients: [],
      };
    }
  }

  // Client management methods...
  static async createClient(data: {
    name: string;
    logo?: string | null;
    address?: string | null;
    industry?: string | null;
    slogan?: string | null;
    links?: string[];
    coreProducts?: string[];
    idealCustomers?: string | null;
    brandEmotion?: string | null;
    uniqueProposition?: string | null;
    whyChooseUs?: string | null;
    mainGoal?: string | null;
    shortTermGoal?: string | null;
    longTermGoal?: string | null;
    competitors?: string[];
    indirectCompetitors?: string[];
    brandAssets?: string[];
    fontUsed?: string[];
    smmDriveLink?: string | null;
    contractDeliverables?: string | null;
    assignedUserId?: number | null;
    createdById: number;
  }) {
    try {
      return await prisma.client.create({
        data: {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  static async getClientsByUser(user: { id: number; role: UserRole }) {
    try {
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
        // Admin users can see all clients
        return await prisma.client.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // SMM users can only see their assigned clients
        return await prisma.client.findMany({
          where: {
            OR: [
              { assignedUserId: user.id },
              { createdById: user.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch (error) {
      console.error('Error getting clients by user:', error);
      throw error;
    }
  }

  static async findClientById(id: number) {
    try {
      return await prisma.client.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Error finding client by ID:', error);
      throw error;
    }
  }

  static async updateClient(id: number, data: {
    name?: string;
    logo?: string | null;
    address?: string | null;
    industry?: string | null;
    slogan?: string | null;
    links?: string[];
    coreProducts?: string[];
    idealCustomers?: string | null;
    brandEmotion?: string | null;
    uniqueProposition?: string | null;
    whyChooseUs?: string | null;
    mainGoal?: string | null;
    shortTermGoal?: string | null;
    longTermGoal?: string | null;
    competitors?: string[];
    indirectCompetitors?: string[];
    brandAssets?: string[];
    fontUsed?: string[];
    smmDriveLink?: string | null;
    contractDeliverables?: string | null;
    assignedUserId?: number | null;
  }) {
    try {
      return await prisma.client.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  static async deleteClient(id: number) {
    try {
      return await prisma.client.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // Authentication helpers
  static async updateUserLastLogin(userId: number) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Seeding
  static async seedSuperAdmin() {
    const email = 'admin@boombox.com';
    const plainPassword = 'SuperAdmin123!';

    try {
      // Check if super admin already exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        console.log('⚠️ Super admin already exists');
        return user;
      }

      // Hash password before saving
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      // Create super admin
      user = await prisma.user.create({
        data: {
          name: 'Super Admin',
          email,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
          isActive: true,
          lastLogin: new Date(),
        },
      });

      console.log('✅ Super admin created:', user.email);
      console.log('📧 Email:', email);
      console.log('🔑 Password:', plainPassword);
      
      return user;
    } catch (error) {
      console.error('❌ Error seeding super admin:', error);
      throw error;
    }
  }
}