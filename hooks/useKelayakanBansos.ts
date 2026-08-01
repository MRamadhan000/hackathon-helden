import { useState, useEffect, useCallback } from "react";
import {
  SurveiKelayakanBansos,
  SurveiKelayakanBansosInsert,
  SurveiKelayakanBansosUpdate,
} from "@/types/survei_kelayakan_bansos";
import {
  getSurveiKelayakanList,
  addSurveiKelayakan,
  updateSurveiKelayakan,
  deleteSurveiKelayakan,
} from "@/services/survei_kelayakan_bansos.service";

export function useSurveiKelayakanBansos() {
  const [data, setData] = useState<SurveiKelayakanBansos[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSurvei = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSurveiKelayakanList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Terjadi kesalahan saat memuat data survei kelayakan"),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurvei();
  }, [fetchSurvei]);

  const tambah = async (payload: SurveiKelayakanBansosInsert) => {
    const baru = await addSurveiKelayakan(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  const perbarui = async (id: string, payload: SurveiKelayakanBansosUpdate) => {
    const diupdate = await updateSurveiKelayakan(id, payload);
    setData((prev) => prev.map((item) => (item.id === id ? diupdate : item)));
    return diupdate;
  };

  const hapus = async (id: string) => {
    await deleteSurveiKelayakan(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    data,
    isLoading,
    error,
    refresh: fetchSurvei,
    tambah,
    perbarui,
    hapus,
  };
}
