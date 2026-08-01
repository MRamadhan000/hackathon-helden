"use client";

import { useState } from "react";
import Link from "next/link";

// Mock Data Warga Tingkat RT
const mockWargaRT = [
  {
    id: "1",
    nama: "Budi Santoso",
    nik: "3507011234560001",
    statusDasar: "Hidup",
    bansos: "BLT Dana Desa",
    statusBansos: "Ditetapkan",
  },
  {
    id: "2",
    nama: "Siti Aminah",
    nik: "3507019876540002",
    statusDasar: "Hidup",
    bansos: "PKH",
    statusBansos: "Rekomendasi",
  },
  {
    id: "3",
    nama: "Joko Widodo (Alm)",
    nik: "3507015554440003",
    statusDasar: "Mati",
    bansos: "-",
    statusBansos: "-",
  },
];

// Mock Data Sanggahan Masuk
const mockSanggahan = [
  {
    id: "s1",
    nama: "Ahmad Subari",
    nik: "3507010202020003",
    alasan: "Gaji di bawah 1 juta tapi tidak menerima BLT.",
    status: "Pending",
  },
];

export default function DashboardRT() {
  const [activeTab, setActiveTab] = useState<"warga" | "lapor" | "sanggahan">(
    "warga",
  );
  const [formWarga, setFormWarga] = useState({
    nama: "",
    nik: "",
    aksi: "Belum Terdata",
    detail: "",
  });
  const [notif, setNotif] = useState("");

  const handleLaporSekdes = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif(
      `Sukses: Laporan mengenai ${formWarga.nama} telah diteruskan ke Sekretaris Desa.`,
    );
    setFormWarga({ nama: "", nik: "", aksi: "Belum Terdata", detail: "" });
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      {/* HEADER DASHBOARD */}
      <header className="bg-white border-b border-slate-200/60 sticky top-0 z-40 px-6 lg:px-12 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {/* Tombol Kembali ke Landing Page */}
          <Link href="/">
            <button
              className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition flex items-center justify-center group"
              title="Kembali ke Landing Page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 text-white flex items-center justify-center font-bold text-sm rounded-xl">
              RT
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                Panel Utama Ketua RT 03
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Verifikasi & Pelaporan Mandiri Tingkat Rukun Tetangga
              </p>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BUTTONS */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
          <button
            onClick={() => setActiveTab("warga")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "warga" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            👥 Data Warga & Bansos
          </button>
          <button
            onClick={() => setActiveTab("sanggahan")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all relative ${activeTab === "sanggahan" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            ⚠️ Sanggahan Warga
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              1
            </span>
          </button>
          <button
            onClick={() => setActiveTab("lapor")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "lapor" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            🚀 Lapor ke Sekdes
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {notif && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-sm font-semibold animate-fadeIn">
            {notif}
          </div>
        )}

        {/* TAB 1: DATA PENDUDUK & STATUS BANSOS */}
        {activeTab === "warga" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/30">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Daftar Kependudukan Warga RT
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pantau data dasar keberadaan dan kepesertaan aktif jaminan
                  sosial penduduk.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab("lapor");
                  setFormWarga((prev) => ({
                    ...prev,
                    aksi: "Penerimaan Bansos SK Baru",
                    detail:
                      "Pengumpulan data warga usulan bansos menjelang penerbitan SK baru.",
                  }));
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
              >
                + Ajukan Usulan SK Bansos Baru
              </button>
            </div>

            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Keberadaan</th>
                  <th className="px-6 py-4">Program Bansos</th>
                  <th className="px-6 py-4">Status Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {mockWargaRT.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-950">
                      {w.nama}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs tracking-wider">
                      {w.nik}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${w.statusDasar === "Mati" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-800"}`}
                      >
                        {w.statusDasar}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{w.bansos}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${w.statusBansos === "Ditetapkan" ? "bg-emerald-100 text-emerald-800" : w.statusBansos === "Rekomendasi" ? "bg-amber-100 text-amber-800" : "text-slate-400 font-normal"}`}
                      >
                        {w.statusBansos}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: MANAJEMEN SANGGAHAN */}
        {activeTab === "sanggahan" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
              <h3 className="text-lg font-bold text-slate-900">
                Sanggahan Masuk dari Warga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lakukan verifikasi lapangan ulang secara fisik sebelum
                meneruskan ke Sekretaris Desa.
              </p>
            </div>

            {mockSanggahan.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-950 text-base">
                      {s.nama}
                    </h4>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      NIK: {s.nik}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded">
                    Status: {s.status}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                  <strong>Isi Sanggahan:</strong> "{s.alasan}"
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setActiveTab("lapor");
                      setFormWarga({
                        nama: s.nama,
                        nik: s.nik,
                        aksi: "Ketidakcocokan Data (Sanggahan)",
                        detail: `Hasil verifikasi ulang lapangan: Sanggahan VALID. Warga atas nama ${s.nama} layak mendapatkan alokasi jaminan perlindungan sosial.`,
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                  >
                    Verifikasi & Laporkan Ketidakcocokan Ke Sekdes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FORM PELAPORAN LANGSUNG KE SEKDES */}
        {activeTab === "lapor" && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-xl mx-auto shadow-xl shadow-slate-200/40">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">
                Formulir Pelaporan Cepat Sekdes
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan untuk mengirimkan mutasi kependudukan (kematian,
                pindah), pendaftaran warga baru, atau validasi sanggatan.
              </p>
            </div>

            <form onSubmit={handleLaporSekdes} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Jenis Berkas Laporan
                </label>
                <select
                  value={formWarga.aksi}
                  onChange={(e) =>
                    setFormWarga((prev) => ({ ...prev, aksi: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="Belum Terdata">
                    Warga Baru (Belum Terdata)
                  </option>
                  <option value="Perubahan Status - Meninggal">
                    Mutasi Kematian (Mati)
                  </option>
                  <option value="Perubahan Status - Pindah">
                    Mutasi Wilayah (Pindah)
                  </option>
                  <option value="Ketidakcocokan Data (Sanggahan)">
                    Verifikasi Ulang Sanggahan Warga
                  </option>
                  <option value="Penerimaan Bansos SK Baru">
                    Pengumpulan Data Penerima Bansos (SK Baru)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Nama Warga Terkait
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={formWarga.nama}
                    onChange={(e) =>
                      setFormWarga((prev) => ({
                        ...prev,
                        nama: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    NIK Warga
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="16 Digit NIK"
                    value={formWarga.nik}
                    onChange={(e) =>
                      setFormWarga((prev) => ({ ...prev, nik: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Catatan Tambahan & Detail Bukti Lapangan
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tulis kronologi atau alasan pendukung pelaporan secara jelas di sini..."
                  value={formWarga.detail}
                  onChange={(e) =>
                    setFormWarga((prev) => ({
                      ...prev,
                      detail: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/10"
              >
                Kirim Laporan Resmi ke Sekdes
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
