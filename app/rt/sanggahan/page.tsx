"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CardSanggahan, {
  SanggahanDataPenduduk,
  SanggahanKondisiRumah,
} from "@/components/rt/CardSanggahan";

const mockSanggahanPendudukPerTahun: Record<string, SanggahanDataPenduduk[]> = {
  "2026": [
    {
      id: "sp-2026-1",
      namaPelapor: "Siti Aminah",
      nikPelapor: "3507019876540002",
      jenisKetidakcocokan: "Ejaan Nama / NIK Typo",
      alasanSanggahan:
        "Ejaan nama di KTP terdaftar Siti Aminah, S.Pd tetapi di data desa belum ada gelar.",
      tanggalMasuk: "01/08/2026",
      status: "Pending",
    },
  ],
  "2025": [
    {
      id: "sp-2025-1",
      namaPelapor: "Budi Santoso",
      nikPelapor: "3507011234560001",
      jenisKetidakcocokan: "Status Domisili",
      alasanSanggahan: "Perbaikan nomor rumah RT 03 / RW 01.",
      tanggalMasuk: "14/05/2025",
      status: "Diajukan ke Sekdes",
    },
  ],
  "2024": [
    {
      id: "sp-2024-1",
      namaPelapor: "Joko Widodo",
      nikPelapor: "3507015554440003",
      jenisKetidakcocokan: "Ejaan Nama / NIK Typo",
      alasanSanggahan: "Koreksi NIK digit terakhir.",
      tanggalMasuk: "10/09/2024",
      status: "Tidak Diajukan",
    },
  ],
};

const mockSanggahanRumahPerTahun: Record<string, SanggahanKondisiRumah[]> = {
  "2026": [
    {
      id: "sr-2026-1",
      namaPelapor: "Ahmad Subari",
      nikPelapor: "3507010202020003",
      jenisLantai: "Tanah / Plester Rusak",
      jenisDinding: "Bambu / Kayu Lapuk",
      sanitasi: "Numpang / Tidak Ada Jamban",
      skorSistem: 75,
      alasanWarga:
        "Kondisi dinding rumah lapuk dan belum punya jamban pribadi, mohon diusulkan BLT.",
      tanggalMasuk: "31/07/2026",
      status: "Pending",
    },
  ],
  "2025": [
    {
      id: "sr-2025-1",
      namaPelapor: "Siti Aminah",
      nikPelapor: "3507019876540002",
      jenisLantai: "Semen / Keramik",
      jenisDinding: "Tembok / Kayu Bagus",
      sanitasi: "Jamban Pribadi",
      skorSistem: 20,
      alasanWarga: "Pengusulan PKH Lansia.",
      tanggalMasuk: "02/03/2025",
      status: "Diajukan ke Sekdes",
    },
  ],
  "2024": [],
};

export default function HalamanSanggahan() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const sanggahanPendudukAktif =
    mockSanggahanPendudukPerTahun[tahunPeriode] || [];
  const sanggahanRumahAktif = mockSanggahanRumahPerTahun[tahunPeriode] || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/rt?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            ← Kembali ke Panel RT
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        <CardSanggahan
          tahunPeriode={tahunPeriode}
          sanggahanPendudukList={sanggahanPendudukAktif}
          sanggahanRumahList={sanggahanRumahAktif}
          onAjukanPendudukKeSekdes={() => {}}
          onAjukanRumahKeSekdes={() => {}}
        />
      </div>
    </div>
  );
}
