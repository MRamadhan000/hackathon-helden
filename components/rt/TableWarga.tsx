"use client";

interface Warga {
  id: string;
  nama: string;
  nik: string;
  statusDasar: string;
  bansos: string;
  statusBansos: string;
}

export default function TableWarga({ data }: { data: Warga[] }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-900">
          Daftar Kependudukan Warga RT 03
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau data keberadaan warga dan status kepesertaan jaminan sosial
          aktif.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Nama Lengkap</th>
              <th className="px-6 py-4">NIK</th>
              <th className="px-6 py-4">Keberadaan</th>
              <th className="px-6 py-4">Program Bansos</th>
              <th className="px-6 py-4">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {data.map((w) => (
              <tr key={w.id} className="hover:bg-slate-50/60 transition">
                <td className="px-6 py-4 font-bold text-slate-950">{w.nama}</td>
                <td className="px-6 py-4 font-mono text-xs tracking-wider">
                  {w.nik}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      w.statusDasar === "Mati"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {w.statusDasar}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{w.bansos}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      w.statusBansos === "Ditetapkan"
                        ? "bg-emerald-100 text-emerald-800"
                        : w.statusBansos === "Rekomendasi"
                          ? "bg-amber-100 text-amber-800"
                          : "text-slate-400 font-normal"
                    }`}
                  >
                    {w.statusBansos}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
