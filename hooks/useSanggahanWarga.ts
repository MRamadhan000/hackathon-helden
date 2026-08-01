import { useState, useEffect, useCallback } from "react";
import { SanggahanWarga, SanggahanWargaInsert, SanggahanWargaUpdate } from "@/types/sanggahanWarga";
import { getSanggahanList, addSanggahan, updateSanggahan, deleteSanggahan } from "@/services/sanggahan_warga.service";

export function useSanggahanWarga() {
  const [data, setData] = useState<SanggahanWarga[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSanggahan = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSanggahanList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal memuat data sanggahan"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSanggahan();
  }, [fetchSanggahan]);

  const tambah = async (payload: SanggahanWargaInsert) => {
    const baru = await addSanggahan(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  const perbarui = async (id: string, payload: SanggahanWargaUpdate) => {
    const diupdate = await updateSanggahan(id, payload);
    setData((prev) => prev.map((item) => (item.id === id ? diupdate : item)));
    return diupdate;
  };

  const hapus = async (id: string) => {
    await deleteSanggahan(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, refresh: fetchSanggahan, tambah, perbarui, hapus };
}