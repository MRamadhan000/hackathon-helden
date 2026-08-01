"use client";

export interface PendudukRT {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string; // Format YYYY-MM-DD
  statusPenduduk: "Tetap" | "Pindah" | "Meninggal";
  statusVerifikasiDukcapil: "Terverifikasi" | "Anomali / Unverified";
}

export default function TableWarga({ data }: { data: PendudukRT[] }) {
  // Fungsi menghitung usia dari tanggal lahir
  const hitungUsia = (tglLahir: string) => {
    const birthDate = new Date(tglLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Daftar Master Kependudukan Warga RT 03
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Data kependudukan terintegrasi dari entitas{" "}
            <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
              tweb_penduduk
            </code>
            .
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
          Total: {data.length} Jiwa Terdaftar
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">NIK & Nama Lengkap</th>
              <th className="px-6 py-4">L/P</th>
              <th className="px-6 py-4">TTL (Usia)</th>
              <th className="px-6 py-4">Status Penduduk</th>
              <th className="px-6 py-4">Verifikasi Dukcapil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {data.map((w) => {
              const usia = hitungUsia(w.tanggalLahir);
              return (
                <tr key={w.id} className="hover:bg-slate-50/60 transition">
                  {/* Nama & NIK */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-950 text-sm">{w.nama}</p>
                    <p className="font-mono text-xs text-slate-400 mt-0.5">
                      NIK: {w.nik}
                    </p>
                  </td>

                  {/* Jenis Kelamin */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        w.jenisKelamin === "L"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {w.jenisKelamin}
                    </span>
                  </td>

                  {/* Tempat, Tanggal Lahir & Usia */}
                  <td className="px-6 py-4 text-xs">
                    <p className="font-semibold text-slate-800">
                      {w.tempatLahir}, {w.tanggalLahir}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {usia} Tahun {usia >= 60 ? "• (Lansia)" : ""}
                    </p>
                  </td>

                  {/* Status Penduduk (Hidup/Mati/Pindah) */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        w.statusPenduduk === "Meninggal"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : w.statusPenduduk === "Pindah"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {w.statusPenduduk}
                    </span>
                  </td>

                  {/* Status Verifikasi Dukcapil */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        w.statusVerifikasiDukcapil === "Terverifikasi"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {w.statusVerifikasiDukcapil === "Terverifikasi"
                        ? "✓ Terverifikasi"
                        : "⚠️ Belum Cocok"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
