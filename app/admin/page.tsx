"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { UserRole } from "@/types/auth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { usePenduduk } from "@/hooks/cores/usePenduduk";

const ROLES_LIST: { value: UserRole; label: string; badge: string }[] = [
  { value: "KEPALA_DESA", label: "Kepala Desa", badge: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "SEKRETARIS", label: "Sekretaris Desa", badge: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "KETUA_RT", label: "Ketua RT", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "WARGA", label: "Warga Desa", badge: "bg-slate-100 text-slate-800 border-slate-200" },
];

function AdminRolesContent() {
  const { roles, isLoading, assignRole, removeRole } = useUserRoles();
  const { data: pendudukList } = usePenduduk();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("Semua");
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Form State untuk penambahan / ubah role
  const [selectedPendudukId, setSelectedPendudukId] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("WARGA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notif, setNotif] = useState("");

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 4000);
  };

  // Filter Data
  const filteredRoles = useMemo(() => {
    return roles.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nik.includes(q);

      const matchFilter = filterRole === "Semua" || item.role === filterRole;

      return matchSearch && matchFilter;
    });
  }, [roles, searchQuery, filterRole]);

  // Statistik Role
  const stats = useMemo(() => {
    const kades = roles.filter((r) => r.role === "KEPALA_DESA").length;
    const sekdes = roles.filter((r) => r.role === "SEKRETARIS").length;
    const rt = roles.filter((r) => r.role === "KETUA_RT").length;
    const warga = roles.filter((r) => r.role === "WARGA").length;
    return { kades, sekdes, rt, warga, total: roles.length };
  }, [roles]);

  // Handle Assign / Update Role
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPendudukId) {
      alert("Silahkan pilih warga terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    try {
      await assignRole(selectedPendudukId, selectedRole);
      showNotification(`Sukses: Peran berhasil ditetapkan sebagai ${selectedRole}!`);
      setShowAssignModal(false);
      setSelectedPendudukId("");
    } catch (err) {
      console.error(err);
      alert("Gagal menetapkan role: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Role (Reset ke Default Warga)
  const handleDeleteRole = async (pendudukId: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus peran khusus untuk ${nama}?`)) {
      try {
        await removeRole(pendudukId);
        showNotification(`Sukses: Peran untuk ${nama} berhasil dihapus/direset.`);
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus role: " + (err as Error).message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased space-y-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-extrabold text-[10px] rounded-lg border border-purple-200 uppercase tracking-wider">
                PANEL ADMINISTRATOR
              </span>
              <span className="text-xs text-slate-400 font-mono">• Supabase Live</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-950 mt-1">
              Manajemen Peran & Hak Akses Pengguna (Role Management)
            </h1>
          </div>

          <Link
            href="/rt"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition self-start sm:self-auto"
          >
            ← Ke Panel RT
          </Link>
        </div>

        {/* NOTIFIKASI AKSI */}
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-2xs animate-in fade-in duration-200">
            {notif}
          </div>
        )}

        {/* RINGKASAN KARTU STATISTIK ROLE */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total User</span>
            <span className="text-lg font-black text-slate-900">{stats.total}</span>
          </div>
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200/80 shadow-2xs text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-700 uppercase block">Kepala Desa</span>
            <span className="text-lg font-black text-purple-950">{stats.kades}</span>
          </div>
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 shadow-2xs text-center space-y-1">
            <span className="text-[10px] font-bold text-blue-700 uppercase block">Sekretaris</span>
            <span className="text-lg font-black text-blue-950">{stats.sekdes}</span>
          </div>
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Ketua RT</span>
            <span className="text-lg font-black text-emerald-950">{stats.rt}</span>
          </div>
          <div className="bg-slate-100/60 p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase block">Warga Biasa</span>
            <span className="text-lg font-black text-slate-900">{stats.warga}</span>
          </div>
        </div>

        {/* MAIN CARD MANAGEMENT */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
          {/* CARD HEADER + ACTION */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">Daftar Penugasan Role Perangkat & Warga Desa</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola hak akses login By NIK untuk Kepala Desa, Sekretaris, Ketua RT, dan Warga.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span className="text-base leading-none">+</span>
              <span>Tambah / Tetapkan Role</span>
            </button>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama warga atau NIK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-blue-500"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-blue-500 sm:min-w-[180px] cursor-pointer"
            >
              <option value="Semua">Semua Peran</option>
              <option value="KEPALA_DESA">Kepala Desa</option>
              <option value="SEKRETARIS">Sekretaris Desa</option>
              <option value="KETUA_RT">Ketua RT</option>
              <option value="WARGA">Warga Desa</option>
            </select>
          </div>

          {/* TABLE CONTENT */}
          {isLoading ? (
            <div className="p-10 text-center text-xs text-slate-400">
              Memuat data role pengguna dari Supabase...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Warga Terkait</th>
                    <th className="px-5 py-3.5">NIK (Login Key)</th>
                    <th className="px-5 py-3.5">Peran / Role Terpasang</th>
                    <th className="px-5 py-3.5">Ubah Role Langsung</th>
                    <th className="px-5 py-3.5 text-right">Aksi Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((item) => {
                      const roleConfig = ROLES_LIST.find((r) => r.value === item.role) || ROLES_LIST[3];
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition">
                          <td className="px-5 py-3.5">
                            <p className="font-extrabold text-slate-900 text-xs">{item.nama}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {item.pendudukId}</p>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">
                            {item.nik}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${roleConfig.badge}`}>
                              {roleConfig.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              value={item.role}
                              onChange={(e) => assignRole(item.pendudukId, e.target.value as UserRole)}
                              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="KEPALA_DESA">Kepala Desa</option>
                              <option value="SEKRETARIS">Sekretaris Desa</option>
                              <option value="KETUA_RT">Ketua RT</option>
                              <option value="WARGA">Warga Desa</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(item.pendudukId, item.nama)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition cursor-pointer"
                            >
                              Hapus Role
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-400 text-xs">
                        {searchQuery || filterRole !== "Semua"
                          ? "Tidak ada data role yang cocok dengan pencarian."
                          : "Belum ada entri role pengguna terdaftar."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Menampilkan {filteredRoles.length} dari {roles.length} data role terpasang
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH / ASSIGN ROLE */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-950">Tetapkan Peran Pengguna Baru</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih warga dari master data penduduk dan tentukan hak akses rolenya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-sm flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">
                  Pilih Warga Desa (Master Data) *
                </label>
                <select
                  value={selectedPendudukId}
                  onChange={(e) => setSelectedPendudukId(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  required
                >
                  <option value="">-- Pilih Warga Berdasarkan NIK / Nama --</option>
                  {(pendudukList || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} (NIK: {p.nik})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">
                  Pilih Peran Sistem (Role Enum) *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="KEPALA_DESA">Kepala Desa (Akses Penuh SK & Rekomendasi)</option>
                  <option value="SEKRETARIS">Sekretaris Desa (Verifikator Pengajuan & Mutasi)</option>
                  <option value="KETUA_RT">Ketua RT (Lini Terdepan Input Mutasi & Survei)</option>
                  <option value="WARGA">Warga Desa (Akses Mandiri & Sanggahan Online)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Peran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Panel Admin...
        </div>
      }
    >
      <AdminRolesContent />
    </Suspense>
  );
}
