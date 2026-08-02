"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSurveiKelayakan } from "@/hooks/cores/useSurveiKelayakan";
import { SurveiKelayakan } from "@/types/kelayakan";

// Indikator Kondisi Rumah & Ekonomi Prodeskel DDK
interface IndikatorRumahDDK {
  bahanLantaiUtama: string;
  bahanDindingUtama: string;
  sumberAirMinumUtama: string;
  fasilitasBABSanitasi: string;
  mataPencaharianUtama: string;
  adaLansiaDisabilitas: "Ya" | "Tidak";
}

// Profil Lengkap Kependudukan KPM
interface ProfilKPMDetail {
  nik: string;
  noKK: string;
  nama: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  pekerjaan: string;
  alamatDomisili: string;
}

interface CalonKPM {
  id: string;
  skorDDK: number;
  jenisBantuan: string;
  nominalPerBulan: string;
  statusRekomendasi: "Disetujui" | "Ditangguhkan" | "Menunggu Review";
  profil: ProfilKPMDetail;
  kondisiRumah: IndikatorRumahDDK;
}

interface KelompokRT {
  idRT: string;
  namaRT: string;
  ketuaRT: string;
  dusun: string;
  daftarKPM: CalonKPM[];
}

interface DraftSKRencana {
  noDraftSK: string;
  tahunAnggaran: string;
  totalPaguAnggaran: string;
  tanggalDraft: string;
  statusDokumen: "Draft Siap" | "Terkirim ke Kades" | "Ditetapkan Kades";
  kelompokRTList: KelompokRT[];
}

const mockDataPerRT: Record<string, DraftSKRencana> = {
  "2026": {
    noDraftSK: "470 / 012 / SK-KPM / 2026",
    tahunAnggaran: "2026",
    totalPaguAnggaran: "Rp 7.500.000 / Bulan",
    tanggalDraft: "22 Maret 2026",
    statusDokumen: "Draft Siap",
    kelompokRTList: [
      {
        idRT: "rt-01",
        namaRT: "RT 01 / RW 01",
        ketuaRT: "Bpk. Heri Setiawan",
        dusun: "Dusun Krajan",
        daftarKPM: [
          {
            id: "kpm-101",
            skorDDK: 80,
            jenisBantuan: "BLT Dana Desa",
            nominalPerBulan: "Rp 300.000",
            statusRekomendasi: "Menunggu Review",
            profil: {
              nik: "3507019876540002",
              noKK: "3507010203580001",
              nama: "Siti Aminah",
              tempatLahir: "Kota Surabaya",
              tanggalLahir: "24 Agustus 1958",
              jenisKelamin: "Perempuan",
              agama: "Islam",
              pekerjaan: "Tidak Bekerja / Lansia",
              alamatDomisili: "RT 01 / RW 01 Dusun Krajan",
            },
            kondisiRumah: {
              bahanLantaiUtama: "Semen Kasar",
              bahanDindingUtama: "Papan Kayu Lapuk",
              sumberAirMinumUtama: "Sumur Terlindung",
              fasilitasBABSanitasi: "Jamban Pribadi (Sederhana)",
              mataPencaharianUtama: "Tidak Bekerja / Lansia",
              adaLansiaDisabilitas: "Ya",
            },
          },
          {
            id: "kpm-102",
            skorDDK: 76,
            jenisBantuan: "BLT Dana Desa",
            nominalPerBulan: "Rp 300.000",
            statusRekomendasi: "Menunggu Review",
            profil: {
              nik: "3507017766550004",
              noKK: "3507010101850002",
              nama: "Supardi",
              tempatLahir: "Kab. Malang",
              tanggalLahir: "10 Mei 1970",
              jenisKelamin: "Laki-Laki",
              agama: "Islam",
              pekerjaan: "Buruh Harian Lepas",
              alamatDomisili: "RT 01 / RW 01 Dusun Krajan",
            },
            kondisiRumah: {
              bahanLantaiUtama: "Semen Rusak",
              bahanDindingUtama: "Tembok Tanpa Plester",
              sumberAirMinumUtama: "Sumur Gali",
              fasilitasBABSanitasi: "Jamban Sederhana",
              mataPencaharianUtama: "Buruh Harian",
              adaLansiaDisabilitas: "Tidak",
            },
          },
        ],
      },
      {
        idRT: "rt-02",
        namaRT: "RT 02 / RW 01",
        ketuaRT: "Bpk. Agus Rahardjo",
        dusun: "Dusun Krajan",
        daftarKPM: [
          {
            id: "kpm-201",
            skorDDK: 90,
            jenisBantuan: "BLT Dana Desa",
            nominalPerBulan: "Rp 300.000",
            statusRekomendasi: "Menunggu Review",
            profil: {
              nik: "3507016677880009",
              noKK: "3507010202900007",
              nama: "Martono",
              tempatLahir: "Kab. Blitar",
              tanggalLahir: "12 Januari 1965",
              jenisKelamin: "Laki-Laki",
              agama: "Islam",
              pekerjaan: "Buruh Tani",
              alamatDomisili: "RT 02 / RW 01 Dusun Krajan",
            },
            kondisiRumah: {
              bahanLantaiUtama: "Tanah / Semen Rusak",
              bahanDindingUtama: "Anyaman Bambu",
              sumberAirMinumUtama: "Sumur Tak Terlindung",
              fasilitasBABSanitasi: "Non-Jamban / Shared",
              mataPencaharianUtama: "Buruh Tani",
              adaLansiaDisabilitas: "Ya",
            },
          },
        ],
      },
      {
        idRT: "rt-03",
        namaRT: "RT 03 / RW 01",
        ketuaRT: "Bpk. Bambang Sukoco",
        dusun: "Dusun Krajan",
        daftarKPM: [
          {
            id: "kpm-301",
            skorDDK: 85,
            jenisBantuan: "BLT Dana Desa",
            nominalPerBulan: "Rp 300.000",
            statusRekomendasi: "Menunggu Review",
            profil: {
              nik: "3507011234560001",
              noKK: "3507010101850009",
              nama: "Budi Santoso",
              tempatLahir: "Kab. Malang",
              tanggalLahir: "18 Juni 1984",
              jenisKelamin: "Laki-Laki",
              agama: "Islam",
              pekerjaan: "Buruh Lepas",
              alamatDomisili: "RT 03 / RW 01 Dusun Krajan",
            },
            kondisiRumah: {
              bahanLantaiUtama: "Tanah / Semen Rusak",
              bahanDindingUtama: "Papan Kayu Lapuk",
              sumberAirMinumUtama: "Sumur Tak Terlindung",
              fasilitasBABSanitasi: "Jamban Bersama",
              mataPencaharianUtama: "Buruh Lepas",
              adaLansiaDisabilitas: "Ya",
            },
          },
        ],
      },
    ],
  },
};

function RekomendasiSKContent() {
  const searchParams = useSearchParams();
  const tahunPeriode = searchParams.get("tahun") || "2026";

  const { data: surveiData, isLoading, verifySekdes } = useSurveiKelayakan(tahunPeriode);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Semua" | "Disetujui" | "Ditangguhkan" | "Menunggu Review">("Semua");
  const [filterRT, setFilterRT] = useState<string>("Semua RT");
  const [sortBy, setSortBy] = useState<"Default" | "Skor Tertinggi" | "Skor Terendah">("Default");

  const [showModalPreview, setShowModalPreview] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<{
    idRT: string;
    namaRT: string;
    ketuaRT: string;
    warga: CalonKPM;
    asli: SurveiKelayakan;
  } | null>(null);

  // Helper to map SurveiKelayakan into UI structure
  const draftData = useMemo<DraftSKRencana>(() => {
    // We group by a mock RT because survei kelayakan doesn't directly store RT in this schema
    // In a real app we would join with Penduduk or KK to get RT.
    // For now, let's just group them into one or two RTs based on ID parity or just one RT.
    const grouped = surveiData.reduce((acc, survei) => {
      // Mock grouping based on the last char of ID or just default to RT 01
      const isRT02 = survei.nik.endsWith("2") || survei.nik.endsWith("4") || survei.nik.endsWith("6") || survei.nik.endsWith("8");
      const idRT = isRT02 ? "rt-02" : "rt-01";
      const namaRT = isRT02 ? "RT 02 / RW 01" : "RT 01 / RW 01";
      const ketuaRT = isRT02 ? "Bpk. Agus Rahardjo" : "Bpk. Heri Setiawan";
      const dusun = "Dusun Krajan";

      if (!acc[idRT]) {
        acc[idRT] = { idRT, namaRT, ketuaRT, dusun, daftarKPM: [] };
      }

      const statusMapping = {
        PENDING: "Menunggu Review",
        APPROVED: "Disetujui",
        REJECTED: "Ditangguhkan",
      };

      acc[idRT].daftarKPM.push({
        id: survei.id,
        skorDDK: survei.skor,
        jenisBantuan: survei.kategori || "Bansos Tunai",
        nominalPerBulan: "Rp 300.000",
        statusRekomendasi: (statusMapping[survei.status as keyof typeof statusMapping] || "Menunggu Review") as CalonKPM["statusRekomendasi"],
        profil: {
          nik: survei.nik,
          noKK: "-",
          nama: survei.nama,
          tempatLahir: "-",
          tanggalLahir: "-",
          jenisKelamin: "-",
          agama: "-",
          pekerjaan: "-",
          alamatDomisili: namaRT + " " + dusun,
        },
        kondisiRumah: {
          bahanLantaiUtama: survei.jenisLantai || "-",
          bahanDindingUtama: survei.jenisDinding || "-",
          sumberAirMinumUtama: survei.sumberAir || "-",
          fasilitasBABSanitasi: survei.sanitasi || "-",
          mataPencaharianUtama: "-",
          adaLansiaDisabilitas: survei.adaLansia ? "Ya" : "Tidak",
        },
        _raw: survei, // Keep a reference to the original data
      } as any);

      return acc;
    }, {} as Record<string, KelompokRT>);

    return {
      noDraftSK: `470 / 012 / SK-KPM / ${tahunPeriode}`,
      tahunAnggaran: tahunPeriode,
      totalPaguAnggaran: "Rp 7.500.000 / Bulan",
      tanggalDraft: new Date().toLocaleDateString("id-ID"),
      statusDokumen: "Draft Siap",
      kelompokRTList: Object.values(grouped),
    };
  }, [surveiData, tahunPeriode]);

  // Handler Approve Sekaligus 1 RT
  const handleApproveSetiapRT = async (idRT: string) => {
    const grup = draftData.kelompokRTList.find((g) => g.idRT === idRT);
    if (!grup) return;

    for (const warga of grup.daftarKPM) {
      if (warga.statusRekomendasi !== "Disetujui") {
        await verifySekdes(warga.id, true, "Disetujui massal oleh Sekdes", "SEKDES-001");
      }
    }
  };

  const handleUpdateStatusIndividu = async (
    idRT: string,
    idKPM: string,
    statusBaru: "Disetujui" | "Ditangguhkan",
  ) => {
    try {
      await verifySekdes(idKPM, statusBaru === "Disetujui", `Status diubah menjadi ${statusBaru} oleh Sekdes`, "SEKDES-001");

      // Update state modal agar langsung ter-render (optional, since surveiData will update and trigger useMemo)
      if (selectedWarga && selectedWarga.warga.id === idKPM) {
        setSelectedWarga((prev) =>
          prev
            ? {
                ...prev,
                warga: { ...prev.warga, statusRekomendasi: statusBaru },
              }
            : null,
        );
      }
    } catch (error: any) {
      alert("Gagal mengubah status: " + (error?.message || "Terjadi kesalahan"));
      console.error("Gagal update status:", error);
    }
  };

  // Statistik Total Disetujui
  const totalDisetujui = useMemo(() => {
    let count = 0;
    draftData.kelompokRTList.forEach((g) => {
      g.daftarKPM.forEach((w) => {
        if (w.statusRekomendasi === "Disetujui") count++;
      });
    });
    return count;
  }, [draftData]);

  const handleKirimKeKades = () => {
    // Ideally this would save to the DB, but for now we just change it in UI
    setShowModalPreview(false);
  };

  if (isLoading) {
    return <div className="p-10 text-center font-bold text-slate-500">Memuat Data Kelayakan...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 font-sans antialiased text-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER & NAVIGASI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href={`/sekdes/dashboard?tahun=${tahunPeriode}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition self-start"
          >
            ← Kembali ke Panel Sekdes
          </Link>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            📅 Periode Anggaran:{" "}
            <strong className="text-slate-900">{tahunPeriode}</strong>
          </span>
        </div>

        {/* BOARD STATISTIK MONITORING */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Registrasi SK
            </span>
            <div className="text-base font-black text-slate-900 font-mono mt-1">
              {draftData.noDraftSK}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Draf per {draftData.tanggalDraft}
            </span>
          </div>

          <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Warga Siap Masuk SK
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {totalDisetujui}{" "}
              <span className="text-xs font-normal text-emerald-800">
                KPM Disetujui
              </span>
            </div>
            <span className="text-[11px] text-emerald-800 mt-1 block">
              Dari {draftData.kelompokRTList.length} Wilayah RT
            </span>
          </div>

          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Status Pengajuan SK
            </span>
            <div className="text-base font-black text-amber-950 mt-1.5">
              {draftData.statusDokumen === "Draft Siap" &&
                "⏳ Ready for Approval"}
              {draftData.statusDokumen === "Terkirim ke Kades" &&
                "📩 Menunggu TTD Kades"}
            </div>
            <button
              onClick={() => setShowModalPreview(true)}
              className="mt-2 text-xs font-bold text-emerald-700 underline block cursor-pointer"
            >
              📄 Pratinjau Dokumen SK Resmi →
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari nama warga atau NIK di semua RT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-600"
            >
              <option value="Semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Menunggu Review">Menunggu Review</option>
              <option value="Ditangguhkan">Ditangguhkan</option>
            </select>
            <select
              value={filterRT}
              onChange={(e) => setFilterRT(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-600"
            >
              <option value="Semua RT">Semua RT</option>
              {draftData.kelompokRTList.map((rt) => (
                <option key={rt.idRT} value={rt.idRT}>{rt.namaRT}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 focus:outline-none focus:border-emerald-600"
            >
              <option value="Default">Urutan Default</option>
              <option value="Skor Tertinggi">Skor Tertinggi</option>
              <option value="Skor Terendah">Skor Terendah</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            💡 Klik tombol <strong>"Tinjau Data"</strong> pada baris warga untuk
            memeriksa profil & kondisi rumah.
          </p>
        </div>

        {/* TABEL KELOMPOK PER-RT */}
        <div className="space-y-6">
          {draftData.kelompokRTList.map((grupRT) => {
            if (filterRT !== "Semua RT" && grupRT.idRT !== filterRT) return null;

            let listDisaring = grupRT.daftarKPM.filter((w) => {
              const q = searchQuery.toLowerCase().trim();
              const matchSearch = !q || w.profil.nama.toLowerCase().includes(q) || w.profil.nik.includes(q);
              const matchStatus = filterStatus === "Semua" || w.statusRekomendasi === filterStatus;
              
              return matchSearch && matchStatus;
            });

            if (sortBy === "Skor Tertinggi") {
              listDisaring = listDisaring.sort((a, b) => b.skorDDK - a.skorDDK);
            } else if (sortBy === "Skor Terendah") {
              listDisaring = listDisaring.sort((a, b) => a.skorDDK - b.skorDDK);
            }

            if (listDisaring.length === 0 && (searchQuery || filterStatus !== "Semua")) return null;

            const totalRTDisetujui = grupRT.daftarKPM.filter(
              (w) => w.statusRekomendasi === "Disetujui",
            ).length;
            const isSemuaDisetujui =
              totalRTDisetujui === grupRT.daftarKPM.length;

            return (
              <div
                key={grupRT.idRT}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
              >
                {/* Header RT & Tombol Approve Sekaligus */}
                <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 font-black text-xs flex items-center justify-center shrink-0">
                      {grupRT.namaRT.split(" ")[1]}
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">
                        {grupRT.namaRT} — {grupRT.dusun}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Ketua RT Pendamping: <strong>{grupRT.ketuaRT}</strong> (
                        {grupRT.daftarKPM.length} Usulan KPM)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isSemuaDisetujui ? (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-200 font-extrabold text-xs rounded-xl flex items-center gap-1">
                        ✓ Seluruh Warga {grupRT.namaRT} Disetujui
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApproveSetiapRT(grupRT.idRT)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        ✓ Setujui Semua Warga {grupRT.namaRT}
                      </button>
                    )}
                  </div>
                </div>

                {/* TABEL KPM PER RT */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-5 py-2.5">No</th>
                        <th className="px-5 py-2.5">Identitas Calon KPM</th>
                        <th className="px-5 py-2.5 text-center">Skor DDK RT</th>
                        <th className="px-5 py-2.5">Program Bantuan</th>
                        <th className="px-5 py-2.5 text-center">
                          Status Rekomendasi
                        </th>
                        <th className="px-5 py-2.5 text-right">Rincian Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {listDisaring.map((warga, idx) => (
                        <tr
                          key={warga.id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          <td className="px-5 py-3 font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-bold text-slate-900">
                              {warga.profil.nama}
                            </p>
                            <p className="font-mono text-[10px] text-slate-400">
                              NIK: {warga.profil.nik}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-center font-mono font-bold text-amber-900">
                            {warga.skorDDK} / 100
                          </td>
                          <td className="px-5 py-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[10px]">
                              {warga.jenisBantuan} ({warga.nominalPerBulan})
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center whitespace-nowrap">
                            {warga.statusRekomendasi === "Disetujui" && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[10px]">
                                ✓ Disetujui Masuk SK
                              </span>
                            )}
                            {warga.statusRekomendasi === "Ditangguhkan" && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 font-bold text-[10px]">
                                ✕ Ditangguhkan
                              </span>
                            )}
                            {warga.statusRekomendasi === "Menunggu Review" && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">
                                ⏳ Belum Diverifikasi
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() =>
                                setSelectedWarga({
                                  idRT: grupRT.idRT,
                                  namaRT: grupRT.namaRT,
                                  ketuaRT: grupRT.ketuaRT,
                                  warga: warga,
                                  asli: (warga as any)._raw,
                                })
                              }
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs rounded-lg transition cursor-pointer"
                            >
                              Tinjau Data →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP MODAL POP-UP DETAIL WARGA (PROFIL PENDUDUK & KONDISI RUMAH) */}
      {selectedWarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  RINCIAN KPM — {selectedWarga.namaRT}
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  {selectedWarga.warga.profil.nama}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWarga(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Body Modal Scrollable */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* SECTION 1: PROFIL KEPENDUDUKAN */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <h4 className="font-extrabold text-slate-900 text-xs border-b border-slate-200 pb-2">
                  👤 Biodata Kependudukan Warga
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Nomor NIK KTP
                    </span>
                    <strong className="font-mono text-slate-900">
                      {selectedWarga.warga.profil.nik}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Alamat Domisili
                    </span>
                    <span className="font-medium text-slate-900">
                      {selectedWarga.namaRT}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: INDIKATOR PRODESKEL DDK */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    🏠 Indikator Fisik Rumah & Sanitasi DDK
                  </h4>
                  <span className="font-mono font-black text-amber-900">
                    Skor: {selectedWarga.warga.skorDDK} / 100 Pts
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Bahan Lantai Utama
                    </span>
                    <strong className="text-slate-900">
                      {selectedWarga.warga.kondisiRumah.bahanLantaiUtama}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Bahan Dinding Utama
                    </span>
                    <strong className="text-slate-900">
                      {selectedWarga.warga.kondisiRumah.bahanDindingUtama}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Sumber Air Minum
                    </span>
                    <strong className="text-slate-900">
                      {selectedWarga.warga.kondisiRumah.sumberAirMinumUtama}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Fasilitas Sanitasi / MCK
                    </span>
                    <strong className="text-slate-900">
                      {selectedWarga.warga.kondisiRumah.fasilitasBABSanitasi}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Mata Pencaharian RT
                    </span>
                    <strong className="text-slate-900">
                      {selectedWarga.warga.kondisiRumah.mataPencaharianUtama}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Lansia / Disabilitas
                    </span>
                    <strong className="text-amber-900">
                      {selectedWarga.warga.kondisiRumah.adaLansiaDisabilitas}
                    </strong>
                  </div>
                </div>
              </div>

              {/* AUDIT LOG RT */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950 font-medium text-[11px]">
                📌 Usulan ini diverifikasi oleh{" "}
                <strong>{selectedWarga.ketuaRT}</strong> ({selectedWarga.namaRT}
                ).
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Status: {selectedWarga.warga.statusRekomendasi}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatusIndividu(
                      selectedWarga.idRT,
                      selectedWarga.warga.id,
                      "Ditangguhkan",
                    )
                  }
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  ✕ Tangguhkan
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatusIndividu(
                      selectedWarga.idRT,
                      selectedWarga.warga.id,
                      "Disetujui",
                    )
                  }
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
                >
                  ✓ Setujui Masuk SK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL PREVIEW DOKUMEN SK SEKALIGUS SELURUH RT */}
      {showModalPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  DOCUMENT PREVIEW DRAFT SK
                </span>
                <h3 className="text-base font-black text-slate-950 mt-1">
                  Lampiran Penetapan KPM Resmi Se-Desa
                </h3>
              </div>
              <button
                onClick={() => setShowModalPreview(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 font-extrabold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-serif text-slate-900 leading-relaxed bg-white">
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
                  Nomor: {draftData.noDraftSK}
                </p>
              </div>

              {/* Lampiran Tersusun Rapi Per-RT */}
              <div className="pt-2 font-sans border-t border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 block">
                  DAFTAR LAMPIRAN PENERIMA DISETUJUI PER-RT (TOTAL{" "}
                  {totalDisetujui} KPM):
                </span>

                {draftData.kelompokRTList.map((grup) => {
                  const wargaDisetujui = grup.daftarKPM.filter(
                    (w) => w.statusRekomendasi === "Disetujui",
                  );
                  if (wargaDisetujui.length === 0) return null;

                  return (
                    <div
                      key={grup.idRT}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1">
                        <span>
                          {grup.namaRT} ({grup.ketuaRT})
                        </span>
                        <span className="text-emerald-800 font-bold">
                          {wargaDisetujui.length} Warga
                        </span>
                      </div>
                      <div className="space-y-1">
                        {wargaDisetujui.map((kpm, idx) => (
                          <div
                            key={kpm.id}
                            className="flex justify-between text-[10px] text-slate-700"
                          >
                            <span>
                              {idx + 1}. {kpm.profil.nama} ({kpm.profil.nik})
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {kpm.nominalPerBulan}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Pagu: {draftData.totalPaguAnggaran}
              </span>
              {draftData.statusDokumen === "Draft Siap" ? (
                <button
                  onClick={handleKirimKeKades}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                >
                  📩 Ajukan Draft SK Resmi ke Kepala Desa
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  ✓ Berkas Sudah Diajukan ke Kades
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RekomendasiSKPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Memuat Rekomendasi SK...
        </div>
      }
    >
      <RekomendasiSKContent />
    </Suspense>
  );
}
