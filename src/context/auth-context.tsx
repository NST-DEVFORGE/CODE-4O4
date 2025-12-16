"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ActionResult, ClubUser } from "@/types";

type AuthContextValue = {
  user: ClubUser | null;
  login: (credentials: LoginCredentials) => Promise<ActionResult>;
  logout: () => void;
  updateUser: (updates: Partial<ClubUser>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type LoginCredentials = {
  username: string;
  password: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ClubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from secure HttpOnly JWT cookie via API
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include", // Include cookies
        });
        const data = await response.json();
        if (data.user) {
          setUser(data.user as ClubUser);
        }
      } catch {
        // Session restoration failed, user stays null
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async ({
    username,
    password,
  }: LoginCredentials): Promise<ActionResult> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies
        body: JSON.stringify({ 
          username: username.trim().toLowerCase(), 
          password 
        }),
      });

      const result = await response.json();

      if (result.ok && result.user) {
        setUser(result.user);
        // No localStorage storage - JWT cookie is set by the server (HttpOnly)
        
        try {
          const webpush = await import('@/lib/webpush');
          webpush.registerServiceWorker().then(() => {
            webpush.subscribeForPush(result.user.id).then(() => {
              // Subscribed successfully
            }).catch((e) => console.warn('Subscribe error after login', e));
          }).catch((e) => console.warn('SW register error after login', e));
        } catch (err) {
          console.warn('Webpush helper not available', err);
        }

        return {
          ok: true,
          message: result.message,
          user: result.user,
        };
      }

      return { 
        ok: false, 
        message: result.message || "Login failed. Please check your credentials." 
      };
    } catch (error) {
      console.error("Login error:", error);
      return { ok: false, message: "Network error. Please try again." };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      // Clear all authentication cookies
      document.cookie = "code404-user=; path=/; max-age=0";
      document.cookie = "code404-auth-token=; path=/; max-age=0";
      
      window.location.href = "/";
    }
  }, []);

  const updateUser = useCallback((updates: Partial<ClubUser>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      // Only store in React state - no localStorage or cookie needed
      // The server maintains the source of truth via JWT
      return updatedUser;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: Boolean(user),
      isLoading,
    }),
    [login, logout, updateUser, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
};
