"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMutasi } from "@/hooks/cores/useMutasi";
import type { MutasiPengajuan } from "@/types/mutasi";

const STATUS_FILTER_OPTIONS = ["Semua", "PENDING", "APPROVED", "REJECTED", "RESUBMITTED"] as const;

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number];

function formatTanggal(value?: string | null) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusMeta(status?: string) {
  switch (status) {
    case "APPROVED":
      return {
        label: "APPROVED",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      } as const;
    case "REJECTED":
      return {
        label: "REJECTED",
        badge: "bg-rose-100 text-rose-800 border-rose-200",
      } as const;
    case "RESUBMITTED":
      return {
        label: "RESUBMITTED",
        badge: "bg-blue-100 text-blue-800 border-blue-200",
      } as const;
    default:
      return {
        label: "PENDING",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
      } as const;
  }
}

function HalamanValidasiBerkasRT() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const { user: currentUser } = useAuth();
  const {
    data: daftarMutasi,
    isLoading,
    error,
    verifySekdes,
  } = useMutasi(tahunPeriode);

  const [filterStatus, setFilterStatus] = useState<StatusFilter>("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMutasiId, setSelectedMutasiId] = useState<string | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [notif, setNotif] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const selectedItem = useMemo(() => {
    return daftarMutasi.find((item) => item.id === selectedMutasiId) || null;
  }, [daftarMutasi, selectedMutasiId]);

  useEffect(() => {
    setFeedbackDraft(selectedItem?.feedbackSekdes || "");
  }, [selectedItem?.id, selectedItem?.feedbackSekdes]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return daftarMutasi.filter((item) => {
      const matchStatus =
        filterStatus === "Semua" || (item.status || "PENDING") === filterStatus;

      const matchSearch =
        !term ||
        item.nama?.toLowerCase().includes(term) ||
        item.nik?.toLowerCase().includes(term) ||
        item.jenisMutasi?.toLowerCase().includes(term) ||
        item.keterangan?.toLowerCase().includes(term) ||
        item.feedbackSekdes?.toLowerCase().includes(term) ||
        item.parent?.toLowerCase().includes(term);

      return matchStatus && matchSearch;
    });
  }, [daftarMutasi, filterStatus, searchTerm]);

  const pendingCount = useMemo(() => {
    return daftarMutasi.filter(
      (item) => item.status === "PENDING" || item.status === "RESUBMITTED"
    ).length;
  }, [daftarMutasi]);

  const approveItem = async (item: MutasiPengajuan) => {
    if (!currentUser?.id) {
      setNotif({
        type: "error",
        message: "Session Sekdes tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    try {
      await verifySekdes(item.id, true, undefined, currentUser.id);
      setNotif({
        type: "success",
        message: `Pengajuan ${item.nama || item.nik} berhasil disetujui.`,
      });
    } catch (err) {
      setNotif({
        type: "error",
        message: (err as Error).message || "Gagal menyetujui pengajuan.",
      });
    }
  };

  const rejectItem = async (item: MutasiPengajuan) => {
    if (!currentUser?.id) {
      setNotif({
        type: "error",
        message: "Session Sekdes tidak ditemukan. Silakan login ulang.",
      });
      return;
    }

    const feedback = feedbackDraft.trim();
    if (!feedback) {
      setNotif({
        type: "error",
        message: "Feedback wajib diisi sebelum menolak pengajuan.",
      });
      return;
    }

    try {
      await verifySekdes(item.id, false, feedback, currentUser.id);
      setNotif({
        type: "success",
        message: `Pengajuan ${item.nama || item.nik} ditolak dengan feedback tersimpan.`,
      });
    } catch (err) {
      setNotif({
        type: "error",
        message: (err as Error).message || "Gagal menolak pengajuan.",
      });
    }
  };

  const canReview =
    !!selectedItem &&
    (selectedItem.status === "PENDING" || selectedItem.status === "RESUBMITTED");

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition self-start"
          >
            ← Kembali ke Workspace Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode: <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {notif && (
          <div
            className={`p-4 rounded-xl text-xs font-bold shadow-sm border ${
              notif.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                : "bg-rose-50 border-rose-200 text-rose-950"
            }`}
          >
            {notif.message}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl text-xs font-bold shadow-sm border bg-rose-50 border-rose-200 text-rose-950">
            Gagal memuat data mutasi: {error.message}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-xs font-bold mb-1">
                📋 Antrean Verifikasi Sekdes
              </div>
              <h2 className="text-lg font-bold text-slate-950">
                Pemeriksaan Pengajuan Mutasi RT ({tahunPeriode})
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl">
                Data diambil langsung dari tweb_mutasi_pengajuan untuk periode tahun ini.
                Approve akan mengisi approved_by dari akun Sekdes login, dan reject wajib disimpan dengan feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Pengajuan
                </span>
                <span className="text-base font-black text-slate-950">{daftarMutasi.length}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/70">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Menunggu Review
                </span>
                <span className="text-base font-black text-amber-950">{pendingCount}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-indigo-50 border border-indigo-200/70">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Login Sekdes
                </span>
                <span className="text-xs font-black text-indigo-950 break-all">
                  {currentUser?.nama || currentUser?.id || "Belum login"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-xl">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari nama, NIK, jenis mutasi, catatan, atau parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-bold text-slate-500">
                Filter Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                {STATUS_FILTER_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "Semua" ? "Semua Status" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="p-10 text-center text-xs text-slate-400">
              Memuat data pengajuan mutasi dari Supabase...
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse min-w-240">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Waktu Lapor</th>
                    <th className="px-5 py-3.5">Warga / NIK</th>
                    <th className="px-5 py-3.5">Jenis Mutasi</th>
                    <th className="px-5 py-3.5">Catatan / Detail</th>
                    <th className="px-5 py-3.5">Tracking</th>
                    <th className="px-5 py-3.5 text-right">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredData.map((item) => {
                    const statusMeta = getStatusMeta(item.status);
                    const isReviewable =
                      item.status === "PENDING" || item.status === "RESUBMITTED";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 transition cursor-pointer"
                        onClick={() => setSelectedMutasiId(item.id)}
                      >
                        <td className="px-5 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                          {formatTanggal(item.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-950 text-xs">
                            {item.nama || "-"}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400">
                            NIK: {item.nik || "-"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-100 whitespace-nowrap">
                            {item.jenisMutasi}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600 max-w-xs">
                          <p className="leading-relaxed">
                            {item.keterangan || "-"}
                          </p>
                          {item.feedbackSekdes && (
                            <p className="mt-1 text-[11px] text-rose-700 font-medium">
                              Feedback: {item.feedbackSekdes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600">
                          {item.parent ? (
                            <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] break-all">
                              Parent: {item.parent.slice(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold whitespace-nowrap ${statusMeta.badge}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMutasiId(item.id);
                            }}
                            className="px-3 py-1.5 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition cursor-pointer"
                          >
                            Detail
                          </button>
                          {isReviewable && (
                            <span className="ml-2 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                              Perlu tindak lanjut
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              {searchTerm || filterStatus !== "Semua"
                ? "Tidak ada data yang cocok dengan pencarian / filter."
                : `Belum ada pengajuan mutasi pada periode tahun ${tahunPeriode}.`}
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full md:w-2xl bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    DETAIL PENGAJUAN MUTASI RT
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 mt-1">
                    {selectedItem.nama || "Pengajuan Tanpa Nama"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    ID: {selectedItem.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMutasiId(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Status Saat Ini
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${getStatusMeta(selectedItem.status).badge}`}
                    >
                      {getStatusMeta(selectedItem.status).label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Tanggal Lapor
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {formatTanggal(selectedItem.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Tipe Proses
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                      {selectedItem.tipeProses}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Req Method
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200">
                      {selectedItem.reqMethod || selectedItem.tipeProses}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    👤 Data Warga
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nama Lengkap
                      </span>
                      <span className="font-bold text-slate-900">
                        {selectedItem.nama || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        NIK
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedItem.nik || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Jenis Mutasi
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.jenisMutasi}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    🧭 Tracking Pengajuan
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Created By
                      </span>
                      <span className="font-mono font-bold text-slate-900 break-all">
                        {selectedItem.createdBy || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Approved By
                      </span>
                      <span className="font-mono font-bold text-slate-900 break-all">
                        {selectedItem.approvedBy || "-"}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Parent
                      </span>
                      <span className="font-mono font-bold text-slate-900 break-all">
                        {selectedItem.parent || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    📝 Catatan Pengajuan
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {selectedItem.keterangan || "-"}
                  </p>
                  {selectedItem.feedbackSekdes && (
                    <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/80 space-y-1">
                      <span className="text-[10px] text-rose-800 font-extrabold uppercase block">
                        Feedback Sekdes
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed text-xs">
                        {selectedItem.feedbackSekdes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {canReview && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Feedback Penolakan
                    </label>
                    <textarea
                      value={feedbackDraft}
                      onChange={(e) => setFeedbackDraft(e.target.value)}
                      placeholder="Tuliskan alasan penolakan atau catatan perbaikan yang harus dipenuhi RT..."
                      className="w-full min-h-28 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => approveItem(selectedItem)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-600/20 cursor-pointer"
                    >
                      ✓ Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectItem(selectedItem)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-rose-600/20 cursor-pointer"
                    >
                      ✕ Tolak + Simpan Feedback
                    </button>
                  </div>
                </div>
              )}

              {!canReview && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Pengajuan ini sudah selesai diproses. Jika status ditolak dan RT mengirim revisi baru,
                  record berikutnya akan muncul sebagai pengajuan baru dengan parent yang sama.
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Tahun Periode: {selectedItem.tahunPeriode}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMutasiId(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function HalamanValidasiBerkasRTWrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Validasi Berkas RT...
        </div>
      }
    >
      <HalamanValidasiBerkasRT />
    </Suspense>
  );
}

export default HalamanValidasiBerkasRTWrapper;
