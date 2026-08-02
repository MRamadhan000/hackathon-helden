import React from "react";
import Link from "next/link";

interface ExecutiveStatCardsProps {
  dataKades: any;
  tahunPeriode: string;
  onOpenModal: (type: string) => void;
}

export default function ExecutiveStatCards({
  dataKades,
  tahunPeriode,
  onOpenModal,
}: ExecutiveStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* CARD 1: DATA PENDUDUK */}
      <Link
        href={`/kades/detail-penduduk?tahun=${tahunPeriode}`}
        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all duration-200 space-y-2 block group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Penduduk Terdata
          </span>
          <span className="text-xs text-blue-600 font-bold group-hover:underline">
            Detail →
          </span>
        </div>
        <p className="text-2xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
          {dataKades?.totalWarga || "0"}{" "}
          <span className="text-xs font-bold text-slate-500">Jiwa</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Master Data RT Selesai Validasi
        </p>
      </Link>

      {/* CARD 2: TOTAL KPM BANSOS */}
      <Link
        href={`/kades/detail-kpm?tahun=${tahunPeriode}`}
        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all duration-200 space-y-2 block group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total KPM Bansos Aktif
          </span>
          <span className="text-xs text-blue-600 font-bold group-hover:underline">
            Detail →
          </span>
        </div>
        <p className="text-2xl font-black text-blue-900 group-hover:text-blue-600 transition-colors">
          {dataKades?.totalKpmAktif || 0}{" "}
          <span className="text-xs font-bold text-slate-500">Keluarga</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Penerima Manfaat Sah SK Kades
        </p>
      </Link>

      {/* CARD 3: TOTAL ANGGARAN */}
      <Link
        href={`/kades/detail-anggaran?tahun=${tahunPeriode}`}
        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 space-y-2 block group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Anggaran (Keseluruhan)
          </span>
          <span className="text-xs text-emerald-600 font-bold group-hover:underline">
            Detail →
          </span>
        </div>
        <p className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
          {dataKades?.paguAnggaranBansos || "Rp 0"}
        </p>
        <p className="text-[11px] text-slate-500">
          Pagu Total Siskeudes Periode {tahunPeriode}
        </p>
      </Link>

      {/* CARD 4: REALISASI ANGGARAN (Mengarahkan ke detail-realisasi) */}
      <Link
        href={`/kades/detail-realisasi?tahun=${tahunPeriode}`}
        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-500/50 transition-all duration-200 space-y-2 block group cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Realisasi Anggaran
          </span>
          <span className="text-xs text-amber-600 font-bold group-hover:underline">
            Detail →
          </span>
        </div>
        <p className="text-2xl font-black text-emerald-800 group-hover:text-amber-600 transition-colors">
          {dataKades?.realisasiAnggaran || "Rp 0"}
        </p>
        <p className="text-[11px] text-slate-500">
          Sisa Pagu: {dataKades?.sisaPaguSiskeudes || "Rp 0"}
        </p>
      </Link>
    </div>
  );
}
