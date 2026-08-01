"use client";

import React, { useState } from "react";
import { PendudukRT } from "./TableWarga";
import SearchableNikSelect from "./SearchableNikSelect";

// Mock Data Riwayat Hasil Survei Kelayakan Tahun Berlalu
const mockRiwayatSurveiPerTahun: Record<string, any[]> = {
  "2025": [
    {
      id: "s-1",
      tanggal: "15/05/2025",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      skor: 70,
      kategori: "Sangat Layak (Prioritas SK)",
      indikator: "Lantai Tanah, Dinding Bambu, Ada Lansia",
    },
  ],
  "2024": [
    {
      id: "s-2",
      tanggal: "04/10/2024",
      nik: "3507015554440003",
      nama: "Joko Widodo",
      skor: 85,
      kategori: "Sangat Layak (Prioritas SK)",
      indikator: "Sungai, Buruh Harian, Tidak Ada Jamban",
    },
  ],
};

interface FormSurveiKelayakanProps {
  tahunPeriode: string;
  daftarWarga: PendudukRT[];
  selectedNik: string;
  setSelectedNik: (nik: string) => void;
  onSubmitSurvei: (e: React.FormEvent, dataHasil: any) => void;
}

export default function FormSurveiKelayakan({
  tahunPeriode,
  daftarWarga,
  selectedNik,
  setSelectedNik,
  onSubmitSurvei,
}: FormSurveiKelayakanProps) {
  const isTahunBerlalu = tahunPeriode !== "2026";
  const riwayatSurvei = mockRiwayatSurveiPerTahun[tahunPeriode] || [];

  const wargaTerpilih = daftarWarga.find((w) => w.nik === selectedNik);

  const [indikator, setIndikator] = useState({
    jenisLantai: "Semen / Keramik",
    jenisDinding: "Tembok / Kayu Bagus",
    sumberAir: "Perumda / Sumur Terlindung",
    sanitasi: "Jamban Pribadi",
    pekerjaan: "Tetap / Wiraswasta",
    tanggunganRentan: false,
  });

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

  // TAMPILAN JIKA TAHUN BERLALU (MODE HISTORIS REKAP SURVEI)
  if (isTahunBerlalu) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-1">
              🔒 Mode Arsip Data ({tahunPeriode})
            </div>
            <h3 className="text-base font-bold text-slate-950">
              Hasil Survei Kelayakan Bansos Prodeskel Tahun {tahunPeriode}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi nilai indikator Prodeskel DDK yang telah dikirim ke
              Sekdes pada tahun ini.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
            Total Survei: {riwayatSurvei.length} Keluarga
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Tgl Survei</th>
                <th className="px-5 py-3">Nama Warga (NIK)</th>
                <th className="px-5 py-3">Ringkasan Indikator Prodeskel</th>
                <th className="px-5 py-3">Total Skor</th>
                <th className="px-5 py-3 text-right">Rekomendasi Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {riwayatSurvei.length > 0 ? (
                riwayatSurvei.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                      {item.tanggal}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900 text-xs">
                        {item.nama}
                      </p>
                      <p className="font-mono text-[11px] text-slate-400">
                        NIK: {item.nik}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      {item.indikator}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold text-xs rounded-lg">
                        {item.skor} / 100
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                        {item.kategori}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400 text-xs"
                  >
                    Tidak ada riwayat survei kelayakan bansos pada tahun{" "}
                    {tahunPeriode}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // TAMPILAN JIKA TAHUN AKTIF (2026) - FORM SURVEI
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-2xl mx-auto shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold mb-2">
          📋 Indikator Profil Desa (Prodeskel DDK {tahunPeriode})
        </div>
        <h3 className="text-base font-bold text-slate-950">
          Survei Kelayakan Bansos (Tingkat RT)
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Kuesioner berbasis indikator Data Dasar Keluarga (DDK) Prodeskel
          Kemendagri untuk rekomendasi usulan SK Bansos Baru.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Cari / Pilih NIK Warga Terdaftar *
            </label>
            <SearchableNikSelect
              daftarWarga={daftarWarga}
              selectedNik={selectedNik}
              onSelectNik={setSelectedNik}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Nama Kepala / Anggota Keluarga
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={wargaTerpilih ? wargaTerpilih.nama : ""}
              placeholder="Pilih NIK di atas..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Kondisi Fisik Rumah & Sanitasi
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Bahan Lantai Utama
              </label>
              <select
                value={indikator.jenisLantai}
                onChange={(e) =>
                  setIndikator({ ...indikator, jenisLantai: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Semen / Keramik">Semen / Keramik / Ubin</option>
                <option value="Tanah / Plester Rusak">
                  Tanah / Plester Rusak
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Bahan Dinding Utama
              </label>
              <select
                value={indikator.jenisDinding}
                onChange={(e) =>
                  setIndikator({ ...indikator, jenisDinding: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Tembok / Kayu Bagus">Tembok / Kayu Bagus</option>
                <option value="Bambu / Kayu Lapuk">
                  Bambu / Anyaman / Lapuk
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Sumber Air Minum Utama
              </label>
              <select
                value={indikator.sumberAir}
                onChange={(e) =>
                  setIndikator({ ...indikator, sumberAir: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Perumda / Sumur Terlindung">
                  Perumda / Sumur Terlindung
                </option>
                <option value="Sungai / Sumur Tak Terlindung">
                  Sungai / Sumur Tak Terlindung
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Fasilitas BAB / Sanitasi
              </label>
              <select
                value={indikator.sanitasi}
                onChange={(e) =>
                  setIndikator({ ...indikator, sanitasi: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              >
                <option value="Jamban Pribadi">Jamban Pribadi (Sehat)</option>
                <option value="Numpang / Tidak Ada Jamban">
                  Numpang / Umum / Tidak Ada
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Kondisi Mata Pencaharian & Rentan
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mata Pencaharian Utama
              </label>
              <select
                value={indikator.pekerjaan}
                onChange={(e) =>
                  setIndikator({ ...indikator, pekerjaan: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:border-blue-500"
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
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
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
