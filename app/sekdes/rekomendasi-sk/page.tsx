"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface DraftSkKpm {
  id: string;
  nik: string;
  namaKpm: string;
  asalRt: string;
  skorProdeskel: number;
  kategoriSurvei: string;
  statusRekomendasi: "Pending" | "Direkomendasikan" | "Ditolak Sekdes";
}

const initialDraftPerTahun: Record<string, DraftSkKpm[]> = {
  "2026": [
    {
      id: "sk-1",
      nik: "3507019876540002",
      namaKpm: "Siti Aminah",
      asalRt: "RT 03 / RW 01",
      skorProdeskel: 80,
      kategoriSurvei: "Sangat Layak (Prioritas Utama)",
      statusRekomendasi: "Pending",
    },
    {
      id: "sk-2",
      nik: "3507010202020003",
      namaKpm: "Ahmad Subari",
      asalRt: "RT 01 / RW 01",
      skorProdeskel: 75,
      kategoriSurvei: "Sangat Layak (Prioritas Utama)",
      statusRekomendasi: "Pending",
    },
  ],
  "2025": [
    {
      id: "sk-2025-1",
      nik: "3507011234560001",
      namaKpm: "Budi Santoso",
      asalRt: "RT 03 / RW 01",
      skorProdeskel: 85,
      kategoriSurvei: "Sangat Layak",
      statusRekomendasi: "Direkomendasikan",
    },
  ],
  "2024": [],
};

export default function HalamanRekomendasiSk() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunBerlalu = tahunPeriode !== "2026";

  const [listDraft, setListDraft] = useState<DraftSkKpm[]>(
    initialDraftPerTahun[tahunPeriode] || [],
  );

  const [notif, setNotif] = useState("");

  const handleSetRekomendasi = (
    id: string,
    status: "Direkomendasikan" | "Ditolak Sekdes",
  ) => {
    setListDraft((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, statusRekomendasi: status } : item,
      ),
    );
    const target = listDraft.find((d) => d.id === id);
    setNotif(
      `Sukses: KPM ${target?.namaKpm} (${target?.asalRt}) berhasil di-${
        status === "Direkomendasikan"
          ? "masukkan ke Draf SK Penetapan Kades"
          : "keluarkan dari Draf SK"
      }.`,
    );
    setTimeout(() => setNotif(""), 4000);
  };

  const totalDirekomendasikan = listDraft.filter(
    (d) => d.statusRekomendasi === "Direkomendasikan",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* NAVIGASI & PERIODE */}
        <div className="flex items-center justify-between">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            ← Kembali ke Workspace Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-xs">
            {notif}
          </div>
        )}

        {/* HEADER HALAMAN */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
              📄 Penetapan SK Kepala Desa
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Penyusunan Rekomendasi Draft SK KPM Bansos ({tahunPeriode})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tinjau daftar calon penerima bansos hasil survei RT sebelum
              diteruskan ke Kepala Desa untuk ditandatangani secara resmi.
            </p>
          </div>

          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-right shrink-0">
            <span className="text-[10px] font-bold text-indigo-700 uppercase block">
              Siap Diajukan ke Kades
            </span>
            <span className="text-xs font-black text-indigo-950">
              {totalDirekomendasikan} Calon KPM
            </span>
          </div>
        </div>

        {/* TABEL DRAFT SK */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Usulan Calon KPM Bansos ({tahunPeriode})
            </h3>
            {!isTahunBerlalu && (
              <button
                onClick={() =>
                  alert(
                    "Draft SK Penetapan KPM berhasil dikirimkan ke Dashboard Kepala Desa!",
                  )
                }
                disabled={totalDirekomendasikan === 0}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                  totalDirekomendasikan > 0
                    ? "bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Kirim Draft SK ke Kades →
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Nama Warga KPM</th>
                  <th className="px-5 py-3.5">Wilayah RT</th>
                  <th className="px-5 py-3.5">Skor Prodeskel RT</th>
                  <th className="px-5 py-3.5">Kategori Kelayakan</th>
                  <th className="px-5 py-3.5 text-right">Rekomendasi Sekdes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {listDraft.length > 0 ? (
                  listDraft.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-xs">
                          {item.namaKpm}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          NIK: {item.nik}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200">
                          {item.asalRt}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-lg">
                          {item.skorProdeskel} / 100
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                        {item.kategoriSurvei}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!isTahunBerlalu &&
                        item.statusRekomendasi === "Pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                handleSetRekomendasi(
                                  item.id,
                                  "Direkomendasikan",
                                )
                              }
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                            >
                              + Rekomendasikan
                            </button>
                            <button
                              onClick={() =>
                                handleSetRekomendasi(item.id, "Ditolak Sekdes")
                              }
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              ✕ Abaikkan
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-block ${
                              item.statusRekomendasi === "Direkomendasikan"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {item.statusRekomendasi === "Direkomendasikan"
                              ? "✓ Direkomendasikan"
                              : "✕ Tidak Diusulkan"}
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
                      Belum ada rekomendasi draft SK KPM pada tahun{" "}
                      {tahunPeriode}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
