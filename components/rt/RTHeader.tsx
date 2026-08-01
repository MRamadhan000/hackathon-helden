"use client";

import React from "react";

interface RTHeaderProps {
  tahunPeriode: string;
  setTahunPeriode: (tahun: string) => void;
}

export default function RTHeader({
  tahunPeriode,
  setTahunPeriode,
}: RTHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* BRAND & JUDUL */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-900/20">
            RT
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-950 leading-tight">
              PANEL UTAMA KETUA RT 03
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Verifikasi & Pelaporan Mandiri Kependudukan Desa
            </p>
          </div>
        </div>

        {/* SELECTOR PERIODE / TAHUN DATA */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2 flex items-center gap-1">
            <span>📅</span> Periode:
          </span>
          <select
            value={tahunPeriode}
            onChange={(e) => setTahunPeriode(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-black text-slate-900 py-1.5 px-3 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="2026">Tahun 2026 (Aktif)</option>
            <option value="2025">Tahun 2025</option>
            <option value="2024">Tahun 2024</option>
          </select>
        </div>
      </div>
    </header>
  );
}
