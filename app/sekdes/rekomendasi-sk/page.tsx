"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [selectedWarga, setSelectedWarga] = useState<{
    idRT: string;
    namaRT: string;
    ketuaRT: string;
    warga: CalonKPM;
  } | null>(null);

  const [draftData, setDraftData] = useState<DraftSKRencana>(
    () => mockDataPerRT[tahunPeriode] || mockDataPerRT["2026"],
  );

  useEffect(() => {
    setDraftData(mockDataPerRT[tahunPeriode] || mockDataPerRT["2026"]);
  }, [tahunPeriode]);

  // Handler Approve Sekaligus 1 RT
  const handleApproveSetiapRT = (idRT: string) => {
    setDraftData((prev) => ({
      ...prev,
      kelompokRTList: prev.kelompokRTList.map((grup) => {
        if (grup.idRT === idRT) {
          return {
            ...grup,
            daftarKPM: grup.daftarKPM.map((w) => ({
              ...w,
              statusRekomendasi: "Disetujui" as const,
            })),
          };
        }
        return grup;
      }),
    }));
  };

  // Handler Update Status Individu via Modal Detail
  const handleUpdateStatusIndividu = (
    idRT: string,
    idKPM: string,
    statusBaru: "Disetujui" | "Ditangguhkan",
  ) => {
    setDraftData((prev) => ({
      ...prev,
      kelompokRTList: prev.kelompokRTList.map((grup) => {
        if (grup.idRT === idRT) {
          return {
            ...grup,
            daftarKPM: grup.daftarKPM.map((w) =>
              w.id === idKPM ? { ...w, statusRekomendasi: statusBaru } : w,
            ),
          };
        }
        return grup;
      }),
    }));

    // Update state modal agar langsung ter-render
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
    setDraftData((prev) => ({ ...prev, statusDokumen: "Terkirim ke Kades" }));
    setShowModalPreview(false);
  };

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

        {/* SEARCH BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Cari nama warga atau NIK di semua RT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-600"
          />
          <p className="text-xs text-slate-500 font-medium">
            💡 Klik tombol <strong>"Tinjau Data"</strong> pada baris warga untuk
            memeriksa profil & kondisi rumah.
          </p>
        </div>

        {/* TABEL KELOMPOK PER-RT */}
        <div className="space-y-6">
          {draftData.kelompokRTList.map((grupRT) => {
            const listDisaring = grupRT.daftarKPM.filter((w) => {
              const q = searchQuery.toLowerCase().trim();
              return (
                !q ||
                w.profil.nama.toLowerCase().includes(q) ||
                w.profil.nik.includes(q)
              );
            });

            if (listDisaring.length === 0 && searchQuery) return null;

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
                <div className="grid grid-cols-2 gap-3 text-slate-800">
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
                      Nomor Kartu Keluarga
                    </span>
                    <strong className="font-mono text-slate-900">
                      {selectedWarga.warga.profil.noKK}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Tempat, Tanggal Lahir
                    </span>
                    <span>
                      {selectedWarga.warga.profil.tempatLahir},{" "}
                      {selectedWarga.warga.profil.tanggalLahir}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Jenis Kelamin / Agama
                    </span>
                    <span>
                      {selectedWarga.warga.profil.jenisKelamin} •{" "}
                      {selectedWarga.warga.profil.agama}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Pekerjaan Utama
                    </span>
                    <span>{selectedWarga.warga.profil.pekerjaan}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Alamat Domisili
                    </span>
                    <span>{selectedWarga.warga.profil.alamatDomisili}</span>
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
