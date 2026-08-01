"use client";

import React, { useState } from "react";
import Link from "next/link";

interface WargaDukcapil {
  no: number;
  nik: string;
  no_kk: string;
  nama: string;
  gender: "L" | "P";
  tempatTanggalLahir: string;
  usia: number;
  dusun: string;
  rtRw: string;
  pekerjaanKtp: string;
  statusKependudukan: "Aktif" | "Pindah" | "Meninggal";
}

// Data Sintetis Dukcapil yang Relevan untuk Evaluasi ERP Desa
const mockDataDukcapil: WargaDukcapil[] = [
  {
    no: 1,
    nik: "3507011234560001",
    no_kk: "3507011002000001",
    nama: "Budi Santoso",
    gender: "L",
    tempatTanggalLahir: "Malang, 12/05/1985",
    usia: 41,
    dusun: "Sukamaju",
    rtRw: "02 / 01",
    pekerjaanKtp: "Buruh Harian Lepas",
    statusKependudukan: "Aktif",
  },
  {
    no: 2,
    nik: "3507011234560002",
    no_kk: "3507011002000002",
    nama: "Siti Rahmawati",
    gender: "P",
    tempatTanggalLahir: "Surabaya, 24/08/1958",
    usia: 68,
    dusun: "Sukamaju",
    rtRw: "01 / 01",
    pekerjaanKtp: "Mengurus Rumah Tangga",
    statusKependudukan: "Aktif",
  },
  {
    no: 3,
    nik: "3507011234560003",
    no_kk: "3507011002000003",
    nama: "Agus Martono",
    gender: "L",
    tempatTanggalLahir: "Kediri, 03/11/1978",
    usia: 47,
    dusun: "Karanganyar",
    rtRw: "04 / 02",
    pekerjaanKtp: "Pegawai Negeri Sipil (PNS)",
    statusKependudukan: "Aktif",
  },
  {
    no: 4,
    nik: "3507011234560004",
    no_kk: "3507011002000004",
    nama: "Wagiman",
    gender: "L",
    tempatTanggalLahir: "Blitar, 15/01/1945",
    usia: 81,
    dusun: "Mekar Sari",
    rtRw: "03 / 01",
    pekerjaanKtp: "Petani/Pekebun",
    statusKependudukan: "Aktif",
  },
  {
    no: 5,
    nik: "3507011234560005",
    no_kk: "3507011002000005",
    nama: "Supriadi",
    gender: "L",
    tempatTanggalLahir: "Malang, 09/09/1982",
    usia: 43,
    dusun: "Karanganyar",
    rtRw: "05 / 02",
    pekerjaanKtp: "Wiraswasta",
    statusKependudukan: "Meninggal",
  },
];

export default function DukcapilPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const filteredWarga = mockDataDukcapil.filter((warga) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      warga.nama.toLowerCase().includes(term) ||
      warga.nik.includes(term) ||
      warga.no_kk.includes(term) ||
      warga.dusun.toLowerCase().includes(term);
    const matchStatus =
      filterStatus === "Semua" || warga.statusKependudukan === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <Link
            href="/evaluasi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-4"
          >
            ← Kembali ke Evaluasi
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Sumber Referensi Resmi (API/Server Dukcapil)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  ⚠️ Read-Only Master Data
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Data Master Dukcapil
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Data kependudukan resmi untuk pencocokan keabsahan NIK, deteksi
                warga meninggal/pindah, dan validasi kriteria bansos.
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Prinsip Perlindungan Data Dukcapil
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Data Dukcapil tidak boleh ditimpa oleh data desa. Jika terdapat
              perbedaan status (misal: di Dukcapil tercatat{" "}
              <strong>Aktif</strong> namun di lapangan{" "}
              <strong>Meninggal/Pindah</strong>), petugas desa menandai
              penyesuaian pada Data Induk Lokal tanpa mengubah master Dukcapil.
            </p>
          </div>
          <div className="shrink-0">
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-mono font-medium">
              Read-Only Sync Bridge
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan NIK, No. KK, Nama, atau Dusun..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400 mr-1">
              Status:
            </span>
            {["Semua", "Aktif", "Meninggal", "Pindah"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterStatus === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Data Warga Dukcapil */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              List Referensi Kependudukan
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {filteredWarga.length} Jiwa Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 text-center w-12">No</th>
                  <th className="p-4">Identitas Warga (NIK / KK)</th>
                  <th className="p-4">Nama Lengkap & L/P</th>
                  <th className="p-4">Tempat, Tgl Lahir (Usia)</th>
                  <th className="p-4">Wilayah (Dusun/RT)</th>
                  <th className="p-4">Pekerjaan Dukcapil</th>
                  <th className="p-4 pr-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWarga.length > 0 ? (
                  filteredWarga.map((warga) => (
                    <tr
                      key={warga.no}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="p-4 text-center font-medium text-slate-400">
                        {warga.no}
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          NIK: {warga.nik}
                        </span>
                        <p className="font-mono text-[10px] text-slate-400 mt-1">
                          KK: {warga.no_kk}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 text-sm">
                            {warga.nama}
                          </p>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              warga.gender === "L"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {warga.gender}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        <p className="font-medium text-slate-800">
                          {warga.tempatTanggalLahir}
                        </p>
                        <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                          Usia: {warga.usia} Tahun{" "}
                          {warga.usia >= 60 ? "(Lansia)" : ""}
                        </p>
                      </td>

                      <td className="p-4 text-slate-600">
                        <p className="font-bold text-slate-800">
                          {warga.dusun}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          RT/RW: {warga.rtRw}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                            warga.pekerjaanKtp.includes("PNS") ||
                            warga.pekerjaanKtp.includes("Wiraswasta")
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {warga.pekerjaanKtp}
                        </span>
                      </td>

                      <td className="p-4 pr-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            warga.statusKependudukan === "Aktif"
                              ? "bg-emerald-100 text-emerald-800"
                              : warga.statusKependudukan === "Meninggal"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {warga.statusKependudukan}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Tidak ada data warga Dukcapil yang sesuai pencarian.
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
