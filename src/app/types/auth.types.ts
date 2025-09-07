// types/auth.types.ts
import { UserRole } from '../../generated/prisma';
export { UserRole } from '../../generated/prisma';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Password should not be included in the User type for security
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Fix: Add missing isAuthenticated property
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean; // ADD THIS MISSING PROPERTY
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserStats {
  totalClients?: number;
  totalUsers?: number;
  assignedClients: number;
  recentClients: Array<{
    id: number;
    name: string;
    createdAt: Date;
  }>;
}