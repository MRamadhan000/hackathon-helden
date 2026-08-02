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

export default function PublicLandingPage() {
  const router = useRouter();
  const [nikInput, setNikInput] = useState("");
  const [errorNotif, setErrorNotif] = useState("");

  // State Formulir Pengaduan Publik
  const [namaPengadu, setNamaPengadu] = useState("");
  const [kategoriPengaduan, setKategoriPengaduan] =
    useState("Pelayanan Publik");
  const [isiPengaduan, setIsiPengaduan] = useState("");
  const [notifPengaduan, setNotifPengaduan] = useState("");

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

  const handleKirimPengaduan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isiPengaduan.trim()) return;
    setNotifPengaduan(
      "✓ Pengaduan Anda berhasil terkirim dan akan ditinjau oleh Sekretaris Desa.",
    );
    setNamaPengadu("");
    setIsiPengaduan("");
    setTimeout(() => setNotifPengaduan(""), 5000);
  };

  // CONFIG GRAFIK DEMOGRAFI (JENIS KELAMIN & SEBARAN RT)
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
    plugins: {
      legend: { display: false },
    },
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
              href="#pengaduan"
              className="hover:text-blue-900 transition whitespace-nowrap"
            >
              Kanal Pengaduan
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
              <Link
                href="/login"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition"
              >
                Akses Perangkat Desa 🪪
              </Link>
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

        {/* 3. DEMOGRAFI & STATISTIK DESA (GRAFIK BAR LENGKAP - PERBAIKAN POIN 3) */}
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
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 self-start sm:self-auto">
              Total 3.412 Jiwa (984 KK)
            </span>
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

        {/* 4. KANAL PENGADUAN & ASPIRASI PUBLIK (PERBAIKAN POIN 4) */}
        <section
          id="pengaduan"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 uppercase inline-block mb-1">
              📣 LAYANAN ASPIRASI WARGA
            </span>
            <h3 className="text-base font-extrabold text-slate-950">
              Kanal Pengaduan & Layanan Publik Desa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sampaikan pengaduan, masukan, atau kendala fasilitas umum desa
              untuk ditindaklanjuti Sekretaris Desa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* FORMULIR PENGADUAN PUBLIK */}
            <form
              onSubmit={handleKirimPengaduan}
              className="md:col-span-7 space-y-4"
            >
              {notifPengaduan && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold">
                  {notifPengaduan}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">
                    Nama Pelapor (Opsional / Anonim)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Anda..."
                    value={namaPengadu}
                    onChange={(e) => setNamaPengadu(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">
                    Kategori Pengaduan
                  </label>
                  <select
                    value={kategoriPengaduan}
                    onChange={(e) => setKategoriPengaduan(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-600 cursor-pointer"
                  >
                    <option value="Pelayanan Publik">
                      Pelayanan Administrasi
                    </option>
                    <option value="Infrastruktur / Fasilitas">
                      Fasilitas Jalan / Saluran
                    </option>
                    <option value="Bantuan Sosial">
                      Kritik & Saran Bansos
                    </option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">
                  Detail Isi Pengaduan / Aspirasi
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan keluhan atau laporan Anda secara jelas..."
                  value={isiPengaduan}
                  onChange={(e) => setIsiPengaduan(e.target.value)}
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
              >
                Kirim Laporan Pengaduan →
              </button>
            </form>

            {/* LOG ARSIP PENGADUAN TERKINI */}
            <div className="md:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                ⏱️ Status Pengaduan Publik Terakhir:
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-500">
                      29/07/2026 • Infrastruktur
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold rounded">
                      ✓ Selesai
                    </span>
                  </div>
                  <p className="font-medium text-slate-800">
                    Perbaikan Penerangan Jalan Dusun Krajan RT 02 telah
                    direalisasikan.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-500">
                      25/07/2026 • Pelayanan
                    </span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 font-extrabold rounded">
                      ⏳ Proses RT
                    </span>
                  </div>
                  <p className="font-medium text-slate-800">
                    Usulan pembuatan KTP baru warga disabilitas sedang
                    didampingi kader RT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TRANSPARANSI ANGGARAN APBDES (SISKEUDES) */}
        <section
          id="anggaran"
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase block w-fit mb-1">
                📊 Anggaran Terbuka (SISKEUDES)
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                Realisasi & Alokasi Pembiayaan Anggaran Desa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seluruh rekapitulasi pengeluaran dan pemasukan dana desa
                dipublikasikan secara transparan setelah melalui validasi
                menyeluruh oleh Sekretaris Desa.
              </p>
            </div>

            <Link
              href="/siskeudes"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition shrink-0 self-start sm:self-auto"
            >
              Buka Detail Laporan Siskeudes →
            </Link>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Kategori Pos Pembiayaan</th>
                  <th className="p-3 font-mono">Plafon Rencana</th>
                  <th className="p-3 font-mono text-right">
                    Realisasi Penyaluran
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">
                    Perlindungan Sosial (Bansos)
                  </td>
                  <td className="p-3 font-mono">Rp 360.000.000</td>
                  <td className="p-3 font-mono font-bold text-emerald-800 text-right">
                    Rp 270.000.000
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">
                    Operasional Aparatur Desa (ADD)
                  </td>
                  <td className="p-3 font-mono">Rp 280.000.000</td>
                  <td className="p-3 font-mono font-bold text-emerald-800 text-right">
                    Rp 210.000.000
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">
                    Pembangunan Infrastruktur Fisik
                  </td>
                  <td className="p-3 font-mono">Rp 450.000.000</td>
                  <td className="p-3 font-mono font-bold text-emerald-800 text-right">
                    Rp 320.000.000
                  </td>
                </tr>
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
