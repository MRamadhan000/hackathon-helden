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

// Mock Data Master Kependudukan Warga RT (Skema tweb_penduduk)
const mockWargaRT: PendudukRT[] = [
  {
    id: "uuid-001",
    nik: "3507011234560001",
    nama: "Budi Santoso",
    jenisKelamin: "L",
    tempatLahir: "Kab. Malang",
    tanggalLahir: "1985-05-12",
    statusPenduduk: "Tetap",
    statusVerifikasiDukcapil: "Terverifikasi",
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
  },
];

// Mock Sanggahan 1: Ketidakcocokan Data Kependudukan
const initialSanggahanPenduduk: SanggahanDataPenduduk[] = [
  {
    id: "sp-1",
    namaPelapor: "Siti Aminah",
    nikPelapor: "3507019876540002",
    jenisKetidakcocokan: "Ejaan Nama / NIK Typo",
    alasanSanggahan:
      "Ejaan nama di KTP terdaftar Siti Aminah, S.Pd tetapi di data desa belum ada gelar.",
    tanggalMasuk: "01/08/2026",
    status: "Pending",
  },
];

// Mock Sanggahan 2: Ketidakcocokan Kondisi Rumah (Prodeskel DDK)
const initialSanggahanRumah: SanggahanKondisiRumah[] = [
  {
    id: "sr-1",
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
];

export default function DashboardRT() {
  const [activeMode, setActiveMode] = useState<
    "warga" | "kependudukan" | "kelayakan" | "sanggahan"
  >("warga");

  const [selectedNik, setSelectedNik] = useState("");
  const [notif, setNotif] = useState("");

  // State List Sanggahan Berjenjang (RT -> Sekdes)
  const [sanggahanPendudukList, setSanggahanPendudukList] = useState<
    SanggahanDataPenduduk[]
  >(initialSanggahanPenduduk);

  const [sanggahanRumahList, setSanggahanRumahList] = useState<
    SanggahanKondisiRumah[]
  >(initialSanggahanRumah);

  const handleSelectAction = (
    mode: "warga" | "kependudukan" | "kelayakan" | "sanggahan",
  ) => {
    setActiveMode(mode);
    setSelectedNik("");
  };

  // Handler RT Memverifikasi & Mengajukan Sanggahan Data Penduduk ke Sekdes
  const handleAjukanPendudukKeSekdes = (id: string) => {
    setSanggahanPendudukList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Diajukan ke Sekdes" } : item,
      ),
    );
    setNotif(
      "Sukses: Sanggahan data kependudukan berhasil divalidasi RT dan dikirimkan ke Sekretaris Desa.",
    );
    setTimeout(() => setNotif(""), 4000);
  };

  // Handler RT Memverifikasi & Mengajukan Sanggahan Kondisi Rumah ke Sekdes
  const handleAjukanRumahKeSekdes = (id: string) => {
    setSanggahanRumahList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Diajukan ke Sekdes" } : item,
      ),
    );
    setNotif(
      "Sukses: Hasil survei ulang kondisi rumah berhasil diteruskan ke Sekretaris Desa.",
    );
    setTimeout(() => setNotif(""), 4000);
  };

  // Handler Submit Form Mutasi Lengkap (1. Baru, 2. Non-Aktif, 3. Koreksi)
  const handleMutasiLengkap = (e: React.FormEvent, dataHasil: any) => {
    e.preventDefault();
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

  // Handler Submit Hasil Survei Kelayakan Bansos (Prodeskel DDK)
  const handleSubmitSurvei = (e: React.FormEvent, dataHasil: any) => {
    e.preventDefault();
    setNotif(
      `Sukses: Hasil Survei Prodeskel atas nama ${dataHasil.nama} (${dataHasil.nik}) dengan Skor ${dataHasil.skor} Poin [${dataHasil.kategori}] berhasil diteruskan ke Sekretaris Desa.`,
    );
    setSelectedNik("");
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      <RTHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* NOTIFIKASI AKSI */}
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-sm font-semibold transition shadow-sm">
            {notif}
          </div>
        )}

        {/* ACTION GRID (KARTU FITUR UTAMA RT) */}
        <ActionGrid
          onSelectAction={handleSelectAction}
          activeMode={activeMode}
        />

        {/* AREA KONTEN BERDASARKAN KARTU FITUR YANG DIBUKA */}
        <section className="pt-2">
          {/* MENU 1: MASTER DATA WARGA */}
          {activeMode === "warga" && <TableWarga data={mockWargaRT} />}

          {/* MENU 2: PENDATAAN & MUTASI WARGA (BARU / NON-AKTIF / KOREKSI) */}
          {activeMode === "kependudukan" && (
            <FormMutasiLengkap
              daftarWarga={mockWargaRT}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitMutasi={handleMutasiLengkap}
            />
          )}

          {/* MENU 3: SURVEI KELAYAKAN BANSOS (PRODESKEL DDK) */}
          {activeMode === "kelayakan" && (
            <FormSurveiKelayakan
              daftarWarga={mockWargaRT}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitSurvei={handleSubmitSurvei}
            />
          )}

          {/* MENU 4: KELOLA SANGGAHAN WARGA */}
          {activeMode === "sanggahan" && (
            <CardSanggahan
              sanggahanPendudukList={sanggahanPendudukList || []}
              sanggahanRumahList={sanggahanRumahList || []}
              onAjukanPendudukKeSekdes={handleAjukanPendudukKeSekdes}
              onAjukanRumahKeSekdes={handleAjukanRumahKeSekdes}
            />
          )}
        </section>
      </main>
    </div>
  );
}
