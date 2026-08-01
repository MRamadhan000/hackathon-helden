"use client";

import React from "react";

// 1. DEFINISI INTERFACE PROPS LONGGAR AGAR SINKRON DENGAN PAGE.TSX
interface MainDashboardProps {
  setCurrentView: any;
  setSelectedTahunData?: any;
  [key: string]: any; // Menyerap properti ekstra (totalPendudukDesa, dll) agar tidak error
}

export function MainDashboard({
  setCurrentView,
  setSelectedTahunData,
  totalPendudukDesa = 1230,
  totalAnggaranDesa = 90000000,
  totalPenerimaBansos = 145,
  mockTren5Tahun = [],
  mockWilayahData = [],
  mockTopAnggaran = [],
}: MainDashboardProps) {
  // Data internal cadangan jika prop dari luar kosong (Fallback)
  const wilayahDataLokal = mockWilayahData.length
    ? mockWilayahData
    : [
        {
          id: "rt-01",
          nama: "RT 01 / RW 02",
          totalWarga: 650,
          porsi: "52.8%",
          color: "bg-emerald-500",
        },
        {
          id: "rt-02",
          nama: "RT 02 / RW 02",
          totalWarga: 580,
          porsi: "47.2%",
          color: "bg-blue-500",
        },
      ];

  const topAnggaranLokal = mockTopAnggaran.length
    ? mockTopAnggaran
    : [
        {
          kategori: "Pembangunan Infrastruktur Jalan",
          nilai: 45000000,
          persentase: 100,
        },
        {
          kategori: "Insentif Bansos & PKH Desa",
          nilai: 30000000,
          persentase: 66.6,
        },
        {
          kategori: "Operasional Poskesdes & Stunting",
          nilai: 15000000,
          persentase: 33.3,
        },
      ];

  const tren5TahunLokal = mockTren5Tahun.length
    ? mockTren5Tahun
    : [
        {
          tahun: "2022",
          jumlah: 1050,
          breakdownRT: [
            { nama: "RT 01", jumlah: 540 },
            { nama: "RT 02", jumlah: 510 },
          ],
        },
        {
          tahun: "2023",
          jumlah: 1120,
          breakdownRT: [
            { nama: "RT 01", jumlah: 580 },
            { nama: "RT 02", jumlah: 540 },
          ],
        },
        {
          tahun: "2024",
          jumlah: 1180,
          breakdownRT: [
            { nama: "RT 01", jumlah: 610 },
            { nama: "RT 02", jumlah: 570 },
          ],
        },
        {
          tahun: "2025",
          jumlah: 1210,
          breakdownRT: [
            { nama: "RT 01", jumlah: 630 },
            { nama: "RT 02", jumlah: 580 },
          ],
        },
        {
          tahun: "2026",
          jumlah: 1230,
          breakdownRT: [
            { nama: "RT 01", jumlah: 650 },
            { nama: "RT 02", jumlah: 580 },
          ],
        },
      ];

  return (
    <div className="space-y-6">
      {/* CARD STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setCurrentView("rt-list")}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Penduduk Desa
            </h3>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalPendudukDesa.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-semibold text-slate-400">Jiwa</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl text-lg">
            👥
          </div>
        </div>

        <div
          onClick={() => setCurrentView("anggaran-rt")}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-blue-500 hover:shadow-xs transition cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pagu Fiskal Aktif
            </h3>
            <p className="text-2xl font-black text-slate-900 mt-1">
              Rp {totalAnggaranDesa.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl text-lg">
            💰
          </div>
        </div>

        <div
          onClick={() => setCurrentView("bansos-list")}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-amber-500 hover:shadow-xs transition cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Penerima Bansos Aktif
            </h3>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {totalPenerimaBansos}{" "}
              <span className="text-xs font-semibold text-slate-400">KPM</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl text-lg">
            ⚖
          </div>
        </div>
      </div>

      {/* CHART TREN 5 TAHUN */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Tren Pertumbuhan Penduduk (5 Tahun Terakhir)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Arahkan kursor untuk melihat tooltip atau klik bar untuk melihat
            sebaran per RT.
          </p>
        </div>
        <div className="flex justify-between items-end h-48 pt-12 px-6 bg-slate-50/50 border border-slate-100 rounded-xl">
          {tren5TahunLokal.map((t: any, idx: number) => (
            <div
              key={idx}
              onClick={() => {
                if (setSelectedTahunData) setSelectedTahunData(t);
                setCurrentView("tren-detail");
              }}
              className="flex flex-col items-center flex-1 space-y-2.5 group relative cursor-pointer"
            >
              {/* TOOLTIP CHART BATANG */}
              <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center transition-all duration-200 z-20 w-36 pointer-events-none drop-shadow-xs">
                <div className="bg-white border border-slate-200/90 text-slate-800 text-[10px] rounded-xl p-3 space-y-1.5 w-full shadow-2xs">
                  <div className="font-black border-b border-slate-100 pb-1 text-center text-slate-900">
                    Tahun {t.tahun}
                  </div>
                  <div className="flex justify-between font-bold text-slate-950 pt-0.5">
                    <span>Total:</span>
                    <span className="text-emerald-600 font-mono">
                      {t.jumlah} Jw
                    </span>
                  </div>
                  <div className="space-y-0.5 border-t border-slate-50 pt-1">
                    {t.breakdownRT?.map((rt: any, i: number) => (
                      <div
                        key={i}
                        className="text-slate-500 font-medium text-[9px] flex justify-between"
                      >
                        <span>{rt.nama}:</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {rt.jumlah}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-2 h-2 bg-white border-r border-b border-slate-200/90 transform rotate-45 -mt-1"></div>
              </div>

              <div
                className="w-8 sm:w-16 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-t-lg relative flex flex-col justify-end transition-all duration-150"
                style={{ height: `${(t.jumlah / 1300) * 100}%` }}
              >
                <div className="w-full bg-emerald-500 h-1.5 rounded-t-md group-hover:bg-emerald-600 transition-colors"></div>
              </div>
              <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-950 transition-colors font-mono">
                {t.tahun}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* COMPOSITION & BUDGET OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KOMPOSISI PENDUDUK PER RT */}
        <div
          onClick={() => setCurrentView("rt-list")}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition cursor-pointer space-y-4"
        >
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Komposisi Penduduk per Wilayah RT
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-4 pt-2">
            {/* DONUT CHART WITH TOOLTIP */}
            <div className="relative w-24 h-24 shrink-0 group">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="3.5"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeDasharray="53 100"
                  strokeDashoffset="0"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeDasharray="47 100"
                  strokeDashoffset="-53"
                ></circle>
              </svg>

              {/* TOOLTIP LINGKARAN */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 w-40 pointer-events-none drop-shadow-xs">
                <div className="bg-white border border-slate-200/90 text-slate-800 text-[10px] rounded-xl p-2.5 space-y-1 w-full shadow-2xs">
                  <div className="font-black border-b border-slate-100 pb-1 text-slate-900">
                    Proporsi Kependudukan
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      RT 01:
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      52.8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      RT 02:
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      47.2%
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-white border-r border-b border-slate-200/90 transform rotate-45 -mt-1"></div>
              </div>
            </div>

            {/* DAFTAR DATA WILAYAH */}
            <div className="space-y-2 flex-1 w-full">
              {wilayahDataLokal.map((rt: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs border-b border-slate-50 pb-1"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span className={`w-2 h-2 rounded-full ${rt.color}`}></span>
                    <span className="text-slate-700">{rt.nama}</span>
                  </div>
                  <strong className="text-slate-900 font-mono text-[11px]">
                    {rt.totalWarga} Jiwa ({rt.porsi})
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP 3 PENGELUARAN ANGGARAN */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top 3 Pengeluaran Anggaran Terbesar
            </h3>
          </div>
          <div className="space-y-3.5 pt-1">
            {topAnggaranLokal.map((ang: any, i: number) => (
              <div key={i} className="space-y-1 relative group">
                {/* TOOLTIP PROGRESS BAR */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-start z-20 w-48 pointer-events-none drop-shadow-xs">
                  <div className="bg-white border border-slate-200/90 text-slate-800 text-[10px] rounded-xl p-2.5 space-y-1 w-full shadow-2xs">
                    <div className="font-black text-slate-900 truncate">
                      {ang.kategori}
                    </div>
                    <div className="flex justify-between border-t border-slate-50 pt-1 font-medium">
                      <span>Alokasi Pagu:</span>
                      <span className="text-blue-600 font-bold font-mono">
                        Rp {ang.nilai.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Persentase Beban:</span>
                      <span className="font-mono font-bold">
                        {ang.persentase}%
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-white border-r border-b border-slate-200/90 transform rotate-45 -mt-1 ml-4"></div>
                </div>

                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate max-w-[70%]">
                    {i + 1}. {ang.kategori}
                  </span>
                  <span className="text-slate-900 font-bold">
                    Rp {ang.nilai.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 transition-colors group-hover:bg-slate-200/50">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300 group-hover:bg-blue-700"
                    style={{ width: `${ang.persentase}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
