// app/sekdes/program/page.tsx
"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProgram } from "@/hooks/operational/useProgram";
import { useSiskeudes } from "@/hooks/operational/useSiskeudes";
import { useAuth } from "@/hooks/useAuth";
import type { Program, CreateProgramRequest, UpdateProgramRequest } from "@/types/program";
import type { Siskeudes } from "@/services/operational/siskeudes.service";

/* ─── helpers ─── */
function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}
function fmt(v?: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/* ═══════════════════════════════════════════════
   ADD MODAL — Step 1: Pilih Siskeudes
═══════════════════════════════════════════════ */
function StepPilihSiskeudes({
  siskeudesList,
  selected,
  onSelect,
  onNext,
  onClose,
}: {
  siskeudesList: Siskeudes[];
  selected: Siskeudes | null;
  onSelect: (s: Siskeudes) => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return siskeudesList;
    const q = search.toLowerCase();
    return siskeudesList.filter((s) => s.nama.toLowerCase().includes(q));
  }, [siskeudesList, search]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
                Langkah 1 dari 2
              </p>
              <h3 className="text-sm font-extrabold text-slate-900">Pilih Pos Siskeudes</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Program akan menggunakan anggaran dari pos ini
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold">✕</button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-indigo-500 rounded-full transition-all" />
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 flex-shrink-0">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pos Siskeudes..."
            className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              {siskeudesList.length === 0
                ? "Belum ada data Siskeudes. Tambahkan di halaman Siskeudes terlebih dahulu."
                : "Tidak ada pos yang cocok."}
            </div>
          ) : (
            filtered.map((s) => {
              const isSelected = selected?.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelect(s)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-400 ring-1 ring-indigo-300"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          s.kategori === "bansos"
                            ? "bg-violet-100 text-violet-700"
                            : "bg-sky-100 text-sky-700"
                        }`}>
                          {s.kategori === "bansos" ? "💜 Bansos" : "⚙️ Operasional"}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                            ✓ Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{s.nama}</p>
                      {s.kkm != null && (
                        <p className="text-[10px] text-slate-400 mt-0.5">KKM: {rupiah(s.kkm)}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black text-slate-900">{rupiah(s.nominal)}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">
            Batal
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl cursor-pointer transition"
          >
            Lanjut → Isi Detail Program
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADD MODAL — Step 2: Isi Detail Program (tampil data Siskeudes terpilih)
═══════════════════════════════════════════════ */
type ProgramForm = {
  nama: string;
  deskripsi: string;
  jumlahAnggaran: string;
  tanggalMulai: string;
  tanggalSelesai: string;
};

function StepIsiProgram({
  siskeudes,
  onBack,
  onSave,
  onClose,
}: {
  siskeudes: Siskeudes;
  onBack: () => void;
  onSave: (form: ProgramForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProgramForm>({
    nama: "",
    deskripsi: "",
    jumlahAnggaran: String(siskeudes.nominal),
    tanggalMulai: "",
    tanggalSelesai: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof ProgramForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) { setErr("Nama program wajib diisi."); return; }
    if (!form.tanggalMulai || !form.tanggalSelesai) { setErr("Tanggal mulai dan selesai wajib diisi."); return; }
    if (form.tanggalSelesai < form.tanggalMulai) { setErr("Tanggal selesai tidak boleh sebelum tanggal mulai."); return; }
    setSaving(true);
    try {
      await onSave(form);
    } catch (ex) {
      setErr((ex as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
                Langkah 2 dari 2
              </p>
              <h3 className="text-sm font-extrabold text-slate-900">Detail Program</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Isi informasi program yang akan dibuat
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold">✕</button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-indigo-500 rounded-full transition-all" />
          </div>
        </div>

        {/* Siskeudes terpilih — info card */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold uppercase text-indigo-500 mb-1.5">Pos Siskeudes Terpilih</p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-indigo-900">{siskeudes.nama}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    siskeudes.kategori === "bansos" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"
                  }`}>
                    {siskeudes.kategori === "bansos" ? "💜 Bansos" : "⚙️ Operasional"}
                  </span>
                  {siskeudes.kkm != null && (
                    <span className="text-[9px] text-indigo-400">KKM: {rupiah(siskeudes.kkm)}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-indigo-900">{rupiah(siskeudes.nominal)}</p>
                <p className="text-[9px] text-indigo-400">Total nominal</p>
              </div>
            </div>
            <button onClick={onBack} className="mt-2 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer underline">
              ← Ganti Siskeudes
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {err && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">⚠️ {err}</p>
          )}

          {/* Nama */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nama Program *</label>
            <input
              value={form.nama}
              onChange={(e) => set("nama", e.target.value)}
              required
              placeholder="mis: BLT Dana Desa Tahap 1 2026"
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => set("deskripsi", e.target.value)}
              rows={2}
              placeholder="Deskripsi singkat program..."
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 resize-none"
            />
          </div>

          {/* Jumlah Anggaran — pre-filled dari Siskeudes */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Jumlah Anggaran (Rp) *
              <span className="ml-1 text-indigo-500 normal-case font-normal">(dari nominal Siskeudes)</span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={form.jumlahAnggaran}
              onChange={(e) => set("jumlahAnggaran", e.target.value)}
              required
              className="w-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Bisa diubah jika perlu, namun tidak boleh melebihi nominal pos ({rupiah(siskeudes.nominal)})
            </p>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tanggal Mulai *</label>
              <input
                type="date"
                value={form.tanggalMulai}
                onChange={(e) => set("tanggalMulai", e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tanggal Selesai *</label>
              <input
                type="date"
                value={form.tanggalSelesai}
                onChange={(e) => set("tanggalSelesai", e.target.value)}
                required
                min={form.tanggalMulai}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer transition"
            >
              {saving ? "Menyimpan..." : "Simpan Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EDIT MODAL — Single step (tanpa siskeudes step)
═══════════════════════════════════════════════ */
function EditProgramModal({
  item,
  onSave,
  onClose,
}: {
  item: Program;
  onSave: (id: string, form: ProgramForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProgramForm>({
    nama: item.nama,
    deskripsi: item.deskripsi ?? "",
    jumlahAnggaran: String(item.jumlahAnggaran),
    tanggalMulai: item.tanggalMulai,
    tanggalSelesai: item.tanggalSelesai,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof ProgramForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) { setErr("Nama wajib diisi."); return; }
    setSaving(true);
    try {
      await onSave(item.id, form);
      onClose();
    } catch (ex) {
      setErr((ex as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">Edit Program</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {err && <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">⚠️ {err}</p>}

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nama Program *</label>
            <input value={form.nama} onChange={(e) => set("nama", e.target.value)} required
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={(e) => set("deskripsi", e.target.value)} rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 resize-none" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Jumlah Anggaran (Rp) *</label>
            <input type="number" min="0" step="1000" value={form.jumlahAnggaran}
              onChange={(e) => set("jumlahAnggaran", e.target.value)} required
              className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tanggal Mulai *</label>
              <input type="date" value={form.tanggalMulai} onChange={(e) => set("tanggalMulai", e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tanggal Selesai *</label>
              <input type="date" value={form.tanggalSelesai} onChange={(e) => set("tanggalSelesai", e.target.value)} required
                min={form.tanggalMulai}
                className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400" />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer">
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
function ProgramPage() {
  const searchParams = useSearchParams();
  const tahun = searchParams.get("tahun") || "2026";
  const { user: currentUser, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, error, tambah, ubah, hapus, refresh, applyFilters } = useProgram();
  const { data: siskeudesList } = useSiskeudes();

  // Modal state
  const [mode, setMode] = useState<null | "add-step1" | "add-step2" | "edit">(null);
  const [selectedSiskeudes, setSelectedSiskeudes] = useState<Siskeudes | null>(null);
  const [editTarget, setEditTarget] = useState<Program | null>(null);

  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((d) => d.nama.toLowerCase().includes(q) || (d.deskripsi ?? "").toLowerCase().includes(q));
  }, [data, search]);

  const showNotif = (type: "ok" | "err", msg: string) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 4000);
  };

  const closeAll = () => {
    setMode(null);
    setSelectedSiskeudes(null);
    setEditTarget(null);
  };

  /* ─── Handlers ─── */
  const handleAdd = async (form: ProgramForm) => {
    if (!currentUser?.id) throw new Error("User belum login.");
    const payload: CreateProgramRequest = {
      nama: form.nama,
      deskripsi: form.deskripsi || null,
      jumlahAnggaran: Number(form.jumlahAnggaran),
      tanggalMulai: form.tanggalMulai,
      tanggalSelesai: form.tanggalSelesai,
      createdBy: currentUser.id,
    };
    await tambah(payload);
    showNotif("ok", `Program "${form.nama}" berhasil ditambahkan.`);
    closeAll();
  };

  const handleEdit = async (id: string, form: ProgramForm) => {
    const payload: UpdateProgramRequest = {
      nama: form.nama,
      deskripsi: form.deskripsi || null,
      jumlahAnggaran: Number(form.jumlahAnggaran),
      tanggalMulai: form.tanggalMulai,
      tanggalSelesai: form.tanggalSelesai,
    };
    await ubah(id, payload);
    showNotif("ok", "Program berhasil diperbarui.");
  };

  const handleDelete = async (id: string) => {
    try {
      await hapus(id);
      showNotif("ok", "Program berhasil dihapus.");
      setConfirmDelete(null);
    } catch (e) {
      showNotif("err", (e as Error).message);
    }
  };

  if (isAuthLoading) {
    return <div className="p-12 text-center text-xs text-slate-400">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Top nav */}
        <div className="flex items-center justify-between gap-3">
          <Link href={`/sekdes/dashboard?tahun=${tahun}`} className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition">
            ← Workspace Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Periode: <strong>{tahun}</strong>
          </span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-extrabold text-slate-950">Manajemen Program</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Kelola program desa — terhubung dengan pos Siskeudes
            </p>
          </div>
          <button
            onClick={() => { setSelectedSiskeudes(null); setMode("add-step1"); }}
            disabled={!currentUser}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm whitespace-nowrap"
          >
            + Tambah Program
          </button>
        </div>

        {/* Notif */}
        {notif && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold border ${notif.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
            {notif.msg}
          </div>
        )}
        {error && (
          <div className="p-3.5 rounded-xl text-xs bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between">
            <span>{error.message}</span>
            <button onClick={() => refresh()} className="underline font-bold">Coba lagi</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">

          {/* Search */}
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau deskripsi program..."
              className="flex-1 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 cursor-pointer">
                Reset
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400">Memuat data program...</div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3">Nama Program</th>
                    <th className="px-4 py-3 text-right">Anggaran</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900 text-xs">{item.nama}</p>
                        {item.deskripsi && (
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{item.deskripsi}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-xs text-slate-800">
                        {rupiah(item.jumlahAnggaran)}
                      </td>
                      <td className="px-4 py-3.5 text-[10px] text-slate-500 font-mono">
                        <div>{fmt(item.tanggalMulai)}</div>
                        <div className="text-slate-400">s/d {fmt(item.tanggalSelesai)}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => { setEditTarget(item); setMode("edit"); }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          {confirmDelete === item.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDelete(item.id)} className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg cursor-pointer">Ya</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg cursor-pointer">Batal</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(item.id)} className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg cursor-pointer">
                              🗑
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-2xl">📋</p>
              <p className="text-xs font-bold text-slate-500">Belum ada program untuk periode {tahun}.</p>
              <button
                onClick={() => { setSelectedSiskeudes(null); setMode("add-step1"); }}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Tambah Program Pertama
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Add Step 1 — Pilih Siskeudes ── */}
      {mode === "add-step1" && (
        <StepPilihSiskeudes
          siskeudesList={siskeudesList}
          selected={selectedSiskeudes}
          onSelect={setSelectedSiskeudes}
          onNext={() => { if (selectedSiskeudes) setMode("add-step2"); }}
          onClose={closeAll}
        />
      )}

      {/* ── Modal: Add Step 2 — Isi Detail Program ── */}
      {mode === "add-step2" && selectedSiskeudes && (
        <StepIsiProgram
          siskeudes={selectedSiskeudes}
          onBack={() => setMode("add-step1")}
          onSave={handleAdd}
          onClose={closeAll}
        />
      )}

      {/* ── Modal: Edit Program ── */}
      {mode === "edit" && editTarget && (
        <EditProgramModal
          item={editTarget}
          onSave={handleEdit}
          onClose={closeAll}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat...</div>}>
      <ProgramPage />
    </Suspense>
  );
}