"use client";

interface BansosViewProps {
  mockWilayahData: any[];
}

export default function BansosView({ mockWilayahData }: BansosViewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
        Daftar Warga Penerima Manfaat Bantuan Sosial
      </h3>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold">
              <th className="p-4">Nama Warga</th>
              <th className="p-4">NIK</th>
              <th className="p-4">Wilayah</th>
              <th className="p-4 text-right">Bantuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {mockWilayahData.flatMap((rt) =>
              rt.keluarga.flatMap((kk: any) =>
                kk.anggota
                  .filter((a: any) => a.bansos !== "-")
                  .map((anggota: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-4 text-slate-900 font-bold">
                        {anggota.nama}
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {anggota.nik}
                      </td>
                      <td className="p-4 text-slate-600">{rt.nama}</td>
                      <td className="p-4 text-right font-bold text-amber-600">
                        {anggota.bansos}
                      </td>
                    </tr>
                  )),
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
