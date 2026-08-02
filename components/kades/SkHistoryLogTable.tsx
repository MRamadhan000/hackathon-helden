"use client";

import React from "react";

interface SkItem {
  id: string;
  nomorDraft: string;
  tentang: string;
  pengusul: string;
  waktuKeputusan: string;
  statusKeputusan: "Approved" | "Rejected";
  catatan?: string;
  jumlahKpm?: number;
  totalNominal?: string;
  daftarKpm?: any[];
}

interface SkHistoryLogTableProps {
  riwayatList: SkItem[];
  tahunPeriode: string;
  onOpenPdf: (item: SkItem) => void;
}

export default function SkHistoryLogTable({
  riwayatList,
  tahunPeriode,
  onOpenPdf,
}: SkHistoryLogTableProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold mb-1">
            📂 Audit Trail & Arsip Digital
          </div>
          <h3 className="text-base font-bold text-slate-950">
            Riwayat Log Persetujuan & Keputusan SK Bansos ({tahunPeriode})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Arsip berkas SK yang telah diverifikasi (Approved / Rejected) untuk
            ditinjau kembali atau dicetak ke Siskeudes.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
          Total Arsip: {riwayatList.length} Berkas
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3">No. Draft SK & Perihal</th>
              <th className="p-3">Pengirim (Sekdes)</th>
              <th className="p-3">Waktu Keputusan</th>
              <th className="p-3 text-center">Status Keputusan</th>
              <th className="p-3 text-right">Tinjau Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {riwayatList.length > 0 ? (
              riwayatList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3">
                    <span className="font-mono font-bold text-blue-900 block">
                      {item.nomorDraft}
                    </span>
                    <span className="text-[11px] text-slate-800 font-bold block mt-0.5">
                      {item.tentang}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                    {item.pengusul}
                  </td>
                  <td className="p-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                    {item.waktuKeputusan}
                  </td>
                  <td className="p-3 text-center whitespace-nowrap">
                    {item.statusKeputusan === "Approved" ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-extrabold text-[10px] rounded-full">
                        ✕ Rejected
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {item.statusKeputusan === "Approved" ? (
                      <button
                        onClick={() => onOpenPdf(item)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <span>🖨️</span>
                        <span>Buka PDF Resmi</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenPdf(item)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <span>📄</span>
                        <span>Lihat Catatan Revisi</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-slate-400 text-xs"
                >
                  Belum ada log keputusan SK pada periode tahun {tahunPeriode}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
