"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getWargaDashboardData } from "@/services/core/warga.service";

// Mock data removed

export default function DashboardWarga() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const nikQuery = user?.nik;
  
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);
  const [wargaData, setWargaData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (nikQuery) {
      getWargaDashboardData(nikQuery)
        .then((data) => {
          setWargaData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setErrorMsg(err.message || "Terjadi kesalahan.");
          setIsLoading(false);
        });
    } else {
      setErrorMsg("NIK tidak valid atau tidak ditemukan.");
      setIsLoading(false);
    }
  }, [nikQuery]);

  if (isLoading || isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Memuat Data...</div>;
  }

  if (errorMsg || !wargaData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h2 className="text-xl font-bold text-rose-600 mb-2">Gagal Memuat Data</h2>
        <p className="text-slate-600 mb-4">{errorMsg || "Data warga tidak ditemukan."}</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Kembali ke Halaman Utama</Link>
      </div>
    );
  }

  const dataToDisplay = wargaData;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans antialiased pb-12">
      {/* HEADER NAVIGASI WARGA */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              🏡
            </span>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
                Layanan Warga Mandiri
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                Sistem Informasi Desa Digital
              </p>
            </div>
          </div>

          <Link
            href="/auth/login/warga"
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition"
          >
            🚪 Keluar
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 pt-6 space-y-6">
        {/* BANNER SELAMAT DATANG */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold mb-1">
              👋 Sugeng Rawuh / Selamat Datang
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
              Halo, {dataToDisplay.nama}!
            </h2>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Pantau data profil pribadi, status penerimaan bansos, serta ajukan
              perbaikan data atau sanggahan kondisi rumah secara mandiri.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shrink-0 text-left md:text-right space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Identitas Wilayah RT
            </span>
            <p className="text-xs font-extrabold text-slate-900">
              {dataToDisplay.rtRw} • {dataToDisplay.dusun}
            </p>
            <span className="text-[10px] font-mono text-slate-500 block">
              NIK: {dataToDisplay.nik}
            </span>
          </div>
        </div>

        {/* 2. CARD STATUS KELAYAKAN BANSOS (BARU) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🤝</span>
              <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                Status Kelayakan Penerima Bantuan Sosial (Bansos)
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold rounded-full">
              Terverifikasi Siskeudes
            </span>
          </div>

          {dataToDisplay.statusBansos?.isPenerima ? (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Status Terdaftar Resmi:
                </span>
                <h4 className="text-base font-black text-emerald-950">
                  ✓ TERDAFTAR SEBAGAI KPM PENERIMA BANSOS
                </h4>
                <p className="text-xs text-slate-600">
                  Program:{" "}
                  <strong>{dataToDisplay.statusBansos?.jenisBantuan}</strong> •
                  Dasar Hukum:{" "}
                  <strong className="font-mono">
                    {dataToDisplay.statusBansos?.dasarHukumSk}
                  </strong>
                </p>
              </div>

              <div className="px-4 py-2 bg-white border border-emerald-200 rounded-xl shrink-0 text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Nominal Bantuan
                </span>
                <span className="text-sm font-black text-emerald-900 font-mono">
                  {dataToDisplay.statusBansos?.nominalPerBulan}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 text-xs">
              Saat ini Anda <strong>Belum Terdaftar</strong> sebagai penerima
              Bantuan Sosial. Jika merasa kondisi rumah/ekonomi memenuhi syarat,
              Anda dapat mengajukan sanggahan pada formulir di bawah.
            </div>
          )}
        </div>

        {/* 1. RINGKASAN DATA EKSISTING (DATA DIRI & KONDISI RUMAH SAAT INI) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DATA DIRI EKSISTING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Data Diri & Keluarga Terdata
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                Eksisting
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Nama Lengkap
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.nama}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Nomor KK
                </span>
                <p className="font-mono font-bold text-slate-900">
                  {dataToDisplay.noKk}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  TTL & JK
                </span>
                <p className="font-medium text-slate-800">
                  {dataToDisplay.tempatTanggalLahir} (
                  {dataToDisplay.jenisKelamin})
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Pekerjaan
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.pekerjaan}
                </p>
              </div>
            </div>
          </div>

          {/* KONDISI RUMAH EKSISTING */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🏠</span>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Kondisi Kelayakan Rumah Terdata
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                Hasil Verifikasi RT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Atap Rumah
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.kondisiRumahEksisting?.atap || "-"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Dinding Rumah
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.kondisiRumahEksisting?.dinding || "-"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Lantai Rumah
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.kondisiRumahEksisting?.lantai || "-"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block">
                  Sanitasi / MCK
                </span>
                <p className="font-bold text-slate-900">
                  {dataToDisplay.kondisiRumahEksisting?.sanitasi || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AKSI INPUTAN SAMGGAHAN / PERBAIKAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold inline-block">
                USULAN & BANTUAN SOSIAL 🏠
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                1. Laporkan Sanggahan Kondisi Rumah
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bantu kami memperbarui data kelayakan kondisi rumah Anda jika
                saat ini terjadi kerusakan atau tidak cocok dengan data
                eksisting di atas.
              </p>
            </div>

            <Link
              href="/warga/sanggah-rumah"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition text-center block cursor-pointer"
            >
              Isi Sanggahan Rumah →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-100 rounded-full text-xs font-bold inline-block">
                DATA KEPENDUDUKAN 📝
              </span>
              <h3 className="text-base font-extrabold text-slate-950">
                2. Perbaiki Data Diri & Keluarga
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ajukan koreksi apabila terdapat penulisan ejaan nama, NIK,
                tanggal lahir, atau profesi yang belum sesuai dengan dokumen
                asli.
              </p>
            </div>

            <Link
              href="/warga/perbaiki-data"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition text-center block cursor-pointer"
            >
              Koreksi Data Diri →
            </Link>
          </div>
        </div>

        {/* 3. LOG MONITORING INPUTAN SANGGAHAN & PERBAIKAN WARGA */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold mb-1">
                ⏱️ Riwayat & Log Status
              </div>
              <h3 className="text-base font-bold text-slate-950">
                Monitoring Log Sanggahan & Perbaikan Data Anda
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau perkembangan verifikasi oleh Ketua RT atas permohonan
                yang pernah Anda kirimkan.
              </p>
            </div>
            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 shrink-0">
              Total Pengajuan: {dataToDisplay.logPengajuan?.length || 0} Berkas
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-5 py-3">Waktu & Tanggal Kirim</th>
                  <th className="px-5 py-3">Jenis Pengajuan</th>
                  <th className="px-5 py-3 text-center">
                    Status Verifikasi RT
                  </th>
                  <th className="px-5 py-3">Catatan / Tindak Lanjut</th>
                  <th className="px-5 py-3 text-right">Rincian Berkas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {dataToDisplay.logPengajuan && dataToDisplay.logPengajuan.length > 0 ? (
                  dataToDisplay.logPengajuan.map((log: any) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-5 py-3.5 font-mono text-slate-900 font-bold text-[11px] whitespace-nowrap">
                        {log.tanggalJam}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">
                          {log.jenisInputan}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          {log.kategori}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        {log.status === "Pending" && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-[10px] rounded-full">
                            ⏳ Pending (RT)
                          </span>
                        )}
                        {log.status === "Diterima" && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[10px] rounded-full">
                            ✓ Diterima
                          </span>
                        )}
                        {log.status === "Ditolak" && (
                          <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-extrabold text-[10px] rounded-full">
                            ✕ Ditolak
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {log.catatanRt}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLogDetail(log)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 transition cursor-pointer text-xs"
                        >
                          📄 Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-slate-400 text-xs"
                    >
                      Belum ada riwayat pengajuan sanggahan atau perbaikan data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL POP-UP DETAIL LOG PENGAJUAN WARGA */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                  RINCIAN BERKAS PENGAJUAN WARGA
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedLogDetail.jenisInputan}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    Waktu Pengiriman
                  </span>
                  <p className="font-mono font-bold text-slate-900">
                    {selectedLogDetail.tanggalJam}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    selectedLogDetail.status === "Pending"
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  }`}
                >
                  {selectedLogDetail.status}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1">
                  Perbandingan Data Sebelumnya vs Yang Diajukan:
                </h4>

                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">
                    Data Eksisting / Sebelumnya:
                  </span>
                  <p className="font-medium text-slate-800">
                    {selectedLogDetail.detailPerbandingan.dataLama}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    Data Baru Yang Diajukan / Sanggahan:
                  </span>
                  <p className="font-bold text-emerald-950">
                    {selectedLogDetail.detailPerbandingan.dataBaru}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Alasan / Catatan Warga:
                  </span>
                  <p className="font-medium text-slate-700 italic">
                    "{selectedLogDetail.detailPerbandingan.alasan}"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
