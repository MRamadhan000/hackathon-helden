"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SekdesHeaderProps {
  tahunPeriode: string;
  setTahunPeriode: (tahun: string) => void;
}

export default function SekdesHeader({
  tahunPeriode,
  setTahunPeriode,
}: SekdesHeaderProps) {
  const router = useRouter();

  // Logout & Hapus Session
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_user_role");
      localStorage.removeItem("mock_user_name");
      sessionStorage.clear();
    }
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* BRAND & JUDUL PANEL SEKDES */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white font-black flex items-center justify-center text-sm shadow-md shadow-indigo-900/20">
            SD
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-950 leading-tight uppercase tracking-tight">
              WORKSPACE SEKRETARIS DESA
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Integrasi Bansos, Mutasi Warga & Dana Desa
            </p>
          </div>
        </div>

        {/* CONTROLS: PERIODE & LOGOUT TUNGGAL */}
        <div className="flex items-center gap-3">
          {/* SELECTOR PERIODE TAHUN */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1.5 flex items-center gap-1">
              <span>📅</span> Periode:
            </span>
            <select
              value={tahunPeriode}
              onChange={(e) => setTahunPeriode(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-black text-slate-900 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-indigo-600 cursor-pointer shadow-2xs"
            >
              <option value="2026">Tahun 2026 (Aktif)</option>
              <option value="2025">Tahun 2025</option>
              <option value="2024">Tahun 2024</option>
            </select>
          </div>

          {/* TOMBOL KELUAR TUNGGAL */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80 transition flex items-center gap-1.5 cursor-pointer"
            title="Keluar dan Hapus Sesi Login"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
