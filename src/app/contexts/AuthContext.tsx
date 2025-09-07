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

  // Fix: Use proper AuthState type with isAuthenticated property
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false, // This should now work
    isLoading: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Create logout function first to avoid circular dependency
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

  // Now create refreshAuth that can safely call logout
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
        if (data.success && data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          setIsLoading(false);
        } else {
          throw new Error("Invalid user data");
        }
      } else {
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

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.success && data.user && data.accessToken) {
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

        router.push("/dashboard");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
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
