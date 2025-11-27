"use client";
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour (matches JWT expiration)
const SESSION_CHECK_INTERVAL = 2 * 60 * 1000; // Check every 2 minutes
const SESSION_WARNING_TIME = 5 * 60 * 1000; // Warn 5 minutes before expiration
const SESSION_STORAGE_KEY = "auth_session_timestamp";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const sessionCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const lastActivityRef = useRef<number>(Date.now());
  const hasFetchedRef = useRef(false);

  // Check if session is still valid
  const isSessionValid = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const sessionTimestamp = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionTimestamp) return false;

    const sessionAge = Date.now() - parseInt(sessionTimestamp, 10);
    return sessionAge < SESSION_DURATION;
  }, []);

  // Update session timestamp
  const updateSessionTimestamp = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_STORAGE_KEY, Date.now().toString());
    lastActivityRef.current = Date.now();
  }, []);

  // Clear session data
  const clearSession = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session data
      clearSession();
      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current);
        sessionCheckTimerRef.current = null;
      }
      
      setAuthState({ user: null, isLoading: false, error: null });
      router.push("/signin");
    }
  }, [router, clearSession]);

  // Fetch current user
  const fetchCurrentUser = useCallback(async (force: boolean = false) => {
    // Prevent multiple simultaneous calls
    if (isRefreshingRef.current && !force) return;
    
    // Check if we're on a protected route
    const isProtectedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');
    
    // If not on protected route and already fetched, skip
    if (!isProtectedRoute && hasFetchedRef.current && !force) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
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
        hasFetchedRef.current = true;
      } else {
        // Clear invalid session
        clearSession();
        setAuthState({ user: null, isLoading: false, error: null });
        
        // Redirect to signin if on protected route
        if (isProtectedRoute) {
          router.push("/signin");
        }
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      clearSession();
      setAuthState({ user: null, isLoading: false, error: "Failed to fetch user" });
      
      // Redirect to signin if on protected route
      if (isProtectedRoute) {
        router.push("/signin");
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [pathname, updateSessionTimestamp, clearSession, router]);

  // Periodic session validation
  const startSessionCheck = useCallback(() => {
    // Clear existing timer
    if (sessionCheckTimerRef.current) {
      clearInterval(sessionCheckTimerRef.current);
    }

    // Set up new periodic check
    sessionCheckTimerRef.current = setInterval(() => {
      if (!isSessionValid()) {
        // Session expired, log out user
        console.log("Session expired, logging out...");
        logout();
      } else {
        // Check if user has been inactive
        const inactiveTime = Date.now() - lastActivityRef.current;
        const timeUntilExpiry = SESSION_DURATION - inactiveTime;
        
        // Warn if close to expiration
        if (timeUntilExpiry < SESSION_WARNING_TIME && timeUntilExpiry > 0) {
          console.log(`Session expiring in ${Math.floor(timeUntilExpiry / 1000 / 60)} minutes`);
        }
      }
    }, SESSION_CHECK_INTERVAL);
  }, [isSessionValid, logout]);

  // Initialize auth state on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Re-fetch user when pathname changes to a protected route
  useEffect(() => {
    const isProtectedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');
    
    if (isProtectedRoute && !authState.user && !authState.isLoading) {
      fetchCurrentUser(true);
    }
  }, [pathname, authState.user, authState.isLoading, fetchCurrentUser]);

  // Start session checking when user is authenticated
  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      startSessionCheck();
    }

    return () => {
      if (sessionCheckTimerRef.current) {
        clearInterval(sessionCheckTimerRef.current);
        sessionCheckTimerRef.current = null;
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
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
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
      hasFetchedRef.current = true;
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  };

  const refreshAuth = async () => {
    await fetchCurrentUser(true);
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
    canEditClient: (_clientId?: number) => {
      if (user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN) {
        return true;
      }
      return false;
    },
  };
}