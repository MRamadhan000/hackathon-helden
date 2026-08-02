import { useState, useEffect, useCallback } from "react";
import {
  SurveiKelayakan,
  SurveiKelayakanLog,
  SurveiKelayakanPayload,
} from "@/types/kelayakan";
import { ActorRole } from "@/types/mutasi";
import {
  getSurveiKelayakanList,
  submitSurveiKelayakan,
  verifySurveiKelayakanSekdes,
  getSurveiKelayakanLogs,
} from "@/services/core/kelayakan.service";

export function useSurveiKelayakan(tahunPeriode?: string, createdByUserId?: string | null) {
  const [data, setData] = useState<SurveiKelayakan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKelayakan = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSurveiKelayakanList(tahunPeriode, createdByUserId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Gagal mengambil data survei kelayakan")
      );
    } finally {
      setIsLoading(false);
    }
  }, [tahunPeriode, createdByUserId]);

  useEffect(() => {
    fetchKelayakan();
  }, [fetchKelayakan]);

  // Submit Survei Kelayakan Baru (OFFLINE via RT / ONLINE)
  const submit = async (
    payload: SurveiKelayakanPayload,
    actorId: string,
    actorRole: ActorRole = "RT"
  ) => {
    const baru = await submitSurveiKelayakan(payload, actorId, actorRole);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  // Verifikasi oleh Sekdes
  const verifySekdes = async (
    id: string,
    isApproved: boolean,
    feedback: string | undefined,
    sekdesId: string
  ) => {
    const updated = await verifySurveiKelayakanSekdes(
      id,
      isApproved,
      feedback,
      sekdesId
    );
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  };

  // Fetch Audit Logs untuk Survei
  const fetchLogs = async (
    surveiId: string
  ): Promise<SurveiKelayakanLog[]> => {
    return await getSurveiKelayakanLogs(surveiId);
  };

  return {
    data,
    isLoading,
    error,
    refresh: fetchKelayakan,
    submit,
    verifySekdes,
    fetchLogs,
  };
}
