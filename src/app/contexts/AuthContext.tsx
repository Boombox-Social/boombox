// contexts/AuthContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LoginFormData, AuthState, UserRole } from "../types/auth.types";

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setIsLoading(false);

    router.push("/signin");
  }, [router]);

  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      if (typeof window === "undefined") {
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        logout();
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 Auth refresh response:", data); // DEBUG

        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          setIsLoading(false);
        } else {
          console.error("❌ Invalid auth refresh response:", data);
          throw new Error("Invalid user data");
        }
      } else {
        console.error("❌ Auth refresh failed with status:", response.status);
        throw new Error("Auth refresh failed");
      }
    } catch (error) {
      console.error("Auth refresh error:", error);
      logout();
      throw error;
    }
  }, [logout]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          setIsLoading(false);
          return;
        }

        await refreshAuth();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshAuth]);

  const login = async (credentials: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🔐 Attempting login for:", credentials.email); // DEBUG

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("📨 Login response:", data); // DEBUG

      if (!response.ok) {
        console.error("❌ Login failed with status:", response.status, data);
        throw new Error(data.error || "Login failed");
      }

      // Check for expected response format
      if (!data.success) {
        console.error("❌ Login response missing success flag:", data);
        throw new Error(data.error || "Invalid response format");
      }

      if (!data.user) {
        console.error("❌ Login response missing user:", data);
        throw new Error("No user data received");
      }

      if (!data.accessToken) {
        console.error("❌ Login response missing accessToken:", data);
        throw new Error("No access token received");
      }

      console.log("✅ Login successful, storing tokens"); // DEBUG

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
      }

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log("✅ Redirecting to dashboard"); // DEBUG
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
        refreshAuth,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
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

    const userLevel = roleHierarchy[authState.user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    return userLevel >= requiredLevel;
  };

  return {
    hasPermission,
    isSuperAdmin: authState.user?.role === UserRole.SUPER_ADMIN,
    isAdmin:
      authState.user?.role === UserRole.ADMIN ||
      authState.user?.role === UserRole.SUPER_ADMIN,
    currentUser: authState.user,
  };
}
