"use client";

import React, { useEffect, useState } from "react";
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

const SUB_AKSI_OPTIONS = [
  { id: "baru" as const, title: "Warga Baru", desc: "Pendaftaran" },
  { id: "nonaktif" as const, title: "Non-Aktif", desc: "Meninggal/Pindah" },
  { id: "koreksi" as const, title: "Koreksi", desc: "Perbaikan Data" },
];

const FORM_FIELDS = [
  {
    key: "nik",
    label: "NIK Warga (16 Digit) *",
    type: "text",
    maxLength: 16,
    placeholder: "3507xxxxxxxxxxxx",
    mono: true,
    grid: "half",
  },
  {
    key: "nama",
    label: "Nama Lengkap Warga *",
    type: "text",
    placeholder: "Nama Lengkap",
    grid: "half",
  },
  {
    key: "jenisKelamin",
    label: "Jenis Kelamin *",
    type: "select",
    options: [
      { value: "L", label: "Laki-Laki (L)" },
      { value: "P", label: "Perempuan (P)" },
    ],
    grid: "third",
  },
  {
    key: "tempatLahir",
    label: "Tempat Lahir *",
    type: "select",
    options: DAFTAR_KOTA_LAHIR.map((kota) => ({ value: kota, label: kota })),
    grid: "third",
  },
  {
    key: "tanggalLahir",
    label: "Tanggal Lahir *",
    type: "date",
    grid: "third",
  },
] as const;

const ALASAN_NONAKTIF_OPTIONS = [
  { value: "Meninggal Dunia", label: "Meninggal Dunia (Mutasi Kematian)" },
  { value: "Pindah Wilayah", label: "Pindah Wilayah Domisili / Luar Desa" },
  { value: "Data Ganda / Anomali", label: "Data Ganda / Anomali Sistem" },
];

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
  onClose?: () => void;
  initialSubAksi?: "baru" | "nonaktif" | "koreksi";
  initialFormDetail?: {
    nik?: string;
    nama?: string;
    jenisKelamin?: "L" | "P";
    tempatLahir?: string;
    tanggalLahir?: string;
    keterangan?: string;
  };
  lockSubAksi?: boolean;
  resubmitInfo?: string;
}

export default function FormMutasiLengkap({
  tahunPeriode,
  daftarWarga,
  selectedNik,
  setSelectedNik,
  onSubmitMutasi,
  onClose,
  initialSubAksi,
  initialFormDetail,
  lockSubAksi = false,
  resubmitInfo,
}: FormMutasiLengkapProps) {
  const isTahunBerlalu = tahunPeriode !== "2026";
  const riwayatMutasi = mockRiwayatMutasiPerTahun[tahunPeriode] || [];

  const [subAksi, setSubAksi] = useState<"baru" | "nonaktif" | "koreksi">(
    initialSubAksi || "baru",
  );
  const [formDetail, setFormDetail] = useState({
    nik: initialFormDetail?.nik || "",
    nama: initialFormDetail?.nama || "",
    jenisKelamin: initialFormDetail?.jenisKelamin || ("L" as "L" | "P"),
    tempatLahir: initialFormDetail?.tempatLahir || "Kab. Malang",
    tanggalLahir: initialFormDetail?.tanggalLahir || "",
    keterangan: initialFormDetail?.keterangan || "Meninggal Dunia",
  });

  useEffect(() => {
    setSubAksi(initialSubAksi || "baru");
    setFormDetail({
      nik: initialFormDetail?.nik || "",
      nama: initialFormDetail?.nama || "",
      jenisKelamin: initialFormDetail?.jenisKelamin || "L",
      tempatLahir: initialFormDetail?.tempatLahir || "Kab. Malang",
      tanggalLahir: initialFormDetail?.tanggalLahir || "",
      keterangan: initialFormDetail?.keterangan || "Meninggal Dunia",
    });
    setSelectedNik(initialFormDetail?.nik || "");
  }, [initialSubAksi, initialFormDetail, setSelectedNik]);

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

  const handleChangeSubAksi = (id: "baru" | "nonaktif" | "koreksi") => {
    if (lockSubAksi) return;
    setSubAksi(id);
    if (id === "baru") {
      setSelectedNik("");
      setFormDetail({
        nik: "",
        nama: "",
        jenisKelamin: "L",
        tempatLahir: "Kab. Malang",
        tanggalLahir: "",
        keterangan: "Meninggal Dunia",
      });
    }
  };

  const handleChangeField = (key: string, value: string) => {
    setFormDetail((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const nik = formDetail.nik.trim();
    const nama = formDetail.nama.trim();
    const keterangan = formDetail.keterangan.trim();

    if (!nik) {
      return "NIK wajib diisi.";
    }

    if (subAksi === "nonaktif") {
      if (!keterangan) {
        return "Keterangan wajib diisi untuk mutasi non-aktif.";
      }

      return null;
    }

    if (!nama) {
      return "Nama lengkap warga wajib diisi.";
    }

    if (!formDetail.jenisKelamin.trim()) {
      return "Jenis kelamin wajib dipilih.";
    }

    if (!formDetail.tempatLahir.trim()) {
      return "Tempat lahir wajib dipilih.";
    }

    if (!formDetail.tanggalLahir.trim()) {
      return "Tanggal lahir wajib diisi.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    onSubmitMutasi(e, {
      kategoriAksi: subAksi,
      dataForm: formDetail,
    });
  };

  // ===================== MODE ARSIP =====================
  if (isTahunBerlalu) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-1">
              🔒 Mode Arsip Data ({tahunPeriode})
            </div>
            <h3 className="text-base font-bold text-slate-950">
              Riwayat Pelaporan Mutasi Tahun {tahunPeriode}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar transaksi penginputan mutasi warga tahun ini.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 self-start">
            Total: {riwayatMutasi.length} Data
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-sm border-collapse min-w-150">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-3 sm:px-5 py-3">Tgl Lapor</th>
                <th className="px-3 sm:px-5 py-3">Kategori</th>
                <th className="px-3 sm:px-5 py-3">Warga</th>
                <th className="px-3 sm:px-5 py-3">Keterangan</th>
                <th className="px-3 sm:px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {riwayatMutasi.length > 0 ? (
                riwayatMutasi.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-3 sm:px-5 py-3.5 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="px-3 sm:px-5 py-3.5">
                      <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100 whitespace-nowrap">
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5">
                      <p className="font-bold text-slate-900 text-xs">
                        {item.nama}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {item.nik}
                      </p>
                    </td>
                    <td className="px-3 sm:px-5 py-3.5 text-xs text-slate-600 max-w-35 truncate">
                      {item.keterangan}
                    </td>
                    <td className="px-3 sm:px-5 py-3.5 text-right">
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold whitespace-nowrap">
                        ✓ Disetujui
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
                    Tidak ada riwayat mutasi pada tahun {tahunPeriode}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ===================== MODE AKTIF → MODAL (RESPONSIVE) =====================
  const halfFields = FORM_FIELDS.filter((f) => f.grid === "half");
  const thirdFields = FORM_FIELDS.filter((f) => f.grid === "third");
  const isNonAktif = subAksi === "nonaktif";
  const isKoreksi = subAksi === "koreksi";
  const showDetailFields = subAksi !== "nonaktif";

  const renderField = (field: (typeof FORM_FIELDS)[number]) => {
    const commonClass =
      "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400";

    return (
      <div key={field.key}>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          {field.label}
        </label>

        {field.type === "select" ? (
          <select
            value={formDetail[field.key as keyof typeof formDetail] as string}
            onChange={(e) => handleChangeField(field.key, e.target.value)}
            className={`${commonClass} cursor-pointer`}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            required
            maxLength={"maxLength" in field ? field.maxLength : undefined}
            placeholder={
              "placeholder" in field ? field.placeholder : undefined
            }
            value={formDetail[field.key as keyof typeof formDetail] as string}
            onChange={(e) => handleChangeField(field.key, e.target.value)}
            className={`${commonClass} ${
              "mono" in field && field.mono ? "font-mono" : ""
            }`}
          />
        )}
      </div>
    );
  };

  const submitLabel = {
    baru: {
      mobile: "Kirim Pendaftaran →",
      desktop: "Kirim Laporan Pendaftaran Warga Baru ke Sekdes →",
    },
    nonaktif: {
      mobile: "Kirim Non-Aktif →",
      desktop: "Kirim Laporan Non-Aktifkan Warga ke Sekdes →",
    },
    koreksi: {
      mobile: "Kirim Koreksi →",
      desktop: "Kirim Usulan Koreksi Data Warga ke Sekdes →",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-2xl sm:mx-4 sm:rounded-2xl rounded-t-2xl border border-slate-200/80 shadow-2xl max-h-[93vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-start justify-between z-10 shrink-0">
          <div className="min-w-0 pr-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[10px] font-bold mb-1">
              📋 Pendataan RT · {tahunPeriode}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
              Formulir Mutasi Kependudukan
            </h3>
            {resubmitInfo && (
              <p className="mt-1 text-[11px] text-amber-700 font-semibold">
                {resubmitInfo}
              </p>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 p-2 -mr-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              aria-label="Tutup"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-5 space-y-5">
          {/* 3 Opsi Kategori - selalu sejajar */}
          <div className="grid grid-cols-3 gap-2">
            {SUB_AKSI_OPTIONS.map((opt) => (
              <button
                  key={opt.id}
                type="button"
                disabled={lockSubAksi}
                onClick={() => handleChangeSubAksi(opt.id)}
                className={`px-2 py-2.5 sm:px-3 sm:py-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 min-h-16 ${
                  subAksi === opt.id
                    ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                } ${lockSubAksi ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className="text-[11px] sm:text-xs font-extrabold leading-tight">
                  {opt.title}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] leading-tight ${
                    subAksi === opt.id ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Banner Koreksi */}
          {isKoreksi && (
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-start gap-2.5 text-blue-950">
              <span className="text-base leading-none shrink-0 mt-0.5">💡</span>
              <div>
                <p className="font-extrabold text-[11px] sm:text-xs mb-0.5">
                  Petunjuk Koreksi
                </p>
                <p className="text-blue-900 leading-relaxed font-medium text-[11px]">
                  Ubah <strong>hanya field yang salah</strong>. Field lain tetap
                  memakai data awal.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select NIK */}
            {subAksi !== "baru" && (
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200/80 space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Pilih NIK yang akan di-
                  {subAksi === "nonaktif" ? "nonaktifkan" : "koreksi"} *
                </label>
                <SearchableNikSelect
                  daftarWarga={daftarWarga}
                  selectedNik={selectedNik}
                  onSelectNik={handleSelectWargaEksisting}
                />
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">
              {showDetailFields && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {halfFields.map(renderField)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {thirdFields.map(renderField)}
                  </div>
                </>
              )}

              {isNonAktif && (
                <div className="bg-rose-50 p-3 sm:p-4 rounded-xl border border-rose-200 space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-800">
                    Keterangan *
                  </label>
                  <select
                    value={formDetail.keterangan}
                    onChange={(e) =>
                      handleChangeField("keterangan", e.target.value)
                    }
                    className="w-full px-3 py-2.5 border border-rose-200 rounded-xl text-xs font-bold text-rose-950 bg-white"
                  >
                    {ALASAN_NONAKTIF_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Submit - text lebih pendek di mobile */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-600/10"
            >
              <span className="sm:hidden">{submitLabel[subAksi].mobile}</span>
              <span className="hidden sm:inline">
                {submitLabel[subAksi].desktop}
              </span>
            </button>
          </form>
        </div>

        {/* Safe area bottom (iOS) */}
        <div className="sm:hidden h-[env(safe-area-inset-bottom)] bg-white shrink-0" />
      </div>
    </div>
  );
}