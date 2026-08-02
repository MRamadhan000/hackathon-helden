"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import SekdesHeader from "@/components/sekdes/SekdesHeader";

function DashboardSekdesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // LIST KARTU DENGAN INFORMASI & INDIKATOR DATA UNTUK VALiDASI
  const menuCards = [
    {
      id: "berkas-rt",
      title: "Validasi Berkas & Mutasi RT",
      tag: "1. BERKAS MASUK",
      urgentCount: 2,
      desc: "Periksa usulan pendaftaran warga baru, mutasi kematian, dan perubahan domisili dari Ketua RT.",
      icon: "📋",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      href: `/sekdes/berkas-rt?tahun=${tahunPeriode}`,
      infoText: "2 Permohonan Menunggu Persetujuan",
      infoBg: "bg-rose-50 border-rose-200/80 text-rose-900",
      dotColor: "bg-rose-500",
    },
    {
      id: "sanggahan-bansos",
      title: "Validasi Sanggahan Kelayakan Bansos",
      tag: "2. RESPON WARGA",
      urgentCount: 1,
      desc: "Tindak lanjuti sanggahan kondisi rumah atau ketidakcocokan data kependudukan kurang mampu dari warga.",
      icon: "⚖️",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      href: `/sekdes/sanggahan?tahun=${tahunPeriode}`,
      infoText: "1 Sanggahan Perlu Ditinjau ulang",
      infoBg: "bg-amber-50 border-amber-200/80 text-amber-900",
      dotColor: "bg-amber-500",
    },
    {
      id: "rekomendasi-sk",
      title: "Rekomendasi Draft SK KPM Bansos",
      tag: "3. DRAFT SK KADES",
      urgentCount: 2,
      desc: "Tinjau kelayakan skor Prodeskel/DTKS hasil verifikasi RT untuk disusun menjadi draft SK Kades.",
      icon: "📜",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      href: `/sekdes/rekomendasi-sk?tahun=${tahunPeriode}`,
      infoText: "2 Draft SK Siap Diajukan ke Kades",
      infoBg: "bg-emerald-50 border-emerald-200/80 text-emerald-900",
      dotColor: "bg-emerald-500",
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
              Berikut adalah ringkasan usulan dan laporan dari Ketua RT yang
              membutuhkan tindakan verifikasi Anda.
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

        {/* GRID KARTU NAVIGASI UTAMA (3 CARD TERVISI DENGAN INDIKATOR PER-CARD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-500/50 transition-all duration-200 flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Tag + Badge Jumlah Data */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${card.badgeColor}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${card.dotColor} animate-pulse`}
                    />
                    {card.tag}
                  </span>
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {card.icon}
                  </span>
                </div>

                {/* Judul & Deskripsi */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* NOTIFIKASI INFORMASI DENGAN JUMLAH DATA MASUK */}
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 ${card.infoBg}`}
                >
                  <span className="text-sm shrink-0">🔔</span>
                  <span className="leading-snug">{card.infoText}</span>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span className="text-slate-400 font-medium text-[11px]">
                  Klik untuk memproses
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

// EXPORT DEFAULT UTAMA DENGAN SUSPENSE BOUNDARY
export default function DashboardSekdes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-10 text-center text-xs text-slate-400 font-medium">
          Memuat Panel Sekretaris Desa...
        </div>
      }
    >
      <DashboardSekdesContent />
    </Suspense>
  );
}
