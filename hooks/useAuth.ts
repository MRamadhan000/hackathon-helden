"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { AuthContextType } from "@/types/auth";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam komponen <AuthProvider>.");
  }

  return context;
}
