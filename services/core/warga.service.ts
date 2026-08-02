import { createClient } from "@/utils/supabase/client";

export async function getWargaDashboardData(nik: string) {
  const supabase = createClient();

  // 1. Ambil data penduduk berdasarkan NIK
  const { data: pendudukData, error: pendudukError } = await supabase
    .from("tweb_penduduk")
    .select("*")
    .eq("nik", nik)
    .single();

  if (pendudukError || !pendudukData) {
    throw new Error("Data penduduk tidak ditemukan");
  }

  // 2. Ambil status kelayakan bansos dari tweb_survei_kelayakan
  const { data: bansosData } = await supabase
    .from("tweb_survei_kelayakan")
    .select("*, program:program_id(nama, nomor_sk)")
    .eq("penduduk_id", pendudukData.id)
    .eq("status", "APPROVED")
    .maybeSingle();

  let bansosDetail = null;
  if (bansosData) {
    // Ambil nominal dari penerima jika ada
    const { data: penerimaData } = await supabase
      .from("penerima")
      .select("nominal")
      .eq("penduduk_id", pendudukData.id)
      .eq("program_id", bansosData.program_id)
      .eq("status", "APPROVED")
      .maybeSingle();

    bansosDetail = {
      isPenerima: true,
      jenisBantuan: bansosData.program?.nama || "Bantuan Sosial",
      nominalPerBulan: penerimaData?.nominal
        ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(penerimaData.nominal)
        : "Belum Ditentukan",
      dasarHukumSk: bansosData.program?.nomor_sk || "SK/BANSOS/2026",
      statusPenyaluran: "Aktif Penerima",
    };
  } else {
    bansosDetail = {
      isPenerima: false,
    };
  }

  // 3. Ambil log sanggahan penduduk (Perbaikan Data)
  const { data: sanggahanPenduduk } = await supabase
    .from("tweb_sanggahan_penduduk")
    .select("*")
    .eq("penduduk_id", pendudukData.id)
    .order("created_at", { ascending: false });

  // 4. Ambil log sanggahan rumah
  const { data: sanggahanRumah } = await supabase
    .from("tweb_sanggahan_rumah")
    .select("*")
    .eq("penduduk_id", pendudukData.id)
    .order("created_at", { ascending: false });

  // Format log untuk UI
  const logPengajuan = [
    ...(sanggahanRumah || []).map((s: any) => ({
      id: s.id,
      tanggalJam: new Date(s.created_at).toLocaleString("id-ID"),
      jenisInputan: "Sanggahan Kondisi Rumah",
      kategori: "Kondisi Rumah",
      status: s.status === "PENDING" || s.status === "DIAJUKAN_SEKDES" ? "Pending" : s.status === "APPROVED" ? "Diterima" : "Ditolak",
      catatanRt: s.feedback_sekdes || "Dalam antrean tinjauan",
      detailPerbandingan: {
        itemDiubah: "Kondisi Rumah",
        dataLama: "-",
        dataBaru: `Atap: ${s.jenis_dinding}, Lantai: ${s.jenis_lantai}`,
        alasan: s.alasan_warga || "-",
      }
    })),
    ...(sanggahanPenduduk || []).map((s: any) => ({
      id: s.id,
      tanggalJam: new Date(s.created_at).toLocaleString("id-ID"),
      jenisInputan: "Perbaikan Data Diri",
      kategori: "Data Kependudukan",
      status: s.status === "PENDING" || s.status === "DIAJUKAN_SEKDES" ? "Pending" : s.status === "APPROVED" ? "Diterima" : "Ditolak",
      catatanRt: s.feedback_sekdes || "Dalam antrean tinjauan",
      detailPerbandingan: {
        itemDiubah: s.jenis_ketidakcocokan,
        dataLama: "-",
        dataBaru: "-",
        alasan: s.alasan_sanggahan || "-",
      }
    }))
  ].sort((a, b) => new Date(b.tanggalJam).getTime() - new Date(a.tanggalJam).getTime());

  return {
    nama: pendudukData.nama,
    nik: pendudukData.nik,
    noKk: "-", // Dummy
    rtRw: "-", // Dummy
    dusun: "-", // Dummy
    tempatTanggalLahir: `${pendudukData.tempat_lahir || "-"}, ${pendudukData.tanggal_lahir ? new Date(pendudukData.tanggal_lahir).toLocaleDateString("id-ID") : "-"}`,
    jenisKelamin: pendudukData.jenis_kelamin || "-",
    pekerjaan: "-", // Dummy
    statusKependudukan: pendudukData.status_penduduk || "Tercatat",
    statusBansos: bansosDetail,
    logPengajuan,
  };
}
