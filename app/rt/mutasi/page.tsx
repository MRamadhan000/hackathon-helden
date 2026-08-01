"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormMutasiLengkap from "@/components/rt/FormMutasiLengkap";
import { PendudukRT } from "@/components/rt/TableWarga";

const mockWargaRT: PendudukRT[] = [
  {
    id: "uuid-001",
    nik: "3507011234560001",
    nama: "Budi Santoso",
    jenisKelamin: "L",
    tempatLahir: "Kab. Malang",
    tanggalLahir: "1985-05-12",
    statusPenduduk: "Tetap",
    statusVerifikasiDukcapil: "Terverifikasi",
    terakhirDiperbarui: "2025-11-10",
  },
  {
    id: "uuid-002",
    nik: "3507019876540002",
    nama: "Siti Aminah",
    jenisKelamin: "P",
    tempatLahir: "Kota Surabaya",
    tanggalLahir: "1958-08-24",
    statusPenduduk: "Tetap",
    statusVerifikasiDukcapil: "Terverifikasi",
    terakhirDiperbarui: "2023-04-15",
  },
  {
    id: "uuid-003",
    nik: "3507015554440003",
    nama: "Joko Widodo (Alm)",
    jenisKelamin: "L",
    tempatLahir: "Kab. Blitar",
    tanggalLahir: "1945-01-15",
    statusPenduduk: "Meninggal",
    statusVerifikasiDukcapil: "Anomali / Unverified",
    terakhirDiperbarui: "2026-01-20",
  },
];

interface RiwayatMutasiItem {
  id: string;
  tanggal: string;
  jenis: string;
  nik: string;
  nama: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  keterangan: string;
  statusSekdes?: string;
}

const mockRiwayatMutasiPerTahun: Record<string, RiwayatMutasiItem[]> = {
  "2026": [
    {
      id: "m-2026-1",
      tanggal: "15/03/2026",
      jenis: "1. Warga Baru",
      nik: "3507011112220004",
      nama: "Andi Pratama",
      tempatLahir: "Kota Malang",
      tanggalLahir: "1994-06-18",
      jenisKelamin: "L",
      keterangan: "Pendaftaran Pindah Masuk RT dari Luar Desa",
      statusSekdes: "✓ Disetujui Sekdes",
    },
  ],
  "2025": [
    {
      id: "m-1",
      tanggal: "12/04/2025",
      jenis: "1. Warga Baru",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      jenisKelamin: "L",
      keterangan: "Pendaftaran Pindah Masuk RT",
      statusSekdes: "✓ Disetujui Sekdes",
    },
    {
      id: "m-2",
      tanggal: "20/08/2025",
      jenis: "2. Non-Aktif",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      tempatLahir: "Kota Surabaya",
      tanggalLahir: "1958-08-24",
      jenisKelamin: "P",
      keterangan: "Non-Aktif (Pindah Wilayah Domisili)",
      statusSekdes: "✓ Disetujui Sekdes",
    },
  ],
  "2024": [
    {
      id: "m-3",
      tanggal: "10/11/2024",
      jenis: "3. Koreksi Data",
      nik: "3507015554440003",
      nama: "Joko Widodo",
      tempatLahir: "Kab. Blitar",
      tanggalLahir: "1945-01-15",
      jenisKelamin: "L",
      keterangan: "Koreksi Ejaan Tempat Lahir dan Tanggal Lahir",
      statusSekdes: "✓ Disetujui Sekdes",
    },
  ],
};

const FILTER_JENIS = [
  "Semua",
  "1. Warga Baru",
  "2. Non-Aktif",
  "3. Koreksi Data",
];

export default function HalamanMutasi() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunAktif = tahunPeriode === "2026";

  const [selectedNik, setSelectedNik] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");

  // State untuk Drawer Setengah Layar (Side Panel Detail)
  const [selectedDetailItem, setSelectedDetailItem] =
    useState<RiwayatMutasiItem | null>(null);

  const riwayatMutasi = mockRiwayatMutasiPerTahun[tahunPeriode] || [];

  const filteredData = useMemo(() => {
    return riwayatMutasi.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.keterangan.toLowerCase().includes(q);

      const matchFilter = filterJenis === "Semua" || item.jenis === filterJenis;

      return matchSearch && matchFilter;
    });
  }, [riwayatMutasi, searchQuery, filterJenis]);

  const handleMutasiSubmit = (e: React.FormEvent, data: any) => {
    e.preventDefault();
    alert("Laporan mutasi berhasil dikirimkan ke Sekretaris Desa!");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased relative">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/rt?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition self-start"
          >
            ← Kembali ke Panel RT
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header Card */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Riwayat Mutasi & Kependudukan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar transaksi mutasi warga tahun {tahunPeriode}
              </p>
            </div>

            {isTahunAktif && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
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

          {/* ========== MOBILE: Card List ========== */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {item.nama}
                      </p>
                      <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                        {item.nik}
                      </p>
                    </div>
                    <span className="shrink-0 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      ✓ Disetujui
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100">
                      {item.jenis}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.tanggal}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.keterangan}
                  </p>

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
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs">
                {searchQuery || filterJenis !== "Semua"
                  ? "Tidak ada data yang cocok dengan pencarian / filter."
                  : `Belum ada riwayat mutasi pada tahun ${tahunPeriode}.`}
              </div>
            )}
          </div>

          {/* ========== DESKTOP: Table ========== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">Tgl Lapor</th>
                  <th className="px-5 py-3">Kategori Mutasi</th>
                  <th className="px-5 py-3">Warga Terkait</th>
                  <th className="px-5 py-3">Keterangan</th>
                  <th className="px-5 py-3 text-right">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                        {item.tanggal}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-100 whitespace-nowrap">
                          {item.jenis}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900 text-xs">
                          {item.nama}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          NIK: {item.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {item.keterangan}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold whitespace-nowrap">
                          ✓ Disetujui
                        </span>
                      </td>
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400 text-xs"
                    >
                      {searchQuery || filterJenis !== "Semua"
                        ? "Tidak ada data yang cocok dengan pencarian / filter."
                        : `Belum ada riwayat mutasi pada tahun ${tahunPeriode}.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredData.length} dari {riwayatMutasi.length} data
          </div>
        </div>
      </div>

      {/* Modal Input Mutasi Baru */}
      {showModal && isTahunAktif && (
        <FormMutasiLengkap
          tahunPeriode={tahunPeriode}
          daftarWarga={mockWargaRT}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitMutasi={handleMutasiSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* DRAWER SETENGAH LAYAR (SIDE PANEL OVERLAY 50% VIEWPORT) - DETAIL RINCIAN MUTASI WARGA */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* DRAWER HEADER */}
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

              {/* RINCIAN FIELD MUTASI */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Kategori Mutasi
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg border border-blue-100">
                      {selectedDetailItem.jenis}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Status Verifikasi Sekdes
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg border border-emerald-200">
                      {selectedDetailItem.statusSekdes || "✓ Disetujui Sekdes"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Tanggal Dilaporkan
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedDetailItem.tanggal}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-2">
                    👤 Data Kependudukan Warga Terkait
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nama Lengkap
                      </span>
                      <span className="font-bold text-slate-900">
                        {selectedDetailItem.nama}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Nomor Induk Kependudukan (NIK)
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedDetailItem.nik}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Jenis Kelamin
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.jenisKelamin === "P"
                          ? "Perempuan (P)"
                          : "Laki-Laki (L)"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Tempat, Tanggal Lahir
                      </span>
                      <span className="font-semibold text-slate-800">
                        {selectedDetailItem.tempatLahir || "Kab. Malang"},{" "}
                        {selectedDetailItem.tanggalLahir || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-1">
                  <span className="text-[10px] text-blue-800 font-extrabold uppercase block">
                    Catatan / Keterangan Laporan RT
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {selectedDetailItem.keterangan}
                  </p>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
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
