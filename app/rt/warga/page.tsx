"use client";

import React, { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TableWarga, { PendudukRT } from "@/components/rt/TableWarga";
import { usePenduduk } from "@/hooks/cores/usePenduduk";
import { useAuth } from "@/hooks/useAuth";

function WargaContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  // Connection ke Supabase Hook (Tanpa mock dummy data!)
  const { data: realPendudukList, isLoading } = usePenduduk();

  // Map Data Supabase ke Format PendudukRT
  const dataWarga: PendudukRT[] = useMemo(() => {
    const areaId = currentUser?.clusterdesaId;

    return (realPendudukList || [])
      .filter((p) => !areaId || p.clusterdesaId === areaId)
      .map((p) => ({
        id: p.id,
        nik: p.nik,
        nama: p.nama,
        clusterdesaId: p.clusterdesaId,
        jenisKelamin: (p.jenisKelamin === "P" ? "P" : "L") as "L" | "P",
        tempatLahir: p.tempat_lahir,
        tanggalLahir: p.tanggal_lahir,
        statusPenduduk: (["Tetap", "Pindah", "Meninggal"].includes(
          p.statusPenduduk,
        )
          ? p.statusPenduduk
          : "Tetap") as "Tetap" | "Pindah" | "Meninggal",
        statusVerifikasiDukcapil: (p.statusVerifikasiDukcapil ===
        "Anomali / Unverified"
          ? "Anomali / Unverified"
          : "Terverifikasi") as "Terverifikasi" | "Anomali / Unverified",
        terakhirDiperbarui: new Date(p.updated_at).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }));
  }, [realPendudukList, currentUser?.clusterdesaId]);

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

        {isLoading ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-white rounded-2xl border">
            Memuat master data warga dari Supabase...
          </div>
        ) : (
          <TableWarga data={dataWarga} />
        )}
      </div>
    </div>
  );
}

export default function HalamanWarga() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Halaman Warga...
        </div>
      }
    >
      <WargaContent />
    </Suspense>
  );
}
