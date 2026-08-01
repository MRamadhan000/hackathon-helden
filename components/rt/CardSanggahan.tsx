"use client";

import React, { useState } from "react";

export interface SanggahanDataPenduduk {
  id: string;
  namaPelapor: string;
  nikPelapor: string;
  jenisKetidakcocokan: string;
  alasanSanggahan: string;
  tanggalMasuk: string;
  status: "Pending" | "Dilaporkan ke Sekdes" | "Diterima" | "Ditolak";
}

export interface SanggahanKondisiRumah {
  id: string;
  namaPelapor: string;
  nikPelapor: string;
  jenisLantai: string;
  jenisDinding: string;
  sanitasi: string;
  skorSistem: number;
  alasanWarga: string;
  tanggalMasuk: string;
  status: "Pending" | "Survei Dikirim ke Sekdes" | "Diterima" | "Ditolak";
}

interface CardSanggahanProps {
  sanggahanPendudukList: SanggahanDataPenduduk[];
  sanggahanRumahList: SanggahanKondisiRumah[];
  onVerifikasiPenduduk: (item: SanggahanDataPenduduk) => void;
  onVerifikasiRumah: (item: SanggahanKondisiRumah) => void;
  onUpdateStatusPenduduk: (
    id: string,
    statusBaru: "Diterima" | "Ditolak",
  ) => void;
  onUpdateStatusRumah: (id: string, statusBaru: "Diterima" | "Ditolak") => void;
}

export default function CardSanggahan({
  sanggahanPendudukList,
  sanggahanRumahList,
  onVerifikasiPenduduk,
  onVerifikasiRumah,
  onUpdateStatusPenduduk,
  onUpdateStatusRumah,
}: CardSanggahanProps) {
  const [subTab, setSubTab] = useState<"penduduk" | "rumah">("penduduk");

  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
            ⏳ Pending
          </span>
        );
      case "Dilaporkan ke Sekdes":
      case "Survei Dikirim ke Sekdes":
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200">
            📤 Diproses Sekdes
          </span>
        );
      case "Diterima":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            ✅ Selesai (Diterima)
          </span>
        );
      case "Ditolak":
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-200">
            ❌ Selesai (Ditolak)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TOGGLE SUB-TAB */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Pusat Pengelolaan Sanggahan Warga
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, verifikasi, dan tandai status penyelesaian sanggahan
            kependudukan maupun kondisi rumah.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
          <button
            onClick={() => setSubTab("penduduk")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === "penduduk"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🪪 Data Penduduk ({sanggahanPendudukList.length})
          </button>
          <button
            onClick={() => setSubTab("rumah")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === "rumah"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏠 Kondisi Rumah / Bansos ({sanggahanRumahList.length})
          </button>
        </div>
      </div>

      {/* TABEL 1: SANGGAHAN DATA PENDUDUK */}
      {subTab === "penduduk" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-900">
              Daftar Sanggahan: Ketidakcocokan Data Kependudukan
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tindak lanjuti sanggahan data penduduk dan berikan status
              konfirmasi selesai.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Warga Pelapor</th>
                  <th className="px-6 py-4">Kategori Masalah</th>
                  <th className="px-6 py-4">Isi Sanggahan Warga</th>
                  <th className="px-6 py-4">Status Pemrosesan</th>
                  <th className="px-6 py-4 text-right">
                    Aksi & Konfirmasi Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sanggahanPendudukList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-950 text-sm">
                        {item.namaPelapor}
                      </p>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        NIK: {item.nikPelapor}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                        {item.jenisKetidakcocokan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                      <p className="italic">"{item.alasanSanggahan}"</p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Masuk: {item.tanggalMasuk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderBadgeStatus(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-y-2">
                      {item.status !== "Diterima" &&
                      item.status !== "Ditolak" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onVerifikasiPenduduk(item)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                          >
                            Lapor Sekdes
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatusPenduduk(item.id, "Diterima")
                            }
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition"
                          >
                            ✓ Terima
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatusPenduduk(item.id, "Ditolak")
                            }
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition"
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 italic">
                          Sanggahan Selesai Diproses
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABEL 2: SANGGAHAN KONDISI RUMAH / BANSOS */}
      {subTab === "rumah" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-900">
              Daftar Sanggahan: Ketidakcocokan Kondisi Rumah & Kelayakan Bansos
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Laporan warga terkait ketidaksesuaian data survei indikator
              Prodeskel DDK di lapangan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Warga Pelapor</th>
                  <th className="px-6 py-4">Indikator Terdata</th>
                  <th className="px-6 py-4">Skor Sistem</th>
                  <th className="px-6 py-4">Status Pemrosesan</th>
                  <th className="px-6 py-4 text-right">
                    Aksi & Konfirmasi Akhir
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sanggahanRumahList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-950 text-sm">
                        {item.namaPelapor}
                      </p>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        NIK: {item.nikPelapor}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <p>
                        Lantai:{" "}
                        <strong className="text-slate-900">
                          {item.jenisLantai}
                        </strong>
                      </p>
                      <p>
                        Dinding:{" "}
                        <strong className="text-slate-900">
                          {item.jenisDinding}
                        </strong>
                      </p>
                      <p>
                        Sanitasi:{" "}
                        <strong className="text-slate-900">
                          {item.sanitasi}
                        </strong>
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs">
                        {item.skorSistem} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderBadgeStatus(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-y-2">
                      {item.status !== "Diterima" &&
                      item.status !== "Ditolak" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onVerifikasiRumah(item)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                          >
                            Survei Ulang
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatusRumah(item.id, "Diterima")
                            }
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition"
                          >
                            ✓ Terima
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatusRumah(item.id, "Ditolak")
                            }
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition"
                          >
                            ✕ Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 italic">
                          Survei Selesai Diproses
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
