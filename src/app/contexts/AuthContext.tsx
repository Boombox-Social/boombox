// File Structure: src/app/contexts/AuthContext.tsx - Authentication context with proper exports
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, LoginFormData, AuthState, UserRole } from "../types/auth.types";

interface AuthContextType {
  authState: AuthState;
  login: (formData: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  const login = async (credentials: LoginFormData) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAuthState({
        user: data.user,
        token: data.token,
        isLoading: false,
        error: null,
      });

      // Redirect to dashboard
      const redirectTo =
        new URLSearchParams(window.location.search).get("redirect") ||
        "/dashboard";
      router.push(redirectTo);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
      router.push("/signin");
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState((prev) => ({
          ...prev,
          user: data.user,
          token: data.token,
          error: null,
        }));
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      await logout();
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: data.user,
            token: "authenticated", // We don't expose the actual token to client
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to initialize authentication",
        }));
      }
    };

    initAuth();
  }, []);

  const value = {
    authState,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function usePermission() {
  const { authState } = useAuth();

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!authState.user) return false;

    const roleHierarchy = {
      [UserRole.SMM]: 1,
      [UserRole.ADMIN]: 2,
      [UserRole.SUPER_ADMIN]: 3,
    };

    const userLevel = roleHierarchy[authState.user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const isSuperAdmin = authState.user?.role === UserRole.SUPER_ADMIN;
  const isAdmin = authState.user?.role === UserRole.ADMIN || isSuperAdmin;
  const isSMM = authState.user?.role === UserRole.SMM || isAdmin;

  return {
    hasPermission,
    isSuperAdmin,
    isAdmin,
    isSMM,
    currentUser: authState.user,
  };
}
