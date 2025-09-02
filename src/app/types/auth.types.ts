import { UserRole } from '../../generated/prisma';

export interface User {
  id: number; // Changed from string to number to match Prisma schema
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export { UserRole };

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface JWTPayload {
  userId: number; // Changed from string to number
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  avatar?: string;
}