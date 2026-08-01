"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";

// Mock Data Demografi & Daftar Warga Relevan
const mockDemografiPerTahun: Record<string, any> = {
  "2026": {
    totalJiwa: 3412,
    totalLaki: 1720,
    totalPerempuan: 1692,
    totalKk: 980,
    kelompokUsia: [
      {
        id: "anak",
        kategori: "Anak (0 - 14 th)",
        jumlah: 710,
        persen: 20.8,
        ket: "Kategori belum produktif",
      },
      {
        id: "produktif",
        kategori: "Usia Produktif (15 - 59 th)",
        jumlah: 2180,
        persen: 63.9,
        ket: "Kategori angkatan kerja",
      },
      {
        id: "lansia",
        kategori: "Lansia (> 60 th)",
        jumlah: 522,
        persen: 15.3,
        ket: "Kategori rentan lansia",
      },
    ],
    sebaranPekerjaan: [
      {
        id: "buruh",
        nama: "Buruh Harian / Tani",
        jumlah: 1240,
        persen: 56.8,
        ket: "Sektor informal rentan",
      },
      {
        id: "umkm",
        nama: "Wiraswasta / UMKM",
        jumlah: 450,
        persen: 20.6,
        ket: "Sektor perdagangan mikro",
      },
      {
        id: "swasta",
        nama: "Karyawan Swasta",
        jumlah: 310,
        persen: 14.2,
        ket: "Sektor formal swasta",
      },
      {
        id: "pns",
        nama: "PNS / TNI / Polri",
        jumlah: 180,
        persen: 8.4,
        ket: "Sektor pemerintahan/aparat",
      },
    ],
    sebaranRt: [
      { rt: "RT 01 / RW 01", jiwa: 680, kk: 195 },
      { rt: "RT 02 / RW 01", jiwa: 620, kk: 180 },
      { rt: "RT 03 / RW 01", jiwa: 750, kk: 215 },
      { rt: "RT 04 / RW 01", jiwa: 710, kk: 205 },
      { rt: "RT 05 / RW 01", jiwa: 652, kk: 185 },
    ],
  },
};

// Mock Sampling Data Warga untuk Drawer Half-Screen
const mockDaftarWargaDetail: Record<string, any[]> = {
  anak: [
    {
      nik: "3507011212200001",
      nama: "Dimas Anggara",
      usia: 8,
      jk: "L",
      rt: "RT 01 / RW 01",
      status: "Sekolah SD",
    },
    {
      nik: "3507014508180002",
      nama: "Nabila Putri",
      usia: 6,
      jk: "P",
      rt: "RT 03 / RW 01",
      status: "PAUD / TK",
    },
    {
      nik: "3507011005150003",
      nama: "Rizky Ramadhan",
      usia: 11,
      jk: "L",
      rt: "RT 02 / RW 01",
      status: "Sekolah SD",
    },
  ],
  produktif: [
    {
      nik: "3507011205850001",
      nama: "Budi Santoso",
      usia: 41,
      jk: "L",
      rt: "RT 03 / RW 01",
      status: "Bekerja (Tani)",
    },
    {
      nik: "3507019808900002",
      nama: "Siti Rahmawati",
      usia: 36,
      jk: "P",
      rt: "RT 01 / RW 01",
      status: "Bekerja (Wiraswasta)",
    },
    {
      nik: "3507011511980003",
      nama: "Eko Prasetyo",
      usia: 28,
      jk: "L",
      rt: "RT 04 / RW 01",
      status: "Bekerja (Buruh)",
    },
  ],
  lansia: [
    {
      nik: "3507012408580002",
      nama: "Mbah Siti Aminah",
      usia: 68,
      jk: "P",
      rt: "RT 03 / RW 01",
      status: "Penerima PKH Lansia",
    },
    {
      nik: "3507011501450003",
      nama: "Mbah Joko Widodo (Alm)",
      usia: 81,
      jk: "L",
      rt: "RT 05 / RW 01",
      status: "Non-Aktif Kematian",
    },
    {
      nik: "3507010107500004",
      name: "Mbah Sastro",
      usia: 76,
      jk: "L",
      rt: "RT 02 / RW 01",
      status: "Penerima BLT Lansia",
    },
  ],
  buruh: [
    {
      nik: "3507011205850001",
      nama: "Budi Santoso",
      usia: 41,
      jk: "L",
      rt: "RT 03 / RW 01",
      status: "Buruh Tani Harian",
    },
    {
      nik: "3507011511980003",
      nama: "Eko Prasetyo",
      usia: 28,
      jk: "L",
      rt: "RT 04 / RW 01",
      status: "Buruh Bangunan",
    },
  ],
  umkm: [
    {
      nik: "3507019808900002",
      nama: "Siti Rahmawati",
      usia: 36,
      jk: "P",
      rt: "RT 01 / RW 01",
      status: "Pemilik Toko Kelontong",
    },
    {
      nik: "3507010202880005",
      nama: "Ahmad Subari",
      usia: 38,
      jk: "L",
      rt: "RT 02 / RW 01",
      status: "Pedagang Makanan",
    },
  ],
  swasta: [
    {
      nik: "3507012010920006",
      nama: "Rian Hidayat",
      usia: 34,
      jk: "L",
      rt: "RT 02 / RW 01",
      status: "Karyawan Pabrik",
    },
  ],
  pns: [
    {
      nik: "3507010505800007",
      nama: "Drs. Heru Prasetyo",
      usia: 46,
      jk: "L",
      rt: "RT 01 / RW 01",
      status: "Guru PNS",
    },
  ],
};

function DetailPendudukContent() {
  const searchParams = useSearchParams();
  const [tahunPeriode, setTahunPeriodeState] = useState("2026");

  // State Drawer Setengah Layar
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState("");
  const [activeDataList, setActiveDataList] = useState<any[]>([]);

  useEffect(() => {
    const queryTahun = searchParams.get("tahun");
    if (queryTahun) {
      setTahunPeriodeState(queryTahun);
    }
  }, [searchParams]);

  const dataDemo =
    mockDemografiPerTahun[tahunPeriode] || mockDemografiPerTahun["2026"];

  const openDrawer = (title: string, dataKey: string) => {
    setActiveTitle(title);
    setActiveDataList(mockDaftarWargaDetail[dataKey] || []);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased relative">
      <KadesHeader
        tahunPeriode={tahunPeriode}
        setTahunPeriode={(t) => setTahunPeriodeState(t)}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* NAVIGASI KEMBALI */}
        <div className="flex items-center justify-between">
          <Link
            href={`/kades/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            ← Kembali ke Dashboard Kades
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            📅 Periode:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* HEADER BREADCRUMB DETAIL */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold mb-2">
              📊 Laporan Eksekutif Demografi
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Analisis Detail Demografi & Kependudukan Desa ({tahunPeriode})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Klik pada grafik kelompok usia atau sektor pekerjaan untuk
              menampilkan rincian data warga setengah layar.
            </p>
          </div>

          <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">
              Total Kepala Keluarga
            </span>
            <span className="text-sm font-black text-slate-900">
              {dataDemo.totalKk} KK
            </span>
          </div>
        </div>

        {/* RINGKASAN ATAS: 4 CARD UNIK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Penduduk Terdata
            </span>
            <p className="text-2xl font-black text-slate-950">
              {dataDemo.totalJiwa.toLocaleString("id-ID")}{" "}
              <span className="text-xs text-slate-500 font-bold">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500">
              100% Master Data RT Valid
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Laki-Laki
            </span>
            <p className="text-2xl font-black text-blue-900">
              {dataDemo.totalLaki.toLocaleString("id-ID")}{" "}
              <span className="text-xs text-slate-500 font-bold">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Proporsi 50.4% Populasi
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Perempuan
            </span>
            <p className="text-2xl font-black text-rose-900">
              {dataDemo.totalPerempuan.toLocaleString("id-ID")}{" "}
              <span className="text-xs text-slate-500 font-bold">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Proporsi 49.6% Populasi
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Kelompok Rentan (Lansia & Anak)
            </span>
            <p className="text-2xl font-black text-amber-600">
              {dataDemo.kelompokUsia[0].jumlah +
                dataDemo.kelompokUsia[2].jumlah}{" "}
              <span className="text-xs text-slate-500 font-bold">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Sasaran Utama Perlindungan Sosial
            </p>
          </div>
        </div>

        {/* GRID GRAFIK DENGAN TOOLTIP TERANG & BISA DIKLIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CHART 1: KELOMPOK USIA */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-950">
                👶👴 1. Komposisi Kelompok Usia Warga
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dekatkan kursor untuk melihat tooltip atau klik baris untuk
                melihat rincian data warga.
              </p>
            </div>

            <div className="space-y-4">
              {dataDemo.kelompokUsia.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() =>
                    openDrawer(`Daftar Warga - ${item.kategori}`, item.id)
                  }
                  className="group relative space-y-1.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  {/* TOOLTIP ON HOVER (WARNA TERANG / BG-WHITE) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-lg pointer-events-none z-10 whitespace-nowrap">
                    💡 {item.kategori}:{" "}
                    <strong className="text-blue-600">
                      {item.jumlah} Jiwa
                    </strong>{" "}
                    ({item.persen}%) —{" "}
                    <span className="text-slate-500">Klik untuk rincian</span>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="group-hover:text-blue-600 transition-colors">
                      {item.kategori}
                    </span>
                    <span className="font-mono text-slate-600">
                      {item.jumlah} Jiwa ({item.persen}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        idx === 1
                          ? "bg-blue-600 group-hover:bg-blue-700"
                          : idx === 2
                            ? "bg-amber-500 group-hover:bg-amber-600"
                            : "bg-emerald-500 group-hover:bg-emerald-600"
                      }`}
                      style={{ width: `${item.persen}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 2: SEBARAN PEKERJAAN */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-950">
                💼 2. Distribusi Sektor Pekerjaan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dekatkan kursor untuk melihat tooltip atau klik baris untuk
                melihat rincian data warga.
              </p>
            </div>

            <div className="space-y-4">
              {dataDemo.sebaranPekerjaan.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() =>
                    openDrawer(`Daftar Warga - Sektor ${item.nama}`, item.id)
                  }
                  className="group relative space-y-1.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200"
                >
                  {/* TOOLTIP ON HOVER (WARNA TERANG / BG-WHITE) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-lg pointer-events-none z-10 whitespace-nowrap">
                    💡 {item.nama}:{" "}
                    <strong className="text-indigo-600">
                      {item.jumlah} Orang
                    </strong>{" "}
                    ({item.persen}%) —{" "}
                    <span className="text-slate-500">Klik untuk rincian</span>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span className="group-hover:text-indigo-600 transition-colors">
                      {item.nama}
                    </span>
                    <span className="font-mono text-slate-600">
                      {item.jumlah} Orang ({item.persen}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 group-hover:bg-indigo-700 rounded-full transition-all duration-300"
                      style={{ width: `${item.persen}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. KEPADATAN PENDUDUK PER RT */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-950">
              🏠 3. Sebaran Kepadatan Penduduk & Jumlah KK Per RT (
              {tahunPeriode})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian komparasi populasi warga terdaftar di tiap lingkungan RT.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Wilayah RT</th>
                  <th className="px-5 py-3.5">Jumlah Kepala Keluarga (KK)</th>
                  <th className="px-5 py-3.5">Total Jiwa Terdata</th>
                  <th className="px-5 py-3.5 text-right">
                    Rata-Rata Jiwa / KK
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {dataDemo.sebaranRt.map((rt: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4 font-bold text-slate-900 text-xs">
                      {rt.rt}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-slate-700">
                      {rt.kk} KK
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-extrabold rounded-lg border border-blue-100">
                        {rt.jiwa} Jiwa
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs font-mono text-slate-500">
                      ~ {(rt.jiwa / rt.kk).toFixed(1)} Jiwa / KK
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DRAWER SETENGAH LAYAR (HALF-SCREEN OVERLAY 50%) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    DATA SAMPLING TERSELEKSI
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 mt-1">
                    {activeTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* DRAWER TABEL DATA RELEVAN */}
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Berikut rincian warga yang masuk dalam kategori ini hasil
                  verifikasi master data RT:
                </p>

                <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Nama Warga</th>
                        <th className="p-3">Usia / JK</th>
                        <th className="p-3">Wilayah RT</th>
                        <th className="p-3 text-right">Status Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {activeDataList.length > 0 ? (
                        activeDataList.map((warga: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-3">
                              <p className="font-bold text-slate-900">
                                {warga.nama}
                              </p>
                              <p className="font-mono text-[10px] text-slate-400">
                                NIK: {warga.nik}
                              </p>
                            </td>
                            <td className="p-3 font-mono">
                              {warga.usia} th ({warga.jk})
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                                {warga.rt}
                              </span>
                            </td>
                            <td className="p-3 text-right font-semibold text-slate-600">
                              {warga.status}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-6 text-center text-slate-400 text-xs"
                          >
                            Tidak ada data detail sampel untuk kategori ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Total Sampel Tampil:{" "}
                <strong>{activeDataList.length} Warga</strong>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup Layar Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailPendudukPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Detail Penduduk...
        </div>
      }
    >
      <DetailPendudukContent />
    </Suspense>
  );
}
