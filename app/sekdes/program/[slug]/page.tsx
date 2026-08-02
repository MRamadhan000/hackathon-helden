"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePenerima } from "@/hooks/operational/usePenerima";
import { getProgramById } from "@/services/operational/program.service";
import { getPendudukList } from "@/services/core/penduduk.service";
import { getClusterDesa } from "@/services/core/clusterDesa.service";
import type { Penerima, StatusPenerima, CreatePenerimaRequest } from "@/types/penerima";
import type { Program } from "@/types/program";
import type { Penduduk } from "@/types/penduduk";
import type { ClusterDesa } from "@/types/clusterDesa";

/* ─── helpers ─── */
function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(n);
}
function fmt(v?: string | null) {
  if (!v) return "-";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_META: Record<StatusPenerima, { label: string; cls: string; dot: string }> = {
  PENDING:     { label: "Belum Diterima", cls: "bg-amber-50 text-amber-800 border-amber-200",   dot: "bg-amber-400" },
  APPROVED:    { label: "Disetujui",      cls: "bg-blue-50 text-blue-800 border-blue-200",      dot: "bg-blue-500" },
  REJECTED:    { label: "Ditolak",        cls: "bg-rose-50 text-rose-800 border-rose-200",      dot: "bg-rose-400" },
  DISTRIBUTED: { label: "Selesai dibagikan", cls: "bg-emerald-50 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
};

/* ═══════════════════════════════════════════════
   PROGRAM DETAIL CARD
═══════════════════════════════════════════════ */
function ProgramCard({
  program,
  stats,
}: {
  program: Program;
  stats: { total: number; pending: number; approved: number; distributed: number; rejected: number };
}) {
  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden">
      <div className="bg-indigo-600 px-6 py-5 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5">Program</p>
          <h1 className="text-base font-extrabold text-white leading-snug">{program.nama}</h1>
          {program.deskripsi && (
            <p className="text-[11px] text-indigo-200 mt-0.5 line-clamp-2">{program.deskripsi}</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
        {[
          { label: "Total Penerima", value: stats.total,       cls: "text-slate-900" },
          { label: "Menunggu",       value: stats.pending,     cls: "text-amber-700" },
          { label: "Disetujui",      value: stats.approved,    cls: "text-blue-700" },
          { label: "Disalurkan",     value: stats.distributed, cls: "text-emerald-700" },
          { label: "Ditolak",        value: stats.rejected,    cls: "text-rose-600" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 text-center">
            <p className={`text-xl font-black ${s.cls}`}>{s.value}</p>
            <p className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] font-medium text-slate-500">
        <span>💰 Anggaran: <strong className="text-slate-900">{rupiah(program.jumlahAnggaran)}</strong></span>
        <span>📅 {fmt(program.tanggalMulai)} – {fmt(program.tanggalSelesai)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TAMBAH PENERIMA MODAL
═══════════════════════════════════════════════ */
function TambahPenerimaModal({
  pendudukList,
  areaList,
  loading,
  onSave,
  onClose,
}: {
  pendudukList: Penduduk[];
  areaList: ClusterDesa[];
  loading: boolean;
  onSave: (form: { pendudukId: string; areaLocationId: string; nominal: number; catatan: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [selectedPenduduk, setSelectedPenduduk] = useState<Penduduk | null>(null);
  const [selectedArea, setSelectedArea] = useState<ClusterDesa | null>(null);
  const [nominal, setNominal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [pendudukSearch, setPendudukSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const filteredPenduduk = useMemo(() => {
    if (!pendudukSearch.trim()) return pendudukList.slice(0, 30);
    const q = pendudukSearch.toLowerCase();
    return pendudukList.filter(
      (p) => p.nama.toLowerCase().includes(q) || p.nik.includes(q)
    ).slice(0, 30);
  }, [pendudukList, pendudukSearch]);

  const filteredArea = useMemo(() => {
    if (!areaSearch.trim()) return areaList;
    const q = areaSearch.toLowerCase();
    return areaList.filter(
      (a) => a.nama.toLowerCase().includes(q) || a.jenis.toLowerCase().includes(q)
    );
  }, [areaList, areaSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPenduduk) { setErr("Pilih penduduk penerima."); return; }
    if (!selectedArea) { setErr("Pilih wilayah / area."); return; }
    setSaving(true);
    try {
      await onSave({
        pendudukId: selectedPenduduk.id,
        areaLocationId: selectedArea.id,
        nominal: Number(nominal) || 0,
        catatan,
      });
      onClose();
    } catch (ex) {
      setErr((ex as Error).message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h3 className="text-sm font-extrabold text-slate-900">Tambah Penerima</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {err && <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">⚠️ {err}</p>}

          {loading ? (
            <p className="text-center text-xs text-slate-400 py-8">Memuat master data...</p>
          ) : (
            <>
              {/* Pilih Penduduk */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Penduduk Penerima *</label>
                {selectedPenduduk ? (
                  <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-xs font-bold text-indigo-900">{selectedPenduduk.nama}</p>
                      <p className="text-[9px] font-mono text-indigo-400">NIK: {selectedPenduduk.nik}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedPenduduk(null)} className="text-xs font-bold text-indigo-500 hover:text-rose-600">✕ Ganti</button>
                  </div>
                ) : (
                  <>
                    <input value={pendudukSearch} onChange={(e) => setPendudukSearch(e.target.value)}
                      placeholder="Cari nama atau NIK penduduk..."
                      className="w-full text-black bg-slate-50 border border-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 mb-1.5" />
                    {filteredPenduduk.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner max-h-36 overflow-y-auto divide-y divide-slate-100">
                        {filteredPenduduk.map((p) => (
                          <button key={p.id} type="button" onClick={() => { setSelectedPenduduk(p); setPendudukSearch(""); }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs flex justify-between items-center transition cursor-pointer">
                            <div>
                              <p className="font-bold text-slate-900">{p.nama}</p>
                              <p className="text-[10px] font-mono text-slate-400">NIK: {p.nik}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pilih Area */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Wilayah / Lokasi *</label>
                {selectedArea ? (
                  <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-xs font-bold text-violet-900">{selectedArea.nama}</p>
                      <p className="text-[9px] text-violet-400">{selectedArea.jenis}</p>
                    </div>
                    <button type="button" onClick={() => setSelectedArea(null)} className="text-xs font-bold text-violet-500 hover:text-rose-600">✕ Ganti</button>
                  </div>
                ) : (
                  <>
                    <input value={areaSearch} onChange={(e) => setAreaSearch(e.target.value)}
                      placeholder="Cari wilayah / RT / RW..."
                      className="w-full text-black bg-slate-50 border border-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 mb-1.5" />
                    {filteredArea.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-inner max-h-36 overflow-y-auto divide-y divide-slate-100">
                        {filteredArea.map((a) => (
                          <button key={a.id} type="button" onClick={() => { setSelectedArea(a); setAreaSearch(""); }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 text-xs flex justify-between items-center transition cursor-pointer">
                            <span className="font-bold text-slate-800">{a.nama}</span>
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{a.jenis}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nominal (Bantuan/Lainnya) *</label>
                <input type="number" min="0" step="1000" value={nominal} onChange={(e) => setNominal(e.target.value)} required
                  placeholder="mis: 300000"
                  className="w-full text-black bg-slate-50 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400" />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Catatan</label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2}
                  placeholder="Keterangan opsional..."
                  className="w-full text-black bg-slate-50 border border-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 resize-none" />
              </div>

              <div className="flex gap-2 pt-1 border-t border-slate-100 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Batal</button>
                <button type="submit" disabled={saving || !selectedPenduduk || !selectedArea || !nominal} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer">
                  {saving ? "Menyimpan..." : "Tambah Penerima"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL DRAWER / PANEL
═══════════════════════════════════════════════ */
function PenerimaDrawer({
  item,
  onClose,
  onUbahStatus,
  onHapus,
}: {
  item: Penerima;
  onClose: () => void;
  onUbahStatus: (id: string, status: StatusPenerima, catatan?: string) => void;
  onHapus: (id: string) => void;
}) {
  const [catatan, setCatatan] = useState(item.catatan ?? "");
  const [confirming, setConfirming] = useState(false);
  const meta = STATUS_META[item.status];

  const nextStatuses: { status: StatusPenerima; label: string; cls: string }[] =
    item.status === "PENDING"
      ? [
          { status: "APPROVED", label: "✓ Setujui", cls: "bg-blue-600 hover:bg-blue-700 text-white" },
          { status: "REJECTED", label: "✕ Tolak",   cls: "bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200" },
        ]
      : item.status === "APPROVED"
      ? [{ status: "DISTRIBUTED", label: "📦 Bagikan & Selesaikan", cls: "bg-emerald-600 hover:bg-emerald-700 text-white" }]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full md:w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Detail Penerima</p>
            <h3 className="text-sm font-extrabold text-slate-950 mt-0.5">ID Penduduk: {item.pendudukId}</h3>
            {item.nominal != null && (
              <p className="text-xs font-bold text-indigo-650 mt-0.5">Nominal: {rupiah(item.nominal)}</p>
            )}
            <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded border ${meta.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer font-bold">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
          <section className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {[
              ["ID Wilayah",      item.areaLocationId],
              ["Ditambahkan",    fmt(item.createdAt)],
              ["Terakhir Update",fmt(item.updatedAt)],
            ].map(([k, v]) => (
              <div key={k} className="px-4 py-2.5 flex justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">{k}</span>
                <span className="font-bold text-slate-800 text-right">{v}</span>
              </div>
            ))}
          </section>

          {item.catatan && (
            <section>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">Catatan</p>
              <p className="text-slate-700 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 leading-relaxed">{item.catatan}</p>
            </section>
          )}

          {nextStatuses.length > 0 && (
            <section className="space-y-3 pt-1 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase text-slate-500 pt-2">Ubah Status</p>
              <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2}
                placeholder="Catatan (opsional)..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-400 resize-none" />
              <div className="flex gap-2">
                {nextStatuses.map((s) => (
                  <button key={s.status} onClick={() => onUbahStatus(item.id, s.status, catatan)}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition ${s.cls}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {item.status === "PENDING" && (
            <section className="flex gap-2 pt-1">
              {!confirming ? (
                <button onClick={() => setConfirming(true)} className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 cursor-pointer">
                  🗑 Hapus Penerima
                </button>
              ) : (
                <div className="flex-1 flex gap-1">
                  <button onClick={() => onHapus(item.id)} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer">Ya, Hapus</button>
                  <button onClick={() => setConfirming(false)} className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Batal</button>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer">Tutup</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
function PagePenerimaByProgram() {
  const params = useParams<{ slug: string }>();
  const programId = params.slug; // slug = program ID
  const searchParams = useSearchParams();
  const tahun = searchParams.get("tahun") || "2026";
  const { user } = useAuth();

  // Fetch program detail by ID (slug)
  const [program, setProgram] = useState<Program | null>(null);
  const [progLoading, setProgLoading] = useState(true);
  const [progError, setProgError] = useState<string | null>(null);

  // Master Data
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([]);
  const [areaList, setAreaList] = useState<ClusterDesa[]>([]);
  const [masterLoading, setMasterLoading] = useState(false);

  useEffect(() => {
    if (!programId) return;
    setProgLoading(true);
    getProgramById(programId)
      .then((p) => {
        if (!p) setProgError("Program tidak ditemukan.");
        else setProgram(p);
      })
      .catch((e) => setProgError(e.message))
      .finally(() => setProgLoading(false));
  }, [programId]);

  // Fetch master data untuk dropdown
  const loadMasterData = async () => {
    setMasterLoading(true);
    try {
      const [p, a] = await Promise.all([getPendudukList(), getClusterDesa()]);
      setPendudukList(p);
      setAreaList(a);
    } catch (e) {}
    setMasterLoading(false);
  };

  // Fetch penerima filtered by programId
  const { data, stats, isLoading, error, tambah, ubahStatus, hapus, refresh } = usePenerima(
    programId ? { programId } : undefined
  );

  const [showTambah, setShowTambah] = useState(false);
  const [selected, setSelected] = useState<Penerima | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusPenerima | "SEMUA">("SEMUA");
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const filtered = useMemo(() => {
    let list = data;
    if (filterStatus !== "SEMUA") list = list.filter((d) => d.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => (d.pendudukId ?? "").toLowerCase().includes(q));
    }
    return list;
  }, [data, filterStatus, search]);

  const showNotif = (type: "ok" | "err", msg: string) => {
    setNotif({ type, msg });
    setTimeout(() => setNotif(null), 4000);
  };

  const handleTambah = async (form: { pendudukId: string; areaLocationId: string; nominal: number; catatan: string }) => {
    if (!user?.id) throw new Error("Sesi tidak ditemukan, silakan login ulang.");
    await tambah({
      programId,
      pendudukId: form.pendudukId,
      areaLocationId: form.areaLocationId,
      nominal: form.nominal,
      createdBy: user.id,
      catatan: form.catatan || null,
    } as CreatePenerimaRequest);
    showNotif("ok", "Penerima berhasil ditambahkan.");
  };

  const handleUbahStatus = async (id: string, status: StatusPenerima, catatan?: string) => {
    try {
      await ubahStatus(id, { status, catatan: catatan || null });
      showNotif("ok", `Status berhasil diubah ke ${STATUS_META[status].label}.`);
      setSelected(null);
    } catch (e) { showNotif("err", (e as Error).message); }
  };

  const handleHapus = async (id: string) => {
    try {
      await hapus(id);
      showNotif("ok", "Penerima berhasil dihapus.");
      setSelected(null);
    } catch (e) { showNotif("err", (e as Error).message); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Top nav */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            href={`/sekdes/program`}
            className="text-xs font-bold text-slate-700 hover:text-indigo-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition"
          >
            ← Daftar Program
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Periode: <strong>{tahun}</strong>
          </span>
        </div>

        {/* Notif */}
        {notif && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
            notif.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
          }`}>
            {notif.msg}
          </div>
        )}

        {/* Program card */}
        {progLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-400 animate-pulse">
            Memuat detail program...
          </div>
        ) : progError ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-2">
            <p className="text-2xl">⚠️</p>
            <p className="text-xs font-bold text-rose-700">{progError}</p>
            <Link href="/sekdes/program" className="text-xs font-bold text-indigo-600 hover:underline">← Kembali ke daftar program</Link>
          </div>
        ) : program ? (
          <ProgramCard program={program} stats={stats} />
        ) : null}

        {/* Penerima table card */}
        {!progLoading && !progError && program && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                {(["SEMUA", "PENDING", "APPROVED", "DISTRIBUTED", "REJECTED"] as const).map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                      filterStatus === s ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"
                    }`}>
                    {s === "SEMUA" ? "Semua" : STATUS_META[s].label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ID penduduk..."
                  className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:border-indigo-400 w-44"
                />
                <button
                  onClick={() => { loadMasterData(); setShowTambah(true); }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap"
                >
                  + Tambah Penerima
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between">
                <span>{error.message}</span>
                <button onClick={() => refresh({ programId })} className="underline font-bold">Coba lagi</button>
              </div>
            )}

            {/* Table */}
            {isLoading ? (
              <div className="py-16 text-center text-sm text-slate-400">Memuat data penerima...</div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-3">ID Penerima (Penduduk)</th>
                      <th className="px-4 py-3">ID Wilayah</th>
                      <th className="px-4 py-3 text-right">Nominal</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => {
                      const meta = STATUS_META[item.status];
                      const needsAction = item.status === "PENDING";
                      return (
                        <tr key={item.id} className={`hover:bg-slate-50/70 transition ${needsAction ? "bg-amber-50/20" : ""}`}>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-slate-900 text-xs">{item.pendudukId}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{fmt(item.createdAt)}</p>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">{item.areaLocationId}</td>
                          <td className="px-4 py-3.5 text-right font-mono font-bold text-xs text-slate-800">
                            {item.nominal != null ? rupiah(item.nominal) : "-"}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${meta.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setSelected(item)}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                                needsAction
                                  ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                                  : "text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100"
                              }`}
                            >
                              {needsAction ? "Tinjau →" : "Detail"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2">
                <p className="text-2xl">👥</p>
                <p className="text-xs font-bold text-slate-500">
                  {filterStatus !== "SEMUA"
                    ? `Tidak ada penerima dengan status "${STATUS_META[filterStatus].label}".`
                    : "Belum ada penerima untuk program ini."}
                </p>
                {filterStatus === "SEMUA" && (
                  <button onClick={() => { loadMasterData(); setShowTambah(true); }} className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer">
                    + Tambah Penerima Pertama
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showTambah && (
        <TambahPenerimaModal
          pendudukList={pendudukList}
          areaList={areaList}
          loading={masterLoading}
          onSave={handleTambah}
          onClose={() => setShowTambah(false)}
        />
      )}

      {selected && (
        <PenerimaDrawer
          item={selected}
          onClose={() => setSelected(null)}
          onUbahStatus={handleUbahStatus}
          onHapus={handleHapus}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Memuat...</div>}>
      <PagePenerimaByProgram />
    </Suspense>
  );
}
