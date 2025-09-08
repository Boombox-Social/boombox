// utils/auth.utils.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { JWTPayload, User } from '../types/auth.types';
import { UserRole } from '../../generated/prisma';
import { DatabaseUtils } from './db.utils';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'user-data';

export class AuthUtils {
  // JWT Token management
  static generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    return jwt.sign(payload, secret);
  }

  static generateRefreshToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    };

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not set');
    }

    return jwt.sign(payload, secret);
  }

  static generateTokens(user: User): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Token verification failed:', error);
      }
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is not set');
      }

      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Refresh token verification failed:', error);
      }
      return null;
    }
  }

  static parseJWT(token: string): JWTPayload | null {
    return this.verifyToken(token);
  }

  // Enhanced getCurrentUser method
  static async getCurrentUser(request: NextRequest): Promise<User | null> {
    try {
      // Try to get token from cookies first (for SSR)
      let token = request.cookies.get('auth-token')?.value;
      
      // If not in cookies, try Authorization header
      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return null;
      }

      // Verify token
      const payload = this.verifyToken(token);
      if (!payload) {
        return null;
      }

      // Get user from database
      const user = await DatabaseUtils.findUserById(payload.userId);
      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error getting current user:', error);
      }
      return null;
    }
  }

  // Enhanced password utilities
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // Increased for better security
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // NEW: Permission checking method
  static hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.SMM]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPER_ADMIN]: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }


  // Enhanced authentication flow
  static async authenticateUser(email: string, password: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user by email
    const user = await DatabaseUtils.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await DatabaseUtils.updateUserLastLogin(user.id);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Client-side utilities (unchanged)
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  static clearAuthData(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
    this.removeAuthCookie();
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.verifyToken(token);
    return !!payload;
  }

  // User data management
  static setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  }

  // Refresh token management
  static setRefreshToken(refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  }

  static removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // Cookie utilities for SSR
  static setAuthCookie(token: string): void {
    if (typeof document !== 'undefined') {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7 days
      document.cookie = `auth-token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    }
  }

  static removeAuthCookie(): void {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  }
}

// Re-export for backward compatibility with existing code
export const AuthAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },
  
  logout: async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return response.json();
  },
  
  refreshToken: async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    return response.json();
  },
};