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
    keluargaId: row.keluarga_id,
    clusterdesaId: row.clusterdesa_id,
    jenisMutasi: row.jenis_mutasi,
    keterangan: row.keterangan,
    tipeProses: row.tipe_proses,
    reqMethod: row.req_method || row.tipe_proses || "OFFLINE",
    status: row.status,
    feedbackSekdes: row.feedback_sekdes,
    tahunPeriode: row.tahun_periode,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
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
export async function getMutasiList(tahun?: string): Promise<MutasiPengajuan[]> {
  const supabase = createClient();
  let query = supabase
    .from("tweb_mutasi_pengajuan")
    .select("*")
    .order("created_at", { ascending: false });

  if (tahun) {
    query = query.eq("tahun_periode", tahun);
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

  // A. Insert ke tabel pengajuan mutasi
  const dbPayload = {
    id: mutasiId,
    nik: payload.nik,
    nama: payload.nama,
    tempat_lahir: payload.tempatLahir,
    tanggal_lahir: payload.tanggalLahir,
    jenis_kelamin: payload.jenisKelamin,
    agama: payload.agama,
    // keluarga_id: payload.keluargaId,
    // clusterdesa_id: payload.clusterdesaId,
    jenis_mutasi: payload.jenisMutasi,
    keterangan: payload.keterangan || null,
    tipe_proses: payload.tipeProses,
    req_method: payload.reqMethod || payload.tipeProses || "OFFLINE",
    status: statusAwal,
    tahun_periode: payload.tahunPeriode || "2026",
    created_by: actorId,
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

  // C. Jika APPROVED -> Tambahkan data warga baru ke tweb_penduduk (Goal Mutasi)
  if (isApproved) {
    if (currentMutasi.jenisMutasi === "Warga Baru") {
      const { error: pendudukError } = await supabase.from("tweb_penduduk").insert({
        id: crypto.randomUUID(),
        nik: currentMutasi.nik,
        nama: currentMutasi.nama,
        tempat_lahir: currentMutasi.tempatLahir,
        tanggal_lahir: currentMutasi.tanggalLahir,
        jenis_kelamin: currentMutasi.jenisKelamin,
        agama: currentMutasi.agama,
        status_penduduk: "Tetap",
        status_verifikasi_dukcapil: "Terverifikasi",
        keluarga_id: currentMutasi.keluargaId,
        clusterdesa_id: currentMutasi.clusterdesaId,
      });

      if (pendudukError) {
        console.error("Gagal menambahkan warga baru ke tweb_penduduk:", pendudukError);
      }
    } else if (currentMutasi.jenisMutasi === "Non-Aktif") {
      // Update status_penduduk di tweb_penduduk menjadi Non-Aktif/Pindah/Meninggal
      await supabase
        .from("tweb_penduduk")
        .update({ status_penduduk: "Pindah" })
        .eq("nik", currentMutasi.nik);
    } else if (currentMutasi.jenisMutasi === "Koreksi Data") {
      // Update data di tweb_penduduk sesuai data revisi mutasi
      await supabase
        .from("tweb_penduduk")
        .update({
          nama: currentMutasi.nama,
          tempat_lahir: currentMutasi.tempatLahir,
          tanggal_lahir: currentMutasi.tanggalLahir,
          jenis_kelamin: currentMutasi.jenisKelamin,
          agama: currentMutasi.agama,
        })
        .eq("nik", currentMutasi.nik);
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

  const updateFields: any = {
    status: "RESUBMITTED",
    updated_at: new Date().toISOString(),
  };

  if (payload.nik) updateFields.nik = payload.nik;
  if (payload.nama) updateFields.nama = payload.nama;
  if (payload.tempatLahir) updateFields.tempat_lahir = payload.tempatLahir;
  if (payload.tanggalLahir) updateFields.tanggal_lahir = payload.tanggalLahir;
  if (payload.jenisKelamin) updateFields.jenis_kelamin = payload.jenisKelamin;
  if (payload.agama) updateFields.agama = payload.agama;
  if (payload.keterangan !== undefined) updateFields.keterangan = payload.keterangan;
  if (payload.tipeProses) updateFields.tipe_proses = payload.tipeProses;
  if (payload.reqMethod) updateFields.req_method = payload.reqMethod;

  const { data, error } = await supabase
    .from("tweb_mutasi_pengajuan")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Catat Log Pengajuan Ulang
  await supabase.from("tweb_mutasi_logs").insert({
    id: crypto.randomUUID(),
    mutasi_id: id,
    actor_id: actorId,
    actor_role: actorRole,
    action: "RESUBMIT",
    status_awal: currentMutasi.status,
    status_baru: "RESUBMITTED",
    catatan: "Pengaju melakukan revisi data dan mengajukan ulang",
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
