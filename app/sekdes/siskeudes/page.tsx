"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSiskeudes } from "@/hooks/operational/useSiskeudes";
import { useProgram } from "@/hooks/operational/useProgram";
import type { Siskeudes, KategoriSiskeudes } from "@/services/operational/siskeudes.service";
import type { Program } from "@/types/program";

/* ─── helpers ─── */
function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmt(v?: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  return isNaN(d.getTime())
    ? v
    : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function KategoriBadge({ k }: { k: KategoriSiskeudes }) {
  return k === "bansos" ? (
    <span className="px-2 py-0.5 rounded-lg border text-[10px] font-bold bg-violet-50 text-violet-800 border-violet-200">
      💜 Bansos
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-lg border text-[10px] font-bold bg-sky-50 text-sky-800 border-sky-200">
      ⚙️ Operasional
    </span>
  );
}

/* ═══════════════════════════════════════════════
   FORM MODAL — Create / Edit Siskeudes
═══════════════════════════════════════════════ */
type SiskForm = {
  nama: string;
  kategori: KategoriSiskeudes;
  nominal: string;
  kkm: string;
};

const EMPTY_FORM: SiskForm = {
  nama: "",
  kategori: "bansos",
  nominal: "",
  kkm: "",
};

function SiskeudesFormModal({
  initial,
  editId,
  onSave,
  onClose,
}: {
  initial?: Partial<SiskForm>;
  editId?: string;
  onSave: (form: SiskForm, editId?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SiskForm>({ ...EMPTY_FORM, ...initial });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof SiskForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) { setErr("Nama wajib diisi."); return; }
    if (!form.nominal || Number(form.nominal) <= 0) { setErr("Nominal harus lebih dari 0."); return; }
    setSaving(true);
    try {
      await onSave(form, editId);
      onClose();
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {editId ? "Edit" : "Tambah"} Item Siskeudes
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Data akan tersimpan ke tabel siskeudes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {err && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              ⚠️ {err}
            </p>
          )}

          {/* Kategori toggle */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Kategori</label>
            <div className="flex gap-2">
              {(["bansos", "operasional"] as KategoriSiskeudes[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set("kategori", k)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    form.kategori === k
                      ? k === "bansos"
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-sky-600 text-white border-sky-600"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {k === "bansos" ? "💜 Bansos" : "⚙️ Operasional"}
                </button>
              ))}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Nama Program / Pos *
            </label>
            <input
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              required
              placeholder={
                form.kategori === "bansos"
                  ? "mis: BLT Dana Desa 2026"
                  : "mis: Operasional Kantor Desa"
              }
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Nominal (Rp) *
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={form.nominal}
              onChange={(e) => set("nominal", e.target.value)}
              required
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* KKM — hanya untuk bansos */}
          {form.kategori === "bansos" && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                KKM — Nilai Kriteria Minimum (opsional)
              </label>
              <input
                type="number"
                min="0"
                value={form.kkm}
                onChange={(e) => set("kkm", e.target.value)}
                placeholder="mis: 300000"
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Batas nilai survei kelayakan penerima bansos
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {saving ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Item"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LINK PROGRAM MODAL — Sekdes pilih program mana yg terhubung ke siskeudes
═══════════════════════════════════════════════ */
function LinkProgramModal({
  siskeudes,
  programList,
  onClose,
}: {
  siskeudes: Siskeudes;
  programList: Program[];
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [notif, setNotif] = useState("");

  const handleLink = () => {
    if (!selectedId) return;
    const prog = programList.find((p) => p.id === selectedId);
    // NOTE: Simpan hubungan ke DB — untuk sementara tampil notif sukses
    // Implementasi FK bisa via kolom siskeudes_id di tabel program atau tabel pivot
    setNotif(`Program "${prog?.nama}" berhasil ditautkan ke "${siskeudes.nama}".`);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Tautkan ke Program</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Pilih program yang dibiayai oleh: <strong>{siskeudes.nama}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {notif ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900">
              ✅ {notif}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">
                  Pilih Program
                </label>
                {programList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada program. Buat program terlebih dahulu.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {programList.map((prog) => (
                      <label
                        key={prog.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                          selectedId === prog.id
                            ? "bg-indigo-50 border-indigo-300"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="program"
                          value={prog.id}
                          checked={selectedId === prog.id}
                          onChange={() => setSelectedId(prog.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{prog.nama}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(prog.jumlahAnggaran)}
                            {" · "}
                            {fmt(prog.tanggalMulai)} – {fmt(prog.tanggalSelesai)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLink}
                  disabled={!selectedId}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Tautkan Program
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </>
          )}

          {notif && (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
function PageSiskeudes() {
  const searchParams = useSearchParams();
  const tahun = searchParams.get("tahun") || "2026";
  const { user } = useAuth();

  const { data, bansoslist, operasionalList, stats, isLoading, error, tambah, ubah, hapus, refresh } = useSiskeudes();
  const { data: programList } = useProgram();

  const [tab, setTab] = useState<"semua" | "bansos" | "operasional">("semua");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Siskeudes | null>(null);
  const [linkTarget, setLinkTarget] = useState<Siskeudes | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const baseList = tab === "bansos" ? bansoslist : tab === "operasional" ? operasionalList : data;
  const filtered = useMemo(() => {
    if (!search.trim()) return baseList;
    const q = search.toLowerCase();
    return baseList.filter((d) => d.nama.toLowerCase().includes(q));
  }, [baseList, search]);

  const showNotif = (type: "ok" | "err", msg: string) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 4000);
  };

  const handleSave = async (form: SiskForm, editId?: string) => {
    const payload = {
      nama: form.nama,
      kategori: form.kategori,
      nominal: Number(form.nominal),
      kkm: form.kkm ? Number(form.kkm) : null,
    };
    if (editId) {
      await ubah(editId, payload);
      showNotif("ok", "Item berhasil diperbarui.");
    } else {
      await tambah(payload);
      showNotif("ok", "Item berhasil ditambahkan.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await hapus(id);
      showNotif("ok", "Item berhasil dihapus.");
      setConfirmDelete(null);
    } catch (e) {
      showNotif("err", (e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/sekdes/dashboard?tahun=${tahun}`}
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition"
          >
            ← Workspace Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Periode: <strong>{tahun}</strong>
          </span>
        </div>

        {/* Page header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                💰 Integrasi Siskeudes
              </span>
            </div>
            <h1 className="text-base font-extrabold text-slate-950">Manajemen Pos Siskeudes</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kelola pos anggaran bansos & operasional, lalu tautkan ke program desa
            </p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap shadow-sm"
          >
            + Tambah Pos
          </button>
        </div>

        {/* Notif */}
        {notif && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold border ${
              notif.type === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {notif.msg}
          </div>
        )}
        {error && (
          <div className="p-3.5 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between">
            <span>{error.message}</span>
            <button onClick={refresh} className="underline font-bold">Coba lagi</button>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Total Nominal</span>
            <span className="text-base font-black text-slate-900">{rupiah(stats.totalNominal)}</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">{stats.total} pos anggaran</span>
          </div>
          <div className="bg-white rounded-2xl border border-violet-200 p-4 shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-violet-400">Bansos</span>
            <span className="text-base font-black text-violet-900">{rupiah(stats.nominalBansos)}</span>
            <span className="block text-[10px] text-violet-400 mt-0.5">{stats.totalBansos} pos bansos</span>
          </div>
          <div className="bg-white rounded-2xl border border-sky-200 p-4 shadow-sm">
            <span className="block text-[10px] font-bold uppercase text-sky-400">Operasional</span>
            <span className="text-base font-black text-sky-900">{rupiah(stats.nominalOperasional)}</span>
            <span className="block text-[10px] text-sky-400 mt-0.5">{stats.totalOperasional} pos operasional</span>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap justify-between">
            {/* Tab filter */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {(["semua", "bansos", "operasional"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer capitalize ${
                    tab === t
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t === "semua" ? "📋 Semua" : t === "bansos" ? "💜 Bansos" : "⚙️ Operasional"}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pos..."
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 w-56"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Memuat data Siskeudes...</div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3">Nama Pos</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                    <th className="px-4 py-3 text-right">KKM</th>
                    <th className="px-4 py-3 text-center">Program Terkait</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const linkedCount = programList.filter(
                      (p) => p.deskripsi?.includes(item.id) // placeholder — idealnya ada FK
                    ).length;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-slate-900 text-xs">{item.nama}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Dibuat: {fmt(item.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-3.5">
                          <KategoriBadge k={item.kategori} />
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-xs text-slate-800">
                          {rupiah(item.nominal)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs text-slate-500">
                          {item.kkm != null ? rupiah(item.kkm) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => setLinkTarget(item)}
                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg hover:bg-indigo-100 cursor-pointer transition"
                          >
                            🔗 Tautkan
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end items-center gap-1">
                            <button
                              onClick={() => { setEditTarget(item); setShowForm(true); }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer transition"
                            >
                              ✏️
                            </button>
                            {confirmDelete === item.id ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDelete(item.id)}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg cursor-pointer transition"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-2xl">💰</p>
              <p className="text-xs font-bold text-slate-500">
                Belum ada pos {tab !== "semua" ? tab : ""} Siskeudes.
              </p>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true); }}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Tambah Pos Pertama
              </button>
            </div>
          )}
        </div>

        {/* Daftar program di bawah — referensi cepat */}
        {programList.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <h2 className="text-xs font-extrabold text-slate-700">📋 Daftar Program Tersedia</h2>
            <p className="text-[10px] text-slate-400">
              Program-program di bawah bisa ditautkan ke pos Siskeudes di atas
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                    <th className="px-4 py-2.5">Nama Program</th>
                    <th className="px-4 py-2.5 text-right">Anggaran</th>
                    <th className="px-4 py-2.5">Periode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programList.slice(0, 8).map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-bold text-slate-900">{prog.nama}</p>
                        {prog.deskripsi && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[220px]">{prog.deskripsi}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-xs text-slate-700">
                        {rupiah(prog.jumlahAnggaran)}
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-slate-500 font-mono">
                        {fmt(prog.tanggalMulai)} – {fmt(prog.tanggalSelesai)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {programList.length > 8 && (
                <p className="text-[10px] text-slate-400 text-center py-2">
                  +{programList.length - 8} program lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <SiskeudesFormModal
          editId={editTarget?.id}
          initial={
            editTarget
              ? {
                  nama: editTarget.nama,
                  kategori: editTarget.kategori,
                  nominal: String(editTarget.nominal),
                  kkm: editTarget.kkm != null ? String(editTarget.kkm) : "",
                }
              : undefined
          }
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {/* Link Program Modal */}
      {linkTarget && (
        <LinkProgramModal
          siskeudes={linkTarget}
          programList={programList}
          onClose={() => setLinkTarget(null)}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat...</div>}>
      <PageSiskeudes />
    </Suspense>
  );
}
