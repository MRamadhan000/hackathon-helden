"use client";

interface TrenDetailViewProps {
  selectedTahunData: any;
}

export default function TrenDetailView({
  selectedTahunData,
}: TrenDetailViewProps) {
  if (!selectedTahunData) return null;
  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
        Sebaran Data Demografi Penduduk Per RT — Tahun {selectedTahunData.tahun}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedTahunData.breakdownRT.map((rt: any, i: number) => (
          <div
            key={i}
            className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{rt.nama}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Jumlah riwayat kependudukan tercatat.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-sm font-black px-3 py-1.5 rounded-xl">
              {rt.jumlah} Jiwa
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
