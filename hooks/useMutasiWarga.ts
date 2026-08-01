import { useState, useEffect, useCallback } from "react";
import {
  MutasiWarga,
  MutasiWargaInsert,
  MutasiWargaUpdate,
} from "@/types/mutasi_warga";
import {
  getMutasiList,
  addMutasi,
  updateMutasi,
  deleteMutasi,
} from "@/services/mutasi_warga.service";

export function useMutasiWarga() {
  const [data, setData] = useState<MutasiWarga[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMutasi = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMutasiList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Gagal memuat data mutasi warga"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMutasi();
  }, [fetchMutasi]);

  const tambah = async (payload: MutasiWargaInsert) => {
    const baru = await addMutasi(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  const perbarui = async (id: string, payload: MutasiWargaUpdate) => {
    const diupdate = await updateMutasi(id, payload);
    setData((prev) => prev.map((item) => (item.id === id ? diupdate : item)));
    return diupdate;
  };

  const hapus = async (id: string) => {
    await deleteMutasi(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    data,
    isLoading,
    error,
    refresh: fetchMutasi,
    tambah,
    perbarui,
    hapus,
  };
}
