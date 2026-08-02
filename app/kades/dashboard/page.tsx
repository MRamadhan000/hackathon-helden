"use client";

import React, { useState, useEffect, Suspense } from "react";
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

// Mock Data Eksekutif Kades Per Tahun (2022 - 2026)
const mockExecutiveData: Record<string, any> = {
  "2026": {
    totalWarga: "3.412",
    totalKpmAktif: 245,
    paguAnggaranBansos: "Rp 360.000.000",
    realisasiAnggaran: "Rp 270.000.000",
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
        daftarKpm: [
          {
            nik: "3507011234560001",
            nama: "Budi Santoso",
            rt: "RT 03 / RW 01",
            nominal: "Rp 300.000 / Bln",
          },
          {
            nik: "3507019876540002",
            nama: "Siti Aminah",
            rt: "RT 01 / RW 01",
            nominal: "Rp 300.000 / Bln",
          },
          {
            nik: "3507011122330005",
            nama: "Slamet Riyadi",
            rt: "RT 03 / RW 01",
            nominal: "Rp 300.000 / Bln",
          },
        ],
      },
    ],
    riwayatSkSelesai: [
      {
        id: "sk-hist-01",
        nomorDraft: "SK/DSO/2026/003",
        tentang: "Penetapan 30 KPM Bansos BLT-DD Tahap II",
        pengusul: "Ibu Siti (Sekretaris Desa)",
        waktuKeputusan: "15/05/2026 • 10:30 WIB",
        jumlahKpm: 30,
        totalNominal: "Rp 90.000.000",
        statusKeputusan: "Approved",
        catatan: "SK Sah & Resmi Masuk Siskeudes",
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
    realisasiAnggaran: "Rp 310.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    riwayatSkSelesai: [],
    sebaranKpmRt: [],
  },
  "2024": {
    totalWarga: "3.280",
    totalKpmAktif: 280,
    paguAnggaranBansos: "Rp 336.000.000",
    realisasiAnggaran: "Rp 336.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    riwayatSkSelesai: [],
    sebaranKpmRt: [],
  },
  "2023": {
    totalWarga: "3.195",
    totalKpmAktif: 268,
    paguAnggaranBansos: "Rp 322.000.000",
    realisasiAnggaran: "Rp 322.000.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    riwayatSkSelesai: [],
    sebaranKpmRt: [],
  },
  "2022": {
    totalWarga: "3.120",
    totalKpmAktif: 252,
    paguAnggaranBansos: "Rp 302.400.000",
    realisasiAnggaran: "Rp 302.400.000",
    sisaPaguSiskeudes: "Rp 0",
    statusAlurBansos: "Selesai (Terkunci)",
    draftSkSiapTtd: [],
    riwayatSkSelesai: [],
    sebaranKpmRt: [],
  },
};

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
  "2025": [],
  "2024": [],
  "2023": [],
  "2022": [],
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
  const [notif, setNotif] = useState("");
  const [draftList, setDraftList] = useState(dataKades.draftSkSiapTtd);
  const [riwayatList, setRiwayatList] = useState<any[]>(
    dataKades.riwayatSkSelesai || [],
  );

  useEffect(() => {
    setDraftList(dataKades.draftSkSiapTtd);
    setRiwayatList(dataKades.riwayatSkSelesai || []);
  }, [tahunPeriode]);

  const handleApproveSk = (skItem: any) => {
    setDraftList((prev: any[]) => prev.filter((item) => item.id !== skItem.id));
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} • ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;

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
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} • ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")} WIB`;

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

  // CONFIG TREN PERTUMBUHAN DENGAN GAYA PRESISI SAMA PERSIS DENGAN SEBELUMNYA
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

  const trendPendudukOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      y: {
        suggestedMin: 3000,
        suggestedMax: 3500,
        grid: { color: "#f1f5f9" },
        ticks: {
          stepSize: 100,
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
      <KadesHeader
        tahunPeriode={tahunPeriode}
        setTahunPeriode={setTahunPeriode}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
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

        {/* BANNER KADES */}
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

        {/* 1. KARTU STATISTIK UTAMA */}
        <ExecutiveStatCards
          dataKades={dataKades}
          tahunPeriode={tahunPeriode}
          onOpenModal={(t) => setModalCardType(t)}
        />

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

        {/* BANNER NOTIFIKASI */}
        {draftList.length > 0 && (
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

        {/* 3. PANEL EKSEKUSI PERSETUJUAN DRAFT SK */}
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

        {/* 4. RIWAYAT ARSIP LOG TABLE */}
        <SkHistoryLogTable
          riwayatList={riwayatList}
          tahunPeriode={tahunPeriode}
          onOpenPdf={(item) => setPdfPreviewData(item)}
        />

        {/* 5. RADAR SEBARAN RT */}
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
                      className={`h-full rounded-full ${rt.kuotaPersen >= 90 ? "bg-amber-500" : "bg-emerald-500"}`}
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

      {/* MODAL POP-UP DETAIL CARD KUNCI */}
      {modalCardType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {modalCardType === "penduduk" && "Rincian Data Penduduk Desa"}
                {modalCardType === "kpm" && "Rincian Data KPM Bansos Aktif"}
                {modalCardType === "anggaran" &&
                  "Rincian Total Anggaran Bansos"}
                {modalCardType === "realisasi" &&
                  "Rincian Realisasi & Sisa Pagu"}
              </h3>
              <button
                onClick={() => setModalCardType(null)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
              {modalCardType === "penduduk" && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-950">
                    Total Penduduk Terdata:{" "}
                    <strong>{dataKades.totalWarga} Jiwa</strong>
                  </div>
                  <p className="text-slate-600">
                    Master data kependudukan bersumber dari hasil pendaftaran
                    warga baru & mutasi yang telah divalidasi oleh pengurus RT
                    dan Sekretaris Desa.
                  </p>
                </div>
              )}
              {modalCardType === "kpm" && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-950">
                    Total Penerima Bansos Sah:{" "}
                    <strong>{dataKades.totalKpmAktif} Keluarga</strong>
                  </div>
                  <p className="text-slate-600">
                    Seluruh KPM telah memenuhi kriteria kelayakan kuesioner DDK
                    Prodeskel dan tercantum dalam Surat Keputusan Kepala Desa.
                  </p>
                </div>
              )}
              {modalCardType === "anggaran" && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950">
                    Pagu Anggaran Total:{" "}
                    <strong>{dataKades.paguAnggaranBansos}</strong>
                  </div>
                  <p className="text-slate-600">
                    Alokasi dana bantuan sosial bersumber dari Dana Desa
                    (Siskeudes) untuk memperkuat jaring pengaman sosial warga
                    kurang mampu.
                  </p>
                </div>
              )}
              {modalCardType === "realisasi" && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-950">
                    Realisasi Terserap:{" "}
                    <strong>{dataKades.realisasiAnggaran}</strong>
                    <br />
                    Sisa Cadangan Pagu:{" "}
                    <strong>{dataKades.sisaPaguSiskeudes}</strong>
                  </div>
                  <p className="text-slate-600">
                    Realisasi dihitung berdasarkan penyaluran bantuan sosial
                    yang telah disahkan melalui SK Kepala Desa.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setModalCardType(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP DETAIL SK */}
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

      {/* MODAL PDF PREVIEW */}
      {pdfPreviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DOKUMEN PDF RESMI (LABEL SIMULASI PERMENDAGRI)
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  SK Kepala Desa No: {pdfPreviewData.nomorDraft}
                </h3>
              </div>
              <button
                onClick={() => setPdfPreviewData(null)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-900 leading-relaxed font-serif bg-white">
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
                  <strong>MEMPERHATIKAN:</strong> Hasil musyawarah verifikasi
                  berjenjang dari Pengurus RT, serta rekomendasi Sekretaris Desa
                  atas kuesioner kelayakan Prodeskel DDK.
                </p>
                <p>
                  <strong>MEMUTUSKAN:</strong> Menetapkan nama-nama terlampir
                  sebagai penerima resmi bantuan sosial dialokasikan dari
                  Siskeudes TA {tahunPeriode}.
                </p>
              </div>
              <div className="pt-2 font-sans border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  LAMPIRAN DAFTAR PENERIMA (TOTAL{" "}
                  {pdfPreviewData.jumlahKpm || pdfPreviewData.daftarKpm?.length}{" "}
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
                  <p className="font-bold underline text-xs">( BPK. AHMAD )</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Nominal Total: {pdfPreviewData.totalNominal}
              </span>
              <button
                onClick={() => {
                  setPdfPreviewData(null);
                  setShowCetakSuccessModal(true);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <span>🖨️</span>
                <span>Cetak Surat PDF (Ke Siskeudes)</span>
              </button>
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
              <h3 className="text-base font-extrabold text-slate-900">
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

      {/* DRAWER SETENGAH LAYAR UNTUK DETAIL TITIK GRAFIK TREN */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs transition-opacity">
          <div className="w-full md:w-1/2 bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
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
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari berdasarkan Nama, NIK, atau RT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

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
                              JK: {warga.jenisKelamin}
                            </p>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                              {warga.rt}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${warga.statusPenduduk === "Tetap" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-blue-50 text-blue-800 border border-blue-100"}`}
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
                          Tidak ditemukan data warga.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Total Tampil:{" "}
                <strong>{filteredDrawerWarga.length} Warga</strong>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
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
