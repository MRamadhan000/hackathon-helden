import { useState, useEffect, useCallback } from "react";
import {
  MutasiPengajuan,
  MutasiLog,
  MutasiSubmitPayload,
  MutasiResubmitPayload,
  ActorRole,
} from "@/types/mutasi";
import {
  getMutasiList,
  submitMutasi,
  verifyMutasiSekdes,
  resubmitMutasi,
  getMutasiLogs,
} from "@/services/core/mutasi.service";

export function useMutasi(tahunPeriode?: string, createdByUserId?: string | null) {
  const [data, setData] = useState<MutasiPengajuan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMutasi = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getMutasiList(tahunPeriode, createdByUserId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal mengambil data mutasi"));
    } finally {
      setIsLoading(false);
    }
  }, [tahunPeriode, createdByUserId]);

  useEffect(() => {
    fetchMutasi();
  }, [fetchMutasi]);

  // Tambah Pengajuan Mutasi Baru (Offline ke RT / Online)
  const submit = async (
    payload: MutasiSubmitPayload,
    actorId: string,
    actorRole: ActorRole = "RT"
  ) => {
    const baru = await submitMutasi(payload, actorId, actorRole);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  // Verifikasi oleh Sekdes (Approve / Reject)
  const verifySekdes = async (
    id: string,
    isApproved: boolean,
    feedback: string | undefined,
    sekdesId: string
  ) => {
    const updated = await verifyMutasiSekdes(id, isApproved, feedback, sekdesId);
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  };

  // Pengajuan Ulang jika Ditolak
  const resubmit = async (
    id: string,
    payload: MutasiResubmitPayload,
    actorId: string,
    actorRole: ActorRole = "WARGA"
  ) => {
    const updated = await resubmitMutasi(id, payload, actorId, actorRole);
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    return updated;
  };

  // Ambil Audit Logs untuk ID tertentu
  const fetchLogs = async (mutasiId: string): Promise<MutasiLog[]> => {
    return await getMutasiLogs(mutasiId);
  };

  return {
    data,
    isLoading,
    error,
    refresh: fetchMutasi,
    submit,
    verifySekdes,
    resubmit,
    fetchLogs,
  };
}
