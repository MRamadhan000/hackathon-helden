"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FormSurveiKelayakan from "@/components/rt/FormSurveiKelayakan";
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

const mockRiwayatSurveiPerTahun: Record<
  string,
  {
    id: string;
    tanggal: string;
    nik: string;
    nama: string;
    skor: number;
    kategori: string;
    indikator: string;
  }[]
> = {
  "2026": [
    {
      id: "s-2026-1",
      tanggal: "12/02/2026",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      skor: 45,
      kategori: "Cukup Layak",
      indikator: "Lantai Semen, Dinding Tembok",
    },
  ],
  "2025": [
    {
      id: "s-1",
      tanggal: "15/05/2025",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      skor: 70,
      kategori: "Sangat Layak (Prioritas SK)",
      indikator: "Lantai Tanah, Dinding Bambu, Ada Lansia",
    },
  ],
  "2024": [
    {
      id: "s-2",
      tanggal: "04/10/2024",
      nik: "3507015554440003",
      nama: "Joko Widodo",
      skor: 85,
      kategori: "Sangat Layak (Prioritas SK)",
      indikator: "Sungai, Buruh Harian, Tidak Ada Jamban",
    },
  ],
};

const FILTER_KATEGORI = [
  "Semua",
  "Sangat Layak (Prioritas SK)",
  "Cukup Layak",
];

export default function HalamanKelayakan() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";
  const isTahunAktif = tahunPeriode === "2026";

  const [selectedNik, setSelectedNik] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const riwayatSurvei = mockRiwayatSurveiPerTahun[tahunPeriode] || [];

  const filteredData = useMemo(() => {
    return riwayatSurvei.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.indikator.toLowerCase().includes(q);

      const matchFilter =
        filterKategori === "Semua" || item.kategori === filterKategori;

      return matchSearch && matchFilter;
    });
  }, [riwayatSurvei, searchQuery, filterKategori]);

  const handleSurveiSubmit = (e: React.FormEvent, data: any) => {
    e.preventDefault();
    alert("Hasil survei Prodeskel berhasil dikirim ke Sekretaris Desa!");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased">
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
          {/* Header Card + Action */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Hasil Survei Kelayakan Bansos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekapitulasi indikator Prodeskel DDK tahun {tahunPeriode}
              </p>
            </div>

            {isTahunAktif && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-emerald-600/20"
              >
                <span className="text-sm leading-none">+</span>
                Input Survei Baru
              </button>
            )}
          </div>

          {/* Search + Filter */}
          <div className="p-3 sm:p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama, NIK, atau indikator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-emerald-500"
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
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 sm:min-w-[200px]"
            >
              {FILTER_KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {k === "Semua" ? "Semua Kategori" : k}
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
                    <span
                      className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold ${
                        item.skor >= 50
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.skor >= 50 ? "Sangat Layak" : "Cukup Layak"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                      {item.skor} / 100
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.tanggal}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.indikator}
                  </p>

                  <button
                    type="button"
                    className="w-full py-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-100 rounded-lg border border-emerald-100 transition"
                  >
                    Lihat Detail
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 text-xs">
                {searchQuery || filterKategori !== "Semua"
                  ? "Tidak ada data yang cocok dengan pencarian / filter."
                  : `Belum ada hasil survei pada tahun ${tahunPeriode}.`}
              </div>
            )}
          </div>

          {/* ========== DESKTOP: Table ========== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3">Tgl Survei</th>
                  <th className="px-5 py-3">Nama Warga</th>
                  <th className="px-5 py-3">Indikator</th>
                  <th className="px-5 py-3">Skor</th>
                  <th className="px-5 py-3 text-right">Rekomendasi</th>
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
                        <p className="font-bold text-slate-900 text-xs">
                          {item.nama}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          NIK: {item.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[200px]">
                        {item.indikator}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-lg whitespace-nowrap">
                          {item.skor} / 100
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                            item.skor >= 50
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition"
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
                      {searchQuery || filterKategori !== "Semua"
                        ? "Tidak ada data yang cocok dengan pencarian / filter."
                        : `Belum ada hasil survei pada tahun ${tahunPeriode}.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredData.length} dari {riwayatSurvei.length} data
          </div>
        </div>
      </div>

      {/* Modal Form Survei */}
      {showModal && isTahunAktif && (
        <FormSurveiKelayakan
          tahunPeriode={tahunPeriode}
          daftarWarga={mockWargaRT}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitSurvei={handleSurveiSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}