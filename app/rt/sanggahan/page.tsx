"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CardSanggahan, {
  SanggahanDataPenduduk,
  SanggahanKondisiRumah,
} from "@/components/rt/CardSanggahan";
import { useSanggahan } from "@/hooks/cores/useSanggahan";
import { useAuth } from "@/hooks/useAuth";

function SanggahanContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"rumah" | "penduduk">("rumah");
  const [notif, setNotif] = useState("");

  // Connection ke Supabase Hook (Tanpa mock dummy data!)
  const {
    listPenduduk: realListPenduduk,
    listRumah: realListRumah,
    isLoading,
    forwardToSekdes,
  } = useSanggahan(tahunPeriode);

  // Map Data Supabase ke Format SanggahanDataPenduduk untuk UI
  const formattedListPenduduk: SanggahanDataPenduduk[] = useMemo(() => {
    return (realListPenduduk || []).map((item) => ({
      id: item.id,
      namaPelapor: item.namaPelapor,
      nikPelapor: item.nikPelapor,
      jenisKetidakcocokan: item.jenisKetidakcocokan,
      alasanSanggahan: item.alasanSanggahan,
      tanggalMasuk: item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-",
      status:
        item.status === "PENDING"
          ? "Pending"
          : item.status === "DIAJUKAN_SEKDES"
          ? "Diajukan ke Sekdes"
          : item.status === "APPROVED"
          ? "Diterima Sekdes"
          : item.status === "REJECTED"
          ? "Ditolak Sekdes"
          : "Pending",
    }));
  }, [realListPenduduk]);

  // Map Data Supabase ke Format SanggahanKondisiRumah untuk UI
  const formattedListRumah: SanggahanKondisiRumah[] = useMemo(() => {
    return (realListRumah || []).map((item) => ({
      id: item.id,
      namaPelapor: item.namaPelapor,
      nikPelapor: item.nikPelapor,
      jenisLantai: item.jenisLantai,
      jenisDinding: item.jenisDinding,
      sanitasi: item.sanitasi,
      skorSistem: item.skorSistem || 0,
      alasanWarga: item.alasanWarga,
      tanggalMasuk: item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID") : "-",
      status:
        item.status === "PENDING"
          ? "Pending"
          : item.status === "DIAJUKAN_SEKDES"
          ? "Diajukan ke Sekdes"
          : item.status === "APPROVED"
          ? "Diterima Sekdes"
          : item.status === "REJECTED"
          ? "Ditolak Sekdes"
          : "Pending",
    }));
  }, [realListRumah]);

  const handleAjukanPenduduk = async (id: string) => {
    try {
      if (!currentUser?.id) {
        throw new Error("Session RT tidak ditemukan. Silakan login ulang.");
      }

      await forwardToSekdes(id, "PENDUDUK", currentUser.id);
      setNotif("Sukses: Permohonan perbaikan data warga berhasil diteruskan ke Sekdes!");
      setTimeout(() => setNotif(""), 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal meneruskan sanggahan ke Sekdes: " + (err as Error).message);
    }
  };

  const handleAjukanRumah = async (id: string) => {
    try {
      if (!currentUser?.id) {
        throw new Error("Session RT tidak ditemukan. Silakan login ulang.");
      }

      await forwardToSekdes(id, "RUMAH", currentUser.id);
      setNotif("Sukses: Laporan sanggahan kondisi rumah warga berhasil diteruskan ke Sekdes!");
      setTimeout(() => setNotif(""), 4000);
    } catch (err) {
      console.error(err);
      alert("Gagal meneruskan sanggahan ke Sekdes: " + (err as Error).message);
    }
  };

  const pendingRumahCount = formattedListRumah.filter((r) => r.status === "Pending").length;
  const pendingPendudukCount = formattedListPenduduk.filter((p) => p.status === "Pending").length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 space-y-6 font-sans antialiased">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between">
          <Link
            href={`/rt?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            ← Kembali ke Panel RT
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode: <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* BANNER UTAMA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-extrabold text-slate-950">
              Pusat Pemeriksaan Sanggahan & Laporan Warga
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tinjau dan tindak lanjuti laporan mandiri dari warga sebelum diteruskan ke Sekretaris Desa.
            </p>
          </div>

          {/* STATISTIK RINGKAS */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                Sanggahan Rumah
              </span>
              <span className="text-xs font-black text-amber-950">
                {pendingRumahCount} Laporan
              </span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-center">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">
                Perbaikan Data
              </span>
              <span className="text-xs font-black text-blue-950">
                {pendingPendudukCount} Laporan
              </span>
            </div>
          </div>
        </div>

        {/* NOTIFIKASI AKSI */}
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-2xs animate-in fade-in duration-200">
            {notif}
          </div>
        )}

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-200/80 gap-2 bg-white p-1.5 rounded-2xl border shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("rumah")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "rumah"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Sanggahan Kondisi Rumah (Bansos)</span>
            {pendingRumahCount > 0 && (
              <span className="px-1.5 py-0.5 bg-white text-amber-950 rounded-md text-[10px] font-black border border-amber-200">
                {pendingRumahCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("penduduk")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "penduduk"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Perbaikan Data Diri Warga</span>
            {pendingPendudukCount > 0 && (
              <span className="px-1.5 py-0.5 bg-white text-blue-950 rounded-md text-[10px] font-black border border-blue-200">
                {pendingPendudukCount}
              </span>
            )}
          </button>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-white rounded-2xl border">
            Memuat data sanggahan dari Supabase...
          </div>
        ) : (
          <>
            {/* TAB CONTENT 1: SANGGAHAN RUMAH */}
            {activeTab === "rumah" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Daftar Pesan Sanggahan Kondisi Rumah Masuk ({tahunPeriode})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: {formattedListRumah.length} Berkas
                  </span>
                </div>

                <div className="space-y-4">
                  {formattedListRumah.length > 0 ? (
                    formattedListRumah.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-950 border border-amber-300 font-black text-[11px] rounded-md shrink-0">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-extrabold text-slate-900">
                                  {item.namaPelapor}
                                </h3>
                                <span className="font-mono text-[11px] text-slate-400">
                                  NIK: {item.nikPelapor}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                                Tgl Masuk: {item.tanggalMasuk}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-950 font-extrabold text-[11px] rounded-lg border border-amber-300">
                              Skor Kelayakan: {item.skorSistem} / 100
                            </span>
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                item.status === "Pending"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              }`}
                            >
                              {item.status === "Pending"
                                ? "⏳ Perlu Ditinjau RT"
                                : "✓ Diteruskan ke Sekdes"}
                            </span>
                          </div>
                        </div>

                        {/* KONDISI FISIK BANGUNAN */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Dinding
                            </span>
                            <span className="font-semibold text-slate-800">
                              {item.jenisDinding}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Lantai
                            </span>
                            <span className="font-semibold text-slate-800">
                              {item.jenisLantai}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Sanitasi
                            </span>
                            <span className="font-semibold text-slate-800">
                              {item.sanitasi}
                            </span>
                          </div>
                        </div>

                        {/* NOTE PESAN WARGA */}
                        <div className="p-3.5 bg-amber-100/60 rounded-xl border border-amber-300 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-amber-950 block">
                            💬 Pesan Catatan Warga:
                          </span>
                          <p className="text-xs text-slate-900 font-medium italic leading-relaxed">
                            "{item.alasanWarga}"
                          </p>
                        </div>

                        {/* TOMBOL AKSI */}
                        {item.status === "Pending" && (
                          <div className="flex justify-end pt-2 border-t border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => handleAjukanRumah(item.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>✓</span>
                              <span>Setujui & Teruskan ke Sekdes</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      Tidak ada pesan sanggahan rumah pada tahun {tahunPeriode}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: PERBAIKAN DATA DIRI */}
            {activeTab === "penduduk" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-slate-900">
                      Daftar Permohonan Koreksi Data Diri Warga ({tahunPeriode})
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Total: {formattedListPenduduk.length} Berkas
                  </span>
                </div>

                <div className="space-y-4">
                  {formattedListPenduduk.length > 0 ? (
                    formattedListPenduduk.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="px-2 py-0.5 bg-blue-200 text-blue-950 border border-blue-300 font-black text-[11px] rounded-md shrink-0">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-extrabold text-slate-900">
                                  {item.namaPelapor}
                                </h3>
                                <span className="font-mono text-[11px] text-slate-400">
                                  NIK: {item.nikPelapor}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">
                                Kategori: <strong>{item.jenisKetidakcocokan}</strong> • Tgl: {item.tanggalMasuk}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto ${
                              item.status === "Pending"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            }`}
                          >
                            {item.status === "Pending"
                              ? "⏳ Perlu Ditinjau RT"
                              : "✓ Diteruskan ke Sekdes"}
                          </span>
                        </div>

                        {/* NOTE PESAN WARGA */}
                        <div className="p-3.5 bg-blue-100/60 rounded-xl border border-blue-300 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-blue-950 block">
                            💬 Pesan Catatan Warga:
                          </span>
                          <p className="text-xs text-slate-900 font-medium italic leading-relaxed">
                            "{item.alasanSanggahan}"
                          </p>
                        </div>

                        {/* TOMBOL AKSI */}
                        {item.status === "Pending" && (
                          <div className="flex justify-end pt-2 border-t border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => handleAjukanPenduduk(item.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <span>✓</span>
                              <span>Setujui & Teruskan ke Sekdes</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      Tidak ada permohonan perbaikan data diri pada tahun {tahunPeriode}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TABEL REKAPITULASI DUA KOMPONEN DI PALING BAWAH */}
            <div className="pt-4">
              <CardSanggahan
                tahunPeriode={tahunPeriode}
                sanggahanPendudukList={formattedListPenduduk}
                sanggahanRumahList={formattedListRumah}
                onAjukanPendudukKeSekdes={handleAjukanPenduduk}
                onAjukanRumahKeSekdes={handleAjukanRumah}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HalamanSanggahan() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Sanggahan Warga...
        </div>
      }
    >
      <SanggahanContent />
    </Suspense>
  );
}
