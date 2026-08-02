import { useState, useEffect, useCallback } from "react";
import { UserRoleRecord, UserRole } from "@/types/auth";
import {
  getAllUserRoles,
  setUserRole,
  deleteUserRole,
} from "@/services/core/auth.service";

export function useUserRoles() {
  const [roles, setRoles] = useState<UserRoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllUserRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Gagal mengambil data role")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const assignRole = async (pendudukId: string, role: UserRole) => {
    await setUserRole(pendudukId, role);
    await fetchRoles();
  };

  const removeRole = async (pendudukId: string) => {
    await deleteUserRole(pendudukId);
    setRoles((prev) => prev.filter((r) => r.pendudukId !== pendudukId));
  };

  return {
    roles,
    isLoading,
    error,
    refresh: fetchRoles,
    assignRole,
    removeRole,
  };
}
