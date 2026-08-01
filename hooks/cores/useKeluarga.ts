import { useState, useEffect, useCallback } from "react";
import { Keluarga } from "@/types/keluarga";
import {
  getKeluargaList,
  addKeluarga,
  deleteKeluarga,
} from "@/services/core/keluarga.service"; // Sesuaikan path

export function useKeluarga() {
  const [data, setData] = useState<Keluarga[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKeluarga = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getKeluargaList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Terjadi kesalahan"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeluarga();
  }, [fetchKeluarga]);

  const tambah = async (payload: Omit<Keluarga, "id" | "createdAt">) => {
    const baru = await addKeluarga(payload);
    setData((prev) => [baru, ...prev]); // Tambah di awal array
    return baru;
  };

  const hapus = async (id: string) => {
    await deleteKeluarga(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, refresh: fetchKeluarga, tambah, hapus };
}
