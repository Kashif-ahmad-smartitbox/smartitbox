"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  refreshToken,
  ProfileResponse,
  User,
} from "@/app/services/modules/auth";
import { getCookie, removeCookie, setCookie } from "@/app/lib/cookies";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const profile: ProfileResponse = await getAdminProfile(accessToken);
      setUser(profile.user ?? null);
    } catch (err) {
      console.warn("Failed to fetch profile:", err);
      logout();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = getCookie("token");

    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const logout = async () => {
    try {
      await adminLogout();
    } catch (err) {
      console.warn("Logout error", err);
    } finally {
      removeCookie("token");
      setUser(null);
      setToken(null);
      location.replace("/admin");
    }
  };

  const refresh = async () => {
    try {
      const refreshed = await refreshToken();
      if (refreshed.accessToken) {
        localStorage.setItem("token", refreshed.accessToken);
        setToken(refreshed.accessToken);
        await fetchProfile(refreshed.accessToken);
      } else {
        await logout();
      }
    } catch (err) {
      console.warn("Token refresh failed", err);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
