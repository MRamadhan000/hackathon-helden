"use client";

interface ActionGridProps {
  onSelectAction: (
    mode: "warga" | "kependudukan" | "kelayakan" | "sanggahan",
  ) => void;
  activeMode: string;
}

export default function ActionGrid({
  onSelectAction,
  activeMode,
}: ActionGridProps) {
  const cards = [
    {
      id: "warga",
      title: "Daftar Data Warga & Bansos",
      desc: "Lihat dan pantau status keberadaan warga serta jaminan sosial aktif di RT 03.",
      tag: "Master Data RT",
      tagColor: "bg-slate-100 text-slate-800 border-slate-200",
      icon: "👥",
    },
    {
      id: "kependudukan",
      title: "Pendataan Kependudukan & Mutasi",
      desc: "Kumpulkan data warga baru, perubahan domisili pindah, atau status kematian.",
      tag: "Pembaruan Data",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: "📋",
    },
    {
      id: "kelayakan",
      title: "Pengumpulan Data Kelayakan Bansos",
      desc: "Survei warga kurang mampu untuk diusulkan masuk alokasi Bansos SK Baru.",
      tag: "Verifikasi Lapangan",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: "🤝",
    },
    {
      id: "sanggahan",
      title: "Kelola Sanggahan Warga",
      desc: "Respon dan tindak lanjuti sanggahan warga terkait ketidakcocokan data penerima.",
      tag: "1 Sanggahan Masuk",
      tagColor: "bg-amber-50 text-amber-800 border-amber-200 font-bold",
      icon: "⚠️",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => {
        const isSelected = activeMode === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelectAction(c.id as any)}
            className={`text-left p-5 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
              isSelected
                ? "bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/20"
                : "bg-white text-slate-900 border-slate-200/80 hover:border-blue-500 shadow-sm hover:shadow-md"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md border ${
                    isSelected
                      ? "bg-blue-800 text-blue-100 border-blue-700"
                      : c.tagColor
                  }`}
                >
                  {c.tag}
                </span>
                <span className="text-lg">{c.icon}</span>
              </div>
              <h3 className="font-bold text-sm">{c.title}</h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isSelected ? "text-blue-100" : "text-slate-500"
                }`}
              >
                {c.desc}
              </p>
            </div>
            <div
              className={`text-[11px] font-bold inline-flex items-center gap-1 ${
                isSelected ? "text-white" : "text-blue-600"
              }`}
            >
              {isSelected ? "Sedang Dibuka ●" : "Buka Fitur Ini →"}
            </div>
          </button>
        );
      })}
    </div>
  );
}
