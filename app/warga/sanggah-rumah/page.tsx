"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HalamanSanggahRumahWarga() {
  const router = useRouter();

  // State Formulir Sanggahan
  const [kondisiDinding, setKondisiDinding] = useState("Bambu / Kayu Lapuk");
  const [kondisiAtap, setKondisiAtap] = useState("Seng Bocor / Ilalang");
  const [kondisiLantai, setKondisiLantai] = useState("Tanah / Semen Rusak");
  const [kepemilikanJamban, setKepemilikanJamban] = useState("Belum Memiliki");
  const [catatanPesan, setCatatanPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pesanSukses, setPesanSukses] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi Pengiriman Laporan ke Ketua RT
    setTimeout(() => {
      setIsSubmitting(false);
      setPesanSukses(true);
      setTimeout(() => {
        router.push("/warga/dashboard");
      }, 2500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased p-4 sm:p-6 lg:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* NAVIGASI KEMBALI */}
        <div className="flex items-center justify-between">
          <Link
            href="/warga/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition"
          >
            ← Kembali ke Menu Warga
          </Link>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Layanan Bansos RT
          </span>
        </div>

        {/* NOTIFIKASI BERHASIL */}
        {pesanSukses && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-bold shadow-xs animate-in fade-in duration-300">
            ✓ Terima kasih! Laporan sanggahan kondisi rumah Anda telah terkirim
            ke Ketua RT. Anda akan dialihkan...
          </div>
        )}

        {/* CARD FORMULIR */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-[11px] font-bold mb-2">
              🏠 Sanggahan Kelayakan Bansos
            </div>
            <h1 className="text-lg font-extrabold text-slate-950">
              Laporkan Kondisi Rumah Kepada Ketua RT
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Silakan perbarui data fisik bangunan rumah Anda agar Ketua RT
              dapat meninjau ulang kelayakan penerimaan Bantuan Sosial (Bansos).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. KONDISI DINDING */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Kondisi Dinding Rumah Utama *
              </label>
              <select
                value={kondisiDinding}
                onChange={(e) => setKondisiDinding(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Bambu / Kayu Lapuk">
                  Bambu / Kayu Lapuk (Prioritas Bansos)
                </option>
                <option value="Tembok Sederhana Tanpa Plester">
                  Tembok Sederhana Tanpa Plester
                </option>
                <option value="Tembok Permanen Baik">
                  Tembok Permanen Baik
                </option>
              </select>
            </div>

            {/* 2. KONDISI ATAP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Kondisi Atap Bangunan *
              </label>
              <select
                value={kondisiAtap}
                onChange={(e) => setKondisiAtap(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Seng Bocor / Ilalang">
                  Seng Bocor / Ilalang / Rumbia
                </option>
                <option value="Genteng Tanah Banyak Bocor">
                  Genteng Tanah (Banyak Bocor)
                </option>
                <option value="Genteng / Beton Baik">
                  Genteng / Beton Kokoh
                </option>
              </select>
            </div>

            {/* 3. KONDISI LANTAI */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Kondisi Lantai Rumah *
              </label>
              <select
                value={kondisiLantai}
                onChange={(e) => setKondisiLantai(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Tanah / Semen Rusak">
                  Lantai Tanah / Semen Rusak
                </option>
                <option value="Semen Halus Sederhana">
                  Semen Halus Sederhana
                </option>
                <option value="Keramik / Granit">
                  Lantai Keramik / Granit
                </option>
              </select>
            </div>

            {/* 4. SANITASI / JAMBAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Kepemilikan Jamban / WC Pribadi *
              </label>
              <select
                value={kepemilikanJamban}
                onChange={(e) => setKepemilikanJamban(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Belum Memiliki">
                  Belum Memiliki (Menumpang / Umum)
                </option>
                <option value="Ada (Jamban Sederhana)">
                  Ada (Jamban Sederhana / Cubluk)
                </option>
                <option value="Ada (WC Leher Angsa)">
                  Ada (WC Leher Angsa / Septic Tank)
                </option>
              </select>
            </div>

            {/* 5. NOTE / CATATAN PESAN UNTUK KETUA RT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                5. Pesan / Catatan Khusus untuk Ketua RT *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan alasan atau keterangan tambahan (contoh: Pak RT, atap dapur kami bocor parah dan dinding kayu sudah lapuk dimakan rayap, mohon dibantu tinjau ulang...)"
                value={catatanPesan}
                onChange={(e) => setCatatanPesan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || pesanSukses}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-amber-600/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? "Mengirimkan Laporan..."
                : "✉️ Kirimkan Pesan Sanggahan ke Ketua RT →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
