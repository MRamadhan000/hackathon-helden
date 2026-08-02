// hooks/operational/useSiskeudes.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { KategoriSiskeudes, Siskeudes, CreateSiskeudesRequest, UpdateSiskeudesRequest } from "@/services/operational/siskeudes.service";
import {
  getSiskeudesList,
  createSiskeudes,
  updateSiskeudes,
  deleteSiskeudes,
} from "@/services/operational/siskeudes.service";

export function useSiskeudes() {
  const [data, setData] = useState<Siskeudes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSiskeudesList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal memuat data Siskeudes"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const bansoslist = useMemo(() => data.filter((d) => d.kategori === "bansos"), [data]);
  const operasionalList = useMemo(() => data.filter((d) => d.kategori === "operasional"), [data]);

  const stats = useMemo(() => ({
    total: data.length,
    totalBansos: bansoslist.length,
    totalOperasional: operasionalList.length,
    nominalBansos: bansoslist.reduce((s, d) => s + d.nominal, 0),
    nominalOperasional: operasionalList.reduce((s, d) => s + d.nominal, 0),
    totalNominal: data.reduce((s, d) => s + d.nominal, 0),
  }), [data, bansoslist, operasionalList]);

  const tambah = async (payload: CreateSiskeudesRequest) => {
    const baru = await createSiskeudes(payload);
    setData((prev) => [baru, ...prev]);
    return baru;
  };

  const ubah = async (id: string, payload: UpdateSiskeudesRequest) => {
    const updated = await updateSiskeudes(id, payload);
    setData((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const hapus = async (id: string) => {
    await deleteSiskeudes(id);
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    data, bansoslist, operasionalList, stats,
    isLoading, error,
    refresh: fetch,
    tambah, ubah, hapus,
  };
}
