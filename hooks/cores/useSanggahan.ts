import { useState, useEffect, useCallback } from "react";
import {
  SanggahanPenduduk,
  SanggahanRumah,
  SanggahanLog,
  SanggahanPendudukPayload,
  SanggahanRumahPayload,
  JenisSanggahan,
} from "@/types/sanggahan";
import { ActorRole } from "@/types/mutasi";
import {
  getSanggahanPendudukList,
  getSanggahanRumahList,
  submitSanggahanPenduduk,
  submitSanggahanRumah,
  forwardSanggahanToSekdes,
  verifySanggahanSekdes,
  getSanggahanLogs,
} from "@/services/core/sanggahan.service";

export function useSanggahan(tahunPeriode?: string) {
  const [listPenduduk, setListPenduduk] = useState<SanggahanPenduduk[]>([]);
  const [listRumah, setListRumah] = useState<SanggahanRumah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllSanggahan = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendudukRes, rumahRes] = await Promise.all([
        getSanggahanPendudukList(tahunPeriode),
        getSanggahanRumahList(tahunPeriode),
      ]);
      setListPenduduk(pendudukRes);
      setListRumah(rumahRes);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Gagal mengambil data sanggahan")
      );
    } finally {
      setIsLoading(false);
    }
  }, [tahunPeriode]);

  useEffect(() => {
    fetchAllSanggahan();
  }, [fetchAllSanggahan]);

  // Submit Sanggahan Data Diri
  const submitPenduduk = async (
    payload: SanggahanPendudukPayload,
    actorId: string,
    actorRole: ActorRole = "WARGA"
  ) => {
    const baru = await submitSanggahanPenduduk(payload, actorId, actorRole);
    setListPenduduk((prev) => [baru, ...prev]);
    return baru;
  };

  // Submit Sanggahan Kondisi Rumah
  const submitRumah = async (
    payload: SanggahanRumahPayload,
    actorId: string,
    actorRole: ActorRole = "WARGA"
  ) => {
    const baru = await submitSanggahanRumah(payload, actorId, actorRole);
    setListRumah((prev) => [baru, ...prev]);
    return baru;
  };

  // RT Meneruskan Sanggahan ke Sekdes
  const forwardToSekdes = async (
    id: string,
    jenis: JenisSanggahan,
    rtId: string
  ) => {
    const updated = await forwardSanggahanToSekdes(id, jenis, rtId);
    if (jenis === "PENDUDUK") {
      setListPenduduk((prev) =>
        prev.map((item) => (item.id === id ? (updated as SanggahanPenduduk) : item))
      );
    } else {
      setListRumah((prev) =>
        prev.map((item) => (item.id === id ? (updated as SanggahanRumah) : item))
      );
    }
    return updated;
  };

  // Verifikasi oleh Sekdes
  const verifySekdes = async (
    id: string,
    jenis: JenisSanggahan,
    isApproved: boolean,
    feedback: string | undefined,
    sekdesId: string
  ) => {
    const updated = await verifySanggahanSekdes(
      id,
      jenis,
      isApproved,
      feedback,
      sekdesId
    );
    if (jenis === "PENDUDUK") {
      setListPenduduk((prev) =>
        prev.map((item) => (item.id === id ? (updated as SanggahanPenduduk) : item))
      );
    } else {
      setListRumah((prev) =>
        prev.map((item) => (item.id === id ? (updated as SanggahanRumah) : item))
      );
    }
    return updated;
  };

  // Ambil Audit Logs Sanggahan
  const fetchLogs = async (sanggahanId: string): Promise<SanggahanLog[]> => {
    return await getSanggahanLogs(sanggahanId);
  };

  return {
    listPenduduk,
    listRumah,
    isLoading,
    error,
    refresh: fetchAllSanggahan,
    submitPenduduk,
    submitRumah,
    forwardToSekdes,
    verifySekdes,
    fetchLogs,
  };
}
