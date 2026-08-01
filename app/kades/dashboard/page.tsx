"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
);

// Mock Data Eksekutif Kades Per Tahun (Diperbarui 5 Tahun Terakhir: 2022 - 2026)
const mockExecutiveData: Record<string, any> = {
  "2026": {
    totalWarga: "3.412",
    totalKpmAktif: 245,
    paguAnggaranBansos: "Rp 270.000.000",
    sisaPaguSiskeudes: "Rp 90.000.000",
    statusAlurBansos: "Tersendat di Verifikasi RT",
    draftSkSiapTtd: [
      {
        id: "sk-001",
        nomorDraft: "SK/DSO/2026/004",
        tentang: "Penetapan 25 KPM Bansos BLT-DD Tahap III",
        pengusul: "Ibu Siti (Sekretaris Desa)",
        tanggalMasuk: "01/08/2026",
        jumlahKpm: 25,
        totalNominal: "Rp 90.000.000",
        status: "Menunggu Tanda Tangan Kades",
      },
    ],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 42, kuotaPersen: 85 },
      { rt: "RT 02 / RW 01", jumlahKpm: 38, kuotaPersen: 70 },
      { rt: "RT 03 / RW 01", jumlahKpm: 55, kuotaPersen: 95 },
      { rt: "RT 04 / RW 01", jumlahKpm: 60, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 50, kuotaPersen: 80 },
    ],
  },
  "2025": {
    totalWarga: "3.350",
    totalKpmAktif: 260,
    paguAnggaranBansos: "Rp 310.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 45, kuotaPersen: 100 },
      { rt: "RT 02 / RW 01", jumlahKpm: 40, kuotaPersen: 100 },
      { rt: "RT 03 / RW 01", jumlahKpm: 60, kuotaPersen: 100 },
      { rt: "RT 04 / RW 01", jumlahKpm: 65, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 50, kuotaPersen: 100 },
    ],
  },
  "2024": {
    totalWarga: "3.280",
    totalKpmAktif: 280,
    paguAnggaranBansos: "Rp 336.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 48, kuotaPersen: 100 },
      { rt: "RT 02 / RW 01", jumlahKpm: 42, kuotaPersen: 100 },
      { rt: "RT 03 / RW 01", jumlahKpm: 62, kuotaPersen: 100 },
      { rt: "RT 04 / RW 01", jumlahKpm: 68, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 52, kuotaPersen: 100 },
    ],
  },
  "2023": {
    totalWarga: "3.195",
    totalKpmAktif: 268,
    paguAnggaranBansos: "Rp 322.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 46, kuotaPersen: 100 },
      { rt: "RT 02 / RW 01", jumlahKpm: 39, kuotaPersen: 100 },
      { rt: "RT 03 / RW 01", jumlahKpm: 58, kuotaPersen: 100 },
      { rt: "RT 04 / RW 01", jumlahKpm: 64, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 49, kuotaPersen: 100 },
    ],
  },
  "2022": {
    totalWarga: "3.120",
    totalKpmAktif: 252,
    paguAnggaranBansos: "Rp 302.400.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 44, kuotaPersen: 100 },
      { rt: "RT 02 / RW 01", jumlahKpm: 36, kuotaPersen: 100 },
      { rt: "RT 03 / RW 01", jumlahKpm: 54, kuotaPersen: 100 },
      { rt: "RT 04 / RW 01", jumlahKpm: 61, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 46, kuotaPersen: 100 },
    ],
  },
};

// Mock Master Sampling Data Warga Per Tahun untuk Drawer Setengah Layar
const mockMasterPendudukDetail: Record<string, any[]> = {
  "2026": [
    {
      id: "w-1",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      jenisKelamin: "L",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      statusPenduduk: "Tetap",
      rt: "RT 03 / RW 01",
      dukcapil: "Terverifikasi",
    },
    {
      id: "w-2",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      jenisKelamin: "P",
      tempatLahir: "Kota Surabaya",
      tanggalLahir: "1958-08-24",
      statusPenduduk: "Tetap",
      rt: "RT 01 / RW 01",
      dukcapil: "Terverifikasi",
    },
    {
      id: "w-3",
      nik: "3507012010920006",
      nama: "Rian Hidayat",
      jenisKelamin: "L",
      tempatLahir: "Kota Malang",
      tanggalLahir: "1992-10-20",
      statusPenduduk: "Warga Baru",
      rt: "RT 02 / RW 01",
      dukcapil: "Terverifikasi",
    },
  ],
  "2025": [
    {
      id: "w-2025-1",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      jenisKelamin: "L",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      statusPenduduk: "Tetap",
      rt: "RT 03 / RW 01",
      dukcapil: "Terverifikasi",
    },
  ],
  "2024": [
    {
      id: "w-2024-1",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      jenisKelamin: "P",
      tempatLahir: "Kota Surabaya",
      tanggalLahir: "1958-08-24",
      statusPenduduk: "Tetap",
      rt: "RT 01 / RW 01",
      dukcapil: "Terverifikasi",
    },
  ],
  "2023": [],
  "2022": [],
};

function DashboardKadesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tahunPeriode, setTahunPeriodeState] = useState("2026");

  // State Drawer Setengah Layar
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const queryTahun = searchParams.get("tahun");
    if (queryTahun) {
      setTahunPeriodeState(queryTahun);
      localStorage.setItem("kades_tahun_periode", queryTahun);
    } else {
      const savedTahun = localStorage.getItem("kades_tahun_periode");
      if (savedTahun) {
        setTahunPeriodeState(savedTahun);
      }
    }
  }, [searchParams]);

  const setTahunPeriode = (tahun: string) => {
    setTahunPeriodeState(tahun);
    localStorage.setItem("kades_tahun_periode", tahun);
    router.replace(`/kades/dashboard?tahun=${tahun}`);
  };

  const dataKades =
    mockExecutiveData[tahunPeriode] || mockExecutiveData["2026"];

  const [notif, setNotif] = useState("");
  const [draftList, setDraftList] = useState(dataKades.draftSkSiapTtd);

  useEffect(() => {
    setDraftList(dataKades.draftSkSiapTtd);
  }, [tahunPeriode]);

  const handleTandaTanganSk = (id: string, nomor: string) => {
    setDraftList((prev: any[]) => prev.filter((item) => item.id !== id));
    setNotif(
      `Sukses: Dokumen ${nomor} berhasil ditandatangani dan terbit sebagai SK Penetapan Resmi Kades!`,
    );
    setTimeout(() => setNotif(""), 5000);
  };

  // 1. SUMBU X: 5 TAHUN TERAKHIR (2022 - 2026)
  const limaTahunTerakhir = ["2022", "2023", "2024", "2025", "2026"];

  const trendPendudukData = {
    labels: limaTahunTerakhir,
    datasets: [
      {
        label: "Total Penduduk Terdata",
        data: limaTahunTerakhir.map((thn) =>
          parseInt(
            (mockExecutiveData[thn]?.totalWarga || "3.000").replace(/\./g, ""),
            10,
          ),
        ),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: "#1d4ed8",
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  // CONFIGURATION CHART DENGAN TOOLTIP TERANG & SUMBU Y RENGGANG PROPOSIONAL
  const trendPendudukOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // CALLBACK KLIK PADA TITIK GRAFIK UNTUK MEMBUKA DRAWER SETENGAH LAYAR
    onClick: (event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const tahunTerpilih = limaTahunTerakhir[index];
        const dataJiwa = mockExecutiveData[tahunTerpilih]?.totalWarga || "0";

        setDrawerTitle(
          `Master Data Warga Tahun ${tahunTerpilih} (${dataJiwa} Jiwa)`,
        );
        setDrawerData(mockMasterPendudukDetail[tahunTerpilih] || []);
        setDrawerOpen(true);
      }
    },
    plugins: {
      legend: { display: false },
      // 2. TOOLTIP BERWARNA TERANG (LIGHT MODE)
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#0f172a",
        bodyColor: "#334155",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { size: 12, weight: "bold" as const },
        bodyFont: { size: 11, weight: "medium" as const },
        callbacks: {
          label: (ctx: any) =>
            ` Total: ${ctx.parsed.y.toLocaleString("id-ID")} Jiwa (Klik titik untuk rincian)`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 12, weight: "bold" as const },
          color: "#475569",
        },
      },
      // 3. SUMBU Y DIBUAT DENGAN INTERVAL RENGGANG & PROPOSIONAL
      y: {
        suggestedMin: 3000,
        suggestedMax: 3500,
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 100, // Memberikan jarak renggang yang pas antar interval
          font: { size: 10, weight: "normal" as const },
          color: "#94a3b8",
          callback: (val: any) => `${val.toLocaleString("id-ID")} Jiwa`,
        },
      },
    },
  };

  const filteredDrawerWarga = drawerData.filter(
    (w) =>
      w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.nik.includes(searchTerm) ||
      w.rt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased relative">
      {/* HEADER EKSEKUTIF KADES */}
      <KadesHeader
        tahunPeriode={tahunPeriode}
        setTahunPeriode={setTahunPeriode}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-xs">
            {notif}
          </div>
        )}

        {/* BANNER SELAMAT DATANG KADES */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold mb-1">
              👑 Bpk. Ahmad (Kepala Desa)
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Ringkasan Kebijakan & Kondisi Desa ({tahunPeriode})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Pantau metrik utama, identifikasi kemacetan alur berkas, dan
              sahkan rekomendasi SK penetapan bantuan sosial.
            </p>
          </div>

          <div className="px-4 py-2 bg-amber-50 border border-amber-200/80 rounded-xl shrink-0 self-start sm:self-auto text-right">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Status Alur Sistem
            </span>
            <span className="text-xs font-black text-amber-950">
              {dataKades.statusAlurBansos}
            </span>
          </div>
        </div>

        {/* 1. KARTU ANGKA KUNCI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href={`/kades/detail-penduduk?tahun=${tahunPeriode}`}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50 transition-all duration-200 space-y-2 block group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Penduduk Terdata
              </span>
            </div>
            <p className="text-2xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
              {dataKades.totalWarga}{" "}
              <span className="text-xs font-bold text-slate-500">Jiwa</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Master Data RT Selesai Validasi
            </p>
          </Link>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total KPM Bansos Aktif
            </span>
            <p className="text-2xl font-black text-blue-900">
              {dataKades.totalKpmAktif}{" "}
              <span className="text-xs font-bold text-slate-500">Keluarga</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Penerima Manfaat Sah SK Kades
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Realisasi Anggaran Bansos
            </span>
            <p className="text-2xl font-black text-emerald-800">
              {dataKades.paguAnggaranBansos}
            </p>
            <p className="text-[11px] text-slate-500">
              Terserap dari Siskeudes
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sisa Pagu Tersedia (BLT)
            </span>
            <p className="text-2xl font-black text-amber-600">
              {dataKades.sisaPaguSiskeudes}
            </p>
            <p className="text-[11px] text-slate-500">
              Kuota Cadangan Pagu Tahun Ini
            </p>
          </div>
        </div>

        {/* GRAFIK TREN PERTUMBUHAN PENDUDUK (5 TAHUN TERAKHIR) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                📈 Tren Pertumbuhan Jumlah Penduduk (5 Tahun Terakhir)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dekatkan kursor untuk tooltip terang, atau{" "}
                <strong className="text-blue-600">
                  klik pada titik grafik
                </strong>{" "}
                untuk melihat data warga setengah layar.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold border border-blue-100 self-start sm:self-auto">
              2022 — 2026
            </span>
          </div>

          <div className="h-64 sm:h-72 cursor-pointer">
            <Line
              data={trendPendudukData}
              options={trendPendudukOptions as any}
            />
          </div>
        </div>

        {/* 2. PANEL EKSEKUSI: TANDA TANGAN DRAFT SK KPM BANSOS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold mb-1">
                ✍️ Pengesahan Resmi Kepala Desa
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Persetujuan Draft SK Penetapan Penerima Bansos ({tahunPeriode})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rekomendasi dari Sekdes yang telah disesuaikan dengan kuota Pagu
                Siskeudes dan Verifikasi RT.
              </p>
            </div>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
              Antrean SK: {draftList.length} Berkas
            </span>
          </div>

          <div className="space-y-4">
            {draftList.length > 0 ? (
              draftList.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-mono text-[11px] font-bold rounded-md border border-blue-200">
                        {item.nomorDraft}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Masuk: {item.tanggalMasuk}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {item.tentang}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Pengusul: <strong>{item.pengusul}</strong> • Total Kuota:{" "}
                      <strong>{item.jumlahKpm} KPM</strong> • Total Anggaran:{" "}
                      <strong className="text-emerald-800">
                        {item.totalNominal}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleTandaTanganSk(item.id, item.nomorDraft)
                    }
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/10 cursor-pointer shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>✒️</span>
                    <span>Sahkan & Tanda Tangan SK →</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                ✓ Tidak ada antrean draft SK yang perlu ditandatangani pada
                periode tahun {tahunPeriode}. Semua berkas telah disahkan.
              </div>
            )}
          </div>
        </div>

        {/* 3. RADAR KETERJANGKAUAN BANSOS PER RT */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              📊 Matriks Pemerataan Sebaran Penerima Bansos Per RT (
              {tahunPeriode})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau tingkat keterjangkauan bantuan sosial agar tidak terjadi
              penumpukan atau ketimpangan antar wilayah RT.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dataKades.sebaranKpmRt.length > 0 ? (
              dataKades.sebaranKpmRt.map((rt: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">
                      {rt.rt}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {rt.jumlahKpm} KPM
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        rt.kuotaPersen >= 90 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${rt.kuotaPersen}%` }}
                    />
                  </div>

                  <p className="text-[10px] font-semibold text-slate-500 text-right">
                    Kapasitas Terpakai: {rt.kuotaPersen}%
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full p-6 text-center text-slate-400 text-xs">
                Tidak ada data sebaran per RT untuk tahun {tahunPeriode}.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. DRAWER SETENGAH LAYAR (SIDE PANEL OVERLAY 50% VIEWPORT) - DETAIL DATA TITIK GRAFIK */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    DETAIL TITIK GRAFIK TREN
                  </span>
                  <h3 className="text-base font-extrabold text-slate-950 mt-1">
                    {drawerTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* SEARCH FILTER */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan Nama, NIK, atau RT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* TABEL DATA LENGKAP PENDUDUK */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Warga / NIK</th>
                      <th className="p-3">TTL & JK</th>
                      <th className="p-3">Wilayah RT</th>
                      <th className="p-3">Status Penduduk</th>
                      <th className="p-3 text-right">Dukcapil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filteredDrawerWarga.length > 0 ? (
                      filteredDrawerWarga.map((warga) => (
                        <tr key={warga.id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">
                              {warga.nama}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400">
                              NIK: {warga.nik}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-slate-700">
                              {warga.tempatLahir}, {warga.tanggalLahir}
                            </p>
                            <p className="font-bold text-slate-400 text-[10px]">
                              Jenis Kelamin: {warga.jenisKelamin}
                            </p>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                              {warga.rt}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                warga.statusPenduduk === "Tetap"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                  : "bg-blue-50 text-blue-800 border border-blue-100"
                              }`}
                            >
                              {warga.statusPenduduk}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                              {warga.dukcapil}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-slate-400 text-xs"
                        >
                          Tidak ditemukan data warga terdaftar untuk titik
                          grafik periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Total Tampil:{" "}
                <strong>{filteredDrawerWarga.length} Warga</strong>
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

export default function DashboardKades() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Dashboard Kades...
        </div>
      }
    >
      <DashboardKadesContent />
    </Suspense>
  );
}
