"use client";

import React, { useState } from "react";
import Link from "next/link";

// 1. IMPORT TYPE SESUAI SKEMA ANDA
export interface MasterPeriode {
  id: number; // bigint
  tahun: string; // character varying(4)
  is_aktif: boolean | null; // boolean
  created_at: string | null; // timestamp with time zone
  updated_at: string | null; // timestamp with time zone
}

export type MasterPeriodeInsert = Omit<
  MasterPeriode,
  "id" | "created_at" | "updated_at"
>;
export type MasterPeriodeUpdate = Partial<MasterPeriodeInsert>;

// MOCK DATA AWAL
const initialDataPeriode: MasterPeriode[] = [
  {
    id: 1,
    tahun: "2026",
    is_aktif: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    tahun: "2025",
    is_aktif: false,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    tahun: "2024",
    is_aktif: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

export default function MasterPeriodePage() {
  const [listPeriode, setListPeriode] =
    useState<MasterPeriode[]>(initialDataPeriode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<MasterPeriode | null>(
    null,
  );

  // Form State untuk Insert / Update
  const [formData, setFormData] = useState<MasterPeriodeInsert>({
    tahun: "",
    is_aktif: false,
  });

  const [notif, setNotif] = useState("");

  // Handler Buka Modal Tambah Data
  const handleOpenCreateModal = () => {
    setSelectedPeriode(null);
    setFormData({ tahun: "", is_aktif: false });
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit Data
  const handleOpenEditModal = (item: MasterPeriode) => {
    setSelectedPeriode(item);
    setFormData({ tahun: item.tahun, is_aktif: item.is_aktif ?? false });
    setIsModalOpen(true);
  };

  // Handler Aktifkan Periode (Hanya Boleh 1 Tahun Yang Aktif)
  const handleSetAktif = (id: number) => {
    setListPeriode((prev) =>
      prev.map((item) => ({
        ...item,
        is_aktif: item.id === id,
        updated_at: new Date().toISOString(),
      })),
    );
    const itemAktif = listPeriode.find((p) => p.id === id);
    showNotif(`Periode Tahun ${itemAktif?.tahun || ""} berhasil diaktifkan!`);
  };

  // Handler Submit Form (Tambah / Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tahun || formData.tahun.length !== 4) {
      alert("Tahun harus diisi 4 digit angka (Contoh: 2027)!");
      return;
    }

    const now = new Date().toISOString();

    if (selectedPeriode) {
      // UPDATE DATA
      setListPeriode((prev) =>
        prev.map((item) => {
          if (item.id === selectedPeriode.id) {
            return {
              ...item,
              tahun: formData.tahun,
              is_aktif: formData.is_aktif,
              updated_at: now,
            };
          }
          // Jika yang diedit diubah jadi aktif, nonaktifkan tahun lain
          return formData.is_aktif ? { ...item, is_aktif: false } : item;
        }),
      );
      showNotif(`Data Periode Tahun ${formData.tahun} berhasil diperbarui.`);
    } else {
      // INSERT DATA BARU
      const newId = Date.now();
      const newRecord: MasterPeriode = {
        id: newId,
        tahun: formData.tahun,
        is_aktif: formData.is_aktif,
        created_at: now,
        updated_at: now,
      };

      setListPeriode((prev) => {
        // Jika data baru di-set aktif, nonaktifkan periode lain
        const updatedPrev = formData.is_aktif
          ? prev.map((p) => ({ ...p, is_aktif: false }))
          : prev;
        return [newRecord, ...updatedPrev];
      });
      showNotif(`Periode Baru Tahun ${formData.tahun} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  // Handler Hapus Data
  const handleDelete = (id: number, tahun: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data Periode ${tahun}?`)) {
      setListPeriode((prev) => prev.filter((item) => item.id !== id));
      showNotif(`Periode Tahun ${tahun} telah dihapus.`);
    }
  };

  const showNotif = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* NAVIGASI KEMBALI */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
        >
          <span>←</span>
          <span>Kembali</span>
        </Link>

        {/* NOTIFIKASI SUKSES */}
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-xs">
            {notif}
          </div>
        )}

        {/* HEADER HALAMAN */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
              📅 Master Data Sistem
            </div>
            <h1 className="text-xl font-extrabold text-slate-950">
              Kelola Master Periode Tahun
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pengaturan tahun periode aktif untuk sinkronisasi seluruh laporan
              kependudukan & anggaran.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-900/10 cursor-pointer shrink-0"
          >
            + Tambah Periode Baru
          </button>
        </div>

        {/* TABEL MASTER PERIODE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Periode Terdaftar ({listPeriode.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">ID (BigInt)</th>
                  <th className="px-6 py-4">Tahun Periode</th>
                  <th className="px-6 py-4">Status Keterpakaian</th>
                  <th className="px-6 py-4">Dibuat / Diperbarui</th>
                  <th className="px-6 py-4 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {listPeriode.length > 0 ? (
                  listPeriode.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-950">
                          {item.tahun}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.is_aktif ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                            <span>✓</span> Periode Aktif
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg border border-slate-200">
                            Tidak Aktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <p>
                          Created:{" "}
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Updated:{" "}
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {!item.is_aktif && (
                          <button
                            onClick={() => handleSetAktif(item.id)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            Set Aktif
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.tahun)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Belum ada data periode terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FORM (INSERT & UPDATE) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-950">
                {selectedPeriode
                  ? "Edit Master Periode"
                  : "Tambah Periode Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tahun Periode (4 Digit) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="Contoh: 2027"
                  value={formData.tahun}
                  onChange={(e) =>
                    setFormData({ ...formData, tahun: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_aktif"
                  checked={formData.is_aktif ?? false}
                  onChange={(e) =>
                    setFormData({ ...formData, is_aktif: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_aktif"
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Jadikan Sebagai Periode Aktif Saat Ini
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition shadow-xs"
                >
                  {selectedPeriode ? "Simpan Perubahan" : "Tambah Periode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
