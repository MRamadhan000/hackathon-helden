"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import RTHeader from "@/components/rt/RTHeader";

// KOMPONEN UTAMA DENGAN LOGIKA useSearchParams
function DashboardRTContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inisialisasi state tahun dari URL params atau LocalStorage (Default: 2026)
  const [tahunPeriode, setTahunPeriodeState] = useState("2026");

  useEffect(() => {
    // 1. Cek dari URL Query dahulu
    const queryTahun = searchParams.get("tahun");
    if (queryTahun) {
      setTahunPeriodeState(queryTahun);
      localStorage.setItem("rt_tahun_periode", queryTahun);
    } else {
      // 2. Jika URL tidak ada query, cek dari LocalStorage
      const savedTahun = localStorage.getItem("rt_tahun_periode");
      if (savedTahun) {
        setTahunPeriodeState(savedTahun);
      }
    }
  }, [searchParams]);

  // Handler Ganti Tahun: Simpan ke LocalStorage dan Update Query URL
  const setTahunPeriode = (tahun: string) => {
    setTahunPeriodeState(tahun);
    localStorage.setItem("rt_tahun_periode", tahun);
    router.replace(`/rt?tahun=${tahun}`);
  };

  // Kartu Navigasi Utama dengan Query Parameter Tahun Konsisten
  const menuCards = [
    {
      id: "warga",
      title: "Master Data Warga",
      tag: "MASTER DATA WARGA",
      desc: "Lihat dan kelola master data identitas serta status keberadaan warga di lingkungan RT 03.",
      icon: "👥",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      href: `/rt/warga?tahun=${tahunPeriode}`,
      countText: "Data Terintegrasi",
    },
    {
      id: "mutasi",
      title: "Pendataan & Mutasi Warga",
      tag: "PEMBARUAN DATA",
      desc: "Kumpulkan data warga baru, perubahan domisili pindah, atau pembaruan status kematian.",
      icon: "📋",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      href: `/rt/mutasi?tahun=${tahunPeriode}`,
      countText: "Form & Riwayat Laporan",
    },
    {
      id: "kelayakan",
      title: "Pengumpulan Data Kelayakan Bansos",
      tag: "VERIFIKASI LAPANGAN",
      desc: "Survei kriteria Prodeskel DDK warga kurang mampu untuk diusulkan masuk alokasi Bansos SK Baru.",
      icon: "🤝",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      href: `/rt/kelayakan?tahun=${tahunPeriode}`,
      countText: "Indikator Prodeskel DDK",
    },
    {
      id: "sanggahan",
      title: "Kelola Sanggahan Warga",
      tag: "SANGGAHAN MASUK",
      desc: "Respon dan tindak lanjuti sanggahan warga terkait ketidakcocokan data kependudukan maupun kondisi rumah.",
      icon: "⚠️",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      href: `/rt/sanggahan?tahun=${tahunPeriode}`,
      countText: "Alur Berjenjang RT -> Sekdes",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      {/* HEADER UTAMA PANEL RT */}
      <RTHeader tahunPeriode={tahunPeriode} setTahunPeriode={setTahunPeriode} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        {/* BANNER SELAMAT DATANG */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Selamat Datang di Panel Kerja RT 03 / RW 01 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Silahkan pilih salah satu kartu fitur di bawah ini untuk mengelola
              data warga, memproses mutasi, melakukan survei kelayakan bansos,
              atau menindaklanjuti sanggahan.
            </p>
          </div>
          <div className="px-4 py-2 bg-blue-50 border border-blue-200/80 rounded-xl shrink-0 self-start sm:self-auto">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
              Status Operasional
            </span>
            <span className="text-xs font-black text-blue-950">
              Periode Aktif {tahunPeriode}
            </span>
          </div>
        </div>

        {/* GRID KARTU NAVIGASI UTAMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${card.badgeColor}`}
                  >
                    {card.tag}
                  </span>
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {card.icon}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span className="text-slate-400 font-medium">
                  {card.countText}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Buka Halaman Fitur →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

// EXPORT DEFAULT UTAMA DENGAN SUSPENSE BOUNDARY
export default function DashboardRT() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-10 text-center text-xs text-slate-400">
          Memuat Panel Utama RT...
        </div>
      }
    >
      <DashboardRTContent />
    </Suspense>
  );
}
