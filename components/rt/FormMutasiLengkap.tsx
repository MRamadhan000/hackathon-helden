"use client";

import React, { useState } from "react";
import { PendudukRT } from "./TableWarga";
import SearchableNikSelect from "./SearchableNikSelect";

// Daftar Pilihan Tempat Lahir (Kabupaten / Kota)
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

interface FormMutasiLengkapProps {
  daftarWarga: PendudukRT[];
  selectedNik: string;
  setSelectedNik: (nik: string) => void;
  onSubmitMutasi: (e: React.FormEvent, data: any) => void;
}

export default function FormMutasiLengkap({
  daftarWarga,
  selectedNik,
  setSelectedNik,
  onSubmitMutasi,
}: FormMutasiLengkapProps) {
  // Mode Pelaporan: 1. Baru | 2. Non-Aktif | 3. Koreksi
  const [subAksi, setSubAksi] = useState<"baru" | "nonaktif" | "koreksi">(
    "baru",
  );

  // Form State Warga Baru / Edit Data
  const [formDetail, setFormDetail] = useState({
    nik: "",
    nama: "",
    jenisKelamin: "L" as "L" | "P",
    tempatLahir: "Kab. Malang",
    tanggalLahir: "",
    alasanNonAktif: "Meninggal Dunia",
  });

  // Handler Auto-Fill saat NIK Dipilih untuk Non-Aktif / Koreksi
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

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-2xl mx-auto shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
          📋 Master Pendataan & Pembaruan Data RT
        </div>
        <h3 className="text-base font-bold text-slate-950">
          Formulir Mutasi & Pemutakhiran Data Kependudukan
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Pilih kategori tindakan di bawah ini untuk mendaftarkan warga baru,
          menonaktifkan status warga, atau mengoreksi ketidakcocokan data.
        </p>
      </div>

      {/* 3 OPSI UTAMA PERUBAHAN DATA */}
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
        {/* DROPDOWN NIK UNTUK NON-AKTIF / KOREKSI */}
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

        {/* INPUTAN UTAMA DATA PENDUDUK */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NIK */}
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

            {/* Nama Lengkap */}
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
            {/* Jenis Kelamin */}
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

            {/* Tempat Lahir (DROPDOWN SELECTION) */}
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
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {DAFTAR_KOTA_LAHIR.map((kota, idx) => (
                  <option key={idx} value={kota}>
                    {kota}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Lahir */}
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

          {/* OPSI KHUSUS PELAPORAN NON-AKTIF */}
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

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-600/10"
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
