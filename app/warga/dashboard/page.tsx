"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardWarga() {
  const router = useRouter();
  const [namaWarga, setNamaWarga] = useState("Bapak / Ibu Warga");

  useEffect(() => {
    const savedNama = localStorage.getItem("warga_nama");
    if (savedNama) setNamaWarga(savedNama);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("warga_nik");
    localStorage.removeItem("warga_nama");
    router.push("/warga/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      {/* HEADER MANTAP WARGA */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-base shadow-md shadow-blue-600/20">
              🏡
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 leading-tight">
                Layanan Warga Mandiri
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Informasi Desa Digital
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80 transition flex items-center gap-1 cursor-pointer"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* BANNER UCAPAN SELAMAT DATANG */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold">
            👋 Sugeng Rawuh / Selamat Datang
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
            Halo, {namaWarga}! Apa yang ingin Anda perbarui hari ini?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Silakan pilih salah satu layanan di bawah ini. Setiap laporan yang
            Anda kirimkan akan diteruskan ke Ketua RT untuk diverifikasi secara
            santun dan transparan.
          </p>
        </div>

        {/* 2 KARTU UTAMA WARGA (BAHASA SEDERHANA & SOPAN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: LAPORKAN KONDISI RUMAH (BANSOS) */}
          <Link
            href="/warga/sanggah-rumah"
            className="group bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
                  USULAN & BANTUAN SOSIAL
                </span>
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  🏠
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                  1. Laporkan Kondisi Rumah
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Bantu kami memperbarui data kelayakan kondisi rumah Anda
                  (atap, dinding, lantai, atau sanitasi) agar pengusulan Bantuan
                  Sosial (Bansos) lebih tepat sasaran.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span className="text-slate-400 font-medium">
                Pemeriksaan Bertahap RT
              </span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Isi Formulir Rumah →
              </span>
            </div>
          </Link>

          {/* CARD 2: PERBAIKI DATA DIRI (MUTASI/KEPENDUDUKAN) */}
          <Link
            href="/warga/perbaiki-data"
            className="group bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
                  DATA KEPENDUDUKAN
                </span>
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  📝
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  2. Perbaiki Data Diri & Keluarga
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Ajukan perbaikan apabila terdapat penulisan ejaan nama, NIK,
                  tanggal lahir, atau alamat yang belum sesuai pada data
                  keluarga Anda.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span className="text-slate-400 font-medium">
                Pembaruan Data Cepat
              </span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Koreksi Data Diri →
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
