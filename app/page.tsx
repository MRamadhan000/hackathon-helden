"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Mock Data Anggaran Berdasarkan Tahun (Siskeudes Integration)
const mockAnggaranPerTahun: Record<
  string,
  {
    totalPagu: string;
    totalRealisasi: string;
    kategori: { nama: string; pagu: string; realisasi: string }[];
  }
> = {
  "2026": {
    totalPagu: "Rp 1.090.000.000",
    totalRealisasi: "Rp 800.000.000 (73.4%)",
    kategori: [
      {
        nama: "Perlindungan Sosial (Bansos BLT-DD)",
        pagu: "Rp 360.000.000",
        realisasi: "Rp 270.000.000",
      },
      {
        nama: "Operasional Aparatur Desa (ADD)",
        pagu: "Rp 280.000.000",
        realisasi: "Rp 210.000.000",
      },
      {
        nama: "Pembangunan Infrastruktur Fisik",
        pagu: "Rp 450.000.000",
        realisasi: "Rp 320.000.000",
      },
    ],
  },
  "2025": {
    totalPagu: "Rp 980.000.000",
    totalRealisasi: "Rp 978.500.000 (99.8%)",
    kategori: [
      {
        nama: "Perlindungan Sosial (Bansos BLT-DD)",
        pagu: "Rp 312.000.000",
        realisasi: "Rp 310.800.000",
      },
      {
        nama: "Operasional Aparatur Desa (ADD)",
        pagu: "Rp 250.000.000",
        realisasi: "Rp 250.000.000",
      },
      {
        nama: "Pembangunan Infrastruktur Fisik",
        pagu: "Rp 418.000.000",
        realisasi: "Rp 417.700.000",
      },
    ],
  },
  "2024": {
    totalPagu: "Rp 950.000.000",
    totalRealisasi: "Rp 950.000.000 (100%)",
    kategori: [
      {
        nama: "Perlindungan Sosial (Bansos BLT-DD)",
        pagu: "Rp 336.000.000",
        realisasi: "Rp 336.000.000",
      },
      {
        nama: "Operasional Aparatur Desa (ADD)",
        pagu: "Rp 240.000.000",
        realisasi: "Rp 240.000.000",
      },
      {
        nama: "Pembangunan Infrastruktur Fisik",
        pagu: "Rp 374.000.000",
        realisasi: "Rp 374.000.000",
      },
    ],
  },
};

export default function PublicLandingPage() {
  const router = useRouter();
  const [nikInput, setNikInput] = useState("");
  const [errorNotif, setErrorNotif] = useState("");
  const [tahunAnggaran, setTahunAnggaran] = useState("2026");

  const handleCekNikWarga = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNik = nikInput.trim();
    if (!cleanNik) {
      setErrorNotif("Silakan masukkan NIK KTP Anda terlebih dahulu.");
      return;
    }
    if (cleanNik.length !== 16) {
      setErrorNotif("NIK KTP harus terdiri dari 16 digit angka.");
      return;
    }
    setErrorNotif("");
    router.push(`/warga/dashboard?nik=${cleanNik}`);
  };

  const dataAnggaranAktif =
    mockAnggaranPerTahun[tahunAnggaran] || mockAnggaranPerTahun["2026"];

  // CONFIG GRAFIK DEMOGRAFI
  const dataDemografiJK = {
    labels: ["Laki-Laki", "Perempuan"],
    datasets: [
      {
        label: "Jumlah Jiwa",
        data: [1720, 1692],
        backgroundColor: ["#3b82f6", "#ec4899"],
        borderRadius: 8,
      },
    ],
  };

  const dataDemografiRT = {
    labels: ["RT 01", "RT 02", "RT 03", "RT 04", "RT 05"],
    datasets: [
      {
        label: "Jumlah Warga (Jiwa)",
        data: [720, 680, 810, 650, 552],
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#f1f5f9" } },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased selection:bg-blue-600 selection:text-white pb-12">
      {/* 1. HEADER / NAVBAR RESMI */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-sm shadow-xs">
              🇮🇩
            </span>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                DESA DIGITAL
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Portal Transparansi & Bantuan Sosial
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-bold text-slate-600 overflow-x-auto pb-1 sm:pb-0">
            <a
              href="#demografi"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Demografi Warga
            </a>
            <a
              href="#anggaran"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Transparansi APBDes
            </a>
            <a
              href="#cek-nik"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Layanan Mandiri
            </a>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition shadow-xs whitespace-nowrap ml-2"
            >
              Login Pegawai →
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12">
        {/* 2. HERO SECTION & PORTAL LAYANAN MANDIRI WARGA */}
        <section
          id="cek-nik"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold inline-block">
              Akuntabilitas Program Perlindungan Sosial 🤝
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
              Satu klik untuk keterbukaan data bantuan. Periksa status Anda.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
              Selamat datang di Portal Resmi Desa. Gunakan layanan mandiri di
              samping untuk mengecek status Bansos, mengajukan sanggahan rumah,
              atau perbaikan data kependudukan secara mandiri.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#anggaran"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                Cek Alokasi Dana APBDes ↓
              </a>
              {/* TOMBOL DIGANTI DARI AKSES PERANGKAT MENJADI CEK DEMOGRAFI */}
              <a
                href="#demografi"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition"
              >
                📊 Cek Demografi Penduduk
              </a>
            </div>
          </div>

          {/* CARD CHECKER LAYANAN MANDIRI WARGA */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-950">
                Layanan Mandiri Warga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan 16 Digit NIK KTP Anda untuk mengakses profil & status
                bansos.
              </p>
            </div>

            <form onSubmit={handleCekNikWarga} className="space-y-4">
              {errorNotif && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold">
                  ⚠️ {errorNotif}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  NOMOR NIK KTP (16 DIGIT)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 3507011234560001"
                  value={nikInput}
                  onChange={(e) =>
                    setNikInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition"
                />
                <span className="text-[10px] text-slate-400 font-medium block text-right">
                  {nikInput.length}/16 Digit
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Cek Status & Masuk →</span>
              </button>
            </form>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 font-medium space-y-1">
              <div className="flex items-center justify-between text-slate-900 font-bold text-xs">
                <span>🏠 Sanggah Rumah</span>
                <span>•</span>
                <span>📝 Koreksi NIK</span>
                <span>•</span>
                <span>🔒 Data Aman</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CARD STATISTIK UTAMA (TOTAL PENDUDUK & TOTAL KEPALA KELUARGA) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              👥 Jumlah Penduduk Keseluruhan
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              3.412 Jiwa
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              Terverifikasi Dukcapil Pusat
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              🏠 Total Kepala Keluarga (KK)
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              984 Keluarga
            </div>
            <p className="text-[11px] text-blue-700 font-bold">
              Tersebar di 5 Wilayah RT
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              🤝 Penerima Bantuan Aktif (KPM)
            </span>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              245 KPM
            </div>
            <p className="text-[11px] text-slate-500 font-bold">
              Program BLT Dana Desa
            </p>
          </div>
        </section>

        {/* 4. DEMOGRAFI & STATISTIK DESA (GRAFIK BAR LENGKAP) */}
        <section
          id="demografi"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase inline-block mb-1">
                📊 KEPENDUDUKAN AKURAT
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                Demografi & Statistik Penduduk Desa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statistik kependudukan terintegrasi berdasarkan kelompok gender
                dan wilayah RT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GRAFIK 1: RASIO GENDER */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                👨‍👩‍👧‍👦 Komposisi Jenis Kelamin
              </h4>
              <div className="h-48">
                <Bar data={dataDemografiJK} options={chartOptions as any} />
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                Laki-Laki: <strong>1.720 Jiwa</strong> • Perempuan:{" "}
                <strong>1.692 Jiwa</strong>
              </p>
            </div>

            {/* GRAFIK 2: SEBARAN WILAYAH RT */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                📍 Sebaran Warga Per-RT
              </h4>
              <div className="h-48">
                <Bar data={dataDemografiRT} options={chartOptions as any} />
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                RT Terbanyak: <strong>RT 03 (810 Jiwa)</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 5. TRANSPARANSI ANGGARAN APBDES (SISKEUDES) DENGAN CARD PILIHAN TAHUN */}
        <section
          id="anggaran"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase block w-fit mb-1">
                📊 Realisasi Anggaran Per Tahun (Siskeudes)
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                Transparansi Alokasi & Realisasi Dana Desa ({tahunAnggaran})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Pagu Anggaran:{" "}
                <strong className="text-slate-900">
                  {dataAnggaranAktif.totalPagu}
                </strong>{" "}
                • Total Terealisasikan:{" "}
                <strong className="text-emerald-800">
                  {dataAnggaranAktif.totalRealisasi}
                </strong>
              </p>
            </div>

            {/* CARD / TOMBOL PEMILIHAN TAHUN */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              {["2026", "2025", "2024"].map((thn) => (
                <button
                  key={thn}
                  onClick={() => setTahunAnggaran(thn)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    tahunAnggaran === thn
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {thn}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Kategori Pos Pembiayaan</th>
                  <th className="p-3 font-mono">Total Alokasi Anggaran</th>
                  <th className="p-3 font-mono text-right">
                    Anggaran yang Terealisasikan / Tersalurkan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {dataAnggaranAktif.kategori.map((kat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{kat.nama}</td>
                    <td className="p-3 font-mono font-bold text-slate-800">
                      {kat.pagu}
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-800 text-right">
                      {kat.realisasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* FOOTER RESMI */}
      <footer className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-200/80 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>
          © 2026 Pemerintah Kabupaten Malang — Portal Resmi Informasi Desa
          Digital.
        </p>
        <p>
          Sistem dibangun untuk mendukung penargetan perlindungan sosial yang
          tepat sasaran.
        </p>
      </footer>
    </div>
  );
}
