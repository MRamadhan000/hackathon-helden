"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainDashboard } from "./components/MainDashboard";
import PendudukView from "./components/PendudukView";
import AnggaranView from "./components/AnggaranView";
import BansosView from "./components/BansosView";
import TrenDetailView from "./components/TrenDetailView";

// MOCK DATA CENTRALIZED
const mockTren5Tahun = [
  {
    tahun: "2022",
    jumlah: 1050,
    breakdownRT: [
      { nama: "RT 01 / RW 02", jumlah: 540 },
      { nama: "RT 02 / RW 02", jumlah: 510 },
    ],
  },
  {
    tahun: "2023",
    jumlah: 1120,
    breakdownRT: [
      { nama: "RT 01 / RW 02", jumlah: 580 },
      { nama: "RT 02 / RW 02", jumlah: 540 },
    ],
  },
  {
    tahun: "2024",
    jumlah: 1180,
    breakdownRT: [
      { nama: "RT 01 / RW 02", jumlah: 610 },
      { nama: "RT 02 / RW 02", jumlah: 570 },
    ],
  },
  {
    tahun: "2025",
    jumlah: 1210,
    breakdownRT: [
      { nama: "RT 01 / RW 02", jumlah: 630 },
      { nama: "RT 02 / RW 02", jumlah: 580 },
    ],
  },
  {
    tahun: "2026",
    jumlah: 1230,
    breakdownRT: [
      { nama: "RT 01 / RW 02", jumlah: 650 },
      { nama: "RT 02 / RW 02", jumlah: 580 },
    ],
  },
];

const mockWilayahData = [
  {
    id: "rt-01",
    nama: "RT 01 / RW 02",
    totalWarga: 650,
    porsi: "52.8%",
    anggaran: 45000000,
    color: "bg-emerald-500",
    keluarga: [
      {
        id: "kk-101",
        nomorKK: "3507011122330001",
        kepalaKeluarga: "Ahmad Subari",
        alamat: "Jl. Merdeka No. 12",
        anggota: [
          {
            nama: "Ahmad Subari",
            nik: "3507010203700001",
            hubungan: "Kepala Keluarga",
            status: "Bekerja",
            bansos: "Penerima PKH (Rp 300.000)",
          },
          {
            nama: "Siti Aminah",
            nik: "3507014405750002",
            hubungan: "Istri",
            status: "IRT",
            bansos: "-",
          },
          {
            nama: "Roni Subari",
            nik: "3507011212010003",
            hubungan: "Anak",
            status: "Pelajar",
            bansos: "-",
          },
        ],
      },
    ],
  },
  {
    id: "rt-02",
    nama: "RT 02 / RW 02",
    totalWarga: 580,
    porsi: "47.2%",
    anggaran: 45000000,
    color: "bg-blue-500",
    keluarga: [
      {
        id: "kk-201",
        nomorKK: "3507011122330099",
        kepalaKeluarga: "Rian Hidayat",
        alamat: "Jl. Mawar No. 02",
        anggota: [
          {
            nama: "Rian Hidayat",
            nik: "3507012010850005",
            hubungan: "Kepala Keluarga",
            status: "Bekerja",
            bansos: "BLT Dana Desa (Rp 300.000)",
          },
        ],
      },
    ],
  },
];

const mockTopAnggaran = [
  {
    kategori: "Pembangunan Infrastruktur Jalan",
    nilai: 45000000,
    persentase: 100,
  },
  { kategori: "Insentif Bansos & PKH Desa", nilai: 30000000, persentase: 66.6 },
  {
    kategori: "Operasional Poskesdes & Stunting",
    nilai: 15000000,
    persentase: 33.3,
  },
];

export default function DashboardKadesKomposit() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<
    | "main"
    | "rt-list"
    | "kk-list"
    | "anggota-list"
    | "anggaran-rt"
    | "bansos-list"
    | "tren-detail"
  >("main");
  const [selectedRT, setSelectedRT] = useState<
    (typeof mockWilayahData)[0] | null
  >(null);
  const [selectedKK, setSelectedKK] = useState<
    (typeof mockWilayahData)[0]["keluarga"][0] | null
  >(null);
  const [selectedTahunData, setSelectedTahunData] = useState<
    (typeof mockTren5Tahun)[0] | null
  >(null);

  const totalPendudukDesa = 1230;
  const totalAnggaranDesa = 90000000;
  const totalPenerimaBansos = 145;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-6 lg:p-8">
      {/* HEADER COMPONENT */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            KADES EXECUTIVE COMMAND
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="mt-2 text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-100 transition block"
          >
            ← Keluar Portal
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 font-medium">
            <span
              className="cursor-pointer hover:text-emerald-600"
              onClick={() => setCurrentView("main")}
            >
              Dashboard
            </span>
            {currentView !== "main" && <span>/</span>}
            {currentView === "anggaran-rt" && (
              <span>Detail Alokasi Pagu RT</span>
            )}
            {currentView === "bansos-list" && (
              <span>Daftar Warga Penerima Bansos</span>
            )}
            {currentView === "tren-detail" && (
              <span>
                Detail Demografi Penduduk Tahun {selectedTahunData?.tahun}
              </span>
            )}
            {selectedRT && (
              <span
                className="cursor-pointer hover:text-emerald-600"
                onClick={() => setCurrentView("rt-list")}
              >
                {selectedRT.nama}
              </span>
            )}
            {selectedKK && <span>/ KK: {selectedKK.kepalaKeluarga}</span>}
          </div>
        </div>
        {currentView !== "main" && (
          <button
            onClick={() => setCurrentView("main")}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs hover:bg-slate-50 transition"
          >
            ← Kembali ke Dashboard
          </button>
        )}
      </header>

      {/* DYNAMIC VIEW ROUTER */}
      <main className="max-w-6xl mx-auto space-y-6">
        {currentView === "main" && (
          <MainDashboard
            totalPendudukDesa={totalPendudukDesa}
            totalAnggaranDesa={totalAnggaranDesa}
            totalPenerimaBansos={totalPenerimaBansos}
            mockTren5Tahun={mockTren5Tahun}
            mockWilayahData={mockWilayahData}
            mockTopAnggaran={mockTopAnggaran}
            setCurrentView={setCurrentView}
            setSelectedTahunData={setSelectedTahunData}
          />
        )}

        {currentView === "tren-detail" && (
          <TrenDetailView selectedTahunData={selectedTahunData} />
        )}
        {currentView === "anggaran-rt" && (
          <AnggaranView mockWilayahData={mockWilayahData} />
        )}
        {currentView === "bansos-list" && (
          <BansosView mockWilayahData={mockWilayahData} />
        )}

        {["rt-list", "kk-list", "anggota-list"].includes(currentView) && (
          <PendudukView
            currentView={currentView}
            mockWilayahData={mockWilayahData}
            selectedRT={selectedRT}
            selectedKK={selectedKK}
            setSelectedRT={setSelectedRT}
            setSelectedKK={setSelectedKK}
            setCurrentView={setCurrentView}
          />
        )}
      </main>
    </div>
  );
}
