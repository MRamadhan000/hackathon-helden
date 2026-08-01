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

// Mock Data Warga RT
const mockWargaRT: PendudukRT[] = [
  {
    id: "uuid-001",
    nik: "3507011234560001",
    nama: "Budi Santoso",
    jenisKelamin: "L",
    tempatLahir: "Malang",
    tanggalLahir: "1985-05-12",
    statusPenduduk: "Tetap",
    statusVerifikasiDukcapil: "Terverifikasi",
  },
  {
    id: "uuid-002",
    nik: "3507019876540002",
    nama: "Siti Aminah",
    jenisKelamin: "P",
    tempatLahir: "Surabaya",
    tanggalLahir: "1958-08-24",
    statusPenduduk: "Tetap",
    statusVerifikasiDukcapil: "Terverifikasi",
  },
  {
    id: "uuid-003",
    nik: "3507015554440003",
    nama: "Joko Widodo (Alm)",
    jenisKelamin: "L",
    tempatLahir: "Blitar",
    tanggalLahir: "1945-01-15",
    statusPenduduk: "Meninggal",
    statusVerifikasiDukcapil: "Anomali / Unverified",
  },
];

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

  const handleVerifikasiPenduduk = (item: SanggahanDataPenduduk) => {
    setSelectedNik(item.nikPelapor);
    setActiveMode("kependudukan");
    setNotif(
      `Memproses sanggahan data kependudukan atas nama ${item.namaPelapor}.`,
    );
  };

  const handleVerifikasiRumah = (item: SanggahanKondisiRumah) => {
    setSelectedNik(item.nikPelapor);
    setActiveMode("kelayakan");
    setNotif(
      `Melakukan survei ulang kelayakan bansos atas nama ${item.namaPelapor}.`,
    );
  };

  const handleUpdateStatusPenduduk = (
    id: string,
    statusBaru: "Diterima" | "Ditolak",
  ) => {
    setSanggahanPendudukList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: statusBaru } : item,
      ),
    );
    setNotif(
      `Status sanggahan data kependudukan telah ditandai selesai: [${statusBaru}].`,
    );
    setTimeout(() => setNotif(""), 4000);
  };

  const handleUpdateStatusRumah = (
    id: string,
    statusBaru: "Diterima" | "Ditolak",
  ) => {
    setSanggahanRumahList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: statusBaru } : item,
      ),
    );
    setNotif(
      `Status sanggahan kondisi rumah telah ditandai selesai: [${statusBaru}].`,
    );
    setTimeout(() => setNotif(""), 4000);
  };

  // Submit Handler untuk Mutasi Lengkap (1. Baru, 2. Non-Aktif, 3. Koreksi)
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
          {activeMode === "warga" && <TableWarga data={mockWargaRT} />}

          {/* Opsi 2: Mutasi Kependudukan Lengkap (Baru / Non-Aktif / Koreksi) */}
          {activeMode === "kependudukan" && (
            <FormMutasiLengkap
              daftarWarga={mockWargaRT}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitMutasi={handleMutasiLengkap}
            />
          )}

          {activeMode === "kelayakan" && (
            <FormSurveiKelayakan
              daftarWarga={mockWargaRT}
              selectedNik={selectedNik}
              setSelectedNik={setSelectedNik}
              onSubmitSurvei={handleSubmitSurvei}
            />
          )}

          {activeMode === "sanggahan" && (
            <CardSanggahan
              sanggahanPendudukList={sanggahanPendudukList}
              sanggahanRumahList={sanggahanRumahList}
              onVerifikasiPenduduk={handleVerifikasiPenduduk}
              onVerifikasiRumah={handleVerifikasiRumah}
              onUpdateStatusPenduduk={handleUpdateStatusPenduduk}
              onUpdateStatusRumah={handleUpdateStatusRumah}
            />
          )}
        </section>
      </main>
    </div>
  );
}
