// hooks/operational/usePenerima.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  Penerima,
  CreatePenerimaRequest,
  UpdatePenerimaRequest,
  PenerimaFilters,
  PenerimaStats,
} from "@/types/penerima";
import {
  getPenerimaList,
  createPenerima,
  updatePenerimaStatus,
  deletePenerima,
} from "@/services/operational/penerima.service";

export function usePenerima(initialFilters?: PenerimaFilters) {
  const [data, setData] = useState<Penerima[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<PenerimaFilters | undefined>(initialFilters);

  const fetch = useCallback(async (customFilters?: PenerimaFilters) => {
    setIsLoading(true);
    try {
      const result = await getPenerimaList(customFilters ?? filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal memuat data penerima"));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetch(); }, [fetch]);

  // Computed stats
  const stats = useMemo<PenerimaStats>(() => ({
    total: data.length,
    pending: data.filter((d) => d.status === "PENDING").length,
    approved: data.filter((d) => d.status === "APPROVED").length,
    rejected: data.filter((d) => d.status === "REJECTED").length,
    distributed: data.filter((d) => d.status === "DISTRIBUTED").length,
  }), [data]);

  // CREATE
  const tambah = async (payload: CreatePenerimaRequest) => {
    const baru = await createPenerima(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  // UPDATE STATUS
  const ubahStatus = async (id: string, payload: UpdatePenerimaRequest) => {
    const updated = await updatePenerimaStatus(id, payload);
    setData((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  // DELETE
  const hapus = async (id: string) => {
    await deletePenerima(id);
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  // Filter by program (untuk dipakai per halaman program)
  const filterByProgram = (programId: string) => {
    const next = { ...filters, programId };
    setFilters(next);
  };

  return {
    data,
    stats,
    isLoading,
    error,
    filters,
    refresh: fetch,
    tambah,
    ubahStatus,
    hapus,
    filterByProgram,
    setFilters,
  };
}
