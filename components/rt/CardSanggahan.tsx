"use client";

import React, { useState } from "react";

export interface SanggahanDataPenduduk {
  id: string;
  namaPelapor: string;
  nikPelapor: string;
  jenisKetidakcocokan: string;
  alasanSanggahan: string;
  tanggalMasuk: string;
  status:
    | "Pending"
    | "Diajukan ke Sekdes"
    | "Diterima Sekdes"
    | "Ditolak Sekdes";
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
  status:
    | "Pending"
    | "Diajukan ke Sekdes"
    | "Diterima Sekdes"
    | "Ditolak Sekdes";
}

interface CardSanggahanProps {
  sanggahanPendudukList?: SanggahanDataPenduduk[];
  sanggahanRumahList?: SanggahanKondisiRumah[];
  onAjukanPendudukKeSekdes: (id: string) => void;
  onAjukanRumahKeSekdes: (id: string) => void;
}

export default function CardSanggahan({
  sanggahanPendudukList = [],
  sanggahanRumahList = [],
  onAjukanPendudukKeSekdes,
  onAjukanRumahKeSekdes,
}: CardSanggahanProps) {
  const [subTab, setSubTab] = useState<"penduduk" | "rumah">("penduduk");

  const totalPenduduk = sanggahanPendudukList?.length || 0;
  const totalRumah = sanggahanRumahList?.length || 0;

  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200">
            ⏳ Pending (Perlu Verifikasi RT)
          </span>
        );
      case "Diajukan ke Sekdes":
        return (
          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200">
            📤 Diajukan RT ke Sekdes
          </span>
        );
      case "Diterima Sekdes":
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            ✅ Diterima Sekdes (Data Diperbarui)
          </span>
        );
      case "Ditolak Sekdes":
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-200">
            ❌ Ditolak Sekdes
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
            Verifikasi sanggahan warga di tingkat RT dan teruskan pengajuan
            persetujuan ke Sekretaris Desa.
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
            🪪 Data Penduduk ({totalPenduduk})
          </button>
          <button
            onClick={() => setSubTab("rumah")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === "rumah"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏠 Kondisi Rumah / Bansos ({totalRumah})
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Warga Pelapor</th>
                  <th className="px-6 py-4">Kategori Masalah</th>
                  <th className="px-6 py-4">Isi Sanggahan Warga</th>
                  <th className="px-6 py-4">Status Alur Berjenjang</th>
                  <th className="px-6 py-4 text-right">Aksi Ketua RT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sanggahanPendudukList.length > 0 ? (
                  sanggahanPendudukList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
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
                      <td className="px-6 py-4 text-right">
                        {item.status === "Pending" ? (
                          <button
                            onClick={() => onAjukanPendudukKeSekdes(item.id)}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                          >
                            Verifikasi & Ajukan ke Sekdes →
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">
                            Telah Diproses RT
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ada sanggahan data kependudukan.
                    </td>
                  </tr>
                )}
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Warga Pelapor</th>
                  <th className="px-6 py-4">Indikator Terdata</th>
                  <th className="px-6 py-4">Skor Sistem</th>
                  <th className="px-6 py-4">Status Alur Berjenjang</th>
                  <th className="px-6 py-4 text-right">Aksi Ketua RT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sanggahanRumahList.length > 0 ? (
                  sanggahanRumahList.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
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
                      <td className="px-6 py-4 text-right">
                        {item.status === "Pending" ? (
                          <button
                            onClick={() => onAjukanRumahKeSekdes(item.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                          >
                            Survei Ulang & Ajukan ke Sekdes →
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">
                            Telah Diproses RT
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Tidak ada sanggahan kondisi rumah.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
