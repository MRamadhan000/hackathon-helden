"use client";

export default function StatSection() {
  const stats = [
    { label: "Total Warga Terdata", val: "3.412 Jiwa" },
    { label: "Jumlah Kepala Keluarga", val: "984 Keluarga" },
    { label: "Penerima Manfaat Aktif", val: "245 Warga" },
    { label: "Metode Sinkronisasi", val: "Otomatis RT" },
  ];

  return (
    <section
      id="statistik"
      className="bg-slate-100/60 border-y border-slate-200/60 py-16"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-10 text-center lg:text-left">
          <h3 className="text-xl font-bold text-slate-950">
            Statistik Makro Kependudukan Desa
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Data agregat publik yang diperbarui secara berkala oleh tim
            administrasi desa.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm"
            >
              <span className="text-xs text-slate-500 font-semibold">
                {item.label}
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
