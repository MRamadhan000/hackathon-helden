"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-lg rounded-xl shadow-md shadow-blue-900/10">
          🇮🇩
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-blue-950 uppercase">
            Desa Digital
          </h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wide">
            Portal Transparansi & Bantuan Sosial
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-700">
        <a href="#statistik" className="hover:text-blue-600 transition">
          Statistik Data
        </a>
        <a href="#anggaran" className="hover:text-blue-600 transition">
          Transparansi APBDes
        </a>
        <a href="#cek-nik" className="hover:text-blue-600 transition">
          Layanan Mandiri Warga
        </a>
        <Link
          href="/evaluasi"
          className="hover:text-blue-600 transition text-indigo-600 font-extrabold"
        >
          📊 Hasil Evaluasi
        </Link>
      </div>

      <div>
        <Link
          href="/login"
          className="bg-[#0f172a] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
        >
          Masuk Staff Portal
        </Link>
      </div>
    </nav>
  );
}
