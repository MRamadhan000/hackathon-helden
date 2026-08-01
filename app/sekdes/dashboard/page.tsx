"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SekdesHeader from "@/components/sekdes/SekdesHeader";

export default function DashboardSekdes() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Inisialisasi state tahun konsisten
  const [tahunPeriode, setTahunPeriodeState] = useState("2026");

  useEffect(() => {
    const queryTahun = searchParams.get("tahun");
    if (queryTahun) {
      setTahunPeriodeState(queryTahun);
      localStorage.setItem("sekdes_tahun_periode", queryTahun);
    } else {
      const savedTahun = localStorage.getItem("sekdes_tahun_periode");
      if (savedTahun) {
        setTahunPeriodeState(savedTahun);
      }
    }
  }, [searchParams]);

  const setTahunPeriode = (tahun: string) => {
    setTahunPeriodeState(tahun);
    localStorage.setItem("sekdes_tahun_periode", tahun);
    router.replace(`/sekdes/dashboard?tahun=${tahun}`);
  };

  // List Kartu Navigasi Utama Sekdes
  const menuCards = [
    {
      id: "berkas-rt",
      title: "Validasi Berkas & Mutasi RT",
      tag: "3 BERKAS MASUK",
      desc: "Periksa dan verifikasi usulan warga baru, mutasi kematian, serta perbaikan data dari seluruh Ketua RT.",
      icon: "📋",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      href: `/sekdes/berkas-rt?tahun=${tahunPeriode}`,
      countText: "Perlu Validasi Segera",
    },
    {
      id: "siskeudes",
      title: "Audit Pagu Siskeudes & Dana Desa",
      tag: "POSISI KAS SINKRON",
      desc: "Pantau ketersediaan Pagu Dana Siskeudes (RKD) dan simulasi batas kuota penerima Bansos desa.",
      icon: "💰",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      href: `/sekdes/siskeudes?tahun=${tahunPeriode}`,
      countText: "Pagu Rp 90.000.000",
    },
    {
      id: "rekomendasi-sk",
      title: "Rekomendasi Draft SK KPM Bansos",
      tag: "2 DRAFT SK SIAP",
      desc: "Tinjau kelayakan skor DTKS/Prodeskel warga hasil verifikasi RT untuk diajukan penetapan SK ke Kepala Desa.",
      icon: "📄",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      href: `/sekdes/rekomendasi-sk?tahun=${tahunPeriode}`,
      countText: "Aplikasi SK Kades",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      {/* HEADER UTAMA SEKDES */}
      <SekdesHeader
        tahunPeriode={tahunPeriode}
        setTahunPeriode={setTahunPeriode}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        {/* BANNER SELAMAT DATANG */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Selamat Datang Kembali, Ibu Siti (Sekretaris Desa) 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Seluruh usulan dari Ketua RT dikelompokkan berdasarkan prioritas
              aksi untuk mempermudah pemantauan dan keputusan validasi Anda.
            </p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200/80 rounded-xl shrink-0 self-start sm:self-auto">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
              Tahun Anggaran
            </span>
            <span className="text-xs font-black text-indigo-950">
              Periode {tahunPeriode}
            </span>
          </div>
        </div>

        {/* GRID KARTU NAVIGASI UTAMA (3 CARD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden"
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
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span className="text-slate-400 font-medium">
                  {card.countText}
                </span>
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Buka Berkas →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
