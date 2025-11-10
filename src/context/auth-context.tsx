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
  isAuthenticated: boolean;
};

type LoginCredentials = {
  username: string;
  password: string;
};

const STORAGE_KEY = "nstswc-devclub-user";

const credentialDirectory: Array<
  LoginCredentials & {
    profile: ClubUser;
  }
> = [
  {
    username: "geetansh",
    password: "admin123",
    profile: {
      id: "geetansh-1",
      name: "Geetansh Goyal",
      email: "geetansh@nstswc.com",
      avatar: "https://avatars.githubusercontent.com/u/9919?v=4",
      role: "admin",
      badges: 7,
      points: 1800,
    },
  },
  {
    username: "utsav",
    password: "user123",
    profile: {
      id: "utsav-1",
      name: "Utsav",
      email: "utsav@nstswc.com",
      avatar: "https://avatars.githubusercontent.com/u/22736455?v=4",
      role: "student",
      badges: 4,
      points: 1200,
    },
  },
  {
    username: "user3",
    password: "user123",
    profile: {
      id: "user3-1",
      name: "User Three",
      email: "user3@nstswc.com",
      avatar: "https://avatars.githubusercontent.com/u/9926202?v=4",
      role: "student",
      badges: 2,
      points: 800,
    },
  },
  {
    username: "user4",
    password: "user123",
    profile: {
      id: "user4-1",
      name: "User Four",
      email: "user4@nstswc.com",
      avatar: "https://avatars.githubusercontent.com/u/1234567?v=4",
      role: "student",
      badges: 1,
      points: 600,
    },
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ClubUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      return cached ? (JSON.parse(cached) as ClubUser) : null;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // We intentionally hydrate client-only state after mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const login = useCallback(async ({
    username,
    password,
  }: LoginCredentials): Promise<ActionResult> => {
    const normalized = username.trim().toLowerCase();
    const match = credentialDirectory.find(
      (entry) => entry.username === normalized,
    );

    if (!match) {
      return { ok: false, message: "No member found with that username." };
    }

    if (match.password !== password) {
      return { ok: false, message: "Incorrect password. Try again." };
    }

    setUser(match.profile);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(match.profile));
    }

    return {
      ok: true,
      message: `Welcome back, ${match.profile.name.split(" ")[0]}!`,
      user: match.profile,
    };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const sessionUser = hydrated ? user : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionUser,
      login,
      logout,
      isAuthenticated: Boolean(sessionUser),
    }),
    [login, logout, sessionUser],
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
