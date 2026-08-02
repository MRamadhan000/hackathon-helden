"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormMutasiLengkap from "@/components/rt/FormMutasiLengkap";
import { PendudukRT } from "@/components/rt/TableWarga";
import { useMutasi } from "@/hooks/cores/useMutasi";
import { usePenduduk } from "@/hooks/cores/usePenduduk";
import { useKeluarga } from "@/hooks/cores/useKeluarga";
import { useClusterDesa } from "@/hooks/cores/useClusterDesa";
import { useAuth } from "@/hooks/useAuth";
import type { MutasiResubmitPayload, MutasiSubmitPayload } from "@/types/mutasi";
import { mutasiOfflineDB, OfflineMutasiItem } from "@/lib/mutasiOfflineDB";
import { useLiveQuery } from "dexie-react-hooks";

// ─────────────────────────── TYPES ───────────────────────────

interface RiwayatMutasiItem {
  id: string;
  tanggal: string;
  jenis: string;
  nik: string;
  nama: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  keluargaId?: string | null;
  clusterdesaId?: string | null;
  keterangan: string;
  statusSekdes?: string;
  rawStatus?: string;
  reqMethod?: string;
  feedbackSekdes?: string | null;
  parent?: string | null;
  createdBy?: string;
  approvedBy?: string | null;
}

interface MutasiFormData {
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  keterangan: string;
  agama?: string;
  keluargaId?: string;
  clusterdesaId?: string;
}

interface MutasiFormSubmitData {
  kategoriAksi: "baru" | "nonaktif" | "koreksi";
  dataForm: MutasiFormData;
}

type JenisMutasiView = "Warga Baru" | "Non-Aktif" | "Koreksi Data";

// ─────────────────────────── HELPERS ───────────────────────────

function mapPendudukToRT(p: any): PendudukRT {
  return {
    id: p.id,
    nik: p.nik,
    nama: p.nama,
    clusterdesaId: p.clusterdesaId,
    keluargaId: p.keluargaId || p.keluarga_id,
    agama: p.agama,
    jenisKelamin: p.jenisKelamin,
    tempatLahir: p.tempatLahir,
    tanggalLahir: p.tanggalLahir,
    statusPenduduk: p.statusPenduduk,
    statusVerifikasiDukcapil: p.statusVerifikasiDukcapil,
    terakhirDiperbarui: p.terakhirDiperbarui,
  };
}

function mapMutasiToRiwayatItem(m: any): RiwayatMutasiItem {
  return {
    id: m.id,
    tanggal: m.createdAt ? new Date(m.createdAt).toLocaleDateString("id-ID") : "-",
    jenis: m.jenisMutasi,
    nik: m.nik,
    nama: m.nama || "-",
    tempatLahir: m.tempatLahir,
    tanggalLahir: m.tanggalLahir,
    jenisKelamin: m.jenisKelamin,
    agama: m.agama,
    keluargaId: m.keluargaId,
    clusterdesaId: m.clusterdesaId,
    keterangan: m.keterangan || `(Metode Pengajuan: ${m.reqMethod || m.tipeProses})`,
    statusSekdes:
      m.status === "APPROVED"
        ? "✓ Disetujui Sekdes"
        : m.status === "REJECTED"
        ? "✕ Ditolak Sekdes"
        : m.status === "RESUBMITTED"
        ? "🔄 Pengajuan Ulang"
        : "⏳ Pending Sekdes",
    rawStatus: m.status,
    reqMethod: m.reqMethod || m.tipeProses,
    feedbackSekdes: m.feedbackSekdes,
    parent: m.parent,
    createdBy: m.createdBy,
    approvedBy: m.approvedBy,
  };
}

function mapJenisMutasiToSubAksi(jenis?: string): "baru" | "nonaktif" | "koreksi" {
  if (jenis === "Non-Aktif") return "nonaktif";
  if (jenis === "Koreksi Data") return "koreksi";
  return "baru";
}

function generateLocalId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const FILTER_JENIS = ["Semua", "Warga Baru", "Non-Aktif", "Koreksi Data"];

// ─────────────────────────── STATUS BADGE UTIL ───────────────────────────

function getStatusBadgeClass(rawStatus?: string) {
  if (rawStatus === "APPROVED") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (rawStatus === "REJECTED") return "bg-rose-50 text-rose-800 border-rose-200";
  return "bg-amber-50 text-amber-800 border-amber-200";
}

function getOfflineStatusBadge(status: OfflineMutasiItem["status"]) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "syncing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "synced":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "failed":
      return "bg-rose-50 text-rose-700 border-rose-200";
  }
}

function getOfflineStatusLabel(status: OfflineMutasiItem["status"]) {
  switch (status) {
    case "pending": return "⏳ Menunggu Sinkronisasi";
    case "syncing": return "🔄 Sedang Sync...";
    case "synced": return "✓ Tersinkronisasi";
    case "failed": return "✕ Gagal Sync";
  }
}

// ─────────────────────────── OFFLINE QUEUE PANEL ───────────────────────────

interface OfflineQueuePanelProps {
  queue: OfflineMutasiItem[];
  isOnline: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onDismissSynced: () => void;
}

function OfflineQueuePanel({ queue, isOnline, isSyncing, onSync, onDismissSynced }: OfflineQueuePanelProps) {
  if (queue.length === 0) return null;

  const pendingCount = queue.filter((q) => q.status === "pending" || q.status === "failed").length;
  const syncedCount = queue.filter((q) => q.status === "synced").length;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 bg-amber-100/60 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📦</span>
          <div>
            <p className="text-sm font-bold text-amber-900">Antrian Mutasi Offline</p>
            <p className="text-[11px] text-amber-700">
              {pendingCount} data menunggu sinkronisasi
              {syncedCount > 0 && ` · ${syncedCount} sudah tersinkron`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {syncedCount > 0 && (
            <button
              type="button"
              onClick={onDismissSynced}
              className="px-3 py-1.5 text-[11px] font-bold text-amber-700 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition cursor-pointer"
            >
              Hapus Tersinkron
            </button>
          )}
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={onSync}
              disabled={!isOnline || isSyncing}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                isOnline && !isSyncing
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-sm shadow-blue-600/20"
                  : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              }`}
            >
              {isSyncing ? (
                <>
                  <span className="animate-spin inline-block">⟳</span>
                  Menyinkronkan...
                </>
              ) : !isOnline ? (
                <>📵 Offline – Tidak bisa sync</>
              ) : (
                <>☁️ Sync Sekarang ({pendingCount})</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Queue Items */}
      <div className="divide-y divide-amber-100 max-h-64 overflow-y-auto">
        {queue.map((item) => (
          <div key={item.localId} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-amber-900 truncate">
                {item.payload.nama || item.payload.nik} —{" "}
                <span className="font-mono">{item.payload.jenisMutasi}</span>
              </p>
              <p className="text-[10px] font-mono text-amber-700 mt-0.5">
                NIK: {item.payload.nik} · {new Date(item.createdAt).toLocaleString("id-ID")}
              </p>
              {item.errorMsg && (
                <p className="text-[10px] text-rose-700 mt-0.5 truncate">⚠ {item.errorMsg}</p>
              )}
            </div>
            <span
              className={`shrink-0 px-2 py-1 rounded-lg border text-[10px] font-bold ${getOfflineStatusBadge(
                item.status
              )}`}
            >
              {getOfflineStatusLabel(item.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────── MAIN CONTENT ───────────────────────────

function MutasiContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunAktif = tahunPeriode === "2026";

  const [selectedNik, setSelectedNik] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [selectedDetailItem, setSelectedDetailItem] = useState<RiwayatMutasiItem | null>(null);
  const [resubmitSource, setResubmitSource] = useState<RiwayatMutasiItem | null>(null);

  // Network status
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "offline_queued">("idle");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Supabase hooks
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  const {
    data: realMutasiList,
    isLoading: isLoadingMutasi,
    submit: submitMutasiHook,
    resubmit: resubmitMutasiHook,
  } = useMutasi(tahunPeriode, currentUser?.id ?? null);
  const { data: realPendudukList } = usePenduduk();
  const { data: realKeluargaList } = useKeluarga();
  const { data: realClusterList } = useClusterDesa();

  // Live IndexedDB queue
  const offlineQueue = useLiveQuery(
    () => mutasiOfflineDB.offlineMutasi.orderBy("createdAt").reverse().toArray(),
    [],
    []
  ) as OfflineMutasiItem[];

  const getNoKkText = (keluargaId?: string | null) => {
    if (!keluargaId) return "-";
    const match = (realKeluargaList || []).find((k) => k.id === keluargaId);
    return match ? `${match.noKk} (${match.alamat})` : keluargaId;
  };

  const getClusterText = (clusterId?: string | null) => {
    if (!clusterId) return "-";
    const match = (realClusterList || []).find((c) => c.id === clusterId);
    return match ? `${match.nama} ${match.jenis ? `(${match.jenis})` : ""}` : clusterId;
  };

  const daftarWarga: PendudukRT[] = useMemo(() => {
    return (realPendudukList || []).map((p) =>
      mapPendudukToRT({
        id: p.id,
        nik: p.nik,
        nama: p.nama,
        clusterdesaId: p.clusterdesaId,
        jenisKelamin: (p.jenisKelamin === "P" ? "P" : "L") as "L" | "P",
        tempatLahir: p.tempat_lahir,
        tanggalLahir: p.tanggal_lahir,
        statusPenduduk: (["Tetap", "Pindah", "Meninggal"].includes(p.statusPenduduk)
          ? p.statusPenduduk
          : "Tetap") as "Tetap" | "Pindah" | "Meninggal",
        statusVerifikasiDukcapil: (p.statusVerifikasiDukcapil === "Anomali / Unverified"
          ? "Anomali / Unverified"
          : "Terverifikasi") as "Terverifikasi" | "Anomali / Unverified",
        terakhirDiperbarui: new Date(p.updated_at).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      })
    );
  }, [realPendudukList]);

  const riwayatMutasi: RiwayatMutasiItem[] = useMemo(() => {
    return (realMutasiList || []).map(mapMutasiToRiwayatItem);
  }, [realMutasiList]);

  const filteredData = useMemo(() => {
    return riwayatMutasi.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.keterangan.toLowerCase().includes(q);
      const matchFilter = filterJenis === "Semua" || item.jenis.includes(filterJenis);
      return matchSearch && matchFilter;
    });
  }, [riwayatMutasi, searchQuery, filterJenis]);

  const groupedMutasi = useMemo(() => {
    return {
      "Warga Baru": filteredData.filter((item) => item.jenis === "Warga Baru"),
      "Non-Aktif": filteredData.filter((item) => item.jenis === "Non-Aktif"),
      "Koreksi Data": filteredData.filter((item) => item.jenis === "Koreksi Data"),
    } satisfies Record<JenisMutasiView, RiwayatMutasiItem[]>;
  }, [filteredData]);

  // ─── Sync Queue ───
  const syncQueue = useCallback(async () => {
    if (!isOnline || isSyncing || !currentUser?.id) return;

    const pending = await mutasiOfflineDB.offlineMutasi
      .where("status")
      .anyOf(["pending", "failed"])
      .toArray();

    if (pending.length === 0) return;

    setIsSyncing(true);

    for (const item of pending) {
      await mutasiOfflineDB.offlineMutasi.update(item.localId, {
        status: "syncing",
        updatedAt: new Date().toISOString(),
      });

      try {
        await submitMutasiHook(item.payload, item.createdBy, "RT");
        await mutasiOfflineDB.offlineMutasi.update(item.localId, {
          status: "synced",
          errorMsg: undefined,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        await mutasiOfflineDB.offlineMutasi.update(item.localId, {
          status: "failed",
          errorMsg: (err as Error).message,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    setIsSyncing(false);
  }, [isOnline, isSyncing, currentUser?.id, submitMutasiHook]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncQueue();
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const dismissSynced = useCallback(async () => {
    await mutasiOfflineDB.offlineMutasi.where("status").equals("synced").delete();
  }, []);

  // ─── Mutasi Submit ───
  const buildPayload = (
    data: MutasiFormSubmitData
  ): { payload: MutasiSubmitPayload; error?: string } => {
    if (!currentUser?.id) return { payload: {} as any, error: "Session RT tidak ditemukan. Silakan login ulang." };

    const kategoriAksi = data.kategoriAksi;
    const formData = data.dataForm;
    const nik = (formData?.nik || selectedNik || "").trim();
    const wargaReferensi = daftarWarga.find((item) => item.nik === nik);

    if (!nik) return { payload: {} as any, error: "NIK wajib dipilih atau diisi." };

    const jenisMutasiMap = {
      baru: "Warga Baru",
      nonaktif: "Non-Aktif",
      koreksi: "Koreksi Data",
    } as const;

    const jenisMutasi = jenisMutasiMap[kategoriAksi as keyof typeof jenisMutasiMap] || "Warga Baru";
    const isNonAktif = kategoriAksi === "nonaktif";

    const nama = (formData?.nama || wargaReferensi?.nama || "").trim();
    const tempatLahir = (formData?.tempatLahir || wargaReferensi?.tempatLahir || "").trim();
    const tanggalLahir = (formData?.tanggalLahir || wargaReferensi?.tanggalLahir || "").trim();
    const jenisKelamin = (formData?.jenisKelamin || wargaReferensi?.jenisKelamin || "").trim();
    const keterangan = (formData?.keterangan || "").trim();

    if (isNonAktif) {
      if (!keterangan) return { payload: {} as any, error: "Keterangan wajib diisi untuk mutasi non-aktif." };
      if (!wargaReferensi) return { payload: {} as any, error: "Data warga untuk NIK tersebut tidak ditemukan." };
    } else {
      if (!nama) return { payload: {} as any, error: "Nama lengkap warga wajib diisi." };
      if (!jenisKelamin) return { payload: {} as any, error: "Jenis kelamin wajib dipilih." };
      if (!tempatLahir) return { payload: {} as any, error: "Tempat lahir wajib diisi." };
      if (!tanggalLahir) return { payload: {} as any, error: "Tanggal lahir wajib diisi." };
    }

    const payload: MutasiSubmitPayload = {
      nik,
      nama: isNonAktif ? null : nama || wargaReferensi?.nama || null,
      tempatLahir: isNonAktif ? null : tempatLahir || wargaReferensi?.tempatLahir || null,
      tanggalLahir: isNonAktif ? null : tanggalLahir || wargaReferensi?.tanggalLahir || null,
      jenisKelamin: isNonAktif ? null : jenisKelamin || wargaReferensi?.jenisKelamin || null,
      agama: isNonAktif ? null : formData.agama || wargaReferensi?.agama || "Islam",
      keluargaId: isNonAktif ? null : formData.keluargaId || wargaReferensi?.keluargaId || null,
      clusterdesaId: isNonAktif ? null : formData.clusterdesaId || wargaReferensi?.clusterdesaId || null,
      jenisMutasi: jenisMutasi as any,
      keterangan: keterangan || null,
      tipeProses: "OFFLINE",
      reqMethod: "OFFLINE",
      tahunPeriode: tahunPeriode,
      createdBy: currentUser.id,
    };

    return { payload };
  };

  const handleMutasiSubmit = async (e: React.FormEvent, data: MutasiFormSubmitData) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { payload, error } = buildPayload(data);
      if (error) throw new Error(error);

      // Try online first
      if (isOnline) {
        try {
          if (resubmitSource) {
            const resubmitPayload: MutasiResubmitPayload = {
              nik: payload.nik,
              nama: payload.nama || undefined,
              tempatLahir: payload.tempatLahir || undefined,
              tanggalLahir: payload.tanggalLahir || undefined,
              jenisKelamin: payload.jenisKelamin || undefined,
              agama: payload.agama || undefined,
              keluargaId: payload.keluargaId || undefined,
              clusterdesaId: payload.clusterdesaId || undefined,
              keterangan: payload.keterangan || undefined,
              tipeProses: payload.tipeProses,
              reqMethod: payload.reqMethod,
            };
            await resubmitMutasiHook(resubmitSource.id, resubmitPayload, currentUser!.id, "RT");
          } else {
            await submitMutasiHook(payload, currentUser!.id, "RT");
          }
          setSubmitStatus("success");
          closeMutasiModal();
          return;
        } catch (networkErr) {
          // Network error or Supabase error → fallthrough to offline queue
          console.warn("Online submit failed, queuing offline:", networkErr);
        }
      }

      // Save to IndexedDB offline queue
      const now = new Date().toISOString();
      await mutasiOfflineDB.offlineMutasi.add({
        localId: generateLocalId(),
        payload,
        createdBy: currentUser!.id,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      });

      setSubmitStatus("offline_queued");
      closeMutasiModal(); // close modal, data safe in queue
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data mutasi: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNewMutasiModal = () => {
    setResubmitSource(null);
    setSelectedNik("");
    setSubmitStatus("idle");
    setShowModal(true);
  };

  const openResubmitModal = (item: RiwayatMutasiItem) => {
    setSelectedDetailItem(null);
    setResubmitSource(item);
    setSelectedNik(item.nik);
    setSubmitStatus("idle");
    setShowModal(true);
  };

  const closeMutasiModal = () => {
    setShowModal(false);
    setResubmitSource(null);
  };

  // ─── Status Badge ───
  const renderStatusBadge = (item: RiwayatMutasiItem) => (
    <span className={`shrink-0 px-2 py-1 rounded-lg border text-[10px] font-bold ${getStatusBadgeClass(item.rawStatus)}`}>
      {item.statusSekdes}
    </span>
  );

  // ─── Desktop Table ───
  const renderDesktopTable = (jenis: JenisMutasiView, items: RiwayatMutasiItem[]) => {
    if (items.length === 0) return null;
    const isWargaBaru = jenis === "Warga Baru";

    return (
      <section className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-950">{jenis}</h3>
            <p className="text-[11px] text-slate-500">Menampilkan {items.length} data mutasi {jenis.toLowerCase()}.</p>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            Total: {items.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Tgl Lapor</th>
                <th className="px-5 py-3">Warga Terkait</th>
                {isWargaBaru && <th className="px-5 py-3">TTL &amp; JK</th>}
                {jenis === "Koreksi Data" && <th className="px-5 py-3">Data Koreksi</th>}
                <th className="px-5 py-3">Keterangan</th>
                <th className="px-5 py-3 text-right">Status Sekdes</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">{item.tanggal}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900 text-xs">{item.nama}</p>
                    <p className="font-mono text-[11px] text-slate-400">NIK: {item.nik}</p>
                  </td>
                  {isWargaBaru && (
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">{item.tempatLahir || "-"}, {item.tanggalLahir || "-"}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.jenisKelamin === "P" ? "Perempuan (P)" : "Laki-Laki (L)"}
                      </p>
                    </td>
                  )}
                  {jenis === "Koreksi Data" && (
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">{item.tempatLahir || "-"}, {item.tanggalLahir || "-"}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.jenisKelamin === "P" ? "Perempuan (P)" : "Laki-Laki (L)"}
                      </p>
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-xs text-slate-600">{item.keterangan}</td>
                  <td className="px-5 py-3.5 text-right">{renderStatusBadge(item)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailItem(item)}
                      className="px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  // ─── RENDER ───
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased relative">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/rt?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition self-start"
          >
            ← Kembali ke Panel RT
          </Link>
          <div className="flex items-center gap-2">
            {/* Online/Offline Indicator */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border ${
                isOnline
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              {isOnline ? "Online" : "Offline"}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
              📅 Periode: <strong className="text-slate-900">{tahunPeriode}</strong>
            </span>
          </div>
        </div>

        {/* Offline Queue Panel */}
        {offlineQueue && offlineQueue.length > 0 && (
          <OfflineQueuePanel
            queue={offlineQueue}
            isOnline={isOnline}
            isSyncing={isSyncing}
            onSync={syncQueue}
            onDismissSynced={dismissSynced}
          />
        )}

        {/* Submit feedback banners */}
        {submitStatus === "offline_queued" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-amber-800">
              📦 Data mutasi disimpan ke antrian offline. Akan otomatis dikirim saat ada koneksi internet.
            </p>
            <button
              type="button"
              onClick={() => setSubmitStatus("idle")}
              className="text-amber-700 text-xs font-bold hover:text-amber-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {submitStatus === "success" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-emerald-800">
              ✓ Laporan mutasi berhasil dikirimkan ke Sekretaris Desa!
            </p>
            <button
              type="button"
              onClick={() => setSubmitStatus("idle")}
              className="text-emerald-700 text-xs font-bold hover:text-emerald-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Riwayat Mutasi &amp; Kependudukan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar transaksi mutasi warga tahun {tahunPeriode}
              </p>
            </div>

            {isTahunAktif && (
              <button
                type="button"
                onClick={openNewMutasiModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-blue-600/20 cursor-pointer"
              >
                <span className="text-sm leading-none">+</span>
                Input Mutasi Baru
              </button>
            )}
          </div>

          {/* Search + Filter */}
          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama, NIK, atau keterangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-blue-500"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500 sm:min-w-[180px] cursor-pointer"
            >
              {FILTER_JENIS.map((j) => (
                <option key={j} value={j}>
                  {j === "Semua" ? "Semua Jenis Mutasi" : j}
                </option>
              ))}
            </select>
          </div>

          {/* Content Area */}
          {isLoadingMutasi || isAuthLoading ? (
            <div className="p-10 text-center text-xs text-slate-400">
              Memuat data mutasi dari Supabase...
            </div>
          ) : (
            <>
              {filteredData.length > 0 ? (
                <div className="space-y-6 p-4 sm:p-5">
                  {/* Mobile Cards */}
                  <div className="sm:hidden space-y-4">
                    {(["Warga Baru", "Non-Aktif", "Koreksi Data"] as JenisMutasiView[]).map((jenis) => {
                      const items = groupedMutasi[jenis];
                      if (items.length === 0) return null;
                      const isWargaBaru = jenis === "Warga Baru";

                      return (
                        <section key={jenis} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-bold text-slate-950">{jenis}</h3>
                              <p className="text-[11px] text-slate-500">{items.length} data ditemukan.</p>
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                              Total: {items.length}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                              <div key={item.id} className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 text-sm truncate">{item.nama}</p>
                                    <p className="font-mono text-[11px] text-slate-400 mt-0.5">{item.nik}</p>
                                  </div>
                                  {renderStatusBadge(item)}
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100">{item.jenis}</span>
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono">Req: {item.reqMethod}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">{item.tanggal}</span>
                                </div>

                                {isWargaBaru && (
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.tempatLahir || "-"}, {item.tanggalLahir || "-"} · {item.jenisKelamin === "P" ? "Perempuan (P)" : "Laki-Laki (L)"}
                                  </p>
                                )}

                                <p className="text-xs text-slate-600 leading-relaxed">{item.keterangan}</p>

                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailItem(item)}
                                    className="w-full py-2 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
                                  >
                                    Lihat Detail
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>

                  {/* Desktop Tables */}
                  <div className="hidden sm:block space-y-6">
                    {renderDesktopTable("Warga Baru", groupedMutasi["Warga Baru"])}
                    {renderDesktopTable("Non-Aktif", groupedMutasi["Non-Aktif"])}
                    {renderDesktopTable("Koreksi Data", groupedMutasi["Koreksi Data"])}
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-slate-400 text-xs">
                  {searchQuery || filterJenis !== "Semua"
                    ? "Tidak ada data yang cocok dengan pencarian / filter."
                    : `Belum ada riwayat mutasi pada tahun ${tahunPeriode}.`}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredData.length} dari {riwayatMutasi.length} data mutasi
          </div>
        </div>
      </div>

      {/* Modal Input Mutasi */}
      {showModal && isTahunAktif && (
        <FormMutasiLengkap
          tahunPeriode={tahunPeriode}
          daftarWarga={daftarWarga}
          daftarKeluarga={realKeluargaList}
          daftarCluster={realClusterList}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitMutasi={handleMutasiSubmit}
          onClose={closeMutasiModal}
          initialSubAksi={resubmitSource ? mapJenisMutasiToSubAksi(resubmitSource.jenis) : undefined}
          initialFormDetail={
            resubmitSource
              ? {
                  nik: resubmitSource.nik,
                  nama: resubmitSource.nama,
                  jenisKelamin: (resubmitSource.jenisKelamin === "P" ? "P" : "L") as "L" | "P",
                  tempatLahir: resubmitSource.tempatLahir || "Kab. Malang",
                  tanggalLahir: resubmitSource.tanggalLahir || "",
                  agama: resubmitSource.agama || "Islam",
                  keluargaId: resubmitSource.keluargaId || "",
                  clusterdesaId: resubmitSource.clusterdesaId || "",
                  keterangan: resubmitSource.keterangan || "",
                }
              : undefined
          }
          lockSubAksi={!!resubmitSource}
          resubmitInfo={
            resubmitSource
              ? `Mode pengajuan ulang. Parent akan diisi otomatis ke pengajuan sebelumnya: ${resubmitSource.id}`
              : undefined
          }
        />
      )}

      {/* Submitting overlay indicator */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3">
            <span className="text-2xl animate-spin">⟳</span>
            <p className="text-sm font-bold text-slate-900">Mengirim data mutasi...</p>
            <p className="text-xs text-slate-500">Jika tidak ada koneksi, data akan disimpan offline</p>
          </div>
        </div>
      )}

      {/* Drawer Rincian Mutasi */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px] transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    DETAIL LAPORAN MUTASI RT
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 mt-1">
                    {selectedDetailItem.nama}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDetailItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Detail Fields */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Kategori Mutasi</span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg border border-blue-100">
                      {selectedDetailItem.jenis}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Metode Pengajuan</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                      {selectedDetailItem.reqMethod || "OFFLINE"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Status Verifikasi Sekdes</span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                      {selectedDetailItem.statusSekdes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Tanggal Dilaporkan</span>
                    <span className="font-mono font-bold text-slate-800">{selectedDetailItem.tanggal}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    👤 Data Kependudukan Warga Terkait
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama Lengkap</span>
                      <span className="font-bold text-slate-900">{selectedDetailItem.nama}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">NIK</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDetailItem.nik}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Jenis Kelamin</span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.jenisKelamin === "P" ? "Perempuan (P)" : "Laki-Laki (L)"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Tempat, Tanggal Lahir</span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.tempatLahir || "Kab. Malang"},{" "}
                        {selectedDetailItem.tanggalLahir || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Agama</span>
                      <span className="font-semibold text-slate-800">{selectedDetailItem.agama || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Nomor KK</span>
                      <span className="font-mono font-semibold text-slate-900">{getNoKkText(selectedDetailItem.keluargaId)}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Cluster Desa</span>
                      <span className="font-semibold text-slate-800">{getClusterText(selectedDetailItem.clusterdesaId)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    🔗 Tracking Pengajuan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Dibuat Oleh</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDetailItem.createdBy || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Disetujui Oleh</span>
                      <span className="font-mono font-bold text-slate-900">{selectedDetailItem.approvedBy || "-"}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Parent / Riwayat Revisi</span>
                      <span className="font-mono font-bold text-slate-900 break-all">{selectedDetailItem.parent || "-"}</span>
                    </div>
                  </div>
                </div>

                {selectedDetailItem.feedbackSekdes && (
                  <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 space-y-1">
                    <span className="text-[10px] text-rose-800 font-extrabold uppercase block">
                      Catatan Feedback Sekdes:
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {selectedDetailItem.feedbackSekdes}
                    </p>
                  </div>
                )}

                {selectedDetailItem.rawStatus === "REJECTED" && isTahunAktif && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => openResubmitModal(selectedDetailItem)}
                      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-blue-600/20 cursor-pointer"
                    >
                      Ajukan Ulang dengan Parent Pengajuan Ini
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                ID Transaksi: {selectedDetailItem.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Layar Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── PAGE EXPORT ───────────────────────────

export default function HalamanMutasi() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Riwayat Mutasi...
        </div>
      }
    >
      <MutasiContent />
    </Suspense>
  );
}
