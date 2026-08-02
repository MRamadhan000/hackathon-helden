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
      setErrorNotif("Masukkan NIK KTP Anda.");
      return;
    }
    if (cleanNik.length !== 16) {
      setErrorNotif("NIK harus 16 digit.");
      return;
    }
    setErrorNotif("");
    router.push(`/warga/dashboard?nik=${cleanNik}`);
  };

  const dataAnggaranAktif =
    mockAnggaranPerTahun[tahunAnggaran] || mockAnggaranPerTahun["2026"];

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
        label: "Jumlah Warga",
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
      {/* 1. HEADER / NAVBAR */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-sm">
              🇮🇩
            </span>
            <div>
              <h1 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                DESA DIGITAL
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Desa Suka Makmur, Kab. Malang
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-bold text-slate-600 overflow-x-auto pb-1 sm:pb-0">
            <a
              href="#lokasi-jam"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Lokasi & Kontak
            </a>
            <a
              href="#demografi"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Data Warga
            </a>
            <a
              href="#anggaran"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Dana Desa
            </a>
            <a
              href="#cek-nik"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Cek Bansos
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
        {/* 2. HERO & CEK NIK */}
        <section
          id="cek-nik"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold inline-block">
              Transparansi Bantuan Sosial 🤝
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
              Cek status bantuan dan layanan warga dengan mudah.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
              Portal resmi informasi Desa Suka Makmur. Gunakan menu di samping
              untuk melihat status bansos, lapor rumah tidak layak, atau
              memperbarui data KTP Anda.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#anggaran"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
              >
                Lihat Dana Desa ↓
              </a>
              <a
                href="#demografi"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition"
              >
                📊 Statistik Penduduk
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-950">
                Layanan Mandiri Warga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan 16 digit NIK KTP Anda untuk mulai mengecek data.
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
                  NOMOR NIK KTP
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Cek Status Sekarang →</span>
              </button>
            </form>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 font-medium text-center">
              Aman, cepat, dan transparan untuk seluruh warga.
            </div>
          </div>
        </section>

        {/* 3. STATISTIK UTAMA PENDUDUK */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              👥 Total Penduduk
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              3.412 Jiwa
            </div>
            <p className="text-[11px] text-emerald-700 font-bold">
              Data Resmi Dukcapil
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              🏠 Total Kepala Keluarga
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              984 KK
            </div>
            <p className="text-[11px] text-blue-700 font-bold">
              Tersebar di 5 RT
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              🤝 Penerima Bansos Aktif
            </span>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              245 KPM
            </div>
            <p className="text-[11px] text-slate-500 font-bold">
              Bantuan Langsung Tunai
            </p>
          </div>
        </section>

        {/* 4. DEMOGRAFI & GRAFIK */}
        <section
          id="demografi"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase inline-block mb-1">
              📊 DATA KEPENDUDUKAN
            </span>
            <h3 className="text-base font-extrabold text-slate-950">
              Statistik Warga Berdasarkan Gender & Wilayah
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                Komposisi Kelamin
              </h4>
              <div className="h-48">
                <Bar data={dataDemografiJK} options={chartOptions as any} />
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                Laki-Laki: <strong>1.720</strong> | Perempuan:{" "}
                <strong>1.692</strong>
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                Jumlah Warga Per RT
              </h4>
              <div className="h-48">
                <Bar data={dataDemografiRT} options={chartOptions as any} />
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">
                Terbanyak di <strong>RT 03 (810 Jiwa)</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 5. TRANSPARANSI ANGGARAN APBDES */}
        <section
          id="anggaran"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase block w-fit mb-1">
                💰 DANA DESA
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                Transparansi Anggaran APBDes ({tahunAnggaran})
              </h3>
            </div>

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
                  <th className="p-3">Bidang Kegiatan</th>
                  <th className="p-3 font-mono">Pagu Anggaran</th>
                  <th className="p-3 font-mono text-right">
                    Realisasi Tersalurkan
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

        {/* 2.5 LOKASI MAPS (8 Kolom / 2/3) & 2 WIDGET KANAN TERSUSUN (4 Kolom / 1/3) */}
        <section
          id="lokasi-jam"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* MOCK MAPS (8 Kolom) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100 uppercase inline-block mb-1">
                  🗺️ Peta Lokasi Kantor
                </span>
                <h3 className="text-base font-extrabold text-slate-950">
                  Denah & Titik Koordinat Desa Suka Makmur
                </h3>
              </div>
            </div>

            <div className="relative w-full h-[260px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-slate-300 -translate-y-1/2 rotate-6"></div>
                <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-slate-300 rotate-12"></div>
                <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-slate-300 -rotate-12"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-blue-900 text-white font-bold text-xs px-3 py-1.5 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5">
                  <span>📍</span> Kantor Desa Suka Makmur
                </div>
                <div className="w-3 h-3 bg-blue-600 rotate-45 -mt-1.5 border-2 border-white"></div>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Alamat: Jl. Raya Merdeka No. 45, RT 03 / RW 01, Kab. Malang, Jawa
              Timur.
            </p>
          </div>

          {/* SISI KANAN (4 Kolom / 1/3) TERBAGI 2 BARIS KONSISTEN */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            {/* WIDGET ATAS: JAM KANTOR */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 uppercase inline-block mb-2">
                  🕒 Jam Kantor
                </span>
                <h4 className="text-sm font-extrabold text-slate-950 mb-2">
                  Waktu Pelayanan
                </h4>

                <ul className="text-xs text-slate-600 space-y-2 font-medium">
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span>Senin - Kamis</span>
                    <strong className="text-slate-900 font-mono">
                      08:00 - 15:00
                    </strong>
                  </li>
                  <li className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span>Jumat</span>
                    <strong className="text-slate-900 font-mono">
                      08:00 - 14:30
                    </strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabtu - Minggu</span>
                    <strong className="text-rose-600 font-bold">Libur</strong>
                  </li>
                </ul>
              </div>
            </div>

            {/* WIDGET BAWAH: WHATSAPP PELAYANAN */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase">
                    💬 WhatsApp
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-950 mb-1">
                  Layanan Online
                </h4>

                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                  Butuh tanya syarat atau bantuan darurat? Chat staf kami
                  langsung.
                </p>
              </div>

              <a
                href="https://wa.me/6285238795985?text=Halo%20Admin%20Desa%20Suka%20Makmur,%20saya%20ingin%20bertanya%20mengenai%20layanan%20administrasi."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 shadow-xs"
              >
                <span>📱 Chat WhatsApp Desa</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-200/80 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <p>© 2026 Pemerintah Desa Suka Makmur, Kab. Malang.</p>
        <p>Portal Resmi Layanan & Transparansi Desa.</p>
      </footer>
    </div>
  );
}
