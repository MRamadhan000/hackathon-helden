"use client";

import React from "react";

interface FormLaporSekdesProps {
  formWarga: {
    nama: string;
    nik: string;
    aksi: string;
    detail: string;
  };
  setFormWarga: React.Dispatch<
    React.SetStateAction<{
      nama: string;
      nik: string;
      aksi: string;
      detail: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FormLaporSekdes({
  formWarga,
  setFormWarga,
  onSubmit,
}: FormLaporSekdesProps) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200/80 max-w-2xl shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-950">
          Formulir Pelaporan Cepat Sekdes
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Kirimkan mutasi kependudukan (kematian, pindah), usulan baru, atau
          hasil verifikasi sanggahan warga.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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
            <option value="Belum Terdata">Warga Baru (Belum Terdata)</option>
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
                setFormWarga((prev) => ({ ...prev, nama: e.target.value }))
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
              setFormWarga((prev) => ({ ...prev, detail: e.target.value }))
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-blue-600/10"
        >
          Kirim Laporan Resmi ke Sekdes
        </button>
      </form>
    </div>
  );
}
