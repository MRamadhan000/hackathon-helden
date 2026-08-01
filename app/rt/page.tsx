"use client";

import React, { useState } from "react";
import RTHeader from "@/components/rt/RTHeader";
import ActionGrid from "@/components/rt/ActionGrid";
import TableWarga, { PendudukRT } from "@/components/rt/TableWarga";
import CardSanggahan, {
  SanggahanDataPenduduk,
  SanggahanKondisiRumah,
} from "@/components/rt/CardSanggahan";
import FormMutasiLengkap from "@/components/rt/FormMutasiLengkap";
import FormSurveiKelayakan from "@/components/rt/FormSurveiKelayakan";

// Mock Data Warga Per Tahun
const mockWargaPerTahun: Record<string, PendudukRT[]> = {
  "2026": [
    {
      id: "uuid-001",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      jenisKelamin: "L",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      statusPenduduk: "Tetap",
      statusVerifikasiDukcapil: "Terverifikasi",
      terakhirDiperbarui: "2025-11-10",
    },
    {
      id: "uuid-002",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      jenisKelamin: "P",
      tempatLahir: "Kota Surabaya",
      tanggalLahir: "1958-08-24",
      statusPenduduk: "Tetap",
      statusVerifikasiDukcapil: "Terverifikasi",
      terakhirDiperbarui: "2023-04-15",
    },
    {
      id: "uuid-003",
      nik: "3507015554440003",
      nama: "Joko Widodo (Alm)",
      jenisKelamin: "L",
      tempatLahir: "Kab. Blitar",
      tanggalLahir: "1945-01-15",
      statusPenduduk: "Meninggal",
      statusVerifikasiDukcapil: "Anomali / Unverified",
      terakhirDiperbarui: "2026-01-20",
    },
  ],
  "2025": [
    {
      id: "uuid-001",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      jenisKelamin: "L",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      statusPenduduk: "Tetap",
      statusVerifikasiDukcapil: "Terverifikasi",
      terakhirDiperbarui: "2025-02-10",
    },
    {
      id: "uuid-002",
      nik: "3507019876540002",
      nama: "Siti Aminah",
      jenisKelamin: "P",
      tempatLahir: "Kota Surabaya",
      tanggalLahir: "1958-08-24",
      statusPenduduk: "Tetap",
      statusVerifikasiDukcapil: "Terverifikasi",
      terakhirDiperbarui: "2023-04-15",
    },
  ],
  "2024": [
    {
      id: "uuid-001",
      nik: "3507011234560001",
      nama: "Budi Santoso",
      jenisKelamin: "L",
      tempatLahir: "Kab. Malang",
      tanggalLahir: "1985-05-12",
      statusPenduduk: "Tetap",
      statusVerifikasiDukcapil: "Terverifikasi",
      terakhirDiperbarui: "2024-01-11",
    },
  ],
};

const mockSanggahanPendudukPerTahun: Record<string, SanggahanDataPenduduk[]> = {
  "2026": [
    {
      id: "sp-2026-1",
      namaPelapor: "Siti Aminah",
      nikPelapor: "3507019876540002",
      jenisKetidakcocokan: "Ejaan Nama / NIK Typo",
      alasanSanggahan:
        "Ejaan nama di KTP terdaftar Siti Aminah, S.Pd tetapi di data desa belum ada gelar.",
      tanggalMasuk: "01/08/2026",
      status: "Pending",
    },
  ],
  "2025": [
    {
      id: "sp-2025-1",
      namaPelapor: "Budi Santoso",
      nikPelapor: "3507011234560001",
      jenisKetidakcocokan: "Status Domisili",
      alasanSanggahan: "Perbaikan nomor rumah RT 03 / RW 01.",
      tanggalMasuk: "14/05/2025",
      status: "Diajukan ke Sekdes",
    },
  ],
  "2024": [
    {
      id: "sp-2024-1",
      namaPelapor: "Joko Widodo",
      nikPelapor: "3507015554440003",
      jenisKetidakcocokan: "Ejaan Nama / NIK Typo",
      alasanSanggahan: "Koreksi NIK digit terakhir.",
      tanggalMasuk: "10/09/2024",
      status: "Tidak Diajukan",
    },
  ],
};

const mockSanggahanRumahPerTahun: Record<string, SanggahanKondisiRumah[]> = {
  "2026": [
    {
      id: "sr-2026-1",
      namaPelapor: "Ahmad Subari",
      nikPelapor: "3507010202020003",
      jenisLantai: "Tanah / Plester Rusak",
      jenisDinding: "Bambu / Kayu Lapuk",
      sanitasi: "Numpang / Tidak Ada Jamban",
      skorSistem: 75,
      alasanWarga:
        "Kondisi dinding rumah lapuk dan belum punya jamban pribadi, mohon diusulkan BLT.",
      tanggalMasuk: "31/07/2026",
      status: "Pending",
    },
  ],
  "2025": [
    {
      id: "sr-2025-1",
      namaPelapor: "Siti Aminah",
      nikPelapor: "3507019876540002",
      jenisLantai: "Semen / Keramik",
      jenisDinding: "Tembok / Kayu Bagus",
      sanitasi: "Jamban Pribadi",
      skorSistem: 20,
      alasanWarga: "Pengusulan PKH Lansia.",
      tanggalMasuk: "02/03/2025",
      status: "Diajukan ke Sekdes",
    },
  ],
  "2024": [],
};

export default function DashboardRT() {
  const [tahunPeriode, setTahunPeriode] = useState("2026");
  const [activeMode, setActiveMode] = useState<
    "warga" | "kependudukan" | "kelayakan" | "sanggahan"
  >("warga");

  const [selectedNik, setSelectedNik] = useState("");
  const [notif, setNotif] = useState("");

  const dataWargaAktif = mockWargaPerTahun[tahunPeriode] || [];
  const sanggahanPendudukAktif =
    mockSanggahanPendudukPerTahun[tahunPeriode] || [];
  const sanggahanRumahAktif = mockSanggahanRumahPerTahun[tahunPeriode] || [];

  const handleSelectAction = (
    mode: "warga" | "kependudukan" | "kelayakan" | "sanggahan",
  ) => {
    setActiveMode(mode);
    setSelectedNik("");
  };

  const handleAjukanPendudukKeSekdes = (id: string) => {
    if (tahunPeriode !== "2026") return;
    setNotif(
      "Sukses: Sanggahan data kependudukan berhasil divalidasi RT dan dikirimkan ke Sekretaris Desa.",
    );
    setTimeout(() => setNotif(""), 4000);
  };

  const handleAjukanRumahKeSekdes = (id: string) => {
    if (tahunPeriode !== "2026") return;
    setNotif(
      "Sukses: Hasil survei ulang kondisi rumah berhasil diteruskan ke Sekretaris Desa.",
    );
    setTimeout(() => setNotif(""), 4000);
  };

  const handleMutasiLengkap = (e: React.FormEvent, dataHasil: any) => {
    e.preventDefault();
    if (tahunPeriode !== "2026") return;
    const { kategoriAksi, dataForm } = dataHasil;

    let pesan = "";
    if (kategoriAksi === "baru") {
      pesan = `Sukses: Pendaftaran Warga Baru (${dataForm.nama}) telah dikirim ke Sekretaris Desa.`;
    } else if (kategoriAksi === "nonaktif") {
      pesan = `Sukses: Laporan Non-Aktifkan Warga (${dataForm.nama} - Alasan: ${dataForm.alasanNonAktif}) telah dikirim ke Sekretaris Desa.`;
    } else {
      pesan = `Sukses: Usulan Koreksi Data Warga (${dataForm.nama}) telah dikirim ke Sekretaris Desa.`;
    }

    setNotif(pesan);
    setSelectedNik("");
    setTimeout(() => setNotif(""), 4000);
  };

  const handleSubmitSurvei = (e: React.FormEvent, dataHasil: any) => {
    e.preventDefault();
    if (tahunPeriode !== "2026") return;
    setNotif(
      `Sukses: Hasil Survei Prodeskel atas nama ${dataHasil.nama} (${dataHasil.nik}) dengan Skor ${dataHasil.skor} Poin [${dataHasil.kategori}] berhasil diteruskan ke Sekretaris Desa.`,
    );
    setSelectedNik("");
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      <RTHeader tahunPeriode={tahunPeriode} setTahunPeriode={setTahunPeriode} />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-sm font-semibold transition shadow-sm">
            {notif}
          </div>
        )}

        <ActionGrid
          onSelectAction={handleSelectAction}
          activeMode={activeMode}
        />

        <section className="pt-2">
          {activeMode === "warga" && <TableWarga data={dataWargaAktif} />}

          {activeMode === "kependudukan" && (
            <FormMutasiLengkap
              tahunPeriode={tahunPeriode}
              daftarWarga={dataWargaAktif}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitMutasi={handleMutasiLengkap}
            />
          )}

          {activeMode === "kelayakan" && (
            <FormSurveiKelayakan
              tahunPeriode={tahunPeriode}
              daftarWarga={dataWargaAktif}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitSurvei={handleSubmitSurvei}
            />
          )}

          {activeMode === "sanggahan" && (
            <CardSanggahan
              tahunPeriode={tahunPeriode}
              sanggahanPendudukList={sanggahanPendudukAktif}
              sanggahanRumahList={sanggahanRumahAktif}
              onAjukanPendudukKeSekdes={handleAjukanPendudukKeSekdes}
              onAjukanRumahKeSekdes={handleAjukanRumahKeSekdes}
            />
          )}
        </section>
      </main>
    </div>
  );
}
