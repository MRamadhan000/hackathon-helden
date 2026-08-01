"use client";

import { useState } from "react";
import RTHeader from "../../components/rt/RTHeader";
import ActionGrid from "../../components/rt/ActionGrid";
import TableWarga from "../../components/rt/TableWarga";
import CardSanggahan from "../../components/rt/CardSanggahan";
import FormLaporSekdes from "../../components/rt/FormLaporSekdes";

const mockWargaRT = [
  {
    id: "1",
    nama: "Budi Santoso",
    nik: "3507011234560001",
    statusDasar: "Hidup",
    bansos: "BLT Dana Desa",
    statusBansos: "Ditetapkan",
  },
  {
    id: "2",
    nama: "Siti Aminah",
    nik: "3507019876540002",
    statusDasar: "Hidup",
    bansos: "PKH",
    statusBansos: "Rekomendasi",
  },
  {
    id: "3",
    nama: "Joko Widodo (Alm)",
    nik: "3507015554440003",
    statusDasar: "Mati",
    bansos: "-",
    statusBansos: "-",
  },
];

const mockSanggahan = [
  {
    id: "s1",
    nama: "Ahmad Subari",
    nik: "3507010202020003",
    alasan: "Gaji di bawah 1 juta tapi tidak menerima BLT.",
    status: "Pending",
  },
];

export default function DashboardRT() {
  const [activeMode, setActiveMode] = useState<
    "warga" | "kependudukan" | "kelayakan" | "sanggahan"
  >("warga");

  const [formWarga, setFormWarga] = useState({
    nama: "",
    nik: "",
    aksi: "Belum Terdata",
    detail: "",
  });

  const [notif, setNotif] = useState("");

  const handleSelectAction = (
    mode: "warga" | "kependudukan" | "kelayakan" | "sanggahan",
  ) => {
    setActiveMode(mode);

    if (mode === "kependudukan") {
      setFormWarga({
        nama: "",
        nik: "",
        aksi: "Belum Terdata",
        detail:
          "Pendaftaran pendataan warga baru / pembaruan status domisili wilayah RT 03.",
      });
    } else if (mode === "kelayakan") {
      setFormWarga({
        nama: "",
        nik: "",
        aksi: "Penerimaan Bansos SK Baru",
        detail:
          "Hasil survei kelayakan lapangan: Warga diusulkan masuk alokasi Bansos SK Baru.",
      });
    }
  };

  const handleVerifikasiSanggahan = (nama: string, nik: string) => {
    setActiveMode("sanggahan");
    setFormWarga({
      nama,
      nik,
      aksi: "Ketidakcocokan Data (Sanggahan)",
      detail: `Hasil verifikasi ulang lapangan: Sanggahan VALID. Warga atas nama ${nama} layak mendapatkan alokasi jaminan perlindungan sosial.`,
    });
  };

  const handleLaporSekdes = (e: React.FormEvent) => {
    e.preventDefault();
    setNotif(
      `Sukses: Laporan mengenai ${formWarga.nama || "warga"} telah diteruskan ke Sekretaris Desa.`,
    );
    setFormWarga({ nama: "", nik: "", aksi: "Belum Terdata", detail: "" });
    setTimeout(() => setNotif(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased">
      <RTHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {notif && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-sm font-semibold transition">
            {notif}
          </div>
        )}

        {/* Action Grid (Kartu Fitur Utama) */}
        <ActionGrid
          onSelectAction={handleSelectAction}
          activeMode={activeMode}
        />

        {/* Area Tampilan Berdasarkan Kartu yang Dipilih */}
        <section className="pt-2">
          {activeMode === "warga" && <TableWarga data={mockWargaRT} />}

          {(activeMode === "kependudukan" || activeMode === "kelayakan") && (
            <FormLaporSekdes
              formWarga={formWarga}
              setFormWarga={setFormWarga}
              onSubmit={handleLaporSekdes}
            />
          )}

          {activeMode === "sanggahan" && (
            <div className="space-y-6">
              <CardSanggahan
                sanggahanList={mockSanggahan}
                onVerifikasi={handleVerifikasiSanggahan}
              />
              <FormLaporSekdes
                formWarga={formWarga}
                setFormWarga={setFormWarga}
                onSubmit={handleLaporSekdes}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
