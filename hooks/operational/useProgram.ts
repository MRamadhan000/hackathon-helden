// src/hooks/useProgram.ts
import { useState, useEffect, useCallback } from "react";
import {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramFilters,
} from "@/types/program";
import {
  getProgramList,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/services/operational/program.service"; // Sesuaikan path

export function useProgram(initialFilters?: ProgramFilters) {
  const [data, setData] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ProgramFilters | undefined>(
    initialFilters
  );

  const fetchProgram = useCallback(async (customFilters?: ProgramFilters) => {
    setIsLoading(true);
    try {
      const result = await getProgramList(customFilters ?? filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Terjadi kesalahan"));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  // Tambah program baru
  const tambah = async (payload: CreateProgramRequest) => {
    const baru = await createProgram(payload);
    setData((prev) => [baru, ...prev]); // Tambah di awal array
    return baru;
  };

  // Update program
  const ubah = async (id: string, payload: UpdateProgramRequest) => {
    const updated = await updateProgram(id, payload);
    setData((prev) =>
      prev.map((item) => (item.id === id ? updated : item))
    );
    return updated;
  };

  // Hapus program
  const hapus = async (id: string) => {
    await deleteProgram(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // Ganti filter lalu refresh
  const applyFilters = (newFilters: ProgramFilters) => {
    setFilters(newFilters);
  };

  return {
    data,
    isLoading,
    error,
    filters,
    refresh: fetchProgram,
    tambah,
    ubah,
    hapus,
    applyFilters,
  };
}