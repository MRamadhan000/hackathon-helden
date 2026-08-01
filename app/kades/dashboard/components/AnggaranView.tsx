"use client";

// 1. Definisikan interface props agar TypeScript tidak error
interface AnggaranViewProps {
  mockWilayahData: any[];
}

// 2. Terima mockWilayahData sebagai argument fungsi komponen
export default function AnggaranView({ mockWilayahData }: AnggaranViewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
        Distribusi Plafon Anggaran Dana Desa per RT
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockWilayahData.map((rt) => (
          <div
            key={rt.id}
            className="bg-white p-5 border border-slate-200 rounded-2xl shadow-2xs flex justify-between items-center"
          >
            <h4 className="font-bold text-slate-900 text-sm">{rt.nama}</h4>
            <span className="text-blue-600 font-black text-sm">
              Rp {rt.anggaran.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
