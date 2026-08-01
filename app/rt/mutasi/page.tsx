"use client";

import React, { useState } from "react";
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

export default function HalamanMutasi() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [selectedNik, setSelectedNik] = useState("");

  const handleMutasiSubmit = (e: React.FormEvent, data: any) => {
    e.preventDefault();
    alert("Laporan mutasi berhasil dikirimkan ke Sekretaris Desa!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 space-y-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
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

        <FormMutasiLengkap
          tahunPeriode={tahunPeriode}
          daftarWarga={mockWargaRT}
          selectedNik={selectedNik}
          setSelectedNik={setSelectedNik}
          onSubmitMutasi={handleMutasiSubmit}
        />
      </div>
    </div>
  );
}
