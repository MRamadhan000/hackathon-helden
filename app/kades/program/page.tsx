"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import {
  getBansosPrograms,
  getPenerimaBansosApproved,
  formatRupiah,
  type BansosProgram,
  type PenerimaBansos,
} from "@/services/operational/bansos.service";

// ─── PDF Generator (browser-native via print) ───────────────────────────────
function generateSkPdf(
  program: BansosProgram,
  penerima: PenerimaBansos[],
  nomorSk: string,
  namaDesa: string,
  namaKades: string
) {
  const tanggalSk = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows = penerima
    .map(
      (p, i) => `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:8px 12px;text-align:center;font-weight:700;color:#64748b;">${i + 1}</td>
        <td style="padding:8px 12px;">
          <div style="font-weight:700;color:#0f172a;">${p.nama}</div>
          <div style="font-size:11px;color:#94a3b8;font-family:monospace;">NIK: ${p.nik}</div>
        </td>
        <td style="padding:8px 12px;text-align:center;font-family:monospace;font-weight:700;color:#92400e;">${p.skor} pts</td>
        <td style="padding:8px 12px;font-size:11px;color:#475569;">${p.kategori}</td>
        <td style="padding:8px 12px;text-align:right;font-family:monospace;font-weight:700;color:#166534;">
          ${p.nominal != null ? formatRupiah(p.nominal) : "-"}
        </td>
        <td style="padding:8px 12px;text-align:center;">
          <span style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;">APPROVED</span>
        </td>
      </tr>
    `
    )
    .join("");

  const totalNominal = penerima.reduce((a, b) => a + (b.nominal ?? 0), 0);

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8"/>
      <title>SK Bansos - ${program.nama}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',Arial,sans-serif; font-size:13px; color:#0f172a; background:#fff; }
        .page { padding:40px 48px; max-width:900px; margin:0 auto; }
        .header { text-align:center; border-bottom:3px double #1e40af; padding-bottom:20px; margin-bottom:24px; }
        .logo-area { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:12px; }
        .logo-circle { width:64px; height:64px; background:#1e40af; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:28px; }
        .title-block h1 { font-size:18px; font-weight:800; color:#1e40af; letter-spacing:0.5px; }
        .title-block p { font-size:12px; color:#64748b; }
        .sk-title { font-size:15px; font-weight:700; text-align:center; margin-bottom:6px; text-transform:uppercase; letter-spacing:1px; }
        .sk-nomor { font-size:13px; text-align:center; color:#1e40af; font-family:monospace; font-weight:700; margin-bottom:20px; }
        .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; }
        .info-item label { font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; display:block; margin-bottom:2px; }
        .info-item span { font-size:13px; font-weight:600; color:#0f172a; }
        .preamble { margin-bottom:20px; line-height:1.7; font-size:12px; color:#334155; }
        table { width:100%; border-collapse:collapse; }
        thead tr { background:#1e40af; color:#fff; }
        thead th { padding:10px 12px; font-size:11px; font-weight:700; text-align:left; }
        .footer { margin-top:32px; display:flex; justify-content:flex-end; }
        .ttd-block { text-align:center; min-width:200px; }
        .ttd-block p { font-size:12px; margin-bottom:4px; }
        .ttd-block .space { height:64px; }
        .ttd-block .nama { font-weight:800; border-top:2px solid #0f172a; padding-top:4px; font-size:13px; }
        .summary-row { background:#f1f5f9; }
        .summary-row td { padding:10px 12px; font-weight:800; font-size:13px; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="logo-area">
            <div class="logo-circle">🏛️</div>
            <div class="title-block">
              <h1>PEMERINTAH DESA ${namaDesa.toUpperCase()}</h1>
              <p>Kecamatan — Kabupaten — Provinsi</p>
            </div>
          </div>
        </div>

        <div class="sk-title">Surat Keputusan Kepala Desa</div>
        <div class="sk-title" style="font-size:14px;margin-bottom:4px;">Tentang Penetapan Penerima Bantuan Sosial</div>
        <div class="sk-nomor">Nomor: ${nomorSk}</div>

        <div class="info-grid">
          <div class="info-item">
            <label>Program</label>
            <span>${program.nama}</span>
          </div>
          <div class="info-item">
            <label>Tanggal SK</label>
            <span>${tanggalSk}</span>
          </div>
          <div class="info-item">
            <label>Total Penerima</label>
            <span>${penerima.length} Jiwa / KPM</span>
          </div>
          <div class="info-item">
            <label>Total Alokasi Bantuan</label>
            <span>${formatRupiah(totalNominal)}</span>
          </div>
          <div class="info-item">
            <label>Periode Program</label>
            <span>${new Date(program.tanggalMulai).toLocaleDateString("id-ID")} – ${new Date(program.tanggalSelesai).toLocaleDateString("id-ID")}</span>
          </div>
          <div class="info-item">
            <label>Anggaran Program</label>
            <span>${formatRupiah(program.jumlahAnggaran)}</span>
          </div>
        </div>

        <p class="preamble">
          Menimbang bahwa berdasarkan hasil survei dan penilaian kelayakan yang telah dilakukan oleh perangkat desa
          serta berdasarkan data yang tersedia pada sistem informasi desa, maka ditetapkan daftar penerima bantuan
          sosial program <strong>${program.nama}</strong> sebagaimana tercantum dalam lampiran surat keputusan ini.
        </p>

        <table>
          <thead>
            <tr>
              <th style="text-align:center;width:40px;">No</th>
              <th>Nama & NIK</th>
              <th style="text-align:center;width:80px;">Skor DDK</th>
              <th style="width:160px;">Kategori Kelayakan</th>
              <th style="text-align:right;width:140px;">Nominal Bantuan</th>
              <th style="text-align:center;width:90px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="summary-row">
              <td colspan="4" style="text-align:right;color:#1e40af;">Total Alokasi Seluruh Penerima:</td>
              <td style="text-align:right;color:#166534;font-family:monospace;">${formatRupiah(totalNominal)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div class="ttd-block">
            <p>${namaDesa}, ${tanggalSk}</p>
            <p>Kepala Desa ${namaDesa}</p>
            <div class="space"></div>
            <div class="nama">${namaKades}</div>
          </div>
        </div>
      </div>
      <script>window.onload = () => { window.print(); }</script>
    </body>
    </html>
  `;

  const win = window.open("", "_blank", "width=900,height=700");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ─── PROGRAM CARD ─────────────────────────────────────────────────────────────
function ProgramCard({
  prog,
  onExport,
}: {
  prog: BansosProgram;
  onExport: (prog: BansosProgram) => void;
}) {
  const mulai = new Date(prog.tanggalMulai).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const selesai = new Date(prog.tanggalSelesai).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold uppercase mb-1.5">
              🏷️ Program Bansos
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 truncate">
              {prog.nama}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
              {prog.deskripsi || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
            <div className="text-base font-black text-emerald-800 font-mono">
              {prog.jumlahPenerima}
            </div>
            <div className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">
              Penerima
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-center">
            <div className="text-[11px] font-black text-amber-800 font-mono leading-tight">
              {formatRupiah(prog.totalNominal).replace("Rp\u00a0", "Rp ")}
            </div>
            <div className="text-[9px] font-bold text-amber-600 uppercase mt-0.5">
              Total Alokasi
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-center">
            <div className="text-[11px] font-black text-blue-800 font-mono leading-tight">
              {formatRupiah(prog.jumlahAnggaran).replace("Rp\u00a0", "Rp ")}
            </div>
            <div className="text-[9px] font-bold text-blue-600 uppercase mt-0.5">
              Anggaran
            </div>
          </div>
        </div>

        {/* Period */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
          <span>📅</span>
          <span>
            {mulai} – {selesai}
          </span>
        </div>

        {/* SK Number */}
        <div className="flex items-center gap-2 text-[11px] text-indigo-700 font-mono font-bold bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
          <span>📄</span>
          <span>{prog.nomorSk}</span>
        </div>

        {/* Actions */}
        <div className="pt-1 flex gap-2">
          <button
            id={`btn-export-sk-${prog.id}`}
            onClick={() => onExport(prog)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl cursor-pointer transition-all duration-150 shadow-sm hover:shadow-indigo-200/80 hover:shadow-md"
          >
            <span>📄</span> Export SK PDF
          </button>
          <Link
            href={`/sekdes/program/${prog.id}`}
            className="px-3 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 font-bold text-[11px] rounded-xl transition-all duration-150 flex items-center gap-1"
          >
            Penerima →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL PREVIEW PENERIMA + EXPORT ─────────────────────────────────────────
function ExportModal({
  program,
  onClose,
}: {
  program: BansosProgram;
  onClose: () => void;
}) {
  const [penerima, setPenerima] = useState<PenerimaBansos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [namaDesa, setNamaDesa] = useState("Sumberjo");
  const [namaKades, setNamaKades] = useState("Kepala Desa");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPenerimaBansosApproved(program.id)
      .then((data) => {
        setPenerima(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [program.id]);

  const handleExport = () => {
    setExporting(true);
    try {
      generateSkPdf(
        program,
        penerima,
        program.nomorSk ?? "SK/BANSOS/2026/XXX",
        namaDesa,
        namaKades
      );
    } finally {
      setTimeout(() => setExporting(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block mb-0.5">
              Export Surat Keputusan
            </span>
            <h3 className="text-base font-black text-white">{program.nama}</h3>
            <p className="text-[11px] text-indigo-200 font-mono mt-0.5">
              {program.nomorSk}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm flex items-center justify-center cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Config */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
            Konfigurasi Dokumen SK
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Nama Desa
              </label>
              <input
                value={namaDesa}
                onChange={(e) => setNamaDesa(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                placeholder="Nama Desa"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                Nama Kepala Desa
              </label>
              <input
                value={namaKades}
                onChange={(e) => setNamaKades(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                placeholder="Nama Kepala Desa"
              />
            </div>
          </div>
        </div>

        {/* Penerima List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400 animate-pulse">
              ⏳ Memuat daftar penerima APPROVED...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-xs text-red-500">
              ⚠️ Gagal memuat data: {error}
            </div>
          ) : penerima.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-xs font-bold text-slate-600">
                Belum ada penerima yang berstatus APPROVED
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Pastikan data survei kelayakan sudah disetujui di menu Sekdes
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="px-5 pt-3 pb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600">
                  {penerima.length} Penerima Terverifikasi (APPROVED)
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Total:{" "}
                  {formatRupiah(
                    penerima.reduce((a, b) => a + (b.nominal ?? 0), 0)
                  )}
                </span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3">No</th>
                    <th className="px-5 py-3">Nama & NIK</th>
                    <th className="px-5 py-3 text-center">Skor</th>
                    <th className="px-5 py-3">Kategori</th>
                    <th className="px-5 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {penerima.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-bold text-slate-900">{p.nama}</p>
                        <p className="font-mono text-[10px] text-slate-400">
                          {p.nik}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-center font-mono font-bold text-amber-800">
                        {p.skor}
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-[11px]">
                        {p.kategori}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-emerald-800">
                        {p.nominal != null ? formatRupiah(p.nominal) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-100 transition"
          >
            Batal
          </button>
          <button
            id="btn-cetak-sk"
            onClick={handleExport}
            disabled={exporting || loading || penerima.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
          >
            {exporting ? (
              <>⏳ Membuka PDF...</>
            ) : (
              <>📄 Cetak / Download SK PDF</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function KadesProgramContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const [programs, setPrograms] = useState<BansosProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<BansosProgram | null>(
    null
  );

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBansosPrograms()
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filtered = programs.filter(
    (p) =>
      search === "" ||
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      (p.deskripsi ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPenerima = programs.reduce((a, b) => a + b.jumlahPenerima, 0);
  const totalAlokasi = programs.reduce((a, b) => a + b.totalNominal, 0);
  const totalAnggaran = programs.reduce((a, b) => a + b.jumlahAnggaran, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      <KadesHeader tahunPeriode={tahunPeriode} setTahunPeriode={() => {}} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* NAVIGASI & TITLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Link
              href={`/kades/dashboard?tahun=${tahunPeriode}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition mb-2"
            >
              ← Kembali ke Dashboard Kades
            </Link>
            <h2 className="text-xl font-extrabold text-slate-950">
              📋 Program Bansos & Ekspor SK Kades
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar program bantuan sosial desa beserta fitur ekspor Surat
              Keputusan (SK) berformat PDF.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode: <strong>{tahunPeriode}</strong>
          </span>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
              📋
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-900">
                {programs.length}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Total Program
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shrink-0">
              👥
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-900">
                {totalPenerima.toLocaleString("id-ID")}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Total KPM Approved
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0">
              💰
            </div>
            <div>
              <div className="text-lg font-black text-amber-900 leading-tight">
                {formatRupiah(totalAlokasi)}
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Total Alokasi Tersalur
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3">
          <span className="text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Cari nama program atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕ Hapus
            </button>
          )}
        </div>

        {/* PROGRAM GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm font-bold text-red-600">Gagal memuat data program</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm font-bold text-slate-600">
              {search ? "Tidak ada program yang cocok" : "Belum ada program Bansos"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {search
                ? `Tidak ditemukan program untuk pencarian "${search}"`
                : "Program dapat ditambahkan melalui halaman Sekdes → Program"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((prog) => (
              <ProgramCard
                key={prog.id}
                prog={prog}
                onExport={(p) => setSelectedProgram(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* EXPORT MODAL */}
      {selectedProgram && (
        <ExportModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
}

export default function KadesProgramPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Program Bansos...
        </div>
      }
    >
      <KadesProgramContent />
    </Suspense>
  );
}
