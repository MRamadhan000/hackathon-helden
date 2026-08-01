import { useState, useEffect, useCallback } from "react";
import { Penduduk, PendudukHistory } from "@/types/penduduk";
import { getPendudukList, addPenduduk, updatePenduduk, deletePenduduk } from "@/services/core/penduduk.service"; // Sesuaikan path

export function usePenduduk() {
  const [data, setData] = useState<Penduduk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPenduduk = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getPendudukList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Terjadi kesalahan"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPenduduk();
  }, [fetchPenduduk]);

  const tambah = async (payload: Omit<Penduduk, "id">) => {
    const baru = await addPenduduk(payload);
    setData((prev) => [...prev, baru]);
    return baru;
  };

  const perbarui = async (
    id: string, 
    payload: Partial<Penduduk>, 
    historyPayload: Omit<PendudukHistory, "id" | "createdAt">
  ) => {
    const diupdate = await updatePenduduk(id, payload, historyPayload);
    // Update state lokal agar UI langsung reaktif tanpa perlu fetch ulang
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...diupdate } : item)));
    return diupdate;
  };

  const hapus = async (id: string) => {
    await deletePenduduk(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, refresh: fetchPenduduk, tambah, perbarui, hapus };
}