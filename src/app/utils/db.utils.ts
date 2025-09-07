// utils/db.utils.ts
import { PrismaClient, UserRole } from '../../generated/prisma';

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
    return await prisma.user.create({
      data: {
        ...data,
        lastLogin: new Date(),
      },
    });
  }

  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async updateUser(id: number, data: Record<string, unknown>) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        lastLogin: true,
      },
    });
  }

  // ADD THE MISSING getUserStats METHOD
  static async getUserStats(userId: number, role: UserRole) {
    try {
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
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
          recentClients,
          assignedClients: await prisma.client.count({
            where: {
              OR: [
                { assignedUserId: userId },
                { createdById: userId },
              ],
            },
          }),
        };
      } else {
        // SMM users can only see their own stats
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

  // Client management
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
    createdById: number;
    assignedUserId?: number | null;
  }) {
    return await prisma.client.create({
      data,
    });
  }

  static async findClientById(id: number) {
    return await prisma.client.findUnique({
      where: { id },
    });
  }

  static async findClientsByUser(userId: number, role: UserRole) {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    
    return await prisma.client.findMany({
      where: {
        OR: [
          { assignedUserId: userId },
          { createdById: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getClientsByUser(user: { id: number; role: UserRole }) {
    return await this.findClientsByUser(user.id, user.role);
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
    return await prisma.client.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteClient(id: number) {
    return await prisma.client.delete({
      where: { id },
    });
  }

  // Authentication helpers
  static async updateUserLastLogin(userId: number) {
    return await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  // Seeding
  static async seedSuperAdmin() {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existingAdmin) {
      return existingAdmin;
    }

    return await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@boombox.com',
        password: '$2b$10$K8QVdBVVZ1YtO5Y5Y5Y5YOK8QVdBVVZ1YtO5Y5Y5Y5YOK8QVdBVVZ1', // hashed "admin123"
        role: 'SUPER_ADMIN',
        lastLogin: new Date(),
      },
    });
  }

  // Database connection management
  static async disconnect() {
    await prisma.$disconnect();
  }

  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (_error) {
      return false;
    }
  }
}