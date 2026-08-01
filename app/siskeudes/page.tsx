"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PosAnggaranSiskeudes {
  kode: string;
  namaBidang: string;
  sumberDana: "DDS (Dana Desa)" | "ADD" | "PADes" | "Bagi Hasil Pajak";
  paguAnggaran: number;
  realisasi: number;
  batasAlokasiKK?: number;
  kategori:
    | "Pemerintahan"
    | "Pembangunan"
    | "Pembinaan"
    | "Pemberdayaan"
    | "Darurat/Bansos";
}

interface DataDesa {
  id: string;
  namaDesa: string;
  kecamatan: string;
  kabupaten: string;
  kodePemerintahan: string;
  posAnggaran: PosAnggaranSiskeudes[];
}

// Data Simulasi Multi-Desa untuk Siskeudes
const mockMultiDesaSiskeudes: DataDesa[] = [
  {
    id: "sukamaju",
    namaDesa: "Desa Sukamaju",
    kecamatan: "Karangploso",
    kabupaten: "Malang",
    kodePemerintahan: "35.07.16.2001",
    posAnggaran: [
      {
        kode: "5.5.01",
        namaBidang: "Penanganan Keadaan Mendesak (BLT Dana Desa)",
        kategori: "Darurat/Bansos",
        sumberDana: "DDS (Dana Desa)",
        paguAnggaran: 360000000,
        realisasi: 270000000,
        batasAlokasiKK: 3600000,
      },
      {
        kode: "5.4.02",
        namaBidang: "Pemberdayaan Ekonomi & Bantuan Usaha BUMDes",
        kategori: "Pemberdayaan",
        sumberDana: "DDS (Dana Desa)",
        paguAnggaran: 150000000,
        realisasi: 100000000,
        batasAlokasiKK: 2500000,
      },
      {
        kode: "5.2.01",
        namaBidang: "Pembangunan & Pemeliharaan Infrastruktur Desa",
        kategori: "Pembangunan",
        sumberDana: "DDS (Dana Desa)",
        paguAnggaran: 450000000,
        realisasi: 320000000,
      },
      {
        kode: "5.1.01",
        namaBidang: "Penghasilan Tetap & Tunjangan Perangkat Desa (Siltap)",
        kategori: "Pemerintahan",
        sumberDana: "ADD",
        paguAnggaran: 280000000,
        realisasi: 210000000,
      },
      {
        kode: "5.3.01",
        namaBidang: "Pembinaan Lembaga Kemasyarakatan (RT/RW & Posyandu)",
        kategori: "Pembinaan",
        sumberDana: "PADes",
        paguAnggaran: 60000000,
        realisasi: 45000000,
      },
    ],
  },
  {
    id: "karanganyar",
    namaDesa: "Desa Karanganyar",
    kecamatan: "Karangploso",
    kabupaten: "Malang",
    kodePemerintahan: "35.07.16.2002",
    posAnggaran: [
      {
        kode: "5.5.01",
        namaBidang: "Penanganan Keadaan Mendesak (BLT Dana Desa)",
        kategori: "Darurat/Bansos",
        sumberDana: "DDS (Dana Desa)",
        paguAnggaran: 280000000,
        realisasi: 210000000,
        batasAlokasiKK: 3600000,
      },
      {
        kode: "5.2.01",
        namaBidang: "Pembangunan Jalan & Drainase Dusun",
        kategori: "Pembangunan",
        sumberDana: "DDS (Dana Desa)",
        paguAnggaran: 400000000,
        realisasi: 300000000,
      },
      {
        kode: "5.1.01",
        namaBidang: "Siltap & Operasional Kantor Desa",
        kategori: "Pemerintahan",
        sumberDana: "ADD",
        paguAnggaran: 250000000,
        realisasi: 190000000,
      },
    ],
  },
];

export default function SiskeudesPage() {
  const [selectedDesaId, setSelectedDesaId] = useState("sukamaju");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const activeDesa =
    mockMultiDesaSiskeudes.find((d) => d.id === selectedDesaId) ||
    mockMultiDesaSiskeudes[0];

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const categories = [
    "Semua",
    "Darurat/Bansos",
    "Pembangunan",
    "Pemberdayaan",
    "Pemerintahan",
  ];

  const filteredData = activeDesa.posAnggaran.filter((item) => {
    const matchSearch =
      item.namaBidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode.includes(searchTerm) ||
      item.sumberDana.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || item.kategori === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalPagu = activeDesa.posAnggaran.reduce(
    (acc, curr) => acc + curr.paguAnggaran,
    0,
  );
  const totalRealisasi = activeDesa.posAnggaran.reduce(
    (acc, curr) => acc + curr.realisasi,
    0,
  );
  const persentaseSerapan = ((totalRealisasi / totalPagu) * 100).toFixed(1);

  // Cari alokasi BLT khusus untuk ringkasan
  const bltItem = activeDesa.posAnggaran.find((i) => i.kode === "5.5.01");
  const kuotaMaxBlt =
    bltItem && bltItem.batasAlokasiKK
      ? Math.floor(bltItem.paguAnggaran / bltItem.batasAlokasiKK)
      : 0;

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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Integrasi Keuangan Siskeudes
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  ⚠️ Read-Only APBDes TA 2026
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Pagu Anggaran & Realisasi (Siskeudes)
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Data referensi struktur APBDes yang menjadi acuan batas anggaran
                penyaluran bantuan sosial dan kegiatan desa.
              </p>
            </div>

            {/* Selector Pilih Desa */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Konteks Wilayah Desa
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Kode: {activeDesa.kodePemerintahan}
                </p>
              </div>
              <select
                value={selectedDesaId}
                onChange={(e) => setSelectedDesaId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
              >
                {mockMultiDesaSiskeudes.map((desa) => (
                  <option key={desa.id} value={desa.id}>
                    {desa.namaDesa} ({desa.kecamatan})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ringkasan Keuangan Desa Aktif */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Total APBDes 2026 ({activeDesa.namaDesa})
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(totalPagu)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Pagu Anggaran Disetujui Musdes
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Total Realisasi Saat Ini
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {formatRupiah(totalRealisasi)}
            </p>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">
              Terserap {persentaseSerapan}%
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">
              Kuota BLT Dana Desa (DDS)
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {kuotaMaxBlt} KK Maksimal
            </p>
            <p className="text-[11px] text-indigo-600 mt-1 font-medium">
              Batas Rp 3.600.000 / KK / Tahun
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Cari bidang di ${activeDesa.namaDesa}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table Data Siskeudes */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rincian Post Anggaran - {activeDesa.namaDesa}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kec. {activeDesa.kecamatan}, Kab. {activeDesa.kabupaten}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Sumber Data: Siskeudes V2.0
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Kode & Bidang Kegiatan</th>
                  <th className="p-4">Sumber Dana</th>
                  <th className="p-4">Pagu Anggaran</th>
                  <th className="p-4">Realisasi</th>
                  <th className="p-4 pr-6">Batas Alokasi / KK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const percent = (
                      (item.realisasi / item.paguAnggaran) *
                      100
                    ).toFixed(0);
                    return (
                      <tr
                        key={item.kode}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="p-4 pl-6">
                          <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {item.kode}
                          </span>
                          <p className="font-bold text-slate-900 text-sm mt-1">
                            {item.namaBidang}
                          </p>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {item.sumberDana}
                          </span>
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-slate-900 text-sm">
                            {formatRupiah(item.paguAnggaran)}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-emerald-700">
                            {formatRupiah(item.realisasi)}
                          </p>
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </td>

                        <td className="p-4 pr-6">
                          {item.batasAlokasiKK ? (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-xl">
                              <span className="font-bold text-xs">
                                {formatRupiah(item.batasAlokasiKK)}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-medium">
                                / KK
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">
                              Tidak Berlaku Per KK
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Tidak ada bidang anggaran yang cocok dengan kriteria
                      pencarian.
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
