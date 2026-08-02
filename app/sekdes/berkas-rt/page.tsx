"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutasi } from "@/hooks/cores/useMutasi";
import type { MutasiPengajuan } from "@/types/mutasi";

const STATUS_FILTER_OPTIONS = ["Semua", "PENDING", "APPROVED", "REJECTED", "RESUBMITTED"] as const;
type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number];

/* ─────────────────── helpers ─────────────────── */

function formatTanggal(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTanggalPanjang(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function getStatusMeta(status?: string) {
  switch (status) {
    case "APPROVED":
      return { label: "Disetujui", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" } as const;
    case "REJECTED":
      return { label: "Ditolak", badge: "bg-rose-100 text-rose-800 border-rose-200", dot: "bg-rose-500" } as const;
    case "RESUBMITTED":
      return { label: "Revisi Dikirim", badge: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500" } as const;
    default:
      return { label: "Menunggu", badge: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-amber-400" } as const;
  }
}

/* ─────────────────── types ─────────────────── */

interface PengajuanGroup {
  /** ID pengajuan asal (tanpa parent) */
  rootId: string;
  root: MutasiPengajuan;
  /** Semua revisi (termasuk root, urut dari terlama ke terbaru) */
  revisions: MutasiPengajuan[];
  /** Pengajuan terbaru = yang akan ditindaklanjuti */
  latest: MutasiPengajuan;
  revisiCount: number;
}

/* ─────────────────── History Modal ─────────────────── */

function HistoryModal({
  group,
  onClose,
}: {
  group: PengajuanGroup;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Riwayat Pengajuan</p>
            <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{group.root.nama}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-sm flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Timeline */}
        <div className="overflow-y-auto px-6 py-4 space-y-0 flex-1">
          {group.revisions.map((rev, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === group.revisions.length - 1;
            const meta = getStatusMeta(rev.status);
            return (
              <div key={rev.id} className="relative flex gap-4">
                {/* connector line */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 border-white ring-2 flex-shrink-0 mt-1 ${meta.dot} ring-offset-1`} />
                  {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>

                {/* content */}
                <div className={`pb-5 flex-1 ${isLast ? "" : ""}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatTanggalPanjang(rev.createdAt)}
                      </span>
                      {isFirst && (
                        <span className="ml-2 text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          PENGAJUAN AWAL
                        </span>
                      )}
                      {isLast && !isFirst && (
                        <span className="ml-2 text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">
                          REVISI TERBARU
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold whitespace-nowrap ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  {rev.keterangan && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                      {rev.keterangan}
                    </p>
                  )}
                  {rev.feedbackSekdes && (
                    <p className="text-xs text-rose-700 mt-1.5 leading-relaxed bg-rose-50 rounded-lg px-3 py-2 border border-rose-100">
                      <span className="font-bold">Catatan Sekdes:</span> {rev.feedbackSekdes}
                    </p>
                  )}
                  {!rev.keterangan && !rev.feedbackSekdes && (
                    <p className="text-[11px] text-slate-400 mt-1 italic">Tidak ada catatan.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Detail Drawer ─────────────────── */

function DetailDrawer({
  group,
  currentUserId,
  feedbackDraft,
  setFeedbackDraft,
  onApprove,
  onReject,
  onClose,
}: {
  group: PengajuanGroup;
  currentUserId?: string;
  feedbackDraft: string;
  setFeedbackDraft: (v: string) => void;
  onApprove: (item: MutasiPengajuan) => void;
  onReject: (item: MutasiPengajuan) => void;
  onClose: () => void;
}) {
  const [showHistory, setShowHistory] = useState(false);
  const { latest, revisiCount } = group;
  const meta = getStatusMeta(latest.status);
  const canReview = latest.status === "PENDING" || latest.status === "RESUBMITTED";

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
        <div
          className="w-full md:w-[480px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Detail Pengajuan
                </span>
                <h3 className="text-base font-extrabold text-slate-950 mt-1 truncate">{latest.nama}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">NIK: {latest.nik}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-sm flex items-center justify-center transition cursor-pointer flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Status + Revisi info */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${meta.badge}`}>
                {meta.label}
              </span>
              {revisiCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer"
                >
                  🕐 {revisiCount} Revisi — Lihat Riwayat
                </button>
              )}
              {revisiCount === 0 && (
                <span className="text-xs text-slate-400">Belum ada revisi</span>
              )}
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Info Warga */}
            <section className="bg-slate-50 rounded-2xl border border-slate-200/80 divide-y divide-slate-200/60">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Jenis Mutasi</span>
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-100">
                  {latest.jenisMutasi}
                </span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Tanggal Lapor</span>
                <span className="text-xs font-bold text-slate-700 font-mono">{formatTanggal(latest.createdAt)}</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Metode</span>
                <span className="text-xs font-bold text-slate-700">{latest.reqMethod || latest.tipeProses}</span>
              </div>
              {latest.approvedBy && (
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Diproses Oleh</span>
                  <span className="text-xs font-mono text-slate-700">{latest.approvedBy}</span>
                </div>
              )}
            </section>

            {/* Catatan Pengajuan */}
            {latest.keterangan && (
              <section>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Catatan Pengajuan</p>
                <p className="text-xs text-slate-700 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 leading-relaxed">
                  {latest.keterangan}
                </p>
              </section>
            )}

            {/* Feedback Sekdes (jika ada) */}
            {latest.feedbackSekdes && (
              <section>
                <p className="text-[10px] font-bold uppercase text-rose-500 mb-1.5">Catatan Penolakan Sebelumnya</p>
                <p className="text-xs text-rose-800 bg-rose-50 rounded-xl border border-rose-200 px-4 py-3 leading-relaxed">
                  {latest.feedbackSekdes}
                </p>
              </section>
            )}

            {/* Form review */}
            {canReview && (
              <section className="space-y-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Catatan Penolakan <span className="text-rose-400">(wajib jika ditolak)</span>
                  </label>
                  <textarea
                    value={feedbackDraft}
                    onChange={(e) => setFeedbackDraft(e.target.value)}
                    placeholder="Tuliskan alasan penolakan atau perbaikan yang harus dilakukan RT..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-400 resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(latest)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    ✓ Setujui Pengajuan
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(latest)}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    ✕ Tolak Pengajuan
                  </button>
                </div>
              </section>
            )}

            {!canReview && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
                Pengajuan ini sudah selesai diproses.
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-shrink-0">
            <span className="text-[10px] text-slate-400 font-mono">Periode: {latest.tahunPeriode}</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <HistoryModal group={group} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}

/* ─────────────────── Main Page ─────────────────── */

function HalamanValidasiBerkasRT() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const { user: currentUser } = useAuth();
  const { data: daftarMutasi, isLoading, error, verifySekdes } = useMutasi(tahunPeriode);

  const [filterStatus, setFilterStatus] = useState<StatusFilter>("Semua");
  const [filterRT, setFilterRT] = useState<string>("Semua RT");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);

  /* Group by root (entry without parent) */
  const groups = useMemo<PengajuanGroup[]>(() => {
    // Find all root items (no parent)
    const roots = daftarMutasi.filter((item) => !item.parent);

    return roots.map((root) => {
      // Collect all revisions that belong to this root chain
      const chain: MutasiPengajuan[] = [root];
      // DFS: find items whose parent is any id in the chain
      const addChildren = (parentId: string) => {
        const children = daftarMutasi.filter((item) => item.parent === parentId);
        for (const child of children) {
          chain.push(child);
          addChildren(child.id);
        }
      };
      addChildren(root.id);

      // Sort ascending (oldest first) for history display
      chain.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const latest = chain[chain.length - 1];
      return {
        rootId: root.id,
        root,
        revisions: chain,
        latest,
        revisiCount: chain.length - 1,
      };
    });
  }, [daftarMutasi]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.rootId === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  useEffect(() => {
    setFeedbackDraft(selectedGroup?.latest?.feedbackSekdes || "");
  }, [selectedGroup?.rootId, selectedGroup?.latest?.feedbackSekdes]);

  const uniqueRTs = useMemo(() => {
    const rts = new Set(daftarMutasi.map((item) => item.clusterdesaId || "Unknown"));
    return Array.from(rts).sort();
  }, [daftarMutasi]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return groups.filter((g) => {
      const { latest, root } = g;

      const matchStatus =
        filterStatus === "Semua" || (latest.status || "PENDING") === filterStatus;

      const matchRT =
        filterRT === "Semua RT" || (latest.clusterdesaId || "Unknown") === filterRT;

      const matchSearch =
        !term ||
        latest.nama?.toLowerCase().includes(term) ||
        latest.nik?.toLowerCase().includes(term) ||
        latest.jenisMutasi?.toLowerCase().includes(term) ||
        latest.keterangan?.toLowerCase().includes(term) ||
        root.nama?.toLowerCase().includes(term) ||
        root.nik?.toLowerCase().includes(term);

      return matchStatus && matchRT && matchSearch;
    });
  }, [groups, filterStatus, filterRT, searchTerm]);

  const pendingCount = useMemo(
    () => groups.filter((g) => g.latest.status === "PENDING" || g.latest.status === "RESUBMITTED").length,
    [groups]
  );

  const approveItem = async (item: MutasiPengajuan) => {
    if (!currentUser?.id) {
      setNotif({ type: "error", message: "Session Sekdes tidak ditemukan. Silakan login ulang." });
      return;
    }
    try {
      await verifySekdes(item.id, true, undefined, currentUser.id);
      setNotif({ type: "success", message: `Pengajuan ${item.nama || item.nik} berhasil disetujui.` });
    } catch (err) {
      setNotif({ type: "error", message: (err as Error).message || "Gagal menyetujui pengajuan." });
    }
  };

  const rejectItem = async (item: MutasiPengajuan) => {
    if (!currentUser?.id) {
      setNotif({ type: "error", message: "Session Sekdes tidak ditemukan. Silakan login ulang." });
      return;
    }
    const feedback = feedbackDraft.trim();
    if (!feedback) {
      setNotif({ type: "error", message: "Catatan penolakan wajib diisi sebelum menolak pengajuan." });
      return;
    }
    try {
      await verifySekdes(item.id, false, feedback, currentUser.id);
      setNotif({ type: "success", message: `Pengajuan ${item.nama || item.nik} ditolak.` });
    } catch (err) {
      setNotif({ type: "error", message: (err as Error).message || "Gagal menolak pengajuan." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition self-start"
          >
            ← Kembali
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Periode: <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* Notifikasi */}
        {notif && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold border ${
              notif.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {notif.message}
          </div>
        )}
        {error && (
          <div className="p-3.5 rounded-xl text-xs font-semibold border bg-rose-50 border-rose-200 text-rose-900">
            Gagal memuat data: {error.message}
          </div>
        )}

        {/* Header + Stats */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-extrabold text-slate-950">Verifikasi Pengajuan Mutasi RT</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap baris adalah satu pengajuan. Jika ada revisi, klik "Lihat Riwayat" di panel detail.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center min-w-[80px]">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Total</span>
                <span className="text-xl font-black text-slate-950">{groups.length}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-center min-w-[80px]">
                <span className="block text-[10px] font-bold uppercase text-amber-700">Perlu Ditinjau</span>
                <span className="text-xl font-black text-amber-950">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Cari nama atau NIK warga..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:bg-white transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              {STATUS_FILTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "Semua" ? "Semua Status" : s === "PENDING" ? "Menunggu" : s === "APPROVED" ? "Disetujui" : s === "REJECTED" ? "Ditolak" : "Revisi Dikirim"}
                </option>
              ))}
            </select>
            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="Semua RT">Semua RT</option>
              {uniqueRTs.map((rt) => (
                <option key={rt} value={rt}>
                  {rt === "Unknown" ? "RT Tidak Diketahui" : `Cluster: ${rt}`}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Memuat data pengajuan...</div>
          ) : filteredGroups.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Warga</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Tanggal Lapor</th>
                    <th className="px-4 py-3 text-center">Revisi</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGroups.map((g) => {
                    const meta = getStatusMeta(g.latest.status);
                    const needsAction = g.latest.status === "PENDING" || g.latest.status === "RESUBMITTED";

                    return (
                      <tr
                        key={g.rootId}
                        className={`hover:bg-slate-50/70 transition ${needsAction ? "bg-amber-50/30" : ""}`}
                      >
                        {/* Warga */}
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900 text-xs">{g.latest.nama || "-"}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{g.latest.nik || "-"}</p>
                        </td>

                        {/* Jenis */}
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md border border-indigo-100">
                            {g.latest.jenisMutasi}
                          </span>
                        </td>

                        {/* Tanggal */}
                        <td className="px-4 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                          {formatTanggal(g.root.createdAt)}
                        </td>

                        {/* Revisi count */}
                        <td className="px-4 py-3.5 text-center">
                          {g.revisiCount > 0 ? (
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                              {g.revisiCount}×
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-300">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold whitespace-nowrap ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedGroupId(g.rootId)}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                              needsAction
                                ? "text-white bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
                                : "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-100"
                            }`}
                          >
                            {needsAction ? "Tinjau →" : "Detail"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              {searchTerm || filterStatus !== "Semua"
                ? "Tidak ada data yang cocok dengan pencarian / filter."
                : `Belum ada pengajuan mutasi pada periode ${tahunPeriode}.`}
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedGroup && (
        <DetailDrawer
          group={selectedGroup}
          currentUserId={currentUser?.id}
          feedbackDraft={feedbackDraft}
          setFeedbackDraft={setFeedbackDraft}
          onApprove={approveItem}
          onReject={rejectItem}
          onClose={() => setSelectedGroupId(null)}
        />
      )}
    </div>
  );
}

export function HalamanValidasiBerkasRTWrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">Memuat Validasi Berkas RT...</div>
      }
    >
      <HalamanValidasiBerkasRT />
    </Suspense>
  );
}

export default HalamanValidasiBerkasRTWrapper;
