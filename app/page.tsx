"use client";

import { useState } from "react";

// Simulasi pengecekan NIK dari mock data
const simulasiCekNIK = (nik: string) => {
  if (nik === "3507011234560001") {
    return {
      terdaftar: true,
      nama: "Budi Santoso",
      status: "Ditetapkan",
      bantuan: "Bantuan Langsung Tunai (BLT) Dana Desa",
      noSk: "SK-DESA/2026/089",
    };
  }
  return { terdaftar: false };
};

export default function LandingPageDesa() {
  const [nikInput, setNikInput] = useState("");
  const [hasilCek, setHasilCek] = useState<any>(null);
  const [sudahDiperiksa, setSudahDiperiksa] = useState(false);

  const handlePeriksa = (e: React.FormEvent) => {
    e.preventDefault();
    const hasil = simulasiCekNIK(nikInput);
    setHasilCek(hasil);
    setSudahDiperiksa(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. NAVIGASI UTAMA */}
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

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
          <a href="#statistik" className="hover:text-blue-600 transition">
            Statistik Data
          </a>
          <a href="#anggaran" className="hover:text-blue-600 transition">
            Transparansi APBDes
          </a>
          <a href="#cek-nik" className="hover:text-blue-600 transition">
            Layanan Mandiri Warga
          </a>
        </div>

        <div>
          <button className="px-5 py-2 bg-blue-950 text-white text-xs font-bold rounded-full hover:bg-blue-900 transition shadow-sm">
            Masuk Staff Portal
          </button>
        </div>
      </nav>

      {/* 2. HERO & WIDGET CEK STATUS M MANDIRI (LAYOUT GRID ASIMETRIS ASLI) */}
      <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Konten Kiri: Penjelasan & Headline */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold tracking-wide">
            ✨ Akuntabilitas Program Perlindungan Sosial
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
            Satu klik untuk <br />
            <span className="text-blue-600">
              keterbukaan data bantuan.
            </span>{" "}
            Periksa status Anda.
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Selamat datang di Portal Resmi Desa. Kami berkomitmen menyajikan
            data kependudukan makro, realisasi pos anggaran APBDes, serta
            transparansi penetapan bantuan secara berkala.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            <a
              href="#cek-nik"
              className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Periksa NIK Saya Mandiri
            </a>
            <a
              href="#anggaran"
              className="px-6 py-3 bg-white text-slate-800 text-sm font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              Lihat Laporan Keuangan
            </a>
          </div>
        </div>

        {/* Konten Kanan: Widget Interaktif (Floating Card) */}
        <div
          id="cek-nik"
          className="lg:col-span-5 relative w-full max-w-md mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-300 rounded-3xl opacity-20 blur-2xl -z-10 transform scale-105"></div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">
                Cek Status Bantuan Desa
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan 16 digit Nomor Induk Kependudukan (NIK) resmi warga
                terdaftar.
              </p>
            </div>

            <form onSubmit={handlePeriksa} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 3507011234560001"
                  value={nikInput}
                  onChange={(e) => setNikInput(e.target.value)}
                  maxLength={16}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:font-sans placeholder:tracking-normal"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/10"
              >
                Periksa Hak Kepesertaan
              </button>
            </form>

            {/* Panel Hasil Pengecekan */}
            {sudahDiperiksa && (
              <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
                {hasilCek.terdaftar ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-950">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Warga Terdaftar Aktif
                    </span>
                    <h4 className="font-bold text-base mt-0.5">
                      {hasilCek.nama}
                    </h4>
                    <div className="mt-3 text-xs space-y-1.5 text-emerald-800">
                      <p>
                        Status Ketetapan:{" "}
                        <strong className="bg-emerald-200/60 px-1.5 py-0.5 rounded text-emerald-900">
                          {hasilCek.status}
                        </strong>
                      </p>
                      <p>
                        Kategori Program: <strong>{hasilCek.bantuan}</strong>
                      </p>
                      <p className="text-[11px] font-mono text-emerald-700/80 pt-1 border-t border-emerald-200/40 mt-2">
                        No SK: {hasilCek.noSk}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-rose-950 text-center">
                      NIK tidak ditemukan pada daftar penerima bantuan sosial
                      aktif desa saat ini.
                    </p>
                    <div className="mt-3 pt-3 border-t border-rose-200/40 text-center">
                      <button className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition">
                        Ajukan Sanggahan Online
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. SECTION STATISTIK AGREGAT MAKR0 */}
      <section
        id="statistik"
        className="bg-slate-100/60 border-y border-slate-200/60 py-16"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-10 text-center lg:text-left">
            <h3 className="text-xl font-bold text-slate-950">
              Statistik Makro Kependudukan Desa
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data agregat publik yang diperbarui secara berkala oleh tim
              administrasi desa.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Warga Terdata", val: "3.412 Jiwa" },
              { label: "Jumlah Kepala Keluarga", val: "984 Keluarga" },
              { label: "Penerima Manfaat Aktif", val: "245 Warga" },
              { label: "Metode Sinkronisasi", val: "Otomatis RT" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm"
              >
                <span className="text-xs text-slate-500 font-semibold">
                  {item.label}
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION KONTEN TAMBAHAN: TRANSPARANSI ANGGARAN (APBDes 2026) */}
      <section id="anggaran" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold tracking-wide">
              📊 Anggaran Terbuka (SISKEUDES)
            </div>
            <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
              Realisasi & Alokasi Pembiayaan Anggaran Desa
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Seluruh rekapitulasi pengeluaran dan pemasukan dana desa
              dipublikasikan secara transparan setelah melalui validasi
              menyeluruh oleh Sekretaris Desa.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Kategori Pos Pembiayaan</th>
                  <th className="px-6 py-4">Plafon Rencana</th>
                  <th className="px-6 py-4">Realisasi Penyaluran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Perlindungan Sosial (Bansos)
                  </td>
                  <td className="px-6 py-4">Rp 150.000.000</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">
                    Rp 90.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Operasional Aparatur Desa
                  </td>
                  <td className="px-6 py-4">Rp 75.000.000</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">
                    Rp 75.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Pembangunan Infrastruktur Fisik
                  </td>
                  <td className="px-6 py-4">Rp 200.000.000</td>
                  <td className="px-6 py-4 text-slate-400 italic font-normal">
                    Tahap Pengajuan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 text-center">
        <p>
          © 2026 Pemerintah Kabupaten Malang — Portal Resmi Informasi Desa
          Digital.
        </p>
        <p className="text-slate-600 mt-1">
          Sistem dibangun untuk mendukung penargetan perlindungan sosial yang
          tepat sasaran.
        </p>
      </footer>
    </div>
  );
}
