"use client";

import React, { useState } from "react";
import { PendudukRT } from "./TableWarga";
import SearchableNikSelect from "./SearchableNikSelect";

const DAFTAR_KOTA_LAHIR = [
  "Kab. Malang",
  "Kota Malang",
  "Kota Batu",
  "Kota Surabaya",
  "Kab. Blitar",
  "Kota Blitar",
  "Kab. Pasuruan",
  "Kota Pasuruan",
  "Kab. Sidoarjo",
  "Kab. Kediri",
  "Kota Kediri",
  "DKI Jakarta",
];

// Mock Data Riwayat Mutasi Tahun Berlalu
const mockRiwayatMutasiPerTahun: Record<string, any[]> = {
  "2025": [
    {
      id: "m-1",
      tanggal: "12/04/2025",
      jenis: "1. Warga Baru",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      keterangan: "Pendaftaran Pindah Masuk RT",
    },
    {
      id: "m-2",
      tanggal: "20/08/2025",
      jenis: "2. Non-Aktif",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      keterangan: "Non-Aktif (Pindah Wilayah)",
    },
  ],
  "2024": [
    {
      id: "m-3",
      tanggal: "10/11/2024",
      jenis: "3. Koreksi Data",
      nik: "3507015554440003",
      nama: "Joko Widodo",
      keterangan: "Koreksi Ejaan Tempat Lahir",
    },
  ],
};

interface FormMutasiLengkapProps {
  tahunPeriode: string;
  daftarWarga: PendudukRT[];
  selectedNik: string;
  setSelectedNik: (nik: string) => void;
  onSubmitMutasi: (e: React.FormEvent, data: any) => void;
}

export default function FormMutasiLengkap({
  tahunPeriode,
  daftarWarga,
  selectedNik,
  setSelectedNik,
  onSubmitMutasi,
}: FormMutasiLengkapProps) {
  const isTahunBerlalu = tahunPeriode !== "2026";
  const riwayatMutasi = mockRiwayatMutasiPerTahun[tahunPeriode] || [];

  const [subAksi, setSubAksi] = useState<"baru" | "nonaktif" | "koreksi">(
    "baru",
  );
  const [formDetail, setFormDetail] = useState({
    nik: "",
    nama: "",
    jenisKelamin: "L" as "L" | "P",
    tempatLahir: "Kab. Malang",
    tanggalLahir: "",
    alasanNonAktif: "Meninggal Dunia",
  });

  const handleSelectWargaEksisting = (nik: string) => {
    setSelectedNik(nik);
    const w = daftarWarga.find((item) => item.nik === nik);
    if (w) {
      setFormDetail((prev) => ({
        ...prev,
        nik: w.nik,
        nama: w.nama,
        jenisKelamin: w.jenisKelamin,
        tempatLahir: w.tempatLahir || "Kab. Malang",
        tanggalLahir: w.tanggalLahir,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitMutasi(e, {
      kategoriAksi: subAksi,
      dataForm: formDetail,
    });
  };

  // TAMPILAN JIKA TAHUN BERLALU (MODE HISTORIS DAFTAR LIST)
  if (isTahunBerlalu) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-1">
              🔒 Mode Arsip Data ({tahunPeriode})
            </div>
            <h3 className="text-base font-bold text-slate-950">
              Riwayat Pelaporan Mutasi & Kependudukan Tahun {tahunPeriode}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar transaksi penginputan mutasi warga yang dilaporkan pada
              tahun ini.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
            Total Laporan: {riwayatMutasi.length} Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Tgl Lapor</th>
                <th className="px-5 py-3">Kategori Mutasi</th>
                <th className="px-5 py-3">Warga Terkait</th>
                <th className="px-5 py-3">Keterangan Transaksi</th>
                <th className="px-5 py-3 text-right">Status Sekdes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {riwayatMutasi.length > 0 ? (
                riwayatMutasi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
                      {item.tanggal}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-100">
                        {item.jenis}
                      </span>
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
                      {item.keterangan}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        ✓ Disetujui Sekdes
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
                    Tidak ada riwayat penginputan mutasi pada tahun{" "}
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

  // TAMPILAN JIKA TAHUN AKTIF (2026) - FORM INPUT
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-2xl mx-auto shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
          📋 Master Pendataan & Pembaruan Data RT (2026)
        </div>
        <h3 className="text-base font-bold text-slate-950">
          Formulir Mutasi & Pemutakhiran Data Kependudukan
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Pilih kategori tindakan di bawah ini untuk mendaftarkan warga baru,
          menonaktifkan status warga, atau mengoreksi ketidakcocokan data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setSubAksi("baru");
            setSelectedNik("");
            setFormDetail({
              nik: "",
              nama: "",
              jenisKelamin: "L",
              tempatLahir: "Kab. Malang",
              tanggalLahir: "",
              alasanNonAktif: "Meninggal Dunia",
            });
          }}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1 ${
            subAksi === "baru"
              ? "bg-blue-900 text-white border-blue-900 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-extrabold block">1. Warga Baru</span>
          <span
            className={`text-[10px] ${subAksi === "baru" ? "text-blue-200" : "text-slate-400"}`}
          >
            Pendaftaran Baru
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubAksi("nonaktif")}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1 ${
            subAksi === "nonaktif"
              ? "bg-blue-900 text-white border-blue-900 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-extrabold block">2. Non-Aktifkan</span>
          <span
            className={`text-[10px] ${subAksi === "nonaktif" ? "text-blue-200" : "text-slate-400"}`}
          >
            Meninggal / Pindah
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubAksi("koreksi")}
          className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1 ${
            subAksi === "koreksi"
              ? "bg-blue-900 text-white border-blue-900 shadow-sm"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-xs font-extrabold block">3. Koreksi Data</span>
          <span
            className={`text-[10px] ${subAksi === "koreksi" ? "text-blue-200" : "text-slate-400"}`}
          >
            Perbaikan Data
          </span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 pt-2 border-t border-slate-100"
      >
        {subAksi !== "baru" && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Pilih NIK Warga Yang Akan Di-
              {subAksi === "nonaktif" ? "non-aktifkan" : "koreksi"} *
            </label>
            <SearchableNikSelect
              daftarWarga={daftarWarga}
              selectedNik={selectedNik}
              onSelectNik={handleSelectWargaEksisting}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                NIK Warga (16 Digit) *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                disabled={subAksi === "nonaktif"}
                placeholder="3507xxxxxxxxxxxx"
                value={formDetail.nik}
                onChange={(e) =>
                  setFormDetail({ ...formDetail, nik: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Nama Lengkap Warga *
              </label>
              <input
                type="text"
                required
                disabled={subAksi === "nonaktif"}
                placeholder="Nama Lengkap"
                value={formDetail.nama}
                onChange={(e) =>
                  setFormDetail({ ...formDetail, nama: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Jenis Kelamin *
              </label>
              <select
                disabled={subAksi === "nonaktif"}
                value={formDetail.jenisKelamin}
                onChange={(e) =>
                  setFormDetail({
                    ...formDetail,
                    jenisKelamin: e.target.value as "L" | "P",
                  })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100"
              >
                <option value="L">Laki-Laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tempat Lahir *
              </label>
              <select
                disabled={subAksi === "nonaktif"}
                value={formDetail.tempatLahir}
                onChange={(e) =>
                  setFormDetail({ ...formDetail, tempatLahir: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100 cursor-pointer"
              >
                {DAFTAR_KOTA_LAHIR.map((kota, idx) => (
                  <option key={idx} value={kota}>
                    {kota}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                required
                disabled={subAksi === "nonaktif"}
                value={formDetail.tanggalLahir}
                onChange={(e) =>
                  setFormDetail({ ...formDetail, tanggalLahir: e.target.value })
                }
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
              />
            </div>
          </div>

          {subAksi === "nonaktif" && (
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-800">
                Alasan Perubahan Status Menjadi Non-Aktif *
              </label>
              <select
                value={formDetail.alasanNonAktif}
                onChange={(e) =>
                  setFormDetail({
                    ...formDetail,
                    alasanNonAktif: e.target.value,
                  })
                }
                className="w-full px-3 py-2.5 border border-rose-200 rounded-xl text-xs font-bold text-rose-950 bg-white"
              >
                <option value="Meninggal Dunia">
                  Meninggal Dunia (Mutasi Kematian)
                </option>
                <option value="Pindah Wilayah">
                  Pindah Wilayah Domisili / Luar Desa
                </option>
                <option value="Data Ganda / Anomali">
                  Data Ganda / Anomali Sistem
                </option>
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-600/10 cursor-pointer"
        >
          {subAksi === "baru" &&
            "Kirim Laporan Pendaftaran Warga Baru ke Sekdes →"}
          {subAksi === "nonaktif" &&
            "Kirim Laporan Non-Aktifkan Warga ke Sekdes →"}
          {subAksi === "koreksi" &&
            "Kirim Usulan Koreksi Data Warga ke Sekdes →"}
        </button>
      </form>
    </div>
  );
}
