"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HalamanPerbaikiDataWarga() {
  const router = useRouter();

  const [jenisKetidakcocokan, setJenisKetidakcocokan] = useState(
    "Ejaan Nama / NIK Typo",
  );
  const [dataLama, setDataLama] = useState("");
  const [dataUsulanBaru, setDataUsulanBaru] = useState("");
  const [catatanPesan, setCatatanPesan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pesanSukses, setPesanSukses] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
            Layanan Kependudukan RT
          </span>
        </div>

        {/* NOTIFIKASI BERHASIL */}
        {pesanSukses && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-bold shadow-xs animate-in fade-in duration-300">
            ✓ Terima kasih! Permohonan perbaikan data diri Anda telah terkirim
            ke Ketua RT. Anda akan dialihkan...
          </div>
        )}

        {/* CARD FORMULIR */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200/80 rounded-full text-[11px] font-bold mb-2">
              📝 Koreksi Data Mandiri
            </div>
            <h1 className="text-lg font-extrabold text-slate-950">
              Pengajuan Perbaikan Data Diri & Keluarga
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ajukan perbaikan apabila terdapat penulisan ejaan nama, NIK,
              tempat/tanggal lahir, atau nomor rumah yang belum sesuai.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. KATEGORI PERBAIKAN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Kategori Data yang Perlu Diperbaiki *
              </label>
              <select
                value={jenisKetidakcocokan}
                onChange={(e) => setJenisKetidakcocokan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                <option value="Ejaan Nama / NIK Typo">
                  Penulisan Ejaan Nama / NIK (Typo)
                </option>
                <option value="Tempat / Tanggal Lahir">
                  Tempat atau Tanggal Lahir
                </option>
                <option value="Status Domisili / Alamat">
                  Alamat / Nomor Rumah / RT / RW
                </option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* 2. DATA SAAT INI (DATA LAMA) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Data Saat Ini (Data yang Keliru di Sistem) *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Siti Aminah (tanpa gelar) / NIK: 3507019876540001"
                value={dataLama}
                onChange={(e) => setDataLama(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* 3. DATA USULAN PERBAIKAN (DATA BARU) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Usulan Data yang Benar *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Siti Aminah, S.Pd / NIK yang benar: 3507019876540002"
                value={dataUsulanBaru}
                onChange={(e) => setDataUsulanBaru(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* 4. NOTE PESAN UNTUK KETUA RT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Pesan / Catatan Khusus untuk Ketua RT *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan alasan atau keterangan tambahan (contoh: Pak RT, nama di KTP dan ijazah saya terdaftar Siti Aminah, S.Pd, mohon dibantu perbarui di data desa agar pas saat pengurusan berkas...)"
                value={catatanPesan}
                onChange={(e) => setCatatanPesan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition leading-relaxed"
              />
            </div>

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || pesanSukses}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? "Mengirimkan Permohonan..."
                : "✉️ Kirimkan Pesan Perbaikan Data ke Ketua RT →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
