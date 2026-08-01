"use client";

import Link from "next/link";

export default function BudgetSection() {
  return (
    <section id="anggaran" className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold tracking-wide">
            📊 Anggaran Terbuka (SISKEUDES)
          </div>
          <h3 className="text-2xl font-bold text-slate-950 tracking-tight">
            Realisasi & Alokasi Pembiayaan Anggaran Desa
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Seluruh rekapitulasi pengeluaran dan pemasukan dana desa
            dipublikasikan secara transparan setelah melalui validasi menyeluruh
            oleh Sekretaris Desa.
          </p>

          <div className="pt-2">
            <Link
              href="/siskeudes"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition"
            >
              Buka Detail Laporan Siskeudes →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Kategori Pos Pembiayaan</th>
                <th className="px-6 py-4">Plafon Rencana</th>
                <th className="px-6 py-4">Realisasi Penyaluran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="px-6 py-4 font-bold text-slate-950">
                  Perlindungan Sosial (Bansos)
                </td>
                <td className="px-6 py-4">Rp 360.000.000</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">
                  Rp 270.000.000
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-950">
                  Operasional Aparatur Desa (ADD)
                </td>
                <td className="px-6 py-4">Rp 280.000.000</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">
                  Rp 210.000.000
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-slate-950">
                  Pembangunan Infrastruktur Fisik
                </td>
                <td className="px-6 py-4">Rp 450.000.000</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">
                  Rp 320.000.000
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
