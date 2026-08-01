import { useState, useEffect, useCallback } from "react";
import { ClusterDesa } from "@/types/clusterDesa";
import {
  getClusterDesa,
  addClusterDesa,
  deleteClusterDesa,
} from "@/services/core/clusterDesa.service"; // Sesuaikan path

export function useClusterDesa() {
  const [data, setData] = useState<ClusterDesa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCluster = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getClusterDesa();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Terjadi kesalahan"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCluster();
  }, [fetchCluster]);

  const tambah = async (payload: Omit<ClusterDesa, "id">) => {
    const baru = await addClusterDesa(payload);
    setData((prev) => [...prev, baru]);
    return baru;
  };

  const hapus = async (id: string) => {
    await deleteClusterDesa(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, refresh: fetchCluster, tambah, hapus };
}
