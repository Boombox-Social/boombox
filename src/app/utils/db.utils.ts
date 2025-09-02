// File Structure: src/app/utils/db.utils.ts - Database utility class with user and client operations
import { prisma } from '../lib/prisma';
import { User, Client, UserRole, Prisma } from '../../generated/prisma';
import bcrypt from 'bcryptjs';

export class DatabaseUtils {
  // User operations
  static async createUser(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
    avatar?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || UserRole.SMM,
        avatar: data.avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  static async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  static async findUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  static async updateUserLastLogin(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  static async updateUser(userId: number, data: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar: string;
    isActive: boolean;
  }>) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  // Client operations
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
    return prisma.client.create({
      data: {
        name: data.name,
        logo: data.logo,
        address: data.address,
        industry: data.industry,
        slogan: data.slogan,
        links: data.links || [],
        coreProducts: data.coreProducts || [],
        idealCustomers: data.idealCustomers,
        brandEmotion: data.brandEmotion,
        uniqueProposition: data.uniqueProposition,
        whyChooseUs: data.whyChooseUs,
        mainGoal: data.mainGoal,
        shortTermGoal: data.shortTermGoal,
        longTermGoal: data.longTermGoal,
        competitors: data.competitors || [],
        indirectCompetitors: data.indirectCompetitors || [],
        brandAssets: data.brandAssets || [],
        fontUsed: data.fontUsed || [],
        smmDriveLink: data.smmDriveLink,
        contractDeliverables: data.contractDeliverables,
        createdById: data.createdById,
        assignedUserId: data.assignedUserId,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    });
  }

  static async findClientById(id: number) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    });
  }

  static async findClientsByUser(userId: number, role: UserRole) {
    if (role === UserRole.SMM) {
      return prisma.client.findMany({
        where: { assignedUserId: userId },
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      return prisma.client.findMany({
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
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
    return prisma.client.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    });
  }

  static async deleteClient(id: number) {
    return prisma.client.delete({
      where: { id }
    });
  }

  // Search functionality
  static async searchClients(query: string, userId: number, role: UserRole) {
    const whereCondition = role === UserRole.SMM 
      ? { assignedUserId: userId } 
      : {};

    return prisma.client.findMany({
      where: {
        ...whereCondition,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { industry: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get user statistics
  static async getUserStats(userId: number, role: UserRole) {
    const stats: any = {};

    if (role === UserRole.SMM) {
      const clientCount = await prisma.client.count({
        where: { assignedUserId: userId }
      });
      stats.assignedClients = clientCount;
    } else {
      const totalClients = await prisma.client.count();
      const totalUsers = await prisma.user.count();
      stats.totalClients = totalClients;
      stats.totalUsers = totalUsers;
    }

    return stats;
  }

  static async deleteUser(userId: number) {
    try {
      // First, unassign the user from any clients
      await prisma.client.updateMany({
        where: { assignedUserId: userId },
        data: { assignedUserId: null }
      });

      // Then delete the user
      await prisma.user.delete({
        where: { id: userId }
      });

      console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}