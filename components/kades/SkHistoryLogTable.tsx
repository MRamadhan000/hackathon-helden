import React from "react";

interface SkHistoryLogTableProps {
  riwayatList: any[];
  tahunPeriode: string;
  onOpenPdf: (item: any) => void;
}

export default function SkHistoryLogTable({
  riwayatList,
  tahunPeriode,
  onOpenPdf,
}: SkHistoryLogTableProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold mb-1">
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
        <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
          Total Arsip: {riwayatList?.length || 0} Berkas
        </span>
      </div>

      <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="px-5 py-3">No. Draft SK & Perihal</th>
              <th className="px-5 py-3">Pengirim (Sekdes)</th>
              <th className="px-5 py-3">Waktu Keputusan</th>
              <th className="px-5 py-3 text-center">Status Keputusan</th>
              <th className="px-5 py-3 text-right">Tinjau Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {riwayatList && riwayatList.length > 0 ? (
              riwayatList.map((hist) => (
                <tr key={hist.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono font-bold text-slate-900 block">
                      {hist.nomorDraft}
                    </span>
                    <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                      {hist.tentang}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <strong className="text-slate-900">{hist.pengusul}</strong>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap font-mono text-slate-600 text-[11px]">
                    {hist.waktuKeputusan}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {hist.statusKeputusan === "Approved" ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-extrabold text-[10px] rounded-full">
                        ✕ Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenPdf(hist)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition cursor-pointer text-xs"
                    >
                      📄 Buka PDF / Detail
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
                  Belum ada riwayat SK yang diverifikasi pada periode tahun{" "}
                  {tahunPeriode}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
