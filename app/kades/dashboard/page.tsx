"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import KadesHeader from "@/components/kades/KadesHeader";
import ExecutiveStatCards from "@/components/kades/ExecutiveStatCards";
import SkHistoryLogTable from "@/components/kades/SkHistoryLogTable";
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

interface WargaTahun {
  id: string;
  nik: string;
  nama: string;
  jenisKelamin: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  rt: string;
  idRT: string;
  statusKependudukanAkhirTahun:
    | "Penduduk Tetap"
    | "Warga Baru (Pindahan)"
    | "Mutasi Keluar";
  dukcapil: "Terverifikasi Valid" | "Pending Validasi";
}

interface RTTahun {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  jumlahPenduduk: number;
}

interface DetailBltRT {
  rt: string;
  ketuaRT: string;
  dusun: string;
  jumlahKpm: number;
  kuotaPersen: number;
  totalAnggaranBltBln: string;
  totalAnggaranBltThn: string;
  daftarKpmBlt: {
    id: string;
    nik: string;
    nama: string;
    skorDDK: number;
    nominalPerBulan: string;
    noSKKades: string;
    tanggalPenyaluranTerakhir: string;
    statusVerifikasi: "Berita Acara Sah" | "Proses Verifikasi";
  }[];
}

const mockDetailBltMatriksRT: Record<string, DetailBltRT> = {
  "RT 01 / RW 01": {
    rt: "RT 01 / RW 01",
    ketuaRT: "Bpk. Heri Setiawan",
    dusun: "Dusun Krajan",
    jumlahKpm: 42,
    kuotaPersen: 85,
    totalAnggaranBltBln: "Rp 12.600.000",
    totalAnggaranBltThn: "Rp 37.800.000",
    daftarKpmBlt: [
      {
        id: "blt-101",
        nik: "3507019876540002",
        nama: "Siti Aminah",
        skorDDK: 80,
        nominalPerBulan: "Rp 300.000",
        noSKKades: "SK/DSO/2026/003",
        tanggalPenyaluranTerakhir: "10/08/2026",
        statusVerifikasi: "Berita Acara Sah",
      },
      {
        id: "blt-102",
        nik: "3507017766550004",
        nama: "Supardi",
        skorDDK: 76,
        nominalPerBulan: "Rp 300.000",
        noSKKades: "SK/DSO/2026/003",
        tanggalPenyaluranTerakhir: "10/08/2026",
        statusVerifikasi: "Berita Acara Sah",
      },
    ],
  },
  "RT 02 / RW 01": {
    rt: "RT 02 / RW 01",
    ketuaRT: "Bpk. Agus Rahardjo",
    dusun: "Dusun Krajan",
    jumlahKpm: 38,
    kuotaPersen: 70,
    totalAnggaranBltBln: "Rp 11.400.000",
    totalAnggaranBltThn: "Rp 34.200.000",
    daftarKpmBlt: [
      {
        id: "blt-201",
        nik: "3507016677880009",
        nama: "Martono",
        skorDDK: 90,
        nominalPerBulan: "Rp 300.000",
        noSKKades: "SK/DSO/2026/003",
        tanggalPenyaluranTerakhir: "10/08/2026",
        statusVerifikasi: "Berita Acara Sah",
      },
    ],
  },
  "RT 03 / RW 01": {
    rt: "RT 03 / RW 01",
    ketuaRT: "Bpk. Bambang Sukoco",
    dusun: "Dusun Krajan",
    jumlahKpm: 55,
    kuotaPersen: 95,
    totalAnggaranBltBln: "Rp 16.500.000",
    totalAnggaranBltThn: "Rp 49.500.000",
    daftarKpmBlt: [
      {
        id: "blt-301",
        nik: "3507011234560001",
        nama: "Budi Santoso",
        skorDDK: 85,
        nominalPerBulan: "Rp 300.000",
        noSKKades: "SK/DSO/2026/004",
        tanggalPenyaluranTerakhir: "10/08/2026",
        statusVerifikasi: "Berita Acara Sah",
      },
    ],
  },
};

const mockDetailTitikGrafik: Record<
  string,
  { rtList: RTTahun[]; wargaList: WargaTahun[] }
> = {
  "2026": {
    rtList: [
      {
        idRT: "rt-01",
        namaRT: "RT 01 / RW 01",
        ketuaRT: "Bpk. Heri Setiawan",
        dusun: "Dusun Krajan",
        jumlahPenduduk: 1240,
      },
      {
        idRT: "rt-02",
        namaRT: "RT 02 / RW 01",
        ketuaRT: "Bpk. Agus Rahardjo",
        dusun: "Dusun Krajan",
        jumlahPenduduk: 1100,
      },
      {
        idRT: "rt-03",
        namaRT: "RT 03 / RW 01",
        ketuaRT: "Bpk. Bambang Sukoco",
        dusun: "Dusun Krajan",
        jumlahPenduduk: 1072,
      },
    ],
    wargaList: [
      {
        id: "w-101",
        nik: "3507011234560001",
        nama: "Budi Santoso",
        jenisKelamin: "L",
        tempatLahir: "Kab. Malang",
        tanggalLahir: "1985-05-12",
        rt: "RT 03 / RW 01",
        idRT: "rt-03",
        statusKependudukanAkhirTahun: "Penduduk Tetap",
        dukcapil: "Terverifikasi Valid",
      },
      {
        id: "w-102",
        nik: "3507019876540002",
        nama: "Siti Aminah",
        jenisKelamin: "P",
        tempatLahir: "Kota Surabaya",
        tanggalLahir: "1958-08-24",
        rt: "RT 01 / RW 01",
        idRT: "rt-01",
        statusKependudukanAkhirTahun: "Penduduk Tetap",
        dukcapil: "Terverifikasi Valid",
      },
    ],
  },
};

const mockExecutiveData: Record<string, any> = {
  "2026": {
    totalWarga: "3.412",
    totalKpmAktif: 245,
    paguAnggaranBansos: "Rp 360.000.000",
    realisasiAnggaran: "Rp 270.000.000",
    sisaPaguSiskeudes: "Rp 90.000.000 (Cadangan)",
    statusAlurSistem: "🔄 Tahap Penyaluran & Verifikasi Berjalan",
    isTahunAktif: true,
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
        daftarKpm: [
          {
            nik: "3507011234560001",
            nama: "Budi Santoso",
            rt: "RT 03 / RW 01",
            nominal: "Rp 300.000 / Bln",
          },
        ],
      },
    ],
    riwayatSkSelesai: [],
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
    paguAnggaranBansos: "Rp 312.000.000",
    realisasiAnggaran: "Rp 310.800.000 (99.6%)",
    sisaPaguSiskeudes: "Rp 1.200.000 (SILPA Efisiensi Kas)",
    statusAlurSistem: "✅ Laporan LPJ Siskeudes Disahkan",
    isTahunAktif: false,
    draftSkSiapTtd: [],
    riwayatSkSelesai: [
      {
        id: "sk-hist-2025-01",
        nomorDraft: "SK/DSO/2025/089",
        tentang: "Penetapan 260 KPM Bansos BLT-DD TA 2025",
        pengusul: "Ibu Siti (Sekretaris Desa)",
        waktuKeputusan: "18/12/2025 • 11:20 WIB",
        jumlahKpm: 260,
        totalNominal: "Rp 310.800.000",
        statusKeputusan: "Approved",
        catatan: "SK Sah & LPJ Siskeudes 2025 Rampung",
        daftarKpm: [
          {
            nik: "3507011234560001",
            nama: "Budi Santoso",
            rt: "RT 03 / RW 01",
            nominal: "Rp 300.000 / Bln",
          },
        ],
      },
    ],
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
    realisasiAnggaran: "Rp 336.000.000 (100%)",
    sisaPaguSiskeudes: "Rp 0 (Terserap Penuh)",
    statusAlurSistem: "✅ Laporan LPJ Siskeudes Disahkan",
    isTahunAktif: false,
    draftSkSiapTtd: [],
    riwayatSkSelesai: [
      {
        id: "sk-hist-2024-01",
        nomorDraft: "SK/DSO/2024/072",
        tentang: "Penetapan 280 KPM Bansos BLT-DD TA 2024",
        pengusul: "Ibu Siti (Sekretaris Desa)",
        waktuKeputusan: "20/12/2024 • 14:15 WIB",
        jumlahKpm: 280,
        totalNominal: "Rp 336.000.000",
        statusKeputusan: "Approved",
        catatan: "SK Sah & LPJ Siskeudes 2024 Rampung",
        daftarKpm: [],
      },
    ],
    sebaranKpmRt: [
      { rt: "RT 01 / RW 01", jumlahKpm: 48, kuotaPersen: 100 },
      { rt: "RT 02 / RW 01", jumlahKpm: 42, kuotaPersen: 100 },
      { rt: "RT 03 / RW 01", jumlahKpm: 62, kuotaPersen: 100 },
      { rt: "RT 04 / RW 01", jumlahKpm: 68, kuotaPersen: 100 },
      { rt: "RT 05 / RW 01", jumlahKpm: 52, kuotaPersen: 100 },
    ],
  },
};

function DashboardKadesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tahunPeriode, setTahunPeriodeState] = useState("2026");
  const [modalCardType, setModalCardType] = useState<string | null>(null);
  const [selectedSkDetail, setSelectedSkDetail] = useState<any | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pdfPreviewData, setPdfPreviewData] = useState<any | null>(null);
  const [showCetakSuccessModal, setShowCetakSuccessModal] = useState(false);

  // State Modal Grafis Tren
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedChartTahun, setSelectedChartTahun] = useState("2026");
  const [filterRTModal, setFilterRTModal] = useState<string>("SEMUA");
  const [searchWargaModal, setSearchWargaModal] = useState("");

  // State Modal Matriks Bansos Per-RT
  const [selectedMatriksRT, setSelectedMatriksRT] =
    useState<DetailBltRT | null>(null);
  const [searchKpmBlt, setSearchKpmBlt] = useState("");

  useEffect(() => {
    const queryTahun = searchParams.get("tahun");
    if (queryTahun) {
      setTahunPeriodeState(queryTahun);
      localStorage.setItem("kades_tahun_periode", queryTahun);
    } else {
      const savedTahun = localStorage.getItem("kades_tahun_periode");
      if (savedTahun) setTahunPeriodeState(savedTahun);
    }
  }, [searchParams]);

  const setTahunPeriode = (tahun: string) => {
    setTahunPeriodeState(tahun);
    localStorage.setItem("kades_tahun_periode", tahun);
    router.replace(`/kades/dashboard?tahun=${tahun}`);
  };

  const dataKades =
    mockExecutiveData[tahunPeriode] || mockExecutiveData["2026"];
  const isTahunBerjalan = dataKades.isTahunAktif !== false;

  const [notif, setNotif] = useState("");
  const [draftList, setDraftList] = useState(dataKades.draftSkSiapTtd || []);
  const [riwayatList, setRiwayatList] = useState<any[]>(
    dataKades.riwayatSkSelesai || [],
  );

  useEffect(() => {
    setDraftList(dataKades.draftSkSiapTtd || []);
    setRiwayatList(dataKades.riwayatSkSelesai || []);
  }, [tahunPeriode]);

  const handleApproveSk = (skItem: any) => {
    setDraftList((prev: any[]) => prev.filter((item) => item.id !== skItem.id));
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${tahunPeriode} • ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      nomorDraft: skItem.nomorDraft,
      tentang: skItem.tentang,
      pengusul: skItem.pengusul,
      waktuKeputusan: formattedDate,
      jumlahKpm: skItem.jumlahKpm,
      totalNominal: skItem.totalNominal,
      statusKeputusan: "Approved",
      catatan: "Disetujui Kades & Diterbitkan PDF Resmi",
      daftarKpm: skItem.daftarKpm || [],
    };

    setRiwayatList((prev) => [newHistoryItem, ...prev]);
    setPdfPreviewData(skItem);
    setSelectedSkDetail(null);
    setNotif(
      `✓ Sukses: Dokumen ${skItem.nomorDraft} disetujui! Dokumen PDF Simulasi resmi diterbitkan dan dicatat dalam arsip log.`,
    );
  };

  const handleConfirmReject = () => {
    if (!selectedSkDetail) return;
    const skItem = selectedSkDetail;
    const nomor = skItem.nomorDraft;

    setDraftList((prev: any[]) => prev.filter((item) => item.id !== skItem.id));
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${tahunPeriode} • ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      nomorDraft: skItem.nomorDraft,
      tentang: skItem.tentang,
      pengusul: skItem.pengusul,
      waktuKeputusan: formattedDate,
      jumlahKpm: skItem.jumlahKpm,
      totalNominal: skItem.totalNominal,
      statusKeputusan: "Rejected",
      catatan: rejectReason || "Perlu penyesuaian ulang kuota KPM",
      daftarKpm: skItem.daftarKpm || [],
    };

    setRiwayatList((prev) => [newHistoryItem, ...prev]);
    setShowRejectModal(false);
    setSelectedSkDetail(null);
    setNotif(
      `✕ Penolakan Dikirim ke Sekdes: Dokumen ${nomor} ditolak dengan alasan: "${rejectReason || "Perlu penyesuaian ulang kuota KPM"}" dan dicatat dalam arsip.`,
    );
    setRejectReason("");
  };

  const handleOpenDetailMatriksRT = (rtName: string) => {
    const detail = mockDetailBltMatriksRT[rtName] || {
      rt: rtName,
      ketuaRT: "Pengurus RT Pendamping",
      dusun: "Dusun Krajan",
      jumlahKpm: 35,
      kuotaPersen: 80,
      totalAnggaranBltBln: "Rp 10.500.000",
      totalAnggaranBltThn: "Rp 31.500.000",
      daftarKpmBlt: [],
    };
    setSelectedMatriksRT(detail);
    setSearchKpmBlt("");
  };

  // CONFIG GRAFIK TREN
  const limaTahunTerakhir = ["2022", "2023", "2024", "2025", "2026"];
  const trendPendudukData = {
    labels: limaTahunTerakhir,
    datasets: [
      {
        label: "Total Penduduk Terdata",
        data: [3120, 3195, 3280, 3350, 3412],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.08)",
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        borderWidth: 2.5,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const trendPendudukOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        const tahunTerpilih = limaTahunTerakhir[index];
        setSelectedChartTahun(tahunTerpilih);
        setFilterRTModal("SEMUA");
        setSearchWargaModal("");
        setShowChartModal(true);
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { suggestedMin: 3000, suggestedMax: 3500 },
    },
  };

  const dataTitikTahun = useMemo(() => {
    return (
      mockDetailTitikGrafik[selectedChartTahun] || mockDetailTitikGrafik["2026"]
    );
  }, [selectedChartTahun]);

  const wargaModalFiltered = useMemo(() => {
    return dataTitikTahun.wargaList.filter((w) => {
      const matchSearch =
        !searchWargaModal ||
        w.nama.toLowerCase().includes(searchWargaModal.toLowerCase()) ||
        w.nik.includes(searchWargaModal);
      const matchRT = filterRTModal === "SEMUA" || w.idRT === filterRTModal;
      return matchSearch && matchRT;
    });
  }, [dataTitikTahun, filterRTModal, searchWargaModal]);

  const kpmBltFiltered = useMemo(() => {
    if (!selectedMatriksRT) return [];
    const q = searchKpmBlt.toLowerCase().trim();
    if (!q) return selectedMatriksRT.daftarKpmBlt;
    return selectedMatriksRT.daftarKpmBlt.filter(
      (kpm) => kpm.nama.toLowerCase().includes(q) || kpm.nik.includes(q),
    );
  }, [selectedMatriksRT, searchKpmBlt]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased relative">
      <KadesHeader
        tahunPeriode={tahunPeriode}
        setTahunPeriode={setTahunPeriode}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-6">
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-bold shadow-xs flex items-center justify-between">
            <span>{notif}</span>
            <button
              onClick={() => setNotif("")}
              className="text-slate-400 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* BANNER EKSEKUTIF */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold mb-1">
              👑 Bpk. Ahmad (Kepala Desa)
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Ringkasan Kebijakan & Kondisi Desa ({tahunPeriode})
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Pantau metrik utama, identifikasi status alur sistem, dan sahkan
              rekomendasi SK penetapan bantuan sosial.
            </p>
          </div>

          <div className="px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl shrink-0 self-start sm:self-auto text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Alur Sistem
            </span>
            <span className="text-xs font-black text-slate-800">
              {dataKades.statusAlurSistem}
            </span>
          </div>
        </div>

        {/* BANNER VERIFIKASI */}
        {isTahunBerjalan && draftList.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔔</span>
              <div>
                <strong className="text-amber-900 block text-xs">
                  PEMBERITAHUAN VERIFIKASI KADES:
                </strong>
                <span className="text-slate-700 font-medium">
                  Terdapat <strong>{draftList.length} Draft SK Bansos</strong>{" "}
                  dari Sekdes yang memerlukan pengecekan & pengesahan Kepala
                  Desa.
                </span>
              </div>
            </div>
            <a
              href="#seksi-draft-sk"
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-xl transition cursor-pointer shrink-0"
            >
              Tinjau Sekarang ↓
            </a>
          </div>
        )}

        {/* 1. KARTU ANGKA KUNCI */}
        <ExecutiveStatCards
          dataKades={dataKades}
          tahunPeriode={tahunPeriode}
          onOpenModal={(t) => setModalCardType(t)}
        />

        {/* 1.5 AKSES CEPAT — PROGRAM BANSOS & SK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card: Program Bansos + Export SK */}
          <Link
            href={`/kades/program?tahun=${tahunPeriode}`}
            id="link-program-bansos"
            className="group relative bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-sm hover:shadow-indigo-200/60 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex items-center justify-between gap-4"
          >
            {/* BG decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-full" />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white border border-white/30 rounded-md text-[10px] font-bold uppercase mb-2">
                📋 Program
              </span>
              <h3 className="text-base font-extrabold text-white">
                Program Bansos & Ekspor SK
              </h3>
              <p className="text-[11px] text-indigo-200 mt-0.5 leading-relaxed">
                Lihat daftar program, penerima APPROVED & cetak Surat Keputusan (PDF)
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-2xl shrink-0 transition">
              📄
            </div>
          </Link>

          {/* Card: Detail KPM per RT */}
          <Link
            href={`/kades/detail-kpm?tahun=${tahunPeriode}`}
            id="link-detail-kpm"
            className="group relative bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-sm hover:shadow-emerald-200/60 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-full" />
            </div>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 text-white border border-white/30 rounded-md text-[10px] font-bold uppercase mb-2">
                👥 KPM
              </span>
              <h3 className="text-base font-extrabold text-white">
                Detail KPM Bansos Per RT
              </h3>
              <p className="text-[11px] text-emerald-200 mt-0.5 leading-relaxed">
                Tinjau tren penerima manfaat 5 tahun & daftar warga per RT
              </p>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-2xl shrink-0 transition">
              👥
            </div>
          </Link>
        </div>

        {/* 2. GRAFIK TREN PERTUMBUHAN PENDUDUK */}
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
                untuk membuka rincian modal di tengah layar.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold border border-blue-100">
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

        {/* 3. PANEL EKSEKUSI PERSETUJUAN DRAFT SK */}
        {isTahunBerjalan ? (
          <div
            id="seksi-draft-sk"
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-bold mb-1">
                  ✍️ Pengesahan Resmi Kepala Desa
                </div>
                <h3 className="text-base font-bold text-slate-950">
                  Persetujuan Draft SK Penetapan Penerima Bansos ({tahunPeriode}
                  )
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekomendasi dari Sekdes yang telah disesuaikan dengan kuota
                  Pagu Siskeudes dan Verifikasi RT.
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
                        Pengusul: <strong>{item.pengusul}</strong> • Total
                        Kuota: <strong>{item.jumlahKpm} KPM</strong> • Total
                        Anggaran:{" "}
                        <strong className="text-emerald-800">
                          {item.totalNominal}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => setSelectedSkDetail(item)}
                        className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        Lihat Detail →
                      </button>
                    </div>
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
        ) : (
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold flex items-center justify-between">
            <span>
              🔒 Periode Anggaran Tahun {tahunPeriode} telah ditutup & disahkan.
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px]">
              Tahun Terkunci
            </span>
          </div>
        )}

        {/* 4. RIWAYAT ARSIP LOG TABLE */}
        <SkHistoryLogTable
          riwayatList={riwayatList}
          tahunPeriode={tahunPeriode}
          onOpenPdf={(item) => setPdfPreviewData(item)}
        />

        {/* 5. RADAR KETERJANGKAUAN BANSOS PER RT */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                📊 Matriks Pemerataan Sebaran Penerima Bansos Per RT (
                {tahunPeriode})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik kartu RT di bawah untuk melihat{" "}
                <strong className="text-emerald-700">
                  detail alokasi anggaran & daftar penerima BLT Dana Desa
                </strong>{" "}
                di RT tersebut.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dataKades.sebaranKpmRt && dataKades.sebaranKpmRt.length > 0 ? (
              dataKades.sebaranKpmRt.map((rt: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleOpenDetailMatriksRT(rt.rt)}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-400 rounded-2xl space-y-3 cursor-pointer transition-all duration-200 group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-900 transition-colors">
                      {rt.rt}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {rt.jumlahKpm} KPM
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rt.kuotaPersen >= 90 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${rt.kuotaPersen}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100/80">
                    <span className="text-slate-400 font-semibold text-[10px]">
                      Kapasitas: {rt.kuotaPersen}%
                    </span>
                    <span className="text-emerald-600 font-extrabold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Detail →
                    </span>
                  </div>
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

      {/* MODAL CENTER MATRIKS RT BLT */}
      {selectedMatriksRT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase">
                  MONITORING BLT DANA DESA — {selectedMatriksRT.rt}
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  Rincian Penerima & Realisasi Anggaran BLT ({tahunPeriode})
                </h3>
              </div>
              <button
                onClick={() => setSelectedMatriksRT(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Penerima BLT-DD Aktif
                  </span>
                  <div className="text-xl font-black text-emerald-950 font-mono">
                    {selectedMatriksRT.jumlahKpm} KPM
                  </div>
                  <span className="text-[11px] text-emerald-800 block">
                    Kapasitas Wilayah: {selectedMatriksRT.kuotaPersen}%
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Alokasi Anggaran / Bulan
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {selectedMatriksRT.totalAnggaranBltBln}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    @ Rp 300.000 / KPM / Bulan
                  </span>
                </div>

                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">
                    Total Anggaran Tahunan
                  </span>
                  <div className="text-xl font-black text-blue-950 font-mono">
                    {selectedMatriksRT.totalAnggaranBltThn}
                  </div>
                  <span className="text-[11px] text-blue-800 block">
                    Ketua RT: <strong>{selectedMatriksRT.ketuaRT}</strong>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden space-y-3 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      📋 Master Penerima BLT Dana Desa — {selectedMatriksRT.rt}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Verifikasi SK Kades & Tanggal Penyaluran Terakhir
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Cari nama atau NIK KPM..."
                    value={searchKpmBlt}
                    onChange={(e) => setSearchKpmBlt(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-600 sm:w-64"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-2.5">No</th>
                        <th className="p-2.5">Identitas KPM / NIK</th>
                        <th className="p-2.5 text-center">Skor DDK</th>
                        <th className="p-2.5">Nominal BLT</th>
                        <th className="p-2.5">SK Kades Penetapan</th>
                        <th className="p-2.5">Penyaluran Terakhir</th>
                        <th className="p-2.5 text-right">Verifikasi BA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {kpmBltFiltered.length > 0 ? (
                        kpmBltFiltered.map((kpm, idx) => (
                          <tr
                            key={kpm.id}
                            className="hover:bg-slate-50/70 transition"
                          >
                            <td className="p-2.5 font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-2.5">
                              <p className="font-bold text-slate-900">
                                {kpm.nama}
                              </p>
                              <p className="font-mono text-[10px] text-slate-400">
                                NIK: {kpm.nik}
                              </p>
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold text-amber-900">
                              {kpm.skorDDK} Pts
                            </td>
                            <td className="p-2.5 font-mono font-bold text-emerald-800">
                              {kpm.nominalPerBulan} / Bln
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-600">
                              {kpm.noSKKades}
                            </td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-800">
                              {kpm.tanggalPenyaluranTerakhir}
                            </td>
                            <td className="p-2.5 text-right">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                                ✓ {kpm.statusVerifikasi}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-6 text-center text-slate-400 text-xs"
                          >
                            Tidak ditemukan data KPM BLT di{" "}
                            {selectedMatriksRT.rt} untuk pencarian ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Pagu BLT per KPM: <strong>Rp 300.000 / Bulan</strong>
              </span>
              <button
                onClick={() => setSelectedMatriksRT(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Modal Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP CENTER TITIK GRAFIK */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase">
                  MASTER DATA PENDUDUK TAHUN {selectedChartTahun}
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  Rekapitulasi Wilayah RT Periode Akhir Tahun{" "}
                  {selectedChartTahun}
                </h3>
              </div>
              <button
                onClick={() => setShowChartModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  📌 Sebaran Jumlah Penduduk Per-RT (Klik Card untuk Memfilter):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFilterRTModal("SEMUA")}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      filterRTModal === "SEMUA"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200/80"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase opacity-80">
                      Seluruh Wilayah
                    </span>
                    <p className="text-base font-extrabold mt-1">
                      Gabungan Semua RT
                    </p>
                    <span className="text-xs font-mono font-bold mt-2">
                      Total Seluruh RT
                    </span>
                  </div>

                  {dataTitikTahun.rtList.map((rt) => {
                    const isSelected = filterRTModal === rt.idRT;
                    return (
                      <div
                        key={rt.idRT}
                        onClick={() => setFilterRTModal(rt.idRT)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200/80"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-[10px] font-extrabold uppercase ${isSelected ? "text-blue-100" : "text-slate-500"}`}
                            >
                              {rt.dusun}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded">
                                ✓ Aktif
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-extrabold mt-0.5">
                            {rt.namaRT}
                          </p>
                          <p
                            className={`text-[11px] font-medium mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-500"}`}
                          >
                            Ketua RT: <strong>{rt.ketuaRT}</strong>
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-current/10 flex justify-between items-center">
                          <span className="text-[10px] opacity-80">
                            Jumlah Jiwa:
                          </span>
                          <span className="text-sm font-black font-mono">
                            {rt.jumlahPenduduk} Jiwa
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden space-y-3 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    📋 Master Data Warga Terdaftar (Tahun {selectedChartTahun})
                  </h4>
                  <input
                    type="text"
                    placeholder="Cari nama atau NIK warga..."
                    value={searchWargaModal}
                    onChange={(e) => setSearchWargaModal(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 sm:w-64"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-2.5">No</th>
                        <th className="p-2.5">Identitas Warga / NIK</th>
                        <th className="p-2.5">TTL & JK</th>
                        <th className="p-2.5">Wilayah RT</th>
                        <th className="p-2.5">Status Akhir Tahun</th>
                        <th className="p-2.5 text-right">Dukcapil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {wargaModalFiltered.length > 0 ? (
                        wargaModalFiltered.map((warga, idx) => (
                          <tr
                            key={warga.id}
                            className="hover:bg-slate-50/70 transition"
                          >
                            <td className="p-2.5 font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-2.5">
                              <p className="font-bold text-slate-900">
                                {warga.nama}
                              </p>
                              <p className="font-mono text-[10px] text-slate-400">
                                NIK: {warga.nik}
                              </p>
                            </td>
                            <td className="p-2.5">
                              <p className="font-medium text-slate-700">
                                {warga.tempatLahir}, {warga.tanggalLahir}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">
                                JK: {warga.jenisKelamin}
                              </p>
                            </td>
                            <td className="p-2.5 font-bold text-slate-800">
                              {warga.rt}
                            </td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  warga.statusKependudukanAkhirTahun ===
                                  "Penduduk Tetap"
                                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                    : "bg-blue-50 text-blue-900 border border-blue-200"
                                }`}
                              >
                                {warga.statusKependudukanAkhirTahun}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                                ✓ {warga.dukcapil}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-6 text-center text-slate-400 text-xs"
                          >
                            Tidak ditemukan data warga untuk filter ini pada
                            tahun {selectedChartTahun}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Menampilkan <strong>{wargaModalFiltered.length} Warga</strong>{" "}
                terdaftar.
              </span>
              <button
                onClick={() => setShowChartModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Modal Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL SK / LOG REVIEW */}
      {selectedSkDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  DRAFT SK PERLU VERIFIKASI KADES
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  {selectedSkDetail.nomorDraft}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSkDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">
                  Perihal Permohonan SK
                </span>
                <p className="font-extrabold text-slate-900">
                  {selectedSkDetail.tentang}
                </p>
                <p className="text-[11px] text-slate-600">
                  Pengusul: <strong>{selectedSkDetail.pengusul}</strong> •
                  Kuota: <strong>{selectedSkDetail.jumlahKpm} KPM</strong> •
                  Nominal:{" "}
                  <strong className="text-emerald-800">
                    {selectedSkDetail.totalNominal}
                  </strong>
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Daftar Calon Penerima Manfaat (KPM) Lampiran:
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="p-2.5">No</th>
                        <th className="p-2.5">Nama KPM / NIK</th>
                        <th className="p-2.5">Wilayah RT</th>
                        <th className="p-2.5 text-right">Alokasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedSkDetail.daftarKpm?.map(
                        (kpm: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-400">
                              {i + 1}
                            </td>
                            <td className="p-2.5">
                              <p className="font-bold text-slate-900">
                                {kpm.nama}
                              </p>
                              <p className="font-mono text-[10px] text-slate-400">
                                {kpm.nik}
                              </p>
                            </td>
                            <td className="p-2.5 font-bold text-slate-700">
                              {kpm.rt}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                              {kpm.nominal}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                ✕ Reject / Tolak SK
              </button>
              <button
                onClick={() => handleApproveSk(selectedSkDetail)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>✒️</span>
                <span>Approve & Sahkan SK →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJECT */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Alasan Penolakan / Catatan Revisi Sekdes
            </h3>
            <textarea
              placeholder="Tuliskan catatan revisi..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-600"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOG/PDF PREVIEW - DIPERBAIKI SESUAI STATUS (APPROVED vs REJECTED) */}
      {pdfPreviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase ${
                    pdfPreviewData.statusKeputusan === "Approved"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}
                >
                  {pdfPreviewData.statusKeputusan === "Approved"
                    ? "DOKUMEN PDF RESMI (APPROVED)"
                    : "DRAFT SK DITOLAK / PERLU REVISI SEKDES"}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Draft SK No: {pdfPreviewData.nomorDraft}
                </h3>
              </div>
              <button
                onClick={() => setPdfPreviewData(null)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-900 leading-relaxed font-sans bg-white">
              {/* TAMPILAN JIKA STATUS REJECTED */}
              {pdfPreviewData.statusKeputusan === "Rejected" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-900 font-black text-xs">
                      <span>💬</span>
                      <span>CATATAN PENOLAKAN DARI KEPALA DESA:</span>
                    </div>
                    <p className="text-slate-800 font-bold bg-white p-3 rounded-xl border border-rose-100 italic leading-relaxed">
                      "
                      {pdfPreviewData.catatan ||
                        "Perlu penyesuaian ulang kuota KPM."}
                      "
                    </p>
                    <span className="text-[10px] font-medium text-rose-700 block text-right pt-0.5">
                      Waktu Keputusan: {pdfPreviewData.waktuKeputusan}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Perihal Pengajuan Sekdes:
                    </span>
                    <p className="font-extrabold text-slate-900">
                      {pdfPreviewData.tentang}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Pengusul:{" "}
                      <strong>
                        {pdfPreviewData.pengusul || "Ibu Siti (Sekdes)"}
                      </strong>{" "}
                      • Total Kuota:{" "}
                      <strong>{pdfPreviewData.jumlahKpm} KPM</strong> •
                      Anggaran:{" "}
                      <strong className="text-emerald-800">
                        {pdfPreviewData.totalNominal}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">
                      Lampiran Daftar Calon Penerima Manfaat (KPM) Dalam Draft:
                    </h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                            <th className="p-2.5">No</th>
                            <th className="p-2.5">Nama KPM / NIK</th>
                            <th className="p-2.5">Wilayah RT</th>
                            <th className="p-2.5 text-right">
                              Alokasi Bantuan
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {pdfPreviewData.daftarKpm &&
                          pdfPreviewData.daftarKpm.length > 0 ? (
                            pdfPreviewData.daftarKpm.map(
                              (kpm: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-bold text-slate-400">
                                    {i + 1}
                                  </td>
                                  <td className="p-2.5">
                                    <p className="font-bold text-slate-900">
                                      {kpm.nama}
                                    </p>
                                    <p className="font-mono text-[10px] text-slate-400">
                                      {kpm.nik}
                                    </p>
                                  </td>
                                  <td className="p-2.5 font-bold text-slate-700">
                                    {kpm.rt}
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                                    {kpm.nominal}
                                  </td>
                                </tr>
                              ),
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="p-4 text-center text-slate-400 text-xs"
                              >
                                Daftar KPM terlampir dalam draft berkas Sekdes.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAMPILAN JIKA STATUS APPROVED (FORMAT SURAT PDF KOP RESMI) */
                <div className="space-y-4 font-serif">
                  <div className="text-center border-b-2 border-slate-900 pb-3 space-y-0.5 font-sans">
                    <h4 className="font-extrabold text-sm uppercase text-slate-950">
                      PEMERINTAH KABUPATEN MALANG
                    </h4>
                    <p className="font-bold text-xs uppercase text-slate-800">
                      KECAMATAN KARANGPLOSO — DESA DIGITAL
                    </p>
                  </div>
                  <div className="text-center space-y-1 font-sans">
                    <h5 className="font-bold text-xs underline uppercase">
                      KEPUTUSAN KEPALA DESA DIGITAL
                    </h5>
                    <p className="font-mono text-[11px] text-slate-600">
                      Nomor: {pdfPreviewData.nomorDraft}
                    </p>
                    <p className="font-bold text-xs uppercase text-slate-900 pt-1">
                      TENTANG {pdfPreviewData.tentang}
                    </p>
                  </div>
                  <div className="space-y-2 text-[11px] font-sans">
                    <p>
                      <strong>MEMPERHATIKAN:</strong> Hasil musyawarah
                      verifikasi berjenjang dari Pengurus RT, serta rekomendasi
                      Sekretaris Desa atas kuesioner kelayakan Prodeskel DDK.
                    </p>
                    <p>
                      <strong>MEMUTUSKAN:</strong> Menetapkan nama-nama
                      terlampir sebagai penerima resmi bantuan sosial
                      dialokasikan dari Siskeudes TA {tahunPeriode}.
                    </p>
                  </div>
                  <div className="pt-2 font-sans border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      LAMPIRAN DAFTAR PENERIMA (TOTAL{" "}
                      {pdfPreviewData.jumlahKpm ||
                        pdfPreviewData.daftarKpm?.length}{" "}
                      KPM):
                    </span>
                    <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {pdfPreviewData.daftarKpm?.map((kpm: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between text-[10px] border-b border-slate-200/60 pb-1 last:border-0"
                        >
                          <span>
                            {i + 1}. {kpm.nama} ({kpm.rt})
                          </span>
                          <span className="font-bold text-emerald-900">
                            {kpm.nominal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 font-sans flex justify-end">
                    <div className="text-center space-y-12">
                      <p className="text-[11px]">
                        Ditetapkan di Desa Digital,{" "}
                        {pdfPreviewData.tanggalMasuk ||
                          pdfPreviewData.waktuKeputusan}
                        <br />
                        <strong>KEPALA DESA DIGITAL</strong>
                      </p>
                      <p className="font-bold underline text-xs">
                        ( BPK. AHMAD )
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {pdfPreviewData.statusKeputusan === "Approved"
                  ? `Nominal Total: ${pdfPreviewData.totalNominal}`
                  : "Status: Berkas Ditolak (Menunggu Revisi Sekdes)"}
              </span>

              {pdfPreviewData.statusKeputusan === "Approved" ? (
                <button
                  onClick={() => {
                    setPdfPreviewData(null);
                    setShowCetakSuccessModal(true);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <span>🖨️</span>
                  <span>Cetak Surat PDF (Ke Siskeudes)</span>
                </button>
              ) : (
                <button
                  onClick={() => setPdfPreviewData(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tutup Rincian Revisi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES CETAK */}
      {showCetakSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 text-xl font-black flex items-center justify-center mx-auto">
              ✓
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-950">
                Simulasi Cetak PDF Berhasil Disimpan!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dokumen SK Penetapan telah diterbitkan dan dicatat dalam log
                sistem Kades & Sekdes untuk ditindaklanjuti ke Siskeudes.
              </p>
            </div>
            <button
              onClick={() => setShowCetakSuccessModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Selesai & Tutup
            </button>
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
