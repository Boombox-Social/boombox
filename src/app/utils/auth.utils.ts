import { JWTPayload, User } from '../types/auth.types';
import { UserRole } from '../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseUtils } from './db.utils';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'user-data';

export class AuthUtils {
  // Token management
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

  // Password utilities
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT utilities
  static generateTokens(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  static parseJWT(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      return decoded as JWTPayload;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret');
      return decoded as JWTPayload;
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const payload = this.parseJWT(token);
    if (!payload) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  }

  static isTokenExpiringSoon(token: string, thresholdMinutes: number = 5): boolean {
    const payload = this.parseJWT(token);
    if (!payload) return true;
    
    const currentTime = Date.now() / 1000;
    const threshold = thresholdMinutes * 60;
    return (payload.exp - currentTime) < threshold;
  }

  // Auth state management
  static clearAuthData(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
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
      return userData ? JSON.parse(userData) : null;
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

  // Role-based access control
  static hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.SMM]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPER_ADMIN]: 3,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  // Authentication flow with proper password verification
  static async authenticateUser(email: string, password: string) {
    // Use the new method that verifies password
    const user = await DatabaseUtils.verifyUserPassword(email, password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    const updatedUser = await DatabaseUtils.updateUserLastLogin(user.id);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(updatedUser);

    return {
      user: updatedUser,
      accessToken,
      refreshToken
    };
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