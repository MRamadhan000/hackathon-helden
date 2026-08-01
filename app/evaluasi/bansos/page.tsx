"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PenerimaBansos {
  id: string;
  noKK: string;
  namaKepalaKeluarga: string;
  nik: string;
  dusun: string;
  rt: string;
  skorKelayakan: number; // 0 - 100
  jenisBantuan: string;
  status: "Ditetapkan" | "Diverifikasi RT" | "Perlu Sanggah";
  verifikator: string;
  tanggalUpdate: string;
}

// Data Sintetis Simulasi sesuai aturan Hackathon
const mockPenerima: PenerimaBansos[] = [
  {
    id: "1",
    noKK: "3507011002000001",
    namaKepalaKeluarga: "Budi Santoso",
    nik: "3507011234560001",
    dusun: "Sukamaju",
    rt: "02",
    skorKelayakan: 88,
    jenisBantuan: "BLT Dana Desa",
    status: "Ditetapkan",
    verifikator: "Pak RT Slamet (RT 02)",
    tanggalUpdate: "01/08/2026",
  },
  {
    id: "2",
    noKK: "3507011002000002",
    namaKepalaKeluarga: "Siti Rahmawati",
    nik: "3507011234560002",
    dusun: "Sukamaju",
    rt: "01",
    skorKelayakan: 92,
    jenisBantuan: "PKH & BLT",
    status: "Ditetapkan",
    verifikator: "Kader Posyandu Anita",
    tanggalUpdate: "31/07/2026",
  },
  {
    id: "3",
    noKK: "3507011002000003",
    namaKepalaKeluarga: "Agus Martono",
    nik: "3507011234560003",
    dusun: "Karanganyar",
    rt: "04",
    skorKelayakan: 74,
    jenisBantuan: "BPNT (Sembako)",
    status: "Diverifikasi RT",
    verifikator: "Pak RT Joko (RT 04)",
    tanggalUpdate: "30/07/2026",
  },
  {
    id: "4",
    noKK: "3507011002000004",
    namaKepalaKeluarga: "Wagiman",
    nik: "3507011234560004",
    dusun: "Mekar Sari",
    rt: "03",
    skorKelayakan: 65,
    jenisBantuan: "BLT Dana Desa",
    status: "Perlu Sanggah",
    verifikator: "Pengaduan Warga",
    tanggalUpdate: "29/07/2026",
  },
  {
    id: "5",
    noKK: "3507011002000005",
    namaKepalaKeluarga: "Supriadi",
    nik: "3507011234560005",
    dusun: "Karanganyar",
    rt: "05",
    skorKelayakan: 85,
    jenisBantuan: "BLT Dana Desa",
    status: "Ditetapkan",
    verifikator: "Pak RT Yudi (RT 05)",
    tanggalUpdate: "28/07/2026",
  },
];

export default function DetailEvaluasiBansosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const filteredData = mockPenerima.filter((item) => {
    const matchSearch =
      item.namaKepalaKeluarga
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.nik.includes(searchTerm) ||
      item.dusun.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "Semua" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Title */}
        <div>
          <Link
            href="/evaluasi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-4"
          >
            ← Kembali ke Semua Evaluasi
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Perlindungan Sosial
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  ⚠️ Data Simulasi / Sintetis
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Hasil Evaluasi Penerima Bantuan Sosial
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Rekapitulasi penetapan kriteria penerima manfaat berbasis data
                induk terintegrasi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Mengunduh laporan PDF hasil evaluasi...")}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Cetak / Ekspor Laporan
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Total Terverifikasi
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">342 KK</p>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              100% Bebas Duplikat
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Cakupan Kuota APBDes
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">95.8%</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              342 dari 357 Kuota
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Estimasi Anggaran
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">Rp 102.6M</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Rp 300rb / KK / Bulan
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Rata-Rata Skor Kelayakan
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              82.4 / 100
            </p>
            <p className="text-[11px] text-indigo-600 mt-1 font-medium">
              Berdasarkan 8 Kriteria
            </p>
          </div>
        </div>

        {/* Metodologi / Indikator Transparansi */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
            💡 Indikator Transparansi Scoring
          </h3>
          <p className="text-xs text-indigo-700 leading-relaxed">
            Peringkat kelayakan dihitung otomatis berdasarkan: kondisi fisik
            rumah, pendapatan keluarga per kapita, kepemilikan aset, serta
            kondisi khusus (Lansia/Disabilitas/Stunting) yang diverifikasi
            langsung oleh <strong>Ketua RT dan Kader Posyandu</strong>.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari Nama, NIK, atau Dusun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Status:</span>
            {["Semua", "Ditetapkan", "Diverifikasi RT", "Perlu Sanggah"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterStatus === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Table Data Penerima */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Kepala Keluarga</th>
                  <th className="p-4">Lokasi (Dusun/RT)</th>
                  <th className="p-4">Jenis Bantuan</th>
                  <th className="p-4 text-center">Skor Kelayakan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Audit Trail (Pembaruan)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-900 text-sm">
                          {item.namaKepalaKeluarga}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          NIK: {item.nik} | KK: {item.noKK}
                        </p>
                      </td>

                      <td className="p-4 text-slate-600">
                        <p className="font-medium text-slate-800">
                          {item.dusun}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          RT {item.rt}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {item.jenisBantuan}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-extrabold text-[11px] ${
                            item.skorKelayakan >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : item.skorKelayakan >= 70
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.skorKelayakan} / 100
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold ${
                            item.status === "Ditetapkan"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "Diverifikasi RT"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 pr-6">
                        <p className="text-slate-700 font-medium text-[11px]">
                          {item.verifikator}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.tanggalUpdate}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Tidak ditemukan data penerima bantuan sosial yang sesuai.
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
