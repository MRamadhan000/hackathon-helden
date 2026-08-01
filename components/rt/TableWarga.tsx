"use client";

import React, { useState } from "react";

export interface PendudukRT {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  statusPenduduk: "Tetap" | "Pindah" | "Meninggal";
  statusVerifikasiDukcapil: "Terverifikasi" | "Anomali / Unverified";
  terakhirDiperbarui: string; // Format YYYY-MM-DD
}

export default function TableWarga({ data }: { data: PendudukRT[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKesegaran, setFilterKesegaran] = useState<
    "semua" | "verified" | "kadaluarsa"
  >("semua");

  // Fungsi Cek Kesegaran Data (< 2 Tahun = Verified/Aktif, >= 2 Tahun = Kadaluarsa/Butuh Pemutakhiran)
  const isDataVerified = (tglUpdate: string) => {
    const updateDate = new Date(tglUpdate);
    const today = new Date("2026-08-01"); // Referensi Tahun Berjalan
    const diffInYears =
      (today.getTime() - updateDate.getTime()) / (1000 * 3600 * 24 * 365.25);
    return diffInYears < 2;
  };

  const hitungUsia = (tglLahir: string) => {
    const birthDate = new Date(tglLahir);
    const today = new Date("2026-08-01");
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter Data Berdasarkan Pengetikan Search & Tab Status Pemutakhiran
  const filteredData = data.filter((w) => {
    const verified = isDataVerified(w.terakhirDiperbarui);

    // Matching Search Term
    const matchesSearch =
      w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.toLowerCase().includes(searchTerm.toLowerCase());

    // Matching Filter Tab Status
    if (filterKesegaran === "verified") {
      return matchesSearch && verified;
    } else if (filterKesegaran === "kadaluarsa") {
      return matchesSearch && !verified;
    }
    return matchesSearch;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm space-y-4">
      {/* HEADER & SEARCH BAR + FILTER TOGGLE */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Master Kependudukan Warga RT 03
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data kependudukan terintegrasi dari entitas{" "}
              <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                tweb_penduduk
              </code>
              .
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0 self-start sm:self-auto">
            Total: {filteredData.length} dari {data.length} Jiwa
          </span>
        </div>

        {/* TOOLBAR: SEARCH & FILTER BUTTONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari berdasarkan Nama atau NIK warga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white focus:outline-none focus:border-blue-500 transition"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Status Pemutakhiran */}
          <div className="flex bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setFilterKesegaran("semua")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterKesegaran === "semua"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterKesegaran("verified")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterKesegaran === "verified"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✓ Terverifikasi (&lt; 2 Thn)
            </button>
            <button
              onClick={() => setFilterKesegaran("kadaluarsa")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterKesegaran === "kadaluarsa"
                  ? "bg-white text-amber-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚠️ Butuh Pemutakhiran (&ge; 2 Thn)
            </button>
          </div>
        </div>
      </div>

      {/* TABEL PENDUDUK */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">NIK & Nama Lengkap</th>
              <th className="px-6 py-4">L/P</th>
              <th className="px-6 py-4">TTL (Usia)</th>
              <th className="px-6 py-4">Status Keberadaan</th>
              <th className="px-6 py-4">Status Pemutakhiran Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredData.length > 0 ? (
              filteredData.map((w) => {
                const usia = hitungUsia(w.tanggalLahir);
                const verified = isDataVerified(w.terakhirDiperbarui);

                return (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition">
                    {/* Nama & NIK */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-950 text-sm">
                        {w.nama}
                      </p>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        NIK: {w.nik}
                      </p>
                    </td>

                    {/* Jenis Kelamin */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                          w.jenisKelamin === "L"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {w.jenisKelamin}
                      </span>
                    </td>

                    {/* TTL & Usia */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-800">
                        {w.tempatLahir}, {w.tanggalLahir}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {usia} Tahun {usia >= 60 ? "• (Lansia)" : ""}
                      </p>
                    </td>

                    {/* Status Keberadaan */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          w.statusPenduduk === "Meninggal"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : w.statusPenduduk === "Pindah"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {w.statusPenduduk}
                      </span>
                    </td>

                    {/* Status Kesegaran / Pemutakhiran Data (< 2 Tahun vs >= 2 Tahun) */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-block ${
                            verified
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-900 border border-amber-200"
                          }`}
                        >
                          {verified
                            ? "✓ Terverifikasi (Aktif)"
                            : "⚠️ Butuh Pemutakhiran"}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Update: {w.terakhirDiperbarui}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-400 text-xs"
                >
                  Tidak ditemukan data warga yang sesuai dengan pencarian atau
                  filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
