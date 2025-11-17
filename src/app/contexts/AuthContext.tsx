"use client";
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "../../generated/prisma";

interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session configuration
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const SESSION_STORAGE_KEY = "auth_session_timestamp";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();
  const sessionCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Check if session is still valid
  const isSessionValid = useCallback(() => {
    const sessionTimestamp = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionTimestamp) return false;

    const sessionAge = Date.now() - parseInt(sessionTimestamp, 10);
    return sessionAge < SESSION_DURATION;
  }, []);

  // Update session timestamp
  const updateSessionTimestamp = useCallback(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, Date.now().toString());
  }, []);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    if (isRefreshingRef.current) return;
    
    // Check session validity before making API call
    if (!isSessionValid()) {
      setAuthState({ user: null, isLoading: false, error: null });
      return;
    }

    isRefreshingRef.current = true;
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({ user: data.user, isLoading: false, error: null });
        updateSessionTimestamp();
      } else {
        // Clear invalid session
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setAuthState({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setAuthState({ user: null, isLoading: false, error: "Failed to fetch user" });
    } finally {
      isRefreshingRef.current = false;
    }
  }, [isSessionValid, updateSessionTimestamp]);

  // Start periodic session validation
  const startSessionCheck = useCallback(() => {
    // Clear existing timer
    if (sessionCheckTimerRef.current) {
      clearInterval(sessionCheckTimerRef.current);
    }

    // Set up new periodic check
    sessionCheckTimerRef.current = setInterval(() => {
      if (!isSessionValid()) {
        // Session expired, log out user
        logout();
      }
    }, SESSION_CHECK_INTERVAL);
  }, [isSessionValid]);

  // Initialize auth state on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Start session checking when user is authenticated
  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      startSessionCheck();
    }

    return () => {
      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current);
      }
    };
  }, [authState.user, authState.isLoading, startSessionCheck]);

  // Update session timestamp on user activity
  useEffect(() => {
    if (!authState.user) return;

    const handleUserActivity = () => {
      if (isSessionValid()) {
        updateSessionTimestamp();
      }
    };

    // Listen for user activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [authState.user, isSessionValid, updateSessionTimestamp]);

  const login = async (credentials: { email: string; password: string }) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      setAuthState({ user: data.user, isLoading: false, error: null });
      updateSessionTimestamp();
      startSessionCheck();
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session data
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current);
      }
      
      setAuthState({ user: null, isLoading: false, error: null });
      router.push("/signin");
    }
  };

  const refreshAuth = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Permission hook
export function usePermission() {
  const { authState } = useAuthContext();
  const user = authState.user;

  return {
    isSuperAdmin: user?.role === UserRole.SUPER_ADMIN,
    isAdmin: user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN,
    isSMM: user?.role === UserRole.SMM,
    canManageUsers: user?.role === UserRole.SUPER_ADMIN,
    canManageClients: user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN,
    canEditClient: (clientId?: number) => {
      if (user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) {
        return true;
      }
      // SMMs can only edit clients they're assigned to
      // This would need to check against assigned clients
      return false;
    },
  };
}