"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Simulasi pengecekan NIK dari master data
const simulasiCekNIK = (nik: string) => {
  if (nik === "3507011234560001" || nik.length === 16) {
    return {
      terdaftar: true,
      nama: "Budi Santoso",
      status: "Ditetapkan SK Kades",
      bantuan: "BLT Dana Desa",
      noSk: "SK/2026/089",
    };
  }
  return { terdaftar: false };
};

export default function LandingPageDesa() {
  const router = useRouter();

  // State Widget Login Warga Khusus NIK
  const [nikInput, setNikInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasilCek, setHasilCek] = useState<any>(null);
  const [sudahDiperiksa, setSudahDiperiksa] = useState(false);

  const handlePeriksaNIK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nikInput || nikInput.length < 16) {
      alert("Harap masukkan 16 digit NIK KTP resmi Anda.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const hasil = simulasiCekNIK(nikInput);
      setHasilCek(hasil);
      setSudahDiperiksa(true);
      setLoading(false);

      // Simpan Sesi Warga
      if (typeof window !== "undefined") {
        localStorage.setItem("mock_user_role", "warga");
        localStorage.setItem("mock_user_nik", nikInput);
        localStorage.setItem("mock_user_name", hasil.nama || "Budi Santoso");
      }
    }, 400);
  };

  const handleMasukDashboardWarga = () => {
    router.push("/warga/dashboard?tahun=2026");
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

        {/* Link Navigasi Bersih */}
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
          <Link href="/evaluasi" className="hover:text-blue-600 transition">
            Hasil Evaluasi
          </Link>
        </div>

        <div>
          <Link
            href="/login"
            className="bg-[#0f172a] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
          >
            Login Pegawai
          </Link>
        </div>
      </nav>

      {/* 2. HERO & WIDGET LOGIN WARGA (COMPACT REVISION) */}
      <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Konten Kiri: Penjelasan & Headline */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold tracking-wide border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Akuntabilitas Program Perlindungan Sosial
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-[1.18]">
            Satu klik untuk <br />
            <span className="text-blue-600">
              keterbukaan data bantuan.
            </span>{" "}
            Periksa status Anda.
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Selamat datang di Portal Resmi Desa. Gunakan layanan mandiri di
            samping untuk mengecek status Bansos, mengajukan sanggahan rumah,
            atau perbaikan data.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
            <a
              href="#anggaran"
              className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/15"
            >
              Cek Alokasi Dana APBDes
            </a>
            <Link
              href="/evaluasi"
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              Lihat Hasil Evaluasi
            </Link>
          </div>
        </div>

        {/* Konten Kanan: WIDGET LOGIN WARGA COMPACT */}
        <div
          id="portal-warga"
          className="lg:col-span-5 relative w-full max-w-sm mx-auto"
        >
          {/* Subtle Ambient Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-400/10 rounded-2xl blur-xl -z-10 transform scale-95"></div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/40 p-5 sm:p-6 space-y-4">
            {/* Header Widget Compact */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🪪</span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-950">
                    Layanan Mandiri Warga
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Masukan 16 Digit NIK KTP Anda
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-mono">
                2026
              </span>
            </div>

            {/* Form Input NIK Compact */}
            <form onSubmit={handlePeriksaNIK} className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <label className="font-bold text-slate-600 uppercase tracking-wider">
                    Nomor NIK KTP
                  </label>
                  <span
                    className={`font-mono font-bold ${
                      nikInput.length === 16
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {nikInput.length}/16 Digit
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Contoh: 3507011234560001"
                  value={nikInput}
                  onChange={(e) =>
                    setNikInput(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={16}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-extrabold tracking-wider text-slate-900 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>Memeriksa Data...</span>
                ) : (
                  <>
                    <span>Cek Status & Masuk</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Panel Hasil Pengecekan Compact */}
            {sudahDiperiksa && (
              <div className="pt-2 border-t border-dashed border-slate-200 animate-in fade-in duration-200">
                {hasilCek.terdaftar ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase">
                        ✓ Terdaftar Aktif
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800">
                        {hasilCek.noSk}
                      </span>
                    </div>

                    <p className="font-bold text-xs text-slate-900">
                      {hasilCek.nama}
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      {hasilCek.bantuan} ({hasilCek.status})
                    </p>

                    <button
                      onClick={handleMasukDashboardWarga}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Buka Dashboard Warga →
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-950 space-y-2">
                    <p className="text-[11px] font-bold">
                      NIK tidak ada pada SK penerima bansos aktif.
                    </p>
                    <button
                      onClick={handleMasukDashboardWarga}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Masuk Layanan Sanggahan →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mini Footer Feature Badges */}
            <div className="pt-1 border-t border-slate-100 flex items-center justify-around text-[10px] font-semibold text-slate-500">
              <span>🏠 Sanggah Rumah</span>
              <span>•</span>
              <span>📝 Koreksi NIK</span>
              <span>•</span>
              <span>🔒 Data Aman</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. SECTION INTEGRASI MID-PAGE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3 text-amber-900">
          <span className="text-base shrink-0">💡</span>
          <div className="text-xs leading-relaxed">
            <strong className="font-bold block text-amber-950 mb-0.5">
              Notifikasi Integrasi Data External:
            </strong>
            Sistem ERP Desa terkoneksi secara <em>read-only</em> dengan dua
            modul pendukung di bawah ini untuk menjaga keabsahan data
            kependudukan dan transparansi batas anggaran bantuan sosial.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/siskeudes"
            className="group bg-white border border-slate-200 hover:border-emerald-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Bridge Modul Keuangan
              </span>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition pt-1">
                Akses Integrasi Siskeudes →
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menampilkan struktur APBDes resmi, pagu anggaran teralokasi,
                serta batas maksimal dana per KK.
              </p>
            </div>
          </Link>

          <Link
            href="/dukcapil"
            className="group bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                Bridge Modul Kependudukan
              </span>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition pt-1">
                Akses Master Data Dukcapil →
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pusat referensi data warga resmi untuk validasi format NIK dan
                deteksi warga meninggal/pindah.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SECTION STATISTIK AGREGAT MAKRO */}
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

      {/* 5. SECTION TRANSPARANSI ANGGARAN (APBDes 2026) */}
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

            <div className="pt-2">
              <Link
                href="/siskeudes"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition"
              >
                Buka Detail Laporan Siskeudes →
              </Link>
            </div>
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
                  <td className="px-6 py-4">Rp 360.000.000</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">
                    Rp 270.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Operasional Aparatur Desa (ADD)
                  </td>
                  <td className="px-6 py-4">Rp 280.000.000</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">
                    Rp 210.000.000
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-950">
                    Pembangunan Infrastruktur Fisik
                  </td>
                  <td className="px-6 py-4">Rp 450.000.000</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold">
                    Rp 320.000.000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
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
