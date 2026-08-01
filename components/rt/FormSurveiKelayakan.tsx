"use client";

import React, { useState } from "react";
import { PendudukRT } from "./TableWarga";
import SearchableNikSelect from "./SearchableNikSelect";

interface FormSurveiKelayakanProps {
  daftarWarga: PendudukRT[];
  selectedNik: string;
  setSelectedNik: (nik: string) => void;
  onSubmitSurvei: (e: React.FormEvent, dataHasil: any) => void;
}

export default function FormSurveiKelayakan({
  daftarWarga,
  selectedNik,
  setSelectedNik,
  onSubmitSurvei,
}: FormSurveiKelayakanProps) {
  const wargaTerpilih = daftarWarga.find((w) => w.nik === selectedNik);

  // State Indikator Prodeskel DDK
  const [indikator, setIndikator] = useState({
    jenisLantai: "Semen / Keramik", // Semen/Keramik (0 pt) vs Tanah (25 pt)
    jenisDinding: "Tembok / Kayu Bagus", // Tembok (0 pt) vs Bambu/Papan Rendah (25 pt)
    sumberAir: "Perumda / Sumur Terlindung", // Baik (0 pt) vs Sungai/Tak Terlindung (20 pt)
    sanitasi: "Jamban Pribadi", // Pribadi (0 pt) vs Mandi Umum/Tidak Ada (15 pt)
    pekerjaan: "Tetap / Wiraswasta", // Tetap (0 pt) vs Buruh Harian / Non-Tetap (15 pt)
    tanggunganRentan: false, // Ada Lansia / Disabilitas (+10 pt)
  });

  // Hitung Skor Kelayakan Prodeskel Otomatis (0 - 100)
  const hitungSkor = () => {
    let skor = 0;
    if (indikator.jenisLantai === "Tanah / Plester Rusak") skor += 25;
    if (indikator.jenisDinding === "Bambu / Kayu Lapuk") skor += 25;
    if (indikator.sumberAir === "Sungai / Sumur Tak Terlindung") skor += 20;
    if (indikator.sanitasi === "Numpang / Tidak Ada Jamban") skor += 15;
    if (indikator.pekerjaan === "Buruh Harian / Tidak Bekerja") skor += 15;
    if (indikator.tanggunganRentan) skor += 10;
    return skor;
  };

  const totalSkor = hitungSkor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSurvei(e, {
      nik: selectedNik,
      nama: wargaTerpilih?.nama,
      skor: totalSkor,
      kategori: totalSkor >= 50 ? "Sangat Layak (Prioritas SK)" : "Cukup Layak",
      detail: indikator,
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-2xl mx-auto shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
          📋 Indikator Profil Desa (Prodeskel DDK)
        </div>
        <h3 className="text-base font-bold text-slate-950">
          Survei Kelayakan Kelayakan Bansos (Tingkat RT)
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Kuesioner berbasis indikator Data Dasar Keluarga (DDK) Prodeskel
          Kemendagri untuk rekomendasi usulan SK Bansos Baru.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. SELEKSI WARGA */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Cari / Pilih NIK Warga Terdaftar *
            </label>
            <SearchableNikSelect
              daftarWarga={daftarWarga}
              selectedNik={selectedNik}
              onSelectNik={setSelectedNik}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Nama Kepala / Anggota Keluarga
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={wargaTerpilih ? wargaTerpilih.nama : ""}
              placeholder="Pilih NIK di atas..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* 2. INDIKATOR BANGUNAN & HUNIAN (PRODESKEL) */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Kondisi Fisik Rumah & Sanitasi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Lantai */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bahan Lantai Utama
              </label>
              <select
                value={indikator.jenisLantai}
                onChange={(e) =>
                  setIndikator({ ...indikator, jenisLantai: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="Semen / Keramik">Semen / Keramik / Ubin</option>
                <option value="Tanah / Plester Rusak">
                  Tanah / Plester Rusak
                </option>
              </select>
            </div>

            {/* Dinding */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bahan Dinding Utama
              </label>
              <select
                value={indikator.jenisDinding}
                onChange={(e) =>
                  setIndikator({ ...indikator, jenisDinding: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="Tembok / Kayu Bagus">Tembok / Kayu Bagus</option>
                <option value="Bambu / Kayu Lapuk">
                  Bambu / Anyaman / Lapuk
                </option>
              </select>
            </div>

            {/* Sumber Air */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sumber Air Minum Utama
              </label>
              <select
                value={indikator.sumberAir}
                onChange={(e) =>
                  setIndikator({ ...indikator, sumberAir: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="Perumda / Sumur Terlindung">
                  Perumda / Sumur Terlindung
                </option>
                <option value="Sungai / Sumur Tak Terlindung">
                  Sungai / Sumur Tak Terlindung
                </option>
              </select>
            </div>

            {/* Sanitasi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fasilitas BAB / Sanitasi
              </label>
              <select
                value={indikator.sanitasi}
                onChange={(e) =>
                  setIndikator({ ...indikator, sanitasi: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="Jamban Pribadi">Jamban Pribadi (Sehat)</option>
                <option value="Numpang / Tidak Ada Jamban">
                  Numpang / Umum / Tidak Ada
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. INDIKATOR EKONOMI & SOSIAL */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Kondisi Mata Pencaharian & Rentan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mata Pencaharian Utama
              </label>
              <select
                value={indikator.pekerjaan}
                onChange={(e) =>
                  setIndikator({ ...indikator, pekerjaan: e.target.value })
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
              >
                <option value="Tetap / Wiraswasta">
                  Pekerja Tetap / Usaha
                </option>
                <option value="Buruh Harian / Tidak Bekerja">
                  Buruh Harian Lepas / Serabutan
                </option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={indikator.tanggunganRentan}
                  onChange={(e) =>
                    setIndikator({
                      ...indikator,
                      tanggunganRentan: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                Ada Anggota Lansia / Disabilitas
              </label>
            </div>
          </div>
        </div>

        {/* SKOR INDIKATOR OTOMATIS */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Kalkulasi Skor Kelayakan Prodeskel
            </p>
            <p className="text-sm font-black text-emerald-950 mt-0.5">
              {totalSkor} / 100 Poin
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
              totalSkor >= 50
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {totalSkor >= 50 ? "Sangat Layak Diusulkan" : "Rendah Prioritas"}
          </span>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!selectedNik}
          className={`w-full py-3.5 text-white text-sm font-bold rounded-xl transition shadow-md ${
            selectedNik
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          Kirim Rekomendasi Hasil Survei ke Sekdes →
        </button>
      </form>
    </div>
  );
}
