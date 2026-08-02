"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { UserProfile, UserRole, AuthContextType } from "@/types/auth";
import {
  loginByNik,
  getProfileByPendudukId,
} from "@/services/core/auth.service";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = "user_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial Load: Cek localStorage & Sinkronkan Profile dengan Supabase
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedSession) {
          const parsedUser: UserProfile = JSON.parse(savedSession);
          setUser(parsedUser);

          // Background re-fetch profile untuk sinkronisasi role & data terbaru
          try {
            const freshProfile = await getProfileByPendudukId(parsedUser.id);
            setUser(freshProfile);
            localStorage.setItem(
              LOCAL_STORAGE_KEY,
              JSON.stringify(freshProfile)
            );
          } catch (freshErr) {
            setUser(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            if (
              !(freshErr instanceof Error) ||
              freshErr.message !== "Data profil penduduk tidak ditemukan."
            ) {
              console.warn("Gagal memperbarui profil secara latar belakang.");
            }
          }
        }
      } catch (err) {
        console.error("Gagal membaca session localStorage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Handler Login By NIK (Tanpa Register)
  const login = async (nik: string): Promise<UserProfile> => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await loginByNik(nik);
      setUser(profile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal melakukan login.";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler Logout
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  // Handler Fetch / Refresh Profile By Penduduk ID
  const fetchProfile = async (pendudukId: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const freshProfile = await getProfileByPendudukId(pendudukId);
      setUser(freshProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshProfile));
      return freshProfile;
    } catch (err) {
      console.error("Gagal fetch profile:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const role: UserRole | null = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        error,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
