"use client";

interface Sanggahan {
  id: string;
  nama: string;
  nik: string;
  alasan: string;
  status: string;
}

interface CardSanggahanProps {
  sanggahanList: Sanggahan[];
  onVerifikasi: (nama: string, nik: string) => void;
}

export default function CardSanggahan({
  sanggahanList,
  onVerifikasi,
}: CardSanggahanProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900">
          Sanggahan Masuk dari Warga
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Lakukan verifikasi lapangan ulang secara fisik sebelum meneruskan
          laporan ke Sekretaris Desa.
        </p>
      </div>

      {sanggahanList.map((s) => (
        <div
          key={s.id}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-950 text-base">{s.nama}</h4>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                NIK: {s.nik}
              </p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
              Status: {s.status}
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
            <strong>Isi Sanggahan Warga:</strong> "{s.alasan}"
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => onVerifikasi(s.nama, s.nik)}
              className="px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              Verifikasi Lapangan & Laporkan ke Sekdes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
