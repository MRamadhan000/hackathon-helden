"use client";

import React, { useState } from "react";
import Link from "next/link";

interface EvaluasiItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  statLabel: string;
  statValue: string;
  badge: string;
  badgeColor: string;
  updatedAt: string;
}

const listEvaluasi: EvaluasiItem[] = [
  {
    id: "1",
    slug: "bansos",
    title: "Daftar Penerima Bantuan Sosial",
    category: "Perlindungan Sosial",
    description:
      "Hasil evaluasi kriteria kelayakan keluarga penerima manfaat (PKH, BLT Dana Desa, BPNT) berbasis scoring data induk.",
    statLabel: "Total Penerima Terverifikasi",
    statValue: "342 KK",
    badge: "Siap Disalurkan",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    updatedAt: "1 Agustus 2026",
  },
  {
    id: "2",
    slug: "kemutakhiran-data",
    title: "Evaluasi Kemutakhiran Data Penduduk",
    category: "Data Induk",
    description:
      "Laporan hasil validasi data warga oleh Ketua RT dan Kader Posyandu. Mencakup deteksi duplikasi dan status aktif.",
    statLabel: "Tingkat Kemutakhiran",
    statValue: "92.4%",
    badge: "Selesai Evaluasi",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    updatedAt: "28 Juli 2026",
  },
  {
    id: "3",
    slug: "realisasi-apbdes",
    title: "Laporan Realisasi APBDes",
    category: "Transparansi Anggaran",
    description:
      "Evaluasi penyerapan anggaran belanja desa per bidang dan kegiatan berdasarkan data sinkronisasi Siskeudes.",
    statLabel: "Penyerapan Anggaran",
    statValue: "68.5%",
    badge: "Dalam Skenario T2",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    updatedAt: "15 Juli 2026",
  },
  {
    id: "4",
    slug: "layanan-surat",
    title: "Evaluasi Kinerja Layanan Surat",
    category: "Digital Governance",
    description:
      "Metrik kecepatan pemrosesan permohonan surat warga dari pengajuan hingga penandatanganan oleh Kepala Desa.",
    statLabel: "Rata-rata Waktu Layanan",
    statValue: "18 Menit",
    badge: "Sangat Baik",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    updatedAt: "30 Juli 2026",
  },
];

export default function EvaluasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Perlindungan Sosial",
    "Data Induk",
    "Transparansi Anggaran",
    "Digital Governance",
  ];

  const filteredEvaluasi = listEvaluasi.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "Semua" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-10">
      {/* Container Utama */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200/60 rounded-full text-xs font-semibold text-slate-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Informasi Terpadu Desa
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Hasil Evaluasi Desa
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Pilih laporan hasil evaluasi untuk melihat analisis detail dan
              data terverifikasi.
            </p>
          </div>

          <Link
            href="/"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
            <input
              type="text"
              placeholder="Cari hasil evaluasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid (Card Besar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvaluasi.length > 0 ? (
            filteredEvaluasi.map((item) => (
              <Link
                key={item.id}
                href={`/evaluasi/${item.slug}`}
                className="group relative bg-white border border-slate-100 hover:border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition mb-2">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Stats & CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.statLabel}
                    </p>
                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                      {item.statValue}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-900 group-hover:translate-x-1 transition-transform">
                    Lihat Hasil
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100">
              <p className="text-slate-400 text-sm">
                Tidak ada hasil evaluasi yang cocok dengan pencarian Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
