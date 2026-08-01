"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function HeroSection() {
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
    <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold tracking-wide">
          ✨ Akuntabilitas Program Perlindungan Sosial
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
          Satu klik untuk <br />
          <span className="text-blue-600">keterbukaan data bantuan.</span>{" "}
          Periksa status Anda.
        </h2>
        <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Selamat datang di Portal Resmi Desa. Kami berkomitmen menyajikan data
          kependudukan makro, realisasi pos anggaran APBDes, serta transparansi
          penetapan bantuan secara berkala.
        </p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
          <a
            href="#cek-nik"
            className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            Periksa NIK Saya Mandiri
          </a>
          <Link
            href="/evaluasi"
            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition shadow-md"
          >
            Lihat Hasil Evaluasi
          </Link>
        </div>
      </div>

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
  );
}
