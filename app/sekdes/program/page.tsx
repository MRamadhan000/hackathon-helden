// src/app/(dashboard)/program/page.tsx
"use client";

import { useState } from "react";
import { useProgram } from "@/hooks/operational/useProgram";
import { useAuth } from "@/hooks/useAuth";
import {
  Program,
  CreateProgramRequest,
  UpdateProgramRequest,
  ProgramFormData,
} from "@/types/program";

const initialForm: ProgramFormData = {
  nama: "",
  deskripsi: "",
  jumlahAnggaran: 0,
  tanggalMulai: "",
  tanggalSelesai: "",
};

export default function ProgramPage() {
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  const {
    data,
    isLoading,
    error,
    tambah,
    ubah,
    hapus,
    refresh,
    applyFilters,
  } = useProgram();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramFormData>(initialForm);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buka modal tambah
  const openCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  // Buka modal edit
  const openEdit = (item: Program) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || "",
      jumlahAnggaran: item.jumlahAnggaran,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
    });
    setIsModalOpen(true);
  };

  // Submit form (create / update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) {
      alert("User belum login");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const payload: UpdateProgramRequest = {
          nama: form.nama,
          deskripsi: form.deskripsi || null,
          jumlahAnggaran: form.jumlahAnggaran,
          tanggalMulai: form.tanggalMulai,
          tanggalSelesai: form.tanggalSelesai,
        };
        await ubah(editingId, payload);
      } else {
        const payload: CreateProgramRequest = {
          nama: form.nama,
          deskripsi: form.deskripsi || null,
          jumlahAnggaran: form.jumlahAnggaran,
          tanggalMulai: form.tanggalMulai,
          tanggalSelesai: form.tanggalSelesai,
          createdBy: currentUser.id,
        };
        await tambah(payload);
      }

      setIsModalOpen(false);
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hapus
  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus program "${nama}"?`)) return;

    try {
      await hapus(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus data");
    }
  };

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: search.trim() || undefined });
  };

  // Format rupiah
  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  // Format tanggal
  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Loading auth
  if (isAuthLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="p-12 text-center text-gray-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Program</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data program dan anggaran
          </p>
        </div>

        <button
          onClick={openCreate}
          disabled={!currentUser}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Tambah Program
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Cari nama atau deskripsi program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              applyFilters({});
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Reset
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error.message}
          <button
            onClick={() => refresh()}
            className="ml-3 underline text-sm"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            Memuat data program...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Belum ada data program.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Nama Program
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Anggaran
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Periode
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Dibuat
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.nama}
                      </div>
                      {item.deskripsi && (
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {item.deskripsi}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {formatRupiah(item.jumlahAnggaran)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{formatTanggal(item.tanggalMulai)}</div>
                      <div className="text-xs text-gray-400">
                        s/d {formatTanggal(item.tanggalSelesai)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatTanggal(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Program" : "Tambah Program Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Program Bantuan Sosial 2026"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, deskripsi: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi singkat program..."
                />
              </div>

              {/* Jumlah Anggaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Anggaran (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={form.jumlahAnggaran || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      jumlahAnggaran: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.tanggalMulai}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tanggalMulai: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.tanggalSelesai}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        tanggalSelesai: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !currentUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingId
                    ? "Simpan Perubahan"
                    : "Tambah Program"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}