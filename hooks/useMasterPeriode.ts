import { useState, useEffect, useCallback } from "react";
import { MasterPeriode, MasterPeriodeInsert, MasterPeriodeUpdate } from "@/types/master_periode";
import { 
  getMasterPeriodeList, 
  addMasterPeriode, 
  updateMasterPeriode, 
  deleteMasterPeriode 
} from "@/services/master_periode.service";

export function useMasterPeriode() {
  const [data, setData] = useState<MasterPeriode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPeriode = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMasterPeriodeList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Terjadi kesalahan saat memuat data periode"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeriode();
  }, [fetchPeriode]);

  const tambah = async (payload: MasterPeriodeInsert) => {
    const baru = await addMasterPeriode(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  const perbarui = async (id: number, payload: MasterPeriodeUpdate) => {
    const diupdate = await updateMasterPeriode(id, payload);
    setData((prev) => prev.map((item) => (item.id === id ? diupdate : item)));
    return diupdate;
  };

  const hapus = async (id: number) => {
    await deleteMasterPeriode(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return { data, isLoading, error, refresh: fetchPeriode, tambah, perbarui, hapus };
}