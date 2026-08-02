import { createClient } from "@/utils/supabase/client";
import {
  MutasiPengajuan,
  MutasiLog,
  MutasiSubmitPayload,
  MutasiResubmitPayload,
  ActorRole,
} from "@/types/mutasi";

// Helper mapper dari snake_case database ke camelCase interface
function mapMutasiFromDb(row: any): MutasiPengajuan {
  return {
    id: row.id,
    nik: row.nik,
    nama: row.nama,
    tempatLahir: row.tempat_lahir,
    tanggalLahir: row.tanggal_lahir,
    jenisKelamin: row.jenis_kelamin,
    agama: row.agama,
    keluargaId: row.keluarga_id || null,
    clusterdesaId: row.clusterdesa_id || null,
    jenisMutasi: row.jenis_mutasi,
    keterangan: row.keterangan,
    tipeProses: row.tipe_proses,
    reqMethod: row.req_method || row.tipe_proses || "OFFLINE",
    status: row.status,
    feedbackSekdes: row.feedback_sekdes,
    tahunPeriode: row.tahun_periode,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    parent: row.parent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMutasiLogFromDb(row: any): MutasiLog {
  return {
    id: row.id,
    mutasiId: row.mutasi_id,
    actorId: row.actor_id,
    actorRole: row.actor_role,
    action: row.action,
    statusAwal: row.status_awal,
    statusBaru: row.status_baru,
    catatan: row.catatan,
    createdAt: row.created_at,
  };
}

// 1. Dapatkan daftar pengajuan mutasi
export async function getMutasiList(
  tahun?: string,
  createdByUserId?: string | null
): Promise<MutasiPengajuan[]> {
  const supabase = createClient();
  let query = supabase
    .from("tweb_mutasi_pengajuan")
    .select("*")
    .order("created_at", { ascending: false });

  if (tahun) {
    query = query.eq("tahun_periode", tahun);
  }

  if (createdByUserId) {
    query = query.eq("created_by", createdByUserId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapMutasiFromDb);
}


// 2. Dapatkan detail pengajuan mutasi berdasarkan ID
export async function getMutasiById(id: string): Promise<MutasiPengajuan | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapMutasiFromDb(data);
}

// 3. Submit Pengajuan Mutasi Baru (Bisa OFFLINE via RT atau ONLINE mandiri)
export async function submitMutasi(
  payload: MutasiSubmitPayload,
  actorId: string,
  actorRole: ActorRole
): Promise<MutasiPengajuan> {
  const supabase = createClient();
  const mutasiId = crypto.randomUUID();
  const logId = crypto.randomUUID();
  const statusAwal = "PENDING";
  const actionType = payload.tipeProses === "OFFLINE" ? "SUBMIT_OFFLINE" : "SUBMIT_ONLINE";
  const isDetailMutasi = payload.jenisMutasi === "Warga Baru" || payload.jenisMutasi === "Koreksi Data";

  // A. Insert ke tabel pengajuan mutasi
  const dbPayload = {
    id: mutasiId,
    nik: payload.nik,
    nama: isDetailMutasi ? payload.nama : null,
    tempat_lahir: isDetailMutasi ? payload.tempatLahir : null,
    tanggal_lahir: isDetailMutasi ? payload.tanggalLahir : null,
    jenis_kelamin: isDetailMutasi ? payload.jenisKelamin : null,
    agama: isDetailMutasi ? payload.agama : null,
    keluarga_id: isDetailMutasi ? payload.keluargaId || null : null,
    clusterdesa_id: isDetailMutasi ? payload.clusterdesaId || null : null,
    jenis_mutasi: payload.jenisMutasi,
    keterangan: payload.keterangan,
    tipe_proses: payload.tipeProses,
    req_method: payload.reqMethod,
    status: statusAwal,
    tahun_periode: payload.tahunPeriode,
    created_by: payload.createdBy || actorId,
    parent: payload.parent || null,
  };

  const { data, error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;

  // B. Catat Audit Log Tracking
  const { error: logError } = await supabase.from("tweb_mutasi_logs").insert({
    id: logId,
    mutasi_id: mutasiId,
    actor_id: actorId,
    actor_role: actorRole,
    action: actionType,
    status_awal: null,
    status_baru: statusAwal,
    catatan: payload.tipeProses === "OFFLINE" 
      ? "Pengajuan mutasi diinput oleh RT secara offline" 
      : "Pengajuan mutasi dikirim oleh warga via online",
  });

  if (logError) console.error("Gagal mencatat log mutasi:", logError);

  return mapMutasiFromDb(data);
}

// 4. Verifikasi Sekdes (Approve / Reject) + Otomatis Insert ke tweb_penduduk jika disetujui
export async function verifyMutasiSekdes(
  id: string,
  isApproved: boolean,
  feedback: string | undefined,
  sekdesId: string
): Promise<MutasiPengajuan> {
  const supabase = createClient();

  // A. Ambil data pengajuan saat ini
  const currentMutasi = await getMutasiById(id);
  if (!currentMutasi) throw new Error("Data pengajuan mutasi tidak ditemukan.");

  const statusAwal = currentMutasi.status;
  const statusBaru = isApproved ? "APPROVED" : "REJECTED";
  const actionType = isApproved ? "APPROVE" : "REJECT";

  // B. Update status pengajuan di tweb_mutasi_pengajuan
  const { data, error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .update({
      status: statusBaru,
      feedback_sekdes: feedback || null,
      approved_by: sekdesId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // C. Jika APPROVED -> Update / Insert data ke tweb_penduduk (Goal Mutasi)
  if (isApproved) {
    // Pastikan mengambil data mutasi pengajuan paling TERAKHIR berdasarkan NIK (mengakomodasi sistem pengajuan ulang / resubmit)
    const { data: latestRow } = await supabase
      .from("tweb_mutasi_pengajuan")
      .select("*")
      .eq("nik", currentMutasi.nik)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const targetMutasi = latestRow ? mapMutasiFromDb(latestRow) : currentMutasi;

    if (targetMutasi.jenisMutasi === "Warga Baru") {
      const { error: pendudukError } = await supabase.from("tweb_penduduk").insert({
        id: crypto.randomUUID(),
        nik: targetMutasi.nik,
        nama: targetMutasi.nama,
        tempat_lahir: targetMutasi.tempatLahir,
        tanggal_lahir: targetMutasi.tanggalLahir,
        jenis_kelamin: targetMutasi.jenisKelamin,
        agama: targetMutasi.agama || "Islam",
        status_penduduk: "Tetap",
        status_verifikasi_dukcapil: "Terverifikasi",
        keluarga_id: targetMutasi.keluargaId,
        clusterdesa_id: targetMutasi.clusterdesaId,
      });

      if (pendudukError) {
        console.error("Gagal menambahkan warga baru ke tweb_penduduk:", pendudukError);
      }
    } else if (targetMutasi.jenisMutasi === "Non-Aktif") {
      // Jika keterangan mengandung "Meninggal", status_penduduk diset ke "Meninggal". Otherwise "Pindah".
      const isMeninggal = (targetMutasi.keterangan || "").toLowerCase().includes("meninggal");
      const statusPendudukBaru = isMeninggal ? "Meninggal" : "Pindah";

      const { error: updateNonAktifErr } = await supabase
        .from("tweb_penduduk")
        .update({ status_penduduk: statusPendudukBaru })
        .eq("nik", targetMutasi.nik);

      if (updateNonAktifErr) {
        console.error("Gagal mengupdate status penduduk non-aktif/meninggal:", updateNonAktifErr);
      }
    } else if (targetMutasi.jenisMutasi === "Koreksi Data") {
      // Update data di tweb_penduduk berdasarkan data mutasi pengajuan paling terakhir
      const updateFields: Record<string, any> = {};

      if (targetMutasi.nama) updateFields.nama = targetMutasi.nama;
      if (targetMutasi.tempatLahir) updateFields.tempat_lahir = targetMutasi.tempatLahir;
      if (targetMutasi.tanggalLahir) updateFields.tanggal_lahir = targetMutasi.tanggalLahir;
      if (targetMutasi.jenisKelamin) updateFields.jenis_kelamin = targetMutasi.jenisKelamin;
      if (targetMutasi.agama) updateFields.agama = targetMutasi.agama;
      if (targetMutasi.keluargaId) updateFields.keluarga_id = targetMutasi.keluargaId;
      if (targetMutasi.clusterdesaId) updateFields.clusterdesa_id = targetMutasi.clusterdesaId;

      if (Object.keys(updateFields).length > 0) {
        const { error: updateKoreksiErr } = await supabase
          .from("tweb_penduduk")
          .update(updateFields)
          .eq("nik", targetMutasi.nik);

        if (updateKoreksiErr) {
          console.error("Gagal mengupdate koreksi data di tweb_penduduk:", updateKoreksiErr);
        }
      }
    }
  }

  // D. Catat Audit Log
  await supabase.from("tweb_mutasi_logs").insert({
    id: crypto.randomUUID(),
    mutasi_id: id,
    actor_id: sekdesId,
    actor_role: "SEKDES",
    action: actionType,
    status_awal: statusAwal,
    status_baru: statusBaru,
    catatan: feedback || (isApproved ? "Pengajuan disetujui Sekdes" : "Pengajuan ditolak Sekdes"),
  });

  return mapMutasiFromDb(data);
}

// 5. Pengajuan Ulang (Re-submit) setelah ditolak oleh Sekdes
export async function resubmitMutasi(
  id: string,
  payload: MutasiResubmitPayload,
  actorId: string,
  actorRole: ActorRole
): Promise<MutasiPengajuan> {
  const supabase = createClient();

  const currentMutasi = await getMutasiById(id);
  if (!currentMutasi) throw new Error("Data mutasi tidak ditemukan");

  const mutasiBaruId = crypto.randomUUID();
  const dbPayload = {
    id: mutasiBaruId,
    nik: payload.nik || currentMutasi.nik,
    nama: payload.nama ?? currentMutasi.nama ?? null,
    tempat_lahir: payload.tempatLahir ?? currentMutasi.tempatLahir ?? null,
    tanggal_lahir: payload.tanggalLahir ?? currentMutasi.tanggalLahir ?? null,
    jenis_kelamin: payload.jenisKelamin ?? currentMutasi.jenisKelamin ?? null,
    agama: payload.agama ?? currentMutasi.agama ?? null,
    keluarga_id: payload.keluargaId ?? currentMutasi.keluargaId ?? null,
    clusterdesa_id: payload.clusterdesaId ?? currentMutasi.clusterdesaId ?? null,
    jenis_mutasi: currentMutasi.jenisMutasi,
    keterangan: payload.keterangan ?? currentMutasi.keterangan ?? null,
    tipe_proses: payload.tipeProses || currentMutasi.tipeProses,
    req_method: payload.reqMethod || currentMutasi.reqMethod || currentMutasi.tipeProses,
    status: "PENDING",
    feedback_sekdes: null,
    tahun_periode: currentMutasi.tahunPeriode,
    created_by: actorId,
    approved_by: null,
    parent: currentMutasi.id,
  };

  const { data, error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .insert(dbPayload)
    .select()
    .single();

  if (error) throw error;

  // Catat Log Pengajuan Ulang sebagai record baru yang menunjuk ke parent lama
  await supabase.from("tweb_mutasi_logs").insert({
    id: crypto.randomUUID(),
    mutasi_id: mutasiBaruId,
    actor_id: actorId,
    actor_role: actorRole,
    action: "RESUBMIT",
    status_awal: currentMutasi.status,
    status_baru: "PENDING",
    catatan: "Pengaju melakukan revisi data dan membuat pengajuan baru",
  });

  return mapMutasiFromDb(data);
}

// 6. Dapatkan Log Tracking History Pengajuan Mutasi
export async function getMutasiLogs(mutasiId: string): Promise<MutasiLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tweb_mutasi_logs")
    .select("*")
    .eq("mutasi_id", mutasiId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapMutasiLogFromDb);
}

// 7. Hapus / Batalkan Pengajuan Mutasi
export async function deleteMutasi(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

